# WP-I1-005 - Map-First Workbench Shell Restyle and Workflow Partitioning

Date Opened: 2026-03-09
Status: SPEC-MAPPED
Iteration: I1
Workflow Version: 4.0
Packet Class: IMPLEMENTATION
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I1-005.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I1-005.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I1-005.ps1

## Intent

Restyle the verified StratAtlas runtime into a calmer map-first desktop workbench with task-grouped panes, tabs, and tray behavior. The redesign must reduce simultaneous visual noise while preserving the real 2D/3D map, verified regions and modes, degradation feedback, and accessibility semantics.

## Linked Requirements

- REQ-0011
- REQ-0012
- REQ-0200
- REQ-0201
- REQ-0211
- REQ-0212

## Linked Primitives

- PRIM-0045 | Dual Surface Geospatial Runtime | The restyle must keep the live MapLibre/Cesium runtime as the dominant shell element.
- PRIM-0068 | Accessible Map Interaction Contract | Tabs, panes, and status states must remain keyboard reachable and not rely on color alone.
- PRIM-0071 | Map-First Workbench Shell | Organize the shell into a sober desktop workbench with grouped tasks and reduced overload.

## Primitive Matrix Impact

- Add/update rows in `.gov/Spec/PRIMITIVES_MATRIX.md` for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## Reality Boundary

- Real Seam: The actual app shell changes so the map is visually dominant and workflow detail is partitioned into calmer tabs, panes, and trays.
- User-Visible Win: Users can understand where to act next without the current all-at-once dashboard overload.
- Proof Target: Verified region selectors remain intact, the map stays center stage, grouped workflows render behind intentional tabs, and tests/smoke prove the shell still supports required map-linked flows.
- Allowed Temporary Fallbacks: Existing cards and forms may remain, but only if they are rehoused behind task-grouped tabs or tray panels rather than all shown at once.
- Promotion Guard: No new mocked or decorative shell surfaces; completion requires a real product shell change, not only CSS repainting.

## In Scope

- Introduce a calmer workbench frame across header, left panel, main canvas, right panel, and bottom tray.
- Re-group controls so features that belong together appear together.
- Reduce map competition by removing always-open dashboard behavior from the main canvas.
- Restyle shell chrome to comply with the `Uncodixfy` guidance and the workbench rubric.
- Preserve feature-to-map linkage for query, compare, context, deviation, alerts, scenario, collaboration, AI, and modeling.

## Out of Scope

- Replacing MapLibre, Cesium, or the existing governed runtime contracts.
- Arbitrary docking systems, detachable windows, or heavy layout-library adoption in this first pass.
- New product capability beyond the shell and presentation restructuring.

## Expected Files Touched

- `.gov/Spec/sub-specs/I1_workbench_restyle_research.md`
- `.gov/Spec/sub-specs/I1_layers_time_replay.md`
- `.gov/Spec/REQUIREMENTS_INDEX.md`
- `.gov/Spec/TRACEABILITY_MATRIX.md`
- `.gov/Spec/PRIMITIVES_INDEX.md`
- `.gov/Spec/PRIMITIVES_MATRIX.md`
- `.gov/workflow/ROADMAP.md`
- `.gov/workflow/taskboard/TASK_BOARD.md`
- `.gov/workflow/work_packets/WP-I1-005_map-first-workbench-shell-restyle-and-workflow-partitioning.md`
- `.gov/workflow/wp_test_suites/TS-WP-I1-005.md`
- `.gov/workflow/wp_spec_extractions/SX-WP-I1-005.md`
- `.gov/workflow/wp_checks/check-WP-I1-005.ps1`
- `.product/Worktrees/wt_main/src/App.tsx`
- `.product/Worktrees/wt_main/src/App.css`
- `.product/Worktrees/wt_main/src/index.css`
- `.product/Worktrees/wt_main/src/features/i1/components/MapRuntimeSurface.tsx`
- `.product/Worktrees/wt_main/src/features/i1/components/MapRuntimeSurface.css`
- `.product/Worktrees/wt_main/src/App.test.tsx`
- `.product/Worktrees/wt_main/src/features/i1/i1.test.ts`

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0045 | Main map surface | React + MapLibre + Cesium | Keeps the live map runtime as the dominant center-stage surface. |
| PRIM-0068 | Tabs, panes, and map controls | React semantics + keyboard states + CSS | Preserves keyboard reachability and non-color-only meaning during the restyle. |
| PRIM-0071 | Workbench shell | React state + CSS grid/flex layout | Rehouses the existing workflows into a calmer desktop-workbench frame. |

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

- Explicit simulated/mock/sample paths: No new simulated data or shell placeholders may be added; existing real runtime data paths remain authoritative.
- Required labels in code/UI/governance: If a legacy card remains during the transition, it must remain behind an explicit tab or tray label instead of appearing as ambient dashboard filler.
- Successor packet or debt owner: None yet; open follow-on only if saved layouts or split-map compare are intentionally broken out after this restyle.
- Exit condition to remove fallback: The verified shell shows grouped panes/tabs and no longer presents the previous always-open dashboard layout as the default.

## Change Ledger

- What Became Real: The restyle packet now has an explicit shell boundary, proof target, and governing rubric.
- What Remains Simulated: No new simulation is introduced; the current shell still exists until product changes land.
- Next Blocking Real Seam: Move the real app shell from dashboard composition to a task-grouped workbench without breaking verified runtime behavior.

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-005.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I1-005/
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
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I1-005/
- User Sign-off:

## Progress Log

- 2026-03-09: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
- 2026-03-09: Scope refined to a fixed-pane workbench redesign guided by `Uncodixfy`, progressive-disclosure research, and the new I1 restyle rubric.
