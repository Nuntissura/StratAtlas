# WP-I1-006 - First-Use Map Hero and Guided Start State

Date Opened: 2026-03-09
Status: IN-PROGRESS
Iteration: I1
Workflow Version: 4.0
Packet Class: IMPLEMENTATION
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I1-006.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I1-006.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I1-006.ps1

## Intent

TBD - replace before status promotion.

## Linked Requirements

- REQ-0011
- REQ-0012
- REQ-0013
- REQ-0200
- REQ-0201
- REQ-0211
- REQ-0212

## Linked Primitives

- PRIM-0045 | TBD NAME | explain why this primitive matters to this WP before status promotion
- PRIM-0068 | TBD NAME | explain why this primitive matters to this WP before status promotion
- PRIM-0071 | TBD NAME | explain why this primitive matters to this WP before status promotion

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## Reality Boundary

- Real Seam: TBD
- User-Visible Win: TBD
- Proof Target: TBD
- Allowed Temporary Fallbacks: TBD
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## In Scope

- TBD - replace before status promotion.
- TBD - replace before status promotion.

## Out of Scope

- TBD - replace before status promotion.
- TBD - replace before status promotion.

## Expected Files Touched

- .gov/Spec/stratatlas_spec_v1_2.md
- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-I1-006_first-use-map-hero-and-guided-start-state.md
- .gov/workflow/wp_test_suites/TS-WP-I1-006.md
- .gov/workflow/wp_spec_extractions/SX-WP-I1-006.md
- .gov/workflow/wp_checks/check-WP-I1-006.ps1
- .product/Worktrees/wt_main/src/<implementation_files>

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| TBD PRIMITIVE | TBD FEATURE/TOOL | TBD TECHNOLOGY | TBD COMBINED OUTCOME |

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

- Explicit simulated/mock/sample paths: TBD
- Required labels in code/UI/governance: TBD
- Successor packet or debt owner: TBD
- Exit condition to remove fallback: TBD

## Change Ledger

- What Became Real: TBD
- What Remains Simulated: TBD
- Next Blocking Real Seam: TBD

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-006.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I1-006/
- Claim Standard: do not claim completion without linked command output and artifact paths.

## Exit Criteria

- Task board and requirements index statuses are synchronized.
- Traceability, primitives index, and primitives matrix are synchronized.
- Linked test suite has executed results and evidence paths.
- Evidence bundle is attached.
- Reality Boundary, Fallback Register, and Change Ledger are truthful.
- User Sign-off: APPROVED.

## Evidence

- Test Suite Execution:
- Logs:
- Screenshots/Exports:
- Build Artifacts:
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I1-006/
- User Sign-off:

## Progress Log

- 2026-03-09: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
