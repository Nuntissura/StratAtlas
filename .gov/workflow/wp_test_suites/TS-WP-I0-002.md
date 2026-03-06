# TS-WP-I0-002 - Spec vs Code Test Suite

Date Opened: 2026-03-06
Status: IN-PROGRESS
Linked Work Packet: WP-I0-002
Iteration: I0

## Scope

Validate WP delivery against linked requirements and primitives.

## Inputs

- Linked requirements: REQ-0008, REQ-0009, REQ-0010, REQ-0101..REQ-0112, REQ-0808
- Linked primitives: PRIM-0032, PRIM-0033, PRIM-0034
- Linked components: .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src/lib/backend.test.ts; .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src-tauri/src/lib.rs

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0101 | PRIM-0032 | Dependency | backend/runtime dependencies | `pnpm install --frozen-lockfile` in `.product/Worktrees/wt_main` | dependencies resolve without lock drift |
| UI-001 | REQ-0105, REQ-0808 | PRIM-0034 | UI Contract | bundle/context state restoration | `pnpm exec vitest run src/App.test.tsx` | bundle open restores persisted recorder/context state through the UI |
| FUNC-001 | REQ-0101..REQ-0112, REQ-0808 | PRIM-0032, PRIM-0033, PRIM-0034 | Functionality | recorder golden flow | `pnpm exec vitest run src/lib/backend.test.ts src/App.test.tsx` | bundle create/open and context snapshot capture pass deterministically |
| COR-001 | REQ-0008, REQ-0009, REQ-0010 | PRIM-0032, PRIM-0033 | Code Correctness | backend and native recorder contracts | `cargo test --manifest-path src-tauri/Cargo.toml` and full WP runner | hashes, audit chain, and persisted store invariants pass |
| RED-001 | REQ-0010 | PRIM-0033 | Red Team / Abuse | path and manifest abuse | `.gov/repo_scripts/red_team_guardrail_check.ps1` plus recorder tests | no path/raw-file regression or unsafe addressing path is introduced |
| EXT-001 | REQ-0112 | PRIM-0032 | Additional | build and reliability | `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I0-002.ps1` | lint/build/tests pass with proof artifacts recorded |

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

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I0-002.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I0-002/

## Execution Summary

- Last Run Date:
- Result:
- Blocking Failures:
- Evidence Paths:
- Reviewer:
- User Sign-off:
