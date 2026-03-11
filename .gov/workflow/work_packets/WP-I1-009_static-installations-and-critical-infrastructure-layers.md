# WP-I1-009 - Static Installations and Critical Infrastructure Layers

Date Opened: 2026-03-10
Status: E2E-VERIFIED
Iteration: I1
Workflow Version: 4.0
Packet Class: IMPLEMENTATION
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I1-009.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I1-009.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I1-009.ps1

## Intent

Deliver the first high-ROI source-backed map family using static or periodically refreshed installations that are useful immediately, export-safe, and truthful offline.

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

- PRIM-0045 | Dual Surface Geospatial Runtime | installations and infrastructure sites must render as governed map layers in both 2D and 3D contexts.
- PRIM-0046 | GPU Overlay Composition | the new facilities must compose cleanly with existing query, context, alert, and modeled overlays.
- PRIM-0071 | Map-First Workbench Shell | the layer family must fit the new grouped dock and not bury the map under site metadata.

## Primitive Matrix Impact

- Add/update rows in `.gov/Spec/PRIMITIVES_MATRIX.md` for every primitive listed above.

## Required Pre-Work

- Confirm `WP-I1-008` has established the grouped layer-family control dock.
- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm packet-specific responses to `.gov/Spec/sub-specs/GOV_map_family_intent_guardrails.md` are recorded in the linked sub-spec before status moves beyond `SPEC-MAPPED`.

## Reality Boundary

- Real Seam: Airports, ports, power plants, dams, and curated military airbase/port installations appear as governed toggleable static layers with explicit source, cadence, and coverage labeling.
- User-Visible Win: The map gains immediately useful facilities and infrastructure context before more complex live feeds arrive.
- Proof Target: Packet checks prove static layer toggles, source-state labels, offline-safe availability, and bundle/export behavior without licensing violations.
- Allowed Temporary Fallbacks: Curated static snapshots and regional coverage gaps are acceptable if labeled; no family may imply live operational state.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to `E2E-VERIFIED`.

## In Scope

- Airports, ports, power plants, dams, curated military airbases, and curated military ports.
- Source/provenance labels, offline packaging, and grouped family controls for those static installations.

## Out of Scope

- Live aircraft, vessel, or satellite motion.
- Refineries, water treatment, and other specialized industrial sites.

## Expected Files Touched

- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/ROADMAP.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-I1-009_static-installations-and-critical-infrastructure-layers.md
- .gov/workflow/wp_test_suites/TS-WP-I1-009.md
- .gov/workflow/wp_spec_extractions/SX-WP-I1-009.md
- .gov/workflow/wp_checks/check-WP-I1-009.ps1
- .gov/Spec/sub-specs/I1_static_installations_and_critical_infrastructure_layers.md
- .product/Worktrees/wt_main/src/App.tsx
- .product/Worktrees/wt_main/src/App.test.tsx
- .product/Worktrees/wt_main/src/features/i1/i1.test.ts
- .product/Worktrees/wt_main/src/features/i1/layers.ts
- .product/Worktrees/wt_main/src/features/i1/staticInstallations.ts
- .product/Worktrees/wt_main/src/features/i1/runtime/mapRuntimeScene.ts
- .product/Worktrees/wt_main/src/features/i1/components/MapRuntimeSurface.tsx

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0045 | Static installation layers | GeoJSON/package artifacts + 2D/3D layer mapping | The map gains real facilities and infrastructure context. |
| PRIM-0046 | Overlay composition | MapLibre/Cesium symbol and polygon overlays | Facilities coexist with existing governed signals without visual collapse. |
| PRIM-0071 | Grouped family fit | Layer family dock + detail cards | The static family is useful without reintroducing panel overload. |

## Spec-Test Coverage Plan

### Dependency and Environment Tests
- [x] Dependency graph/lock integrity tests
- [x] Runtime compatibility checks

### UI Contract Tests
- [x] Required regions/modes/states
- [x] Error/degraded-state UX

### Functional Flow Tests
- [x] Golden flow and edge cases
- [x] Persistence/replay/export flows

### Code Correctness Tests
- [x] Unit tests
- [x] Integration tests
- [x] Static analysis (lint/type/schema)

### Red-Team and Abuse Tests
- [x] Non-goal enforcement (spec section 3.2)
- [x] Policy bypass scenarios
- [x] Adversarial/invalid input cases

### Additional Tests
- [x] Performance budgets
- [x] Offline behavior
- [x] Reliability/recovery

## Fallback Register

- Explicit simulated/mock/sample paths: Curated static snapshots are acceptable if source, freshness, and coverage limits are shown.
- Required labels in code/UI/governance: Military facilities must be labeled as curated known installations, not live or comprehensive truth.
- Successor packet or debt owner: `WP-I1-010`, `WP-I1-011`, `WP-GOV-MAPDATA-002`, `WP-I1-012`, `WP-I1-013`.
- Exit condition to remove fallback: The first static family is source-backed, toggleable, export-safe, and usable offline.

## Change Ledger

- What Became Real: The map now ships a real `Static Installations` family with toggleable airports, ports, power plants, dams, and curated military airbase/port layers that carry explicit source, cadence, coverage, and truth-note metadata, render into the governed 2D/3D scene, and survive recorder/bundle restore.
- What Remains Simulated: This packet intentionally stops at curated static snapshots. No live operational state, movement, or comprehensive military truth is implied.
- Next Blocking Real Seam: `WP-I1-010` for governed commercial air traffic and separately truth-labeled flight-awareness overlays.

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-009.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I1-009/
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

- Test Suite Execution: `pnpm exec vitest run src/features/i1/i1.test.ts src/App.test.tsx`; `pnpm exec tsc -b --pretty false`
- Logs: `.product/build_target/tool_artifacts/wp_runs/WP-I1-009/20260311_083107/UI-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-009/20260311_083107/FUNC-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-009/20260311_083107/COR-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-009/20260311_083107/RED-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-009/20260311_083107/EXT-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-009/20260311_083107/EXT-002.log`
- Screenshots/Exports: Not required for this packet; proof is code/test/build plus artifact-backed WP run.
- Build Artifacts: `.product/build_target/tool_artifacts/wp_runs/WP-I1-009/20260311_083107/summary.md`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-009/20260311_083107/result.json`
- Proof Artifact: `.product/build_target/tool_artifacts/wp_runs/WP-I1-009/20260311_083107/`
- User Sign-off: Approved via 2026-03-11 instruction to start `WP-I1-009` and continue the governed remediation flow autonomously.

## Progress Log

- 2026-03-10: WP scaffold created via `.gov/repo_scripts/new_work_packet.ps1`.
- 2026-03-10: Packet rewritten as the first source-backed static layer payload packet in the new map-family queue.
- 2026-03-11: Added packaged static installation definitions for airports, ports, power plants, dams, and curated military facilities under `.product/Worktrees/wt_main/src/features/i1/staticInstallations.ts`.
- 2026-03-11: Wired the `static-installations` family into the grouped dock, source/cadence/coverage/truth-note UI, and map runtime scene so facilities render as `Curated Context` with a truthful `Static-only` family badge.
- 2026-03-11: Passed `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-009.ps1`; proof: `.product/build_target/tool_artifacts/wp_runs/WP-I1-009/20260311_083107/`.
