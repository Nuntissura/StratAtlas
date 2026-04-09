# SX-WP-I1-015 - Spec Extraction Snapshot

Generated On: 2026-04-09
Linked Work Packet: WP-I1-015
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I1-015.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I1-015.ps1
Packet Class Snapshot: IMPLEMENTATION
Workflow Version Snapshot: 4.0
WP Status Snapshot: IN-PROGRESS
Iteration: I1

## Scope

Concrete extraction of requirement and primitive obligations this WP must satisfy before status promotion.

## Reality Boundary Snapshot

- Real Seam: The full workbench defaults to a lighter-weight map summary, surfaces the layer-family dock above the jargon-heavy session controls, and hides support-only scene detail behind explicit disclosure controls instead of showing every telemetry and support card by default.
- User-Visible Win: Analysts reach the real map families and the live geography faster, while the shell still allows deeper detail on demand.
- Proof Target: Packet checks prove family ordering and disclosure, compact summary defaults, accessible reveal controls, and the preserved stable-region contract; live bridge proof should capture the calmer full-workbench shell if the desktop runtime is available.
- Allowed Temporary Fallbacks: Role, marking, mode, and note controls remain in the left rail, but they may move lower in the hierarchy and need not stay always visually dominant. This packet does not promise floating overlays, detachable panes, or a new layout system.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to `E2E-VERIFIED`.

## Change Ledger Snapshot

- What Became Real: Governance now fixes the first declutter seam as a data-family-first left rail plus an on-demand main-canvas detail stack instead of the previous placeholder "glass overlay" rewrite.
- What Remains Simulated: No new map data, new workflows, or floating-overlay shell system are promised by this packet.
- Next Blocking Real Seam: Implement the left-rail and summary-deck disclosure changes in the live workbench, then capture packet-grade proof and bridge snapshots.

## Requirement Extraction

| Requirement | Level | Section | Description | Target | Status |
|-------------|-------|---------|-------------|--------|--------|
| REQ-0011 | MUST | Section 11.4 | Every layer/chart/annotation/export labeled as Observed Evidence, Curated Context, Modeled Output, or AI-Derived Interpretation | All | E2E-VERIFIED |
| REQ-0012 | MUST | Section 11.4 | Modeled outputs MUST include uncertainty representation and MUST NOT be presented as observed | All | E2E-VERIFIED |
| REQ-0200 | MUST | Section 11.1 | UI stable regions: header, left panel, right panel, bottom panel, main canvas | I1 | E2E-VERIFIED |
| REQ-0212 | SHOULD | Section 11.6 | WCAG/508 accessibility (keyboard, non-color-only semantics) | I1 | E2E-VERIFIED |

## Primitive Extraction

| Primitive | Name | Contract | REQs | First Iter | Status |
|-----------|------|----------|------|------------|--------|
| PRIM-0045 | Dual Surface Geospatial Runtime | Deliver governed 2D and 3D canvas surfaces with mode-aware layer orchestration, labeling contracts, and stable shell integration | REQ-0011, REQ-0012, REQ-0014, REQ-0015, REQ-0016, REQ-0200, REQ-0201, REQ-0202, REQ-0203, REQ-0206, REQ-0207, REQ-0208, REQ-0209, REQ-0210, REQ-0211, REQ-0212 | I1 | E2E-VERIFIED |
| PRIM-0068 | Accessible Map Interaction Contract | Preserve keyboard-reachable controls and non-color-only semantics across the governed map surface and its connected overlays | GATE-E, REQ-0014, REQ-0015, REQ-0016, REQ-0206, REQ-0207, REQ-0208, REQ-0209, REQ-0210, REQ-0212 | I1 | E2E-VERIFIED |
| PRIM-0071 | Map-First Workbench Shell | Organize the verified StratAtlas regions into a calmer desktop workbench with task-grouped tabs, contextual panes, and bottom-tray disclosure while preserving map primacy and accessibility | REQ-0011, REQ-0012, REQ-0200, REQ-0201, REQ-0211, REQ-0212 | I1 | E2E-VERIFIED |

## Traceability Hooks

- REQ-0011: Mapped in TRACEABILITY_MATRIX.md
- REQ-0012: Mapped in TRACEABILITY_MATRIX.md
- REQ-0200: Mapped in TRACEABILITY_MATRIX.md
- REQ-0212: Mapped in TRACEABILITY_MATRIX.md

## Non-Goal / Red-Team Guardrails

- No individual targeting/stalking workflows.
- No covert affiliation inference.
- No social-media scraping ingestion.
- No leaked/hacked/scraped-against-terms data pipelines.
- No financial trading or prediction tooling.

## Verification Hooks

- Run preflight: powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1
- Run WP checks: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-015.ps1
- Proof artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I1-015/
