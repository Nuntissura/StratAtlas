# TS-WP-I8-002 - Spec vs Code Test Suite

Date Opened: 2026-03-06
Status: E2E-VERIFIED
Linked Work Packet: WP-I8-002
Iteration: I8

## Scope

Validate that I8 moves deviation detection from manual/scaffold inputs to governed historical context-series analytics with deterministic propagation into replay, scenario, and map-linked outputs.

## Inputs

- Linked requirements: REQ-0900, REQ-0901, REQ-0902, REQ-0903, REQ-0904
- Linked primitives: PRIM-0062
- Linked components: .product/Worktrees/wt_main/src/features/i8/deviation.ts; .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/features/i1/runtime/mapRuntimeScene.ts; .product/Worktrees/wt_main/src/contracts/i0.ts

## Reality Boundary Assertions

- Packet Class: IMPLEMENTATION
- Real Seam: the primary deviation path must derive baseline and observed windows directly from governed context records for the active AOI/domain, not from unlabeled hand-entered numeric strings.
- Proof Target: `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I8-002.ps1` with deterministic replay evidence under `.product/build_target/tool_artifacts/wp_runs/WP-I8-002/`.
- Allowed Fallbacks: a labeled `manual override` path may remain during implementation; seeded or hidden simulated deviation flows are not allowed.
- Promotion Guard: packet remains closed only while governed detection, bundle replay, and downstream propagation continue to be exercised by the recorded proof path.

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0900 | PRIM-0062 | Dependency | governed context + deviation runtime graph | `pnpm lint` | I8 runtime changes stay dependency-clean and policy-compliant |
| UI-001 | REQ-0900, REQ-0903 | PRIM-0062 | UI Contract | deviation workspace and event card | `pnpm test -- --run src/App.test.tsx` | governed baseline/observed windows, labels, and degraded states render correctly |
| FUNC-001 | REQ-0900, REQ-0901, REQ-0902, REQ-0904 | PRIM-0062 | Functionality | governed deviation golden flow | `pnpm test -- --run src/App.test.tsx` | selecting a governed domain emits deterministic deviation outputs and scenario propagation hooks |
| COR-001 | REQ-0900, REQ-0901, REQ-0902, REQ-0903 | PRIM-0062 | Code Correctness | i8 analytics contracts | `pnpm test -- --run src/features/i8/i8.test.ts` | window selection, baseline references, event taxonomy, and replay safety remain deterministic |
| RED-001 | REQ-0903, REQ-0904 | PRIM-0062 | Red Team / Abuse | misuse boundaries | `pnpm test -- --run src/App.test.tsx` | derived context events stay labeled derived/aggregate and do not imply direct observation or misuse semantics |
| EXT-001 | REQ-0900, REQ-0903 | PRIM-0062 | Additional | replay/build reliability | `pnpm build` | packet ships without breaking bundle/reopen or runtime build integrity |

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

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I8-002.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I8-002/

## Execution Summary

- Last Run Date: 2026-03-08
- Result: PASSING `E2E-VERIFIED` closeout via `check-WP-I8-002.ps1` with governed cold/warm runtime smoke, full functional regression, lint, template compliance, red-team guardrail checks, build, and Rust unit tests.
- Blocking Failures: None.
- Evidence Paths: `.product/build_target/tool_artifacts/wp_runs/WP-I8-002/20260308_154423/`; cold/warm runtime smoke under `.product/build_target/tool_artifacts/wp_runs/WP-I8-002/20260308_154423/runtime_smoke/`.
- What Became Real: governed deviation events now derive from persisted context history, survive bundle reopen, project into the map surface, and apply deviation-linked `constraint_node` suggestions into scenario forks.
- What Remains Simulated: the labeled `manual override` path remains as an explicit analyst fallback only.
- Next Blocking Real Seam: `WP-I9-002` must consume the standardized governed deviation outputs for aggregate-only alert evaluation.
- Reviewer:
- User Sign-off:
