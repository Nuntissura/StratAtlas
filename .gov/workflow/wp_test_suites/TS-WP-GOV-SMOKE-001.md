# TS-WP-GOV-SMOKE-001 - Spec vs Code Test Suite

Date Opened: 2026-03-09
Status: IN-PROGRESS
Linked Work Packet: WP-GOV-SMOKE-001
Iteration: All

## Scope

Validate the first governed manual desktop smoke pass for the real StratAtlas Windows app, including screenshot-backed UX findings, map-first shell evaluation, and maintenance/help clarity checks.

## Inputs

- Linked requirements: REQ-0013, REQ-0035, REQ-0200, REQ-0201, REQ-0212
- Linked primitives: PRIM-0045, PRIM-0068, PRIM-0071, PRIM-0074
- Linked components: .gov/Spec/sub-specs/GOV_manual_desktop_smoke_and_ux_triage.md; .gov/workflow/ROADMAP.md; .gov/workflow/taskboard/TASK_BOARD.md; .gov/workflow/work_packets/WP-GOV-SMOKE-001_manual-desktop-smoke-and-ux-triage.md; .gov/workflow/wp_test_suites/TS-WP-GOV-SMOKE-001.md; .gov/workflow/wp_spec_extractions/SX-WP-GOV-SMOKE-001.md; .gov/workflow/wp_checks/check-WP-GOV-SMOKE-001.ps1; .product/build_target/Releases/Current/Portable/; .product/build_target/Releases/Current/Installers/; .product/Worktrees/wt_main/scripts/windows-installer-maintenance.ps1

## Reality Boundary Assertions

- Packet Class: VERIFICATION
- Real Seam: The real packaged desktop app is launched and visually inspected with screenshot-backed notes instead of relying only on automated runtime smoke.
- Proof Target: Manual smoke artifacts under `.product/build_target/tool_artifacts/manual_smoke/WP-GOV-SMOKE-001/` capture launch proof, screenshots, rubric scores, and prioritized findings.
- Allowed Fallbacks: Accessibility automation may assist navigation or metadata collection, but screenshots and findings must come from the real running desktop window.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0013 | PRIM-0071 | Dependency | governed release binary availability | current portable executable + governance preflight | manual smoke uses the real current governed desktop build and a clean governance baseline |
| UI-001 | REQ-0200, REQ-0201, REQ-0212 | PRIM-0045, PRIM-0068, PRIM-0071 | UI Contract | first-minute shell and map comprehension | screenshot capture + rubric scoring of the running app | required shell regions exist, modes are discoverable, and map controls read as usable to a human observer |
| FUNC-001 | REQ-0013, REQ-0201 | PRIM-0045, PRIM-0071 | Functionality | first-use navigation flow | manual launch and tab/mode walkthrough | the core shell can be navigated far enough to identify blockers, overload points, and dead ends honestly |
| COR-001 | REQ-0035 | PRIM-0074 | Code Correctness | maintenance/help clarity | `windows-installer-maintenance.ps1 -Action menu` + release-kit docs review | install/uninstall/repair functions and changelog surface are understandable in operator language |
| RED-001 | REQ-0013 | PRIM-0068, PRIM-0071 | Red Team / Abuse | false-confidence prevention | findings log review | observed issues are not minimized or overstated; unverified flows remain labeled unverified |
| EXT-001 | REQ-0013 | PRIM-0045, PRIM-0068, PRIM-0071, PRIM-0074 | Additional | screenshot-backed UX triage bundle | manual smoke artifact bundle | evidence set includes screenshots, rubric, findings, severity, ROI, and recommended follow-on packets |

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

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-SMOKE-001.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-GOV-SMOKE-001/

## Execution Summary

- Last Run Date: 2026-03-09
- Result: Baseline and follow-up manual smoke slices completed; packet remains IN-PROGRESS for broader scenario coverage
- Blocking Failures: The critical first-use ambiguity is reduced after `WP-I1-006`, but broader hands-on validation across 3D/export/reopen is still incomplete
- Evidence Paths: `.product/build_target/tool_artifacts/manual_smoke/WP-GOV-SMOKE-001/20260309_202006/stratatlas-initial.png`; `.product/build_target/tool_artifacts/manual_smoke/WP-GOV-SMOKE-001/20260309_202006/stratatlas-workflow-tab.png`; `.product/build_target/tool_artifacts/manual_smoke/WP-GOV-SMOKE-001/20260309_202006/rubric.md`; `.product/build_target/tool_artifacts/manual_smoke/WP-GOV-SMOKE-001/20260309_202006/findings.md`; `.product/build_target/tool_artifacts/manual_smoke/WP-GOV-SMOKE-001/20260309_234318/post-fix-guided-start-window-handle.png`; `.product/build_target/tool_artifacts/manual_smoke/WP-GOV-SMOKE-001/20260309_234318/rubric.md`; `.product/build_target/tool_artifacts/manual_smoke/WP-GOV-SMOKE-001/20260309_234318/findings.md`
- What Became Real: The repo now has screenshot-backed before/after evidence showing that the smoke-driven shell refactor materially improved first-use map primacy and action clarity in the real desktop app
- What Remains Simulated: Deeper hands-on flow coverage is still incomplete; the current packet state is strong for first-use UX triage and follow-up validation, not for full manual acceptance of every mode
- Next Blocking Real Seam: Extend manual desktop coverage from first-use shell validation into deeper scenario-by-scenario hands-on flows before release-candidate work
- Reviewer: Codex
- User Sign-off: Pending user review
