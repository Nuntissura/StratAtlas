# WP-I7-003 - Global Event Timeline and Map Event Markers

Date Opened: 2026-04-09
Status: IN-PROGRESS
Iteration: I7
Workflow Version: 4.0
Packet Class: IMPLEMENTATION
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I7-003.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I7-003.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I7-003.ps1

## Intent

Materialize the already-governed deviation and OSINT artifacts into a global event timeline plus zoom-aware map event markers, while keeping non-spatial context off the map and surfacing source/cadence/confidence at point-of-use.

## Linked Requirements

- REQ-0804
- REQ-0805
- REQ-0808
- REQ-0809

## Linked Primitives

- PRIM-0045 | Real 2D 3D Canvas and Governed Layer Runtime | The event timeline only matters if selecting or hovering an event can drive the real map runtime, not a detached summary card.
- PRIM-0076 | Context Event Timeline Projection | This packet closes the derived-timeline and zoom-aware marker seam that turns already-real event artifacts into a coherent analyst chronology.

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## Reality Boundary

- Real Seam: the live shell derives a global event timeline and map-marker layer from already-real deviation and OSINT artifacts, adds zoom-aware event clustering to the map runtime, and lets timeline selection focus the map plus contextual inspect state.
- User-Visible Win: analysts can see what happened first, what matters now, and which AOI is affected without manually stitching together separate monitor cards and map cues.
- Proof Target: timeline derivation tests pass, App/runtime regressions pass, `check-WP-I7-003.ps1` passes, and live bridge snapshots show the event timeline plus event-linked map focus.
- Allowed Temporary Fallbacks: browser/jsdom remains a non-desktop proof environment; the timeline may remain derived rather than persisted as its own artifact as long as reopen stays deterministic from the underlying restored events.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## In Scope

- Derive a global event timeline from the current deviation event, aggregate alert, and OSINT event set.
- Add a tray-level timeline surface and a compact in-map recent-event rail.
- Add zoom-aware event marker clustering and event-to-AOI linking in the real 2D map runtime.
- Surface source, cadence, confidence, and aggregate-only semantics in helper cards, inspect details, and timeline rows.
- Keep bundle reopen truthful by deriving the same timeline from already-restored event state.

## Out of Scope

- Shipping the pre-loaded geopolitical baseline dataset and "what's happening now" dashboard, which belong to `WP-I7-004`.
- New ingestion connectors, new event-producing pipelines, or new recorder schema unless a correctness gap forces it.
- Rendering non-spatial `sidebar_timeseries` or `dashboard_widget` context as map points.

## Expected Files Touched

- .gov/Spec/stratatlas_spec_v1_2.md
- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/Spec/sub-specs/I7_global_event_timeline_and_map_markers.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-I7-003_global-event-timeline-and-map-event-markers.md
- .gov/workflow/wp_test_suites/TS-WP-I7-003.md
- .gov/workflow/wp_spec_extractions/SX-WP-I7-003.md
- .gov/workflow/wp_checks/check-WP-I7-003.ps1
- .product/Worktrees/wt_main/src/App.tsx
- .product/Worktrees/wt_main/src/App.css
- .product/Worktrees/wt_main/src/App.test.tsx
- .product/Worktrees/wt_main/src/features/i1/components/MapRuntimeSurface.tsx
- .product/Worktrees/wt_main/src/features/i1/components/MapRuntimeSurface.css
- .product/Worktrees/wt_main/src/features/i1/runtime/mapRuntimeScene.ts
- .product/Worktrees/wt_main/src/features/i1/i1.test.ts
- .product/Worktrees/wt_main/src/features/i7/i7.test.ts
- .product/Worktrees/wt_main/src/features/i7/eventTimeline.ts

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0045 | governed map runtime | React shell, MapLibre runtime, contextual inspect/drawer flow | Timeline entries can drive real AOI focus, helper cards, and marker selection on the live map surface. |
| PRIM-0076 | event timeline + clustered markers | TypeScript derived event model, App tray/event rail, MapLibre clustered GeoJSON source, bridge snapshot proof | Existing deviation and OSINT artifacts become a coherent chronological surface with truthful map projection and AOI linking. |

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

- Explicit simulated/mock/sample paths: browser/jsdom remains simulated relative to the live desktop runtime; no new seeded/sample runtime path should be added outside tests.
- Required labels in code/UI/governance: aggregate alerts must stay labeled aggregate-only; deviation entries must stay labeled as correlated context/watch signals; non-spatial context must stay off the map.
- Successor packet or debt owner: `WP-I7-004` owns the next “global events” seam for baseline geopolitical context and a broader first-launch dashboard story.
- Exit condition to remove fallback: the packet ships live timeline and marker behavior in the desktop app and the bridge captures that flow without seeded-state hacks.

## Change Ledger

- What Became Real: pending implementation.
- What Remains Simulated: browser/jsdom remains a non-desktop proof environment; no packet-specific runtime fallback is approved beyond that.
- Next Blocking Real Seam: `WP-I7-004` must add the broader geopolitical baseline dataset and "what's happening now" first-launch context after this event-story seam exists.

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I7-003.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I7-003/
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
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I7-003/
- User Sign-off:

## Progress Log

- 2026-04-09: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
- 2026-04-10: Rewrote the packet from placeholder state around the real seam: derived global event timeline, zoom-aware map event markers, and event-to-AOI linking over the already-real I7/I8/I9 artifacts.
