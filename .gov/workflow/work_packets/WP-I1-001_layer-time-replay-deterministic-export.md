# WP-I1-001 - Layer/Time Replay Deterministic Export

Date Opened: 2026-03-04
Status: IMPLEMENTED
Iteration: I1
Workflow Version: 2.0
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I1-001.md

## Intent

Deliver the I1 slice for layer system, time/replay behavior, and deterministic export paths.

## Linked Requirements

- REQ-0200..REQ-0212
- REQ-0014, REQ-0015, REQ-0016 (startup and state-change budgets)

## Required Pre-Work

- Confirm I1 sub-spec is written and approved.
- Ensure traceability rows for REQ-0200..REQ-0212 are mapped.
- Move Task Board status to `SPEC-MAPPED` or `IN-PROGRESS` before coding starts.

## Initial Scope

- Layer contract and licensing/export enforcement.
- Time controls and replay mode behavior.
- Deterministic export path and performance-budget validation.
- Startup and common state-change responsiveness validation against spec budgets.

## Exit Criteria

- I1 outcomes recorded on Task Board.
- REQ-0200..REQ-0212 statuses updated in index.
- Traceability and verification evidence linked.
- E2E-VERIFIED requires runtime evidence and user sign-off.

## Progress Log

- 2026-03-05: Sub-spec advanced from STUB to DRAFT and moved into active sub-spec phase.
- 2026-03-05: I1 dependency baseline installed in `.product/Worktrees/wt_main` (MapLibre, Cesium, deck.gl, charts, loaders, DuckDB-WASM) to unblock implementation.


- 2026-03-05: Implementation completed and verified via lint/test/build evidence.

## Linked Primitives

- PRIM-0005 | <name> | linked contract for this iteration
- PRIM-0006 | <name> | linked contract for this iteration
- PRIM-0007 | <name> | linked contract for this iteration
- PRIM-0008 | <name> | linked contract for this iteration
- PRIM-0009 | <name> | linked contract for this iteration

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for linked primitives.

## Expected Files Touched

- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-I1-001_layer-time-replay-deterministic-export.md
- .gov/workflow/wp_test_suites/TS-WP-I1-001.md
- .product/Worktrees/wt_main/src/<implementation_files>

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| <primitive> | <feature/tool> | <tech> | <why this combination matters> |

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

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives/test-suite).
2. Implementation commit(s).
3. Verification/status promotion commit.
## Evidence

- Test Suite Execution:
- Logs:
- Screenshots/Exports:
- Build Artifacts:
- User Sign-off:
