Param(
    [Parameter(Mandatory = $true)]
    [string]$WpId,

    [Parameter(Mandatory = $true)]
    [string]$Iteration,

    [Parameter(Mandatory = $true)]
    [string]$Title,

    [Parameter(Mandatory = $true)]
    [string[]]$Requirements,

    [Parameter(Mandatory = $true)]
    [string[]]$PrimitiveIds,

    [string]$SubSpecPath = ".gov/Spec/sub-specs/<fill>.md",
    [string]$Owner = "Unassigned",
    [string]$Status = "SPEC-MAPPED",
    [string[]]$ExpectedFiles = @(
        ".gov/Spec/stratatlas_spec_v1_2.md",
        ".gov/Spec/REQUIREMENTS_INDEX.md",
        ".gov/Spec/TRACEABILITY_MATRIX.md",
        ".gov/Spec/PRIMITIVES_INDEX.md",
        ".gov/Spec/PRIMITIVES_MATRIX.md",
        ".gov/workflow/taskboard/TASK_BOARD.md",
        ".gov/workflow/work_packets/<this_wp>.md",
        ".gov/workflow/wp_test_suites/<linked_test_suite>.md",
        ".product/Worktrees/wt_main/src/<implementation_files>"
    ),
    [switch]$SkipCheckpointCommit
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Get-Slug {
    Param([string]$InputText)
    $slug = $InputText.ToLowerInvariant()
    $slug = [regex]::Replace($slug, "[^a-z0-9]+", "-")
    $slug = $slug.Trim("-")
    if ([string]::IsNullOrWhiteSpace($slug)) {
        throw "Could not generate slug from title '$InputText'."
    }
    return $slug
}

function Ensure-TableRow {
    Param(
        [string]$Path,
        [string]$RowPrefix,
        [string]$RowValue,
        [string]$AnchorHeader
    )

    $lines = Get-Content $Path
    if ($lines | Where-Object { $_ -like "$RowPrefix*" }) {
        return
    }

    $anchorIndex = -1
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -eq $AnchorHeader) {
            $anchorIndex = $i
            break
        }
    }

    if ($anchorIndex -lt 0) {
        Add-Content -Path $Path -Value ""
        Add-Content -Path $Path -Value $RowValue
        return
    }

    $insertIndex = $lines.Count
    for ($i = $anchorIndex + 1; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -eq "---") {
            $insertIndex = $i
            break
        }
    }

    $newLines = @()
    $newLines += $lines[0..($insertIndex - 1)]
    $newLines += $RowValue
    if ($insertIndex -lt $lines.Count) {
        $newLines += $lines[$insertIndex..($lines.Count - 1)]
    }
    [System.IO.File]::WriteAllText($Path, ($newLines -join "`r`n") + "`r`n", [System.Text.UTF8Encoding]::new($false))
}

if ($WpId -notmatch '^WP-(GOV|I\d+)-\d{3}$') {
    throw "WpId must match WP-(GOV|I<digit+>)-NNN. Example: WP-I3-002"
}

$allowedStatuses = @("SPEC-MAPPED", "IN-PROGRESS", "IMPLEMENTED", "E2E-VERIFIED", "BLOCKED", "RECURRING")
if ($allowedStatuses -notcontains $Status) {
    throw "Status '$Status' is invalid. Allowed: $($allowedStatuses -join ', ')"
}

$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDirectory "..\..")

$workPacketDir = Join-Path $repoRoot ".gov/workflow/work_packets"
$suiteDir = Join-Path $repoRoot ".gov/workflow/wp_test_suites"
$taskBoardPath = Join-Path $repoRoot ".gov/workflow/taskboard/TASK_BOARD.md"
$tracePath = Join-Path $repoRoot ".gov/Spec/TRACEABILITY_MATRIX.md"
$primitiveIndexPath = Join-Path $repoRoot ".gov/Spec/PRIMITIVES_INDEX.md"
$primitiveMatrixPath = Join-Path $repoRoot ".gov/Spec/PRIMITIVES_MATRIX.md"

$today = Get-Date -Format "yyyy-MM-dd"
$slug = Get-Slug -InputText $Title
$wpFileName = "{0}_{1}.md" -f $WpId, $slug
$wpPath = Join-Path $workPacketDir $wpFileName
$suiteFileName = "TS-{0}.md" -f $WpId
$suitePath = Join-Path $suiteDir $suiteFileName

if (Test-Path $wpPath -PathType Leaf) {
    throw "Work packet already exists: $wpPath"
}

$reqBullets = ($Requirements | ForEach-Object { "- $_" }) -join "`r`n"
$primBullets = ($PrimitiveIds | ForEach-Object { "- $_ | <name> | <reason>" }) -join "`r`n"
$expectedBullets = ($ExpectedFiles | ForEach-Object { "- $_" }) -join "`r`n"

$wpContent = @"
# $WpId - $Title

Date Opened: $today
Status: $Status
Iteration: $Iteration
Workflow Version: 2.0
Linked Test Suite: .gov/workflow/wp_test_suites/$suiteFileName

## Intent

<1-3 sentence outcome statement>

## Linked Requirements

$reqBullets

## Linked Primitives

$primBullets

## Primitive Matrix Impact

- Add/update rows in `.gov/Spec/PRIMITIVES_MATRIX.md` for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## In Scope

- <item 1>
- <item 2>

## Out of Scope

- <item 1>
- <item 2>

## Expected Files Touched

$expectedBullets

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| <primitive> | <feature/tool> | <tech> | <why this combination matters> |

## Spec-Test Coverage Plan

### Dependency and Environment Tests
- [ ] Dependency graph/lock integrity tests
- [ ] Runtime compatibility checks

### UI Contract Tests
- [ ] Required regions/modes/states
- [ ] Error/degraded-state UX

### Functional Flow Tests
- [ ] Golden flow and edge cases
- [ ] Persistence/replay/export flows

### Code Correctness Tests
- [ ] Unit tests
- [ ] Integration tests
- [ ] Static analysis (lint/type/schema)

### Red-Team and Abuse Tests
- [ ] Non-goal enforcement (spec section 3.2)
- [ ] Policy bypass scenarios
- [ ] Adversarial/invalid input cases

### Additional Tests
- [ ] Performance budgets
- [ ] Offline behavior
- [ ] Reliability/recovery

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Exit Criteria

- Task board and requirements index statuses are synchronized.
- Traceability, primitives index, and primitives matrix are synchronized.
- Linked test suite has executed results and evidence paths.
- Evidence bundle is attached.
- User Sign-off: APPROVED.

## Evidence

- Test Suite Execution:
- Logs:
- Screenshots/Exports:
- Build Artifacts:
- User Sign-off:

## Progress Log

- $today: WP scaffold created via `.gov/repo_scripts/new_work_packet.ps1`.
"@

[System.IO.File]::WriteAllText($wpPath, $wpContent + "`r`n", [System.Text.UTF8Encoding]::new($false))

$suiteReq = if ($Requirements.Count -gt 0) { $Requirements[0] } else { "REQ-XXXX" }
$suitePrim = if ($PrimitiveIds.Count -gt 0) { $PrimitiveIds[0] } else { "PRIM-XXXX" }

$suiteContent = @"
# TS-$WpId - Spec vs Code Test Suite

Date Opened: $today
Status: PLANNED
Linked Work Packet: $WpId
Iteration: $Iteration

## Scope

Validate WP delivery against linked requirements and primitives.

## Inputs

- Linked requirements: $($Requirements -join ", ")
- Linked primitives: $($PrimitiveIds -join ", ")
- Linked components: <fill>

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | $suiteReq | $suitePrim | Dependency | dependency graph | <command> | dependencies resolved and policy-compliant |
| UI-001 | $suiteReq | $suitePrim | UI Contract | required UI contract | <test file> | required regions/modes and degraded states pass |
| FUNC-001 | $suiteReq | $suitePrim | Functionality | golden flow | <test file> | golden flow passes deterministically |
| COR-001 | $suiteReq | $suitePrim | Code Correctness | module contracts | <unit/integration> | invariant and regression checks pass |
| RED-001 | $suiteReq | $suitePrim | Red Team / Abuse | misuse constraints | <security test> | abuse cases blocked and audited |
| EXT-001 | $suiteReq | $suitePrim | Additional | perf/offline/reliability | <test> | budgets and resilience targets met |

## Dependency and Environment Tests

- [ ] Runtime dependency install/lock integrity
- [ ] Platform portability constraints checked
- [ ] Required services/adapters available

## UI Contract Tests

- [ ] Required regions
- [ ] Required modes/states
- [ ] Error and degraded-state UX

## Functional Flow Tests

- [ ] Golden flow
- [ ] Deterministic replay path
- [ ] Export/import or persistence flow

## Code Correctness Tests

- [ ] Unit tests
- [ ] Integration tests
- [ ] Static checks (lint/type/schema)

## Red-Team and Abuse Tests

- [ ] Non-goal enforcement (spec section 3.2)
- [ ] Policy bypass attempts
- [ ] Invalid input and path abuse cases

## Additional Tests

- [ ] Performance budget checks
- [ ] Offline behavior
- [ ] Accessibility/usability checks
- [ ] Reliability/recovery checks

## Execution Summary

- Last Run Date:
- Result:
- Blocking Failures:
- Evidence Paths:
- Reviewer:
- User Sign-off:
"@

[System.IO.File]::WriteAllText($suitePath, $suiteContent + "`r`n", [System.Text.UTF8Encoding]::new($false))

$reqSummary = ($Requirements -join ", ")
$rowSubSpec = $SubSpecPath
$taskBoardRow = "| $WpId | $Iteration | $Title | <scope> | $Status | $Owner | $reqSummary | $rowSubSpec | .gov/workflow/wp_test_suites/$suiteFileName | $today | Initialized via new_work_packet.ps1 |"

Ensure-TableRow -Path $taskBoardPath -RowPrefix "| $WpId |" -RowValue $taskBoardRow -AnchorHeader "## Active Board"

$traceRaw = Get-Content $tracePath -Raw
$traceSection = "## Work Packet Coverage and Primitive Links"
if ($traceRaw -notmatch [regex]::Escape($traceSection)) {
    $traceRaw += @"

---

## Work Packet Coverage and Primitive Links

| WP ID | Iteration | Requirements | Primitives | Test Suite | Status | Evidence |
|------|-----------|--------------|------------|------------|--------|----------|
"@
}
if ($traceRaw -notmatch [regex]::Escape("| $WpId |")) {
    $traceRaw += "`r`n| $WpId | $Iteration | $reqSummary | $($PrimitiveIds -join ', ') | .gov/workflow/wp_test_suites/$suiteFileName | $Status | <link evidence> |"
}
[System.IO.File]::WriteAllText($tracePath, $traceRaw.TrimEnd() + "`r`n", [System.Text.UTF8Encoding]::new($false))

$primitiveIndexRaw = Get-Content $primitiveIndexPath -Raw
foreach ($primitiveId in $PrimitiveIds) {
    if ($primitiveIndexRaw -match [regex]::Escape("| $primitiveId |")) {
        continue
    }
    $primitiveIndexRaw += "`r`n| $primitiveId | <name> | <type> | <contract> | <spec anchor> | $reqSummary | $Iteration | SPEC-MAPPED | $Owner | Added by new_work_packet.ps1 |"
}
[System.IO.File]::WriteAllText($primitiveIndexPath, $primitiveIndexRaw.TrimEnd() + "`r`n", [System.Text.UTF8Encoding]::new($false))

$primitiveMatrixRaw = Get-Content $primitiveMatrixPath -Raw
foreach ($primitiveId in $PrimitiveIds) {
    if ($primitiveMatrixRaw -match [regex]::Escape("| $primitiveId | $WpId |")) {
        continue
    }
    $primitiveMatrixRaw += "`r`n| $primitiveId | $WpId | $reqSummary | <components> | <tests> | <tech/tools> | <combined primitives/tools> | SPEC-MAPPED | $today |"
}
[System.IO.File]::WriteAllText($primitiveMatrixPath, $primitiveMatrixRaw.TrimEnd() + "`r`n", [System.Text.UTF8Encoding]::new($false))

Write-Host "Created WP: $wpPath"
Write-Host "Created Test Suite: $suitePath"
Write-Host "Updated TASK_BOARD.md, TRACEABILITY_MATRIX.md, PRIMITIVES_INDEX.md, PRIMITIVES_MATRIX.md"

if (-not $SkipCheckpointCommit) {
    $checkpointScript = Join-Path $scriptDirectory "governance_checkpoint_commit.ps1"
    & $checkpointScript -Message "chore: initialize $WpId governance scaffolding"
}
