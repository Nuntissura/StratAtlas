Param(
    [Parameter(Mandatory = $true)]
    [string]$WpId,

    [string]$ProductWorktree = ".product/Worktrees/wt_main",
    [switch]$SkipDependencyInstall
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
if ($PSVersionTable.PSVersion.Major -ge 7) {
    $PSNativeCommandUseErrorActionPreference = $false
}

function Invoke-CheckCommand {
    Param(
        [string]$Category,
        [string]$Name,
        [string]$Executable,
        [string[]]$Arguments,
        [string]$WorkingDirectory,
        [string]$LogPath,
        [hashtable]$EnvironmentOverrides = @{}
    )

    $result = [PSCustomObject]@{
        Category   = $Category
        Name       = $Name
        Command    = ($Executable + " " + ($Arguments -join " ")).Trim()
        Passed     = $false
        Skipped    = $false
        ExitCode   = $null
        LogPath    = $LogPath
        Details    = ""
    }

    Push-Location $WorkingDirectory
    $originalEnvironment = @{}
    try {
        foreach ($entry in $EnvironmentOverrides.GetEnumerator()) {
            $name = [string]$entry.Key
            $originalEnvironment[$name] = [System.Environment]::GetEnvironmentVariable($name, "Process")
            [System.Environment]::SetEnvironmentVariable($name, [string]$entry.Value, "Process")
        }

        $previousErrorActionPreference = $ErrorActionPreference
        $ErrorActionPreference = "Continue"
        $output = & $Executable @Arguments 2>&1
        $ErrorActionPreference = $previousErrorActionPreference
        $output | Set-Content -Path $LogPath -Encoding UTF8
        $exitCode = $LASTEXITCODE
        if ($null -eq $exitCode) {
            $exitCode = 0
        }
        $result.ExitCode = $exitCode
        $result.Passed = ($exitCode -eq 0)
        $result.Details = if ($result.Passed) { "Command passed." } else { "Command failed with exit code $exitCode." }
    }
    catch {
        $ErrorActionPreference = "Stop"
        $_ | Out-String | Set-Content -Path $LogPath -Encoding UTF8
        $result.ExitCode = 1
        $result.Passed = $false
        $result.Details = "Command threw terminating error."
    }
    finally {
        foreach ($entry in $originalEnvironment.GetEnumerator()) {
            [System.Environment]::SetEnvironmentVariable([string]$entry.Key, $entry.Value, "Process")
        }
        Pop-Location
    }

    return $result
}

function New-SkippedResult {
    Param(
        [string]$Category,
        [string]$Name,
        [string]$Details
    )

    return [PSCustomObject]@{
        Category   = $Category
        Name       = $Name
        Command    = ""
        Passed     = $true
        Skipped    = $true
        ExitCode   = $null
        LogPath    = ""
        Details    = $Details
    }
}

function Invoke-WpI0ControlPlanePreparation {
    Param(
        [string]$ArtifactRootAbs,
        [string]$SchemaSeed
    )

    $logPath = Join-Path $ArtifactRootAbs "DEP-003.log"
    $containerName = "stratatlas-wp-i0-003-postgis"
    $image = "postgis/postgis:16-3.5"
    $databaseName = "stratatlas_wp_i0_003"
    $databaseUser = "postgres"
    $databasePassword = "postgres"
    $databasePort = 55432
    $baseSchema = ("wp_i0_003_{0}" -f $SchemaSeed.ToLower()).Replace("-", "_")
    $smokeSchema = "${baseSchema}_smoke"
    $liveTestSchema = "${baseSchema}_live"
    $dsn = "postgres://{0}:{1}@127.0.0.1:{2}/{3}" -f $databaseUser, $databasePassword, $databasePort, $databaseName
    $logLines = New-Object System.Collections.Generic.List[string]

    try {
        $logLines.Add("Preparing PostgreSQL/PostGIS control plane for WP-I0-003.")
        $logLines.Add("Container: $containerName")
        $logLines.Add("Image: $image")
        $logLines.Add("Database: $databaseName")
        $logLines.Add("Port: $databasePort")
        $logLines.Add("Smoke schema: $smokeSchema")
        $logLines.Add("Live test schema: $liveTestSchema")

        $inspectOutput = & docker container inspect $containerName 2>&1
        $inspectExitCode = $LASTEXITCODE
        if ($inspectExitCode -ne 0) {
            $logLines.Add("Container missing; creating a fresh instance.")
            $runOutput = & docker run --name $containerName -e "POSTGRES_DB=$databaseName" -e "POSTGRES_USER=$databaseUser" -e "POSTGRES_PASSWORD=$databasePassword" -p "${databasePort}:5432" -d $image 2>&1
            $runExitCode = $LASTEXITCODE
            $logLines.Add(($runOutput | Out-String).Trim())
            if ($runExitCode -ne 0) {
                throw "docker run failed with exit code $runExitCode"
            }
        }
        else {
            $logLines.Add("Container already exists.")
            $logLines.Add(($inspectOutput | Out-String).Trim())
        }

        $runningOutput = & docker inspect --format "{{.State.Running}}" $containerName 2>&1
        $runningExitCode = $LASTEXITCODE
        if ($runningExitCode -ne 0) {
            throw "docker inspect running-state failed with exit code $runningExitCode"
        }
        $runningText = ($runningOutput | Out-String).Trim()
        if ($runningText -ne "true") {
            $logLines.Add("Starting stopped container.")
            $startOutput = & docker start $containerName 2>&1
            $startExitCode = $LASTEXITCODE
            $logLines.Add(($startOutput | Out-String).Trim())
            if ($startExitCode -ne 0) {
                throw "docker start failed with exit code $startExitCode"
            }
        }
        else {
            $logLines.Add("Container already running.")
        }

        $ready = $false
        for ($attempt = 1; $attempt -le 60; $attempt++) {
            $probeOutput = & docker exec $containerName psql -U $databaseUser -d $databaseName -tAc "SELECT 1;" 2>&1
            $probeExitCode = $LASTEXITCODE
            $probeText = ($probeOutput | Out-String).Trim()
            $logLines.Add("Probe $attempt exit=$probeExitCode output=$probeText")
            if ($probeExitCode -eq 0 -and $probeText -eq "1") {
                $ready = $true
                break
            }
            Start-Sleep -Seconds 2
        }

        if (-not $ready) {
            throw "PostgreSQL/PostGIS container did not become ready within the timeout window."
        }

        $versionOutput = & docker exec $containerName psql -U $databaseUser -d $databaseName -tAc "SELECT version();" 2>&1
        if ($LASTEXITCODE -eq 0) {
            $logLines.Add("Database version: $(($versionOutput | Out-String).Trim())")
        }

        $logLines.Add("Control-plane DSN: $dsn")
        $logLines | Set-Content -Path $logPath -Encoding UTF8

        return [PSCustomObject]@{
            Result = [PSCustomObject]@{
                Category = "Dependency"
                Name = "PostgreSQL/PostGIS control plane ready"
                Command = "docker container inspect/run/start + docker exec psql readiness probes"
                Passed = $true
                Skipped = $false
                ExitCode = 0
                LogPath = $logPath
                Details = "Container $containerName ready on port $databasePort; smoke schema $smokeSchema; live test schema $liveTestSchema."
            }
            Dsn = $dsn
            ContainerName = $containerName
            DatabaseName = $databaseName
            DatabaseUser = $databaseUser
            SmokeSchema = $smokeSchema
            LiveTestSchema = $liveTestSchema
        }
    }
    catch {
        $logLines.Add("Preparation failed.")
        $logLines.Add(($_ | Out-String))
        $logLines | Set-Content -Path $logPath -Encoding UTF8

        return [PSCustomObject]@{
            Result = [PSCustomObject]@{
                Category = "Dependency"
                Name = "PostgreSQL/PostGIS control plane ready"
                Command = "docker container inspect/run/start + docker exec psql readiness probes"
                Passed = $false
                Skipped = $false
                ExitCode = 1
                LogPath = $logPath
                Details = "Control-plane preparation failed."
            }
            Dsn = $null
            ContainerName = $containerName
            DatabaseName = $databaseName
            DatabaseUser = $databaseUser
            SmokeSchema = $smokeSchema
            LiveTestSchema = $liveTestSchema
        }
    }
}

$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDirectory "..\..")

$productAbs = Join-Path $repoRoot $ProductWorktree
if (-not (Test-Path $productAbs -PathType Container)) {
    throw "Product worktree not found: $productAbs"
}

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$artifactRootRel = ".product/build_target/tool_artifacts/wp_runs/$WpId/$timestamp"
$artifactRootAbs = Join-Path $repoRoot $artifactRootRel
New-Item -Path $artifactRootAbs -ItemType Directory -Force | Out-Null

$latestArtifactDirAbs = Join-Path $repoRoot ".product/build_target/tool_artifacts/wp_runs/$WpId"
if (-not (Test-Path $latestArtifactDirAbs -PathType Container)) {
    New-Item -Path $latestArtifactDirAbs -ItemType Directory -Force | Out-Null
}

$results = New-Object System.Collections.Generic.List[object]

$isGovernanceWp = $WpId -like "WP-GOV-*"
$isRuntimeGovernanceWp = $WpId -eq "WP-GOV-VERIFY-001"
$isWpI0 = $WpId -eq "WP-I0-003"
$isWpI1 = $WpId -eq "WP-I1-003"
$isWpI7 = $WpId -eq "WP-I7-002"
$isWpI6 = $WpId -eq "WP-I6-002"
$iterationMatch = [regex]::Match($WpId, '^WP-I(\d+)-\d{3}$')
$iterationNumber = if ($iterationMatch.Success) { [int]$iterationMatch.Groups[1].Value } else { $null }
$runtimeSmokeArtifactAbs = $null

if ($isRuntimeGovernanceWp) {
    $depLog = Join-Path $artifactRootAbs "DEP-001.log"
    $dep = Invoke-CheckCommand -Category "Dependency" -Name "Governance Preflight" -Executable "powershell" -Arguments @("-ExecutionPolicy", "Bypass", "-File", ".gov/repo_scripts/governance_preflight.ps1") -WorkingDirectory $repoRoot -LogPath $depLog
    $results.Add($dep) | Out-Null

    $uiLog = Join-Path $artifactRootAbs "UI-001.log"
    $runtimeSmokeArtifactAbs = Join-Path $artifactRootAbs "runtime_smoke"
    $ui = Invoke-CheckCommand -Category "UI Contract" -Name "Tauri runtime smoke harness" -Executable "pnpm" -Arguments @("smoke:runtime", "--", "--artifact-root", $runtimeSmokeArtifactAbs) -WorkingDirectory $productAbs -LogPath $uiLog
    $results.Add($ui) | Out-Null

    $funcLog = Join-Path $artifactRootAbs "FUNC-001.log"
    $func = Invoke-CheckCommand -Category "Functionality" -Name "Full functional suite" -Executable "pnpm" -Arguments @("test") -WorkingDirectory $productAbs -LogPath $funcLog
    $results.Add($func) | Out-Null

    $corLog = Join-Path $artifactRootAbs "COR-001.log"
    $cor = Invoke-CheckCommand -Category "Code Correctness" -Name "Lint checks" -Executable "pnpm" -Arguments @("lint") -WorkingDirectory $productAbs -LogPath $corLog
    $results.Add($cor) | Out-Null

    $corTemplateLog = Join-Path $artifactRootAbs "COR-002.log"
    $corTemplate = Invoke-CheckCommand -Category "Code Correctness" -Name "WP template compliance" -Executable "powershell" -Arguments @("-ExecutionPolicy", "Bypass", "-File", ".gov/repo_scripts/enforce_wp_template_compliance.ps1") -WorkingDirectory $repoRoot -LogPath $corTemplateLog
    $results.Add($corTemplate) | Out-Null

    $redLog = Join-Path $artifactRootAbs "RED-001.log"
    $redJsonRel = "$artifactRootRel/red_team_result.json"
    $red = Invoke-CheckCommand -Category "Red-Team" -Name "Guardrail static check" -Executable "powershell" -Arguments @("-ExecutionPolicy", "Bypass", "-File", ".gov/repo_scripts/red_team_guardrail_check.ps1", "-CodeRoot", $ProductWorktree, "-OutputJsonPath", $redJsonRel) -WorkingDirectory $repoRoot -LogPath $redLog
    $results.Add($red) | Out-Null

    $extLog = Join-Path $artifactRootAbs "EXT-001.log"
    $ext = Invoke-CheckCommand -Category "Additional" -Name "Build checks" -Executable "pnpm" -Arguments @("build") -WorkingDirectory $productAbs -LogPath $extLog
    $results.Add($ext) | Out-Null

    $cargoManifest = Join-Path $productAbs "src-tauri/Cargo.toml"
    if (Test-Path $cargoManifest -PathType Leaf) {
        $extCargoLog = Join-Path $artifactRootAbs "EXT-002.log"
        $extCargo = Invoke-CheckCommand -Category "Additional" -Name "Rust unit tests" -Executable "cargo" -Arguments @("test", "--manifest-path", "src-tauri/Cargo.toml") -WorkingDirectory $productAbs -LogPath $extCargoLog
        $results.Add($extCargo) | Out-Null
    }
}
elseif ($isWpI0) {
    $depPreflightLog = Join-Path $artifactRootAbs "DEP-001.log"
    $depPreflight = Invoke-CheckCommand -Category "Dependency" -Name "Governance Preflight" -Executable "powershell" -Arguments @("-ExecutionPolicy", "Bypass", "-File", ".gov/repo_scripts/governance_preflight.ps1") -WorkingDirectory $repoRoot -LogPath $depPreflightLog
    $results.Add($depPreflight) | Out-Null

    if (-not $SkipDependencyInstall) {
        $depInstallLog = Join-Path $artifactRootAbs "DEP-002.log"
        $depInstall = Invoke-CheckCommand -Category "Dependency" -Name "Dependency install (frozen lockfile)" -Executable "pnpm" -Arguments @("install", "--frozen-lockfile") -WorkingDirectory $productAbs -LogPath $depInstallLog
        $results.Add($depInstall) | Out-Null
    }
    else {
        $results.Add((New-SkippedResult -Category "Dependency" -Name "Dependency install" -Details "Skipped by parameter.")) | Out-Null
    }

    $controlPlanePrep = Invoke-WpI0ControlPlanePreparation -ArtifactRootAbs $artifactRootAbs -SchemaSeed $timestamp
    $results.Add($controlPlanePrep.Result) | Out-Null

    $wpI0Environment = @{
        STRATATLAS_CONTROL_PLANE_DSN = $controlPlanePrep.Dsn
        STRATATLAS_CONTROL_PLANE_SCHEMA = $controlPlanePrep.SmokeSchema
    }
    $wpI0LiveTestEnvironment = @{
        STRATATLAS_CONTROL_PLANE_DSN = $controlPlanePrep.Dsn
        STRATATLAS_CONTROL_PLANE_SCHEMA = $controlPlanePrep.LiveTestSchema
    }

    $uiLog = Join-Path $artifactRootAbs "UI-001.log"
    $runtimeSmokeArtifactAbs = Join-Path $artifactRootAbs "runtime_smoke"
    $ui = Invoke-CheckCommand -Category "UI Contract" -Name "Tauri runtime smoke harness (PostgreSQL/PostGIS)" -Executable "pnpm" -Arguments @("smoke:runtime", "--", "--artifact-root", $runtimeSmokeArtifactAbs) -WorkingDirectory $productAbs -LogPath $uiLog -EnvironmentOverrides $wpI0Environment
    $results.Add($ui) | Out-Null

    $funcLog = Join-Path $artifactRootAbs "FUNC-001.log"
    $func = Invoke-CheckCommand -Category "Functionality" -Name "Full functional suite" -Executable "pnpm" -Arguments @("test") -WorkingDirectory $productAbs -LogPath $funcLog
    $results.Add($func) | Out-Null

    $funcProofLog = Join-Path $artifactRootAbs "FUNC-002.log"
    $funcProof = Invoke-CheckCommand -Category "Functionality" -Name "Runtime proof export validation" -Executable "powershell" -Arguments @("-ExecutionPolicy", "Bypass", "-File", ".gov/repo_scripts/validate_wp_i0_runtime_proof.ps1", "-ArtifactRoot", $runtimeSmokeArtifactAbs, "-ContainerName", $controlPlanePrep.ContainerName, "-DatabaseName", $controlPlanePrep.DatabaseName, "-SchemaName", $controlPlanePrep.SmokeSchema, "-DbUser", $controlPlanePrep.DatabaseUser) -WorkingDirectory $repoRoot -LogPath $funcProofLog
    $results.Add($funcProof) | Out-Null

    $corLog = Join-Path $artifactRootAbs "COR-001.log"
    $cor = Invoke-CheckCommand -Category "Code Correctness" -Name "Lint checks" -Executable "pnpm" -Arguments @("lint") -WorkingDirectory $productAbs -LogPath $corLog
    $results.Add($cor) | Out-Null

    $corTemplateLog = Join-Path $artifactRootAbs "COR-002.log"
    $corTemplate = Invoke-CheckCommand -Category "Code Correctness" -Name "WP template compliance" -Executable "powershell" -Arguments @("-ExecutionPolicy", "Bypass", "-File", ".gov/repo_scripts/enforce_wp_template_compliance.ps1") -WorkingDirectory $repoRoot -LogPath $corTemplateLog
    $results.Add($corTemplate) | Out-Null

    $redLog = Join-Path $artifactRootAbs "RED-001.log"
    $redJsonRel = "$artifactRootRel/red_team_result.json"
    $red = Invoke-CheckCommand -Category "Red-Team" -Name "Guardrail static check" -Executable "powershell" -Arguments @("-ExecutionPolicy", "Bypass", "-File", ".gov/repo_scripts/red_team_guardrail_check.ps1", "-CodeRoot", $ProductWorktree, "-OutputJsonPath", $redJsonRel) -WorkingDirectory $repoRoot -LogPath $redLog
    $results.Add($red) | Out-Null

    $extLog = Join-Path $artifactRootAbs "EXT-001.log"
    $ext = Invoke-CheckCommand -Category "Additional" -Name "Build checks" -Executable "pnpm" -Arguments @("build") -WorkingDirectory $productAbs -LogPath $extLog
    $results.Add($ext) | Out-Null

    $cargoManifest = Join-Path $productAbs "src-tauri/Cargo.toml"
    if (Test-Path $cargoManifest -PathType Leaf) {
        $extCargoLog = Join-Path $artifactRootAbs "EXT-002.log"
        $extCargo = Invoke-CheckCommand -Category "Additional" -Name "Rust unit tests" -Executable "cargo" -Arguments @("test", "--manifest-path", "src-tauri/Cargo.toml") -WorkingDirectory $productAbs -LogPath $extCargoLog
        $results.Add($extCargo) | Out-Null

        $extCargoLiveLog = Join-Path $artifactRootAbs "EXT-003.log"
        $extCargoLive = Invoke-CheckCommand -Category "Additional" -Name "Rust live PostgreSQL/PostGIS control-plane test" -Executable "cargo" -Arguments @("test", "--manifest-path", "src-tauri/Cargo.toml", "live_control_plane_query_roundtrip", "--", "--ignored", "--nocapture") -WorkingDirectory $productAbs -LogPath $extCargoLiveLog -EnvironmentOverrides $wpI0LiveTestEnvironment
        $results.Add($extCargoLive) | Out-Null
    }
}
elseif ($isWpI1) {
    $depPreflightLog = Join-Path $artifactRootAbs "DEP-001.log"
    $depPreflight = Invoke-CheckCommand -Category "Dependency" -Name "Governance Preflight" -Executable "powershell" -Arguments @("-ExecutionPolicy", "Bypass", "-File", ".gov/repo_scripts/governance_preflight.ps1") -WorkingDirectory $repoRoot -LogPath $depPreflightLog
    $results.Add($depPreflight) | Out-Null

    if (-not $SkipDependencyInstall) {
        $depInstallLog = Join-Path $artifactRootAbs "DEP-002.log"
        $depInstall = Invoke-CheckCommand -Category "Dependency" -Name "Dependency install (frozen lockfile)" -Executable "pnpm" -Arguments @("install", "--frozen-lockfile") -WorkingDirectory $productAbs -LogPath $depInstallLog
        $results.Add($depInstall) | Out-Null
    }
    else {
        $results.Add((New-SkippedResult -Category "Dependency" -Name "Dependency install" -Details "Skipped by parameter.")) | Out-Null
    }

    $uiLog = Join-Path $artifactRootAbs "UI-001.log"
    $runtimeSmokeArtifactAbs = Join-Path $artifactRootAbs "runtime_smoke"
    $ui = Invoke-CheckCommand -Category "UI Contract" -Name "Tauri runtime smoke harness (2D + 3D map runtime)" -Executable "pnpm" -Arguments @("smoke:runtime", "--", "--artifact-root", $runtimeSmokeArtifactAbs, "--wp-id", $WpId) -WorkingDirectory $productAbs -LogPath $uiLog
    $results.Add($ui) | Out-Null

    $funcLog = Join-Path $artifactRootAbs "FUNC-001.log"
    $func = Invoke-CheckCommand -Category "Functionality" -Name "Full functional suite" -Executable "pnpm" -Arguments @("test") -WorkingDirectory $productAbs -LogPath $funcLog
    $results.Add($func) | Out-Null

    $corLog = Join-Path $artifactRootAbs "COR-001.log"
    $cor = Invoke-CheckCommand -Category "Code Correctness" -Name "Lint checks" -Executable "pnpm" -Arguments @("lint") -WorkingDirectory $productAbs -LogPath $corLog
    $results.Add($cor) | Out-Null

    $corTemplateLog = Join-Path $artifactRootAbs "COR-002.log"
    $corTemplate = Invoke-CheckCommand -Category "Code Correctness" -Name "WP template compliance" -Executable "powershell" -Arguments @("-ExecutionPolicy", "Bypass", "-File", ".gov/repo_scripts/enforce_wp_template_compliance.ps1") -WorkingDirectory $repoRoot -LogPath $corTemplateLog
    $results.Add($corTemplate) | Out-Null

    $redLog = Join-Path $artifactRootAbs "RED-001.log"
    $redJsonRel = "$artifactRootRel/red_team_result.json"
    $red = Invoke-CheckCommand -Category "Red-Team" -Name "Guardrail static check" -Executable "powershell" -Arguments @("-ExecutionPolicy", "Bypass", "-File", ".gov/repo_scripts/red_team_guardrail_check.ps1", "-CodeRoot", $ProductWorktree, "-OutputJsonPath", $redJsonRel) -WorkingDirectory $repoRoot -LogPath $redLog
    $results.Add($red) | Out-Null

    $extLog = Join-Path $artifactRootAbs "EXT-001.log"
    $ext = Invoke-CheckCommand -Category "Additional" -Name "Build checks" -Executable "pnpm" -Arguments @("build") -WorkingDirectory $productAbs -LogPath $extLog
    $results.Add($ext) | Out-Null

    $cargoManifest = Join-Path $productAbs "src-tauri/Cargo.toml"
    if (Test-Path $cargoManifest -PathType Leaf) {
        $extCargoLog = Join-Path $artifactRootAbs "EXT-002.log"
        $extCargo = Invoke-CheckCommand -Category "Additional" -Name "Rust unit tests" -Executable "cargo" -Arguments @("test", "--manifest-path", "src-tauri/Cargo.toml") -WorkingDirectory $productAbs -LogPath $extCargoLog
        $results.Add($extCargo) | Out-Null
    }
}
elseif ($isWpI7) {
    $depPreflightLog = Join-Path $artifactRootAbs "DEP-001.log"
    $depPreflight = Invoke-CheckCommand -Category "Dependency" -Name "Governance Preflight" -Executable "powershell" -Arguments @("-ExecutionPolicy", "Bypass", "-File", ".gov/repo_scripts/governance_preflight.ps1") -WorkingDirectory $repoRoot -LogPath $depPreflightLog
    $results.Add($depPreflight) | Out-Null

    if (-not $SkipDependencyInstall) {
        $depInstallLog = Join-Path $artifactRootAbs "DEP-002.log"
        $depInstall = Invoke-CheckCommand -Category "Dependency" -Name "Dependency install (frozen lockfile)" -Executable "pnpm" -Arguments @("install", "--frozen-lockfile") -WorkingDirectory $productAbs -LogPath $depInstallLog
        $results.Add($depInstall) | Out-Null
    }
    else {
        $results.Add((New-SkippedResult -Category "Dependency" -Name "Dependency install" -Details "Skipped by parameter.")) | Out-Null
    }

    $uiLog = Join-Path $artifactRootAbs "UI-001.log"
    $runtimeSmokeArtifactAbs = Join-Path $artifactRootAbs "runtime_smoke"
    $ui = Invoke-CheckCommand -Category "UI Contract" -Name "Tauri runtime smoke harness (governed context ingestion)" -Executable "pnpm" -Arguments @("smoke:runtime", "--", "--artifact-root", $runtimeSmokeArtifactAbs, "--wp-id", $WpId) -WorkingDirectory $productAbs -LogPath $uiLog
    $results.Add($ui) | Out-Null

    $funcLog = Join-Path $artifactRootAbs "FUNC-001.log"
    $func = Invoke-CheckCommand -Category "Functionality" -Name "Full functional suite" -Executable "pnpm" -Arguments @("test") -WorkingDirectory $productAbs -LogPath $funcLog
    $results.Add($func) | Out-Null

    $corLog = Join-Path $artifactRootAbs "COR-001.log"
    $cor = Invoke-CheckCommand -Category "Code Correctness" -Name "Lint checks" -Executable "pnpm" -Arguments @("lint") -WorkingDirectory $productAbs -LogPath $corLog
    $results.Add($cor) | Out-Null

    $corTemplateLog = Join-Path $artifactRootAbs "COR-002.log"
    $corTemplate = Invoke-CheckCommand -Category "Code Correctness" -Name "WP template compliance" -Executable "powershell" -Arguments @("-ExecutionPolicy", "Bypass", "-File", ".gov/repo_scripts/enforce_wp_template_compliance.ps1") -WorkingDirectory $repoRoot -LogPath $corTemplateLog
    $results.Add($corTemplate) | Out-Null

    $redLog = Join-Path $artifactRootAbs "RED-001.log"
    $redJsonRel = "$artifactRootRel/red_team_result.json"
    $red = Invoke-CheckCommand -Category "Red-Team" -Name "Guardrail static check" -Executable "powershell" -Arguments @("-ExecutionPolicy", "Bypass", "-File", ".gov/repo_scripts/red_team_guardrail_check.ps1", "-CodeRoot", $ProductWorktree, "-OutputJsonPath", $redJsonRel) -WorkingDirectory $repoRoot -LogPath $redLog
    $results.Add($red) | Out-Null

    $extLog = Join-Path $artifactRootAbs "EXT-001.log"
    $ext = Invoke-CheckCommand -Category "Additional" -Name "Build checks" -Executable "pnpm" -Arguments @("build") -WorkingDirectory $productAbs -LogPath $extLog
    $results.Add($ext) | Out-Null

    $cargoManifest = Join-Path $productAbs "src-tauri/Cargo.toml"
    if (Test-Path $cargoManifest -PathType Leaf) {
        $extCargoLog = Join-Path $artifactRootAbs "EXT-002.log"
        $extCargo = Invoke-CheckCommand -Category "Additional" -Name "Rust unit tests" -Executable "cargo" -Arguments @("test", "--manifest-path", "src-tauri/Cargo.toml") -WorkingDirectory $productAbs -LogPath $extCargoLog
        $results.Add($extCargo) | Out-Null
    }
}
elseif ($isWpI6) {
    $depPreflightLog = Join-Path $artifactRootAbs "DEP-001.log"
    $depPreflight = Invoke-CheckCommand -Category "Dependency" -Name "Governance Preflight" -Executable "powershell" -Arguments @("-ExecutionPolicy", "Bypass", "-File", ".gov/repo_scripts/governance_preflight.ps1") -WorkingDirectory $repoRoot -LogPath $depPreflightLog
    $results.Add($depPreflight) | Out-Null

    if (-not $SkipDependencyInstall) {
        $depInstallLog = Join-Path $artifactRootAbs "DEP-002.log"
        $depInstall = Invoke-CheckCommand -Category "Dependency" -Name "Dependency install (frozen lockfile)" -Executable "pnpm" -Arguments @("install", "--frozen-lockfile") -WorkingDirectory $productAbs -LogPath $depInstallLog
        $results.Add($depInstall) | Out-Null
    }
    else {
        $results.Add((New-SkippedResult -Category "Dependency" -Name "Dependency install" -Details "Skipped by parameter.")) | Out-Null
    }

    $uiLog = Join-Path $artifactRootAbs "UI-001.log"
    $runtimeSmokeArtifactAbs = Join-Path $artifactRootAbs "runtime_smoke"
    $wpI6Environment = @{
        VITE_STRATATLAS_RUNTIME_SMOKE_REQUIRE_LIVE_AI = "1"
        VITE_STRATATLAS_RUNTIME_SMOKE_REQUIRE_MCP = "1"
    }
    $ui = Invoke-CheckCommand -Category "UI Contract" -Name "Tauri runtime smoke harness (live AI + MCP)" -Executable "pnpm" -Arguments @("smoke:runtime", "--", "--artifact-root", $runtimeSmokeArtifactAbs, "--wp-id", $WpId) -WorkingDirectory $productAbs -LogPath $uiLog -EnvironmentOverrides $wpI6Environment
    $results.Add($ui) | Out-Null

    $funcLog = Join-Path $artifactRootAbs "FUNC-001.log"
    $func = Invoke-CheckCommand -Category "Functionality" -Name "Full functional suite" -Executable "pnpm" -Arguments @("test") -WorkingDirectory $productAbs -LogPath $funcLog
    $results.Add($func) | Out-Null

    $corLog = Join-Path $artifactRootAbs "COR-001.log"
    $cor = Invoke-CheckCommand -Category "Code Correctness" -Name "Lint checks" -Executable "pnpm" -Arguments @("lint") -WorkingDirectory $productAbs -LogPath $corLog
    $results.Add($cor) | Out-Null

    $corTemplateLog = Join-Path $artifactRootAbs "COR-002.log"
    $corTemplate = Invoke-CheckCommand -Category "Code Correctness" -Name "WP template compliance" -Executable "powershell" -Arguments @("-ExecutionPolicy", "Bypass", "-File", ".gov/repo_scripts/enforce_wp_template_compliance.ps1") -WorkingDirectory $repoRoot -LogPath $corTemplateLog
    $results.Add($corTemplate) | Out-Null

    $redLog = Join-Path $artifactRootAbs "RED-001.log"
    $redJsonRel = "$artifactRootRel/red_team_result.json"
    $red = Invoke-CheckCommand -Category "Red-Team" -Name "Guardrail static check" -Executable "powershell" -Arguments @("-ExecutionPolicy", "Bypass", "-File", ".gov/repo_scripts/red_team_guardrail_check.ps1", "-CodeRoot", $ProductWorktree, "-OutputJsonPath", $redJsonRel) -WorkingDirectory $repoRoot -LogPath $redLog
    $results.Add($red) | Out-Null

    $extLog = Join-Path $artifactRootAbs "EXT-001.log"
    $ext = Invoke-CheckCommand -Category "Additional" -Name "Build checks" -Executable "pnpm" -Arguments @("build") -WorkingDirectory $productAbs -LogPath $extLog
    $results.Add($ext) | Out-Null

    $cargoManifest = Join-Path $productAbs "src-tauri/Cargo.toml"
    if (Test-Path $cargoManifest -PathType Leaf) {
        $extCargoLog = Join-Path $artifactRootAbs "EXT-002.log"
        $extCargo = Invoke-CheckCommand -Category "Additional" -Name "Rust unit tests" -Executable "cargo" -Arguments @("test", "--manifest-path", "src-tauri/Cargo.toml") -WorkingDirectory $productAbs -LogPath $extCargoLog
        $results.Add($extCargo) | Out-Null
    }
}
elseif ($isGovernanceWp) {
    $depLog = Join-Path $artifactRootAbs "DEP-001.log"
    $dep = Invoke-CheckCommand -Category "Dependency" -Name "Governance Preflight" -Executable "powershell" -Arguments @("-ExecutionPolicy", "Bypass", "-File", ".gov/repo_scripts/governance_preflight.ps1") -WorkingDirectory $repoRoot -LogPath $depLog
    $results.Add($dep) | Out-Null

    $results.Add((New-SkippedResult -Category "UI Contract" -Name "UI checks" -Details "Governance-only WP; UI runtime checks not applicable.")) | Out-Null
    $results.Add((New-SkippedResult -Category "Functionality" -Name "Feature flow checks" -Details "Governance-only WP; product flow checks not applicable.")) | Out-Null

    $corLog = Join-Path $artifactRootAbs "COR-001.log"
    $cor = Invoke-CheckCommand -Category "Code Correctness" -Name "Governance script strict mode check" -Executable "powershell" -Arguments @("-ExecutionPolicy", "Bypass", "-File", ".gov/repo_scripts/governance_preflight.ps1") -WorkingDirectory $repoRoot -LogPath $corLog
    $results.Add($cor) | Out-Null

    $redLog = Join-Path $artifactRootAbs "RED-001.log"
    $redJsonRel = "$artifactRootRel/red_team_result.json"
    $red = Invoke-CheckCommand -Category "Red-Team" -Name "Guardrail static check" -Executable "powershell" -Arguments @("-ExecutionPolicy", "Bypass", "-File", ".gov/repo_scripts/red_team_guardrail_check.ps1", "-CodeRoot", $ProductWorktree, "-OutputJsonPath", $redJsonRel) -WorkingDirectory $repoRoot -LogPath $redLog
    $results.Add($red) | Out-Null

    $results.Add((New-SkippedResult -Category "Additional" -Name "Build/perf/offline checks" -Details "Governance-only WP; runtime build checks not applicable.")) | Out-Null
}
else {
    if (-not $SkipDependencyInstall) {
        $depLog = Join-Path $artifactRootAbs "DEP-001.log"
        $dep = Invoke-CheckCommand -Category "Dependency" -Name "Dependency install (frozen lockfile)" -Executable "pnpm" -Arguments @("install", "--frozen-lockfile") -WorkingDirectory $productAbs -LogPath $depLog
        $results.Add($dep) | Out-Null
    }
    else {
        $results.Add((New-SkippedResult -Category "Dependency" -Name "Dependency install" -Details "Skipped by parameter.")) | Out-Null
    }

    $uiLog = Join-Path $artifactRootAbs "UI-001.log"
    $ui = Invoke-CheckCommand -Category "UI Contract" -Name "App UI contract tests" -Executable "pnpm" -Arguments @("exec", "vitest", "run", "src/App.test.tsx") -WorkingDirectory $productAbs -LogPath $uiLog
    $results.Add($ui) | Out-Null

    $funcLog = Join-Path $artifactRootAbs "FUNC-001.log"
    if ($null -ne $iterationNumber) {
        $featureTest = "src/features/i$iterationNumber/i$iterationNumber.test.ts"
        $featureAbs = Join-Path $productAbs $featureTest
        if (Test-Path $featureAbs -PathType Leaf) {
            $func = Invoke-CheckCommand -Category "Functionality" -Name "Iteration feature tests" -Executable "pnpm" -Arguments @("exec", "vitest", "run", $featureTest) -WorkingDirectory $productAbs -LogPath $funcLog
        }
        else {
            $func = Invoke-CheckCommand -Category "Functionality" -Name "Full functional suite fallback" -Executable "pnpm" -Arguments @("test") -WorkingDirectory $productAbs -LogPath $funcLog
        }
    }
    else {
        $func = Invoke-CheckCommand -Category "Functionality" -Name "Full functional suite" -Executable "pnpm" -Arguments @("test") -WorkingDirectory $productAbs -LogPath $funcLog
    }
    $results.Add($func) | Out-Null

    $corLog = Join-Path $artifactRootAbs "COR-001.log"
    $cor = Invoke-CheckCommand -Category "Code Correctness" -Name "Lint checks" -Executable "pnpm" -Arguments @("lint") -WorkingDirectory $productAbs -LogPath $corLog
    $results.Add($cor) | Out-Null

    $redLog = Join-Path $artifactRootAbs "RED-001.log"
    $redJsonRel = "$artifactRootRel/red_team_result.json"
    $red = Invoke-CheckCommand -Category "Red-Team" -Name "Guardrail static check" -Executable "powershell" -Arguments @("-ExecutionPolicy", "Bypass", "-File", ".gov/repo_scripts/red_team_guardrail_check.ps1", "-CodeRoot", $ProductWorktree, "-OutputJsonPath", $redJsonRel) -WorkingDirectory $repoRoot -LogPath $redLog
    $results.Add($red) | Out-Null

    $extLog = Join-Path $artifactRootAbs "EXT-001.log"
    $ext = Invoke-CheckCommand -Category "Additional" -Name "Build checks" -Executable "pnpm" -Arguments @("build") -WorkingDirectory $productAbs -LogPath $extLog
    $results.Add($ext) | Out-Null

    $cargoManifest = Join-Path $productAbs "src-tauri/Cargo.toml"
    if (Test-Path $cargoManifest -PathType Leaf) {
        $extCargoLog = Join-Path $artifactRootAbs "EXT-002.log"
        $extCargo = Invoke-CheckCommand -Category "Additional" -Name "Rust unit tests" -Executable "cargo" -Arguments @("test", "--manifest-path", "src-tauri/Cargo.toml") -WorkingDirectory $productAbs -LogPath $extCargoLog
        $results.Add($extCargo) | Out-Null
    }
}

$failedResults = @($results | Where-Object { (-not $_.Passed) -and (-not $_.Skipped) })
$overallPassed = $failedResults.Count -eq 0
$resultRows = @($results | ForEach-Object { $_ })

$resultObject = [PSCustomObject]@{
    WpId                 = $WpId
    GeneratedUtc         = (Get-Date).ToUniversalTime().ToString("o")
    ProductWorktree      = $ProductWorktree.Replace("\", "/")
    ArtifactPath         = $artifactRootRel.Replace("\", "/")
    OverallPassed        = $overallPassed
    FailedCount          = $failedResults.Count
    Results              = $resultRows
}

$resultJsonAbs = Join-Path $artifactRootAbs "result.json"
$resultObject | ConvertTo-Json -Depth 8 | Set-Content -Path $resultJsonAbs -Encoding UTF8

$summaryMdAbs = Join-Path $artifactRootAbs "summary.md"
$summaryLines = @(
    "# WP Check Summary - $WpId",
    "",
    "- Generated UTC: $($resultObject.GeneratedUtc)",
    "- Overall Passed: $($resultObject.OverallPassed)",
    "- Failed Checks: $($resultObject.FailedCount)",
    "- Artifact Path: $($resultObject.ArtifactPath)"
)
if ($null -ne $runtimeSmokeArtifactAbs) {
    $summaryLines += "- Runtime Smoke Artifact Path: $($runtimeSmokeArtifactAbs.Substring($repoRoot.Path.Length + 1).Replace('\', '/'))"
}
$summaryLines += @(
    "",
    "| Category | Name | Passed | Skipped | Log |",
    "|----------|------|--------|---------|-----|"
)
foreach ($r in $results) {
    $logRel = if ([string]::IsNullOrWhiteSpace($r.LogPath)) { "N/A" } else { $r.LogPath.Substring($repoRoot.Path.Length + 1).Replace("\", "/") }
    $summaryLines += "| $($r.Category) | $($r.Name) | $($r.Passed) | $($r.Skipped) | $logRel |"
}
$summaryLines | Set-Content -Path $summaryMdAbs -Encoding UTF8

$latestResultAbs = Join-Path $latestArtifactDirAbs "latest_result.json"
$resultObject | ConvertTo-Json -Depth 8 | Set-Content -Path $latestResultAbs -Encoding UTF8

$latestSummaryAbs = Join-Path $latestArtifactDirAbs "latest_summary.md"
$summaryLines | Set-Content -Path $latestSummaryAbs -Encoding UTF8

Write-Host "WP check run completed for $WpId"
Write-Host "Artifacts: $($resultObject.ArtifactPath)"
Write-Host "Overall Passed: $overallPassed"

if (-not $overallPassed) {
    exit 1
}

exit 0
