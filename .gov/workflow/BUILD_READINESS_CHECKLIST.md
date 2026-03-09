# StratAtlas Build Readiness Checklist

Date: 2026-03-05

Use this before starting implementation work or cutting build outputs.

## Governance readiness

- [ ] `.gov/workflow/ROADMAP.md` reflects current build order.
- [ ] `.gov/workflow/taskboard/TASK_BOARD.md` has current WP rows and truthful statuses.
- [ ] Roadmap and task board rows reference the same WP IDs and sub-spec files.
- [ ] `.gov/Spec/REQUIREMENTS_INDEX.md` statuses align with real implementation maturity.
- [ ] `.gov/Spec/TRACEABILITY_MATRIX.md` mappings exist for active requirements.
- [ ] `.gov/Spec/PRIMITIVES_INDEX.md` is current for linked primitives.
- [ ] `.gov/Spec/PRIMITIVES_MATRIX.md` is current for primitive combinations.
- [ ] `.gov/Spec/TECH_STACK.md` reflects stack/runtime assumptions for active scope.
- [ ] Relevant sub-spec exists under `.gov/Spec/sub-specs/` and is approved.
- [ ] Linked WP test suite exists under `.gov/workflow/wp_test_suites/`.
- [ ] Governance kickoff checkpoint commit was made.

## Product/build readiness

- [ ] `.product/Worktrees/wt_main/` exists and is the active publish worktree.
- [ ] Personal/parallel work happens in `.product/Worktrees/wt_user_<name>/` worktrees.
- [ ] Only `wt_main` changes are prepared for GitHub push.
- [ ] `.product/build_target/Releases/Current/Installers/` exists.
- [ ] `.product/build_target/Releases/Current/Portable/` exists.
- [ ] `.product/build_target/Releases/Current/InstallerKit/` exists.
- [ ] `.product/build_target/Releases/Archive/` exists.
- [ ] `.product/build_target/logs/` exists.
- [ ] `.product/build_target/tool_artifacts/` exists.
- [ ] `.gov/workflow/changelog/` exists.
- [ ] Build output path and log path are known for the current WP.
- [ ] `.gitignore` contains rules for release/build/log/tool-artifact folders and installer/exe binaries.
- [ ] `.gitignore` ignores `.product/Worktrees/wt_user_*/**`.
- [ ] Startup budget evidence plan exists.
- [ ] No new Windows-only runtime assumptions were introduced in core paths.
- [ ] macOS smoke-test plan is recorded for active WP scope.

## Verification readiness

- [ ] Dependency tests planned.
- [ ] UI contract tests planned.
- [ ] Functional flow tests planned.
- [ ] Code correctness tests planned.
- [ ] Red-team/non-goal tests planned.
- [ ] Additional tests planned (performance/offline/reliability/etc.).

## Command

Run:

`powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1`

If failures are reported, resolve them before build work starts.
