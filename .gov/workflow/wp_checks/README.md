# WP Check Scripts

This folder stores one automation entrypoint script per work packet.

Naming rule:
- `check-WP-<...>.ps1`

Usage:
- Run a WP-specific script directly, for example:
  `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-001.ps1`
- Each script delegates to `.gov/repo_scripts/run_wp_checks.ps1`.

Required coverage categories:
- Dependency and environment checks
- UI contract checks
- Functional flow checks
- Code correctness checks
- Red-team / misuse checks
- Additional checks (performance/offline/reliability)

