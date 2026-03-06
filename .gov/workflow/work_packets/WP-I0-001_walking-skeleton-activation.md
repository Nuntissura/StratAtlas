# WP-I0-001 - Walking Skeleton Activation

Date Opened: 2026-03-04
Status: SUPERSEDED
Iteration: I0
Workflow Version: 2.0
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I0-001.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I0-001.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I0-001.ps1

## Intent

Activate the first implementation slice for the I0 walking skeleton.

## Linked Requirements

- REQ-0100..REQ-0112
- REQ-0017, REQ-0018 (desktop portability guardrails)

## Required Pre-Work

- Confirm sub-spec for I0 is written and approved.
- Ensure traceability rows for REQ-0100..REQ-0112 are mapped.
- Confirm Task Board status is `SPEC-MAPPED` or `IN-PROGRESS` before coding starts.

## Progress Log

- 2026-03-05: Integrated I0-I10 app shell expanded in .product/Worktrees/wt_main/src/App.tsx with replay/compare/query/AI/context/deviation/OSINT/game-model workflows.
- 2026-03-05: Sub-spec expanded from STUB to DRAFT contract for implementation.
- 2026-03-05: Product implementation scaffold started in `.product/Worktrees/wt_main`.
- 2026-03-06: Activation-shell baseline closed as `SUPERSEDED`; retained proof remains linked while successor packet `WP-I0-002` carries the normative completion claim.

## Initial Scope

- Bundle creation/reopen determinism foundations.
- Audit + sensitivity marking foundations.
- Offline opening path for saved bundles/projects.
- Platform-neutral path/process conventions so macOS porting is not blocked.

## Exit Criteria

- I0 scope outcomes recorded on Task Board.
- Requirement statuses updated in index.
- Traceability and verification evidence linked.
- E2E-VERIFIED requires runtime evidence and user sign-off.

- 2026-03-05: Implementation completed and verified via lint/test/build evidence.

## Linked Primitives

- PRIM-0001 | <name> | linked contract for this iteration
- PRIM-0002 | <name> | linked contract for this iteration
- PRIM-0003 | <name> | linked contract for this iteration
- PRIM-0004 | <name> | linked contract for this iteration

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for linked primitives.

## Expected Files Touched

- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-I0-001_walking-skeleton-activation.md
- .gov/workflow/wp_test_suites/TS-WP-I0-001.md
- .product/Worktrees/wt_main/src/<implementation_files>
- .gov/workflow/wp_spec_extractions/SX-WP-I0-001.md
- .gov/workflow/wp_checks/check-WP-I0-001.ps1
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

- Test Suite Execution: retained activation-shell proof from `.gov/workflow/wp_checks/check-WP-I0-001.ps1`
- Logs: `.product/build_target/tool_artifacts/wp_runs/WP-I0-001/20260306_003702/DEP-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-I0-001/20260306_003702/UI-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-I0-001/20260306_003702/FUNC-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-I0-001/20260306_003702/COR-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-I0-001/20260306_003702/RED-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-I0-001/20260306_003702/EXT-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-I0-001/20260306_003702/EXT-002.log`
- Screenshots/Exports: N/A (CLI-driven validation)
- Build Artifacts: `.product/build_target/tool_artifacts/wp_runs/WP-I0-001/20260306_003702/result.json`; `.product/build_target/tool_artifacts/wp_runs/WP-I0-001/20260306_003702/summary.md`
- User Sign-off: N/A (`SUPERSEDED` by `WP-I0-002`)
- Proof Artifact: `.product/build_target/tool_artifacts/wp_runs/WP-I0-001/20260306_003702/`
## Proof of Implementation

- Command Runs: reference linked check script output.
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I0-001/
- Claim Standard: do not claim completion without linked command evidence and artifact paths.
