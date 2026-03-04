# StratAtlas - Project Codex (How to Operate This Repo)

Date: 2026-03-04

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
2. Choose or create a Work Packet.
3. Update the Task Board row for that WP.
4. Implement shippable product code in `.product/Worktrees/wt_main`.
5. Run preflight: `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1`.
6. Run the governance-sync checklist in `.gov/workflow/GOVERNANCE_WORKFLOW.md`.
7. Update the WP and Task Board with outcome, evidence, and next step.

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

## 6) Build Artifact Traceability

For desktop/build outputs:

- current outputs -> `.product/build_target/Current/`
- prior outputs -> `.product/build_target/Old versions/`
- build logs -> `.product/build_target/logs/`
- tool/script artifacts -> `.product/build_target/tool_artifacts/` (gitignored)

Every build should be attributable to a Work Packet and reflected on the Task Board.

## 7) Always-Maintained File Set

The following must stay synchronized at all times:

- `.gov/Spec/stratatlas_spec_v1_2.md`
- `.gov/Spec/REQUIREMENTS_INDEX.md`
- `.gov/Spec/TRACEABILITY_MATRIX.md`
- `.gov/workflow/ROADMAP.md`
- `.gov/workflow/taskboard/TASK_BOARD.md`
- `.gov/workflow/GOVERNANCE_WORKFLOW.md`
- `.gov/workflow/BUILD_READINESS_CHECKLIST.md`
- `PROJECT_CODEX.md`
- `AGENTS.md`
