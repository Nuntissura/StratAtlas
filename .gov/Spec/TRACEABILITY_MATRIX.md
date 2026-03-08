# StratAtlas - Traceability Matrix

**Spec Version:** v1.2.4  
**Last Updated:** 2026-03-08  
**Governance:** See `SPEC_GOVERNANCE.md` for maintenance rules.

---

## Purpose

This matrix maps every requirement from `REQUIREMENTS_INDEX.md` to its implementing component(s), test(s), and iteration. It answers: "Where is this requirement built, and how do we know it works?"

**Maintenance rule:** This document is populated *when an iteration's sub-spec is written* (not before). Empty cells are expected for future iterations.

---

## Matrix Format

```
REQ-ID | Component(s) | Test(s) | Iteration | Verified
```

- **Component:** Source module or service that implements the requirement
- **Test:** Test file or suite that verifies the requirement
- **Verified:** Date implementation-level tests passed, or blank

**Important:** `Verified` here is implementation-level verification. Done status is only `E2E-VERIFIED` in WP/taskboard/test-suite governance.

---

## Cross-Cutting Requirements

| REQ | Component(s) | Test(s) | Iter | Verified |
|-----|-------------|---------|------|----------|
| REQ-0001 | .product/Worktrees/wt_main/src/features/i6/aiGateway.ts; .product/Worktrees/wt_main/src/features/i9/osint.ts; .product/Worktrees/wt_main/src/features/i10/gameModeling.ts | .product/Worktrees/wt_main/src/features/i6/i6.test.ts; .product/Worktrees/wt_main/src/features/i9/i9.test.ts; .product/Worktrees/wt_main/src/features/i10/i10.test.ts | All | 2026-03-05 |
| REQ-0002 | .product/Worktrees/wt_main/src/features/i6/aiGateway.ts; .product/Worktrees/wt_main/src/features/i9/osint.ts; .product/Worktrees/wt_main/src/features/i10/gameModeling.ts | .product/Worktrees/wt_main/src/features/i6/i6.test.ts; .product/Worktrees/wt_main/src/features/i9/i9.test.ts; .product/Worktrees/wt_main/src/features/i10/i10.test.ts | All | 2026-03-05 |
| REQ-0003 | .product/Worktrees/wt_main/src/features/i6/aiGateway.ts; .product/Worktrees/wt_main/src/features/i9/osint.ts; .product/Worktrees/wt_main/src/features/i10/gameModeling.ts | .product/Worktrees/wt_main/src/features/i6/i6.test.ts; .product/Worktrees/wt_main/src/features/i9/i9.test.ts; .product/Worktrees/wt_main/src/features/i10/i10.test.ts | All | 2026-03-05 |
| REQ-0004 | .product/Worktrees/wt_main/src/features/i6/aiGateway.ts; .product/Worktrees/wt_main/src/features/i9/osint.ts; .product/Worktrees/wt_main/src/features/i10/gameModeling.ts | .product/Worktrees/wt_main/src/features/i6/i6.test.ts; .product/Worktrees/wt_main/src/features/i9/i9.test.ts; .product/Worktrees/wt_main/src/features/i10/i10.test.ts | All | 2026-03-05 |
| REQ-0005 | .product/Worktrees/wt_main/src/features/i6/aiGateway.ts; .product/Worktrees/wt_main/src/features/i9/osint.ts; .product/Worktrees/wt_main/src/features/i10/gameModeling.ts | .product/Worktrees/wt_main/src/features/i6/i6.test.ts; .product/Worktrees/wt_main/src/features/i9/i9.test.ts; .product/Worktrees/wt_main/src/features/i10/i10.test.ts | All | 2026-03-05 |
| REQ-0006 | .product/Worktrees/wt_main/src/features/i6/aiGateway.ts; .product/Worktrees/wt_main/src/features/i9/osint.ts; .product/Worktrees/wt_main/src/features/i10/gameModeling.ts | .product/Worktrees/wt_main/src/features/i6/i6.test.ts; .product/Worktrees/wt_main/src/features/i9/i9.test.ts; .product/Worktrees/wt_main/src/features/i10/i10.test.ts | All | 2026-03-05 |
| REQ-0007 | .product/Worktrees/wt_main/src/features/i6/aiGateway.ts; .product/Worktrees/wt_main/src/features/i9/osint.ts; .product/Worktrees/wt_main/src/features/i10/gameModeling.ts | .product/Worktrees/wt_main/src/features/i6/i6.test.ts; .product/Worktrees/wt_main/src/features/i9/i9.test.ts; .product/Worktrees/wt_main/src/features/i10/i10.test.ts | All | 2026-03-05 |
| REQ-0008 | .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/lib/backend.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | All | 2026-03-05 |
| REQ-0009 | .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/lib/backend.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | All | 2026-03-05 |
| REQ-0010 | .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/lib/backend.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | All | 2026-03-05 |
| REQ-0011 | .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/lib/backend.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | All | 2026-03-05 |
| REQ-0012 | .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/lib/backend.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | All | 2026-03-05 |
| REQ-0013 | .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/lib/backend.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | All | 2026-03-05 |
| REQ-0014 | .product/Worktrees/wt_main/src/features/i1/performance.ts | .product/Worktrees/wt_main/src/features/i1/i1.test.ts | All | 2026-03-05 |
| REQ-0015 | .product/Worktrees/wt_main/src/features/i1/performance.ts | .product/Worktrees/wt_main/src/features/i1/i1.test.ts | All | 2026-03-05 |
| REQ-0016 | .product/Worktrees/wt_main/src/features/i1/performance.ts | .product/Worktrees/wt_main/src/features/i1/i1.test.ts | All | 2026-03-05 |
| REQ-0017 | .product/Worktrees/wt_main/src-tauri/src/lib.rs; .product/Worktrees/wt_main/src/lib/backend.ts | .product/Worktrees/wt_main/src-tauri/src/lib.rs (unit tests); .product/Worktrees/wt_main/src/lib/backend.test.ts | All | 2026-03-05 |
| REQ-0018 | .product/Worktrees/wt_main/src-tauri/src/lib.rs; .product/Worktrees/wt_main/src/lib/backend.ts | .product/Worktrees/wt_main/src-tauri/src/lib.rs (unit tests); .product/Worktrees/wt_main/src/lib/backend.test.ts | All | 2026-03-05 |
| REQ-0019 | .gov/repo_scripts/new_work_packet.ps1; .gov/repo_scripts/bootstrap_wp_loop_assets.ps1 | .gov/repo_scripts/enforce_wp_template_compliance.ps1 | All | 2026-03-06 |
| REQ-0020 | .gov/repo_scripts/run_wp_checks.ps1; .gov/workflow/work_packets/WP-*.md | .gov/repo_scripts/enforce_wp_template_compliance.ps1 | All | 2026-03-06 |
| REQ-0021 | .gov/repo_scripts/governance_preflight.ps1; .gov/repo_scripts/enforce_wp_template_compliance.ps1 | .gov/repo_scripts/governance_preflight.ps1 | All | 2026-03-06 |
| REQ-0022 | .gov/repo_scripts/run_wp_loop.ps1 | .gov/repo_scripts/run_wp_loop.ps1 | All | 2026-03-06 |
| REQ-0023 | .product/Worktrees/wt_main/src-tauri/tauri.conf.json; .product/Worktrees/wt_main/scripts/windows-installer-maintenance.ps1 | .gov/workflow/wp_test_suites/TS-WP-GOV-INSTALLER-001.md; .gov/workflow/wp_checks/check-WP-GOV-INSTALLER-001.ps1 | All | 2026-03-06 |
| REQ-0024 | .product/Worktrees/wt_main/src-tauri/tauri.conf.json | .gov/workflow/wp_test_suites/TS-WP-GOV-INSTALLER-001.md; .gov/workflow/wp_checks/check-WP-GOV-INSTALLER-001.ps1 | All | 2026-03-06 |
| REQ-0025 | .product/Worktrees/wt_main/scripts/windows-installer-maintenance.ps1 | .gov/workflow/wp_test_suites/TS-WP-GOV-INSTALLER-001.md; .gov/workflow/wp_checks/check-WP-GOV-INSTALLER-001.ps1 | All | 2026-03-06 |
| REQ-0026 | .product/Worktrees/wt_main/scripts/windows-installer-maintenance.ps1 | .gov/workflow/wp_test_suites/TS-WP-GOV-INSTALLER-001.md; .gov/workflow/wp_checks/check-WP-GOV-INSTALLER-001.ps1 | All | 2026-03-06 |
| REQ-0027 | .product/Worktrees/wt_main/scripts/windows-installer-maintenance.ps1 | .gov/workflow/wp_test_suites/TS-WP-GOV-INSTALLER-001.md; .gov/workflow/wp_checks/check-WP-GOV-INSTALLER-001.ps1 | All | 2026-03-06 |
| REQ-0028 | .product/Worktrees/wt_main/scripts/windows-installer-maintenance.ps1; .product/Worktrees/wt_main/src-tauri/tauri.conf.json | .gov/workflow/wp_test_suites/TS-WP-GOV-INSTALLER-001.md; .gov/workflow/wp_checks/check-WP-GOV-INSTALLER-001.ps1 | All | 2026-03-06 |
| REQ-0029 | .gov/repo_scripts/build_windows_installer.ps1; .product/Worktrees/wt_main/README.md; .product/Worktrees/wt_main/docs/INSTALLER_LIFECYCLE.md | .gov/workflow/wp_test_suites/TS-WP-GOV-INSTALLER-001.md; .gov/workflow/wp_test_suites/TS-WP-GOV-INSTALLER-002.md; .gov/workflow/wp_checks/check-WP-GOV-INSTALLER-001.ps1; .gov/workflow/wp_checks/check-WP-GOV-INSTALLER-002.ps1 | All | 2026-03-06 |
| REQ-0030 | .gov/repo_scripts/build_windows_installer.ps1; .product/Worktrees/wt_main/package.json; .product/Worktrees/wt_main/src-tauri/Cargo.toml; .product/Worktrees/wt_main/src-tauri/tauri.conf.json | .gov/workflow/wp_test_suites/TS-WP-GOV-INSTALLER-001.md; .gov/workflow/wp_test_suites/TS-WP-GOV-INSTALLER-002.md; .gov/workflow/wp_checks/check-WP-GOV-INSTALLER-001.ps1; .gov/workflow/wp_checks/check-WP-GOV-INSTALLER-002.ps1 | All | 2026-03-06 |
| REQ-0031 | .gov/repo_scripts/build_windows_installer.ps1; .product/Worktrees/wt_main/package.json; .product/Worktrees/wt_main/src-tauri/Cargo.toml; .product/Worktrees/wt_main/src-tauri/tauri.conf.json | .gov/workflow/wp_test_suites/TS-WP-GOV-INSTALLER-001.md; .gov/workflow/wp_test_suites/TS-WP-GOV-INSTALLER-002.md; .gov/workflow/wp_checks/check-WP-GOV-INSTALLER-001.ps1; .gov/workflow/wp_checks/check-WP-GOV-INSTALLER-002.ps1 | All | 2026-03-06 |

---

## I0: Walking Skeleton

| REQ | Component(s) | Test(s) | Iter | Verified |
|-----|-------------|---------|------|----------|
| REQ-0100 | .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .product/Worktrees/wt_main/src/lib/backend.test.ts; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src-tauri/src/lib.rs (unit tests) | I0 | 2026-03-05 |
| REQ-0101 | .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .product/Worktrees/wt_main/src/lib/backend.test.ts; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src-tauri/src/lib.rs (unit tests) | I0 | 2026-03-05 |
| REQ-0102 | .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .product/Worktrees/wt_main/src/lib/backend.test.ts; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src-tauri/src/lib.rs (unit tests) | I0 | 2026-03-05 |
| REQ-0103 | .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .product/Worktrees/wt_main/src/lib/backend.test.ts; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src-tauri/src/lib.rs (unit tests) | I0 | 2026-03-05 |
| REQ-0104 | .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .product/Worktrees/wt_main/src/lib/backend.test.ts; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src-tauri/src/lib.rs (unit tests) | I0 | 2026-03-05 |
| REQ-0105 | .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .product/Worktrees/wt_main/src/lib/backend.test.ts; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src-tauri/src/lib.rs (unit tests) | I0 | 2026-03-05 |
| REQ-0106 | .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .product/Worktrees/wt_main/src/lib/backend.test.ts; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src-tauri/src/lib.rs (unit tests) | I0 | 2026-03-05 |
| REQ-0107 | .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .product/Worktrees/wt_main/src/lib/backend.test.ts; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src-tauri/src/lib.rs (unit tests) | I0 | 2026-03-05 |
| REQ-0108 | .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .product/Worktrees/wt_main/src/lib/backend.test.ts; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src-tauri/src/lib.rs (unit tests) | I0 | 2026-03-05 |
| REQ-0109 | .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .gov/workflow/wp_test_suites/TS-WP-I0-003.md; .gov/workflow/wp_checks/check-WP-I0-003.ps1; .product/Worktrees/wt_main/src/lib/backend.test.ts; .product/build_target/tool_artifacts/wp_runs/WP-I0-003/20260307_021247/runtime_smoke/ | I0 | 2026-03-07 |
| REQ-0110 | .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .gov/workflow/wp_test_suites/TS-WP-I0-003.md; .gov/repo_scripts/validate_wp_i0_runtime_proof.ps1; cargo test (live_control_plane_query_roundtrip); .product/build_target/tool_artifacts/wp_runs/WP-I0-003/20260307_021247/runtime_smoke/ | I0 | 2026-03-07 |
| REQ-0111 | .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .gov/workflow/wp_test_suites/TS-WP-I0-003.md; .product/Worktrees/wt_main/src/lib/backend.test.ts; cargo test; .product/build_target/tool_artifacts/wp_runs/WP-I0-003/20260307_021247/runtime_smoke/cold/runtime_proof/control_plane_state.json | I0 | 2026-03-07 |
| REQ-0112 | .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .product/Worktrees/wt_main/src/lib/backend.test.ts; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src-tauri/src/lib.rs (unit tests) | I0 | 2026-03-05 |

---

## I1: Layer System + Time/Replay

| REQ | Component(s) | Test(s) | Iter | Verified |
|-----|-------------|---------|------|----------|
| REQ-0200 | .product/Worktrees/wt_main/src/features/i1/modes.ts; .product/Worktrees/wt_main/src/features/i1/layers.ts; .product/Worktrees/wt_main/src/features/i1/plugins.ts; .product/Worktrees/wt_main/src/features/i1/performance.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/features/i1/i1.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | I1 | 2026-03-05 |
| REQ-0201 | .product/Worktrees/wt_main/src/features/i1/modes.ts; .product/Worktrees/wt_main/src/features/i1/layers.ts; .product/Worktrees/wt_main/src/features/i1/plugins.ts; .product/Worktrees/wt_main/src/features/i1/performance.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/features/i1/i1.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | I1 | 2026-03-05 |
| REQ-0202 | .product/Worktrees/wt_main/src/features/i1/modes.ts; .product/Worktrees/wt_main/src/features/i1/layers.ts; .product/Worktrees/wt_main/src/features/i1/plugins.ts; .product/Worktrees/wt_main/src/features/i1/performance.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/features/i1/i1.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | I1 | 2026-03-05 |
| REQ-0203 | .product/Worktrees/wt_main/src/features/i1/modes.ts; .product/Worktrees/wt_main/src/features/i1/layers.ts; .product/Worktrees/wt_main/src/features/i1/plugins.ts; .product/Worktrees/wt_main/src/features/i1/performance.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/features/i1/i1.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | I1 | 2026-03-05 |
| REQ-0204 | .product/Worktrees/wt_main/src/features/i1/modes.ts; .product/Worktrees/wt_main/src/features/i1/layers.ts; .product/Worktrees/wt_main/src/features/i1/plugins.ts; .product/Worktrees/wt_main/src/features/i1/performance.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/features/i1/i1.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | I1 | 2026-03-05 |
| REQ-0205 | .product/Worktrees/wt_main/src/features/i1/modes.ts; .product/Worktrees/wt_main/src/features/i1/layers.ts; .product/Worktrees/wt_main/src/features/i1/plugins.ts; .product/Worktrees/wt_main/src/features/i1/performance.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/features/i1/i1.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | I1 | 2026-03-05 |
| REQ-0206 | .product/Worktrees/wt_main/src/features/i1/modes.ts; .product/Worktrees/wt_main/src/features/i1/layers.ts; .product/Worktrees/wt_main/src/features/i1/plugins.ts; .product/Worktrees/wt_main/src/features/i1/performance.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/features/i1/i1.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | I1 | 2026-03-05 |
| REQ-0207 | .product/Worktrees/wt_main/src/features/i1/modes.ts; .product/Worktrees/wt_main/src/features/i1/layers.ts; .product/Worktrees/wt_main/src/features/i1/plugins.ts; .product/Worktrees/wt_main/src/features/i1/performance.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/features/i1/i1.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | I1 | 2026-03-05 |
| REQ-0208 | .product/Worktrees/wt_main/src/features/i1/modes.ts; .product/Worktrees/wt_main/src/features/i1/layers.ts; .product/Worktrees/wt_main/src/features/i1/plugins.ts; .product/Worktrees/wt_main/src/features/i1/performance.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/features/i1/i1.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | I1 | 2026-03-05 |
| REQ-0209 | .product/Worktrees/wt_main/src/features/i1/modes.ts; .product/Worktrees/wt_main/src/features/i1/layers.ts; .product/Worktrees/wt_main/src/features/i1/plugins.ts; .product/Worktrees/wt_main/src/features/i1/performance.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/features/i1/i1.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | I1 | 2026-03-05 |
| REQ-0210 | .product/Worktrees/wt_main/src/features/i1/modes.ts; .product/Worktrees/wt_main/src/features/i1/layers.ts; .product/Worktrees/wt_main/src/features/i1/plugins.ts; .product/Worktrees/wt_main/src/features/i1/performance.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/features/i1/i1.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | I1 | 2026-03-05 |
| REQ-0211 | .product/Worktrees/wt_main/src/features/i1/modes.ts; .product/Worktrees/wt_main/src/features/i1/layers.ts; .product/Worktrees/wt_main/src/features/i1/plugins.ts; .product/Worktrees/wt_main/src/features/i1/performance.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/features/i1/i1.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | I1 | 2026-03-05 |
| REQ-0212 | .product/Worktrees/wt_main/src/features/i1/modes.ts; .product/Worktrees/wt_main/src/features/i1/layers.ts; .product/Worktrees/wt_main/src/features/i1/plugins.ts; .product/Worktrees/wt_main/src/features/i1/performance.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/features/i1/i1.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | I1 | 2026-03-05 |

---

## I2: Baseline/Delta Compare + Briefing Bundle

| REQ | Component(s) | Test(s) | Iter | Verified |
|-----|-------------|---------|------|----------|
| REQ-0300 | .product/Worktrees/wt_main/src/features/i2/baselineDelta.ts; .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/features/i1/runtime/mapRuntimeScene.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .product/Worktrees/wt_main/src/features/i2/i2.test.ts; .product/Worktrees/wt_main/src/features/i1/i1.test.ts; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/lib/backend.test.ts | I2 | 2026-03-07 |
| REQ-0301 | .product/Worktrees/wt_main/src/features/i2/baselineDelta.ts; .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/features/i1/runtime/mapRuntimeScene.ts | .product/Worktrees/wt_main/src/features/i2/i2.test.ts; .product/Worktrees/wt_main/src/features/i1/i1.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | I2 | 2026-03-07 |
| REQ-0302 | .product/Worktrees/wt_main/src/features/i2/baselineDelta.ts; .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .product/Worktrees/wt_main/src/features/i2/i2.test.ts; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/lib/backend.test.ts | I2 | 2026-03-07 |

---

## I3: Collaboration + CRDT + Session Replay

| REQ | Component(s) | Test(s) | Iter | Verified |
|-----|-------------|---------|------|----------|
| REQ-0400 | .product/Worktrees/wt_main/src/features/i3/collaboration.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/features/i3/i3.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | I3 | 2026-03-06 |
| REQ-0401 | .product/Worktrees/wt_main/src/features/i3/collaboration.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/features/i3/i3.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | I3 | 2026-03-06 |
| REQ-0402 | .product/Worktrees/wt_main/src/features/i3/collaboration.ts; .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .product/Worktrees/wt_main/src/features/i3/i3.test.ts; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/lib/backend.test.ts | I3 | 2026-03-06 |
| REQ-0403 | .product/Worktrees/wt_main/src/features/i3/collaboration.ts; .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .product/Worktrees/wt_main/src/features/i3/i3.test.ts; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/lib/backend.test.ts | I3 | 2026-03-06 |

---

## I4: Scenario Modeling + Constraint Propagation + Export

| REQ | Component(s) | Test(s) | Iter | Verified |
|-----|-------------|---------|------|----------|
| REQ-0500 | .product/Worktrees/wt_main/src/features/i4/scenarios.ts; .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .product/Worktrees/wt_main/src/features/i4/i4.test.ts; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/lib/backend.test.ts | I4 | 2026-03-06 |
| REQ-0501 | .product/Worktrees/wt_main/src/features/i4/scenarios.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/features/i4/i4.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | I4 | 2026-03-06 |
| REQ-0502 | .product/Worktrees/wt_main/src/features/i4/scenarios.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/features/i4/i4.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | I4 | 2026-03-06 |
| REQ-0503 | .product/Worktrees/wt_main/src/features/i4/scenarios.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/features/i4/i4.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | I4 | 2026-03-06 |
| REQ-0504 | .product/Worktrees/wt_main/src/features/i4/scenarios.ts; .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .product/Worktrees/wt_main/src/features/i4/i4.test.ts; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/lib/backend.test.ts | I4 | 2026-03-06 |

---

## I5: Query Builder + Saved/Versioned Queries

| REQ | Component(s) | Test(s) | Iter | Verified |
|-----|-------------|---------|------|----------|
| REQ-0600 | .product/Worktrees/wt_main/src/features/i5/queryBuilder.ts; .product/Worktrees/wt_main/src/features/i5/queryExecution.ts; .product/Worktrees/wt_main/src/features/i5/queryRuntime.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/features/i5/i5.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | I5 | 2026-03-07 |
| REQ-0601 | .product/Worktrees/wt_main/src/features/i5/queryBuilder.ts; .product/Worktrees/wt_main/src/features/i5/queryExecution.ts; .product/Worktrees/wt_main/src/features/i5/queryRuntime.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/features/i5/i5.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | I5 | 2026-03-07 |
| REQ-0602 | .product/Worktrees/wt_main/src/features/i5/queryBuilder.ts; .product/Worktrees/wt_main/src/features/i5/queryExecution.ts; .product/Worktrees/wt_main/src/features/i5/queryRuntime.ts; .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .product/Worktrees/wt_main/src/features/i5/i5.test.ts; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/lib/backend.test.ts | I5 | 2026-03-07 |
| REQ-0603 | .product/Worktrees/wt_main/src/features/i5/queryBuilder.ts; .product/Worktrees/wt_main/src/features/i5/queryExecution.ts; .product/Worktrees/wt_main/src/features/i5/queryRuntime.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/features/i5/i5.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | I5 | 2026-03-07 |
| REQ-0604 | .product/Worktrees/wt_main/src/features/i5/queryBuilder.ts; .product/Worktrees/wt_main/src/features/i5/queryExecution.ts; .product/Worktrees/wt_main/src/features/i5/queryRuntime.ts; .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .product/Worktrees/wt_main/src/features/i5/i5.test.ts; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/lib/backend.test.ts | I5 | 2026-03-07 |

---

## I6: AI Gateway + MCP Interface

| REQ | Component(s) | Test(s) | Iter | Verified |
|-----|-------------|---------|------|----------|
| REQ-0700 | .product/Worktrees/wt_main/src/features/i6/aiGateway.ts; .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .gov/workflow/wp_test_suites/TS-WP-I6-002.md; .gov/workflow/wp_checks/check-WP-I6-002.ps1; .product/Worktrees/wt_main/src/features/i6/i6.test.ts; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/lib/backend.test.ts | I6 | 2026-03-08 |
| REQ-0701 | .product/Worktrees/wt_main/src/features/i6/aiGateway.ts; .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .gov/workflow/wp_test_suites/TS-WP-I6-002.md; .gov/workflow/wp_checks/check-WP-I6-002.ps1; .product/Worktrees/wt_main/src/features/i6/i6.test.ts; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/lib/backend.test.ts | I6 | 2026-03-08 |
| REQ-0702 | .product/Worktrees/wt_main/src/features/i6/aiGateway.ts; .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .gov/workflow/wp_test_suites/TS-WP-I6-002.md; .gov/workflow/wp_checks/check-WP-I6-002.ps1; .product/Worktrees/wt_main/src/features/i6/i6.test.ts; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/lib/backend.test.ts | I6 | 2026-03-08 |
| REQ-0703 | .product/Worktrees/wt_main/src/features/i6/aiGateway.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .gov/workflow/wp_test_suites/TS-WP-I6-002.md; .gov/workflow/wp_checks/check-WP-I6-002.ps1; .product/Worktrees/wt_main/src/features/i6/i6.test.ts; .product/Worktrees/wt_main/src/lib/backend.test.ts | I6 | 2026-03-08 |
| REQ-0704 | .product/Worktrees/wt_main/src/features/i6/aiGateway.ts; .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .gov/workflow/wp_test_suites/TS-WP-I6-002.md; .gov/workflow/wp_checks/check-WP-I6-002.ps1; .product/Worktrees/wt_main/src/features/i6/i6.test.ts; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/lib/backend.test.ts | I6 | 2026-03-08 |
| REQ-0705 | .product/Worktrees/wt_main/src/features/i6/aiGateway.ts; .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .gov/workflow/wp_test_suites/TS-WP-I6-002.md; .gov/workflow/wp_checks/check-WP-I6-002.ps1; .product/Worktrees/wt_main/src/features/i6/i6.test.ts; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/lib/backend.test.ts | I6 | 2026-03-08 |
| REQ-0706 | .product/Worktrees/wt_main/src/features/i6/aiGateway.ts; .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .gov/workflow/wp_test_suites/TS-WP-I6-002.md; .gov/workflow/wp_checks/check-WP-I6-002.ps1; .product/Worktrees/wt_main/src/features/i6/i6.test.ts; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/lib/backend.test.ts | I6 | 2026-03-08 |
| REQ-0707 | .product/Worktrees/wt_main/src/features/i6/aiGateway.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .gov/workflow/wp_test_suites/TS-WP-I6-002.md; .gov/workflow/wp_checks/check-WP-I6-002.ps1; .product/Worktrees/wt_main/src/features/i6/i6.test.ts; .product/Worktrees/wt_main/src/lib/backend.test.ts | I6 | 2026-03-08 |
| REQ-0708 | .product/Worktrees/wt_main/src/features/i6/aiGateway.ts; .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .gov/workflow/wp_test_suites/TS-WP-I6-002.md; .gov/workflow/wp_checks/check-WP-I6-002.ps1; .product/Worktrees/wt_main/src/features/i6/i6.test.ts; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/lib/backend.test.ts | I6 | 2026-03-08 |

---

## I7: Context Intake Framework + First Domains

| REQ | Component(s) | Test(s) | Iter | Verified |
|-----|-------------|---------|------|----------|
| REQ-0800 | .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/features/i7/contextIntake.ts | .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/features/i7/i7.test.ts | I7 | 2026-03-08 |
| REQ-0801 | .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/features/i7/contextIntake.ts | .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/features/i7/i7.test.ts | I7 | 2026-03-08 |
| REQ-0802 | .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/features/i7/contextIntake.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/features/i7/i7.test.ts; .product/Worktrees/wt_main/src/lib/backend.test.ts | I7 | 2026-03-08 |
| REQ-0803 | .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/features/i7/contextIntake.ts | .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/features/i7/i7.test.ts | I7 | 2026-03-08 |
| REQ-0804 | .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/features/i1/layers.ts; .product/Worktrees/wt_main/src/features/i7/contextIntake.ts | .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/features/i7/i7.test.ts | I7 | 2026-03-08 |
| REQ-0805 | .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/features/i1/layers.ts; .product/Worktrees/wt_main/src/features/i7/contextIntake.ts | .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/features/i7/i7.test.ts | I7 | 2026-03-08 |
| REQ-0806 | .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/features/i7/contextIntake.ts | .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/features/i7/i7.test.ts | I7 | 2026-03-08 |
| REQ-0807 | .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/features/i7/contextIntake.ts | .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/features/i7/i7.test.ts | I7 | 2026-03-08 |
| REQ-0808 | .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/features/i7/contextIntake.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/features/i7/i7.test.ts; .product/Worktrees/wt_main/src/lib/backend.test.ts | I7 | 2026-03-08 |
| REQ-0809 | .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/features/i7/contextIntake.ts | .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/features/i7/i7.test.ts | I7 | 2026-03-08 |
| REQ-0810 | .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .gov/workflow/wp_test_suites/TS-WP-I0-003.md; .product/Worktrees/wt_main/src/lib/backend.test.ts; cargo test (live_control_plane_query_roundtrip) | I7 | 2026-03-08 |

---

## I8: Context Deviation Detection + Infrastructure Propagation

| REQ | Component(s) | Test(s) | Iter | Verified |
|-----|-------------|---------|------|----------|
| REQ-0900 | .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/features/i8/deviation.ts | .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/features/i8/i8.test.ts | I8 | 2026-03-08 |
| REQ-0901 | .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/features/i8/deviation.ts | .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/features/i8/i8.test.ts | I8 | 2026-03-08 |
| REQ-0902 | .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/features/i8/deviation.ts | .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/features/i8/i8.test.ts | I8 | 2026-03-08 |
| REQ-0903 | .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/features/i8/deviation.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/features/i8/i8.test.ts; .product/Worktrees/wt_main/src/lib/backend.test.ts | I8 | 2026-03-08 |
| REQ-0904 | .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/features/i8/deviation.ts | .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/features/i8/i8.test.ts | I8 | 2026-03-08 |

---

## I9: OSINT + Economic Indicators + Context-Aware Queries

| REQ | Component(s) | Test(s) | Iter | Verified |
|-----|-------------|---------|------|----------|
| REQ-1000 | .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/features/i9/osint.ts | .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/features/i9/i9.test.ts | I9 | 2026-03-06 |
| REQ-1001 | .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/App.css; .product/Worktrees/wt_main/src/features/i9/osint.ts | .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/features/i9/i9.test.ts | I9 | 2026-03-06 |
| REQ-1002 | .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/features/i9/osint.ts | .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/features/i9/i9.test.ts | I9 | 2026-03-06 |
| REQ-1003 | .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/features/i9/osint.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/features/i9/i9.test.ts; .product/Worktrees/wt_main/src/lib/backend.test.ts | I9 | 2026-03-06 |

---

## I10: Strategic Game Modeling

| REQ | Component(s) | Test(s) | Iter | Verified |
|-----|-------------|---------|------|----------|
| REQ-1100 | .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/features/i10/gameModeling.ts | .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/features/i10/i10.test.ts | I10 | 2026-03-08 |
| REQ-1101 | .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/features/i10/gameModeling.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/features/i10/i10.test.ts; .product/Worktrees/wt_main/src/lib/backend.test.ts | I10 | 2026-03-08 |
| REQ-1102 | .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/features/i10/gameModeling.ts | .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/features/i10/i10.test.ts | I10 | 2026-03-08 |
| REQ-1103 | .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/features/i10/gameModeling.ts | .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/features/i10/i10.test.ts | I10 | 2026-03-08 |
| REQ-1104 | .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/features/i10/gameModeling.ts | .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/features/i10/i10.test.ts | I10 | 2026-03-08 |
| REQ-1105 | .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/features/i10/gameModeling.ts | .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/features/i10/i10.test.ts | I10 | 2026-03-08 |
| REQ-1106 | .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/features/i10/gameModeling.ts | .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/features/i10/i10.test.ts | I10 | 2026-03-08 |
| REQ-1107 | .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/features/i10/gameModeling.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/features/i10/i10.test.ts; .product/Worktrees/wt_main/src/lib/backend.test.ts | I10 | 2026-03-08 |
| REQ-1108 | .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/features/i10/gameModeling.ts | .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/features/i10/i10.test.ts | I10 | 2026-03-08 |
| REQ-1109 | .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/features/i10/gameModeling.ts | .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/features/i10/i10.test.ts | I10 | 2026-03-08 |
| REQ-1110 | .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/features/i10/gameModeling.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/features/i10/i10.test.ts; .product/Worktrees/wt_main/src/lib/backend.test.ts | I10 | 2026-03-08 |
| REQ-1111 | .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/features/i10/gameModeling.ts | .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/features/i10/i10.test.ts | I10 | 2026-03-08 |
| REQ-1112 | .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/features/i10/gameModeling.ts | .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/features/i10/i10.test.ts | I10 | 2026-03-08 |
| REQ-1113 | .product/Worktrees/wt_main/src/App.tsx; .product/Worktrees/wt_main/src/features/i10/gameModeling.ts | .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src/features/i10/i10.test.ts | I10 | 2026-03-08 |

---

## Work Packet Coverage and Primitive Links

| WP ID | Iteration | Requirements | Primitives | Test Suite | Status | Evidence |
|------|-----------|--------------|------------|------------|--------|----------|
| WP-GOV-BUILDREADY-001 | All | Cross-cutting legacy baseline | N/A (legacy governance baseline) | .gov/workflow/wp_test_suites/TS-WP-GOV-BUILDREADY-001.md | SUPERSEDED | retained proof: .product/build_target/tool_artifacts/wp_runs/WP-GOV-BUILDREADY-001/20260306_003650/; superseded by WP-GOV-LOOP-001 and WP-GOV-STATUS-001 |
| WP-GOV-PERFPORT-001 | All | REQ-0014..REQ-0018, GATE-H | N/A (legacy governance baseline) | .gov/workflow/wp_test_suites/TS-WP-GOV-PERFPORT-001.md | SUPERSEDED | retained proof: .product/build_target/tool_artifacts/wp_runs/WP-GOV-PERFPORT-001/20260306_003659/; superseded by WP-I1-002 and WP-GOV-STATUS-001 |
| WP-GOV-ITER-ACTIVE-001 | I0-I10 | REQ-0100..REQ-1113 | PRIM-0030, PRIM-0031 | .gov/workflow/wp_test_suites/TS-WP-GOV-ITER-ACTIVE-001.md | SUPERSEDED | retained proof: .product/build_target/tool_artifacts/wp_runs/WP-GOV-ITER-ACTIVE-001/20260306_003653/; superseded by WP-GOV-REALIGN-001 and verified iteration packets |
| WP-GOV-REALIGN-001 | All | REQ-0013, REQ-0019, REQ-0020, REQ-0021, REQ-0022 | PRIM-0029, PRIM-0030, PRIM-0031 | .gov/workflow/wp_test_suites/TS-WP-GOV-REALIGN-001.md | E2E-VERIFIED | .gov/workflow/wp_spec_extractions/SX-WP-GOV-REALIGN-001.md; .product/build_target/tool_artifacts/wp_runs/WP-GOV-REALIGN-001/20260306_034725/; user sign-off approved via 2026-03-06 autonomous completion instruction |
| WP-I0-001 | I0 | REQ-0100..REQ-0112, REQ-0017..REQ-0018 | PRIM-0001, PRIM-0002, PRIM-0003, PRIM-0004 | .gov/workflow/wp_test_suites/TS-WP-I0-001.md | SUPERSEDED | retained proof: .product/build_target/tool_artifacts/wp_runs/WP-I0-001/20260306_003702/; superseded by WP-I0-002 |
| WP-I0-002 | I0 | REQ-0008, REQ-0009, REQ-0010, REQ-0101..REQ-0112, REQ-0808 | PRIM-0032, PRIM-0033, PRIM-0034 | .gov/workflow/wp_test_suites/TS-WP-I0-002.md | E2E-VERIFIED | proof: .product/build_target/tool_artifacts/wp_runs/WP-I0-002/20260306_041144/; spec extraction: .gov/workflow/wp_spec_extractions/SX-WP-I0-002.md; user sign-off approved via 2026-03-06 autonomous completion instruction |
| WP-I1-001 | I1 | REQ-0200..REQ-0212, REQ-0014..REQ-0016 | PRIM-0005, PRIM-0006, PRIM-0007, PRIM-0008, PRIM-0009 | .gov/workflow/wp_test_suites/TS-WP-I1-001.md | SUPERSEDED | retained proof: .product/build_target/tool_artifacts/wp_runs/WP-I1-001/20260306_003730/; superseded by WP-I1-002 |
| WP-I1-002 | I1 | REQ-0011, REQ-0012, REQ-0014..REQ-0016, REQ-0200..REQ-0212, REQ-0804, REQ-0805 | PRIM-0035, PRIM-0036, PRIM-0037 | .gov/workflow/wp_test_suites/TS-WP-I1-002.md | E2E-VERIFIED | proof: .product/build_target/tool_artifacts/wp_runs/WP-I1-002/20260306_044051/; spec extraction: .gov/workflow/wp_spec_extractions/SX-WP-I1-002.md; user sign-off approved via 2026-03-06 autonomous completion instruction |
| WP-I2-001 | I2 | REQ-0300..REQ-0302 | PRIM-0010, PRIM-0011 | .gov/workflow/wp_test_suites/TS-WP-I2-001.md | SUPERSEDED | retained proof: .product/build_target/tool_artifacts/wp_runs/WP-I2-001/20260306_003742/; superseded by WP-I2-002 |
| WP-I2-002 | I2 | REQ-0300, REQ-0301, REQ-0302 | PRIM-0038, PRIM-0039, PRIM-0040 | .gov/workflow/wp_test_suites/TS-WP-I2-002.md | E2E-VERIFIED | proof: .product/build_target/tool_artifacts/wp_runs/WP-I2-002/20260306_050212/; spec extraction: .gov/workflow/wp_spec_extractions/SX-WP-I2-002.md; user sign-off approved via 2026-03-06 autonomous completion instruction |
| WP-I3-001 | I3 | REQ-0400..REQ-0403 | PRIM-0012 | .gov/workflow/wp_test_suites/TS-WP-I3-001.md | E2E-VERIFIED | proof: .product/build_target/tool_artifacts/wp_runs/WP-I3-001/20260306_052546/; spec extraction: .gov/workflow/wp_spec_extractions/SX-WP-I3-001.md; user sign-off approved via 2026-03-06 autonomous completion instruction |
| WP-I4-001 | I4 | REQ-0500..REQ-0504 | PRIM-0013 | .gov/workflow/wp_test_suites/TS-WP-I4-001.md | E2E-VERIFIED | proof: .product/build_target/tool_artifacts/wp_runs/WP-I4-001/20260306_055241/; spec extraction: .gov/workflow/wp_spec_extractions/SX-WP-I4-001.md; user sign-off approved via 2026-03-06 autonomous completion instruction |
| WP-I5-001 | I5 | REQ-0600..REQ-0604 | PRIM-0014 | .gov/workflow/wp_test_suites/TS-WP-I5-001.md | E2E-VERIFIED | proof: .product/build_target/tool_artifacts/wp_runs/WP-I5-001/20260306_061249/; spec extraction: .gov/workflow/wp_spec_extractions/SX-WP-I5-001.md; user sign-off approved via 2026-03-06 autonomous completion instruction |
| WP-I6-001 | I6 | REQ-0700..REQ-0708 | PRIM-0015 | .gov/workflow/wp_test_suites/TS-WP-I6-001.md | E2E-VERIFIED | proof: .product/build_target/tool_artifacts/wp_runs/WP-I6-001/20260306_064311/; spec extraction: .gov/workflow/wp_spec_extractions/SX-WP-I6-001.md; user sign-off approved via 2026-03-06 autonomous completion instruction |
| WP-I7-001 | I7 | REQ-0800..REQ-0810 | PRIM-0016 | .gov/workflow/wp_test_suites/TS-WP-I7-001.md | E2E-VERIFIED | proof: .product/build_target/tool_artifacts/wp_runs/WP-I7-001/20260306_070435/; spec extraction: .gov/workflow/wp_spec_extractions/SX-WP-I7-001.md; user sign-off approved via 2026-03-06 autonomous completion instruction |
| WP-I8-001 | I8 | REQ-0900..REQ-0904 | PRIM-0017 | .gov/workflow/wp_test_suites/TS-WP-I8-001.md | E2E-VERIFIED | proof: .product/build_target/tool_artifacts/wp_runs/WP-I8-001/20260306_073044/; spec extraction: .gov/workflow/wp_spec_extractions/SX-WP-I8-001.md; user sign-off approved via 2026-03-06 autonomous completion instruction |
| WP-I9-001 | I9 | REQ-1000..REQ-1003 | PRIM-0018 | .gov/workflow/wp_test_suites/TS-WP-I9-001.md | E2E-VERIFIED | proof: .product/build_target/tool_artifacts/wp_runs/WP-I9-001/20260306_075309/; spec extraction: .gov/workflow/wp_spec_extractions/SX-WP-I9-001.md; user sign-off approved via 2026-03-06 autonomous completion instruction |
| WP-I10-001 | I10 | REQ-1100..REQ-1113 | PRIM-0019 | .gov/workflow/wp_test_suites/TS-WP-I10-001.md | E2E-VERIFIED | proof: .product/build_target/tool_artifacts/wp_runs/WP-I10-001/20260306_081821/; spec extraction: .gov/workflow/wp_spec_extractions/SX-WP-I10-001.md; user sign-off approved via 2026-03-06 autonomous completion instruction |
| WP-GOV-LOOP-001 | All | REQ-0019..REQ-0022 | PRIM-0020, PRIM-0021, PRIM-0022, PRIM-0023 | .gov/workflow/wp_test_suites/TS-WP-GOV-LOOP-001.md | E2E-VERIFIED | .gov/workflow/wp_spec_extractions/SX-WP-GOV-LOOP-001.md; .product/build_target/tool_artifacts/wp_runs/WP-GOV-LOOP-001/20260306_002544/; user sign-off approved via 2026-03-06 autonomous completion instruction |
| WP-GOV-INSTALLER-001 | All | REQ-0023, REQ-0024, REQ-0025, REQ-0026, REQ-0027, REQ-0028, REQ-0029, REQ-0030, REQ-0031 | PRIM-0024, PRIM-0025, PRIM-0026, PRIM-0027, PRIM-0028 | .gov/workflow/wp_test_suites/TS-WP-GOV-INSTALLER-001.md | E2E-VERIFIED | .gov/workflow/wp_spec_extractions/SX-WP-GOV-INSTALLER-001.md; .product/build_target/tool_artifacts/wp_runs/WP-GOV-INSTALLER-001/20260306_084257/; .product/build_target/Current/InstallerKit/20260306_023104/; user sign-off approved via 2026-03-06 autonomous completion instruction |

---

## Gate Verification

| Gate | Verification Method | Requirements Covered | Last Verified |
|------|-------------------|---------------------|---------------|
| Gate A - Misuse Constraints | Automated security tests in I6/I9/I10 feature suites | REQ-0001..REQ-0007 | 2026-03-05 |
| Gate B - Provenance and Reproducibility | Deterministic reopen + bundle integrity tests | REQ-0101, REQ-0104, REQ-0105, REQ-0009 | 2026-03-05 |
| Gate C - Security and Governance | RBAC/audit/marking contract tests and app flow checks | REQ-0008, REQ-0010, REQ-0100, REQ-0106 | 2026-03-05 |
| Gate D - Offline Operability | Offline bundle workflow in fallback runtime and app shell | REQ-0108 | 2026-03-05 |
| Gate E - Performance | Budget contract checks in I1 performance suite | REQ-0014..REQ-0016, REQ-0112, REQ-0206..REQ-0211 | 2026-03-05 |
| Gate F - Context Integrity | Context intake/deviation/OSINT iteration tests | REQ-0800..REQ-0810 | 2026-03-06 |
| Gate G - AI Safety | Live governed provider smoke, gateway policy tests, labeling tests, and audited MCP runtime proof | REQ-0700..REQ-0708, REQ-0011, REQ-0012 | 2026-03-08 |
| Gate H - Desktop Portability and Startup | Platform-neutral path handling, startup budgets, installer lifecycle controls, and version contract enforcement | REQ-0014..REQ-0018, REQ-0023..REQ-0031 | 2026-03-06 |

---

## Component -> Requirements Reverse Index

For quick lookup: "What requirements does this component implement?"

| Component | Requirements |
|-----------|-------------|
| .product/Worktrees/wt_main/src/contracts/i0.ts | REQ-0008..REQ-0013, REQ-0100..REQ-0112, REQ-0400..REQ-0403, REQ-0500..REQ-0504, REQ-0701, REQ-0705, REQ-0708 |
| .product/Worktrees/wt_main/src/lib/backend.ts | REQ-0008..REQ-0013, REQ-0017..REQ-0018, REQ-0100..REQ-0112, REQ-0400..REQ-0403, REQ-0500, REQ-0504, REQ-0700..REQ-0708 |
| .product/Worktrees/wt_main/src/App.tsx | REQ-0008..REQ-0013, REQ-0200..REQ-0212, REQ-0300..REQ-0302, REQ-0400..REQ-0403, REQ-0500..REQ-0504, REQ-0700..REQ-0708 |
| .product/Worktrees/wt_main/src/features/i1/modes.ts | REQ-0200..REQ-0212 |
| .product/Worktrees/wt_main/src/features/i1/layers.ts | REQ-0200..REQ-0212 |
| .product/Worktrees/wt_main/src/features/i1/plugins.ts | REQ-0204..REQ-0205 |
| .product/Worktrees/wt_main/src/features/i1/performance.ts | REQ-0014..REQ-0016, REQ-0206..REQ-0211 |
| .product/Worktrees/wt_main/src/features/i2/baselineDelta.ts | REQ-0300..REQ-0302 |
| .product/Worktrees/wt_main/src/features/i3/collaboration.ts | REQ-0400..REQ-0403 |
| .product/Worktrees/wt_main/src/features/i4/scenarios.ts | REQ-0500..REQ-0504 |
| .product/Worktrees/wt_main/src/features/i5/queryBuilder.ts | REQ-0600..REQ-0604 |
| .product/Worktrees/wt_main/src/features/i5/queryExecution.ts | REQ-0108, REQ-0600..REQ-0604, REQ-0810 |
| .product/Worktrees/wt_main/src/features/i5/queryRuntime.ts | REQ-0108, REQ-0600..REQ-0604, REQ-0810 |
| .product/Worktrees/wt_main/src/features/i6/aiGateway.ts | REQ-0001..REQ-0007, REQ-0700..REQ-0708 |
| .product/Worktrees/wt_main/src/features/i7/contextIntake.ts | REQ-0800..REQ-0810 |
| .product/Worktrees/wt_main/src/features/i8/deviation.ts | REQ-0900..REQ-0904 |
| .product/Worktrees/wt_main/src/features/i9/osint.ts | REQ-0001..REQ-0007, REQ-1000..REQ-1003 |
| .product/Worktrees/wt_main/src/features/i10/gameModeling.ts | REQ-0001..REQ-0007, REQ-1100..REQ-1113 |
| .product/Worktrees/wt_main/src-tauri/src/lib.rs | REQ-0017..REQ-0018, REQ-0100..REQ-0112, REQ-0400..REQ-0403, REQ-0500, REQ-0504, REQ-0700..REQ-0708 |
| .product/Worktrees/wt_main/README.md | REQ-0029 |
| .product/Worktrees/wt_main/src-tauri/Cargo.toml | REQ-0030, REQ-0031 |
| .product/Worktrees/wt_main/src-tauri/tauri.conf.json | REQ-0023, REQ-0024, REQ-0028, REQ-0030, REQ-0031 |
| .product/Worktrees/wt_main/scripts/windows-installer-maintenance.ps1 | REQ-0023..REQ-0028 |
| .gov/repo_scripts/build_windows_installer.ps1 | REQ-0023, REQ-0029, REQ-0030, REQ-0031 |
| .product/Worktrees/wt_main/docs/INSTALLER_LIFECYCLE.md | REQ-0029 |



| WP-GOV-STATUS-001 | All | REQ-0013, REQ-0019, REQ-0020, REQ-0021, REQ-0022 | PRIM-0029, PRIM-0030, PRIM-0031, PRIM-0041 | .gov/workflow/wp_test_suites/TS-WP-GOV-STATUS-001.md | E2E-VERIFIED | .gov/workflow/wp_spec_extractions/SX-WP-GOV-STATUS-001.md; .product/build_target/tool_artifacts/wp_runs/WP-GOV-STATUS-001/20260306_084102/; user sign-off approved via 2026-03-06 autonomous completion instruction |

| WP-GOV-INSTALLER-002 | All | REQ-0017, REQ-0029, REQ-0030, REQ-0031 | PRIM-0024, PRIM-0028 | .gov/workflow/wp_test_suites/TS-WP-GOV-INSTALLER-002.md | E2E-VERIFIED | .gov/workflow/wp_spec_extractions/SX-WP-GOV-INSTALLER-002.md; .product/build_target/tool_artifacts/wp_runs/WP-GOV-INSTALLER-002/20260306_112225/; .product/build_target/tool_artifacts/wp_runs/WP-GOV-INSTALLER-002/20260306_112235/; .product/build_target/Current/InstallerKit/20260306_112518/; user sign-off approved via 2026-03-06 autonomous completion instruction |

| WP-GOV-MAINT-002 | All | REQ-0001..REQ-0017, REQ-0019..REQ-0022, REQ-0100..REQ-0112, REQ-0200..REQ-0212 | PRIM-0029, PRIM-0030, PRIM-0031, PRIM-0032, PRIM-0033, PRIM-0034, PRIM-0035, PRIM-0036, PRIM-0037, PRIM-0041 | .gov/workflow/wp_test_suites/TS-WP-GOV-MAINT-002.md | E2E-VERIFIED | .gov/workflow/wp_spec_extractions/SX-WP-GOV-MAINT-002.md; .product/build_target/tool_artifacts/wp_runs/WP-GOV-MAINT-002/20260306_110842/; user sign-off approved via 2026-03-06 autonomous completion instruction |

| WP-GOV-REALIGN-002 | All | REQ-0013, REQ-0019, REQ-0020, REQ-0021, REQ-0022 | PRIM-0029, PRIM-0030, PRIM-0031, PRIM-0041 | .gov/workflow/wp_test_suites/TS-WP-GOV-REALIGN-002.md | E2E-VERIFIED | .gov/workflow/wp_spec_extractions/SX-WP-GOV-REALIGN-002.md; .product/build_target/tool_artifacts/wp_runs/WP-GOV-REALIGN-002/20260306_214418/; user sign-off approved via 2026-03-06 instruction to close this packet and prepare the successor |

| WP-GOV-VERIFY-001 | All | REQ-0013, REQ-0014, REQ-0015, REQ-0016, REQ-0018, REQ-0019, REQ-0020, REQ-0021, REQ-0022 | PRIM-0060, PRIM-0061 | .gov/workflow/wp_test_suites/TS-WP-GOV-VERIFY-001.md | E2E-VERIFIED | .gov/workflow/wp_spec_extractions/SX-WP-GOV-VERIFY-001.md; .product/build_target/tool_artifacts/wp_runs/WP-GOV-VERIFY-001/20260307_000606/; governed desktop runtime smoke harness and evidence-matrix closeout; next blocking remediation packet: WP-I0-003 |

| WP-I0-003 | I0 | REQ-0017, REQ-0018, REQ-0108, REQ-0109, REQ-0110, REQ-0111, REQ-0810 | PRIM-0042, PRIM-0043, PRIM-0044 | .gov/workflow/wp_test_suites/TS-WP-I0-003.md | E2E-VERIFIED | .gov/workflow/wp_spec_extractions/SX-WP-I0-003.md; .product/build_target/tool_artifacts/wp_runs/WP-I0-003/20260307_021247/; user sign-off approved via 2026-03-07 instruction to execute this packet |

| WP-I1-003 | I1 | REQ-0011, REQ-0012, REQ-0014, REQ-0015, REQ-0016, REQ-0200, REQ-0201, REQ-0202, REQ-0203, REQ-0206, REQ-0207, REQ-0208, REQ-0209, REQ-0210, REQ-0211, REQ-0212 | PRIM-0045, PRIM-0046, PRIM-0047 | .gov/workflow/wp_test_suites/TS-WP-I1-003.md | E2E-VERIFIED | .gov/workflow/wp_spec_extractions/SX-WP-I1-003.md; .product/build_target/tool_artifacts/wp_runs/WP-I1-003/20260307_045256/; user sign-off approved via 2026-03-07 instruction to perform the outstanding `WP-I1-003` closeout tasks |

| WP-I1-004 | I1 | GATE-E, REQ-0014, REQ-0015, REQ-0016, REQ-0206, REQ-0207, REQ-0208, REQ-0209, REQ-0210, REQ-0212 | PRIM-0047, PRIM-0067, PRIM-0068 | .gov/workflow/wp_test_suites/TS-WP-I1-004.md | E2E-VERIFIED | .gov/workflow/wp_spec_extractions/SX-WP-I1-004.md; .product/build_target/tool_artifacts/wp_runs/WP-I1-004/20260308_232056/; user sign-off approved via 2026-03-08 instruction to repair the requirements ledger, finish `WP-I1-004`, and then run `WP-GOV-PORT-002` |

| WP-I2-003 | I2 | REQ-0209, REQ-0210, REQ-0300, REQ-0301, REQ-0302 | PRIM-0048, PRIM-0049 | .gov/workflow/wp_test_suites/TS-WP-I2-003.md | E2E-VERIFIED | .gov/workflow/wp_spec_extractions/SX-WP-I2-003.md; .product/build_target/tool_artifacts/wp_runs/WP-I2-003/20260307_201453/; user sign-off approved via 2026-03-07 instruction to start and proceed with this packet |

| WP-I5-002 | I5 | REQ-0108, REQ-0600, REQ-0601, REQ-0602, REQ-0603, REQ-0604, REQ-0810 | PRIM-0050, PRIM-0051 | .gov/workflow/wp_test_suites/TS-WP-I5-002.md | E2E-VERIFIED | .gov/workflow/wp_spec_extractions/SX-WP-I5-002.md; .product/build_target/tool_artifacts/wp_runs/WP-I5-002/20260307_232719/; user sign-off approved via 2026-03-07 instruction to start `WP-I5-002` |

| WP-I6-002 | I6 | REQ-0700, REQ-0701, REQ-0702, REQ-0703, REQ-0704, REQ-0705, REQ-0706, REQ-0707, REQ-0708 | PRIM-0052, PRIM-0053 | .gov/workflow/wp_test_suites/TS-WP-I6-002.md | E2E-VERIFIED | .gov/workflow/wp_spec_extractions/SX-WP-I6-002.md; .product/build_target/tool_artifacts/wp_runs/WP-I6-002/20260308_012806/; user sign-off approved via 2026-03-08 instruction to continue unblocking the current packet either way |

| WP-I7-002 | I7 | REQ-0800, REQ-0801, REQ-0802, REQ-0803, REQ-0804, REQ-0805, REQ-0806, REQ-0807, REQ-0808, REQ-0809, REQ-0810 | PRIM-0054, PRIM-0055 | .gov/workflow/wp_test_suites/TS-WP-I7-002.md | E2E-VERIFIED | .gov/workflow/wp_spec_extractions/SX-WP-I7-002.md; .product/build_target/tool_artifacts/wp_runs/WP-I7-002/20260308_060255/; user sign-off approved via 2026-03-08 instruction to continue WP-I7-002 and complete the packet |

| WP-I10-002 | I10 | REQ-1100, REQ-1101, REQ-1102, REQ-1103, REQ-1104, REQ-1105, REQ-1106, REQ-1107, REQ-1108, REQ-1109, REQ-1110, REQ-1111, REQ-1112, REQ-1113 | PRIM-0058, PRIM-0059 | .gov/workflow/wp_test_suites/TS-WP-I10-002.md | E2E-VERIFIED | .gov/workflow/wp_spec_extractions/SX-WP-I10-002.md; proof: `.product/build_target/tool_artifacts/wp_runs/WP-I10-002/20260308_191502/`; user sign-off approved via 2026-03-08 instruction to continue remediation work |

| WP-I8-002 | I8 | REQ-0900, REQ-0901, REQ-0902, REQ-0903, REQ-0904 | PRIM-0062 | .gov/workflow/wp_test_suites/TS-WP-I8-002.md | E2E-VERIFIED | .gov/workflow/wp_spec_extractions/SX-WP-I8-002.md; proof: .product/build_target/tool_artifacts/wp_runs/WP-I8-002/20260308_154423/; user sign-off approved via 2026-03-08 instruction to start and continue this packet |

| WP-I9-002 | I9 | REQ-1000, REQ-1001, REQ-1002, REQ-1003 | PRIM-0056, PRIM-0057 | .gov/workflow/wp_test_suites/TS-WP-I9-002.md | E2E-VERIFIED | .gov/workflow/wp_spec_extractions/SX-WP-I9-002.md; proof: `.product/build_target/tool_artifacts/wp_runs/WP-I9-002/20260308_170238/`; user sign-off approved via 2026-03-08 instruction to start and continue this packet |

| WP-GOV-I1-RESEARCH-001 | I1 | REQ-0013, REQ-0019, REQ-0020, REQ-0021, REQ-0022 | PRIM-0031, PRIM-0063, PRIM-0064 | .gov/workflow/wp_test_suites/TS-WP-GOV-I1-RESEARCH-001.md | E2E-VERIFIED | .gov/workflow/wp_spec_extractions/SX-WP-GOV-I1-RESEARCH-001.md; .product/build_target/tool_artifacts/wp_runs/WP-GOV-I1-RESEARCH-001/20260307_031932/ |

| WP-GOV-DEPTH-001 | All | REQ-0013, REQ-0019, REQ-0020, REQ-0021, REQ-0022 | PRIM-0065, PRIM-0066 | .gov/workflow/wp_test_suites/TS-WP-GOV-DEPTH-001.md | E2E-VERIFIED | .gov/workflow/wp_spec_extractions/SX-WP-GOV-DEPTH-001.md; .product/build_target/tool_artifacts/wp_runs/WP-GOV-DEPTH-001/20260308_042222/; AGENTS.md; MODEL_BEHAVIOR.md; PROJECT_CODEX.md; .gov/workflow/GOVERNANCE_WORKFLOW.md |


| WP-GOV-PORT-002 | All | GATE-H, REQ-0018 | PRIM-0060, PRIM-0061, PRIM-0069 | .gov/workflow/wp_test_suites/TS-WP-GOV-PORT-002.md | SPEC-MAPPED | .gov/workflow/wp_spec_extractions/SX-WP-GOV-PORT-002.md |
