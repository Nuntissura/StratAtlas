# TS-WP-I1-005 - Spec vs Code Test Suite

Date Opened: 2026-03-09
Status: PLANNED
Linked Work Packet: WP-I1-005
Iteration: I1

## Scope

Validate that the app shell is materially restructured into a calmer map-first workbench without breaking the verified I1 runtime, mode, degradation, and accessibility behavior.

## Inputs

- Linked requirements: REQ-0011, REQ-0012, REQ-0200, REQ-0201, REQ-0211, REQ-0212
- Linked primitives: PRIM-0045, PRIM-0068, PRIM-0071
- Linked components: `.product/Worktrees/wt_main/src/App.tsx`, `.product/Worktrees/wt_main/src/App.css`, `.product/Worktrees/wt_main/src/index.css`, `.product/Worktrees/wt_main/src/features/i1/components/MapRuntimeSurface.tsx`, `.product/Worktrees/wt_main/src/features/i1/components/MapRuntimeSurface.css`, `.product/Worktrees/wt_main/src/App.test.tsx`, `.product/Worktrees/wt_main/src/features/i1/i1.test.ts`

## Reality Boundary Assertions

- Packet Class: IMPLEMENTATION
- Real Seam: The shell layout and visibility model change for real, reducing always-open content and making the map the center-stage region.
- Proof Target: Stable regions/modes remain valid, map and grouped workflows render, accessibility remains intact, and regression/runtime smoke evidence links to the packet.
- Allowed Fallbacks: Legacy cards may remain behind tabs or tray panels during the first pass, but not as the default always-open composition.
- Promotion Guard: CSS-only repainting without structural reduction of overload is not sufficient.

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0200 | PRIM-0071 | Dependency | shell wiring | `pnpm lint` | no invalid imports or structural regressions |
| UI-001 | REQ-0200 | PRIM-0071 | UI Contract | stable regions and workbench tabs | `pnpm test -- --run src/App.test.tsx src/features/i1/i1.test.ts` | required regions, map shell, and tabbed controls render correctly |
| FUNC-001 | REQ-0201 | PRIM-0045 | Functionality | map-linked mode/workspace flows | `pnpm test -- --run src/App.test.tsx` | mode-linked workflows and map artifacts remain reachable |
| COR-001 | REQ-0211 | PRIM-0045 | Code Correctness | degraded-state behavior | `pnpm test -- --run src/features/i1/i1.test.ts` | degradation and export/map states remain truthful |
| RED-001 | REQ-0212 | PRIM-0068 | Red Team / Abuse | accessibility and semantic states | `pnpm test -- --run src/App.test.tsx src/features/i1/i1.test.ts` | tabs and controls expose pressed/selected states and non-color semantics |
| EXT-001 | REQ-0200 | PRIM-0071 | Additional | desktop runtime proof | `pnpm smoke:runtime -- --wp-id WP-I1-005` | runtime shell and map surface remain operational in the governed desktop flow |

## Dependency and Environment Tests

- [ ] Lint and dependency integrity
- [ ] Runtime build compatibility
- [ ] Tauri desktop smoke path available

## UI Contract Tests

- [ ] Required regions
- [ ] Required modes and workspace tabs
- [ ] Error and degraded-state UX

## Functional Flow Tests

- [ ] Map-first golden shell flow
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

- [ ] Desktop runtime smoke
- [ ] Offline behavior
- [ ] Accessibility/usability checks
- [ ] Reliability/recovery checks

## Automation Hook

- Command: `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-005.ps1`
- Artifacts: `.product/build_target/tool_artifacts/wp_runs/WP-I1-005/`

## Execution Summary

- Last Run Date:
- Result:
- Blocking Failures:
- Evidence Paths:
- What Became Real:
- What Remains Simulated:
- Next Blocking Real Seam:
- Reviewer:
- User Sign-off:
