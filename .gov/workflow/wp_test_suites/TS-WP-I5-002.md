# TS-WP-I5-002 - Spec vs Code Test Suite

Date Opened: 2026-03-06
Status: IN-PROGRESS
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
  - `.product/Worktrees/wt_main/src/features/i5/i5.test.ts`
  - `.product/Worktrees/wt_main/src/lib/backend.ts`
  - `.product/Worktrees/wt_main/src-tauri/src/lib.rs`

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0600 | PRIM-0050 | Dependency | wt_main workspace | `pnpm lint` | Query runtime compiles cleanly with no new dependency or policy regressions. |
| UI-001 | REQ-0601 | PRIM-0051 | UI Contract | query builder surface and render/save cards | `.product/Worktrees/wt_main/src/App.test.tsx` | Query mode renders governed result-layer and saved-artifact surfaces with honest runtime state. |
| FUNC-001 | REQ-0604 | PRIM-0051 | Functionality | compose -> run -> render -> save/version flow | `.product/Worktrees/wt_main/src/App.test.tsx` | Golden flow runs deterministically against the governed execution adapter and bundle-linked saved artifacts. |
| COR-001 | REQ-0600 | PRIM-0050 | Code Correctness | query builder and execution adapter modules | `.product/Worktrees/wt_main/src/features/i5/i5.test.ts` | Query composition, runtime row materialization, and deterministic saved-query packaging stay stable under regression tests. |
| RED-001 | REQ-0603 | PRIM-0050 | Red Team / Abuse | invalid domain/filter linkage and offline fallback | `.product/Worktrees/wt_main/src/App.test.tsx` | Query execution degrades safely when no governed query source is available and does not bypass domain scoping. |
| EXT-001 | REQ-0108 | PRIM-0050 | Additional | production compile/build | `pnpm build` | Query runtime remains offline-safe and does not break the governed desktop build. |

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

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I5-002.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I5-002/

## Execution Summary

- Last Run Date: 2026-03-07
- Result: Packet activated; implementation and verification pending
- Blocking Failures: Governed query execution is still frontend-local simulation at kickoff and must be replaced before status promotion.
- Evidence Paths: `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1`
- Reviewer: Codex
- User Sign-off: Approved via 2026-03-07 instruction to start `WP-I5-002`.
