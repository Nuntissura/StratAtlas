# TS-WP-GOV-BRIDGE-002 - Spec vs Code Test Suite

Date Opened: 2026-04-09
Status: IN-PROGRESS
Linked Work Packet: WP-GOV-BRIDGE-002
Iteration: All

## Scope

Validate WP delivery against linked requirements and primitives.

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
- [ ] Running Tauri desktop app with bridge port file present
- [ ] Local runtime probe target available for live proof

## UI Contract Tests

- [ ] Settings probe card updates after bridge action
- [ ] Assistant probe summary reflects the same result
- [ ] Failure copy stays truthful if the probe fails

## Functional Flow Tests

- [ ] Navigate to settings over bridge
- [ ] Run `probe-local-runtime` over bridge action
- [ ] Capture post-probe settings and assistant snapshots

## Code Correctness Tests

- [ ] Frontend regression tests
- [ ] Rust tests
- [ ] Production build

## Red-Team and Abuse Tests

- [ ] Non-goal enforcement (spec section 3.2)
- [ ] Unsupported action IDs return bounded errors
- [ ] Bridge does not introduce keyboard/mouse simulation or arbitrary automation

## Additional Tests

- [ ] Action timeout handling
- [ ] Snapshot proof captured after real action execution
- [ ] Recorder-state persistence remains intact

## Automation Hook

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-BRIDGE-002.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/

## Execution Summary

- Last Run Date:
- Result:
- Blocking Failures:
- Evidence Paths:
- What Became Real:
- What Remains Simulated:
- Next Blocking Real Seam:
- Reviewer:
- User Sign-off:
