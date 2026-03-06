# WP-GOV-INSTALLER-001 - Installer Lifecycle Contract and Build Kit

Date Opened: 2026-03-06
Status: E2E-VERIFIED
Iteration: All
Workflow Version: 3.0
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-GOV-INSTALLER-001.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-GOV-INSTALLER-001.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-GOV-INSTALLER-001.ps1

## Intent

Define and implement a governed Windows installer lifecycle contract across spec, traceability, and product packaging.
Ship an installer kit workflow that produces MSI/NSIS artifacts plus maintenance tooling for uninstall, repair, full-repair, update, and downgrade operations with proof artifacts.

## Linked Requirements

- REQ-0023
- REQ-0024
- REQ-0025
- REQ-0026
- REQ-0027
- REQ-0028
- REQ-0029
- REQ-0030
- REQ-0031

## Linked Primitives

- PRIM-0024 | Installer Bundle Policy | enforce installer target and lifecycle bundle constraints
- PRIM-0025 | Maintenance Action Router | provide explicit lifecycle operations through a single maintenance script
- PRIM-0026 | User Data Backup-Restore Guard | preserve presets/data for repair and default full-repair path
- PRIM-0027 | Version Direction Guard | block invalid update/downgrade direction changes
- PRIM-0028 | Installer Kit Manifest Pipeline | stage installer release kit with checksums and lifecycle docs

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## In Scope

- Add installer lifecycle contract to canonical spec and requirement ledger.
- Implement/validate MSI+NSIS bundle policy for Windows packaging.
- Add maintenance script implementing uninstall/repair/full-repair/update/downgrade controls.
- Add reproducible installer build script that stages kit artifacts and manifest.
- Update traceability, primitives index/matrix, taskboard, WP extraction, and WP test suite with evidence.

## Out of Scope

- Runtime feature changes unrelated to installer/package lifecycle.
- macOS installer implementation (contract remains portability-safe, but this WP is Windows-focused).
- Auto-update service infrastructure or remote release orchestration.

## Expected Files Touched

- .gov/Spec/stratatlas_spec_v1_2.md
- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-GOV-INSTALLER-001_installer-lifecycle-contract-and-build-kit.md
- .gov/workflow/wp_test_suites/TS-WP-GOV-INSTALLER-001.md
- .gov/workflow/wp_spec_extractions/SX-WP-GOV-INSTALLER-001.md
- .gov/workflow/wp_checks/check-WP-GOV-INSTALLER-001.ps1
- .gov/repo_scripts/build_windows_installer.ps1
- .product/Worktrees/wt_main/src-tauri/tauri.conf.json
- .product/Worktrees/wt_main/package.json
- .product/Worktrees/wt_main/scripts/windows-installer-maintenance.ps1
- .product/Worktrees/wt_main/docs/INSTALLER_LIFECYCLE.md
- PROJECT_CODEX.md

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0024 | Tauri bundle policy | WiX + NSIS targets in `tauri.conf.json` | Installer output supports lifecycle actions and downgrade-aware packaging. |
| PRIM-0025 | Maintenance command surface | PowerShell + `msiexec` + registry discovery | Standardized operational entrypoint for lifecycle tasks. |
| PRIM-0026 | Data safety in full-repair | AppData backup/restore flow | Clean reinstall can preserve analyst presets/data by default. |
| PRIM-0027 | Version-direction checks | MSI metadata inspection + semantic version checks | Updates and downgrades are explicit, validated, and auditable. |
| PRIM-0028 | Installer kit staging | Build script + SHA256 manifest | Release artifacts are reproducible, traceable, and support operational handoff. |

## Spec-Test Coverage Plan

### Dependency and Environment Tests
- [x] Dependency graph/lock integrity tests
- [x] Runtime compatibility checks

### UI Contract Tests
- [x] Required regions/modes/states (N/A - governance installer WP, CLI maintenance surface validated)
- [x] Error/degraded-state UX (N/A - command-level validation and non-zero exits enforced)

### Functional Flow Tests
- [x] Golden flow and edge cases
- [x] Persistence/replay/export flows

### Code Correctness Tests
- [x] Unit tests (N/A - governance/product script contract validated via command runs)
- [x] Integration tests (N/A - installer build + maintenance command execution)
- [x] Static analysis (lint/type/schema)

### Red-Team and Abuse Tests
- [x] Non-goal enforcement (spec section 3.2)
- [x] Policy bypass scenarios
- [x] Adversarial/invalid input cases

### Additional Tests
- [x] Performance budgets (N/A - no runtime performance-path changes in this WP)
- [x] Offline behavior (N/A - installer packaging/maintenance governance scope)
- [x] Reliability/recovery

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-INSTALLER-001.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-GOV-INSTALLER-001/
- Claim Standard: do not claim completion without linked command output and artifact paths.

## Exit Criteria

- Task board and requirements index statuses are synchronized.
- Traceability, primitives index, and primitives matrix are synchronized.
- Linked test suite has executed results and evidence paths.
- Evidence bundle is attached.
- User Sign-off: APPROVED.

## Evidence

- Test Suite Execution: `.gov/workflow/wp_checks/check-WP-GOV-INSTALLER-001.ps1` -> pass (`.product/build_target/tool_artifacts/wp_runs/WP-GOV-INSTALLER-001/20260306_084257/summary.md`)
- Logs: `.product/build_target/logs/installer_build_20260306_023104.log`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-INSTALLER-001/20260306_084257/DEP-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-INSTALLER-001/20260306_084257/COR-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-INSTALLER-001/20260306_084257/RED-001.log`
- Screenshots/Exports: N/A
- Build Artifacts: `.product/build_target/Current/InstallerKit/20260306_023104/` (MSI + NSIS + lifecycle docs + maintenance script + manifest)
- Proof Artifact: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-INSTALLER-001/20260306_084257/`
- User Sign-off: Approved via 2026-03-06 autonomous completion instruction

## Progress Log

- 2026-03-06: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
- 2026-03-06: Added installer lifecycle implementation (`tauri.conf.json`, maintenance script, installer build script, lifecycle docs).
- 2026-03-06: Updated spec/index/traceability/primitives/taskboard/codex for REQ-0023..REQ-0029 lifecycle contract.
- 2026-03-06: `pnpm install --frozen-lockfile` completed in `.product/Worktrees/wt_main`.
- 2026-03-06: `build_windows_installer.ps1` produced kit `.product/build_target/Current/InstallerKit/20260306_012928/`.
- 2026-03-06: `windows-installer-maintenance.ps1 -Action status` validated command surface (status: not installed).
- 2026-03-06: Added automatic patch-version bump + EXE/installer version synchronization in `build_windows_installer.ps1` and documented versioning contract.
- 2026-03-06: `build_windows_installer.ps1` produced version-synced kit `.product/build_target/Current/InstallerKit/20260306_023104/` (version 0.1.4).
- 2026-03-06: WP check run passed with artifact `.product/build_target/tool_artifacts/wp_runs/WP-GOV-INSTALLER-001/20260306_023348/`.
- 2026-03-06: Re-ran `.gov/workflow/wp_checks/check-WP-GOV-INSTALLER-001.ps1` after governance closure updates; artifact `.product/build_target/tool_artifacts/wp_runs/WP-GOV-INSTALLER-001/20260306_084257/`.
- 2026-03-06: Promoted to `E2E-VERIFIED` after autonomous user sign-off.
