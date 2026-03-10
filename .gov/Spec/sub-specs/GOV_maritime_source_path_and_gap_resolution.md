# GOV Maritime Source Path and Gap Resolution

Date: 2026-03-10
Status: DRAFT
Iteration: All
Parent Spec: .gov/Spec/stratatlas_spec_v1_2.md
Linked Work Packet(s): WP-GOV-MAPDATA-002
Linked Requirements: REQ-0013, REQ-0019, REQ-0020, REQ-0021, REQ-0022, REQ-0200, REQ-0201
Linked Primitives: PRIM-0045, PRIM-0071

## 1) Intent

Resolve the maritime layer truth gap before implementation: which source path is acceptable, what latency and coverage labels are required, and what remains blocked without licensing or curation.

## 2) Questions To Resolve

- Which maritime source path is acceptable first:
  - licensed AIS provider
  - delayed open/public service
  - regional open path plus explicit coverage limit
- What vessel classes and update cadences can be claimed truthfully?
- What military/naval awareness can be surfaced only as curated static knowledge rather than live movement?
- What export and offline-caching constraints apply?

## 3) Required Outputs

- A governed source decision matrix
- A UI/source-state labeling contract
- An implementation decision for `WP-I1-012`
- A gap ledger for unresolved licensing, coverage, and military-awareness limits
