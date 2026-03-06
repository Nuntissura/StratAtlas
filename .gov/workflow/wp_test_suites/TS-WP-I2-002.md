# TS-WP-I2-002 - Spec vs Code Test Suite

Date Opened: 2026-03-06
Status: E2E-VERIFIED
Linked Work Packet: WP-I2-002
Iteration: I2

## Scope

Validate WP delivery against linked requirements and primitives.

## Inputs

- Linked requirements: REQ-0300, REQ-0301, REQ-0302
- Linked primitives: PRIM-0038, PRIM-0039, PRIM-0040
- Linked components: .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/App.css; .product/Worktrees/wt_main/src/features/i2/baselineDelta.ts; .product/Worktrees/wt_main/src/features/i2/i2.test.ts

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0300 | PRIM-0038 | Dependency | compare workflow runtime | `pnpm install --frozen-lockfile` in `.product/Worktrees/wt_main` | dependencies resolve without lock drift |
| UI-001 | REQ-0300, REQ-0301, REQ-0302 | PRIM-0038, PRIM-0039, PRIM-0040 | UI Contract | compare dashboard and briefing surface | `pnpm exec vitest run src/App.test.tsx` | compare windows, context overlays, and briefing artifact UI render correctly |
| FUNC-001 | REQ-0300, REQ-0302 | PRIM-0038, PRIM-0040 | Functionality | delta + briefing golden flow | `pnpm exec vitest run src/features/i2/i2.test.ts src/App.test.tsx` | deterministic delta and briefing artifact flow passes |
| COR-001 | REQ-0300..REQ-0302 | PRIM-0038, PRIM-0039, PRIM-0040 | Code Correctness | I2 contracts | full WP runner plus lint | compare-window, overlay, and export payload contracts remain enforced |
| RED-001 | REQ-0301, REQ-0302 | PRIM-0039, PRIM-0040 | Red Team / Abuse | misleading overlays and briefing misuse | `.gov/repo_scripts/red_team_guardrail_check.ps1` via WP runner | context/briefing surfaces remain within non-goal and labeling constraints |
| EXT-001 | REQ-0300..REQ-0302 | PRIM-0038, PRIM-0039, PRIM-0040 | Additional | build and resilience evidence | `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I2-002.ps1` | build/tests pass and proof artifacts capture the run |

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

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I2-002.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I2-002/

## Execution Summary

- Last Run Date: 2026-03-06
- Result: PASSING
- Blocking Failures: none
- Evidence Paths: `.product/build_target/tool_artifacts/wp_runs/WP-I2-002/20260306_050212/result.json`; `.product/build_target/tool_artifacts/wp_runs/WP-I2-002/20260306_050212/summary.md`
- Reviewer: Codex
- User Sign-off: APPROVED via 2026-03-06 autonomous completion instruction.
