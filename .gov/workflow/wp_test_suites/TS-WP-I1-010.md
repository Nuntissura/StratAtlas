# TS-WP-I1-010 - Spec vs Code Test Suite

Date Opened: 2026-03-10
Status: SPEC-MAPPED
Linked Work Packet: WP-I1-010
Iteration: I1

## Scope

Validate the commercial air-traffic family and the separate truth-labeled flight-awareness path against the governed map-family intent checklist.

## Inputs

- Linked requirements: REQ-0013, REQ-0108, REQ-0200, REQ-0201, REQ-0202, REQ-0203, REQ-0211, REQ-0212
- Linked primitives: PRIM-0045, PRIM-0046, PRIM-0071
- Linked components: .gov/Spec/sub-specs/GOV_map_family_intent_guardrails.md; .gov/Spec/sub-specs/I1_commercial_air_traffic_and_flight_awareness_layers.md; .product/Worktrees/wt_main/src/features/i1/layers.ts; .product/Worktrees/wt_main/src/features/i1/runtime/mapRuntimeScene.ts

## Reality Boundary Assertions

- Packet Class: IMPLEMENTATION
- Real Seam: Commercial air traffic is a source-backed family and any military-awareness overlay remains separately labeled as heuristic or curated.
- Proof Target: Packet verification proves truthful family separation, degraded/offline labels, map rendering behavior, and conformance with the governed map-family intent checklist.
- Allowed Fallbacks: Delayed or cached air traffic and heuristic military-awareness overlays if labeled.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0108 | PRIM-0045 | Dependency | source adapter compatibility | packet build checks | live/degraded states compile and route through governed adapters |
| UI-001 | REQ-0200, REQ-0212 | PRIM-0071 | UI Contract | family controls and labels | App/UI tests | commercial traffic and military-awareness controls are clearly separated |
| FUNC-001 | REQ-0201, REQ-0202, REQ-0203 | PRIM-0045, PRIM-0046 | Functionality | air traffic rendering | runtime tests | aircraft render with truthful live/delayed/cached states |
| COR-001 | REQ-0013 | PRIM-0045 | Code Correctness | heuristic boundary | review + tests | military-awareness overlays do not claim unsupported certainty |
| RED-001 | REQ-0013 | PRIM-0046 | Red Team / Abuse | anti-targeting guardrails | packet review | no individual targeting or hidden identity enrichment path is introduced |
| EXT-001 | REQ-0211 | PRIM-0071 | Additional | degraded/budget behavior | runtime review | motion families degrade gracefully when budget requires aggregation |

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

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-010.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I1-010/

## Execution Summary

- Last Run Date: 2026-03-10
- Result: Queue packet defined; execution not started
- Blocking Failures: Waits on `WP-I1-008`
- Evidence Paths: `.gov/Spec/sub-specs/I1_commercial_air_traffic_and_flight_awareness_layers.md`; `.gov/workflow/work_packets/WP-I1-010_commercial-air-traffic-and-flight-awareness-layers.md`
- What Became Real: The queue now has a dedicated owner for the first live mobility family
- What Remains Simulated: Product code does not yet render commercial air traffic or military-awareness overlays
- Next Blocking Real Seam: Implement the family dock, then land the governed air-traffic family
- Reviewer:
- User Sign-off:
