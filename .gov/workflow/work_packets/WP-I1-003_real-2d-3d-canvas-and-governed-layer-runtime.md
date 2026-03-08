# WP-I1-003 - Real 2D 3D Canvas and Governed Layer Runtime

Date Opened: 2026-03-06
Status: E2E-VERIFIED
Iteration: I1
Workflow Version: 3.0
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I1-003.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I1-003.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I1-003.ps1

## Intent

Replace the current summary-card canvas surrogate with the real governed 2D and 3D geospatial runtime required by the spec. This packet delivers the actual map and layer surface, establishes map-first feature integration for the existing app workflows, and locks the rendering, export, and performance contracts that later runtime packets build on.

## Linked Requirements

- REQ-0011
- REQ-0012
- REQ-0014
- REQ-0015
- REQ-0016
- REQ-0200
- REQ-0201
- REQ-0202
- REQ-0203
- REQ-0206
- REQ-0207
- REQ-0208
- REQ-0209
- REQ-0210
- REQ-0211
- REQ-0212

## Linked Primitives

- PRIM-0045 | Dual Surface Geospatial Runtime | Introduce the actual governed 2D and 3D map surfaces in the main canvas region.
- PRIM-0046 | GPU Overlay Composition | Render analytic and contextual overlays within the required labeling and performance contracts.
- PRIM-0047 | Budgeted Interaction Telemetry | Measure startup, scrub, and interaction budgets and expose graceful degradation when limits are exceeded.

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm `.gov/Spec/sub-specs/I1_map_runtime_research.md` is current and the research packet `WP-GOV-I1-RESEARCH-001` is closed.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## In Scope

- Deliver the real MapLibre 2D canvas, Cesium 3D globe mode, and governed shared scene-state shell in the main canvas region.
- Replace summary-only interaction paths with runtime map operations that support replay, compare, export, collaboration, query, context, scenario, AI, and later strategic-model workflows.
- Route the current governed state contracts, even where still simulator-backed, into real layers, annotations, inspect states, and map-linked compare surfaces.
- Capture performance telemetry and degraded-state behavior required by REQ-0014 through REQ-0016 and REQ-0206 through REQ-0212.

## Out of Scope

- Solving the comparative analytics, query execution, or AI gateway remediation packets that sit on top of this runtime.
- Closing storage and ingestion gaps that belong to WP-I0-003 and WP-I7-002.
- Shipping any layer source that violates licensing, provenance, or non-goal constraints.
- Building optional map-polish follow-ons such as indexed 3D tiles search, story-camera presets, or street-view integrations unless they are needed for the core runtime contract.

## Expected Files Touched

- .gov/Spec/stratatlas_spec_v1_2.md
- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/Spec/TECH_STACK.md
- .gov/Spec/sub-specs/I1_map_runtime_research.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-I1-003_real-2d-3d-canvas-and-governed-layer-runtime.md
- .gov/workflow/wp_test_suites/TS-WP-I1-003.md
- .gov/workflow/wp_spec_extractions/SX-WP-I1-003.md
- .gov/workflow/wp_checks/check-WP-I1-003.ps1
- .product/Worktrees/wt_main/src/App.tsx
- .product/Worktrees/wt_main/src/App.css
- .product/Worktrees/wt_main/src/features/i1/
- .product/Worktrees/wt_main/src/features/i1/components/
- .product/Worktrees/wt_main/src/features/i1/runtime/
- .product/Worktrees/wt_main/src/contracts/

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0045 | dual-surface map shell | React shell, MapLibre GL JS, CesiumJS, shared scene state | Replaces the current faux canvas with the actual geospatial workstation surface. |
| PRIM-0046 | governed overlay composition | deck.gl overlays, MapLibre layer specs, Cesium entities/tiles, governed layer metadata | Makes query, compare, context, scenario, AI, and modeling outputs renderable on the real map surfaces. |
| PRIM-0047 | interaction budget telemetry | runtime timers, Tauri smoke proof, degraded-state UX, export timing | Ensures runtime delivery can be measured and degraded-state behavior can be proven. |

## Spec-Test Coverage Plan

### Dependency and Environment Tests
- [ ] Dependency graph/lock integrity tests
- [ ] Runtime compatibility checks

### UI Contract Tests
- [ ] Required regions/modes/states with real mounted map or globe
- [ ] Error/degraded-state UX
- [ ] Layer labels, provenance, and legend visibility on-map

### Functional Flow Tests
- [ ] Replay, compare, and layer-toggle golden flows
- [ ] Query, context, scenario, collaboration, AI, and modeling map-link flows
- [ ] Persistence/replay/export flows

### Code Correctness Tests
- [ ] Unit tests
- [ ] Map runtime integration tests
- [ ] Static analysis (lint/type/schema)

### Red-Team and Abuse Tests
- [ ] Non-goal enforcement (spec section 3.2)
- [ ] Policy bypass scenarios
- [ ] Adversarial/invalid input cases

### Additional Tests
- [ ] Performance budgets
- [ ] Offline behavior
- [ ] Reliability/recovery
- [ ] Desktop runtime smoke for 2D and 3D surface mounting

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-003.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I1-003/
- Claim Standard: do not claim completion without linked command output and artifact paths.

## Exit Criteria

- Task board and requirements index statuses are synchronized.
- Traceability, primitives index, and primitives matrix are synchronized.
- Linked test suite has executed results and evidence paths.
- Evidence bundle is attached.
- User Sign-off: APPROVED.

## Evidence

- Test Suite Execution: Passed `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-003.ps1`.
- Logs: `.product/build_target/tool_artifacts/wp_runs/WP-I1-003/20260307_045256/summary.md`, `.product/build_target/tool_artifacts/wp_runs/WP-I1-003/20260307_045256/result.json`, `.product/build_target/tool_artifacts/wp_runs/WP-I1-003/20260307_045256/UI-001.log`, `.product/build_target/tool_artifacts/wp_runs/WP-I1-003/20260307_045256/FUNC-001.log`, `.product/build_target/tool_artifacts/wp_runs/WP-I1-003/20260307_045256/COR-001.log`, `.product/build_target/tool_artifacts/wp_runs/WP-I1-003/20260307_045256/COR-002.log`, `.product/build_target/tool_artifacts/wp_runs/WP-I1-003/20260307_045256/RED-001.log`, `.product/build_target/tool_artifacts/wp_runs/WP-I1-003/20260307_045256/EXT-001.log`, `.product/build_target/tool_artifacts/wp_runs/WP-I1-003/20260307_045256/EXT-002.log`
- Screenshots/Exports: `.product/build_target/tool_artifacts/wp_runs/WP-I1-003/20260307_045256/runtime_smoke/cold/runtime_smoke_summary.md`, `.product/build_target/tool_artifacts/wp_runs/WP-I1-003/20260307_045256/runtime_smoke/warm/runtime_smoke_summary.md`
- Build Artifacts: `.product/build_target/tool_artifacts/wp_runs/WP-I1-003/20260307_045256/runtime_smoke/`, `.product/build_target/tool_artifacts/wp_runs/WP-I1-003/20260307_045256/red_team_result.json`
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I1-003/
- User Sign-off: Approved via 2026-03-07 instruction to perform the outstanding `WP-I1-003` closeout tasks.

## Progress Log

- 2026-03-06: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
- 2026-03-06: Packet scope refined to define the real canvas runtime and performance-budget remediation required after the audit.
- 2026-03-07: Packet scope updated to follow the source-backed map-first contract from `WP-GOV-I1-RESEARCH-001`.
- 2026-03-07: Execution started. The main canvas now mounts a real MapLibre-driven map runtime with planar and orbital modes, map-linked feature overlays for query/context/compare/collaboration/scenario/AI/alerts/modeling, and a jsdom-safe fallback surface for automated tests.
- 2026-03-07: Local implementation verification passed in `.product/Worktrees/wt_main` with `pnpm lint`, `pnpm test`, and `pnpm build`. Packet remains `IN-PROGRESS` pending full packet-proof closure, broader desktop smoke evidence, and final 3D runtime closure scope.
- 2026-03-07: Packet closed as `E2E-VERIFIED` after `check-WP-I1-003.ps1` passed with governed Tauri cold/warm runtime smoke, full functional suite coverage, lint/build/cargo verification, and artifact-backed proof under `.product/build_target/tool_artifacts/wp_runs/WP-I1-003/20260307_045256/`.
