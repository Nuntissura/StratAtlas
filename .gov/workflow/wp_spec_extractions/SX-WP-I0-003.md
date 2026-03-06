# SX-WP-I0-003 - Spec Extraction Snapshot

Generated On: 2026-03-06
Linked Work Packet: WP-I0-003
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I0-003.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I0-003.ps1
WP Status Snapshot: SPEC-MAPPED
Iteration: I0

## Scope

Concrete extraction of requirement and primitive obligations this WP must satisfy before status promotion.

## Requirement Extraction

| Requirement | Level | Section | Description | Target | Status |
|-------------|-------|---------|-------------|--------|--------|
| REQ-0017 | MUST | Ãƒâ€šÃ‚Â§5.1 | Runtime path/process/environment handling MUST remain platform-neutral without hard-coded Windows-only assumptions in core paths | All | E2E-VERIFIED |
| REQ-0018 | SHOULD | Ãƒâ€šÃ‚Â§5.1 | Desktop packaging/runtime SHOULD be smoke-tested on macOS during development to preserve portability | All | IN-PROGRESS |
| REQ-0108 | MUST | Ãƒâ€šÃ‚Â§10.1 | Full offline mode for air-gapped environments | I0 | E2E-VERIFIED |
| REQ-0109 | MUST | Ãƒâ€šÃ‚Â§6.3 | Control plane DB is PostgreSQL with PostGIS | I0 | SPEC-MAPPED |
| REQ-0110 | MUST | Ãƒâ€šÃ‚Â§6.3 | Artifact store: immutable artifacts with append-only supersedes links | I0 | IN-PROGRESS |
| REQ-0111 | MUST | Ãƒâ€šÃ‚Â§5 | Deployment profiles each specify: identity, key management, storage, audit retention, AI access | I0 | SPEC-MAPPED |
| REQ-0810 | MUST | Ãƒâ€šÃ‚Â§6.3 | Context Store supports efficient time-range queries | I7 | SPEC-MAPPED |

## Primitive Extraction

| Primitive | Name | Contract | REQs | First Iter | Status |
|-----------|------|----------|------|------------|--------|
| PRIM-0042 | Control Plane Persistence Adapter | Provide governed, platform-neutral control-plane persistence for bundle metadata, configuration, identity/profile state, and deployment-profile settings | REQ-0017, REQ-0018, REQ-0108, REQ-0109, REQ-0110, REQ-0111, REQ-0810 | I0 | SPEC-MAPPED |
| PRIM-0043 | Governed Artifact Store Backend | Persist immutable artifacts with append-only supersedes links, retained provenance, and auditable bundle linkage | REQ-0017, REQ-0018, REQ-0108, REQ-0109, REQ-0110, REQ-0111, REQ-0810 | I0 | SPEC-MAPPED |
| PRIM-0044 | Context Time-Range Store | Support governed time-range reads and offline-safe caching semantics for contextual series used by query, AI, and deviation workflows | REQ-0017, REQ-0018, REQ-0108, REQ-0109, REQ-0110, REQ-0111, REQ-0810 | I0 | SPEC-MAPPED |

## Traceability Hooks

- REQ-0017: Mapped in TRACEABILITY_MATRIX.md
- REQ-0018: Mapped in TRACEABILITY_MATRIX.md
- REQ-0108: Mapped in TRACEABILITY_MATRIX.md
- REQ-0109: Mapped in TRACEABILITY_MATRIX.md
- REQ-0110: Mapped in TRACEABILITY_MATRIX.md
- REQ-0111: Mapped in TRACEABILITY_MATRIX.md
- REQ-0810: Mapped in TRACEABILITY_MATRIX.md

## Non-Goal / Red-Team Guardrails

- No individual targeting/stalking workflows.
- No covert affiliation inference.
- No social-media scraping ingestion.
- No leaked/hacked/scraped-against-terms data pipelines.
- No financial trading or prediction tooling.

## Verification Hooks

- Run preflight: powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1
- Run WP checks: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I0-003.ps1
- Proof artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I0-003/
