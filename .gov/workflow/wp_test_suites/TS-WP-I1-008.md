# TS-WP-I1-008 - Spec vs Code Test Suite

Date Opened: 2026-03-10
Status: SPEC-MAPPED
Linked Work Packet: WP-I1-008
Iteration: I1

## Scope

Validate the grouped layer-family registry and map control dock before family payload packets start landing.

## Inputs

- Linked requirements: REQ-0013, REQ-0200, REQ-0201, REQ-0202, REQ-0203, REQ-0212
- Linked primitives: PRIM-0045, PRIM-0068, PRIM-0071
- Linked components: .gov/Spec/sub-specs/I1_toggleable_layer_family_registry.md; .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/App.css; .product/Worktrees/wt_main/src/features/i1/layers.ts

## Reality Boundary Assertions

- Packet Class: IMPLEMENTATION
- Real Seam: The workbench gains grouped layer-family controls with truthful availability/source-state labels and persisted control state.
- Proof Target: UI and integration tests plus packet-grade verification prove grouped family controls, badges, and persistence without shell overload.
- Allowed Fallbacks: Some families may remain unavailable or blocked if labeled explicitly.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0200 | PRIM-0071 | Dependency | build/runtime compatibility | `pnpm build` | grouped family controls compile without regressing the workbench shell |
| UI-001 | REQ-0200, REQ-0212 | PRIM-0068, PRIM-0071 | UI Contract | grouped family dock | `.product/Worktrees/wt_main/src/App.test.tsx` | grouped families, truthful badges, and keyboard-reachable controls render |
| FUNC-001 | REQ-0201, REQ-0202, REQ-0203 | PRIM-0045 | Functionality | family visibility and persistence | `.product/Worktrees/wt_main/src/App.test.tsx` | family state persists and families do not imply unavailable data is live |
| COR-001 | REQ-0013 | PRIM-0045 | Code Correctness | source-state labeling | review + tests | unavailable, static, delayed, heuristic, and blocked states are explicit |
| RED-001 | REQ-0013 | PRIM-0071 | Red Team / Abuse | false-confidence prevention | packet review | empty families are not presented as ready live feeds |
| EXT-001 | REQ-0212 | PRIM-0068 | Additional | accessibility | tests + review | grouped controls remain keyboard reachable and non-color-only |

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

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-008.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I1-008/

## Execution Summary

- Last Run Date: 2026-03-10
- Result: Queue packet defined; execution not started
- Blocking Failures: None yet
- Evidence Paths: `.gov/Spec/sub-specs/I1_toggleable_layer_family_registry.md`; `.gov/workflow/work_packets/WP-I1-008_toggleable-layer-family-registry-and-map-control-dock.md`
- What Became Real: The queue now has a dedicated foundation test owner for grouped layer-family controls
- What Remains Simulated: Product code still exposes the smaller verified workspace-layer set only
- Next Blocking Real Seam: Implement the grouped family registry and control dock
- Reviewer:
- User Sign-off:
