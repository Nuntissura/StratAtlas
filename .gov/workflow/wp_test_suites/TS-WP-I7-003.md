# TS-WP-I7-003 - Spec vs Code Test Suite

Date Opened: 2026-04-09
Status: IN-PROGRESS
Linked Work Packet: WP-I7-003
Iteration: I7

## Scope

Validate that the live shell derives a truthful global event timeline from governed event artifacts, projects only spatially eligible events onto the map with cluster/expand behavior, and lets operators jump from the timeline into AOI-linked map inspection.

## Inputs

- Linked requirements: REQ-0804, REQ-0805, REQ-0808, REQ-0809
- Linked primitives: PRIM-0045, PRIM-0076
- Linked components: `.product/Worktrees/wt_main/src/App.tsx`; `.product/Worktrees/wt_main/src/App.css`; `.product/Worktrees/wt_main/src/App.test.tsx`; `.product/Worktrees/wt_main/src/features/i1/components/MapRuntimeSurface.tsx`; `.product/Worktrees/wt_main/src/features/i1/components/MapRuntimeSurface.css`; `.product/Worktrees/wt_main/src/features/i1/runtime/mapRuntimeScene.ts`; `.product/Worktrees/wt_main/src/features/i1/i1.test.ts`; `.product/Worktrees/wt_main/src/features/i7/eventTimeline.ts`; `.product/Worktrees/wt_main/src/features/i7/i7.test.ts`

## Reality Boundary Assertions

- Packet Class: IMPLEMENTATION
- Real Seam: the live app derives a global event timeline plus map-marker layer from already-real deviation and OSINT artifacts, and timeline selection can drive real map focus plus contextual inspect state.
- Proof Target: event timeline/unit regressions pass, app/runtime regressions pass, packet checks pass, and live bridge proof shows the timeline and event-linked map focus.
- Allowed Fallbacks: browser/jsdom remains a non-desktop proof environment; the timeline may stay derived from restored event state instead of persisting as a separate artifact.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0808 | PRIM-0076 | Dependency | governed frontend packet path | `pnpm build`; `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I7-003.ps1` | timeline and marker surfaces compile and packet governance stays synchronized |
| UI-001 | REQ-0804, REQ-0805 | PRIM-0045, PRIM-0076 | UI Contract | timeline, hover helpers, and map runtime surfaces | `pnpm exec vitest run src/App.test.tsx src/features/i1/i1.test.ts src/features/i7/i7.test.ts --reporter=verbose` | non-spatial context stays off the map while the timeline and event helper surfaces show source/cadence/confidence truthfully |
| FUNC-001 | REQ-0808, REQ-0809 | PRIM-0076 | Functionality | global timeline and event-to-AOI linking | `pnpm exec vitest run src/App.test.tsx src/features/i1/i1.test.ts src/features/i7/i7.test.ts --reporter=verbose` | timeline entries sort deterministically, bundle-reopened events recreate the same timeline, and event selection focuses the relevant AOI/inspect state |
| COR-001 | REQ-0804, REQ-0805 | PRIM-0045, PRIM-0076 | Code Correctness | derived event model and clustered marker contracts | `pnpm exec vitest run src/features/i1/i1.test.ts src/features/i7/i7.test.ts --reporter=verbose`; `pnpm build` | event IDs, spatial eligibility, and metadata fields stay type-safe and regression-covered |
| RED-001 | REQ-0804, REQ-0805 | PRIM-0076 | Red Team / Abuse | false-precision and labeling constraints | targeted assertions in `src/features/i7/i7.test.ts` and `src/App.test.tsx` | aggregate-only and non-spatial context is not silently relabeled as precise map incidents |
| EXT-001 | REQ-0809 | PRIM-0076 | Additional | live desktop proof | bridge navigate/snapshot proof under `.product/build_target/tool_artifacts/wp_runs/WP-I7-003/` | the running app shows the timeline and map-linked event flow as shipped |

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

- Command: `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I7-003.ps1`
- Artifacts: `.product/build_target/tool_artifacts/wp_runs/WP-I7-003/`

## Execution Summary

- Last Run Date:
- Result:
- Blocking Failures:
- Evidence Paths:
- What Became Real: pending implementation.
- What Remains Simulated: browser/jsdom remains a non-desktop proof environment relative to the live Tauri shell.
- Next Blocking Real Seam: `WP-I7-004` owns the broader geopolitical baseline dataset and dashboard follow-on once the event timeline surface is real.
- Reviewer:
- User Sign-off:
