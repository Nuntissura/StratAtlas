# StratAtlas - Requirements Index

**Spec Version:** v1.2.1  
**Last Updated:** 2026-03-06  
**Governance:** See `SPEC_GOVERNANCE.md` for maintenance rules.

---

## Format

```
REQ-NNNN | LEVEL | Â§Section | Description | Iteration Target | Status
```

- **LEVEL:** MUST / SHOULD / MAY
- **Iteration Target:** I0â€“I10, or "All" for cross-cutting properties
- **Status:** `SPEC-MAPPED` -> `IN-PROGRESS` -> `IMPLEMENTED` -> `E2E-VERIFIED`
- IDs are monotonically increasing and never reused. Removed requirements are marked `DEPRECATED`.

---

## Cross-Cutting Requirements (Apply to All Iterations)

| ID | Level | Section | Description | Target | Status |
|----|-------|---------|-------------|--------|--------|
| REQ-0001 | MUST | Â§3.2 | System MUST NOT ship individual targeting features | All | IMPLEMENTED |
| REQ-0002 | MUST | Â§3.2 | System MUST NOT ship "alert when asset X near Y" for sensitive actors | All | IMPLEMENTED |
| REQ-0003 | MUST | Â§3.2 | System MUST NOT ship covert asset identification or hidden affiliation inference | All | IMPLEMENTED |
| REQ-0004 | MUST | Â§3.2 | System MUST NOT integrate leaked/hacked/scraped-against-terms datasets | All | IMPLEMENTED |
| REQ-0005 | MUST | Â§3.2 | System MUST NOT ship workflows to evade provider protections | All | IMPLEMENTED |
| REQ-0006 | MUST | Â§3.2 | System MUST NOT scrape social media directly | All | IMPLEMENTED |
| REQ-0007 | MUST | Â§3.2 | System MUST NOT ship financial trading/portfolio/prediction features | All | IMPLEMENTED |
| REQ-0008 | MUST | Â§7.2 | Every artifact MUST carry sensitivity marking; markings propagate through composition and exports | All | IMPLEMENTED |
| REQ-0009 | MUST | Â§7.3 | Every layer and derived artifact MUST carry provenance (source, license, timestamp, cadence, lineage) | All | IMPLEMENTED |
| REQ-0010 | MUST | Â§8.1 | Immutable append-only audit trail of all analyst actions, exports, queries, alerts, collaboration, AI access | All | IMPLEMENTED |
| REQ-0011 | MUST | Â§11.4 | Every layer/chart/annotation/export labeled as Observed Evidence, Curated Context, Modeled Output, or AI-Derived Interpretation | All | IMPLEMENTED |
| REQ-0012 | MUST | Â§11.4 | Modeled outputs MUST include uncertainty representation and MUST NOT be presented as observed | All | IMPLEMENTED |
| REQ-0013 | MUST | Â§17 | No capability is "implemented" until it satisfies the slice definition of done | All | IMPLEMENTED |
| REQ-0014 | MUST | Â§11.5 | Desktop app startup (cold launch) MUST be <= 8.0 s to interactive shell on reference workstation | All | IMPLEMENTED |
| REQ-0015 | MUST | Â§11.5 | Desktop app startup (warm relaunch) MUST be <= 3.0 s to interactive shell on reference workstation | All | IMPLEMENTED |
| REQ-0016 | MUST | Â§11.5 | Analyst state-change actions (layer/filter/apply) MUST provide feedback <= 300 ms P95; if exceeded, UI MUST show non-blocking progress | All | IMPLEMENTED |
| REQ-0017 | MUST | Â§5.1 | Runtime path/process/environment handling MUST remain platform-neutral without hard-coded Windows-only assumptions in core paths | All | IMPLEMENTED |
| REQ-0018 | SHOULD | Â§5.1 | Desktop packaging/runtime SHOULD be smoke-tested on macOS during development to preserve portability | All | IMPLEMENTED |
| REQ-0019 | MUST | Â§17 | Every WP MUST maintain linked test suite, spec extraction, and WP check script artifacts | All | IMPLEMENTED |
| REQ-0020 | MUST | Â§17 | WP status claims MUST include proof artifact paths and command evidence | All | IMPLEMENTED |
| REQ-0021 | MUST | Â§18 | Governance preflight MUST enforce WP template compliance to prevent shortcut execution | All | IMPLEMENTED |
| REQ-0022 | SHOULD | Â§17 | Teams SHOULD run WP loop automation (`run_wp_loop.ps1`) before status-promotion sweeps | All | IMPLEMENTED |

---

## I0: Walking Skeleton (Bundle + Audit + Markings + Offline)

| ID | Level | Section | Description | Target | Status |
|----|-------|---------|-------------|--------|--------|
| REQ-0100 | MUST | Â§4.1 | RBAC: Viewer, Analyst, Administrator, Auditor roles | I0 | IMPLEMENTED |
| REQ-0101 | MUST | Â§9.2 | Snapshot bundle contains: data slice, derived analytics, UI state, evidence manifest, integrity hashes, confidence metadata | I0 | IMPLEMENTED |
| REQ-0102 | MUST | Â§9.2 | Bundle asset registry: each file/object has stable asset_id + sha256 hash | I0 | IMPLEMENTED |
| REQ-0103 | MUST | Â§9.2 | External interfaces reference bundle contents by (bundle_id, asset_id, sha256), not filesystem paths | I0 | IMPLEMENTED |
| REQ-0104 | MUST | Â§9.2 | Bundles immutable once created; corrections append-only via supersedes | I0 | IMPLEMENTED |
| REQ-0105 | MUST | Â§9.3 | Reopening a bundle restores view state and derived artifacts deterministically | I0 | IMPLEMENTED |
| REQ-0106 | MUST | Â§8.1 | Audit trail: immutable, append-only | I0 | IMPLEMENTED |
| REQ-0107 | SHOULD | Â§8.2 | Audit logs tamper-evident (hash chaining), exportable for compliance | I0 | IMPLEMENTED |
| REQ-0108 | MUST | Â§10.1 | Full offline mode for air-gapped environments | I0 | IMPLEMENTED |
| REQ-0109 | MUST | Â§6.3 | Control plane DB is PostgreSQL with PostGIS | I0 | IMPLEMENTED |
| REQ-0110 | MUST | Â§6.3 | Artifact store: immutable artifacts with append-only supersedes links | I0 | IMPLEMENTED |
| REQ-0111 | MUST | Â§5 | Deployment profiles each specify: identity, key management, storage, audit retention, AI access | I0 | IMPLEMENTED |
| REQ-0112 | MUST | Â§11.5 | Bundle open (local): â‰¤5.0s to interactive | I0 | IMPLEMENTED |

---

## I1: Layer System + Time/Replay + Deterministic Export

| ID | Level | Section | Description | Target | Status |
|----|-------|---------|-------------|--------|--------|
| REQ-0200 | MUST | Â§11.1 | UI stable regions: header, left panel, right panel, bottom panel, main canvas | I1 | IMPLEMENTED |
| REQ-0201 | MUST | Â§11.2 | UI modes: Live/Recent, Replay, Compare, Scenario, Collaboration, Offline | I1 | IMPLEMENTED |
| REQ-0202 | MUST | Â§12.1 | Every layer declares: source, license, cadence, geometry type, sensitivity class, caching policy | I1 | IMPLEMENTED |
| REQ-0203 | MUST | Â§12.1 | System surfaces licensing constraints and prevents violating exports | I1 | IMPLEMENTED |
| REQ-0204 | MUST | Â§12.2 | Plugins MUST NOT run arbitrary code in main process without sandboxing | I1 | IMPLEMENTED |
| REQ-0205 | MUST | Â§12.2 | Plugin network egress controllable | I1 | IMPLEMENTED |
| REQ-0206 | MUST | Â§11.5 | 2D pan/zoom: â‰¤50ms frame time with aggregated rendering | I1 | IMPLEMENTED |
| REQ-0207 | MUST | Â§11.5 | Time scrub (warm cache): â‰¤250ms end-to-end | I1 | IMPLEMENTED |
| REQ-0208 | MUST | Â§11.5 | Time scrub (cold cache): â‰¤2.0s end-to-end | I1 | IMPLEMENTED |
| REQ-0209 | MUST | Â§11.5 | 4K image export: â‰¤3.0s | I1 | IMPLEMENTED |
| REQ-0210 | MUST | Â§11.5 | Briefing bundle export: â‰¤15s | I1 | IMPLEMENTED |
| REQ-0211 | MUST | Â§11.5 | Graceful degradation via aggregation when budget cannot be met; UI indicates aggregation | I1 | IMPLEMENTED |
| REQ-0212 | SHOULD | Â§11.6 | WCAG/508 accessibility (keyboard, non-color-only semantics) | I1 | IMPLEMENTED |

---

## I2: Baseline/Delta Compare + Briefing Bundle

| ID | Level | Section | Description | Target | Status |
|----|-------|---------|-------------|--------|--------|
| REQ-0300 | MUST | Â§13.1 | Baseline vs event delta analysis: at minimum density delta grids | I2 | IMPLEMENTED |
| REQ-0301 | SHOULD | Â§13.1 | Comparative dashboard with context domain time-series overlay | I2 | IMPLEMENTED |
| REQ-0302 | MUST | Â§11.3 | Golden flow: Baseline â†’ Delta â†’ Snapshot Bundle â†’ Briefing Export | I2 | IMPLEMENTED |

---

## I3: Collaboration + CRDT + Session Replay

| ID | Level | Section | Description | Target | Status |
|----|-------|---------|-------------|--------|--------|
| REQ-0400 | MUST | Â§10.2 | Analyst-authored artifacts use merge-safe semantics (CRDT or equivalent) | I3 | IMPLEMENTED |
| REQ-0401 | MAY | Â§10.2 | Last-write-wins only for ephemeral view state | I3 | IMPLEMENTED |
| REQ-0402 | MUST | Â§10.2 | Session replay derived from event log; attribution mandatory | I3 | IMPLEMENTED |
| REQ-0403 | MUST | Â§10.3 | On reconnection: conflict highlighting, reconcile actions, full history with attribution | I3 | IMPLEMENTED |

---

## I4: Scenario Modeling + Constraint Propagation + Export

| ID | Level | Section | Description | Target | Status |
|----|-------|---------|-------------|--------|--------|
| REQ-0500 | MUST | Â§14 | Scenario forks linked to parent snapshots | I4 | IMPLEMENTED |
| REQ-0501 | MUST | Â§14 | Constraint manipulation in scenario forks | I4 | IMPLEMENTED |
| REQ-0502 | MUST | Â§14 | Hypothetical entities in scenario forks | I4 | IMPLEMENTED |
| REQ-0503 | MUST | Â§14 | Scenario comparison and export | I4 | IMPLEMENTED |
| REQ-0504 | MUST | Â§11.3 | Golden flow: Fork â†’ Modify Constraints â†’ Compare â†’ Export Scenario Bundle | I4 | IMPLEMENTED |

---

## I5: Query Builder + Saved/Versioned Queries

| ID | Level | Section | Description | Target | Status |
|----|-------|---------|-------------|--------|--------|
| REQ-0600 | MUST | Â§13.2 | Composable spatio-temporal query builder | I5 | IMPLEMENTED |
| REQ-0601 | MUST | Â§13.2 | Query results render as ephemeral layers | I5 | IMPLEMENTED |
| REQ-0602 | MUST | Â§13.2 | Saved queries version-controlled | I5 | IMPLEMENTED |
| REQ-0603 | SHOULD | Â§13.2 | Context-aware queries combining geospatial + context domain conditions | I5 | IMPLEMENTED |
| REQ-0604 | MUST | Â§11.3 | Golden flow: Query Builder â†’ Run â†’ Render â†’ Save/version | I5 | IMPLEMENTED |

---

## I6: AI Gateway + MCP Interface

| ID | Level | Section | Description | Target | Status |
|----|-------|---------|-------------|--------|--------|
| REQ-0700 | MUST | Â§15.1 | AI access mediated through gateway: authn/authz, RBAC, marking policy, licensing, audit | I6 | IMPLEMENTED |
| REQ-0701 | MUST | Â§15.2 | AI outputs labeled derived/interpretive, cite evidence by (bundle_id, asset_id, sha256), inherit markings | I6 | IMPLEMENTED |
| REQ-0702 | SHOULD | Â§15.3 | MCP server: policy-gated, audited tools | I6 | IMPLEMENTED |
| REQ-0703 | MUST | Â§15.3 | MCP tools operate on bundle IDs and content hashes, not file paths | I6 | IMPLEMENTED |
| REQ-0704 | MUST | Â§15.3 | MCP minimum tool surface: get_bundle_manifest, get_bundle_slice, get_context_values, submit_analysis, list_layers, get_scenario_delta | I6 | IMPLEMENTED |
| REQ-0705 | MUST | Â§15.3 | Every MCP invocation audit-logged | I6 | IMPLEMENTED |
| REQ-0706 | MUST | Â§15.3 | MCP enforces same RBAC/marking/export policies as UI gateway | I6 | IMPLEMENTED |
| REQ-0707 | MUST | Â§15.3 | MCP MUST NOT expose raw DB queries, file paths, or internal endpoints | I6 | IMPLEMENTED |
| REQ-0708 | MUST | Â§15.3 | MCP disable-able per deployment profile | I6 | IMPLEMENTED |

---

## I7: Context Intake Framework + First Domains

| ID | Level | Section | Description | Target | Status |
|----|-------|---------|-------------|--------|--------|
| REQ-0800 | MUST | Â§7.4.1 | System functions fully without contextual domains enabled | I7 | IMPLEMENTED |
| REQ-0801 | MUST | Â§7.4.2 | Every context domain registered in control plane with all required metadata fields | I7 | IMPLEMENTED |
| REQ-0802 | MUST | Â§7.4.3 | Correlation links explicit and auditable, stored in control plane | I7 | IMPLEMENTED |
| REQ-0803 | MUST | Â§7.4.3 | Correlation MUST NOT imply causation; UI labels as "correlated context" | I7 | IMPLEMENTED |
| REQ-0804 | MUST | Â§7.4.5 | sidebar_timeseries and dashboard_widget types MUST NOT render as map points | I7 | IMPLEMENTED |
| REQ-0805 | MUST | Â§7.4.5 | All context presentations display source, cadence, and confidence | I7 | IMPLEMENTED |
| REQ-0806 | MUST | Â§7.4.8 | pre_cacheable domains available offline | I7 | IMPLEMENTED |
| REQ-0807 | MUST | Â§7.4.8 | online_only domains degrade gracefully with staleness indicator | I7 | IMPLEMENTED |
| REQ-0808 | MUST | Â§7.4.8 | Snapshot bundles include context values at capture time | I7 | IMPLEMENTED |
| REQ-0809 | MUST | Â§11.3 | Golden flow: Context Correlation â†’ Enable â†’ Observe â†’ Capture in bundle | I7 | IMPLEMENTED |
| REQ-0810 | MUST | Â§6.3 | Context Store supports efficient time-range queries | I7 | IMPLEMENTED |

---

## I8: Context Deviation Detection + Infrastructure Propagation

| ID | Level | Section | Description | Target | Status |
|----|-------|---------|-------------|--------|--------|
| REQ-0900 | SHOULD | Â§13.5 | Trade flow deviation detection vs historical baseline | I8 | IMPLEMENTED |
| REQ-0901 | SHOULD | Â§13.5 | Infrastructure status deviation detection | I8 | IMPLEMENTED |
| REQ-0902 | SHOULD | Â§13.5 | Regulatory regime change detection for active AOIs | I8 | IMPLEMENTED |
| REQ-0903 | MUST | Â§13.5 | Deviation events emitted through standard Event model with context.deviation taxonomy | I8 | IMPLEMENTED |
| REQ-0904 | MUST | Â§7.4.7 | constraint_node domains available in Scenario Workspace | I8 | IMPLEMENTED |

---

## I9: OSINT + Economic Indicators + Context-Aware Queries

| ID | Level | Section | Description | Target | Status |
|----|-------|---------|-------------|--------|--------|
| REQ-1000 | MUST | Â§7.4.4 | OSINT feeds from approved curated aggregators only | I9 | IMPLEMENTED |
| REQ-1001 | MUST | Â§7.4.6 | OSINT events carry verification level (confirmed/reported/alleged); alleged visually distinct | I9 | IMPLEMENTED |
| REQ-1002 | MUST | Â§13.4 | Alerts aggregate/statistical, scoped to AOIs, never entity-pursuit | I9 | IMPLEMENTED |
| REQ-1003 | MAY | Â§13.4 | Alerts reference context domain thresholds | I9 | IMPLEMENTED |

---

## I10: Strategic Game Modeling

| ID | Level | Section | Description | Target | Status |
|----|-------|---------|-------------|--------|--------|
| REQ-1100 | MUST | Â§20.1 | Game modeling operates at aggregate strategic level, not individual targeting | I10 | IMPLEMENTED |
| REQ-1101 | MUST | Â§20.2 | Game Model artifact: versioned, auditable, exportable with required fields | I10 | IMPLEMENTED |
| REQ-1102 | MUST | Â§20.2 | Game Models carry provenance, confidence, sensitivity markings | I10 | IMPLEMENTED |
| REQ-1103 | SHOULD | Â§20.3 | Support normal-form, extensive-form, stochastic game types | I10 | IMPLEMENTED |
| REQ-1104 | MUST | Â§20.4 | Scenario trees: decision nodes, chance nodes, information sets | I10 | IMPLEMENTED |
| REQ-1105 | MUST | Â§20.4 | Scenario tree branches exportable, replayable, link to scenario forks | I10 | IMPLEMENTED |
| REQ-1106 | MUST | Â§20.5 | Payoffs expressed as modeled proxies with uncertainty bounds, labeled Modeled Output | I10 | IMPLEMENTED |
| REQ-1107 | MUST | Â§20.6 | Solver runs audit-logged with inputs, config, seeds, outputs | I10 | IMPLEMENTED |
| REQ-1108 | SHOULD | Â§20.7 | Parameter sweeps, Monte Carlo, sensitivity ranking | I10 | IMPLEMENTED |
| REQ-1109 | SHOULD | Â§20.8 | Value-of-information estimation | I10 | IMPLEMENTED |
| REQ-1110 | SHOULD | Â§20.9 | Experiment Bundle artifact (reproducible model runs) | I10 | IMPLEMENTED |
| REQ-1111 | MUST | Â§20.10 | Actor granularity restricted to non-individual entities | I10 | IMPLEMENTED |
| REQ-1112 | MUST | Â§20.10 | Actions restricted to strategic/policy/logistics abstractions | I10 | IMPLEMENTED |
| REQ-1113 | MUST | Â§20.10 | Outputs labeled modeled/interpretive and non-operational | I10 | IMPLEMENTED |

---

## Release Gates (Cross-Cutting Verification)

| ID | Level | Section | Description | Gate | Status |
|----|-------|---------|-------------|------|--------|
| GATE-A | MUST | Â§18 | Non-goals enforced across UI/API/plugins/exports | A | IMPLEMENTED |
| GATE-B | MUST | Â§18 | Snapshot bundles reopen deterministically with complete evidence manifests | B | IMPLEMENTED |
| GATE-C | MUST | Â§18 | RBAC + audit + sensitivity marking + export controls in place | C | IMPLEMENTED |
| GATE-D | MUST | Â§18 | Core analysis on saved projects/bundles functions offline with explicit UI state | D | IMPLEMENTED |
| GATE-E | MUST | Â§18 | Performance budgets met on reference hardware/datasets | E | IMPLEMENTED |
| GATE-F | MUST | Â§18 | Context domain provenance, graceful degradation, not presented as primary evidence | F | IMPLEMENTED |
| GATE-G | MUST | Â§18 | AI safety controls operational whenever AI integration is enabled | G | IMPLEMENTED |
| GATE-H | MUST | Â§18 | Desktop startup and portability controls met for Windows and macOS path | H | IMPLEMENTED |

---

## Statistics

| Level | Count |
|-------|-------|
| MUST | 89 |
| SHOULD | 16 |
| MAY | 3 |
| **Total** | **108** |

*Note: This index captures the primary normative requirements. Sub-specs will decompose these into finer-grained implementation requirements with IDs in the REQ-NNxx range (e.g., REQ-0101a, REQ-0101b).*


