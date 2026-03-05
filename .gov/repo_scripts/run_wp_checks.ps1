Param(
    [Parameter(Mandatory = $true)]
    [string]$WpId,

    [string]$ProductWorktree = ".product/Worktrees/wt_main",
    [switch]$SkipDependencyInstall
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Invoke-CheckCommand {
    Param(
        [string]$Category,
        [string]$Name,
        [string]$Executable,
        [string[]]$Arguments,
        [string]$WorkingDirectory,
        [string]$LogPath
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
    try {
        $output = & $Executable @Arguments 2>&1
        $output | Set-Content -Path $LogPath -Encoding UTF8
        $exitCode = $LASTEXITCODE
        $result.ExitCode = $exitCode
        $result.Passed = ($exitCode -eq 0)
        $result.Details = if ($result.Passed) { "Command passed." } else { "Command failed with exit code $exitCode." }
    }
    catch {
        $_ | Out-String | Set-Content -Path $LogPath -Encoding UTF8
        $result.ExitCode = 1
        $result.Passed = $false
        $result.Details = "Command threw terminating error."
    }
    finally {
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
$iterationMatch = [regex]::Match($WpId, '^WP-I(\d+)-\d{3}$')
$iterationNumber = if ($iterationMatch.Success) { [int]$iterationMatch.Groups[1].Value } else { $null }

if ($isGovernanceWp) {
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
    "- Artifact Path: $($resultObject.ArtifactPath)",
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
