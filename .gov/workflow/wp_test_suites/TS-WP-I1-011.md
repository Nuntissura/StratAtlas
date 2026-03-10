# TS-WP-I1-011 - Spec vs Code Test Suite

Date Opened: 2026-03-10
Status: SPEC-MAPPED
Linked Work Packet: WP-I1-011
Iteration: I1

## Scope

Validate the satellite-family packet and its modeled-position truth contract.

## Inputs

- Linked requirements: REQ-0013, REQ-0108, REQ-0200, REQ-0201, REQ-0202, REQ-0203, REQ-0211, REQ-0212
- Linked primitives: PRIM-0045, PRIM-0046, PRIM-0071
- Linked components: .gov/Spec/sub-specs/I1_satellite_orbit_and_coverage_layers.md; .product/Worktrees/wt_main/src/features/i1/runtime/mapRuntimeScene.ts; .product/Worktrees/wt_main/src/features/i1/components/MapRuntimeSurface.tsx

## Reality Boundary Assertions

- Packet Class: IMPLEMENTATION
- Real Seam: Satellite families render in 2D/3D with explicit propagated-position labeling.
- Proof Target: Packet verification proves orbit-family toggles, modeled-position labels, and stable rendering in both surfaces.
- Allowed Fallbacks: Cached orbital elements or limited constellations if labeled.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0108 | PRIM-0045 | Dependency | source/runtime compatibility | packet build checks | orbital data can be handled in both surfaces |
| UI-001 | REQ-0200, REQ-0212 | PRIM-0071 | UI Contract | family controls and modeled labels | App/UI tests | modeled-position labels are visible and accessible |
| FUNC-001 | REQ-0201, REQ-0202, REQ-0203 | PRIM-0045, PRIM-0046 | Functionality | orbit rendering | runtime tests | points, tracks, or footprints render consistently in 2D/3D |
| COR-001 | REQ-0013 | PRIM-0045 | Code Correctness | truth labels | review + tests | propagated state is not mislabeled as direct observation |
| RED-001 | REQ-0013 | PRIM-0046 | Red Team / Abuse | unsupported inference | packet review | no unsupported mission or classification inference is added |
| EXT-001 | REQ-0211 | PRIM-0071 | Additional | degraded behavior | runtime review | the satellite family can be limited or aggregated without breaking the shell |

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

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-011.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I1-011/

## Execution Summary

- Last Run Date: 2026-03-10
- Result: Queue packet defined; execution not started
- Blocking Failures: Waits on `WP-I1-008`
- Evidence Paths: `.gov/Spec/sub-specs/I1_satellite_orbit_and_coverage_layers.md`; `.gov/workflow/work_packets/WP-I1-011_satellite-orbit-and-coverage-layers.md`
- What Became Real: The queue now has a dedicated satellite-family owner with explicit modeled-position constraints
- What Remains Simulated: Product code does not yet render governed satellite families
- Next Blocking Real Seam: Implement the family dock, then land the satellite family with truthful modeled-position labels
- Reviewer:
- User Sign-off:
