# TS-WP-GOV-DEBUGGER-001 - Spec vs Code Test Suite

Date Opened: 2026-04-09
Status: EXECUTED
Linked Work Packet: WP-GOV-DEBUGGER-001
Iteration: All

## Scope

Validate that the visual-debugger snapshot seam is implemented, builds cleanly, and remains governed by packet-level evidence.

## Inputs

- Linked requirements: REQ-0013, REQ-0019, REQ-0020
- Linked primitives: PRIM-0071
- Linked components: `.product/Worktrees/wt_main/src/App.tsx`, `.product/Worktrees/wt_main/src-tauri/src/lib.rs`, `AGENTS.md`

## Reality Boundary Assertions

- Packet Class: IMPLEMENTATION
- Real Seam: Tauri snapshot persistence plus frontend hotkey and JS hook.
- Proof Target: App-data snapshot path contract plus successful frontend and Rust validation.
- Allowed Fallbacks: DOM-only capture may not exactly match GPU or compositor output.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to `E2E-VERIFIED`.

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0019 | PRIM-0071 | Dependency | Governance and repo integrity | `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1` | Governance checks pass before implementation evidence is recorded. |
| UI-001 | REQ-0013 | PRIM-0071 | UI Contract | App shell integration | `pnpm exec vitest run src/App.test.tsx --reporter=verbose` | Existing shell behavior still passes after debugger wiring. |
| FUNC-001 | REQ-0020 | PRIM-0071 | Functionality | Frontend/backend integration | `pnpm build` | TypeScript compilation and production bundling succeed with debugger code present. |
| COR-001 | REQ-0020 | PRIM-0071 | Code Correctness | Rust command contracts | `cargo test --manifest-path src-tauri/Cargo.toml` | Rust unit tests pass and snapshot path safety remains intact. |
| RED-001 | REQ-0019 | PRIM-0071 | Red Team / Abuse | Governed packet enforcement | `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-DEBUGGER-001.ps1` | WP runner passes and records governed proof artifacts. |
| EXT-001 | REQ-0013 | PRIM-0071 | Additional | Static quality gate | `pnpm lint` | Frontend code passes lint with no new violations. |

## Dependency and Environment Tests

- [x] Governance preflight
- [x] Runtime dependency resolution through production build
- [ ] Live desktop app-data snapshot write verified end to end

## UI Contract Tests

- [x] Existing app shell tests still pass
- [ ] Live desktop snapshot proof captured

## Functional Flow Tests

- [x] Snapshot seam compiles across frontend and backend
- [ ] Manual hotkey and JS-hook capture validated against a running desktop session

## Code Correctness Tests

- [x] Frontend test suite
- [x] Rust unit tests
- [x] Lint

## Red-Team and Abuse Tests

- [x] Governed WP runner
- [x] Path sanitization remains enforced

## Additional Tests

- [x] Production build
- [ ] Live desktop evidence capture

## Automation Hook

- Command: `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-DEBUGGER-001.ps1`
- Artifacts: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-DEBUGGER-001/20260409_044342/`

## Execution Summary

- Last Run Date: 2026-04-09
- Result: PASS for implementation-grade verification
- Blocking Failures: None in build, lint, Rust tests, frontend tests, or governed WP checks
- Evidence Paths: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-DEBUGGER-001/20260409_044342/summary.md`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-DEBUGGER-001/20260409_044342/result.json`
- What Became Real: The visual debugger snapshot seam is implemented and validated through the governed build/test path.
- What Remains Simulated: No live desktop snapshot proof bundle was captured in this pass, and html2canvas remains DOM-only.
- Next Blocking Real Seam: Capture live desktop snapshot evidence and obtain user sign-off before any `E2E-VERIFIED` promotion.
- Reviewer: Codex
- User Sign-off: Pending
