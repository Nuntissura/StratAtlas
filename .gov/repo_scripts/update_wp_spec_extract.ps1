Param(
    [string]$WpId,
    [switch]$All
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Get-WpFiles {
    Param(
        [string]$WorkPacketDir,
        [string]$TargetWpId,
        [bool]$UpdateAll
    )

    if ($UpdateAll) {
        return Get-ChildItem -Path $WorkPacketDir -Filter "WP-*.md" -File
    }

    if ([string]::IsNullOrWhiteSpace($TargetWpId)) {
        throw "Provide -WpId or use -All."
    }

    $match = Get-ChildItem -Path $WorkPacketDir -Filter "$TargetWpId*.md" -File
    if (-not $match) {
        throw "No WP file found for '$TargetWpId' in $WorkPacketDir"
    }

    return $match
}

function Get-SectionText {
    Param(
        [string]$Raw,
        [string]$Heading
    )

    $pattern = "(?ms)^##\s+" + [regex]::Escape($Heading) + "\s*\r?\n(.*?)(?=^##\s+|\z)"
    $match = [regex]::Match($Raw, $pattern)
    if (-not $match.Success) {
        return ""
    }
    return $match.Groups[1].Value.Trim()
}

function Expand-RequirementIds {
    Param([string]$Text)

    $ids = New-Object System.Collections.Generic.HashSet[string]

    $rangeMatches = [regex]::Matches($Text, 'REQ-(\d{4})\s*\.\.\s*REQ-(\d{4})')
    foreach ($range in $rangeMatches) {
        $start = [int]$range.Groups[1].Value
        $end = [int]$range.Groups[2].Value
        if ($start -le $end) {
            for ($i = $start; $i -le $end; $i++) {
                [void]$ids.Add(("REQ-{0:0000}" -f $i))
            }
        }
    }

    $singleMatches = [regex]::Matches($Text, 'REQ-(\d{4})')
    foreach ($single in $singleMatches) {
        [void]$ids.Add(("REQ-{0:0000}" -f [int]$single.Groups[1].Value))
    }

    return @($ids | Sort-Object)
}

function Parse-MarkdownRowMap {
    Param(
        [string[]]$Lines,
        [string]$IdPrefix,
        [int]$MinCellCount
    )

    $map = @{}
    foreach ($line in $Lines) {
        if ($line -notmatch ("^\|\s*" + [regex]::Escape($IdPrefix) + "-\d{4}\s*\|")) {
            continue
        }

        $cells = $line.Trim() -replace '^\|', '' -replace '\|$', ''
        $parts = $cells.Split('|') | ForEach-Object { $_.Trim() }
        if ($parts.Count -lt $MinCellCount) {
            continue
        }

        $map[$parts[0]] = $parts
    }
    return $map
}

function Clean-MetadataValue {
    Param([string]$Value)

    $v = $Value.Trim()
    $v = $v.Trim("`"")
    return $v
}

$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDirectory "..\..")

$workPacketDir = Join-Path $repoRoot ".gov/workflow/work_packets"
$extractDir = Join-Path $repoRoot ".gov/workflow/wp_spec_extractions"
$requirementsPath = Join-Path $repoRoot ".gov/Spec/REQUIREMENTS_INDEX.md"
$primitivesPath = Join-Path $repoRoot ".gov/Spec/PRIMITIVES_INDEX.md"
$traceabilityPath = Join-Path $repoRoot ".gov/Spec/TRACEABILITY_MATRIX.md"

if (-not (Test-Path $extractDir -PathType Container)) {
    New-Item -Path $extractDir -ItemType Directory -Force | Out-Null
}

$requirementLines = Get-Content $requirementsPath
$primitiveLines = Get-Content $primitivesPath
$traceabilityRaw = Get-Content -Raw $traceabilityPath

$requirementMap = Parse-MarkdownRowMap -Lines $requirementLines -IdPrefix "REQ" -MinCellCount 6
$primitiveMap = Parse-MarkdownRowMap -Lines $primitiveLines -IdPrefix "PRIM" -MinCellCount 9

$wpFiles = Get-WpFiles -WorkPacketDir $workPacketDir -TargetWpId $WpId -UpdateAll $All

foreach ($wpFile in $wpFiles) {
    $raw = Get-Content -Raw $wpFile.FullName
    $wpMatch = [regex]::Match($raw, '(?m)^#\s+(WP-[A-Z0-9-]+)\s+-')
    if (-not $wpMatch.Success) {
        Write-Host "Skipping $($wpFile.Name): cannot parse WP ID."
        continue
    }

    $currentWpId = $wpMatch.Groups[1].Value
    $dateValue = (Get-Date -Format "yyyy-MM-dd")
    $statusValue = if ([regex]::Match($raw, '(?m)^Status:\s*(.+)$').Success) { ([regex]::Match($raw, '(?m)^Status:\s*(.+)$').Groups[1].Value.Trim()) } else { "UNKNOWN" }
    $iterationValue = if ([regex]::Match($raw, '(?m)^Iteration:\s*(.+)$').Success) { ([regex]::Match($raw, '(?m)^Iteration:\s*(.+)$').Groups[1].Value.Trim()) } else { "UNKNOWN" }
    $workflowVersionValue = if ([regex]::Match($raw, '(?m)^Workflow Version:\s*(.+)$').Success) { Clean-MetadataValue -Value ([regex]::Match($raw, '(?m)^Workflow Version:\s*(.+)$').Groups[1].Value) } else { "UNKNOWN" }
    $packetClassValue = if ([regex]::Match($raw, '(?m)^Packet Class:\s*(.+)$').Success) { Clean-MetadataValue -Value ([regex]::Match($raw, '(?m)^Packet Class:\s*(.+)$').Groups[1].Value) } else { "UNSPECIFIED" }
    $linkedSuite = if ([regex]::Match($raw, '(?m)^Linked Test Suite:\s*(.+)$').Success) { Clean-MetadataValue -Value ([regex]::Match($raw, '(?m)^Linked Test Suite:\s*(.+)$').Groups[1].Value) } else { ".gov/workflow/wp_test_suites/TS-$currentWpId.md" }
    $linkedCheck = if ([regex]::Match($raw, '(?m)^Linked WP Check Script:\s*(.+)$').Success) { Clean-MetadataValue -Value ([regex]::Match($raw, '(?m)^Linked WP Check Script:\s*(.+)$').Groups[1].Value) } else { ".gov/workflow/wp_checks/check-$currentWpId.ps1" }

    $requirementsSection = Get-SectionText -Raw $raw -Heading "Linked Requirements"
    $primitivesSection = Get-SectionText -Raw $raw -Heading "Linked Primitives"
    $realityBoundarySection = Get-SectionText -Raw $raw -Heading "Reality Boundary"
    $changeLedgerSection = Get-SectionText -Raw $raw -Heading "Change Ledger"
    $reqIds = Expand-RequirementIds -Text $requirementsSection
    $primIds = @([regex]::Matches($primitivesSection, 'PRIM-\d{4}') | ForEach-Object { $_.Value } | Sort-Object -Unique)

    $reqRows = New-Object System.Collections.Generic.List[string]
    foreach ($reqId in $reqIds) {
        if ($requirementMap.ContainsKey($reqId)) {
            $row = $requirementMap[$reqId]
            $reqRows.Add("| $($row[0]) | $($row[1]) | $($row[2]) | $($row[3]) | $($row[4]) | $($row[5]) |") | Out-Null
        }
        else {
            $reqRows.Add("| $reqId | UNKNOWN | UNKNOWN | Missing from REQUIREMENTS_INDEX.md | UNKNOWN | UNKNOWN |") | Out-Null
        }
    }

    $primRows = New-Object System.Collections.Generic.List[string]
    foreach ($primId in $primIds) {
        if ($primitiveMap.ContainsKey($primId)) {
            $row = $primitiveMap[$primId]
            $primRows.Add("| $($row[0]) | $($row[1]) | $($row[3]) | $($row[5]) | $($row[6]) | $($row[7]) |") | Out-Null
        }
        else {
            $primRows.Add("| $primId | UNKNOWN | Missing from PRIMITIVES_INDEX.md | UNKNOWN | UNKNOWN | UNKNOWN |") | Out-Null
        }
    }

    $traceHooks = New-Object System.Collections.Generic.List[string]
    foreach ($reqId in $reqIds) {
        $hasTrace = $traceabilityRaw -match ("(?m)^\|\s*" + [regex]::Escape($reqId) + "\s*\|")
        $traceHooks.Add("- ${reqId}: " + ($(if ($hasTrace) { "Mapped in TRACEABILITY_MATRIX.md" } else { "Missing traceability mapping" }))) | Out-Null
    }
    if ($traceHooks.Count -eq 0) {
        $traceHooks.Add("- No explicit requirement IDs found in WP.") | Out-Null
    }

    $extractRel = ".gov/workflow/wp_spec_extractions/SX-$currentWpId.md"
    $extractAbs = Join-Path $repoRoot ($extractRel.Replace("/", "\"))

    $content = @"
# SX-$currentWpId - Spec Extraction Snapshot

Generated On: $dateValue
Linked Work Packet: $currentWpId
Linked Test Suite: $linkedSuite
Linked WP Check Script: $linkedCheck
Packet Class Snapshot: $packetClassValue
Workflow Version Snapshot: $workflowVersionValue
WP Status Snapshot: $statusValue
Iteration: $iterationValue

## Scope

Concrete extraction of requirement and primitive obligations this WP must satisfy before status promotion.

## Reality Boundary Snapshot

$(if ([string]::IsNullOrWhiteSpace($realityBoundarySection)) { "- Not defined in WP." } else { $realityBoundarySection })

## Change Ledger Snapshot

$(if ([string]::IsNullOrWhiteSpace($changeLedgerSection)) { "- Not defined in WP." } else { $changeLedgerSection })

## Requirement Extraction

| Requirement | Level | Section | Description | Target | Status |
|-------------|-------|---------|-------------|--------|--------|
$($reqRows -join "`r`n")

## Primitive Extraction

| Primitive | Name | Contract | REQs | First Iter | Status |
|-----------|------|----------|------|------------|--------|
$($primRows -join "`r`n")

## Traceability Hooks

$($traceHooks -join "`r`n")

## Non-Goal / Red-Team Guardrails

- No individual targeting/stalking workflows.
- No covert affiliation inference.
- No social-media scraping ingestion.
- No leaked/hacked/scraped-against-terms data pipelines.
- No financial trading or prediction tooling.

## Verification Hooks

- Run preflight: powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1
- Run WP checks: powershell -ExecutionPolicy Bypass -File $linkedCheck
- Proof artifacts: .product/build_target/tool_artifacts/wp_runs/$currentWpId/
"@

    [System.IO.File]::WriteAllText($extractAbs, $content.TrimEnd() + "`r`n", [System.Text.UTF8Encoding]::new($false))
    Write-Host "Updated spec extraction: $extractRel"
}

exit 0
