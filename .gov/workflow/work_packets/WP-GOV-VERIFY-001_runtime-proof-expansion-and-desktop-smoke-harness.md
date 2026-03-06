# WP-GOV-VERIFY-001 - Runtime Proof Expansion and Desktop Smoke Harness

Date Opened: 2026-03-06
Status: IN-PROGRESS
Iteration: All
Workflow Version: 3.0
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-GOV-VERIFY-001.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-GOV-VERIFY-001.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-GOV-VERIFY-001.ps1

## Intent

Expand verification from jsdom-heavy and simulator-backed checks into governed desktop runtime proof. This packet defines the runtime smoke harness, proof matrix, and portability/performance evidence expected before any remediation packet can be promoted to `E2E-VERIFIED`.

## Linked Requirements

- REQ-0013
- REQ-0014
- REQ-0015
- REQ-0016
- REQ-0018
- REQ-0019
- REQ-0020
- REQ-0021
- REQ-0022

## Linked Primitives

- PRIM-0060 | Runtime Smoke Harness | Add governed desktop startup, interaction, degraded-state, and export smoke coverage against the real Tauri runtime.
- PRIM-0061 | Verification Evidence Matrix | Bind packet status promotion to command evidence, artifact paths, and runtime-proof capture rather than jsdom-only success.

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## In Scope

- Define and land the governed runtime smoke strategy that future remediation packets must satisfy.
- Expand proof requirements for startup, warm relaunch, interaction latency, offline/degraded behavior, and desktop execution artifacts.
- Update verification-facing governance assets so future packet closeout references real runtime evidence paths.

## Out of Scope

- Shipping the underlying product remediations for map runtime, storage, ingestion, AI, or solver behavior.
- Treating synthetic or jsdom-only flows as sufficient closure for runtime-heavy packets once this packet is active.
- Adding provider-specific or platform-specific implementation detail that belongs in later product packets.

## Expected Files Touched

- .gov/Spec/stratatlas_spec_v1_2.md
- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/Spec/TECH_STACK.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-GOV-VERIFY-001_runtime-proof-expansion-and-desktop-smoke-harness.md
- .gov/workflow/wp_test_suites/TS-WP-GOV-VERIFY-001.md
- .gov/workflow/wp_spec_extractions/SX-WP-GOV-VERIFY-001.md
- .gov/workflow/wp_checks/check-WP-GOV-VERIFY-001.ps1
- .product/Worktrees/wt_main/package.json
- .product/Worktrees/wt_main/src/App.tsx
- .product/Worktrees/wt_main/src-tauri/src/lib.rs
- .product/build_target/tool_artifacts/wp_runs/WP-GOV-VERIFY-001/

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0060 | desktop runtime smoke harness | Tauri runtime plus governed smoke automation | Produces executable proof for startup, shell readiness, and interaction flows that jsdom cannot establish. |
| PRIM-0061 | status-promotion proof matrix | Markdown ledgers plus PowerShell checks | Forces each future closure claim to cite runtime artifacts and concrete command evidence. |

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

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-VERIFY-001.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-GOV-VERIFY-001/
- Claim Standard: do not claim completion without linked command output and artifact paths.

## Exit Criteria

- Task board and requirements index statuses are synchronized.
- Traceability, primitives index, and primitives matrix are synchronized.
- Linked test suite has executed results and evidence paths.
- Evidence bundle is attached.
- User Sign-off: APPROVED.

## Evidence

- Test Suite Execution: 2026-03-06 - preparation validation passed via `.gov/workflow/wp_checks/check-WP-GOV-VERIFY-001.ps1`; packet remains `IN-PROGRESS`
- Logs: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-VERIFY-001/20260306_214607/DEP-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-VERIFY-001/20260306_214607/COR-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-VERIFY-001/20260306_214607/RED-001.log`
- Screenshots/Exports:
- Build Artifacts: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-VERIFY-001/20260306_214607/result.json`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-VERIFY-001/20260306_214607/summary.md`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-VERIFY-001/20260306_214607/red_team_result.json`
- Proof Artifact: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-VERIFY-001/20260306_214607/`
- User Sign-off: Not applicable while packet remains `IN-PROGRESS`

## Progress Log

- 2026-03-06: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
- 2026-03-06: Packet intent, scope, and proof expectations refined to follow the 2026-03-06 audit that identified simulator-heavy verification gaps.
- 2026-03-06: Promoted to the current blocking governance packet after `WP-GOV-REALIGN-002` closed and downgraded unsupported runtime/performance requirement claims in the requirements ledger.
- 2026-03-06: Passed initial preparation validation via `.gov/workflow/wp_checks/check-WP-GOV-VERIFY-001.ps1` with proof at `.product/build_target/tool_artifacts/wp_runs/WP-GOV-VERIFY-001/20260306_214607/`; runtime smoke harness implementation remains outstanding.
