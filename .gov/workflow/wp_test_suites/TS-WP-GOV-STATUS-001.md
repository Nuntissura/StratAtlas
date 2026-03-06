# TS-WP-GOV-STATUS-001 - Spec vs Code Test Suite

Date Opened: 2026-03-06
Status: E2E-VERIFIED
Linked Work Packet: WP-GOV-STATUS-001
Iteration: All

## Scope

Validate WP delivery against linked requirements and primitives.

## Inputs

- Linked requirements: REQ-0013, REQ-0019, REQ-0020, REQ-0021, REQ-0022
- Linked primitives: PRIM-0029, PRIM-0030, PRIM-0031, PRIM-0041
- Linked components: .gov/Spec/stratatlas_spec_v1_2.md; .gov/Spec/SPEC_GOVERNANCE.md; .gov/workflow/GOVERNANCE_WORKFLOW.md; .gov/workflow/taskboard/TASK_BOARD.md; .gov/workflow/ROADMAP.md; .gov/Spec/TRACEABILITY_MATRIX.md; .gov/repo_scripts/new_work_packet.ps1; .gov/repo_scripts/run_wp_loop.ps1; .gov/repo_scripts/governance_preflight.ps1; PROJECT_CODEX.md; AGENTS.md; MODEL_BEHAVIOR.md

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0019, REQ-0021 | PRIM-0030 | Dependency | governance asset graph | `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1` | status-model and ledger files remain synchronized |
| UI-001 | REQ-0013 | PRIM-0041 | UI Contract | task board / roadmap / traceability visibility | manual ledger inspection in this WP + linked suites | superseded packets show successor references and retained proof |
| FUNC-001 | REQ-0013, REQ-0020 | PRIM-0029, PRIM-0041 | Functionality | supersession closure flow | `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-STATUS-001.ps1` | replaced packets close as `SUPERSEDED`; verified governance packets promote with retained evidence |
| COR-001 | REQ-0019, REQ-0021 | PRIM-0030, PRIM-0041 | Code Correctness | automation allow-lists and template compliance | `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/enforce_wp_template_compliance.ps1` | updated status model and packet assets remain compliant |
| RED-001 | REQ-0020, REQ-0021 | PRIM-0029 | Red Team / Abuse | proof-first governance integrity | `.gov/repo_scripts/red_team_guardrail_check.ps1` via WP check runner | no closure change weakens guardrails or permits no-proof claims |
| EXT-001 | REQ-0022 | PRIM-0031 | Additional | loop-run selection semantics | `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/run_wp_loop.ps1 -AllFromTaskBoard -SkipDependencyInstall` | loop automation skips `SUPERSEDED` rows and leaves only active packets runnable |

## Dependency and Environment Tests

- [x] Runtime dependency install/lock integrity
- [x] Platform portability constraints checked
- [x] Required services/adapters available

## UI Contract Tests

- [x] Required regions (governance-visible packet status and successor references)
- [x] Required modes/states (superseded vs verified vs recurring separation)
- [x] Error and degraded-state UX (not applicable; governance-only packet)

## Functional Flow Tests

- [x] Golden flow
- [x] Deterministic replay path (ledger/status propagation refresh)
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

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-STATUS-001.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-GOV-STATUS-001/

## Execution Summary

- Last Run Date: 2026-03-06
- Result: PASSING; promoted to E2E-VERIFIED
- Blocking Failures:
- Evidence Paths: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-STATUS-001/20260306_084102/result.json`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-STATUS-001/20260306_084102/summary.md`
- Reviewer:
- User Sign-off: Approved via 2026-03-06 autonomous completion instruction
