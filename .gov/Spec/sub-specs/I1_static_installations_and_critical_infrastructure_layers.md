# I1 Static Installations and Critical Infrastructure Layers

Date: 2026-03-10
Status: IMPLEMENTED
Iteration: I1
Parent Spec: .gov/Spec/stratatlas_spec_v1_2.md
Linked Work Packet(s): WP-I1-009
Linked Requirements: REQ-0013, REQ-0108, REQ-0200, REQ-0201, REQ-0202, REQ-0203, REQ-0211, REQ-0212
Linked Primitives: PRIM-0045, PRIM-0046, PRIM-0071

## 1) Intent

Add the first governed source-backed map layer family using static or periodically refreshed installations that are useful immediately and truthful offline.

## 2) Layer Set

- Commercial airports
- Commercial ports
- Power plants
- Dams
- Curated military airbases
- Curated military ports

## 3) Required Outcomes

- Each layer declares source, license, cadence, geometry, sensitivity, and caching behavior.
- Layers render cleanly in 2D and remain legible when the scene is degraded or aggregated.
- Offline packaging remains usable from local governed artifacts.
- Known coverage gaps and regional bias are exposed in UI help and packet evidence.

## 4) Boundaries

- No live vehicle, vessel, or aircraft motion is implied by this packet.
- Military installations must be labeled as curated known installations, not comprehensive or live truth.
- Refineries and water-treatment sites are handled by a later specialized packet.

## 5) Guardrail Response

Status: Completed for `WP-I1-009`.

- Strategic question fit: The family answers strategic baseline questions such as which fixed logistics, energy, water-control, and known military installations shape capacity and constraint around the current governed AOIs before higher-volatility feeds are layered on top.
- Map-first contribution: The installations render directly on the shared 2D/3D scene so compare, scenario, export, and briefing flows can reason about durable infrastructure without leaving the map.
- Evidence label contract: Every member entry is labeled `Curated Context`; none of these layers are presented as observed movement, alert truth, or modeled output.
- Context and causality boundary: Static facilities provide locational context and baseline constraints only; they do not assert operational state, throughput, intent, or causation for other events.
- Mode integration: The family is available in the grouped dock across the governed workbench, contributes to replay/compare/scenario/offline map views, and remains source-labeled in the shell and map legend.
- Bundle/export/reopen contract: Family visibility and selected installation layers persist through recorder state and bundle reopen; export remains gated by the existing license/sensitivity policy already enforced by the layer registry.
- Non-goal and anti-tracker boundary: No live tracking, entity pursuit, or covert targeting behavior is introduced. Military sites are explicitly framed as curated known installations rather than live posture or comprehensive military truth.
- Shell fit and cognitive-load control: The family stays collapsed by default, uses one grouped dock card, and only reveals detailed source/cadence/coverage/truth notes on demand so the map remains primary.
- Truthful degradation states: The dock badge is `Static-only`, coverage notes are explicit, and packaged snapshots remain usable offline without claiming live refresh or global completeness.
- Proof obligations: Packet proof must show dock/state labels, per-layer metadata, runtime map rendering, recorder/bundle persistence, build success, and anti-tracker copy/guardrail conformance.
