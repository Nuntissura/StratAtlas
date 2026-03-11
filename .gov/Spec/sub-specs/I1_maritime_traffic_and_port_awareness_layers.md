# I1 Maritime Traffic and Port Awareness Layers

Date: 2026-03-11
Status: IMPLEMENTED
Iteration: I1
Parent Spec: .gov/Spec/stratatlas_spec_v1_2.md
Linked Work Packet(s): WP-I1-012
Linked Requirements: REQ-0013, REQ-0108, REQ-0200, REQ-0201, REQ-0202, REQ-0203, REQ-0211, REQ-0212
Linked Primitives: PRIM-0045, PRIM-0046, PRIM-0071

## 1) Intent

Add maritime traffic and maritime-awareness layers only after the source and coverage path is governed.

## 2) Required Outcomes

- Toggleable maritime movement layer with truthful source-state labels.
- Maritime awareness around ports without claiming unsupported live global naval truth.
- AOI-friendly aggregation and export behavior that respects licensing limits.

## 3) Boundaries

- `WP-GOV-MAPDATA-002` resolved the source path enough to begin planning and guarded implementation.
- First implementation scope is constrained to delayed/regional/cached maritime plus optional backend-only user-key live enhancement.
- Default global live maritime and any live naval claim remain out of scope until a future licensed-provider governance decision exists.
- Static port installations belong to `WP-I1-009`; this packet is for movement and maritime-awareness behavior.

## 4) Guardrail Response

Status: Completed for constrained `WP-I1-012` scope.

- Strategic question fit: The family answers chokepoint, diversion, queue-pressure, and port-side throughput questions inside a focused AOI instead of trying to act like a generic ship tracker.
- Map-first contribution: Maritime movement and port-awareness cues render directly on the governed 2D map surface and participate in the same family dock, scene narrative, and inspect flow as the other map families.
- Evidence label contract: Commercial maritime traffic is labeled as benchmark context in the current build, port-awareness remains explicitly heuristic/curated, and no overlay is presented as a default global live feed or naval picture.
- Context and causality boundary: Maritime cues add route and chokepoint context only; they do not claim vessel intent, causality, berth control truth, or unsupported military posture inference.
- Mode integration: The family integrates through the grouped dock, state badges, scene legend, persisted layer state, recorder save, and bundle reopen without bypassing the existing workbench modes.
- Bundle/export/reopen contract: The current maritime snapshot, family visibility, family expansion, and selected member layers persist through recorder state and bundle reopen so the AOI benchmark can be reproduced later.
- Non-goal and anti-tracker boundary: The packet does not add live naval movement, covert inference, or individual targeting behavior, and the packaged benchmark is framed as strategic aggregate context rather than operational pursuit tooling.
- Shell fit and cognitive-load control: The family adds a single summary card plus two member toggles, keeping the dock legible and aligned with the other map-family surfaces rather than flooding the shell with vessel metadata.
- Truthful degradation states: The current build is intentionally constrained to a labeled cached benchmark path; any future delayed, community-key, or licensed-live enhancement must keep separate source-state labels and coverage notes.
- Proof obligations: `WP-I1-012` must prove truthful maritime badges, map projection, persisted state, bundle reopen, anti-overclaim wording, and parity across lint/build/test verification before promotion.
