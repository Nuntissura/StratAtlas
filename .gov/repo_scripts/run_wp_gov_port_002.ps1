Param(
    [string]$ProductWorktree = ".product/Worktrees/wt_main",
    [string]$RemoteWorkflowPath = ".github/workflows/wp-gov-port-002-macos-smoke.yml",
    [string]$RemoteRepo = "Nuntissura/StratAtlas"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
if ($PSVersionTable.PSVersion.Major -ge 7) {
    $PSNativeCommandUseErrorActionPreference = $false
}

function Test-IsMacOSPlatform {
    return [System.Runtime.InteropServices.RuntimeInformation]::IsOSPlatform(
        [System.Runtime.InteropServices.OSPlatform]::OSX
    )
}

function Test-IsWindowsPlatform {
    return [System.Runtime.InteropServices.RuntimeInformation]::IsOSPlatform(
        [System.Runtime.InteropServices.OSPlatform]::Windows
    )
}

function Get-PowerShellExecutable {
    if (Test-IsWindowsPlatform) {
        return "powershell"
    }

    return "pwsh"
}

function Get-PowerShellArguments {
    Param(
        [Parameter(Mandatory = $true)]
        [string]$FilePath,
        [string[]]$AdditionalArguments = @()
    )

    if (Test-IsWindowsPlatform) {
        return @("-ExecutionPolicy", "Bypass", "-File", $FilePath) + $AdditionalArguments
    }

    return @("-File", $FilePath) + $AdditionalArguments
}

function Invoke-LoggedCommand {
    Param(
        [string]$Category,
        [string]$Name,
        [string]$Executable,
        [string[]]$Arguments,
        [string]$WorkingDirectory,
        [string]$LogPath
    )

    $result = [PSCustomObject]@{
        Category = $Category
        Name = $Name
        Command = ($Executable + " " + ($Arguments -join " ")).Trim()
        Passed = $false
        Skipped = $false
        ExitCode = $null
        LogPath = $LogPath
        Details = ""
    }

    Push-Location $WorkingDirectory
    try {
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
        Pop-Location
    }

    return $result
}

function Write-ResultBundle {
    Param(
        [string]$WpId,
        [string]$ArtifactRootAbs,
        [string]$ArtifactRootRel,
        [string]$LatestArtifactDirAbs,
        [string]$ProductWorktree,
        [System.Collections.Generic.List[object]]$Results
    )

    $failedResults = @($Results | Where-Object { (-not $_.Passed) -and (-not $_.Skipped) })
    $overallPassed = $failedResults.Count -eq 0
    $resultRows = @($Results | ForEach-Object { $_ })

    $resultObject = [PSCustomObject]@{
        WpId            = $WpId
        GeneratedUtc    = (Get-Date).ToUniversalTime().ToString("o")
        ProductWorktree = $ProductWorktree.Replace("\", "/")
        ArtifactPath    = $ArtifactRootRel.Replace("\", "/")
        OverallPassed   = $overallPassed
        FailedCount     = $failedResults.Count
        Results         = $resultRows
    }

    $resultJsonAbs = Join-Path $ArtifactRootAbs "result.json"
    $resultObject | ConvertTo-Json -Depth 8 | Set-Content -Path $resultJsonAbs -Encoding UTF8

    $summaryMdAbs = Join-Path $ArtifactRootAbs "summary.md"
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
    foreach ($r in $Results) {
        $logRel = if ([string]::IsNullOrWhiteSpace($r.LogPath)) { "N/A" } else { $r.LogPath.Substring($repoRoot.Path.Length + 1).Replace("\", "/") }
        $summaryLines += "| $($r.Category) | $($r.Name) | $($r.Passed) | $($r.Skipped) | $logRel |"
    }
    $summaryLines | Set-Content -Path $summaryMdAbs -Encoding UTF8

    $latestResultAbs = Join-Path $LatestArtifactDirAbs "latest_result.json"
    $resultObject | ConvertTo-Json -Depth 8 | Set-Content -Path $latestResultAbs -Encoding UTF8

    $latestSummaryAbs = Join-Path $LatestArtifactDirAbs "latest_summary.md"
    $summaryLines | Set-Content -Path $latestSummaryAbs -Encoding UTF8

    Write-Host "WP check run completed for $WpId"
    Write-Host "Artifacts: $($resultObject.ArtifactPath)"
    Write-Host "Overall Passed: $overallPassed"

    if (-not $overallPassed) {
        exit 1
    }
}

function Assert-MacRuntimeSmokeArtifacts {
    Param(
        [string]$RuntimeSmokeArtifactAbs,
        [string]$LogPath
    )

    $logLines = New-Object System.Collections.Generic.List[string]
    $requiredPhases = @("cold", "warm")
    foreach ($phase in $requiredPhases) {
        $reportPath = Join-Path $RuntimeSmokeArtifactAbs "$phase/runtime_smoke_report.json"
        $auditLogPath = Join-Path $RuntimeSmokeArtifactAbs "$phase/runtime_proof/audit_log.jsonl"
        if (-not (Test-Path $reportPath -PathType Leaf)) {
            throw "Missing runtime smoke report: $reportPath"
        }
        if (-not (Test-Path $auditLogPath -PathType Leaf)) {
            throw "Missing runtime smoke audit log: $auditLogPath"
        }

        $report = Get-Content $reportPath -Raw | ConvertFrom-Json
        if ([string]::IsNullOrWhiteSpace($report.platform) -or ($report.platform -notmatch 'mac')) {
            throw "Runtime smoke phase $phase did not report a macOS platform. Reported platform: $($report.platform)"
        }
        if (-not $report.mapRuntimeVisible -or -not $report.mapRuntimeInteractive) {
            throw "Runtime smoke phase $phase did not keep the governed map runtime visible and interactive."
        }
        if (-not $report.selectedBundleId) {
            throw "Runtime smoke phase $phase did not capture a selected bundle."
        }
        if (-not $report.mapPlanarReady -or -not $report.mapOrbitalReady) {
            throw "Runtime smoke phase $phase did not complete both 2D and 3D runtime readiness."
        }

        $logLines.Add("Phase: $phase")
        $logLines.Add("Platform: $($report.platform)")
        $logLines.Add("StartupMs: $($report.startupMs)")
        $logLines.Add("FlowDurationMs: $($report.flowDurationMs)")
        $logLines.Add("MapRuntimeEngine: $($report.mapRuntimeEngine)")
        $logLines.Add("SelectedBundleId: $($report.selectedBundleId)")
        $logLines.Add("")
    }

    $logLines | Set-Content -Path $LogPath -Encoding UTF8
    return [PSCustomObject]@{
        Category = "Functionality"
        Name = "macOS runtime smoke artifact validation"
        Command = "Validate runtime_smoke_report.json platform and readiness assertions"
        Passed = $true
        Skipped = $false
        ExitCode = 0
        LogPath = $LogPath
        Details = "Cold/warm runtime smoke artifacts report macOS platform metadata and governed shell readiness."
    }
}

function Invoke-LocalMacCheck {
    Param(
        [string]$WpId,
        [string]$ProductAbs,
        [string]$ArtifactRootAbs,
        [string]$ArtifactRootRel,
        [string]$LatestArtifactDirAbs
    )

    $runtimeSmokeArtifactAbs = Join-Path $ArtifactRootAbs "runtime_smoke"
    $results = New-Object System.Collections.Generic.List[object]
    $powerShellExecutable = Get-PowerShellExecutable

    $depPreflightLog = Join-Path $ArtifactRootAbs "DEP-001.log"
    $depPreflight = Invoke-LoggedCommand `
        -Category "Dependency" `
        -Name "Governance Preflight" `
        -Executable $powerShellExecutable `
        -Arguments (Get-PowerShellArguments -FilePath ".gov/repo_scripts/governance_preflight.ps1") `
        -WorkingDirectory $repoRoot `
        -LogPath $depPreflightLog
    $results.Add($depPreflight) | Out-Null

    $depInstallLog = Join-Path $ArtifactRootAbs "DEP-002.log"
    $depInstall = Invoke-LoggedCommand `
        -Category "Dependency" `
        -Name "Dependency install (frozen lockfile)" `
        -Executable "pnpm" `
        -Arguments @("install", "--frozen-lockfile") `
        -WorkingDirectory $ProductAbs `
        -LogPath $depInstallLog
    $results.Add($depInstall) | Out-Null

    $uiLog = Join-Path $ArtifactRootAbs "UI-001.log"
    $ui = Invoke-LoggedCommand `
        -Category "UI Contract" `
        -Name "Tauri runtime smoke harness (macOS portability)" `
        -Executable "pnpm" `
        -Arguments @("smoke:runtime", "--", "--artifact-root", $runtimeSmokeArtifactAbs, "--wp-id", $WpId) `
        -WorkingDirectory $ProductAbs `
        -LogPath $uiLog
    $results.Add($ui) | Out-Null

    $funcLog = Join-Path $ArtifactRootAbs "FUNC-001.log"
    try {
        $func = Assert-MacRuntimeSmokeArtifacts -RuntimeSmokeArtifactAbs $runtimeSmokeArtifactAbs -LogPath $funcLog
    }
    catch {
        $_ | Out-String | Set-Content -Path $funcLog -Encoding UTF8
        $func = [PSCustomObject]@{
            Category = "Functionality"
            Name = "macOS runtime smoke artifact validation"
            Command = "Validate runtime_smoke_report.json platform and readiness assertions"
            Passed = $false
            Skipped = $false
            ExitCode = 1
            LogPath = $funcLog
            Details = "macOS runtime smoke artifact validation failed."
        }
    }
    $results.Add($func) | Out-Null

    $corLog = Join-Path $ArtifactRootAbs "COR-001.log"
    $cor = Invoke-LoggedCommand `
        -Category "Code Correctness" `
        -Name "Full functional suite" `
        -Executable "pnpm" `
        -Arguments @("test") `
        -WorkingDirectory $ProductAbs `
        -LogPath $corLog
    $results.Add($cor) | Out-Null

    $corLintLog = Join-Path $ArtifactRootAbs "COR-002.log"
    $corLint = Invoke-LoggedCommand `
        -Category "Code Correctness" `
        -Name "Lint checks" `
        -Executable "pnpm" `
        -Arguments @("lint") `
        -WorkingDirectory $ProductAbs `
        -LogPath $corLintLog
    $results.Add($corLint) | Out-Null

    $corTemplateLog = Join-Path $ArtifactRootAbs "COR-003.log"
    $corTemplate = Invoke-LoggedCommand `
        -Category "Code Correctness" `
        -Name "WP template compliance" `
        -Executable $powerShellExecutable `
        -Arguments (Get-PowerShellArguments -FilePath ".gov/repo_scripts/enforce_wp_template_compliance.ps1") `
        -WorkingDirectory $repoRoot `
        -LogPath $corTemplateLog
    $results.Add($corTemplate) | Out-Null

    $redLog = Join-Path $ArtifactRootAbs "RED-001.log"
    $redJsonRel = "$ArtifactRootRel/red_team_result.json"
    $red = Invoke-LoggedCommand `
        -Category "Red-Team" `
        -Name "Guardrail static check" `
        -Executable $powerShellExecutable `
        -Arguments (Get-PowerShellArguments -FilePath ".gov/repo_scripts/red_team_guardrail_check.ps1" -AdditionalArguments @("-CodeRoot", $ProductWorktree, "-OutputJsonPath", $redJsonRel)) `
        -WorkingDirectory $repoRoot `
        -LogPath $redLog
    $results.Add($red) | Out-Null

    $extLog = Join-Path $ArtifactRootAbs "EXT-001.log"
    $ext = Invoke-LoggedCommand `
        -Category "Additional" `
        -Name "Build checks" `
        -Executable "pnpm" `
        -Arguments @("build") `
        -WorkingDirectory $ProductAbs `
        -LogPath $extLog
    $results.Add($ext) | Out-Null

    $extCargoLog = Join-Path $ArtifactRootAbs "EXT-002.log"
    $extCargo = Invoke-LoggedCommand `
        -Category "Additional" `
        -Name "Rust unit tests" `
        -Executable "cargo" `
        -Arguments @("test", "--manifest-path", "src-tauri/Cargo.toml") `
        -WorkingDirectory $ProductAbs `
        -LogPath $extCargoLog
    $results.Add($extCargo) | Out-Null

    Write-ResultBundle `
        -WpId $WpId `
        -ArtifactRootAbs $ArtifactRootAbs `
        -ArtifactRootRel $ArtifactRootRel `
        -LatestArtifactDirAbs $LatestArtifactDirAbs `
        -ProductWorktree $ProductWorktree `
        -Results $results
}

function Get-RemoteWorkflowRun {
    Param(
        [string]$WorkflowPath,
        [string]$Branch,
        [string]$RunTitle
    )

    $runJson = gh run list `
        --repo $RemoteRepo `
        --workflow $WorkflowPath `
        --branch $Branch `
        --event workflow_dispatch `
        --limit 20 `
        --json databaseId,displayTitle,status,conclusion,url,createdAt

    $runs = $runJson | ConvertFrom-Json
    return ($runs | Where-Object { $_.displayTitle -eq $RunTitle } | Select-Object -First 1)
}

function Copy-RemoteProofIntoRepo {
    Param(
        [string]$DownloadRoot,
        [string]$WpArtifactDirAbs
    )

    $downloadedWpRoot = Get-ChildItem -Path $DownloadRoot -Recurse -Directory | Where-Object {
        $_.Name -eq "WP-GOV-PORT-002" -and (Test-Path (Join-Path $_.FullName "latest_result.json") -PathType Leaf)
    } | Select-Object -First 1

    if (-not $downloadedWpRoot) {
        throw "Downloaded artifact did not contain a WP-GOV-PORT-002 proof directory."
    }

    New-Item -Path $WpArtifactDirAbs -ItemType Directory -Force | Out-Null
    foreach ($item in Get-ChildItem -Path $downloadedWpRoot.FullName -Force) {
        Copy-Item -Path $item.FullName -Destination (Join-Path $WpArtifactDirAbs $item.Name) -Recurse -Force
    }

    $latestResultAbs = Join-Path $WpArtifactDirAbs "latest_result.json"
    if (-not (Test-Path $latestResultAbs -PathType Leaf)) {
        throw "Synced proof directory did not contain latest_result.json."
    }

    return (Get-Content $latestResultAbs -Raw | ConvertFrom-Json)
}

function Invoke-RemoteMacCheck {
    Param(
        [string]$WpId,
        [string]$WorkflowPath
    )

    if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
        throw "GitHub CLI (gh) is required to dispatch the hosted macOS smoke workflow."
    }

    $branch = (git branch --show-current).Trim()
    if ([string]::IsNullOrWhiteSpace($branch)) {
        $branch = "main"
    }

    $dispatchToken = Get-Date -Format "yyyyMMdd-HHmmss"
    $runTitle = "WP-GOV-PORT-002 macOS smoke ($dispatchToken)"
    $artifactName = "wp-gov-port-002-$dispatchToken"
    $downloadRoot = Join-Path $repoRoot ".product/build_target/tool_artifacts/wp_runs/$WpId/github_download_$dispatchToken"
    if (Test-Path $downloadRoot) {
        Remove-Item -Path $downloadRoot -Recurse -Force
    }
    New-Item -Path $downloadRoot -ItemType Directory -Force | Out-Null

    gh workflow run $WorkflowPath --repo $RemoteRepo --ref $branch -f "wp_id=$WpId" -f "dispatch_token=$dispatchToken" | Out-Null

    $run = $null
    for ($attempt = 1; $attempt -le 40; $attempt++) {
        Start-Sleep -Seconds 5
        $match = Get-RemoteWorkflowRun -WorkflowPath $WorkflowPath -Branch $branch -RunTitle $runTitle
        if ($match) {
            $run = $match
            break
        }
    }

    if (-not $run) {
        throw "Timed out waiting for the hosted macOS workflow run to appear."
    }

    gh run watch $run.databaseId --repo $RemoteRepo --interval 10 | Out-Null
    $run = gh run view $run.databaseId --repo $RemoteRepo --json conclusion,status,url,displayTitle | ConvertFrom-Json

    try {
        gh run download $run.databaseId --repo $RemoteRepo -n $artifactName -D $downloadRoot | Out-Null
    }
    catch {
        Write-Warning "Artifact download failed for run $($run.url)."
        throw
    }

    $wpArtifactDirAbs = Join-Path $repoRoot ".product/build_target/tool_artifacts/wp_runs/$WpId"
    $latestResult = Copy-RemoteProofIntoRepo -DownloadRoot $downloadRoot -WpArtifactDirAbs $wpArtifactDirAbs

    if (-not $latestResult.OverallPassed -or $run.conclusion -ne "success") {
        throw "Hosted macOS smoke workflow failed. Run URL: $($run.url)"
    }

    Write-Host "Hosted macOS proof synced into $($latestResult.ArtifactPath)"
    Write-Host "Workflow run: $($run.url)"
}

$wpId = "WP-GOV-PORT-002"
$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDirectory "..\..")
$productAbs = Join-Path $repoRoot $ProductWorktree
if (-not (Test-Path $productAbs -PathType Container)) {
    throw "Product worktree not found: $productAbs"
}

if (-not (Test-IsMacOSPlatform)) {
    Invoke-RemoteMacCheck -WpId $wpId -WorkflowPath $RemoteWorkflowPath
    exit 0
}

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$artifactRootRel = ".product/build_target/tool_artifacts/wp_runs/$wpId/$timestamp"
$artifactRootAbs = Join-Path $repoRoot $artifactRootRel
New-Item -Path $artifactRootAbs -ItemType Directory -Force | Out-Null

$latestArtifactDirAbs = Join-Path $repoRoot ".product/build_target/tool_artifacts/wp_runs/$wpId"
if (-not (Test-Path $latestArtifactDirAbs -PathType Container)) {
    New-Item -Path $latestArtifactDirAbs -ItemType Directory -Force | Out-Null
}

Invoke-LocalMacCheck `
    -WpId $wpId `
    -ProductAbs $productAbs `
    -ArtifactRootAbs $artifactRootAbs `
    -ArtifactRootRel $artifactRootRel `
    -LatestArtifactDirAbs $latestArtifactDirAbs

exit 0
