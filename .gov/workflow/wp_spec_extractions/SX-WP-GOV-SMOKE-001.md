# SX-WP-GOV-SMOKE-001 - Spec Extraction Snapshot

Generated On: 2026-03-11
Linked Work Packet: WP-GOV-SMOKE-001
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-GOV-SMOKE-001.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-GOV-SMOKE-001.ps1
Packet Class Snapshot: VERIFICATION
Workflow Version Snapshot: 4.0
WP Status Snapshot: IN-PROGRESS
Iteration: All

## Scope

Concrete extraction of requirement and primitive obligations this WP must satisfy before status promotion.

## Reality Boundary Snapshot

- Real Seam: The real packaged desktop app is launched and inspected by hand, with screenshot-backed findings covering first impression, map primacy, task grouping, mode discoverability, and maintenance/help clarity instead of relying only on automated smoke or jsdom assumptions.
- User-Visible Win: The next refactor queue is grounded in what a real user actually sees and struggles with in the first minutes of use, not in internal assumptions about the shell.
- Proof Target: A manual smoke evidence bundle records launch proof, screenshot captures, rubric-scored observations, and a prioritized issue/ROI list under `.product/build_target/tool_artifacts/manual_smoke/WP-GOV-SMOKE-001/`.
- Allowed Temporary Fallbacks: UI automation may assist navigation and screenshot capture, but findings must remain tied to the real desktop window and explicitly note where flows were not manually completed end to end.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## Change Ledger Snapshot

- What Became Real: The repo now has governed screenshot-backed manual smoke evidence for the baseline portable shell, the rebuilt guided-start shell, and the current governed portable shell after the full `WP-I1-008` through `WP-I1-013` map-family rollout, plus automation-assisted confirmation of real 3D switching, bundle create/reopen, 4K export, and planning/solver interaction on the packaged app.
- What Remains Simulated: The remaining gap is no longer basic functional doubt about those flows; it is final qualitative user review and ship/no-ship judgment for the resulting UX. No additional raw jsdom-only inference is being used for the validated flows in this slice.
- Next Blocking Real Seam: User review of the broadened manual smoke evidence, then either a narrow UX follow-on packet or release-candidate governance.

## Requirement Extraction

| Requirement | Level | Section | Description | Target | Status |
|-------------|-------|---------|-------------|--------|--------|
| REQ-0013 | MUST | Section 17 | No capability is "implemented" until it satisfies the slice definition of done | All | E2E-VERIFIED |
| REQ-0035 | MUST | Section 5.2 | Maintenance pathway MUST provide a menu/help surface that explains install/uninstall/full-uninstall/repair/full-repair/update/downgrade functions and shows the current changelog | All | E2E-VERIFIED |
| REQ-0200 | MUST | Section 11.1 | UI stable regions: header, left panel, right panel, bottom panel, main canvas | I1 | E2E-VERIFIED |
| REQ-0201 | MUST | Section 11.2 | UI modes: Live/Recent, Replay, Compare, Scenario, Collaboration, Offline | I1 | E2E-VERIFIED |
| REQ-0212 | SHOULD | Section 11.6 | WCAG/508 accessibility (keyboard, non-color-only semantics) | I1 | E2E-VERIFIED |

## Primitive Extraction

| Primitive | Name | Contract | REQs | First Iter | Status |
|-----------|------|----------|------|------------|--------|
| PRIM-0045 | Dual Surface Geospatial Runtime | Deliver governed 2D and 3D canvas surfaces with mode-aware layer orchestration, labeling contracts, and stable shell integration | REQ-0011, REQ-0012, REQ-0014, REQ-0015, REQ-0016, REQ-0200, REQ-0201, REQ-0202, REQ-0203, REQ-0206, REQ-0207, REQ-0208, REQ-0209, REQ-0210, REQ-0211, REQ-0212 | I1 | E2E-VERIFIED |
| PRIM-0068 | Accessible Map Interaction Contract | Preserve keyboard-reachable controls and non-color-only semantics across the governed map surface and its connected overlays | GATE-E, REQ-0014, REQ-0015, REQ-0016, REQ-0206, REQ-0207, REQ-0208, REQ-0209, REQ-0210, REQ-0212 | I1 | E2E-VERIFIED |
| PRIM-0071 | Map-First Workbench Shell | Organize the verified StratAtlas regions into a calmer desktop workbench with task-grouped tabs, contextual panes, and bottom-tray disclosure while preserving map primacy and accessibility | REQ-0011, REQ-0012, REQ-0200, REQ-0201, REQ-0211, REQ-0212 | I1 | E2E-VERIFIED |
| PRIM-0074 | Maintenance Menu Surface | Provide a human-readable maintenance menu/help surface covering install, uninstall, full-uninstall, repair, full-repair, update, downgrade, and data-handling semantics | REQ-0023, REQ-0024, REQ-0025, REQ-0026, REQ-0027, REQ-0028, REQ-0035, REQ-0036 | All | E2E-VERIFIED |

## Traceability Hooks

- REQ-0013: Mapped in TRACEABILITY_MATRIX.md
- REQ-0035: Mapped in TRACEABILITY_MATRIX.md
- REQ-0200: Mapped in TRACEABILITY_MATRIX.md
- REQ-0201: Mapped in TRACEABILITY_MATRIX.md
- REQ-0212: Mapped in TRACEABILITY_MATRIX.md

## Non-Goal / Red-Team Guardrails

- No individual targeting/stalking workflows.
- No covert affiliation inference.
- No social-media scraping ingestion.
- No leaked/hacked/scraped-against-terms data pipelines.
- No financial trading or prediction tooling.

## Verification Hooks

- Run preflight: powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1
- Run WP checks: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-SMOKE-001.ps1
- Proof artifacts: .product/build_target/tool_artifacts/wp_runs/WP-GOV-SMOKE-001/
