# I1 Satellite Orbit and Coverage Layers

Date: 2026-03-11
Status: IMPLEMENTED
Iteration: I1
Parent Spec: .gov/Spec/stratatlas_spec_v1_2.md
Linked Work Packet(s): WP-I1-011
Linked Requirements: REQ-0013, REQ-0108, REQ-0200, REQ-0201, REQ-0202, REQ-0203, REQ-0211, REQ-0212
Linked Primitives: PRIM-0045, PRIM-0046, PRIM-0071

## 1) Intent

Add a governed satellite layer family that works in both 2D and 3D while truthfully labeling propagated positions as modeled outputs derived from orbital elements.

## 2) Required Outcomes

- Toggleable satellite points, tracks, or footprints in 2D and 3D.
- Explicit labeling for propagated versus directly observed state.
- Constellation or category grouping that does not overwhelm the shell.
- Offline cached orbital elements when permitted by source policy.

## 3) Boundaries

- No claim of direct live telemetry when positions are propagated from TLE/GP data.
- No unsupported classification or mission inference.

## 4) Guardrail Response

Status: Completed for `WP-I1-011`.

- Strategic question fit: The family answers orbital-context and coverage questions in the focused AOI instead of adding an isolated “space tracker” surface.
- Map-first contribution: Propagated passes, ground tracks, and coverage footprints render directly in the governed 2D/3D runtime with inspect targets and family-dock controls.
- Evidence label contract: Satellite overlays are labeled as propagated/modeled output rather than direct telemetry, and cached/live source-state wording remains explicit in the family summary.
- Context and causality boundary: The family adds spatial context only and does not imply mission certainty, causal claims, or unsupported operational conclusions.
- Mode integration: The family participates in the grouped dock, scene composition, family badges, 2D/3D roundtrip behavior, and persisted workspace state without bypassing existing shell controls.
- Bundle/export/reopen contract: The current satellite snapshot, family visibility, family expansion, and selected member layers persist through recorder save and bundle reopen, and the runtime smoke proof copies the reopened bundle artifacts.
- Non-goal and anti-tracker boundary: No individual targeting workflow, covert classification inference, or mission-enrichment path is added; the packet keeps a small governed subset and avoids pretending to be a real-time targeting display.
- Shell fit and cognitive-load control: The family surfaces one summary card, three modeled member toggles, and an opt-in refresh action instead of dumping raw orbital metadata into the shell.
- Truthful degradation states: Tauri can refresh governed orbital elements from CelesTrak, while browser/offline fallback stays usable through an explicitly labeled packaged benchmark snapshot.
- Proof obligations: `WP-I1-011` must prove family visibility, modeled-output label contract, 2D/3D projection, and bundle restore in the governed Tauri runtime, plus lint/build/test parity.
