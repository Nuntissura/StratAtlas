# TS-WP-I2-003 - Spec vs Code Test Suite

Date Opened: 2026-03-06
Status: PLANNED
Linked Work Packet: WP-I2-003
Iteration: I2

## Scope

Validate WP delivery against linked requirements and primitives.

## Inputs

- Linked requirements: REQ-0209, REQ-0210, REQ-0300, REQ-0301, REQ-0302
- Linked primitives: PRIM-0048, PRIM-0049
- Linked components: <fill>

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0209 | PRIM-0048 | Dependency | dependency graph | <command> | dependencies resolved and policy-compliant |
| UI-001 | REQ-0209 | PRIM-0048 | UI Contract | required UI contract | <test file> | required regions/modes and degraded states pass |
| FUNC-001 | REQ-0209 | PRIM-0048 | Functionality | golden flow | <test file> | golden flow passes deterministically |
| COR-001 | REQ-0209 | PRIM-0048 | Code Correctness | module contracts | <unit/integration> | invariant and regression checks pass |
| RED-001 | REQ-0209 | PRIM-0048 | Red Team / Abuse | misuse constraints | <security test> | abuse cases blocked and audited |
| EXT-001 | REQ-0209 | PRIM-0048 | Additional | perf/offline/reliability | <test> | budgets and resilience targets met |

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
- [ ] Accessibility/usability checks
- [ ] Reliability/recovery checks

## Automation Hook

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I2-003.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I2-003/

## Execution Summary

- Last Run Date:
- Result:
- Blocking Failures:
- Evidence Paths:
- Reviewer:
- User Sign-off:
