# TS-WP-I6-002 - Spec vs Code Test Suite

Date Opened: 2026-03-06
Status: E2E-VERIFIED
Linked Work Packet: WP-I6-002
Iteration: I6

## Scope

Validate WP delivery against linked requirements and primitives.

## Inputs

- Linked requirements: REQ-0700, REQ-0701, REQ-0702, REQ-0703, REQ-0704, REQ-0705, REQ-0706, REQ-0707, REQ-0708
- Linked primitives: PRIM-0052, PRIM-0053
- Linked components:
  - `.product/Worktrees/wt_main/src/App.tsx`
  - `.product/Worktrees/wt_main/src/features/i6/aiGateway.ts`
  - `.product/Worktrees/wt_main/src/features/i6/i6.test.ts`
  - `.product/Worktrees/wt_main/src/lib/backend.ts`
  - `.product/Worktrees/wt_main/src-tauri/src/lib.rs`
  - `.product/Worktrees/wt_main/src/contracts/i0.ts`

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0700 | PRIM-0052 | Dependency | wt_main workspace | `pnpm install --frozen-lockfile` | Provider/runtime dependencies resolve cleanly with no policy-breaking lock drift. |
| UI-001 | REQ-0700 | PRIM-0052 | UI Contract | AI gateway surface and degraded/provider states | `.product/Worktrees/wt_main/src/App.test.tsx` | AI gateway shows truthful provider availability, policy reasons, and derived-artifact state. |
| FUNC-001 | REQ-0701 | PRIM-0052 | Functionality | governed analysis request and MCP handoff flow | `.product/Worktrees/wt_main/src/App.test.tsx`; `.product/Worktrees/wt_main/src/features/i6/i6.test.ts` | Analysis outputs stay evidence-linked, labeled, and bundle/MCP compatible under live-or-degraded runtime paths. |
| COR-001 | REQ-0702 | PRIM-0053 | Code Correctness | gateway policy, provider adapter, and MCP contracts | `.product/Worktrees/wt_main/src/features/i6/i6.test.ts` | Policy invariants, refusal handling, provider fallback, and tool-surface contracts remain deterministic. |
| RED-001 | REQ-0707 | PRIM-0053 | Red Team / Abuse | path/db/provider abuse controls | `.product/Worktrees/wt_main/src/features/i6/i6.test.ts`; `.product/Worktrees/wt_main/src/App.test.tsx` | Raw path, raw DB, unsupported tool, and denied-policy flows are blocked and audited. |
| EXT-001 | REQ-0708 | PRIM-0052 | Additional | production compile/build | `pnpm build` | Live-provider seam and MCP runtime compile into the governed desktop build without breaking offline-safe degradation. |
| EXT-002 | REQ-0705 | PRIM-0053 | Additional | Tauri command surface and audit persistence boundary | `cargo test --manifest-path src-tauri/Cargo.toml` | Tauri command contracts preserve policy-gated audit behavior and runtime portability constraints. |

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

- [ ] Performance budget checks
- [x] Offline behavior
- [ ] Accessibility/usability checks
- [x] Reliability/recovery checks

## Automation Hook

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I6-002.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I6-002/

## Execution Summary

- Last Run Date: 2026-03-08
- Result: PASS
- Blocking Failures: None.
- Evidence Paths: `.product/build_target/tool_artifacts/wp_runs/WP-I6-002/20260308_012806/`; `.product/build_target/tool_artifacts/wp_runs/WP-I6-002/20260308_012806/runtime_smoke/runtime_smoke_summary.md`; `.product/build_target/tool_artifacts/wp_runs/WP-I6-002/20260308_012806/runtime_smoke/cold/runtime_smoke_report.json`; `.product/build_target/tool_artifacts/wp_runs/WP-I6-002/20260308_012806/runtime_smoke/warm/runtime_smoke_report.json`
- Reviewer: Codex
- User Sign-off: Approved via 2026-03-08 instruction to continue unblocking the current packet either way and validate live-provider behavior.
