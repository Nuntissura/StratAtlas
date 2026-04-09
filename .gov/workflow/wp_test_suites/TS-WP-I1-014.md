# TS-WP-I1-014 - Spec vs Code Test Suite

Date Opened: 2026-04-09
Status: EXECUTED
Linked Work Packet: WP-I1-014
Iteration: I1

## Scope

Validate the 2D basemap selector packet against the existing I1 runtime contract, saved-state restore expectations, and truthful fallback behavior.

## Inputs

- Linked requirements: REQ-0200, REQ-0201, REQ-0211
- Linked primitives: PRIM-0045, PRIM-0071
- Linked components: .gov/Spec/sub-specs/I1_high_detail_basemap_and_style_switcher.md; .product/Worktrees/wt_main/src/features/i1/components/MapRuntimeSurface.tsx; .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/contracts/i0.ts

## Reality Boundary Assertions

- Packet Class: IMPLEMENTATION
- Real Seam: The 2D MapLibre surface exposes a real basemap selector for official OpenFreeMap vector styles and restores that selection through recorder and bundle state without breaking the schematic fallback contract.
- Proof Target: Verification proves selector rendering, selected-style persistence, and truthful fallback messaging; live desktop snapshot evidence is preferred when the bridge/runtime is available.
- Allowed Fallbacks: Only the official `Positron`, `Bright`, and `Liberty` vector styles are in scope; offline or load-failure states may continue to use the existing schematic fallback.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.
- What Became Real: The 2D shell now exposes a governed basemap selector for the official OpenFreeMap vector styles, persists the selected style through recorder and bundle restore, and normalizes invalid restored values back to the governed default.
- What Remains Simulated: Satellite imagery, terrain-specific styling, and dark/night basemap variants remain outside this packet.
- Next Blocking Real Seam: User review plus successor packet `WP-I1-015` before any `E2E-VERIFIED` promotion.

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0200 | PRIM-0045 | Dependency | governed build inputs | `pnpm build`; `.gov/workflow/wp_checks/check-WP-I1-014.ps1` | selector integrates without breaking the verified runtime build |
| UI-001 | REQ-0200, REQ-0211 | PRIM-0071 | UI Contract | 2D toolbar + status copy | `pnpm exec vitest run src/App.test.tsx --reporter=verbose` | selector and truthful fallback messaging render in the shell |
| FUNC-001 | REQ-0201 | PRIM-0045 | Functionality | restore and reopen path | `pnpm exec vitest run src/App.test.tsx --reporter=verbose` | selected basemap style survives recorder persistence and bundle reopen |
| COR-001 | REQ-0200, REQ-0201 | PRIM-0045 | Code Correctness | basemap contract | `pnpm exec vitest run src/App.test.tsx --reporter=verbose`; review `MapRuntimeSurface.tsx` | style selection and invalid restore values resolve deterministically |
| RED-001 | REQ-0211 | PRIM-0071 | Red Team / Abuse | truth-label integrity | packet review + WP check runner | selector never implies satellite, terrain, or live-feed guarantees that do not exist |
| EXT-001 | REQ-0211 | PRIM-0045 | Additional | fallback/reliability | live desktop snapshot if runtime available; otherwise packet review | offline and load-failure fallback remains readable and explicit |

## Dependency and Environment Tests

- [x] Runtime dependency install/build checks
- [ ] Platform portability constraints checked
- [ ] Required style endpoints and fallback path behave as expected

## UI Contract Tests

- [x] Selector renders in the map toolbar
- [x] Active selection is visually and textually clear
- [x] Error and degraded-state UX remains truthful

## Functional Flow Tests

- [x] Style selection flow
- [x] Deterministic recorder restore path
- [x] Bundle reopen path

## Code Correctness Tests

- [x] App/UI regression tests
- [x] Restore-value normalization checks
- [x] Static checks (lint/type/schema)

## Red-Team and Abuse Tests

- [x] Non-goal enforcement (spec section 3.2)
- [x] No fake live-source or imagery claims
- [x] Invalid restore values fall back safely

## Additional Tests

- [ ] Offline behavior
- [ ] Accessibility/usability checks
- [x] Reliability/recovery checks
- [x] Visual snapshot proof when desktop runtime is available

## Automation Hook

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-014.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I1-014/

## Execution Summary

- Last Run Date: 2026-04-09
- Result: PASS for implementation-grade verification
- Blocking Failures: None in governed packet checks, frontend tests, lint, build, or Rust tests
- Evidence Paths: `.product/build_target/tool_artifacts/wp_runs/WP-I1-014/20260409_051858/summary.md`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-014/20260409_051858/result.json`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-014/20260409_051858/visual_proof/planar_basemap_selector_live.png`
- What Became Real: The 2D runtime now exposes a compact OpenFreeMap vector-style selector, persists the selected style through recorder save plus bundle reopen, normalizes invalid restored values to the governed default, and retains truthful fallback copy.
- What Remains Simulated: Satellite imagery, terrain-specific styling, and dark/night basemap variants remain outside this packet.
- Next Blocking Real Seam: User review plus successor packet `WP-I1-015` before any `E2E-VERIFIED` promotion.
- Reviewer: Codex
- User Sign-off: Pending
