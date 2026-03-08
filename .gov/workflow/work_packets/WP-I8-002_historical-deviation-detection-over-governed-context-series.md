# WP-I8-002 - Historical Deviation Detection over Governed Context Series

Date Opened: 2026-03-06
Status: E2E-VERIFIED
Iteration: I8
Workflow Version: 4.0
Packet Class: IMPLEMENTATION
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I8-002.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I8-002.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I8-002.ps1

## Intent

Replace synthetic deviation math and manual baseline entry with a governed historical deviation detection runtime over persisted context series. This packet restores explicit baseline-vs-observed windows, standardized `context.deviation` events, and deterministic downstream propagation into the map, scenario workspace, and aggregate alert surfaces.

## Reality Boundary

- Real Seam: deviation detection derives reproducible baseline and observed windows directly from governed context records for the selected domain and AOI instead of relying on analyst-entered numeric strings.
- User-Visible Win: analysts can select an approved context domain and immediately see a truthful historical baseline, current observation window, deviation score, and scenario/map propagation without hand-building the input series.
- Proof Target: `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I8-002.ps1` with passing product tests, deterministic bundle/reopen proof, and governed desktop runtime smoke assertions attached under `.product/build_target/tool_artifacts/wp_runs/WP-I8-002/`.
- Allowed Temporary Fallbacks: labeled manual numeric entry may remain as an analyst override while the governed windowed path becomes the default; no unlabeled seeded or hidden simulated deviation path is allowed.
- Promotion Guard: do not promote this packet until the governed path is the primary runtime, replay is deterministic, and downstream scenario/map propagation is proved against persisted context history.

## Fallback Register

- Explicit simulated/mock/sample paths: existing manual baseline/observed numeric inputs remain temporary analyst overrides during implementation; test fixtures may still use sample context records under `src/features/i8/i8.test.ts`.
- Required labels in code/UI/governance: any manual override path must be labeled `manual override`, and governed outputs must remain labeled `Curated Context` plus `derived from context data`.
- Successor packet or debt owner: `WP-I9-002` consumes standardized deviation outputs for alert aggregation; no successor packet may absorb a hidden manual-only deviation path.
- Exit condition to remove fallback: governed window derivation, bundle replay, and runtime smoke prove the historical deviation flow end to end, allowing manual-only dependency to be removed or demoted to an explicit analyst tool.

## Change Ledger

- 2026-03-08: Packet upgraded to Workflow Version 4.0 and moved to `IN-PROGRESS` with an explicit real seam, fallback register, and promotion guard.
- 2026-03-08: `src/features/i8/deviation.ts` now derives explicit baseline and observed windows from governed context records, attaches window/sample metadata to deviation events, and persists replay-safe deviation config.
- 2026-03-08: `src/App.tsx` now defaults the live deviation workspace to `governed_series`, exposes baseline/observed point counts, keeps manual entry as a labeled override, and records governed-source deviation events into the scenario workflow.
- 2026-03-08: Packet closed as `E2E-VERIFIED` after `check-WP-I8-002.ps1` passed with full functional regression, lint/build/Rust verification, and cold/warm Tauri runtime smoke proving governed deviation recording, bundle reopen restoration, map projection, and deviation-linked scenario constraint propagation under `.product/build_target/tool_artifacts/wp_runs/WP-I8-002/20260308_154423/`.
- What Became Real: governed historical deviation detection is now the primary runtime path, bundle capture waits for persisted deviation state, the map runtime exposes deviation-linked signals, and scenario forks can apply deviation-derived `constraint_node` suggestions after bundle reopen.
- What Remains Simulated: the labeled `manual override` entry path remains available as an explicit analyst fallback; no hidden simulated deviation path remains in the primary runtime seam.
- Next Blocking Real Seam: `WP-I9-002` must now consume the standardized governed deviation outputs for aggregate-only alert evaluation and connector-backed alert aggregation.

## Linked Requirements

- REQ-0900
- REQ-0901
- REQ-0902
- REQ-0903
- REQ-0904

## Linked Primitives

- PRIM-0062 | Historical Deviation Detector | Detect and emit governed deviation events over persisted context-domain time series.

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Create governance checkpoint commit before product implementation.

## In Scope

- Implement governed historical deviation detection over authoritative context series and persist the resulting event/window state.
- Restore standardized event emission and deterministic downstream propagation hooks required by the scenario, map, and aggregate alert layers.
- Replace manual-first deviation workflows with reproducible analytics tied to governed context retrieval and replay-safe bundle capture.

## Out of Scope

- Building the context ingestion backbone, which remains the responsibility of WP-I7-002.
- Closing aggregate alert or solver packets that only consume deviation outputs.
- Shipping any individual-targeting or misuse-oriented alert semantics prohibited by the spec.

## Expected Files Touched

- .gov/Spec/stratatlas_spec_v1_2.md
- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-I8-002_historical-deviation-detection-over-governed-context-series.md
- .gov/workflow/wp_test_suites/TS-WP-I8-002.md
- .gov/workflow/wp_spec_extractions/SX-WP-I8-002.md
- .gov/workflow/wp_checks/check-WP-I8-002.ps1
- .product/Worktrees/wt_main/src/features/i8/
- .product/Worktrees/wt_main/src/App.tsx
- .product/Worktrees/wt_main/src/features/i1/runtime/mapRuntimeScene.ts
- .product/Worktrees/wt_main/src/lib/backend.ts
- .product/Worktrees/wt_main/src-tauri/src/lib.rs
- .product/Worktrees/wt_main/src/contracts/

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0062 | deviation detection runtime | governed time-series analytics, deterministic window selection, and event propagation | Turns stored context history into standardized deviation outputs that the map, scenario, and alert packets can trust. |

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

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I8-002.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I8-002/
- Claim Standard: do not claim completion without linked command output and artifact paths.

## Exit Criteria

- Task board and requirements index statuses are synchronized.
- Traceability, primitives index, and primitives matrix are synchronized.
- Linked test suite has executed results and evidence paths.
- Evidence bundle is attached.
- Reality Boundary, Fallback Register, and Change Ledger remain truthful.
- User Sign-off: APPROVED.

## Evidence

- Test Suite Execution: `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I8-002.ps1`
- Logs: official closeout passed on 2026-03-08 with governed runtime smoke, full functional regression, lint, template compliance, red-team guardrail checks, build, and Rust unit verification.
- Screenshots/Exports:
- Build Artifacts: `.product/build_target/tool_artifacts/wp_runs/WP-I8-002/20260308_154423/EXT-001.log`
- Proof Artifact: `.product/build_target/tool_artifacts/wp_runs/WP-I8-002/20260308_154423/`
- User Sign-off: Approved via 2026-03-08 instruction to start and continue `WP-I8-002`.

## Progress Log

- 2026-03-06: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
- 2026-03-06: Packet scope refined to target real deviation detection over governed context series rather than simulated deltas.
- 2026-03-08: Packet upgraded to Workflow Version 4.0 and started with the governed baseline/observed-window runtime seam as the primary delivery target.
- 2026-03-08: First product slice landed governed historical-window selection, replay-safe deviation config/state, governed-first App UI wiring, and targeted App/unit/backend validation.
- 2026-03-08: Official packet proof passed at `.product/build_target/tool_artifacts/wp_runs/WP-I8-002/20260308_154423/`, closing REQ-0900..REQ-0904 and promoting `PRIM-0062` to `E2E-VERIFIED`.
