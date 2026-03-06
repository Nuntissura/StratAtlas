# WP-I6-001 - AI Gateway MCP Interface

Date Opened: 2026-03-04
Status: IN-PROGRESS
Iteration: I6
Workflow Version: 2.0
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I6-001.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I6-001.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I6-001.ps1

## Intent

Deliver policy-gated AI access and MCP interface with full auditability.

## Linked Requirements

- REQ-0700..REQ-0708

## Required Pre-Work

- Confirm I6 sub-spec is written and approved.
- Ensure traceability rows for REQ-0700..REQ-0708 are mapped.
- Move Task Board status to `SPEC-MAPPED` or `IN-PROGRESS` before coding starts.

## Initial Scope

- Gateway enforcement for RBAC, markings, licensing, and audit.
- MCP minimum tool surface and policy parity with UI gateway.
- Strict prohibition on raw DB/file path/internal endpoint exposure.

## Exit Criteria

- I6 outcomes recorded on Task Board.
- REQ-0700..REQ-0708 statuses updated in index.
- Traceability and verification evidence linked.
- E2E-VERIFIED requires runtime evidence and user sign-off.


## Progress Log

- 2026-03-05: Integrated I0-I10 app shell expanded in .product/Worktrees/wt_main/src/App.tsx with replay/compare/query/AI/context/deviation/OSINT/game-model workflows.
- 2026-03-05: Sub-spec advanced from STUB to DRAFT and moved into active sub-spec phase.


- 2026-03-05: Implementation completed and verified via lint/test/build evidence.
- 2026-03-06: Reactivated as the current blocking I6 packet after WP-I5-001 proof; prior 2026-03-05 evidence is treated as activation-shell baseline only pending normative I6 delivery.

## Linked Primitives

- PRIM-0015 | AI Gateway Request Contract | hash-addressed policy-gated AI requests, MCP tool contracts, and audit parity

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for linked primitives.

## Expected Files Touched

- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-I6-001_ai-gateway-mcp-interface.md
- .gov/workflow/wp_test_suites/TS-WP-I6-001.md
- .product/Worktrees/wt_main/src/<implementation_files>
- .gov/workflow/wp_spec_extractions/SX-WP-I6-001.md
- .gov/workflow/wp_checks/check-WP-I6-001.ps1
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

- Test Suite Execution: activation-shell baseline only from 2026-03-05; normative I6 verification pending current packet delivery
- Logs: baseline shell evidence references legacy 2026-03-05 session output only
- Screenshots/Exports: pending current packet delivery
- Build Artifacts: pending current packet delivery
- User Sign-off: Pending
- Proof Artifact: `.product/build_target/tool_artifacts/wp_runs/WP-I6-001/`
## Proof of Implementation

- Command Runs: reference linked check script output.
- Proof Artifact: `.product/build_target/tool_artifacts/wp_runs/WP-I6-001/`
- Claim Standard: do not claim completion without linked command evidence and artifact paths.
