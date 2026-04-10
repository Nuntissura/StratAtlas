# WP-GOV-DEBUGGER-002 - Full-DOM Snapshot and Per-Panel Capture

Date Opened: 2026-04-10
Status: IMPLEMENTED
Iteration: All
Workflow Version: 4.0
Packet Class: IMPLEMENTATION
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-GOV-DEBUGGER-002.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-GOV-DEBUGGER-002.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-GOV-DEBUGGER-002.ps1

## Intent

Replace the viewport-only `html2canvas(document.body)` snapshot with two governed capture modes:
1. **Full-DOM snapshot** — captures the entire app surface regardless of window size, including overflowing and overlapping panels, all typed text, map state, and all panel content. This produces a single image that shows the truthful state of the entire app, not just what fits in the viewport.
2. **Per-panel snapshot** — targets an individual panel element by selector/id and captures it in isolation at its natural rendered size, so overlapping layouts, clipped content, and panel-internal scroll state are all visible.

Predecessor: `WP-GOV-DEBUGGER-001` shipped `html2canvas(document.body)` which clips to viewport bounds. Overlapping right-side panels, scrollable content, and overflowing layouts are invisible in proof snapshots. This was used for WP evidence across multiple packets without anyone flagging the limitation.

## Linked Requirements

- REQ-0013
- REQ-0019
- REQ-0020

## Linked Primitives

- PRIM-0075 | Governed Agent Action Bridge | The snapshot capture is invoked through the bridge and debugger hotkey; this WP upgrades the capture fidelity that PRIM-0075 depends on for truthful visual evidence

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## Reality Boundary

- Real Seam: Replace `html2canvas(document.body)` default-options viewport capture with full-DOM and per-panel capture modes that produce truthful images of the entire app state.
- User-Visible Win: Snapshots now show all panels, all typed text, all map state, and all disclosure content regardless of window size or overlap. Per-panel capture lets you inspect any individual panel without clipping from neighbors.
- Proof Target: Side-by-side comparison — old viewport-only snapshot vs new full-DOM snapshot of the same app state, showing previously invisible overlapping/overflowing content now visible. Per-panel snapshot of the right-side panel stack showing each panel individually.
- Allowed Temporary Fallbacks: WebGL canvas content (MapLibre/Cesium) may still require the existing html2canvas path or a separate `canvas.toDataURL()` compositing step if the full-DOM renderer cannot capture WebGL natively. If so, label the map region as "composited from WebGL capture" in the snapshot metadata.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## In Scope

- Replace or augment `html2canvas(document.body)` with a capture mode that renders the full DOM content — including overflowing, overlapping, and scrollable regions — into a single image whose dimensions match the app's full layout, not the viewport.
- Add a `panelId` / `selector` parameter to the snapshot JS global and bridge endpoint so callers can target a specific panel element and capture it in isolation at its natural size.
- Update `window.__stratatlasRequestSnapshot()` to accept an optional `{ mode: 'full' | 'panel', panelSelector?: string }` parameter.
- Update `POST /agent/snapshot` to accept optional `mode` and `panelSelector` fields.
- Update `Ctrl+Shift+S` hotkey to default to full-DOM mode.
- Ensure the Tauri `admin_save_snapshot` command handles larger image payloads without truncation.
- Preserve backward compatibility: existing callers with no mode parameter get the new full-DOM capture by default.

## Out of Scope

- Bridge navigation or disclosure-toggle changes (covered by `WP-GOV-BRIDGE-003`).
- New bridge endpoints beyond the snapshot parameter additions.
- Changing the file storage path or naming convention (keep existing app-data snapshots layout).

## Expected Files Touched

- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-GOV-DEBUGGER-002_full-dom-snapshot-and-per-panel-capture.md
- .gov/workflow/wp_test_suites/TS-WP-GOV-DEBUGGER-002.md
- .gov/workflow/wp_spec_extractions/SX-WP-GOV-DEBUGGER-002.md
- .gov/workflow/wp_checks/check-WP-GOV-DEBUGGER-002.ps1
- .product/Worktrees/wt_main/src/App.tsx (snapshot capture functions, JS globals, bridge event listener)
- .product/Worktrees/wt_main/src-tauri/src/lib.rs (admin_save_snapshot handler, bridge snapshot endpoint)
- AGENTS.md (update snapshot API documentation)

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0075 | Visual debugger snapshot | html2canvas (full-DOM options or alternative renderer) + canvas.toDataURL for WebGL compositing | Full-app and per-panel snapshots that capture the truthful state of all panels regardless of window size |

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

- Explicit simulated/mock/sample paths: WebGL map region may be composited from `canvas.toDataURL()` rather than rendered through the DOM capture engine; if so, label as "composited from WebGL capture" in snapshot metadata.
- Required labels in code/UI/governance: Any composited region must carry an explicit label in the snapshot filename or metadata.
- Successor packet or debt owner: If WebGL compositing is needed, a follow-on packet should investigate native WebGL snapshot alternatives.
- Exit condition to remove fallback: Full-DOM renderer that natively captures WebGL content without separate compositing.

## Change Ledger

- What Became Real: Full-DOM capture (scrollWidth/scrollHeight rendering), per-panel capture (CSS selector targeting), backward-compatible viewport mode, bridge mode/panelSelector passthrough
- What Remains Simulated: WebGL map canvas content is rendered by html2canvas heuristics — no separate canvas.toDataURL compositing implemented yet
- Next Blocking Real Seam: `WP-GOV-BRIDGE-003` depends on per-panel targeting to implement its audit sweep

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-DEBUGGER-002.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-GOV-DEBUGGER-002/
- Claim Standard: do not claim completion without linked command output and artifact paths.

## Exit Criteria

- Task board and requirements index statuses are synchronized.
- Traceability, primitives index, and primitives matrix are synchronized.
- Linked test suite has executed results and evidence paths.
- Evidence bundle is attached.
- Reality Boundary, Fallback Register, and Change Ledger are truthful.
- User Sign-off: APPROVED.

## Evidence

- Test Suite Execution: 90/90 tests pass, 12/12 test files
- Logs: TypeScript clean (tsc --noEmit), Rust cargo check clean
- Screenshots/Exports: pending live desktop proof via audit-sweep
- Build Artifacts: pending
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-GOV-DEBUGGER-002/20260410_044147/
- User Sign-off: pending

## Progress Log

- 2026-04-10: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
- 2026-04-10: Implementation landed — captureSnapshot() helper with full/panel/viewport modes, all three snapshot entry points (hotkey, JS global, bridge event) updated, Rust bridge endpoint extended with mode/panelSelector fields. TypeScript clean, Rust compiles, 90/90 tests pass.
