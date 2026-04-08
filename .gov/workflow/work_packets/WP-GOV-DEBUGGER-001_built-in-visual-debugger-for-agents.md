# WP-GOV-DEBUGGER-001 - Built-in Visual Debugger for Agents

Date Opened: 2026-04-09
Status: IN-PROGRESS
Iteration: All
Workflow Version: 4.0
Packet Class: IMPLEMENTATION
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-GOV-DEBUGGER-001.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-GOV-DEBUGGER-001.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-GOV-DEBUGGER-001.ps1

## Intent

Add a deterministic application-layer snapshot tool so AI agents can capture the active worksurface to disk for visual debugging, QA evaluation, and layout verification — without requiring manual operator screenshots or focus stealing.

## Linked Requirements

- REQ-0013
- REQ-0019
- REQ-0020

## Linked Primitives

- PRIM-0071 | Map-First Workbench Shell | snapshot must capture the full workbench surface including map canvas, panels, and status indicators

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## Reality Boundary

- Real Seam: A Tauri command captures the active WebView body as a PNG snapshot and writes it to a governed path with optional subfolder and label.
- User-Visible Win: Agents can visually debug the app without operator intervention. Ctrl+Shift+S hotkey also available for manual captures.
- Proof Target: Snapshot files written to `.product/build_target/tool_artifacts/snapshots/` with organized subfolder structure; Tauri command returns absolute path.
- Allowed Temporary Fallbacks: html2canvas may not perfectly capture WebGL/canvas-based map tiles — screenshot captures DOM-rendered content only.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## In Scope

- Tauri command `admin_save_snapshot` accepting base64 PNG data, optional subfolder, optional label.
- Frontend `html2canvas` capture triggered by Ctrl+Shift+S hotkey.
- Global JS hook `window.__stratatlasRequestSnapshot(subfolder?, label?)` for programmatic agent use.
- Organized snapshot folder structure (manual/, WP-id/, audit-name/).
- AGENTS.md documentation of snapshot usage.

## Out of Scope

- WebGL/canvas map tile capture (html2canvas limitation with GPU-rendered content).
- Video recording or screen streaming.

## Expected Files Touched

- .gov/Spec/stratatlas_spec_v1_2.md
- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-GOV-DEBUGGER-001_built-in-visual-debugger-for-agents.md
- .gov/workflow/wp_test_suites/TS-WP-GOV-DEBUGGER-001.md
- .gov/workflow/wp_spec_extractions/SX-WP-GOV-DEBUGGER-001.md
- .gov/workflow/wp_checks/check-WP-GOV-DEBUGGER-001.ps1
- .product/Worktrees/wt_main/src-tauri/src/lib.rs
- .product/Worktrees/wt_main/src/App.tsx
- AGENTS.md

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0071 | Visual Debugger | html2canvas + Tauri command | Agents capture full workbench surface as PNG for visual QA |

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

- Explicit simulated/mock/sample paths: None — html2canvas captures live DOM directly.
- Required labels in code/UI/governance: Snapshot paths carry explicit subfolder/label metadata.
- Successor packet or debt owner: WP-GOV-BRIDGE-001 (headless agent bridge) extends this with HTTP API access.
- Exit condition to remove fallback: N/A — no fallbacks in this packet.

## Change Ledger

- What Became Real: Deterministic snapshot capture via Tauri command and hotkey.
- What Remains Simulated: Map canvas WebGL content may not render in html2canvas — DOM content only.
- Next Blocking Real Seam: WP-GOV-BRIDGE-001 (headless navigation + snapshot without focus stealing).

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-DEBUGGER-001.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-GOV-DEBUGGER-001/
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
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-GOV-DEBUGGER-001/
- User Sign-off:

## Progress Log

- 2026-04-09: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
