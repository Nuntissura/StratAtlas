# WP-I10-002 - Solver Backed Strategic Modeling Runtime

Date Opened: 2026-03-06
Status: SPEC-MAPPED
Iteration: I10
Workflow Version: 3.0
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I10-002.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I10-002.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I10-002.ps1

## Intent

Replace local arithmetic heuristics with the governed solver-backed strategic modeling runtime defined by the spec. This packet restores reproducible game artifacts, scenario-tree evaluation, solver traces, and experiment bundles on top of authoritative runtime state.

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

- PRIM-0058 | Strategic Solver Adapter | Execute governed strategic modeling and scenario-tree evaluation with explicit assumptions and uncertainty handling.
- PRIM-0059 | Experiment Bundle Result Store | Persist solver runs, scenario trees, and reproducible experiment bundles with audit linkage.

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## In Scope

- Replace heuristic modeling outputs with governed solver-backed strategic evaluation and reproducible experiment capture.
- Persist model runs, solver settings, scenario trees, and result bundles in the authoritative artifact and audit stores.
- Restore the scenario and experiment workflow expected by the strategic modeling sub-spec without violating non-goal guardrails.

## Out of Scope

- Closing upstream storage, canvas, or context ingestion packets that this modeling runtime depends on.
- Implementing trading, prediction-market, or other prohibited financial workflows.
- Treating heuristic local arithmetic as acceptable proof once this packet is active.

## Expected Files Touched

- .gov/Spec/stratatlas_spec_v1_2.md
- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-I10-002_solver-backed-strategic-modeling-runtime.md
- .gov/workflow/wp_test_suites/TS-WP-I10-002.md
- .gov/workflow/wp_spec_extractions/SX-WP-I10-002.md
- .gov/workflow/wp_checks/check-WP-I10-002.ps1
- .product/Worktrees/wt_main/src/features/i10/
- .product/Worktrees/wt_main/src/lib/backend.ts
- .product/Worktrees/wt_main/src-tauri/src/lib.rs
- .product/Worktrees/wt_main/src/contracts/

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0058 | solver-backed strategic runtime | governed solver integration and scenario-tree evaluation | Restores the normative modeling engine instead of heuristic arithmetic. |
| PRIM-0059 | experiment bundle persistence | artifact store plus audit-linked model result capture | Makes solver runs reproducible, reviewable, and portable across sessions. |

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

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I10-002.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I10-002/
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
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I10-002/
- User Sign-off:

## Progress Log

- 2026-03-06: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
- 2026-03-06: Packet scope refined to replace heuristic modeling output with governed solver-backed runtime behavior.
