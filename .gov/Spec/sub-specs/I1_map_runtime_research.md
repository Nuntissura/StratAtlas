# I1 - Map Runtime Research and Design Direction

Date: 2026-03-07
Status: APPROVED
Parent Spec: .gov/Spec/stratatlas_spec_v1_2.md
Linked Work Packet(s): WP-GOV-I1-RESEARCH-001, WP-I1-003
Linked Requirements: REQ-0011, REQ-0012, REQ-0014..REQ-0016, REQ-0200..REQ-0212

## 1) Purpose

This document captures the source-backed design direction for StratAtlas's real map runtime before product implementation of `WP-I1-003`. It answers three questions:

- what a strong 2D analyst map should look like for StratAtlas's intent,
- what a strong 3D globe should look like when vertical context materially helps analysis,
- how every major existing product feature must connect to the map in a meaningful, auditable way.

## 2) Current Repo Baseline

- The current `region-main-canvas` in `.product/Worktrees/wt_main/src/App.tsx` is still a summary-card and workflow surface, not a mounted 2D or 3D map runtime.
- `src/features/i1/layers.ts` currently provides governance metadata, not executable render specs, source bindings, or surface adapters.
- The repo already includes the target rendering dependencies (`maplibre-gl`, `cesium`, `@deck.gl/*`) but does not yet route runtime state into them.
- Existing iteration features already expose enough state to bind to map behaviors now: replay cursor, compare windows, query results, collaboration events, scenario forks, context domains, alerts, and strategic model state.

## 3) External Research Set

### 3.1 Primary Runtime References

- MapLibre GL JS docs and examples:
  - 3D terrain: https://maplibre.org/maplibre-gl-js/docs/examples/3d-terrain/
  - Globe heatmap with terrain elevation: https://maplibre.org/maplibre-gl-js/docs/examples/display-a-heatmap-layer-on-a-globe-with-terrain-elevation/
  - Synchronized map movements: https://maplibre.org/maplibre-gl-js/docs/examples/synchronize-map-movements/
  - deck.gl overlay toggle: https://maplibre.org/maplibre-gl-js/docs/examples/toggle-deckgl-layer/
  - Large-data guide: https://maplibre.org/maplibre-gl-js/docs/guides/large-data/
  - Style and sources references: https://maplibre.org/maplibre-style-spec/sources/
- deck.gl docs:
  - TripsLayer: https://deck.gl/docs/api-reference/geo-layers/trips-layer
  - MVTLayer: https://deck.gl/docs/api-reference/geo-layers/mvt-layer
  - Tile3DLayer: https://deck.gl/docs/api-reference/geo-layers/tile-3d-layer
  - Performance guide: https://deck.gl/docs/developer-guide/performance
- CesiumJS docs:
  - Viewer: https://cesium.com/learn/cesiumjs/ref-doc/Viewer.html
  - ScreenSpaceEventHandler: https://cesium.com/learn/cesiumjs/ref-doc/ScreenSpaceEventHandler.html
  - Clock: https://cesium.com/learn/cesiumjs/ref-doc/Clock.html
  - Scene: https://cesium.com/learn/cesiumjs/ref-doc/Scene.html
  - Cesium3DTileset: https://cesium.com/learn/cesiumjs/ref-doc/Cesium3DTileset.html

### 3.2 Open-Source Product Pattern References

- kepler.gl user guides:
  - Filters: https://docs.kepler.gl/docs/user-guides/e-filters
  - Interactions: https://docs.kepler.gl/docs/user-guides/g-interactions
  - Map Styles: https://docs.kepler.gl/docs/user-guides/f-map-styles
  - Map Settings: https://docs.kepler.gl/docs/user-guides/m-map-settings
  - Time Playback: https://docs.kepler.gl/docs/user-guides/h-playback
- TerriaJS docs:
  - Home: https://docs.terria.io/guide/
  - URL-controlled 2D/3D mode: https://docs.terria.io/guide/deploying/controlling-with-url-parameters/
  - Indexed 3D tiles search: https://docs.terria.io/guide/connecting-to-data/item-search/indexed-item-search/
  - 3D tiles catalog item: https://docs.terria.io/guide/connecting-to-data/catalog-type-details/3d-tiles/
  - Initialization and viewer mode: https://docs.terria.io/guide/customizing/initialization-files/
- MapStore references:
  - Project positioning: https://github.com/geosolutions-it/MapStore2
  - Navigation toolbar and identify: https://docs.mapstore.geosolutionsgroup.com/en/latest/user-guide/navigation-toolbar/
  - Map views with 2D and 3D options: https://docs.mapstore.geosolutionsgroup.com/en/latest/user-guide/map-views/
  - 3D measurements: https://docs.mapstore.geosolutionsgroup.com/en/latest/user-guide/measure/
  - Recent feature direction: https://github.com/geosolutions-it/MapStore2/releases
- GitHub feature references:
  - Awesome MapLibre: https://github.com/maplibre/awesome-maplibre
  - Terra Draw: https://github.com/JamesLMilner/terra-draw
  - maplibre-gl-compare: https://github.com/maplibre/maplibre-gl-compare

## 4) Research Conclusions for 2D

### 4.1 What a Good 2D StratAtlas Map Should Feel Like

A good 2D StratAtlas map should feel like an analyst workstation, not a consumer navigation map. The visual hierarchy should make data and analytical state dominant, with the basemap acting as quiet structural support.

The default 2D surface should therefore use:

- a low-distraction basemap with restrained land, water, and road contrast,
- strong overlay ordering so observed evidence reads first, curated context second, modeled output third, and AI-derived interpretation last,
- always-visible provenance and layer labels near the map, not buried in modal flows,
- inspection and compare behaviors that keep the map central and use the side panels for depth, not replacement.

### 4.2 2D Visual Rules

- Default to a dark, neutral, low-saturation basemap for dense analytical overlays. A light "briefing" preset may exist for export and presentation.
- Use color primarily for data meaning, not decoration. Basemap colors stay quiet so alerts, densities, tracks, and selection states have semantic weight.
- Keep labels crisp and sparse. kepler.gl's map-style guidance and layer-order guidance reinforce the need to move labels above dense analytical layers when readability matters.
- Make legend state live and explicit. MapStore's recent interactive and dynamic legend direction is a strong signal that legends should respond to current viewport and visible rules rather than remain static.
- Maintain visible AOI boundaries and map scale cues even when overlays are dense.

### 4.3 2D Interaction Rules

- Hover is lightweight and reversible; click pins detail to the map context.
- Filters and time changes should update visible geometry immediately. kepler.gl's filter model and time playback model show that the map, not just the side panel, must visibly respond to temporal interaction.
- Split compare is high-value and should be first-class. kepler.gl's split-map control and MapLibre's synchronized movement example both reinforce this for compare workflows.
- Brushing, coordinate readout, and quick inspect controls are useful, but they must remain subordinate to feature selection and provenance inspection.
- For dense data, aggregation is normal rather than exceptional. MapLibre's large-data guidance and deck.gl's performance guidance both point toward chunking, vector tiling, clustering, and shallow prop changes as the default scalability posture.

### 4.4 2D Must-Have Features for WP-I1-003

- Real MapLibre-based main canvas.
- Persistent on-map legend and artifact-label strip.
- Layer ordering and visibility controls that visibly affect the map.
- Time playback tied directly to geometry, not only a slider readout.
- Split compare or dual synchronized map mode for compare workflows.
- Query results rendered as real ephemeral layers.
- Hover, click, and pinned inspection states with provenance/confidence text.
- Budget/degradation feedback visible on the map surface when aggregation or fallback rendering is active.

## 5) Research Conclusions for 3D

### 5.1 What a Good 3D StratAtlas Globe Should Feel Like

The 3D globe must be purposeful. It should exist for vertical reasoning, terrain, infrastructure, altitude, orbit, and time-dynamic animation. It should not be a decorative alternate skin for the 2D map.

The globe should therefore be used when analysts need to understand:

- altitude and orbital relationships,
- terrain-constrained movement and infrastructure,
- corridor and route geometry,
- line-of-sight or terrain framing,
- 3D tiles and infrastructure context,
- replay scenes where camera motion helps explain the event.

### 5.2 3D Visual Rules

- Keep terrain and atmosphere understated. The scene should read as an analytical environment, not a glossy "space view."
- Use 3D labels sparingly; rely on selection and inspect panels for detail to avoid clutter and occlusion.
- Preserve the 2D semantic palette in 3D so observed, context, modeled, and AI layers remain visually legible across surfaces.
- Favor explicit toggles for atmosphere, lighting, clipping, and translucency rather than implicit magic. MapStore's 3D view controls are a useful precedent here.

### 5.3 3D Interaction Rules

- Switching 2D to 3D must preserve camera intent, active layers, filter state, and time position per the spec.
- Cesium's `Viewer`, `Clock`, `Scene`, `ScreenSpaceEventHandler`, and `Cesium3DTileset` support the right primitives: time-aware scenes, picking, terrain, 3D tiles, and controlled camera state.
- 3D should support tracked paths, time-dynamic motion, and terrain-relative scene understanding.
- Indexed 3D item search, as TerriaJS documents for 3D tiles, is a strong future enhancement once base 3D interaction is in place.

### 5.4 3D Must-Have Features for WP-I1-003

- Real Cesium-based globe mode.
- Shared layer and time state with 2D.
- Purposeful 3D overlays: altitude tracks, corridors, terrain-aware paths, and selected infrastructure context.
- Selection and inspection parity with 2D.
- Camera reset and state persistence.
- Mode-aware replay that updates the globe rather than only a text summary.

## 6) Feature-to-Map Integration Contract

Every major product capability must materialize as one or more of: a map layer, a camera state, a selection state, a timeline state, a map annotation, or a map-linked comparison surface.

| Capability Slice | Existing Product Capability | Required Map Connection |
|------------------|-----------------------------|-------------------------|
| I0 Recorder / bundles | Bundle capture, reopen, audit, markings, offline | Persist camera pose, active layers, visible legend state, selected map feature, time window, and map mode in bundle reopen flows. |
| I1 Layer system | Layer toggles, replay cursor, performance telemetry | Mount real 2D and 3D canvases, drive layer visibility on the surface, and tie replay to visible geometry changes. |
| I2 Compare / briefing | Baseline delta cells, overlay summaries, briefing export | Show delta layers on the map, support split compare or swipe, and export map plus legend and provenance as part of briefing output. |
| I3 Collaboration | Session replay, conflict resolution, shared artifacts | Show collaborator presence, shared AOI edits, camera/view state intent, and replayed edit focus on the map. |
| I4 Scenario modeling | Constraints, hypothetical entities, scenario compare | Render constraint areas, hypothetical entities, affected nodes, and scenario deltas as distinct modeled layers tied to selected scenario forks. |
| I5 Query builder | Query conditions, result layer, versioning | Render query results as ephemeral or saved layers with filter highlights, AOI fit, and inspectable result points or polygons. |
| I6 AI gateway | AI summaries and interpretations | Anchor AI output to current AOI, selected features, or generated annotations on the map and preserve AI labeling at point-of-use. |
| I7 Context intake | Context overlays, correlation links, infrastructure domains | Show map overlays for spatial domains and map-driven AOI/time selection for non-spatial sidebar timeseries. |
| I8 Deviation detection | Context deviation events | Render deviation markers, region halos, or delta bands tied to the same AOI and time range used in the map. |
| I9 Alerts | Aggregate AOI alerts | Show AOI-level alert state, threshold regions, and alert-linked context overlays without crossing into entity-pursuit behavior. |
| I10 Strategic modeling | Scenario tree, experiment bundles, solver outputs | Link modeled branches to map bookmarks, affected corridors/nodes, and uncertainty surfaces so modeling is spatially legible. |

## 7) ROI-Ranked Feature Register

| Priority | Feature | Why it matters | Research anchor | Delivery stance |
|----------|---------|----------------|-----------------|-----------------|
| Must | Real 2D MapLibre canvas | The app becomes credible only when the main canvas is an actual map. | MapLibre docs, current repo audit | Core `WP-I1-003` |
| Must | Real 3D Cesium globe | Gives the app a defensible 3D mode for altitude, terrain, and infrastructure. | Cesium docs, Terria/MapStore patterns | Core `WP-I1-003` |
| Must | Split compare / synced views | Directly strengthens I2 and makes compare map-native rather than dashboard-only. | kepler.gl split maps, MapLibre sync example | Core `WP-I1-003` |
| Must | deck.gl analytic overlays in 2D | High-volume overlays are the strongest visual differentiator for StratAtlas. | deck.gl MVT/Trips/perf docs | Core `WP-I1-003` |
| Must | Map-linked feature inspect and pinning | Makes query, context, AI, and scenario outputs spatially explainable. | kepler.gl interactions, MapStore identify | Core `WP-I1-003` |
| Must | Persistent legend plus provenance strip | Protects labeling obligations while improving trust and readability. | spec Section 11.4, MapStore legend direction | Core `WP-I1-003` |
| Should | AOI draw/edit/measure | High utility for analyst workflows and scenario setup. | Terra Draw, MapStore measure | Candidate after core runtime is stable |
| Should | Analyst basemap presets | Improves perceived quality immediately without bloating the interaction model. | kepler.gl map styles, MapLibre styles | Core if low cost, else immediate follow-on |
| Should | Minimap / locator inset | Helps orientation in dense AOI work and global-to-local jumps. | Awesome MapLibre ecosystem | Immediate follow-on candidate |
| Should | Interactive legend filtering | Lets users inspect rule-driven styling directly on the map. | MapStore releases | Immediate follow-on candidate |
| Should | Indexed 3D tiles search | Valuable once 3D infrastructure layers are added. | TerriaJS indexed item search | Later follow-on |
| Could | Story camera bookmarks | Helpful for briefings and scenario walkthroughs once base export is solid. | Terria/MapStore geostory patterns | Later follow-on |

## 8) Execution Recommendation for WP-I1-003

### 8.1 Runtime Architecture

- Default to 2D on app load.
- Use MapLibre GL JS as the primary 2D runtime.
- Use deck.gl overlays on 2D immediately for query results, delta grids, tracks, and density overlays.
- Use CesiumJS as the primary 3D runtime.
- Preserve a shared scene-state contract so 2D and 3D switch cleanly.

### 8.2 Shared State That Must Exist

`WP-I1-003` should introduce or formalize:

- `MapSceneState`: active surface, camera, zoom/range, selected feature, compare state, and legend visibility.
- `LayerRuntimeSpec`: executable source, styling, picking, export, and degradation metadata derived from the governed layer catalog.
- `MapSelectionState`: hovered feature, pinned feature, associated provenance panel target.
- `ReplaySceneState`: cursor, playback speed, animation status, and visible temporal window.

### 8.3 Delivery Sequence

1. Replace the faux main canvas with a real 2D map shell and shared state store.
2. Route existing simulated query, compare, scenario, collaboration, context, AI, and strategic outputs into map overlays, annotations, and inspect states.
3. Add 3D globe parity with shared state preservation.
4. Add split compare, runtime telemetry, and graceful degradation indicators.
5. Expand proof to desktop runtime smoke, export, and performance evidence.

### 8.4 Constraint Note

`WP-I1-003` should use the current governed state contracts, even where later packets will replace synthetic or simulator-backed data sources. The map runtime must connect current features to meaningful spatial output now, while later packets upgrade the underlying data and analytics engines.

## 9) Decisions Locked by This Research

- The main identity of StratAtlas is a strong 2D map, not a globe-first experience.
- The 3D globe is a purpose-driven mode, not a decorative default.
- Every existing feature must touch the map in a visible and testable way.
- Provenance, sensitivity, and label semantics must remain visible at point-of-use.
- Self-hosted or local styles, tiles, and assets remain mandatory; no proprietary service dependency is introduced.
- Performance posture is aggregation-first: vector tiling, clustering, chunking, and reduced update churn are normal design tools, not emergency fallbacks.

## 10) Approval

- Product: Approved
- Engineering: Approved
- Security/Compliance: Approved
- Approved On: 2026-03-07
