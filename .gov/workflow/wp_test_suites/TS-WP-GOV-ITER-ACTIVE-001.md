# TS-WP-GOV-ITER-ACTIVE-001 - Spec vs Code Test Suite

Date Opened: 2026-03-06
Status: SUPERSEDED
Linked Work Packet: WP-GOV-ITER-ACTIVE-001
Iteration: All

## Scope

<What this suite proves against spec + WP contract>

## Inputs

- Linked requirements:
- Linked primitives:
- Linked components:

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-.... | PRIM-.... | Dependency | <dependency/runtime> | <command> | <result> |
| UI-001 | REQ-.... | PRIM-.... | UI Contract | <screen/region/mode> | <test file> | <result> |
| FUNC-001 | REQ-.... | PRIM-.... | Functionality | <feature flow> | <test file> | <result> |
| COR-001 | REQ-.... | PRIM-.... | Code Correctness | <module contract> | <unit/integration> | <result> |
| RED-001 | REQ-.... | PRIM-.... | Red Team / Abuse | <misuse scenario> | <security test> | <result> |
| EXT-001 | REQ-.... | PRIM-.... | Additional | <performance/offline/accessibility/reliability> | <test> | <result> |

## Dependency and Environment Tests

- [ ] Runtime dependency install/lock integrity
- [ ] Platform portability constraints checked
- [ ] Required services/adapters available

## UI Contract Tests

- [ ] Required regions
- [ ] Required modes/states
- [ ] Error and degraded-state UX

## Functional Flow Tests

- [ ] Golden flow
- [ ] Deterministic replay path
- [ ] Export/import or persistence flow

## Code Correctness Tests

- [ ] Unit tests
- [ ] Integration tests
- [ ] Static checks (lint/type/schema)

## Red-Team and Abuse Tests

- [ ] Non-goal enforcement (spec section 3.2)
- [ ] Policy bypass attempts
- [ ] Invalid input and path abuse cases

## Additional Tests

- [ ] Performance budget checks
- [ ] Offline behavior
- [ ] Accessibility or usability checks
- [ ] Reliability/recovery checks

## Automation Hook

- Command: `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-ITER-ACTIVE-001.ps1`
- Artifacts: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-ITER-ACTIVE-001/`

## Execution Summary

- Last Run Date: 2026-03-06
- Result: RETAINED LEGACY BASELINE PROOF; packet superseded by `WP-GOV-REALIGN-001` and the verified iteration packets
- Blocking Failures:
- Evidence Paths: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-ITER-ACTIVE-001/20260306_003653/result.json`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-ITER-ACTIVE-001/20260306_003653/summary.md`
- Reviewer:
- User Sign-off: N/A (`SUPERSEDED`)
