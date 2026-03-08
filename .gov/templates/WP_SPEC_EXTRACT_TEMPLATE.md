# SX-<WP-ID> - Spec Extraction Snapshot

Generated On: YYYY-MM-DD
Linked Work Packet: WP-...
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-....md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-....ps1
Packet Class Snapshot: IMPLEMENTATION
Workflow Version Snapshot: 4.0

## Scope

Concise extraction of the authoritative spec/index/matrix obligations this WP must satisfy.

## Reality Boundary Snapshot

- Real Seam:
- User-Visible Win:
- Proof Target:
- Allowed Temporary Fallbacks:

## Change Ledger Snapshot

- What Became Real:
- What Remains Simulated:
- Next Blocking Real Seam:

## Requirement Extraction

| Requirement | Level | Section | Description | Target | Status |
|-------------|-------|---------|-------------|--------|--------|
| REQ-.... | MUST/SHOULD/MAY | §... | ... | I... | SPEC-MAPPED |

## Primitive Extraction

| Primitive | Name | Contract | REQs | First Iter | Status |
|-----------|------|----------|------|------------|--------|
| PRIM-.... | ... | ... | REQ-.... | I... | SPEC-MAPPED |

## Traceability Hooks

- Requirement -> component/test mappings are sourced from `.gov/Spec/TRACEABILITY_MATRIX.md`.
- WP status changes must keep task board and requirements index synchronized.

## Non-Goal / Red-Team Guardrails

- No individual targeting/stalking workflows.
- No covert affiliation inference.
- No social-media scraping ingestion.
- No leaked/hacked/scraped-against-terms data pipeline.
- No financial trading/prediction tooling.

## Verification Hooks

- Run: `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-<WP-ID>.ps1`
- Artifacts: `.product/build_target/tool_artifacts/wp_runs/<WP-ID>/`
