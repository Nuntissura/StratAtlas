# WP-I1-012 - Maritime Traffic and Port Awareness Layers

Date Opened: 2026-03-10
Status: E2E-VERIFIED
Iteration: I1
Workflow Version: 4.0
Packet Class: IMPLEMENTATION
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I1-012.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I1-012.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I1-012.ps1

## Intent

Implement maritime movement and maritime-awareness layers only after the source path, licensing, and truth-label contract are governed.

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

- PRIM-0045 | Dual Surface Geospatial Runtime | maritime movement belongs on the live 2D/3D map runtime once a truthful source path exists.
- PRIM-0046 | GPU Overlay Composition | vessel tracks and maritime alerts must compose with ports, context, and alerts cleanly.
- PRIM-0071 | Map-First Workbench Shell | maritime layers must fit the grouped family dock and expose source-state badges without overload.

## Primitive Matrix Impact

- Add/update rows in `.gov/Spec/PRIMITIVES_MATRIX.md` for every primitive listed above.

## Required Pre-Work

- `WP-GOV-MAPDATA-002` must be completed first and its constrained first-scope rules must remain in force.
- Confirm `WP-I1-008` has established the grouped layer-family control dock.
- Confirm task board row exists and status is current.
- Confirm packet-specific responses to `.gov/Spec/sub-specs/GOV_map_family_intent_guardrails.md` are recorded in the linked sub-spec before status moves beyond `SPEC-MAPPED`.

## Reality Boundary

- Real Seam: Maritime movement renders as a governed family with truthful live/delayed/cached/licensed labels only within the constrained source contract approved by `WP-GOV-MAPDATA-002`.
- User-Visible Win: The map gains shipping awareness without misleading users about source quality, coverage, or naval visibility.
- Proof Target: Packet checks prove maritime movement toggles, source-state labels, AOI aggregation, and export/offline behavior that respects the constrained first-scope source contract.
- Allowed Temporary Fallbacks: Regional, delayed, cached, or backend-only user-key live maritime paths are acceptable if explicitly labeled.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to `E2E-VERIFIED`.

## In Scope

- Commercial maritime movement and maritime-awareness around ports.
- Truth-labeled live, delayed, cached, or licensed-path states.

## Out of Scope

- Static port installations already covered by `WP-I1-009`.
- Any unsupported live global naval movement claims.

## Expected Files Touched

- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/ROADMAP.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-I1-012_maritime-traffic-and-port-awareness-layers.md
- .gov/workflow/wp_test_suites/TS-WP-I1-012.md
- .gov/workflow/wp_spec_extractions/SX-WP-I1-012.md
- .gov/workflow/wp_checks/check-WP-I1-012.ps1
- .gov/Spec/sub-specs/I1_maritime_traffic_and_port_awareness_layers.md
- .product/Worktrees/wt_main/src/App.tsx
- .product/Worktrees/wt_main/src/features/i1/layers.ts
- .product/Worktrees/wt_main/src/features/i1/runtime/mapRuntimeScene.ts
- .product/Worktrees/wt_main/src/features/i1/components/MapRuntimeSurface.tsx

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0045 | Maritime movement family | vessel feed + 2D/3D runtime integration | The map gains governed shipping motion and maritime-awareness context. |
| PRIM-0046 | Vessel overlay composition | tracks, symbols, AOI aggregation | Maritime movement coexists with installations and other overlays. |
| PRIM-0071 | Family fit and source badges | grouped dock + family help + legends | Users can understand the maritime family's real coverage and limitations. |

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

- Explicit simulated/mock/sample paths: Packaged benchmark or delayed-regional datasets are allowed only when labeled as cached or delayed; no fake global live source may be implied.
- Required labels in code/UI/governance: Maritime source-state labels must distinguish delayed/regional, cached benchmark, community-feed user-key live, curated static, and licensed global live.
- Successor packet or debt owner: licensed-provider expansion remains a future governance owner beyond this packet's first scope.
- Exit condition to remove fallback: A separately governed licensed-provider decision exists for any broader global default live-maritime claim.

## Change Ledger

- What Became Real: The map now ships a governed `Maritime Traffic and Port Awareness` family with cached benchmark vessel movement, separate port-awareness cues, truthful cached/delayed/community/licensed label taxonomy, AOI-focused scene projection, and recorder/bundle restore proof.
- What Remains Simulated: The current build remains intentionally constrained to a packaged cached benchmark; no default global live shipping feed, no backend-only user-key live enhancement, and no licensed global live maritime provider are implemented.
- Next Blocking Real Seam: Continue the map-family queue with `WP-I1-013`, while any broader live maritime expansion remains a separately governed successor beyond this packet.

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-012.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I1-012/
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

- Test Suite Execution: `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-012.ps1` -> passed; `pnpm exec vitest run src/features/i1/i1.test.ts src/App.test.tsx` -> passed; `pnpm lint` -> passed.
- Logs: `.product/build_target/tool_artifacts/wp_runs/WP-I1-012/20260311_162912/summary.md`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-012/20260311_162912/UI-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-012/20260311_162912/FUNC-001.log`.
- Screenshots/Exports: Maritime family recorder and bundle-restore evidence is asserted in `.product/Worktrees/wt_main/src/App.test.tsx`; no manual screenshot bundle was required for the constrained cached-benchmark scope.
- Build Artifacts: `.product/build_target/tool_artifacts/wp_runs/WP-I1-012/20260311_162912/EXT-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-012/20260311_162912/EXT-002.log`.
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I1-012/20260311_162912/
- User Sign-off:

## Progress Log

- 2026-03-10: WP scaffold created via `.gov/repo_scripts/new_work_packet.ps1`.
- 2026-03-10: Packet rewritten as the explicitly blocked maritime implementation successor pending source-path governance.
- 2026-03-11: `WP-GOV-MAPDATA-002` closed the maritime source-truth blocker and moved this packet to `SPEC-MAPPED` with constrained first-scope rules: delayed/regional/cached maritime is allowed first, backend-only user-key live enhancement is optional, and default global live or naval movement claims remain out of scope.
- 2026-03-11: Product seam landed with the constrained maritime family: packaged benchmark vessel movement, separate port-awareness cues, grouped family-dock summary, AOI-focused map projection, and recorder/bundle restore support.
- 2026-03-11: Official packet proof passed under `.product/build_target/tool_artifacts/wp_runs/WP-I1-012/20260311_162912/`, including app and feature tests, lint, build, Rust verification, and guardrail static checks.
