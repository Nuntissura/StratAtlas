# WP-I1-002 - Workspace Surface Layer Catalog and Policy Labeling

Date Opened: 2026-03-06
Status: IN-PROGRESS
Iteration: I1
Workflow Version: 3.0
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I1-002.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I1-002.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I1-002.ps1

## Intent

Replace the current placeholder workbench surface with a governed I1 shell that exposes real layer metadata, visible artifact labels, and measurable state-change feedback.
This packet makes the I1 UI contract tangible enough to support later analytics, context, and export work without pretending text placeholders satisfy the slice.

## Linked Requirements

- REQ-0011
- REQ-0012
- REQ-0014..REQ-0016
- REQ-0200..REQ-0212
- REQ-0804
- REQ-0805

## Linked Primitives

- PRIM-0035 | Workspace Region Surface | componentized shell regions backed by live persisted data instead of static placeholders
- PRIM-0036 | Artifact Label Contract | visible Evidence/Context/Model/AI labels and uncertainty treatment in the UI surface
- PRIM-0037 | Layer Catalog and Budget Telemetry | layer metadata presentation plus state-change/performance feedback and degradation signaling

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## In Scope

- Add real layer catalog and context presentation surfaces to the I1 shell.
- Surface evidence/context/model/AI labels and uncertainty text in the workspace.
- Add explicit non-blocking feedback for state changes and budget/degradation indicators.
- Refactor the top-level app shell into smaller workspace-oriented components/modules where needed.

## Out of Scope

- Full 3D globe integration.
- Final export rendering pipeline.
- Collaboration and scenario deep workflows beyond shell integration points.

## Expected Files Touched

- .gov/Spec/stratatlas_spec_v1_2.md
- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-I1-002_workspace-surface-layer-catalog-and-policy-labeling.md
- .gov/workflow/wp_test_suites/TS-WP-I1-002.md
- .gov/workflow/wp_spec_extractions/SX-WP-I1-002.md
- .gov/workflow/wp_checks/check-WP-I1-002.ps1
- .product/Worktrees/wt_main/src/App.tsx
- .product/Worktrees/wt_main/src/App.test.tsx
- .product/Worktrees/wt_main/src/App.css
- .product/Worktrees/wt_main/src/features/i1/layers.ts
- .product/Worktrees/wt_main/src/features/i1/i1.test.ts
- .product/Worktrees/wt_main/src/features/i1/performance.ts

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0035 | Region-driven shell composition | React + TypeScript | Stable regions become real work surfaces instead of static placeholders. |
| PRIM-0036 | Label and uncertainty badges | React UI + shared policy metadata | The UI visibly preserves the Section 11.4 distinction between evidence, context, modeled, and AI artifacts. |
| PRIM-0037 | Layer registry and responsiveness indicators | TypeScript contracts + React state feedback | Users can see layer provenance/cadence/sensitivity while the shell reports degraded or in-progress state changes. |

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

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-002.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I1-002/
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
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I1-002/
- User Sign-off:

## Progress Log

- 2026-03-06: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
- 2026-03-06: Packet activated behind `WP-I0-002` as the next I1 recovery step.
