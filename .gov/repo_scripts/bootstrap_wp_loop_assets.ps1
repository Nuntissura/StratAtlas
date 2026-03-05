Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Ensure-MetadataLine {
    Param(
        [string]$Raw,
        [string]$LinePrefix,
        [string]$LineValue,
        [string]$InsertAfterPrefix
    )

    if ($Raw -match ("(?m)^" + [regex]::Escape($LinePrefix) + ".*$")) {
        return $Raw
    }

    $insertAfterPattern = "(?m)^" + [regex]::Escape($InsertAfterPrefix) + ".*$"
    if ($Raw -match $insertAfterPattern) {
        return [regex]::Replace($Raw, $insertAfterPattern, ('$0' + "`r`n" + $LineValue), 1)
    }

    return $Raw.TrimEnd() + "`r`n" + $LineValue + "`r`n"
}

function Set-MetadataLine {
    Param(
        [string]$Raw,
        [string]$LinePrefix,
        [string]$LineValue,
        [string]$InsertAfterPrefix
    )

    $pattern = "(?m)^" + [regex]::Escape($LinePrefix) + ".*$"
    if ($Raw -match $pattern) {
        return [regex]::Replace($Raw, $pattern, $LineValue, 1)
    }
    return Ensure-MetadataLine -Raw $Raw -LinePrefix $LinePrefix -LineValue $LineValue -InsertAfterPrefix $InsertAfterPrefix
}

function Ensure-Section {
    Param(
        [string]$Raw,
        [string]$Heading,
        [string]$SectionContent
    )

    $headingPattern = "(?m)^##\s+" + [regex]::Escape($Heading) + "\s*$"
    if ($Raw -match $headingPattern) {
        return $Raw
    }

    return $Raw.TrimEnd() + "`r`n`r`n" + $SectionContent.TrimEnd() + "`r`n"
}

function Ensure-SectionContainsLine {
    Param(
        [string]$Raw,
        [string]$Heading,
        [string]$LineToEnsure
    )

    $pattern = "(?ms)(^##\s+" + [regex]::Escape($Heading) + "\s*\r?\n)(.*?)(?=^##\s+|\z)"
    $match = [regex]::Match($Raw, $pattern)
    if (-not $match.Success) {
        return $Raw
    }

    $header = $match.Groups[1].Value
    $body = $match.Groups[2].Value
    if ($body -match [regex]::Escape($LineToEnsure)) {
        return $Raw
    }

    $updatedBody = $body.TrimEnd() + "`r`n- $LineToEnsure`r`n"
    $replacement = $header + $updatedBody
    return $Raw.Substring(0, $match.Index) + $replacement + $Raw.Substring($match.Index + $match.Length)
}

function Write-Utf8NoBom {
    Param(
        [string]$Path,
        [string]$Content
    )

    [System.IO.File]::WriteAllText($Path, $Content.TrimEnd() + "`r`n", [System.Text.UTF8Encoding]::new($false))
}

$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDirectory "..\..")

$workPacketDir = Join-Path $repoRoot ".gov/workflow/work_packets"
$suiteDir = Join-Path $repoRoot ".gov/workflow/wp_test_suites"
$checkDir = Join-Path $repoRoot ".gov/workflow/wp_checks"
$specExtractDir = Join-Path $repoRoot ".gov/workflow/wp_spec_extractions"

if (-not (Test-Path $checkDir -PathType Container)) {
    New-Item -Path $checkDir -ItemType Directory -Force | Out-Null
}
if (-not (Test-Path $specExtractDir -PathType Container)) {
    New-Item -Path $specExtractDir -ItemType Directory -Force | Out-Null
}

$today = Get-Date -Format "yyyy-MM-dd"
$suiteTemplate = Get-Content -Raw (Join-Path $repoRoot ".gov/templates/WP_TEST_SUITE_TEMPLATE.md")
$checkTemplate = Get-Content -Raw (Join-Path $repoRoot ".gov/templates/WP_CHECK_SCRIPT_TEMPLATE.ps1")

$wpFiles = Get-ChildItem -Path $workPacketDir -Filter "WP-*.md" -File
$updatedWp = 0
$updatedSuite = 0
$createdSuite = 0
$createdCheck = 0

foreach ($wpFile in $wpFiles) {
    $raw = Get-Content -Raw $wpFile.FullName
    $wpMatch = [regex]::Match($raw, '(?m)^#\s+(WP-[A-Z0-9-]+)\s+-')
    if (-not $wpMatch.Success) {
        continue
    }

    $wpId = $wpMatch.Groups[1].Value
    $suiteRel = ".gov/workflow/wp_test_suites/TS-$wpId.md"
    $specRel = ".gov/workflow/wp_spec_extractions/SX-$wpId.md"
    $checkRel = ".gov/workflow/wp_checks/check-$wpId.ps1"

    $updatedRaw = $raw
    $updatedRaw = Ensure-MetadataLine -Raw $updatedRaw -LinePrefix "Iteration:" -LineValue "Iteration: All" -InsertAfterPrefix "Status:"
    $updatedRaw = Ensure-MetadataLine -Raw $updatedRaw -LinePrefix "Workflow Version:" -LineValue "Workflow Version: 3.0" -InsertAfterPrefix "Iteration:"
    $updatedRaw = Ensure-MetadataLine -Raw $updatedRaw -LinePrefix "Linked Test Suite:" -LineValue "Linked Test Suite: $suiteRel" -InsertAfterPrefix "Workflow Version:"
    $updatedRaw = Ensure-MetadataLine -Raw $updatedRaw -LinePrefix "Linked Spec Extraction:" -LineValue "Linked Spec Extraction: $specRel" -InsertAfterPrefix "Linked Test Suite:"
    $updatedRaw = Ensure-MetadataLine -Raw $updatedRaw -LinePrefix "Linked WP Check Script:" -LineValue "Linked WP Check Script: $checkRel" -InsertAfterPrefix "Linked Spec Extraction:"

    $updatedRaw = Ensure-Section -Raw $updatedRaw -Heading "Linked Requirements" -SectionContent @"
## Linked Requirements

- REQ-XXXX
"@
    $updatedRaw = Ensure-Section -Raw $updatedRaw -Heading "Linked Primitives" -SectionContent @"
## Linked Primitives

- PRIM-XXXX | <name> | <reason>
"@
    $updatedRaw = Ensure-Section -Raw $updatedRaw -Heading "Primitive Matrix Impact" -SectionContent @"
## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for linked primitives.
"@
    $updatedRaw = Ensure-Section -Raw $updatedRaw -Heading "Expected Files Touched" -SectionContent @"
## Expected Files Touched

- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/$($wpFile.Name)
- $suiteRel
- $specRel
- $checkRel
- .product/Worktrees/wt_main/src/<implementation_files>
"@
    $updatedRaw = Ensure-Section -Raw $updatedRaw -Heading "Interconnection Plan" -SectionContent @"
## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| <primitive> | <feature/tool> | <tech> | <why this combination matters> |
"@
    $updatedRaw = Ensure-Section -Raw $updatedRaw -Heading "Spec-Test Coverage Plan" -SectionContent @"
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
    $updatedRaw = Ensure-Section -Raw $updatedRaw -Heading "Checkpoint Commit Plan" -SectionContent @"
## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives/test-suite).
2. Implementation commit(s).
3. Verification/status promotion commit.
"@

    $updatedRaw = Ensure-SectionContainsLine -Raw $updatedRaw -Heading "Expected Files Touched" -LineToEnsure $specRel
    $updatedRaw = Ensure-SectionContainsLine -Raw $updatedRaw -Heading "Expected Files Touched" -LineToEnsure $checkRel

$proofSection = @"
## Proof of Implementation

- Command Runs: reference linked check script output.
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/$wpId/
- Claim Standard: do not claim completion without linked command evidence and artifact paths.
"@
    $updatedRaw = Ensure-Section -Raw $updatedRaw -Heading "Proof of Implementation" -SectionContent $proofSection

    $updatedRaw = Ensure-SectionContainsLine -Raw $updatedRaw -Heading "Evidence" -LineToEnsure "Proof Artifact: .product/build_target/tool_artifacts/wp_runs/$wpId/"
    $updatedRaw = Ensure-Section -Raw $updatedRaw -Heading "Evidence" -SectionContent @"
## Evidence

- Test Suite Execution:
- Logs:
- Screenshots/Exports:
- Build Artifacts:
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/$wpId/
- User Sign-off:
"@

    if ($updatedRaw -ne $raw) {
        Write-Utf8NoBom -Path $wpFile.FullName -Content $updatedRaw
        $updatedWp++
    }

    $checkAbs = Join-Path $repoRoot ($checkRel.Replace("/", "\"))
    if (-not (Test-Path $checkAbs -PathType Leaf)) {
        $checkContent = $checkTemplate.Replace("<WP-ID>", $wpId)
        Write-Utf8NoBom -Path $checkAbs -Content $checkContent
        $createdCheck++
    }

    $suiteAbs = Join-Path $repoRoot ($suiteRel.Replace("/", "\"))
    if (-not (Test-Path $suiteAbs -PathType Leaf)) {
        $suiteContent = $suiteTemplate
        $suiteContent = $suiteContent.Replace("<WP-ID>", $wpId)
        $suiteContent = $suiteContent.Replace("YYYY-MM-DD", $today)
        $suiteContent = $suiteContent.Replace("I0..I10 or All", "All")
        Write-Utf8NoBom -Path $suiteAbs -Content $suiteContent
        $createdSuite++
    }

    $suiteRaw = Get-Content -Raw $suiteAbs
    $suiteUpdatedRaw = $suiteRaw
    $suiteUpdatedRaw = Set-MetadataLine -Raw $suiteUpdatedRaw -LinePrefix "Linked Work Packet:" -LineValue "Linked Work Packet: $wpId" -InsertAfterPrefix "Status:"
    $suiteUpdatedRaw = Ensure-MetadataLine -Raw $suiteUpdatedRaw -LinePrefix "Iteration:" -LineValue "Iteration: All" -InsertAfterPrefix "Linked Work Packet:"
    $automationSection = @"
## Automation Hook

- Command: powershell -ExecutionPolicy Bypass -File $checkRel
- Artifacts: .product/build_target/tool_artifacts/wp_runs/$wpId/
"@
    $suiteUpdatedRaw = Ensure-Section -Raw $suiteUpdatedRaw -Heading "Automation Hook" -SectionContent $automationSection
    if ($suiteUpdatedRaw -ne $suiteRaw) {
        Write-Utf8NoBom -Path $suiteAbs -Content $suiteUpdatedRaw
        $updatedSuite++
    }
}

$extractScript = Join-Path $scriptDirectory "update_wp_spec_extract.ps1"
& $extractScript -All

Write-Host "WP loop bootstrap complete."
Write-Host "Updated WP files: $updatedWp"
Write-Host "Created suite files: $createdSuite"
Write-Host "Updated suite files: $updatedSuite"
Write-Host "Created check scripts: $createdCheck"
