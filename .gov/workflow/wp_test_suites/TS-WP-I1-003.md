# TS-WP-I1-003 - Spec vs Code Test Suite

Date Opened: 2026-03-06
Status: E2E-VERIFIED
Linked Work Packet: WP-I1-003
Iteration: I1

## Scope

Validate that `WP-I1-003` replaces the faux main canvas with a real governed 2D/3D runtime, routes existing product features into meaningful map behavior, and proves the required interaction and export budgets.

## Inputs

- Linked requirements: REQ-0011, REQ-0012, REQ-0014, REQ-0015, REQ-0016, REQ-0200, REQ-0201, REQ-0202, REQ-0203, REQ-0206, REQ-0207, REQ-0208, REQ-0209, REQ-0210, REQ-0211, REQ-0212
- Linked primitives: PRIM-0045, PRIM-0046, PRIM-0047
- Linked components: `.product/Worktrees/wt_main/src/App.tsx`, `.product/Worktrees/wt_main/src/App.css`, `.product/Worktrees/wt_main/src/features/i1/`, `.product/Worktrees/wt_main/src/contracts/`, `.product/Worktrees/wt_main/src/lib/runtimeSmoke.ts`, `.product/Worktrees/wt_main/src-tauri/src/lib.rs`

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0202 | PRIM-0045 | Dependency | runtime dependency graph | `pnpm install --frozen-lockfile` and runtime mount checks | map dependencies resolve and mount under Tauri and Vitest |
| UI-001 | REQ-0200 | PRIM-0045 | UI Contract | required UI contract | `src/App.test.tsx`, map-runtime UI tests, desktop smoke | real map or globe mounts in `region-main-canvas`; required regions and labels remain present |
| FUNC-001 | REQ-0201 | PRIM-0046 | Functionality | mode-aware map flows | I1 runtime tests plus desktop smoke | replay, compare, query, context, scenario, collaboration, AI, and modeling flows visibly affect the map |
| COR-001 | REQ-0203 | PRIM-0046 | Code Correctness | layer governance | layer/runtime adapter tests, export guard tests | licensing, artifact labels, and export visibility rules survive the real renderer |
| RED-001 | REQ-0011 | PRIM-0046 | Red Team / Abuse | misuse and labeling guardrails | static guardrail checks plus targeted runtime assertions | non-goals remain blocked and AI/modeled/context labels remain distinct |
| EXT-001 | REQ-0206 | PRIM-0047 | Additional | performance and recovery | runtime smoke, perf instrumentation, export timing checks | interaction budgets or explicit degradation indicators are proven |

## Dependency and Environment Tests

- [ ] Runtime dependency install/lock integrity
- [ ] Platform portability constraints checked
- [ ] MapLibre, Cesium, and overlay adapters mount in the supported desktop shell

## UI Contract Tests

- [ ] Required regions
- [ ] Required modes/states
- [ ] Real map or globe surface present in `region-main-canvas`
- [ ] Error and degraded-state UX
- [ ] Visible legend, provenance, and artifact-label state on the map surface

## Functional Flow Tests

- [ ] Replay updates the visible map
- [ ] Compare mode uses split or otherwise directly comparative map behavior
- [ ] Query results render as runtime layers
- [ ] Context domains influence the map or map-linked inspect state
- [ ] Collaboration, scenario, AI, and modeling flows connect to map state
- [ ] Export/import or persistence flow

## Code Correctness Tests

- [ ] Unit tests
- [ ] Integration tests
- [ ] Static checks (lint/type/schema)
- [ ] Layer/runtime adapter contract tests

## Red-Team and Abuse Tests

- [ ] Non-goal enforcement (spec section 3.2)
- [ ] Policy bypass attempts
- [ ] Invalid input and path abuse cases
- [ ] Label confusion cases (Observed vs Context vs Modeled vs AI) on the map

## Additional Tests

- [ ] Performance budget checks
- [ ] Offline behavior
- [ ] Accessibility/usability checks
- [ ] Reliability/recovery checks
- [ ] Desktop runtime smoke for 2D and 3D mount paths

## Automation Hook

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-003.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I1-003/

## Execution Summary

- Last Run Date: 2026-03-07
- Result: Passed `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-003.ps1`
- Blocking Failures: None
- Evidence Paths: `.product/build_target/tool_artifacts/wp_runs/WP-I1-003/20260307_045256/`, `.product/build_target/tool_artifacts/wp_runs/WP-I1-003/20260307_045256/runtime_smoke/`, `.product/build_target/tool_artifacts/wp_runs/WP-I1-003/20260307_045256/runtime_smoke/cold/runtime_smoke_summary.md`, `.product/build_target/tool_artifacts/wp_runs/WP-I1-003/20260307_045256/runtime_smoke/warm/runtime_smoke_summary.md`
- Reviewer: Codex
- User Sign-off: Approved via 2026-03-07 instruction to perform the outstanding `WP-I1-003` closeout tasks.
