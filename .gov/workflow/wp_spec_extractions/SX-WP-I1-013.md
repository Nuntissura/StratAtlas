# SX-WP-I1-013 - Spec Extraction Snapshot

Generated On: 2026-03-10
Linked Work Packet: WP-I1-013
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I1-013.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I1-013.ps1
Packet Class Snapshot: IMPLEMENTATION
Workflow Version Snapshot: 4.0
WP Status Snapshot: SPEC-MAPPED
Iteration: I1

## Scope

Concrete extraction of requirement and primitive obligations this WP must satisfy before status promotion.

## Reality Boundary Snapshot

- Real Seam: Refineries, water treatment, ore processing, and similar specialized industrial sites render as governed static layers with explicit coverage and quality labels.
- User-Visible Win: The map gains higher-value industrial/resource context without pretending the source coverage is cleaner than it is.
- Proof Target: Packet checks prove composite-source labels, family toggles, offline-safe packaging where allowed, and explicit incomplete-coverage communication.
- Allowed Temporary Fallbacks: Composite curated layers with regional gaps are acceptable if the uncertainty and coverage limits are directly shown.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to `E2E-VERIFIED`.

## Change Ledger Snapshot

- What Became Real: The queue now has a dedicated owner for the messy composite-source industrial/water layer family instead of mixing it into cleaner facility packets.
- What Remains Simulated: The product does not yet render these specialized site layers.
- Next Blocking Real Seam: Complete the family dock, then define the composite-source QA and coverage contract strongly enough to implement the family.

## Requirement Extraction

| Requirement | Level | Section | Description | Target | Status |
|-------------|-------|---------|-------------|--------|--------|
| REQ-0013 | MUST | Section 17 | No capability is "implemented" until it satisfies the slice definition of done | All | E2E-VERIFIED |
| REQ-0108 | MUST | Section 10.1 | Full offline mode for air-gapped environments | I0 | E2E-VERIFIED |
| REQ-0200 | MUST | Section 11.1 | UI stable regions: header, left panel, right panel, bottom panel, main canvas | I1 | E2E-VERIFIED |
| REQ-0201 | MUST | Section 11.2 | UI modes: Live/Recent, Replay, Compare, Scenario, Collaboration, Offline | I1 | E2E-VERIFIED |
| REQ-0202 | MUST | Section 12.1 | Every layer declares: source, license, cadence, geometry type, sensitivity class, caching policy | I1 | E2E-VERIFIED |
| REQ-0203 | MUST | Section 12.1 | System surfaces licensing constraints and prevents violating exports | I1 | E2E-VERIFIED |
| REQ-0211 | MUST | Section 11.5 | Graceful degradation via aggregation when budget cannot be met; UI indicates aggregation | I1 | E2E-VERIFIED |
| REQ-0212 | SHOULD | Section 11.6 | WCAG/508 accessibility (keyboard, non-color-only semantics) | I1 | E2E-VERIFIED |

## Primitive Extraction

| Primitive | Name | Contract | REQs | First Iter | Status |
|-----------|------|----------|------|------------|--------|
| PRIM-0045 | Dual Surface Geospatial Runtime | Deliver governed 2D and 3D canvas surfaces with mode-aware layer orchestration, labeling contracts, and stable shell integration | REQ-0011, REQ-0012, REQ-0014, REQ-0015, REQ-0016, REQ-0200, REQ-0201, REQ-0202, REQ-0203, REQ-0206, REQ-0207, REQ-0208, REQ-0209, REQ-0210, REQ-0211, REQ-0212 | I1 | E2E-VERIFIED |
| PRIM-0046 | GPU Overlay Composition | Compose governed raster, vector, and analytic overlays within performance budgets while preserving labeling and licensing constraints | REQ-0011, REQ-0012, REQ-0014, REQ-0015, REQ-0016, REQ-0200, REQ-0201, REQ-0202, REQ-0203, REQ-0206, REQ-0207, REQ-0208, REQ-0209, REQ-0210, REQ-0211, REQ-0212 | I1 | E2E-VERIFIED |
| PRIM-0071 | Map-First Workbench Shell | Organize the verified StratAtlas regions into a calmer desktop workbench with task-grouped tabs, contextual panes, and bottom-tray disclosure while preserving map primacy and accessibility | REQ-0011, REQ-0012, REQ-0200, REQ-0201, REQ-0211, REQ-0212 | I1 | E2E-VERIFIED |

## Traceability Hooks

- REQ-0013: Mapped in TRACEABILITY_MATRIX.md
- REQ-0108: Mapped in TRACEABILITY_MATRIX.md
- REQ-0200: Mapped in TRACEABILITY_MATRIX.md
- REQ-0201: Mapped in TRACEABILITY_MATRIX.md
- REQ-0202: Mapped in TRACEABILITY_MATRIX.md
- REQ-0203: Mapped in TRACEABILITY_MATRIX.md
- REQ-0211: Mapped in TRACEABILITY_MATRIX.md
- REQ-0212: Mapped in TRACEABILITY_MATRIX.md

## Non-Goal / Red-Team Guardrails

- No individual targeting/stalking workflows.
- No covert affiliation inference.
- No social-media scraping ingestion.
- No leaked/hacked/scraped-against-terms data pipelines.
- No financial trading or prediction tooling.

## Verification Hooks

- Run preflight: powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1
- Run WP checks: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-013.ps1
- Proof artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I1-013/
