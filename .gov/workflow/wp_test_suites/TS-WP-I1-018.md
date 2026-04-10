# TS-WP-I1-018 - Spec vs Code Test Suite

Date Opened: 2026-04-09
Status: IMPLEMENTED
Linked Work Packet: WP-I1-018
Iteration: I1

## Scope

Validate that the assistant and scenario surfaces become easier to use by default while preserving the already-real AI, MCP, scenario compare, and scenario export workflows.

## Inputs

- Linked requirements: REQ-0013, REQ-0500, REQ-0700
- Linked primitives: PRIM-0071
- Linked components: `.product/Worktrees/wt_main/src/App.tsx`; `.product/Worktrees/wt_main/src/App.css`; `.product/Worktrees/wt_main/src/App.test.tsx`

## Reality Boundary Assertions

- Packet Class: IMPLEMENTATION
- Real Seam: the live shell exposes simplified assistant and scenario workflow cards with explicit advanced disclosures while preserving the verified underlying AI and scenario actions.
- Proof Target: assistant/scenario UI regressions pass, production build passes, packet checks pass, and live bridge snapshots capture the simplified default surfaces.
- Allowed Fallbacks: browser/jsdom remains a non-desktop proof environment; disclosure state may stay ephemeral if the workflow state itself remains deterministic.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to `E2E-VERIFIED`.

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0013 | PRIM-0071 | Dependency | governed frontend build path | `pnpm build`; `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-018.ps1` | shell simplification compiles and the packet loop remains synchronized |
| UI-001 | REQ-0013 | PRIM-0071 | UI Contract | simplified assistant and scenario defaults | `pnpm exec vitest run src/App.test.tsx --reporter=verbose` | advanced AI/scenario controls are hidden by default and revealed only through explicit disclosure |
| FUNC-001 | REQ-0500, REQ-0700 | PRIM-0071 | Functionality | retained AI + scenario workflows | `pnpm exec vitest run src/App.test.tsx --reporter=verbose` | AI analysis, MCP execution, scenario fork, compare, and export still pass through the simplified shell |
| COR-001 | REQ-0013 | PRIM-0071 | Code Correctness | disclosure and layout contracts | `pnpm exec vitest run src/App.test.tsx --reporter=verbose`; `pnpm build` | the simplified composition stays regression-covered and type-safe |
| RED-001 | REQ-0013, REQ-0700 | PRIM-0071 | Red Team / Abuse | truthfulness and policy copy | targeted UI assertions in `src/App.test.tsx` | the shell does not hide policy/degraded/unconfigured states or relabel modeled inputs as evidence |
| EXT-001 | REQ-0013 | PRIM-0071 | Additional | live desktop proof | bridge navigate/snapshot proof under `.product/build_target/tool_artifacts/wp_runs/WP-I1-018/` | the running desktop app shows the simplified assistant and scenario surfaces as shipped |

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
- [ ] Offline behavior
- [ ] Accessibility/usability checks
- [ ] Reliability/recovery checks

## Automation Hook

- Command: `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-018.ps1`
- Artifacts: `.product/build_target/tool_artifacts/wp_runs/WP-I1-018/`

## Execution Summary

- Last Run Date: 2026-04-10
- Result: PASS
- Blocking Failures: None
- Evidence Paths: `.product/build_target/tool_artifacts/wp_runs/WP-I1-018/20260410_004711/summary.md`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-018/20260410_004711/visual_proof/assistant_default_live.png`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-018/20260410_004711/visual_proof/scenario_workflow_live.png`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-018/20260410_004711/visual_proof_summary.md`
- What Became Real: the live shell now exposes workflow-first assistant and scenario cards with default-hidden advanced controls, and the bridge can enter scenario workflow state directly for runtime proof.
- What Remains Simulated: browser/jsdom remains a non-desktop proof environment relative to the live Tauri shell.
- Next Blocking Real Seam: no further implementation seam remains inside this packet; user sign-off is the remaining gate before any `E2E-VERIFIED` promotion.
- Reviewer: Codex
- User Sign-off: Pending
