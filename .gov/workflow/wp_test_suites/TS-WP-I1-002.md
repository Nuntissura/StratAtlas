# TS-WP-I1-002 - Spec vs Code Test Suite

Date Opened: 2026-03-06
Status: E2E-VERIFIED
Linked Work Packet: WP-I1-002
Iteration: I1

## Scope

Validate WP delivery against linked requirements and primitives.

## Inputs

- Linked requirements: REQ-0011, REQ-0012, REQ-0014..REQ-0016, REQ-0200..REQ-0212, REQ-0804, REQ-0805
- Linked primitives: PRIM-0035, PRIM-0036, PRIM-0037
- Linked components: .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/App.css; .product/Worktrees/wt_main/src/features/i1/layers.ts; .product/Worktrees/wt_main/src/features/i1/performance.ts; .product/Worktrees/wt_main/src/features/i1/i1.test.ts

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0200 | PRIM-0035 | Dependency | workspace shell runtime | `pnpm install --frozen-lockfile` in `.product/Worktrees/wt_main` | dependencies resolve without lock drift |
| UI-001 | REQ-0011, REQ-0200, REQ-0201, REQ-0804, REQ-0805 | PRIM-0035, PRIM-0036, PRIM-0037 | UI Contract | layer/catalog/label shell | `pnpm exec vitest run src/App.test.tsx` | required regions, labels, layer metadata, and degraded-state indicators render correctly |
| FUNC-001 | REQ-0202..REQ-0212 | PRIM-0035, PRIM-0037 | Functionality | I1 shell flows | `pnpm exec vitest run src/features/i1/i1.test.ts src/App.test.tsx` | layer registry, policies, and state-change feedback flows pass |
| COR-001 | REQ-0011, REQ-0012, REQ-0202..REQ-0205 | PRIM-0036, PRIM-0037 | Code Correctness | I1 contracts | full WP runner plus lint | label, uncertainty, export-policy, and budget contracts remain enforced |
| RED-001 | REQ-0204, REQ-0205 | PRIM-0037 | Red Team / Abuse | policy bypass and misleading labeling | `.gov/repo_scripts/red_team_guardrail_check.ps1` via WP runner | unsafe or mislabeled surfaces do not regress |
| EXT-001 | REQ-0014..REQ-0016, REQ-0206..REQ-0211 | PRIM-0037 | Additional | build and responsiveness evidence | `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-002.ps1` | build/tests pass and proof artifacts capture the run |

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

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-002.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I1-002/

## Execution Summary

- Last Run Date: 2026-03-06
- Result: PASS
- Blocking Failures: none
- Evidence Paths: .product/build_target/tool_artifacts/wp_runs/WP-I1-002/20260306_044051/result.json; summary.md
- Reviewer: Codex
- User Sign-off: Approved via 2026-03-06 autonomous completion instruction
