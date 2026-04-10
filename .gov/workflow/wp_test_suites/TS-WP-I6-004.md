# TS-WP-I6-004 - Spec vs Code Test Suite

Date Opened: 2026-04-09
Status: EXECUTED
Linked Work Packet: WP-I6-004
Iteration: I6

## Scope

Validate that the governed AI shell can execute and display a first-class local-runtime probe from inside StratAtlas without overstating readiness or weakening the audited provider boundary.

## Inputs

- Linked requirements: REQ-0700, REQ-0701, REQ-0702, REQ-0703, REQ-0704, REQ-0705, REQ-0706, REQ-0707, REQ-0708
- Linked primitives: PRIM-0052
- Linked components: `.product/Worktrees/wt_main/src/App.tsx`; `.product/Worktrees/wt_main/src/App.test.tsx`; `.product/Worktrees/wt_main/src/App.css`; `.product/Worktrees/wt_main/src/features/i6/aiGateway.ts`; `.product/Worktrees/wt_main/src/features/i6/i6.test.ts`; `.product/Worktrees/wt_main/src/lib/backend.ts`; `.product/Worktrees/wt_main/src/lib/backend.test.ts`; `.product/Worktrees/wt_main/src-tauri/src/lib.rs`

## Reality Boundary Assertions

- Packet Class: IMPLEMENTATION
- Real Seam: the desktop runtime exposes a dedicated local-provider probe command, the UI can trigger it and render its result, and the latest probe state persists through recorder restore.
- Proof Target: probe action/render/persistence tests pass, governed packet checks pass, and live bridge evidence captures the completed verification surface from the desktop app.
- Allowed Fallbacks: browser/jsdom may only show simulated or unavailable probe states; bridge state may supplement proof if screenshot capture fails, but cannot be mislabeled as a screenshot.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to `E2E-VERIFIED`.

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0700 | PRIM-0052 | Dependency | governed frontend and Tauri build graph | `pnpm install --frozen-lockfile`; `cargo test --manifest-path src-tauri/Cargo.toml` | dependency graph remains healthy and the expanded probe contract compiles cleanly |
| UI-001 | REQ-0700, REQ-0701, REQ-0704 | PRIM-0052 | UI Contract | settings and assistant probe surfaces | `pnpm exec vitest run src/App.test.tsx --reporter=verbose` | the probe action, latest-result summary, failure states, and restore behavior render truthfully |
| FUNC-001 | REQ-0700, REQ-0701, REQ-0702 | PRIM-0052 | Functionality | local-runtime probe state and gateway wiring | `pnpm exec vitest run src/features/i6/i6.test.ts --reporter=verbose` | bounded probe requests normalize correctly, simulated fallback stays explicit, and sanitized output is preserved |
| COR-001 | REQ-0702, REQ-0703, REQ-0705, REQ-0706, REQ-0707, REQ-0708 | PRIM-0052 | Code Correctness | backend and Tauri command contracts | `pnpm exec vitest run src/lib/backend.test.ts --reporter=verbose`; `cargo test --manifest-path src-tauri/Cargo.toml` | probe request/response contracts, local-runtime failure handling, and reasoning-tag sanitization invariants pass |
| RED-001 | REQ-0703, REQ-0707 | PRIM-0052 | Red Team / Abuse | probe misuse and unsafe output | `pnpm exec vitest run src/features/i6/i6.test.ts --reporter=verbose`; `cargo test --manifest-path src-tauri/Cargo.toml` | invalid runtime states, failing commands, and reasoning-tag leakage are blocked or surfaced truthfully |
| EXT-001 | REQ-0700..REQ-0708 | PRIM-0052 | Additional | production build and packet proof | `pnpm build`; `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I6-004.ps1` | official build/check flow passes and the live proof bundle contains bridge/debugger evidence of the probe surface |

## Dependency and Environment Tests

- [x] Runtime dependency install/lock integrity
- [ ] Platform portability constraints checked
- [x] Required services/adapters available

## UI Contract Tests

- [x] Required regions
- [x] Required modes/states
- [x] Error and degraded-state UX

## Functional Flow Tests

- [x] Golden flow
- [x] Deterministic replay path
- [x] Export/import or persistence flow

## Code Correctness Tests

- [x] Unit tests
- [x] Integration tests
- [x] Static checks (lint/type/schema)

## Red-Team and Abuse Tests

- [x] Non-goal enforcement (spec section 3.2)
- [x] Policy bypass attempts
- [x] Invalid input and path abuse cases

## Additional Tests

- [ ] Performance budget checks
- [ ] Offline behavior
- [x] Accessibility/usability checks
- [x] Reliability/recovery checks

## Automation Hook

- Command: `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I6-004.ps1`
- Artifacts: `.product/build_target/tool_artifacts/wp_runs/WP-I6-004/20260409_214611/`

## Execution Summary

- Last Run Date: 2026-04-09
- Result: PASS for implementation-grade verification
- Blocking Failures: None after the TypeScript fallback-constant compile miss was corrected and the governed build/check flow was rerun cleanly
- Evidence Paths: `.product/build_target/tool_artifacts/wp_runs/WP-I6-004/20260409_214611/summary.md`; `.product/build_target/tool_artifacts/wp_runs/WP-I6-004/20260409_214611/result.json`; `.product/build_target/tool_artifacts/wp_runs/WP-I6-004/20260409_214611/visual_proof/settings_local_probe.png`; `.product/build_target/tool_artifacts/wp_runs/WP-I6-004/20260409_214611/visual_proof/assistant_local_probe.png`; `.product/build_target/tool_artifacts/wp_runs/WP-I6-004/20260409_214611/visual_proof/bridge_health.json`; `.product/build_target/tool_artifacts/wp_runs/WP-I6-004/20260409_214611/visual_proof/bridge_state_settings.json`; `.product/build_target/tool_artifacts/wp_runs/WP-I6-004/20260409_214611/visual_proof/bridge_state_assistant.json`; `.product/build_target/tool_artifacts/wp_runs/WP-I6-004/20260409_214611/visual_proof/recorder_state_seeded_probe.json`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/visual_proof/bridge_action_probe.json`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/visual_proof/settings_after_probe_clean.png`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/20260409_224118/visual_proof/assistant_after_probe_clean.png`
- What Became Real: the governed desktop/runtime seam now supports an explicit local-runtime probe command, the UI can trigger and persist the latest probe result, and the settings plus assistant surfaces render the completed verification state truthfully.
- What Remains Simulated: browser/jsdom still exposes only simulated/unavailable probe behavior; this packet's original proof bundle used a temporary seeded completed-probe recorder state, but the bridge limitation itself was later retired by successor `WP-GOV-BRIDGE-002`.
- Next Blocking Real Seam: No blocking seam remains for the in-app probe verification path; future follow-on work would be runtime remediation or richer benchmark-style probe suites, not bridge interaction.
- Reviewer: Codex
- User Sign-off:
