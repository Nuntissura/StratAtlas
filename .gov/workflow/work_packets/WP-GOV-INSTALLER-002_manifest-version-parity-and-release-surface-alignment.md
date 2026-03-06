# WP-GOV-INSTALLER-002 - Manifest Version Parity and Release Surface Alignment

Date Opened: 2026-03-06
Status: SPEC-MAPPED
Iteration: All
Workflow Version: 3.0
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-GOV-INSTALLER-002.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-GOV-INSTALLER-002.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-GOV-INSTALLER-002.ps1

## Intent

Eliminate the remaining release-surface drift in `wt_main` so version metadata, product/operator documentation, and installer outputs all describe the same verified desktop build.
This packet starts only after the governance closeout packet is committed and pushed.

## Linked Requirements

- REQ-0017
- REQ-0029
- REQ-0030
- REQ-0031

## Linked Primitives

- PRIM-0024 | Installer Bundle Policy | keep bundle metadata and version-bearing release inputs aligned with the governed installer contract
- PRIM-0028 | Installer Kit Manifest Pipeline | regenerate a release kit whose artifacts, manifest, and docs all agree on the shipped version

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## In Scope

- Align version-bearing manifests in `wt_main` so Rust/Tauri/package metadata no longer disagree on the shipped desktop version.
- Replace the stock product README with StratAtlas-specific operator/build guidance tied to the governed desktop workflow.
- Re-run the canonical installer build flow and capture fresh release-kit evidence after alignment.
- Update governance ledgers and packet evidence with the resulting release-surface proof.

## Out of Scope

- New desktop runtime features unrelated to build/release metadata and operator docs.
- Changes to installer lifecycle semantics already verified in `WP-GOV-INSTALLER-001`.
- macOS packaging implementation.

## Expected Files Touched

- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/Spec/TECH_STACK.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-GOV-INSTALLER-002_manifest-version-parity-and-release-surface-alignment.md
- .gov/workflow/wp_test_suites/TS-WP-GOV-INSTALLER-002.md
- .gov/workflow/wp_spec_extractions/SX-WP-GOV-INSTALLER-002.md
- .gov/workflow/wp_checks/check-WP-GOV-INSTALLER-002.ps1
- .product/Worktrees/wt_main/README.md
- .product/Worktrees/wt_main/package.json
- .product/Worktrees/wt_main/src-tauri/Cargo.toml
- .product/Worktrees/wt_main/src-tauri/tauri.conf.json
- .product/Worktrees/wt_main/docs/INSTALLER_LIFECYCLE.md
- .gov/repo_scripts/build_windows_installer.ps1

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0024 | Tauri bundle and manifest versions | Tauri config + Cargo/package metadata | Release inputs stop disagreeing about the desktop version being shipped. |
| PRIM-0028 | Canonical release kit build | PowerShell build orchestration + staged docs/manifests | The rebuilt installer kit is reproducible and its metadata matches the checked-in release surface. |

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

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-INSTALLER-002.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-GOV-INSTALLER-002/
- Claim Standard: do not claim completion without linked command output and artifact paths.

## Exit Criteria

- Task board and requirements index statuses are synchronized.
- Traceability, primitives index, and primitives matrix are synchronized.
- Linked test suite has executed results and evidence paths.
- Evidence bundle is attached.
- User Sign-off: APPROVED.

## Evidence

- Test Suite Execution:
- Logs:
- Screenshots/Exports:
- Build Artifacts:
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-GOV-INSTALLER-002/
- User Sign-off:

## Progress Log

- 2026-03-06: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
- 2026-03-06: Queued behind `WP-GOV-MAINT-002` as the release-surface cleanup packet once the governance closeout commit is pushed.
