# WP-I1-011 - Satellite Orbit and Coverage Layers

Date Opened: 2026-03-10
Status: SPEC-MAPPED
Iteration: I1
Workflow Version: 4.0
Packet Class: IMPLEMENTATION
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I1-011.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I1-011.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I1-011.ps1

## Intent

Add a governed satellite family that works on the 2D map and 3D globe while truthfully labeling propagated positions as modeled results derived from orbital elements.

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

- PRIM-0045 | Dual Surface Geospatial Runtime | satellites must be spatially legible in both planar and globe modes.
- PRIM-0046 | GPU Overlay Composition | orbit tracks, footprints, and point markers must coexist with existing scene overlays.
- PRIM-0071 | Map-First Workbench Shell | the satellite family must stay controllable without overwhelming the workbench.

## Primitive Matrix Impact

- Add/update rows in `.gov/Spec/PRIMITIVES_MATRIX.md` for every primitive listed above.

## Required Pre-Work

- Confirm `WP-I1-008` has established the grouped layer-family control dock.
- Confirm sub-spec is written and approved.
- Confirm task board row exists and status is current.
- Confirm packet-specific responses to `.gov/Spec/sub-specs/GOV_map_family_intent_guardrails.md` are recorded in the linked sub-spec before status moves beyond `SPEC-MAPPED`.

## Reality Boundary

- Real Seam: The app renders toggleable satellite points, tracks, or footprints with explicit propagated-position labeling and grouped family controls in 2D and 3D.
- User-Visible Win: Users can understand orbital context directly on the map and globe instead of treating space objects as off-map metadata.
- Proof Target: Packet checks prove satellite family toggles, modeled-position labels, and stable rendering in both surfaces.
- Allowed Temporary Fallbacks: Cached orbital elements and limited constellation subsets are acceptable if clearly labeled.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to `E2E-VERIFIED`.

## In Scope

- Satellite points, tracks, or footprints derived from governed orbital-element feeds.
- Truthful modeled-position labels and grouped family controls.

## Out of Scope

- Claims of direct live telemetry when positions are only propagated.
- Mission inference or unsupported classification enrichment.

## Expected Files Touched

- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/ROADMAP.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-I1-011_satellite-orbit-and-coverage-layers.md
- .gov/workflow/wp_test_suites/TS-WP-I1-011.md
- .gov/workflow/wp_spec_extractions/SX-WP-I1-011.md
- .gov/workflow/wp_checks/check-WP-I1-011.ps1
- .gov/Spec/sub-specs/I1_satellite_orbit_and_coverage_layers.md
- .product/Worktrees/wt_main/src/App.tsx
- .product/Worktrees/wt_main/src/features/i1/layers.ts
- .product/Worktrees/wt_main/src/features/i1/runtime/mapRuntimeScene.ts
- .product/Worktrees/wt_main/src/features/i1/components/MapRuntimeSurface.tsx

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0045 | Satellite family | propagated orbit feed + 2D/3D runtime integration | The map and globe gain a true space-context layer family. |
| PRIM-0046 | Orbit composition | points, tracks, footprints, AOI context | Satellite geometry coexists with other governed overlays. |
| PRIM-0071 | Family grouping | dock controls + legend + detail help | Users can enable satellite context without shell overload. |

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

- Explicit simulated/mock/sample paths: Cached orbital elements and smaller constellation subsets are acceptable if the family is labeled as propagated or cached.
- Required labels in code/UI/governance: Satellite positions must say propagated/modeled when that is the underlying source truth.
- Successor packet or debt owner: `WP-GOV-MAPDATA-002`, `WP-I1-012`, `WP-I1-013`.
- Exit condition to remove fallback: Satellite context is source-backed, clearly labeled, and stable in both 2D and 3D.

## Change Ledger

- What Became Real: The queue now has a distinct owner for orbital and satellite context rather than burying that work under a generic "other map feeds" bucket.
- What Remains Simulated: The product does not yet render governed satellite families.
- Next Blocking Real Seam: Complete the family dock and then add propagated satellite layers with explicit modeled-position labeling.

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-011.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I1-011/
- Mandatory Guardrail Proof: show the family's strategic question fit, evidence/context label contract, mode behavior, bundle/export/reopen contract, and anti-tracker boundary per `.gov/Spec/sub-specs/GOV_map_family_intent_guardrails.md`.
- Claim Standard: do not claim completion without linked command output and artifact paths.

## Exit Criteria

- Task board and requirements index statuses are synchronized.
- Traceability, primitives index, and primitives matrix are synchronized.
- Linked test suite has executed results and evidence paths.
- Evidence bundle is attached.
- Reality Boundary, Fallback Register, and Change Ledger are truthful.
- Packet-specific guardrail responses are completed in the linked sub-spec and evidenced in the packet proof.
- User Sign-off: APPROVED.

## Evidence

- Test Suite Execution:
- Logs:
- Screenshots/Exports:
- Build Artifacts:
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I1-011/
- User Sign-off:

## Progress Log

- 2026-03-10: WP scaffold created via `.gov/repo_scripts/new_work_packet.ps1`.
- 2026-03-10: Packet rewritten as the governed satellite-family successor in the map layer queue.
