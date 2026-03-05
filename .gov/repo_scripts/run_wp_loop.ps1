Param(
    [string]$WpId,
    [switch]$AllFromTaskBoard,
    [switch]$SkipDependencyInstall,
    [switch]$SkipPreflight,
    [switch]$CheckpointCommit,
    [string]$CheckpointMessagePrefix = "chore: wp proof refresh"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Get-ActiveWpIdsFromTaskBoard {
    Param([string]$TaskBoardPath)

    $ids = New-Object System.Collections.Generic.List[string]
    $lines = Get-Content $TaskBoardPath
    foreach ($line in $lines) {
        if ($line -notmatch '^\|\s*WP-[A-Z0-9-]+\s*\|') {
            continue
        }

        $cells = $line.Trim() -replace '^\|', '' -replace '\|$', ''
        $parts = $cells.Split('|') | ForEach-Object { $_.Trim() }
        if ($parts.Count -lt 5) {
            continue
        }

        $currentId = $parts[0]
        $status = $parts[4]
        if ($status -in @("E2E-VERIFIED", "BLOCKED")) {
            continue
        }
        $ids.Add($currentId) | Out-Null
    }
    return @($ids | Sort-Object -Unique)
}

$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDirectory "..\..")

if (-not $SkipPreflight) {
    & (Join-Path $scriptDirectory "governance_preflight.ps1")
    if ($LASTEXITCODE -ne 0) {
        throw "governance_preflight.ps1 failed."
    }
}

& (Join-Path $scriptDirectory "bootstrap_wp_loop_assets.ps1")
if ($LASTEXITCODE -ne 0) {
    throw "bootstrap_wp_loop_assets.ps1 failed."
}

$targetWpIds = @()
if ($AllFromTaskBoard) {
    $taskBoardPath = Join-Path $repoRoot ".gov/workflow/taskboard/TASK_BOARD.md"
    $targetWpIds = Get-ActiveWpIdsFromTaskBoard -TaskBoardPath $taskBoardPath
}
elseif (-not [string]::IsNullOrWhiteSpace($WpId)) {
    $targetWpIds = @($WpId)
}
else {
    throw "Provide -WpId or use -AllFromTaskBoard."
}

$runnerScript = Join-Path $scriptDirectory "run_wp_checks.ps1"
$success = New-Object System.Collections.Generic.List[string]
$failed = New-Object System.Collections.Generic.List[string]

foreach ($targetWpId in $targetWpIds) {
    Write-Host "Running WP loop checks for $targetWpId"
    & $runnerScript -WpId $targetWpId -SkipDependencyInstall:$SkipDependencyInstall
    if ($LASTEXITCODE -eq 0) {
        $success.Add($targetWpId) | Out-Null
    }
    else {
        $failed.Add($targetWpId) | Out-Null
    }
}

Write-Host ""
Write-Host "WP loop run summary:"
Write-Host "Passed: $($success.Count)"
Write-Host "Failed: $($failed.Count)"

if ($success.Count -gt 0) {
    Write-Host "Successful WPs: $($success -join ', ')"
}
if ($failed.Count -gt 0) {
    Write-Host "Failed WPs: $($failed -join ', ')"
}

if ($CheckpointCommit) {
    $gitStatus = git -C $repoRoot status --porcelain
    if ($gitStatus) {
        $checkpointScript = Join-Path $scriptDirectory "governance_checkpoint_commit.ps1"
        $message = "$CheckpointMessagePrefix ($((Get-Date -Format 'yyyy-MM-dd')))"
        & $checkpointScript -Message $message
    }
}

if ($failed.Count -gt 0) {
    exit 1
}

exit 0

