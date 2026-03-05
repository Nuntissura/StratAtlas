# StratAtlas - Project Codex (How to Operate This Repo)

Date: 2026-03-05

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
- Maintenance workflow: `.gov/workflow/GOVERNANCE_WORKFLOW.md`
- Readiness checklist: `.gov/workflow/BUILD_READINESS_CHECKLIST.md`

Execution loop:

1. Confirm sequence and scope against `.gov/workflow/ROADMAP.md`.
2. Choose or create a Work Packet and confirm linked sub-spec.
3. Update the Task Board row for that WP (status/owner/requirements/sub-spec).
4. Update `REQUIREMENTS_INDEX.md`, `TRACEABILITY_MATRIX.md`, and `TECH_STACK.md` if scope or architecture assumptions changed.
5. Implement shippable product code in `.product/Worktrees/wt_main`.
6. Run preflight: `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1`.
7. Run the governance-sync checklist in `.gov/workflow/GOVERNANCE_WORKFLOW.md`.
8. Update the WP and Task Board with outcome, evidence, and next step.

## 3) Canonical Decision Files

- Product contract: `.gov/Spec/stratatlas_spec_v1_2.md`
- Requirements ledger: `.gov/Spec/REQUIREMENTS_INDEX.md`
- Requirement-to-implementation mapping: `.gov/Spec/TRACEABILITY_MATRIX.md`
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

## 8) Always-Maintained File Set

The following must stay synchronized at all times:

- `.gov/Spec/stratatlas_spec_v1_2.md`
- `.gov/Spec/REQUIREMENTS_INDEX.md`
- `.gov/Spec/TRACEABILITY_MATRIX.md`
- `.gov/Spec/SPEC_GOVERNANCE.md`
- `.gov/Spec/TECH_STACK.md`
- `.gov/workflow/ROADMAP.md`
- `.gov/workflow/taskboard/TASK_BOARD.md`
- `.gov/workflow/GOVERNANCE_WORKFLOW.md`
- `.gov/workflow/BUILD_READINESS_CHECKLIST.md`
- `PROJECT_CODEX.md`
- `AGENTS.md`
- `MODEL_BEHAVIOR.md`
