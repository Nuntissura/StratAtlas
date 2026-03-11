# I1 Commercial Air Traffic and Flight Awareness Layers

Date: 2026-03-11
Status: IMPLEMENTED
Iteration: I1
Parent Spec: .gov/Spec/stratatlas_spec_v1_2.md
Linked Work Packet(s): WP-I1-010
Linked Requirements: REQ-0013, REQ-0108, REQ-0200, REQ-0201, REQ-0202, REQ-0203, REQ-0211, REQ-0212
Linked Primitives: PRIM-0045, PRIM-0046, PRIM-0071

## 1) Intent

Add the first live mobility layer with the cleanest open governed path: commercial air traffic, separated from any heuristic military-awareness overlay.

## 2) Required Outcomes

- Commercial aircraft positions render as a toggleable mobility layer with truthful live or delayed state labels.
- Known military-flight awareness is a separate layer or subfamily with explicit heuristic/curated labeling.
- Degraded or offline state is explained instead of silently disappearing.
- Export policy respects source and licensing constraints.

## 3) Boundaries

- No unsupported military/commercial certainty claims.
- No individual targeting or stalking workflow.
- No covert or hidden identity inference beyond governed source fields and explicit heuristics.

## 4) Guardrail Response

Status: Completed for `WP-I1-010`.

- Strategic question fit: The family answers route-pressure and throughput questions by showing movement in the focused AOI instead of adding a generic tracker tab.
- Map-first contribution: Commercial flights and heuristic awareness candidates render directly in the governed 2D/3D runtime with projected tracks, inspect cards, and legend entries.
- Evidence label contract: Commercial air traffic is labeled `Observed Evidence`; the separate awareness overlay is labeled `Curated Context` and explicitly described as heuristic.
- Context and causality boundary: The awareness overlay is a narrow watchlist-derived aid and does not imply verified military identity, intent, or causality.
- Mode integration: The family respects the grouped dock, map legend, inspect targets, family badges, and recorder restore behavior without bypassing existing compare/scenario/query flows.
- Bundle/export/reopen contract: The current air snapshot persists in workspace state, restores through recorder save and bundle reopen, and blocks export through layer policy rather than silently leaking source-constrained content.
- Non-goal and anti-tracker boundary: No individual targeting workflow, hidden identity enrichment, or covert inference path is introduced; the overlay never claims authoritative military classification.
- Shell fit and cognitive-load control: The dock shows one family summary, explicit source-state detail, and an opt-in refresh action instead of flooding the shell with raw flight metadata.
- Truthful degradation states: `Live`, `Delayed`, and `Cached` states are explicit; offline or failed refreshes fall back to a labeled cached benchmark snapshot.
- Proof obligations: `WP-I1-010` must prove family separation, degraded-state labels, recorder/bundle restore, map rendering, lint/build parity, and guarded anti-tracker behavior.
