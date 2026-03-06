# SX-WP-I3-001 - Spec Extraction Snapshot

Generated On: 2026-03-06
Linked Work Packet: WP-I3-001
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I3-001.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I3-001.ps1
WP Status Snapshot: E2E-VERIFIED
Iteration: I3

## Scope

Concrete extraction of requirement and primitive obligations this WP must satisfy before status promotion.

## Requirement Extraction

| Requirement | Level | Section | Description | Target | Status |
|-------------|-------|---------|-------------|--------|--------|
| REQ-0400 | MUST | Ãƒâ€šÃ‚Â§10.2 | Analyst-authored artifacts use merge-safe semantics (CRDT or equivalent) | I3 | E2E-VERIFIED |
| REQ-0401 | MAY | Ãƒâ€šÃ‚Â§10.2 | Last-write-wins only for ephemeral view state | I3 | E2E-VERIFIED |
| REQ-0402 | MUST | Ãƒâ€šÃ‚Â§10.2 | Session replay derived from event log; attribution mandatory | I3 | E2E-VERIFIED |
| REQ-0403 | MUST | Ãƒâ€šÃ‚Â§10.3 | On reconnection: conflict highlighting, reconcile actions, full history with attribution | I3 | E2E-VERIFIED |

## Primitive Extraction

| Primitive | Name | Contract | REQs | First Iter | Status |
|-----------|------|----------|------|------------|--------|
| PRIM-0012 | Collaboration Session Event | Actor-attributed merge-safe session events | REQ-0400..REQ-0403 | I3 | E2E-VERIFIED |

## Traceability Hooks

- REQ-0400: Mapped in TRACEABILITY_MATRIX.md
- REQ-0401: Mapped in TRACEABILITY_MATRIX.md
- REQ-0402: Mapped in TRACEABILITY_MATRIX.md
- REQ-0403: Mapped in TRACEABILITY_MATRIX.md

## Non-Goal / Red-Team Guardrails

- No individual targeting/stalking workflows.
- No covert affiliation inference.
- No social-media scraping ingestion.
- No leaked/hacked/scraped-against-terms data pipelines.
- No financial trading or prediction tooling.

## Verification Hooks

- Run preflight: powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1
- Run WP checks: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I3-001.ps1
- Proof artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I3-001/
