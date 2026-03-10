# WP-GOV-MAPDATA-001 - Toggleable Live Source Layer Research and Data Contract

Date Opened: 2026-03-10
Status: E2E-VERIFIED
Iteration: All
Workflow Version: 4.0
Packet Class: RESEARCH
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-GOV-MAPDATA-001.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-GOV-MAPDATA-001.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-GOV-MAPDATA-001.ps1

## Intent

Research the governed source, licensing, fallback, and layer-toggle contract for the next user-requested map-visible families: air traffic, shipping, satellites, infrastructure/resources, airports, ports, and known military installations.

## Linked Requirements

- REQ-0013
- REQ-0019
- REQ-0020
- REQ-0021
- REQ-0022
- REQ-0200
- REQ-0201

## Linked Primitives

- PRIM-0045 | Dual Surface Geospatial Runtime | the requested feature set is explicitly map-visible and must resolve into real 2D/3D layer families rather than disconnected widgets
- PRIM-0071 | Map-First Workbench Shell | the new sources must land as toggleable map layers that fit the calmer workbench shell instead of reintroducing dashboard sprawl

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## Reality Boundary

- Real Seam: The repo gains a governed research contract for the requested toggleable map layer families, with named candidate sources, source-type boundaries, and a truthful implementation order before product code implies unsupported live coverage.
- User-Visible Win: Future map layers can be implemented without repeating the earlier scaffold-first mistake; the source choices and tradeoffs are captured and retrievable.
- Proof Target: A linked research sub-spec records candidate sources, licensing/provenance concerns, online/offline behavior, and recommended successor packets for each requested layer family.
- Allowed Temporary Fallbacks: Research may conclude that some requested families require curated static layers or licensed providers before a truthful live implementation is possible.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## In Scope

- Research and document candidate governed sources for air, shipping, satellites, infrastructure/resources, airports, ports, and known military installations.
- Define the toggleable map-layer family contract, truthful source-state labels, and recommended implementation order.

## Out of Scope

- Shipping production code for the new live/static map layers.
- Claiming that military/commercial classification or global live coverage is solved before a governed source path exists.

## Expected Files Touched

- .gov/Spec/stratatlas_spec_v1_2.md
- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/ROADMAP.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-GOV-MAPDATA-001_toggleable-live-source-layer-research-and-data-contract.md
- .gov/workflow/wp_test_suites/TS-WP-GOV-MAPDATA-001.md
- .gov/workflow/wp_spec_extractions/SX-WP-GOV-MAPDATA-001.md
- .gov/workflow/wp_checks/check-WP-GOV-MAPDATA-001.ps1
- .gov/Spec/sub-specs/GOV_toggleable_live_source_layer_research.md

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0045 | Toggleable map layer families | MapLibre/Cesium layer registry + governed source contracts | Requested datasets are defined as actual map-visible layers with explicit source truth and fallback rules. |
| PRIM-0071 | Layer grouping and shell fit | Workbench IA + layer family taxonomy | Future feeds land as calm toggleable families instead of reintroducing all-at-once shell overload. |

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

- Explicit simulated/mock/sample paths: None in product code for this packet; this is governance research only.
- Required labels in code/UI/governance: Research findings must distinguish live, delayed, cached, curated static, heuristic, and licensed-provider paths.
- Successor packet or debt owner: Immediate product successor is `WP-I1-007` for panel explainers plus real 2D basemap; future feed packets must be split by layer family.
- Exit condition to remove fallback: The source matrix, layer-family contract, and build-order recommendations are captured in the linked sub-spec and synchronized into roadmap/taskboard/traceability.

## Change Ledger

- What Became Real: The user-requested map layer families now have a governed research owner instead of living only as ad hoc conversation requests.
- What Remains Simulated: No new live/source-backed map layers are implemented by this packet.
- Next Blocking Real Seam: Create and execute the first source-backed successor packet for static known-installation layers: airports, ports, power plants, dams, and curated military airbases/ports.

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-MAPDATA-001.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-GOV-MAPDATA-001/
- Claim Standard: do not claim completion without linked command output and artifact paths.

## Exit Criteria

- Task board and requirements index statuses are synchronized.
- Traceability, primitives index, and primitives matrix are synchronized.
- Linked test suite has executed results and evidence paths.
- Evidence bundle is attached.
- Reality Boundary, Fallback Register, and Change Ledger are truthful.
- User Sign-off: APPROVED.

## Evidence

- Test Suite Execution: `.gov/workflow/wp_checks/check-WP-GOV-MAPDATA-001.ps1`
- Logs: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-MAPDATA-001/20260310_012211/`
- Screenshots/Exports: N/A; research/governance packet
- Build Artifacts: Governance validation only; no product build claims made by this packet
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-GOV-MAPDATA-001/20260310_012211/
- User Sign-off: Pending

## Progress Log

- 2026-03-10: WP scaffold created via `.gov/repo_scripts/new_work_packet.ps1`.
- 2026-03-10: Packet rewritten around toggleable map layer family research for air traffic, shipping, satellites, infrastructure/resources, airports, ports, and known military installations; linked sub-spec is `.gov/Spec/sub-specs/GOV_toggleable_live_source_layer_research.md`.
- 2026-03-10: Governance preflight, strict-mode guardrails, and `.gov/workflow/wp_checks/check-WP-GOV-MAPDATA-001.ps1` all passed; proof artifact: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-MAPDATA-001/20260310_012211/`.
