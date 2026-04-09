# SX-WP-I1-014 - Spec Extraction Snapshot

Generated On: 2026-04-09
Linked Work Packet: WP-I1-014
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I1-014.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I1-014.ps1
Packet Class Snapshot: IMPLEMENTATION
Workflow Version Snapshot: 4.0
WP Status Snapshot: IN-PROGRESS
Iteration: I1

## Scope

Concrete extraction of requirement and primitive obligations this WP must satisfy before status promotion.

## Reality Boundary Snapshot

- Real Seam: The 2D MapLibre runtime exposes a selectable OpenFreeMap vector-style picker, preserves the selected style through recorder and bundle restore, and continues to degrade to the existing schematic fallback when online styles are unavailable.
- User-Visible Win: Analysts can switch the 2D map between multiple recognizable vector basemap styles instead of being locked to a single appearance.
- Proof Target: Packet checks prove selector rendering, saved-state restore, and truthful fallback behavior; live runtime verification should capture at least one snapshot of the selector over the real map if the desktop bridge is available.
- Allowed Temporary Fallbacks: This packet only commits to the official OpenFreeMap vector styles `positron`, `bright`, and `liberty`. Satellite imagery, dark/night styles, and terrain-specific styling remain future scope.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to `E2E-VERIFIED`.

## Change Ledger Snapshot

- What Became Real: This packet is intended to make the 2D basemap itself operator-selectable and persistent instead of hard-coded to a single live style.
- What Remains Simulated: Satellite imagery, terrain-specific styling, and dark/night variants remain outside this packet and must not be implied by the selector.
- Next Blocking Real Seam: Implement the selector and restore path in the 2D MapLibre runtime, then verify the live desktop shell visually through the debugger/bridge if available.

## Requirement Extraction

| Requirement | Level | Section | Description | Target | Status |
|-------------|-------|---------|-------------|--------|--------|
| REQ-0200 | MUST | Section 11.1 | UI stable regions: header, left panel, right panel, bottom panel, main canvas | I1 | E2E-VERIFIED |
| REQ-0201 | MUST | Section 11.2 | UI modes: Live/Recent, Replay, Compare, Scenario, Collaboration, Offline | I1 | E2E-VERIFIED |
| REQ-0211 | MUST | Section 11.5 | Graceful degradation via aggregation when budget cannot be met; UI indicates aggregation | I1 | E2E-VERIFIED |

## Primitive Extraction

| Primitive | Name | Contract | REQs | First Iter | Status |
|-----------|------|----------|------|------------|--------|
| PRIM-0045 | Dual Surface Geospatial Runtime | Deliver governed 2D and 3D canvas surfaces with mode-aware layer orchestration, labeling contracts, and stable shell integration | REQ-0011, REQ-0012, REQ-0014, REQ-0015, REQ-0016, REQ-0200, REQ-0201, REQ-0202, REQ-0203, REQ-0206, REQ-0207, REQ-0208, REQ-0209, REQ-0210, REQ-0211, REQ-0212 | I1 | E2E-VERIFIED |
| PRIM-0071 | Map-First Workbench Shell | Organize the verified StratAtlas regions into a calmer desktop workbench with task-grouped tabs, contextual panes, and bottom-tray disclosure while preserving map primacy and accessibility | REQ-0011, REQ-0012, REQ-0200, REQ-0201, REQ-0211, REQ-0212 | I1 | E2E-VERIFIED |

## Traceability Hooks

- REQ-0200: Mapped in TRACEABILITY_MATRIX.md
- REQ-0201: Mapped in TRACEABILITY_MATRIX.md
- REQ-0211: Mapped in TRACEABILITY_MATRIX.md

## Non-Goal / Red-Team Guardrails

- No individual targeting/stalking workflows.
- No covert affiliation inference.
- No social-media scraping ingestion.
- No leaked/hacked/scraped-against-terms data pipelines.
- No financial trading or prediction tooling.

## Verification Hooks

- Run preflight: powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1
- Run WP checks: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-014.ps1
- Proof artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I1-014/
