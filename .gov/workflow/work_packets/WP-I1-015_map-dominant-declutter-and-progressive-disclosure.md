# WP-I1-015 - Map-Dominant Declutter and Progressive Disclosure

Date Opened: 2026-04-09
Status: SUPERSEDED
Iteration: I1
Workflow Version: 4.0
Packet Class: IMPLEMENTATION
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I1-015.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I1-015.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I1-015.ps1

## Intent

Use the current manual-smoke findings to reduce the remaining "LLM demo" feel in the full workbench by making map-family value easier to discover, demoting support-only shell clutter, and hiding secondary scene detail behind explicit disclosure instead of showing the full overlay stack by default.

## Linked Requirements

- REQ-0011
- REQ-0012
- REQ-0200
- REQ-0212

## Linked Primitives

- PRIM-0045 | Dual Surface Geospatial Runtime | The declutter pass must expose more actual geography and keep the real 2D/3D scene as the primary object instead of letting summary cards dominate the main canvas.
- PRIM-0068 | Accessible Map Interaction Contract | Any new disclosure controls for scene detail, support families, or workspace hierarchy must stay keyboard reachable and must not rely on color alone.
- PRIM-0071 | Map-First Workbench Shell | The full workbench must become more map-dominant by moving map-family value higher and making secondary shell detail on-demand.

## Primitive Matrix Impact

- Add or update the `PRIM-0045`, `PRIM-0068`, and `PRIM-0071` rows in `.gov/Spec/PRIMITIVES_MATRIX.md` so the declutter seam, disclosure behavior, and shell-fit contract stay truthful.

## Required Pre-Work

- Confirm `WP-I1-005`, `WP-I1-006`, and `WP-I1-014` remain the baseline shell, guided-start, and basemap packets.
- Confirm the declutter scope in `.gov/Spec/sub-specs/I1_map_dominant_declutter_and_progressive_disclosure.md` is written before product implementation.
- Confirm task board, roadmap, traceability, and primitive rows are synchronized.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## Reality Boundary

- Real Seam: The full workbench defaults to a lighter-weight map summary, surfaces the layer-family dock above the jargon-heavy session controls, and hides support-only scene detail behind explicit disclosure controls instead of showing every telemetry and support card by default.
- User-Visible Win: Analysts reach the real map families and the live geography faster, while the shell still allows deeper detail on demand.
- Proof Target: Packet checks prove family ordering and disclosure, compact summary defaults, accessible reveal controls, and the preserved stable-region contract; live bridge proof should capture the calmer full-workbench shell if the desktop runtime is available.
- Allowed Temporary Fallbacks: Role, marking, mode, and note controls remain in the left rail, but they may move lower in the hierarchy and need not stay always visually dominant. This packet does not promise floating overlays, detachable panes, or a new layout system.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to `E2E-VERIFIED`.

## In Scope

- Move the layer-family dock ahead of the session-control form stack in the left workspace view.
- Add explicit disclosure so support-only workspace layers do not dominate the first full-workbench view.
- Add a compact main-canvas summary mode that hides legend, telemetry, per-layer detail cards, and support widgets behind explicit reveal controls.
- Make the small shell and CSS adjustments needed to keep the 2D/3D runtime visually primary in the current fixed workbench.

## Out of Scope

- Full-window glass-overlay redesign, detachable windows, or a new docking system.
- New data feeds, new map families, or changes to governed labeling semantics beyond the declutter needed for this shell pass.
- Broad copy rewrite of all internal terms; this packet focuses on hierarchy and disclosure first.

## Expected Files Touched

- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/ROADMAP.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-I1-015_map-dominant-declutter-and-progressive-disclosure.md
- .gov/workflow/wp_test_suites/TS-WP-I1-015.md
- .gov/workflow/wp_spec_extractions/
- .gov/workflow/wp_spec_extractions/SX-WP-I1-015.md
- .gov/workflow/wp_checks/
- .gov/workflow/wp_checks/check-WP-I1-015.ps1
- .gov/Spec/sub-specs/I1_map_dominant_declutter_and_progressive_disclosure.md
- .product/Worktrees/wt_main/src/App.tsx
- .product/Worktrees/wt_main/src/App.css
- .product/Worktrees/wt_main/src/App.test.tsx

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0045 | Compact scene-summary disclosure | React state + MapRuntimeSurface + summary cards | The real map stays visible while optional detail becomes on-demand instead of ambient clutter. |
| PRIM-0068 | Disclosure and support-family controls | Semantic buttons + pressed and expanded states + accessible copy | Users can reveal hidden detail without losing keyboard reachability or non-color semantics. |
| PRIM-0071 | Left-rail hierarchy and map-family-first ordering | React shell state + CSS layout | The value-bearing map-family dock becomes easier to find than the lower-value session form stack. |

## Spec-Test Coverage Plan

### Dependency and Environment Tests
- [x] Dependency graph/lock integrity tests
- [ ] Runtime compatibility checks

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
- [ ] Performance budgets
- [ ] Offline behavior
- [x] Reliability/recovery
- [x] Visual bridge/debugger proof if desktop runtime is available

## Fallback Register

- Explicit simulated/mock/sample paths: None intended for the declutter seam itself; this packet only changes shell hierarchy and disclosure over already-verified runtime paths.
- Required labels in code/UI/governance: Hidden detail must stay discoverable via explicit controls, and support families must not disappear permanently or imply the underlying support layers were removed from the build.
- Successor packet or debt owner: `WP-I1-017` for broader state honesty and `WP-GOV-SMOKE-001` for deeper manual UX judgment after the declutter pass lands.
- Exit condition to remove fallback: The left rail and summary deck stop making support controls and telemetry feel more important than the actual map families and geography.

## Change Ledger

- What Became Real: The live workbench now puts the layer-family dock above session controls, hides the support-only `verified-workspace` family behind explicit disclosure, and defaults the non-guided summary deck to a calmer map-first state where legend, telemetry, layer metadata, support widgets, and modeled-output detail open only on demand.
- What Remains Simulated: No new map data, new workflows, or floating-overlay shell system are promised by this packet.
- Next Blocking Real Seam: User review plus successor packet `WP-I1-017` before any `E2E-VERIFIED` promotion.

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-015.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I1-015/
- Claim Standard: do not claim completion without linked command output and artifact paths.

## Exit Criteria

- Task board and requirements index statuses are synchronized.
- Traceability, primitives index, and primitives matrix are synchronized.
- Linked test suite has executed results and evidence paths.
- Evidence bundle is attached.
- Reality Boundary, Fallback Register, and Change Ledger are truthful.
- User Sign-off: APPROVED.

## Evidence

- Test Suite Execution: `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-015.ps1` -> passed; `pnpm exec vitest run src/App.test.tsx --reporter=verbose` -> passed (33 tests, including layer-order, support-family disclosure, and compact-summary reveal/hide coverage).
- Logs: `.product/build_target/tool_artifacts/wp_runs/WP-I1-015/20260409_165612/summary.md`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-015/20260409_165612/UI-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-015/20260409_165612/FUNC-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-015/20260409_165612/COR-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-015/20260409_165612/RED-001.log`.
- Screenshots/Exports: `.product/build_target/tool_artifacts/wp_runs/WP-I1-015/20260409_165612/visual_proof/full_workbench_declutter_live.png`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-015/20260409_165612/visual_proof/agent_state_planar.json`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-015/20260409_165612/visual_proof/agent_health.json`.
- Build Artifacts: `.product/build_target/tool_artifacts/wp_runs/WP-I1-015/20260409_165612/EXT-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-015/20260409_165612/EXT-002.log`.
- Proof Artifact: `.product/build_target/tool_artifacts/wp_runs/WP-I1-015/20260409_165612/`
- User Sign-off: Pending

## Progress Log

- 2026-04-09: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
- 2026-04-09: Placeholder packet replaced with a bounded declutter seam based on the current `WP-GOV-SMOKE-001` findings: map families first, support-family disclosure, and compact main-canvas summary detail.
- 2026-04-09: Product seam landed in the live shell: the left rail now prioritizes the layer-family dock, support-only families stay hidden until explicitly requested, and the summary deck defaults to a calmer map-first disclosure state.
- 2026-04-09: Added regression coverage for dock ordering, support-family reveal, and compact-summary detail disclosure without breaking existing map-family persistence flows.
- 2026-04-09: Official packet proof passed under `.product/build_target/tool_artifacts/wp_runs/WP-I1-015/20260409_165612/`, including governed packet checks, App regression tests, lint, build, Rust verification, and live bridge-driven snapshot capture in `visual_proof/`.
- 2026-04-10: SUPERSEDED by WP-I1-024 (Task Family Architecture). Progressive disclosure scope is now absorbed into the task family structure. Retained proof: `.product/build_target/tool_artifacts/wp_runs/WP-I1-015/20260409_165612/`.
