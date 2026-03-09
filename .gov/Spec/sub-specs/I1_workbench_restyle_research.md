# I1 Workbench Restyle Research

Date: 2026-03-09
Status: DRAFT
Iteration: I1
Parent Spec: .gov/Spec/stratatlas_spec_v1_2.md
Linked Work Packet(s): WP-GOV-I1-RESTYLE-001, WP-I1-005
Linked Requirements: REQ-0011, REQ-0012, REQ-0200, REQ-0201, REQ-0211, REQ-0212, REQ-0013, REQ-0019, REQ-0020, REQ-0021, REQ-0022
Linked Prior Research: .gov/Spec/sub-specs/I1_map_runtime_research.md
External Input: `D:\Projects\ui_gui\Uncodixfy by cyxzdev.md`

## 1) Why This Packet Exists

- The governed runtime is now real, but the surrounding shell still reads like a breadth-first dashboard.
- The map is present, yet it competes with too many simultaneously visible forms, cards, and summaries.
- The user reported the app feels overwhelming during live smoke, which is a product-level usability problem rather than a missing feature problem.

## 2) Current-Shell Audit

### 2.1 Observable Problems

- The main canvas mixes map runtime, hero-like summary blocks, telemetry grids, artifact cards, and mode-specific workflows in one surface.
- The left panel stacks global controls, query builder controls, and AI controls without task separation.
- The right panel mixes context intake, alerts, strategic modeling, and audit into one long scroll.
- The visual language still leans on gradients, pill chips, uppercase eyebrow labels, and dashboard-card repetition.

### 2.2 Why This Hurts StratAtlas

- StratAtlas is a workstation, not a landing page or KPI dashboard.
- The product value is the governed 2D/3D map plus the workflows attached to it.
- When all tools remain open at once, users lose hierarchy, map focus, and confidence in where to act next.

## 3) External Research Summary

### 3.1 Progressive Disclosure

- GitHub Primer describes progressive disclosure as showing detail only when it becomes relevant while preserving user context.
- This matches StratAtlas because the analyst should keep the map, AOI, and current evidence selection visible while secondary controls open in panes or tabs.
- Source: https://primer.style/ui-patterns/progressive-disclosure/

### 3.2 Desktop Navigation and Tabs

- Microsoft documents `NavigationView` as the app-level navigation container and `TabView` as the pattern for switching between peer views without leaving the main frame.
- That supports a workbench model with a stable shell plus task-specific tab sets instead of one long form page.
- Sources:
  - https://learn.microsoft.com/windows/apps/design/controls/navigationview
  - https://learn.microsoft.com/windows/apps/design/controls/tab-view

### 3.3 Layout Discipline

- Fluent 2 layout guidance stresses stable pane structure, predictable resizing, and content hierarchy over decorative composition.
- For StratAtlas this supports a fixed workbench layout: header, left tools, map center, right inspector, bottom tray.
- Source: https://fluent2.microsoft.design/layout

### 3.4 Map-Centered GIS Workflows

- ArcGIS dashboard and pane guidance consistently treats the map as the anchor while legends, lists, charts, and configuration live in docked side or lower panes.
- The lesson for StratAtlas is that non-map intelligence should remain adjacent to the map, not replace it.
- Sources:
  - https://doc.arcgis.com/en/dashboards/latest/create-and-share/what-is-arcgis-dashboards-.htm
  - https://pro.arcgis.com/en/pro-app/latest/help/projects/use-projects/panes-and-views-in-arcgis-pro.htm

### 3.5 Engineering References

- `react-mosaic` and `golden-layout` show mature desktop-like panel systems, but they add complexity, persistence rules, and testing burden.
- For the first restyle, a governed fixed shell is lower risk and better aligned with existing runtime proof obligations.
- Useful references:
  - https://github.com/nomcopter/react-mosaic
  - https://github.com/golden-layout/golden-layout

## 4) Uncodixfy Translation for StratAtlas

### 4.1 Banned for This Restyle

- No hero blocks in the workbench.
- No KPI-grid-first layout.
- No floating detached shells or glass blur as the primary language.
- No pill-heavy toggles as the default navigation pattern.
- No uppercase eyebrow labels or decorative microcopy.
- No strong blue-black gradients or glow effects across the shell chrome.

### 4.2 Required Direction

- Normal sidebars, toolbars, tabs, buttons, tables, and panels.
- Radius mostly in the 8px to 10px range.
- Muted dark surfaces with restrained borders and shallow shadows.
- The map gets the largest continuous region in the viewport.
- Secondary workflows appear in task-grouped panes and trays, not in one long scroll.

## 5) StratAtlas Workbench Rubric

| Criterion | Pass Condition | Why It Matters |
|-----------|----------------|----------------|
| Map Primacy | The 2D/3D runtime owns the dominant central region on desktop and is visible without scrolling past workflow forms. | The map is the product anchor. |
| Stable Regions | Header, left panel, right panel, bottom panel, and main canvas remain legible and predictable. | Preserves REQ-0200 while improving usability. |
| Task Grouping | Controls are grouped by analyst task family instead of technical subsystem dump order. | Reduces overload and improves discoverability. |
| Progressive Disclosure | Only one primary workflow detail set is open at a time; secondary outputs move to tabs or trays. | Prevents the current always-open overload. |
| Feature-to-Map Coupling | Every workspace shows a clear map effect: layer, selection, camera, annotation, alert, or timeline behavior. | Keeps all features meaningfully spatial. |
| Inspector Discipline | The right panel shows context, selection, and support detail, not the entire product. | Protects the map center. |
| Bottom Tray Discipline | Bundles, audit, activity, and bulk results live in a tray instead of crowding the map. | Keeps secondary volume off the main surface. |
| Visual Restraint | No decorative gradients, hero cards, or repeated pill chrome dominate the UI. | Aligns with `Uncodixfy`. |
| Accessibility Clarity | Tabs, buttons, and semantic states remain keyboard reachable and not color-only. | Preserves REQ-0212. |
| Engineering Simplicity | The first pass uses a fixed governed shell before advanced docking/layout libraries. | Keeps proof and maintenance tractable. |

## 6) Recommended Information Architecture

### 6.1 Frame

- Header: identity, connectivity, role, marking, bundle actions, offline toggle.
- Left panel: task selection plus the active workspace controls.
- Main canvas: map runtime first, with only compact map-linked status directly adjacent.
- Right panel: contextual inspector, assistant, and concise support summaries.
- Bottom panel: tabbed tray for outputs, bundles, audit, and activity.

### 6.2 Top-Level Task Families

| Family | Tabs | Primary Purpose |
|--------|------|-----------------|
| Monitor | Live, Replay, Offline, Alerts | Understand what is happening now and how it changed. |
| Analyze | Query, Compare, Assistant | Interrogate evidence and prepare map-linked outputs. |
| Context | Intake, Domains, Deviation | Register enrichment sources and monitor domain-driven change. |
| Plan | Scenario, Model | Build and inspect hypothetical or solver-backed futures. |
| Collaborate | Session | Share view state and resolve merge/replay issues. |

### 6.3 Required Mode Mapping

| Required Mode | Workbench Placement |
|---------------|---------------------|
| live_recent | Monitor / Live |
| replay | Monitor / Replay |
| compare | Analyze / Compare |
| scenario | Plan / Scenario |
| collaboration | Collaborate / Session |
| offline | Monitor / Offline |

### 6.4 Bottom Tray Contents

- Outputs: compare artifacts, query results, scenario exports, alert events, deviation events.
- Bundles: create, reopen, select, and inspect deterministic bundle state.
- Audit: event ledger, replay cursor context, and hash chain visibility.
- Activity: budget telemetry, export artifacts, degraded-state messages, and runtime status.

## 7) Feature-To-Map Placement

| Capability | Required Map Connection |
|------------|-------------------------|
| Query | Matched rows and saved results become explicit runtime layers and AOI selections. |
| Compare | Delta cells, focus AOI, and briefing targets render on the map. |
| AI | Assistant output anchors to selected AOIs, bundles, or artifacts instead of floating as free text. |
| Context | Domains either render as overlays or drive AOI/time-correlated side detail. |
| Deviation | Domain deviations create visible event markers, changed AOIs, or affected nodes. |
| Alerts | Aggregate-only AOI alerts render as governed warning surfaces or markers. |
| Scenario | Constraints and hypothetical changes project to map annotations, corridors, or selected AOIs. |
| Strategic Model | Solver output appears as affected routes, nodes, regions, or scenario bookmarks. |
| Collaboration | Shared view state, AOI focus, and replay intent remain visible on the map. |
| Bundles and Audit | Reopen and audit actions restore or explain map state rather than living in isolation. |

## 8) Visual Direction

- Keep the shell dark and muted, but replace gradients and glows with solid charcoal surfaces and border hierarchy.
- Use the existing project palette as the base, then desaturate shell chrome so semantic evidence/context/model colors stand out only where needed.
- Keep text hierarchy plain and direct.
- Keep corners tight and consistent.
- Treat tabs and toolbars as functional controls, not decorative chips.

## 9) Engineering Decision

- First pass: fixed governed workbench shell using existing stable regions and simple local state.
- Deferred: detachable panes, arbitrary user docking, multi-window layouts, and heavy panel-layout libraries.
- Reason: those features have clear ROI later, but they are not required to solve the current overwhelm problem and would expand proof surface too early.

## 10) ROI Follow-On Backlog

| Idea | ROI | Reason | Candidate Packet |
|------|-----|--------|------------------|
| Saved layout presets | High | Lets analysts switch between monitor, compare, and planning layouts quickly. | Future `WP-I1-006` candidate |
| Dual-map compare split view | High | Strong fit for compare workflows once the base shell is calm. | Future `WP-I2-004` candidate |
| Detachable inspector panes | Medium | Good for power users, but higher state/persistence complexity. | Future `WP-I1-007` candidate |
| Layer tree with grouped presets | Medium | Improves map readability and operator speed. | Future `WP-I1-006` candidate |
| Timeline tray with scrub bookmarks | Medium | Useful once the main shell structure is stable. | Future `WP-I1-006` candidate |

## 11) Implementation Recommendation for WP-I1-005

- Restyle the existing shell into a calmer workbench rather than replacing the runtime stack.
- Keep the verified selectors and regions.
- Move from always-open panels to grouped tabs and trays.
- Reduce the main canvas to map plus compact map-linked status.
- Keep every feature map-linked and truthfully labeled.
