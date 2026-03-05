# WP-<ITERATION>-<NNN> - <TITLE>

Date Opened: YYYY-MM-DD
Status: SPEC-MAPPED
Iteration: I0..I10 or All
Workflow Version: 2.0
Linked Test Suite: `.gov/workflow/wp_test_suites/TS-WP-<...>.md`

## Intent

<1-3 sentence outcome statement>

## Linked Requirements

- REQ-XXXX..REQ-YYYY

## Linked Primitives

- PRIM-XXXX | <name> | <reason this primitive matters to this WP>

## Primitive Matrix Impact

- Add/update rows in `.gov/Spec/PRIMITIVES_MATRIX.md` for all linked primitives.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Create governance checkpoint commit before product implementation.

## In Scope

- <item 1>
- <item 2>

## Out of Scope

- <item 1>
- <item 2>

## Expected Files Touched

- `.gov/Spec/stratatlas_spec_v1_2.md` (if contract changed)
- `.gov/Spec/REQUIREMENTS_INDEX.md`
- `.gov/Spec/TRACEABILITY_MATRIX.md`
- `.gov/Spec/PRIMITIVES_INDEX.md`
- `.gov/Spec/PRIMITIVES_MATRIX.md`
- `.gov/workflow/taskboard/TASK_BOARD.md`
- `.gov/workflow/work_packets/<this_wp>.md`
- `.gov/workflow/wp_test_suites/<linked_test_suite>.md`
- `.product/Worktrees/wt_main/src/<implementation_files>`

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

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

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
- User Sign-off:

## Progress Log

- YYYY-MM-DD: WP initialized.

