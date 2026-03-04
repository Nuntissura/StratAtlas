# StratAtlas Build Readiness Checklist

Date: 2026-03-04

Use this before starting implementation work or cutting build outputs.

## Governance readiness

- [ ] `.gov/workflow/ROADMAP.md` reflects current build order.
- [ ] `.gov/workflow/taskboard/TASK_BOARD.md` has active/updated WP rows.
- [ ] `.gov/Spec/REQUIREMENTS_INDEX.md` statuses align with active work.
- [ ] `.gov/Spec/TRACEABILITY_MATRIX.md` mappings exist for active requirements.
- [ ] Relevant sub-spec exists under `.gov/Spec/sub-specs/` and is approved.

## Product/build readiness

- [ ] `.product/build_target/Current/` exists.
- [ ] `.product/build_target/Old versions/` exists.
- [ ] `.product/build_target/logs/` exists.
- [ ] `.product/build_target/tool_artifacts/` exists.
- [ ] Build output path and log path are known for the current WP.
- [ ] `.gitignore` contains rules for build/log/tool-artifact folders.

## Maintenance readiness

- [ ] `PROJECT_CODEX.md` still reflects workflow reality.
- [ ] `AGENTS.md` still reflects workflow and build-order rules.
- [ ] `MODEL_BEHAVIOR.md` remains aligned with spec and safety boundaries.

## Command

Run:

`powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1`

If failures are reported, resolve them before build work starts.
