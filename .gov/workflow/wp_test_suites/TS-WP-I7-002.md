# TS-WP-I7-002 - Spec vs Code Test Suite

Date Opened: 2026-03-06
Status: E2E-VERIFIED
Linked Work Packet: WP-I7-002
Iteration: I7

## Scope

Validate WP delivery against linked requirements and primitives.

## Inputs

- Linked requirements: REQ-0800, REQ-0801, REQ-0802, REQ-0803, REQ-0804, REQ-0805, REQ-0806, REQ-0807, REQ-0808, REQ-0809, REQ-0810
- Linked primitives: PRIM-0054, PRIM-0055
- Linked components: .product/Worktrees/wt_main/src/features/i7/contextIntake.ts; .product/Worktrees/wt_main/src/features/i7/governedDomains.ts; .product/Worktrees/wt_main/src/App.tsx

## Reality Boundary Assertions

- Packet Class: IMPLEMENTATION
- Real Seam: approved context-domain registration now ingests governed packaged records instead of creating seeded runtime records in the UI.
- Proof Target: `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I7-002.ps1` with passing cold/warm Tauri runtime smoke artifacts under `.product/build_target/tool_artifacts/wp_runs/WP-I7-002/20260308_060255/runtime_smoke/`.
- Allowed Fallbacks: packaged governed snapshots remain allowed as the governed source for this closed slice; live external connectors are future work and not part of this packet’s proof target.
- Promotion Guard: satisfied by the passing `.product/build_target/tool_artifacts/wp_runs/WP-I7-002/20260308_060255/` artifact bundle.

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0800 | PRIM-0054 | Dependency | governed frontend/runtime dependency graph | `pnpm lint` | build graph stays valid after governed catalog ingestion is introduced |
| UI-001 | REQ-0801, REQ-0805 | PRIM-0054 | UI Contract | context registration and metadata surfaces | `pnpm test -- --run src/App.test.tsx` | approved domains register with visible source/cadence/confidence/export metadata |
| FUNC-001 | REQ-0801, REQ-0802, REQ-0803, REQ-0808, REQ-0809 | PRIM-0054, PRIM-0055 | Functionality | governed context golden flow | `pnpm test -- --run src/App.test.tsx` | registration, query, OSINT thresholding, deviation, scenario use governed ingested records and bundle capture |
| COR-001 | REQ-0801, REQ-0802, REQ-0806, REQ-0807 | PRIM-0054, PRIM-0055 | Code Correctness | i7 module contracts | `pnpm test -- --run src/features/i7/i7.test.ts` | governed catalog materialization, correlation links, offline behavior, and query slicing stay deterministic |
| RED-001 | REQ-0803 | PRIM-0055 | Red Team / Abuse | correlation labeling and misuse boundaries | `pnpm test -- --run src/App.test.tsx` | context remains labeled correlated, not causal; aggregate-only downstream behavior remains intact |
| EXT-001 | REQ-0806, REQ-0807, REQ-0808 | PRIM-0054 | Additional | package/build reliability | `pnpm build` | governed catalog ingestion ships cleanly in the product bundle |

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

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I7-002.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I7-002/

## Execution Summary

- Last Run Date: 2026-03-08
- Result: Passed. `check-WP-I7-002.ps1` completed with `Overall Passed: True` and `Failed Checks: 0`.
- Blocking Failures: None.
- Evidence Paths: `.product/build_target/tool_artifacts/wp_runs/WP-I7-002/20260308_060255/summary.md`; `.product/build_target/tool_artifacts/wp_runs/WP-I7-002/20260308_060255/result.json`; `.product/build_target/tool_artifacts/wp_runs/WP-I7-002/20260308_060255/runtime_smoke/cold/runtime_smoke_report.json`; `.product/build_target/tool_artifacts/wp_runs/WP-I7-002/20260308_060255/runtime_smoke/warm/runtime_smoke_report.json`
- Reviewer: Codex
- User Sign-off: approved via 2026-03-08 instruction to continue `WP-I7-002` and complete the packet.

- What Became Real: App registration, correlation updates, recorder persistence, bundle capture, and bundle reopen now use governed catalog records rather than seeded UI-generated records and are proved in the real Tauri runtime.
- What Remains Simulated: packaged curated snapshots remain the governed source for this closed slice; live external connectors are future work.
- Next Blocking Real Seam: `WP-I8-002` must consume the restored governed context series for deviation detection and propagation.
