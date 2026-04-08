# WP-GOV-BRIDGE-001 - Headless Agent Bridge for Navigation and Snapshots

Date Opened: 2026-04-09
Status: SPEC-MAPPED
Iteration: All
Workflow Version: 4.0
Packet Class: IMPLEMENTATION
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-GOV-BRIDGE-001.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-GOV-BRIDGE-001.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-GOV-BRIDGE-001.ps1

## Intent

Add a localhost-only HTTP server so AI agents can navigate panels, trigger snapshots, and read workbench state without stealing window focus, moving the mouse, or sending keystrokes — enabling headless testing, visual QA, and automated smoke runs.

## Linked Requirements

- REQ-0013
- REQ-0019
- REQ-0020

## Linked Primitives

- PRIM-0071 | Map-First Workbench Shell | bridge must navigate between shell panels and capture map-inclusive snapshots without focus disruption

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## Reality Boundary

- Real Seam: A localhost HTTP server inside the Tauri app accepts JSON commands for panel navigation, snapshot capture, and state queries without touching the window.
- User-Visible Win: Agents can run full visual audits across all panels while the operator continues using other applications undisturbed.
- Proof Target: curl-based navigation + snapshot sequence across all workbench panels produces organized snapshot artifacts without any focus change.
- Allowed Temporary Fallbacks: Map canvas WebGL content may not render in html2canvas snapshots (same limitation as WP-GOV-DEBUGGER-001).
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## In Scope

- Lightweight localhost-only HTTP server (raw TcpListener, 127.0.0.1 only, random port).
- POST /agent/navigate — switches active panel/tab via Tauri event.
- POST /agent/snapshot — captures snapshot via html2canvas, returns file path. Blocks up to 30s.
- GET /agent/state — returns current panel, active bundle ID, map mode (2D/3D).
- GET /agent/health — liveness check.
- Port file written to app data dir on startup for agent discovery.
- Frontend event listeners for agent-navigate and agent-snapshot-request.
- Frontend state reporting to backend on panel changes.
- Global JS hook `window.__stratatlasNavigate(panel)` for in-WebView use.
- AGENTS.md documentation with endpoint reference and curl examples.

## Out of Scope

- Authentication/token system (localhost-only is sufficient for single-user desktop app).
- Full UI automation (clicking buttons, filling forms).
- WebSocket/streaming support.
- Map interaction commands (pan, zoom, draw) — navigation and snapshots only.

## Expected Files Touched

- .gov/Spec/stratatlas_spec_v1_2.md
- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-GOV-BRIDGE-001_headless-agent-bridge-for-navigation-and-snapshots.md
- .gov/workflow/wp_test_suites/TS-WP-GOV-BRIDGE-001.md
- .gov/workflow/wp_spec_extractions/SX-WP-GOV-BRIDGE-001.md
- .gov/workflow/wp_checks/check-WP-GOV-BRIDGE-001.ps1
- .product/Worktrees/wt_main/src-tauri/src/lib.rs
- .product/Worktrees/wt_main/src/App.tsx
- AGENTS.md

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0071 | Headless Agent Bridge | raw TcpListener + Tauri events + html2canvas | Agents navigate panels and capture snapshots via HTTP without focus stealing |

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

- Explicit simulated/mock/sample paths: None — HTTP server and event listeners are real runtime code.
- Required labels in code/UI/governance: Port file path documented in AGENTS.md.
- Successor packet or debt owner: None — this packet closes the agent tooling vertical.
- Exit condition to remove fallback: N/A.

## Change Ledger

- What Became Real: Localhost HTTP API for headless agent navigation and snapshot capture.
- What Remains Simulated: Map canvas WebGL rendering in snapshots (html2canvas DOM-only limitation).
- Next Blocking Real Seam: None for agent tooling; WP-GOV-SMOKE-001 is the next product blocker.

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-BRIDGE-001.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-001/
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
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-001/
- User Sign-off:

## Progress Log

- 2026-04-09: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
