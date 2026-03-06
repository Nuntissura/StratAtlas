# StratAtlas - Requirements Index

**Spec Version:** v1.2.3  
**Last Updated:** 2026-03-06  
**Governance:** See `SPEC_GOVERNANCE.md` for maintenance rules.

---

## Format

```
REQ-NNNN | LEVEL | Ã‚Â§Section | Description | Iteration Target | Status
```

- **LEVEL:** MUST / SHOULD / MAY
- **Iteration Target:** I0Ã¢â‚¬â€œI10, or "All" for cross-cutting properties
- **Status:** `SPEC-MAPPED` -> `IN-PROGRESS` -> `IMPLEMENTED` -> `E2E-VERIFIED`
- IDs are monotonically increasing and never reused. Removed requirements are marked `DEPRECATED`.

---

## Cross-Cutting Requirements (Apply to All Iterations)

| ID | Level | Section | Description | Target | Status |
|----|-------|---------|-------------|--------|--------|
| REQ-0001 | MUST | Ã‚Â§3.2 | System MUST NOT ship individual targeting features | All | IMPLEMENTED |
| REQ-0002 | MUST | Ã‚Â§3.2 | System MUST NOT ship "alert when asset X near Y" for sensitive actors | All | IMPLEMENTED |
| REQ-0003 | MUST | Ã‚Â§3.2 | System MUST NOT ship covert asset identification or hidden affiliation inference | All | IMPLEMENTED |
| REQ-0004 | MUST | Ã‚Â§3.2 | System MUST NOT integrate leaked/hacked/scraped-against-terms datasets | All | IMPLEMENTED |
| REQ-0005 | MUST | Ã‚Â§3.2 | System MUST NOT ship workflows to evade provider protections | All | IMPLEMENTED |
| REQ-0006 | MUST | Ã‚Â§3.2 | System MUST NOT scrape social media directly | All | IMPLEMENTED |
| REQ-0007 | MUST | Ã‚Â§3.2 | System MUST NOT ship financial trading/portfolio/prediction features | All | IMPLEMENTED |
| REQ-0008 | MUST | Ã‚Â§7.2 | Every artifact MUST carry sensitivity marking; markings propagate through composition and exports | All | IN-PROGRESS |
| REQ-0009 | MUST | Ã‚Â§7.3 | Every layer and derived artifact MUST carry provenance (source, license, timestamp, cadence, lineage) | All | IN-PROGRESS |
| REQ-0010 | MUST | Ã‚Â§8.1 | Immutable append-only audit trail of all analyst actions, exports, queries, alerts, collaboration, AI access | All | IN-PROGRESS |
| REQ-0011 | MUST | Ã‚Â§11.4 | Every layer/chart/annotation/export labeled as Observed Evidence, Curated Context, Modeled Output, or AI-Derived Interpretation | All | IN-PROGRESS |
| REQ-0012 | MUST | Ã‚Â§11.4 | Modeled outputs MUST include uncertainty representation and MUST NOT be presented as observed | All | IN-PROGRESS |
| REQ-0013 | MUST | Ã‚Â§17 | No capability is "implemented" until it satisfies the slice definition of done | All | IN-PROGRESS |
| REQ-0014 | MUST | Ã‚Â§11.5 | Desktop app startup (cold launch) MUST be <= 8.0 s to interactive shell on reference workstation | All | IN-PROGRESS |
| REQ-0015 | MUST | Ã‚Â§11.5 | Desktop app startup (warm relaunch) MUST be <= 3.0 s to interactive shell on reference workstation | All | IN-PROGRESS |
| REQ-0016 | MUST | Ã‚Â§11.5 | Analyst state-change actions (layer/filter/apply) MUST provide feedback <= 300 ms P95; if exceeded, UI MUST show non-blocking progress | All | IN-PROGRESS |
| REQ-0017 | MUST | Ã‚Â§5.1 | Runtime path/process/environment handling MUST remain platform-neutral without hard-coded Windows-only assumptions in core paths | All | IN-PROGRESS |
| REQ-0018 | SHOULD | Ã‚Â§5.1 | Desktop packaging/runtime SHOULD be smoke-tested on macOS during development to preserve portability | All | IN-PROGRESS |
| REQ-0019 | MUST | Ã‚Â§17 | Every WP MUST maintain linked test suite, spec extraction, and WP check script artifacts | All | IMPLEMENTED |
| REQ-0020 | MUST | Ã‚Â§17 | WP status claims MUST include proof artifact paths and command evidence | All | IMPLEMENTED |
| REQ-0021 | MUST | Ã‚Â§18 | Governance preflight MUST enforce WP template compliance to prevent shortcut execution | All | IMPLEMENTED |
| REQ-0022 | SHOULD | Ã‚Â§17 | Teams SHOULD run WP loop automation (`run_wp_loop.ps1`) before status-promotion sweeps | All | IMPLEMENTED |
| REQ-0023 | MUST | Ã‚Â§5.2 | Windows distribution MUST provide uninstall, repair, full-repair, update, and downgrade lifecycle operations | All | IMPLEMENTED |
| REQ-0024 | MUST | Ã‚Â§5.2 | Installer pathway MUST support standard uninstall via Windows installer controls | All | IMPLEMENTED |
| REQ-0025 | MUST | Ã‚Â§5.2 | Repair MUST preserve user presets/data under AppData paths | All | IMPLEMENTED |
| REQ-0026 | MUST | Ã‚Â§5.2 | Full-repair MUST clean reinstall binaries and restore user presets/data by default, with explicit data-drop option | All | IMPLEMENTED |
| REQ-0027 | MUST | Ã‚Â§5.2 | Update operation MUST reject non-newer packages | All | IMPLEMENTED |
| REQ-0028 | MUST | Ã‚Â§5.2 | Downgrade operation MUST be explicit and auditable | All | IMPLEMENTED |
| REQ-0029 | SHOULD | Ã‚Â§5.2 | Release kit SHOULD include a maintenance script and lifecycle documentation next to installer artifacts | All | IMPLEMENTED |
| REQ-0030 | MUST | Ã‚Â§5.2 | Installer build version MUST increase monotonically for rebuilt release artifacts from changed code | All | IMPLEMENTED |
| REQ-0031 | MUST | Ã‚Â§5.2 | EXE and installer artifacts from the same build MUST use the same version | All | IMPLEMENTED |

---

## I0: Walking Skeleton (Bundle + Audit + Markings + Offline)

| ID | Level | Section | Description | Target | Status |
|----|-------|---------|-------------|--------|--------|
| REQ-0100 | MUST | Ã‚Â§4.1 | RBAC: Viewer, Analyst, Administrator, Auditor roles | I0 | IN-PROGRESS |
| REQ-0101 | MUST | Ã‚Â§9.2 | Snapshot bundle contains: data slice, derived analytics, UI state, evidence manifest, integrity hashes, confidence metadata | I0 | IN-PROGRESS |
| REQ-0102 | MUST | Ã‚Â§9.2 | Bundle asset registry: each file/object has stable asset_id + sha256 hash | I0 | IN-PROGRESS |
| REQ-0103 | MUST | Ã‚Â§9.2 | External interfaces reference bundle contents by (bundle_id, asset_id, sha256), not filesystem paths | I0 | IN-PROGRESS |
| REQ-0104 | MUST | Ã‚Â§9.2 | Bundles immutable once created; corrections append-only via supersedes | I0 | IN-PROGRESS |
| REQ-0105 | MUST | Ã‚Â§9.3 | Reopening a bundle restores view state and derived artifacts deterministically | I0 | IN-PROGRESS |
| REQ-0106 | MUST | Ã‚Â§8.1 | Audit trail: immutable, append-only | I0 | IN-PROGRESS |
| REQ-0107 | SHOULD | Ã‚Â§8.2 | Audit logs tamper-evident (hash chaining), exportable for compliance | I0 | IN-PROGRESS |
| REQ-0108 | MUST | Ã‚Â§10.1 | Full offline mode for air-gapped environments | I0 | IN-PROGRESS |
| REQ-0109 | MUST | Ã‚Â§6.3 | Control plane DB is PostgreSQL with PostGIS | I0 | IN-PROGRESS |
| REQ-0110 | MUST | Ã‚Â§6.3 | Artifact store: immutable artifacts with append-only supersedes links | I0 | IN-PROGRESS |
| REQ-0111 | MUST | Ã‚Â§5 | Deployment profiles each specify: identity, key management, storage, audit retention, AI access | I0 | IN-PROGRESS |
| REQ-0112 | MUST | Ã‚Â§11.5 | Bundle open (local): Ã¢â€°Â¤5.0s to interactive | I0 | IN-PROGRESS |

---

## I1: Layer System + Time/Replay + Deterministic Export

| ID | Level | Section | Description | Target | Status |
|----|-------|---------|-------------|--------|--------|
| REQ-0200 | MUST | Ã‚Â§11.1 | UI stable regions: header, left panel, right panel, bottom panel, main canvas | I1 | IN-PROGRESS |
| REQ-0201 | MUST | Ã‚Â§11.2 | UI modes: Live/Recent, Replay, Compare, Scenario, Collaboration, Offline | I1 | IN-PROGRESS |
| REQ-0202 | MUST | Ã‚Â§12.1 | Every layer declares: source, license, cadence, geometry type, sensitivity class, caching policy | I1 | IN-PROGRESS |
| REQ-0203 | MUST | Ã‚Â§12.1 | System surfaces licensing constraints and prevents violating exports | I1 | IN-PROGRESS |
| REQ-0204 | MUST | Ã‚Â§12.2 | Plugins MUST NOT run arbitrary code in main process without sandboxing | I1 | IN-PROGRESS |
| REQ-0205 | MUST | Ã‚Â§12.2 | Plugin network egress controllable | I1 | IN-PROGRESS |
| REQ-0206 | MUST | Ã‚Â§11.5 | 2D pan/zoom: Ã¢â€°Â¤50ms frame time with aggregated rendering | I1 | IN-PROGRESS |
| REQ-0207 | MUST | Ã‚Â§11.5 | Time scrub (warm cache): Ã¢â€°Â¤250ms end-to-end | I1 | IN-PROGRESS |
| REQ-0208 | MUST | Ã‚Â§11.5 | Time scrub (cold cache): Ã¢â€°Â¤2.0s end-to-end | I1 | IN-PROGRESS |
| REQ-0209 | MUST | Ã‚Â§11.5 | 4K image export: Ã¢â€°Â¤3.0s | I1 | IN-PROGRESS |
| REQ-0210 | MUST | Ã‚Â§11.5 | Briefing bundle export: Ã¢â€°Â¤15s | I1 | IN-PROGRESS |
| REQ-0211 | MUST | Ã‚Â§11.5 | Graceful degradation via aggregation when budget cannot be met; UI indicates aggregation | I1 | IN-PROGRESS |
| REQ-0212 | SHOULD | Ã‚Â§11.6 | WCAG/508 accessibility (keyboard, non-color-only semantics) | I1 | IN-PROGRESS |

---

## I2: Baseline/Delta Compare + Briefing Bundle

| ID | Level | Section | Description | Target | Status |
|----|-------|---------|-------------|--------|--------|
| REQ-0300 | MUST | Ã‚Â§13.1 | Baseline vs event delta analysis: at minimum density delta grids | I2 | E2E-VERIFIED |
| REQ-0301 | SHOULD | Ã‚Â§13.1 | Comparative dashboard with context domain time-series overlay | I2 | E2E-VERIFIED |
| REQ-0302 | MUST | Ã‚Â§11.3 | Golden flow: Baseline Ã¢â€ â€™ Delta Ã¢â€ â€™ Snapshot Bundle Ã¢â€ â€™ Briefing Export | I2 | E2E-VERIFIED |

---

## I3: Collaboration + CRDT + Session Replay

| ID | Level | Section | Description | Target | Status |
|----|-------|---------|-------------|--------|--------|
| REQ-0400 | MUST | Ã‚Â§10.2 | Analyst-authored artifacts use merge-safe semantics (CRDT or equivalent) | I3 | E2E-VERIFIED |
| REQ-0401 | MAY | Ã‚Â§10.2 | Last-write-wins only for ephemeral view state | I3 | E2E-VERIFIED |
| REQ-0402 | MUST | Ã‚Â§10.2 | Session replay derived from event log; attribution mandatory | I3 | E2E-VERIFIED |
| REQ-0403 | MUST | Ã‚Â§10.3 | On reconnection: conflict highlighting, reconcile actions, full history with attribution | I3 | E2E-VERIFIED |

---

## I4: Scenario Modeling + Constraint Propagation + Export

| ID | Level | Section | Description | Target | Status |
|----|-------|---------|-------------|--------|--------|
| REQ-0500 | MUST | Ã‚Â§14 | Scenario forks linked to parent snapshots | I4 | E2E-VERIFIED |
| REQ-0501 | MUST | Ã‚Â§14 | Constraint manipulation in scenario forks | I4 | E2E-VERIFIED |
| REQ-0502 | MUST | Ã‚Â§14 | Hypothetical entities in scenario forks | I4 | E2E-VERIFIED |
| REQ-0503 | MUST | Ã‚Â§14 | Scenario comparison and export | I4 | E2E-VERIFIED |
| REQ-0504 | MUST | Ã‚Â§11.3 | Golden flow: Fork Ã¢â€ â€™ Modify Constraints Ã¢â€ â€™ Compare Ã¢â€ â€™ Export Scenario Bundle | I4 | E2E-VERIFIED |

---

## I5: Query Builder + Saved/Versioned Queries

| ID | Level | Section | Description | Target | Status |
|----|-------|---------|-------------|--------|--------|
| REQ-0600 | MUST | Ã‚Â§13.2 | Composable spatio-temporal query builder | I5 | IN-PROGRESS |
| REQ-0601 | MUST | Ã‚Â§13.2 | Query results render as ephemeral layers | I5 | IN-PROGRESS |
| REQ-0602 | MUST | Ã‚Â§13.2 | Saved queries version-controlled | I5 | IN-PROGRESS |
| REQ-0603 | SHOULD | Ã‚Â§13.2 | Context-aware queries combining geospatial + context domain conditions | I5 | IN-PROGRESS |
| REQ-0604 | MUST | Ã‚Â§11.3 | Golden flow: Query Builder Ã¢â€ â€™ Run Ã¢â€ â€™ Render Ã¢â€ â€™ Save/version | I5 | IN-PROGRESS |

---

## I6: AI Gateway + MCP Interface

| ID | Level | Section | Description | Target | Status |
|----|-------|---------|-------------|--------|--------|
| REQ-0700 | MUST | Ã‚Â§15.1 | AI access mediated through gateway: authn/authz, RBAC, marking policy, licensing, audit | I6 | IN-PROGRESS |
| REQ-0701 | MUST | Ã‚Â§15.2 | AI outputs labeled derived/interpretive, cite evidence by (bundle_id, asset_id, sha256), inherit markings | I6 | IN-PROGRESS |
| REQ-0702 | SHOULD | Ã‚Â§15.3 | MCP server: policy-gated, audited tools | I6 | IN-PROGRESS |
| REQ-0703 | MUST | Ã‚Â§15.3 | MCP tools operate on bundle IDs and content hashes, not file paths | I6 | IN-PROGRESS |
| REQ-0704 | MUST | Ã‚Â§15.3 | MCP minimum tool surface: get_bundle_manifest, get_bundle_slice, get_context_values, submit_analysis, list_layers, get_scenario_delta | I6 | IN-PROGRESS |
| REQ-0705 | MUST | Ã‚Â§15.3 | Every MCP invocation audit-logged | I6 | IN-PROGRESS |
| REQ-0706 | MUST | Ã‚Â§15.3 | MCP enforces same RBAC/marking/export policies as UI gateway | I6 | IN-PROGRESS |
| REQ-0707 | MUST | Ã‚Â§15.3 | MCP MUST NOT expose raw DB queries, file paths, or internal endpoints | I6 | IN-PROGRESS |
| REQ-0708 | MUST | Ã‚Â§15.3 | MCP disable-able per deployment profile | I6 | IN-PROGRESS |

---

## I7: Context Intake Framework + First Domains

| ID | Level | Section | Description | Target | Status |
|----|-------|---------|-------------|--------|--------|
| REQ-0800 | MUST | Ã‚Â§7.4.1 | System functions fully without contextual domains enabled | I7 | IN-PROGRESS |
| REQ-0801 | MUST | Ã‚Â§7.4.2 | Every context domain registered in control plane with all required metadata fields | I7 | IN-PROGRESS |
| REQ-0802 | MUST | Ã‚Â§7.4.3 | Correlation links explicit and auditable, stored in control plane | I7 | IN-PROGRESS |
| REQ-0803 | MUST | Ã‚Â§7.4.3 | Correlation MUST NOT imply causation; UI labels as "correlated context" | I7 | IN-PROGRESS |
| REQ-0804 | MUST | Ã‚Â§7.4.5 | sidebar_timeseries and dashboard_widget types MUST NOT render as map points | I7 | IN-PROGRESS |
| REQ-0805 | MUST | Ã‚Â§7.4.5 | All context presentations display source, cadence, and confidence | I7 | IN-PROGRESS |
| REQ-0806 | MUST | Ã‚Â§7.4.8 | pre_cacheable domains available offline | I7 | IN-PROGRESS |
| REQ-0807 | MUST | Ã‚Â§7.4.8 | online_only domains degrade gracefully with staleness indicator | I7 | IN-PROGRESS |
| REQ-0808 | MUST | Ã‚Â§7.4.8 | Snapshot bundles include context values at capture time | I7 | IN-PROGRESS |
| REQ-0809 | MUST | Ã‚Â§11.3 | Golden flow: Context Correlation Ã¢â€ â€™ Enable Ã¢â€ â€™ Observe Ã¢â€ â€™ Capture in bundle | I7 | IN-PROGRESS |
| REQ-0810 | MUST | Ã‚Â§6.3 | Context Store supports efficient time-range queries | I7 | IN-PROGRESS |

---

## I8: Context Deviation Detection + Infrastructure Propagation

| ID | Level | Section | Description | Target | Status |
|----|-------|---------|-------------|--------|--------|
| REQ-0900 | SHOULD | Ã‚Â§13.5 | Trade flow deviation detection vs historical baseline | I8 | IN-PROGRESS |
| REQ-0901 | SHOULD | Ã‚Â§13.5 | Infrastructure status deviation detection | I8 | IN-PROGRESS |
| REQ-0902 | SHOULD | Ã‚Â§13.5 | Regulatory regime change detection for active AOIs | I8 | IN-PROGRESS |
| REQ-0903 | MUST | Ã‚Â§13.5 | Deviation events emitted through standard Event model with context.deviation taxonomy | I8 | IN-PROGRESS |
| REQ-0904 | MUST | Ã‚Â§7.4.7 | constraint_node domains available in Scenario Workspace | I8 | IN-PROGRESS |

---

## I9: OSINT + Economic Indicators + Context-Aware Queries

| ID | Level | Section | Description | Target | Status |
|----|-------|---------|-------------|--------|--------|
| REQ-1000 | MUST | Ã‚Â§7.4.4 | OSINT feeds from approved curated aggregators only | I9 | IN-PROGRESS |
| REQ-1001 | MUST | Ã‚Â§7.4.6 | OSINT events carry verification level (confirmed/reported/alleged); alleged visually distinct | I9 | IN-PROGRESS |
| REQ-1002 | MUST | Ã‚Â§13.4 | Alerts aggregate/statistical, scoped to AOIs, never entity-pursuit | I9 | IN-PROGRESS |
| REQ-1003 | MAY | Ã‚Â§13.4 | Alerts reference context domain thresholds | I9 | IN-PROGRESS |

---

## I10: Strategic Game Modeling

| ID | Level | Section | Description | Target | Status |
|----|-------|---------|-------------|--------|--------|
| REQ-1100 | MUST | Ã‚Â§20.1 | Game modeling operates at aggregate strategic level, not individual targeting | I10 | IN-PROGRESS |
| REQ-1101 | MUST | Ã‚Â§20.2 | Game Model artifact: versioned, auditable, exportable with required fields | I10 | IN-PROGRESS |
| REQ-1102 | MUST | Ã‚Â§20.2 | Game Models carry provenance, confidence, sensitivity markings | I10 | IN-PROGRESS |
| REQ-1103 | SHOULD | Ã‚Â§20.3 | Support normal-form, extensive-form, stochastic game types | I10 | IN-PROGRESS |
| REQ-1104 | MUST | Ã‚Â§20.4 | Scenario trees: decision nodes, chance nodes, information sets | I10 | IN-PROGRESS |
| REQ-1105 | MUST | Ã‚Â§20.4 | Scenario tree branches exportable, replayable, link to scenario forks | I10 | IN-PROGRESS |
| REQ-1106 | MUST | Ã‚Â§20.5 | Payoffs expressed as modeled proxies with uncertainty bounds, labeled Modeled Output | I10 | IN-PROGRESS |
| REQ-1107 | MUST | Ã‚Â§20.6 | Solver runs audit-logged with inputs, config, seeds, outputs | I10 | IN-PROGRESS |
| REQ-1108 | SHOULD | Ã‚Â§20.7 | Parameter sweeps, Monte Carlo, sensitivity ranking | I10 | IN-PROGRESS |
| REQ-1109 | SHOULD | Ã‚Â§20.8 | Value-of-information estimation | I10 | IN-PROGRESS |
| REQ-1110 | SHOULD | Ã‚Â§20.9 | Experiment Bundle artifact (reproducible model runs) | I10 | IN-PROGRESS |
| REQ-1111 | MUST | Ã‚Â§20.10 | Actor granularity restricted to non-individual entities | I10 | IN-PROGRESS |
| REQ-1112 | MUST | Ã‚Â§20.10 | Actions restricted to strategic/policy/logistics abstractions | I10 | IN-PROGRESS |
| REQ-1113 | MUST | Ã‚Â§20.10 | Outputs labeled modeled/interpretive and non-operational | I10 | IN-PROGRESS |

---

## Release Gates (Cross-Cutting Verification)

| ID | Level | Section | Description | Gate | Status |
|----|-------|---------|-------------|------|--------|
| GATE-A | MUST | Ã‚Â§18 | Non-goals enforced across UI/API/plugins/exports | A | IMPLEMENTED |
| GATE-B | MUST | Ã‚Â§18 | Snapshot bundles reopen deterministically with complete evidence manifests | B | IMPLEMENTED |
| GATE-C | MUST | Ã‚Â§18 | RBAC + audit + sensitivity marking + export controls in place | C | IMPLEMENTED |
| GATE-D | MUST | Ã‚Â§18 | Core analysis on saved projects/bundles functions offline with explicit UI state | D | IMPLEMENTED |
| GATE-E | MUST | Ã‚Â§18 | Performance budgets met on reference hardware/datasets | E | IMPLEMENTED |
| GATE-F | MUST | Ã‚Â§18 | Context domain provenance, graceful degradation, not presented as primary evidence | F | IMPLEMENTED |
| GATE-G | MUST | Ã‚Â§18 | AI safety controls operational whenever AI integration is enabled | G | IMPLEMENTED |
| GATE-H | MUST | Ã‚Â§18 | Desktop startup/portability controls met, installer lifecycle operations validated, and installer/exe version contract enforced | H | IMPLEMENTED |

---

## Statistics

| Level | Count |
|-------|-------|
| MUST | 97 |
| SHOULD | 17 |
| MAY | 3 |
| **Total** | **117** |

*Note: This index captures the primary normative requirements. Sub-specs will decompose these into finer-grained implementation requirements with IDs in the REQ-NNxx range (e.g., REQ-0101a, REQ-0101b).*

