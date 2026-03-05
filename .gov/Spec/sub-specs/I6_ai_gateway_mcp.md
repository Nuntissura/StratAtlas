# I6 - AI Gateway + MCP Interface Sub-Spec

Date: 2026-03-05
Status: DRAFT
Iteration: I6
Parent Spec: .gov/Spec/stratatlas_spec_v1_2.md
Linked Work Packet(s): WP-I6-001
Linked Requirements: REQ-0700..REQ-0708

## 1) UX Contract

- This slice delivers: policy-gated AI gateway, audited MCP tool surface, hash-addressed evidence references.
- UX states and mode transitions are specified as deterministic flows tied to the active iteration requirements.
- Golden flow coverage is required before merge for this slice.

## 2) Data Model

- Introduce or extend typed artifacts required by this iteration.
- Maintain explicit IDs, versioning fields, provenance references, and sensitivity marking fields.
- Preserve compatibility with existing bundle/audit contracts introduced in I0.

## 3) Storage Implementation

- Persist authoritative control-plane state in PostgreSQL/PostGIS-aligned structures.
- Persist high-volume analytical/context artifacts in partitioned, hash-addressable stores per spec section 6.3.
- Keep append-only correction semantics for immutable artifacts.

## 4) Provenance and Markings

- All new artifacts inherit sensitivity markings.
- Provenance metadata MUST include source, license, retrieval time, and transformation lineage.
- UI surfaces provenance and confidence at point-of-use.

## 5) Audit Coverage

- Record creation, mutation, comparison/export, and policy-relevant access events.
- Maintain actor attribution and replayability for all iteration-critical actions.
- Audit schema deltas are versioned and migration-safe.

## 6) Offline Behavior

- Core analyst workflows in this slice remain functional on cached/saved artifacts.
- Online-only operations degrade gracefully with explicit staleness/unavailable indicators.
- Sync/reconnect semantics are explicit and auditable.

## 7) Determinism Guarantees

- Replay/export operations for this slice are deterministic given identical inputs.
- Randomized/solver workflows require persisted seeds and explicit configuration capture.
- Hash-addressed references are used for externally consumed evidence artifacts.

## 8) Performance Budget and Tests

- Performance target: gateway adds bounded latency and preserves analyst feedback responsiveness.
- Add automated tests for critical latency, responsiveness, and deterministic flow budgets.
- Record benchmark evidence in active WP artifacts.

## 9) Threat Model Notes

- Primary risk: prompt/tool abuse leading to policy bypass or raw-path exposure.
- Enforce misuse constraints (spec section 3.2) at UI, service, and plugin/tool boundaries.
- Add abuse-case tests for any newly exposed interfaces.

## 10) Schema Deltas

- Add/modify JSON schemas for this slice's new artifacts.
- Validate schema compatibility and migration behavior.
- Update Appendix B references in the parent spec when new MUST-level artifacts are introduced.

## 11) API/Interface Deltas

- Define gateway/MCP/service/API deltas needed by this slice.
- All interfaces are policy-aware, auditable, and path-agnostic.
- No raw DB or raw filesystem endpoint exposure.

## 12) Open Questions

- Final sequencing dependencies and edge-case acceptance criteria per linked WP.
- Dataset sizing assumptions for performance validation.
- Any approvals needed for additional runtime dependencies.

## 13) Approval

- Product: Pending
- Engineering: Pending
- Security/Compliance: Pending
- Approved On: Pending

