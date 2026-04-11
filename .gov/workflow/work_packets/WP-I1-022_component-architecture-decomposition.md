# WP-I1-022 - Component Architecture Decomposition

Date Opened: 2026-04-11
Status: SPEC-MAPPED
Iteration: I1
Workflow Version: 4.0
Packet Class: IMPLEMENTATION
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I1-022.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I1-022.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I1-022.ps1

## Intent

Decompose the 12,458-line monolithic App.tsx into independent region components (HeaderBar, LeftPanel, MapCanvas, RightPanel, BottomTray, SettingsPanel) with centralized state management via useReducer/context. Extract feature domains (query, AI, context, scenario, layers) into isolated modules. Modularize CSS per component. This is the foundation for all subsequent rebuild packets.

Supersedes: WP-I1-021 (panel layout stability -- layout grid now part of component architecture).

## Linked Requirements

- REQ-0200
- REQ-0212

## Linked Primitives

- PRIM-0005 | Stable UI Region Contract | Component decomposition establishes independently testable regions that directly implement the stable region contract

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## Reality Boundary

- Real Seam: Existing App.tsx split into region components with centralized state. All existing functionality preserved. Tests still pass.
- User-Visible Win: No visible change -- architecture refactor only. Same UI, but each region is now independently testable and modifiable.
- Proof Target: All existing tests pass after decomposition. Each region component renders independently. No regressions in bridge navigation or data-testid attributes.
- Allowed Temporary Fallbacks: Some cross-region state coupling may remain during migration; documented in Change Ledger.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## In Scope

- Extract HeaderBar, LeftPanel, MapCanvas, RightPanel, BottomTray, SettingsPanel components from App.tsx.
- Create centralized AppState reducer with useReducer/context.
- Extract feature modules (query, AI, context, scenario, layers, compare) into isolated directories.
- Modularize CSS per component (CSS Modules or co-located stylesheets).
- Preserve all data-testid attributes and bridge navigation targets.
- Absorb WP-I1-021 panel layout stability fixes into the new grid architecture.

## Out of Scope

- Visual redesign (that is WP-I1-023 and later).
- New features or new panel content.
- Changing panel content or adding new analytical capabilities.

## Expected Files Touched

- .gov/Spec/stratatlas_spec_v1_2.md
- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-I1-022_component-architecture-decomposition.md
- .gov/workflow/wp_test_suites/TS-WP-I1-022.md
- .gov/workflow/wp_spec_extractions/SX-WP-I1-022.md
- .gov/workflow/wp_checks/check-WP-I1-022.ps1
- .product/Worktrees/wt_main/src/<implementation_files>

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0005 | Region component extraction | React useReducer + Context + CSS Modules | Each region independently maintainable, testable, and modifiable without cross-region coupling |

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

- Explicit simulated/mock/sample paths: None -- this is a pure refactor of existing production code.
- Required labels in code/UI/governance: Region boundaries must be documented in component directory structure. All existing labels preserved.
- Successor packet or debt owner: WP-I1-023 (card system) depends on this decomposition being complete.
- Exit condition to remove fallback: All region components render independently and all existing tests pass.

## Change Ledger

- What Became Real: TBD
- What Remains Simulated: TBD
- Next Blocking Real Seam: TBD

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-022.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I1-022/
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
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I1-022/
- User Sign-off:

## Progress Log

- 2026-04-11: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
