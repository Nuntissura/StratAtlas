# I1 - Layer System + Time Replay + Deterministic Export Sub-Spec

Date: 2026-03-07
Status: APPROVED
Iteration: I1
Parent Spec: .gov/Spec/stratatlas_spec_v1_2.md
Linked Work Packet(s): WP-I1-001, WP-I1-002, WP-GOV-I1-RESEARCH-001, WP-I1-003, WP-I1-004, WP-GOV-I1-RESTYLE-001, WP-I1-005
Linked Requirements: REQ-0011, REQ-0012, REQ-0014..REQ-0016, REQ-0200..REQ-0212, REQ-0804, REQ-0805
Linked Research Reference: .gov/Spec/sub-specs/I1_map_runtime_research.md; .gov/Spec/sub-specs/I1_workbench_restyle_research.md

Recovery Note (2026-03-07): `WP-GOV-I1-RESEARCH-001` is the governance prerequisite that captures source-backed 2D/3D design direction and feature-to-map integration rules. `WP-I1-003` is the active implementation packet that must replace the current faux main-canvas shell with the real governed map runtime.

Design Extension Note (2026-03-09): `WP-GOV-I1-RESTYLE-001` captures the follow-on shell and information-architecture research after the runtime became real. `WP-I1-005` is the user-approved implementation successor for a calmer map-first workbench shell and must preserve the verified region, mode, degradation, and accessibility contracts already closed in `WP-I1-003` and `WP-I1-004`.

## 1) UX Contract

- This slice delivers stable regions, explicit workstation modes, the real 2D/3D main canvas, replay timeline behavior, deterministic exports, and performance-budget feedback.
- The main canvas MUST mount an actual map runtime. Summary cards and workflow widgets may enrich the surface, but they MUST NOT substitute for the map itself.
- StratAtlas is 2D-first for analytical clarity. 3D is a purpose-driven mode for terrain, altitude, orbit, corridor, and 3D infrastructure understanding.
- Every major feature active in the current product shell MUST manifest on the map as a layer, annotation, camera state, selection state, timeline state, or map-linked comparison surface.

## 2) Rendering Stack Contract

- 2D runtime: MapLibre GL JS with governed style, interaction, and layer ordering.
- GPU analytical overlays: deck.gl for high-volume 2D overlays and reusable geometry preparation where practical.
- 3D runtime: CesiumJS for globe, terrain, time-dynamic scenes, and 3D tiles.
- Switching between 2D and 3D MUST preserve camera intent, active layer state, filter state, and time position.
- No proprietary tiles, styles, or hosted services may become mandatory for the runtime to function.

## 3) Data Model

- Introduce or extend typed artifacts required by this iteration, including a shared scene-state model for camera, active surface, legend state, selected feature, and replay position.
- Maintain explicit IDs, versioning fields, provenance references, and sensitivity marking fields.
- Preserve compatibility with existing bundle and audit contracts introduced in I0.
- Layer metadata MUST compile into executable runtime specs for 2D and 3D surfaces rather than remain descriptive only.

## 4) Storage and Bundle Contract

- Persist authoritative map state in PostgreSQL/PostGIS-aligned structures introduced in `WP-I0-003`.
- Capture map state in bundles, including active surface, camera pose, layer visibility, legend configuration, selected features, and replay/time window.
- Keep append-only correction semantics for immutable artifacts.

## 5) Provenance and Markings

- All new artifacts inherit sensitivity markings.
- Provenance metadata MUST include source, license, retrieval time, and transformation lineage.
- The runtime MUST surface provenance and confidence at point-of-use through on-map labels, legend/provenance panels, or pinned inspection state.
- Observed Evidence, Curated Context, Modeled Output, and AI-Derived Interpretation MUST remain visually distinct on both 2D and 3D surfaces.

## 6) Feature-to-Map Integration Rules

- Query results render as ephemeral or saved runtime layers.
- Compare mode renders delta-focused map views, not only side-panel summaries.
- Collaboration mode shows shared view intent, AOI changes, or replay focus on the map.
- Scenario mode renders constraints, hypothetical entities, and scenario deltas spatially.
- Context domains use map overlays where spatially appropriate and map-driven AOI/time selection where not spatially precise.
- AI outputs remain labeled and anchored to AOIs, selected features, or map annotations.
- Strategic modeling and downstream solver outputs must remain spatially legible via bookmarks, corridors, affected nodes, or modeled surfaces.

## 7) Audit Coverage

- Record layer visibility changes, mode switches, replay operations, compare-mode map state, export actions, and policy-relevant inspection events.
- Maintain actor attribution and replayability for all iteration-critical actions.
- Audit schema deltas are versioned and migration-safe.

## 8) Offline Behavior

- Core analyst workflows in this slice remain functional on cached or saved artifacts.
- Online-only operations degrade gracefully with explicit staleness or unavailable indicators.
- Cached styles, tiles, and bundle-backed overlays MUST keep the map usable in offline mode.
- Sync/reconnect semantics remain explicit and auditable.

## 9) Determinism Guarantees

- Replay and export operations for this slice are deterministic given identical inputs.
- Camera restore, selected layer set, legend state, and replay cursor MUST restore within defined tolerances.
- Hash-addressed references are used for externally consumed evidence artifacts.

## 10) Performance and Degradation

- Performance target: 2D pan/zoom <=50ms, warm scrub <=250ms, cold scrub <=2.0s, export budgets per REQ-0209 and REQ-0210.
- Aggregation, clustering, chunking, vector tiling, and reduced update churn are the normal degradation tools for dense layers.
- If budgets cannot be met, the map MUST visibly indicate aggregated or degraded rendering state.
- If a state change exceeds the 300ms feedback target, the UI MUST show non-blocking progress while keeping the map responsive.

## 11) Threat Model Notes

- Primary risks are plugin sandbox bypass, hidden licensing violations in map/export flows, and performance regressions under dense layers.
- Enforce misuse constraints (spec section 3.2) at UI, service, and plugin/tool boundaries.
- Add abuse-case tests for export guards, layer-label persistence, and map interaction paths that could blur evidence versus modeled interpretation.

## 12) Schema and Interface Deltas

- Add or extend schemas for scene state, runtime layer specs, and map export payloads as needed.
- Validate schema compatibility and migration behavior.
- Define adapter interfaces that translate governed layer metadata into MapLibre, deck.gl, and Cesium runtime state without exposing raw DB or raw filesystem interfaces.

## 13) Verification Expectations

- Automated UI tests must validate the real mounted map or globe surfaces and mode-aware map behavior.
- Desktop smoke coverage must prove 2D and 3D mounting, layer toggling, replay interaction, and degraded-state feedback.
- Performance evidence must be recorded in active WP artifacts and linked to the packet test suite.

## 14) Approval

- Product: Approved
- Engineering: Approved
- Security/Compliance: Approved
- Approved On: 2026-03-07
