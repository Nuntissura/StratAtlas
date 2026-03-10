# TS-WP-GOV-MAPDATA-002 - Spec vs Code Test Suite

Date Opened: 2026-03-10
Status: SPEC-MAPPED
Linked Work Packet: WP-GOV-MAPDATA-002
Iteration: All

## Scope

Validate the governance decision path that must unblock maritime implementation truthfully.

## Inputs

- Linked requirements: REQ-0013, REQ-0019, REQ-0020, REQ-0021, REQ-0022, REQ-0200, REQ-0201
- Linked primitives: PRIM-0045, PRIM-0071
- Linked components: .gov/Spec/sub-specs/GOV_maritime_source_path_and_gap_resolution.md; .gov/workflow/work_packets/WP-GOV-MAPDATA-002_maritime-source-path-and-coverage-gap-resolution.md; .gov/workflow/taskboard/TASK_BOARD.md; .gov/workflow/ROADMAP.md

## Reality Boundary Assertions

- Packet Class: RESEARCH
- Real Seam: Governance captures a maritime source decision, truth-label contract, and blocker resolution path before shipping code begins.
- Proof Target: The sub-spec, roadmap, taskboard, and traceability artifacts capture the decision matrix and remaining gaps.
- Allowed Fallbacks: Research may conclude that only delayed, regional, cached, or licensed-provider paths are acceptable initially.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0013 | PRIM-0045 | Dependency | source identification | research review | candidate maritime source paths are concrete and attributable |
| UI-001 | REQ-0200, REQ-0201 | PRIM-0071 | UI Contract | family-state contract | governance review | maritime states are defined as blocked/live/delayed/cached/licensed/static |
| FUNC-001 | REQ-0019, REQ-0020, REQ-0021, REQ-0022 | PRIM-0045 | Functionality | unblock path | roadmap/taskboard review | `WP-I1-012` has an explicit blocker and release condition |
| COR-001 | REQ-0013 | PRIM-0045 | Code Correctness | truth boundary | packet review | no unsupported live global military/naval claims are implied |
| RED-001 | REQ-0013 | PRIM-0045 | Red Team / Abuse | false-confidence prevention | findings review | unresolved source gaps remain unresolved in governance |
| EXT-001 | REQ-0013 | PRIM-0071 | Additional | queue fit | roadmap review | maritime sequencing fits the calmer map-family shell plan |

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

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-MAPDATA-002.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-GOV-MAPDATA-002/

## Execution Summary

- Last Run Date: 2026-03-10
- Result: Queue packet defined; execution not started
- Blocking Failures: None yet
- Evidence Paths: `.gov/Spec/sub-specs/GOV_maritime_source_path_and_gap_resolution.md`; `.gov/workflow/work_packets/WP-GOV-MAPDATA-002_maritime-source-path-and-coverage-gap-resolution.md`
- What Became Real: The queue now has an explicit governance blocker owner for maritime source selection
- What Remains Simulated: No maritime movement runtime is implemented
- Next Blocking Real Seam: Resolve the maritime source path and unblock `WP-I1-012`
- Reviewer:
- User Sign-off:
