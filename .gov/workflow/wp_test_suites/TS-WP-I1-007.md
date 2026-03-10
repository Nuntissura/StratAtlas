# TS-WP-I1-007 - Spec vs Code Test Suite

Date Opened: 2026-03-10
Status: E2E-VERIFIED
Linked Work Packet: WP-I1-007
Iteration: I1

## Scope

Validate the narrow I1 fix for panel explainers and the real 2D basemap contract.

## Inputs

- Linked requirements: REQ-0011, REQ-0013, REQ-0200, REQ-0201, REQ-0212
- Linked primitives: PRIM-0045, PRIM-0068, PRIM-0071
- Linked components: .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/App.css; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/features/i1/components/MapRuntimeSurface.tsx; .product/Worktrees/wt_main/src/features/i1/components/MapRuntimeSurface.css

## Reality Boundary Assertions

- Packet Class: IMPLEMENTATION
- Real Seam: The live shell exposes panel explainers on every stable region and the 2D runtime truthfully distinguishes online basemap vs fallback schematic rendering.
- Proof Target: App tests, build/lint, and packet-grade verification prove the new panel help controls and basemap-state contract without regressing the verified shell.
- Allowed Fallbacks: The basemap may fall back locally when offline or when the online source fails, but the UI must label that state explicitly.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0200 | PRIM-0071 | Dependency | build/runtime compatibility | `pnpm build` | basemap/help changes compile and preserve the workbench contract |
| UI-001 | REQ-0200, REQ-0212 | PRIM-0068, PRIM-0071 | UI Contract | panel explainers | `.product/Worktrees/wt_main/src/App.test.tsx` | each stable panel exposes concise explainer content with accessible controls |
| FUNC-001 | REQ-0201 | PRIM-0045 | Functionality | 2D basemap runtime state | `.product/Worktrees/wt_main/src/App.test.tsx`; `.product/Worktrees/wt_main/src/features/i1/i1.test.ts` | the planar surface exposes truthful online/fallback basemap semantics without regressing the map shell |
| COR-001 | REQ-0011, REQ-0013 | PRIM-0045 | Code Correctness | labeling contract | review + tests | the basemap/help copy does not imply unsupported live data capabilities |
| RED-001 | REQ-0013 | PRIM-0071 | Red Team / Abuse | false-confidence prevention | packet review | a real basemap is not mislabeled as live traffic or intelligence content |
| EXT-001 | REQ-0201, REQ-0212 | PRIM-0068 | Additional | degraded/offline usability | runtime smoke or packet review | fallback schematic state remains usable and explicitly labeled |

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

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-007.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I1-007/

## Execution Summary

- Last Run Date: 2026-03-10
- Result: Passed
- Blocking Failures: None
- Evidence Paths: `.product/build_target/tool_artifacts/wp_runs/WP-I1-007/20260310_012211/`; `.product/Worktrees/wt_main/src/App.test.tsx`; `.product/Worktrees/wt_main/src/features/i1/i1.test.ts`
- What Became Real: The workbench now exposes inline help for each stable panel and the 2D runtime truthfully labels online basemap versus fallback schematic states.
- What Remains Simulated: Requested future air/shipping/satellite/infrastructure layers remain outside this packet
- Next Blocking Real Seam: Implement the first source-backed toggleable map-family successor packet from `WP-GOV-MAPDATA-001`
- Reviewer:
- User Sign-off:
