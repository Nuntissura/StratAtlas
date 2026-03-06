# WP-I2-003 - Comparative Analytics and Briefing Export Runtime

Date Opened: 2026-03-06
Status: SPEC-MAPPED
Iteration: I2
Workflow Version: 3.0
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I2-003.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I2-003.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I2-003.ps1

## Intent

Replace the current compare-dashboard simulation with governed comparative analytics and export behavior tied to real runtime layers and stored evidence. This packet restores the normative baseline-to-delta and briefing-export slice on top of the remediated canvas and storage stack.

## Linked Requirements

- REQ-0209
- REQ-0210
- REQ-0300
- REQ-0301
- REQ-0302

## Linked Primitives

- PRIM-0048 | Comparative Analytics Engine | Compute real baseline and delta outputs over authoritative runtime data and layers.
- PRIM-0049 | Briefing Export Renderer | Produce governed briefing artifacts and exports from the actual compare state rather than simulated cards.

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## In Scope

- Deliver real baseline and delta computation against governed runtime state and stored artifacts.
- Bind compare outputs, context overlays, and export surfaces to the layer runtime introduced by WP-I1-003.
- Restore briefing and export flows with reproducible bundle linkage and performance-aware behavior.

## Out of Scope

- Query execution, AI gateway, ingestion, and solver remediations that belong to later packets.
- Closing map-runtime or storage-backbone work that must land in WP-I0-003 and WP-I1-003 first.
- Treating synthetic compare cards as acceptable proof once this packet is in flight.

## Expected Files Touched

- .gov/Spec/stratatlas_spec_v1_2.md
- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-I2-003_comparative-analytics-and-briefing-export-runtime.md
- .gov/workflow/wp_test_suites/TS-WP-I2-003.md
- .gov/workflow/wp_spec_extractions/SX-WP-I2-003.md
- .gov/workflow/wp_checks/check-WP-I2-003.ps1
- .product/Worktrees/wt_main/src/App.tsx
- .product/Worktrees/wt_main/src/features/i2/
- .product/Worktrees/wt_main/src/lib/backend.ts
- .product/Worktrees/wt_main/src-tauri/src/lib.rs

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0048 | comparative analytics runtime | TypeScript analytics over governed layer and context state | Restores normative baseline and delta behavior on real data rather than simulation inputs. |
| PRIM-0049 | briefing export runtime | export rendering plus bundle-linked persistence | Makes compare results portable and reproducible in the form the spec requires. |

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

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I2-003.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I2-003/
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
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I2-003/
- User Sign-off:

## Progress Log

- 2026-03-06: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
- 2026-03-06: Packet scope refined to target real compare-state analytics and governed briefing export delivery.
