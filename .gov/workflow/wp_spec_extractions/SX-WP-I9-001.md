# SX-WP-I9-001 - Spec Extraction Snapshot

Generated On: 2026-03-06
Linked Work Packet: WP-I9-001
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I9-001.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I9-001.ps1
WP Status Snapshot: IN-PROGRESS
Iteration: I9

## Scope

Concrete extraction of requirement and primitive obligations this WP must satisfy before status promotion.

## Requirement Extraction

| Requirement | Level | Section | Description | Target | Status |
|-------------|-------|---------|-------------|--------|--------|
| REQ-1000 | MUST | Ãƒâ€šÃ‚Â§7.4.4 | OSINT feeds from approved curated aggregators only | I9 | IN-PROGRESS |
| REQ-1001 | MUST | Ãƒâ€šÃ‚Â§7.4.6 | OSINT events carry verification level (confirmed/reported/alleged); alleged visually distinct | I9 | IN-PROGRESS |
| REQ-1002 | MUST | Ãƒâ€šÃ‚Â§13.4 | Alerts aggregate/statistical, scoped to AOIs, never entity-pursuit | I9 | IN-PROGRESS |
| REQ-1003 | MAY | Ãƒâ€šÃ‚Â§13.4 | Alerts reference context domain thresholds | I9 | IN-PROGRESS |

## Primitive Extraction

| Primitive | Name | Contract | REQs | First Iter | Status |
|-----------|------|----------|------|------------|--------|
| PRIM-0018 | Curated OSINT Event Contract | Curated-source and verification-level enforcement | REQ-1000..REQ-1003 | I9 | IMPLEMENTED |

## Traceability Hooks

- REQ-1000: Mapped in TRACEABILITY_MATRIX.md
- REQ-1001: Mapped in TRACEABILITY_MATRIX.md
- REQ-1002: Mapped in TRACEABILITY_MATRIX.md
- REQ-1003: Mapped in TRACEABILITY_MATRIX.md

## Non-Goal / Red-Team Guardrails

- No individual targeting/stalking workflows.
- No covert affiliation inference.
- No social-media scraping ingestion.
- No leaked/hacked/scraped-against-terms data pipelines.
- No financial trading or prediction tooling.

## Verification Hooks

- Run preflight: powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1
- Run WP checks: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I9-001.ps1
- Proof artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I9-001/
