# WP-GOV-MAPDATA-002 - Maritime Source Path and Coverage Gap Resolution

Date Opened: 2026-03-10
Status: SPEC-MAPPED
Iteration: All
Workflow Version: 4.0
Packet Class: RESEARCH
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-GOV-MAPDATA-002.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-GOV-MAPDATA-002.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-GOV-MAPDATA-002.ps1

## Intent

Resolve the maritime source, licensing, latency, and coverage truth gap before the app claims a shipping or maritime-awareness movement layer.

## Linked Requirements

- REQ-0013
- REQ-0019
- REQ-0020
- REQ-0021
- REQ-0022
- REQ-0200
- REQ-0201

## Linked Primitives

- PRIM-0045 | Dual Surface Geospatial Runtime | maritime movement belongs on the map, but only after its source path is governed truthfully.
- PRIM-0071 | Map-First Workbench Shell | the shell needs a maritime family contract before it can expose the correct family states and badges.

## Primitive Matrix Impact

- Add/update rows in `.gov/Spec/PRIMITIVES_MATRIX.md` for every primitive listed above.

## Required Pre-Work

- Confirm `GOV_toggleable_live_source_layer_research.md` remains the parent research baseline.
- Confirm task board row exists and status is current.
- Confirm the maritime implementation packet remains blocked until this packet resolves the source path.

## Reality Boundary

- Real Seam: Governance records a concrete maritime source decision matrix, truth-label contract, and blocker resolution path before any shipping runtime implementation begins.
- User-Visible Win: The repo can answer what maritime coverage is actually possible and what remains blocked instead of leaving that uncertainty implicit.
- Proof Target: The linked research sub-spec, taskboard, roadmap, and traceability assets capture the decision path, unresolved gaps, and successor packet rules.
- Allowed Temporary Fallbacks: Research may conclude that only delayed, regional, cached, or licensed-provider paths are acceptable initially.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to `E2E-VERIFIED`.

## In Scope

- Maritime source decision matrix, coverage/latency labels, licensing path, and military-awareness boundary.
- Blocker resolution criteria for `WP-I1-012`.

## Out of Scope

- Shipping production maritime movement code.
- Pretending that live global military/naval movement truth already exists.

## Expected Files Touched

- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/ROADMAP.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-GOV-MAPDATA-002_maritime-source-path-and-coverage-gap-resolution.md
- .gov/workflow/wp_test_suites/TS-WP-GOV-MAPDATA-002.md
- .gov/workflow/wp_spec_extractions/SX-WP-GOV-MAPDATA-002.md
- .gov/workflow/wp_checks/check-WP-GOV-MAPDATA-002.ps1
- .gov/Spec/sub-specs/GOV_maritime_source_path_and_gap_resolution.md

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0045 | Maritime source matrix | governance research + source decision ledger | The future maritime family is grounded in a truthful source path before code starts. |
| PRIM-0071 | Family-state contract | layer-family taxonomy + shell state rules | The maritime family can be shown as blocked, delayed, licensed, or static with clarity. |

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

- Explicit simulated/mock/sample paths: None in product code; this is governance research and blocker resolution only.
- Required labels in code/UI/governance: Maritime source states must distinguish live, delayed, cached, static, and licensed-path-pending.
- Successor packet or debt owner: `WP-I1-012`.
- Exit condition to remove fallback: The repo holds a source decision and truth-label contract strong enough to unblock maritime implementation.

## Change Ledger

- What Became Real: The queue now has an explicit governance owner for the maritime source gap instead of pretending shipping can be implemented on the same footing as air traffic.
- What Remains Simulated: No maritime movement layer is implemented by this packet.
- Next Blocking Real Seam: Resolve source and coverage truth so `WP-I1-012` can move from blocked into implementation.

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-MAPDATA-002.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-GOV-MAPDATA-002/
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
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-GOV-MAPDATA-002/
- User Sign-off:

## Progress Log

- 2026-03-10: WP scaffold created via `.gov/repo_scripts/new_work_packet.ps1`.
- 2026-03-10: Packet rewritten as the explicit governance blocker owner for maritime source-path selection and gap closure.
