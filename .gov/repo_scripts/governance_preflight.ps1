Param(
    [switch]$WriteLog
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Add-CheckResult {
    Param(
        [System.Collections.Generic.List[object]]$ResultList,
        [string]$Category,
        [string]$Target,
        [bool]$Passed,
        [string]$Details
    )

    $ResultList.Add([PSCustomObject]@{
        Category = $Category
        Target   = $Target
        Passed   = $Passed
        Details  = $Details
    }) | Out-Null
}

$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDirectory "..\..")
$results = New-Object System.Collections.Generic.List[object]

$requiredFiles = @(
    ".gitignore",
    ".gov\REPO_STRUCTURE.md",
    ".gov\Spec\stratatlas_spec_v1_2.md",
    ".gov\Spec\REQUIREMENTS_INDEX.md",
    ".gov\Spec\TRACEABILITY_MATRIX.md",
    ".gov\Spec\SPEC_GOVERNANCE.md",
    ".gov\workflow\ROADMAP.md",
    ".gov\workflow\GOVERNANCE_WORKFLOW.md",
    ".gov\workflow\BUILD_READINESS_CHECKLIST.md",
    ".gov\workflow\taskboard\TASK_BOARD.md",
    "PROJECT_CODEX.md",
    "AGENTS.md",
    "MODEL_BEHAVIOR.md",
    ".gov\templates\WP_TEMPLATE.md",
    ".gov\templates\SUB_SPEC_TEMPLATE.md"
)

$requiredDirectories = @(
    ".gov\workflow\work_packets",
    ".gov\workflow\taskboard",
    ".gov\Spec\sub-specs",
    ".gov\repo_scripts",
    ".gov\templates",
    ".product\Worktrees",
    ".product\Worktrees\wt_main",
    ".product\build_target\Current",
    ".product\build_target\Old versions",
    ".product\build_target\logs",
    ".product\build_target\tool_artifacts"
)

$requiredGitIgnorePatterns = @(
    ".product/build_target/Current/**",
    ".product/build_target/Old versions/**",
    ".product/build_target/logs/**",
    ".product/build_target/tool_artifacts/**",
    ".product/Worktrees/wt_user_*/**"
)

$requiredWorkPackets = @(
    "WP-GOV-MAINT-001",
    "WP-GOV-BUILDREADY-001",
    "WP-I0-001",
    "WP-I1-001",
    "WP-I2-001",
    "WP-I3-001",
    "WP-I4-001",
    "WP-I5-001",
    "WP-I6-001",
    "WP-I7-001",
    "WP-I8-001",
    "WP-I9-001",
    "WP-I10-001"
)

$requiredSubSpecs = @(
    "I0_walking_skeleton.md",
    "I1_layers_time_replay.md",
    "I2_baseline_delta_briefing.md",
    "I3_collaboration_crdt_replay.md",
    "I4_scenario_modeling_constraints.md",
    "I5_query_builder_versioned_queries.md",
    "I6_ai_gateway_mcp.md",
    "I7_context_intake_first_domains.md",
    "I8_context_deviation_infrastructure.md",
    "I9_osint_economic_context_queries.md",
    "I10_strategic_game_modeling.md"
)

foreach ($relativePath in $requiredFiles) {
    $absolutePath = Join-Path $repoRoot $relativePath
    $exists = Test-Path $absolutePath -PathType Leaf
    Add-CheckResult -ResultList $results -Category "File" -Target $relativePath -Passed $exists -Details ($(if ($exists) { "Present" } else { "Missing required file" }))
}

foreach ($relativePath in $requiredDirectories) {
    $absolutePath = Join-Path $repoRoot $relativePath
    $exists = Test-Path $absolutePath -PathType Container
    Add-CheckResult -ResultList $results -Category "Directory" -Target $relativePath -Passed $exists -Details ($(if ($exists) { "Present" } else { "Missing required directory" }))
}

$workPacketDirectory = Join-Path $repoRoot ".gov\workflow\work_packets"
if (Test-Path $workPacketDirectory -PathType Container) {
    $workPacketFiles = Get-ChildItem -Path $workPacketDirectory -File | Select-Object -ExpandProperty Name
    foreach ($packetId in $requiredWorkPackets) {
        $match = $workPacketFiles | Where-Object { $_ -like "$packetId*" }
        $isPresent = $null -ne $match
        Add-CheckResult -ResultList $results -Category "WorkPacket" -Target $packetId -Passed $isPresent -Details ($(if ($isPresent) { "Work packet file found" } else { "No file starting with $packetId" }))
    }
}
else {
    Add-CheckResult -ResultList $results -Category "WorkPacket" -Target "work_packets directory" -Passed $false -Details "Cannot validate work packets; directory missing"
}

$subSpecDirectory = Join-Path $repoRoot ".gov\Spec\sub-specs"
if (Test-Path $subSpecDirectory -PathType Container) {
    foreach ($subSpecFileName in $requiredSubSpecs) {
        $subSpecPath = Join-Path $subSpecDirectory $subSpecFileName
        $isPresent = Test-Path $subSpecPath -PathType Leaf
        Add-CheckResult -ResultList $results -Category "SubSpec" -Target $subSpecFileName -Passed $isPresent -Details ($(if ($isPresent) { "Present" } else { "Missing required sub-spec stub" }))
    }
}
else {
    Add-CheckResult -ResultList $results -Category "SubSpec" -Target "sub-specs directory" -Passed $false -Details "Cannot validate sub-spec stubs; directory missing"
}

$taskBoardPath = Join-Path $repoRoot ".gov\workflow\taskboard\TASK_BOARD.md"
if (Test-Path $taskBoardPath -PathType Leaf) {
    $taskBoardContent = Get-Content -Raw $taskBoardPath
    foreach ($packetId in $requiredWorkPackets) {
        $containsPacket = $taskBoardContent -match [regex]::Escape($packetId)
        Add-CheckResult -ResultList $results -Category "TaskBoard" -Target $packetId -Passed $containsPacket -Details ($(if ($containsPacket) { "Referenced in TASK_BOARD.md" } else { "Missing row/reference in TASK_BOARD.md" }))
    }
}
else {
    Add-CheckResult -ResultList $results -Category "TaskBoard" -Target "TASK_BOARD.md" -Passed $false -Details "Task board file missing"
}

$gitIgnorePath = Join-Path $repoRoot ".gitignore"
if (Test-Path $gitIgnorePath -PathType Leaf) {
    $gitIgnoreContent = Get-Content -Raw $gitIgnorePath
    foreach ($pattern in $requiredGitIgnorePatterns) {
        $containsPattern = $gitIgnoreContent -match [regex]::Escape($pattern)
        Add-CheckResult -ResultList $results -Category "GitIgnore" -Target $pattern -Passed $containsPattern -Details ($(if ($containsPattern) { "Pattern present" } else { "Missing pattern in .gitignore" }))
    }
}
else {
    Add-CheckResult -ResultList $results -Category "GitIgnore" -Target ".gitignore" -Passed $false -Details ".gitignore missing"
}

$totalChecks = $results.Count
$failedChecks = @($results | Where-Object { -not $_.Passed }).Count
$passedChecks = $totalChecks - $failedChecks

Write-Host "StratAtlas Governance Preflight"
Write-Host "Repo root: $repoRoot"
Write-Host "Checks: $passedChecks passed / $failedChecks failed / $totalChecks total"

if ($failedChecks -gt 0) {
    Write-Host ""
    Write-Host "Failed checks:"
    $results | Where-Object { -not $_.Passed } | ForEach-Object {
        Write-Host " - [$($_.Category)] $($_.Target): $($_.Details)"
    }
}
else {
    Write-Host "All required governance and build-readiness checks passed."
}

if ($WriteLog) {
    $logDirectory = Join-Path $repoRoot ".product\build_target\logs"
    if (-not (Test-Path $logDirectory -PathType Container)) {
        New-Item -Path $logDirectory -ItemType Directory -Force | Out-Null
    }

    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $logPath = Join-Path $logDirectory "governance_preflight_$timestamp.log"

    $header = @(
        "StratAtlas Governance Preflight"
        "Timestamp: $(Get-Date -Format o)"
        "Repo root: $repoRoot"
        "Checks: $passedChecks passed / $failedChecks failed / $totalChecks total"
        ""
    )

    $failureLines = $results | ForEach-Object {
        "[{0}] {1} | Passed={2} | {3}" -f $_.Category, $_.Target, $_.Passed, $_.Details
    }

    ($header + $failureLines) | Set-Content -Path $logPath -Encoding UTF8
    Write-Host "Log written to: $logPath"
}

if ($failedChecks -gt 0) {
    exit 1
}

exit 0
