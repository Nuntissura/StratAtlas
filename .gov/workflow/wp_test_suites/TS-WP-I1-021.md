# TS-WP-I1-021 - Spec vs Code Test Suite

Date Opened: 2026-04-10
Status: PLANNED
Linked Work Packet: WP-I1-021
Iteration: I1

## Scope

Validate WP delivery against linked requirements and primitives.

## Inputs

- Linked requirements: REQ-0200, REQ-0212
- Linked primitives: PRIM-0005
- Linked components: App.tsx (layout JSX, panel state), App.css (grid, collapse, breakpoints, footer)

## Reality Boundary Assertions

- Packet Class: IMPLEMENTATION
- Real Seam: CSS grid layout, collapse toggle affordance, footer grid integration — all direct code changes, no simulation.
- Proof Target: Live bridge audit-sweep snapshots at multiple viewport widths showing all panels reachable and non-overlapping.
- Allowed Fallbacks: None.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| UI-001 | REQ-0200 | PRIM-0005 | UI Contract | All four regions rendered | data-testid region selectors in DOM | region-left-panel, region-right-panel, region-bottom-panel, map-panel all present |
| UI-002 | REQ-0200 | PRIM-0005 | UI Contract | Inspector panel reachable when collapsed | Toggle button visible outside collapsed area | Header or toolbar contains always-visible inspector toggle |
| UI-003 | REQ-0200 | PRIM-0005 | UI Contract | Tray panel reachable when collapsed | Toggle button visible outside collapsed area | Header or toolbar contains always-visible tray toggle |
| UI-004 | REQ-0200 | PRIM-0005 | UI Contract | Footer inside grid flow | Footer does not overlay center panel | Expanded tray pushes map up instead of covering it |
| UI-005 | REQ-0200 | PRIM-0005 | UI Contract | Intermediate breakpoint | Viewport 900-1120px | Panels degrade to compact/icon-rail rather than single-column stack |
| UI-006 | REQ-0212 | PRIM-0005 | Accessibility | Keyboard panel toggle | Tab + Enter reaches toggle | Inspector and tray toggles are keyboard-accessible |
| COR-001 | REQ-0200 | PRIM-0005 | Code Correctness | TypeScript + lint | npm run lint && npm run type-check | Clean pass |
| COR-002 | REQ-0200 | PRIM-0005 | Code Correctness | Existing test suite | npm test | All existing tests pass (no regressions) |
| VISUAL-001 | REQ-0200 | PRIM-0005 | Visual Proof | Bridge audit-sweep | POST /agent/action audit-sweep | All panels visible, no overlap in snapshots |

## Dependency and Environment Tests

- [ ] Runtime dependency install/lock integrity
- [ ] Platform portability constraints checked
- [ ] Required services/adapters available

## UI Contract Tests

- [ ] All four stable regions present in DOM (left, right, bottom, main)
- [ ] Inspector has always-visible toggle outside its own collapsed area
- [ ] Tray has always-visible toggle outside its own collapsed area
- [ ] Expanded tray does not overlay the map canvas (grid flow, not z-index overlay)
- [ ] Intermediate breakpoint (900-1120px) degrades panels gracefully instead of jumping to single-column

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

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-021.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I1-021/

## Execution Summary

- Last Run Date: 2026-04-10
- Result: 90/90 tests passed (vitest), TypeScript clean (tsc --noEmit), ESLint clean
- Blocking Failures: none
- Evidence Paths: pending live bridge audit-sweep snapshots
- What Became Real: Persistent header toggles, footer grid integration, intermediate breakpoint, Ctrl+T shortcut
- What Remains Simulated: nothing
- Next Blocking Real Seam: Live desktop visual proof via bridge + user sign-off
- Reviewer: Codex
- User Sign-off: pending
