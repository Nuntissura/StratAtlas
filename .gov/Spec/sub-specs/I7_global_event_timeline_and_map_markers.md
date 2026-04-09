# I7 Global Event Timeline and Map Markers

Date: 2026-04-10
Owner: Codex
Status: Draft for active implementation packet `WP-I7-003`

## Purpose

Define the next narrow I7 seam after governed context ingestion, deviation detection, and aggregate alert evaluation are already real. This slice does not create a second event store. It materializes the existing governed event artifacts into a global analyst-facing timeline and a zoom-aware map-marker surface that stays truthful about source, cadence, confidence, and spatial eligibility.

## Problem Statement

The current runtime already emits event-like artifacts, but the operator still has to assemble the event story manually:

1. Deviation and OSINT artifacts exist, but there is no single chronology that shows what changed first and what matters now.
2. The map projects the latest deviation and a small OSINT subset, but there is no dedicated event layer with cluster/expand behavior as the camera changes.
3. Event-to-AOI linking is weak. The analyst can see event markers, but cannot move from a global event list directly into the relevant map focus and contextual inspect state.
4. Point-of-use truthfulness is uneven. Source, update cadence, confidence, and aggregate-only semantics should be visible in the timeline and hover/inspect helpers instead of being buried in unrelated cards.

## Linked Requirements

- REQ-0804
- REQ-0805
- REQ-0808
- REQ-0809

## Linked Primitives

- PRIM-0076

## Delivery Contract

### 1) Derived Timeline Contract

- The timeline MUST be derived from already-governed event artifacts rather than a parallel event-authoring path.
- The initial scope MAY compose the existing I8 deviation event, I9 aggregate alert, and I9 OSINT events.
- Timeline entries MUST remain explicit about event type, AOI, timestamp, and whether the record is aggregate-only context rather than entity pursuit.
- Timeline ordering MUST be deterministic for identical restored inputs.

### 2) Map Marker Contract

- Only spatially eligible events MAY render as map markers.
- `sidebar_timeseries` and `dashboard_widget` context presentations MUST remain off the map even if they still participate in the global timeline.
- Event markers MUST expose zoom-aware cluster/expand behavior on the interactive map runtime.
- Marker click or keyboard-equivalent selection MUST focus the relevant AOI and reveal the corresponding contextual inspect state.

### 3) Point-of-Use Metadata Contract

- Timeline entries, hover helpers, and contextual inspect cards MUST display source, update cadence, and confidence in operator-readable form.
- Aggregate alerts MUST remain labeled as aggregate AOI context rather than precise geolocated incidents.
- Deviation-derived entries MUST remain labeled as correlated context or modeled watch signals rather than causal proof.

### 4) Persistence and Reopen Contract

- This packet SHOULD derive its timeline from already-restored governed event state so bundle reopen does not require a new event schema.
- Reopened bundles that already restore deviation and OSINT state MUST also restore the same derived timeline and map-marker story.
- Offline or cached sessions MUST continue to show the timeline truthfully with staleness semantics inherited from the underlying event artifacts.

## Implementation Guidance

- Prefer a compact in-map event rail for the most recent events and a fuller tray-level timeline for review and jump-to-AOI actions.
- Use stable event IDs from the underlying deviation and OSINT artifacts so timeline selection and map selection can target the same inspect entry.
- Use the headless bridge and built-in visual debugger for packet proof instead of input simulation.
- Keep the map dominant. Event UI should enrich the current map-first shell rather than replacing it with another dashboard stack.

## Explicit Non-Goals

- No new geopolitical baseline dataset or "what's happening now" dashboard; that belongs to `WP-I7-004`.
- No new ingestion connectors or event-producing services.
- No individual targeting, social scraping, or false precision for aggregate regional context.
- No recorder or bundle schema growth unless correctness truly requires it.

## Proof Expectations

- Automated tests cover timeline derivation, spatial eligibility filtering, and event-to-map focus behavior.
- Packet checks pass and the product builds successfully.
- Live bridge proof captures the timeline surface and the map after an event-linked navigation flow.
