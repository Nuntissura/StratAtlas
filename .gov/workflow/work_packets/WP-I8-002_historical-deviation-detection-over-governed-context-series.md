# WP-I8-002 - Historical Deviation Detection over Governed Context Series

Date Opened: 2026-03-06
Status: SPEC-MAPPED
Iteration: I8
Workflow Version: 3.0
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I8-002.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I8-002.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I8-002.ps1

## Intent

Replace synthetic deviation math with the governed historical deviation detection runtime defined by the spec. This packet restores standardized deviation events and downstream propagation over authoritative context series.

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
- Confirm governance kickoff checkpoint commit is made before product implementation.

## In Scope

- Implement historical deviation detection over authoritative context series and persist the resulting state and events.
- Restore standardized event emission and downstream propagation hooks required by the scenario and alert layers.
- Replace demo-only deviation logic with reproducible analytics tied to governed context retrieval.

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
- .product/Worktrees/wt_main/src/lib/backend.ts
- .product/Worktrees/wt_main/src-tauri/src/lib.rs
- .product/Worktrees/wt_main/src/contracts/

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0062 | deviation detection runtime | governed time-series analytics and event propagation | Turns stored context history into standardized deviation outputs that other packets can trust. |

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
- User Sign-off: APPROVED.

## Evidence

- Test Suite Execution:
- Logs:
- Screenshots/Exports:
- Build Artifacts:
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I8-002/
- User Sign-off:

## Progress Log

- 2026-03-06: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
- 2026-03-06: Packet scope refined to target real deviation detection over governed context series rather than simulated deltas.
