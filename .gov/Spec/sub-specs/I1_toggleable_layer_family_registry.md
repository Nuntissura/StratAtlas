# I1 Toggleable Layer Family Registry

Date: 2026-03-10
Status: DRAFT
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
