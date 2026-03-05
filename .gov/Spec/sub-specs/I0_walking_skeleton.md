# I0 - Walking Skeleton Sub-Spec

Date: 2026-03-05
Status: APPROVED
Iteration: I0
Parent Spec: `.gov/Spec/stratatlas_spec_v1_2.md`
Linked Work Packet(s): `WP-I0-001`
Linked Requirements: `REQ-0100..REQ-0112`, `REQ-0017`, `REQ-0018`

## 1) UX Contract

- Desktop shell launches into a single-window workstation with three stable zones:
  - Header: app status, offline indicator, active role, marking level.
  - Main workspace: map placeholder + session details.
  - Right panel: bundle, audit, and provenance views.
- Default mode on launch is `Offline` if network probe fails or is disabled.
- Golden flow for I0:
  1. Start application.
  2. Create bundle from current state.
  3. Reopen bundle by `(bundle_id, asset_id, sha256)` addressing.
  4. Validate deterministic state restoration + audit record continuity.

## 2) Data Model

- `UserRole`: enum `viewer | analyst | administrator | auditor`.
- `SensitivityMarking`: enum `PUBLIC | INTERNAL | RESTRICTED`.
- `BundleManifest`:
  - `bundle_id: string`
  - `created_at: string (ISO8601 UTC)`
  - `created_by_role: UserRole`
  - `marking: SensitivityMarking`
  - `assets: BundleAsset[]`
  - `ui_state_hash: string`
  - `derived_artifact_hashes: string[]`
  - `provenance_refs: ProvenanceRef[]`
  - `supersedes_bundle_id?: string`
- `BundleAsset`:
  - `asset_id: string`
  - `sha256: string`
  - `media_type: string`
  - `size_bytes: number`
  - `bundle_relative_path: string`
- `AuditEvent`:
  - `event_id: string`
  - `ts: string`
  - `actor_role: UserRole`
  - `event_type: string`
  - `payload_hash: string`
  - `prev_event_hash?: string`
  - `event_hash: string`

## 3) Storage Implementation

- Runtime state is persisted under Tauri app data directory:
  - `bundles/<bundle_id>/manifest.json`
  - `bundles/<bundle_id>/assets/*`
  - `audit/audit_log.jsonl`
  - `audit/audit_head.json`
- No Windows drive-letter assumptions in runtime path logic.
- Bundle IDs are UUIDv7-like sortable IDs (or equivalent stable unique IDs).
- Bundle correction is append-only: new bundle references `supersedes_bundle_id`.

## 4) Provenance and Markings

- Every bundle artifact includes:
  - source metadata references,
  - retrieval timestamp,
  - pipeline/tool version.
- Marking inheritance rules for I0:
  - Bundle marking = max sensitivity across included assets.
  - Export metadata inherits bundle marking.
  - UI must display marking in header and bundle panel.

## 5) Audit Coverage

I0 MUST emit immutable audit events for:

- app start/stop,
- role assumption in session,
- bundle create,
- bundle reopen,
- offline mode transition,
- failed integrity validation.

Hash-chain behavior:

- `event_hash = sha256(prev_event_hash + canonical_event_json)`.
- `audit_head.json` stores latest `event_hash` to support tamper checks.

## 6) Offline Behavior

- I0 supports full bundle create/reopen while disconnected.
- Network-dependent features are disabled behind explicit offline banner.
- If context sources are unavailable, UI shows non-blocking "context unavailable".

## 7) Determinism Guarantees

- Reopen operation validates all asset hashes before restoring state.
- Restored state must match serialized UI state hash and derived artifact hashes.
- Failed hash checks block restore and emit audit event.

## 8) Performance Budget and Tests

I0 budgets:

- Cold startup <= 8.0s to interactive shell.
- Warm startup <= 3.0s to interactive shell.
- Bundle open <= 5.0s for reference local bundle.

I0 tests:

- `tests/unit/test_bundle_manifest_integrity`
- `tests/unit/test_bundle_asset_registry`
- `tests/determinism/test_bundle_reopen_deterministic`
- `tests/unit/test_audit_hash_chain`
- `tests/integration/test_offline_bundle_open`
- `tests/integration/test_platform_neutral_paths`

## 9) Threat Model Notes

- Bundle tampering: mitigated by per-asset sha256 and manifest validation.
- Log truncation/rewriting: mitigated by append-only ledger and hash chaining.
- Path traversal: reject bundle-relative paths containing `..` or absolute forms.
- Privilege confusion: role is explicit in session and all audit events.

## 10) Schema Deltas

I0 introduces/updates schemas:

- `schemas/bundle_manifest.schema.json`
- `schemas/bundle_asset.schema.json`
- `schemas/audit_event.schema.json`
- `schemas/audit_head.schema.json`
- `schemas/user_role.schema.json`

## 11) API/Interface Deltas

I0 local interface surface (Tauri command layer):

- `create_bundle(input_state) -> bundle_id`
- `open_bundle(bundle_id) -> restored_state`
- `list_bundles() -> BundleManifest[]`
- `append_audit_event(event_type, payload_hash) -> event_hash`
- `get_audit_head() -> { event_hash }`

No MCP exposure in I0.

## 12) Open Questions

- Final reference hardware profile for startup budget enforcement.
- Whether audit export format will be JSONL-only or JSONL+CSV.
- Whether bundle compression is required in I0 or deferred to I1.

## 13) Approval

- Product: Pending
- Engineering: Pending
- Security/Compliance: Pending
- Approved On: Pending
