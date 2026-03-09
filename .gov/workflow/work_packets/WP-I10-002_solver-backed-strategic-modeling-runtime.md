# WP-I10-002 - Solver Backed Strategic Modeling Runtime

Date Opened: 2026-03-06
Status: E2E-VERIFIED
Iteration: I10
Workflow Version: 4.0
Packet Class: IMPLEMENTATION
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I10-002.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I10-002.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I10-002.ps1

## Intent

Replace the local heuristic strategic-model solve path with a governed backend runtime that evaluates scenario trees, records solver traces, and persists reproducible experiment bundles on top of authoritative recorder and bundle state. This packet is the final major prototype-debt retirement step before the current remediation queue can claim an end-to-end product runtime across I0-I10.

## Linked Requirements

- REQ-1100
- REQ-1101
- REQ-1102
- REQ-1103
- REQ-1104
- REQ-1105
- REQ-1106
- REQ-1107
- REQ-1108
- REQ-1109
- REQ-1110
- REQ-1111
- REQ-1112
- REQ-1113

## Linked Primitives

- PRIM-0058 | Strategic Solver Adapter | Moves strategic solve execution out of local UI arithmetic into a governed backend adapter with persisted seeds, methods, traces, and uncertainty handling.
- PRIM-0059 | Experiment Bundle Result Store | Persists solver runs, scenario-tree evaluations, and replayable experiment bundles with audit and bundle linkage.

## Primitive Matrix Impact

- Add/update rows in `.gov/Spec/PRIMITIVES_MATRIX.md` for all linked primitives.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Create governance checkpoint commit before product implementation.

## Reality Boundary

- Real Seam: Strategic solver execution must happen through a governed backend runtime and produce auditable scenario-tree traces plus reproducible experiment artifacts, not the current local arithmetic helper in `.product/Worktrees/wt_main/src/features/i10/gameModeling.ts`.
- User-Visible Win: Analysts can run a strategic model from the live desktop app, inspect the returned solver trace and experiment bundle metadata, reopen a bundle, and get the same scenario-linked modeled output back.
- Proof Target: Packet-specific Tauri runtime smoke for `WP-I10-002`, deterministic bundle reopen evidence, audit-log evidence for solver execution, and packet proof artifacts under `.product/build_target/tool_artifacts/wp_runs/WP-I10-002/`.
- Allowed Temporary Fallbacks: Browser-only development may retain an explicit `browser-simulated` solver fallback while the governed Tauri runtime is unavailable; that fallback must stay labeled and is not valid proof for status promotion.
- Promotion Guard: Do not promote beyond `IN-PROGRESS` unless the primary App solve path calls a governed backend command in Tauri, solver traces and experiment bundles persist through recorder/bundle reopen, and runtime smoke plus WP checks prove that path.

## In Scope

- Replace the local `runGameSolver` execution path with a governed backend strategic solver command and typed request/response contracts.
- Persist solver traces, experiment bundle artifacts, payoff proxies, parameter sweep output, and value-of-information output in the recorder and bundle-backed runtime state.
- Audit strategic solver execution with explicit inputs, seeds, methods, scenario refs, and result hashes.
- Extend the runtime smoke harness and WP check runner so `WP-I10-002` closes with cold/warm Tauri proof instead of test-only evidence.
- Synchronize I10 requirements, traceability, primitives, and taskboard state when proof is complete.

## Out of Scope

- Introducing prohibited financial trading, prediction, or individual-targeting workflows.
- Replacing previously verified I0-I9 runtime seams outside the integration points required for I10.
- Requiring an external cloud solver service for packet closure if the governed local Tauri runtime provides the authoritative solver adapter and proof.

## Expected Files Touched

- `.gov/Spec/REQUIREMENTS_INDEX.md`
- `.gov/Spec/TRACEABILITY_MATRIX.md`
- `.gov/Spec/PRIMITIVES_INDEX.md`
- `.gov/Spec/PRIMITIVES_MATRIX.md`
- `.gov/Spec/sub-specs/I10_strategic_game_modeling.md`
- `.gov/workflow/ROADMAP.md`
- `.gov/workflow/taskboard/TASK_BOARD.md`
- `.gov/workflow/work_packets/WP-I10-002_solver-backed-strategic-modeling-runtime.md`
- `.gov/workflow/wp_test_suites/TS-WP-I10-002.md`
- `.gov/workflow/wp_spec_extractions/SX-WP-I10-002.md`
- `.gov/workflow/wp_checks/check-WP-I10-002.ps1`
- `.gov/repo_scripts/run_wp_checks.ps1`
- `.product/Worktrees/wt_main/src/features/i10/`
- `.product/Worktrees/wt_main/src/App.tsx`
- `.product/Worktrees/wt_main/src/App.test.tsx`
- `.product/Worktrees/wt_main/src/lib/backend.ts`
- `.product/Worktrees/wt_main/src/lib/runtimeSmoke.ts`
- `.product/Worktrees/wt_main/src/contracts/`
- `.product/Worktrees/wt_main/scripts/runtime-smoke.mjs`
- `.product/Worktrees/wt_main/src-tauri/src/lib.rs`

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0058 | governed strategic solver runtime | Tauri command plus typed solver adapter | Replaces local UI heuristics with a real governed modeling runtime and explicit trace capture. |
| PRIM-0059 | experiment bundle persistence and replay | recorder state, bundle assets, audit log, runtime smoke | Makes solver runs reproducible, reopen-safe, and reviewable across sessions. |

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

- Explicit simulated/mock/sample paths: The browser-only local solve helper in `.product/Worktrees/wt_main/src/features/i10/gameModeling.ts` remains a labeled fallback until the governed Tauri path is complete.
- Required labels in code/UI/governance: Any non-Tauri or non-governed solve must be labeled `browser-simulated`, `local fallback`, or equivalent and excluded from proof claims.
- Successor packet or debt owner: `WP-I10-002` owns removal of the heuristic primary path; no successor packet is authorized yet.
- Exit condition to remove fallback: Tauri runtime smoke and bundle-reopen proof show the governed strategic solver is the primary execution path and deterministic reopen path.

## Change Ledger

- What Became Real: The primary I10 solve path now runs through a governed Tauri backend command, persists solver traces and experiment bundles into recorder and bundle state, records `game_model.solver_run` audit evidence, and passes packet-specific cold/warm desktop runtime smoke plus bundle reopen proof.
- What Remains Simulated: The browser-only fallback in `.product/Worktrees/wt_main/src/features/i10/gameModeling.ts` remains explicitly labeled `browser-simulated` for non-Tauri development and is excluded from proof claims.
- Next Blocking Real Seam: No remaining I0-I10 implementation seam. Follow-on governance closeout packets later resolved the remaining gate debt outside this packet.

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I10-002.ps1`
- Proof Artifact: `.product/build_target/tool_artifacts/wp_runs/WP-I10-002/`
- Claim Standard: never mark completion without linked command evidence and artifact paths.

## Exit Criteria

- Task board and requirements index statuses are synchronized.
- Traceability, primitives index, and primitives matrix are synchronized.
- Linked test suite has executed results and evidence paths.
- Evidence bundle is attached.
- `Reality Boundary`, `Fallback Register`, and `Change Ledger` remain truthful.
- User Sign-off: APPROVED.

## Evidence

- Test Suite Execution: `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I10-002.ps1`
- Logs: `.product/build_target/tool_artifacts/wp_runs/WP-I10-002/20260308_191502/summary.md`, `.product/build_target/tool_artifacts/wp_runs/WP-I10-002/20260308_191502/result.json`
- Screenshots/Exports: `.product/build_target/tool_artifacts/wp_runs/WP-I10-002/20260308_191502/runtime_smoke/runtime_smoke_summary.md`
- Build Artifacts: `.product/build_target/tool_artifacts/wp_runs/WP-I10-002/20260308_191502/EXT-001.log`, `.product/build_target/tool_artifacts/wp_runs/WP-I10-002/20260308_191502/EXT-002.log`
- Proof Artifact: `.product/build_target/tool_artifacts/wp_runs/WP-I10-002/20260308_191502/`
- User Sign-off: Approved via 2026-03-08 instruction to continue remediation work.

## Progress Log

- 2026-03-06: WP scaffold created via `.gov/repo_scripts/new_work_packet.ps1`.
- 2026-03-06: Packet scope refined to replace heuristic modeling output with governed solver-backed runtime behavior.
- 2026-03-08: Upgraded packet to Workflow Version 4.0, marked `IN-PROGRESS`, and fixed the real seam to governed backend strategic solver execution plus runtime smoke proof.
- 2026-03-08: Replaced the App-side heuristic primary path with a governed Tauri solver command, persisted solver traces and experiment bundles, and extended packet-specific runtime smoke plus proof-run automation.
- 2026-03-08: Passed `check-WP-I10-002.ps1`; official proof recorded at `.product/build_target/tool_artifacts/wp_runs/WP-I10-002/20260308_191502/`.
