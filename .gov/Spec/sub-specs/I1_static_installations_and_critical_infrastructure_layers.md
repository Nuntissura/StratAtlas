# I1 Static Installations and Critical Infrastructure Layers

Date: 2026-03-10
Status: DRAFT
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
