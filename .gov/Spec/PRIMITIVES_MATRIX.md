# StratAtlas - Primitives Matrix

**Spec Version:** v1.2.3  
**Last Updated:** 2026-03-06  
**Purpose:** Map primitives to work packets, implementation modules, tests, and technology/tool combinations.

---

## Matrix Format

```
PRIM-ID | WP | REQs | Components | Tests | Tech/Tools | Combined With | Verification Tier | Last Verified
```

---

## Primitive Coverage Matrix

| Primitive ID | WP | REQs | Components | Tests | Tech/Tools | Combined With | Verification Tier | Last Verified |
|--------------|----|------|------------|-------|------------|---------------|-------------------|---------------|
| PRIM-0001 | WP-I0-001 | REQ-0101..REQ-0105 | src/contracts/i0.ts, src/lib/backend.ts, src-tauri/src/lib.rs | src/lib/backend.test.ts, src/App.test.tsx | Tauri, TypeScript, Rust | PRIM-0002, PRIM-0003, PRIM-0004 | IMPLEMENTED | 2026-03-05 |
| PRIM-0002 | WP-I0-001 | REQ-0010, REQ-0106, REQ-0107 | src/lib/backend.ts, src-tauri/src/lib.rs | src/lib/backend.test.ts, src-tauri/src/lib.rs (unit tests) | SHA-256, Tauri invoke | PRIM-0001 | IMPLEMENTED | 2026-03-05 |
| PRIM-0003 | WP-I0-001 | REQ-0008, REQ-0011 | src/contracts/i0.ts, src/App.tsx | src/App.test.tsx | React, TypeScript | PRIM-0001, PRIM-0004 | IMPLEMENTED | 2026-03-05 |
| PRIM-0004 | WP-I0-001 | REQ-0009 | src/contracts/i0.ts, src/App.tsx | src/lib/backend.test.ts | TypeScript | PRIM-0001, PRIM-0003 | IMPLEMENTED | 2026-03-05 |
| PRIM-0005 | WP-I1-001 | REQ-0200 | src/features/i1/modes.ts, src/App.tsx | src/features/i1/i1.test.ts, src/App.test.tsx | React, Vitest | PRIM-0006 | IMPLEMENTED | 2026-03-05 |
| PRIM-0006 | WP-I1-001 | REQ-0201 | src/features/i1/modes.ts, src/App.tsx | src/features/i1/i1.test.ts | React | PRIM-0005, PRIM-0009 | IMPLEMENTED | 2026-03-05 |
| PRIM-0007 | WP-I1-001 | REQ-0202, REQ-0203 | src/features/i1/layers.ts | src/features/i1/i1.test.ts | TypeScript | PRIM-0008 | IMPLEMENTED | 2026-03-05 |
| PRIM-0008 | WP-I1-001 | REQ-0204, REQ-0205 | src/features/i1/plugins.ts | src/features/i1/i1.test.ts | TypeScript | PRIM-0007 | IMPLEMENTED | 2026-03-05 |
| PRIM-0009 | WP-I1-001 | REQ-0014..REQ-0016, REQ-0206..REQ-0211 | src/features/i1/performance.ts | src/features/i1/i1.test.ts | TypeScript, Vitest | PRIM-0006 | IMPLEMENTED | 2026-03-05 |
| PRIM-0010 | WP-I2-001 | REQ-0300, REQ-0301 | src/features/i2/baselineDelta.ts | src/features/i2/i2.test.ts | TypeScript | PRIM-0011 | IMPLEMENTED | 2026-03-05 |
| PRIM-0011 | WP-I2-001 | REQ-0302 | src/features/i2/baselineDelta.ts | src/features/i2/i2.test.ts | TypeScript | PRIM-0010 | IMPLEMENTED | 2026-03-05 |
| PRIM-0012 | WP-I3-001 | REQ-0400..REQ-0403 | src/features/i3/collaboration.ts | src/features/i3/i3.test.ts | Yjs, TypeScript | PRIM-0002 | IMPLEMENTED | 2026-03-05 |
| PRIM-0013 | WP-I4-001 | REQ-0500..REQ-0504 | src/features/i4/scenarios.ts | src/features/i4/i4.test.ts | TypeScript | PRIM-0019 | IMPLEMENTED | 2026-03-05 |
| PRIM-0014 | WP-I5-001 | REQ-0600..REQ-0604 | src/features/i5/queryBuilder.ts | src/features/i5/i5.test.ts | TypeScript | PRIM-0016 | IMPLEMENTED | 2026-03-05 |
| PRIM-0015 | WP-I6-001 | REQ-0700..REQ-0708 | src/features/i6/aiGateway.ts | src/features/i6/i6.test.ts | TypeScript | PRIM-0001, PRIM-0014 | IMPLEMENTED | 2026-03-05 |
| PRIM-0016 | WP-I7-001 | REQ-0800..REQ-0810 | src/features/i7/contextIntake.ts | src/features/i7/i7.test.ts | TypeScript | PRIM-0010, PRIM-0018 | IMPLEMENTED | 2026-03-05 |
| PRIM-0017 | WP-I8-001 | REQ-0900..REQ-0904 | src/features/i8/deviation.ts | src/features/i8/i8.test.ts | TypeScript | PRIM-0016 | IMPLEMENTED | 2026-03-05 |
| PRIM-0018 | WP-I9-001 | REQ-1000..REQ-1003 | src/features/i9/osint.ts | src/features/i9/i9.test.ts | TypeScript | PRIM-0016, PRIM-0017 | IMPLEMENTED | 2026-03-05 |
| PRIM-0019 | WP-I10-001 | REQ-1100..REQ-1113 | src/features/i10/gameModeling.ts | src/features/i10/i10.test.ts | TypeScript | PRIM-0013 | IMPLEMENTED | 2026-03-05 |

---

## Maintenance Rules

1. Every new WP must add at least one row to this matrix.
2. Every `Linked Primitives` entry in a WP must exist in `PRIMITIVES_INDEX.md`.
3. `E2E-VERIFIED` may be used only with linked evidence in WP and test-suite artifacts.
4. Matrix updates are required whenever components/tests/technology combinations change.


| PRIM-0020 | WP-GOV-LOOP-001 | REQ-0019, REQ-0022 | .gov/workflow/wp_spec_extractions/SX-WP-*.md; .gov/repo_scripts/update_wp_spec_extract.ps1 | .gov/repo_scripts/enforce_wp_template_compliance.ps1 | PowerShell, Markdown | PRIM-0021, PRIM-0022 | IMPLEMENTED | 2026-03-06 |
| PRIM-0021 | WP-GOV-LOOP-001 | REQ-0019, REQ-0020 | .gov/workflow/wp_checks/check-WP-*.ps1; .gov/repo_scripts/run_wp_checks.ps1 | .gov/repo_scripts/run_wp_checks.ps1 | PowerShell, pnpm, cargo | PRIM-0020, PRIM-0023 | IMPLEMENTED | 2026-03-06 |
| PRIM-0022 | WP-GOV-LOOP-001 | REQ-0020 | .gov/workflow/work_packets/WP-*.md; .product/build_target/tool_artifacts/wp_runs/* | .gov/repo_scripts/enforce_wp_template_compliance.ps1 | Markdown, JSON artifacts | PRIM-0021 | IMPLEMENTED | 2026-03-06 |
| PRIM-0023 | WP-GOV-LOOP-001 | REQ-0021 | .gov/repo_scripts/enforce_wp_template_compliance.ps1; .gov/repo_scripts/governance_preflight.ps1 | .gov/repo_scripts/governance_preflight.ps1 | PowerShell regex validators | PRIM-0020, PRIM-0021 | IMPLEMENTED | 2026-03-06 |

| PRIM-0024 | WP-GOV-INSTALLER-001 | REQ-0023, REQ-0024, REQ-0028, REQ-0031 | src-tauri/tauri.conf.json | .gov/workflow/wp_checks/check-WP-GOV-INSTALLER-001.ps1 | Tauri bundle config (WiX + NSIS) | PRIM-0025, PRIM-0027 | IMPLEMENTED | 2026-03-06 |
| PRIM-0025 | WP-GOV-INSTALLER-001 | REQ-0023, REQ-0024, REQ-0025, REQ-0026, REQ-0027, REQ-0028 | scripts/windows-installer-maintenance.ps1 | .gov/workflow/wp_checks/check-WP-GOV-INSTALLER-001.ps1 | PowerShell, msiexec, Windows registry | PRIM-0024, PRIM-0026, PRIM-0027 | IMPLEMENTED | 2026-03-06 |
| PRIM-0026 | WP-GOV-INSTALLER-001 | REQ-0025, REQ-0026 | scripts/windows-installer-maintenance.ps1 | .gov/workflow/wp_checks/check-WP-GOV-INSTALLER-001.ps1 | PowerShell file copy/restore under AppData | PRIM-0025 | IMPLEMENTED | 2026-03-06 |
| PRIM-0027 | WP-GOV-INSTALLER-001 | REQ-0027, REQ-0028 | scripts/windows-installer-maintenance.ps1; src-tauri/tauri.conf.json | .gov/workflow/wp_checks/check-WP-GOV-INSTALLER-001.ps1 | MSI version introspection + WiX downgrade policy | PRIM-0024, PRIM-0025 | IMPLEMENTED | 2026-03-06 |
| PRIM-0028 | WP-GOV-INSTALLER-001 | REQ-0023, REQ-0029, REQ-0030, REQ-0031 | .gov/repo_scripts/build_windows_installer.ps1; docs/INSTALLER_LIFECYCLE.md | .gov/workflow/wp_checks/check-WP-GOV-INSTALLER-001.ps1 | PowerShell build orchestration, SHA256 manifest | PRIM-0024, PRIM-0025 | IMPLEMENTED | 2026-03-06 |
| PRIM-0029 | WP-GOV-REALIGN-001 | REQ-0013, REQ-0020, REQ-0021, REQ-0022 | .gov/Spec/stratatlas_spec_v1_2.md; .gov/Spec/REQUIREMENTS_INDEX.md; .gov/workflow/taskboard/TASK_BOARD.md | .gov/workflow/wp_checks/check-WP-GOV-REALIGN-001.ps1 | Markdown ledgers, PowerShell governance checks | PRIM-0030, PRIM-0031 | IMPLEMENTED | 2026-03-06 |
| PRIM-0030 | WP-GOV-REALIGN-001 | REQ-0013, REQ-0019, REQ-0021 | .gov/workflow/ROADMAP.md; .gov/Spec/SPEC_GOVERNANCE.md; .gov/workflow/GOVERNANCE_WORKFLOW.md | .gov/workflow/wp_checks/check-WP-GOV-REALIGN-001.ps1 | Markdown workflow rules, PowerShell preflight/compliance | PRIM-0029, PRIM-0031 | IMPLEMENTED | 2026-03-06 |
| PRIM-0031 | WP-GOV-REALIGN-001 | REQ-0019, REQ-0020, REQ-0022 | .gov/Spec/TRACEABILITY_MATRIX.md; PROJECT_CODEX.md; AGENTS.md; MODEL_BEHAVIOR.md | .gov/workflow/wp_checks/check-WP-GOV-REALIGN-001.ps1 | Markdown traceability and operator instructions | PRIM-0029, PRIM-0030 | IMPLEMENTED | 2026-03-06 |
| PRIM-0032 | WP-I0-002 | REQ-0008, REQ-0009, REQ-0010, REQ-0101..REQ-0112, REQ-0808 | src/contracts/i0.ts; src/lib/backend.ts; src-tauri/src/lib.rs | src/lib/backend.test.ts; src/App.test.tsx; src-tauri/src/lib.rs (unit tests) | TypeScript, Tauri invoke, Rust persistence | PRIM-0033, PRIM-0034 | IMPLEMENTED | 2026-03-06 |
| PRIM-0033 | WP-I0-002 | REQ-0008, REQ-0009, REQ-0010, REQ-0101..REQ-0112 | src/contracts/i0.ts; src/lib/backend.ts; src-tauri/src/lib.rs | src/lib/backend.test.ts; src-tauri/src/lib.rs (unit tests) | SHA-256 asset manifests, Rust recorder | PRIM-0032, PRIM-0034 | IMPLEMENTED | 2026-03-06 |
| PRIM-0034 | WP-I0-002 | REQ-0101..REQ-0112, REQ-0808 | src/App.tsx; src/lib/backend.ts; src-tauri/src/lib.rs | src/App.test.tsx; src/lib/backend.test.ts | React state serialization, TypeScript contracts, Rust persistence | PRIM-0032, PRIM-0033 | IMPLEMENTED | 2026-03-06 |
| PRIM-0035 | WP-I1-002 | REQ-0200, REQ-0201, REQ-0202 | src/App.tsx; src/App.css | src/App.test.tsx | React, TypeScript, CSS layout | PRIM-0036, PRIM-0037 | SPEC-MAPPED | 2026-03-06 |
| PRIM-0036 | WP-I1-002 | REQ-0011, REQ-0012, REQ-0804, REQ-0805 | src/App.tsx; src/features/i1/layers.ts | src/App.test.tsx; src/features/i1/i1.test.ts | React labels, policy metadata | PRIM-0035, PRIM-0037 | SPEC-MAPPED | 2026-03-06 |
| PRIM-0037 | WP-I1-002 | REQ-0014..REQ-0016, REQ-0202..REQ-0212 | src/features/i1/layers.ts; src/features/i1/performance.ts; src/App.tsx | src/features/i1/i1.test.ts; src/App.test.tsx | Layer registry contracts, performance telemetry, React feedback states | PRIM-0035, PRIM-0036 | SPEC-MAPPED | 2026-03-06 |
