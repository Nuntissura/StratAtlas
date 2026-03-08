# StratAtlas - Technology Stack

**Spec Version:** v1.2.4  
**Last Updated:** 2026-03-08  
**Status:** This document defines the governed target architecture. As of 2026-03-08, `.product/Worktrees/wt_main` has `E2E-VERIFIED` governed desktop proof for the control-plane backbone (`WP-I0-003`), the real MapLibre/Cesium runtime surface (`WP-I1-003`), comparative analytics and briefing runtime (`WP-I2-003`), DuckDB-backed query execution (`WP-I5-002`), the live AI gateway plus audited MCP runtime (`WP-I6-002`), governed context ingestion (`WP-I7-002`), governed deviation detection (`WP-I8-002`), governed curated connector alerts (`WP-I9-002`), and the solver-backed strategic modeling runtime (`WP-I10-002`). Remaining open debt is now cross-cutting gate evidence in startup/performance, export timing, accessibility, and macOS portability rather than missing I0-I10 runtime seams.

---

## Decision Criteria

Every technology choice must satisfy:
1. **Open-source with permissive license** (Apache 2.0 or MIT preferred; no AGPL in core)
2. **Actively maintained** (commits in last 6 months, responsive issue tracker)
3. **Proven at scale** (used in production by organizations with similar data volumes)
4. **Offline-capable** (must work in air-gapped deployment profile or degrade gracefully)
5. **No vendor lock-in** (no required proprietary services or API keys)
6. **Startup and interaction performant** (supports startup + state-change budgets in spec §11.5)
7. **Desktop-portable** (does not block Windows-to-macOS portability for runtime-critical paths)

---

## Geospatial Rendering

### MapLibre GL JS — Primary 2D Map Engine

| Attribute | Value |
|-----------|-------|
| License | BSD-3-Clause |
| Role | 2D vector map rendering, basemap, AOI drawing, spatial interaction |
| Why chosen | Community-maintained Mapbox GL fork; no API key required; globe view support; native vector tile rendering; integrates with deck.gl |
| Alternatives considered | OpenLayers (heavier, less modern rendering), Leaflet (no WebGL, poor at scale) |
| Risks | Globe view is newer than CesiumJS globe; for 3D, CesiumJS remains primary |
| Spec alignment | §11.1 main canvas (2D), §11.5 ≤50ms pan/zoom budget |

### CesiumJS — 3D Globe Engine

| Attribute | Value |
|-----------|-------|
| License | Apache 2.0 |
| Role | 3D globe visualization, altitude/orbit rendering, time-dynamic scenes |
| Why chosen | De facto standard for global-scale 3D; WGS84 native; 3D Tiles (OGC standard); time animation built-in; aerospace/defense heritage |
| Alternatives considered | OpenGlobus (less mature), Three.js (no geo primitives), mapray.js (Sony, smaller community) |
| Risks | Cesium ion (commercial service) is optional — StratAtlas MUST NOT require it. Self-hosted tile serving only. |
| Spec alignment | §11.1 main canvas (3D), space object visualization |

### deck.gl — GPU-Accelerated Overlay Layers

| Attribute | Value |
|-----------|-------|
| License | MIT |
| Role | High-performance data layer rendering (millions of points, arcs, heatmaps, hexbins) |
| Why chosen | WebGL/WebGPU rendering; composable layer architecture; integrates with both MapLibre and CesiumJS; handles AIS/ADS-B point volumes |
| Alternatives considered | Kepler.gl (built on deck.gl but opinionated UI; better as reference than dependency) |
| Risks | WebGPU transition in progress; WebGL fallback must be maintained for older hardware |
| Spec alignment | §11.5 performance budgets, §13.1 density grids, heatmaps |

### How They Compose

```
┌─────────────────────────────────────┐
│  MapLibre GL JS (2D basemap)        │  ← Vector tiles, styling, AOI drawing
│  ┌─────────────────────────────┐    │
│  │  deck.gl (GPU overlay)      │    │  ← AIS tracks, density hexbins, flow arcs
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  CesiumJS (3D globe)                │  ← Orbits, altitude tracks, terrain
│  ┌─────────────────────────────┐    │
│  │  deck.gl (GPU overlay)      │    │  ← Same data layers, 3D projection
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘

Shared viewport state → switching 2D ↔ 3D preserves camera position and layer config
```

### I1 Execution Profile (2026-03-07)

- `WP-I1-003` now treats MapLibre GL JS as the default analyst surface and CesiumJS as the purposeful 3D mode, with governed cold/warm Tauri smoke proof recorded under `.product/build_target/tool_artifacts/wp_runs/WP-I1-003/20260307_045256/runtime_smoke/`.
- deck.gl remains an optional follow-on for denser analytic overlay passes, but the current verified runtime does not block 3D delivery on full deck.gl/Cesium feature parity.
- Current approved map-polish candidates after the core runtime are Terra Draw for AOI editing and measurement, and `maplibre-gl-compare`-style split comparison behavior, both drawn from the governance research packet rather than adopted blindly.
- Borrowed UX references such as kepler.gl, TerriaJS, and MapStore2 are guidance inputs only; they are not runtime dependencies.

---

## Charting and Dashboard Visualization

### Apache ECharts — Primary Charting Library

| Attribute | Value |
|-----------|-------|
| License | Apache 2.0 |
| Role | Sidebar time-series, comparative dashboard, briefing export charts |
| Why chosen | 50+ chart types; Canvas rendering (handles large datasets without SVG DOM thrashing); streaming data support; real-time updates; built-in GeoJSON map series; accessibility features; i18n; dark mode; active Apache Foundation maintenance |
| Alternatives considered | Recharts (React-only, SVG, slow above 10K points), Chart.js (fewer chart types, weaker at complex dashboards), Highcharts (commercial license) |
| Risks | API complexity is higher than simpler libraries; team needs initial ramp-up time |
| Spec alignment | §7.4.5 sidebar_timeseries and dashboard_widget presentation types, §13.1 comparative dashboard |

### D3.js — Custom Visualization Foundation

| Attribute | Value |
|-----------|-------|
| License | ISC (BSD-style) |
| Role | Custom analytical visualizations that have no standard chart type: scenario trees, ACH matrices, network graphs, temporal query builder visual composer |
| Why chosen | Unlimited customization; industry standard; SVG/Canvas/HTML manipulation; massive ecosystem |
| Alternatives considered | Nothing — D3 is the only option for truly custom interactive visualizations |
| Risks | Steep learning curve; not for standard charts (use ECharts for those) |
| Spec alignment | §20.4 scenario trees, §5.8.1 (v0.3) SAT templates, §13.2 query builder |

### Observable Plot — Quick Analytical Charts

| Attribute | Value |
|-----------|-------|
| License | ISC |
| Role | Rapid chart generation from data slices; AI report visualization; exploratory analysis |
| Why chosen | Built on D3 with dramatically simpler API; grammar-of-graphics approach; good for "sketch a chart from this query result" workflows |
| Alternatives considered | Vega-Lite (similar role but heavier; Plot is lighter for embedding) |
| Risks | Less mature than D3/ECharts; community smaller |
| Spec alignment | §15.4 AI report artifact visualization |

---

## Spatial Analysis (Client-Side)

### Turf.js — Geospatial Analysis

| Attribute | Value |
|-----------|-------|
| License | MIT |
| Role | Client-side spatial operations: buffer, distance, bearing, point-in-polygon, convex hull |
| Why chosen | Standard JS geospatial analysis library; no server round-trip needed; works offline |
| Spec alignment | §13.8 (v0.3) measure tools, spatial filtering |

### H3 — Hexagonal Spatial Index

| Attribute | Value |
|-----------|-------|
| License | Apache 2.0 |
| Role | Spatial aggregation for density grids and heatmaps at multiple resolutions |
| Why chosen | Uber-developed; equal-area hexagons; multi-resolution hierarchy; pre-aggregation makes pan/zoom fast at scale |
| Spec alignment | §11.5 performance budgets (aggregation for ≤50ms pan/zoom), §13.1 density grids |

---

## Data Format and Processing

### Apache Arrow JS — Columnar In-Memory Data

| Attribute | Value |
|-----------|-------|
| License | Apache 2.0 |
| Role | Zero-copy data transfer between Parquet files and deck.gl rendering |
| Why chosen | Standard columnar format; no serialization overhead; interoperable with DuckDB and Parquet |
| Spec alignment | §6.3 analytic plane storage |

### loaders.gl — Data Format Loading

| Attribute | Value |
|-----------|-------|
| License | MIT |
| Role | Load GeoJSON, CSV, Parquet, 3D Tiles, and other formats into deck.gl |
| Why chosen | deck.gl companion library; plugin architecture for new formats; handles streaming loads |
| Spec alignment | §12.1 layer system (diverse format support) |

### DuckDB-WASM — In-Browser Analytics Engine

| Attribute | Value |
|-----------|-------|
| License | MIT |
| Role | Offline SQL analytics on Parquet bundles; temporal pattern query execution; local aggregation |
| Why chosen | Full SQL engine in browser/desktop; handles Parquet natively; no server required for air-gapped analysis; excellent performance on analytical queries |
| Spec alignment | §5 air-gapped deployment, §10.1 offline mode, §13.2 query builder execution |

---

## Backend and Storage

### PostgreSQL + PostGIS — Control Plane Database

| Attribute | Value |
|-----------|-------|
| License | PostgreSQL License (permissive) |
| Role | Authoritative control plane: RBAC, layer registry, provenance, audit ledger, domain registry |
| Current implementation note | Implemented in WP-I0-003 as the governed control-plane backbone for deployment profiles, bundle registry, audit state, recorder state, and AOI geometry persistence |
| Spec alignment | §6.3 (normative requirement) |

### TimescaleDB — Time-Series Context Store

| Attribute | Value |
|-----------|-------|
| License | Apache 2.0 (community edition) |
| Role | Time-series storage for context domains (trade flows, commodity prices, port throughput) |
| Why chosen | PostgreSQL extension (same DB, no separate service); hypertables with automatic time partitioning; continuous aggregates for rollups; efficient time-range queries |
| Alternatives considered | InfluxDB (separate service, tighter license), QuestDB (smaller ecosystem), plain PostgreSQL partitioning (manual, less optimized) |
| Current implementation note | WP-I0-003 delivers the governed baseline on indexed PostgreSQL tables and live time-range query proof; TimescaleDB remains an optional optimization layer rather than a current runtime dependency |
| Spec alignment | §6.3 Context Store |

### MinIO — Object / Artifact Store

| Attribute | Value |
|-----------|-------|
| License | AGPLv3 (server) — NOTE: evaluate license compatibility for embedded use; may use S3-compatible local filesystem adapter instead |
| Role | Immutable artifact storage for snapshot bundles, briefing exports, experiment bundles |
| Why chosen | S3-compatible API; works on-prem, air-gapped, and cloud; content-addressed storage |
| Alternatives considered | Local filesystem with content-hash naming (simpler, may be sufficient for desktop-first), SeaweedFS (Apache 2.0, lighter) |
| Risks | AGPL license requires careful evaluation; if problematic, use SeaweedFS or local filesystem with S3-compatible wrapper |
| Current implementation note | WP-I0-003 currently uses a local immutable filesystem artifact store mirrored into the governed PostgreSQL registry; MinIO or another S3-compatible backend remains a future alternative, not the current product runtime |
| Spec alignment | §6.3 Artifact Store |

---

## Collaboration and Sync

### Yjs — CRDT Library

| Attribute | Value |
|-----------|-------|
| License | MIT |
| Role | Real-time collaborative editing with offline merge for annotations, AOIs, SAT docs, scenario assumptions |
| Why chosen | Mature CRDT implementation; offline-first with sync-on-reconnect; used in production by major editors (ProseMirror, TipTap, BlockSuite); sub-document support for partial sync |
| Alternatives considered | Automerge (also good, slightly heavier; Yjs has better ecosystem for document-like structures) |
| Spec alignment | §10.2 merge-safe semantics (CRDT) |

---

## Desktop Shell

### Tauri — Desktop Application Framework

| Attribute | Value |
|-----------|-------|
| License | Apache 2.0 / MIT |
| Role | Native desktop shell wrapping the web UI; local filesystem access for bundles; offline operation |
| Why chosen | Rust-based (lighter than Electron: ~50MB vs ~200MB); better security boundaries; native OS integration; can embed web views |
| Alternatives considered | Electron (heavier, larger attack surface), native desktop (too expensive to build cross-platform) |
| Risks | Smaller ecosystem than Electron; some web APIs may need Rust bridges |
| Spec alignment | §5 deployment profiles (air-gapped workstation, on-prem), §12 Open Points recommendation for desktop-first |

---

## AI Gateway and Provider Adapters

### Governed Provider Adapter — Tauri-Only Live AI Boundary

| Attribute | Value |
|-----------|-------|
| Role | Live AI analysis boundary for the governed desktop runtime |
| Current implementation note | `WP-I6-002` closes the initial live-provider packet with a provider-agnostic Tauri adapter that prefers local Codex CLI on an existing ChatGPT login when available and supports OpenAI Responses API as a governed fallback when configured with valid quota; browser and jsdom contexts remain in explicit simulated mode rather than pretending to be live. |
| Why chosen | Keeps secrets out of the frontend, preserves offline-safe degradation, lets local operators use an existing ChatGPT/Codex login when available instead of forcing API billing, and leaves room for additional provider adapters without changing the UI or MCP contract. |
| Risks | The currently verified live adapters are still OpenAI-owned surfaces, so broader provider diversity remains future work even though the contract is now adapter-driven. |
| Spec alignment | §15.1 gateway mediation, §15.2 evidence-linked labeling and marking inheritance |

### Governed MCP Adapter — Minimum Tool Surface

| Attribute | Value |
|-----------|-------|
| Role | Policy-gated tool surface for AI analysis over bundles and derived artifacts |
| Current implementation note | `WP-I6-002` verifies the minimum MCP surface, audited invocation capture, deployment-profile disablement, and path-agnostic operation over bundle IDs and content hashes in the Tauri runtime. |
| Why chosen | Preserves the same RBAC, marking, export, and audit rules used by the UI gateway while preventing raw file-path or raw-database escape hatches. |
| Spec alignment | §15.3 MCP interface, §8.1 audit coverage, §18 Gate G |

---

### Desktop Portability and Startup Policy

- Prefer dependencies with maintained Windows and macOS support for desktop runtime paths.
- Keep OS-specific behavior behind Rust/TypeScript adapters instead of scattering platform conditionals.
- Use path-safe abstractions (`PathBuf`/platform-aware path utilities) and avoid hard-coded separators/drive assumptions.
- Track and enforce cold/warm startup and state-change feedback budgets in performance validation.
- Governed desktop runtime smoke proof currently runs through `pnpm smoke:runtime`, which records cold/warm Tauri artifacts in the active WP proof directory and reserves explicit macOS/reference-hardware evidence slots for downstream packet promotion.

### Windows Installer Lifecycle Tooling [NEW in v1.2.2]

| Attribute | Value |
|-----------|-------|
| Role | Installer lifecycle operations (uninstall, repair, full-repair, update, downgrade) and reproducible installer kit assembly |
| Components | `package.json`, `src-tauri/Cargo.toml`, `src-tauri/tauri.conf.json` (aligned release manifests), `scripts/windows-installer-maintenance.ps1`, `docs/INSTALLER_LIFECYCLE.md`, `.gov/repo_scripts/build_windows_installer.ps1` |
| Why chosen | Uses native Windows installer channels (MSI/WiX + NSIS) while adding explicit lifecycle controls and audited maintenance operations |
| Spec alignment | Â§5.2 installer lifecycle contract, Â§18 Gate H lifecycle validation |

---

## Export and Rendering

### Playwright — Deterministic Export Rendering

| Attribute | Value |
|-----------|-------|
| License | Apache 2.0 |
| Role | Headless browser for deterministic map image export and briefing bundle rendering |
| Why chosen | Cross-browser; better API than Puppeteer; supports Chromium/Firefox/WebKit |
| Spec alignment | §11.5 4K image export ≤3.0s, deterministic rendering |

### jsPDF + html2canvas — PDF Generation

| Attribute | Value |
|-----------|-------|
| License | MIT |
| Role | Client-side PDF generation for briefing bundles (works offline) |
| Spec alignment | §9.2 briefing bundle export |

---

## Frontend Framework

### React — UI Component Framework

| Attribute | Value |
|-----------|-------|
| License | MIT |
| Role | Component framework for the client workstation UI |
| Why chosen | Largest ecosystem; best integration with ECharts (echarts-for-react), deck.gl (@deck.gl/react), MapLibre (react-map-gl), and Yjs (y-presence) |
| Alternatives considered | Vue (good but smaller ecosystem for geospatial), Svelte (emerging, fewer integrations), SolidJS (excellent performance but smallest ecosystem) |

### TypeScript — Language

| Attribute | Value |
|-----------|-------|
| License | Apache 2.0 |
| Role | Type safety across the full client codebase |
| Why chosen | Industry standard for large-scale frontend; catches errors at compile time; better IDE support |

---

## Summary: Library → Spec Requirement Mapping

| Library | Primary Spec Sections | Iteration First Needed |
|---------|----------------------|----------------------|
| MapLibre GL JS | §11.1, §11.5 | I0 (skeleton map) |
| CesiumJS | §11.1, §11.2 | I1 (3D view mode) |
| deck.gl | §11.5, §13.1 | I1 (data layers) |
| Apache ECharts | §7.4.5, §13.1 | I2 (comparative dashboard) |
| D3.js | §13.2, §20.4 | I4 (scenario tree) / I5 (query builder) |
| Observable Plot | §15.4 | I6 (AI report viz) |
| Turf.js | measure tools, spatial filters | I1 |
| H3 | §11.5, §13.1 | I1 (density aggregation) |
| Apache Arrow JS | §6.3 | I0 (bundle data) |
| loaders.gl | §12.1 | I1 (layer loading) |
| DuckDB-WASM | §10.1, §13.2 | I0 (offline queries) |
| PostgreSQL + PostGIS | §6.3 | I0 |
| TimescaleDB | §6.3 | I7 (context store) |
| MinIO / SeaweedFS | §6.3 | I0 (artifact store) |
| Yjs | §10.2 | I3 (collaboration) |
| Tauri | §5 | I0 (desktop shell) |
| Playwright | §11.5 | I1 (export rendering) |
| jsPDF | §9.2 | I2 (briefing PDF) |
| React + TypeScript | §11 | I0 |

---

## Implementation Baseline Snapshot (2026-03-06)

The following dependency families are installed in `.product/Worktrees/wt_main` as the active prototype baseline. Their presence establishes download and experimentation readiness, not proof that the governed runtime architecture is fully integrated or E2E-VERIFIED against the current spec:

- Runtime: @tauri-apps/api, maplibre-gl, cesium, @deck.gl/*, echarts, echarts-for-react, d3, @observablehq/plot, @turf/turf, h3-js, apache-arrow, @loaders.gl/*, @duckdb/duckdb-wasm, yjs, jspdf, html2canvas.
- Tooling and tests: @tauri-apps/cli, vitest, @testing-library/*, @playwright/test.

This establishes dependency download readiness and executable contract coverage for I0-I10, with iterative hardening to continue in subsequent packets.

---

## Governance Automation Stack (2026-03-06)

| Tooling | Role in WP Loop |
|---------|------------------|
| PowerShell 7+ | Canonical automation runtime for governance scripts |
| Git (non-interactive CLI) | Checkpoint commits and reproducible WP state transitions |
| pnpm + Vitest + ESLint | Product dependency, correctness, and UI/functional verification hooks |
| `pnpm smoke:runtime` + Node launcher | Governed cold/warm Tauri runtime smoke execution with copied audit/state/bundle proof artifacts |
| Cargo test | Rust-side contract checks for Tauri/runtime adapters |
| Markdown templates + validators | Enforced WP/suite/spec-extraction/check-script skeletons |

Governance loop scripts:

- `.gov/repo_scripts/new_work_packet.ps1`
- `.gov/repo_scripts/update_wp_spec_extract.ps1`
- `.gov/repo_scripts/run_wp_checks.ps1`
- `.gov/repo_scripts/run_wp_loop.ps1`
- `.gov/repo_scripts/enforce_wp_template_compliance.ps1`
- `.gov/repo_scripts/governance_preflight.ps1`

