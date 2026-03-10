# WP-I1-008 - Toggleable Layer Family Registry and Map Control Dock

Date Opened: 2026-03-10
Status: SPEC-MAPPED
Iteration: I1
Workflow Version: 4.0
Packet Class: IMPLEMENTATION
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I1-008.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I1-008.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I1-008.ps1

## Intent

Create the grouped layer-family registry and map control dock that will let future air, maritime, satellite, infrastructure, facility, and military-awareness layers remain toggleable without collapsing the workbench back into overload.

## Linked Requirements

- REQ-0013
- REQ-0200
- REQ-0201
- REQ-0202
- REQ-0203
- REQ-0212

## Linked Primitives

- PRIM-0045 | Dual Surface Geospatial Runtime | future source-backed families need one governed map-layer registry that behaves consistently in 2D and 3D.
- PRIM-0068 | Accessible Map Interaction Contract | the family dock must stay keyboard reachable and non-color-only even as the toggle count grows.
- PRIM-0071 | Map-First Workbench Shell | grouped family controls are the shell guardrail that keeps the map-first redesign from regressing into flat toggle sprawl.

## Primitive Matrix Impact

- Add/update rows in `.gov/Spec/PRIMITIVES_MATRIX.md` for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm successor layer-family packets are present so the dock shape reflects the real queue.

## Reality Boundary

- Real Seam: The app exposes grouped toggleable layer families with truthful source-state badges, calm disclosure, and persisted family visibility state instead of a flat workspace-layer list.
- User-Visible Win: Users can understand and control future map families without being overwhelmed.
- Proof Target: UI tests and packet-grade verification show grouped family sections, truthful availability badges, and persisted control state that survives bundle/workspace restore.
- Allowed Temporary Fallbacks: Families may be shown as unavailable, static-only, delayed, heuristic, or licensed-path-pending, but never as silently empty live layers.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to `E2E-VERIFIED`.

## In Scope

- Replace the flat workspace-layer toggle area with grouped family controls and explicit source-state badges.
- Persist family expansion/visibility state and connect the control dock to 2D/3D map runtime state.

## Out of Scope

- Shipping actual source-backed air, maritime, satellite, or infrastructure datasets.
- Reworking the entire shell layout again beyond the map control dock and layer-family registry.

## Expected Files Touched

- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/ROADMAP.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-I1-008_toggleable-layer-family-registry-and-map-control-dock.md
- .gov/workflow/wp_test_suites/TS-WP-I1-008.md
- .gov/workflow/wp_spec_extractions/SX-WP-I1-008.md
- .gov/workflow/wp_checks/check-WP-I1-008.ps1
- .gov/Spec/sub-specs/I1_toggleable_layer_family_registry.md
- .product/Worktrees/wt_main/src/App.tsx
- .product/Worktrees/wt_main/src/App.css
- .product/Worktrees/wt_main/src/features/i1/layers.ts
- .product/Worktrees/wt_main/src/features/i1/runtime/mapRuntimeScene.ts

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0071 | Layer family dock | React grouped controls + shell tabs + disclosure state | The shell gains a calm location for many map families without flattening them into one list. |
| PRIM-0045 | Family registry | Layer taxonomy + MapLibre/Cesium visibility wiring | Future families can share one governed control contract across 2D and 3D. |
| PRIM-0068 | Source-state badges | Accessible buttons, labels, and family status copy | Users can tell whether a family is live, static, delayed, heuristic, blocked, or unavailable. |

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

- Explicit simulated/mock/sample paths: Family entries may exist before source-backed data exists, but they must be visibly labeled as unavailable, static-only, heuristic, or blocked.
- Required labels in code/UI/governance: Every family must expose a truthful source-state label and not imply live coverage that does not exist.
- Successor packet or debt owner: `WP-I1-009`, `WP-I1-010`, `WP-I1-011`, `WP-GOV-MAPDATA-002`, `WP-I1-012`, and `WP-I1-013`.
- Exit condition to remove fallback: The dock groups families, persists user control state, and no family appears as an unlabeled empty toggle.

## Change Ledger

- What Became Real: The post-basemap queue now has a dedicated packet for the control surface that will hold all requested map layer families.
- What Remains Simulated: The current product still only exposes the smaller verified workspace-layer set.
- Next Blocking Real Seam: Implement the grouped registry and control dock before shipping the first large family payload packet.

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-008.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I1-008/
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
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I1-008/
- User Sign-off:

## Progress Log

- 2026-03-10: WP scaffold created via `.gov/repo_scripts/new_work_packet.ps1`.
- 2026-03-10: Packet rewritten as the foundation control-surface owner for all future toggleable map layer families.
