# SX-WP-GOV-VERIFY-001 - Spec Extraction Snapshot

Generated On: 2026-03-08
Linked Work Packet: WP-GOV-VERIFY-001
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-GOV-VERIFY-001.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-GOV-VERIFY-001.ps1
Packet Class Snapshot: UNSPECIFIED
Workflow Version Snapshot: 3.0
WP Status Snapshot: E2E-VERIFIED
Iteration: All

## Scope

Concrete extraction of requirement and primitive obligations this WP must satisfy before status promotion.

## Reality Boundary Snapshot

- Not defined in WP.

## Change Ledger Snapshot

- Not defined in WP.

## Requirement Extraction

| Requirement | Level | Section | Description | Target | Status |
|-------------|-------|---------|-------------|--------|--------|
| REQ-0013 | MUST | Ãƒâ€šÃ‚Â§17 | No capability is "implemented" until it satisfies the slice definition of done | All | E2E-VERIFIED |
| REQ-0014 | MUST | Ãƒâ€šÃ‚Â§11.5 | Desktop app startup (cold launch) MUST be <= 8.0 s to interactive shell on reference workstation | All | IN-PROGRESS |
| REQ-0015 | MUST | Ãƒâ€šÃ‚Â§11.5 | Desktop app startup (warm relaunch) MUST be <= 3.0 s to interactive shell on reference workstation | All | IN-PROGRESS |
| REQ-0016 | MUST | Ãƒâ€šÃ‚Â§11.5 | Analyst state-change actions (layer/filter/apply) MUST provide feedback <= 300 ms P95; if exceeded, UI MUST show non-blocking progress | All | IN-PROGRESS |
| REQ-0018 | SHOULD | Ãƒâ€šÃ‚Â§5.1 | Desktop packaging/runtime SHOULD be smoke-tested on macOS during development to preserve portability | All | IN-PROGRESS |
| REQ-0019 | MUST | Ãƒâ€šÃ‚Â§17 | Every WP MUST maintain linked test suite, spec extraction, and WP check script artifacts | All | E2E-VERIFIED |
| REQ-0020 | MUST | Ãƒâ€šÃ‚Â§17 | WP status claims MUST include proof artifact paths and command evidence | All | E2E-VERIFIED |
| REQ-0021 | MUST | Ãƒâ€šÃ‚Â§18 | Governance preflight MUST enforce WP template compliance to prevent shortcut execution | All | E2E-VERIFIED |
| REQ-0022 | SHOULD | Ãƒâ€šÃ‚Â§17 | Teams SHOULD run WP loop automation (`run_wp_loop.ps1`) before status-promotion sweeps | All | E2E-VERIFIED |

## Primitive Extraction

| Primitive | Name | Contract | REQs | First Iter | Status |
|-----------|------|----------|------|------------|--------|
| PRIM-0060 | Runtime Smoke Harness | Execute governed desktop runtime smoke flows across startup, shell readiness, map/layer interactions, and degraded-state handling with artifact capture | REQ-0013, REQ-0014, REQ-0015, REQ-0016, REQ-0018, REQ-0019, REQ-0020, REQ-0021, REQ-0022 | All | E2E-VERIFIED |
| PRIM-0061 | Verification Evidence Matrix | Bind each closure claim to command evidence, desktop-smoke artifacts, and portability/performance proof before status promotion | REQ-0013, REQ-0014, REQ-0015, REQ-0016, REQ-0018, REQ-0019, REQ-0020, REQ-0021, REQ-0022 | All | E2E-VERIFIED |

## Traceability Hooks

- REQ-0013: Mapped in TRACEABILITY_MATRIX.md
- REQ-0014: Mapped in TRACEABILITY_MATRIX.md
- REQ-0015: Mapped in TRACEABILITY_MATRIX.md
- REQ-0016: Mapped in TRACEABILITY_MATRIX.md
- REQ-0018: Mapped in TRACEABILITY_MATRIX.md
- REQ-0019: Mapped in TRACEABILITY_MATRIX.md
- REQ-0020: Mapped in TRACEABILITY_MATRIX.md
- REQ-0021: Mapped in TRACEABILITY_MATRIX.md
- REQ-0022: Mapped in TRACEABILITY_MATRIX.md

## Non-Goal / Red-Team Guardrails

- No individual targeting/stalking workflows.
- No covert affiliation inference.
- No social-media scraping ingestion.
- No leaked/hacked/scraped-against-terms data pipelines.
- No financial trading or prediction tooling.

## Verification Hooks

- Run preflight: powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1
- Run WP checks: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-VERIFY-001.ps1
- Proof artifacts: .product/build_target/tool_artifacts/wp_runs/WP-GOV-VERIFY-001/
