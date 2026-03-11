# TS-WP-GOV-MAPDATA-003 - Spec vs Code Test Suite

Date Opened: 2026-03-10
Status: E2E-VERIFIED
Linked Work Packet: WP-GOV-MAPDATA-003
Iteration: All

## Scope

Validate that the new map-family queue inherits a mandatory intent checklist before future packets can move past planning.

## Inputs

- Linked requirements: REQ-0011, REQ-0012, REQ-0013, REQ-0019, REQ-0020, REQ-0021, REQ-0022, REQ-0200, REQ-0201
- Linked primitives: PRIM-0064, PRIM-0070
- Linked components: .gov/Spec/sub-specs/GOV_map_family_intent_guardrails.md; .gov/Spec/sub-specs/GOV_toggleable_live_source_layer_research.md; .gov/workflow/work_packets/WP-I1-008_toggleable-layer-family-registry-and-map-control-dock.md; .gov/workflow/work_packets/WP-I1-009_static-installations-and-critical-infrastructure-layers.md; .gov/workflow/work_packets/WP-I1-010_commercial-air-traffic-and-flight-awareness-layers.md; .gov/workflow/work_packets/WP-I1-011_satellite-orbit-and-coverage-layers.md; .gov/workflow/work_packets/WP-I1-012_maritime-traffic-and-port-awareness-layers.md; .gov/workflow/work_packets/WP-I1-013_specialized-industrial-and-water-infrastructure-layers.md

## Reality Boundary Assertions

- Packet Class: RESEARCH
- Real Seam: The queue gains a mandatory intent checklist that future map-family packets must satisfy before status promotion.
- Proof Target: Governance assets show the checklist exists and is wired into `WP-I1-008` through `WP-I1-013` as pre-work and proof criteria.
- Allowed Fallbacks: Packet-specific responses may remain pending while those packets are still `SPEC-MAPPED`.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0019, REQ-0020, REQ-0021, REQ-0022 | PRIM-0064 | Dependency | governance asset linkage | packet review | checklist, WP, suite, extraction, and check-script links are present and aligned |
| UI-001 | REQ-0200, REQ-0201 | PRIM-0070 | UI Contract | workbench-fit guardrails | sub-spec review | checklist explicitly covers map-first value, shell fit, and mode behavior |
| FUNC-001 | REQ-0011, REQ-0012, REQ-0200, REQ-0201 | PRIM-0064 | Functionality | queue inheritance | WP review | `WP-I1-008` through `WP-I1-013` inherit the checklist as mandatory pre-work and proof criteria |
| COR-001 | REQ-0013 | PRIM-0064 | Code Correctness | strategic-fit contract | checklist review | future packets must answer strategic question fit, label contract, bundle/export, and replay/scenario behavior |
| RED-001 | REQ-0013 | PRIM-0070 | Red Team / Abuse | anti-tracker boundary | checklist review | no future map family can promote without explicit non-goal and anti-pursuit boundaries |
| EXT-001 | REQ-0011, REQ-0012, REQ-0200, REQ-0201 | PRIM-0070 | Additional | cognitive-load prevention | queue review | the checklist guards against shell overload and generic tracker drift |

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

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-MAPDATA-003.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-GOV-MAPDATA-003/

## Execution Summary

- Last Run Date: 2026-03-10
- Result: Passed
- Blocking Failures: None
- Evidence Paths: `.gov/Spec/sub-specs/GOV_map_family_intent_guardrails.md`; `.gov/Spec/sub-specs/GOV_toggleable_live_source_layer_research.md`; `.gov/workflow/work_packets/WP-I1-008_toggleable-layer-family-registry-and-map-control-dock.md`; `.gov/workflow/work_packets/WP-I1-009_static-installations-and-critical-infrastructure-layers.md`; `.gov/workflow/work_packets/WP-I1-010_commercial-air-traffic-and-flight-awareness-layers.md`; `.gov/workflow/work_packets/WP-I1-011_satellite-orbit-and-coverage-layers.md`; `.gov/workflow/work_packets/WP-I1-012_maritime-traffic-and-port-awareness-layers.md`; `.gov/workflow/work_packets/WP-I1-013_specialized-industrial-and-water-infrastructure-layers.md`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-MAPDATA-003/20260310_231706/`
- What Became Real: The future map-family queue now has a mandatory intent checklist and packet/sub-spec proof hooks that must be satisfied before implementation packets can promote past planning.
- What Remains Simulated: No new map-family runtime implementation exists yet.
- Next Blocking Real Seam: Execute `WP-I1-008` with packet-specific guardrail responses completed in the linked sub-spec before status promotion.
- Reviewer:
- User Sign-off:
