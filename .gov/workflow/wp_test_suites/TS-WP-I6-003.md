# TS-WP-I6-003 - Spec vs Code Test Suite

Date Opened: 2026-04-09
Status: EXECUTED
Linked Work Packet: WP-I6-003
Iteration: I6

## Scope

Validate that `WP-I6-003` keeps the governed AI contract intact while adding truthful provider selection and a local executable-backed provider path.

## Inputs

- Linked requirements: REQ-0700, REQ-0701, REQ-0702, REQ-0703, REQ-0704, REQ-0705, REQ-0706, REQ-0707, REQ-0708
- Linked primitives: PRIM-0052
- Linked components: `.product/Worktrees/wt_main/src/App.tsx`; `.product/Worktrees/wt_main/src/App.test.tsx`; `.product/Worktrees/wt_main/src/contracts/i0.ts`; `.product/Worktrees/wt_main/src/features/i6/aiGateway.ts`; `.product/Worktrees/wt_main/src/features/i6/i6.test.ts`; `.product/Worktrees/wt_main/src/lib/backend.ts`; `.product/Worktrees/wt_main/src/lib/backend.test.ts`; `.product/Worktrees/wt_main/src-tauri/src/lib.rs`

## Reality Boundary Assertions

- Packet Class: IMPLEMENTATION
- Real Seam: provider selection persists independently from deployment profile, local runtime preferences persist through recorder restore/save, and the Tauri backend can resolve LM Studio/Ollama/custom local runtimes through the governed AI adapter.
- Proof Target: selector persistence, truthful degraded/live states, and the local-provider backend contract compile and regressions pass; desktop runtime evidence shows detected LM Studio state even when live local generation is not exercised.
- Allowed Fallbacks: browser/jsdom may stay `browser-simulated`; custom local provider may remain `tauri-unconfigured` until operator configuration exists; no fake provider readiness is allowed and broken screenshots are not treated as proof.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to `E2E-VERIFIED`.

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0700 | PRIM-0052 | Dependency | governed frontend and Tauri build graph | `pnpm install --frozen-lockfile`; `cargo test --manifest-path src-tauri/Cargo.toml` | dependencies resolve and the expanded provider seam compiles in the governed desktop runtime |
| UI-001 | REQ-0700, REQ-0701 | PRIM-0052 | UI Contract | provider selector, deployment profile labeling, and degraded states | `pnpm exec vitest run src/App.test.tsx --reporter=verbose` | deployment profile and AI provider are shown as separate controls, state persists, and degraded/local-unconfigured copy is truthful |
| FUNC-001 | REQ-0700, REQ-0701 | PRIM-0052 | Functionality | provider selection and analysis routing | `pnpm exec vitest run src/features/i6/i6.test.ts --reporter=verbose` | gateway analysis honors explicit provider choice, local-provider metadata is preserved, and simulated fallback remains explicit |
| COR-001 | REQ-0702, REQ-0703, REQ-0706, REQ-0707, REQ-0708 | PRIM-0052 | Code Correctness | backend and runtime contracts | `pnpm exec vitest run src/lib/backend.test.ts --reporter=verbose`; `cargo test --manifest-path src-tauri/Cargo.toml` | command/request normalization, provider resolution, and local-runtime contract invariants pass without exposing raw paths or weakening policy gates |
| RED-001 | REQ-0703, REQ-0707 | PRIM-0052 | Red Team / Abuse | prompt/path/runtime misuse | `pnpm exec vitest run src/features/i6/i6.test.ts --reporter=verbose`; `cargo test --manifest-path src-tauri/Cargo.toml` | path abuse, invalid provider selection, and unconfigured local-runtime requests are blocked truthfully |
| EXT-001 | REQ-0700..REQ-0708 | PRIM-0052 | Additional | production build plus governed packet proof | `pnpm build`; `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I6-003.ps1` | desktop build and official packet checks pass with linked proof artifacts |

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

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I6-003.ps1
- Artifacts: `.product/build_target/tool_artifacts/wp_runs/WP-I6-003/20260409_211100/`

## Execution Summary

- Last Run Date: 2026-04-09
- Result: PASS for implementation-grade verification
- Blocking Failures: None in App/I6/backend regressions, Rust tests, build, or governed WP checks
- Evidence Paths: `.product/build_target/tool_artifacts/wp_runs/WP-I6-003/20260409_211100/visual_proof/bridge_health.json`; `.product/build_target/tool_artifacts/wp_runs/WP-I6-003/20260409_211100/visual_proof/bridge_state.json`; `.product/build_target/tool_artifacts/wp_runs/WP-I6-003/20260409_211100/visual_proof/recorder_state_local_provider.json`; `.product/build_target/tool_artifacts/wp_runs/WP-I6-003/20260409_211100/visual_proof/local_runtime_detection.txt`; `.product/build_target/tool_artifacts/wp_runs/WP-I6-003/20260409_211100/visual_proof/lmstudio_runtime_ls.txt`; `.product/build_target/tool_artifacts/wp_runs/WP-I6-003/20260409_211100/visual_proof/lmstudio_runtime_survey.txt`; `.product/build_target/tool_artifacts/wp_runs/WP-I6-003/20260409_211100/visual_proof/local_runtime_probe_success.txt`
- What Became Real: The desktop/runtime seam now keeps provider choice separate from deployment profile, persists local runtime preferences, and resolves LM Studio/Ollama/custom local runtimes through the governed adapter.
- What Remains Simulated: Browser/jsdom still uses simulated gateway output, and this packet still lacks a desktop in-app screenshot of a generated local-model result because the bridge PNG capture path timed out on this machine. The LM Studio Gemma 4 runtime itself was exercised successfully.
- Next Blocking Real Seam: Desktop-triggered governed local-model generation artifact capture from within the app plus a cleaner bridge PNG capture path if the current desktop snapshot timeout requires a governed follow-on fix.
- Reviewer: Codex
- User Sign-off: Pending
