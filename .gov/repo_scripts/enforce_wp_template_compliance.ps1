Param(
    [switch]$WriteLog
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Add-Issue {
    Param(
        [System.Collections.Generic.List[object]]$IssueList,
        [string]$WpId,
        [string]$Category,
        [string]$Message
    )

    $IssueList.Add([PSCustomObject]@{
        WpId     = $WpId
        Category = $Category
        Message  = $Message
    }) | Out-Null
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
    return $match.Groups[1].Value
}

function Clean-MetadataValue {
    Param([string]$Value)
    return $Value.Trim().Trim("`"")
}

function Test-VersionAtLeast {
    Param(
        [string]$Value,
        [string]$Minimum
    )

    try {
        return ([version](Clean-MetadataValue -Value $Value)) -ge [version]$Minimum
    }
    catch {
        return $false
    }
}

$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDirectory "..\..")
$workPacketDir = Join-Path $repoRoot ".gov/workflow/work_packets"

$issues = New-Object System.Collections.Generic.List[object]

$requiredMetadataPrefixes = @(
    "Date Opened:",
    "Status:",
    "Iteration:",
    "Workflow Version:",
    "Linked Test Suite:",
    "Linked Spec Extraction:",
    "Linked WP Check Script:"
)

$requiredSections = @(
    "Linked Requirements",
    "Linked Primitives",
    "Primitive Matrix Impact",
    "Expected Files Touched",
    "Interconnection Plan",
    "Spec-Test Coverage Plan",
    "Checkpoint Commit Plan",
    "Proof of Implementation",
    "Evidence"
)

$requiredV4Sections = @(
    "Reality Boundary",
    "Fallback Register",
    "Change Ledger"
)

$expectedTouchedAnchors = @(
    ".gov/Spec/REQUIREMENTS_INDEX.md",
    ".gov/Spec/TRACEABILITY_MATRIX.md",
    ".gov/Spec/PRIMITIVES_INDEX.md",
    ".gov/Spec/PRIMITIVES_MATRIX.md",
    ".gov/workflow/taskboard/TASK_BOARD.md",
    ".gov/workflow/wp_spec_extractions/",
    ".gov/workflow/wp_checks/"
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

$allowedPacketClasses = @("RESEARCH", "SCAFFOLD", "IMPLEMENTATION", "VERIFICATION")

$workPackets = Get-ChildItem -Path $workPacketDir -Filter "WP-*.md" -File
foreach ($wpFile in $workPackets) {
    $raw = Get-Content -Raw $wpFile.FullName
    $idMatch = [regex]::Match($raw, '(?m)^#\s+(WP-[A-Z0-9-]+)\s+-')
    if (-not $idMatch.Success) {
        Add-Issue -IssueList $issues -WpId $wpFile.Name -Category "WP-Header" -Message "Missing WP identifier in H1."
        continue
    }

    $wpId = $idMatch.Groups[1].Value
    $workflowVersionMatch = [regex]::Match($raw, '(?m)^Workflow Version:\s*(.+)$')
    $workflowVersion = if ($workflowVersionMatch.Success) { Clean-MetadataValue -Value $workflowVersionMatch.Groups[1].Value } else { "" }
    $isWorkflowV4 = $workflowVersionMatch.Success -and (Test-VersionAtLeast -Value $workflowVersion -Minimum "4.0")
    $statusMatch = [regex]::Match($raw, '(?m)^Status:\s*(.+)$')
    $statusValue = if ($statusMatch.Success) { Clean-MetadataValue -Value $statusMatch.Groups[1].Value } else { "" }
    $packetClassMatch = [regex]::Match($raw, '(?m)^Packet Class:\s*(.+)$')

    foreach ($prefix in $requiredMetadataPrefixes) {
        if ($raw -notmatch ("(?m)^" + [regex]::Escape($prefix))) {
            Add-Issue -IssueList $issues -WpId $wpId -Category "WP-Metadata" -Message "Missing metadata line: $prefix"
        }
    }

    if ($isWorkflowV4) {
        if (-not $packetClassMatch.Success) {
            Add-Issue -IssueList $issues -WpId $wpId -Category "WP-Metadata" -Message "Workflow Version 4.0+ packets must include metadata line: Packet Class:"
        }
        else {
            $packetClass = Clean-MetadataValue -Value $packetClassMatch.Groups[1].Value
            if ($allowedPacketClasses -notcontains $packetClass) {
                Add-Issue -IssueList $issues -WpId $wpId -Category "WP-Metadata" -Message "Packet Class '$packetClass' is invalid. Allowed: $($allowedPacketClasses -join ', ')"
            }
            if ($packetClass -eq "SCAFFOLD" -and $statusValue -eq "E2E-VERIFIED") {
                Add-Issue -IssueList $issues -WpId $wpId -Category "WP-Status" -Message "SCAFFOLD packets must not be promoted to E2E-VERIFIED."
            }
        }
    }

    foreach ($section in $requiredSections) {
        if ($raw -notmatch ("(?m)^##\s+" + [regex]::Escape($section) + "\s*$")) {
            Add-Issue -IssueList $issues -WpId $wpId -Category "WP-Section" -Message "Missing required section: ## $section"
        }
    }

    if ($isWorkflowV4) {
        foreach ($section in $requiredV4Sections) {
            if ($raw -notmatch ("(?m)^##\s+" + [regex]::Escape($section) + "\s*$")) {
                Add-Issue -IssueList $issues -WpId $wpId -Category "WP-Section" -Message "Workflow Version 4.0+ packets must include section: ## $section"
            }
        }

        $realityBody = Get-SectionText -Raw $raw -Heading "Reality Boundary"
        foreach ($anchor in @("- Real Seam:", "- User-Visible Win:", "- Proof Target:", "- Allowed Temporary Fallbacks:", "- Promotion Guard:")) {
            if ($realityBody -notmatch [regex]::Escape($anchor)) {
                Add-Issue -IssueList $issues -WpId $wpId -Category "WP-RealityBoundary" -Message "Reality Boundary section missing anchor: $anchor"
            }
        }

        $fallbackBody = Get-SectionText -Raw $raw -Heading "Fallback Register"
        foreach ($anchor in @("- Explicit simulated/mock/sample paths:", "- Required labels in code/UI/governance:", "- Successor packet or debt owner:", "- Exit condition to remove fallback:")) {
            if ($fallbackBody -notmatch [regex]::Escape($anchor)) {
                Add-Issue -IssueList $issues -WpId $wpId -Category "WP-FallbackRegister" -Message "Fallback Register section missing anchor: $anchor"
            }
        }

        $changeBody = Get-SectionText -Raw $raw -Heading "Change Ledger"
        foreach ($anchor in @("- What Became Real:", "- What Remains Simulated:", "- Next Blocking Real Seam:")) {
            if ($changeBody -notmatch [regex]::Escape($anchor)) {
                Add-Issue -IssueList $issues -WpId $wpId -Category "WP-ChangeLedger" -Message "Change Ledger section missing anchor: $anchor"
            }
        }

        if ($raw -match '<[^>\r\n]+>' -or $raw -match '\bTBD\b') {
            Add-Issue -IssueList $issues -WpId $wpId -Category "WP-Placeholder" -Message "Workflow Version 4.0+ packets must not retain placeholder or TBD markers."
        }
    }

    $expectedFilesBody = Get-SectionText -Raw $raw -Heading "Expected Files Touched"
    foreach ($anchor in $expectedTouchedAnchors) {
        if ($expectedFilesBody -notmatch [regex]::Escape($anchor)) {
            Add-Issue -IssueList $issues -WpId $wpId -Category "WP-ExpectedFiles" -Message "Expected files section missing anchor: $anchor"
        }
    }

    $proofBody = Get-SectionText -Raw $raw -Heading "Proof of Implementation"
    if ($proofBody -notmatch [regex]::Escape("Proof Artifact:")) {
        Add-Issue -IssueList $issues -WpId $wpId -Category "WP-Proof" -Message "Proof of Implementation section must include 'Proof Artifact:'."
    }

    $suiteMatch = [regex]::Match($raw, '(?m)^Linked Test Suite:\s*(.+)$')
    $extractMatch = [regex]::Match($raw, '(?m)^Linked Spec Extraction:\s*(.+)$')
    $checkMatch = [regex]::Match($raw, '(?m)^Linked WP Check Script:\s*(.+)$')

    if ($suiteMatch.Success) {
        $suiteRel = Clean-MetadataValue -Value $suiteMatch.Groups[1].Value
        $suiteAbs = Join-Path $repoRoot ($suiteRel.Replace("/", "\"))
        if (-not (Test-Path $suiteAbs -PathType Leaf)) {
            Add-Issue -IssueList $issues -WpId $wpId -Category "WP-Link" -Message "Linked test suite does not exist: $suiteRel"
        }
        else {
            $suiteRaw = Get-Content -Raw $suiteAbs
            foreach ($heading in $requiredSuiteHeadings) {
                if ($suiteRaw -notmatch [regex]::Escape($heading)) {
                    Add-Issue -IssueList $issues -WpId $wpId -Category "Suite-Section" -Message "Suite missing heading: $heading"
                }
            }

            foreach ($caseId in @("DEP-001", "UI-001", "FUNC-001", "COR-001", "RED-001", "EXT-001")) {
                if ($suiteRaw -notmatch ("(?m)^\|\s*" + [regex]::Escape($caseId) + "\s*\|")) {
                    Add-Issue -IssueList $issues -WpId $wpId -Category "Suite-Cases" -Message "Suite test case matrix missing $caseId"
                }
            }

            if ($isWorkflowV4) {
                if ($suiteRaw -notmatch [regex]::Escape("## Reality Boundary Assertions")) {
                    Add-Issue -IssueList $issues -WpId $wpId -Category "Suite-Section" -Message "Workflow Version 4.0+ suites must include heading: ## Reality Boundary Assertions"
                }
                foreach ($anchor in @("- Packet Class:", "- Real Seam:", "- Proof Target:", "- Allowed Fallbacks:", "- Promotion Guard:", "- What Became Real:", "- What Remains Simulated:", "- Next Blocking Real Seam:")) {
                    if ($suiteRaw -notmatch [regex]::Escape($anchor)) {
                        Add-Issue -IssueList $issues -WpId $wpId -Category "Suite-RealityBoundary" -Message "Workflow Version 4.0+ suite missing anchor: $anchor"
                    }
                }

                if ($suiteRaw -match '<[^>\r\n]+>' -or $suiteRaw -match '\bTBD\b') {
                    Add-Issue -IssueList $issues -WpId $wpId -Category "Suite-Placeholder" -Message "Workflow Version 4.0+ suites must not retain placeholder or TBD markers."
                }
            }
        }
    }

    if ($extractMatch.Success) {
        $extractRel = Clean-MetadataValue -Value $extractMatch.Groups[1].Value
        $extractAbs = Join-Path $repoRoot ($extractRel.Replace("/", "\"))
        if (-not (Test-Path $extractAbs -PathType Leaf)) {
            Add-Issue -IssueList $issues -WpId $wpId -Category "WP-Link" -Message "Linked spec extraction does not exist: $extractRel"
        }
        elseif ($isWorkflowV4) {
            $extractRaw = Get-Content -Raw $extractAbs
            foreach ($marker in @("Packet Class Snapshot:", "Workflow Version Snapshot:", "## Reality Boundary Snapshot", "## Change Ledger Snapshot")) {
                if ($extractRaw -notmatch [regex]::Escape($marker)) {
                    Add-Issue -IssueList $issues -WpId $wpId -Category "Extract-Section" -Message "Workflow Version 4.0+ spec extraction missing marker: $marker"
                }
            }
            if ($extractRaw -match '<[^>\r\n]+>' -or $extractRaw -match '\bTBD\b') {
                Add-Issue -IssueList $issues -WpId $wpId -Category "Extract-Placeholder" -Message "Workflow Version 4.0+ spec extractions must not retain placeholder or TBD markers."
            }
        }
    }

    if ($checkMatch.Success) {
        $checkRel = Clean-MetadataValue -Value $checkMatch.Groups[1].Value
        $checkAbs = Join-Path $repoRoot ($checkRel.Replace("/", "\"))
        if (-not (Test-Path $checkAbs -PathType Leaf)) {
            Add-Issue -IssueList $issues -WpId $wpId -Category "WP-Link" -Message "Linked WP check script does not exist: $checkRel"
        }
        else {
            $checkRaw = Get-Content -Raw $checkAbs
            if ($checkRaw -notmatch [regex]::Escape("run_wp_checks.ps1")) {
                Add-Issue -IssueList $issues -WpId $wpId -Category "WP-CheckScript" -Message "WP check script must delegate to run_wp_checks.ps1"
            }
        }
    }
}

$issueCount = $issues.Count
if ($issueCount -eq 0) {
    Write-Host "WP template compliance check passed."
}
else {
    Write-Host "WP template compliance check failed with $issueCount issue(s):"
    foreach ($issue in $issues) {
        Write-Host " - [$($issue.WpId)] [$($issue.Category)] $($issue.Message)"
    }
}

if ($WriteLog) {
    $logDir = Join-Path $repoRoot ".product/build_target/logs"
    if (-not (Test-Path $logDir -PathType Container)) {
        New-Item -Path $logDir -ItemType Directory -Force | Out-Null
    }
    $stamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $logPath = Join-Path $logDir "wp_template_compliance_$stamp.log"
    $lines = @(
        "WP Template Compliance Report",
        "Timestamp: $(Get-Date -Format o)",
        "Issue count: $issueCount",
        ""
    )
    $lines += $issues | ForEach-Object { "[{0}] [{1}] {2}" -f $_.WpId, $_.Category, $_.Message }
    $lines | Set-Content -Path $logPath -Encoding UTF8
    Write-Host "Log written: $logPath"
}

if ($issueCount -gt 0) {
    exit 1
}

exit 0
