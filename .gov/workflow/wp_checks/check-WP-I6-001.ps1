Param(
    [string]$ProductWorktree = ".product/Worktrees/wt_main"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDirectory "..\..\..")
$runner = Join-Path $repoRoot ".gov/repo_scripts/run_wp_checks.ps1"

if (-not (Test-Path $runner -PathType Leaf)) {
    throw "Missing runner script: $runner"
}

& $runner -WpId "WP-I6-001" -ProductWorktree $ProductWorktree
exit $LASTEXITCODE
