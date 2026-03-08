Param(
    [string]$ProductWorktree = ".product/Worktrees/wt_main"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDirectory "..\..\..")
$runner = Join-Path $repoRoot ".gov/repo_scripts/run_wp_checks.ps1"
$latestResultPath = Join-Path $repoRoot ".product/build_target/tool_artifacts/wp_runs/WP-GOV-DEPTH-001/latest_result.json"

if (-not (Test-Path $runner -PathType Leaf)) {
    throw "Missing runner script: $runner"
}

& $runner -WpId "WP-GOV-DEPTH-001" -ProductWorktree $ProductWorktree
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

if (-not (Test-Path $latestResultPath -PathType Leaf)) {
    throw "Missing latest result artifact: $latestResultPath"
}

$latestResult = Get-Content -Path $latestResultPath -Raw | ConvertFrom-Json
$artifactRoot = Join-Path $repoRoot $latestResult.ArtifactPath
if (-not (Test-Path $artifactRoot -PathType Container)) {
    throw "Artifact root missing: $artifactRoot"
}

$assertionLog = Join-Path $artifactRoot "DOC-ASSERT-001.log"
$assertionJson = Join-Path $artifactRoot "doc_assertions.json"

$checks = @(
    @{
        Name = "AGENTS depth-first rules are present"
        Path = "AGENTS.md"
        Needles = @(
            'Every Workflow Version `4.0+` WP MUST declare `Packet Class:` as one of `RESEARCH`, `SCAFFOLD`, `IMPLEMENTATION`, or `VERIFICATION`.',
            'Every Workflow Version `4.0+` WP MUST include `Reality Boundary`, `Fallback Register`, and `Change Ledger` sections.',
            'Any seeded, sample, mock, templated, or simulated runtime path outside tests MUST be explicitly labeled in code and recorded in the active WP `Fallback Register`.'
        )
    },
    @{
        Name = "Model behavior prefers depth-first slices"
        Path = "MODEL_BEHAVIOR.md"
        Needles = @(
            'Prefer one end-to-end working vertical slice that makes one seam real over multiple partial surfaces that stay simulated.',
            '`What Became Real`, `What Remains Simulated`, and `Next Blocking Real Seam`.',
            '`SCAFFOLD` packets cannot promote linked requirements or primitives to `E2E-VERIFIED`.'
        )
    },
    @{
        Name = "Project codex execution loop captures packet class and reality boundary"
        Path = "PROJECT_CODEX.md"
        Needles = @(
            'For Workflow Version `4.0+`, classify the packet as `RESEARCH`, `SCAFFOLD`, `IMPLEMENTATION`, or `VERIFICATION` and record `Packet Class`.',
            'Define the packet `Reality Boundary`',
            '`What Became Real`, `What Remains Simulated`, and `Next Blocking Real Seam`'
        )
    },
    @{
        Name = "Governance workflow codifies v4 packet rules"
        Path = ".gov/workflow/GOVERNANCE_WORKFLOW.md"
        Needles = @(
            'For Workflow Version `4.0+`, set `Packet Class` and record the `Reality Boundary`, `Fallback Register`, and initial `Change Ledger`.',
            'Workflow Version `4.0+` packets must not retain unresolved `TBD` or placeholder markers in WP/suite/extraction artifacts.',
            'Workflow Version `4.0+` packets define `Reality Boundary`, `Fallback Register`, and `Change Ledger`.'
        )
    },
    @{
        Name = "WP template defines the v4 packet contract"
        Path = ".gov/templates/WP_TEMPLATE.md"
        Needles = @(
            'Workflow Version: 4.0',
            'Packet Class: RESEARCH | SCAFFOLD | IMPLEMENTATION | VERIFICATION',
            '## Reality Boundary',
            '## Fallback Register',
            '## Change Ledger'
        )
    },
    @{
        Name = "Suite template captures reality-boundary assertions"
        Path = ".gov/templates/WP_TEST_SUITE_TEMPLATE.md"
        Needles = @(
            '## Reality Boundary Assertions',
            '- What Became Real:',
            '- What Remains Simulated:',
            '- Next Blocking Real Seam:'
        )
    },
    @{
        Name = "Spec extract template captures recoverable packet context"
        Path = ".gov/templates/WP_SPEC_EXTRACT_TEMPLATE.md"
        Needles = @(
            'Packet Class Snapshot:',
            'Workflow Version Snapshot:',
            '## Reality Boundary Snapshot',
            '## Change Ledger Snapshot'
        )
    },
    @{
        Name = "New WP generator emits v4 packet fields"
        Path = ".gov/repo_scripts/new_work_packet.ps1"
        Needles = @(
            '[string]$PacketClass = "IMPLEMENTATION"',
            'Workflow Version: 4.0',
            '## Reality Boundary',
            '## Fallback Register',
            '## Change Ledger'
        )
    },
    @{
        Name = "Template compliance enforces v4 depth rules"
        Path = ".gov/repo_scripts/enforce_wp_template_compliance.ps1"
        Needles = @(
            'Workflow Version 4.0+ packets must include metadata line: Packet Class:',
            'Workflow Version 4.0+ packets must not retain placeholder or TBD markers.',
            'Workflow Version 4.0+ spec extractions must not retain placeholder or TBD markers.'
        )
    },
    @{
        Name = "Spec extraction generator snapshots packet class and change ledger"
        Path = ".gov/repo_scripts/update_wp_spec_extract.ps1"
        Needles = @(
            'Packet Class Snapshot:',
            'Workflow Version Snapshot:',
            '## Reality Boundary Snapshot',
            '## Change Ledger Snapshot'
        )
    },
    @{
        Name = "Roadmap records governance hardening without changing the product blocker"
        Path = ".gov/workflow/ROADMAP.md"
        Needles = @(
            'WP-GOV-DEPTH-001',
            'depth-first workflow baseline',
            'does not change the current product blocker `WP-I7-002`'
        )
    },
    @{
        Name = "Task board records packet class and preserved product blocker"
        Path = ".gov/workflow/taskboard/TASK_BOARD.md"
        Needles = @(
            'WP-GOV-DEPTH-001 | All | Depth-First Workflow and Scaffold Classification Hardening',
            'Packet class: IMPLEMENTATION',
            'next product blocker remains `WP-I7-002`'
        )
    }
)

$logLines = New-Object System.Collections.Generic.List[string]
$resultRows = New-Object System.Collections.Generic.List[object]
$failed = $false

foreach ($check in $checks) {
    $path = Join-Path $repoRoot $check.Path
    if (-not (Test-Path $path -PathType Leaf)) {
        $failed = $true
        $logLines.Add("[FAIL] $($check.Name) :: missing file $($check.Path)")
        $resultRows.Add([PSCustomObject]@{
            name = $check.Name
            path = $check.Path
            passed = $false
            missing = @("<file missing>")
        }) | Out-Null
        continue
    }

    $content = Get-Content -Path $path -Raw
    $missing = @()
    foreach ($needle in $check.Needles) {
        if (-not $content.Contains($needle)) {
            $missing += $needle
        }
    }

    if ($missing.Count -gt 0) {
        $failed = $true
        $logLines.Add("[FAIL] $($check.Name) :: missing markers -> $($missing -join ' || ')")
    }
    else {
        $logLines.Add("[PASS] $($check.Name)")
    }

    $resultRows.Add([PSCustomObject]@{
        name = $check.Name
        path = $check.Path
        passed = ($missing.Count -eq 0)
        missing = $missing
    }) | Out-Null
}

$logLines | Set-Content -Path $assertionLog -Encoding UTF8
$resultRows | ConvertTo-Json -Depth 5 | Set-Content -Path $assertionJson -Encoding UTF8

if ($failed) {
    Write-Host "Documentation assertions failed. See $assertionLog"
    exit 1
}

Write-Host "Documentation assertions passed."
exit 0
