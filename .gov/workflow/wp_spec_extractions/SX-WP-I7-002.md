# SX-WP-I7-002 - Spec Extraction Snapshot

Generated On: 2026-03-08
Linked Work Packet: WP-I7-002
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I7-002.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I7-002.ps1
Packet Class Snapshot: IMPLEMENTATION
Workflow Version Snapshot: 4.0
WP Status Snapshot: E2E-VERIFIED
Iteration: I7

## Scope

Concrete extraction of requirement and primitive obligations this WP must satisfy before status promotion.

## Reality Boundary Snapshot

- Real Seam: context domain registration in the product runtime now ingests approved packaged domain snapshots through a governed catalog instead of generating seeded records in the UI.
- User-Visible Win: the analyst chooses an approved context domain, sees locked source metadata, and every downstream surface (query, compare, OSINT thresholding, deviation, scenario) runs against the ingested governed records.
- Proof Target: `check-WP-I7-002.ps1` plus the attached cold/warm Tauri runtime smoke bundle under `.product/build_target/tool_artifacts/wp_runs/WP-I7-002/20260308_060255/runtime_smoke/`.
- Allowed Temporary Fallbacks: packaged curated snapshots remain the governed source for this slice; live external connector expansion is deferred to future connector work and does not block packet closure.
- Promotion Guard: satisfied on 2026-03-08 by the passing `.product/build_target/tool_artifacts/wp_runs/WP-I7-002/20260308_060255/` proof bundle.

## Change Ledger Snapshot

- 2026-03-08: Packet upgraded to Workflow Version 4.0 and moved to `IN-PROGRESS` with an explicit real seam, fallback register, and promotion guard.
- 2026-03-08: Product runtime switched from registration-time synthetic seeding to governed catalog ingestion backed by packaged domain snapshots in `src/features/i7/governedDomains.ts`.
- 2026-03-08: App surfaces now reuse the governed ingested context records across query, deviation, OSINT thresholding, scenario constraint nodes, and bundle persistence.
- 2026-03-08: Immediate recorder-state persistence, Tauri runtime-smoke context assertions, Rust runtime-proof serialization, and formal `check-WP-I7-002.ps1` artifacts landed; closure proof is `.product/build_target/tool_artifacts/wp_runs/WP-I7-002/20260308_060255/`.
- What Became Real: approved domain registration, correlation updates, bundle capture, and bundle reopen now persist and restore governed context state through the real desktop runtime with attached proof artifacts.
- What Remains Simulated: packaged curated snapshots remain the governed source for this closed slice; live external connector expansion is future work, not a blocker for this packet.
- Next Blocking Real Seam: `WP-I8-002` must now consume the restored governed context series for historical deviation detection and downstream propagation.

## Requirement Extraction

| Requirement | Level | Section | Description | Target | Status |
|-------------|-------|---------|-------------|--------|--------|
| REQ-0800 | MUST | Ãƒâ€šÃ‚Â§7.4.1 | System functions fully without contextual domains enabled | I7 | E2E-VERIFIED |
| REQ-0801 | MUST | Ãƒâ€šÃ‚Â§7.4.2 | Every context domain registered in control plane with all required metadata fields | I7 | E2E-VERIFIED |
| REQ-0802 | MUST | Ãƒâ€šÃ‚Â§7.4.3 | Correlation links explicit and auditable, stored in control plane | I7 | E2E-VERIFIED |
| REQ-0803 | MUST | Ãƒâ€šÃ‚Â§7.4.3 | Correlation MUST NOT imply causation; UI labels as "correlated context" | I7 | E2E-VERIFIED |
| REQ-0804 | MUST | Ãƒâ€šÃ‚Â§7.4.5 | sidebar_timeseries and dashboard_widget types MUST NOT render as map points | I7 | E2E-VERIFIED |
| REQ-0805 | MUST | Ãƒâ€šÃ‚Â§7.4.5 | All context presentations display source, cadence, and confidence | I7 | E2E-VERIFIED |
| REQ-0806 | MUST | Ãƒâ€šÃ‚Â§7.4.8 | pre_cacheable domains available offline | I7 | E2E-VERIFIED |
| REQ-0807 | MUST | Ãƒâ€šÃ‚Â§7.4.8 | online_only domains degrade gracefully with staleness indicator | I7 | E2E-VERIFIED |
| REQ-0808 | MUST | Ãƒâ€šÃ‚Â§7.4.8 | Snapshot bundles include context values at capture time | I7 | E2E-VERIFIED |
| REQ-0809 | MUST | Ãƒâ€šÃ‚Â§11.3 | Golden flow: Context Correlation ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ Enable ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ Observe ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ Capture in bundle | I7 | E2E-VERIFIED |
| REQ-0810 | MUST | Ãƒâ€šÃ‚Â§6.3 | Context Store supports efficient time-range queries | I7 | E2E-VERIFIED |

## Primitive Extraction

| Primitive | Name | Contract | REQs | First Iter | Status |
|-----------|------|----------|------|------------|--------|
| PRIM-0054 | Context Ingestion Pipeline | Ingest curated contextual domains with domain metadata, cadence, offline policy, and bundle-capture compatibility preserved from source to store | REQ-0800, REQ-0801, REQ-0802, REQ-0803, REQ-0804, REQ-0805, REQ-0806, REQ-0807, REQ-0808, REQ-0809, REQ-0810 | I7 | E2E-VERIFIED |
| PRIM-0055 | Correlation Registry Store | Persist explicit, auditable correlation links and retrieval indexes without implying causation or violating presentation contracts | REQ-0800, REQ-0801, REQ-0802, REQ-0803, REQ-0804, REQ-0805, REQ-0806, REQ-0807, REQ-0808, REQ-0809, REQ-0810 | I7 | E2E-VERIFIED |

## Traceability Hooks

- REQ-0800: Mapped in TRACEABILITY_MATRIX.md
- REQ-0801: Mapped in TRACEABILITY_MATRIX.md
- REQ-0802: Mapped in TRACEABILITY_MATRIX.md
- REQ-0803: Mapped in TRACEABILITY_MATRIX.md
- REQ-0804: Mapped in TRACEABILITY_MATRIX.md
- REQ-0805: Mapped in TRACEABILITY_MATRIX.md
- REQ-0806: Mapped in TRACEABILITY_MATRIX.md
- REQ-0807: Mapped in TRACEABILITY_MATRIX.md
- REQ-0808: Mapped in TRACEABILITY_MATRIX.md
- REQ-0809: Mapped in TRACEABILITY_MATRIX.md
- REQ-0810: Mapped in TRACEABILITY_MATRIX.md

## Non-Goal / Red-Team Guardrails

- No individual targeting/stalking workflows.
- No covert affiliation inference.
- No social-media scraping ingestion.
- No leaked/hacked/scraped-against-terms data pipelines.
- No financial trading or prediction tooling.

## Verification Hooks

- Run preflight: powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1
- Run WP checks: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I7-002.ps1
- Proof artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I7-002/
