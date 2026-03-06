# TS-WP-GOV-INSTALLER-002 - Spec vs Code Test Suite

Date Opened: 2026-03-06
Status: PLANNED
Linked Work Packet: WP-GOV-INSTALLER-002
Iteration: All

## Scope

Validate release-surface alignment for the governed Windows desktop build after manifest and documentation cleanup.

## Inputs

- Linked requirements: REQ-0017, REQ-0029, REQ-0030, REQ-0031
- Linked primitives: PRIM-0024, PRIM-0028
- Linked components: .product/Worktrees/wt_main/README.md; .product/Worktrees/wt_main/package.json; .product/Worktrees/wt_main/src-tauri/Cargo.toml; .product/Worktrees/wt_main/src-tauri/tauri.conf.json; .product/Worktrees/wt_main/docs/INSTALLER_LIFECYCLE.md; .gov/repo_scripts/build_windows_installer.ps1

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0030, REQ-0031 | PRIM-0024, PRIM-0028 | Dependency | desktop release prerequisites | `pnpm install --frozen-lockfile` in `.product/Worktrees/wt_main` | dependencies resolve without drift before rebuilding the release kit |
| UI-001 | REQ-0029 | PRIM-0028 | UI Contract | operator-facing release documentation | manual review of `.product/Worktrees/wt_main/README.md` and `docs/INSTALLER_LIFECYCLE.md` | checked-in operator docs describe the same governed build and lifecycle flow as the release kit |
| FUNC-001 | REQ-0030, REQ-0031 | PRIM-0024, PRIM-0028 | Functionality | canonical installer kit build | `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/build_windows_installer.ps1` | installer kit is generated with matching EXE/installer version metadata and fresh manifest evidence |
| COR-001 | REQ-0017, REQ-0030, REQ-0031 | PRIM-0024 | Code Correctness | manifest version parity | compare `.product/Worktrees/wt_main/package.json`, `src-tauri/Cargo.toml`, and `src-tauri/tauri.conf.json` plus `cargo test` in `src-tauri` | version-bearing inputs and Rust-side contract checks are aligned |
| RED-001 | REQ-0017 | PRIM-0024 | Red Team / Abuse | raw-path and platform-assumption regressions | `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/red_team_guardrail_check.ps1` | release-surface cleanup does not introduce hard-coded unsafe runtime assumptions |
| EXT-001 | REQ-0029..REQ-0031 | PRIM-0028 | Additional | full desktop verification | `pnpm lint`; `pnpm test`; `pnpm build`; `pnpm tauri:build` | desktop build/test outputs remain green after version/doc alignment |

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

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-INSTALLER-002.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-GOV-INSTALLER-002/

## Execution Summary

- Last Run Date:
- Result:
- Blocking Failures:
- Evidence Paths:
- Reviewer:
- User Sign-off:
