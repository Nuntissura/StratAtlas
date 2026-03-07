Param(
    [string]$ProductWorktree = ".product/Worktrees/wt_main"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDirectory "..\..\..")
$runner = Join-Path $repoRoot ".gov/repo_scripts/run_wp_checks.ps1"
$latestResultPath = Join-Path $repoRoot ".product/build_target/tool_artifacts/wp_runs/WP-GOV-I1-RESEARCH-001/latest_result.json"

if (-not (Test-Path $runner -PathType Leaf)) {
    throw "Missing runner script: $runner"
}

& $runner -WpId "WP-GOV-I1-RESEARCH-001" -ProductWorktree $ProductWorktree
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
        Name = "Research doc has 2D guidance"
        Path = ".gov/Spec/sub-specs/I1_map_runtime_research.md"
        Needles = @(
            "## 4) Research Conclusions for 2D",
            "## 5) Research Conclusions for 3D",
            "## 6) Feature-to-Map Integration Contract"
        )
    },
    @{
        Name = "I1 sub-spec references map research and real runtime"
        Path = ".gov/Spec/sub-specs/I1_layers_time_replay.md"
        Needles = @(
            "Linked Research Reference: .gov/Spec/sub-specs/I1_map_runtime_research.md",
            "The main canvas MUST mount an actual map runtime.",
            "Every major feature active in the current product shell MUST manifest on the map"
        )
    },
    @{
        Name = "I1 implementation packet reflects map-first scope"
        Path = ".gov/workflow/work_packets/WP-I1-003_real-2d-3d-canvas-and-governed-layer-runtime.md"
        Needles = @(
            "map-first feature integration",
            "Route the current governed state contracts",
            "MapLibre 2D canvas, Cesium 3D globe mode"
        )
    },
    @{
        Name = "Taskboard reflects research packet and I1 dependency"
        Path = ".gov/workflow/taskboard/TASK_BOARD.md"
        Needles = @(
            "WP-GOV-I1-RESEARCH-001",
            "Research reference: .gov/Spec/sub-specs/I1_map_runtime_research.md",
            "Depends on WP-I0-003 and the closure of WP-GOV-I1-RESEARCH-001"
        )
    },
    @{
        Name = "Roadmap reflects governance research gate"
        Path = ".gov/workflow/ROADMAP.md"
        Needles = @(
            "WP-GOV-I1-RESEARCH-001",
            "map-first execution contract",
            'next blocking implementation packet is `WP-I1-003`'
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
