# WP-I1-025 - Settings Panel Rebuild

Date Opened: 2026-04-11
Status: SPEC-MAPPED
Iteration: I1
Workflow Version: 4.0
Packet Class: IMPLEMENTATION
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I1-025.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I1-025.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I1-025.ps1

## Intent

Replace the settings dropdown menu with a dedicated settings panel per spec Section 11.13. Organize settings by scope (Shell, Data, AI Provider, MCP, Deployment). Show frontend/backend scope badges. Add reset-to-defaults per section.

## Linked Requirements

- REQ-0200
- REQ-0700
- REQ-0701

## Linked Primitives

- PRIM-0005 | Stable UI Region Contract | Settings panel is a stable region with organized sections that maintain the region contract
- PRIM-0052 | AI Gateway Contract | Settings panel exposes AI provider configuration with visible scope badges connecting to real backend behavior

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## Reality Boundary

- Real Seam: Settings is a full panel, not a dropdown. Every setting shows its scope. Changes take effect immediately and persist.
- User-Visible Win: Settings are findable, understandable, and clearly connected to backend or frontend behavior.
- Proof Target: SettingsPanel renders with five organized sections. Scope badges visible on all settings. Reset-to-defaults functional per section. All existing settings migrated from dropdown.
- Allowed Temporary Fallbacks: Some backend-connected settings may use the existing Tauri command path before a dedicated settings API is built; documented in Change Ledger.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## In Scope

- SettingsPanel component replacing the current dropdown menu.
- Five settings sections: Shell, Data, AI Provider, MCP, Deployment.
- Frontend/backend scope badges on every setting.
- Reset-to-defaults buttons per section.
- Migrate all existing settings from the dropdown to the new panel.
- Settings changes take effect immediately and persist through the recorder path.

## Out of Scope

- Adding new settings beyond what currently exists.
- Changing backend settings commands or adding new Tauri commands.
- Settings for features not yet implemented.

## Expected Files Touched

- .gov/Spec/stratatlas_spec_v1_2.md
- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-I1-025_settings-panel-rebuild.md
- .gov/workflow/wp_test_suites/TS-WP-I1-025.md
- .gov/workflow/wp_spec_extractions/SX-WP-I1-025.md
- .gov/workflow/wp_checks/check-WP-I1-025.ps1
- .product/Worktrees/wt_main/src/<implementation_files>

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0005 + PRIM-0052 | SettingsPanel + scope badges | Tauri commands + React panel component | Settings connected to real backend behavior with visible scope and organized sections |

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

- Explicit simulated/mock/sample paths: None -- all settings connect to real frontend state or existing backend commands.
- Required labels in code/UI/governance: Every setting must display a scope badge (frontend/backend). Reset-to-defaults must be labeled per section.
- Successor packet or debt owner: WP-I1-026 (AI interaction surface) may add AI-specific settings entries after this panel exists.
- Exit condition to remove fallback: All existing settings are migrated, scope badges are visible, and reset-to-defaults works per section.

## Change Ledger

- What Became Real: TBD
- What Remains Simulated: TBD
- Next Blocking Real Seam: TBD

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-025.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I1-025/
- Claim Standard: do not claim completion without linked command output and artifact paths.

## Exit Criteria

- Task board and requirements index statuses are synchronized.
- Traceability, primitives index, and primitives matrix are synchronized.
- Linked test suite has executed results and evidence paths.
- Evidence bundle is attached.
- Reality Boundary, Fallback Register, and Change Ledger are truthful.
- User Sign-off: APPROVED.

## Evidence

- Test Suite Execution:
- Logs:
- Screenshots/Exports:
- Build Artifacts:
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I1-025/
- User Sign-off:

## Progress Log

- 2026-04-11: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
