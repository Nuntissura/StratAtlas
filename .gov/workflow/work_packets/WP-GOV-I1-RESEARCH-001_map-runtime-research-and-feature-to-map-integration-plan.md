# WP-GOV-I1-RESEARCH-001 - Map Runtime Research and Feature To Map Integration Plan

Date Opened: 2026-03-07
Status: E2E-VERIFIED
Iteration: I1
Workflow Version: 3.0
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-GOV-I1-RESEARCH-001.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-GOV-I1-RESEARCH-001.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-GOV-I1-RESEARCH-001.ps1

## Intent

Capture source-backed design direction for the I1 map runtime before product implementation begins. This packet documents what a strong 2D and 3D StratAtlas map should look like, records which open-source product patterns are worth borrowing, and locks the feature-to-map integration contract that `WP-I1-003` must implement.

## Linked Requirements

- REQ-0013
- REQ-0019
- REQ-0020
- REQ-0021
- REQ-0022

## Linked Primitives

- PRIM-0031 | Recovery Queue Traceability | Keep the research packet, the I1 implementation packet, and the I1 governance references synchronized across taskboard, roadmap, and traceability.
- PRIM-0063 | Map UX Research Ledger | Capture cited 2D and 3D design references, implementation notes, and product-fit conclusions before the map runtime is built.
- PRIM-0064 | Feature-to-Map Integration Matrix | Require every major existing StratAtlas feature to be mapped to a concrete map behavior or surface outcome before implementation starts.

## Primitive Matrix Impact

- Add/update rows in `.gov/Spec/PRIMITIVES_MATRIX.md` for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## In Scope

- Audit the current I1 code surface against the spec and record the real implementation gap.
- Research high-quality 2D and 3D map interaction patterns, implementation approaches, and open-source feature ideas from official documentation and GitHub.
- Produce a governed research document and update the I1 sub-spec, roadmap, taskboard, and packet assets so `WP-I1-003` can start from a map-first contract.
- Define how compare, replay, collaboration, scenario, query, AI, context, alerts, and strategic modeling connect to the map.

## Out of Scope

- Product-side implementation of the map runtime itself; that belongs to `WP-I1-003`.
- Replacing synthetic or simulator-backed data sources from later remediation packets.
- Closing performance, export, or runtime evidence requirements for `WP-I1-003`.

## Expected Files Touched

- .gov/Spec/stratatlas_spec_v1_2.md
- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/Spec/TECH_STACK.md
- .gov/Spec/sub-specs/I1_layers_time_replay.md
- .gov/Spec/sub-specs/I1_map_runtime_research.md
- .gov/workflow/ROADMAP.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-GOV-I1-RESEARCH-001_map-runtime-research-and-feature-to-map-integration-plan.md
- .gov/workflow/wp_test_suites/TS-WP-GOV-I1-RESEARCH-001.md
- .gov/workflow/wp_spec_extractions/SX-WP-GOV-I1-RESEARCH-001.md
- .gov/workflow/wp_checks/check-WP-GOV-I1-RESEARCH-001.ps1

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0031 | research packet synchronization | roadmap, taskboard, traceability, packet assets | Keeps the new research packet and the existing I1 implementation queue aligned while scope is refined. |
| PRIM-0063 | source-backed runtime research | Markdown governance docs with cited official docs and GitHub references | Prevents design drift and preserves high-value ideas and implementation paths before coding begins. |
| PRIM-0064 | feature-to-map mapping | I1 research doc and sub-spec integration matrix | Forces every major existing app capability to become spatially legible instead of remaining a side-panel-only workflow. |

## Spec-Test Coverage Plan

### Dependency and Environment Tests
- [x] Governance preflight passes before documentation changes are promoted.
- [x] Template and linked-asset structure remain compliant after the new packet is introduced.

### UI Contract Tests
- [x] Research document contains explicit 2D map design rules for StratAtlas.
- [x] Research document contains explicit 3D globe design rules for StratAtlas.
- [x] I1 sub-spec is updated to require a real map runtime in the main canvas.

### Functional Flow Tests
- [x] Feature-to-map integration matrix covers the major existing slices from I0 through I10.
- [x] `WP-I1-003` packet and suite are updated with map-first execution scope.

### Code Correctness Tests
- [x] Taskboard, roadmap, primitives, and traceability references are synchronized.
- [x] Spec extraction is refreshed after governance updates.

### Red-Team and Abuse Tests
- [x] Research and sub-spec preserve non-goal boundaries and licensing/provenance constraints.
- [x] No proprietary-service dependency is introduced in the documented stack direction.

### Additional Tests
- [x] Research records budget-aware rendering and degradation posture for later runtime verification.
- [x] Research records offline-safe map/runtime expectations that `WP-I1-003` must honor.

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-I1-RESEARCH-001.ps1`
- Proof Artifact: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-I1-RESEARCH-001/`
- Claim Standard: do not claim completion without linked command output and artifact paths.

## Exit Criteria

- Task board and requirements index statuses are synchronized.
- Traceability, primitives index, and primitives matrix are synchronized.
- Linked test suite has executed results and evidence paths.
- Evidence bundle is attached.
- User Sign-off: APPROVED.

## Evidence

- Test Suite Execution: `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-I1-RESEARCH-001.ps1`
- Logs: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-I1-RESEARCH-001/20260307_031932/`
- Screenshots/Exports: n/a for governance-only research packet.
- Build Artifacts: n/a for governance-only research packet.
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-GOV-I1-RESEARCH-001/
- User Sign-off: approved by the 2026-03-07 instruction to execute the research and begin `WP-I1-003`.

## Progress Log

- 2026-03-07: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
- 2026-03-07: Captured external map-runtime research targets and audited the current I1 implementation gap.
- 2026-03-07: Added the governed I1 map research reference and rewrote the I1 sub-spec around a map-first execution contract.
- 2026-03-07: Packet verified with governance preflight, template compliance, red-team static check, refreshed spec extraction, and document-content assertions; proof: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-I1-RESEARCH-001/20260307_031932/`.
