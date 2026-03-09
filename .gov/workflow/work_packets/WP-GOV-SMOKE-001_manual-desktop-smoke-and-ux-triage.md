# WP-GOV-SMOKE-001 - Manual Desktop Smoke and UX Triage

Date Opened: 2026-03-09
Status: IN-PROGRESS
Iteration: All
Workflow Version: 4.0
Packet Class: VERIFICATION
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-GOV-SMOKE-001.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-GOV-SMOKE-001.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-GOV-SMOKE-001.ps1

## Intent

Run the first governed manual desktop smoke test against the real StratAtlas Windows app, capture screenshot-backed UX findings, and create a truthful refactor/ROI triage before any broader redesign or release-candidate work continues.

## Linked Requirements

- REQ-0013
- REQ-0035
- REQ-0200
- REQ-0201
- REQ-0212

## Linked Primitives

- PRIM-0045 | Dual Surface Geospatial Runtime | manual smoke must verify whether the real 2D/3D map surfaces read as the center of the product rather than a hidden implementation detail
- PRIM-0068 | Accessible Map Interaction Contract | manual smoke must verify whether the live shell still exposes controls and states in a way a human can actually discover and understand
- PRIM-0071 | Map-First Workbench Shell | this packet exists to validate whether the calmer workbench shell is genuinely usable, comprehensible, and map-first in real desktop use
- PRIM-0074 | Maintenance Menu Surface | manual smoke must verify whether the release-facing help/menu surface explains installer lifecycle behavior in plain language

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## Reality Boundary

- Real Seam: The real packaged desktop app is launched and inspected by hand, with screenshot-backed findings covering first impression, map primacy, task grouping, mode discoverability, and maintenance/help clarity instead of relying only on automated smoke or jsdom assumptions.
- User-Visible Win: The next refactor queue is grounded in what a real user actually sees and struggles with in the first minutes of use, not in internal assumptions about the shell.
- Proof Target: A manual smoke evidence bundle records launch proof, screenshot captures, rubric-scored observations, and a prioritized issue/ROI list under `.product/build_target/tool_artifacts/manual_smoke/WP-GOV-SMOKE-001/`.
- Allowed Temporary Fallbacks: UI automation may assist navigation and screenshot capture, but findings must remain tied to the real desktop window and explicitly note where flows were not manually completed end to end.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## In Scope

- Launch the current governed desktop build and inspect the live shell, map surface, panel organization, and workflow entry points by hand.
- Capture screenshot-backed findings plus a scoring rubric for first-minute comprehension, cognitive load, map prominence, workflow grouping, action clarity, feedback, accessibility discoverability, and maintenance/help clarity.
- Produce a prioritized refactor backlog with severity and ROI notes grounded in the manual pass.

## Out of Scope

- Large implementation refactors during the same packet.
- New speculative feature work not justified by manual smoke findings.

## Expected Files Touched

- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/Spec/sub-specs/GOV_manual_desktop_smoke_and_ux_triage.md
- .gov/workflow/ROADMAP.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-GOV-SMOKE-001_manual-desktop-smoke-and-ux-triage.md
- .gov/workflow/wp_test_suites/TS-WP-GOV-SMOKE-001.md
- .gov/workflow/wp_spec_extractions/SX-WP-GOV-SMOKE-001.md
- .gov/workflow/wp_checks/check-WP-GOV-SMOKE-001.ps1
- .product/build_target/tool_artifacts/manual_smoke/WP-GOV-SMOKE-001/

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0071 | Workbench shell triage | Real Windows desktop app + screenshot capture + rubric scoring | The shell can be judged as an actual first-use experience instead of an abstract code artifact. |
| PRIM-0045 | 2D/3D map primacy check | Tauri desktop runtime + visual inspection + accessibility tree inspection | The map surface can be assessed as the product centerpiece or identified as under-expressed. |
| PRIM-0068 | Discoverability/accessibility check | Windows accessibility automation + screenshot capture + manual notes | Hidden controls, poor affordances, and non-obvious state cues can be documented concretely. |
| PRIM-0074 | Maintenance/help clarity check | PowerShell maintenance menu + current release kit docs | Installer lifecycle wording and user-data explanations can be validated from a real operator point of view. |

## Spec-Test Coverage Plan

### Dependency and Environment Tests
- [ ] Dependency graph/lock integrity tests
- [ ] Runtime compatibility checks

### UI Contract Tests
- [ ] Required regions/modes/states
- [ ] Error/degraded-state UX

### Functional Flow Tests
- [ ] Golden flow and edge cases
- [ ] Persistence/replay/export flows

### Code Correctness Tests
- [ ] Unit tests
- [ ] Integration tests
- [ ] Static analysis (lint/type/schema)

### Red-Team and Abuse Tests
- [ ] Non-goal enforcement (spec section 3.2)
- [ ] Policy bypass scenarios
- [ ] Adversarial/invalid input cases

### Additional Tests
- [ ] Performance budgets
- [ ] Offline behavior
- [ ] Reliability/recovery

## Fallback Register

- Explicit simulated/mock/sample paths: None intended for the primary shell inspection; if a flow cannot be completed manually, the packet must mark that path as unverified rather than infer correctness from automated coverage.
- Required labels in code/UI/governance: Findings must distinguish observed UX issues, inferred root-cause hypotheses, and recommended follow-up refactors.
- Successor packet or debt owner: Follow-on implementation/refactor packets to be created from the manual findings if significant UX or value gaps are confirmed.
- Exit condition to remove fallback: The packet closes only after the evidence bundle contains real screenshots, rubric scores, and prioritized findings captured from the running desktop app.

## Change Ledger

- What Became Real: The repo now has a governed packet for manual desktop validation, so first-use UX quality can be assessed with evidence instead of being inferred from automated proof alone.
- What Remains Simulated: The app value proposition itself may still be weak or confusing; this packet exists to measure and document that honestly rather than assume usefulness.
- Next Blocking Real Seam: Launch the real desktop app, complete the first-pass manual smoke, and record screenshots plus severity-ranked findings.

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-SMOKE-001.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-GOV-SMOKE-001/
- Claim Standard: do not claim completion without linked command output and artifact paths.

## Exit Criteria

- Task board and requirements index statuses are synchronized.
- Traceability, primitives index, and primitives matrix are synchronized.
- Linked test suite has executed results and evidence paths.
- Evidence bundle is attached.
- Reality Boundary, Fallback Register, and Change Ledger are truthful.
- User Sign-off: APPROVED.

## Evidence

- Test Suite Execution: First manual smoke slice completed against the current governed portable build; packet remains open for broader hands-on follow-through.
- Logs: `.product/build_target/tool_artifacts/manual_smoke/WP-GOV-SMOKE-001/20260309_202006/maintenance-menu.txt`; `.product/build_target/tool_artifacts/manual_smoke/WP-GOV-SMOKE-001/20260309_202006/rubric.md`; `.product/build_target/tool_artifacts/manual_smoke/WP-GOV-SMOKE-001/20260309_202006/findings.md`
- Screenshots/Exports: `.product/build_target/tool_artifacts/manual_smoke/WP-GOV-SMOKE-001/20260309_202006/stratatlas-initial.png`; `.product/build_target/tool_artifacts/manual_smoke/WP-GOV-SMOKE-001/20260309_202006/stratatlas-workflow-tab.png`
- Build Artifacts: `.product/build_target/Releases/Current/Portable/StratAtlas_0.1.11_portable_x64.exe`
- Proof Artifact: .product/build_target/tool_artifacts/manual_smoke/WP-GOV-SMOKE-001/
- User Sign-off: Pending user review

## Progress Log

- 2026-03-09: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
- 2026-03-09: Packet scope redefined around real manual desktop smoke, screenshot-backed UX triage, and refactor prioritization before further large changes.
- 2026-03-09: First manual smoke slice executed against `StratAtlas_0.1.11_portable_x64.exe`; captured initial shell and workflow-state screenshots plus rubric/findings under `.product/build_target/tool_artifacts/manual_smoke/WP-GOV-SMOKE-001/20260309_202006/`. Early result: the shell remains visually overwhelming, map primacy is weak in first-use perception, and the maintenance/help surface is materially clearer than the in-app workflow shell.
