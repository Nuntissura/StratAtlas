# SX-WP-GOV-INSTALLER-002 - Spec Extraction Snapshot

Generated On: 2026-03-06
Linked Work Packet: WP-GOV-INSTALLER-002
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-GOV-INSTALLER-002.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-GOV-INSTALLER-002.ps1
WP Status Snapshot: SPEC-MAPPED
Iteration: All

## Scope

Concrete extraction of requirement and primitive obligations this WP must satisfy before status promotion.

## Requirement Extraction

| Requirement | Level | Section | Description | Target | Status |
|-------------|-------|---------|-------------|--------|--------|
| REQ-0017 | MUST | Ãƒâ€šÃ‚Â§5.1 | Runtime path/process/environment handling MUST remain platform-neutral without hard-coded Windows-only assumptions in core paths | All | IN-PROGRESS |
| REQ-0029 | SHOULD | Ãƒâ€šÃ‚Â§5.2 | Release kit SHOULD include a maintenance script and lifecycle documentation next to installer artifacts | All | E2E-VERIFIED |
| REQ-0030 | MUST | Ãƒâ€šÃ‚Â§5.2 | Installer build version MUST increase monotonically for rebuilt release artifacts from changed code | All | E2E-VERIFIED |
| REQ-0031 | MUST | Ãƒâ€šÃ‚Â§5.2 | EXE and installer artifacts from the same build MUST use the same version | All | E2E-VERIFIED |

## Primitive Extraction

| Primitive | Name | Contract | REQs | First Iter | Status |
|-----------|------|----------|------|------------|--------|
| PRIM-0024 | Installer Bundle Policy | Bundle configuration enforces MSI and NSIS targets, upgrade code, and downgrade-capable lifecycle constraints | REQ-0023, REQ-0024, REQ-0028, REQ-0031 | All | E2E-VERIFIED |
| PRIM-0028 | Installer Kit Manifest Pipeline | Build script stages installers + lifecycle docs and generates checksum manifest for repeatable release kits | REQ-0023, REQ-0029, REQ-0030, REQ-0031 | All | E2E-VERIFIED |

## Traceability Hooks

- REQ-0017: Mapped in TRACEABILITY_MATRIX.md
- REQ-0029: Mapped in TRACEABILITY_MATRIX.md
- REQ-0030: Mapped in TRACEABILITY_MATRIX.md
- REQ-0031: Mapped in TRACEABILITY_MATRIX.md

## Non-Goal / Red-Team Guardrails

- No individual targeting/stalking workflows.
- No covert affiliation inference.
- No social-media scraping ingestion.
- No leaked/hacked/scraped-against-terms data pipelines.
- No financial trading or prediction tooling.

## Verification Hooks

- Run preflight: powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1
- Run WP checks: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-INSTALLER-002.ps1
- Proof artifacts: .product/build_target/tool_artifacts/wp_runs/WP-GOV-INSTALLER-002/
