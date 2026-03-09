# WP-GOV-I1-RESTYLE-001 - Map-First Workbench Restyle Research and Rubric

Date Opened: 2026-03-09
Status: E2E-VERIFIED
Iteration: I1
Workflow Version: 4.0
Packet Class: RESEARCH
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-GOV-I1-RESTYLE-001.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-GOV-I1-RESTYLE-001.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-GOV-I1-RESTYLE-001.ps1

## Intent

Capture a source-backed redesign rubric for the now-real StratAtlas runtime so the shell can move from dashboard overload to a calmer map-first workbench. Document the current UX problems, the task-grouping model, the anti-pattern bans from `Uncodixfy`, and the implementation recommendation for the successor packet before product code changes start.

## Linked Requirements

- REQ-0013
- REQ-0019
- REQ-0020
- REQ-0021
- REQ-0022

## Linked Primitives

- PRIM-0063 | Map UX Research Ledger | Extend the earlier map-runtime research with shell, pane, and desktop-workbench references.
- PRIM-0064 | Feature-to-Map Integration Matrix | Reaffirm that every feature remains map-linked as the shell gets regrouped.
- PRIM-0070 | Workbench UX Rubric Ledger | Record the scoring rubric and IA decisions that govern the new shell.

## Primitive Matrix Impact

- Add/update rows in `.gov/Spec/PRIMITIVES_MATRIX.md` for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## Reality Boundary

- Real Seam: A governed, cited, product-specific shell rubric and workbench information architecture now exist instead of informal taste-driven redesign notes.
- User-Visible Win: The successor UI work can follow an explicit map-first layout contract instead of another all-at-once dashboard pass.
- Proof Target: `.gov/Spec/sub-specs/I1_workbench_restyle_research.md`, synchronized roadmap/taskboard/primitive ledgers, and a ready successor packet with no placeholder fields.
- Allowed Temporary Fallbacks: The current product shell remains in place until `WP-I1-005` lands.
- Promotion Guard: RESEARCH packets do not promote implementation requirements; only the governance research assets and ledgers may close here.

## In Scope

- Audit the current shell against the user complaint and the `Uncodixfy` anti-pattern list.
- Synthesize external desktop, navigation, progressive-disclosure, and map-workbench references into a StratAtlas-specific rubric.
- Define the task-grouping model, right-panel role, bottom-tray role, and feature-to-map placement rules for the restyle.
- Capture ROI-ranked follow-on ideas so design improvements are not lost after session reset.

## Out of Scope

- Product code changes in `.product/Worktrees/wt_main`.
- Arbitrary docking systems, detachable panes, or new dependency adoption.
- Requirement status promotion for I1 implementation behavior.

## Expected Files Touched

- `.gov/Spec/sub-specs/I1_workbench_restyle_research.md`
- `.gov/Spec/sub-specs/I1_layers_time_replay.md`
- `.gov/Spec/REQUIREMENTS_INDEX.md`
- `.gov/Spec/TRACEABILITY_MATRIX.md`
- `.gov/Spec/PRIMITIVES_INDEX.md`
- `.gov/Spec/PRIMITIVES_MATRIX.md`
- `.gov/workflow/ROADMAP.md`
- `.gov/workflow/taskboard/TASK_BOARD.md`
- `.gov/workflow/work_packets/WP-GOV-I1-RESTYLE-001_map-first-workbench-restyle-research-and-rubric.md`
- `.gov/workflow/work_packets/WP-I1-005_map-first-workbench-shell-restyle-and-workflow-partitioning.md`
- `.gov/workflow/wp_test_suites/TS-WP-GOV-I1-RESTYLE-001.md`
- `.gov/workflow/wp_test_suites/TS-WP-I1-005.md`
- `.gov/workflow/wp_spec_extractions/SX-WP-GOV-I1-RESTYLE-001.md`
- `.gov/workflow/wp_checks/check-WP-GOV-I1-RESTYLE-001.ps1`

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0063 | Research ledger | Markdown governance docs + cited external sources | Captures why the redesign direction is justified instead of aesthetic guesswork. |
| PRIM-0064 | Feature-to-map placement table | Governance mapping matrix | Prevents the restyle from separating features from spatial context. |
| PRIM-0070 | Workbench rubric | Markdown rubric + ROI backlog | Gives the successor packet a concrete evaluation model for shell changes. |

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

## Fallback Register

- Explicit simulated/mock/sample paths: No new simulated product paths are introduced here; the existing shell remains the pre-restyle baseline.
- Required labels in code/UI/governance: Research output must explicitly mark future-only ideas as backlog or deferred.
- Successor packet or debt owner: `WP-I1-005`.
- Exit condition to remove fallback: `WP-I1-005` lands the map-first workbench shell in product code.

## Change Ledger

- What Became Real: A cited shell rubric, explicit task-grouping plan, and map-first IA contract.
- What Remains Simulated: The current overloaded shell remains in product until the successor implementation packet executes.
- Next Blocking Real Seam: `WP-I1-005` must turn the rubric into a real workbench shell.

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-I1-RESTYLE-001.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-GOV-I1-RESTYLE-001/
- Claim Standard: do not claim completion without linked command output and artifact paths.

## Exit Criteria

- Task board and requirements index statuses are synchronized.
- Traceability, primitives index, and primitives matrix are synchronized.
- Linked test suite has executed results and evidence paths.
- Evidence bundle is attached.
- Reality Boundary, Fallback Register, and Change Ledger are truthful.
- User Sign-off: APPROVED.

## Evidence

- Test Suite Execution: `.gov/workflow/wp_test_suites/TS-WP-GOV-I1-RESTYLE-001.md`
- Logs: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-I1-RESTYLE-001/20260309_054016/summary.md`
- Screenshots/Exports: N/A for research-only packet
- Build Artifacts: `.gov/Spec/sub-specs/I1_workbench_restyle_research.md`
- Proof Artifact: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-I1-RESTYLE-001/20260309_054016/`
- User Sign-off: Approved via 2026-03-09 instruction to research UI/UX, create a rubric, and drive the redesign from the captured guidance.

## Progress Log

- 2026-03-09: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
- 2026-03-09: Research scope expanded to include `Uncodixfy`, progressive disclosure, desktop navigation, GIS pane layouts, and ROI-ranked follow-on ideas for a map-first shell redesign.
- 2026-03-09: `check-WP-GOV-I1-RESTYLE-001.ps1`, `governance_preflight.ps1`, and `enforce_wp_template_compliance.ps1` passed; proof captured under `.product/build_target/tool_artifacts/wp_runs/WP-GOV-I1-RESTYLE-001/20260309_054016/`.
