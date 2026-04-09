# TS-WP-I1-017 - Spec vs Code Test Suite

Date Opened: 2026-04-09
Status: EXECUTED
Linked Work Packet: WP-I1-017
Iteration: I1

## Scope

Validate the HUD/settings packet against the verified map runtime, decluttered shell baseline, and the requirement that the map remain the primary analytical surface while helper detail and controls become more contextual.

## Inputs

- Linked requirements: REQ-0011, REQ-0012, REQ-0013, REQ-0200, REQ-0201, REQ-0211, REQ-0212
- Linked primitives: PRIM-0045, PRIM-0068, PRIM-0071
- Linked components: .gov/Spec/sub-specs/I1_map_hud_contextual_hover_help_and_governed_settings.md; .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/App.css; .product/Worktrees/wt_main/src/features/i1/components/MapRuntimeSurface.tsx; .product/Worktrees/wt_main/src/features/i1/components/MapRuntimeSurface.css; .product/Worktrees/wt_main/src/lib/backend.ts

## Reality Boundary Assertions

- Packet Class: IMPLEMENTATION
- Real Seam: The live shell adopts a compact map HUD, contextual detail drawer, hover/focus helper behavior, and a governed settings surface that changes real runtime behavior and persists across save/restore.
- Proof Target: Tests prove the HUD layout, selection-driven detail surface, helper/settings semantics, settings persistence, and visual bridge proof from the running shell when available.
- Allowed Fallbacks: Non-interactive runtimes may degrade hover into click-only contextual detail; settings persistence may route through the existing recorder/backend path rather than a separate preferences service.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to `E2E-VERIFIED`.
- What Became Real: The map runtime now ships a compact HUD, contextual drawer, hover/focus helper cards, motion controls, and a persisted settings surface tied to real shell/runtime behavior.
- What Remains Simulated: Live desktop proof still falls back to non-interactive helper flows when the runtime cannot mount full interactive map features, so hover can degrade into focus/click disclosure in those environments.
- Next Blocking Real Seam: User review plus successor packet `WP-I1-018` before any `E2E-VERIFIED` promotion.

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0200 | PRIM-0071 | Dependency | governed shell build inputs | `pnpm build`; `.gov/workflow/wp_checks/check-WP-I1-017.ps1` | HUD/settings changes integrate without breaking the verified workbench build |
| UI-001 | REQ-0200, REQ-0212 | PRIM-0068, PRIM-0071 | UI Contract | map HUD + settings surface | `pnpm exec vitest run src/App.test.tsx --reporter=verbose` | compact chrome, accessible settings controls, and stable-region semantics render correctly |
| FUNC-001 | REQ-0011, REQ-0012, REQ-0201 | PRIM-0045, PRIM-0071 | Functionality | contextual help + selection detail | `pnpm exec vitest run src/App.test.tsx --reporter=verbose` | map/legend interaction reveals truthful point-of-use detail without removing governed labels |
| COR-001 | REQ-0013, REQ-0211 | PRIM-0045, PRIM-0068 | Code Correctness | settings persistence + motion/degraded logic | `pnpm exec vitest run src/App.test.tsx --reporter=verbose`; review `App.tsx` and `MapRuntimeSurface.tsx` | settings restore deterministically and reduced-motion/degraded paths stay explicit |
| RED-001 | REQ-0011, REQ-0013 | PRIM-0071 | Red Team / Abuse | no fake capability or label drift | packet review + WP check runner | helper/settings UX does not imply unsupported live data, hidden automation, or evidence certainty |
| EXT-001 | REQ-0200, REQ-0201 | PRIM-0045, PRIM-0071 | Additional | live shell visual proof | bridge snapshot if runtime available; otherwise packet review | running desktop shell visibly shows the HUD state and governed settings surface |

## Dependency and Environment Tests

- [x] Runtime dependency install/build checks
- [ ] Platform portability constraints checked
- [x] HUD/settings shell behaves in the governed runtime

## UI Contract Tests

- [x] Compact HUD controls render without removing stable regions
- [x] Settings surface is accessible and explicit
- [x] Error, fallback, and degraded-state messaging remains visible

## Functional Flow Tests

- [x] Selection and helper flow
- [x] Settings interaction flow
- [x] Save/restore persistence flow

## Code Correctness Tests

- [x] App/UI regression tests
- [x] Settings persistence checks
- [x] Static checks (lint/type/schema)

## Red-Team and Abuse Tests

- [x] Non-goal enforcement (spec section 3.2)
- [x] No fake live-data or autonomy claims in helper/settings UI
- [x] Invalid selection and persistence cases

## Additional Tests

- [ ] Performance budget checks
- [ ] Offline behavior
- [x] Accessibility/usability checks
- [x] Reliability/recovery checks
- [x] Visual snapshot proof when desktop runtime is available

## Automation Hook

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-017.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I1-017/

## Execution Summary

- Last Run Date: 2026-04-09
- Result: PASS for implementation-grade verification
- Blocking Failures: None in App regression tests or governed WP checks
- Evidence Paths: `.product/build_target/tool_artifacts/wp_runs/WP-I1-017/20260409_192533/summary.md`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-017/20260409_192533/result.json`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-017/20260409_192533/visual_proof/map_hud_runtime_1775755811002.png`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-017/20260409_192533/visual_proof/map_hud_navigated_1775755827602.png`
- What Became Real: The live shell now uses a compact in-map HUD, helper-card hover/focus disclosure, a selection-driven contextual drawer, and a governed settings menu that persists motion, chrome, helper, connectivity, and deployment-profile choices through the recorder state.
- What Remains Simulated: Desktop bridge proof still uses the fallback runtime path where interactive map hover is unavailable, so helper disclosure is validated through focus/click and live snapshots rather than full pointer-map hover in that environment.
- Next Blocking Real Seam: User review plus successor packet `WP-I1-018` before any `E2E-VERIFIED` promotion.
- Reviewer: Codex
- User Sign-off: Pending
