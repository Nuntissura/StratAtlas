# WP-I1-013 - Specialized Industrial and Water Infrastructure Layers

Date Opened: 2026-03-10
Status: SPEC-MAPPED
Iteration: I1
Workflow Version: 4.0
Packet Class: IMPLEMENTATION
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I1-013.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I1-013.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I1-013.ps1

## Intent

Add the specialized industrial and water-infrastructure family after source coverage, QA, and uncertainty labeling are governed.

## Linked Requirements

- REQ-0013
- REQ-0108
- REQ-0200
- REQ-0201
- REQ-0202
- REQ-0203
- REQ-0211
- REQ-0212

## Linked Primitives

- PRIM-0045 | Dual Surface Geospatial Runtime | specialized sites must be visible as governed map context, not buried in side panels.
- PRIM-0046 | GPU Overlay Composition | industrial and water-infrastructure layers must coexist with other facilities and live mobility families.
- PRIM-0071 | Map-First Workbench Shell | the specialized family must fit the grouped dock without presenting uncertain coverage as complete truth.

## Primitive Matrix Impact

- Add/update rows in `.gov/Spec/PRIMITIVES_MATRIX.md` for every primitive listed above.

## Required Pre-Work

- Confirm `WP-I1-008` has established the grouped layer-family control dock.
- Confirm source QA and coverage criteria in the sub-spec are acceptable.
- Confirm task board row exists and status is current.
- Confirm packet-specific responses to `.gov/Spec/sub-specs/GOV_map_family_intent_guardrails.md` are recorded in the linked sub-spec before status moves beyond `SPEC-MAPPED`.

## Reality Boundary

- Real Seam: Refineries, water treatment, ore processing, and similar specialized industrial sites render as governed static layers with explicit coverage and quality labels.
- User-Visible Win: The map gains higher-value industrial/resource context without pretending the source coverage is cleaner than it is.
- Proof Target: Packet checks prove composite-source labels, family toggles, offline-safe packaging where allowed, and explicit incomplete-coverage communication.
- Allowed Temporary Fallbacks: Composite curated layers with regional gaps are acceptable if the uncertainty and coverage limits are directly shown.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to `E2E-VERIFIED`.

## In Scope

- Oil refineries
- Ore processing and smelting facilities
- Water treatment and filtration plants
- Similar specialized industrial resource-processing sites approved by governance

## Out of Scope

- Power plants and dams already handled by `WP-I1-009`.
- Any claim of live operational state for these facilities.

## Expected Files Touched

- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/ROADMAP.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-I1-013_specialized-industrial-and-water-infrastructure-layers.md
- .gov/workflow/wp_test_suites/TS-WP-I1-013.md
- .gov/workflow/wp_spec_extractions/SX-WP-I1-013.md
- .gov/workflow/wp_checks/check-WP-I1-013.ps1
- .gov/Spec/sub-specs/I1_specialized_industrial_and_water_infrastructure_layers.md
- .product/Worktrees/wt_main/src/App.tsx
- .product/Worktrees/wt_main/src/features/i1/layers.ts
- .product/Worktrees/wt_main/src/features/i1/runtime/mapRuntimeScene.ts
- .product/Worktrees/wt_main/src/features/i1/components/MapRuntimeSurface.tsx

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0045 | Specialized infrastructure family | composite static datasets + map overlays | The map gains industrial/resource-processing context directly on scene. |
| PRIM-0046 | Composite overlay composition | points/polygons + labels + AOI summaries | Specialized sites coexist with facilities, context, and mobility families. |
| PRIM-0071 | Coverage and quality communication | dock badges + help copy + detail cards | Users can see where coverage is partial or curated. |

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

- Explicit simulated/mock/sample paths: Composite curated static datasets are acceptable only if quality, age, and coverage limits are explicit.
- Required labels in code/UI/governance: Incomplete regional coverage and source uncertainty must be shown directly in family help and detail views.
- Successor packet or debt owner: None; this is the specialized static-family owner after `WP-I1-009`.
- Exit condition to remove fallback: Specialized industrial and water-infrastructure layers are source-backed enough to be useful while still labeling their gaps truthfully.

## Change Ledger

- What Became Real: The queue now has a dedicated owner for the messy composite-source industrial/water layer family instead of mixing it into cleaner facility packets.
- What Remains Simulated: The product does not yet render these specialized site layers.
- Next Blocking Real Seam: Complete the family dock, then define the composite-source QA and coverage contract strongly enough to implement the family.

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-013.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I1-013/
- Mandatory Guardrail Proof: show the family's strategic question fit, evidence/context label contract, mode behavior, bundle/export/reopen contract, and anti-tracker boundary per `.gov/Spec/sub-specs/GOV_map_family_intent_guardrails.md`.
- Claim Standard: do not claim completion without linked command output and artifact paths.

## Exit Criteria

- Task board and requirements index statuses are synchronized.
- Traceability, primitives index, and primitives matrix are synchronized.
- Linked test suite has executed results and evidence paths.
- Evidence bundle is attached.
- Reality Boundary, Fallback Register, and Change Ledger are truthful.
- Packet-specific guardrail responses are completed in the linked sub-spec and evidenced in the packet proof.
- User Sign-off: APPROVED.

## Evidence

- Test Suite Execution:
- Logs:
- Screenshots/Exports:
- Build Artifacts:
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I1-013/
- User Sign-off:

## Progress Log

- 2026-03-10: WP scaffold created via `.gov/repo_scripts/new_work_packet.ps1`.
- 2026-03-10: Packet rewritten as the specialized industrial/water family owner with explicit composite-source and coverage-gap constraints.
