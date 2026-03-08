# SX-WP-I2-003 - Spec Extraction Snapshot

Generated On: 2026-03-08
Linked Work Packet: WP-I2-003
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I2-003.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I2-003.ps1
Packet Class Snapshot: UNSPECIFIED
Workflow Version Snapshot: 3.0
WP Status Snapshot: E2E-VERIFIED
Iteration: I2

## Scope

Concrete extraction of requirement and primitive obligations this WP must satisfy before status promotion.

## Reality Boundary Snapshot

- Not defined in WP.

## Change Ledger Snapshot

- Not defined in WP.

## Requirement Extraction

| Requirement | Level | Section | Description | Target | Status |
|-------------|-------|---------|-------------|--------|--------|
| REQ-0209 | MUST | Ãƒâ€šÃ‚Â§11.5 | 4K image export: ÃƒÂ¢Ã¢â‚¬Â°Ã‚Â¤3.0s | I1 | IN-PROGRESS |
| REQ-0210 | MUST | Ãƒâ€šÃ‚Â§11.5 | Briefing bundle export: ÃƒÂ¢Ã¢â‚¬Â°Ã‚Â¤15s | I1 | IN-PROGRESS |
| REQ-0300 | MUST | Ãƒâ€šÃ‚Â§13.1 | Baseline vs event delta analysis: at minimum density delta grids | I2 | E2E-VERIFIED |
| REQ-0301 | SHOULD | Ãƒâ€šÃ‚Â§13.1 | Comparative dashboard with context domain time-series overlay | I2 | E2E-VERIFIED |
| REQ-0302 | MUST | Ãƒâ€šÃ‚Â§11.3 | Golden flow: Baseline ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ Delta ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ Snapshot Bundle ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ Briefing Export | I2 | E2E-VERIFIED |

## Primitive Extraction

| Primitive | Name | Contract | REQs | First Iter | Status |
|-----------|------|----------|------|------------|--------|
| PRIM-0048 | Comparative Analytics Engine | Compute governed baseline-versus-delta comparisons over runtime layers and contextual series with reproducible derivation metadata | REQ-0209, REQ-0210, REQ-0300, REQ-0301, REQ-0302 | I2 | E2E-VERIFIED |
| PRIM-0049 | Briefing Export Renderer | Render governed briefing artifacts and 4K exports from runtime state with bundle linkage, labels, and deterministic export metadata | REQ-0209, REQ-0210, REQ-0300, REQ-0301, REQ-0302 | I2 | E2E-VERIFIED |

## Traceability Hooks

- REQ-0209: Mapped in TRACEABILITY_MATRIX.md
- REQ-0210: Mapped in TRACEABILITY_MATRIX.md
- REQ-0300: Mapped in TRACEABILITY_MATRIX.md
- REQ-0301: Mapped in TRACEABILITY_MATRIX.md
- REQ-0302: Mapped in TRACEABILITY_MATRIX.md

## Non-Goal / Red-Team Guardrails

- No individual targeting/stalking workflows.
- No covert affiliation inference.
- No social-media scraping ingestion.
- No leaked/hacked/scraped-against-terms data pipelines.
- No financial trading or prediction tooling.

## Verification Hooks

- Run preflight: powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1
- Run WP checks: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I2-003.ps1
- Proof artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I2-003/
