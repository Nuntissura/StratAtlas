# WP-GOV-ITER-ACTIVE-001 - Iteration Activation and Sub-Spec Expansion

Date Opened: 2026-03-05
Status: IMPLEMENTED
Iteration: I0-I10
Workflow Version: 3.0

## Intent

Activate all open iteration work packets into active governance flow and eliminate sub-spec stubs.

## In Scope

- Move open iteration rows from `SPEC-MAPPED` to active governance statuses (`IN-PROGRESS`/`IMPLEMENTED`).
- Expand I0-I10 sub-spec files from STUB templates to draft contracts.
- Synchronize requirements index and traceability matrix with new sub-spec coverage.
- Record dependency baseline alignment in `TECH_STACK.md`.

## Outcomes

- `WP-I0-001` moved to `IN-PROGRESS`.
- `WP-I1-001` through `WP-I10-001` moved to `IMPLEMENTED` after implementation/test baseline capture.
- I0-I10 sub-spec files now contain full required section structure.
- `REQUIREMENTS_INDEX.md` statuses aligned with activation state.
- `TRACEABILITY_MATRIX.md` expanded for I2-I10 mappings.
- `TECH_STACK.md` updated to reflect active dependency baseline in `wt_main`.

## Evidence

- Task board row updates under `.gov/workflow/taskboard/TASK_BOARD.md`.
- Sub-spec files under `.gov/Spec/sub-specs/`.
- Requirements and traceability updates under `.gov/Spec/`.
- Governance preflight pass after changes.
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-GOV-ITER-ACTIVE-001.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-GOV-ITER-ACTIVE-001.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-GOV-ITER-ACTIVE-001.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-GOV-ITER-ACTIVE-001/
## Proof of Implementation

- Command Runs: reference linked check script output.
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-GOV-ITER-ACTIVE-001/
- Claim Standard: do not claim completion without linked command evidence and artifact paths.

## Linked Requirements

- REQ-XXXX

## Linked Primitives

- PRIM-XXXX | <name> | <reason>

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for linked primitives.

## Expected Files Touched

- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-GOV-ITER-ACTIVE-001_iteration-activation-and-subspec-expansion.md
- .gov/workflow/wp_test_suites/TS-WP-GOV-ITER-ACTIVE-001.md
- .gov/workflow/wp_spec_extractions/SX-WP-GOV-ITER-ACTIVE-001.md
- .gov/workflow/wp_checks/check-WP-GOV-ITER-ACTIVE-001.ps1
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
