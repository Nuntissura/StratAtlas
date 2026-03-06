# TS-WP-GOV-VERIFY-001 - Spec vs Code Test Suite

Date Opened: 2026-03-06
Status: IN-PROGRESS
Linked Work Packet: WP-GOV-VERIFY-001
Iteration: All

## Scope

Validate that runtime proof obligations expand beyond jsdom-only flows and define the governed smoke evidence future remediation packets must supply.

## Inputs

- Linked requirements: REQ-0013, REQ-0014, REQ-0015, REQ-0016, REQ-0018, REQ-0019, REQ-0020, REQ-0021, REQ-0022
- Linked primitives: PRIM-0060, PRIM-0061
- Linked components: .gov/workflow/taskboard/TASK_BOARD.md; .gov/Spec/TRACEABILITY_MATRIX.md; .gov/Spec/PRIMITIVES_INDEX.md; .gov/Spec/PRIMITIVES_MATRIX.md; .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src-tauri/src/lib.rs

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0021 | PRIM-0061 | Dependency | governed verification assets | `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1` | verification packet assets and traceability links resolve cleanly |
| UI-001 | REQ-0013 | PRIM-0060 | UI Contract | desktop shell and degraded states | planned desktop smoke harness under `.product/Worktrees/wt_main/tests/e2e/` | real desktop shell startup, offline/degraded indicators, and primary regions are exercised |
| FUNC-001 | REQ-0014 | PRIM-0060 | Functionality | startup and interaction proof | planned runtime smoke command recorded under the WP proof artifact directory | cold/warm startup and key interaction flows produce artifact-backed evidence |
| COR-001 | REQ-0020 | PRIM-0061 | Code Correctness | status-promotion matrix | `.gov/workflow/wp_checks/check-WP-GOV-VERIFY-001.ps1` | proof requirements are explicit and command evidence is mandatory |
| RED-001 | REQ-0013 | PRIM-0061 | Red Team / Abuse | jsdom-only false closure | manual review of packet closeout language and future suite obligations | no runtime-heavy packet can close on jsdom-only evidence once this packet lands |
| EXT-001 | REQ-0018 | PRIM-0060 | Additional | portability and performance evidence | planned startup/perf capture plus macOS smoke notes in WP evidence | portability and budget evidence are tracked as first-class proof, not optional narrative |

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

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-VERIFY-001.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-GOV-VERIFY-001/

## Execution Summary

- Last Run Date: 2026-03-06
- Result: PASSING preparation validation; packet remains IN-PROGRESS pending runtime smoke harness and evidence-matrix implementation
- Blocking Failures:
- Evidence Paths: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-VERIFY-001/20260306_214607/result.json`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-VERIFY-001/20260306_214607/summary.md`
- Reviewer:
- User Sign-off: Not applicable while packet remains IN-PROGRESS
