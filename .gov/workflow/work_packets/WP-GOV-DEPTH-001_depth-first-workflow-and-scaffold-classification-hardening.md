# WP-GOV-DEPTH-001 - Depth-First Workflow and Scaffold Classification Hardening

Date Opened: 2026-03-08
Status: E2E-VERIFIED
Iteration: All
Workflow Version: 4.0
Packet Class: IMPLEMENTATION
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-GOV-DEPTH-001.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-GOV-DEPTH-001.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-GOV-DEPTH-001.ps1

## Intent

Harden the StratAtlas workflow so breadth-first exploration remains useful without letting scaffold-heavy work masquerade as delivery. This packet upgrades the repo instructions, WP templates, and compliance automation to force packet classification, explicit reality boundaries, recoverable fallback registers, and truthful depth-first change ledgers.

## Linked Requirements

- REQ-0013
- REQ-0019
- REQ-0020
- REQ-0021
- REQ-0022

## Linked Primitives

- PRIM-0065 | Packet Reality Boundary Contract | Require Workflow Version 4.0+ packets to record the real seam, proof target, and next blocking seam before and after implementation.
- PRIM-0066 | Scaffold Debt and Placeholder Guardrail | Prevent placeholder-heavy governance artifacts, unlabeled simulated runtime paths, and scaffold packets from being mistaken for normative delivery.

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## Reality Boundary

- Real Seam: Workflow Version 4.0 governance packets and templates must carry packet classification, reality-boundary metadata, fallback tracking, and change-ledger fields that survive session loss.
- User-Visible Win: Future work resumes faster and with less ambiguity because the active WP and spec extraction show what is real, what is still simulated, and what seam blocks progress next.
- Proof Target: `check-WP-GOV-DEPTH-001.ps1` must prove the root instruction files, governance workflow, templates, WP generator, compliance script, and spec-extract generator all carry the same depth-first rules.
- Allowed Temporary Fallbacks: None in final governance artifacts; temporary placeholder content is allowed only while this packet is in progress and must be removed before closeout.
- Promotion Guard: This packet may close only after v4 artifacts contain no unresolved placeholder markers and the product blocker remains truthfully identified.

## In Scope

- Add packet classification and delivery-depth rules to `AGENTS.md`, `MODEL_BEHAVIOR.md`, `PROJECT_CODEX.md`, and `.gov/workflow/GOVERNANCE_WORKFLOW.md`.
- Upgrade the WP, suite, and spec-extract templates plus the WP creation/spec-extract/compliance scripts to make the new rules enforceable.
- Record the governance packet, primitive rows, roadmap note, taskboard note, and proof hooks needed to keep the new workflow recoverable after session resets.

## Out of Scope

- Reworking the product backlog or changing `WP-I7-002` as the current implementation blocker.
- Backfilling every legacy Workflow Version 3.0 packet with the new v4 fields.

## Expected Files Touched

- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/GOVERNANCE_WORKFLOW.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/ROADMAP.md
- .gov/workflow/work_packets/WP-GOV-DEPTH-001_depth-first-workflow-and-scaffold-classification-hardening.md
- .gov/workflow/wp_test_suites/TS-WP-GOV-DEPTH-001.md
- .gov/workflow/wp_spec_extractions/SX-WP-GOV-DEPTH-001.md
- .gov/workflow/wp_checks/check-WP-GOV-DEPTH-001.ps1
- .gov/templates/WP_TEMPLATE.md
- .gov/templates/WP_TEST_SUITE_TEMPLATE.md
- .gov/templates/WP_SPEC_EXTRACT_TEMPLATE.md
- .gov/repo_scripts/enforce_wp_template_compliance.ps1
- .gov/repo_scripts/new_work_packet.ps1
- .gov/repo_scripts/update_wp_spec_extract.ps1
- PROJECT_CODEX.md
- AGENTS.md
- MODEL_BEHAVIOR.md

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0065 | v4 packet metadata and spec-extract snapshot | Markdown governance artifacts plus PowerShell extraction | Makes the real seam, proof target, and next blocking seam recoverable after session loss. |
| PRIM-0066 | template compliance and WP generator hardening | PowerShell validation plus template generation | Prevents placeholder-heavy governance artifacts and scaffold packets from quietly passing as finished delivery. |

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

- Explicit simulated/mock/sample paths: None are allowed in the final governance artifacts produced by this packet.
- Required labels in code/UI/governance: Any future simulated runtime path outside tests must be called out in code and in the active WP `Fallback Register`.
- Successor packet or debt owner: None planned; this packet is meant to become the standing workflow baseline.
- Exit condition to remove fallback: Close the packet only when the v4 rules are codified in docs, templates, and automation with no remaining placeholder markers.

## Change Ledger

- What Became Real: Workflow Version 4.0 now exists as an enforced packet contract across the root instructions, governance workflow, WP templates, WP generator, template compliance script, and spec-extract generator.
- What Remains Simulated: No new governance fallback remains in this packet; legacy Workflow Version 3.0 packets are retained historically and are not retrofitted by this closeout.
- Next Blocking Real Seam: Resume product delivery at `WP-I7-002`, which remains the current runtime blocker.

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-DEPTH-001.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-GOV-DEPTH-001/
- Claim Standard: do not claim completion without linked command output and artifact paths.

## Exit Criteria

- Task board and requirements index statuses are synchronized.
- Traceability, primitives index, and primitives matrix are synchronized.
- Linked test suite has executed results and evidence paths.
- Evidence bundle is attached.
- User Sign-off: APPROVED.

## Evidence

- Test Suite Execution: `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-DEPTH-001.ps1`
- Logs: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-DEPTH-001/20260308_042222/`
- Screenshots/Exports: N/A for this governance packet.
- Build Artifacts: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-DEPTH-001/20260308_042222/result.json`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-DEPTH-001/20260308_042222/summary.md`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-DEPTH-001/20260308_042222/DOC-ASSERT-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-DEPTH-001/20260308_042222/doc_assertions.json`
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-GOV-DEPTH-001/
- User Sign-off: approved by the 2026-03-08 instruction to implement the workflow hardening changes.

## Progress Log

- 2026-03-08: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
- 2026-03-08: Promoted the packet to Workflow Version 4.0, defined the reality boundary, and began hardening the v4 instruction/template/compliance surface.
- 2026-03-08: Passed `check-WP-GOV-DEPTH-001.ps1`, `enforce_wp_template_compliance.ps1`, `governance_preflight.ps1`, and `update_wp_spec_extract.ps1 -All`; proof: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-DEPTH-001/20260308_042222/`.
