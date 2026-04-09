# WP-GOV-BRIDGE-001 - Headless Agent Bridge for Navigation and Snapshots

Date Opened: 2026-04-09
Status: IMPLEMENTED
Iteration: All
Workflow Version: 4.0
Packet Class: IMPLEMENTATION
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-GOV-BRIDGE-001.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-GOV-BRIDGE-001.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-GOV-BRIDGE-001.ps1

## Intent

Add a localhost-only HTTP bridge so AI agents can navigate shell panels, request snapshots, and inspect current workbench state without moving the mouse, stealing focus, or relying on brittle keyboard simulation.

## Linked Requirements

- REQ-0013
- REQ-0019
- REQ-0020

## Linked Primitives

- PRIM-0071 | Map-First Workbench Shell | The bridge must navigate meaningful workbench surfaces and report truthful shell state without disturbing the operator.

## Primitive Matrix Impact

- Add or update the PRIM-0071 row in `.gov/Spec/PRIMITIVES_MATRIX.md` only if scope or verification status changes beyond this implementation pass.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## Reality Boundary

- Real Seam: A localhost-only HTTP server inside the Tauri runtime accepts JSON requests for health, state, navigation, and snapshot capture while the frontend reports current shell state back to the backend.
- User-Visible Win: Agents can audit or debug the app without stealing focus from the operator, and can move between major shell tabs plus 2D/3D surface modes programmatically.
- Proof Target: `/agent/health` responds, `/agent/state` returns current panel plus bundle and map metadata, `/agent/navigate` routes to live panel aliases, and `/agent/snapshot` still resolves through the governed snapshot path.
- Allowed Temporary Fallbacks: Snapshot fidelity still inherits html2canvas DOM-only limitations from `WP-GOV-DEBUGGER-001`.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to `E2E-VERIFIED`.

## In Scope

- Random localhost port listener bound to `127.0.0.1` only.
- `GET /agent/health`
- `GET /agent/state`
- `POST /agent/navigate`
- `POST /agent/snapshot`
- App-data port file discovery under the governed app-data runtime root at `stratatlas/agent_bridge_port.txt`
- Frontend event listeners for navigate and snapshot requests
- Frontend state reporting for current panel, active bundle ID, map mode, and shell tab state
- Global JS hook `window.__stratatlasNavigate(panel)`
- Repo instructions that document the bridge workflow

## Out of Scope

- Authentication or remote exposure beyond localhost.
- Full UI automation such as button clicking or form filling.
- Pan, zoom, draw, or arbitrary map interaction commands.
- Streaming, websockets, or long-lived subscriptions.

## Expected Files Touched

- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/ROADMAP.md
- .gov/workflow/work_packets/WP-GOV-BRIDGE-001_headless-agent-bridge-for-navigation-and-snapshots.md
- .gov/workflow/wp_test_suites/TS-WP-GOV-BRIDGE-001.md
- .gov/workflow/wp_spec_extractions/
- .gov/workflow/wp_spec_extractions/SX-WP-GOV-BRIDGE-001.md
- .gov/workflow/wp_checks/
- .gov/workflow/wp_checks/check-WP-GOV-BRIDGE-001.ps1
- .product/Worktrees/wt_main/src/App.tsx
- .product/Worktrees/wt_main/src-tauri/src/lib.rs
- AGENTS.md

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0071 | Headless agent bridge | raw TcpListener + Tauri events + html2canvas | Agents can move across major shell surfaces and capture snapshots without focus disruption. |

## Spec-Test Coverage Plan

### Dependency and Environment Tests
- [x] Governance preflight
- [x] Runtime dependency resolution through production build

### UI Contract Tests
- [x] App render contract still passes after bridge state wiring
- [ ] Live desktop bridge smoke pass

### Functional Flow Tests
- [x] Frontend navigation aliases now route to real shell views and 2D/3D surface mode changes
- [x] Backend state endpoint now serializes current panel, active bundle ID, map mode, and shell tab metadata
- [ ] Live curl-based runtime proof against a running desktop session

### Code Correctness Tests
- [x] Frontend test suite
- [x] Rust unit tests
- [x] Lint

### Red-Team and Abuse Tests
- [x] Guardrail static check via governed WP runner
- [x] Localhost-only listener remains the transport boundary

### Additional Tests
- [x] Production build
- [ ] Live runtime bridge proof and user sign-off

## Fallback Register

- Explicit simulated/mock/sample paths: None. The bridge server, event listeners, and state reporting are real runtime code.
- Required labels in code/UI/governance: `/agent/state` must remain truthful about current shell state and may not imply data or runtime guarantees that the app has not actually reached.
- Successor packet or debt owner: None for implementation. Remaining work is live desktop proof and user sign-off.
- Exit condition to remove fallback: Capture live desktop bridge evidence and obtain user sign-off before any `E2E-VERIFIED` claim.

## Change Ledger

- What Became Real: The backend now serves structured bridge state, writes the discovery port file, and accepts snapshot plus navigation requests; the frontend now handles navigation aliases, reports current shell state, and exposes `window.__stratatlasNavigate(panel)` for in-WebView agent use.
- What Remains Simulated: Snapshot output still depends on html2canvas DOM capture, so GPU-only map rendering is not guaranteed to appear exactly as the native compositor renders it.
- Next Blocking Real Seam: Run a live desktop bridge smoke pass against the built app, capture snapshot artifacts through the HTTP bridge, and obtain user sign-off.

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
  - `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-BRIDGE-001.ps1`
- Proof Artifact: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-001/20260409_044342/`
- Claim Standard: do not claim completion without linked command output and artifact paths.

## Exit Criteria

- Task board and linked packet metadata are synchronized.
- Linked test suite reflects executed verification and evidence paths.
- Reality Boundary, Fallback Register, and Change Ledger are truthful.
- Live runtime bridge proof is captured before any `E2E-VERIFIED` claim.
- User Sign-off: APPROVED.

## Evidence

- Test Suite Execution: `pnpm exec vitest run src/App.test.tsx --reporter=verbose`; `pnpm lint`; `pnpm build`; `cargo test --manifest-path src-tauri/Cargo.toml`; `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-BRIDGE-001.ps1`
- Logs: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-001/20260409_044342/summary.md`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-001/20260409_044342/result.json`
- Screenshots/Exports: HTTP bridge implementation validated at build/test level; no live curl-driven desktop snapshot bundle was captured in this implementation-only pass.
- Build Artifacts: `.product/Worktrees/wt_main/dist/`; `.product/Worktrees/wt_main/src-tauri/target/debug/`
- Proof Artifact: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-001/20260409_044342/`
- User Sign-off: Pending

## Progress Log

- 2026-04-09: WP scaffold created via `.gov/repo_scripts/new_work_packet.ps1`.
- 2026-04-09: Completed the missing bridge seam in `.product/Worktrees/wt_main/src/App.tsx` and `.product/Worktrees/wt_main/src-tauri/src/lib.rs`; frontend navigation events now route to real panel aliases and map modes, frontend state reports into the backend, and `/agent/state` now returns structured shell metadata instead of a single current-panel field.
