# TS-WP-I1-013 - Spec vs Code Test Suite

Date Opened: 2026-03-10
Status: SPEC-MAPPED
Linked Work Packet: WP-I1-013
Iteration: I1

## Scope

Validate specialized industrial and water-infrastructure layers with explicit coverage and uncertainty labeling against the governed map-family intent checklist.

## Inputs

- Linked requirements: REQ-0013, REQ-0108, REQ-0200, REQ-0201, REQ-0202, REQ-0203, REQ-0211, REQ-0212
- Linked primitives: PRIM-0045, PRIM-0046, PRIM-0071
- Linked components: .gov/Spec/sub-specs/GOV_map_family_intent_guardrails.md; .gov/Spec/sub-specs/I1_specialized_industrial_and_water_infrastructure_layers.md; .gov/workflow/work_packets/WP-I1-013_specialized-industrial-and-water-infrastructure-layers.md

## Reality Boundary Assertions

- Packet Class: IMPLEMENTATION
- Real Seam: Specialized industrial and water-infrastructure sites render as governed static layers with explicit coverage and quality labels.
- Proof Target: Packet verification proves truthful composite-source labels, family toggles, offline-safe packaging where permitted, and conformance with the governed map-family intent checklist.
- Allowed Fallbacks: Composite curated layers are acceptable if uncertainty and coverage gaps are explicit.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0108 | PRIM-0045 | Dependency | source packaging | packet build checks | composite-source layers remain offline-safe where licensing allows |
| UI-001 | REQ-0200, REQ-0212 | PRIM-0071 | UI Contract | family controls and gap labels | App/UI tests | uncertainty and coverage labels are visible and accessible |
| FUNC-001 | REQ-0201, REQ-0202, REQ-0203 | PRIM-0045, PRIM-0046 | Functionality | specialized site rendering | runtime tests | specialized sites render without implying live operational state |
| COR-001 | REQ-0013 | PRIM-0045 | Code Correctness | coverage truth | review + tests | incomplete or regional source coverage is explicitly labeled |
| RED-001 | REQ-0013 | PRIM-0046 | Red Team / Abuse | anti-overclaim checks | packet review | messy composite-source coverage is not presented as comprehensive |
| EXT-001 | REQ-0211 | PRIM-0071 | Additional | degraded behavior | runtime review | specialized sites degrade cleanly with other families |

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

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-013.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I1-013/

## Execution Summary

- Last Run Date: 2026-03-10
- Result: Queue packet defined; execution not started
- Blocking Failures: Waits on `WP-I1-008` and acceptable source QA criteria
- Evidence Paths: `.gov/Spec/sub-specs/I1_specialized_industrial_and_water_infrastructure_layers.md`; `.gov/workflow/work_packets/WP-I1-013_specialized-industrial-and-water-infrastructure-layers.md`
- What Became Real: The queue now has a dedicated owner for composite-source industrial/water site layers
- What Remains Simulated: Product code does not yet render specialized industrial or water-infrastructure sites
- Next Blocking Real Seam: Implement the family dock and finalize composite-source QA/coverage rules
- Reviewer:
- User Sign-off:
