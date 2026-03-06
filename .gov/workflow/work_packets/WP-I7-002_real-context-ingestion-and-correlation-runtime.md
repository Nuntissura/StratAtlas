# WP-I7-002 - Real Context Ingestion and Correlation Runtime

Date Opened: 2026-03-06
Status: SPEC-MAPPED
Iteration: I7
Workflow Version: 3.0
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I7-002.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I7-002.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I7-002.ps1

## Intent

Replace synthetic context seeding with the governed ingestion and correlation runtime described by the spec. This packet restores authoritative context-domain registration, ingestion, retrieval, and explicit correlation handling on top of the new storage backbone.

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

## Progress Log

- 2026-03-06: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
- 2026-03-06: Packet scope refined to replace seeded context simulation with governed ingestion and correlation runtime behavior.
