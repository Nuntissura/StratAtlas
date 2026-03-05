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
- `.gov/Spec/PRIMITIVES_INDEX.md`
- `.gov/Spec/PRIMITIVES_MATRIX.md`
- `.gov/Spec/SPEC_GOVERNANCE.md`
- `.gov/Spec/TECH_STACK.md`
- `.gov/workflow/ROADMAP.md`
- `.gov/workflow/GOVERNANCE_WORKFLOW.md`
- `.gov/workflow/BUILD_READINESS_CHECKLIST.md`
- `.gov/workflow/taskboard/TASK_BOARD.md`
- `.gov/workflow/wp_test_suites/`
- `.gov/Spec/sub-specs/`

If these disagree with implementation, reconcile governance intent first.

## 3) Work Packet Discipline

- Work should map to `.gov/workflow/work_packets/WP-*.md`.
- Every WP MUST have a linked spec-vs-code suite in `.gov/workflow/wp_test_suites/TS-WP-*.md`.
- Status belongs on `.gov/workflow/taskboard/TASK_BOARD.md`.
- Scope changes require governance updates before product implementation.
- Iteration sequencing must follow `.gov/workflow/ROADMAP.md` unless governance explicitly changes it.
- Apply the checklist in `.gov/workflow/GOVERNANCE_WORKFLOW.md` on every relevant PR.
- Before implementation/build work, run `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1`.
- Prefer WP creation via `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/new_work_packet.ps1` (creates linked test suite and checkpoint commit by default; use `-SkipCheckpointCommit` only when explicitly needed).
- Before product implementation, create a governance checkpoint commit (for crash/session-reset resilience).
- Only `E2E-VERIFIED` means done; `IMPLEMENTED` does not.

## 4) Product Worktree and Build Target Policy

- Shippable product coding is done in `.product/Worktrees/wt_main`.
- `wt_main` is the canonical product worktree and branch for GitHub publication.
- `wt_user_*` worktrees are personal/local coding sandboxes (for example: `wt_user_ilja`).
- Additional coders should each use their own `wt_user_<name>` worktree + branch for parallel work.
- Only `wt_main` changes are pushed to GitHub.
- Build outputs go to `.product/build_target/Current/`.
- Previous outputs are archived under `.product/build_target/Old versions/`.
- Build logs go to `.product/build_target/logs/`.
- Tool/scanner/script outputs go to `.product/build_target/tool_artifacts/`.
- Contents of build target artifact folders must remain gitignored (except `.gitkeep` placeholders).

## 4.1 Startup Performance and Portability Rules

- Prioritize startup speed and state-change responsiveness as core quality targets.
- Keep runtime code portable to macOS: avoid hard-coded Windows paths/separators in core product paths.
- Do not add Windows-only runtime dependencies in core paths unless isolated behind an approved platform adapter.
- When performance-sensitive behavior changes, update WP evidence and traceability references accordingly.

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
- Keep `PROJECT_CODEX.md`, `AGENTS.md`, and `MODEL_BEHAVIOR.md` aligned with current workflow rules.
- Keep `REQUIREMENTS_INDEX.md`, `TRACEABILITY_MATRIX.md`, `PRIMITIVES_INDEX.md`, `PRIMITIVES_MATRIX.md`, and `TECH_STACK.md` current whenever scope, verification, or runtime assumptions change.
