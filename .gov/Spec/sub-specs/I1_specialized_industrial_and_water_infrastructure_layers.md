# I1 Specialized Industrial and Water Infrastructure Layers

Date: 2026-03-11
Status: IMPLEMENTED
Iteration: I1
Parent Spec: .gov/Spec/stratatlas_spec_v1_2.md
Linked Work Packet(s): WP-I1-013
Linked Requirements: REQ-0013, REQ-0108, REQ-0200, REQ-0201, REQ-0202, REQ-0203, REQ-0211, REQ-0212
Linked Primitives: PRIM-0045, PRIM-0046, PRIM-0071

## 1) Intent

Add specialized infrastructure layers that need composite governed sourcing rather than a single clean global dataset.

## 2) Layer Set

- Oil refineries
- Ore processing and smelting sites
- Water treatment and filtration plants
- Other specialized industrial resource-processing sites approved by governance

## 3) Required Outcomes

- Composite-source ingestion with explicit coverage and quality labels.
- Curated/static-first delivery, with no false implication of live operational state.
- Offline-safe packaging where licensing allows.

## 4) Boundaries

- This packet starts only after source coverage and QA criteria are acceptable.
- It must expose uncertainty and incomplete regional coverage directly in UI help.

## 5) Guardrail Response

Status: Completed for `WP-I1-013`.

- Strategic question fit: The family answers resilience and throughput questions around refining, metallurgical processing, and water treatment instead of acting like a generic “industrial places” overlay.
- Map-first contribution: Specialized sites render directly on the map as curated context, so compare, scenario, and briefing flows can anchor industrial/resource-processing constraints spatially rather than burying them in side notes.
- Evidence label contract: All member layers are labeled as curated static context, with explicit coverage-gap language and no suggestion of live operational throughput, outage, inventory, or quality truth.
- Context and causality boundary: The family adds infrastructure context only; it does not imply that any facility causes an observed disruption, and it does not convert industrial presence into unsupported intent or affiliation claims.
- Mode integration: The family participates in the grouped dock, scene narrative, inspect cards, recorder persistence, and bundle reopen without introducing a separate workflow surface.
- Bundle/export/reopen contract: Visibility, selected member layers, and the family’s curated context role survive recorder save and bundle reopen through the existing workspace-state contract.
- Non-goal and anti-tracker boundary: The packet does not add live industrial telemetry, covert targeting behavior, or surveillance-style facility monitoring; it stays at benchmark static context level.
- Shell fit and cognitive-load control: The family adds one summary card and three member toggles, keeping composite-source uncertainty visible without overwhelming the dock.
- Truthful degradation states: The family is intentionally packaged as a partial AOI benchmark with cluster-level uncertainty notes where appropriate; incomplete regional coverage is visible in family and member metadata.
- Proof obligations: `WP-I1-013` must prove family toggles, explicit coverage/uncertainty communication, map rendering, and recorder/bundle restore with full lint/build/test parity before promotion.
