# TS-WP-GOV-INSTALLER-003 - Spec vs Code Test Suite

Date Opened: 2026-03-09
Status: E2E-VERIFIED
Linked Work Packet: WP-GOV-INSTALLER-003
Iteration: All

## Scope

Validate the governed release current/archive topology, changelog-ledger enforcement, binary gitignore policy, and changelog-aware maintenance menu/help surface.

## Inputs

- Linked requirements: REQ-0019, REQ-0020, REQ-0021, REQ-0022, REQ-0023, REQ-0024, REQ-0025, REQ-0026, REQ-0027, REQ-0028, REQ-0029, REQ-0030, REQ-0031, REQ-0032, REQ-0033, REQ-0034, REQ-0035, REQ-0036
- Linked primitives: PRIM-0024, PRIM-0025, PRIM-0028, PRIM-0072, PRIM-0073, PRIM-0074
- Linked components: .gitignore; .gov/Spec/stratatlas_spec_v1_2.md; .gov/Spec/REQUIREMENTS_INDEX.md; .gov/Spec/TRACEABILITY_MATRIX.md; .gov/Spec/PRIMITIVES_INDEX.md; .gov/Spec/PRIMITIVES_MATRIX.md; .gov/Spec/sub-specs/GOV_release_artifact_layout_and_maintenance_menu.md; .gov/REPO_STRUCTURE.md; .gov/workflow/ROADMAP.md; .gov/workflow/BUILD_READINESS_CHECKLIST.md; .gov/workflow/changelog/README.md; .gov/workflow/changelog/v0.1.6.md; .gov/workflow/changelog/v0.1.7.md; .gov/workflow/changelog/v0.1.8.md; .gov/workflow/changelog/v0.1.9.md; .gov/workflow/changelog/v0.1.10.md; .gov/workflow/changelog/v0.1.11.md; .gov/workflow/taskboard/TASK_BOARD.md; .gov/repo_scripts/build_windows_installer.ps1; .gov/repo_scripts/governance_preflight.ps1; .gov/repo_scripts/run_wp_checks.ps1; .product/build_target/README.md; .product/Worktrees/wt_main/README.md; .product/Worktrees/wt_main/docs/INSTALLER_LIFECYCLE.md; .product/Worktrees/wt_main/scripts/windows-installer-maintenance.ps1

## Reality Boundary Assertions

- Packet Class: IMPLEMENTATION
- Real Seam: Governed releases now promote through a versioned `Releases/Current` and version-addressed archive topology with changelog-bound installer kits, and the maintenance script exposes menu/help plus full-uninstall behavior.
- Proof Target: The packet check builds a new governed release, archives the prior current release, verifies gitignore rules, and captures maintenance-menu/changelog plus data-preserving-uninstall/full-uninstall behavior.
- Allowed Fallbacks: Legacy `Current/` and `Old versions/` folders remain only as historical compatibility locations and are not used for new promoted releases.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0019, REQ-0021, REQ-0033 | PRIM-0072 | Dependency | governance and ignore policy | `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1`; `.gitignore` assertions in packet check | required release directories exist and installer/exe outputs remain ignored |
| UI-001 | REQ-0035, REQ-0036 | PRIM-0074 | UI Contract | maintenance menu/help surface | `powershell -ExecutionPolicy Bypass -File .product/Worktrees/wt_main/scripts/windows-installer-maintenance.ps1 -Action menu` | menu/help explains all lifecycle functions, data handling, and prints the current changelog |
| FUNC-001 | REQ-0029, REQ-0030, REQ-0031, REQ-0032, REQ-0034 | PRIM-0028, PRIM-0072, PRIM-0073 | Functionality | governed installer build | `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/build_windows_installer.ps1` | current release outputs are rebuilt in the new layout, prior current release archives by version, and the changelog copy is staged |
| COR-001 | REQ-0023, REQ-0025, REQ-0026, REQ-0036 | PRIM-0025, PRIM-0074 | Code Correctness | maintenance lifecycle script | packet check runs menu/data-handling assertions against `windows-installer-maintenance.ps1` | uninstall preserves data while full-uninstall removes it only when explicitly invoked |
| RED-001 | REQ-0020, REQ-0033, REQ-0035 | PRIM-0072, PRIM-0074 | Red Team / Abuse | accidental destructive or undocumented operator paths | packet check asserts no tracked release binaries and no hidden full-uninstall path behind normal uninstall | destructive data deletion remains explicit and release binaries stay out of git |
| EXT-001 | REQ-0020, REQ-0029..REQ-0035 | PRIM-0028, PRIM-0072, PRIM-0073, PRIM-0074 | Additional | full packet proof | `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-INSTALLER-003.ps1` | artifact bundle includes summary, result JSON, logs, staged release outputs, and maintenance-menu/changelog proof |

## Dependency and Environment Tests

- [ ] Runtime dependency install/lock integrity
- [ ] Platform portability constraints checked
- [ ] Required services/adapters available

## UI Contract Tests

- [ ] Required regions
- [ ] Required modes/states
- [ ] Error and degraded-state UX

## Functional Flow Tests

- [ ] Golden flow
- [ ] Deterministic replay path
- [ ] Export/import or persistence flow

## Code Correctness Tests

- [ ] Unit tests
- [ ] Integration tests
- [ ] Static checks (lint/type/schema)

## Red-Team and Abuse Tests

- [ ] Non-goal enforcement (spec section 3.2)
- [ ] Policy bypass attempts
- [ ] Invalid input and path abuse cases

## Additional Tests

- [ ] Performance budget checks
- [ ] Offline behavior
- [ ] Accessibility/usability checks
- [ ] Reliability/recovery checks

## Automation Hook

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-INSTALLER-003.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-GOV-INSTALLER-003/

## Execution Summary

- Last Run Date: 2026-03-09
- Result: Passed
- Blocking Failures: None
- Evidence Paths: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-INSTALLER-003/20260309_171125/`; `.product/build_target/Releases/Current/LATEST_RELEASE.txt`; `.product/build_target/Releases/Current/LATEST_INSTALLER_KIT.txt`
- What Became Real: Governed release promotion now rebuilds the current installer/portable surface, archives superseded current releases by version, migrates legacy `.product/build_target/Current/` history into a versioned `LegacyCurrent` archive folder, copies the active changelog into installer kits, and exposes a changelog-aware maintenance menu/help surface with verified data-handling semantics.
- What Remains Simulated: None in scope
- Next Blocking Real Seam: Create and execute the release-candidate packet that publishes the installer/release evidence bundle from the governed release layout.
- Reviewer: Codex
- User Sign-off: Pending user review
