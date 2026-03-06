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

function Normalize-RelativePath {
    Param([string]$PathValue)

    $normalized = $PathValue.Trim()
    $normalized = $normalized.Replace('`', "")
    $normalized = $normalized.Replace("'", "")
    $normalized = $normalized.Replace('"', "")
    $normalized = $normalized.Replace('\', "/")
    if ($normalized.StartsWith("./")) {
        $normalized = $normalized.Substring(2)
    }
    return $normalized.Trim()
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
    ".gov\Spec\PRIMITIVES_INDEX.md",
    ".gov\Spec\PRIMITIVES_MATRIX.md",
    ".gov\Spec\SPEC_GOVERNANCE.md",
    ".gov\Spec\TECH_STACK.md",
    ".gov\workflow\ROADMAP.md",
    ".gov\workflow\GOVERNANCE_WORKFLOW.md",
    ".gov\workflow\BUILD_READINESS_CHECKLIST.md",
    ".gov\workflow\taskboard\TASK_BOARD.md",
    ".gov\workflow\wp_test_suites\README.md",
    ".gov\workflow\wp_spec_extractions\README.md",
    ".gov\workflow\wp_checks\README.md",
    "PROJECT_CODEX.md",
    "AGENTS.md",
    "MODEL_BEHAVIOR.md",
    ".gov\templates\WP_TEMPLATE.md",
    ".gov\templates\WP_TEST_SUITE_TEMPLATE.md",
    ".gov\templates\WP_SPEC_EXTRACT_TEMPLATE.md",
    ".gov\templates\WP_CHECK_SCRIPT_TEMPLATE.ps1",
    ".gov\templates\SUB_SPEC_TEMPLATE.md",
    ".gov\repo_scripts\new_work_packet.ps1",
    ".gov\repo_scripts\governance_checkpoint_commit.ps1",
    ".gov\repo_scripts\governance_preflight.ps1",
    ".gov\repo_scripts\run_wp_checks.ps1",
    ".gov\repo_scripts\run_wp_loop.ps1",
    ".gov\repo_scripts\update_wp_spec_extract.ps1",
    ".gov\repo_scripts\bootstrap_wp_loop_assets.ps1",
    ".gov\repo_scripts\red_team_guardrail_check.ps1",
    ".gov\repo_scripts\enforce_wp_template_compliance.ps1"
)

$requiredDirectories = @(
    ".gov\workflow\work_packets",
    ".gov\workflow\wp_test_suites",
    ".gov\workflow\wp_spec_extractions",
    ".gov\workflow\wp_checks",
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
    "WP-GOV-PERFPORT-001",
    "WP-GOV-ITER-ACTIVE-001",
    "WP-GOV-LOOP-001",
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

$requiredIterationWorkPackets = @(
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

$requiredWpHeadings = @(
    "## Linked Requirements",
    "## Linked Primitives",
    "## Primitive Matrix Impact",
    "## Expected Files Touched",
    "## Interconnection Plan",
    "## Spec-Test Coverage Plan",
    "## Checkpoint Commit Plan",
    "## Proof of Implementation",
    "## Evidence"
)

$requiredSuiteHeadings = @(
    "## Test Case Matrix",
    "## Dependency and Environment Tests",
    "## UI Contract Tests",
    "## Functional Flow Tests",
    "## Code Correctness Tests",
    "## Red-Team and Abuse Tests",
    "## Additional Tests",
    "## Automation Hook",
    "## Execution Summary"
)

$allowedWpStatuses = @(
    "SPEC-MAPPED",
    "IN-PROGRESS",
    "IMPLEMENTED",
    "E2E-VERIFIED",
    "SUPERSEDED",
    "BLOCKED",
    "RECURRING"
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
$workPacketFiles = @()
if (Test-Path $workPacketDirectory -PathType Container) {
    $workPacketFiles = Get-ChildItem -Path $workPacketDirectory -Filter "WP-*.md" -File
    $workPacketNames = $workPacketFiles | Select-Object -ExpandProperty Name

    foreach ($packetId in $requiredWorkPackets) {
        $match = $workPacketNames | Where-Object { $_ -like "$packetId*" }
        $isPresent = $null -ne $match
        Add-CheckResult -ResultList $results -Category "WorkPacket" -Target $packetId -Passed $isPresent -Details ($(if ($isPresent) { "Work packet file found" } else { "No file starting with $packetId" }))
    }
}
else {
    Add-CheckResult -ResultList $results -Category "WorkPacket" -Target "work_packets directory" -Passed $false -Details "Cannot validate work packets; directory missing"
}

$traceabilityPath = Join-Path $repoRoot ".gov\Spec\TRACEABILITY_MATRIX.md"
$traceabilityRaw = if (Test-Path $traceabilityPath -PathType Leaf) { Get-Content -Raw $traceabilityPath } else { "" }
$primitivesIndexPath = Join-Path $repoRoot ".gov\Spec\PRIMITIVES_INDEX.md"
$primitivesIndexRaw = if (Test-Path $primitivesIndexPath -PathType Leaf) { Get-Content -Raw $primitivesIndexPath } else { "" }
$primitivesMatrixPath = Join-Path $repoRoot ".gov\Spec\PRIMITIVES_MATRIX.md"
$primitivesMatrixRaw = if (Test-Path $primitivesMatrixPath -PathType Leaf) { Get-Content -Raw $primitivesMatrixPath } else { "" }

$wpPrimitiveMap = @{}

foreach ($wpFile in $workPacketFiles) {
    $raw = Get-Content -Raw $wpFile.FullName
    $idMatch = [regex]::Match($raw, '(?m)^#\s+(WP-[A-Z0-9-]+)\s+-')
    if (-not $idMatch.Success) {
        Add-CheckResult -ResultList $results -Category "WP-Format" -Target $wpFile.Name -Passed $false -Details "Missing or invalid H1 WP identifier"
        continue
    }

    $wpId = $idMatch.Groups[1].Value
    $statusMatch = [regex]::Match($raw, '(?m)^Status:\s*(.+)$')
    if (-not $statusMatch.Success) {
        Add-CheckResult -ResultList $results -Category "WP-Status" -Target $wpId -Passed $false -Details "Missing Status field"
    }
    else {
        $statusValue = $statusMatch.Groups[1].Value.Trim()
        $statusValid = $allowedWpStatuses -contains $statusValue
        Add-CheckResult -ResultList $results -Category "WP-Status" -Target $wpId -Passed $statusValid -Details ($(if ($statusValid) { "Status is valid ($statusValue)" } else { "Invalid status '$statusValue'" }))
    }

    if ($wpId -like "WP-I*-*") {
        foreach ($heading in $requiredWpHeadings) {
            $present = $raw -match [regex]::Escape($heading)
            Add-CheckResult -ResultList $results -Category "WP-Skeleton" -Target "$wpId :: $heading" -Passed $present -Details ($(if ($present) { "Present" } else { "Missing required WP section" }))
        }

        $expectedFileAnchors = @(
            ".gov/Spec/REQUIREMENTS_INDEX.md",
            ".gov/Spec/TRACEABILITY_MATRIX.md",
            ".gov/Spec/PRIMITIVES_INDEX.md",
            ".gov/Spec/PRIMITIVES_MATRIX.md",
            ".gov/workflow/taskboard/TASK_BOARD.md",
            ".gov/workflow/wp_spec_extractions/",
            ".gov/workflow/wp_checks/"
        )
        foreach ($anchor in $expectedFileAnchors) {
            $present = $raw -match [regex]::Escape($anchor)
            Add-CheckResult -ResultList $results -Category "WP-ExpectedFiles" -Target "$wpId :: $anchor" -Passed $present -Details ($(if ($present) { "Present in Expected Files Touched" } else { "Missing expected file reference" }))
        }

        $primitiveMatches = @([regex]::Matches($raw, 'PRIM-\d{4}') | ForEach-Object { $_.Value } | Sort-Object -Unique)
        $hasPrimitives = $primitiveMatches.Count -gt 0
        Add-CheckResult -ResultList $results -Category "WP-Primitives" -Target $wpId -Passed $hasPrimitives -Details ($(if ($hasPrimitives) { "Linked primitive IDs found" } else { "No primitive IDs found in WP" }))

        $wpPrimitiveMap[$wpId] = @($primitiveMatches)

        $suiteMatch = [regex]::Match($raw, '(?m)^Linked Test Suite:\s*(.+)$')
        if (-not $suiteMatch.Success) {
            Add-CheckResult -ResultList $results -Category "WP-TestSuite" -Target $wpId -Passed $false -Details "Missing Linked Test Suite field"
            continue
        }

        $suiteRelPath = Normalize-RelativePath -PathValue $suiteMatch.Groups[1].Value
        $suiteAbsPath = Join-Path $repoRoot ($suiteRelPath.Replace("/", "\"))
        $suiteExists = Test-Path $suiteAbsPath -PathType Leaf
        Add-CheckResult -ResultList $results -Category "WP-TestSuite" -Target "$wpId -> $suiteRelPath" -Passed $suiteExists -Details ($(if ($suiteExists) { "Linked suite exists" } else { "Linked suite file missing" }))

        $expectedSuiteRel = ".gov/workflow/wp_test_suites/TS-$wpId.md"
        $suitePathMatches = $suiteRelPath -ieq $expectedSuiteRel
        Add-CheckResult -ResultList $results -Category "WP-TestSuite" -Target "$wpId expected suite path" -Passed $suitePathMatches -Details ($(if ($suitePathMatches) { "Suite naming is canonical" } else { "Expected $expectedSuiteRel" }))
    }
}

$suiteDirectory = Join-Path $repoRoot ".gov\workflow\wp_test_suites"
$suiteFiles = @()
if (Test-Path $suiteDirectory -PathType Container) {
    $suiteFiles = Get-ChildItem -Path $suiteDirectory -Filter "TS-WP-*.md" -File
}

foreach ($suiteFile in $suiteFiles) {
    $suiteRaw = Get-Content -Raw $suiteFile.FullName
    $nameMatch = [regex]::Match($suiteFile.Name, '^TS-(WP-[A-Z0-9-]+)\.md$')
    if (-not $nameMatch.Success) {
        Add-CheckResult -ResultList $results -Category "Suite-Format" -Target $suiteFile.Name -Passed $false -Details "Suite filename does not follow TS-WP-*.md"
        continue
    }

    $expectedWpId = $nameMatch.Groups[1].Value
    $linkedMatch = [regex]::Match($suiteRaw, '(?m)^Linked Work Packet:\s*(.+)$')
    if (-not $linkedMatch.Success) {
        Add-CheckResult -ResultList $results -Category "Suite-Link" -Target $suiteFile.Name -Passed $false -Details "Missing Linked Work Packet field"
    }
    else {
        $linkedWpId = Normalize-RelativePath -PathValue $linkedMatch.Groups[1].Value
        $linkedWpId = $linkedWpId.Trim()
        $linkMatches = $linkedWpId -eq $expectedWpId
        Add-CheckResult -ResultList $results -Category "Suite-Link" -Target $suiteFile.Name -Passed $linkMatches -Details ($(if ($linkMatches) { "Linked WP matches filename" } else { "Linked WP '$linkedWpId' does not match expected '$expectedWpId'" }))
    }

    foreach ($heading in $requiredSuiteHeadings) {
        $present = $suiteRaw -match [regex]::Escape($heading)
        Add-CheckResult -ResultList $results -Category "Suite-Skeleton" -Target "$($suiteFile.Name) :: $heading" -Passed $present -Details ($(if ($present) { "Present" } else { "Missing required suite section" }))
    }

    $requiredCaseIds = @("DEP-001", "UI-001", "FUNC-001", "COR-001", "RED-001", "EXT-001")
    foreach ($caseId in $requiredCaseIds) {
        $present = $suiteRaw -match ("(?m)^\|\s*" + [regex]::Escape($caseId) + "\s*\|")
        Add-CheckResult -ResultList $results -Category "Suite-Cases" -Target "$($suiteFile.Name) :: $caseId" -Passed $present -Details ($(if ($present) { "Present in test case matrix" } else { "Missing required test category case" }))
    }
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
        $rowMatch = [regex]::Match($taskBoardContent, "(?m)^\|\s*" + [regex]::Escape($packetId) + "\s*\|.+$")
        $containsPacket = $rowMatch.Success
        Add-CheckResult -ResultList $results -Category "TaskBoard" -Target $packetId -Passed $containsPacket -Details ($(if ($containsPacket) { "Referenced in TASK_BOARD.md" } else { "Missing row/reference in TASK_BOARD.md" }))

        if ($containsPacket -and ($requiredIterationWorkPackets -contains $packetId)) {
            $hasSuiteLink = $rowMatch.Value -match ("TS-" + [regex]::Escape($packetId) + "\.md")
            Add-CheckResult -ResultList $results -Category "TaskBoardSuite" -Target $packetId -Passed $hasSuiteLink -Details ($(if ($hasSuiteLink) { "Task board row links suite" } else { "Task board row missing canonical suite link" }))
        }
    }

    $legendMatches = [regex]::Matches($taskBoardContent, '(?m)^-\s+`?([A-Z0-9-]+)`?\s*$')
    $legendValues = @($legendMatches | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique)
    foreach ($status in $allowedWpStatuses) {
        $hasLegend = $legendValues -contains $status
        Add-CheckResult -ResultList $results -Category "TaskBoardStatusLegend" -Target $status -Passed $hasLegend -Details ($(if ($hasLegend) { "Status legend contains $status" } else { "Task board status legend missing $status" }))
    }
}
else {
    Add-CheckResult -ResultList $results -Category "TaskBoard" -Target "TASK_BOARD.md" -Passed $false -Details "Task board file missing"
}

$roadmapPath = Join-Path $repoRoot ".gov\workflow\ROADMAP.md"
if (Test-Path $roadmapPath -PathType Leaf) {
    $roadmapContent = Get-Content -Raw $roadmapPath

    foreach ($packetId in $requiredIterationWorkPackets) {
        $containsPacket = $roadmapContent -match [regex]::Escape($packetId)
        Add-CheckResult -ResultList $results -Category "Roadmap" -Target $packetId -Passed $containsPacket -Details ($(if ($containsPacket) { "Referenced in ROADMAP.md" } else { "Missing iteration work packet link in ROADMAP.md" }))
    }

    foreach ($subSpecFileName in $requiredSubSpecs) {
        $containsSubSpec = $roadmapContent -match [regex]::Escape($subSpecFileName)
        Add-CheckResult -ResultList $results -Category "RoadmapSubSpec" -Target $subSpecFileName -Passed $containsSubSpec -Details ($(if ($containsSubSpec) { "Referenced in ROADMAP.md" } else { "Missing sub-spec link in ROADMAP.md" }))
    }
}
else {
    Add-CheckResult -ResultList $results -Category "Roadmap" -Target "ROADMAP.md" -Passed $false -Details "Roadmap file missing"
}

if ($traceabilityRaw) {
    $hasWpCoverageSection = $traceabilityRaw -match [regex]::Escape("## Work Packet Coverage and Primitive Links")
    Add-CheckResult -ResultList $results -Category "TraceabilityCoverage" -Target "WP coverage section" -Passed $hasWpCoverageSection -Details ($(if ($hasWpCoverageSection) { "Present" } else { "Missing WP coverage section" }))

    foreach ($packetId in $requiredIterationWorkPackets) {
        $hasWpRow = $traceabilityRaw -match ("(?m)^\|\s*" + [regex]::Escape($packetId) + "\s*\|")
        Add-CheckResult -ResultList $results -Category "TraceabilityCoverage" -Target $packetId -Passed $hasWpRow -Details ($(if ($hasWpRow) { "WP row present in traceability coverage" } else { "Missing WP row in traceability coverage section" }))
    }
}
else {
    Add-CheckResult -ResultList $results -Category "TraceabilityCoverage" -Target "TRACEABILITY_MATRIX.md" -Passed $false -Details "Traceability matrix missing; cannot validate WP coverage"
}

if ($primitivesIndexRaw) {
    $hasRows = $primitivesIndexRaw -match '(?m)^\|\s*PRIM-\d{4}\s*\|'
    Add-CheckResult -ResultList $results -Category "PrimitivesIndex" -Target "PRIMITIVES_INDEX.md rows" -Passed $hasRows -Details ($(if ($hasRows) { "Primitive rows found" } else { "No primitive rows found" }))
}
else {
    Add-CheckResult -ResultList $results -Category "PrimitivesIndex" -Target "PRIMITIVES_INDEX.md" -Passed $false -Details "Primitives index missing; cannot validate primitive links"
}

if ($primitivesMatrixRaw) {
    $hasRows = $primitivesMatrixRaw -match '(?m)^\|\s*PRIM-\d{4}\s*\|'
    Add-CheckResult -ResultList $results -Category "PrimitivesMatrix" -Target "PRIMITIVES_MATRIX.md rows" -Passed $hasRows -Details ($(if ($hasRows) { "Primitive matrix rows found" } else { "No primitive matrix rows found" }))
}
else {
    Add-CheckResult -ResultList $results -Category "PrimitivesMatrix" -Target "PRIMITIVES_MATRIX.md" -Passed $false -Details "Primitives matrix missing; cannot validate primitive links"
}

foreach ($wpId in $wpPrimitiveMap.Keys) {
    foreach ($primId in $wpPrimitiveMap[$wpId]) {
        $inIndex = $primitivesIndexRaw -match ("(?m)^\|\s*" + [regex]::Escape($primId) + "\s*\|")
        Add-CheckResult -ResultList $results -Category "PrimitivesIndexLink" -Target "$wpId -> $primId" -Passed $inIndex -Details ($(if ($inIndex) { "Primitive exists in index" } else { "Primitive missing from PRIMITIVES_INDEX.md" }))

        $inMatrix = $primitivesMatrixRaw -match ("(?m)^\|\s*" + [regex]::Escape($primId) + "\s*\|\s*" + [regex]::Escape($wpId) + "\s*\|")
        Add-CheckResult -ResultList $results -Category "PrimitivesMatrixLink" -Target "$wpId -> $primId" -Passed $inMatrix -Details ($(if ($inMatrix) { "Primitive-WP link exists in matrix" } else { "Missing primitive-WP row in PRIMITIVES_MATRIX.md" }))
    }
}

$requirementsIndexPath = Join-Path $repoRoot ".gov\Spec\REQUIREMENTS_INDEX.md"
if (Test-Path $requirementsIndexPath -PathType Leaf) {
    $requirementsRaw = Get-Content -Raw $requirementsIndexPath
    $mentionsDoneStatus = $requirementsRaw -match [regex]::Escape("E2E-VERIFIED")
    Add-CheckResult -ResultList $results -Category "RequirementsStatusModel" -Target "E2E-VERIFIED" -Passed $mentionsDoneStatus -Details ($(if ($mentionsDoneStatus) { "Status model includes E2E-VERIFIED" } else { "Status model missing E2E-VERIFIED" }))

    $legacyVerifiedPresent = $requirementsRaw -match '(?m)\|\s*VERIFIED\s*\|'
    Add-CheckResult -ResultList $results -Category "RequirementsStatusModel" -Target "Legacy VERIFIED status removed" -Passed (-not $legacyVerifiedPresent) -Details ($(if ($legacyVerifiedPresent) { "Legacy VERIFIED status still present" } else { "No legacy VERIFIED rows found" }))
}

$guidanceFiles = @(
    "AGENTS.md",
    "PROJECT_CODEX.md",
    "MODEL_BEHAVIOR.md"
)
foreach ($guidanceFile in $guidanceFiles) {
    $guidancePath = Join-Path $repoRoot $guidanceFile
    if (-not (Test-Path $guidancePath -PathType Leaf)) {
        continue
    }

    $guidanceRaw = Get-Content -Raw $guidancePath
    $mustContain = @(
        "E2E-VERIFIED",
        "PRIMITIVES_INDEX.md",
        "PRIMITIVES_MATRIX.md",
        "wp_test_suites",
        "wp_spec_extractions",
        "wp_checks",
        "proof"
    )
    foreach ($requiredToken in $mustContain) {
        $hasToken = $guidanceRaw -match [regex]::Escape($requiredToken)
        Add-CheckResult -ResultList $results -Category "GuidanceSync" -Target "$guidanceFile :: $requiredToken" -Passed $hasToken -Details ($(if ($hasToken) { "Present" } else { "Missing governance token in guidance file" }))
    }
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

$templateComplianceScript = Join-Path $repoRoot ".gov\repo_scripts\enforce_wp_template_compliance.ps1"
if (Test-Path $templateComplianceScript -PathType Leaf) {
    & $templateComplianceScript
    $templateExit = $LASTEXITCODE
    $templatePassed = $templateExit -eq 0
    Add-CheckResult -ResultList $results -Category "TemplateCompliance" -Target "enforce_wp_template_compliance.ps1" -Passed $templatePassed -Details ($(if ($templatePassed) { "WP template compliance passed" } else { "WP template compliance failed" }))
}
else {
    Add-CheckResult -ResultList $results -Category "TemplateCompliance" -Target "enforce_wp_template_compliance.ps1" -Passed $false -Details "Missing compliance script"
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

    $checkLines = $results | ForEach-Object {
        "[{0}] {1} | Passed={2} | {3}" -f $_.Category, $_.Target, $_.Passed, $_.Details
    }

    ($header + $checkLines) | Set-Content -Path $logPath -Encoding UTF8
    Write-Host "Log written to: $logPath"
}

if ($failedChecks -gt 0) {
    exit 1
}

exit 0
