# StratAtlas â€” Technology Stack

**Spec Version:** v1.2.1  
**Last Updated:** 2026-03-05  
**Status:** Active baseline in `.product/Worktrees/wt_main` (I0 implementation + I1 foundation)

---

## Decision Criteria

Every technology choice must satisfy:
1. **Open-source with permissive license** (Apache 2.0 or MIT preferred; no AGPL in core)
2. **Actively maintained** (commits in last 6 months, responsive issue tracker)
3. **Proven at scale** (used in production by organizations with similar data volumes)
4. **Offline-capable** (must work in air-gapped deployment profile or degrade gracefully)
5. **No vendor lock-in** (no required proprietary services or API keys)
6. **Startup and interaction performant** (supports startup + state-change budgets in spec Â§11.5)
7. **Desktop-portable** (does not block Windows-to-macOS portability for runtime-critical paths)

---

## Geospatial Rendering

### MapLibre GL JS â€” Primary 2D Map Engine

| Attribute | Value |
|-----------|-------|
| License | BSD-3-Clause |
| Role | 2D vector map rendering, basemap, AOI drawing, spatial interaction |
| Why chosen | Community-maintained Mapbox GL fork; no API key required; globe view support; native vector tile rendering; integrates with deck.gl |
| Alternatives considered | OpenLayers (heavier, less modern rendering), Leaflet (no WebGL, poor at scale) |
| Risks | Globe view is newer than CesiumJS globe; for 3D, CesiumJS remains primary |
| Spec alignment | Â§11.1 main canvas (2D), Â§11.5 â‰¤50ms pan/zoom budget |

### CesiumJS â€” 3D Globe Engine

| Attribute | Value |
|-----------|-------|
| License | Apache 2.0 |
| Role | 3D globe visualization, altitude/orbit rendering, time-dynamic scenes |
| Why chosen | De facto standard for global-scale 3D; WGS84 native; 3D Tiles (OGC standard); time animation built-in; aerospace/defense heritage |
| Alternatives considered | OpenGlobus (less mature), Three.js (no geo primitives), mapray.js (Sony, smaller community) |
| Risks | Cesium ion (commercial service) is optional â€” StratAtlas MUST NOT require it. Self-hosted tile serving only. |
| Spec alignment | Â§11.1 main canvas (3D), space object visualization |

### deck.gl â€” GPU-Accelerated Overlay Layers

| Attribute | Value |
|-----------|-------|
| License | MIT |
| Role | High-performance data layer rendering (millions of points, arcs, heatmaps, hexbins) |
| Why chosen | WebGL/WebGPU rendering; composable layer architecture; integrates with both MapLibre and CesiumJS; handles AIS/ADS-B point volumes |
| Alternatives considered | Kepler.gl (built on deck.gl but opinionated UI; better as reference than dependency) |
| Risks | WebGPU transition in progress; WebGL fallback must be maintained for older hardware |
| Spec alignment | Â§11.5 performance budgets, Â§13.1 density grids, heatmaps |

### How They Compose

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  MapLibre GL JS (2D basemap)        â”‚  â† Vector tiles, styling, AOI drawing
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”    â”‚
â”‚  â”‚  deck.gl (GPU overlay)      â”‚    â”‚  â† AIS tracks, density hexbins, flow arcs
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜    â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜

â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  CesiumJS (3D globe)                â”‚  â† Orbits, altitude tracks, terrain
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”    â”‚
â”‚  â”‚  deck.gl (GPU overlay)      â”‚    â”‚  â† Same data layers, 3D projection
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜    â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜

Shared viewport state â†’ switching 2D â†” 3D preserves camera position and layer config
```

---

## Charting and Dashboard Visualization

### Apache ECharts â€” Primary Charting Library

| Attribute | Value |
|-----------|-------|
| License | Apache 2.0 |
| Role | Sidebar time-series, comparative dashboard, briefing export charts |
| Why chosen | 50+ chart types; Canvas rendering (handles large datasets without SVG DOM thrashing); streaming data support; real-time updates; built-in GeoJSON map series; accessibility features; i18n; dark mode; active Apache Foundation maintenance |
| Alternatives considered | Recharts (React-only, SVG, slow above 10K points), Chart.js (fewer chart types, weaker at complex dashboards), Highcharts (commercial license) |
| Risks | API complexity is higher than simpler libraries; team needs initial ramp-up time |
| Spec alignment | Â§7.4.5 sidebar_timeseries and dashboard_widget presentation types, Â§13.1 comparative dashboard |

### D3.js â€” Custom Visualization Foundation

| Attribute | Value |
|-----------|-------|
| License | ISC (BSD-style) |
| Role | Custom analytical visualizations that have no standard chart type: scenario trees, ACH matrices, network graphs, temporal query builder visual composer |
| Why chosen | Unlimited customization; industry standard; SVG/Canvas/HTML manipulation; massive ecosystem |
| Alternatives considered | Nothing â€” D3 is the only option for truly custom interactive visualizations |
| Risks | Steep learning curve; not for standard charts (use ECharts for those) |
| Spec alignment | Â§20.4 scenario trees, Â§5.8.1 (v0.3) SAT templates, Â§13.2 query builder |

### Observable Plot â€” Quick Analytical Charts

| Attribute | Value |
|-----------|-------|
| License | ISC |
| Role | Rapid chart generation from data slices; AI report visualization; exploratory analysis |
| Why chosen | Built on D3 with dramatically simpler API; grammar-of-graphics approach; good for "sketch a chart from this query result" workflows |
| Alternatives considered | Vega-Lite (similar role but heavier; Plot is lighter for embedding) |
| Risks | Less mature than D3/ECharts; community smaller |
| Spec alignment | Â§15.4 AI report artifact visualization |

---

## Spatial Analysis (Client-Side)

### Turf.js â€” Geospatial Analysis

| Attribute | Value |
|-----------|-------|
| License | MIT |
| Role | Client-side spatial operations: buffer, distance, bearing, point-in-polygon, convex hull |
| Why chosen | Standard JS geospatial analysis library; no server round-trip needed; works offline |
| Spec alignment | Â§13.8 (v0.3) measure tools, spatial filtering |

### H3 â€” Hexagonal Spatial Index

| Attribute | Value |
|-----------|-------|
| License | Apache 2.0 |
| Role | Spatial aggregation for density grids and heatmaps at multiple resolutions |
| Why chosen | Uber-developed; equal-area hexagons; multi-resolution hierarchy; pre-aggregation makes pan/zoom fast at scale |
| Spec alignment | Â§11.5 performance budgets (aggregation for â‰¤50ms pan/zoom), Â§13.1 density grids |

---

## Data Format and Processing

### Apache Arrow JS â€” Columnar In-Memory Data

| Attribute | Value |
|-----------|-------|
| License | Apache 2.0 |
| Role | Zero-copy data transfer between Parquet files and deck.gl rendering |
| Why chosen | Standard columnar format; no serialization overhead; interoperable with DuckDB and Parquet |
| Spec alignment | Â§6.3 analytic plane storage |

### loaders.gl â€” Data Format Loading

| Attribute | Value |
|-----------|-------|
| License | MIT |
| Role | Load GeoJSON, CSV, Parquet, 3D Tiles, and other formats into deck.gl |
| Why chosen | deck.gl companion library; plugin architecture for new formats; handles streaming loads |
| Spec alignment | Â§12.1 layer system (diverse format support) |

### DuckDB-WASM â€” In-Browser Analytics Engine

| Attribute | Value |
|-----------|-------|
| License | MIT |
| Role | Offline SQL analytics on Parquet bundles; temporal pattern query execution; local aggregation |
| Why chosen | Full SQL engine in browser/desktop; handles Parquet natively; no server required for air-gapped analysis; excellent performance on analytical queries |
| Spec alignment | Â§5 air-gapped deployment, Â§10.1 offline mode, Â§13.2 query builder execution |

---

## Backend and Storage

### PostgreSQL + PostGIS â€” Control Plane Database

| Attribute | Value |
|-----------|-------|
| License | PostgreSQL License (permissive) |
| Role | Authoritative control plane: RBAC, layer registry, provenance, audit ledger, domain registry |
| Spec alignment | Â§6.3 (normative requirement) |

### TimescaleDB â€” Time-Series Context Store

| Attribute | Value |
|-----------|-------|
| License | Apache 2.0 (community edition) |
| Role | Time-series storage for context domains (trade flows, commodity prices, port throughput) |
| Why chosen | PostgreSQL extension (same DB, no separate service); hypertables with automatic time partitioning; continuous aggregates for rollups; efficient time-range queries |
| Alternatives considered | InfluxDB (separate service, tighter license), QuestDB (smaller ecosystem), plain PostgreSQL partitioning (manual, less optimized) |
| Spec alignment | Â§6.3 Context Store |

### MinIO â€” Object / Artifact Store

| Attribute | Value |
|-----------|-------|
| License | AGPLv3 (server) â€” NOTE: evaluate license compatibility for embedded use; may use S3-compatible local filesystem adapter instead |
| Role | Immutable artifact storage for snapshot bundles, briefing exports, experiment bundles |
| Why chosen | S3-compatible API; works on-prem, air-gapped, and cloud; content-addressed storage |
| Alternatives considered | Local filesystem with content-hash naming (simpler, may be sufficient for desktop-first), SeaweedFS (Apache 2.0, lighter) |
| Risks | AGPL license requires careful evaluation; if problematic, use SeaweedFS or local filesystem with S3-compatible wrapper |
| Spec alignment | Â§6.3 Artifact Store |

---

## Collaboration and Sync

### Yjs â€” CRDT Library

| Attribute | Value |
|-----------|-------|
| License | MIT |
| Role | Real-time collaborative editing with offline merge for annotations, AOIs, SAT docs, scenario assumptions |
| Why chosen | Mature CRDT implementation; offline-first with sync-on-reconnect; used in production by major editors (ProseMirror, TipTap, BlockSuite); sub-document support for partial sync |
| Alternatives considered | Automerge (also good, slightly heavier; Yjs has better ecosystem for document-like structures) |
| Spec alignment | Â§10.2 merge-safe semantics (CRDT) |

---

## Desktop Shell

### Tauri â€” Desktop Application Framework

| Attribute | Value |
|-----------|-------|
| License | Apache 2.0 / MIT |
| Role | Native desktop shell wrapping the web UI; local filesystem access for bundles; offline operation |
| Why chosen | Rust-based (lighter than Electron: ~50MB vs ~200MB); better security boundaries; native OS integration; can embed web views |
| Alternatives considered | Electron (heavier, larger attack surface), native desktop (too expensive to build cross-platform) |
| Risks | Smaller ecosystem than Electron; some web APIs may need Rust bridges |
| Spec alignment | Â§5 deployment profiles (air-gapped workstation, on-prem), Â§12 Open Points recommendation for desktop-first |

---

### Desktop Portability and Startup Policy

- Prefer dependencies with maintained Windows and macOS support for desktop runtime paths.
- Keep OS-specific behavior behind Rust/TypeScript adapters instead of scattering platform conditionals.
- Use path-safe abstractions (`PathBuf`/platform-aware path utilities) and avoid hard-coded separators/drive assumptions.
- Track and enforce cold/warm startup and state-change feedback budgets in performance validation.

---

## Export and Rendering

### Playwright â€” Deterministic Export Rendering

| Attribute | Value |
|-----------|-------|
| License | Apache 2.0 |
| Role | Headless browser for deterministic map image export and briefing bundle rendering |
| Why chosen | Cross-browser; better API than Puppeteer; supports Chromium/Firefox/WebKit |
| Spec alignment | Â§11.5 4K image export â‰¤3.0s, deterministic rendering |

### jsPDF + html2canvas â€” PDF Generation

| Attribute | Value |
|-----------|-------|
| License | MIT |
| Role | Client-side PDF generation for briefing bundles (works offline) |
| Spec alignment | Â§9.2 briefing bundle export |

---

## Frontend Framework

### React â€” UI Component Framework

| Attribute | Value |
|-----------|-------|
| License | MIT |
| Role | Component framework for the client workstation UI |
| Why chosen | Largest ecosystem; best integration with ECharts (echarts-for-react), deck.gl (@deck.gl/react), MapLibre (react-map-gl), and Yjs (y-presence) |
| Alternatives considered | Vue (good but smaller ecosystem for geospatial), Svelte (emerging, fewer integrations), SolidJS (excellent performance but smallest ecosystem) |

### TypeScript â€” Language

| Attribute | Value |
|-----------|-------|
| License | Apache 2.0 |
| Role | Type safety across the full client codebase |
| Why chosen | Industry standard for large-scale frontend; catches errors at compile time; better IDE support |

---

## Summary: Library â†’ Spec Requirement Mapping

| Library | Primary Spec Sections | Iteration First Needed |
|---------|----------------------|----------------------|
| MapLibre GL JS | Â§11.1, Â§11.5 | I0 (skeleton map) |
| CesiumJS | Â§11.1, Â§11.2 | I1 (3D view mode) |
| deck.gl | Â§11.5, Â§13.1 | I1 (data layers) |
| Apache ECharts | Â§7.4.5, Â§13.1 | I2 (comparative dashboard) |
| D3.js | Â§13.2, Â§20.4 | I4 (scenario tree) / I5 (query builder) |
| Observable Plot | Â§15.4 | I6 (AI report viz) |
| Turf.js | measure tools, spatial filters | I1 |
| H3 | Â§11.5, Â§13.1 | I1 (density aggregation) |
| Apache Arrow JS | Â§6.3 | I0 (bundle data) |
| loaders.gl | Â§12.1 | I1 (layer loading) |
| DuckDB-WASM | Â§10.1, Â§13.2 | I0 (offline queries) |
| PostgreSQL + PostGIS | Â§6.3 | I0 |
| TimescaleDB | Â§6.3 | I7 (context store) |
| MinIO / SeaweedFS | Â§6.3 | I0 (artifact store) |
| Yjs | Â§10.2 | I3 (collaboration) |
| Tauri | Â§5 | I0 (desktop shell) |
| Playwright | Â§11.5 | I1 (export rendering) |
| jsPDF | Â§9.2 | I2 (briefing PDF) |
| React + TypeScript | Â§11 | I0 |

---

## Implementation Baseline Snapshot (2026-03-05)

The following dependency families are installed in .product/Worktrees/wt_main as the active product baseline:

- Runtime: @tauri-apps/api, maplibre-gl, cesium, @deck.gl/*, echarts, echarts-for-react, d3, @observablehq/plot, @turf/turf, h3-js, apache-arrow, @loaders.gl/*, @duckdb/duckdb-wasm, yjs, jspdf, html2canvas.
- Tooling and tests: @tauri-apps/cli, vitest, @testing-library/*, @playwright/test.

This establishes dependency download readiness for I0 implementation and queued I1-I10 sub-spec execution.

