Param(
    [string]$ProductWorktree = ".product/Worktrees/wt_main",
    [string]$OutputRoot = ".product/build_target/Current",
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

$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDirectory "..\..")
$worktreeAbs = Join-Path $repoRoot $ProductWorktree
$outputRootAbs = Join-Path $repoRoot $OutputRoot
$logsDirAbs = Join-Path $repoRoot ".product/build_target/logs"
$tauriConfigPath = Join-Path $worktreeAbs "src-tauri/tauri.conf.json"
$packageJsonPath = Join-Path $worktreeAbs "package.json"

if (-not (Test-Path $worktreeAbs -PathType Container)) {
    throw "Product worktree not found: $worktreeAbs"
}

if (-not $SkipPreflight) {
    & (Join-Path $scriptDirectory "governance_preflight.ps1")
    if ($LASTEXITCODE -ne 0) {
        throw "governance_preflight.ps1 failed."
    }
}

if (-not (Test-Path $logsDirAbs -PathType Container)) {
    New-Item -Path $logsDirAbs -ItemType Directory -Force | Out-Null
}
if (-not (Test-Path $outputRootAbs -PathType Container)) {
    New-Item -Path $outputRootAbs -ItemType Directory -Force | Out-Null
}

$currentVersion = Get-SemVerFromJsonFile -Path $tauriConfigPath
$nextVersion = Get-NextPatchVersion -Version $currentVersion

$stamp = Get-Date -Format "yyyyMMdd_HHmmss"
$logPath = Join-Path $logsDirAbs "installer_build_$stamp.log"
$tempConfigPath = Join-Path $env:TEMP "stratatlas_tauri_version_override_$stamp.json"
[System.IO.File]::WriteAllText(
    $tempConfigPath,
    "{`n  `"version`": `"$nextVersion`"`n}",
    [System.Text.UTF8Encoding]::new($false)
)

Push-Location $worktreeAbs
try {
    $previousErrorActionPreference = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    $buildOutput = & pnpm tauri build --bundles "msi,nsis" --config $tempConfigPath 2>&1
    $ErrorActionPreference = $previousErrorActionPreference
    $buildOutput | Set-Content -Path $logPath -Encoding UTF8
    if ($LASTEXITCODE -ne 0) {
        throw "pnpm tauri build failed with exit code $LASTEXITCODE. See log: $logPath"
    }
}
catch {
    $ErrorActionPreference = "Stop"
    throw
}
finally {
    Pop-Location
    if (Test-Path $tempConfigPath -PathType Leaf) {
        Remove-Item -Path $tempConfigPath -Force
    }
}

$bundleRoot = Join-Path $worktreeAbs "src-tauri/target/release/bundle"
if (-not (Test-Path $bundleRoot -PathType Container)) {
    throw "Bundle output not found: $bundleRoot"
}

$versionToken = "_${nextVersion}_"
$msiFiles = @(
    Get-ChildItem -Path $bundleRoot -Recurse -Filter *.msi -File |
        Where-Object { $_.Name -like "*$versionToken*" }
)
$exeFiles = @(
    Get-ChildItem -Path $bundleRoot -Recurse -Filter *-setup.exe -File |
        Where-Object { $_.Name -like "*$versionToken*" }
)
if ($msiFiles.Count -eq 0 -and $exeFiles.Count -eq 0) {
    throw "No MSI or NSIS setup artifacts found under $bundleRoot"
}

$kitDir = Join-Path $outputRootAbs "InstallerKit\$stamp"
New-Item -Path $kitDir -ItemType Directory -Force | Out-Null

foreach ($f in $msiFiles + $exeFiles) {
    Copy-Item -Path $f.FullName -Destination (Join-Path $kitDir $f.Name) -Force
}

$maintenanceScript = Join-Path $worktreeAbs "scripts/windows-installer-maintenance.ps1"
$lifecycleDoc = Join-Path $worktreeAbs "docs/INSTALLER_LIFECYCLE.md"
if (Test-Path $maintenanceScript -PathType Leaf) {
    Copy-Item -Path $maintenanceScript -Destination (Join-Path $kitDir "windows-installer-maintenance.ps1") -Force
}
if (Test-Path $lifecycleDoc -PathType Leaf) {
    Copy-Item -Path $lifecycleDoc -Destination (Join-Path $kitDir "INSTALLER_LIFECYCLE.md") -Force
}

$manifestPath = Join-Path $kitDir "INSTALLER_MANIFEST.txt"
$manifestLines = New-Object System.Collections.Generic.List[string]
$manifestLines.Add("StratAtlas Installer Kit") | Out-Null
$manifestLines.Add("Version: $nextVersion") | Out-Null
$manifestLines.Add("Generated UTC: $((Get-Date).ToUniversalTime().ToString('o'))") | Out-Null
$manifestLines.Add("Build Log: $logPath") | Out-Null
$manifestLines.Add("") | Out-Null
$manifestLines.Add("Files (SHA256):") | Out-Null

Get-ChildItem -Path $kitDir -File | ForEach-Object {
    $hash = (Get-FileHash -Algorithm SHA256 -Path $_.FullName).Hash
    $manifestLines.Add("$hash  $($_.Name)") | Out-Null
}
$manifestLines | Set-Content -Path $manifestPath -Encoding UTF8

$latestPointer = Join-Path $outputRootAbs "LATEST_INSTALLER_KIT.txt"
@(
    "InstallerKit/$stamp"
    "Version: $nextVersion"
    "Manifest: InstallerKit/$stamp/INSTALLER_MANIFEST.txt"
    "Log: .product/build_target/logs/installer_build_$stamp.log"
) | Set-Content -Path $latestPointer -Encoding UTF8

Set-SemVerInJsonFile -Path $tauriConfigPath -NewVersion $nextVersion
if (Test-Path $packageJsonPath -PathType Leaf) {
    Set-SemVerInJsonFile -Path $packageJsonPath -NewVersion $nextVersion
}

Write-Host "Installer build completed."
Write-Host "Version: $currentVersion -> $nextVersion"
Write-Host "Kit: $kitDir"
Write-Host "Manifest: $manifestPath"
Write-Host "Log: $logPath"

exit 0
