# WP-GOV-BRIDGE-002 - Headless Agent Bridge Actions and Governed App Interaction

Date Opened: 2026-04-09
Status: IMPLEMENTED
Iteration: All
Workflow Version: 4.0
Packet Class: IMPLEMENTATION
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-GOV-BRIDGE-002.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-GOV-BRIDGE-002.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-GOV-BRIDGE-002.ps1

## Intent

Extend the localhost-only agent bridge so approved named app actions can be invoked and awaited through a stable HTTP contract. This closes the current `WP-I6-004` workaround where screenshots had to be captured from a temporarily seeded recorder state because the bridge could navigate and snapshot, but could not trigger the real in-app local-runtime probe.

## Linked Requirements

- REQ-0013
- REQ-0019
- REQ-0020

## Linked Primitives

- PRIM-0075 | Governed Agent Action Bridge | This packet needs a narrow, explicit action contract so agents can trigger approved UI workflows such as the local-runtime probe without focus stealing, DOM click simulation, or seeded-state shortcuts.

## Primitive Matrix Impact

- Add/update the `PRIM-0075` row in `.gov/Spec/PRIMITIVES_MATRIX.md` so the bridge action contract, implementation files, and live proof remain traceable.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## Reality Boundary

- Real Seam: The Tauri bridge accepts a named action request, emits it into the live frontend, waits for structured completion, and returns the real result to the caller without keyboard/mouse simulation.
- User-Visible Win: Agents can run governed UI workflows such as `probe-local-runtime` against the live desktop app and then capture truthful visual proof from the resulting state.
- Proof Target: `POST /agent/action` successfully runs `probe-local-runtime`, returns a structured completion payload, and the resulting state is visible in bridge-driven settings/assistant snapshots without seeded recorder data.
- Allowed Temporary Fallbacks: The action catalog remains intentionally narrow and named; arbitrary click, coordinate, form-fill, and map gesture automation remain out of scope.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to `E2E-VERIFIED`.

## In Scope

- `POST /agent/action` HTTP endpoint with bounded timeout handling and structured JSON completion.
- Frontend action listener plus stable action registry for approved workflows, starting with `probe-local-runtime`.
- Tauri commands and bridge channels for action completion.
- Real live-proof capture that removes the `WP-I6-004` seeded-state workaround.
- Root instruction updates in `PROJECT_CODEX.md`, `AGENTS.md`, and `MODEL_BEHAVIOR.md` so future agents use the bridge/debugger as the default UI interaction path.

## Out of Scope

- Arbitrary DOM clicking, coordinate-based interaction, keyboard injection, or mouse simulation.
- Generic form automation, arbitrary map pan/zoom/draw commands, or unrestricted frontend code execution over the bridge.
- Non-localhost bridge exposure or authentication redesign.

## Expected Files Touched

- .gov/Spec/stratatlas_spec_v1_2.md
- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-GOV-BRIDGE-002_headless-agent-bridge-actions-and-governed-app-interaction.md
- .gov/workflow/wp_test_suites/TS-WP-GOV-BRIDGE-002.md
- .gov/workflow/wp_spec_extractions/SX-WP-GOV-BRIDGE-002.md
- .gov/workflow/wp_checks/check-WP-GOV-BRIDGE-002.ps1
- .product/Worktrees/wt_main/src/App.tsx
- .product/Worktrees/wt_main/src/App.test.tsx
- .product/Worktrees/wt_main/src-tauri/src/lib.rs
- PROJECT_CODEX.md
- AGENTS.md
- MODEL_BEHAVIOR.md

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0075 | Headless bridge action contract | raw `TcpListener`, Tauri events/commands, React `useEffectEvent`, structured JSON payloads | Agents can trigger approved in-app workflows and await real completion without input simulation or seeded recorder-state shortcuts. |

## Spec-Test Coverage Plan

### Dependency and Environment Tests
- [x] Governance preflight before implementation
- [x] Desktop runtime bridge reachable from localhost

### UI Contract Tests
- [x] Probe result renders in the settings surface after bridge action execution
- [x] Probe result remains visible in the assistant surface and degraded/error messaging stays truthful

### Functional Flow Tests
- [x] `POST /agent/action` runs `probe-local-runtime` and returns structured completion
- [x] Navigate -> action -> snapshot live proof flow works without seeded recorder state

### Code Correctness Tests
- [x] Frontend regression coverage
- [x] Rust regression coverage
- [x] Production build and packet check

### Red-Team and Abuse Tests
- [x] Unsupported action IDs fail cleanly
- [x] Bridge continues to avoid keyboard/mouse simulation and arbitrary automation
- [x] Invalid or timed-out action requests return bounded errors

### Additional Tests
- [x] Action timeout/recovery behavior
- [x] Live desktop visual proof via snapshot capture
- [x] Recorder state remains truthful after the live probe

## Fallback Register

- Explicit simulated/mock/sample paths: None on the shipped `/agent/action` seam; unsupported actions, malformed requests, and timed-out requests return bounded errors instead of falling back to generic automation.
- Required labels in code/UI/governance: Action IDs must be documented as approved named workflows, not generic UI automation; docs must continue to forbid keyboard/mouse simulation.
- Successor packet or debt owner: If additional named actions are needed later, queue them in a successor bridge packet instead of broadening this packet into generic automation.
- Exit condition to remove fallback: Closed in this packet via live bridge proof under `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/`.

## Change Ledger

- What Became Real: the localhost bridge now exposes `POST /agent/action`, the frontend registers approved named actions through a governed registry, `/agent/state` reports live shell metadata through the correct Tauri payload contract, and the desktop app can run `probe-local-runtime` and capture truthful post-action settings/assistant snapshots without seeded recorder state.
- What Remains Simulated: arbitrary DOM clicking, coordinate automation, map gestures, and browser/jsdom desktop-bridge behavior remain intentionally out of scope.
- Next Blocking Real Seam: No blocking seam remains for the current named-action scope; if future live workflows need bridge execution, add them through a successor packet instead of widening this packet into generic automation.

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: `pnpm exec vitest run src/App.test.tsx --reporter=verbose`; `cargo test --manifest-path .product/Worktrees/wt_main/src-tauri/Cargo.toml`; `pnpm build`; `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-BRIDGE-002.ps1`; `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/enforce_wp_template_compliance.ps1`
- Proof Artifact: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/`
- Claim Standard: do not claim completion without linked command output and artifact paths.

## Exit Criteria

- Task board and requirements index statuses are synchronized.
- Traceability, primitives index, and primitives matrix are synchronized.
- Linked test suite has executed results and evidence paths.
- Evidence bundle is attached.
- Reality Boundary, Fallback Register, and Change Ledger are truthful.
- User Sign-off: APPROVED.

## Evidence

- Test Suite Execution: `pnpm exec vitest run src/App.test.tsx --reporter=verbose`; `cargo test --manifest-path .product/Worktrees/wt_main/src-tauri/Cargo.toml`; `pnpm build`; `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-BRIDGE-002.ps1`; `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/enforce_wp_template_compliance.ps1`
- Logs: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/summary.md`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/notes.md`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/visual_proof/bridge_health.json`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/visual_proof/bridge_action_probe.json`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/visual_proof/bridge_action_unsupported.json`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/visual_proof/bridge_action_probe_timeout.json`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_225418/summary.md`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_225418/result.json`
- Screenshots/Exports: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/visual_proof/settings_before_probe_clean.png`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/visual_proof/settings_after_probe_clean.png`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/visual_proof/assistant_after_probe_clean.png`
- Build Artifacts: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/visual_proof/bridge_state_initial.json`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/visual_proof/bridge_state_settings_before_probe.json`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/visual_proof/bridge_state_after_probe.json`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/visual_proof/bridge_state_assistant.json`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/visual_proof/navigate_settings.json`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/visual_proof/navigate_assistant.json`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/visual_proof/snapshot_settings_before_probe.json`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/visual_proof/snapshot_settings_after_probe.json`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/visual_proof/snapshot_assistant_after_probe.json`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/visual_proof/bridge_action_probe_timeout.status.txt`
- Proof Artifact: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/`
- User Sign-off:

## Progress Log

- 2026-04-09: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
- 2026-04-09: Implemented the `/agent/action` bridge contract, frontend action registry, and Tauri completion channel in `.product/Worktrees/wt_main/src/App.tsx` and `.product/Worktrees/wt_main/src-tauri/src/lib.rs`.
- 2026-04-09: Fixed the live bridge state-report payload mismatch so `/agent/state` now returns truthful shell metadata through `agent_report_state`.
- 2026-04-09: Updated `AGENTS.md`, `PROJECT_CODEX.md`, and `MODEL_BEHAVIOR.md` so future agents use the visual debugger and headless bridge as the default desktop interaction path.
- 2026-04-09: Captured live navigate/action/snapshot proof plus unsupported-action and timeout evidence under `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/`, removing the seeded-state screenshot workaround left by `WP-I6-004`.
