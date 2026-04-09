# TS-WP-I1-017 - Spec vs Code Test Suite

Date Opened: 2026-04-09
Status: PLANNED
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
- What Became Real: Pending implementation.
- What Remains Simulated: Pending implementation.
- Next Blocking Real Seam: Pending implementation.

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

- [ ] Runtime dependency install/build checks
- [ ] Platform portability constraints checked
- [ ] HUD/settings shell behaves in the governed runtime

## UI Contract Tests

- [ ] Compact HUD controls render without removing stable regions
- [ ] Settings surface is accessible and explicit
- [ ] Error, fallback, and degraded-state messaging remains visible

## Functional Flow Tests

- [ ] Selection and helper flow
- [ ] Settings interaction flow
- [ ] Save/restore persistence flow

## Code Correctness Tests

- [ ] App/UI regression tests
- [ ] Settings persistence checks
- [ ] Static checks (lint/type/schema)

## Red-Team and Abuse Tests

- [ ] Non-goal enforcement (spec section 3.2)
- [ ] No fake live-data or autonomy claims in helper/settings UI
- [ ] Invalid selection and persistence cases

## Additional Tests

- [ ] Performance budget checks
- [ ] Offline behavior
- [ ] Accessibility/usability checks
- [ ] Reliability/recovery checks
- [ ] Visual snapshot proof when desktop runtime is available

## Automation Hook

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-017.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I1-017/

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
