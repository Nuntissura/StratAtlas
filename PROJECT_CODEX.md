# StratAtlas - Project Codex (How to Operate This Repo)

Date: 2026-03-06

This repository is intentionally split into two independent domains:

- `.gov/` = governance engine (requirements, policy, workflow, traceability)
- `.product/` = product engine (implementation and build outputs)

Keep this split explicit in every change.

## 1) Canonical Working Model

- Governance defines **what** is allowed and required.
- Product implements **how** requirements are delivered.
- If they conflict, governance artifacts are updated first, then product code follows.

## 1.1) Worktree and Branch Policy

- Canonical product worktree: `.product/Worktrees/wt_main`
- Canonical publish branch/worktree: `wt_main`
- Personal coder worktrees: `.product/Worktrees/wt_user_<name>`
- Parallel coders each get their own `wt_user_<name>` worktree + branch.
- Only `wt_main` is pushed to GitHub.

## 2) Single Source of Truth for Work

- Build order roadmap: `.gov/workflow/ROADMAP.md`
- Task board: `.gov/workflow/taskboard/TASK_BOARD.md`
- Work packets: `.gov/workflow/work_packets/WP-*.md`
- WP test suites: `.gov/workflow/wp_test_suites/TS-WP-*.md`
- WP spec extractions: `.gov/workflow/wp_spec_extractions/SX-WP-*.md`
- WP check scripts: `.gov/workflow/wp_checks/check-WP-*.ps1`
- Maintenance workflow: `.gov/workflow/GOVERNANCE_WORKFLOW.md`
- Readiness checklist: `.gov/workflow/BUILD_READINESS_CHECKLIST.md`

Execution loop:

1. Confirm sequence and scope against `.gov/workflow/ROADMAP.md`.
2. Choose or create the active Work Packet for the current iteration stage and confirm linked sub-spec (prefer `.gov/repo_scripts/new_work_packet.ps1`).
3. Update the Task Board row for that WP (status/owner/requirements/sub-spec).
4. Create/update the linked WP test suite (`.gov/workflow/wp_test_suites/`).
5. Create/update the linked WP spec extraction (`.gov/workflow/wp_spec_extractions/`) via `.gov/repo_scripts/update_wp_spec_extract.ps1`.
6. Ensure linked WP check script exists (`.gov/workflow/wp_checks/`) and executes via `.gov/repo_scripts/run_wp_checks.ps1`.
7. Update `REQUIREMENTS_INDEX.md`, `TRACEABILITY_MATRIX.md`, `PRIMITIVES_INDEX.md`, `PRIMITIVES_MATRIX.md`, and `TECH_STACK.md` if scope or architecture assumptions changed.
8. Create a governance checkpoint commit before product implementation (automatic when using `new_work_packet.ps1` unless `-SkipCheckpointCommit` is passed).
9. Implement shippable product code in `.product/Worktrees/wt_main`.
10. Run preflight: `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1`.
11. Enforce WP template compliance: `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/enforce_wp_template_compliance.ps1`.
12. Run the governance-sync checklist in `.gov/workflow/GOVERNANCE_WORKFLOW.md`.
13. Update WP/test suite/taskboard with outcome + proof artifact path (`.product/build_target/tool_artifacts/wp_runs/<WP-ID>/`).
14. For installer-impacting WPs, run `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/build_windows_installer.ps1` and record installer kit path + manifest in WP evidence.

If an iteration has multiple sequenced WPs:

- Keep the active packet set explicit in `ROADMAP.md` and `TASK_BOARD.md`.
- Treat the current blocking packet as the only packet eligible to drive requirement promotion.
- Downgrade requirement status when earlier packets only delivered scaffolding or prototype behavior.

## 3) Canonical Decision Files

- Product contract: `.gov/Spec/stratatlas_spec_v1_2.md`
- Requirements ledger: `.gov/Spec/REQUIREMENTS_INDEX.md`
- Requirement-to-implementation mapping: `.gov/Spec/TRACEABILITY_MATRIX.md`
- Primitive registry: `.gov/Spec/PRIMITIVES_INDEX.md`
- Primitive combination matrix: `.gov/Spec/PRIMITIVES_MATRIX.md`
- Spec process rules: `.gov/Spec/SPEC_GOVERNANCE.md`
- Stack decisions: `.gov/Spec/TECH_STACK.md`
- Build order and sequencing: `.gov/workflow/ROADMAP.md`
- Governance maintenance rules: `.gov/workflow/GOVERNANCE_WORKFLOW.md`
- Build readiness checklist: `.gov/workflow/BUILD_READINESS_CHECKLIST.md`
- Iteration sub-specs: `.gov/Spec/sub-specs/`
- AI coding behavior: `MODEL_BEHAVIOR.md`

## 4) Schism Policy (.gov vs .product)

- No runtime code in `.gov/`.
- No governance policy/spec workflow content in `.product/`.
- Link across domains; avoid duplicated source-of-truth text.
- Scope changes begin in `.gov` before implementation changes in `.product`.

## 5) Mission and Safety Alignment

StratAtlas is for strategic geospatial analysis and game-theory workflows.
Any change that conflicts with non-goals in `.gov/Spec/stratatlas_spec_v1_2.md` section 3.2 is out of scope and must not be implemented.

## 6) Performance and macOS-Portability Discipline

- Treat startup speed and change responsiveness as first-class requirements, not polish.
- Keep runtime paths and process handling platform-neutral to preserve Windows -> macOS portability.
- Avoid introducing Windows-only runtime dependencies in core product paths.
- Record startup/performance evidence in active Work Packets when relevant.

## 7) Build Artifact Traceability

For desktop/build outputs:

- current outputs -> `.product/build_target/Current/`
- prior outputs -> `.product/build_target/Old versions/`
- build logs -> `.product/build_target/logs/`
- tool/script artifacts -> `.product/build_target/tool_artifacts/` (gitignored)

Every build should be attributable to a Work Packet and reflected on the Task Board.

## 8) Installer Lifecycle Contract (Windows)

When Windows installer behavior changes, governance and product must stay aligned to spec Section 5.2:

- Supported operations: `uninstall`, `repair`, `full-repair`, `update`, `downgrade`
- `repair` preserves user presets/data
- `full-repair` performs clean reinstall with backup/restore by default and explicit data-drop option
- `update` rejects non-newer packages
- `downgrade` is explicit and auditable
- Installer and EXE version must match for the same build; `build_windows_installer.ps1` is the canonical version-bump path.

Implementation anchors:

- `.product/Worktrees/wt_main/src-tauri/tauri.conf.json`
- `.product/Worktrees/wt_main/scripts/windows-installer-maintenance.ps1`
- `.gov/repo_scripts/build_windows_installer.ps1`
- `.product/Worktrees/wt_main/docs/INSTALLER_LIFECYCLE.md`

## 9) Always-Maintained File Set

The following must stay synchronized at all times:

- `.gov/Spec/stratatlas_spec_v1_2.md`
- `.gov/Spec/REQUIREMENTS_INDEX.md`
- `.gov/Spec/TRACEABILITY_MATRIX.md`
- `.gov/Spec/PRIMITIVES_INDEX.md`
- `.gov/Spec/PRIMITIVES_MATRIX.md`
- `.gov/Spec/SPEC_GOVERNANCE.md`
- `.gov/Spec/TECH_STACK.md`
- `.gov/workflow/ROADMAP.md`
- `.gov/workflow/taskboard/TASK_BOARD.md`
- `.gov/workflow/wp_test_suites/`
- `.gov/workflow/wp_spec_extractions/`
- `.gov/workflow/wp_checks/`
- `.gov/workflow/GOVERNANCE_WORKFLOW.md`
- `.gov/workflow/BUILD_READINESS_CHECKLIST.md`
- `PROJECT_CODEX.md`
- `AGENTS.md`
- `MODEL_BEHAVIOR.md`

## 10) Done Standard

- `E2E-VERIFIED` is the only done state.
- `IMPLEMENTED` means code and lower-level checks exist, but not done.
- No WP may be promoted to `E2E-VERIFIED` without linked evidence and explicit user sign-off in WP + test-suite artifacts.
- Never overstate implementation state: every claim must cite proof artifacts and command evidence.
