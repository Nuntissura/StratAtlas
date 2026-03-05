Param(
    [Parameter(Mandatory = $true)]
    [string]$Message,

    [string[]]$Files = @(),

    [switch]$Push
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDirectory "..\..")

Push-Location $repoRoot
try {
    $defaultFiles = @(
        ".gov/Spec/stratatlas_spec_v1_2.md",
        ".gov/Spec/REQUIREMENTS_INDEX.md",
        ".gov/Spec/TRACEABILITY_MATRIX.md",
        ".gov/Spec/TECH_STACK.md",
        ".gov/Spec/PRIMITIVES_INDEX.md",
        ".gov/Spec/PRIMITIVES_MATRIX.md",
        ".gov/workflow/ROADMAP.md",
        ".gov/workflow/taskboard/TASK_BOARD.md",
        ".gov/workflow/work_packets",
        ".gov/workflow/wp_test_suites",
        ".gov/workflow/GOVERNANCE_WORKFLOW.md",
        ".gov/workflow/BUILD_READINESS_CHECKLIST.md",
        ".gov/templates",
        ".gov/repo_scripts",
        "PROJECT_CODEX.md",
        "AGENTS.md",
        "MODEL_BEHAVIOR.md"
    )

    $targets = if ($Files.Count -gt 0) { $Files } else { $defaultFiles }

    & git add -- @targets

    $staged = & git diff --cached --name-only
    if (-not $staged) {
        Write-Host "No staged governance changes to commit."
        exit 0
    }

    & git commit -m $Message

    if ($Push) {
        $branch = (& git rev-parse --abbrev-ref HEAD).Trim()
        & git push origin $branch
    }
}
finally {
    Pop-Location
}

