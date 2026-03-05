# WP-GOV-PERFPORT-001 - Startup and macOS Portability Policy

Date Opened: 2026-03-05
Status: IMPLEMENTED
Iteration: All
Workflow Version: 3.0

## Intent

Add explicit governance and specification controls to prevent slow startup/regression patterns and preserve future macOS portability.

## In Scope

- Spec updates for startup and state-change budgets.
- Spec updates for desktop portability contract and release gate coverage.
- Requirement/index/traceability synchronization.
- Governance workflow and work-packet alignment for I0/I1.

## Outcomes

- Added startup and state-change budgets in spec section 11.5.
- Added desktop portability contract in spec section 5.1.
- Added Gate H and linked cross-cutting requirements (REQ-0014..REQ-0018).
- Updated ROADMAP, TASK_BOARD, and I0/I1 WP stubs to include this work.
- Updated operator guidance docs (`PROJECT_CODEX.md`, `AGENTS.md`, `MODEL_BEHAVIOR.md`).

## Evidence

- Updated files under `.gov/Spec/`, `.gov/workflow/`, and repo root guidance docs.
- Governance preflight passes after updates.
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-GOV-PERFPORT-001.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-GOV-PERFPORT-001.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-GOV-PERFPORT-001.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-GOV-PERFPORT-001/
## Proof of Implementation

- Command Runs: reference linked check script output.
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-GOV-PERFPORT-001/
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
- .gov/workflow/work_packets/WP-GOV-PERFPORT-001_startup-macos-portability-policy.md
- .gov/workflow/wp_test_suites/TS-WP-GOV-PERFPORT-001.md
- .gov/workflow/wp_spec_extractions/SX-WP-GOV-PERFPORT-001.md
- .gov/workflow/wp_checks/check-WP-GOV-PERFPORT-001.ps1
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
