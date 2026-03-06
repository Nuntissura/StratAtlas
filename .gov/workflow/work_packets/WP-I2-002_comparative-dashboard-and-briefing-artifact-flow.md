# WP-I2-002 - Comparative Dashboard and Briefing Artifact Flow

Date Opened: 2026-03-06
Status: IN-PROGRESS
Iteration: I2
Workflow Version: 3.0
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I2-002.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I2-002.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I2-002.ps1

## Intent

Turn the current compare-mode helper demo into a governed I2 workflow with explicit baseline/event windows,
deterministic delta summaries, context overlay corroboration, and a labeled briefing artifact tied to a selected bundle.
This packet carries the normative I2 exit signal after the activation-shell proof captured under `WP-I2-001`.

## Linked Requirements

- REQ-0300
- REQ-0301
- REQ-0302

## Linked Primitives

- PRIM-0038 | Comparative Delta Window Contract | persist and render deterministic baseline/event window state with severity-tagged delta cells
- PRIM-0039 | Context Overlay Comparison Surface | align curated context overlays with delta results in the compare dashboard
- PRIM-0040 | Briefing Artifact Export Contract | produce a labeled briefing artifact that references the selected bundle and delta findings

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## In Scope

- Compare-mode baseline and event window configuration with deterministic delta summaries.
- Comparative dashboard cards that show context overlay corroboration for the active comparison window.
- Briefing artifact preview/export payload and golden-flow integration with selected bundle references and audit events.
- Offline-safe compare behavior using cached bundle/context state and explicit unavailable states where needed.

## Out of Scope

- Final PDF/slide document renderer.
- New database/storage engines beyond the current recorder and bundle infrastructure.
- Collaboration, scenario, or AI expansion beyond the I2 compare and briefing flow.

## Expected Files Touched

- .gov/Spec/stratatlas_spec_v1_2.md
- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-I2-002_comparative-dashboard-and-briefing-artifact-flow.md
- .gov/workflow/wp_test_suites/TS-WP-I2-002.md
- .gov/workflow/wp_spec_extractions/SX-WP-I2-002.md
- .gov/workflow/wp_checks/check-WP-I2-002.ps1
- .product/Worktrees/wt_main/src/App.tsx
- .product/Worktrees/wt_main/src/App.test.tsx
- .product/Worktrees/wt_main/src/App.css
- .product/Worktrees/wt_main/src/features/i2/baselineDelta.ts
- .product/Worktrees/wt_main/src/features/i2/i2.test.ts

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0038 | Baseline/event comparison state | TypeScript analytics helpers + React compare controls | Analysts can reproduce the same delta grid and severity summary from the same window inputs. |
| PRIM-0039 | Context overlay compare dashboard | React + existing context registry contracts | Compare mode can corroborate delta signals with curated context without collapsing them into observed evidence. |
| PRIM-0040 | Briefing artifact flow | TypeScript artifact builder + recorder/bundle references | The I2 golden flow ends in a concrete briefing payload tied back to the selected bundle and analysis window. |

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

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I2-002.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I2-002/
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
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I2-002/
- User Sign-off:

## Progress Log

- 2026-03-06: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
