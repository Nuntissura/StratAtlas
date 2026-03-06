# WP-I0-002 - Recorder Artifact and Context Snapshot Hardening

Date Opened: 2026-03-06
Status: IN-PROGRESS
Iteration: I0
Workflow Version: 3.0
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I0-002.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I0-002.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I0-002.ps1

## Intent

Harden the recorder path so bundles, audit, and active context state are persisted through an authoritative application store instead of living only in demo UI state.
This packet closes the highest-leverage I0 gap by making artifacts hash-addressed, replayable, and rich enough to support later query, AI, and context workflows.

## Linked Requirements

- REQ-0008
- REQ-0009
- REQ-0010
- REQ-0101..REQ-0112
- REQ-0808

## Linked Primitives

- PRIM-0032 | Recorder State Store | persist workspace, layer, query, and context state through the Tauri/backend boundary
- PRIM-0033 | Bundle Asset Snapshot Registry | capture multiple typed bundle assets with stable `asset_id` and `sha256` addressing
- PRIM-0034 | Context Snapshot Artifact | include active context domains, correlation selections, and query/config state in bundle snapshots

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## In Scope

- Expand backend persistence beyond a single `ui-state` asset.
- Persist context-domain registration and active correlation state in the backend/fallback store.
- Capture bundle snapshots for workspace state, context registry, and query definitions with hash-addressed assets.
- Strengthen audit coverage around bundle creation/open and stateful context changes.

## Out of Scope

- Real map/globe rendering activation.
- Full DuckDB-backed analytical query execution.
- MCP server exposure or external AI transport.

## Expected Files Touched

- .gov/Spec/stratatlas_spec_v1_2.md
- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-I0-002_recorder-artifact-and-context-snapshot-hardening.md
- .gov/workflow/wp_test_suites/TS-WP-I0-002.md
- .gov/workflow/wp_spec_extractions/SX-WP-I0-002.md
- .gov/workflow/wp_checks/check-WP-I0-002.ps1
- .product/Worktrees/wt_main/src/contracts/i0.ts
- .product/Worktrees/wt_main/src/lib/backend.ts
- .product/Worktrees/wt_main/src/lib/backend.test.ts
- .product/Worktrees/wt_main/src/App.tsx
- .product/Worktrees/wt_main/src/App.test.tsx
- .product/Worktrees/wt_main/src-tauri/src/lib.rs

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0032 | Backend runtime store | TypeScript + Tauri invoke + Rust persistence | Workspace and context state survive reloads and become testable outside the React component tree. |
| PRIM-0033 | Bundle asset manifest expansion | Rust recorder + SHA-256 asset hashing | Bundle addressing becomes useful for later AI, export, and replay flows. |
| PRIM-0034 | Context snapshot capture | React state + backend serialization | Active context configuration is reproducible instead of being lost outside the current session. |

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

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I0-002.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I0-002/
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
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I0-002/
- User Sign-off:

## Progress Log

- 2026-03-06: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
- 2026-03-06: Packet activated as the current blocking product recovery WP for I0.
