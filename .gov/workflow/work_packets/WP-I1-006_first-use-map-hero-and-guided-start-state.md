# WP-I1-006 - First-Use Map Hero and Guided Start State

Date Opened: 2026-03-09
Status: IN-PROGRESS
Iteration: I1
Workflow Version: 4.0
Packet Class: IMPLEMENTATION
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I1-006.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I1-006.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I1-006.ps1

## Intent

Use the findings from `WP-GOV-SMOKE-001` to reduce first-use overload in the verified workbench shell by making the map feel like the obvious center of value, introducing a guided "start here" path, and pushing secondary detail behind progressive disclosure instead of showing the whole workstation at once.

## Linked Requirements

- REQ-0011
- REQ-0012
- REQ-0013
- REQ-0200
- REQ-0201
- REQ-0211
- REQ-0212

## Linked Primitives

- PRIM-0045 | Dual Surface Geospatial Runtime | the map must stay dominant while the surrounding shell becomes calmer and more directed
- PRIM-0068 | Accessible Map Interaction Contract | the guided start, panel disclosure, and quick actions must remain keyboard reachable and not depend on color-only cues
- PRIM-0071 | Map-First Workbench Shell | this packet refines the verified shell into a first-use state that makes the map, next action, and expected outcome clearer

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## Reality Boundary

- Real Seam: The real workbench opens in a calmer guided-start state that reduces default pane pressure, keeps the live 2D/3D map visually primary, and exposes the first useful actions through map-linked quick starts instead of expecting users to parse the full shell immediately.
- User-Visible Win: A new user can tell what to do first, why the map matters, and how to reveal deeper tools without being hit by the full density of the current workspace.
- Proof Target: Automated shell tests plus governed runtime evidence show the start-state shell, panel disclosure behavior, and map-first quick actions working under the real workbench contract.
- Allowed Temporary Fallbacks: Existing advanced workflows may remain behind the current tabs and forms as long as the first-use state labels them as advanced and the guided path routes into them truthfully.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## In Scope

- Introduce a real first-use guided start state tied to the live map runtime, with explicit next actions that route into context registration, query, bundle capture, and workflow detail.
- Reduce default first-view pane pressure by collapsing or compacting at least one always-open support region and replacing the dense workspace form dump with progressive disclosure.
- Preserve the verified map/runtime shell, accessibility semantics, and existing advanced workflows while reordering the first-use experience around map value instead of internal system structure.

## Out of Scope

- New docking, detachable multi-window layout systems, or other heavy shell infrastructure changes.
- Deep rewrites of I2-I10 workflow logic beyond the shell/state changes needed to route first-use actions into existing verified flows.

## Expected Files Touched

- .gov/Spec/stratatlas_spec_v1_2.md
- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-I1-006_first-use-map-hero-and-guided-start-state.md
- .gov/workflow/wp_test_suites/TS-WP-I1-006.md
- .gov/workflow/wp_spec_extractions/SX-WP-I1-006.md
- .gov/workflow/wp_checks/check-WP-I1-006.ps1
- .product/Worktrees/wt_main/src/App.tsx
- .product/Worktrees/wt_main/src/App.css
- .product/Worktrees/wt_main/src/App.test.tsx

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0071 | Guided start shell state | React state + CSS grid/layout | The first screen becomes calmer and task-led instead of presenting the full workstation immediately. |
| PRIM-0045 | Map-first quick actions | Existing MapLibre/Cesium runtime + workbench routing | The map stays central while quick-start actions visibly connect workflows back to the map. |
| PRIM-0068 | Accessible disclosure controls | Semantic buttons, tabs, and status labels | Collapsed/expanded shell regions remain understandable without relying on visual density or color alone. |

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

- Explicit simulated/mock/sample paths: None intended for the shell itself; the packet reuses already-verified I2-I10 workflows and must not relabel them as new capabilities.
- Required labels in code/UI/governance: Guided-start actions must truthfully describe the existing workflow they open and must mark deeper controls as advanced where relevant.
- Successor packet or debt owner: `WP-GOV-SMOKE-001` remains the manual validation owner for post-change first-use follow-through until the next hands-on pass is captured.
- Exit condition to remove fallback: The default shell no longer relies on users discovering the correct first action by parsing dense multi-pane content on first load.

## Change Ledger

- What Became Real: The live workbench now has a real guided-start shell, compact first-use workspace view, collapsed-by-default inspector and tray, map-first quick actions, and explicit "reveal full workbench" disclosure instead of always opening every support surface at once.
- What Remains Simulated: No new analytical capability was added; this packet still depends on the previously verified I2-I10 workflows and has not yet been revalidated by a second manual smoke pass.
- Next Blocking Real Seam: Re-run manual desktop smoke against the new first-use shell and decide whether the remaining overload is solved or whether a narrower follow-on packet is still required.

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-006.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I1-006/
- Claim Standard: do not claim completion without linked command output and artifact paths.

## Exit Criteria

- Task board and requirements index statuses are synchronized.
- Traceability, primitives index, and primitives matrix are synchronized.
- Linked test suite has executed results and evidence paths.
- Evidence bundle is attached.
- Reality Boundary, Fallback Register, and Change Ledger are truthful.
- User Sign-off: APPROVED.

## Evidence

- Test Suite Execution: `pnpm exec vitest run src/App.test.tsx`; `pnpm lint`; `pnpm build`; `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/update_wp_spec_extract.ps1 -WpId WP-I1-006`; `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/enforce_wp_template_compliance.ps1`; `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1`
- Logs: local command evidence from the commands above; no packet-grade `wp_runs/WP-I1-006/` artifact bundle has been captured yet because the packet remains open
- Screenshots/Exports: successor manual-smoke evidence still lives under `.product/build_target/tool_artifacts/manual_smoke/WP-GOV-SMOKE-001/20260309_202006/` and remains the baseline for the next hands-on validation pass
- Build Artifacts: `.product/Worktrees/wt_main/dist/`
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I1-006/
- User Sign-off:

## Progress Log

- 2026-03-09: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
- 2026-03-09: Packet contract rewritten from placeholder scaffold into a smoke-driven first-use shell packet with a linked sub-spec at `.gov/Spec/sub-specs/I1_first_use_map_hero_guided_start.md`.
- 2026-03-09: First implementation slice landed in `.product/Worktrees/wt_main/src/App.tsx`, `.product/Worktrees/wt_main/src/App.css`, and `.product/Worktrees/wt_main/src/App.test.tsx` with a guided-start state, compact workspace entry, collapsed inspector/tray defaults, and explicit map-linked quick actions.
- 2026-03-09: Initial verification slice passed via `pnpm exec vitest run src/App.test.tsx`, `pnpm lint`, `pnpm build`, `update_wp_spec_extract.ps1 -WpId WP-I1-006`, `enforce_wp_template_compliance.ps1`, and `governance_preflight.ps1`; packet remains open pending renewed manual smoke and full packet proof capture.
