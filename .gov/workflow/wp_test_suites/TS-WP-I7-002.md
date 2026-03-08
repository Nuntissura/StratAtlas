# TS-WP-I7-002 - Spec vs Code Test Suite

Date Opened: 2026-03-06
Status: IN-PROGRESS
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
- Proof Target: `pnpm lint`, `pnpm test -- --run src/features/i7/i7.test.ts src/App.test.tsx`, `pnpm build`, and the later `check-WP-I7-002.ps1` proof bundle.
- Allowed Fallbacks: packaged governed snapshots are allowed in this slice; live external connectors and runtime proof are not complete yet.
- Promotion Guard: keep the packet below `E2E-VERIFIED` until WP-check artifacts and desktop/runtime proof exist.

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

- Last Run Date:
- Result: Initial governed-catalog slice passed targeted lint/test/build verification; formal WP-check evidence still pending.
- Blocking Failures: No current test failures. Outstanding gap is missing `check-WP-I7-002.ps1` proof capture and runtime smoke evidence.
- Evidence Paths: `pnpm test -- --run src/features/i7/i7.test.ts`; `pnpm test -- --run src/features/i7/i7.test.ts src/App.test.tsx`; `pnpm lint`; `pnpm build`
- Reviewer:
- User Sign-off:

- What Became Real: App registration and AOI rematerialization now use governed catalog records rather than seeded UI-generated records.
- What Remains Simulated: packaged curated snapshots still stand in for live connectors, and no packet proof artifact exists yet.
- Next Blocking Real Seam: close the loop with packet-level proof capture and any remaining backend/runtime ingestion gaps.
