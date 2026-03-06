# WP-I0-003 - Governed Control Plane and Artifact Store Backbone

Date Opened: 2026-03-06
Status: SPEC-MAPPED
Iteration: I0
Workflow Version: 3.0
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I0-003.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I0-003.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I0-003.ps1

## Intent

Replace the current file-backed and `localStorage` persistence shortcuts with the governed control-plane, artifact-store, and context time-range storage foundation required by the spec. This packet establishes the storage backbone that the rest of the remediation queue depends on.

## Linked Requirements

- REQ-0017
- REQ-0018
- REQ-0108
- REQ-0109
- REQ-0110
- REQ-0111
- REQ-0810

## Linked Primitives

- PRIM-0042 | Control Plane Persistence Adapter | Move control-plane state onto the governed persistence layer required by the normative architecture.
- PRIM-0043 | Governed Artifact Store Backend | Replace ad hoc local files with immutable, audit-linked artifact storage semantics.
- PRIM-0044 | Context Time-Range Store | Provide the context-series storage contract needed by later query, ingestion, AI, and deviation packets.

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## In Scope

- Introduce the governed storage adapters and persistence contracts required by REQ-0109, REQ-0110, REQ-0111, and REQ-0810.
- Refactor the current bundle, audit, and artifact persistence paths so later runtime slices can depend on the same authoritative backend.
- Preserve offline and portability guardrails while replacing prototype-only storage shortcuts.

## Out of Scope

- Delivering the real 2D or 3D canvas, query runtime, AI runtime, or strategic solver behavior.
- Closing downstream packets that depend on this storage backbone.
- Any Windows-only shortcut that would violate the platform portability contract.

## Expected Files Touched

- .gov/Spec/stratatlas_spec_v1_2.md
- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-I0-003_governed-control-plane-and-artifact-store-backbone.md
- .gov/workflow/wp_test_suites/TS-WP-I0-003.md
- .gov/workflow/wp_spec_extractions/SX-WP-I0-003.md
- .gov/workflow/wp_checks/check-WP-I0-003.ps1
- .product/Worktrees/wt_main/src/lib/backend.ts
- .product/Worktrees/wt_main/src-tauri/src/lib.rs
- .product/Worktrees/wt_main/src/contracts/
- .product/Worktrees/wt_main/src/features/i0/

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0042 | control-plane persistence | TypeScript backend adapters plus Rust storage integration | Gives every later runtime slice a governed, portable place to store authoritative state. |
| PRIM-0043 | artifact store backend | Immutable artifact manifests plus audit-linked persistence | Preserves provenance and supersession semantics instead of ad hoc local files. |
| PRIM-0044 | context time-range store | governed time-series or columnar storage adapter | Unlocks efficient context retrieval for query, ingestion, and deviation workflows. |

## Spec-Test Coverage Plan

### Dependency and Environment Tests
- [ ] Dependency graph/lock integrity tests
- [ ] Runtime compatibility checks

### UI Contract Tests
- [ ] Required regions/modes/states
- [ ] Error/degraded-state UX

### Functional Flow Tests
- [ ] Golden flow and edge cases
- [ ] Persistence/replay/export flows

### Code Correctness Tests
- [ ] Unit tests
- [ ] Integration tests
- [ ] Static analysis (lint/type/schema)

### Red-Team and Abuse Tests
- [ ] Non-goal enforcement (spec section 3.2)
- [ ] Policy bypass scenarios
- [ ] Adversarial/invalid input cases

### Additional Tests
- [ ] Performance budgets
- [ ] Offline behavior
- [ ] Reliability/recovery

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I0-003.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I0-003/
- Claim Standard: do not claim completion without linked command output and artifact paths.

## Exit Criteria

- Task board and requirements index statuses are synchronized.
- Traceability, primitives index, and primitives matrix are synchronized.
- Linked test suite has executed results and evidence paths.
- Evidence bundle is attached.
- User Sign-off: APPROVED.

## Evidence

- Test Suite Execution:
- Logs:
- Screenshots/Exports:
- Build Artifacts:
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I0-003/
- User Sign-off:

## Progress Log

- 2026-03-06: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
- 2026-03-06: Packet scope refined to make this the storage and persistence blocker for the downstream remediation queue.
