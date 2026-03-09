# TS-WP-I1-005 - Spec vs Code Test Suite

Date Opened: 2026-03-09
Status: E2E-VERIFIED
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
| UI-001 | REQ-0200 | PRIM-0071 | UI Contract | governed desktop shell runtime | `pnpm smoke:runtime -- --wp-id WP-I1-005` | runtime shell opens with the map dominant and the workbench tabs/tray available in the governed desktop flow |
| FUNC-001 | REQ-0201 | PRIM-0045 | Functionality | map-linked mode/workspace flows | `pnpm test -- --run` | mode-linked workflows and map artifacts remain reachable through the new tabbed shell |
| COR-001 | REQ-0211 | PRIM-0045 | Code Correctness | shell + regression correctness | `pnpm lint` | shell refactor compiles cleanly and keeps degraded/export/map states truthful |
| RED-001 | REQ-0212 | PRIM-0068 | Red Team / Abuse | accessibility and semantic states | `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/red_team_guardrail_check.ps1` | non-goal guardrails remain intact while accessibility semantics stay covered by runtime + regression tests |
| EXT-001 | REQ-0200 | PRIM-0071 | Additional | build compatibility | `pnpm build` | the restyled workbench still produces the governed desktop build |

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

- Last Run Date: 2026-03-09
- Result: Passed `check-WP-I1-005.ps1` with governed cold/warm Tauri runtime smoke, full functional suite, lint, build, Rust tests, and guardrail checks.
- Blocking Failures: None. Initial cold restore and pan/zoom budget regressions were remediated before the final packet proof run.
- Evidence Paths: `.product/build_target/tool_artifacts/wp_runs/WP-I1-005/20260309_080635/`, `.product/build_target/tool_artifacts/wp_runs/WP-I1-005/20260309_080635/runtime_smoke/runtime_smoke_summary.md`
- What Became Real: The verified runtime now opens inside a calmer desktop workbench with grouped left/main/right/bottom tab sets, immediate map-surface feedback, a lighter governed 2D basemap, and preserved map-first shell behavior.
- What Remains Simulated: None introduced by this packet; the restyle only reorganizes already-real runtime surfaces.
- Next Blocking Real Seam: Release-prep governance and installer/release evidence, not more shell scaffolding.
- Reviewer: Codex
- User Sign-off: Approved via 2026-03-09 instruction to restyle the app using the `Uncodixfy` guidance and redesign rubric.
