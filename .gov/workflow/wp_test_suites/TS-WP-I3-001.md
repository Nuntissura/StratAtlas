# TS-WP-I3-001 - Spec vs Code Test Suite

Date Opened: 2026-03-05
Status: E2E-VERIFIED
Linked Work Packet: WP-I3-001
Iteration: I3

## Scope

Validate this WP against linked requirements/primitives with dependency, UI, functionality, correctness, red-team, and extended test coverage.

## Inputs

- Linked requirements: REQ-0400..REQ-0403
- Linked primitives: PRIM-0012
- Linked components: .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/features/i3/collaboration.ts; .product/Worktrees/wt_main/src/features/i3/i3.test.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src/lib/backend.test.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0400 | PRIM-0012 | Dependency | collaboration workflow runtime | `pnpm install --frozen-lockfile` in `.product/Worktrees/wt_main` | dependencies resolve without lock drift |
| UI-001 | REQ-0400, REQ-0402, REQ-0403 | PRIM-0012 | UI Contract | collaboration panel and replay/conflict surface | `pnpm exec vitest run src/App.test.tsx` | collaboration mode, conflict indicators, and replay attribution UI render correctly |
| FUNC-001 | REQ-0400..REQ-0403 | PRIM-0012 | Functionality | merge/reconnect/replay golden flow | `pnpm exec vitest run src/features/i3/i3.test.ts src/App.test.tsx` | merge-safe state, reconnect conflict flow, and session replay attribution pass |
| COR-001 | REQ-0400..REQ-0403 | PRIM-0012 | Code Correctness | I3 collaboration contracts | full WP runner plus lint | collaboration session state, recorder integration, and audit contracts remain enforced |
| RED-001 | REQ-0400, REQ-0403 | PRIM-0012 | Red Team / Abuse | attribution loss or conflict bypass attempts | `.gov/repo_scripts/red_team_guardrail_check.ps1` via WP runner | collaboration surfaces preserve attribution and non-goal guardrails |
| EXT-001 | REQ-0400..REQ-0403 | PRIM-0012 | Additional | build and offline/recovery evidence | `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I3-001.ps1` | build/tests pass and proof artifacts capture collaboration recovery evidence |

## Dependency and Environment Tests

- [x] Runtime dependency install/lock integrity
- [x] Platform portability constraints checked
- [x] Required services/adapters available

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

- [x] Non-goal enforcement (spec section 3.2)
- [x] Policy bypass attempts
- [x] Invalid input and path abuse cases

## Additional Tests

- [x] Performance budget checks
- [x] Offline behavior
- [x] Accessibility/usability checks
- [x] Reliability/recovery checks

## Execution Summary

- Last Run Date: 2026-03-06
- Result: PASSING; promoted to `E2E-VERIFIED`
- Blocking Failures: None
- Evidence Paths: `.product/build_target/tool_artifacts/wp_runs/WP-I3-001/20260306_052546/result.json`; `.product/build_target/tool_artifacts/wp_runs/WP-I3-001/20260306_052546/summary.md`
- Reviewer: Codex
- User Sign-off: APPROVED via 2026-03-06 autonomous completion instruction.

## Automation Hook

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I3-001.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I3-001/
