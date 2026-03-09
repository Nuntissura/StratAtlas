# TS-WP-GOV-I1-RESTYLE-001 - Spec vs Code Test Suite

Date Opened: 2026-03-09
Status: E2E-VERIFIED
Linked Work Packet: WP-GOV-I1-RESTYLE-001
Iteration: I1

## Scope

Validate that the redesign research packet produces a cited, placeholder-free rubric and IA plan that can safely govern the shell restyle successor packet.

## Inputs

- Linked requirements: REQ-0013, REQ-0019, REQ-0020, REQ-0021, REQ-0022
- Linked primitives: PRIM-0063, PRIM-0064, PRIM-0070
- Linked components: `.gov/Spec/sub-specs/I1_workbench_restyle_research.md`, `.gov/Spec/sub-specs/I1_layers_time_replay.md`, `.gov/workflow/ROADMAP.md`, `.gov/workflow/taskboard/TASK_BOARD.md`, `.gov/workflow/work_packets/WP-GOV-I1-RESTYLE-001_map-first-workbench-restyle-research-and-rubric.md`, `.gov/workflow/work_packets/WP-I1-005_map-first-workbench-shell-restyle-and-workflow-partitioning.md`

## Reality Boundary Assertions

- Packet Class: RESEARCH
- Real Seam: A governed redesign rubric and IA plan become authoritative inputs to the successor implementation packet.
- Proof Target: Research doc plus synchronized packet/taskboard/roadmap/primitive ledgers with no unresolved placeholders.
- Allowed Fallbacks: Existing product shell remains active until `WP-I1-005`.
- Promotion Guard: No implementation requirement promotion is allowed in this research packet.

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0019 | PRIM-0063 | Dependency | governance workflow integrity | `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1` | governance references and loop assets remain synchronized |
| UI-001 | REQ-0013 | PRIM-0064 | UI Contract | rubric and IA content | manual doc review + `check-WP-GOV-I1-RESTYLE-001.ps1` | map-first grouping, stable regions, and feature-to-map placement are explicitly documented |
| FUNC-001 | REQ-0020 | PRIM-0070 | Functionality | successor packet readiness | manual doc review | `WP-I1-005` contains a concrete restyle boundary, not placeholders |
| COR-001 | REQ-0021 | PRIM-0070 | Code Correctness | template compliance | `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/enforce_wp_template_compliance.ps1` | no v4 placeholder markers remain in the packet assets |
| RED-001 | REQ-0022 | PRIM-0064 | Red Team / Abuse | scope honesty | manual doc review | research packet does not claim product completion or requirement promotion |
| EXT-001 | REQ-0013 | PRIM-0070 | Additional | ROI backlog capture | manual doc review | follow-on ideas are recorded without being misrepresented as implemented scope |

## Dependency and Environment Tests

- [x] Governance workflow and linked-packet assets exist
- [x] Packet references resolve to actual files
- [x] Required governance scripts are available

## UI Contract Tests

- [x] Stable-region expectations are preserved in the redesign plan
- [x] Required mode mapping is explicit in the research doc
- [x] Map-first feature-to-map placement rules are explicit

## Functional Flow Tests

- [x] Research-to-successor handoff is explicit
- [x] Workbench grouping and tray roles are explicit
- [x] Follow-on backlog is recorded

## Code Correctness Tests

- [ ] Unit tests not applicable for research-only packet
- [ ] Integration tests not applicable for research-only packet
- [x] Static governance checks run

## Red-Team and Abuse Tests

- [x] Research does not expand into banned spec section 3.2 behaviors
- [x] Packet does not overclaim implementation closure
- [x] Deferred ideas are labeled as backlog

## Additional Tests

- [x] Accessibility/usability research captured
- [x] Reliability of recovery improved via rubric/governance capture
- [ ] Runtime performance checks deferred to `WP-I1-005`
- [ ] Offline behavior checks deferred to `WP-I1-005`

## Automation Hook

- Command: `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-I1-RESTYLE-001.ps1`
- Artifacts: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-I1-RESTYLE-001/`

## Execution Summary

- Last Run Date: 2026-03-09
- Result: PASS
- Blocking Failures: none
- Evidence Paths: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-I1-RESTYLE-001/20260309_054016/`
- What Became Real: The redesign rubric, map-first IA, and task-grouping plan are now governed assets.
- What Remains Simulated: The current product shell remains unchanged until `WP-I1-005`.
- Next Blocking Real Seam: `WP-I1-005` product implementation.
- Reviewer: Codex
- User Sign-off: Approved via 2026-03-09 instruction to research UI/UX, create a rubric, and use it for the redesign.
