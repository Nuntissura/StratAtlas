# WP-GOV-MAINT-001 - Governance Sync Sweep

Date Opened: 2026-03-04
Status: RECURRING
Iteration: All
Workflow Version: 3.0

## Intent

Keep governance source-of-truth artifacts continuously synchronized.

## In Scope

- `.gov/workflow/ROADMAP.md`
- `.gov/workflow/taskboard/TASK_BOARD.md`
- `.gov/Spec/REQUIREMENTS_INDEX.md`
- `.gov/Spec/TRACEABILITY_MATRIX.md`
- `.gov/Spec/PRIMITIVES_INDEX.md`
- `.gov/Spec/PRIMITIVES_MATRIX.md`
- `.gov/Spec/TECH_STACK.md`
- `PROJECT_CODEX.md`
- `AGENTS.md`
- `MODEL_BEHAVIOR.md`

## Trigger

- Any PR that changes spec, workflow sequencing, requirement status, or implementation scope.
- Weekly governance sweep.

## Definition of Done (per sweep)

- Task Board reflects actual active and planned work.
- Roadmap order still matches delivery intent.
- Requirements, traceability, and stack-decision records match implementation reality.
- Iteration rows are fully represented across roadmap, taskboard, and work packets.
- Agent guidance files remain aligned with governance workflow.
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-GOV-MAINT-001.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-GOV-MAINT-001.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-GOV-MAINT-001.ps1

## Proof of Implementation

- Command Runs: reference linked check script output.
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-GOV-MAINT-001/
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
- .gov/workflow/work_packets/WP-GOV-MAINT-001_governance-sync-sweep.md
- .gov/workflow/wp_test_suites/TS-WP-GOV-MAINT-001.md
- .gov/workflow/wp_spec_extractions/SX-WP-GOV-MAINT-001.md
- .gov/workflow/wp_checks/check-WP-GOV-MAINT-001.ps1
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
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-GOV-MAINT-001/
- User Sign-off:
