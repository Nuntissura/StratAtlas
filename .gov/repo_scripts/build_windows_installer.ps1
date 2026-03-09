Param(
    [string]$ProductWorktree = ".product/Worktrees/wt_main",
    [string]$OutputRoot = ".product/build_target/Releases",
    [switch]$SkipPreflight
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
if ($PSVersionTable.PSVersion.Major -ge 7) {
    $PSNativeCommandUseErrorActionPreference = $false
}

function Get-SemVerFromJsonFile {
    Param([Parameter(Mandatory = $true)][string]$Path)

    if (-not (Test-Path $Path -PathType Leaf)) {
        throw "Version source file not found: $Path"
    }

    $raw = [System.IO.File]::ReadAllText($Path)
    $match = [regex]::Match($raw, '"version"\s*:\s*"(\d+\.\d+\.\d+)"')
    if (-not $match.Success) {
        throw "Could not find semver version in: $Path"
    }

    return $match.Groups[1].Value
}

function Get-SemVerFromTomlFile {
    Param([Parameter(Mandatory = $true)][string]$Path)

    if (-not (Test-Path $Path -PathType Leaf)) {
        throw "Version source file not found: $Path"
    }

    $raw = [System.IO.File]::ReadAllText($Path)
    $match = [regex]::Match($raw, '(?ms)\[package\].*?^version\s*=\s*"(\d+\.\d+\.\d+)"')
    if (-not $match.Success) {
        throw "Could not find package semver version in: $Path"
    }

    return $match.Groups[1].Value
}

function Get-NextPatchVersion {
    Param([Parameter(Mandatory = $true)][string]$Version)

    $parts = $Version.Split(".")
    if ($parts.Count -ne 3) {
        throw "Version is not semver major.minor.patch: $Version"
    }

    $major = [int]$parts[0]
    $minor = [int]$parts[1]
    $patch = [int]$parts[2]
    return "$major.$minor.$($patch + 1)"
}

function Set-SemVerInJsonFile {
    Param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][string]$NewVersion
    )

    $raw = [System.IO.File]::ReadAllText($Path)
    $updated = [regex]::Replace(
        $raw,
        '("version"\s*:\s*")(\d+\.\d+\.\d+)(")',
        { param($m) $m.Groups[1].Value + $NewVersion + $m.Groups[3].Value },
        1
    )
    if ($updated -eq $raw) {
        throw "No version field was updated in: $Path"
    }

    [System.IO.File]::WriteAllText($Path, $updated, [System.Text.UTF8Encoding]::new($false))
}

function Set-SemVerInTomlFile {
    Param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][string]$NewVersion
    )

    $raw = [System.IO.File]::ReadAllText($Path)
    $updated = [regex]::Replace(
        $raw,
        '(?ms)(\[package\].*?^version\s*=\s*")(\d+\.\d+\.\d+)(")',
        { param($m) $m.Groups[1].Value + $NewVersion + $m.Groups[3].Value },
        1
    )
    if ($updated -eq $raw) {
        throw "No package version field was updated in: $Path"
    }

    [System.IO.File]::WriteAllText($Path, $updated, [System.Text.UTF8Encoding]::new($false))
}

function Ensure-Directory {
    Param([Parameter(Mandatory = $true)][string]$Path)

    if (-not (Test-Path $Path -PathType Container)) {
        New-Item -Path $Path -ItemType Directory -Force | Out-Null
    }
}

function Clear-DirectoryPreservingGitKeep {
    Param([Parameter(Mandatory = $true)][string]$Path)

    Ensure-Directory -Path $Path
    Get-ChildItem -Path $Path -Force | Where-Object { $_.Name -ne ".gitkeep" } | ForEach-Object {
        Remove-Item -Path $_.FullName -Recurse -Force
    }
}

function Get-NonPlaceholderChildren {
    Param([Parameter(Mandatory = $true)][string]$Path)

    if (-not (Test-Path $Path -PathType Container)) {
        return @()
    }

    return @(
        Get-ChildItem -Path $Path -Force |
            Where-Object { $_.Name -ne ".gitkeep" }
    )
}

function Move-DirectoryContents {
    Param(
        [Parameter(Mandatory = $true)][string]$Source,
        [Parameter(Mandatory = $true)][string]$Destination
    )

    Ensure-Directory -Path $Destination
    foreach ($item in @(Get-NonPlaceholderChildren -Path $Source)) {
        Move-Item -Path $item.FullName -Destination (Join-Path $Destination $item.Name) -Force
    }
}

function Archive-CurrentRelease {
    Param(
        [Parameter(Mandatory = $true)][string]$CurrentRoot,
        [Parameter(Mandatory = $true)][string]$ArchiveRoot,
        [Parameter(Mandatory = $true)][string]$CurrentVersion
    )

    $installersCurrent = Join-Path $CurrentRoot "Installers"
    $portableCurrent = Join-Path $CurrentRoot "Portable"
    $kitCurrent = Join-Path $CurrentRoot "InstallerKit"
    $pointerFiles = @(
        (Join-Path $CurrentRoot "LATEST_RELEASE.txt"),
        (Join-Path $CurrentRoot "LATEST_INSTALLER_KIT.txt")
    )

    $hasCurrentArtifacts = (
        (@(Get-NonPlaceholderChildren -Path $installersCurrent).Count -gt 0) -or
        (@(Get-NonPlaceholderChildren -Path $portableCurrent).Count -gt 0) -or
        (@(Get-NonPlaceholderChildren -Path $kitCurrent).Count -gt 0) -or
        (@($pointerFiles | Where-Object { Test-Path $_ -PathType Leaf }).Count -gt 0)
    )

    if (-not $hasCurrentArtifacts) {
        return $null
    }

    $archiveVersionRoot = Join-Path $ArchiveRoot $CurrentVersion
    $archiveInstallers = Join-Path $archiveVersionRoot "Installers"
    $archivePortable = Join-Path $archiveVersionRoot "Portable"
    $archiveKits = Join-Path $archiveVersionRoot "InstallerKit"
    Ensure-Directory -Path $archiveVersionRoot
    Move-DirectoryContents -Source $installersCurrent -Destination $archiveInstallers
    Move-DirectoryContents -Source $portableCurrent -Destination $archivePortable
    Move-DirectoryContents -Source $kitCurrent -Destination $archiveKits

    foreach ($pointer in $pointerFiles) {
        if (Test-Path $pointer -PathType Leaf) {
            Move-Item -Path $pointer -Destination (Join-Path $archiveVersionRoot (Split-Path $pointer -Leaf)) -Force
        }
    }

    return $archiveVersionRoot
}

function Archive-LegacyCurrentRelease {
    Param(
        [Parameter(Mandatory = $true)][string]$LegacyCurrentRoot,
        [Parameter(Mandatory = $true)][string]$ArchiveRoot,
        [Parameter(Mandatory = $true)][string]$CurrentVersion
    )

    $legacyChildren = @(Get-NonPlaceholderChildren -Path $LegacyCurrentRoot)
    if ($legacyChildren.Count -eq 0) {
        return $null
    }

    $legacyArchiveRoot = Join-Path (Join-Path $ArchiveRoot $CurrentVersion) "LegacyCurrent"
    Ensure-Directory -Path $legacyArchiveRoot
    foreach ($item in $legacyChildren) {
        Move-Item -Path $item.FullName -Destination (Join-Path $legacyArchiveRoot $item.Name) -Force
    }
    return $legacyArchiveRoot
}

function Get-PortableExecutablePath {
    Param([Parameter(Mandatory = $true)][string]$ReleaseDirectory)

    $preferred = Join-Path $ReleaseDirectory "stratatlas_app.exe"
    if (Test-Path $preferred -PathType Leaf) {
        return $preferred
    }

    $fallback = @(
        Get-ChildItem -Path $ReleaseDirectory -Filter *.exe -File |
            Where-Object { $_.Name -notlike "*-setup.exe" }
    )
    if ($fallback.Count -eq 0) {
        throw "Portable executable not found under: $ReleaseDirectory"
    }

    return $fallback[0].FullName
}

function Copy-SupportFile {
    Param(
        [Parameter(Mandatory = $true)][string]$Source,
        [Parameter(Mandatory = $true)][string[]]$DestinationDirectories,
        [string]$TargetName = ""
    )

    if (-not (Test-Path $Source -PathType Leaf)) {
        return
    }

    $fileName = if ([string]::IsNullOrWhiteSpace($TargetName)) { Split-Path $Source -Leaf } else { $TargetName }
    foreach ($destinationDirectory in $DestinationDirectories) {
        Ensure-Directory -Path $destinationDirectory
        Copy-Item -Path $Source -Destination (Join-Path $destinationDirectory $fileName) -Force
    }
}

$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDirectory "..\..")
$worktreeAbs = Join-Path $repoRoot $ProductWorktree
$releaseRootAbs = Join-Path $repoRoot $OutputRoot
$currentRootAbs = Join-Path $releaseRootAbs "Current"
$archiveRootAbs = Join-Path $releaseRootAbs "Archive"
$legacyCurrentRootAbs = Join-Path $repoRoot ".product/build_target/Current"
$currentInstallersAbs = Join-Path $currentRootAbs "Installers"
$currentPortableAbs = Join-Path $currentRootAbs "Portable"
$currentInstallerKitAbs = Join-Path $currentRootAbs "InstallerKit"
$logsDirAbs = Join-Path $repoRoot ".product/build_target/logs"
$tauriConfigPath = Join-Path $worktreeAbs "src-tauri/tauri.conf.json"
$packageJsonPath = Join-Path $worktreeAbs "package.json"
$cargoTomlPath = Join-Path $worktreeAbs "src-tauri/Cargo.toml"

if (-not (Test-Path $worktreeAbs -PathType Container)) {
    throw "Product worktree not found: $worktreeAbs"
}

if (-not $SkipPreflight) {
    & (Join-Path $scriptDirectory "governance_preflight.ps1")
    if ($LASTEXITCODE -ne 0) {
        throw "governance_preflight.ps1 failed."
    }
}

Ensure-Directory -Path $logsDirAbs
Ensure-Directory -Path $releaseRootAbs
Ensure-Directory -Path $currentRootAbs
Ensure-Directory -Path $archiveRootAbs
Ensure-Directory -Path $currentInstallersAbs
Ensure-Directory -Path $currentPortableAbs
Ensure-Directory -Path $currentInstallerKitAbs

$currentTauriVersion = Get-SemVerFromJsonFile -Path $tauriConfigPath
$currentPackageVersion = Get-SemVerFromJsonFile -Path $packageJsonPath
$currentCargoVersion = Get-SemVerFromTomlFile -Path $cargoTomlPath
$distinctVersions = @(@($currentTauriVersion, $currentPackageVersion, $currentCargoVersion) | Sort-Object -Unique)
if ($distinctVersions.Length -ne 1) {
    $joined = ($distinctVersions -join ", ")
    throw "Release surface version mismatch. Align package.json, src-tauri/tauri.conf.json, and src-tauri/Cargo.toml before building. Found: $joined"
}

$currentVersion = $distinctVersions[0]
$nextVersion = Get-NextPatchVersion -Version $currentVersion
$governedChangelogPath = Join-Path $repoRoot ".gov/workflow/changelog/v$nextVersion.md"
if (-not (Test-Path $governedChangelogPath -PathType Leaf)) {
    throw "Missing governed changelog entry for next version ${nextVersion}: $governedChangelogPath"
}

$stamp = Get-Date -Format "yyyyMMdd_HHmmss"
$logPath = Join-Path $logsDirAbs "installer_build_$stamp.log"
$originalTauriConfig = [System.IO.File]::ReadAllText($tauriConfigPath)
$originalPackageJson = [System.IO.File]::ReadAllText($packageJsonPath)
$originalCargoToml = [System.IO.File]::ReadAllText($cargoTomlPath)
$buildSucceeded = $false

Push-Location $worktreeAbs
try {
    Set-SemVerInJsonFile -Path $tauriConfigPath -NewVersion $nextVersion
    Set-SemVerInJsonFile -Path $packageJsonPath -NewVersion $nextVersion
    Set-SemVerInTomlFile -Path $cargoTomlPath -NewVersion $nextVersion

    $previousErrorActionPreference = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    $buildOutput = & pnpm tauri build --bundles "msi,nsis" 2>&1
    $ErrorActionPreference = $previousErrorActionPreference
    $buildOutput | Set-Content -Path $logPath -Encoding UTF8
    if ($LASTEXITCODE -ne 0) {
        throw "pnpm tauri build failed with exit code $LASTEXITCODE. See log: $logPath"
    }
    $buildSucceeded = $true
}
catch {
    $ErrorActionPreference = "Stop"
    [System.IO.File]::WriteAllText($tauriConfigPath, $originalTauriConfig, [System.Text.UTF8Encoding]::new($false))
    [System.IO.File]::WriteAllText($packageJsonPath, $originalPackageJson, [System.Text.UTF8Encoding]::new($false))
    [System.IO.File]::WriteAllText($cargoTomlPath, $originalCargoToml, [System.Text.UTF8Encoding]::new($false))
    throw
}
finally {
    Pop-Location
    if (-not $buildSucceeded) {
        [System.IO.File]::WriteAllText($tauriConfigPath, $originalTauriConfig, [System.Text.UTF8Encoding]::new($false))
        [System.IO.File]::WriteAllText($packageJsonPath, $originalPackageJson, [System.Text.UTF8Encoding]::new($false))
        [System.IO.File]::WriteAllText($cargoTomlPath, $originalCargoToml, [System.Text.UTF8Encoding]::new($false))
    }
}

$bundleRoot = Join-Path $worktreeAbs "src-tauri/target/release/bundle"
$releaseExeRoot = Join-Path $worktreeAbs "src-tauri/target/release"
if (-not (Test-Path $bundleRoot -PathType Container)) {
    throw "Bundle output not found: $bundleRoot"
}

$versionToken = "_${nextVersion}_"
$msiFiles = @(
    Get-ChildItem -Path $bundleRoot -Recurse -Filter *.msi -File |
        Where-Object { $_.Name -like "*$versionToken*" }
)
$setupExeFiles = @(
    Get-ChildItem -Path $bundleRoot -Recurse -Filter *-setup.exe -File |
        Where-Object { $_.Name -like "*$versionToken*" }
)
if ($msiFiles.Count -eq 0 -and $setupExeFiles.Count -eq 0) {
    throw "No MSI or NSIS setup artifacts found under $bundleRoot"
}

$portableSourcePath = Get-PortableExecutablePath -ReleaseDirectory $releaseExeRoot
$portableTargetName = "StratAtlas_${nextVersion}_portable_x64.exe"

$legacyArchiveRoot = Archive-LegacyCurrentRelease -LegacyCurrentRoot $legacyCurrentRootAbs -ArchiveRoot $archiveRootAbs -CurrentVersion $currentVersion
$archivedReleaseRoot = Archive-CurrentRelease -CurrentRoot $currentRootAbs -ArchiveRoot $archiveRootAbs -CurrentVersion $currentVersion
Clear-DirectoryPreservingGitKeep -Path $currentInstallersAbs
Clear-DirectoryPreservingGitKeep -Path $currentPortableAbs
Clear-DirectoryPreservingGitKeep -Path $currentInstallerKitAbs

$kitDir = Join-Path $currentInstallerKitAbs $stamp
Ensure-Directory -Path $kitDir

foreach ($f in $msiFiles + $setupExeFiles) {
    Copy-Item -Path $f.FullName -Destination (Join-Path $currentInstallersAbs $f.Name) -Force
    Copy-Item -Path $f.FullName -Destination (Join-Path $kitDir $f.Name) -Force
}

Copy-Item -Path $portableSourcePath -Destination (Join-Path $currentPortableAbs $portableTargetName) -Force
Copy-Item -Path $portableSourcePath -Destination (Join-Path $kitDir $portableTargetName) -Force

$maintenanceScript = Join-Path $worktreeAbs "scripts/windows-installer-maintenance.ps1"
$lifecycleDoc = Join-Path $worktreeAbs "docs/INSTALLER_LIFECYCLE.md"
Copy-SupportFile -Source $maintenanceScript -DestinationDirectories @($currentInstallersAbs, $kitDir)
Copy-SupportFile -Source $lifecycleDoc -DestinationDirectories @($currentInstallersAbs, $kitDir)
Copy-SupportFile -Source $governedChangelogPath -DestinationDirectories @($currentInstallersAbs, $kitDir) -TargetName "CHANGELOG_CURRENT.md"

$manifestPath = Join-Path $kitDir "INSTALLER_MANIFEST.txt"
$manifestLines = New-Object System.Collections.Generic.List[string]
$manifestLines.Add("StratAtlas Installer Kit") | Out-Null
$manifestLines.Add("Version: $nextVersion") | Out-Null
$manifestLines.Add("Generated UTC: $((Get-Date).ToUniversalTime().ToString('o'))") | Out-Null
$manifestLines.Add("Build Log: $logPath") | Out-Null
$manifestLines.Add("Governed Changelog: .gov/workflow/changelog/v$nextVersion.md") | Out-Null
if ($null -ne $archivedReleaseRoot) {
    $archiveRel = $archivedReleaseRoot.Substring($repoRoot.Path.Length + 1).Replace("\", "/")
    $manifestLines.Add("Archived Previous Current: $archiveRel") | Out-Null
}
if ($null -ne $legacyArchiveRoot) {
    $legacyRel = $legacyArchiveRoot.Substring($repoRoot.Path.Length + 1).Replace("\", "/")
    $manifestLines.Add("Archived Legacy Current Import: $legacyRel") | Out-Null
}
$manifestLines.Add("") | Out-Null
$manifestLines.Add("Files (SHA256):") | Out-Null

Get-ChildItem -Path $kitDir -File | ForEach-Object {
    $hash = (Get-FileHash -Algorithm SHA256 -Path $_.FullName).Hash
    $manifestLines.Add("$hash  $($_.Name)") | Out-Null
}
$manifestLines | Set-Content -Path $manifestPath -Encoding UTF8

$latestLines = @(
    "Version: $nextVersion",
    "Installers: .product/build_target/Releases/Current/Installers/",
    "Portable: .product/build_target/Releases/Current/Portable/$portableTargetName",
    "Installer Kit: .product/build_target/Releases/Current/InstallerKit/$stamp/",
    "Manifest: .product/build_target/Releases/Current/InstallerKit/$stamp/INSTALLER_MANIFEST.txt",
    "Governed Changelog: .gov/workflow/changelog/v$nextVersion.md",
    "Build Log: .product/build_target/logs/installer_build_$stamp.log"
)
if ($null -ne $archivedReleaseRoot) {
    $latestLines += "Archived Previous Current: $($archivedReleaseRoot.Substring($repoRoot.Path.Length + 1).Replace('\', '/'))"
}
if ($null -ne $legacyArchiveRoot) {
    $latestLines += "Archived Legacy Current Import: $($legacyArchiveRoot.Substring($repoRoot.Path.Length + 1).Replace('\', '/'))"
}

$latestReleasePointer = Join-Path $currentRootAbs "LATEST_RELEASE.txt"
$latestLines | Set-Content -Path $latestReleasePointer -Encoding UTF8

$latestInstallerKitPointer = Join-Path $currentRootAbs "LATEST_INSTALLER_KIT.txt"
$latestLines | Set-Content -Path $latestInstallerKitPointer -Encoding UTF8

Write-Host "Installer build completed."
Write-Host "Version: $currentVersion -> $nextVersion"
Write-Host "Installers: $currentInstallersAbs"
Write-Host "Portable: $(Join-Path $currentPortableAbs $portableTargetName)"
Write-Host "Kit: $kitDir"
Write-Host "Manifest: $manifestPath"
Write-Host "Changelog: $governedChangelogPath"
Write-Host "Log: $logPath"

exit 0
