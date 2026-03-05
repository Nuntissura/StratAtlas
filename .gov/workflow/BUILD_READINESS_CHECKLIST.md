# StratAtlas Build Readiness Checklist

Date: 2026-03-05

Use this before starting implementation work or cutting build outputs.

## Governance readiness

- [ ] `.gov/workflow/ROADMAP.md` reflects current build order.
- [ ] `.gov/workflow/taskboard/TASK_BOARD.md` has active/updated WP rows.
- [ ] Roadmap iteration rows and Task Board rows reference the same WP IDs and sub-spec files.
- [ ] `.gov/Spec/REQUIREMENTS_INDEX.md` statuses align with active work.
- [ ] `.gov/Spec/TRACEABILITY_MATRIX.md` mappings exist for active requirements.
- [ ] `.gov/Spec/TECH_STACK.md` reflects current stack/runtime assumptions for active scope.
- [ ] Relevant sub-spec exists under `.gov/Spec/sub-specs/` and is approved.

## Product/build readiness

- [ ] `.product/Worktrees/wt_main/` exists and is the active publish worktree.
- [ ] Personal/parallel work happens in `.product/Worktrees/wt_user_<name>/` worktrees.
- [ ] Only `wt_main` changes are prepared for GitHub push.
- [ ] `.product/build_target/Current/` exists.
- [ ] `.product/build_target/Old versions/` exists.
- [ ] `.product/build_target/logs/` exists.
- [ ] `.product/build_target/tool_artifacts/` exists.
- [ ] Build output path and log path are known for the current WP.
- [ ] `.gitignore` contains rules for build/log/tool-artifact folders.
- [ ] `.gitignore` ignores `.product/Worktrees/wt_user_*/**`.
- [ ] Startup budget evidence plan exists (cold/warm launch + state-change feedback targets).
- [ ] No new Windows-only runtime path assumptions were introduced in core code paths.
- [ ] macOS smoke-test plan is recorded for the active iteration/WP.

## Maintenance readiness

- [ ] `PROJECT_CODEX.md` still reflects workflow reality.
- [ ] `AGENTS.md` still reflects workflow and build-order rules.
- [ ] `MODEL_BEHAVIOR.md` remains aligned with spec and safety boundaries.
- [ ] `SPEC_GOVERNANCE.md` still matches actual sync and maintenance process.

## Command

Run:

`powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1`

If failures are reported, resolve them before build work starts.
