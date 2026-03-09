# STRATATLAS
## Product Specification v1.2.5
*Interactive Geospatial Analysis Workstation*

**Date:** 2026-03-09  
**Status:** Draft  
**Audience:** Engineering, Product, Security/Compliance, Stakeholders  
**Supersedes:** `stratatlas_spec_v1_1.md`, `stratatlas_spec_v1_0.md`, `stratatlas_spec_v0_4.md`, `stratatlas_spec_v1_0_reset.md`

---

## 0. Normative Language
This document uses requirement keywords:

- **MUST / MUST NOT:** mandatory requirement
- **SHOULD / SHOULD NOT:** strong recommendation; exceptions require written justification
- **MAY:** optional capability

Items marked **[NEW in v1.2.2]** denote additions relative to spec v1.2.1. Items marked **[NEW in v1.2]** denote additions relative to spec v1.1. Items marked **[NEW in v1.1]** denote additions relative to spec v1.0.

---

## 1. Why This Spec Does Not Use an MVP Approach

### 1.1 Position
StratAtlas intentionally avoids defining an "MVP" as a fixed feature checklist.

### 1.2 Rationale (Normative)
An MVP checklist is counterproductive for StratAtlas because it:

1) **Incentivizes shallow vertical builds** that defer cross-cutting properties (audit, markings, reproducibility, offline) and therefore create compounding technical debt when those properties are retrofitted.  
2) **Misrepresents readiness** for target customers (government + universities), who require system properties (governance, provenance, deterministic replay, controlled exports) more than feature breadth.  
3) **Does not map to AI-era development**: rapid prototyping is easy; retrofitting trustworthy data lineage, deterministic replay, and policy enforcement is expensive and destabilizing.

### 1.3 Replacement Mechanism: Release Gates + Capability Slices
Instead of MVP scope, StratAtlas is governed by:

- **Release Gates** (eligibility criteria for pilots/deployments; properties, not features)
- **Capability Slices** (vertical modules that are only "done" when they include storage + UX + audit + offline + tests)

**Normative rule:** No capability is "implemented" until it satisfies the slice definition of done in Section 17.

---

## 2. System Intent
StratAtlas is an interactive geospatial analysis workstation that fuses multi-domain movement data (air, maritime, space), static infrastructure, contextual layers, and structured economic/resource context into a toggleable 2D + 3D map experience with strong time controls.

Primary intent: **strategic / game-theory analysis** (patterns, constraints, deltas, scenarios), not operational pursuit.

Target clients: government defense/intelligence organizations and university research institutions requiring rigorous, reproducible geospatial analysis.

---

## 3. Scope and Non-Goals

### 3.1 In Scope
StratAtlas MUST provide (capability-level scope):

- Layered map UI (2D + 3D), time controls, snapshotting
- Provenance-first data model (source, license, cadence, coverage notes)
- Analysis primitives (baseline vs event deltas, annotations, exports)
- Recorder subsystem (reproducible snapshot bundles)
- Offline/disconnected operation
- Collaboration with attribution
- Scenario modeling workspace
- Cloud/AI access path with strict policy + audit logging
- Contextual data intake framework for non-spatial and semi-spatial data domains (trade flows, commodity data, infrastructure dependencies, OSINT events)

### 3.2 Explicitly Out of Scope (Non-Goals)
To reduce misuse and maintain alignment with research/game-theory:

StratAtlas MUST NOT ship:
- Features designed for individual targeting, stalking, or operational pursuit
- "Alert me when asset X appears near Y" for sensitive actors
- Automated "identify covert assets" / hidden affiliation inference
- Integration of leaked/hacked/scraped-against-terms datasets
- Workflows optimized to evade provider protections
- Direct social media scraping or ingestion of raw, unstructured social media content (see Section 7.4.4 for approved alternative)
- Financial trading tools, portfolio analysis, or market prediction features
- Proprietary/paywalled financial data feeds unless explicitly licensed with provenance

---

## 4. Users, Roles, and Governance

### 4.1 Roles (RBAC)
StratAtlas MUST support RBAC roles at minimum:

- Viewer
- Analyst
- Administrator
- Auditor (read-only audit/provenance oversight)

### 4.2 Governance Concepts
- Data Steward (optional role) MAY be defined for layer approval/licensing governance.
- Plugin Reviewer (optional role) MAY be defined for curated marketplace gating.
- Domain Curator (optional role) MAY be defined for contextual data domain onboarding and quality review.

---

## 5. Deployment Profiles
StratAtlas MUST support the following deployment profiles:

1) **Air-gapped workstation** (offline-first; import bundles; no cloud dependency)
2) **On-prem secure network** (local services; controlled egress)
3) **University lab multi-tenant** (tenant isolation; shared compute; reproducibility emphasis)
4) **Cloud-assisted** (optional AI processing via gateway; policy enforced)

Each profile MUST specify: identity, key management, storage placement, audit retention, and whether external AI access is enabled.

### 5.1 Desktop Platform Portability Contract [NEW in v1.2]

StratAtlas MUST preserve desktop portability so Windows implementation choices do not block a later macOS release.

Normative rules:
- Desktop runtime-critical code MUST avoid hard dependencies on Windows-only APIs unless isolated behind a platform adapter.
- Filesystem, paths, process invocation, and environment handling MUST use platform-neutral abstractions (no hard-coded drive letters or path separators in core paths).
- Desktop packaging and runtime behavior MUST be tested on Windows and SHOULD be smoke-tested on macOS throughout development.
- New external dependencies SHOULD be selected only if they support Windows and macOS for the required feature scope.

### 5.2 Installer Lifecycle Contract [NEW in v1.2.2]

Windows desktop distribution MUST provide lifecycle operations for:

- uninstall
- repair (preserve user presets/data)
- full-repair (clean reinstall with backup/restore of user presets/data by default)
- update (install newer approved build)
- downgrade (install older approved build when explicitly requested)

Normative rules:

- Installers MUST support standard uninstall from Windows Apps/Programs.
- A maintenance pathway (installer UX and/or bundled maintenance tool) MUST expose install, uninstall, full-uninstall, repair, full-repair, update, and downgrade operations.
- Standard uninstall MUST preserve user presets/data by default.
- Repair MUST NOT delete user presets/data under application data directories.
- Full-uninstall MUST be explicit and MUST delete binaries plus known user presets/data locations only when requested.
- Full-repair MUST perform clean binary reinstall and MUST provide an explicit option to drop user data.
- Update MUST reject non-newer packages.
- Downgrade MUST be explicit (no silent version rollback) and auditable.
- Installer build outputs MUST increase version monotonically when release artifacts are rebuilt from changed code.
- EXE and installer artifacts produced by the same build MUST carry the same version.
- Release artifacts MUST stage under a governed current-versus-archive layout so the latest installers and portable executable are distinct from historical versions.
- Installer, setup EXE, and portable EXE artifacts under build-target release folders MUST remain gitignored.
- Every shipped release MUST have a governed changelog entry under `.gov/workflow/changelog/`, and the maintenance pathway MUST surface that changelog together with plain-language explanations of lifecycle operations and data-handling differences.

---

## 6. Reference Architecture

### 6.1 Architectural Principles
- Provenance-first and audit-first across all data paths
- Offline-first for analysis artifacts and bundles
- Deterministic replay from bundles and event logs
- Strict trust boundaries for plugins and AI tooling
- Context data is additive enrichment, never primary evidence

### 6.2 Component Model (Logical)
- **Client Workstation UI** (2D/3D, timeline, tools, context panels, exports)
- **Control Plane Service** (RBAC, policy, registries, provenance, audit)
- **Analytics Service** (baseline/delta, queries, aggregation, correlation engine)
- **Context Ingestion Service** (normalizes and indexes contextual data domains)
- **Recorder Service** (bundle creation, hashing, deterministic manifests)
- **Sync Service** (optional; offline merge)
- **Plugin Runtime** (sandboxed)
- **AI Access Gateway** (policy-gated exports + audit)
- **MCP Interface** (optional; standardized tool surface for AI clients)

### 6.3 Storage Model (Normative Baseline)

**Control Plane DB (authoritative):**
- MUST be **PostgreSQL**
- MUST use **PostGIS** for geospatial control-plane entities (AOIs, constraints, footprints)
- MUST store: users/RBAC, layer registry, provenance manifests, policy rules, bundle manifests, audit ledger, contextual domain registry metadata

**Analytic Plane Storage (high volume):**
- SHOULD store observational slices and derived artifacts in columnar form (e.g., Parquet/GeoParquet)
- SHOULD be partitioned by time and source
- MUST be referenceable by bundle manifest + content hashes

**Context Store (time-series + relational):**
- MUST store contextual data domain records (trade flows, commodity prices, infrastructure dependencies, OSINT events) in a format supporting efficient time-range queries
- SHOULD use a columnar or time-series-optimized store (e.g., TimescaleDB extension on PostgreSQL, or partitioned Parquet files indexed by time + domain)
- Context records MUST be linkable to AOIs and time windows via a correlation index (see Section 7.4.2)
- Context records MUST carry provenance and confidence metadata identical in structure to geospatial layers

**Artifact Store:**
- MUST store snapshot bundles and exports as immutable artifacts (append-only corrections via supersedes links)
- Snapshot bundles MUST include active context domain values for the bundle's time window if those domains were enabled at capture time

### 6.4 Visualization Technology Contract [NEW in v1.2]

StratAtlas's visualization stack MUST be composed of open-source, permissively licensed libraries with no vendor lock-in or required proprietary services.

#### 6.4.1 Rendering Architecture

The rendering stack MUST support three coordinated rendering surfaces:

- **2D Map Canvas:** Vector tile rendering with WebGL acceleration; fast pan/zoom; custom styling; AOI drawing and interaction.
- **3D Globe Canvas:** True WGS84 globe with altitude/orbit visualization; time-dynamic animation; 3D Tiles support.
- **GPU Data Layer:** WebGL/WebGPU-accelerated rendering for high-volume analytical overlays (millions of points, arcs, hexbin aggregations, density grids) composited onto either the 2D or 3D canvas.

Switching between 2D and 3D MUST preserve: camera position (projected), active layers, filter state, and time position.

#### 6.4.2 Charting Architecture

The charting stack MUST support:

- **Dashboard charts:** Time-series, bar, pie, scatter, heatmap, sankey, and network graph chart types with Canvas rendering (not SVG) for performance at scale.
- **Custom analytical visualizations:** Scenario trees, ACH matrices, network graphs, and the temporal query builder's visual composer, which require low-level DOM/SVG/Canvas manipulation.
- **Quick analytical charts:** Rapid chart generation from data slices for AI report visualization and exploratory analysis.

All charts MUST support: dark mode, export to PNG/SVG, and integration with the snapshot bundle (chart state captured for deterministic replay).

#### 6.4.3 Spatial Analysis (Client-Side)

StratAtlas MUST provide client-side spatial analysis capabilities (no server round-trip) for: distance measurement, bearing calculation, point-in-polygon testing, buffer zones, and spatial filtering.

StratAtlas SHOULD use hexagonal spatial indexing for density aggregation at multiple resolutions to meet the ≤50ms pan/zoom performance budget with large observation volumes.

#### 6.4.4 Offline Analytics Engine

For air-gapped and offline deployment profiles, StratAtlas MUST provide an in-process analytical query engine capable of executing SQL queries against columnar data (Parquet) without network connectivity. This engine is used for: snapshot bundle exploration, temporal pattern query execution, baseline computation on local data, and context domain querying on cached historical data.

---

## 7. Core Data Model

### 7.1 Canonical Entities
- Organization / Tenant
- User / Role Binding
- Layer (with declared license, cadence, sensitivity class)
- AOI
- Observation (time-stamped)
- Derived Artifact (baseline, delta grids, summaries)
- Event (taxonomy-based)
- Snapshot Bundle (immutable)
- Scenario Fork (mutable, linked to snapshot)
- Briefing Bundle / Export
- AI Report (attached to bundle, fully auditable)
- Game Model (strategic/game-theory)
- Scenario Tree (decision/chance nodes; information sets)
- Experiment Bundle (reproducible model runs)
- Context Domain (registered non-spatial/semi-spatial data source)
- Context Record (time-stamped datum within a context domain, linked to AOIs)
- Infrastructure Node (static facility with dependency relationships)

### 7.2 Sensitivity Markings (Mandatory Everywhere)
Every artifact MUST carry a sensitivity marking and markings MUST propagate through composition and exports.

### 7.3 Provenance (Mandatory Everywhere)
Every layer and derived artifact MUST carry:
- Source name(s), license constraints, retrieval timestamp
- Update cadence expectations
- Transformation lineage (pipeline version)

### 7.4 Contextual Data Intake Framework

#### 7.4.1 Intent and Principles

StratAtlas is primarily a geospatial analysis tool. Contextual data domains — trade flows, commodity prices, infrastructure dependencies, sanctions regimes, OSINT events — exist to **enrich and explain** geospatial patterns, not to replace them. The Contextual Data Intake Framework defines how these non-spatial and semi-spatial data domains are onboarded, stored, correlated, presented, and governed under a single repeatable contract.

**Design principles:**

- **Context is enrichment, not evidence.** Geospatial observations (AIS tracks, ADS-B positions, satellite imagery) are primary evidence. Contextual data provides interpretive context. The UI and briefing outputs MUST maintain this distinction.
- **One contract, many domains.** Every contextual data domain — whether trade flows, commodity prices, or OSINT events — follows the same onboarding, provenance, confidence, and presentation contract. New domains are added by registration, not by spec amendment.
- **Correlation, not fusion.** Context data is correlated to geospatial AOIs and time windows via explicit linkage, not merged into the geospatial observation stream. This preserves data lineage and prevents false precision.
- **Graceful absence.** The system MUST function fully without any contextual domains enabled. Context layers degrade gracefully: if unavailable, the UI shows the geospatial picture with a clear "context unavailable" indicator, never blocks analysis.

#### 7.4.2 Domain Registration Contract

Every contextual data domain MUST be registered in the Control Plane before it can be used. Registration MUST include:

| Field | Description | Required |
|-------|------------|----------|
| `domain_id` | Stable unique identifier | MUST |
| `domain_name` | Human-readable name | MUST |
| `domain_class` | One of: `trade_flow`, `commodity`, `infrastructure`, `osint_event`, `regulatory`, `environmental`, `demographic`, `economic_indicator` | MUST |
| `source_name` | Authoritative data provider(s) | MUST |
| `source_url` | Link to provider and methodology documentation | MUST |
| `license` | License/ToS terms, restrictions on export/redistribution | MUST |
| `update_cadence` | Expected refresh frequency (real-time / daily / weekly / monthly / quarterly / annual / static) | MUST |
| `spatial_binding` | How this domain links to geography: `point` (facility locations), `polygon` (country/region aggregates), `corridor` (route/pipeline), `aoi_correlated` (linked to user-defined AOIs), `non_spatial` (global indicator, no inherent geography) | MUST |
| `temporal_resolution` | Finest time granularity of records (tick / hourly / daily / monthly / quarterly / annual) | MUST |
| `sensitivity_class` | Inherited from or assigned by policy | MUST |
| `confidence_baseline` | Default source reliability rating (A–F per admiralty scale) | MUST |
| `methodology_notes` | How data is collected, processed, verified; known limitations and biases | MUST |
| `offline_behavior` | `pre_cacheable` (static or slow-changing; can be bundled for offline) or `online_only` (requires live connection; degrade gracefully) | MUST |
| `presentation_type` | How this domain renders in the UI: `map_overlay` (points/polygons on map), `sidebar_timeseries` (chart panel correlated to AOI), `dashboard_widget` (comparative dashboard integration), `constraint_node` (scenario workspace input) | MUST |
| `prohibited_uses` | Explicit list of uses this domain MUST NOT support (e.g., "MUST NOT be used for individual entity tracking") | SHOULD |

#### 7.4.3 Correlation Semantics

Context domains are linked to the geospatial picture through explicit correlation, not data fusion.

**Correlation types:**

- **AOI-bound:** Context records are associated with a named AOI. Example: "Oil price index" is correlated to the analyst's "Strait of Hormuz" AOI, displayed as a sidebar time-series.
- **Entity-class-bound:** Context records are associated with a class of entities, not individual entities. Example: "Tanker fleet average age by flag state" is bound to the maritime vessel class, displayed as a tooltip enrichment.
- **Infrastructure-node-bound:** Context records are linked to specific infrastructure nodes. Example: "Refinery throughput" is bound to a refinery point on the map.
- **Region-bound:** Context records are associated with country/region polygons. Example: "Bilateral trade volume" is bound to a country pair.

**Normative rules:**

- Correlation links MUST be explicit and auditable (stored in the control plane, not implicit in the UI).
- Correlation MUST NOT imply causation. The UI MUST label context data as "correlated context" not "explanation" or "cause."
- Analysts MUST be able to enable/disable context correlations per AOI without affecting the geospatial layers.
- When a snapshot bundle is created, active correlation links and their context values MUST be captured in the bundle for reproducibility.

#### 7.4.4 Data Source Requirements and Prohibitions

**Approved source types:**

- Public government data agencies (e.g., UN Comtrade, EIA, USDA, USGS, IEA, Eurostat, WTO, national statistics offices)
- International institutional datasets (e.g., World Bank, IMF Direction of Trade Statistics, FAO)
- Reputable curated OSINT aggregators with declared methodology (e.g., ACLED, GDELT, Uppsala UCDP, Crisis24, GDACS, ReliefWeb)
- Publicly documented infrastructure registries (e.g., EIA plant databases, TeleGeography cable maps, port authority statistics)
- Sanctioned entity lists from official government sources (e.g., OFAC SDN, EU Consolidated List, UN Security Council)

**Prohibited source types:**

- Direct scraping of social media platforms — violates Section 3.2
- Unverified crowdsourced data without editorial/methodological oversight
- Proprietary financial trading data or paywalled market feeds unless explicitly licensed with full provenance
- Feeds that identify or track individual persons, activists, journalists, or private citizens
- Feeds from organizations with documented records of bias, fabrication, or state-directed propaganda
- Any dataset whose terms of service prohibit the intended use

**Rationale:** StratAtlas achieves "ground-truth awareness" through curated, structured, methodology-documented feeds from organizations that have already done the work of filtering, verifying, and geolocating open-source information. This preserves analytical value while respecting provider terms, individual privacy, and the provenance-first data model.

#### 7.4.5 Presentation Contract

Contextual data MUST be presented according to its `presentation_type` declaration:

- **`map_overlay`** — Rendered as discrete points, polygons, or corridors on the map canvas with standard layer controls (toggle, opacity, legend, provenance panel). Used for: infrastructure nodes, OSINT event locations, pipeline routes, sanctions-affected regions.
- **`sidebar_timeseries`** — Rendered as a time-series chart in the right panel or a dedicated context panel, correlated to the active AOI and time window. Used for: commodity prices, trade volumes, port throughput, production indices.
- **`dashboard_widget`** — Rendered as a widget within the Comparative Intelligence Dashboard, aligned to the same time windows as the geospatial comparison. Used for: baseline-vs-event economic context, sanctions timeline overlays.
- **`constraint_node`** — Available as a manipulable element in the Scenario Modeling Workspace. Used for: infrastructure nodes (mark as disrupted), sanctions regimes (toggle on/off), trade routes (block/redirect).

**Normative rules:**

- `sidebar_timeseries` and `dashboard_widget` types MUST NOT be rendered as map points — they are non-spatial or region-aggregate data and rendering them as points creates false spatial precision.
- All context presentations MUST display the source, update cadence, and confidence rating alongside the data.
- Context panels MUST be collapsible/dismissible — they enrich the picture but MUST NOT dominate the geospatial workspace.

#### 7.4.6 Confidence Scoring for Context Domains

Context domains MUST participate in the same confidence framework as geospatial layers (Section 13.3), with the following domain-specific rules:

- **Source reliability:** Assigned per the admiralty scale (A–F) at domain registration. Government statistical agencies typically rate A–B; curated OSINT aggregators typically rate B–C; media-derived event feeds typically rate C–D.
- **Temporal freshness:** Assessed relative to declared `update_cadence`. A monthly trade flow dataset that is 45 days old is stale; a quarterly GDP figure that is 80 days old is not.
- **Corroboration:** Context records corroborated by multiple independent domains receive a confidence boost. Example: a shipping density drop corroborated by both a port throughput decline AND a trade volume decline has higher combined confidence than any single signal.
- **Verification level (OSINT-specific):** OSINT event records MUST carry a verification level (confirmed / reported / alleged). Events with "alleged" verification MUST be visually distinct.

#### 7.4.7 Scenario Integration

Context domains with `presentation_type: constraint_node` MUST be available in the Scenario Modeling Workspace:

- Analysts MUST be able to toggle context constraints on/off (e.g., "impose this sanctions regime," "take this refinery offline").
- The Impact Engine SHOULD trace downstream effects of context constraint changes on geospatial patterns (e.g., "if this pipeline is disrupted, which ports lose throughput and which shipping routes shift?").
- Context constraint modifications in a scenario fork MUST be recorded in the fork's delta log with full provenance (who, when, what assumption).
- Impact propagation results from context constraints MUST be labeled as modeled/estimated, not observed.

#### 7.4.8 Offline Behavior

- Domains marked `pre_cacheable` (static infrastructure, slow-changing reference data, historical trade flows) MUST be available offline.
- Domains marked `online_only` (live commodity prices, real-time OSINT feeds) MUST degrade gracefully: the UI MUST show the last cached value with a staleness indicator (time since last update, expected cadence). The system MUST NOT silently display stale context data as current.
- Snapshot bundles MUST include context domain values at time of capture regardless of offline status — the bundle is self-contained.

#### 7.4.9 Adding New Domains

New contextual data domains are added through the domain registration process (Section 7.4.2), not through spec amendments. The process:

1. Data Steward or Domain Curator evaluates the candidate domain against the source requirements (Section 7.4.4).
2. Domain is registered with all required metadata fields.
3. An ingestion adapter is implemented in the Context Ingestion Service (Section 6.2), conforming to the normalization contract (Section 7.4.2).
4. The domain passes through the standard capability slice definition of done (Section 17) — including provenance, markings, audit, offline behavior, and tests.
5. The domain is added to the Data Domain Registry (Appendix D).

This ensures the spec remains stable while the data catalogue grows.

---

## 8. Audit and Tamper Evidence

### 8.1 Audit Trail
StratAtlas MUST maintain an immutable append-only audit trail of all analyst actions, exports, queries, alerts, collaboration events, AI gateway access, and context domain access/correlation changes.

### 8.2 Tamper Evidence (Strong Recommendation)
Audit logs SHOULD be tamper-evident (hash chaining), exportable for external compliance review.

---

## 9. Recorder and Snapshot Bundles

### 9.1 Recorder Intent
The Recorder exists to:
- Capture "what changed" as reviewable artifacts
- Preserve evidence for peer review and model evaluation
- Enable deterministic replay

### 9.2 Snapshot Bundle Requirements
A Snapshot Bundle MUST contain:
- Data slice (AOI + time window)
- Derived analytics used by the UI (baseline profile, deltas, summaries)
- UI state (layers, filters, camera, legend config)
- Evidence manifest (sources/licenses/timestamps/gaps/transform steps)
- Integrity (content hashes + schema versions)
- **[NEW in v1.1] Bundle asset registry:** each bundle MUST include an `assets[]` list where every file/object has a stable `asset_id` and a `sha256` content hash. `bundle_relative_path` MAY be included for convenience but is non-authoritative.
- **[NEW in v1.1] External reference contract:** all external interfaces (AI Gateway, MCP) MUST reference bundle contents by `(bundle_id, asset_id, sha256)` and MUST NOT rely on filesystem paths.
- Confidence metadata (per-layer/per-observation)
- Active context domain values and correlation links for the bundle's time window

Bundles MUST be immutable once created; corrections MUST be append-only via `supersedes`.

### 9.3 Deterministic Replay
Reopening a bundle MUST restore the view state, derived artifacts, and correlated context data deterministically (within defined tolerances).

---

## 10. Collaboration and Offline-First Sync

### 10.1 Offline Mode
StratAtlas MUST support full offline mode for air-gapped and limited-connectivity environments.

### 10.2 Collaboration Model (Reset Requirement)
For collaborative editing with offline merge:

- Analyst-authored artifacts (AOIs, annotations, SAT docs, scenario assumptions, query graphs) MUST use **merge-safe semantics** (CRDT or equivalent operation-log approach).
- Last-write-wins MAY be used only for ephemeral view state (camera pose, UI toggles).

Session replay MUST be derived from an event log; attribution is mandatory.

### 10.3 Sync Conflict UX
On reconnection, the UI MUST:
- show conflict highlighting
- allow reconcile actions
- preserve full history with attribution

---

## 11. UI/UX Contract

### 11.1 Information Architecture (Stable Regions)
The UI MUST implement stable regions:

- Global header (project, marking, offline/sync state, time mode)
- Left panel (layers + AOI manager)
- Right panel (provenance/coverage/confidence/details + context panel)
- Bottom panel (timeline, compare controls)
- Main canvas (2D/3D map/globe)

### 11.2 Modes (State Machine)
The UI MUST define explicit modes with enabled/disabled controls:
- Live/Recent (policy permitting)
- Replay
- Compare (baseline vs event windows)
- Scenario (fork editing)
- Collaboration (session mode)
- Offline (degraded feed availability)

### 11.3 Golden Flows (Testable UX Sequences)
The spec MUST define golden flows for:
- Baseline → Delta → Snapshot Bundle → Briefing Export
- Fork Scenario → Modify Constraints → Compare → Export Scenario Bundle
- Collaborative Session → Co-edit AOI/Notes → Record → Replay
- Query Builder → Run → Render ephemeral layer → Save/version query
- Context Correlation → Enable domain on AOI → Observe alongside geospatial → Capture in bundle

### 11.4 Evidence/Context/Model/AI Labeling **[NEW in v1.1]**
StratAtlas MUST label every layer, chart, annotation, and exported element as exactly one of:
- **Observed Evidence** (directly observed geospatial data and primary-source facts)
- **Curated Context** (context domains; correlated enrichment)
- **Modeled Output** (Impact Engine, solvers, estimates, simulations)
- **AI-Derived Interpretation** (LLM/ML-generated summaries or inferences)

Rules:
- Labels MUST be visible in the UI (legend/provenance panel) and MUST be preserved in exports.
- Modeled outputs MUST include uncertainty representation (confidence bands, ranges, or scenario spreads) and MUST NOT be presented as observed.
- Curated context MUST be visually and textually distinguished from observed evidence.

### 11.5 Performance Budgets **[NEW in v1.1]**
The spec MUST define measurable performance budgets, tested against reference hardware and reference datasets.

**Reference workstation (baseline):**
- CPU: 12+ cores
- RAM: 64 GB
- GPU: 8 GB VRAM (or better)
- Storage: NVMe SSD

**Reference datasets (baseline):**
- 7 days of observations for a high-traffic AOI (aviation + maritime)
- 10+ concurrent visible layers including at least 2 density/aggregate layers
- 1+ active context dashboard (timeseries)

**Interactive budgets (P95 targets):**
- 2D pan/zoom interaction: **<= 50 ms** frame time while aggregated rendering is active
- Time scrub (warm cache, adjacent windows): **<= 250 ms** end-to-end update
- Time scrub (cold cache): **<= 2.0 s** end-to-end update
- Desktop app startup (cold launch): **<= 8.0 s** to interactive shell
- Desktop app startup (warm relaunch): **<= 3.0 s** to interactive shell
- Analyst state-change feedback (layer toggle/filter/apply action): **<= 300 ms** UI feedback at P95
- Bundle open (local): **<= 5.0 s** to interactive
- 4K image export (map + legend + provenance): **<= 3.0 s**
- Briefing bundle export (including manifests/hashes): **<= 15 s**

If a budget cannot be met, the UI MUST degrade gracefully via aggregation (tiling, clustering, downsampling) and MUST surface a clear indicator that the view is aggregated.
If a state change exceeds the 300 ms feedback target, the UI MUST show non-blocking progress feedback.

### 11.6 Accessibility
StratAtlas SHOULD meet WCAG/508-level accessibility expectations (keyboard operation, non-color-only semantics).

---

## 12. Layer System and Plugins

### 12.1 Layer Contract
Every layer MUST declare:
- source, license, cadence
- geometry type
- sensitivity class
- caching policy

The system MUST surface licensing constraints and prevent exports that violate terms.

### 12.2 Plugin Runtime (Security Boundary)
Plugins MUST NOT run arbitrary code in the main process without sandboxing.  
Network egress MUST be controllable.

### 12.3 Curated Marketplace
A curated plugin marketplace MAY exist; plugins MUST show peer-review status and community rating. Context domain adapters (Section 7.4.9) MAY be distributed through the marketplace.

---

## 13. Analytics Capabilities

### 13.1 Baselines and Deltas
StratAtlas MUST support baseline vs event delta analysis, at minimum density delta grids, and SHOULD support richer comparative dashboards.

The comparative dashboard SHOULD support overlaying context domain time-series alongside geospatial density/flow deltas for the same time window, enabling multi-signal corroboration.

### 13.2 Temporal Pattern Query Builder
StratAtlas MUST provide a composable spatio-temporal query builder whose results render as ephemeral layers; saved queries MUST be version-controlled.

The query builder SHOULD support context-aware queries that combine geospatial predicates with context domain conditions (e.g., "show ports where shipping density dropped >25% vs baseline AND the associated bilateral trade volume for that commodity class also declined >15%").

### 13.3 Confidence Framework
StratAtlas MUST compute and visualize confidence based on source reliability, coverage completeness, freshness, and corroboration. Context domains participate in this framework per Section 7.4.6.

### 13.4 Aggregate Alerts (Ethical Bounds)
Alerts MUST be aggregate/statistical and scoped to AOIs; MUST NOT be entity pursuit alerts.

Alerts MAY reference context domain thresholds (e.g., "notify me if tanker density near a refinery cluster drops below the 15th percentile AND the associated commodity export volume also declines"). Context-correlated alerts MUST follow the same aggregate/statistical rules.

### 13.5 Deviation Detection on Context Domains
StratAtlas SHOULD provide baseline deviation detection on contextual data domains, parallel to geospatial anomaly detection:

- **Trade flow deviation:** Flag when bilateral trade volumes for a commodity/country pair deviate significantly from the historical baseline (e.g., "Russian LNG exports to Germany dropped 80% vs 12-month baseline while exports to China rose 200%").
- **Infrastructure status deviation:** Flag when infrastructure utilization (port throughput, refinery output) deviates from expected patterns.
- **Regulatory regime change:** Flag when a sanctions list update or trade restriction change affects entities/regions within active AOIs.

Deviation events MUST be emitted through the standard Event model, typed under the `context.deviation` taxonomy, and MUST include the baseline reference, deviation magnitude, and confidence score. These events MUST be clearly labeled as derived from context data, not direct geospatial observation.

---

## 14. Scenario Modeling Workspace
StratAtlas MUST support scenario forks linked to parent snapshots, constraint manipulation, hypothetical entities, and scenario comparison/export.

Context domains with `constraint_node` presentation type MUST be available for manipulation in scenario forks per Section 7.4.7. Infrastructure dependency propagation and trade flow redirection modeling are the primary use cases for context-in-scenarios.

---

## 15. AI Integration and MCP Readiness

### 15.1 AI Access Gateway
External AI access MUST be mediated through an AI Access Gateway enforcing:
- authn/authz
- RBAC + marking policy
- licensing/export policy
- full audit logging

### 15.2 AI Outputs
AI outputs MUST:
- be labeled as derived/interpretive
- cite evidence within bundle elements using `(bundle_id, asset_id, sha256)` references (no filesystem paths)
- inherit markings consistent with inputs

### 15.3 MCP Interface (Recommended)
StratAtlas SHOULD provide an MCP server exposing policy-gated, audited tools for external AI systems.

**Design requirements:**

- Tools MUST operate on **bundle IDs and content hashes**, not file paths or raw data streams.
- **[NEW in v1.1] Asset addressing:** if a tool returns or accepts references to bundle contents, it MUST use `(bundle_id, asset_id, sha256)`. A non-authoritative `bundle_relative_path` MAY be included for display only.
- The MCP tool surface MUST include at minimum:
  - `get_bundle_manifest` — retrieve metadata, sources, schema version for a bundle
  - `get_bundle_slice` — retrieve a data slice (observations, derived artifacts) by AOI + time window within a bundle
  - `get_context_values` — retrieve correlated context domain values for a bundle's AOI and time window
  - `submit_analysis` — submit structured findings (JSON) as an AI Report artifact attached to a bundle
  - `list_layers` — enumerate available layers with their provenance and licensing metadata
  - `get_scenario_delta` — retrieve the modification log for a scenario fork
- Every MCP tool invocation MUST be audit-logged with: caller identity, tool name, parameters, timestamp, bundle/artifact references.
- The MCP server MUST enforce the same RBAC, sensitivity marking, and export policies as the UI-facing gateway.
- MCP tools MUST NOT expose raw database queries, file system paths, or internal service endpoints.
- The MCP interface MUST be disable-able per deployment profile (e.g., disabled in air-gapped profiles).

### 15.4 AI + Context Data
AI jobs MAY receive context domain data alongside snapshot bundles for correlation analysis. AI-generated correlations between geospatial patterns and context data MUST be labeled as inferred, not confirmed, and MUST cite the specific bundle elements and context records used.

### 15.5 AI Copilot Integration [NEW in v1.2]

#### 15.5.1 Intent

The AI Copilot is an in-workspace analyst assistant that transforms AI from a batch processing tool into a real-time analytical partner. It observes the analyst's current view, data, and context, and provides proactive assistance — always under analyst control, always labeled, always auditable.

The Copilot MUST use the same MCP interface (Section 15.3) and AI Access Gateway (Section 15.1) as external AI clients. It is architecturally an internal AI client, not a privileged system component.

#### 15.5.2 Copilot Capabilities

The Copilot SHOULD support the following assistance modes:

- **Narration:** Summarize the current view state in natural language ("Shipping density in your AOI dropped 34% vs baseline. The largest contributor is the tanker class, which fell 52%. Port throughput at Ras Tanura also declined 28% over the same period.").
- **Anomaly Explanation:** When the Recorder flags an event, provide candidate explanations drawn from context domains, OSINT feeds, and historical baselines.
- **Query Suggestion:** Based on the current view and active anomalies, suggest temporal pattern queries the analyst might want to run.
- **SAT Pre-Population:** When an analyst opens an ACH matrix or I&W checklist, pre-fill hypotheses and evidence linkages from the active snapshot. All entries MUST be labeled AI-Derived Interpretation and require analyst acceptance before becoming part of the analytical record.
- **Scenario Hypothesis Generation:** When an analyst forks a scenario, suggest constraint modifications and their likely impact based on historical patterns and context domain data.
- **Briefing Draft Generation:** Generate first-draft executive summaries and delta narratives for briefing bundles from snapshots, annotations, and delta analysis. Analyst MUST review and approve before export.
- **Multi-Bundle Correlation:** Identify patterns and connections across multiple snapshot bundles and time windows that an analyst working serially might miss.

#### 15.5.3 Interaction Surface

The Copilot MUST be presented as:

- A **collapsible sidebar panel** in the UI (right panel region, below or tabbed alongside provenance/confidence).
- Copilot suggestions MUST be clearly separated from observed data and analyst annotations.
- The panel MUST show the provenance of each suggestion (which bundle elements, context records, and model were used).

The Copilot MUST NOT:

- Automatically modify annotations, AOIs, scenario forks, or any analyst-authored artifact.
- Auto-submit briefing narratives or SAT template entries without explicit analyst approval.
- Operate silently — every Copilot action MUST be visible in the sidebar panel.

#### 15.5.4 Approval Workflow

All Copilot outputs follow a consistent approval pattern:

1. Copilot generates suggestion (narration, query, SAT entry, briefing draft, etc.)
2. Suggestion appears in sidebar panel, labeled **AI-Derived Interpretation**
3. Analyst reviews and takes one of:
   - **Accept** — suggestion becomes part of the analytical record (annotation, query, SAT entry), retaining its AI-Derived label
   - **Modify** — analyst edits the suggestion; modified version is attributed to the analyst with a note that it originated from AI assistance
   - **Reject** — suggestion is dismissed; the rejection is logged for model feedback
4. Accepted/modified outputs inherit the same audit trail as analyst-authored artifacts

#### 15.5.5 Deployment Profile Rules

| Profile | Copilot Availability |
|---------|---------------------|
| Air-gapped workstation | DISABLED (no external AI access) |
| On-prem secure network | ENABLED only if a local LLM endpoint is configured and approved by administrator |
| University lab multi-tenant | ENABLED via gateway with per-tenant policy |
| Cloud-assisted | ENABLED via AI Access Gateway |

When disabled, the Copilot sidebar MUST be hidden (not grayed out). The system MUST function identically without it.

#### 15.5.6 Audit Requirements

- Every Copilot interaction MUST be logged in the audit trail: prompt sent, response received, analyst action (accept/modify/reject), timestamp.
- Copilot audit logs MUST be accessible to the Auditor role.
- If the Copilot pre-populates a SAT template, the audit log MUST record which bundle elements were used as input and which model generated the output.

#### 15.5.7 Continuous Monitoring Mode (Phase 2+)

StratAtlas MAY support a Continuous Monitoring mode where the Copilot watches enabled feeds and context domains in the background and surfaces insights:

- Correlated signal detection across geospatial and context domains
- Saved query match notifications
- Baseline deviation clustering ("these 3 anomalies in the last 6 hours may be related")

Continuous Monitoring MUST follow the same aggregate/statistical rules as the Alert Framework (Section 13.4): no individual entity tracking, AOI-scoped only. Insights MUST be presented as suggestions, not as autonomous actions.

---

## 16. Event Taxonomy

StratAtlas MUST define a structured event taxonomy for the Recorder subsystem. The taxonomy MUST be extensible but MUST include at minimum:

**Geospatial events:**
- `geo.density_spike` / `geo.density_drop` — significant deviation from baseline density
- `geo.route_diversion` — entity or entity class deviating from expected route
- `geo.darkening_cluster` — AIS/ADS-B signal loss cluster (labeled as coverage event, not behavioral inference)
- `geo.loiter_pattern` — unusual loiter/hold behavior within an AOI
- `geo.feed_outage` — data feed degradation or loss (operational event)

**Infrastructure events:**
- `infra.disruption` — reported or inferred disruption to a critical infrastructure facility
- `infra.status_change` — publicly reported change in operational status
- `infra.throughput_deviation` — infrastructure utilization deviating from baseline

**OSINT events:**
- `osint.conflict_event` — conflict or political violence event from curated feed
- `osint.security_advisory` — security incident or advisory from vetted feed
- `osint.natural_disaster` — natural disaster or humanitarian event from vetted feed

**Context deviation events:**
- `context.trade_flow_deviation` — bilateral trade volume deviating from baseline
- `context.commodity_price_deviation` — commodity price deviating from expected range
- `context.regulatory_change` — sanctions, embargo, or trade restriction change
- `context.supply_chain_shift` — detected redirection of supply chain flows

**System events:**
- `system.export` — data exported from the system
- `system.ai_job` — AI analysis job submitted or completed
- `system.sync` — offline/online sync event

---

## 17. Capability Slice Definition of Done
A capability slice is "Done" only if it includes:

1) **UX contract** (mode(s), controls, golden flow)
2) **Data model** (schemas, indices, versioning)
3) **Storage implementation** (control plane + artifact references)
4) **Provenance + markings** propagation
5) **Audit coverage** (who/what/when; export & query logging)
6) **Offline behavior** (what works offline, sync semantics, conflict UX)
7) **Determinism guarantees** (bundle replay/export)
8) **Performance budget + tests**
9) **Threat model notes** (plugin/AI boundaries where relevant)
10) **Schemas** **[NEW in v1.1]** (any MUST-level artifact introduced or modified by the slice MUST have a JSON Schema in Appendix B)

**Normative addition:** Each iteration (Section 19) MUST reference a **detailed capability sub-spec** that contains the full requirements for that slice (UX wireframes, data schemas, API contracts, query examples, edge cases). The top-level spec defines the contract; sub-specs define the implementation requirements. **[NEW in v1.1]** Sub-specs MUST also include schema deltas and API/interface deltas for any affected artifact types.

**Normative addition [NEW in v1.2.3]:** A single iteration MAY be executed through multiple sequenced Work Packets when an activation packet delivers partial scaffolding and one or more follow-on packets are required to close Section 17 obligations. Governance artifacts MUST identify the active packet set, the current blocking packet, and the requirements still in progress.

**Normative addition [NEW in v1.2.4]:** When a follow-on packet fully replaces an earlier activation or governance-baseline packet, governance artifacts MAY mark the earlier packet as `SUPERSEDED`. `SUPERSEDED` preserves proof and successor references for historical traceability, but it is not a done state and MUST NOT be used to claim capability completion.

---

## 18. Release Gates (Pilot Eligibility)
Release Gates define deployment eligibility; they are not feature scope.

### Gate A — Misuse Constraints
Non-goals MUST be enforced across UI/API/plugins/exports.

### Gate B — Provenance & Reproducibility
Snapshot bundles MUST reopen deterministically with complete evidence manifests.

### Gate C — Security & Governance
RBAC + audit trail + sensitivity marking + export controls MUST be in place.

### Gate D — Offline Operability
Core analysis on saved projects/bundles MUST function offline with explicit UI state.

### Gate E — Performance
Must meet defined time-scrub latency and pan/zoom responsiveness on reference datasets.

### Gate F — Context Integrity
Context domain data MUST carry provenance, MUST degrade gracefully when unavailable, and MUST NOT be presented as primary evidence.

### Gate G — AI Safety
If AI integration is enabled (I6+):
- All AI outputs labeled **AI-Derived Interpretation** per Section 11.4
- Copilot cannot modify artifacts without explicit analyst approval
- Copilot audit logging operational and verified
- Misuse constraints (Section 3.2) enforced in AI prompts and outputs

### Gate H — Desktop Portability & Startup
- Desktop startup budgets from Section 11.5 MUST be met on reference hardware.
- Build/runtime path handling MUST remain platform-neutral (Windows + macOS portability preserved).
- No new Windows-only dependency may be introduced in core runtime paths without approved platform abstraction and roadmap impact note.
- Windows installer lifecycle operations from Section 5.2 (uninstall, repair, full-repair, update, downgrade) MUST be available and validated.


---

## 19. Iteration Plan (Non-MVP)
Iterations are defined as **capability slices** that satisfy Section 17. Each iteration MUST produce a detailed sub-spec before implementation begins.

Execution note [NEW in v1.2.3]:
- An iteration may have a primary activation packet plus one or more follow-on recovery packets.
- Follow-on packets do not change the build order by default; they complete the iteration already in sequence.
- If governance determines that a prior packet only delivered prototype or activation-shell behavior, requirement status MUST be downgraded until the follow-on packet closes the remaining normative gaps.

Example ordering (modifiable):
- I0: Walking skeleton (bundle creation + reopen + audit + markings + offline open + startup instrumentation + portability baseline)
- I1: Layer system + time/replay + deterministic export + startup/interaction tuning
- I2: Baseline/delta compare + briefing bundle
- I3: Collaboration + CRDT merge + session replay
- I4: Scenario modeling + constraint propagation + scenario export
- I5: Query builder + saved/versioned queries
- I6: AI gateway + MCP interface + hardened tool surface + AI Copilot (narration, query suggestion, briefing draft)
- I7: Context intake framework + first domains (critical infrastructure + trade flows)
- I8: Context deviation detection + infrastructure dependency propagation in scenarios
- I9: OSINT event feeds + economic indicators + full context-aware queries
- I10: Strategic game modeling (actors/actions/payoffs, scenario trees, robustness, value-of-information, experiment bundles)


**Note:** Copilot Continuous Monitoring mode (Section 15.5.7) is Phase 2+ and is not assigned to a numbered iteration.

---

## 20. Strategic Game Modeling Framework **[NEW in v1.1]**

### 20.1 Intent
StratAtlas MUST support strategic / game-theoretic analysis by enabling analysts to define actors, actions, objectives, beliefs, and payoff proxies; explore scenario trees; and evaluate robustness across uncertainty.

This framework MUST operate at aggregate strategic levels and MUST NOT enable individual targeting or operational pursuit workflows.

### 20.2 Game Model Artifact
StratAtlas MUST define a **Game Model** artifact that is versioned, auditable, and exportable. At minimum it MUST include:

- `game_id`, `name`, `created_by`, `created_at`
- `actors[]` (e.g., state, bloc, institution, industry-coalition; no individual persons)
- `objectives[]` (multi-objective; weighted; explicit definitions)
- `actions[]` (non-tactical action library; policy/logistics/signaling abstractions)
- `information_model` (what is known/unknown; evidence/confidence inputs; belief updates)
- `payoff_model` (payoff proxies linked to observed/context indicators)
- `assumptions[]` (explicit; versioned; auditable; linked to evidence where available)
- `links_to_snapshot_bundles[]` (evidence basis; reproducibility anchors)
- `solver_config` (methods, seeds, parameter ranges)

Game Models MUST carry provenance, confidence annotations, and sensitivity markings consistent with inputs.

### 20.3 Game Types
StratAtlas SHOULD support multiple strategic game types, including:
- **Normal-form** (static strategic interaction)
- **Extensive-form (scenario trees)** (sequential decisions, chance nodes)
- **Stochastic games** (repeated interaction under uncertainty)

### 20.4 Scenario Trees and Information Sets
StratAtlas MUST support scenario trees composed of:
- decision nodes (actor choices)
- chance nodes (exogenous shocks such as disasters, weather, regulatory changes)
- information sets (belief states conditioned on evidence confidence)

Scenario tree branches MUST be exportable and replayable, and MUST link to Scenario Fork artifacts (Section 14) where map-state modifications are required.

### 20.5 Payoff Proxies
Payoffs MUST be expressed as modeled proxies derived from:
- trade flow and commodity indicators (context domains)
- infrastructure throughput/utilization indicators (context + static infrastructure)
- geospatial flow continuity and congestion metrics (derived analytics)
- regulatory regime changes and curated OSINT event indicators (where enabled)

Payoff outputs MUST include uncertainty bounds and MUST be labeled as **Modeled Output** (Section 11.4).

### 20.6 Solvers and Evaluation
StratAtlas SHOULD support evaluation mechanisms such as:
- best-response analysis
- equilibrium exploration (where feasible for the model size)
- robust planning summaries (e.g., minimax regret)

Solver runs MUST be audit-logged and MUST record: inputs (bundle IDs/hashes), solver configuration, random seeds, and outputs.

### 20.7 Robustness and Sensitivity
StratAtlas SHOULD support:
- parameter sweeps and Monte Carlo over uncertain inputs
- sensitivity ranking of assumptions ("which assumptions drive outcomes")
- scenario spread visualization (how outcomes change across uncertainty)

### 20.8 Value of Information
StratAtlas SHOULD estimate which additional evidence or context data would most reduce uncertainty in competing hypotheses, expressed as aggregate recommendations (e.g., "port throughput coverage for region R would reduce uncertainty in hypothesis H by X").

### 20.9 Reproducible Experiment Bundles
StratAtlas SHOULD support an **Experiment Bundle** artifact distinct from Snapshot Bundles. It SHOULD:
- reference one or more Snapshot Bundles as inputs
- include the Game Model version, solver configuration, parameter ranges, and seeds
- store output tables/plots plus a results manifest with hashes

This enables research-grade reproducibility for academic and government peer review.

### 20.10 Guardrails
The strategic modeling framework MUST:
- restrict actor granularity to non-individual entities
- restrict actions to strategic/policy/logistics abstractions
- label outputs as modeled/interpretive and non-operational
- maintain full audit trails for model edits and solver runs
- preserve the separation between observed evidence, curated context, modeled output, and AI-derived interpretation (Section 11.4)

---

## Appendix A: Glossary

| Term | Definition |
|------|-----------|
| AOI | Area Of Interest (user-defined region; polygon or preset). |
| Layer | A visual dataset rendered on the map (tracks, points, polygons, heatmaps, rasters). |
| Feed | A time-updating source that produces observations (aviation positions, AIS, TLE/orbits, etc.). |
| Observation | A single time-stamped data point about an entity (position, speed, heading, altitude). |
| Baseline | Reference activity profile computed over a historical window. |
| Event Window | User-selected time range for analysis (often before/after comparisons). |
| Anomaly | A deviation from baseline or expected constraints, expressed as a scored event. |
| Snapshot | A time-frozen capture of state (data + UI config + derived analytics + provenance). |
| Briefing Bundle | An exportable package (maps/views + notes + sources) meant for sharing/review. |
| Scenario Fork | A mutable copy of a snapshot used for what-if modeling. |
| Game Model | Formal strategic model defining actors, actions, objectives, information, payoff proxies, and solver configuration. |
| Scenario Tree | Extensive-form branching structure of decisions/chance nodes and information sets linked to scenario forks. |
| Payoff Proxy | Modeled metric derived from observed and/or context indicators used in utility computation. |
| Information Set | Specification of what an actor observes/knows at a decision point, conditioned on evidence confidence. |
| Experiment Bundle | Reproducible artifact capturing model version, parameters, seeds, and outputs linked to snapshot bundles. |
| Modeled Output | Results produced by solvers/Impact Engine rather than observed evidence; must be labeled and uncertainty-bounded. |
| Confidence Score | Quantified reliability metric based on source, coverage, freshness, corroboration. |
| Sensitivity Marking | Classification label on any artifact (e.g. PUBLIC / INTERNAL / RESTRICTED). |
| Entity Resolution | Probabilistic linking of observations to a single real-world entity across feeds. |
| Critical Infrastructure | Publicly documented physical assets essential to national/regional function (energy, water, comms, transport). |
| OSINT Event Feed | Structured, curated event data from reputable open-source intelligence aggregators with declared methodology. |
| Economic Context Indicator | Non-spatial time-series data (commodity prices, trade volumes, sanctions) correlated to geospatial AOIs. |
| Context Domain | A registered non-spatial or semi-spatial data source that enriches geospatial analysis. |
| Context Record | A single time-stamped datum within a context domain, linked to AOIs via correlation. |
| Correlation Link | An explicit, auditable association between a context domain and a geospatial AOI or entity class. |
| Domain Curator | Optional role responsible for evaluating and onboarding contextual data domains. |
| Capability Slice | A vertical module that is only "done" when it satisfies the full definition of done (Section 17). |
| Release Gate | An eligibility criterion for deployment; a system property, not a feature. |


---

## Appendix B: Schemas
All MUST-level artifacts MUST have a JSON Schema (or equivalent machine-readable schema) defined here.
- `manifest.json` schema (bundle)
- audit ledger schema
- layer registry schema
- query graph schema
- scenario fork schema
- context domain registration schema
- context record schema
- correlation link schema
- event taxonomy schema
- bundle asset registry schema (`assets[]`: `asset_id`, `sha256`, media type, size, optional `bundle_relative_path`)
- AI report artifact schema
- copilot interaction log schema
- copilot suggestion schema (`type`, `content`, `source_refs`, `model_id`, `analyst_action`, `timestamp`)
- game model schema
- scenario tree schema
- experiment bundle schema
- performance budget configuration schema (reference hardware + dataset + metrics)

---

## Appendix C: Threat Model Sketch
- plugin sandbox threats
- AI/tool injection threats (including MCP tool surface)
- AI Copilot prompt injection threats (analyst workspace context leaking into prompts)
- Copilot over-reliance risk (analysts treating AI suggestions as ground truth despite labeling)
- Local LLM endpoint security in on-prem profiles
- export exfiltration threats
- offline device compromise assumptions
- context domain poisoning (malicious or manipulated upstream data)
- OSINT feed reliability degradation (source methodology changes without notice)

---

## Appendix D: Data Domain Registry

This appendix catalogues approved and planned contextual data domains. New domains are added through the registration process defined in Section 7.4.9, not through spec amendments.

### D.1 Tier 1 — High Priority (Target: I7–I8)

| Domain | Class | Primary Sources | Spatial Binding | Temporal Resolution | Offline | Presentation |
|--------|-------|----------------|-----------------|--------------------|---------|----|
| Oil & Gas Refineries | `infrastructure` | EIA, EU JRC, national energy agencies | `point` | Static (annual refresh) | Pre-cacheable | Map overlay + constraint node |
| Major Pipelines | `infrastructure` | EIA, GIE, national mapping agencies | `corridor` | Static (annual refresh) | Pre-cacheable | Map overlay + constraint node |
| LNG Terminals | `infrastructure` | GIIGNL, EIA, ICIS (public) | `point` | Static (quarterly refresh) | Pre-cacheable | Map overlay + constraint node |
| Power Plants | `infrastructure` | EIA, EU JRC, WRI Global Power Plant DB | `point` | Static (annual refresh) | Pre-cacheable | Map overlay |
| Undersea Cables | `infrastructure` | TeleGeography Submarine Cable Map | `corridor` | Static (quarterly refresh) | Pre-cacheable | Map overlay + constraint node |
| Bilateral Trade Flows | `trade_flow` | UN Comtrade, IMF DOTS, WTO | `region_bound` (country pairs) | Monthly / Quarterly | Pre-cacheable (historical); online for latest | Sidebar timeseries + dashboard widget |
| Commodity Prices (Oil, Gas, Grain, Metals) | `commodity` | EIA, World Bank Commodity Markets, IMF | `non_spatial` (correlated to AOIs) | Daily / Weekly | Online only (degrade gracefully) | Sidebar timeseries + dashboard widget |
| OFAC / EU / UN Sanctions Lists | `regulatory` | OFAC SDN, EU Consolidated List, UN SC | `region_bound` + `entity_class_bound` | Event-driven (updated on change) | Pre-cacheable (snapshot) | Map overlay (affected regions) + constraint node |
| Port Throughput Statistics | `economic_indicator` | Port authorities (public reports), UNCTAD | `point` (port locations) | Monthly / Quarterly | Pre-cacheable (historical) | Sidebar timeseries + map overlay enrichment |

### D.2 Tier 2 — Medium Priority (Target: I9+)

| Domain | Class | Primary Sources | Spatial Binding | Temporal Resolution | Offline | Presentation |
|--------|-------|----------------|-----------------|--------------------|---------|----|
| ACLED Conflict Events | `osint_event` | ACLED | `point` | Weekly | Pre-cacheable (historical) | Map overlay |
| GDELT Event Data | `osint_event` | GDELT Project | `point` | Daily | Online only | Map overlay |
| Crisis24 Security Advisories | `osint_event` | Crisis24 | `point` / `polygon` | Event-driven | Online only | Map overlay |
| Natural Disaster Events | `osint_event` | GDACS, ReliefWeb | `point` / `polygon` | Event-driven | Online only | Map overlay |
| Commodity Production (Oil, Grain) | `commodity` | OPEC, IEA, USDA, FAO | `region_bound` | Monthly | Pre-cacheable | Sidebar timeseries |
| Strategic Reserves | `infrastructure` | IEA, EIA (SPR data) | `point` | Monthly | Pre-cacheable | Map overlay |
| Critical Mineral Supply Chains | `trade_flow` | USGS, EU CRM Reports, BGS | `region_bound` | Annual / Quarterly | Pre-cacheable | Sidebar timeseries + dashboard widget |
| Dams & Reservoirs | `infrastructure` | ICOLD, national dam registries | `point` | Static | Pre-cacheable | Map overlay + constraint node |
| Data Center Clusters | `infrastructure` | Public reports, national mapping | `point` (metro-level) | Static (annual) | Pre-cacheable | Map overlay |
| Desalination Plants | `infrastructure` | IDA, national water agencies | `point` | Static | Pre-cacheable | Map overlay + constraint node |

### D.3 Tier 3 — Future Consideration

| Domain | Class | Primary Sources | Notes |
|--------|-------|----------------|-------|
| FDI / Infrastructure Finance | `economic_indicator` | OECD, AidData, national investment agencies | Tracks who is building what where; slow-changing; high strategic value for long-term analysis |
| Treaty & Agreement Status | `regulatory` | UN Treaty Collection, bilateral agreement databases | Defense agreements, basing rights, access agreements; renders as region overlays |
| Climate & Environmental Stress | `environmental` | NOAA, Copernicus, FEWS NET | Drought indices, sea level, crop yield forecasts; slow-changing; high value for university clients |
| Rail Network Trunk Lines | `infrastructure` | OpenStreetMap (licensed), national rail agencies | Transport chokepoint analysis; complement to maritime/aviation |
| Intermodal Logistics Hubs | `infrastructure` | National transport agencies, port authorities | Where port, rail, and road converge; scenario workspace integration |
| Currency & Sovereign Risk | `economic_indicator` | IMF, World Bank, public indices | Contextual for trade flow interpretation; present as dashboard widget only |
| Satellite Ground Stations | `infrastructure` | Public registries, UCS Satellite Database | Space domain enrichment; static points |

### D.4 Registry Governance

- New domains MUST be evaluated by a Data Steward or Domain Curator before registration.
- Each domain MUST pass the source requirements check (Section 7.4.4) before onboarding.
- Domain registrations MUST be reviewed annually for: source reliability changes, license/ToS changes, methodology changes, and continued analytical relevance.
- Deprecated domains MUST be marked as `deprecated` in the registry with a sunset date; existing bundles referencing deprecated domains MUST remain valid (data is frozen in the bundle).

---

## Appendix E: Change Log

| Version | Date | Summary |
|---------|------|---------|
| v0.1 | 2026-02-xx | Initial goals document. |
| v0.2 | 2026-03-04 | Spec conversion with structured requirements, recorder subsystem, cloud AI access. |
| v0.3 | 2026-03-04 | Added: Scenario Modeling, Query Builder, Collaboration, Alert Framework, Confidence Framework, Sensitivity Markings, Audit Trail, Offline Mode, Entity Resolution, Plugin Marketplace, SAT Templates, Comparative Dashboard, Auditor role. |
| v0.4 | 2026-03-04 | Added: Critical Infrastructure Layer, Curated OSINT Event Feeds, Economic Context Indicators, Infrastructure Dependency Propagation. |
| v1.0-reset | 2026-03-04 | Architecture reset: dropped MVP, introduced Release Gates + Capability Slices, CRDT collaboration, deployment profiles, storage model, UI/UX contract, MCP interface. |
| v1.0 | 2026-03-04 | Added: Contextual Data Intake Framework (Section 7.4), Context Store in storage model, expanded MCP tool surface, Event Taxonomy (Section 16), Data Domain Registry (Appendix D), deviation detection on context domains, context-aware queries and alerts, Release Gate F, capability sub-spec requirement, I7–I9 iterations. |
| v1.1 | 2026-03-04 | Added: Strategic Game Modeling Framework (Section 20); tightened bundle asset addressing (asset_id + sha256); added Evidence/Context/Model/AI labeling; added explicit performance budgets; strengthened schema requirements. |
| v1.2 | 2026-03-04 | Added: AI Copilot Integration (Section 15.5) with narration, query suggestion, SAT pre-population, briefing draft, and continuous monitoring. Added: Visualization Technology Contract (Section 6.4) defining rendering, charting, spatial analysis, and offline analytics engine requirements. Added Gate G (AI Safety). |
| v1.2.1 | 2026-03-05 | Added desktop startup budgets and state-change feedback budget (Section 11.5). Added desktop portability contract for Windows→macOS path (Section 5.1). Added Gate H (Desktop Portability & Startup). |
| v1.2.2 | 2026-03-06 | Added installer lifecycle contract for Windows distribution (Section 5.2): uninstall, repair, full-repair, update, downgrade. Extended Gate H to require installer lifecycle validation. |
| v1.2.3 | 2026-03-06 | Clarified that iterations may use multiple sequenced Work Packets when activation scaffolding does not yet satisfy the capability-slice definition of done. Added governance-realignment language for follow-on recovery packets and requirement-status correction. |
| v1.2.4 | 2026-03-06 | Added the `SUPERSEDED` governance status so replaced activation and governance-baseline Work Packets can close truthfully with retained evidence and explicit successor references. |
| v1.2.5 | 2026-03-09 | Expanded the Windows installer contract with install, full-uninstall, governed release current/archive layout, gitignored release binaries, governed changelog entries, and a maintenance menu/help surface that explains lifecycle options and data-handling semantics. |
