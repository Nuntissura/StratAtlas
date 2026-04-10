# WP-GOV-BRIDGE-003 - Bridge Disclosure Toggle and Audit Sweep

Date Opened: 2026-04-10
Status: IMPLEMENTED
Iteration: All
Workflow Version: 4.0
Packet Class: IMPLEMENTATION
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-GOV-BRIDGE-003.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-GOV-BRIDGE-003.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-GOV-BRIDGE-003.ps1

## Intent

Close the bridge's remaining blind spots so agents can reach every app surface and run a single audit sweep that captures them all:
1. **Disclosure toggles** — add bridge navigation targets (or a dedicated endpoint) for the three advanced-disclosure sections (`assistantAdvancedVisible`, `scenarioAdvancedVisible`, `workspaceAdvancedVisible`) and for cycling panel-info explainers.
2. **Per-panel snapshot targeting** — wire the per-panel capture mode from `WP-GOV-DEBUGGER-002` into the bridge so callers can request a snapshot of a specific panel by name/selector.
3. **Audit sweep command** — add a single `POST /agent/audit-sweep` endpoint that programmatically walks every navigable surface, expands every disclosure, captures a labeled snapshot of each, and returns the full set of paths.

Predecessor: `WP-GOV-BRIDGE-002` shipped the action bridge but left three advanced-disclosure surfaces and panel-info explainers unreachable. No batch capture mechanism exists.

## Linked Requirements

- REQ-0013
- REQ-0019
- REQ-0020

## Linked Primitives

- PRIM-0075 | Governed Agent Action Bridge | This WP extends the bridge's navigable surface and adds the audit sweep action that agents use for complete visual evidence capture

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## Reality Boundary

- Real Seam: Every app surface — including advanced disclosure sections, panel-info explainers, and all tab/view combinations — is reachable from the bridge and capturable as a labeled snapshot.
- User-Visible Win: A single `POST /agent/audit-sweep` call produces a complete labeled snapshot set of every panel, every disclosure state, every tab view, and both 2D/3D map modes. No surface is invisible to agents.
- Proof Target: Audit sweep output containing snapshots of all navigable panels plus all three advanced-disclosure sections expanded, with file paths returned in the response payload.
- Allowed Temporary Fallbacks: Panel-info explainer cycling may produce one snapshot per explainer rather than a combined view; acceptable as long as all explainers are individually captured.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## In Scope

- Add bridge navigation targets for disclosure toggles: `assistant-advanced`, `scenario-advanced`, `workspace-advanced` (each toggles the corresponding `*AdvancedVisible` state).
- Add bridge navigation target for panel-info explainers: `panel-info-{name}` to open a specific explainer overlay.
- Wire `WP-GOV-DEBUGGER-002` per-panel snapshot mode into `POST /agent/snapshot` with `panelSelector` field.
- Add `POST /agent/audit-sweep` action that:
  1. Queries current state via `/agent/state`.
  2. Iterates all navigable targets (left views, main views, right views, bottom views, settings, 2D, 3D).
  3. For each target: navigates, expands relevant disclosures, captures a labeled full-DOM snapshot and per-panel snapshots of each visible panel region.
  4. Returns a structured response with all snapshot file paths, labeled by surface name.
- Update `GET /agent/state` to include disclosure visibility states (`assistantAdvancedVisible`, `scenarioAdvancedVisible`, `workspaceAdvancedVisible`, `settingsMenuOpen`).
- Update `AGENTS.md` bridge endpoint reference with the new targets and audit-sweep documentation.

## Out of Scope

- Changing the snapshot capture engine itself (that is `WP-GOV-DEBUGGER-002`).
- Adding new approved named actions beyond audit-sweep (future WPs).
- Automated diff/regression comparison between sweep captures (future scope).

## Expected Files Touched

- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-GOV-BRIDGE-003_bridge-disclosure-toggle-and-audit-sweep.md
- .gov/workflow/wp_test_suites/TS-WP-GOV-BRIDGE-003.md
- .gov/workflow/wp_spec_extractions/SX-WP-GOV-BRIDGE-003.md
- .gov/workflow/wp_checks/check-WP-GOV-BRIDGE-003.ps1
- .product/Worktrees/wt_main/src/App.tsx (handleAgentNavigate disclosure targets, audit-sweep orchestration, state response additions)
- .product/Worktrees/wt_main/src-tauri/src/lib.rs (bridge endpoint routing for audit-sweep, state response fields)
- AGENTS.md (update endpoint reference and audit-sweep documentation)

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0075 | Bridge disclosure navigation + audit sweep | Tauri localhost HTTP bridge, React state toggles, WP-GOV-DEBUGGER-002 per-panel capture | Agents can reach and snapshot every app surface including advanced disclosures via a single audit-sweep call |

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

- Explicit simulated/mock/sample paths: None anticipated — all disclosure toggles and navigation targets map directly to existing React state.
- Required labels in code/UI/governance: N/A
- Successor packet or debt owner: Future automated visual regression diffing could build on the sweep output.
- Exit condition to remove fallback: N/A

## Change Ledger

- What Became Real: Disclosure toggles (assistant-advanced, scenario-advanced, workspace-advanced, expand-all, collapse-all), disclosure state in GET /agent/state response (assistantAdvancedVisible, scenarioAdvancedVisible, workspaceAdvancedVisible, settingsMenuOpen), audit-sweep action that walks all panels and captures full-DOM + per-panel snapshots
- What Remains Simulated: Panel-info explainer cycling is not yet wired as a distinct navigation target (individual explainers are not individually capturable via the sweep)
- Next Blocking Real Seam: Depends on `WP-GOV-DEBUGGER-002` for per-panel capture mode; bridge-003 wires it into the sweep

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-BRIDGE-003.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-003/
- Claim Standard: do not claim completion without linked command output and artifact paths.

## Exit Criteria

- Task board and requirements index statuses are synchronized.
- Traceability, primitives index, and primitives matrix are synchronized.
- Linked test suite has executed results and evidence paths.
- Evidence bundle is attached.
- Reality Boundary, Fallback Register, and Change Ledger are truthful.
- User Sign-off: APPROVED.

## Evidence

- Test Suite Execution: 90/90 tests pass, 12/12 test files
- Logs: TypeScript clean (tsc --noEmit), Rust cargo check clean
- Screenshots/Exports: pending live desktop audit-sweep proof
- Build Artifacts: pending
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-003/20260410_044152/
- User Sign-off: pending

## Progress Log

- 2026-04-10: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
- 2026-04-10: Implementation landed — disclosure toggle navigation targets added (assistant-advanced, scenario-advanced, workspace-advanced, expand-all, collapse-all), state report extended with 4 disclosure fields, audit-sweep action captures all panels with full-DOM + per-panel snapshots. Rust structs updated. AGENTS.md updated with full endpoint/target/action reference. TypeScript clean, Rust compiles.
