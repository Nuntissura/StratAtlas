# TS-WP-I1-015 - Spec vs Code Test Suite

Date Opened: 2026-04-09
Status: PLANNED
Linked Work Packet: WP-I1-015
Iteration: I1

## Scope

Validate the declutter packet against the verified workbench shell, current map-family queue, and the smoke-driven requirement to make the map and live families easier to reach than the support-only shell detail.

## Inputs

- Linked requirements: REQ-0011, REQ-0012, REQ-0200, REQ-0212
- Linked primitives: PRIM-0045, PRIM-0068, PRIM-0071
- Linked components: .gov/Spec/sub-specs/I1_map_dominant_declutter_and_progressive_disclosure.md; .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/App.css

## Reality Boundary Assertions

- Packet Class: IMPLEMENTATION
- Real Seam: The full workbench promotes map families above session controls and hides secondary scene detail behind explicit disclosure instead of defaulting to the full overlay stack.
- Proof Target: Tests prove the new disclosure controls, family ordering, compact scene summary default, and preserved stable-region/accessibility contract.
- Allowed Fallbacks: Support-only families and telemetry remain available, but only behind explicit disclosure; no floating overlay shell is promised here.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to `E2E-VERIFIED`.
- What Became Real: Pending implementation.
- What Remains Simulated: No new map data or workflow capability is added by this packet.
- Next Blocking Real Seam: Implement the declutter seam in the current shell and capture governed proof.

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0200 | PRIM-0071 | Dependency | governed build inputs | `pnpm build`; `.gov/workflow/wp_checks/check-WP-I1-015.ps1` | declutter changes integrate without breaking the verified shell build |
| UI-001 | REQ-0200, REQ-0212 | PRIM-0068, PRIM-0071 | UI Contract | left rail + compact summary | `pnpm exec vitest run src/App.test.tsx --reporter=verbose` | family-first ordering and disclosure controls render with accessible semantics |
| FUNC-001 | REQ-0011, REQ-0200 | PRIM-0045, PRIM-0071 | Functionality | scene detail and family disclosure | `pnpm exec vitest run src/App.test.tsx --reporter=verbose` | support-only scene detail stays hidden until requested and can be revealed deterministically |
| COR-001 | REQ-0012, REQ-0212 | PRIM-0068 | Code Correctness | disclosure states | `pnpm exec vitest run src/App.test.tsx --reporter=verbose`; review `App.tsx` | hidden detail remains reachable, labeled, and non-color-only |
| RED-001 | REQ-0011 | PRIM-0071 | Red Team / Abuse | no fake simplification | packet review + WP check runner | declutter does not remove governed labels or hide required analyst controls entirely |
| EXT-001 | REQ-0200 | PRIM-0045, PRIM-0071 | Additional | live shell visual proof | bridge snapshot if runtime available; otherwise packet review | calmer full-workbench shell is visible in the live desktop runtime |

## Dependency and Environment Tests

- [ ] Runtime dependency install/build checks
- [ ] Platform portability constraints checked
- [ ] Shell hierarchy changes behave in the governed runtime

## UI Contract Tests

- [ ] Map-family value appears above session-control forms
- [ ] Support-only family disclosure is explicit and accessible
- [ ] Main-canvas scene detail is compact by default and revealable on demand

## Functional Flow Tests

- [ ] Left-rail declutter flow
- [ ] Compact-summary reveal/hide flow
- [ ] Existing map-family interactions still work after the hierarchy change

## Code Correctness Tests

- [ ] App/UI regression tests
- [ ] Disclosure-state regression checks
- [ ] Static checks (lint/type/schema)

## Red-Team and Abuse Tests

- [ ] Non-goal enforcement (spec section 3.2)
- [ ] No loss of required labeling semantics
- [ ] Hidden controls remain reachable and explicit

## Additional Tests

- [ ] Offline behavior
- [ ] Accessibility/usability checks
- [ ] Reliability/recovery checks
- [ ] Visual snapshot proof when desktop runtime is available

## Automation Hook

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-015.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I1-015/

## Execution Summary

- Last Run Date: Not yet executed
- Result: Pending
- Blocking Failures: Pending implementation
- Evidence Paths: Pending
- What Became Real: Pending implementation
- What Remains Simulated: No new map data or workflow capability is added by this packet.
- Next Blocking Real Seam: Implement the left-rail and compact-summary declutter seam in the current shell and then capture governed proof.
- Reviewer: Pending
- User Sign-off: Pending
