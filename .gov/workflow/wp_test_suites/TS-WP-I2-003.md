# TS-WP-I2-003 - Spec vs Code Test Suite

Date Opened: 2026-03-06
Status: E2E-VERIFIED
Linked Work Packet: WP-I2-003
Iteration: I2

## Scope

Validate WP delivery against linked requirements and primitives.

## Inputs

- Linked requirements: REQ-0209, REQ-0210, REQ-0300, REQ-0301, REQ-0302
- Linked primitives: PRIM-0048, PRIM-0049
- Linked components:
  - `.product/Worktrees/wt_main/src/features/i2/baselineDelta.ts`
  - `.product/Worktrees/wt_main/src/App.tsx`
  - `.product/Worktrees/wt_main/src/features/i1/runtime/mapRuntimeScene.ts`
  - `.product/Worktrees/wt_main/src/lib/backend.ts`
  - `.product/Worktrees/wt_main/src-tauri/src/lib.rs`

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0300 | PRIM-0048 | Dependency | wt_main workspace | `pnpm lint` | TypeScript/React compare runtime compiles cleanly with no policy or import regressions. |
| UI-001 | REQ-0301 | PRIM-0048 | UI Contract | compare dashboard and prepared artifact cards | `.product/Worktrees/wt_main/src/App.test.tsx` | Compare mode exposes AOI-linked cells, focus AOI telemetry, and prepared compare/briefing artifact surfaces. |
| FUNC-001 | REQ-0302 | PRIM-0049 | Functionality | baseline -> delta -> bundle -> briefing flow | `.product/Worktrees/wt_main/src/App.test.tsx` | Golden flow produces deterministic compare and briefing artifacts once a governed bundle exists. |
| COR-001 | REQ-0300 | PRIM-0048 | Code Correctness | comparative analytics builders and map linkage | `.product/Worktrees/wt_main/src/features/i2/i2.test.ts`; `.product/Worktrees/wt_main/src/features/i1/i1.test.ts` | AOI-linked delta summaries, focus selection, and map-projected compare signals remain deterministic. |
| RED-001 | REQ-0302 | PRIM-0049 | Red Team / Abuse | briefing preparation without bundle | `.product/Worktrees/wt_main/src/App.test.tsx` | Export preparation is blocked until a governed bundle reference exists. |
| EXT-001 | REQ-0209 | PRIM-0048 | Additional | production compile/build | `pnpm build` | Compare/export slice compiles into the governed desktop build without breaking the map runtime. |

## Dependency and Environment Tests

- [x] Runtime dependency install/lock integrity
- [x] Platform portability constraints checked
- [ ] Required services/adapters available

## UI Contract Tests

- [x] Required regions
- [x] Required modes/states
- [x] Error and degraded-state UX

## Functional Flow Tests

- [x] Golden flow
- [x] Deterministic replay path
- [x] Export/import or persistence flow

## Code Correctness Tests

- [x] Unit tests
- [x] Integration tests
- [x] Static checks (lint/type/schema)

## Red-Team and Abuse Tests

- [ ] Non-goal enforcement (spec section 3.2)
- [x] Policy bypass attempts
- [x] Invalid input and path abuse cases

## Additional Tests

- [ ] Performance budget checks
- [ ] Offline behavior
- [ ] Accessibility/usability checks
- [x] Reliability/recovery checks

## Automation Hook

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I2-003.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I2-003/

## Execution Summary

- Last Run Date: 2026-03-07
- Result: PASS (official closeout verification)
- Blocking Failures: None for packet closeout. REQ-0209 and REQ-0210 remain tracked separately as `IN-PROGRESS` until explicit export-budget timing evidence is attached.
- Evidence Paths: `.product/build_target/tool_artifacts/wp_runs/WP-I2-003/20260307_201453/result.json`; `.product/build_target/tool_artifacts/wp_runs/WP-I2-003/20260307_201453/summary.md`; `.product/build_target/tool_artifacts/wp_runs/WP-I2-003/20260307_201453/UI-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-I2-003/20260307_201453/FUNC-001.log`; retained pre-closeout failure: `.product/build_target/tool_artifacts/wp_runs/WP-I2-003/20260307_201231/UI-001.log`
- Reviewer: Codex
- User Sign-off: Approved via 2026-03-07 instruction to start and proceed with `WP-I2-003`.
