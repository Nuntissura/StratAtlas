# WP-I1-024 - Task Family Architecture

Date Opened: 2026-04-11
Status: SPEC-MAPPED
Iteration: I1
Workflow Version: 4.0
Packet Class: IMPLEMENTATION
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I1-024.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I1-024.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I1-024.ps1

## Intent

Implement the five task families from spec Section 11.12 (Monitor, Analyze, Context, Plan, AI) as the primary left-panel navigation. One family active at a time, state preserved across switches. Supporting detail in the right panel. Outputs in the bottom tray. Map always visible.

Supersedes: WP-I1-015 (declutter -- progressive disclosure now part of task family structure) and WP-I1-018 (AI/scenario UX -- simplified by family architecture).

## Linked Requirements

- REQ-0200
- REQ-0201
- REQ-0212

## Linked Primitives

- PRIM-0005 | Stable UI Region Contract | Task families organize the left panel into a structured navigation that maintains region stability across workflow switches

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## Reality Boundary

- Real Seam: Left panel has five family tabs. Switching families changes the left panel content without destroying state. Right panel shows contextual detail for the active family.
- User-Visible Win: Clear navigation -- analyst knows where they are and can switch workflows without losing progress.
- Proof Target: Five family tabs render in left panel. State persists across family switches. Right panel routes contextual detail per active family. All existing features accessible through family routing.
- Allowed Temporary Fallbacks: Some feature content may initially render as pass-through wrappers before full card conversion; documented in Change Ledger.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## In Scope

- Five family tabs in left panel (Monitor, Analyze, Context, Plan, AI).
- Route existing feature content into family views: query -> Analyze, AI -> AI, context -> Context, scenario -> Plan, layers/replay -> Monitor.
- Right panel contextual detail routing per active family.
- Bottom tray shared across families for outputs.
- State preservation across family switches (no state destruction on tab change).
- Absorb WP-I1-015 progressive disclosure into the family structure.
- Absorb WP-I1-018 AI/scenario UX simplification into the family architecture.

## Out of Scope

- New analytical features or new data capabilities.
- Changing the map runtime or adding new map families.
- Full visual redesign of individual family content (card system handles that).

## Expected Files Touched

- .gov/Spec/stratatlas_spec_v1_2.md
- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-I1-024_task-family-architecture.md
- .gov/workflow/wp_test_suites/TS-WP-I1-024.md
- .gov/workflow/wp_spec_extractions/SX-WP-I1-024.md
- .gov/workflow/wp_checks/check-WP-I1-024.ps1
- .product/Worktrees/wt_main/src/<implementation_files>

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0005 | Task family state machine + panel routing | React state machine + Family tab navigation | Organized analyst workflows with clear navigation and preserved state across family switches |

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

- Explicit simulated/mock/sample paths: None -- all family routing connects to existing real feature implementations.
- Required labels in code/UI/governance: Active family must be visually indicated. Family tabs must have accessible labels.
- Successor packet or debt owner: WP-I1-025 (settings panel) and WP-I1-026 (AI surface) depend on family architecture being in place.
- Exit condition to remove fallback: All five families render, state persists across switches, and all existing features are accessible through family routing.

## Change Ledger

- What Became Real: TBD
- What Remains Simulated: TBD
- Next Blocking Real Seam: TBD

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-024.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I1-024/
- Claim Standard: do not claim completion without linked command output and artifact paths.

## Exit Criteria

- Task board and requirements index statuses are synchronized.
- Traceability, primitives index, and primitives matrix are synchronized.
- Linked test suite has executed results and evidence paths.
- Evidence bundle is attached.
- Reality Boundary, Fallback Register, and Change Ledger are truthful.
- User Sign-off: APPROVED.

## Evidence

- Test Suite Execution:
- Logs:
- Screenshots/Exports:
- Build Artifacts:
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I1-024/
- User Sign-off:

## Progress Log

- 2026-04-11: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
