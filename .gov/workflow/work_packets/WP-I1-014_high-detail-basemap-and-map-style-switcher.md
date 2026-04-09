# WP-I1-014 - High-Detail Basemap and Map Style Switcher

Date Opened: 2026-04-09
Status: IMPLEMENTED
Iteration: I1
Workflow Version: 4.0
Packet Class: IMPLEMENTATION
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I1-014.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I1-014.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I1-014.ps1

## Intent

Add a real operator-controlled 2D basemap style switcher on top of the verified MapLibre runtime using official OpenFreeMap vector styles, persist the selected style through recorder and bundle state, and keep the existing truthful schematic fallback when the live style is unavailable.

## Linked Requirements

- REQ-0200
- REQ-0201
- REQ-0211

## Linked Primitives

- PRIM-0045 | Dual Surface Geospatial Runtime | The 2D surface must keep rendering governed overlays while the basemap style changes and while the selected style restores from saved state.
- PRIM-0071 | Map-First Workbench Shell | The style selector and truth labels must fit the calmer workbench shell without stealing space from the map or pretending to be a live-source family toggle.

## Primitive Matrix Impact

- Add or update the `PRIM-0045` and `PRIM-0071` rows in `.gov/Spec/PRIMITIVES_MATRIX.md` so the basemap-selector seam, persistence behavior, and shell-fit contract stay truthful.

## Required Pre-Work

- Confirm `WP-I1-005` and `WP-I1-007` remain the baseline shell and fallback-basemap proof.
- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## Reality Boundary

- Real Seam: The 2D MapLibre runtime exposes a selectable OpenFreeMap vector-style picker, preserves the selected style through recorder and bundle restore, and continues to degrade to the existing schematic fallback when online styles are unavailable.
- User-Visible Win: Analysts can switch the 2D map between multiple recognizable vector basemap styles instead of being locked to a single appearance.
- Proof Target: Packet checks prove selector rendering, saved-state restore, and truthful fallback behavior; live runtime verification should capture at least one snapshot of the selector over the real map if the desktop bridge is available.
- Allowed Temporary Fallbacks: This packet only commits to the official OpenFreeMap vector styles `positron`, `bright`, and `liberty`. Satellite imagery, dark/night styles, and terrain-specific styling remain future scope.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to `E2E-VERIFIED`.

## In Scope

- 2D basemap selector for the official OpenFreeMap vector styles `Positron`, `Bright`, and `Liberty`.
- Recorder and bundle persistence for the selected 2D basemap style.
- Truthful online-style versus schematic-fallback status copy.
- Toolbar and CSS adjustments required to keep the control compact and keyboard reachable.

## Out of Scope

- Satellite imagery or raster photo basemaps.
- Terrain DEM, globe atmosphere, or 3D-building enhancement work tracked separately in `WP-I1-016`.
- Dark-mode-specific basemap theming.
- New domain data feeds, layer families, or map-visible event content.

## Expected Files Touched

- .gov/Spec/stratatlas_spec_v1_2.md
- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/ROADMAP.md
- .gov/workflow/work_packets/WP-I1-014_high-detail-basemap-and-map-style-switcher.md
- .gov/workflow/wp_test_suites/TS-WP-I1-014.md
- .gov/workflow/wp_spec_extractions/
- .gov/workflow/wp_spec_extractions/SX-WP-I1-014.md
- .gov/workflow/wp_checks/
- .gov/workflow/wp_checks/check-WP-I1-014.ps1
- .gov/Spec/sub-specs/I1_high_detail_basemap_and_style_switcher.md
- .product/Worktrees/wt_main/src/App.tsx
- .product/Worktrees/wt_main/src/App.test.tsx
- .product/Worktrees/wt_main/src/contracts/i0.ts
- .product/Worktrees/wt_main/src/features/i1/components/MapRuntimeSurface.tsx
- .product/Worktrees/wt_main/src/features/i1/components/MapRuntimeSurface.css
- .product/Worktrees/wt_main/src/features/i1/runtime/basemaps.ts

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0045 | 2D basemap selector and restore | MapLibre + OpenFreeMap style endpoints + recorder state | The verified runtime gains operator-controlled visual detail without losing overlay integrity or restore determinism. |
| PRIM-0071 | Compact shell control and truthful status copy | React toolbar controls + map-runtime status UI | The selector improves map usability without turning into a noisy new dock family or fake live-source affordance. |

## Spec-Test Coverage Plan

### Dependency and Environment Tests
- [x] Governance preflight
- [x] Runtime dependency install/build checks

### UI Contract Tests
- [x] Selector renders in the 2D runtime toolbar without crowding existing controls
- [x] Fallback status still explains offline and load-failure states truthfully

### Functional Flow Tests
- [x] Style selection changes active 2D basemap preference
- [x] Recorder persistence and bundle reopen restore the selected style

### Code Correctness Tests
- [x] App/UI regression tests
- [x] Static analysis (lint/type/schema)
- [x] Production build

### Red-Team and Abuse Tests
- [x] Non-goal enforcement (spec section 3.2)
- [x] No misleading live-source framing for the selector
- [x] Invalid or unknown basemap-style restore values fall back safely

### Additional Tests
- [ ] Offline behavior
- [x] Reliability/recovery
- [x] Visual bridge/debugger proof if desktop runtime is available

## Fallback Register

- Explicit simulated/mock/sample paths: The selector only targets the official OpenFreeMap vector styles in this packet. No imagery, terrain DEM, or dark-style simulation is shipped here.
- Required labels in code/UI/governance: When the live style cannot load, the UI must continue to say the schematic fallback is active and may not present the selected style as if it were live.
- Successor packet or debt owner: `WP-I1-015` for declutter, `WP-I1-016` for terrain/globe detail, and the remaining UX queue packets for imagery/night/onboarding expansions if later approved.
- Exit condition to remove fallback: The 2D selector works with the official vector styles, survives restore, and truthfully communicates when the schematic fallback is active.

## Change Ledger

- What Became Real: The 2D runtime now ships a compact selector for the official OpenFreeMap `Positron`, `Bright`, and `Liberty` styles, persists the chosen style through recorder save, bundle reopen, and warm restore, normalizes invalid restored values back to the governed default, and keeps truthful fallback labels when the live style is unavailable.
- What Remains Simulated: Satellite imagery, terrain-specific styling, and dark/night variants remain outside this packet and must not be implied by the selector.
- Next Blocking Real Seam: User review plus the follow-on declutter packet `WP-I1-015`; this packet has no further implementation seam before any future `E2E-VERIFIED` promotion.

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-014.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I1-014/
- Claim Standard: do not claim completion without linked command output and artifact paths.

## Exit Criteria

- Task board and requirements index statuses are synchronized.
- Traceability, primitives index, and primitives matrix are synchronized.
- Linked test suite has executed results and evidence paths.
- Evidence bundle is attached.
- Reality Boundary, Fallback Register, and Change Ledger are truthful.
- User Sign-off: APPROVED.

## Evidence

- Test Suite Execution: `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-014.ps1` -> passed; `pnpm exec vitest run src/App.test.tsx --reporter=verbose` -> passed (32 tests, including selected-style restore and invalid-style normalization).
- Logs: `.product/build_target/tool_artifacts/wp_runs/WP-I1-014/20260409_051858/summary.md`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-014/20260409_051858/UI-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-014/20260409_051858/FUNC-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-014/20260409_051858/COR-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-014/20260409_051858/RED-001.log`.
- Screenshots/Exports: `.product/build_target/tool_artifacts/wp_runs/WP-I1-014/20260409_051858/visual_proof/planar_basemap_selector_live.png`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-014/20260409_051858/visual_proof/agent_state_planar.json`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-014/20260409_051858/visual_proof/agent_health.json`.
- Build Artifacts: `.product/build_target/tool_artifacts/wp_runs/WP-I1-014/20260409_051858/EXT-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-014/20260409_051858/EXT-002.log`.
- Proof Artifact: `.product/build_target/tool_artifacts/wp_runs/WP-I1-014/20260409_051858/`
- User Sign-off: Pending

## Progress Log

- 2026-04-09: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
- 2026-04-09: Packet rewritten around the actual first seam: official OpenFreeMap vector-style selection plus recorder/bundle persistence on the existing 2D runtime.
- 2026-04-09: Product seam landed in the verified 2D runtime with compact basemap buttons, persisted style state in recorder/bundle snapshots, and explicit online-versus-fallback copy.
- 2026-04-09: Added an explicit regression test for invalid restored basemap-style ids so unknown values normalize back to the governed default instead of leaking unsupported state.
- 2026-04-09: Official packet proof passed under `.product/build_target/tool_artifacts/wp_runs/WP-I1-014/20260409_051858/`, including governed packet checks, frontend tests, lint, build, Rust verification, and live bridge-driven snapshot capture in `visual_proof/`.
