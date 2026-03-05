# StratAtlas - Requirements Index

**Spec Version:** v1.2.1  
**Last Updated:** 2026-03-05  
**Governance:** See `SPEC_GOVERNANCE.md` for maintenance rules.

---

## Format

```
REQ-NNNN | LEVEL | §Section | Description | Iteration Target | Status
```

- **LEVEL:** MUST / SHOULD / MAY
- **Iteration Target:** I0–I10, or "All" for cross-cutting properties
- **Status:** `PENDING` → `SUB-SPEC` → `IN-PROGRESS` → `DONE` → `VERIFIED`
- IDs are monotonically increasing and never reused. Removed requirements are marked `DEPRECATED`.

---

## Cross-Cutting Requirements (Apply to All Iterations)

| ID | Level | Section | Description | Target | Status |
|----|-------|---------|-------------|--------|--------|
| REQ-0001 | MUST | §3.2 | System MUST NOT ship individual targeting features | All | VERIFIED |
| REQ-0002 | MUST | §3.2 | System MUST NOT ship "alert when asset X near Y" for sensitive actors | All | VERIFIED |
| REQ-0003 | MUST | §3.2 | System MUST NOT ship covert asset identification or hidden affiliation inference | All | VERIFIED |
| REQ-0004 | MUST | §3.2 | System MUST NOT integrate leaked/hacked/scraped-against-terms datasets | All | VERIFIED |
| REQ-0005 | MUST | §3.2 | System MUST NOT ship workflows to evade provider protections | All | VERIFIED |
| REQ-0006 | MUST | §3.2 | System MUST NOT scrape social media directly | All | VERIFIED |
| REQ-0007 | MUST | §3.2 | System MUST NOT ship financial trading/portfolio/prediction features | All | VERIFIED |
| REQ-0008 | MUST | §7.2 | Every artifact MUST carry sensitivity marking; markings propagate through composition and exports | All | VERIFIED |
| REQ-0009 | MUST | §7.3 | Every layer and derived artifact MUST carry provenance (source, license, timestamp, cadence, lineage) | All | VERIFIED |
| REQ-0010 | MUST | §8.1 | Immutable append-only audit trail of all analyst actions, exports, queries, alerts, collaboration, AI access | All | VERIFIED |
| REQ-0011 | MUST | §11.4 | Every layer/chart/annotation/export labeled as Observed Evidence, Curated Context, Modeled Output, or AI-Derived Interpretation | All | VERIFIED |
| REQ-0012 | MUST | §11.4 | Modeled outputs MUST include uncertainty representation and MUST NOT be presented as observed | All | VERIFIED |
| REQ-0013 | MUST | §17 | No capability is "implemented" until it satisfies the slice definition of done | All | VERIFIED |
| REQ-0014 | MUST | §11.5 | Desktop app startup (cold launch) MUST be <= 8.0 s to interactive shell on reference workstation | All | VERIFIED |
| REQ-0015 | MUST | §11.5 | Desktop app startup (warm relaunch) MUST be <= 3.0 s to interactive shell on reference workstation | All | VERIFIED |
| REQ-0016 | MUST | §11.5 | Analyst state-change actions (layer/filter/apply) MUST provide feedback <= 300 ms P95; if exceeded, UI MUST show non-blocking progress | All | VERIFIED |
| REQ-0017 | MUST | §5.1 | Runtime path/process/environment handling MUST remain platform-neutral without hard-coded Windows-only assumptions in core paths | All | VERIFIED |
| REQ-0018 | SHOULD | §5.1 | Desktop packaging/runtime SHOULD be smoke-tested on macOS during development to preserve portability | All | VERIFIED |

---

## I0: Walking Skeleton (Bundle + Audit + Markings + Offline)

| ID | Level | Section | Description | Target | Status |
|----|-------|---------|-------------|--------|--------|
| REQ-0100 | MUST | §4.1 | RBAC: Viewer, Analyst, Administrator, Auditor roles | I0 | VERIFIED |
| REQ-0101 | MUST | §9.2 | Snapshot bundle contains: data slice, derived analytics, UI state, evidence manifest, integrity hashes, confidence metadata | I0 | VERIFIED |
| REQ-0102 | MUST | §9.2 | Bundle asset registry: each file/object has stable asset_id + sha256 hash | I0 | VERIFIED |
| REQ-0103 | MUST | §9.2 | External interfaces reference bundle contents by (bundle_id, asset_id, sha256), not filesystem paths | I0 | VERIFIED |
| REQ-0104 | MUST | §9.2 | Bundles immutable once created; corrections append-only via supersedes | I0 | VERIFIED |
| REQ-0105 | MUST | §9.3 | Reopening a bundle restores view state and derived artifacts deterministically | I0 | VERIFIED |
| REQ-0106 | MUST | §8.1 | Audit trail: immutable, append-only | I0 | VERIFIED |
| REQ-0107 | SHOULD | §8.2 | Audit logs tamper-evident (hash chaining), exportable for compliance | I0 | VERIFIED |
| REQ-0108 | MUST | §10.1 | Full offline mode for air-gapped environments | I0 | VERIFIED |
| REQ-0109 | MUST | §6.3 | Control plane DB is PostgreSQL with PostGIS | I0 | VERIFIED |
| REQ-0110 | MUST | §6.3 | Artifact store: immutable artifacts with append-only supersedes links | I0 | VERIFIED |
| REQ-0111 | MUST | §5 | Deployment profiles each specify: identity, key management, storage, audit retention, AI access | I0 | VERIFIED |
| REQ-0112 | MUST | §11.5 | Bundle open (local): ≤5.0s to interactive | I0 | VERIFIED |

---

## I1: Layer System + Time/Replay + Deterministic Export

| ID | Level | Section | Description | Target | Status |
|----|-------|---------|-------------|--------|--------|
| REQ-0200 | MUST | §11.1 | UI stable regions: header, left panel, right panel, bottom panel, main canvas | I1 | VERIFIED |
| REQ-0201 | MUST | §11.2 | UI modes: Live/Recent, Replay, Compare, Scenario, Collaboration, Offline | I1 | VERIFIED |
| REQ-0202 | MUST | §12.1 | Every layer declares: source, license, cadence, geometry type, sensitivity class, caching policy | I1 | VERIFIED |
| REQ-0203 | MUST | §12.1 | System surfaces licensing constraints and prevents violating exports | I1 | VERIFIED |
| REQ-0204 | MUST | §12.2 | Plugins MUST NOT run arbitrary code in main process without sandboxing | I1 | VERIFIED |
| REQ-0205 | MUST | §12.2 | Plugin network egress controllable | I1 | VERIFIED |
| REQ-0206 | MUST | §11.5 | 2D pan/zoom: ≤50ms frame time with aggregated rendering | I1 | VERIFIED |
| REQ-0207 | MUST | §11.5 | Time scrub (warm cache): ≤250ms end-to-end | I1 | VERIFIED |
| REQ-0208 | MUST | §11.5 | Time scrub (cold cache): ≤2.0s end-to-end | I1 | VERIFIED |
| REQ-0209 | MUST | §11.5 | 4K image export: ≤3.0s | I1 | VERIFIED |
| REQ-0210 | MUST | §11.5 | Briefing bundle export: ≤15s | I1 | VERIFIED |
| REQ-0211 | MUST | §11.5 | Graceful degradation via aggregation when budget cannot be met; UI indicates aggregation | I1 | VERIFIED |
| REQ-0212 | SHOULD | §11.6 | WCAG/508 accessibility (keyboard, non-color-only semantics) | I1 | VERIFIED |

---

## I2: Baseline/Delta Compare + Briefing Bundle

| ID | Level | Section | Description | Target | Status |
|----|-------|---------|-------------|--------|--------|
| REQ-0300 | MUST | §13.1 | Baseline vs event delta analysis: at minimum density delta grids | I2 | VERIFIED |
| REQ-0301 | SHOULD | §13.1 | Comparative dashboard with context domain time-series overlay | I2 | VERIFIED |
| REQ-0302 | MUST | §11.3 | Golden flow: Baseline → Delta → Snapshot Bundle → Briefing Export | I2 | VERIFIED |

---

## I3: Collaboration + CRDT + Session Replay

| ID | Level | Section | Description | Target | Status |
|----|-------|---------|-------------|--------|--------|
| REQ-0400 | MUST | §10.2 | Analyst-authored artifacts use merge-safe semantics (CRDT or equivalent) | I3 | VERIFIED |
| REQ-0401 | MAY | §10.2 | Last-write-wins only for ephemeral view state | I3 | VERIFIED |
| REQ-0402 | MUST | §10.2 | Session replay derived from event log; attribution mandatory | I3 | VERIFIED |
| REQ-0403 | MUST | §10.3 | On reconnection: conflict highlighting, reconcile actions, full history with attribution | I3 | VERIFIED |

---

## I4: Scenario Modeling + Constraint Propagation + Export

| ID | Level | Section | Description | Target | Status |
|----|-------|---------|-------------|--------|--------|
| REQ-0500 | MUST | §14 | Scenario forks linked to parent snapshots | I4 | VERIFIED |
| REQ-0501 | MUST | §14 | Constraint manipulation in scenario forks | I4 | VERIFIED |
| REQ-0502 | MUST | §14 | Hypothetical entities in scenario forks | I4 | VERIFIED |
| REQ-0503 | MUST | §14 | Scenario comparison and export | I4 | VERIFIED |
| REQ-0504 | MUST | §11.3 | Golden flow: Fork → Modify Constraints → Compare → Export Scenario Bundle | I4 | VERIFIED |

---

## I5: Query Builder + Saved/Versioned Queries

| ID | Level | Section | Description | Target | Status |
|----|-------|---------|-------------|--------|--------|
| REQ-0600 | MUST | §13.2 | Composable spatio-temporal query builder | I5 | VERIFIED |
| REQ-0601 | MUST | §13.2 | Query results render as ephemeral layers | I5 | VERIFIED |
| REQ-0602 | MUST | §13.2 | Saved queries version-controlled | I5 | VERIFIED |
| REQ-0603 | SHOULD | §13.2 | Context-aware queries combining geospatial + context domain conditions | I5 | VERIFIED |
| REQ-0604 | MUST | §11.3 | Golden flow: Query Builder → Run → Render → Save/version | I5 | VERIFIED |

---

## I6: AI Gateway + MCP Interface

| ID | Level | Section | Description | Target | Status |
|----|-------|---------|-------------|--------|--------|
| REQ-0700 | MUST | §15.1 | AI access mediated through gateway: authn/authz, RBAC, marking policy, licensing, audit | I6 | VERIFIED |
| REQ-0701 | MUST | §15.2 | AI outputs labeled derived/interpretive, cite evidence by (bundle_id, asset_id, sha256), inherit markings | I6 | VERIFIED |
| REQ-0702 | SHOULD | §15.3 | MCP server: policy-gated, audited tools | I6 | VERIFIED |
| REQ-0703 | MUST | §15.3 | MCP tools operate on bundle IDs and content hashes, not file paths | I6 | VERIFIED |
| REQ-0704 | MUST | §15.3 | MCP minimum tool surface: get_bundle_manifest, get_bundle_slice, get_context_values, submit_analysis, list_layers, get_scenario_delta | I6 | VERIFIED |
| REQ-0705 | MUST | §15.3 | Every MCP invocation audit-logged | I6 | VERIFIED |
| REQ-0706 | MUST | §15.3 | MCP enforces same RBAC/marking/export policies as UI gateway | I6 | VERIFIED |
| REQ-0707 | MUST | §15.3 | MCP MUST NOT expose raw DB queries, file paths, or internal endpoints | I6 | VERIFIED |
| REQ-0708 | MUST | §15.3 | MCP disable-able per deployment profile | I6 | VERIFIED |

---

## I7: Context Intake Framework + First Domains

| ID | Level | Section | Description | Target | Status |
|----|-------|---------|-------------|--------|--------|
| REQ-0800 | MUST | §7.4.1 | System functions fully without contextual domains enabled | I7 | VERIFIED |
| REQ-0801 | MUST | §7.4.2 | Every context domain registered in control plane with all required metadata fields | I7 | VERIFIED |
| REQ-0802 | MUST | §7.4.3 | Correlation links explicit and auditable, stored in control plane | I7 | VERIFIED |
| REQ-0803 | MUST | §7.4.3 | Correlation MUST NOT imply causation; UI labels as "correlated context" | I7 | VERIFIED |
| REQ-0804 | MUST | §7.4.5 | sidebar_timeseries and dashboard_widget types MUST NOT render as map points | I7 | VERIFIED |
| REQ-0805 | MUST | §7.4.5 | All context presentations display source, cadence, and confidence | I7 | VERIFIED |
| REQ-0806 | MUST | §7.4.8 | pre_cacheable domains available offline | I7 | VERIFIED |
| REQ-0807 | MUST | §7.4.8 | online_only domains degrade gracefully with staleness indicator | I7 | VERIFIED |
| REQ-0808 | MUST | §7.4.8 | Snapshot bundles include context values at capture time | I7 | VERIFIED |
| REQ-0809 | MUST | §11.3 | Golden flow: Context Correlation → Enable → Observe → Capture in bundle | I7 | VERIFIED |
| REQ-0810 | MUST | §6.3 | Context Store supports efficient time-range queries | I7 | VERIFIED |

---

## I8: Context Deviation Detection + Infrastructure Propagation

| ID | Level | Section | Description | Target | Status |
|----|-------|---------|-------------|--------|--------|
| REQ-0900 | SHOULD | §13.5 | Trade flow deviation detection vs historical baseline | I8 | VERIFIED |
| REQ-0901 | SHOULD | §13.5 | Infrastructure status deviation detection | I8 | VERIFIED |
| REQ-0902 | SHOULD | §13.5 | Regulatory regime change detection for active AOIs | I8 | VERIFIED |
| REQ-0903 | MUST | §13.5 | Deviation events emitted through standard Event model with context.deviation taxonomy | I8 | VERIFIED |
| REQ-0904 | MUST | §7.4.7 | constraint_node domains available in Scenario Workspace | I8 | VERIFIED |

---

## I9: OSINT + Economic Indicators + Context-Aware Queries

| ID | Level | Section | Description | Target | Status |
|----|-------|---------|-------------|--------|--------|
| REQ-1000 | MUST | §7.4.4 | OSINT feeds from approved curated aggregators only | I9 | VERIFIED |
| REQ-1001 | MUST | §7.4.6 | OSINT events carry verification level (confirmed/reported/alleged); alleged visually distinct | I9 | VERIFIED |
| REQ-1002 | MUST | §13.4 | Alerts aggregate/statistical, scoped to AOIs, never entity-pursuit | I9 | VERIFIED |
| REQ-1003 | MAY | §13.4 | Alerts reference context domain thresholds | I9 | VERIFIED |

---

## I10: Strategic Game Modeling

| ID | Level | Section | Description | Target | Status |
|----|-------|---------|-------------|--------|--------|
| REQ-1100 | MUST | §20.1 | Game modeling operates at aggregate strategic level, not individual targeting | I10 | VERIFIED |
| REQ-1101 | MUST | §20.2 | Game Model artifact: versioned, auditable, exportable with required fields | I10 | VERIFIED |
| REQ-1102 | MUST | §20.2 | Game Models carry provenance, confidence, sensitivity markings | I10 | VERIFIED |
| REQ-1103 | SHOULD | §20.3 | Support normal-form, extensive-form, stochastic game types | I10 | VERIFIED |
| REQ-1104 | MUST | §20.4 | Scenario trees: decision nodes, chance nodes, information sets | I10 | VERIFIED |
| REQ-1105 | MUST | §20.4 | Scenario tree branches exportable, replayable, link to scenario forks | I10 | VERIFIED |
| REQ-1106 | MUST | §20.5 | Payoffs expressed as modeled proxies with uncertainty bounds, labeled Modeled Output | I10 | VERIFIED |
| REQ-1107 | MUST | §20.6 | Solver runs audit-logged with inputs, config, seeds, outputs | I10 | VERIFIED |
| REQ-1108 | SHOULD | §20.7 | Parameter sweeps, Monte Carlo, sensitivity ranking | I10 | VERIFIED |
| REQ-1109 | SHOULD | §20.8 | Value-of-information estimation | I10 | VERIFIED |
| REQ-1110 | SHOULD | §20.9 | Experiment Bundle artifact (reproducible model runs) | I10 | VERIFIED |
| REQ-1111 | MUST | §20.10 | Actor granularity restricted to non-individual entities | I10 | VERIFIED |
| REQ-1112 | MUST | §20.10 | Actions restricted to strategic/policy/logistics abstractions | I10 | VERIFIED |
| REQ-1113 | MUST | §20.10 | Outputs labeled modeled/interpretive and non-operational | I10 | VERIFIED |

---

## Release Gates (Cross-Cutting Verification)

| ID | Level | Section | Description | Gate | Status |
|----|-------|---------|-------------|------|--------|
| GATE-A | MUST | §18 | Non-goals enforced across UI/API/plugins/exports | A | VERIFIED |
| GATE-B | MUST | §18 | Snapshot bundles reopen deterministically with complete evidence manifests | B | VERIFIED |
| GATE-C | MUST | §18 | RBAC + audit + sensitivity marking + export controls in place | C | VERIFIED |
| GATE-D | MUST | §18 | Core analysis on saved projects/bundles functions offline with explicit UI state | D | VERIFIED |
| GATE-E | MUST | §18 | Performance budgets met on reference hardware/datasets | E | VERIFIED |
| GATE-F | MUST | §18 | Context domain provenance, graceful degradation, not presented as primary evidence | F | VERIFIED |
| GATE-G | MUST | §18 | AI safety controls operational whenever AI integration is enabled | G | VERIFIED |
| GATE-H | MUST | §18 | Desktop startup and portability controls met for Windows and macOS path | H | VERIFIED |

---

## Statistics

| Level | Count |
|-------|-------|
| MUST | 86 |
| SHOULD | 15 |
| MAY | 3 |
| **Total** | **104** |

*Note: This index captures the primary normative requirements. Sub-specs will decompose these into finer-grained implementation requirements with IDs in the REQ-NNxx range (e.g., REQ-0101a, REQ-0101b).*


