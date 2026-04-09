# TS-WP-GOV-BRIDGE-001 - Spec vs Code Test Suite

Date Opened: 2026-04-09
Status: EXECUTED
Linked Work Packet: WP-GOV-BRIDGE-001
Iteration: All

## Scope

Validate that the headless agent bridge routes real shell navigation targets, reports truthful bridge state, and remains governed by packet-level evidence.

## Inputs

- Linked requirements: REQ-0013, REQ-0019, REQ-0020
- Linked primitives: PRIM-0071
- Linked components: `.product/Worktrees/wt_main/src/App.tsx`, `.product/Worktrees/wt_main/src-tauri/src/lib.rs`, `AGENTS.md`

## Reality Boundary Assertions

- Packet Class: IMPLEMENTATION
- Real Seam: Localhost bridge server plus frontend navigation/state reporting.
- Proof Target: Structured `/agent/state` payload, real panel alias routing, port file discovery, and snapshot handoff path.
- Allowed Fallbacks: Snapshot fidelity still inherits DOM-only capture limitations from the debugger packet.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to `E2E-VERIFIED`.

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0019 | PRIM-0071 | Dependency | Governance and repo integrity | `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1` | Governance checks pass before implementation evidence is recorded. |
| UI-001 | REQ-0013 | PRIM-0071 | UI Contract | App shell integration | `pnpm exec vitest run src/App.test.tsx --reporter=verbose` | Existing shell behavior still passes after bridge wiring. |
| FUNC-001 | REQ-0020 | PRIM-0071 | Functionality | Frontend/backend integration | `pnpm build` | TypeScript compilation and production bundling succeed with bridge code present. |
| COR-001 | REQ-0020 | PRIM-0071 | Code Correctness | Rust bridge contracts | `cargo test --manifest-path src-tauri/Cargo.toml` | Rust unit tests pass and the bridge state response compiles cleanly. |
| RED-001 | REQ-0019 | PRIM-0071 | Red Team / Abuse | Governed packet enforcement | `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-BRIDGE-001.ps1` | WP runner passes and records governed proof artifacts. |
| EXT-001 | REQ-0013 | PRIM-0071 | Additional | Static quality gate | `pnpm lint` | Frontend code passes lint with no new violations. |

## Dependency and Environment Tests

- [x] Governance preflight
- [x] Runtime dependency resolution through production build
- [ ] Live desktop bridge reachability and curl proof

## UI Contract Tests

- [x] Existing app shell tests still pass
- [ ] Live desktop bridge smoke captured through the running app

## Functional Flow Tests

- [x] Bridge state wiring compiles across frontend and backend
- [x] Panel alias routing and map-mode alias routing are implemented
- [ ] Curl-based live bridge proof against a running desktop session

## Code Correctness Tests

- [x] Frontend test suite
- [x] Rust unit tests
- [x] Lint

## Red-Team and Abuse Tests

- [x] Governed WP runner
- [x] Listener remains localhost-only

## Additional Tests

- [x] Production build
- [ ] Live desktop evidence capture

## Automation Hook

- Command: `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-BRIDGE-001.ps1`
- Artifacts: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-001/20260409_044342/`

## Execution Summary

- Last Run Date: 2026-04-09
- Result: PASS for implementation-grade verification
- Blocking Failures: None in build, lint, Rust tests, frontend tests, or governed WP checks
- Evidence Paths: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-001/20260409_044342/summary.md`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-001/20260409_044342/result.json`
- What Became Real: The bridge now reports structured shell state, routes real panel aliases, and exposes a focus-safe navigation hook across frontend and backend.
- What Remains Simulated: No live desktop curl-driven proof bundle was captured in this pass, and snapshots still inherit DOM-only capture limits.
- Next Blocking Real Seam: Run a live desktop bridge smoke pass and obtain user sign-off before any `E2E-VERIFIED` promotion.
- Reviewer: Codex
- User Sign-off: Pending
