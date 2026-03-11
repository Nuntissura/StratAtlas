# I1 Toggleable Layer Family Registry

Date: 2026-03-10
Status: IMPLEMENTED
Iteration: I1
Parent Spec: .gov/Spec/stratatlas_spec_v1_2.md
Linked Work Packet(s): WP-I1-008
Linked Requirements: REQ-0013, REQ-0200, REQ-0201, REQ-0202, REQ-0203, REQ-0212
Linked Primitives: PRIM-0045, PRIM-0068, PRIM-0071

## 1) Intent

Create the map-layer family registry and control dock that will hold future air, maritime, satellite, infrastructure, facility, and military-awareness layer groups without collapsing the shell back into dashboard sprawl.

## 2) Required Outcomes

- Group layer controls by family instead of mixing every toggle into one flat list.
- Surface truthful state labels per family:
  - available
  - unavailable
  - static
  - live
  - delayed
  - heuristic
  - licensed
- Persist family visibility and expanded/collapsed control state as part of governed workspace state.
- Keep the control surface keyboard reachable and calm enough for first use.

## 3) Families To Support

- Static installations and critical infrastructure
- Commercial air traffic and flight awareness
- Satellite orbit and coverage
- Maritime traffic and maritime awareness
- Specialized industrial and water infrastructure

## 4) Boundaries

- This packet is a control-surface and registry packet, not a dataset packet.
- Empty or unavailable families must be shown truthfully; they must not imply that data already exists.
- The dock must support both 2D and 3D map runtime modes.

## 5) Guardrail Response

Status: Completed for `WP-I1-008` packet proof.

- Strategic question fit: The registry answers “which spatial family is visible right now, what is still only planned, and how do I keep the map focused on the specific strategic evidence I need for compare, scenario, and export?”
- Map-first contribution: The dock belongs beside the 2D/3D runtime because it governs what becomes spatially visible on the scene. Families are not side-panel-only metadata; they are the control contract for future map-visible payloads.
- Evidence label contract: The current verified family preserves existing per-layer artifact labels, while future families are shown only as queue-backed placeholders with truthful `Unavailable` or `Blocked` state badges. No placeholder family is presented as observed or live.
- Context and causality boundary: The dock controls visibility and source-state messaging only. It does not claim that any future family explains causation, and the placeholder copy explicitly states that payload layers are not loaded in the current build.
- Mode integration: The family dock is available in Live/Recent, Replay, Compare, Scenario, and Offline modes. The verified family persists across recorder saves and bundle reopen. Planned families stay collapsed or disabled with the same truthful state labels in every mode.
- Bundle/export/reopen contract: `layerFamilyVisibility` and `layerFamilyExpanded` are now stored in the workspace snapshot, restored through recorder hydration, and preserved on reopen. Only actual visible runtime layers affect the export policy and visible-layer counts.
- Non-goal and anti-tracker boundary: The dock does not add any live pursuit features. Future families remain queue-owned placeholders until governed payload packets land, and the maritime family is visibly blocked behind its source-governance packet instead of being implied as available.
- Shell fit and cognitive-load control: One verified family ships open by default, planned families stay collapsed, and the dock uses grouped cards, queue-owner hints, and disabled payload toggles instead of a flat wall of checkboxes.
- Truthful degradation states: The current packet surfaces `Available`, `Unavailable`, and `Blocked` directly in the workbench. Future packets can extend into `Static-only`, `Delayed`, `Heuristic`, or `Licensed` only when those paths become real.
- Proof obligations: `src/features/i1/i1.test.ts` verifies the family registry model, `src/App.test.tsx` verifies grouped family rendering and recorder restore, and packet proof requires `pnpm lint`, `pnpm build`, and `.gov/workflow/wp_checks/check-WP-I1-008.ps1`.
