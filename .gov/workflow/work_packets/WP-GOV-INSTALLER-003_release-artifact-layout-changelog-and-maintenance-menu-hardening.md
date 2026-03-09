# WP-GOV-INSTALLER-003 - Release Artifact Layout Changelog and Maintenance Menu Hardening

Date Opened: 2026-03-09
Status: E2E-VERIFIED
Iteration: All
Workflow Version: 4.0
Packet Class: IMPLEMENTATION
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-GOV-INSTALLER-003.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-GOV-INSTALLER-003.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-GOV-INSTALLER-003.ps1

## Intent

Replace the legacy release-output layout with a governed current/archive release topology, bind every shipped version to a governed changelog entry, and expose a self-describing maintenance menu/help surface that makes install, uninstall, full-uninstall, repair, and clean-reinstall data handling explicit.

## Linked Requirements

- REQ-0019
- REQ-0020
- REQ-0021
- REQ-0022
- REQ-0023
- REQ-0024
- REQ-0025
- REQ-0026
- REQ-0027
- REQ-0028
- REQ-0029
- REQ-0030
- REQ-0031
- REQ-0032
- REQ-0033
- REQ-0034
- REQ-0035
- REQ-0036

## Linked Primitives

- PRIM-0024 | Installer Bundle Policy | preserve MSI/NSIS bundle configuration, standard uninstall support, and version-parity rules while the release topology changes around them
- PRIM-0025 | Maintenance Action Router | extend the Windows maintenance script from a command surface into a safer operator-facing lifecycle hub without regressing the already-verified action semantics
- PRIM-0028 | Installer Kit Manifest Pipeline | rebuild the governed installer kit, manifest, and release pointers in the new release layout while keeping version monotonicity truthful
- PRIM-0072 | Release Artifact Topology | establish the governed `Releases/Current` and version-addressed archive contract for installers, portable executables, and kit manifests
- PRIM-0073 | Governed Release Changelog Ledger | require one governed changelog entry per shipped version and stage it with release artifacts
- PRIM-0074 | Maintenance Menu Surface | provide the operator-facing menu/help output that explains functions, data-handling differences, and the current changelog

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## Reality Boundary

- Real Seam: Governed release promotion now lands in a versioned current/archive layout with changelog-bound release kits, and the archive is organized by shipped version while the maintenance script exposes a changelog-aware lifecycle menu including full-uninstall.
- User-Visible Win: Operators can find the latest installers and portable executable without digging through mixed historical folders, and the maintenance tool explains exactly what each lifecycle action does before they run it.
- Proof Target: `build_windows_installer.ps1` produces the new release layout with archived prior current outputs, gitignored installer/exe artifacts remain untracked, and `windows-installer-maintenance.ps1 -Action menu` prints function explanations plus the current changelog.
- Allowed Temporary Fallbacks: Legacy `.product/build_target/Current/` and `.product/build_target/Old versions/` remain on disk for historical compatibility only; no new promoted release outputs should be written there.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## In Scope

- Define the governed release artifact topology, changelog ledger, and maintenance-menu rules in spec, requirements, traceability, primitives, roadmap, and taskboard artifacts.
- Move the canonical Windows release build flow to `.product/build_target/Releases/Current/` with versioned archive handling and governed changelog enforcement.
- Extend the maintenance script to expose install, full-uninstall, and menu/help behavior with explicit data-handling explanations.
- Add gitignore coverage for installer/setup/portable binaries across current and archived release outputs.

## Out of Scope

- macOS installer packaging beyond the already-closed portability smoke evidence.
- Changes to the core desktop runtime unrelated to release/installer lifecycle handling.

## Expected Files Touched

- .gov/Spec/stratatlas_spec_v1_2.md
- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/REPO_STRUCTURE.md
- .gov/workflow/ROADMAP.md
- .gov/workflow/BUILD_READINESS_CHECKLIST.md
- .gov/Spec/sub-specs/GOV_release_artifact_layout_and_maintenance_menu.md
- .gov/workflow/changelog/README.md
- .gov/workflow/changelog/v0.1.6.md
- .gov/workflow/changelog/v0.1.7.md
- .gov/workflow/changelog/v0.1.8.md
- .gov/workflow/changelog/v0.1.9.md
- .gov/workflow/changelog/v0.1.10.md
- .gov/workflow/changelog/v0.1.11.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-GOV-INSTALLER-003_release-artifact-layout-changelog-and-maintenance-menu-hardening.md
- .gov/workflow/wp_test_suites/TS-WP-GOV-INSTALLER-003.md
- .gov/workflow/wp_spec_extractions/SX-WP-GOV-INSTALLER-003.md
- .gov/workflow/wp_checks/check-WP-GOV-INSTALLER-003.ps1
- .gov/repo_scripts/build_windows_installer.ps1
- .gov/repo_scripts/run_wp_checks.ps1
- .gov/repo_scripts/governance_preflight.ps1
- .gitignore
- AGENTS.md
- PROJECT_CODEX.md
- .product/build_target/README.md
- .product/build_target/Releases/Current/Installers/.gitkeep
- .product/build_target/Releases/Current/Portable/.gitkeep
- .product/build_target/Releases/Current/InstallerKit/.gitkeep
- .product/build_target/Releases/Archive/.gitkeep
- .product/Worktrees/wt_main/README.md
- .product/Worktrees/wt_main/docs/INSTALLER_LIFECYCLE.md
- .product/Worktrees/wt_main/scripts/windows-installer-maintenance.ps1

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0072 | Release artifact topology and archive policy | Markdown governance + PowerShell build orchestration + gitignored build-target folders | The latest installers and portable executable become easy to find while historical versions stay archived separately. |
| PRIM-0073 | Governed changelog ledger | Workflow changelog markdown + release-kit copy step | Every shipped version gains an auditable release-notes entry that ships with the current kit. |
| PRIM-0074 | Maintenance menu/help surface | PowerShell menu output + changelog rendering | Operators can see lifecycle choices and data-handling differences before running maintenance actions. |
| PRIM-0025 | Maintenance action router | PowerShell lifecycle operations + Windows installer APIs | The richer menu/help surface still routes into the already-governed install/repair/uninstall operations. |

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

## Fallback Register

- Explicit simulated/mock/sample paths: None intended for the governed release layout or maintenance-menu path; this packet changes operator/build surfaces rather than simulated runtime features.
- Required labels in code/UI/governance: Legacy `.product/build_target/Current/` and `.product/build_target/Old versions/` must be labeled historical-only in governance and product docs.
- Successor packet or debt owner: Release-candidate packet to be created after this governance hardening closes and the next publishable kit is cut.
- Exit condition to remove fallback: New promoted release outputs and operator guidance reference only the governed `Releases/` layout, and packet proof shows archive promotion plus changelog/menu behavior.

## Change Ledger

- What Became Real: Governed Windows release promotion now stages installers, portable executable, manifest, maintenance assets, and changelog copy under `.product/build_target/Releases/Current/`, archives prior current releases by version, migrates legacy `.product/build_target/Current/` history into a versioned `LegacyCurrent` archive path, and exposes a changelog-aware maintenance menu with explicit install/uninstall/repair/full-clean semantics.
- What Remains Simulated: None in scope.
- Next Blocking Real Seam: Create and execute the release-candidate packet that promotes the publishable installer/release evidence bundle from the hardened governed release layout.

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-INSTALLER-003.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-GOV-INSTALLER-003/
- Claim Standard: do not claim completion without linked command output and artifact paths.

## Exit Criteria

- Task board and requirements index statuses are synchronized.
- Traceability, primitives index, and primitives matrix are synchronized.
- Linked test suite has executed results and evidence paths.
- Evidence bundle is attached.
- Reality Boundary, Fallback Register, and Change Ledger are truthful.
- User Sign-off: APPROVED.

## Evidence

- Test Suite Execution: Passed `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-INSTALLER-003.ps1`
- Logs: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-INSTALLER-003/20260309_171125/summary.md`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-INSTALLER-003/20260309_171125/result.json`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-INSTALLER-003/20260309_171125/FUNC-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-INSTALLER-003/20260309_171125/UI-001.log`
- Screenshots/Exports: N/A
- Build Artifacts: `.product/build_target/Releases/Current/Installers/`; `.product/build_target/Releases/Current/Portable/StratAtlas_0.1.11_portable_x64.exe`; `.product/build_target/Releases/Current/InstallerKit/20260309_171333/`; `.product/build_target/Releases/Archive/0.1.10/`; `.product/build_target/Releases/Archive/0.1.9/LegacyCurrent/`
- Proof Artifact: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-INSTALLER-003/20260309_171125/`
- User Sign-off: Pending user review

## Progress Log

- 2026-03-09: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
- 2026-03-09: Began governance hardening for release artifact topology, changelog ledger, maintenance menu/help output, and installer/exe gitignore policy.
- 2026-03-09: Closed as `E2E-VERIFIED` after passing `.gov/workflow/wp_checks/check-WP-GOV-INSTALLER-003.ps1`; proof bundle: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-INSTALLER-003/20260309_171125/`.
