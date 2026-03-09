# TS-WP-GOV-PORT-002 - Spec vs Code Test Suite

Date Opened: 2026-03-08
Status: E2E-VERIFIED
Linked Work Packet: WP-GOV-PORT-002
Iteration: All

## Scope

Validate WP delivery against linked requirements and primitives.

## Inputs

- Linked requirements: GATE-H, REQ-0018
- Linked primitives: PRIM-0060, PRIM-0061, PRIM-0069
- Linked components: `.gov/workflow/wp_checks/check-WP-GOV-PORT-002.ps1`, `.gov/repo_scripts/run_wp_checks.ps1`, `.gov/repo_scripts/run_wp_gov_port_002.ps1`, `.github/workflows/wp-gov-port-002-macos-smoke.yml`, `.product/Worktrees/wt_main/scripts/runtime-smoke.mjs`, `.product/Worktrees/wt_main/src/lib/runtimeSmoke.ts`, `.product/Worktrees/wt_main/src-tauri/src/lib.rs`

## Reality Boundary Assertions

- Packet Class: VERIFICATION
- Real Seam: The governed runtime smoke harness must execute on macOS and record portable cold/warm artifacts for the same desktop flow class already proven on Windows.
- Proof Target: `check-WP-GOV-PORT-002.ps1` plus macOS runtime smoke artifacts and synchronized Gate H/REQ-0018 ledger evidence under `.product/build_target/tool_artifacts/wp_runs/WP-GOV-PORT-002/`.
- Allowed Fallbacks: None for portability proof. Windows-only smoke may remain part of ongoing development, but `REQ-0018` / `GATE-H` now rely on the hosted macOS packet artifacts.
- Promotion Guard: Do not promote `REQ-0018` or `GATE-H` without artifact-backed macOS execution evidence.

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0018, GATE-H | PRIM-0069 | Dependency | portability prerequisites | `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1` | Packet prerequisites and portability-safe path assumptions are current before macOS smoke runs. |
| UI-001 | REQ-0018 | PRIM-0060 | UI Contract | macOS interactive shell and degraded states | `pnpm smoke:runtime -- --wp-id WP-GOV-PORT-002` on macOS | The desktop runtime reaches the shell and preserves labeled degraded states on macOS. |
| FUNC-001 | GATE-H | PRIM-0060, PRIM-0069 | Functionality | packet-specific macOS smoke proof | `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-PORT-002.ps1` | The packet check dispatches a GitHub-hosted macOS smoke run when invoked from non-macOS hosts, then downloads cold/warm macOS artifacts and platform metadata under the packet proof path. |
| COR-001 | REQ-0018, GATE-H | PRIM-0061 | Code Correctness | ledger and runtime contract sync | `pnpm lint`, `pnpm test -- --run`, and `cargo test --manifest-path src-tauri/Cargo.toml` | Portability-safe runtime paths and governance ledgers stay aligned. |
| RED-001 | GATE-H | PRIM-0061 | Red Team / Abuse | evidence substitution and policy bypass | `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/red_team_guardrail_check.ps1 -CodeRoot .product/Worktrees/wt_main -OutputJsonPath .product/build_target/tool_artifacts/wp_runs/WP-GOV-PORT-002/red_team_result.json` | Windows-only or policy-bypassing evidence cannot masquerade as portability proof. |
| EXT-001 | GATE-H | PRIM-0069 | Additional | startup/recovery on macOS | `pnpm smoke:runtime -- --wp-id WP-GOV-PORT-002` plus packet artifact review on macOS | Startup and recovery artifacts on macOS are sufficient for Gate H promotion. |

## Dependency and Environment Tests

- [ ] Runtime dependency install/lock integrity
- [ ] Platform portability constraints checked
- [ ] Required services/adapters available

## UI Contract Tests

- [ ] Required regions
- [ ] Required modes/states
- [ ] Error and degraded-state UX

## Functional Flow Tests

- [ ] Golden flow
- [ ] Deterministic replay path
- [ ] Export/import or persistence flow

## Code Correctness Tests

- [ ] Unit tests
- [ ] Integration tests
- [ ] Static checks (lint/type/schema)

## Red-Team and Abuse Tests

- [ ] Non-goal enforcement (spec section 3.2)
- [ ] Policy bypass attempts
- [ ] Invalid input and path abuse cases

## Additional Tests

- [ ] Performance budget checks
- [ ] Offline behavior
- [ ] Accessibility/usability checks
- [ ] Reliability/recovery checks

## Automation Hook

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-PORT-002.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-GOV-PORT-002/

## Execution Summary

- Last Run Date: 2026-03-09
- Result: Passed (`Overall Passed: True`, `Failed Checks: 0`)
- Blocking Failures: None
- Evidence Paths: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-PORT-002/20260309_005735/`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-PORT-002/20260309_005735/runtime_smoke/cold/runtime_smoke_report.json`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-PORT-002/20260309_005735/runtime_smoke/warm/runtime_smoke_report.json`
- What Became Real: Hosted macOS smoke now executes the governed Tauri runtime, records cold/warm artifacts, and relays the proof back into the packet artifact path for Windows-based governance closeout.
- What Remains Simulated: None for Gate H portability proof.
- Next Blocking Real Seam: None. Packet is closed.
- Reviewer: Codex
- User Sign-off: Approved via 2026-03-08 instruction to repair the requirements ledger, finish `WP-I1-004`, and then run `WP-GOV-PORT-002`.
