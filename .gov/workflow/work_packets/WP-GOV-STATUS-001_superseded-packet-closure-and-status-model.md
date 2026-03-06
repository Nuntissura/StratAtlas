# WP-GOV-STATUS-001 - Superseded Packet Closure and Status Model

Date Opened: 2026-03-06
Status: E2E-VERIFIED
Iteration: All
Workflow Version: 3.0
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-GOV-STATUS-001.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-GOV-STATUS-001.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-GOV-STATUS-001.ps1

## Intent

Define the `SUPERSEDED` closure state for replaced Work Packets and use it to close activation-shell and governance-baseline packets that were superseded by named successor packets. Promote the governance packets with complete proof (`WP-GOV-REALIGN-001` and `WP-GOV-LOOP-001`) while preserving historical evidence for replaced packets.

## Linked Requirements

- REQ-0013
- REQ-0019
- REQ-0020
- REQ-0021
- REQ-0022

## Linked Primitives

- PRIM-0029 | Delivery Reality Audit | verify that replaced packets are closed truthfully rather than over-promoted
- PRIM-0030 | Multi-Packet Iteration Workflow | preserve the activation/follow-on model while giving replaced packets an explicit closure path
- PRIM-0031 | Recovery Queue Traceability | propagate successor references consistently across roadmap, task board, and traceability
- PRIM-0041 | WP Supersession Ledger | record replaced packets with retained proof and explicit successor references without claiming independent completion

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## In Scope

- Add the `SUPERSEDED` status to the canonical governance/spec workflow rules and supporting automation.
- Close superseded activation-shell and governance-baseline packets with retained proof and successor references.
- Promote governance packets with complete proof and documented sign-off to `E2E-VERIFIED`.

## Out of Scope

- Re-implementing any product runtime feature slice.
- Rewriting or discarding retained proof artifacts for historical packets.
- Changing the installer workflow beyond separately governed `WP-GOV-INSTALLER-001`.

## Expected Files Touched

- .gov/Spec/stratatlas_spec_v1_2.md
- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-GOV-STATUS-001_superseded-packet-closure-and-status-model.md
- .gov/workflow/wp_test_suites/TS-WP-GOV-STATUS-001.md
- .gov/workflow/wp_spec_extractions/SX-WP-GOV-STATUS-001.md
- .gov/workflow/wp_checks/check-WP-GOV-STATUS-001.ps1
- .gov/Spec/SPEC_GOVERNANCE.md
- .gov/workflow/GOVERNANCE_WORKFLOW.md
- .gov/repo_scripts/new_work_packet.ps1
- .gov/repo_scripts/run_wp_loop.ps1
- .gov/repo_scripts/governance_preflight.ps1
- PROJECT_CODEX.md
- AGENTS.md
- MODEL_BEHAVIOR.md

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0029 | Status closure audit | Markdown ledgers + proof artifact review | Replaced packets are closed without overstating completion. |
| PRIM-0030 | Multi-packet closure semantics | Spec + workflow rules | Activation/follow-on packet sets remain valid after successor proof exists. |
| PRIM-0031 | Successor propagation | Roadmap + task board + traceability | Every superseded packet points at the same named successor. |
| PRIM-0041 | Supersession ledger | WP/task-suite metadata + automation allow-lists | Historical packets stay proof-backed while leaving done claims to successor packets. |

## Spec-Test Coverage Plan

### Dependency and Environment Tests
- [x] Dependency graph/lock integrity tests
- [x] Runtime compatibility checks

### UI Contract Tests
- [x] Required regions/modes/states (N/A - governance-only packet; ledger visibility verified)
- [x] Error/degraded-state UX (N/A - governance-only packet)

### Functional Flow Tests
- [x] Golden flow and edge cases
- [x] Persistence/replay/export flows

### Code Correctness Tests
- [x] Unit tests (N/A - governance-only packet)
- [x] Integration tests
- [x] Static analysis (lint/type/schema)

### Red-Team and Abuse Tests
- [x] Non-goal enforcement (spec section 3.2)
- [x] Policy bypass scenarios
- [x] Adversarial/invalid input cases

### Additional Tests
- [x] Performance budgets (N/A - governance-only packet)
- [x] Offline behavior (N/A - governance-only packet)
- [x] Reliability/recovery

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-STATUS-001.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-GOV-STATUS-001/
- Claim Standard: do not claim completion without linked command output and artifact paths.

## Exit Criteria

- Task board and requirements index statuses are synchronized.
- Traceability, primitives index, and primitives matrix are synchronized.
- Linked test suite has executed results and evidence paths.
- Evidence bundle is attached.
- User Sign-off: APPROVED.

## Evidence

- Test Suite Execution: 2026-03-06 - passed via `.gov/workflow/wp_checks/check-WP-GOV-STATUS-001.ps1`
- Logs: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-STATUS-001/20260306_084102/DEP-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-STATUS-001/20260306_084102/COR-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-STATUS-001/20260306_084102/RED-001.log`
- Screenshots/Exports:
- Build Artifacts: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-STATUS-001/20260306_084102/result.json`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-STATUS-001/20260306_084102/summary.md`
- Proof Artifact: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-STATUS-001/20260306_084102/`
- User Sign-off: Approved via 2026-03-06 autonomous completion instruction

## Progress Log

- 2026-03-06: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
- 2026-03-06: Added `SUPERSEDED` to the canonical status model so replaced packets can close with retained proof and named successor references.
- 2026-03-06: Closed superseded activation-shell and governance-baseline packets without falsely promoting them to `E2E-VERIFIED`.
- 2026-03-06: Promoted `WP-GOV-REALIGN-001` and `WP-GOV-LOOP-001` to `E2E-VERIFIED` using retained proof and autonomous user sign-off.
