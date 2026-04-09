# I1 Map-Dominant Declutter and Progressive Disclosure

Date: 2026-04-09
Owner: Codex
Status: Draft for active implementation packet `WP-I1-015`

## Purpose

Capture the bounded shell declutter seam that follows the verified guided-start, map-family, and basemap packets. This sub-spec does not define a new shell framework. It defines how the existing workbench should surface map value earlier and push secondary detail behind explicit disclosure.

## Problem Statement

The current workbench is functional and map-first relative to the earlier baseline, but the 2026-03-09 and 2026-03-11 manual smoke findings still show three specific UX problems:

1. The map-family value is easy to miss because the left rail leads with role, marking, mode, and note controls.
2. The main-canvas summary shows too much support detail at once, so cards and telemetry compete with actual geography.
3. Support-only shell detail is visible by default even when the analyst has not asked for it.

## Linked Requirements

- REQ-0011
- REQ-0012
- REQ-0200
- REQ-0212

## Linked Primitives

- PRIM-0045
- PRIM-0068
- PRIM-0071

## Delivery Contract

### 1) Left Rail Hierarchy

- The full-workbench `workspace` view MUST surface the layer-family dock before the session form stack.
- The first visible left-rail section after the header MUST help the analyst act on the map, not configure platform metadata first.
- Support-only families MAY be hidden behind an explicit disclosure control so they do not dominate the first full-workbench view.
- If support-only families are hidden by default, the UI MUST show how many are hidden and MUST provide a deterministic reveal control.

### 2) Main-Canvas Summary Disclosure

- The default non-guided `summary` deck MUST open in a compact state.
- Secondary scene detail such as telemetry cards, artifact legends, per-layer metadata cards, and support widgets MAY be hidden by default.
- Any hidden scene detail MUST remain available behind an explicit disclosure control in the same panel.
- The compact state MUST still retain a truthful map-state summary and any currently necessary degraded-state warning.

### 3) Accessibility and Semantics

- Disclosure controls MUST be keyboard reachable.
- Hidden versus shown state MUST be conveyed via text and `aria-expanded` or equivalent semantic state, not only by visual styling.
- Declutter MUST NOT remove the governed labels that distinguish observed evidence, curated context, modeled output, and AI-derived interpretation.
- Declutter MUST NOT hide required stable regions or remove access to existing verified workflows.

## Implementation Guidance

- Prefer hierarchy changes and disclosure controls over introducing a new layout engine.
- Prefer moving the layer-family dock upward over inventing a second map-data navigation surface.
- Keep role, marking, mode, and note controls intact, but move them lower in the rail or behind a lighter-weight section so they stop outranking the map families.
- Keep the 2D/3D runtime, current tabs, and guided-start shell intact.

## Explicit Non-Goals

- No full-screen glass overlay rewrite.
- No detachable panes or freeform docking.
- No new data families or new analytical capabilities.
- No relabeling of support or modeled content to make the screen appear simpler than it really is.

## Proof Expectations

- Automated app tests cover compact-summary and left-rail disclosure behavior.
- Packet checks pass under `.gov/workflow/wp_checks/check-WP-I1-015.ps1`.
- If the bridge/runtime is available, capture at least one full-workbench snapshot that shows the calmer shell state.
