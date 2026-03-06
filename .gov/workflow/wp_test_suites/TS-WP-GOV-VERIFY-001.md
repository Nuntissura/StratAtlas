# TS-WP-GOV-VERIFY-001 - Spec vs Code Test Suite

Date Opened: 2026-03-06
Status: E2E-VERIFIED
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
| UI-001 | REQ-0013 | PRIM-0060 | UI Contract | desktop shell and degraded states | `pnpm smoke:runtime -- --artifact-root <WP artifact>/runtime_smoke` via `.gov/workflow/wp_checks/check-WP-GOV-VERIFY-001.ps1` | real desktop shell startup, offline/degraded indicators, required regions, and scenario export surface are exercised |
| FUNC-001 | REQ-0014 | PRIM-0060 | Functionality | startup and interaction proof | `pnpm smoke:runtime -- --artifact-root <WP artifact>/runtime_smoke` plus `pnpm test` via `.gov/workflow/wp_checks/check-WP-GOV-VERIFY-001.ps1` | cold/warm startup and key interaction flows produce artifact-backed evidence alongside functional regression coverage |
| COR-001 | REQ-0020 | PRIM-0061 | Code Correctness | status-promotion matrix | `.gov/workflow/wp_checks/check-WP-GOV-VERIFY-001.ps1` delegating to `.gov/repo_scripts/run_wp_checks.ps1` | proof requirements are explicit, template compliant, and command evidence is mandatory |
| RED-001 | REQ-0013 | PRIM-0061 | Red Team / Abuse | jsdom-only false closure | manual review of packet closeout language and future suite obligations | no runtime-heavy packet can close on jsdom-only evidence once this packet lands |
| EXT-001 | REQ-0018 | PRIM-0060 | Additional | portability and performance evidence | planned startup/perf capture plus macOS smoke notes in WP evidence | portability and budget evidence are tracked as first-class proof, not optional narrative |

## Dependency and Environment Tests

- [x] Governance preflight and linked packet assets resolved cleanly
- [x] Platform portability constraints recorded as mandatory downstream evidence slots
- [x] Required runtime adapters available for governed Tauri smoke execution

## UI Contract Tests

- [x] Required regions
- [x] Required modes/states
- [x] Error and degraded-state UX

## Functional Flow Tests

- [x] Golden flow
- [x] Deterministic replay path
- [x] Export/import or persistence flow

## Code Correctness Tests

- [x] Unit tests
- [x] Integration tests
- [x] Static checks (lint/type/schema)

## Red-Team and Abuse Tests

- [x] Non-goal enforcement (spec section 3.2)
- [x] Policy bypass attempts
- [x] Invalid input and path abuse cases

## Additional Tests

- [x] Runtime budget capture slots and degraded-state proof
- [x] Offline behavior
- [x] Reliability/recovery checks
- [ ] macOS smoke execution remains a downstream packet obligation

## Automation Hook

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-VERIFY-001.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-GOV-VERIFY-001/

## Execution Summary

- Last Run Date: Artifact path `.product/build_target/tool_artifacts/wp_runs/WP-GOV-VERIFY-001/20260307_000606/`
- Result: PASSING `E2E-VERIFIED` closeout with governed runtime smoke, functional regression, lint, template compliance, red-team, build, and Rust proof
- Blocking Failures:
- Evidence Paths: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-VERIFY-001/20260307_000606/result.json`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-VERIFY-001/20260307_000606/summary.md`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-VERIFY-001/20260307_000606/runtime_smoke/runtime_smoke_summary.json`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-VERIFY-001/20260307_000606/runtime_smoke/runtime_smoke_summary.md`
- Reviewer:
- User Sign-off: Approved via 2026-03-06 instruction to execute `WP-GOV-VERIFY-001`
