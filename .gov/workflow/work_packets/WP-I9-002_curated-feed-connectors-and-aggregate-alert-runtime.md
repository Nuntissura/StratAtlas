# WP-I9-002 - Curated Feed Connectors and Aggregate Alert Runtime

Date Opened: 2026-03-06
Status: SPEC-MAPPED
Iteration: I9
Workflow Version: 3.0
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I9-002.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I9-002.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I9-002.ps1

## Intent

Replace static feed simulation with governed curated-source connectors and aggregate-only alert evaluation. This packet restores the normative OSINT and economic-context slice while preserving the spec’s ethical and misuse boundaries.

## Linked Requirements

- REQ-1000
- REQ-1001
- REQ-1002
- REQ-1003

## Linked Primitives

- PRIM-0056 | Curated Feed Connector | Bring approved OSINT and economic indicator sources into the governed runtime with provenance and verification labeling.
- PRIM-0057 | Aggregate Alert Evaluator | Evaluate only aggregate conditions and emit governed alert artifacts with audit capture.

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## In Scope

- Replace static or seeded feed content with governed source connectors and normalization paths.
- Implement verification-aware labeling and aggregate-only alert evaluation aligned to the ethical bounds in the spec.
- Bind alert artifacts to the authoritative context and audit stores for later review and replay.

## Out of Scope

- Any individual-targeting, stalking, or sensitive actor alerting behavior prohibited by the spec.
- Closing the context ingestion packet that provides the upstream domain data backbone.
- Shipping solver or AI behavior that merely consumes feed and alert outputs.

## Expected Files Touched

- .gov/Spec/stratatlas_spec_v1_2.md
- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-I9-002_curated-feed-connectors-and-aggregate-alert-runtime.md
- .gov/workflow/wp_test_suites/TS-WP-I9-002.md
- .gov/workflow/wp_spec_extractions/SX-WP-I9-002.md
- .gov/workflow/wp_checks/check-WP-I9-002.ps1
- .product/Worktrees/wt_main/src/features/i9/
- .product/Worktrees/wt_main/src/lib/backend.ts
- .product/Worktrees/wt_main/src-tauri/src/lib.rs
- .product/Worktrees/wt_main/src/contracts/

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0056 | governed feed connectors | curated connector and normalization pipeline | Replaces simulated feeds with approved, provenance-preserving source ingestion. |
| PRIM-0057 | aggregate alert runtime | alert evaluation plus audit-linked persistence | Ensures alerting stays aggregate-only, reviewable, and within the misuse boundary. |

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

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I9-002.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I9-002/
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
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I9-002/
- User Sign-off:

## Progress Log

- 2026-03-06: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
- 2026-03-06: Packet scope refined to restore curated-source connectors and aggregate-only alert evaluation after the audit.
