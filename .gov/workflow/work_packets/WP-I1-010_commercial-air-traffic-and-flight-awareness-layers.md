# WP-I1-010 - Commercial Air Traffic and Flight Awareness Layers

Date Opened: 2026-03-10
Status: SPEC-MAPPED
Iteration: I1
Workflow Version: 4.0
Packet Class: IMPLEMENTATION
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I1-010.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I1-010.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I1-010.ps1

## Intent

Deliver the first live mobility family using commercial air traffic while keeping any military-awareness layer explicitly separate, heuristic, and truth-labeled.

## Linked Requirements

- REQ-0013
- REQ-0108
- REQ-0200
- REQ-0201
- REQ-0202
- REQ-0203
- REQ-0211
- REQ-0212

## Linked Primitives

- PRIM-0045 | Dual Surface Geospatial Runtime | aircraft movement must be rendered as a governed live/degraded map family in 2D and 3D.
- PRIM-0046 | GPU Overlay Composition | moving flight layers must coexist with existing evidence, alerts, and infrastructure overlays.
- PRIM-0071 | Map-First Workbench Shell | the air-traffic family must fit the grouped dock and preserve map primacy.

## Primitive Matrix Impact

- Add/update rows in `.gov/Spec/PRIMITIVES_MATRIX.md` for every primitive listed above.

## Required Pre-Work

- Confirm `WP-I1-008` has established the grouped layer-family control dock.
- Confirm source assumptions from `GOV_toggleable_live_source_layer_research.md` remain current.
- Confirm task board row exists and status is current.

## Reality Boundary

- Real Seam: The app renders a governed commercial air-traffic family with explicit live/delayed state labels and a separately labeled military-awareness overlay when heuristics or curation are used.
- User-Visible Win: The map gains real motion and route context in a way users immediately understand.
- Proof Target: Packet checks prove air-traffic toggles, degraded/offline labels, and explicit separation between commercial feed truth and military-awareness heuristics.
- Allowed Temporary Fallbacks: Delayed or cached air traffic is acceptable if labeled; military-awareness may remain heuristic or curated if that boundary is explicit.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to `E2E-VERIFIED`.

## In Scope

- Commercial aircraft positions and motion state.
- Separate flight-awareness layer or badges for curated or heuristic military-awareness logic.

## Out of Scope

- Unsupported military/commercial certainty claims.
- Any individual targeting, covert inference, or hidden identity enrichment workflow.

## Expected Files Touched

- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/ROADMAP.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-I1-010_commercial-air-traffic-and-flight-awareness-layers.md
- .gov/workflow/wp_test_suites/TS-WP-I1-010.md
- .gov/workflow/wp_spec_extractions/SX-WP-I1-010.md
- .gov/workflow/wp_checks/check-WP-I1-010.ps1
- .gov/Spec/sub-specs/I1_commercial_air_traffic_and_flight_awareness_layers.md
- .product/Worktrees/wt_main/src/App.tsx
- .product/Worktrees/wt_main/src/features/i1/layers.ts
- .product/Worktrees/wt_main/src/features/i1/runtime/mapRuntimeScene.ts
- .product/Worktrees/wt_main/src/features/i1/components/MapRuntimeSurface.tsx

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0045 | Air-traffic family | live/delayed aircraft feed + 2D/3D runtime mapping | The map gains governed flight movement as a true mobility layer. |
| PRIM-0046 | Motion overlay composition | track lines, points, AOI aggregation | Air traffic coexists with infrastructure, context, and alert overlays. |
| PRIM-0071 | Family fit and truth labels | grouped dock + family details + legend copy | Users can tell what is live, delayed, cached, or heuristic without shell clutter. |

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

- Explicit simulated/mock/sample paths: Delayed or cached traffic states are acceptable if source-state labels remain explicit.
- Required labels in code/UI/governance: Commercial traffic truth must remain separate from any curated or heuristic military-awareness overlay.
- Successor packet or debt owner: `WP-I1-011`, `WP-GOV-MAPDATA-002`, `WP-I1-012`, `WP-I1-013`.
- Exit condition to remove fallback: Commercial air traffic is source-backed and any non-source-backed military-awareness path is clearly labeled as such.

## Change Ledger

- What Became Real: The queue now has a dedicated owner for the first live mobility family rather than hiding that work inside a generic future-map note.
- What Remains Simulated: The product does not yet render commercial flight motion or military-awareness overlays.
- Next Blocking Real Seam: Finish `WP-I1-008`, then implement live/delayed commercial air traffic with a separate truth-labeled military-awareness path.

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-010.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I1-010/
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
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I1-010/
- User Sign-off:

## Progress Log

- 2026-03-10: WP scaffold created via `.gov/repo_scripts/new_work_packet.ps1`.
- 2026-03-10: Packet rewritten as the first live mobility-layer successor in the new map-family queue.
