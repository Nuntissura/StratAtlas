# WP-I6-004 - In-App Local Runtime Probe and Verification Surface

Date Opened: 2026-04-09
Status: IMPLEMENTED
Iteration: I6
Workflow Version: 4.0
Packet Class: IMPLEMENTATION
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I6-004.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I6-004.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I6-004.ps1

## Intent

Add a first-class in-app probe for governed local AI runtimes so operators can verify that the currently selected LM Studio, Ollama, or custom executable path is actually callable from StratAtlas, see the result inside the settings and assistant surfaces, and capture truthful desktop proof through the headless bridge instead of relying only on external CLI checks.

## Linked Requirements

- REQ-0700
- REQ-0701
- REQ-0702
- REQ-0703
- REQ-0704
- REQ-0705
- REQ-0706
- REQ-0707
- REQ-0708

## Linked Primitives

- PRIM-0052 | Governed AI Provider Adapter | Extend the existing audited provider seam with an explicit runtime probe path, structured probe status, and UI-visible verification evidence without weakening policy boundaries.

## Primitive Matrix Impact

- Add/update rows in `.gov/Spec/PRIMITIVES_MATRIX.md` for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## Reality Boundary

- Real Seam: the Tauri provider adapter exposes a dedicated local-runtime probe command that executes the currently selected local provider with a bounded verification prompt, returns structured success/failure metadata plus sanitized output, and the React shell surfaces that result directly in settings and assistant regions.
- User-Visible Win: users can click `Probe local runtime` in the app, see whether the selected local model path is actually runnable, inspect provider/model/runtime details and the latest probe result, and avoid misleading “detected on disk” states when the local runtime cannot execute.
- Proof Target: App/backend/Rust tests pass, `check-WP-I6-004.ps1` passes, a desktop bridge run captures the AI settings/assistant surface with a completed probe result, and the proof bundle contains bridge state plus snapshot evidence from the live app.
- Allowed Temporary Fallbacks: browser/jsdom remains explicitly simulated and cannot execute the live probe; the probe may return truthful runtime errors from LM Studio/Ollama/custom commands; if bridge PNG capture still fails, bridge state plus saved debug snapshots may stand in as truthful partial proof but not as a fake screenshot claim.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to `E2E-VERIFIED`.

## In Scope

- Add a dedicated local-runtime probe command in the governed backend that reuses the selected local-provider configuration and returns structured verification results.
- Add a first-class `Probe local runtime` action and latest-result summary to the settings menu and assistant surface, including truthful success, failure, unavailable, and simulated states.
- Persist the latest probe result in recorder-backed workspace state so the verified condition survives restore and can be inspected after reopen.
- Capture live desktop proof through the headless bridge and built-in visual debugger for the completed probe surface.

## Out of Scope

- Automatic LM Studio runtime upgrades, automatic engine switching, or automated remediation of third-party runtime/toolchain issues.
- General provider benchmarking, multi-prompt evaluation, or new AI workflow features beyond runtime verification.
- Any raw-path, raw-database, or policy-bypassing expansion of the governed AI surface.

## Expected Files Touched

- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/TECH_STACK.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/ROADMAP.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-I6-004_in-app-local-runtime-probe-and-verification-surface.md
- .gov/workflow/wp_test_suites/TS-WP-I6-004.md
- .gov/workflow/wp_spec_extractions/SX-WP-I6-004.md
- .gov/workflow/wp_checks/check-WP-I6-004.ps1
- .product/Worktrees/wt_main/src/App.tsx
- .product/Worktrees/wt_main/src/App.test.tsx
- .product/Worktrees/wt_main/src/App.css
- .product/Worktrees/wt_main/src/features/i6/aiGateway.ts
- .product/Worktrees/wt_main/src/features/i6/i6.test.ts
- .product/Worktrees/wt_main/src/lib/backend.ts
- .product/Worktrees/wt_main/src/lib/backend.test.ts
- .product/Worktrees/wt_main/src-tauri/src/lib.rs

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0052 | in-app local runtime probe and verification summary | React settings + assistant UI, TypeScript backend adapter, Tauri command routing, Rust local provider execution, bridge snapshot proof | Makes local-runtime readiness verifiable from inside StratAtlas while keeping the provider seam auditable, bounded, and truthful about failure modes. |

## Spec-Test Coverage Plan

### Dependency and Environment Tests
- [x] Dependency graph/lock integrity tests
- [x] Runtime compatibility checks

### UI Contract Tests
- [x] Required regions/modes/states
- [x] Error/degraded-state UX

### Functional Flow Tests
- [x] Golden flow and edge cases
- [x] Persistence/replay/export flows

### Code Correctness Tests
- [x] Unit tests
- [x] Integration tests
- [x] Static analysis (lint/type/schema)

### Red-Team and Abuse Tests
- [x] Non-goal enforcement (spec section 3.2)
- [x] Policy bypass scenarios
- [x] Adversarial/invalid input cases

### Additional Tests
- [ ] Performance budgets
- [ ] Offline behavior
- [x] Reliability/recovery

## Fallback Register

- Explicit simulated/mock/sample paths: browser/jsdom may only expose a simulated/unavailable probe state and must never claim live local execution; bridge state can be used as proof adjunct if PNG capture fails, but not as a fake screenshot substitute.
- Proof-capture constraint: this packet's original live desktop screenshots were captured from a temporarily seeded `latestLocalRuntimeProbe` recorder state because `WP-GOV-BRIDGE-002` did not exist yet. That proof-capture limitation was later retired by successor `WP-GOV-BRIDGE-002`, which added `/agent/action` and captured live probe-driven settings/assistant proof under `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/`.
- Required labels in code/UI/governance: probe results must label `browser-simulated`, `tauri-live`, `tauri-unconfigured`, or runtime failure states truthfully; sanitized output must never expose internal reasoning tags to the analyst-facing UI.
- Successor packet or debt owner: `WP-GOV-BRIDGE-002` closed the desktop-proof interaction gap; future I6 follow-on only if the product later needs one-click runtime remediation, runtime engine management, or benchmark-style probe suites.
- Exit condition to remove fallback: the desktop app can run the probe from the governed UI, persist the latest result, and capture live visual proof of the completed verification state through bridge/debugger evidence.

## Change Ledger

- What Became Real: the React shell now exposes a first-class `Probe local runtime` action in settings and assistant surfaces, persists the latest probe result through recorder state, the TypeScript backend has a dedicated invoke/fallback contract for local-runtime probes, and the Tauri backend exposes a bounded local-provider probe command that sanitizes local-model output before returning it to the UI.
- What Remains Simulated: browser/jsdom probe behavior remains simulated/unavailable outside the governed Tauri runtime; this packet's original proof bundle still reflects the pre-successor seeded-state screenshot path, but that bridge limitation itself is now retired by `WP-GOV-BRIDGE-002`.
- Next Blocking Real Seam: No blocking seam remains for the in-app probe itself; future follow-on work belongs to runtime remediation, engine management, or benchmark-style probe suites rather than bridge interaction.

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I6-004.ps1`
- Proof Artifact: `.product/build_target/tool_artifacts/wp_runs/WP-I6-004/`
- Claim Standard: do not claim completion without linked command output and artifact paths.

## Exit Criteria

- Task board and requirements index statuses are synchronized.
- Traceability, primitives index, and primitives matrix are synchronized.
- Linked test suite has executed results and evidence paths.
- Evidence bundle is attached.
- `Reality Boundary`, `Fallback Register`, and `Change Ledger` are truthful.
- User Sign-off: APPROVED.

## Evidence

- Test Suite Execution: `pnpm exec vitest run src/features/i6/i6.test.ts src/lib/backend.test.ts src/App.test.tsx --reporter=verbose`; `cargo test --manifest-path .product/Worktrees/wt_main/src-tauri/Cargo.toml`; `pnpm build`; `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I6-004.ps1`
- Logs: `.product/build_target/tool_artifacts/wp_runs/WP-I6-004/20260409_214611/summary.md`; `.product/build_target/tool_artifacts/wp_runs/WP-I6-004/20260409_214611/result.json`; `.product/build_target/tool_artifacts/wp_runs/WP-I6-004/20260409_214611/UI-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-I6-004/20260409_214611/FUNC-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-I6-004/20260409_214611/COR-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-I6-004/20260409_214611/EXT-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-I6-004/20260409_214611/EXT-002.log`
- Screenshots/Exports: `.product/build_target/tool_artifacts/wp_runs/WP-I6-004/20260409_214611/visual_proof/settings_local_probe.png`; `.product/build_target/tool_artifacts/wp_runs/WP-I6-004/20260409_214611/visual_proof/assistant_local_probe.png`
- Build Artifacts: `.product/build_target/tool_artifacts/wp_runs/WP-I6-004/20260409_214611/visual_proof/bridge_health.json`; `.product/build_target/tool_artifacts/wp_runs/WP-I6-004/20260409_214611/visual_proof/bridge_state_settings.json`; `.product/build_target/tool_artifacts/wp_runs/WP-I6-004/20260409_214611/visual_proof/bridge_state_assistant.json`; `.product/build_target/tool_artifacts/wp_runs/WP-I6-004/20260409_214611/visual_proof/recorder_state_seeded_probe.json`; `.product/build_target/tool_artifacts/wp_runs/WP-I6-004/20260409_214611/visual_proof/recorder_state_before_probe_seed.json`; `.product/build_target/tool_artifacts/wp_runs/WP-I6-004/20260409_214611/visual_proof/tauri_dev_seeded_stdout.log`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/visual_proof/bridge_action_probe.json`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/visual_proof/settings_after_probe_clean.png`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/visual_proof/assistant_after_probe_clean.png`
- Proof Artifact: `.product/build_target/tool_artifacts/wp_runs/WP-I6-004/20260409_214611/`
- User Sign-off:

## Progress Log

- 2026-04-09: WP scaffold created via `.gov/repo_scripts/new_work_packet.ps1`.
- 2026-04-09: Scope refined to add a dedicated in-app local-runtime probe, persisted verification state, and bridge-based visual proof for the governed AI settings/assistant surface.
- 2026-04-09: Implemented the in-app probe seam across `App.tsx`, `backend.ts`, `aiGateway.ts`, and `src-tauri/src/lib.rs`, including persisted latest-probe state and truthful success/failure/unavailable/simulated rendering.
- 2026-04-09: Verification passed across `src/features/i6/i6.test.ts`, `src/lib/backend.test.ts`, `src/App.test.tsx`, `cargo test`, `pnpm build`, and `check-WP-I6-004.ps1`.
- 2026-04-09: Captured live bridge/debugger proof for the settings and assistant surfaces after temporarily seeding a successful `latestLocalRuntimeProbe` into desktop recorder state, then restored the original recorder-state file to leave operator state unchanged.
- 2026-04-09: Successor `WP-GOV-BRIDGE-002` retired the seeded-state screenshot limitation by adding a live `/agent/action` bridge path and capturing real probe-driven settings/assistant proof under `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/`.
