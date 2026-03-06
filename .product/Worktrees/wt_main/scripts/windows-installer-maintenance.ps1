Param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("status", "uninstall", "repair", "full-repair", "update", "downgrade")]
    [string]$Action,

    [string]$MsiPath = "",
    [switch]$Silent,
    [switch]$DropUserData
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$ProductDisplayName = "StratAtlas"
$Identifier = "com.stratatlas.desktop"
$KnownDataDirs = @(
    (Join-Path $env:APPDATA $ProductDisplayName),
    (Join-Path $env:APPDATA $Identifier),
    (Join-Path $env:LOCALAPPDATA $ProductDisplayName),
    (Join-Path $env:LOCALAPPDATA $Identifier)
)

function Get-RegistryValueOrNull {
    Param(
        [Parameter(Mandatory = $true)][object]$Object,
        [Parameter(Mandatory = $true)][string]$Name
    )

    $property = $Object.PSObject.Properties[$Name]
    if ($null -eq $property) {
        return $null
    }
    return $property.Value
}

function Get-InstalledProduct {
    $roots = @(
        "HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall",
        "HKLM:\Software\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall",
        "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall"
    )

    $matches = New-Object System.Collections.Generic.List[object]
    foreach ($root in $roots) {
        if (-not (Test-Path $root -PathType Container)) {
            continue
        }

        $entries = @(Get-ChildItem -Path $root -ErrorAction SilentlyContinue)
        foreach ($entry in $entries) {
            if ($null -eq $entry) {
                continue
            }

            $props = Get-ItemProperty -Path $entry.PSPath -ErrorAction SilentlyContinue
            if ($null -eq $props) {
                continue
            }
            $displayName = [string](Get-RegistryValueOrNull -Object $props -Name "DisplayName")
            if ([string]::IsNullOrWhiteSpace($displayName) -or $displayName -ne $ProductDisplayName) {
                continue
            }

            $uninstallString = [string](Get-RegistryValueOrNull -Object $props -Name "UninstallString")
            $code = ""
            if ($props.PSChildName -match '^\{[A-Fa-f0-9-]+\}$') {
                $code = $props.PSChildName
            } elseif ($uninstallString -match '\{[A-Fa-f0-9-]+\}') {
                $code = [regex]::Match($uninstallString, '\{[A-Fa-f0-9-]+\}').Value
            }

            $matches.Add([PSCustomObject]@{
                DisplayName       = $displayName
                DisplayVersion    = [string](Get-RegistryValueOrNull -Object $props -Name "DisplayVersion")
                ProductCode       = $code
                UninstallString   = $uninstallString
                QuietUninstall    = [string](Get-RegistryValueOrNull -Object $props -Name "QuietUninstallString")
                InstallLocation   = [string](Get-RegistryValueOrNull -Object $props -Name "InstallLocation")
                RegistryPath      = $entry.PSPath
            }) | Out-Null
        }
    }

    return @($matches | Select-Object -First 1)
}

function Get-MsiVersion {
    Param([Parameter(Mandatory = $true)][string]$Path)

    if (-not (Test-Path $Path -PathType Leaf)) {
        throw "MSI path not found: $Path"
    }

    $windowsInstaller = New-Object -ComObject WindowsInstaller.Installer
    $db = $windowsInstaller.GetType().InvokeMember(
        "OpenDatabase",
        "InvokeMethod",
        $null,
        $windowsInstaller,
        @($Path, 0)
    )
    $query = "SELECT Value FROM Property WHERE Property='ProductVersion'"
    $view = $db.GetType().InvokeMember("OpenView", "InvokeMethod", $null, $db, ($query))
    $view.GetType().InvokeMember("Execute", "InvokeMethod", $null, $view, $null) | Out-Null
    $record = $view.GetType().InvokeMember("Fetch", "InvokeMethod", $null, $view, $null)
    if ($null -eq $record) {
        throw "Could not read ProductVersion from MSI: $Path"
    }

    $version = $record.GetType().InvokeMember("StringData", "GetProperty", $null, $record, 1)
    return [version]$version
}

function Invoke-MsiExec {
    Param([Parameter(Mandatory = $true)][string[]]$Arguments)

    $args = @("/norestart")
    if ($Silent) {
        $args += @("/qn")
    }
    $args += $Arguments

    Write-Host "msiexec $($args -join ' ')"
    & msiexec.exe @args
    $code = $LASTEXITCODE
    if ($code -ne 0) {
        throw "msiexec failed with exit code $code"
    }
}

function Backup-UserData {
    Param([string]$BackupRoot)

    New-Item -Path $BackupRoot -ItemType Directory -Force | Out-Null
    $backed = New-Object System.Collections.Generic.List[string]
    foreach ($dir in $KnownDataDirs) {
        if (-not (Test-Path $dir -PathType Container)) {
            continue
        }
        $name = Split-Path $dir -Leaf
        $target = Join-Path $BackupRoot $name
        Copy-Item -Path $dir -Destination $target -Recurse -Force
        $backed.Add($dir) | Out-Null
    }
    return @($backed)
}

function Restore-UserData {
    Param([string]$BackupRoot)

    if (-not (Test-Path $BackupRoot -PathType Container)) {
        return
    }

    Get-ChildItem -Path $BackupRoot -Directory | ForEach-Object {
        $source = $_.FullName
        $destinationCandidates = @(
            (Join-Path $env:APPDATA $_.Name),
            (Join-Path $env:LOCALAPPDATA $_.Name)
        )
        $destination = $destinationCandidates[0]
        if (Test-Path $destinationCandidates[0] -PathType Container) {
            $destination = $destinationCandidates[0]
        } elseif (Test-Path $destinationCandidates[1] -PathType Container) {
            $destination = $destinationCandidates[1]
        }
        New-Item -Path $destination -ItemType Directory -Force | Out-Null
        Copy-Item -Path (Join-Path $source "*") -Destination $destination -Recurse -Force
    }
}

function Ensure-UpgradeableDirection {
    Param(
        [Parameter(Mandatory = $true)][version]$InstalledVersion,
        [Parameter(Mandatory = $true)][version]$TargetVersion,
        [Parameter(Mandatory = $true)][string]$Mode
    )

    if ($Mode -eq "update" -and $TargetVersion -le $InstalledVersion) {
        throw "Update requires a newer MSI version. Installed=$InstalledVersion Target=$TargetVersion"
    }
    if ($Mode -eq "downgrade" -and $TargetVersion -ge $InstalledVersion) {
        throw "Downgrade requires an older MSI version. Installed=$InstalledVersion Target=$TargetVersion"
    }
}

$installed = Get-InstalledProduct

switch ($Action) {
    "status" {
        if ($null -eq $installed) {
            Write-Host "Status: not installed"
            exit 0
        }
        Write-Host "Status: installed"
        Write-Host "Version: $($installed.DisplayVersion)"
        Write-Host "ProductCode: $($installed.ProductCode)"
        Write-Host "InstallLocation: $($installed.InstallLocation)"
        exit 0
    }
    "uninstall" {
        if ($null -eq $installed) {
            Write-Host "Nothing to uninstall."
            exit 0
        }
        if ([string]::IsNullOrWhiteSpace($installed.ProductCode)) {
            throw "ProductCode not found for installed product; cannot run clean uninstall."
        }
        Invoke-MsiExec -Arguments @("/x", $installed.ProductCode)
        Write-Host "Uninstall completed."
        exit 0
    }
    "repair" {
        if ($null -eq $installed) {
            throw "Repair requested but product is not installed."
        }
        if ([string]::IsNullOrWhiteSpace($installed.ProductCode)) {
            throw "ProductCode not found for installed product; cannot run repair."
        }
        Invoke-MsiExec -Arguments @("/fa", $installed.ProductCode)
        Write-Host "Repair completed. User data/presets preserved in AppData."
        exit 0
    }
    "full-repair" {
        if ([string]::IsNullOrWhiteSpace($MsiPath)) {
            throw "full-repair requires -MsiPath to reinstall from a known package."
        }
        $resolvedMsi = (Resolve-Path $MsiPath).Path
        $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
        $backupRoot = Join-Path $env:TEMP "StratAtlasMaintenance\\$timestamp\\backup"
        $backupDirs = @()
        if (-not $DropUserData) {
            $backupDirs = Backup-UserData -BackupRoot $backupRoot
        }

        if ($null -ne $installed -and -not [string]::IsNullOrWhiteSpace($installed.ProductCode)) {
            Invoke-MsiExec -Arguments @("/x", $installed.ProductCode)
        }
        Invoke-MsiExec -Arguments @("/i", $resolvedMsi)

        if (-not $DropUserData) {
            Restore-UserData -BackupRoot $backupRoot
        }

        Write-Host "Full repair completed."
        if ($DropUserData) {
            Write-Host "User data was intentionally dropped."
        } else {
            Write-Host "User data/presets restored from backup."
        }
        exit 0
    }
    "update" {
        if ($null -eq $installed) {
            throw "Update requested but product is not installed."
        }
        if ([string]::IsNullOrWhiteSpace($MsiPath)) {
            throw "update requires -MsiPath"
        }
        $resolvedMsi = (Resolve-Path $MsiPath).Path
        $installedVersion = [version]$installed.DisplayVersion
        $targetVersion = Get-MsiVersion -Path $resolvedMsi
        Ensure-UpgradeableDirection -InstalledVersion $installedVersion -TargetVersion $targetVersion -Mode "update"
        Invoke-MsiExec -Arguments @("/i", $resolvedMsi)
        Write-Host "Update completed: $installedVersion -> $targetVersion"
        exit 0
    }
    "downgrade" {
        if ($null -eq $installed) {
            throw "Downgrade requested but product is not installed."
        }
        if ([string]::IsNullOrWhiteSpace($MsiPath)) {
            throw "downgrade requires -MsiPath"
        }
        $resolvedMsi = (Resolve-Path $MsiPath).Path
        $installedVersion = [version]$installed.DisplayVersion
        $targetVersion = Get-MsiVersion -Path $resolvedMsi
        Ensure-UpgradeableDirection -InstalledVersion $installedVersion -TargetVersion $targetVersion -Mode "downgrade"
        Invoke-MsiExec -Arguments @("/i", $resolvedMsi)
        Write-Host "Downgrade completed: $installedVersion -> $targetVersion"
        exit 0
    }
}
