# TS-WP-GOV-MAPDATA-001 - Spec vs Code Test Suite

Date Opened: 2026-03-10
Status: E2E-VERIFIED
Linked Work Packet: WP-GOV-MAPDATA-001
Iteration: All

## Scope

Validate that the requested live/static map-layer families are captured as a truthful governed source contract before implementation begins.

## Inputs

- Linked requirements: REQ-0013, REQ-0019, REQ-0020, REQ-0021, REQ-0022, REQ-0200, REQ-0201
- Linked primitives: PRIM-0045, PRIM-0071
- Linked components: .gov/Spec/sub-specs/GOV_toggleable_live_source_layer_research.md; .gov/workflow/work_packets/WP-GOV-MAPDATA-001_toggleable-live-source-layer-research-and-data-contract.md; .gov/workflow/taskboard/TASK_BOARD.md; .gov/workflow/ROADMAP.md

## Reality Boundary Assertions

- Packet Class: RESEARCH
- Real Seam: Requested future map-visible datasets are documented as governed toggleable layer families with source candidates, fallback states, and implementation sequencing.
- Proof Target: The linked research sub-spec and packet truthfully capture the source matrix and successor-packet recommendations.
- Allowed Fallbacks: Some families may remain research-only if a compliant live source path is not yet available.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0013 | PRIM-0045 | Dependency | official source identification | linked research sources | source candidates are concrete and attributable, not vague placeholders |
| UI-001 | REQ-0200, REQ-0201 | PRIM-0071 | UI Contract | toggleable layer family model | sub-spec review | each requested family is described as a map-visible toggleable layer family |
| FUNC-001 | REQ-0019, REQ-0020, REQ-0021, REQ-0022 | PRIM-0045 | Functionality | build order and fallback states | packet + sub-spec review | research defines what can be live, delayed, cached, static, or licensed-provider only |
| COR-001 | REQ-0013 | PRIM-0045 | Code Correctness | truthful scope boundary | packet review | research does not imply unsupported live military or global shipping coverage |
| RED-001 | REQ-0013 | PRIM-0045 | Red Team / Abuse | false-confidence prevention | findings review | unresolved source gaps remain labeled unresolved |
| EXT-001 | REQ-0013 | PRIM-0071 | Additional | successor queue | roadmap/taskboard review | next implementation slices are narrowed into truthful successor packets |

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

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-MAPDATA-001.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-GOV-MAPDATA-001/

## Execution Summary

- Last Run Date: 2026-03-10
- Result: Passed
- Blocking Failures: None
- Evidence Paths: `.gov/Spec/sub-specs/GOV_toggleable_live_source_layer_research.md`; `.gov/workflow/work_packets/WP-GOV-MAPDATA-001_toggleable-live-source-layer-research-and-data-contract.md`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-MAPDATA-001/20260310_012211/`
- What Became Real: Requested future map-visible datasets now have a governed research contract and recommended implementation order
- What Remains Simulated: No product implementation yet
- Next Blocking Real Seam: Create and execute the first static known-installation layer packet for airports, ports, power plants, dams, and curated military installations
- Reviewer:
- User Sign-off:
