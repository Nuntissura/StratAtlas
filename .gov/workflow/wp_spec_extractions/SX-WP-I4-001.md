# SX-WP-I4-001 - Spec Extraction Snapshot

Generated On: 2026-03-06
Linked Work Packet: WP-I4-001
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I4-001.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I4-001.ps1
WP Status Snapshot: E2E-VERIFIED
Iteration: I4

## Scope

Concrete extraction of requirement and primitive obligations this WP must satisfy before status promotion.

## Requirement Extraction

| Requirement | Level | Section | Description | Target | Status |
|-------------|-------|---------|-------------|--------|--------|
| REQ-0500 | MUST | ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â§14 | Scenario forks linked to parent snapshots | I4 | E2E-VERIFIED |
| REQ-0501 | MUST | ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â§14 | Constraint manipulation in scenario forks | I4 | E2E-VERIFIED |
| REQ-0502 | MUST | ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â§14 | Hypothetical entities in scenario forks | I4 | E2E-VERIFIED |
| REQ-0503 | MUST | ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â§14 | Scenario comparison and export | I4 | E2E-VERIFIED |
| REQ-0504 | MUST | ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â§11.3 | Golden flow: Fork ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ Modify Constraints ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ Compare ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ Export Scenario Bundle | I4 | E2E-VERIFIED |

## Primitive Extraction

| Primitive | Name | Contract | REQs | First Iter | Status |
|-----------|------|----------|------|------------|--------|
| PRIM-0013 | Scenario Fork Contract | Parent-linked scenario constraints/entities | REQ-0500..REQ-0504 | I4 | E2E-VERIFIED |

## Traceability Hooks

- REQ-0500: Mapped in TRACEABILITY_MATRIX.md
- REQ-0501: Mapped in TRACEABILITY_MATRIX.md
- REQ-0502: Mapped in TRACEABILITY_MATRIX.md
- REQ-0503: Mapped in TRACEABILITY_MATRIX.md
- REQ-0504: Mapped in TRACEABILITY_MATRIX.md

## Non-Goal / Red-Team Guardrails

- No individual targeting/stalking workflows.
- No covert affiliation inference.
- No social-media scraping ingestion.
- No leaked/hacked/scraped-against-terms data pipelines.
- No financial trading or prediction tooling.

## Verification Hooks

- Run preflight: powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1
- Run WP checks: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I4-001.ps1
- Proof artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I4-001/
