# TS-WP-I0-003 - Spec vs Code Test Suite

Date Opened: 2026-03-06
Status: E2E-VERIFIED
Linked Work Packet: WP-I0-003
Iteration: I0

## Scope

Validate the governed PostgreSQL/PostGIS control plane, immutable artifact-store registry, and context time-range query backbone required for downstream runtime packets.

## Inputs

- Linked requirements: REQ-0017, REQ-0018, REQ-0108, REQ-0109, REQ-0110, REQ-0111, REQ-0810
- Linked primitives: PRIM-0042, PRIM-0043, PRIM-0044
- Linked components: .gov/repo_scripts/run_wp_checks.ps1; .gov/repo_scripts/validate_wp_i0_runtime_proof.ps1; .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src/lib/backend.test.ts; .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src-tauri/src/lib.rs

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0017 | PRIM-0042 | Dependency | governance + runtime prerequisites | `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1`; `pnpm install --frozen-lockfile`; PostGIS container prep via `.gov/repo_scripts/run_wp_checks.ps1` | governance assets resolve, dependencies install cleanly, and PostgreSQL/PostGIS is ready for packet proof |
| UI-001 | REQ-0109 | PRIM-0042 | UI Contract | governed desktop runtime shell | `pnpm smoke:runtime -- --artifact-root <WP artifact>/runtime_smoke` with `STRATATLAS_CONTROL_PLANE_DSN` and packet schema env vars | cold/warm Tauri smoke passes while persisting to PostgreSQL/PostGIS-backed control-plane tables |
| FUNC-001 | REQ-0110 | PRIM-0043 | Functionality | artifact proof export and bundle persistence | `.gov/repo_scripts/validate_wp_i0_runtime_proof.ps1` via `.gov/workflow/wp_checks/check-WP-I0-003.ps1` | runtime proof exports include control-plane state, audit ledger, recorder state, bundle artifacts, and populated bundle registry rows |
| FUNC-002 | REQ-0810 | PRIM-0044 | Functionality | live time-range query backbone | `cargo test --manifest-path src-tauri/Cargo.toml live_control_plane_query_roundtrip -- --ignored --nocapture` with packet schema env vars | live PostgreSQL-backed context records are persisted and returned by time-range query filtering |
| COR-001 | REQ-0111 | PRIM-0042 | Code Correctness | deployment profile and fallback contracts | `pnpm test`; `cargo test --manifest-path src-tauri/Cargo.toml` | deployment-profile, control-plane, and fallback contracts compile and regressions pass |
| RED-001 | REQ-0017 | PRIM-0042 | Red Team / Abuse | safety boundaries and path guardrails | `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/red_team_guardrail_check.ps1 -CodeRoot .product/Worktrees/wt_main -OutputJsonPath <WP artifact>/red_team_result.json` | prohibited workflows remain blocked and no unsafe path-handling regressions are introduced |
| EXT-001 | REQ-0108 | PRIM-0042 | Additional | offline/runtime stability | `pnpm lint`; `pnpm build`; governed runtime smoke bundle reopen flow | offline-open and degraded-state bundle flows remain stable while the governed backend is enabled |

## Dependency and Environment Tests

- [x] Governance preflight and linked packet assets resolved cleanly
- [x] Runtime dependency install completed with the frozen lockfile
- [x] PostgreSQL/PostGIS verification container and schema provisioning passed

## UI Contract Tests

- [x] Required regions
- [x] Required modes/states
- [x] Error and degraded-state UX

## Functional Flow Tests

- [x] Golden bundle create/open/reopen flow
- [x] Artifact proof export validation
- [x] Live time-range query roundtrip against PostgreSQL/PostGIS

## Code Correctness Tests

- [x] Unit tests
- [x] Integration tests
- [x] Static checks (lint/type/schema)

## Red-Team and Abuse Tests

- [x] Non-goal enforcement (spec section 3.2)
- [x] Policy bypass attempts
- [x] Invalid input and path abuse cases

## Additional Tests

- [x] Offline behavior under governed persistence
- [x] Reliability/recovery checks through cold and warm runtime smoke
- [x] Append-only bundle supersedes link verified in the live Rust/PostgreSQL integration test
- [ ] macOS smoke execution remains a downstream portability obligation under REQ-0018

## Automation Hook

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I0-003.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I0-003/

## Execution Summary

- Last Run Date: Artifact path `.product/build_target/tool_artifacts/wp_runs/WP-I0-003/20260307_021247/`
- Result: PASSING `E2E-VERIFIED` closeout with governed runtime smoke, runtime proof export validation, full functional regression, lint, build, Rust unit checks, and live PostgreSQL/PostGIS query verification
- Blocking Failures:
- Evidence Paths: `.product/build_target/tool_artifacts/wp_runs/WP-I0-003/20260307_021247/result.json`; `.product/build_target/tool_artifacts/wp_runs/WP-I0-003/20260307_021247/summary.md`; `.product/build_target/tool_artifacts/wp_runs/WP-I0-003/20260307_021247/runtime_smoke/runtime_smoke_summary.json`; `.product/build_target/tool_artifacts/wp_runs/WP-I0-003/20260307_021247/runtime_smoke/runtime_smoke_summary.md`; `.product/build_target/tool_artifacts/wp_runs/WP-I0-003/20260307_021247/runtime_smoke/cold/runtime_proof/control_plane_state.json`; `.product/build_target/tool_artifacts/wp_runs/WP-I0-003/20260307_021247/runtime_smoke/warm/runtime_proof/control_plane_state.json`
- Reviewer:
- User Sign-off: Approved via 2026-03-07 instruction to execute `WP-I0-003`
