# WP-GOV-BRIDGE-002 - Headless Agent Bridge Actions and Governed App Interaction

Date Opened: 2026-04-09
Status: IN-PROGRESS
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
- [ ] Desktop runtime bridge reachable from localhost

### UI Contract Tests
- [ ] Probe result renders in the settings surface after bridge action execution
- [ ] Probe result remains visible in the assistant surface and degraded/error messaging stays truthful

### Functional Flow Tests
- [ ] `POST /agent/action` runs `probe-local-runtime` and returns structured completion
- [ ] Navigate -> action -> snapshot live proof flow works without seeded recorder state

### Code Correctness Tests
- [ ] Frontend regression coverage
- [ ] Rust regression coverage
- [ ] Production build and packet check

### Red-Team and Abuse Tests
- [ ] Unsupported action IDs fail cleanly
- [ ] Bridge continues to avoid keyboard/mouse simulation and arbitrary automation
- [ ] Invalid or timed-out action requests return bounded errors

### Additional Tests
- [ ] Action timeout/recovery behavior
- [ ] Live desktop visual proof via snapshot capture
- [ ] Recorder state remains truthful after the live probe

## Fallback Register

- Explicit simulated/mock/sample paths: None intended for the bridge action path; the packet exists specifically to remove the seeded recorder-state proof workaround from `WP-I6-004`.
- Required labels in code/UI/governance: Action IDs must be documented as approved named workflows, not generic UI automation; docs must continue to forbid keyboard/mouse simulation.
- Successor packet or debt owner: If additional named actions are needed later, queue them in a successor bridge packet instead of broadening this packet into generic automation.
- Exit condition to remove fallback: Live bridge proof shows `probe-local-runtime` executed and rendered through the real UI without seeded recorder data.

## Change Ledger

- What Became Real: Governance now tracks the missing bridge-interaction seam as its own cross-cutting packet with explicit proof criteria tied to the `WP-I6-004` seeded-state workaround.
- What Remains Simulated: Until this packet lands, the bridge still cannot invoke the in-app local-runtime probe, so visual proof of that flow requires a temporary recorder-state seed.
- Next Blocking Real Seam: Implement `POST /agent/action`, wire it to a real frontend action registry, and capture live navigate/action/snapshot proof against the desktop app.

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-BRIDGE-002.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/
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
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/
- User Sign-off:

## Progress Log

- 2026-04-09: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
