# TS-WP-GOV-BRIDGE-002 - Spec vs Code Test Suite

Date Opened: 2026-04-09
Status: EXECUTED
Linked Work Packet: WP-GOV-BRIDGE-002
Iteration: All

## Scope

Validate that the governed desktop bridge can execute approved named actions, return structured completion results, and produce truthful live UI proof without keyboard/mouse simulation or seeded recorder-state shortcuts.

## Inputs

- Linked requirements: REQ-0013, REQ-0019, REQ-0020
- Linked primitives: PRIM-0075
- Linked components: `.product/Worktrees/wt_main/src/App.tsx`, `.product/Worktrees/wt_main/src/App.test.tsx`, `.product/Worktrees/wt_main/src-tauri/src/lib.rs`, `PROJECT_CODEX.md`, `AGENTS.md`, `MODEL_BEHAVIOR.md`

## Reality Boundary Assertions

- Packet Class: IMPLEMENTATION
- Real Seam: The localhost bridge can invoke approved named UI actions and await structured completion from the real frontend.
- Proof Target: `probe-local-runtime` runs through `/agent/action`, updates the live UI, and is captured by bridge-driven snapshots without seeded recorder state.
- Allowed Fallbacks: The action catalog stays narrow and explicit; generic DOM/click automation remains out of scope.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to `E2E-VERIFIED`.

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0019 | PRIM-0075 | Dependency | governed packet loop | `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-BRIDGE-002.ps1` | linked WP artifacts and governance checks stay synchronized |
| UI-001 | REQ-0013 | PRIM-0075 | UI Contract | settings + assistant probe surfaces | `pnpm exec vitest run src/App.test.tsx --reporter=verbose` | bridge-triggered probe results render truthfully in both probe surfaces |
| FUNC-001 | REQ-0013 | PRIM-0075 | Functionality | bridge action flow | live localhost `POST /agent/action` + navigate/snapshot proof | approved action completes and returns structured result without seeded state |
| COR-001 | REQ-0020 | PRIM-0075 | Code Correctness | frontend/backend bridge contract | `cargo test --manifest-path .product/Worktrees/wt_main/src-tauri/Cargo.toml`; `pnpm exec vitest run src/App.test.tsx --reporter=verbose` | action transport and frontend registry stay regression-covered |
| RED-001 | REQ-0013 | PRIM-0075 | Red Team / Abuse | unsupported or invalid actions | live bridge bad-action request + regression assertions | invalid action IDs fail cleanly without falling back to generic automation |
| EXT-001 | REQ-0020 | PRIM-0075 | Additional | timeout/recovery/visual proof | live desktop bridge run + snapshot artifacts | timeouts are bounded and proof artifacts capture the real post-action state |

## Dependency and Environment Tests

- [x] Governance preflight
- [x] Running Tauri desktop app with bridge port file present
- [x] Local runtime probe target available for live proof

## UI Contract Tests

- [x] Settings probe card updates after bridge action
- [x] Assistant probe summary reflects the same result
- [x] Failure copy stays truthful if the probe fails

## Functional Flow Tests

- [x] Navigate to settings over bridge
- [x] Run `probe-local-runtime` over bridge action
- [x] Capture post-probe settings and assistant snapshots

## Code Correctness Tests

- [x] Frontend regression tests
- [x] Rust tests
- [x] Production build

## Red-Team and Abuse Tests

- [x] Non-goal enforcement (spec section 3.2)
- [x] Unsupported action IDs return bounded errors
- [x] Bridge does not introduce keyboard/mouse simulation or arbitrary automation

## Additional Tests

- [x] Action timeout handling
- [x] Snapshot proof captured after real action execution
- [x] Recorder-state persistence remains intact

## Automation Hook

- Command: `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-BRIDGE-002.ps1`
- Artifacts: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/`

## Execution Summary

- Last Run Date: 2026-04-09
- Result: PASS for implementation-grade verification
- Blocking Failures: None after the bridge action seam, live state-report fix, and local-runtime output sanitization landed
- Evidence Paths: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/summary.md`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/notes.md`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/visual_proof/settings_before_probe_clean.png`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/visual_proof/settings_after_probe_clean.png`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/visual_proof/assistant_after_probe_clean.png`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/visual_proof/bridge_action_probe.json`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/visual_proof/bridge_action_unsupported.json`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/visual_proof/bridge_action_probe_timeout.json`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/visual_proof/bridge_health.json`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/visual_proof/bridge_state_after_probe.json`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/visual_proof/bridge_state_assistant.json`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_225418/summary.md`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_225418/result.json`
- What Became Real: the desktop bridge can now invoke approved named workflows through `/agent/action`, await structured completion through the Tauri/React seam, and capture truthful post-action UI proof without seeded state or input simulation.
- What Remains Simulated: browser/jsdom remains a non-desktop environment and cannot stand in for live bridge proof; arbitrary automation remains intentionally out of scope.
- Next Blocking Real Seam: No blocking seam remains for the current bridge-action scope; future named workflows should be added through successor packets instead of generic automation.
- Reviewer: Codex
- User Sign-off:
