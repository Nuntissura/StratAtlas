# TS-WP-GOV-INSTALLER-001 - Spec vs Code Test Suite

Date Opened: 2026-03-06
Status: E2E-VERIFIED
Linked Work Packet: WP-GOV-INSTALLER-001
Iteration: All

## Scope

Validate WP delivery against linked requirements and primitives.

## Inputs

- Linked requirements: REQ-0023, REQ-0024, REQ-0025, REQ-0026, REQ-0027, REQ-0028, REQ-0029, REQ-0030, REQ-0031
- Linked primitives: PRIM-0024, PRIM-0025, PRIM-0026, PRIM-0027, PRIM-0028
- Linked components: .product/Worktrees/wt_main/src-tauri/tauri.conf.json; .product/Worktrees/wt_main/scripts/windows-installer-maintenance.ps1; .gov/repo_scripts/build_windows_installer.ps1; .product/Worktrees/wt_main/docs/INSTALLER_LIFECYCLE.md

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0023 | PRIM-0024 | Dependency | installer build prerequisites | `pnpm install --frozen-lockfile` in `.product/Worktrees/wt_main` | dependencies resolve without lock drift |
| UI-001 | REQ-0024 | PRIM-0024 | UI Contract | installer maintenance entrypoint visibility | `windows-installer-maintenance.ps1 -Action status` | lifecycle action surface exists and reports install status |
| FUNC-001 | REQ-0025, REQ-0026, REQ-0027, REQ-0028, REQ-0030, REQ-0031 | PRIM-0025, PRIM-0026, PRIM-0027, PRIM-0028 | Functionality | lifecycle operation guards and version contract | `check-WP-GOV-INSTALLER-001.ps1` + script parameter validation checks | invalid directions rejected; repair/full-repair semantics enforced; build version contract enforced |
| COR-001 | REQ-0023..REQ-0029 | PRIM-0024..PRIM-0028 | Code Correctness | governance and policy consistency | `governance_preflight.ps1` | spec/index/traceability/wp assets consistent |
| RED-001 | REQ-0023..REQ-0029 | PRIM-0025 | Red Team / Abuse | misuse and policy bypass | `.gov/repo_scripts/red_team_guardrail_check.ps1` (via WP check runner) | no safety-boundary regressions introduced |
| EXT-001 | REQ-0023, REQ-0029 | PRIM-0028 | Additional | installer artifact reproducibility | `.gov/repo_scripts/build_windows_installer.ps1` | MSI/NSIS kit generated with manifest and lifecycle docs |

## Dependency and Environment Tests

- [x] Runtime dependency install/lock integrity
- [x] Platform portability constraints checked
- [x] Required services/adapters available

## UI Contract Tests

- [x] Required regions (N/A - governance installer WP; command-surface contract validated)
- [x] Required modes/states (N/A - CLI action set validated)
- [x] Error and degraded-state UX (command guardrails and non-zero exits validated)

## Functional Flow Tests

- [x] Golden flow
- [x] Deterministic replay path (N/A - non-stateful governance script path)
- [x] Export/import or persistence flow

## Code Correctness Tests

- [x] Unit tests (N/A - script contract validation path)
- [x] Integration tests
- [x] Static checks (lint/type/schema)

## Red-Team and Abuse Tests

- [x] Non-goal enforcement (spec section 3.2)
- [x] Policy bypass attempts
- [x] Invalid input and path abuse cases

## Additional Tests

- [x] Performance budget checks (N/A - no runtime performance-path modifications)
- [x] Offline behavior (N/A - installer governance scope)
- [x] Accessibility/usability checks (N/A - no UI surface changed)
- [x] Reliability/recovery checks

## Automation Hook

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-INSTALLER-001.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-GOV-INSTALLER-001/

## Execution Summary

- Last Run Date: 2026-03-06
- Result: PASS; promoted to E2E-VERIFIED
- Blocking Failures: None
- Evidence Paths: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-INSTALLER-001/20260306_084257/`; `.product/build_target/Current/InstallerKit/20260306_023104/`; `.product/build_target/logs/installer_build_20260306_023104.log`
- Reviewer: Codex
- User Sign-off: Approved via 2026-03-06 autonomous completion instruction
