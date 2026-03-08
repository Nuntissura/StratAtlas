# WP-I7-002 - Real Context Ingestion and Correlation Runtime

Date Opened: 2026-03-06
Status: IN-PROGRESS
Iteration: I7
Workflow Version: 4.0
Packet Class: IMPLEMENTATION
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I7-002.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I7-002.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I7-002.ps1

## Intent

Replace synthetic context seeding with the governed ingestion and correlation runtime described by the spec. This packet restores authoritative context-domain registration, ingestion, retrieval, and explicit correlation handling on top of the new storage backbone.

## Reality Boundary

- Real Seam: context domain registration in the product runtime now ingests approved packaged domain snapshots through a governed catalog instead of generating seeded records in the UI.
- User-Visible Win: the analyst chooses an approved context domain, sees locked source metadata, and every downstream surface (query, compare, OSINT thresholding, deviation, scenario) runs against the ingested governed records.
- Proof Target: targeted Vitest coverage for governed catalog ingestion and App workflows, plus lint/build and the eventual `check-WP-I7-002.ps1` evidence bundle.
- Allowed Temporary Fallbacks: packaged curated snapshots remain the data source for this slice; live external connectors and runtime smoke proof remain follow-on work inside this packet.
- Promotion Guard: do not promote beyond `IN-PROGRESS` until the packet has formal WP-check artifacts and desktop/runtime evidence for the full context ingestion flow.

## Fallback Register

- Explicit simulated/mock/sample paths: packaged governed snapshots stand in for live connector pulls, and legacy `buildSampleContextRecords` remains only as a test fixture helper.
- Required labels in code/UI/governance: App and packet text must keep saying `governed`, `curated`, and `correlated context only; not causal evidence` for this slice.
- Successor packet or debt owner: this packet retains ownership until live connectors, runtime smoke, and formal WP proof are complete.
- Exit condition to remove fallback: connector-backed ingestion and packet-level runtime proof exist, and the App no longer depends on packaged snapshots for normative delivery claims.

## Change Ledger

- 2026-03-08: Packet upgraded to Workflow Version 4.0 and moved to `IN-PROGRESS` with an explicit real seam, fallback register, and promotion guard.
- 2026-03-08: Product runtime switched from registration-time synthetic seeding to governed catalog ingestion backed by packaged domain snapshots in `src/features/i7/governedDomains.ts`.
- 2026-03-08: App surfaces now reuse the governed ingested context records across query, deviation, OSINT thresholding, scenario constraint nodes, and bundle persistence.
- What Became Real: approved domain registration now resolves to governed catalog metadata plus packaged curated records instead of UI-generated seeded samples.
- What Remains Simulated: packaged curated snapshots remain the active source, and formal packet proof/runtime smoke are still outstanding.
- Next Blocking Real Seam: finish live connector/runtime proof and close the packet with a formal `check-WP-I7-002.ps1` evidence bundle.

## Linked Requirements

- REQ-0800
- REQ-0801
- REQ-0802
- REQ-0803
- REQ-0804
- REQ-0805
- REQ-0806
- REQ-0807
- REQ-0808
- REQ-0809
- REQ-0810

## Linked Primitives

- PRIM-0054 | Context Ingestion Pipeline | Bring curated context domains into the governed store with provenance, cadence, and offline policy metadata.
- PRIM-0055 | Correlation Registry Store | Persist explicit, auditable correlation links and retrieval indexes without implying causation.

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## In Scope

- Replace seeded or synthetic context records with governed ingestion, retrieval, and correlation behavior.
- Implement the context-domain metadata, offline policy, bundle capture, and display contracts required by the spec.
- Provide the authoritative context state that downstream deviation, alert, and solver packets depend on.

## Out of Scope

- Shipping the aggregate alert runtime or deviation detector itself, which belong to WP-I8-002 and WP-I9-002.
- Implementing AI behavior beyond the evidence and context dependencies required by WP-I6-002.
- Any correlation behavior that implies causation or violates labeling and non-goal constraints.

## Expected Files Touched

- .gov/Spec/stratatlas_spec_v1_2.md
- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-I7-002_real-context-ingestion-and-correlation-runtime.md
- .gov/workflow/wp_test_suites/TS-WP-I7-002.md
- .gov/workflow/wp_spec_extractions/SX-WP-I7-002.md
- .gov/workflow/wp_checks/check-WP-I7-002.ps1
- .product/Worktrees/wt_main/src/features/i7/
- .product/Worktrees/wt_main/src/features/i7/governedDomains.ts
- .product/Worktrees/wt_main/src/lib/backend.ts
- .product/Worktrees/wt_main/src-tauri/src/lib.rs
- .product/Worktrees/wt_main/src/contracts/

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0054 | context ingestion runtime | governed connector and normalization pipeline | Replaces synthetic context values with authoritative domain data and metadata. |
| PRIM-0055 | correlation registry | explicit link storage plus audit capture | Makes context relationships traceable, reviewable, and reusable by downstream slices. |

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

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I7-002.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I7-002/
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
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I7-002/
- User Sign-off:

- What Became Real: the App runtime now materializes approved governed context records from a packaged domain catalog instead of generating seeded records during registration and AOI correlation updates.
- What Remains Simulated: live external connector pulls and formal WP proof capture remain outstanding; curated packaged snapshots are still the operative source for this slice.
- Next Blocking Real Seam: persist and verify governed context ingestion end to end through the formal WP check flow, including runtime proof and packet-level evidence capture.

## Progress Log

- 2026-03-06: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
- 2026-03-06: Packet scope refined to replace seeded context simulation with governed ingestion and correlation runtime behavior.
- 2026-03-08: Started implementation under Workflow Version 4.0; first slice landed governed domain catalog ingestion and removed App-side registration seeding.
