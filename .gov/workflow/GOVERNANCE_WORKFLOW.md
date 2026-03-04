# StratAtlas - Governance Workflow (Always-Maintained)

Date: 2026-03-04

This file defines the minimum workflow that keeps governance artifacts continuously accurate.

---

## 1) Always-Maintained Governance Set

The following files are mandatory and must stay synchronized:

- `.gov/Spec/stratatlas_spec_v1_2.md`
- `.gov/Spec/REQUIREMENTS_INDEX.md`
- `.gov/Spec/TRACEABILITY_MATRIX.md`
- `.gov/Spec/SPEC_GOVERNANCE.md`
- `.gov/workflow/ROADMAP.md`
- `.gov/workflow/BUILD_READINESS_CHECKLIST.md`
- `.gov/workflow/taskboard/TASK_BOARD.md`
- `PROJECT_CODEX.md`
- `AGENTS.md`
- `MODEL_BEHAVIOR.md`

---

## 2) Mandatory Update Triggers

### Trigger A: Spec change

When `.gov/Spec/stratatlas_spec_v1_2.md` changes:

1. Update `REQUIREMENTS_INDEX.md` (new/changed/deprecated requirements).
2. Update `TRACEABILITY_MATRIX.md` (component/test mappings).
3. Update `ROADMAP.md` if sequencing/scope changed.
4. Update `PROJECT_CODEX.md` and `AGENTS.md` if operating rules changed.

### Trigger B: Iteration activation

When an iteration moves from planned to active:

1. Create/activate WP files in `.gov/workflow/work_packets/`.
2. Update `.gov/workflow/taskboard/TASK_BOARD.md` with owner/scope/status.
3. Move relevant requirement statuses to `SUB-SPEC` or `IN-PROGRESS`.

### Trigger C: Implementation merge

When product work merges:

1. Update Task Board status/evidence.
2. Update requirement statuses (`IN-PROGRESS` -> `DONE`/`VERIFIED` when applicable).
3. Update traceability rows for affected requirements.

### Trigger D: Roadmap/order change

When build order changes:

1. Update `.gov/workflow/ROADMAP.md`.
2. Update Task Board sequencing.
3. Update any impacted requirement targets in the index.
4. Reflect process changes in `PROJECT_CODEX.md` and `AGENTS.md`.

---

## 3) Cadence

- **Per PR touching `.product/`:** governance-sync check required before merge.
- **Per PR touching `.product/`:** run `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1`.
- **Weekly governance sweep:** verify roadmap, taskboard, index, and traceability are in sync.
- **Iteration close-out:** verify gate status and evidence links before marking complete.

---

## 4) Governance-Sync Checklist (Use in Every Relevant PR)

- [ ] Work maps to an active Work Packet.
- [ ] Task Board row exists and is current.
- [ ] Requirement statuses match real implementation state.
- [ ] Traceability entries exist for changed requirements.
- [ ] Roadmap order is still accurate.
- [ ] Build readiness checklist remains accurate.
- [ ] Product publish changes are sourced from `.product/Worktrees/wt_main` (not `wt_user_*`).
- [ ] `PROJECT_CODEX.md` and `AGENTS.md` still reflect current workflow.
