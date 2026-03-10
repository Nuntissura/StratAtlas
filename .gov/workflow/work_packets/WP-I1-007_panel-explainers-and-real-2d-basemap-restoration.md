# WP-I1-007 - Panel Explainers and Real 2D Basemap Restoration

Date Opened: 2026-03-10
Status: E2E-VERIFIED
Iteration: I1
Workflow Version: 4.0
Packet Class: IMPLEMENTATION
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I1-007.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I1-007.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I1-007.ps1

## Intent

Fix the current “2D map does not look like a real map” problem and reduce shell ambiguity by adding small per-panel explainer controls plus a real online 2D basemap with a truthful offline fallback.

## Linked Requirements

- REQ-0011
- REQ-0013
- REQ-0200
- REQ-0201
- REQ-0212

## Linked Primitives

- PRIM-0045 | Dual Surface Geospatial Runtime | the 2D surface must read as a real map while preserving the verified 3D/runtime contract
- PRIM-0068 | Accessible Map Interaction Contract | panel help controls and basemap-state labels must remain keyboard reachable and non-color-only
- PRIM-0071 | Map-First Workbench Shell | panel explainers must clarify the shell without reintroducing density or breaking map primacy

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## Reality Boundary

- Real Seam: The live workbench exposes plain-language explainers on each stable panel and the 2D surface mounts a recognizable online basemap when network is available, falling back truthfully to the schematic local map when offline or when the online basemap fails.
- User-Visible Win: Users can tell what each panel is for and the 2D map no longer feels broken or blank.
- Proof Target: App/UI tests plus packet-grade verification show explainer controls in all stable panels and a basemap-state contract that distinguishes online vs fallback rendering.
- Allowed Temporary Fallbacks: The packet may use an external online basemap provider only as a non-blocking enhancement; offline fallback must remain available and truthfully labeled.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## In Scope

- Add small info/about controls to the left, main, right, and bottom panel headers with concise “what this shows / what this does” copy.
- Restore a real online 2D basemap for the MapLibre surface while preserving a schematic offline/load-failure fallback and explicit state labeling.

## Out of Scope

- Adding the requested live air, shipping, satellite, infrastructure, airport, or port datasets themselves.
- Reworking the entire shell layout again beyond the narrow clarity and 2D-basemap fix.

## Expected Files Touched

- .gov/Spec/stratatlas_spec_v1_2.md
- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/ROADMAP.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-I1-007_panel-explainers-and-real-2d-basemap-restoration.md
- .gov/workflow/wp_test_suites/TS-WP-I1-007.md
- .gov/workflow/wp_spec_extractions/SX-WP-I1-007.md
- .gov/workflow/wp_checks/check-WP-I1-007.ps1
- .gov/Spec/sub-specs/I1_panel_explainers_and_real_2d_basemap.md
- .product/Worktrees/wt_main/src/App.tsx
- .product/Worktrees/wt_main/src/App.css
- .product/Worktrees/wt_main/src/App.test.tsx
- .product/Worktrees/wt_main/src/features/i1/components/MapRuntimeSurface.tsx
- .product/Worktrees/wt_main/src/features/i1/components/MapRuntimeSurface.css

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0071 | Panel explainer controls | React disclosure state + header actions + concise panel help cards | Each stable region can explain its role without forcing users to guess the shell structure. |
| PRIM-0045 | Real online 2D basemap | MapLibre + OpenFreeMap style URL + local fallback style | The planar runtime reads like a real map instead of a dark abstract canvas. |
| PRIM-0068 | Basemap/help state cues | Accessible buttons, pressed-state disclosure, explicit fallback labels | Users can discover help and degraded basemap state without relying on color or prior knowledge. |

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

- Explicit simulated/mock/sample paths: No simulated basemap claims; if the online basemap is unavailable the UI must label the runtime as a fallback schematic map.
- Required labels in code/UI/governance: Each panel explainer must state what the panel shows and what it does. The map runtime must distinguish online basemap vs fallback schematic.
- Successor packet or debt owner: Future live data layers move to follow-on packets owned by `WP-GOV-MAPDATA-001`.
- Exit condition to remove fallback: The 2D surface shows a recognizable online basemap when available, remains usable offline, and the shell exposes truthful inline panel help.

## Change Ledger

- What Became Real: All four stable shell regions now expose inline explainer cards, and the 2D runtime now truthfully distinguishes a recognizable online basemap from schematic fallback states instead of presenting only an abstract dark surface.
- What Remains Simulated: Requested future live/source-backed layer families remain outside this packet and must not be implied by the new basemap/help improvements.
- Next Blocking Real Seam: Use the governed source contract in `WP-GOV-MAPDATA-001` to implement the first source-backed toggleable map-visible layer families.

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-007.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I1-007/
- Claim Standard: do not claim completion without linked command output and artifact paths.

## Exit Criteria

- Task board and requirements index statuses are synchronized.
- Traceability, primitives index, and primitives matrix are synchronized.
- Linked test suite has executed results and evidence paths.
- Evidence bundle is attached.
- Reality Boundary, Fallback Register, and Change Ledger are truthful.
- User Sign-off: APPROVED.

## Evidence

- Test Suite Execution: `pnpm exec vitest run src/App.test.tsx`; `pnpm exec vitest run src/features/i1/i1.test.ts`
- Logs: `.product/build_target/tool_artifacts/wp_runs/WP-I1-007/20260310_012211/`
- Screenshots/Exports: N/A for this narrow packet; basemap-state proof is captured in UI and WP logs
- Build Artifacts: `pnpm build`; Rust verification captured via `.product/build_target/tool_artifacts/wp_runs/WP-I1-007/20260310_012211/EXT-002.log`
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I1-007/20260310_012211/
- User Sign-off: Pending

## Progress Log

- 2026-03-10: WP scaffold created via `.gov/repo_scripts/new_work_packet.ps1`.
- 2026-03-10: Packet rewritten around panel explainers plus real online 2D basemap restoration; linked sub-spec is `.gov/Spec/sub-specs/I1_panel_explainers_and_real_2d_basemap.md`.
- 2026-03-10: App tests, I1 tests, lint, build, governance preflight, template compliance, and `.gov/workflow/wp_checks/check-WP-I1-007.ps1` all passed; proof artifact: `.product/build_target/tool_artifacts/wp_runs/WP-I1-007/20260310_012211/`.
