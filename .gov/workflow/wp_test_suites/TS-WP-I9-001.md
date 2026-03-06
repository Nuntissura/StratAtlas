# TS-WP-I9-001 - Spec vs Code Test Suite

Date Opened: 2026-03-05
Status: IN-PROGRESS
Linked Work Packet: WP-I9-001
Iteration: I9

## Scope

Validate this WP against linked requirements/primitives with dependency, UI, functionality, correctness, red-team, and extended test coverage.

## Inputs

- Linked requirements: REQ-1000..REQ-1003
- Linked primitives: PRIM-0018
- Linked components: .product/Worktrees/wt_main/src/App.tsx + src/features + src/lib/backend.ts + src-tauri/src/lib.rs

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | mapped in WP | mapped in WP | Dependency | dependency graph | `pnpm install --frozen-lockfile` + `pnpm lint` | dependency/runtime checks pass |
| UI-001 | mapped in WP | mapped in WP | UI Contract | required UI contract | `src/App.test.tsx` | regions/modes and degraded-state behavior pass |
| FUNC-001 | mapped in WP | mapped in WP | Functionality | golden flow | `src/lib/backend.test.ts` + feature tests | golden flow/replay/feature flow passes |
| COR-001 | mapped in WP | mapped in WP | Code Correctness | module contracts | `pnpm test` | module contract invariants/regressions pass |
| RED-001 | mapped in WP | mapped in WP | Red Team / Abuse | misuse constraints | `src/features/i6/i6.test.ts` + non-goal guards | policy/misuse cases blocked |
| EXT-001 | mapped in WP | mapped in WP | Additional | perf/offline/reliability | `pnpm build` + `cargo test --manifest-path src-tauri/Cargo.toml` | build/runtime reliability checks pass |

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

- Last Run Date: 2026-03-05
- Result: PASSING activation-shell baseline only; normative I9 delivery reopened on 2026-03-06
- Blocking Failures: None
- Evidence Paths: activation-shell baseline only from 2026-03-05; current proof path pending normative I9 delivery
- Reviewer: Codex
- User Sign-off: Pending

## Automation Hook

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I9-001.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I9-001/
