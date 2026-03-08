# WP-I7-002 - Real Context Ingestion and Correlation Runtime

Date Opened: 2026-03-06
Status: E2E-VERIFIED
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
- Proof Target: `check-WP-I7-002.ps1` plus the attached cold/warm Tauri runtime smoke bundle under `.product/build_target/tool_artifacts/wp_runs/WP-I7-002/20260308_060255/runtime_smoke/`.
- Allowed Temporary Fallbacks: packaged curated snapshots remain the governed source for this slice; live external connector expansion is deferred to future connector work and does not block packet closure.
- Promotion Guard: satisfied on 2026-03-08 by the passing `.product/build_target/tool_artifacts/wp_runs/WP-I7-002/20260308_060255/` proof bundle.

## Fallback Register

- Explicit simulated/mock/sample paths: packaged governed snapshots stand in for live connector pulls, and legacy `buildSampleContextRecords` remains only as a test fixture helper.
- Required labels in code/UI/governance: App and packet text must keep saying `governed`, `curated`, and `correlated context only; not causal evidence` for this slice.
- Successor packet or debt owner: future connector expansion moves to follow-on connector work; this packet closes the governed packaged-domain/runtime seam.
- Exit condition to remove fallback: connector-backed ingestion is proven in a dedicated follow-on packet; for this packet, runtime proof and deterministic bundle/reopen evidence are the closure bar.

## Change Ledger

- 2026-03-08: Packet upgraded to Workflow Version 4.0 and moved to `IN-PROGRESS` with an explicit real seam, fallback register, and promotion guard.
- 2026-03-08: Product runtime switched from registration-time synthetic seeding to governed catalog ingestion backed by packaged domain snapshots in `src/features/i7/governedDomains.ts`.
- 2026-03-08: App surfaces now reuse the governed ingested context records across query, deviation, OSINT thresholding, scenario constraint nodes, and bundle persistence.
- 2026-03-08: Immediate recorder-state persistence, Tauri runtime-smoke context assertions, Rust runtime-proof serialization, and formal `check-WP-I7-002.ps1` artifacts landed; closure proof is `.product/build_target/tool_artifacts/wp_runs/WP-I7-002/20260308_060255/`.
- What Became Real: approved domain registration, correlation updates, bundle capture, and bundle reopen now persist and restore governed context state through the real desktop runtime with attached proof artifacts.
- What Remains Simulated: packaged curated snapshots remain the governed source for this closed slice; live external connector expansion is future work, not a blocker for this packet.
- Next Blocking Real Seam: `WP-I8-002` must now consume the restored governed context series for historical deviation detection and downstream propagation.

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

- Test Suite Execution: `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I7-002.ps1`
- Logs: `.product/build_target/tool_artifacts/wp_runs/WP-I7-002/20260308_060255/summary.md`; `.product/build_target/tool_artifacts/wp_runs/WP-I7-002/20260308_060255/result.json`; `.product/build_target/tool_artifacts/wp_runs/WP-I7-002/20260308_060255/UI-001.log`
- Screenshots/Exports: `.product/build_target/tool_artifacts/wp_runs/WP-I7-002/20260308_060255/runtime_smoke/cold/runtime_smoke_summary.md`; `.product/build_target/tool_artifacts/wp_runs/WP-I7-002/20260308_060255/runtime_smoke/warm/runtime_smoke_summary.md`
- Build Artifacts: `.product/build_target/tool_artifacts/wp_runs/WP-I7-002/20260308_060255/EXT-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-I7-002/20260308_060255/EXT-002.log`
- Proof Artifact: `.product/build_target/tool_artifacts/wp_runs/WP-I7-002/20260308_060255/`
- User Sign-off: approved via 2026-03-08 instruction to continue `WP-I7-002` and complete the packet.

- What Became Real: the App runtime now materializes, persists, captures, and reopens approved governed context records from the packaged domain catalog instead of generating seeded samples during registration and AOI updates.
- What Remains Simulated: curated packaged snapshots remain the governed source for this slice; live external connector expansion is future work.
- Next Blocking Real Seam: `WP-I8-002` must detect governed deviations over the now-restored context series and propagate those outputs downstream.

## Progress Log

- 2026-03-06: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
- 2026-03-06: Packet scope refined to replace seeded context simulation with governed ingestion and correlation runtime behavior.
- 2026-03-08: Started implementation under Workflow Version 4.0; first slice landed governed domain catalog ingestion and removed App-side registration seeding.
- 2026-03-08: Added immediate recorder persistence and async-guarded context reconciliation so correlation changes survive bundle capture and reopen deterministically.
- 2026-03-08: Extended the Tauri runtime smoke harness and WP runner to prove governed context registration, mutation, capture, and reopen in the real desktop runtime.
- 2026-03-08: Closed as `E2E-VERIFIED` with `.product/build_target/tool_artifacts/wp_runs/WP-I7-002/20260308_060255/`.
