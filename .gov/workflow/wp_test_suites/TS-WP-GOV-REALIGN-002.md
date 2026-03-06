# TS-WP-GOV-REALIGN-002 - Spec vs Code Test Suite

Date Opened: 2026-03-06
Status: E2E-VERIFIED
Linked Work Packet: WP-GOV-REALIGN-002
Iteration: All

## Scope

Validate that the governance realignment packet truthfully activates the remediation queue, updates blocking order, and preserves retained proof without overstating prototype delivery.

## Inputs

- Linked requirements: REQ-0013, REQ-0019, REQ-0020, REQ-0021, REQ-0022
- Linked primitives: PRIM-0029, PRIM-0030, PRIM-0031, PRIM-0041
- Linked components: .gov/workflow/ROADMAP.md; .gov/workflow/taskboard/TASK_BOARD.md; .gov/Spec/TECH_STACK.md; .gov/Spec/TRACEABILITY_MATRIX.md; .gov/Spec/PRIMITIVES_INDEX.md; .gov/Spec/PRIMITIVES_MATRIX.md

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0021 | PRIM-0030 | Dependency | governance asset graph | `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1` | governance files remain internally consistent after queue activation |
| UI-001 | REQ-0013 | PRIM-0029 | UI Contract | release-facing governance surfaces | manual review of ROADMAP.md, TASK_BOARD.md, and TECH_STACK.md | release-facing governance text reflects prototype reality and active blockers |
| FUNC-001 | REQ-0019 | PRIM-0031 | Functionality | remediation queue activation | `.gov/workflow/wp_checks/check-WP-GOV-REALIGN-002.ps1` | linked WP assets, queue rows, and successor references resolve cleanly |
| COR-001 | REQ-0020 | PRIM-0041 | Code Correctness | proof and successor ledger | manual verification against `.product/build_target/tool_artifacts/wp_runs/` and traceability rows | retained prototype proof is preserved while new remediation packets remain open |
| RED-001 | REQ-0013 | PRIM-0029 | Red Team / Abuse | false closure regression | manual audit of old `E2E-VERIFIED` claims against updated queue language | no governance artifact still claims the recovery queue is fully complete |
| EXT-001 | REQ-0022 | PRIM-0030 | Additional | workflow durability | `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/enforce_wp_template_compliance.ps1` | loop assets remain compatible with future status-promotion sweeps |

## Dependency and Environment Tests

- [x] Runtime dependency install/lock integrity
- [x] Platform portability constraints checked
- [x] Required services/adapters available

## UI Contract Tests

- [x] Required regions (governance-visible roadmap, task board, and traceability updates)
- [x] Required modes/states (active blocker and follow-on queue state)
- [x] Error and degraded-state UX (not applicable; governance-only packet)

## Functional Flow Tests

- [x] Golden flow
- [x] Deterministic replay path (queue/blocker transition reflected across ledgers)
- [x] Export/import or persistence flow

## Code Correctness Tests

- [x] Unit tests (not applicable; governance-only packet)
- [x] Integration tests
- [x] Static checks (lint/type/schema)

## Red-Team and Abuse Tests

- [x] Non-goal enforcement (spec section 3.2)
- [x] Policy bypass attempts
- [x] Invalid input and path abuse cases

## Additional Tests

- [x] Performance budget checks (not applicable; governance-only packet)
- [x] Offline behavior (not applicable; governance-only packet)
- [x] Accessibility/usability checks (not applicable; governance-only packet)
- [x] Reliability/recovery checks

## Automation Hook

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-REALIGN-002.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-GOV-REALIGN-002/

## Execution Summary

- Last Run Date: 2026-03-06
- Result: PASSING; promoted to E2E-VERIFIED
- Blocking Failures:
- Evidence Paths: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-REALIGN-002/20260306_214418/result.json`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-REALIGN-002/20260306_214418/summary.md`
- Reviewer:
- User Sign-off: Approved via 2026-03-06 instruction to close this packet and prepare the successor
