# GOV Toggleable Live Source Layer Research

Date: 2026-03-10
Status: DRAFT
Iteration: All
Parent Spec: .gov/Spec/stratatlas_spec_v1_2.md
Linked Work Packet(s): WP-GOV-MAPDATA-001
Linked Requirements: REQ-0013, REQ-0019, REQ-0020, REQ-0021, REQ-0022, REQ-0200, REQ-0201
Linked Primitives: PRIM-0045, PRIM-0071

## 1) Research Intent

Capture the governed data/source contract for the next map-visible layer families the user wants:

- live commercial air traffic plus known military flight awareness
- live commercial shipping plus known military/naval movement awareness
- live satellites
- resource and infrastructure sites such as dams, power plants, water treatment, ore and oil refining
- commercial airports and ports
- known military airbases and military ports

The output must treat these as toggleable map layer families, not fixed always-on content.

## 2) Layer Family Contract

Every future family should be implemented as:

- a toggleable layer family in the map layer registry
- a truthfully labeled source contract
- an online/offline/degraded-state description
- a provenance, licensing, and permitted-use note
- a geometry strategy
  - points for installations
  - tracks/position markers for live mobility feeds
  - optional corridors/footprints for modeled or aggregated outputs

## 3) Research Findings

### 3.1 2D Basemap

- Recommended online basemap candidate: OpenFreeMap Liberty style for MapLibre.
- Rationale: simple MapLibre-compatible style URL and permissive/open deployment posture.
- Required product contract: always ship a schematic offline fallback so the app stays useful without network access.

### 3.2 Air Traffic

- Recommended first open live candidate: OpenSky Network REST API for state vectors and flight data.
- Strength: official API, open research-oriented access, enough to prove commercial air traffic layering.
- Constraint: military-flight identification is not a trustworthy built-in global flag. Known military awareness will require a separate curated heuristic/watchlist layer or a licensed provider path.

### 3.3 Shipping

- Open global truly live compliant shipping data was not identified as a clean first-choice equivalent to OpenSky.
- Open/public fallback candidates:
  - MarineCadastre AIS services for U.S.-oriented AIS access and historical/recent maritime coverage
  - Global Fishing Watch for global vessel activity layers, with product truthfulness about latency and vessel scope
- Research conclusion: true live global commercial shipping likely needs a separately governed licensed AIS provider path. Military/naval shipping awareness should be modeled as a curated static/known-installation layer first, not implied as live global truth.

### 3.4 Satellites

- Recommended first candidate: CelesTrak GP/TLE feeds.
- Strength: official long-lived orbital element distribution suitable for map/globe overlays and orbit propagation.
- Constraint: positions are modeled from orbital elements and must be labeled accordingly, not as direct observed evidence.

### 3.5 Infrastructure and Resources

- Power plants: World Resources Institute Global Power Plant Database is a strong first static infrastructure layer.
- Dams/reservoir infrastructure: Global Dam Watch is a strong candidate.
- Refineries, water treatment plants, ore/oil facilities: no single clean global official source surfaced in this pass; these likely need a governed composite of open datasets plus manual curation.

### 3.6 Airports and Ports

- Commercial airports: OpenAIP is a strong candidate for a global aviation installation layer, with scope/coverage review still required.
- Commercial ports: NGA World Port Index is a strong first curated static port layer candidate.
- Military airbases and military ports: these should start as curated known-installation layers assembled from public official/open sources and manual QA, not as claimed fully authoritative global live registries.

## 4) Recommended Build Order

1. Real online 2D basemap with offline fallback.
2. Toggleable static known-installation layers:
   - airports
   - ports
   - power plants
   - dams
   - curated military airbases and ports
3. First live mobility layer with the cleanest source contract:
   - commercial air traffic
4. Satellite layer on 3D globe and 2D map.
5. Shipping layer after a licensed/open source path is chosen truthfully.
6. Refineries and specialized resource-processing sites after source coverage is governed.

## 5) Non-Negotiable Truthfulness Rules

- Military/commercial distinction must not be overstated when the source only supports heuristics.
- Satellite positions must be labeled as propagated/modeled from orbital elements when applicable.
- Shipping and flight layers must clearly distinguish:
  - live
  - delayed
  - cached
  - curated static
- Any provider/license limitation must be represented in UI help, not buried in docs.

## 6) Expected Successor Packets

- Successor implementation packet for panel explainers and real 2D basemap: `WP-I1-007`
- Immediate next implementation packet should target static known-installation layers first:
  - airports
  - ports
  - power plants
  - dams
  - curated military airbases and military ports
- Subsequent source-backed packets should then split by family instead of attempted as one giant ingest packet:
  - commercial air traffic plus truth-labeled military-awareness heuristics
  - satellites/orbits with explicit propagated-position labeling
  - shipping after a truthful licensed/open provider path is chosen
  - refineries, water treatment, and specialized processing sites after source coverage is governed

## 7) Delivery Queue

1. `WP-I1-008` - layer-family registry and control dock
2. `WP-I1-009` - static installations and critical infrastructure
3. `WP-I1-010` - commercial air traffic and flight awareness
4. `WP-I1-011` - satellite orbit and coverage
5. `WP-GOV-MAPDATA-002` - maritime source path and coverage-gap resolution
6. `WP-I1-012` - maritime traffic and port awareness
7. `WP-I1-013` - specialized industrial and water infrastructure

## 8) Gap Register

| Family | Current Need | Current Gap | Delivery Owner |
|--------|--------------|-------------|----------------|
| Layer family dock | grouped toggles, badges, persistence, calm IA | current toggle UI is flat and not designed for many families | `WP-I1-008` |
| Static installations | airports, ports, dams, power plants, curated military sites | source normalization, offline packaging, coverage labeling | `WP-I1-009` |
| Air traffic | commercial flights plus separate military-awareness heuristics | trustworthy military classification limits and degraded/live labeling | `WP-I1-010` |
| Satellites | 2D and 3D propagated orbit display | modeled-versus-observed labeling and performance tuning | `WP-I1-011` |
| Maritime traffic | vessel movement and maritime awareness | no clean first-choice global open live source path | `WP-GOV-MAPDATA-002` then `WP-I1-012` |
| Specialized industrial sites | refineries, water treatment, ore/oil processing | no single global dataset; composite curation and QA required | `WP-I1-013` |

## 9) Intent Guardrails

All future queue packets from `WP-I1-008` through `WP-I1-013` MUST satisfy the checklist in `.gov/Spec/sub-specs/GOV_map_family_intent_guardrails.md` before status promotion beyond `SPEC-MAPPED`.

The guardrail checklist exists to keep future families aligned with the original StratAtlas intent:

- strategic analysis over generic tracking
- map-first contribution over side-panel clutter
- explicit evidence/context/model boundaries
- replay/compare/scenario/export usefulness
- strict non-goal and anti-tracker boundaries
- calm shell fit as the layer count grows
