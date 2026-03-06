# SX-WP-I8-001 - Spec Extraction Snapshot

Generated On: 2026-03-06
Linked Work Packet: WP-I8-001
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I8-001.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I8-001.ps1
WP Status Snapshot: IMPLEMENTED
Iteration: I8

## Scope

Concrete extraction of requirement and primitive obligations this WP must satisfy before status promotion.

## Requirement Extraction

| Requirement | Level | Section | Description | Target | Status |
|-------------|-------|---------|-------------|--------|--------|
| REQ-0900 | SHOULD | Ãƒâ€šÃ‚Â§13.5 | Trade flow deviation detection vs historical baseline | I8 | IN-PROGRESS |
| REQ-0901 | SHOULD | Ãƒâ€šÃ‚Â§13.5 | Infrastructure status deviation detection | I8 | IN-PROGRESS |
| REQ-0902 | SHOULD | Ãƒâ€šÃ‚Â§13.5 | Regulatory regime change detection for active AOIs | I8 | IN-PROGRESS |
| REQ-0903 | MUST | Ãƒâ€šÃ‚Â§13.5 | Deviation events emitted through standard Event model with context.deviation taxonomy | I8 | IN-PROGRESS |
| REQ-0904 | MUST | Ãƒâ€šÃ‚Â§7.4.7 | constraint_node domains available in Scenario Workspace | I8 | IN-PROGRESS |

## Primitive Extraction

| Primitive | Name | Contract | REQs | First Iter | Status |
|-----------|------|----------|------|------------|--------|
| PRIM-0017 | Context Deviation Event | Standardized context deviation event model | REQ-0900..REQ-0904 | I8 | IMPLEMENTED |

## Traceability Hooks

- REQ-0900: Mapped in TRACEABILITY_MATRIX.md
- REQ-0901: Mapped in TRACEABILITY_MATRIX.md
- REQ-0902: Mapped in TRACEABILITY_MATRIX.md
- REQ-0903: Mapped in TRACEABILITY_MATRIX.md
- REQ-0904: Mapped in TRACEABILITY_MATRIX.md

## Non-Goal / Red-Team Guardrails

- No individual targeting/stalking workflows.
- No covert affiliation inference.
- No social-media scraping ingestion.
- No leaked/hacked/scraped-against-terms data pipelines.
- No financial trading or prediction tooling.

## Verification Hooks

- Run preflight: powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1
- Run WP checks: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I8-001.ps1
- Proof artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I8-001/
