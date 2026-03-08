# SX-WP-I1-001 - Spec Extraction Snapshot

Generated On: 2026-03-08
Linked Work Packet: WP-I1-001
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I1-001.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I1-001.ps1
Packet Class Snapshot: UNSPECIFIED
Workflow Version Snapshot: 2.0
WP Status Snapshot: SUPERSEDED
Iteration: I1

## Scope

Concrete extraction of requirement and primitive obligations this WP must satisfy before status promotion.

## Reality Boundary Snapshot

- Not defined in WP.

## Change Ledger Snapshot

- Not defined in WP.

## Requirement Extraction

| Requirement | Level | Section | Description | Target | Status |
|-------------|-------|---------|-------------|--------|--------|
| REQ-0014 | MUST | Ãƒâ€šÃ‚Â§11.5 | Desktop app startup (cold launch) MUST be <= 8.0 s to interactive shell on reference workstation | All | IN-PROGRESS |
| REQ-0015 | MUST | Ãƒâ€šÃ‚Â§11.5 | Desktop app startup (warm relaunch) MUST be <= 3.0 s to interactive shell on reference workstation | All | IN-PROGRESS |
| REQ-0016 | MUST | Ãƒâ€šÃ‚Â§11.5 | Analyst state-change actions (layer/filter/apply) MUST provide feedback <= 300 ms P95; if exceeded, UI MUST show non-blocking progress | All | IN-PROGRESS |
| REQ-0200 | MUST | Ãƒâ€šÃ‚Â§11.1 | UI stable regions: header, left panel, right panel, bottom panel, main canvas | I1 | E2E-VERIFIED |
| REQ-0201 | MUST | Ãƒâ€šÃ‚Â§11.2 | UI modes: Live/Recent, Replay, Compare, Scenario, Collaboration, Offline | I1 | E2E-VERIFIED |
| REQ-0202 | MUST | Ãƒâ€šÃ‚Â§12.1 | Every layer declares: source, license, cadence, geometry type, sensitivity class, caching policy | I1 | E2E-VERIFIED |
| REQ-0203 | MUST | Ãƒâ€šÃ‚Â§12.1 | System surfaces licensing constraints and prevents violating exports | I1 | E2E-VERIFIED |
| REQ-0204 | MUST | Ãƒâ€šÃ‚Â§12.2 | Plugins MUST NOT run arbitrary code in main process without sandboxing | I1 | E2E-VERIFIED |
| REQ-0205 | MUST | Ãƒâ€šÃ‚Â§12.2 | Plugin network egress controllable | I1 | E2E-VERIFIED |
| REQ-0206 | MUST | Ãƒâ€šÃ‚Â§11.5 | 2D pan/zoom: ÃƒÂ¢Ã¢â‚¬Â°Ã‚Â¤50ms frame time with aggregated rendering | I1 | IN-PROGRESS |
| REQ-0207 | MUST | Ãƒâ€šÃ‚Â§11.5 | Time scrub (warm cache): ÃƒÂ¢Ã¢â‚¬Â°Ã‚Â¤250ms end-to-end | I1 | IN-PROGRESS |
| REQ-0208 | MUST | Ãƒâ€šÃ‚Â§11.5 | Time scrub (cold cache): ÃƒÂ¢Ã¢â‚¬Â°Ã‚Â¤2.0s end-to-end | I1 | IN-PROGRESS |
| REQ-0209 | MUST | Ãƒâ€šÃ‚Â§11.5 | 4K image export: ÃƒÂ¢Ã¢â‚¬Â°Ã‚Â¤3.0s | I1 | IN-PROGRESS |
| REQ-0210 | MUST | Ãƒâ€šÃ‚Â§11.5 | Briefing bundle export: ÃƒÂ¢Ã¢â‚¬Â°Ã‚Â¤15s | I1 | IN-PROGRESS |
| REQ-0211 | MUST | Ãƒâ€šÃ‚Â§11.5 | Graceful degradation via aggregation when budget cannot be met; UI indicates aggregation | I1 | E2E-VERIFIED |
| REQ-0212 | SHOULD | Ãƒâ€šÃ‚Â§11.6 | WCAG/508 accessibility (keyboard, non-color-only semantics) | I1 | IN-PROGRESS |

## Primitive Extraction

| Primitive | Name | Contract | REQs | First Iter | Status |
|-----------|------|----------|------|------------|--------|
| PRIM-0005 | Stable UI Region Contract | Mandatory shell regions and selectors | REQ-0200 | I1 | IMPLEMENTED |
| PRIM-0006 | UI Mode Contract | Required workstation mode definitions | REQ-0201 | I1 | IMPLEMENTED |
| PRIM-0007 | Layer Declaration Contract | Layer metadata schema and export guards | REQ-0202, REQ-0203 | I1 | IMPLEMENTED |
| PRIM-0008 | Plugin Sandbox Policy | Plugin execution and egress policy checks | REQ-0204, REQ-0205 | I1 | IMPLEMENTED |
| PRIM-0009 | Performance Budget Contract | Startup/state-change/interaction budget values | REQ-0014..REQ-0016, REQ-0206..REQ-0211 | I1 | IMPLEMENTED |

## Traceability Hooks

- REQ-0014: Mapped in TRACEABILITY_MATRIX.md
- REQ-0015: Mapped in TRACEABILITY_MATRIX.md
- REQ-0016: Mapped in TRACEABILITY_MATRIX.md
- REQ-0200: Mapped in TRACEABILITY_MATRIX.md
- REQ-0201: Mapped in TRACEABILITY_MATRIX.md
- REQ-0202: Mapped in TRACEABILITY_MATRIX.md
- REQ-0203: Mapped in TRACEABILITY_MATRIX.md
- REQ-0204: Mapped in TRACEABILITY_MATRIX.md
- REQ-0205: Mapped in TRACEABILITY_MATRIX.md
- REQ-0206: Mapped in TRACEABILITY_MATRIX.md
- REQ-0207: Mapped in TRACEABILITY_MATRIX.md
- REQ-0208: Mapped in TRACEABILITY_MATRIX.md
- REQ-0209: Mapped in TRACEABILITY_MATRIX.md
- REQ-0210: Mapped in TRACEABILITY_MATRIX.md
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
- Run WP checks: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-001.ps1
- Proof artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I1-001/
