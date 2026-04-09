# WP-GOV-DEBUGGER-001 - Built-in Visual Debugger for Agents

Date Opened: 2026-04-09
Status: IMPLEMENTED
Iteration: All
Workflow Version: 4.0
Packet Class: IMPLEMENTATION
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-GOV-DEBUGGER-001.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-GOV-DEBUGGER-001.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-GOV-DEBUGGER-001.ps1

## Intent

Add a deterministic application-layer snapshot tool so AI agents can capture the active workbench surface to disk for visual debugging, QA evaluation, and layout verification without manual screenshots or focus stealing.

## Linked Requirements

- REQ-0013
- REQ-0019
- REQ-0020

## Linked Primitives

- PRIM-0071 | Map-First Workbench Shell | Snapshot capture must preserve the visible workbench shell, including the map stage, surrounding panes, and status surfaces.

## Primitive Matrix Impact

- Add or update the PRIM-0071 row in `.gov/Spec/PRIMITIVES_MATRIX.md` only if scope or verification status changes beyond this implementation pass.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## Reality Boundary

- Real Seam: A Tauri command accepts PNG bytes from the WebView, writes the file under the governed app-data runtime root, and returns the absolute saved path.
- User-Visible Win: Agents can capture the live workbench for visual QA, and operators can trigger the same flow manually with `Ctrl+Shift+S`.
- Proof Target: Snapshot files are written under the governed app-data runtime root in `stratatlas/snapshots/{subfolder}/` with label-based filenames, and the frontend exposes the capture flow through both the hotkey path and `window.__stratatlasRequestSnapshot(subfolder?, label?)`.
- Allowed Temporary Fallbacks: html2canvas captures the live DOM, so GPU-only or WebGL-only map content may not appear exactly as the on-screen compositor renders it.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to `E2E-VERIFIED`.

## In Scope

- Tauri command `admin_save_snapshot` accepting base64 PNG data plus optional subfolder and label.
- Frontend `html2canvas` capture bound to `Ctrl+Shift+S`.
- Global JS hook `window.__stratatlasRequestSnapshot(subfolder?, label?)`.
- Organized snapshot folder structure under the governed app-data runtime root.
- Repo instructions that explain how agents should use the debugger.

## Out of Scope

- Guaranteed WebGL tile capture fidelity.
- Video recording, streaming, or continuous polling.
- Headless HTTP navigation and state reporting. Those belong to `WP-GOV-BRIDGE-001`.

## Expected Files Touched

- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/ROADMAP.md
- .gov/workflow/work_packets/WP-GOV-DEBUGGER-001_built-in-visual-debugger-for-agents.md
- .gov/workflow/wp_test_suites/TS-WP-GOV-DEBUGGER-001.md
- .gov/workflow/wp_spec_extractions/
- .gov/workflow/wp_spec_extractions/SX-WP-GOV-DEBUGGER-001.md
- .gov/workflow/wp_checks/
- .gov/workflow/wp_checks/check-WP-GOV-DEBUGGER-001.ps1
- .product/Worktrees/wt_main/src/App.tsx
- .product/Worktrees/wt_main/src-tauri/src/lib.rs
- AGENTS.md

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0071 | Visual debugger | html2canvas + Tauri command | Agents can capture a deterministic shell snapshot from the live desktop runtime. |

## Spec-Test Coverage Plan

### Dependency and Environment Tests
- [x] Governance preflight
- [x] Runtime dependency resolution through production build

### UI Contract Tests
- [x] App render contract still passes after debugger wiring
- [ ] Live desktop snapshot proof capture

### Functional Flow Tests
- [x] Snapshot hook and hotkey path compile and integrate with the app shell
- [ ] Live manual snapshot flow captured in a running desktop session

### Code Correctness Tests
- [x] Frontend test suite
- [x] Rust unit tests
- [x] Lint

### Red-Team and Abuse Tests
- [x] Guardrail static check via governed WP runner
- [x] Path sanitization still enforced for snapshot segments

### Additional Tests
- [x] Production build
- [ ] Live desktop visual proof and user sign-off

## Fallback Register

- Explicit simulated/mock/sample paths: None. The debugger writes real files from the live app shell.
- Required labels in code/UI/governance: Snapshot filenames preserve explicit subfolder and label metadata.
- Successor packet or debt owner: `WP-GOV-BRIDGE-001` extends the debugger seam with focus-safe HTTP navigation and state reporting.
- Exit condition to remove fallback: Capture live desktop snapshot proof and obtain user sign-off before any `E2E-VERIFIED` claim.

## Change Ledger

- What Became Real: `admin_save_snapshot` persists PNG captures under the governed app-data runtime root, `Ctrl+Shift+S` triggers manual capture, and `window.__stratatlasRequestSnapshot(subfolder?, label?)` exposes the same flow for agent-triggered visual QA.
- What Remains Simulated: html2canvas still captures the DOM rather than guaranteed GPU or compositor output, so map imagery fidelity depends on what the WebView exposes to DOM capture.
- Next Blocking Real Seam: `WP-GOV-BRIDGE-001` completes the agent-tooling vertical by adding focus-safe HTTP navigation and structured bridge state reporting.

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs:
  - `pnpm exec vitest run src/App.test.tsx --reporter=verbose`
  - `pnpm lint`
  - `pnpm build`
  - `cargo test --manifest-path src-tauri/Cargo.toml`
  - `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-DEBUGGER-001.ps1`
- Proof Artifact: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-DEBUGGER-001/20260409_044342/`
- Claim Standard: do not claim completion without linked command output and artifact paths.

## Exit Criteria

- Task board and linked packet metadata are synchronized.
- Linked test suite reflects executed verification and evidence paths.
- Reality Boundary, Fallback Register, and Change Ledger are truthful.
- Live runtime snapshot proof is captured before any `E2E-VERIFIED` claim.
- User Sign-off: APPROVED.

## Evidence

- Test Suite Execution: `pnpm exec vitest run src/App.test.tsx --reporter=verbose`; `pnpm lint`; `pnpm build`; `cargo test --manifest-path src-tauri/Cargo.toml`; `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-DEBUGGER-001.ps1`
- Logs: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-DEBUGGER-001/20260409_044342/summary.md`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-DEBUGGER-001/20260409_044342/result.json`
- Screenshots/Exports: Runtime snapshot infrastructure implemented; no live desktop snapshot evidence was captured in this implementation-only pass.
- Build Artifacts: `.product/Worktrees/wt_main/dist/`; `.product/Worktrees/wt_main/src-tauri/target/debug/`
- Proof Artifact: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-DEBUGGER-001/20260409_044342/`
- User Sign-off: Pending

## Progress Log

- 2026-04-09: WP scaffold created via `.gov/repo_scripts/new_work_packet.ps1`.
- 2026-04-09: Verified and retained the live debugger seam in `.product/Worktrees/wt_main/src/App.tsx` and `.product/Worktrees/wt_main/src-tauri/src/lib.rs`; the Tauri snapshot command, hotkey path, and JS hook build cleanly and pass frontend lint/tests plus Rust unit tests.
