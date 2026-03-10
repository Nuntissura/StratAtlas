# TS-WP-I1-012 - Spec vs Code Test Suite

Date Opened: 2026-03-10
Status: BLOCKED
Linked Work Packet: WP-I1-012
Iteration: I1

## Scope

Validate maritime implementation once the governing source path exists.

## Inputs

- Linked requirements: REQ-0013, REQ-0108, REQ-0200, REQ-0201, REQ-0202, REQ-0203, REQ-0211, REQ-0212
- Linked primitives: PRIM-0045, PRIM-0046, PRIM-0071
- Linked components: .gov/Spec/sub-specs/I1_maritime_traffic_and_port_awareness_layers.md; .gov/workflow/work_packets/WP-I1-012_maritime-traffic-and-port-awareness-layers.md

## Reality Boundary Assertions

- Packet Class: IMPLEMENTATION
- Real Seam: Maritime movement is implemented only after source truth is governed.
- Proof Target: Packet verification proves truthful live/delayed/cached/licensed labels and clean maritime map rendering.
- Allowed Fallbacks: None until `WP-GOV-MAPDATA-002` unblocks the packet.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0108 | PRIM-0045 | Dependency | maritime source/runtime compatibility | packet build checks | governed source path is real before implementation starts |
| UI-001 | REQ-0200, REQ-0212 | PRIM-0071 | UI Contract | maritime family controls | App/UI tests | truthful maritime state labels and accessibility semantics render |
| FUNC-001 | REQ-0201, REQ-0202, REQ-0203 | PRIM-0045, PRIM-0046 | Functionality | maritime rendering | runtime tests | vessel movement renders with source-state truth labels |
| COR-001 | REQ-0013 | PRIM-0045 | Code Correctness | coverage truth | review + tests | no unsupported global naval or military live claims exist |
| RED-001 | REQ-0013 | PRIM-0046 | Red Team / Abuse | anti-overclaim checks | packet review | blocked until source path is governed |
| EXT-001 | REQ-0211 | PRIM-0071 | Additional | degraded behavior | runtime review | maritime family degrades cleanly when source or performance limits apply |

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

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-012.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I1-012/

## Execution Summary

- Last Run Date: 2026-03-10
- Result: Blocked by governance
- Blocking Failures: `WP-GOV-MAPDATA-002` is incomplete
- Evidence Paths: `.gov/Spec/sub-specs/I1_maritime_traffic_and_port_awareness_layers.md`; `.gov/workflow/work_packets/WP-I1-012_maritime-traffic-and-port-awareness-layers.md`
- What Became Real: Maritime implementation is now explicitly blocked rather than ambiguously future scope
- What Remains Simulated: No maritime movement runtime exists
- Next Blocking Real Seam: Close `WP-GOV-MAPDATA-002`
- Reviewer:
- User Sign-off:
