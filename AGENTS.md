# Repo Agent Notes (StratAtlas)

## Scope

These rules apply to the full repository unless a deeper directory adds stricter instructions.

## 1) Hard Split: Governance vs Product

- `.gov/` is governance only (spec, requirements, traceability, workflow, templates, audits, scripts).
- `.product/` is product only (code worktrees, build outputs, packaging artifacts).
- Do not mix domains.

## 2) Canonical Governance Files

- `.gov/Spec/stratatlas_spec_v1_2.md`
- `.gov/Spec/REQUIREMENTS_INDEX.md`
- `.gov/Spec/TRACEABILITY_MATRIX.md`
- `.gov/Spec/SPEC_GOVERNANCE.md`
- `.gov/Spec/TECH_STACK.md`
- `.gov/workflow/ROADMAP.md`
- `.gov/workflow/GOVERNANCE_WORKFLOW.md`
- `.gov/workflow/BUILD_READINESS_CHECKLIST.md`
- `.gov/workflow/taskboard/TASK_BOARD.md`
- `.gov/Spec/sub-specs/`

If these disagree with implementation, reconcile governance intent first.

## 3) Work Packet Discipline

- Work should map to `.gov/workflow/work_packets/WP-*.md`.
- Status belongs on `.gov/workflow/taskboard/TASK_BOARD.md`.
- Scope changes require governance updates before product implementation.
- Iteration sequencing must follow `.gov/workflow/ROADMAP.md` unless governance explicitly changes it.
- Apply the checklist in `.gov/workflow/GOVERNANCE_WORKFLOW.md` on every relevant PR.
- Before implementation/build work, run `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1`.

## 4) Product Worktree and Build Target Policy

- Implementation happens under `.product/Worktrees/` (`wt_main` or `wt_user_*`).
- Build outputs go to `.product/build_target/Current/`.
- Previous outputs are archived under `.product/build_target/Old versions/`.
- Build logs go to `.product/build_target/logs/`.
- Tool/scanner/script outputs go to `.product/build_target/tool_artifacts/`.
- Contents of build target artifact folders must remain gitignored (except `.gitkeep` placeholders).

## 5) Safety Boundaries (Spec Section 3.2)

Do not implement:

- individual targeting or stalking workflows
- covert affiliation inference
- social media scraping ingestion
- leaked/hacked/scraped-against-terms data pipelines
- financial trading or prediction tooling

## 6) Data Handling Defaults

- Preserve provenance, sensitivity markings, and auditability by default.
- Prefer additive and reversible updates over destructive edits.
- Keep generated artifacts out of governance folders unless they are governance artifacts by design.

## 7) Always-Maintained Sentiment

- Treat roadmap and build order as living governance artifacts, not one-time docs.
- Keep `PROJECT_CODEX.md` and `AGENTS.md` aligned with current workflow rules.
