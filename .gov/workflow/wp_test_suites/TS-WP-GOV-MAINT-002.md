# TS-WP-GOV-MAINT-002 - Spec vs Code Test Suite

Date Opened: 2026-03-06
Status: E2E-VERIFIED
Linked Work Packet: WP-GOV-MAINT-002
Iteration: All

## Scope

Validate that governance ledgers and status claims match the existing verified packet evidence for cross-cutting, I0, and I1 scope.

## Inputs

- Linked requirements: REQ-0001..REQ-0017, REQ-0019..REQ-0022, REQ-0100..REQ-0112, REQ-0200..REQ-0212
- Linked primitives: PRIM-0029, PRIM-0030, PRIM-0031, PRIM-0032, PRIM-0033, PRIM-0034, PRIM-0035, PRIM-0036, PRIM-0037, PRIM-0041
- Linked components: .gov/Spec/REQUIREMENTS_INDEX.md; .gov/Spec/TRACEABILITY_MATRIX.md; .gov/Spec/PRIMITIVES_INDEX.md; .gov/Spec/PRIMITIVES_MATRIX.md; .gov/workflow/ROADMAP.md; .gov/workflow/taskboard/TASK_BOARD.md; .gov/Spec/TECH_STACK.md; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/features/i1/i1.test.ts; .product/Worktrees/wt_main/src/lib/backend.test.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0019, REQ-0021 | PRIM-0029, PRIM-0031 | Dependency | governance automation and repo readiness | `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1` | preflight passes with the closeout packet set active |
| UI-001 | REQ-0011, REQ-0012, REQ-0200..REQ-0212 | PRIM-0035, PRIM-0036, PRIM-0037 | UI Contract | I1 shell and labeling proof anchors | `pnpm exec vitest run src/App.test.tsx src/features/i1/i1.test.ts` | existing I1 UI proof still passes while governance ledgers are updated |
| FUNC-001 | REQ-0008..REQ-0010, REQ-0100..REQ-0112 | PRIM-0032, PRIM-0033, PRIM-0034 | Functionality | I0 bundle/audit/reopen flows | `pnpm exec vitest run src/App.test.tsx src/lib/backend.test.ts` | existing I0 bundle, audit, and reopen flows still pass and justify status reconciliation |
| COR-001 | REQ-0017, REQ-0100 | PRIM-0029, PRIM-0032 | Code Correctness | native role/path/runtime invariants | `cargo test` in `.product/Worktrees/wt_main/src-tauri` | role validation, path-safety helpers, and Rust-side contract checks pass |
| RED-001 | REQ-0001..REQ-0007 | PRIM-0029 | Red Team / Abuse | non-goal and raw-path/raw-query guardrails | `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/red_team_guardrail_check.ps1` plus `pnpm exec vitest run src/features/i6/i6.test.ts src/features/i9/i9.test.ts src/features/i10/i10.test.ts` | prohibited pursuit/scraping/trading behavior remains blocked and audited |
| EXT-001 | REQ-0014..REQ-0016, REQ-0020, REQ-0022 | PRIM-0037, PRIM-0041 | Additional | build/readiness and closeout evidence | `pnpm lint`; `pnpm test`; `pnpm build`; `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/enforce_wp_template_compliance.ps1` | build and governance-compliance evidence support truthful status promotion |

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

## Automation Hook

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-MAINT-002.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-GOV-MAINT-002/

## Execution Summary

- Last Run Date: 2026-03-06
- Result: PASS; promoted to E2E-VERIFIED
- Blocking Failures: None
- Evidence Paths: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-MAINT-002/20260306_110842/`; `.gov/workflow/wp_spec_extractions/SX-WP-GOV-MAINT-002.md`
- Reviewer: Codex
- User Sign-off: Approved via 2026-03-06 autonomous completion instruction
