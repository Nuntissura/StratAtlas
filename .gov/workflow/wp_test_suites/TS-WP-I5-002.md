# TS-WP-I5-002 - Spec vs Code Test Suite

Date Opened: 2026-03-06
Status: E2E-VERIFIED
Linked Work Packet: WP-I5-002
Iteration: I5

## Scope

Validate WP delivery against linked requirements and primitives.

## Inputs

- Linked requirements: REQ-0108, REQ-0600, REQ-0601, REQ-0602, REQ-0603, REQ-0604, REQ-0810
- Linked primitives: PRIM-0050, PRIM-0051
- Linked components:
  - `.product/Worktrees/wt_main/src/App.tsx`
  - `.product/Worktrees/wt_main/src/App.test.tsx`
  - `.product/Worktrees/wt_main/src/features/i5/queryBuilder.ts`
  - `.product/Worktrees/wt_main/src/features/i5/queryExecution.ts`
  - `.product/Worktrees/wt_main/src/features/i5/queryRuntime.ts`
  - `.product/Worktrees/wt_main/src/features/i5/i5.test.ts`
  - `.product/Worktrees/wt_main/src/lib/backend.ts`
  - `.product/Worktrees/wt_main/src-tauri/src/lib.rs`

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0600 | PRIM-0050 | Dependency | wt_main workspace | `pnpm install --frozen-lockfile` | DuckDB-backed query execution dependencies resolve cleanly with no lock drift or unsupported package changes. |
| UI-001 | REQ-0601 | PRIM-0051 | UI Contract | query builder surface and render/save cards | `pnpm exec vitest run src/App.test.tsx` | Query mode renders governed result-layer and saved-artifact surfaces with honest execution state and reopen behavior. |
| FUNC-001 | REQ-0604 | PRIM-0051 | Functionality | query execution adapter and saved-result flow | `pnpm exec vitest run src/features/i5/i5.test.ts` | DuckDB-backed query execution, context-aware predicates, and deterministic saved-query snapshots remain stable. |
| COR-001 | REQ-0600 | PRIM-0050 | Code Correctness | TypeScript workspace | `pnpm lint` | Query execution modules compile cleanly with no new type, import, or policy regressions. |
| RED-001 | REQ-0603 | PRIM-0050 | Red Team / Abuse | governed code root | `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/red_team_guardrail_check.ps1 -CodeRoot .product/Worktrees/wt_main` | No new guardrail regression or policy-bypass pattern is introduced by the query runtime slice. |
| EXT-001 | REQ-0108 | PRIM-0050 | Additional | production compile/build | `pnpm build` | Query runtime remains offline-safe and does not break the governed desktop build. |
| EXT-002 | REQ-0602 | PRIM-0051 | Additional | Tauri persistence boundary | `cargo test --manifest-path src-tauri/Cargo.toml` | Saved query artifacts remain compatible with the governed desktop persistence boundary. |

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

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I5-002.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I5-002/

## Execution Summary

- Last Run Date: 2026-03-07
- Result: PASS (official closeout verification)
- Blocking Failures: None for packet closeout. REQ-0108 and REQ-0810 remain covered by retained `WP-I0-003` proof while this packet closes REQ-0600..REQ-0604.
- Evidence Paths: `.product/build_target/tool_artifacts/wp_runs/WP-I5-002/20260307_232719/result.json`; `.product/build_target/tool_artifacts/wp_runs/WP-I5-002/20260307_232719/summary.md`; `.product/build_target/tool_artifacts/wp_runs/WP-I5-002/20260307_232719/UI-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-I5-002/20260307_232719/FUNC-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-I5-002/20260307_232719/COR-001.log`
- Reviewer: Codex
- User Sign-off: Approved via 2026-03-07 instruction to start `WP-I5-002`.
