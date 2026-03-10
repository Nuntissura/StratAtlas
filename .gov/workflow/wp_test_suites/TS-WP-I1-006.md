# TS-WP-I1-006 - Spec vs Code Test Suite

Date Opened: 2026-03-09
Status: E2E-VERIFIED
Linked Work Packet: WP-I1-006
Iteration: I1

## Scope

Validate that the first-use shell becomes calmer and map-led without breaking the verified workbench regions, accessibility semantics, or routes into the existing runtime workflows.

## Inputs

- Linked requirements: REQ-0011, REQ-0012, REQ-0013, REQ-0200, REQ-0201, REQ-0211, REQ-0212
- Linked primitives: PRIM-0045, PRIM-0068, PRIM-0071
- Linked components: .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/App.css; .product/Worktrees/wt_main/src/App.test.tsx

## Reality Boundary Assertions

- Packet Class: IMPLEMENTATION
- Real Seam: The default shell exposes a guided-start state with reduced pane pressure and stronger map primacy while still routing into the existing verified workflows.
- Proof Target: App-level shell tests, runtime smoke continuity, and governance proof artifacts show that the first-use state, disclosure controls, and guided actions are real.
- Allowed Fallbacks: Existing advanced workflow forms remain behind current tabs as long as first-use copy and controls route to them truthfully and advanced density is no longer the default experience.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0200 | PRIM-0071 | Dependency | governed shell surface | `pnpm build` | shell changes compile and preserve stable-region contract |
| UI-001 | REQ-0200, REQ-0201 | PRIM-0071 | UI Contract | guided start and pane disclosure | `.product/Worktrees/wt_main/src/App.test.tsx` | required regions remain present while first-use disclosure state renders correctly |
| FUNC-001 | REQ-0211 | PRIM-0045 | Functionality | map-linked quick actions | `.product/Worktrees/wt_main/src/App.test.tsx` | start actions route to real tabs/workflows without hiding the map runtime |
| COR-001 | REQ-0011, REQ-0012 | PRIM-0045 | Code Correctness | label and shell regression | `.product/Worktrees/wt_main/src/App.test.tsx` | artifact labels and uncertainty language remain intact after shell changes |
| RED-001 | REQ-0013 | PRIM-0071 | Red Team / Abuse | misleading onboarding risk | `.gov/workflow/work_packets/WP-I1-006_first-use-map-hero-and-guided-start-state.md` review | guided-start copy does not imply nonexistent features or fake completion |
| EXT-001 | REQ-0212 | PRIM-0068 | Additional | accessibility/usability | `.product/Worktrees/wt_main/src/App.test.tsx`; manual smoke follow-on | disclosure and start-state controls remain keyboard reachable with explicit state cues |

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

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-006.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I1-006/20260310_003729/

## Execution Summary

- Last Run Date: 2026-03-09
- Result: Packet-grade verification passed and the packet is now `E2E-VERIFIED`
- Blocking Failures: None for this packet after the second manual smoke confirmed the map-first start state on the rebuilt local Tauri desktop app
- Evidence Paths: `pnpm exec vitest run src/App.test.tsx`; `pnpm lint`; `pnpm build`; `.product/build_target/tool_artifacts/manual_smoke/WP-GOV-SMOKE-001/20260309_234318/post-fix-guided-start-window-handle.png`; `.product/build_target/tool_artifacts/manual_smoke/WP-GOV-SMOKE-001/20260309_234318/rubric.md`; `.product/build_target/tool_artifacts/manual_smoke/WP-GOV-SMOKE-001/20260309_234318/findings.md`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-006/20260310_003729/`
- What Became Real: The shell now has a tested guided-start state, compact first-use workspace view, collapsed support panes, one recommended next action, a visible step ladder, calmer guided status, explicit map-led quick actions, and a responsive layout fix that keeps the map above the fold in the validated first-use window
- What Remains Simulated: No new analytical workflows were added by design; broader manual scenario coverage across 3D/export/reopen remains with `WP-GOV-SMOKE-001`
- Next Blocking Real Seam: Continue broader manual desktop scenario coverage before release-candidate work
- Reviewer:
- User Sign-off:
