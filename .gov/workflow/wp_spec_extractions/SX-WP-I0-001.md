# SX-WP-I0-001 - Spec Extraction Snapshot

Generated On: 2026-03-06
Linked Work Packet: WP-I0-001
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I0-001.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I0-001.ps1
WP Status Snapshot: IMPLEMENTED
Iteration: I0

## Scope

Concrete extraction of requirement and primitive obligations this WP must satisfy before status promotion.

## Requirement Extraction

| Requirement | Level | Section | Description | Target | Status |
|-------------|-------|---------|-------------|--------|--------|
| REQ-0017 | MUST | Ãƒâ€šÃ‚Â§5.1 | Runtime path/process/environment handling MUST remain platform-neutral without hard-coded Windows-only assumptions in core paths | All | IN-PROGRESS |
| REQ-0018 | SHOULD | Ãƒâ€šÃ‚Â§5.1 | Desktop packaging/runtime SHOULD be smoke-tested on macOS during development to preserve portability | All | IN-PROGRESS |
| REQ-0100 | MUST | Ãƒâ€šÃ‚Â§4.1 | RBAC: Viewer, Analyst, Administrator, Auditor roles | I0 | IN-PROGRESS |
| REQ-0101 | MUST | Ãƒâ€šÃ‚Â§9.2 | Snapshot bundle contains: data slice, derived analytics, UI state, evidence manifest, integrity hashes, confidence metadata | I0 | IN-PROGRESS |
| REQ-0102 | MUST | Ãƒâ€šÃ‚Â§9.2 | Bundle asset registry: each file/object has stable asset_id + sha256 hash | I0 | IN-PROGRESS |
| REQ-0103 | MUST | Ãƒâ€šÃ‚Â§9.2 | External interfaces reference bundle contents by (bundle_id, asset_id, sha256), not filesystem paths | I0 | IN-PROGRESS |
| REQ-0104 | MUST | Ãƒâ€šÃ‚Â§9.2 | Bundles immutable once created; corrections append-only via supersedes | I0 | IN-PROGRESS |
| REQ-0105 | MUST | Ãƒâ€šÃ‚Â§9.3 | Reopening a bundle restores view state and derived artifacts deterministically | I0 | IN-PROGRESS |
| REQ-0106 | MUST | Ãƒâ€šÃ‚Â§8.1 | Audit trail: immutable, append-only | I0 | IN-PROGRESS |
| REQ-0107 | SHOULD | Ãƒâ€šÃ‚Â§8.2 | Audit logs tamper-evident (hash chaining), exportable for compliance | I0 | IN-PROGRESS |
| REQ-0108 | MUST | Ãƒâ€šÃ‚Â§10.1 | Full offline mode for air-gapped environments | I0 | IN-PROGRESS |
| REQ-0109 | MUST | Ãƒâ€šÃ‚Â§6.3 | Control plane DB is PostgreSQL with PostGIS | I0 | IN-PROGRESS |
| REQ-0110 | MUST | Ãƒâ€šÃ‚Â§6.3 | Artifact store: immutable artifacts with append-only supersedes links | I0 | IN-PROGRESS |
| REQ-0111 | MUST | Ãƒâ€šÃ‚Â§5 | Deployment profiles each specify: identity, key management, storage, audit retention, AI access | I0 | IN-PROGRESS |
| REQ-0112 | MUST | Ãƒâ€šÃ‚Â§11.5 | Bundle open (local): ÃƒÂ¢Ã¢â‚¬Â°Ã‚Â¤5.0s to interactive | I0 | IN-PROGRESS |

## Primitive Extraction

| Primitive | Name | Contract | REQs | First Iter | Status |
|-----------|------|----------|------|------------|--------|
| PRIM-0001 | Bundle Manifest Contract | Immutable bundle manifest with hash-addressed assets | REQ-0101..REQ-0105 | I0 | IMPLEMENTED |
| PRIM-0002 | Audit Event Hash Chain | Append-only hash-chained audit events | REQ-0010, REQ-0106, REQ-0107 | I0 | IMPLEMENTED |
| PRIM-0003 | Sensitivity Marking Model | Sensitivity propagation across artifacts | REQ-0008, REQ-0011 | I0 | IMPLEMENTED |
| PRIM-0004 | Provenance Reference Model | Source/license/time/lineage references | REQ-0009 | I0 | IMPLEMENTED |

## Traceability Hooks

- REQ-0017: Mapped in TRACEABILITY_MATRIX.md
- REQ-0018: Mapped in TRACEABILITY_MATRIX.md
- REQ-0100: Mapped in TRACEABILITY_MATRIX.md
- REQ-0101: Mapped in TRACEABILITY_MATRIX.md
- REQ-0102: Mapped in TRACEABILITY_MATRIX.md
- REQ-0103: Mapped in TRACEABILITY_MATRIX.md
- REQ-0104: Mapped in TRACEABILITY_MATRIX.md
- REQ-0105: Mapped in TRACEABILITY_MATRIX.md
- REQ-0106: Mapped in TRACEABILITY_MATRIX.md
- REQ-0107: Mapped in TRACEABILITY_MATRIX.md
- REQ-0108: Mapped in TRACEABILITY_MATRIX.md
- REQ-0109: Mapped in TRACEABILITY_MATRIX.md
- REQ-0110: Mapped in TRACEABILITY_MATRIX.md
- REQ-0111: Mapped in TRACEABILITY_MATRIX.md
- REQ-0112: Mapped in TRACEABILITY_MATRIX.md

## Non-Goal / Red-Team Guardrails

- No individual targeting/stalking workflows.
- No covert affiliation inference.
- No social-media scraping ingestion.
- No leaked/hacked/scraped-against-terms data pipelines.
- No financial trading or prediction tooling.

## Verification Hooks

- Run preflight: powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1
- Run WP checks: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I0-001.ps1
- Proof artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I0-001/
