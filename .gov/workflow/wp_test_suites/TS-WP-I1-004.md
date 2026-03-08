# TS-WP-I1-004 - Spec vs Code Test Suite

Date Opened: 2026-03-08
Status: IN-PROGRESS
Linked Work Packet: WP-I1-004
Iteration: I1

## Scope

Validate WP delivery against linked requirements and primitives.

## Inputs

- Linked requirements: GATE-E, REQ-0014, REQ-0015, REQ-0016, REQ-0206, REQ-0207, REQ-0208, REQ-0209, REQ-0210, REQ-0212
- Linked primitives: PRIM-0047, PRIM-0067, PRIM-0068
- Linked components: `.product/Worktrees/wt_main/src/App.tsx`, `.product/Worktrees/wt_main/src/features/i1/components/MapRuntimeSurface.tsx`, `.product/Worktrees/wt_main/src/features/i1/runtime/mapRuntimeTelemetry.ts`, `.product/Worktrees/wt_main/src/lib/runtimeSmoke.ts`, `.product/Worktrees/wt_main/scripts/runtime-smoke.mjs`, `.product/Worktrees/wt_main/src-tauri/src/lib.rs`

## Reality Boundary Assertions

- Packet Class: IMPLEMENTATION
- Real Seam: The governed runtime must emit reference-hardware startup, interaction, scrub, and export timings while the live map/overlay controls satisfy keyboard and non-color accessibility expectations.
- Proof Target: `check-WP-I1-004.ps1` plus packet-specific cold/warm Tauri smoke artifacts, timed export artifacts, and accessibility regression coverage under `.product/build_target/tool_artifacts/wp_runs/WP-I1-004/`.
- Allowed Fallbacks: Earlier smoke-based timing summaries and jsdom accessibility checks may guide implementation, but they are not promotable proof without packet-specific Tauri evidence.
- Promotion Guard: Do not promote Gate E or the linked requirements unless timing evidence and accessibility assertions pass in the governed runtime.

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | GATE-E, REQ-0014, REQ-0015, REQ-0016 | PRIM-0067 | Dependency | governance/runtime readiness | `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1` | Packet prerequisites and runtime hooks are present before timing proof runs. |
| UI-001 | REQ-0212 | PRIM-0068 | UI Contract | map controls and overlay semantics | `pnpm exec vitest run src/features/i1/i1.test.ts src/App.test.tsx` | Keyboard-reachable controls and non-color-only labels pass regression coverage. |
| FUNC-001 | REQ-0209, REQ-0210 | PRIM-0047, PRIM-0067 | Functionality | timed export flows | `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-004.ps1` | 4K and briefing export flows emit artifact-backed duration evidence and deterministic reopen state. |
| COR-001 | REQ-0014, REQ-0015, REQ-0016, REQ-0206, REQ-0207, REQ-0208 | PRIM-0047, PRIM-0067 | Code Correctness | timing adapters and runtime contracts | `pnpm lint`, `pnpm test -- --run`, and `pnpm build` | Telemetry, runtime contracts, and regressions remain type-safe and green. |
| RED-001 | REQ-0212 | PRIM-0068 | Red Team / Abuse | policy/accessibility misuse | `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/red_team_guardrail_check.ps1 -CodeRoot .product/Worktrees/wt_main -OutputJsonPath .product/build_target/tool_artifacts/wp_runs/WP-I1-004/red_team_result.json` | Accessibility changes do not hide policy labels or enable disallowed output paths. |
| EXT-001 | GATE-E, REQ-0014, REQ-0015, REQ-0016, REQ-0206, REQ-0207, REQ-0208, REQ-0209, REQ-0210 | PRIM-0067 | Additional | reference-runtime budget proof | `pnpm smoke:runtime -- --wp-id WP-I1-004` | Cold/warm startup, interaction, scrub, and export timings are recorded in packet-specific runtime smoke artifacts. |

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

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-004.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I1-004/

## Execution Summary

- Last Run Date: 2026-03-08
- Result: Official packet proof now passes, and the packet remains `IN-PROGRESS` only because not all linked requirements are promotable yet.
- Blocking Failures: Warm startup still measures 3432 ms in the official warm smoke against the `REQ-0015` <= 3.0 s threshold, and `REQ-0206` still lacks a dedicated packet-grade 2D pan/zoom frame-time probe.
- Evidence Paths: `.product/build_target/tool_artifacts/wp_runs/WP-I1-004/20260308_211610/`; `pnpm exec vitest run src/App.test.tsx src/features/i1/i1.test.ts`; `pnpm lint`; `pnpm build`; `cargo test --manifest-path src-tauri/Cargo.toml --no-run`
- What Became Real: The governed runtime now produces real 4K export artifacts with persisted PNG/metadata proof, accessibility assertions pass in both tests and Tauri smoke, and planar restore plus export timings are attached to the packet evidence bundle.
- What Remains Simulated: No dedicated pan/zoom probe is attached to the packet yet, and warm startup remains above the normative threshold in the current dev-mode smoke evidence.
- Next Blocking Real Seam: Add explicit 2D pan/zoom timing capture and optimize or re-baseline warm startup-to-shell so Gate E can move from partial evidence to full promotion.
- Reviewer:
- User Sign-off:
