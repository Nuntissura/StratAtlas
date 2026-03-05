Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$workPacketDir = Join-Path $repoRoot ".gov/workflow/work_packets"

$primitiveMap = @{
    "WP-I0-001"  = @("PRIM-0001", "PRIM-0002", "PRIM-0003", "PRIM-0004")
    "WP-I1-001"  = @("PRIM-0005", "PRIM-0006", "PRIM-0007", "PRIM-0008", "PRIM-0009")
    "WP-I2-001"  = @("PRIM-0010", "PRIM-0011")
    "WP-I3-001"  = @("PRIM-0012")
    "WP-I4-001"  = @("PRIM-0013")
    "WP-I5-001"  = @("PRIM-0014")
    "WP-I6-001"  = @("PRIM-0015")
    "WP-I7-001"  = @("PRIM-0016")
    "WP-I8-001"  = @("PRIM-0017")
    "WP-I9-001"  = @("PRIM-0018")
    "WP-I10-001" = @("PRIM-0019")
}

function Add-SectionIfMissing {
    Param(
        [string]$Raw,
        [string]$HeadingRegex,
        [string]$SectionContent
    )

    if ($Raw -match $HeadingRegex) {
        return $Raw
    }
    return ($Raw.TrimEnd() + "`r`n`r`n" + $SectionContent.TrimEnd() + "`r`n")
}

$wpFiles = Get-ChildItem $workPacketDir -Filter "WP-I*-*.md" -File

foreach ($wp in $wpFiles) {
    $raw = Get-Content $wp.FullName -Raw
    $wpMatch = [regex]::Match($raw, '^#\s+(WP-[A-Z0-9-]+)\s+-', [System.Text.RegularExpressions.RegexOptions]::Multiline)
    if (-not $wpMatch.Success) {
        continue
    }

    $wpId = $wpMatch.Groups[1].Value
    $suiteRel = ".gov/workflow/wp_test_suites/TS-$wpId.md"

    $raw = [regex]::Replace($raw, '(?m)^Status:\s*.*$', 'Status: IMPLEMENTED')

    if ($raw -notmatch '(?m)^Workflow Version:') {
        $raw = [regex]::Replace($raw, '(?m)^(Iteration:\s*.+)$', ('$1' + "`r`nWorkflow Version: 2.0"))
    }
    if ($raw -notmatch '(?m)^Linked Test Suite:') {
        $raw = [regex]::Replace($raw, '(?m)^(Workflow Version:\s*.+)$', ('$1' + "`r`nLinked Test Suite: $suiteRel"))
    }

    if ($raw -notmatch '(?m)^## Linked Primitives$') {
        $primRows = @()
        foreach ($primitiveId in $primitiveMap[$wpId]) {
            $primRows += "- $primitiveId | <name> | linked contract for this iteration"
        }
        $raw = Add-SectionIfMissing -Raw $raw -HeadingRegex '(?m)^## Linked Primitives$' -SectionContent ("## Linked Primitives`r`n`r`n" + ($primRows -join "`r`n"))
    }

    $raw = Add-SectionIfMissing -Raw $raw -HeadingRegex '(?m)^## Primitive Matrix Impact$' -SectionContent @"
## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for linked primitives.
"@

    $raw = Add-SectionIfMissing -Raw $raw -HeadingRegex '(?m)^## Expected Files Touched$' -SectionContent @"
## Expected Files Touched

- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/$($wp.Name)
- $suiteRel
- .product/Worktrees/wt_main/src/<implementation_files>
"@

    $raw = Add-SectionIfMissing -Raw $raw -HeadingRegex '(?m)^## Interconnection Plan$' -SectionContent @"
## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| <primitive> | <feature/tool> | <tech> | <why this combination matters> |
"@

    $raw = Add-SectionIfMissing -Raw $raw -HeadingRegex '(?m)^## Spec-Test Coverage Plan$' -SectionContent @"
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
"@

    $raw = Add-SectionIfMissing -Raw $raw -HeadingRegex '(?m)^## Checkpoint Commit Plan$' -SectionContent @"
## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives/test-suite).
2. Implementation commit(s).
3. Verification/status promotion commit.
"@

    if ($raw -notmatch '(?m)^## Exit Criteria$') {
        $raw = Add-SectionIfMissing -Raw $raw -HeadingRegex '(?m)^## Exit Criteria$' -SectionContent @"
## Exit Criteria

- Task board and requirements index statuses are synchronized.
- Traceability and primitive artifacts are synchronized.
- Linked test suite has executed results and evidence paths.
- User Sign-off: APPROVED.
- E2E-VERIFIED requires runtime evidence and user sign-off.
"@
    } elseif ($raw -notmatch 'E2E-VERIFIED requires runtime evidence and user sign-off\.') {
        $exitRegex = [regex]'(?m)(## Exit Criteria\s*\r?\n(?:\r?\n)?(?:-.*\r?\n)+)'
        $raw = $exitRegex.Replace(
            $raw,
            {
                param($match)
                $match.Groups[1].Value + "- E2E-VERIFIED requires runtime evidence and user sign-off.`r`n"
            },
            1
        )
    }

    if ($raw -notmatch '(?m)^## Evidence$') {
        $raw = Add-SectionIfMissing -Raw $raw -HeadingRegex '(?m)^## Evidence$' -SectionContent @"
## Evidence

- Test Suite Execution:
- Logs:
- Screenshots/Exports:
- Build Artifacts:
- User Sign-off:
"@
    } elseif ($raw -notmatch '(?m)^- User Sign-off:') {
        $raw = $raw.TrimEnd() + "`r`n- User Sign-off:`r`n"
    }

    [System.IO.File]::WriteAllText($wp.FullName, $raw.TrimEnd() + "`r`n", [System.Text.UTF8Encoding]::new($false))
}

Write-Host "Backfilled $($wpFiles.Count) iteration WP files to workflow version 2.0."
