# SX-WP-GOV-MAINT-002 - Spec Extraction Snapshot

Generated On: 2026-03-06
Linked Work Packet: WP-GOV-MAINT-002
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-GOV-MAINT-002.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-GOV-MAINT-002.ps1
WP Status Snapshot: E2E-VERIFIED
Iteration: All

## Scope

Concrete extraction of requirement and primitive obligations this WP must satisfy before status promotion.

## Requirement Extraction

| Requirement | Level | Section | Description | Target | Status |
|-------------|-------|---------|-------------|--------|--------|
| REQ-0001 | MUST | Ãƒâ€šÃ‚Â§3.2 | System MUST NOT ship individual targeting features | All | E2E-VERIFIED |
| REQ-0002 | MUST | Ãƒâ€šÃ‚Â§3.2 | System MUST NOT ship "alert when asset X near Y" for sensitive actors | All | E2E-VERIFIED |
| REQ-0003 | MUST | Ãƒâ€šÃ‚Â§3.2 | System MUST NOT ship covert asset identification or hidden affiliation inference | All | E2E-VERIFIED |
| REQ-0004 | MUST | Ãƒâ€šÃ‚Â§3.2 | System MUST NOT integrate leaked/hacked/scraped-against-terms datasets | All | E2E-VERIFIED |
| REQ-0005 | MUST | Ãƒâ€šÃ‚Â§3.2 | System MUST NOT ship workflows to evade provider protections | All | E2E-VERIFIED |
| REQ-0006 | MUST | Ãƒâ€šÃ‚Â§3.2 | System MUST NOT scrape social media directly | All | E2E-VERIFIED |
| REQ-0007 | MUST | Ãƒâ€šÃ‚Â§3.2 | System MUST NOT ship financial trading/portfolio/prediction features | All | E2E-VERIFIED |
| REQ-0008 | MUST | Ãƒâ€šÃ‚Â§7.2 | Every artifact MUST carry sensitivity marking; markings propagate through composition and exports | All | E2E-VERIFIED |
| REQ-0009 | MUST | Ãƒâ€šÃ‚Â§7.3 | Every layer and derived artifact MUST carry provenance (source, license, timestamp, cadence, lineage) | All | E2E-VERIFIED |
| REQ-0010 | MUST | Ãƒâ€šÃ‚Â§8.1 | Immutable append-only audit trail of all analyst actions, exports, queries, alerts, collaboration, AI access | All | E2E-VERIFIED |
| REQ-0011 | MUST | Ãƒâ€šÃ‚Â§11.4 | Every layer/chart/annotation/export labeled as Observed Evidence, Curated Context, Modeled Output, or AI-Derived Interpretation | All | E2E-VERIFIED |
| REQ-0012 | MUST | Ãƒâ€šÃ‚Â§11.4 | Modeled outputs MUST include uncertainty representation and MUST NOT be presented as observed | All | E2E-VERIFIED |
| REQ-0013 | MUST | Ãƒâ€šÃ‚Â§17 | No capability is "implemented" until it satisfies the slice definition of done | All | E2E-VERIFIED |
| REQ-0014 | MUST | Ãƒâ€šÃ‚Â§11.5 | Desktop app startup (cold launch) MUST be <= 8.0 s to interactive shell on reference workstation | All | IN-PROGRESS |
| REQ-0015 | MUST | Ãƒâ€šÃ‚Â§11.5 | Desktop app startup (warm relaunch) MUST be <= 3.0 s to interactive shell on reference workstation | All | IN-PROGRESS |
| REQ-0016 | MUST | Ãƒâ€šÃ‚Â§11.5 | Analyst state-change actions (layer/filter/apply) MUST provide feedback <= 300 ms P95; if exceeded, UI MUST show non-blocking progress | All | IN-PROGRESS |
| REQ-0017 | MUST | Ãƒâ€šÃ‚Â§5.1 | Runtime path/process/environment handling MUST remain platform-neutral without hard-coded Windows-only assumptions in core paths | All | E2E-VERIFIED |
| REQ-0019 | MUST | Ãƒâ€šÃ‚Â§17 | Every WP MUST maintain linked test suite, spec extraction, and WP check script artifacts | All | E2E-VERIFIED |
| REQ-0020 | MUST | Ãƒâ€šÃ‚Â§17 | WP status claims MUST include proof artifact paths and command evidence | All | E2E-VERIFIED |
| REQ-0021 | MUST | Ãƒâ€šÃ‚Â§18 | Governance preflight MUST enforce WP template compliance to prevent shortcut execution | All | E2E-VERIFIED |
| REQ-0022 | SHOULD | Ãƒâ€šÃ‚Â§17 | Teams SHOULD run WP loop automation (`run_wp_loop.ps1`) before status-promotion sweeps | All | E2E-VERIFIED |
| REQ-0100 | MUST | Ãƒâ€šÃ‚Â§4.1 | RBAC: Viewer, Analyst, Administrator, Auditor roles | I0 | E2E-VERIFIED |
| REQ-0101 | MUST | Ãƒâ€šÃ‚Â§9.2 | Snapshot bundle contains: data slice, derived analytics, UI state, evidence manifest, integrity hashes, confidence metadata | I0 | E2E-VERIFIED |
| REQ-0102 | MUST | Ãƒâ€šÃ‚Â§9.2 | Bundle asset registry: each file/object has stable asset_id + sha256 hash | I0 | E2E-VERIFIED |
| REQ-0103 | MUST | Ãƒâ€šÃ‚Â§9.2 | External interfaces reference bundle contents by (bundle_id, asset_id, sha256), not filesystem paths | I0 | E2E-VERIFIED |
| REQ-0104 | MUST | Ãƒâ€šÃ‚Â§9.2 | Bundles immutable once created; corrections append-only via supersedes | I0 | E2E-VERIFIED |
| REQ-0105 | MUST | Ãƒâ€šÃ‚Â§9.3 | Reopening a bundle restores view state and derived artifacts deterministically | I0 | E2E-VERIFIED |
| REQ-0106 | MUST | Ãƒâ€šÃ‚Â§8.1 | Audit trail: immutable, append-only | I0 | E2E-VERIFIED |
| REQ-0107 | SHOULD | Ãƒâ€šÃ‚Â§8.2 | Audit logs tamper-evident (hash chaining), exportable for compliance | I0 | E2E-VERIFIED |
| REQ-0108 | MUST | Ãƒâ€šÃ‚Â§10.1 | Full offline mode for air-gapped environments | I0 | E2E-VERIFIED |
| REQ-0109 | MUST | Ãƒâ€šÃ‚Â§6.3 | Control plane DB is PostgreSQL with PostGIS | I0 | SPEC-MAPPED |
| REQ-0110 | MUST | Ãƒâ€šÃ‚Â§6.3 | Artifact store: immutable artifacts with append-only supersedes links | I0 | IN-PROGRESS |
| REQ-0111 | MUST | Ãƒâ€šÃ‚Â§5 | Deployment profiles each specify: identity, key management, storage, audit retention, AI access | I0 | SPEC-MAPPED |
| REQ-0112 | MUST | Ãƒâ€šÃ‚Â§11.5 | Bundle open (local): ÃƒÂ¢Ã¢â‚¬Â°Ã‚Â¤5.0s to interactive | I0 | E2E-VERIFIED |
| REQ-0200 | MUST | Ãƒâ€šÃ‚Â§11.1 | UI stable regions: header, left panel, right panel, bottom panel, main canvas | I1 | E2E-VERIFIED |
| REQ-0201 | MUST | Ãƒâ€šÃ‚Â§11.2 | UI modes: Live/Recent, Replay, Compare, Scenario, Collaboration, Offline | I1 | E2E-VERIFIED |
| REQ-0202 | MUST | Ãƒâ€šÃ‚Â§12.1 | Every layer declares: source, license, cadence, geometry type, sensitivity class, caching policy | I1 | E2E-VERIFIED |
| REQ-0203 | MUST | Ãƒâ€šÃ‚Â§12.1 | System surfaces licensing constraints and prevents violating exports | I1 | IN-PROGRESS |
| REQ-0204 | MUST | Ãƒâ€šÃ‚Â§12.2 | Plugins MUST NOT run arbitrary code in main process without sandboxing | I1 | E2E-VERIFIED |
| REQ-0205 | MUST | Ãƒâ€šÃ‚Â§12.2 | Plugin network egress controllable | I1 | E2E-VERIFIED |
| REQ-0206 | MUST | Ãƒâ€šÃ‚Â§11.5 | 2D pan/zoom: ÃƒÂ¢Ã¢â‚¬Â°Ã‚Â¤50ms frame time with aggregated rendering | I1 | IN-PROGRESS |
| REQ-0207 | MUST | Ãƒâ€šÃ‚Â§11.5 | Time scrub (warm cache): ÃƒÂ¢Ã¢â‚¬Â°Ã‚Â¤250ms end-to-end | I1 | IN-PROGRESS |
| REQ-0208 | MUST | Ãƒâ€šÃ‚Â§11.5 | Time scrub (cold cache): ÃƒÂ¢Ã¢â‚¬Â°Ã‚Â¤2.0s end-to-end | I1 | IN-PROGRESS |
| REQ-0209 | MUST | Ãƒâ€šÃ‚Â§11.5 | 4K image export: ÃƒÂ¢Ã¢â‚¬Â°Ã‚Â¤3.0s | I1 | IN-PROGRESS |
| REQ-0210 | MUST | Ãƒâ€šÃ‚Â§11.5 | Briefing bundle export: ÃƒÂ¢Ã¢â‚¬Â°Ã‚Â¤15s | I1 | IN-PROGRESS |
| REQ-0211 | MUST | Ãƒâ€šÃ‚Â§11.5 | Graceful degradation via aggregation when budget cannot be met; UI indicates aggregation | I1 | IN-PROGRESS |
| REQ-0212 | SHOULD | Ãƒâ€šÃ‚Â§11.6 | WCAG/508 accessibility (keyboard, non-color-only semantics) | I1 | IN-PROGRESS |

## Primitive Extraction

| Primitive | Name | Contract | REQs | First Iter | Status |
|-----------|------|----------|------|------------|--------|
| PRIM-0029 | Delivery Reality Audit | Compare implementation evidence against governance claims and force status correction before further delivery | REQ-0013, REQ-0020, REQ-0021, REQ-0022 | All | E2E-VERIFIED |
| PRIM-0030 | Multi-Packet Iteration Workflow | Allow activation and follow-on recovery packets within one iteration while keeping a single active blocking packet | REQ-0013, REQ-0019, REQ-0021 | All | E2E-VERIFIED |
| PRIM-0031 | Recovery Queue Traceability | Keep recovery packets synchronized across roadmap, task board, traceability, and project operating instructions | REQ-0019, REQ-0020, REQ-0022 | All | E2E-VERIFIED |
| PRIM-0032 | Recorder State Store | Persist workspace, query, layer, and context state through the backend instead of only in React component memory | REQ-0008, REQ-0009, REQ-0010, REQ-0101..REQ-0112, REQ-0808 | I0 | E2E-VERIFIED |
| PRIM-0033 | Bundle Asset Snapshot Registry | Capture multiple typed bundle assets with stable `asset_id` and `sha256` references | REQ-0008, REQ-0009, REQ-0010, REQ-0101..REQ-0112 | I0 | E2E-VERIFIED |
| PRIM-0034 | Context Snapshot Artifact | Bundle capture of active context domains, correlation selections, and related query/config state | REQ-0101..REQ-0112, REQ-0808 | I0 | E2E-VERIFIED |
| PRIM-0035 | Workspace Region Surface | Region-oriented shell backed by live persisted workspace data instead of placeholder text | REQ-0200, REQ-0201, REQ-0202 | I1 | E2E-VERIFIED |
| PRIM-0036 | Artifact Label Contract | Visible Evidence/Context/Model/AI labels with uncertainty text preserved in the workbench surface | REQ-0011, REQ-0012, REQ-0804, REQ-0805 | I1 | E2E-VERIFIED |
| PRIM-0037 | Layer Catalog and Budget Telemetry | Layer metadata presentation and explicit degraded/progress feedback for state changes and budgets | REQ-0014..REQ-0016, REQ-0202..REQ-0212 | I1 | E2E-VERIFIED |
| PRIM-0041 | WP Supersession Ledger | Closure status and successor-reference ledger for replaced packets with retained proof | REQ-0013, REQ-0019, REQ-0020, REQ-0021, REQ-0022 | All | E2E-VERIFIED |

## Traceability Hooks

- REQ-0001: Mapped in TRACEABILITY_MATRIX.md
- REQ-0002: Mapped in TRACEABILITY_MATRIX.md
- REQ-0003: Mapped in TRACEABILITY_MATRIX.md
- REQ-0004: Mapped in TRACEABILITY_MATRIX.md
- REQ-0005: Mapped in TRACEABILITY_MATRIX.md
- REQ-0006: Mapped in TRACEABILITY_MATRIX.md
- REQ-0007: Mapped in TRACEABILITY_MATRIX.md
- REQ-0008: Mapped in TRACEABILITY_MATRIX.md
- REQ-0009: Mapped in TRACEABILITY_MATRIX.md
- REQ-0010: Mapped in TRACEABILITY_MATRIX.md
- REQ-0011: Mapped in TRACEABILITY_MATRIX.md
- REQ-0012: Mapped in TRACEABILITY_MATRIX.md
- REQ-0013: Mapped in TRACEABILITY_MATRIX.md
- REQ-0014: Mapped in TRACEABILITY_MATRIX.md
- REQ-0015: Mapped in TRACEABILITY_MATRIX.md
- REQ-0016: Mapped in TRACEABILITY_MATRIX.md
- REQ-0017: Mapped in TRACEABILITY_MATRIX.md
- REQ-0019: Mapped in TRACEABILITY_MATRIX.md
- REQ-0020: Mapped in TRACEABILITY_MATRIX.md
- REQ-0021: Mapped in TRACEABILITY_MATRIX.md
- REQ-0022: Mapped in TRACEABILITY_MATRIX.md
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
- REQ-0200: Mapped in TRACEABILITY_MATRIX.md
- REQ-0201: Mapped in TRACEABILITY_MATRIX.md
- REQ-0202: Mapped in TRACEABILITY_MATRIX.md
- REQ-0203: Mapped in TRACEABILITY_MATRIX.md
- REQ-0204: Mapped in TRACEABILITY_MATRIX.md
- REQ-0205: Mapped in TRACEABILITY_MATRIX.md
- REQ-0206: Mapped in TRACEABILITY_MATRIX.md
- REQ-0207: Mapped in TRACEABILITY_MATRIX.md
- REQ-0208: Mapped in TRACEABILITY_MATRIX.md
- REQ-0209: Mapped in TRACEABILITY_MATRIX.md
- REQ-0210: Mapped in TRACEABILITY_MATRIX.md
- REQ-0211: Mapped in TRACEABILITY_MATRIX.md
- REQ-0212: Mapped in TRACEABILITY_MATRIX.md

## Non-Goal / Red-Team Guardrails

- No individual targeting/stalking workflows.
- No covert affiliation inference.
- No social-media scraping ingestion.
- No leaked/hacked/scraped-against-terms data pipelines.
- No financial trading or prediction tooling.

## Verification Hooks

- Run preflight: powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1
- Run WP checks: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-MAINT-002.ps1
- Proof artifacts: .product/build_target/tool_artifacts/wp_runs/WP-GOV-MAINT-002/
