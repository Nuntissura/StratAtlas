# WP-I1-017 - Map HUD, Contextual Hover Help, and Governed Settings

Date Opened: 2026-04-09
Status: IMPLEMENTED
Iteration: I1
Workflow Version: 4.0
Packet Class: IMPLEMENTATION
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I1-017.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I1-017.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I1-017.ps1

## Intent

Turn the already-decluttered workbench into a more map-led analytical surface by replacing persistent sidecar detail with a compact map HUD, point-of-use hover help, a contextual inspector, and a governed settings menu that controls real frontend and backend-connected behavior.

## Linked Requirements

- REQ-0011
- REQ-0012
- REQ-0013
- REQ-0200
- REQ-0201
- REQ-0211
- REQ-0212

## Linked Primitives

- PRIM-0045 | Dual Surface Geospatial Runtime | The 2D/3D runtime must remain the living center of the workbench while HUD controls, hover help, and contextual inspection stay map-linked instead of drifting back into dashboard cards.
- PRIM-0068 | Accessible Map Interaction Contract | Hover help, settings, and contextual inspection must remain keyboard reachable, text-labeled, and non-color-only even as the shell becomes lighter and more animated.
- PRIM-0071 | Map-First Workbench Shell | The shell must become a calmer map HUD with compact chrome, contextual detail, and settings-driven behavior instead of a permanently expanded inspector-and-footer stack.

## Primitive Matrix Impact

- Add or update the `PRIM-0045`, `PRIM-0068`, and `PRIM-0071` rows in `.gov/Spec/PRIMITIVES_MATRIX.md` so the HUD seam, helper behavior, and settings-backed shell contract stay truthful.

## Required Pre-Work

- Confirm `.gov/Spec/sub-specs/I1_map_hud_contextual_hover_help_and_governed_settings.md` is written before product implementation.
- Confirm roadmap, task board, traceability, and primitive rows are synchronized to the new successor scope.
- Confirm `WP-I1-015` remains the baseline declutter packet rather than being retrofitted into this broader HUD/settings seam.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## Reality Boundary

- Real Seam: The live workbench replaces the always-open map-side inspector pattern with a compact in-map HUD, point-of-use hover cards, a contextual detail drawer, and a governed settings surface that controls real shell/runtime behavior such as motion, compact chrome, hover helpers, and live refresh policy.
- User-Visible Win: The map feels like the central analytical surface instead of a framed panel, inspection happens closer to the geography, and users can tune meaningful workspace behavior without digging through unrelated controls.
- Proof Target: Packet checks prove the HUD layout, hover/help disclosure, contextual inspection flow, persisted settings behavior, accessibility semantics, and truthful live bridge screenshots from the running desktop shell if available.
- Allowed Temporary Fallbacks: Non-interactive/fallback runtime paths may degrade hover into click-only contextual detail, and settings persistence may route through the existing recorder/backend persistence path instead of a brand-new preferences service if the behavior is still real and durable.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to `E2E-VERIFIED`.

## In Scope

- Convert the current map toolbar and persistent side inspector into a lighter HUD-style layout that keeps more geography visible.
- Add point-of-use hover/help for map features, legend items, and shell jargon where it reduces first-minute confusion.
- Add a contextual inspector/drawer that opens on map or legend selection instead of staying permanently expanded.
- Add purposeful but bounded motion for focus changes, inspections, and shell reveal/hide behavior, with graceful reduction when required.
- Add a governed settings menu with meaningful items linked to live frontend or backend-connected behavior and persist those settings through the existing governed save/restore path.

## Out of Scope

- New data families, new analytical workflows, or new external providers.
- A freeform docking/window manager or detachable pane system.
- A full redesign of AI, scenario, query, or event workflows outside the shell changes needed to fit the new HUD/settings seam.
- Decorative animation that is not tied to scene change, affordance clarity, or user-controlled settings.

## Expected Files Touched

- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/ROADMAP.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-I1-017_map-hud-contextual-hover-help-and-governed-settings.md
- .gov/workflow/wp_test_suites/TS-WP-I1-017.md
- .gov/workflow/wp_spec_extractions/
- .gov/workflow/wp_spec_extractions/SX-WP-I1-017.md
- .gov/workflow/wp_checks/
- .gov/workflow/wp_checks/check-WP-I1-017.ps1
- .gov/Spec/sub-specs/I1_map_hud_contextual_hover_help_and_governed_settings.md
- .product/Worktrees/wt_main/src/contracts/i0.ts
- .product/Worktrees/wt_main/src/App.tsx
- .product/Worktrees/wt_main/src/App.css
- .product/Worktrees/wt_main/src/App.test.tsx
- .product/Worktrees/wt_main/src/lib/backend.ts
- .product/Worktrees/wt_main/src/features/i1/components/MapRuntimeSurface.tsx
- .product/Worktrees/wt_main/src/features/i1/components/MapRuntimeSurface.css

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0045 | Map HUD and contextual inspector | React state + MapRuntimeSurface + MapLibre/Cesium selection hooks | The real map stays central while action controls and detail move closer to the scene instead of surrounding it with static cards. |
| PRIM-0068 | Hover help, settings, and drawer semantics | Semantic buttons, hover/focus states, aria labels, keyboard-triggerable disclosure | The lighter shell still exposes clear labels, reachability, and non-color-only state. |
| PRIM-0071 | Governed settings surface and compact chrome policy | React shell composition + recorder persistence + backend adapters | Analysts can tune map-first behavior, motion, and live-refresh policy without turning the workbench back into a control-heavy dashboard. |

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
- [ ] Visual bridge/debugger proof if desktop runtime is available

## Fallback Register

- Explicit simulated/mock/sample paths: Hover helpers may fall back to click-open contextual cards when the runtime cannot support pointer hover; no fake live-provider claims may be introduced by the settings surface.
- Required labels in code/UI/governance: Any helper or settings-controlled surface must preserve explicit evidence/context/model/AI labels, degraded-state wording, and honest live/cached/fallback wording where applicable.
- Successor packet or debt owner: `WP-I1-018` for deeper AI/scenario simplification after the HUD/settings seam lands.
- Exit condition to remove fallback: The main shell feels map-led by default, and analysts can control motion/help/live-refresh behavior through real persisted settings without losing truthful map-state inspection.

## Change Ledger

- What Became Real: The map runtime now renders as a compact in-stage HUD with a floating scene capsule, top-right action cluster, collapsible contextual drawer, hover/focus helper cards, and a bottom provenance/legend tray. A header settings menu now persists compact chrome, hover helpers, contextual drawer policy, motion profile, telemetry chip visibility, ambient effects, live-refresh policy, forced-offline mode, and AI gateway deployment profile through the governed recorder path.
- What Remains Simulated: The live desktop proof still exercises the fallback runtime in environments without interactive MapLibre/Cesium support, so hover degrades to focus/button helpers there instead of full pointer-map feature hover.
- Next Blocking Real Seam: User review and successor packet `WP-I1-018` before any `E2E-VERIFIED` promotion.

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: `pnpm exec vitest run src/App.test.tsx --reporter=verbose`; `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-017.ps1`
- Proof Artifact: `.product/build_target/tool_artifacts/wp_runs/WP-I1-017/20260409_192533/`
- Claim Standard: do not claim completion without linked command output and artifact paths.

## Exit Criteria

- Task board and requirements index statuses are synchronized.
- Traceability, primitives index, and primitives matrix are synchronized.
- Linked test suite has executed results and evidence paths.
- Evidence bundle is attached.
- Reality Boundary, Fallback Register, and Change Ledger are truthful.
- User Sign-off: APPROVED.

## Evidence

- Test Suite Execution: `pnpm exec vitest run src/App.test.tsx --reporter=verbose` passed on 2026-04-09 with 35/35 tests.
- Logs: `.product/build_target/tool_artifacts/wp_runs/WP-I1-017/20260409_192533/UI-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-017/20260409_192533/FUNC-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-017/20260409_192533/COR-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-017/20260409_192533/RED-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-017/20260409_192533/DEP-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-017/20260409_192533/result.json`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-017/20260409_192533/summary.md`
- Screenshots/Exports: `.product/build_target/tool_artifacts/wp_runs/WP-I1-017/20260409_192533/visual_proof/map_hud_runtime_1775755811002.png`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-017/20260409_192533/visual_proof/map_hud_navigated_1775755827602.png`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-017/20260409_192533/visual_proof/bridge_health.json`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-017/20260409_192533/visual_proof/bridge_state.json`
- Build Artifacts: `.product/build_target/tool_artifacts/wp_runs/WP-I1-017/20260409_192533/`
- Proof Artifact: `.product/build_target/tool_artifacts/wp_runs/WP-I1-017/20260409_192533/`
- User Sign-off: Pending

## Progress Log

- 2026-04-09: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
- 2026-04-09: Placeholder packet replaced with the active HUD/settings seam: compact map HUD, contextual hover/help, purposeful motion, and governed settings linked to real runtime behavior.
- 2026-04-09: Product seam implemented in `App.tsx`, `App.css`, `contracts/i0.ts`, `MapRuntimeSurface.tsx`, `MapRuntimeSurface.css`, and `App.test.tsx`; governed test run plus bridge snapshot proof captured under `.product/build_target/tool_artifacts/wp_runs/WP-I1-017/20260409_192533/`.
