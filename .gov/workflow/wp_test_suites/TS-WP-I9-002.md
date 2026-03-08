# TS-WP-I9-002 - Spec vs Code Test Suite

Date Opened: 2026-03-06
Status: E2E-VERIFIED
Linked Work Packet: WP-I9-002
Iteration: I9

## Scope

Validate that I9 moves from manual-first OSINT entry and static feed simulation toward governed connector-backed aggregate alert generation over approved context and deviation state.

## Inputs

- Linked requirements: REQ-1000, REQ-1001, REQ-1002, REQ-1003
- Linked primitives: PRIM-0056, PRIM-0057
- Linked components: .product/Worktrees/wt_main/src/features/i9/osint.ts; .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/App.test.tsx

## Reality Boundary Assertions

- Packet Class: IMPLEMENTATION
- Real Seam: the primary I9 path must execute a governed connector that materializes aggregate AOI alerts from approved connector templates plus governed context/deviation state.
- Proof Target: `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I9-002.ps1` with packet-proof artifacts under `.product/build_target/tool_artifacts/wp_runs/WP-I9-002/`.
- Allowed Fallbacks: packaged governed connector templates and labeled `manual_override` analyst entry may remain during implementation; hidden simulated or unlabeled manual-first behavior is not allowed.
- Promotion Guard: packet remains closed only while the recorded proof continues to exercise the governed connector, bundle/reopen, and runtime-map validation path.

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-1000 | PRIM-0056 | Dependency | governed connector dependency graph | `pnpm lint` | I9 runtime changes stay dependency-clean and policy-compliant |
| UI-001 | REQ-1001, REQ-1002 | PRIM-0056, PRIM-0057 | UI Contract | I9 OSINT workspace | `pnpm test -- --run src/App.test.tsx` | governed connector controls, labels, and degraded/fallback states render correctly |
| FUNC-001 | REQ-1000, REQ-1001, REQ-1002, REQ-1003 | PRIM-0056, PRIM-0057 | Functionality | governed connector golden flow | `pnpm test -- --run src/App.test.tsx` | approved connector produces aggregate-only AOI alerts, threshold refs, and bundle restore integrity |
| COR-001 | REQ-1000, REQ-1001, REQ-1002, REQ-1003 | PRIM-0056, PRIM-0057 | Code Correctness | i9 connector and alert contracts | `pnpm test -- --run src/features/i9/i9.test.ts src/lib/backend.test.ts` | connector execution, provenance, source-mode state, and replay-safe normalization remain deterministic |
| RED-001 | REQ-1001, REQ-1002 | PRIM-0057 | Red Team / Abuse | misuse boundary enforcement | `pnpm test -- --run src/features/i9/i9.test.ts src/App.test.tsx` | alerts remain aggregate-only, verified/alleged labeling persists, and entity-pursuit semantics remain blocked |
| EXT-001 | REQ-1000, REQ-1003 | PRIM-0056, PRIM-0057 | Additional | build and bundle integrity | `pnpm build` | packet ships without breaking bundle/reopen or runtime build integrity |

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

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I9-002.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I9-002/

## Execution Summary

- Last Run Date: 2026-03-08
- Result: PASSING `E2E-VERIFIED` closeout via `check-WP-I9-002.ps1` with governed cold/warm runtime smoke, full functional regression, lint, template compliance, red-team guardrail checks, build, and Rust unit tests.
- Blocking Failures: None.
- Evidence Paths: `.product/build_target/tool_artifacts/wp_runs/WP-I9-002/20260308_170238/`; cold/warm runtime smoke under `.product/build_target/tool_artifacts/wp_runs/WP-I9-002/20260308_170238/runtime_smoke/`.
- What Became Real: governed connectors now materialize aggregate AOI alerts from approved connector templates and governed context/deviation state, and the App treats that path as the primary I9 workflow.
- What Remains Simulated: live remote connector pulls are still replaced by packaged approved templates; `manual_override` remains as an explicit analyst fallback.
- Next Blocking Real Seam: `WP-I10-002` must consume the proved I9 alert outputs inside the solver-backed modeling runtime.
- Reviewer:
- User Sign-off:
