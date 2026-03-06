# SX-WP-I0-002 - Spec Extraction Snapshot

Generated On: 2026-03-06
Linked Work Packet: WP-I0-002
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I0-002.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I0-002.ps1
WP Status Snapshot: E2E-VERIFIED
Iteration: I0

## Scope

Concrete extraction of requirement and primitive obligations this WP must satisfy before status promotion.

## Requirement Extraction

| Requirement | Level | Section | Description | Target | Status |
|-------------|-------|---------|-------------|--------|--------|
| REQ-0008 | MUST | Ãƒâ€šÃ‚Â§7.2 | Every artifact MUST carry sensitivity marking; markings propagate through composition and exports | All | IN-PROGRESS |
| REQ-0009 | MUST | Ãƒâ€šÃ‚Â§7.3 | Every layer and derived artifact MUST carry provenance (source, license, timestamp, cadence, lineage) | All | IN-PROGRESS |
| REQ-0010 | MUST | Ãƒâ€šÃ‚Â§8.1 | Immutable append-only audit trail of all analyst actions, exports, queries, alerts, collaboration, AI access | All | IN-PROGRESS |
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
| REQ-0808 | MUST | Ãƒâ€šÃ‚Â§7.4.8 | Snapshot bundles include context values at capture time | I7 | E2E-VERIFIED |

## Primitive Extraction

| Primitive | Name | Contract | REQs | First Iter | Status |
|-----------|------|----------|------|------------|--------|
| PRIM-0032 | Recorder State Store | Persist workspace, query, layer, and context state through the backend instead of only in React component memory | REQ-0008, REQ-0009, REQ-0010, REQ-0101..REQ-0112, REQ-0808 | I0 | IMPLEMENTED |
| PRIM-0033 | Bundle Asset Snapshot Registry | Capture multiple typed bundle assets with stable `asset_id` and `sha256` references | REQ-0008, REQ-0009, REQ-0010, REQ-0101..REQ-0112 | I0 | IMPLEMENTED |
| PRIM-0034 | Context Snapshot Artifact | Bundle capture of active context domains, correlation selections, and related query/config state | REQ-0101..REQ-0112, REQ-0808 | I0 | IMPLEMENTED |

## Traceability Hooks

- REQ-0008: Mapped in TRACEABILITY_MATRIX.md
- REQ-0009: Mapped in TRACEABILITY_MATRIX.md
- REQ-0010: Mapped in TRACEABILITY_MATRIX.md
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
- REQ-0808: Mapped in TRACEABILITY_MATRIX.md

## Non-Goal / Red-Team Guardrails

- No individual targeting/stalking workflows.
- No covert affiliation inference.
- No social-media scraping ingestion.
- No leaked/hacked/scraped-against-terms data pipelines.
- No financial trading or prediction tooling.

## Verification Hooks

- Run preflight: powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1
- Run WP checks: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I0-002.ps1
- Proof artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I0-002/
