# TS-WP-GOV-REALIGN-001 - Spec vs Code Test Suite

Date Opened: 2026-03-06
Status: IMPLEMENTED
Linked Work Packet: WP-GOV-REALIGN-001
Iteration: All

## Scope

Validate WP delivery against linked requirements and primitives.

## Inputs

- Linked requirements: REQ-0013, REQ-0019, REQ-0020, REQ-0021, REQ-0022
- Linked primitives: PRIM-0029, PRIM-0030, PRIM-0031
- Linked components: .gov/Spec/stratatlas_spec_v1_2.md; .gov/Spec/REQUIREMENTS_INDEX.md; .gov/Spec/TRACEABILITY_MATRIX.md; .gov/Spec/PRIMITIVES_INDEX.md; .gov/Spec/PRIMITIVES_MATRIX.md; .gov/Spec/SPEC_GOVERNANCE.md; .gov/Spec/TECH_STACK.md; .gov/workflow/ROADMAP.md; .gov/workflow/GOVERNANCE_WORKFLOW.md; .gov/workflow/taskboard/TASK_BOARD.md; PROJECT_CODEX.md; AGENTS.md; MODEL_BEHAVIOR.md

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0021 | PRIM-0030 | Dependency | governance asset graph | `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1` | canonical governance files and directories remain synchronized |
| UI-001 | REQ-0013 | PRIM-0031 | UI Contract | task board and roadmap visibility | manual ledger inspection in this WP | active packet set and blocking packet are visible in governance artifacts |
| FUNC-001 | REQ-0019, REQ-0020 | PRIM-0031 | Functionality | WP scaffolding and traceability links | `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/update_wp_spec_extract.ps1 -All` | new recovery packets and linked assets exist and resolve |
| COR-001 | REQ-0013, REQ-0021 | PRIM-0029 | Code Correctness | governance truthfulness | `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/enforce_wp_template_compliance.ps1` | WP/suite/check artifacts remain compliant after realignment |
| RED-001 | REQ-0022 | PRIM-0029 | Red Team / Abuse | safety-boundary regression | `.gov/repo_scripts/red_team_guardrail_check.ps1` via WP runner | no governance realignment change weakens safety guardrails |
| EXT-001 | REQ-0013, REQ-0020 | PRIM-0030 | Additional | recovery queue propagation | `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-REALIGN-001.ps1` | preflight, compliance, and traceability evidence recorded |

## Dependency and Environment Tests

- [x] Runtime dependency install/lock integrity
- [x] Platform portability constraints checked
- [x] Required services/adapters available

## UI Contract Tests

- [x] Required regions (governance-visible packet set and blocking packet)
- [x] Required modes/states (status downgrades and active queue visibility)
- [x] Error and degraded-state UX (not applicable; governance-only packet)

## Functional Flow Tests

- [x] Golden flow
- [x] Deterministic replay path (governance snapshot/extraction refresh)
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

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-REALIGN-001.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-GOV-REALIGN-001/

## Execution Summary

- Last Run Date: 2026-03-06
- Result: PASS
- Blocking Failures: None
- Evidence Paths: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-REALIGN-001/20260306_034725/`
- Reviewer: Codex
- User Sign-off:
