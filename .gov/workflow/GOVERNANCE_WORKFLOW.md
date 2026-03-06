# StratAtlas - Governance Workflow (Always-Maintained)

Date: 2026-03-05

This file defines the required workflow that keeps governance artifacts truthful, synchronized, and crash-resilient.

---

## 1) Always-Maintained Governance Set

The following files are mandatory and must stay synchronized:

- `.gov/Spec/stratatlas_spec_v1_2.md`
- `.gov/Spec/REQUIREMENTS_INDEX.md`
- `.gov/Spec/TRACEABILITY_MATRIX.md`
- `.gov/Spec/PRIMITIVES_INDEX.md`
- `.gov/Spec/PRIMITIVES_MATRIX.md`
- `.gov/Spec/SPEC_GOVERNANCE.md`
- `.gov/Spec/TECH_STACK.md`
- `.gov/workflow/ROADMAP.md`
- `.gov/workflow/BUILD_READINESS_CHECKLIST.md`
- `.gov/workflow/taskboard/TASK_BOARD.md`
- `.gov/workflow/work_packets/WP-*.md`
- `.gov/workflow/wp_test_suites/TS-WP-*.md`
- `.gov/workflow/wp_spec_extractions/SX-WP-*.md`
- `.gov/workflow/wp_checks/check-WP-*.ps1`
- `PROJECT_CODEX.md`
- `AGENTS.md`
- `MODEL_BEHAVIOR.md`

---

## 2) One Done Standard

Only one state means "done":

- `E2E-VERIFIED`: Runtime behavior is proven end-to-end against spec with linked evidence and user sign-off.

`IMPLEMENTED` means code and lower-level tests exist, but it is not done.

---

## 3) Status Model (Required)

Use these statuses in WPs, task board rows, and requirement tracking:

- `SPEC-MAPPED`
- `IN-PROGRESS`
- `IMPLEMENTED`
- `E2E-VERIFIED`
- `BLOCKED`
- `RECURRING` (governance maintenance only)

---

## 4) Mandatory Update Triggers

### Trigger A: Spec change

When `.gov/Spec/stratatlas_spec_v1_2.md` changes:

1. Update `REQUIREMENTS_INDEX.md`.
2. Update `TRACEABILITY_MATRIX.md`.
3. Update `PRIMITIVES_INDEX.md` and `PRIMITIVES_MATRIX.md` when primitive contracts or combinations changed.
4. Update `TECH_STACK.md` if architecture/runtime dependency expectations changed.
5. Update `ROADMAP.md` if sequencing/scope changed.
6. Update `PROJECT_CODEX.md`, `AGENTS.md`, and `MODEL_BEHAVIOR.md` if operating rules changed.

### Trigger B: New or activated WP

When a WP is created or activated:

1. Create WP from template (or via `.gov/repo_scripts/new_work_packet.ps1`).
2. Create linked test suite in `.gov/workflow/wp_test_suites/`.
3. Create/update linked spec extraction in `.gov/workflow/wp_spec_extractions/` (use `.gov/repo_scripts/update_wp_spec_extract.ps1`).
4. Create linked check script in `.gov/workflow/wp_checks/` (delegating to `.gov/repo_scripts/run_wp_checks.ps1`).
5. Update task board row (owner/scope/status/sub-spec/requirements).
6. Update traceability WP coverage section.
7. Update primitives index and primitives matrix.
8. Create a governance checkpoint commit before product implementation (automatic when using `new_work_packet.ps1` unless `-SkipCheckpointCommit` is passed).

If multiple sequenced WPs exist for one iteration:

9. Update `ROADMAP.md` and `TASK_BOARD.md` to identify the active packet set and the current blocking packet.
10. Downgrade requirement status when a prior packet only delivered scaffolding, demo logic, or prototype behavior.

### Trigger C: Implementation progress

When product work progresses:

1. Update WP and task board status.
2. Update requirement statuses to match reality.
3. Update traceability rows for affected requirements.
4. Update primitives matrix rows for changed combinations/components/tests.
5. Update test suite execution summary and evidence paths.

### Trigger D: E2E verification attempt

Before promoting any item to `E2E-VERIFIED`:

1. Linked WP test suite must show pass results.
2. Evidence paths (logs/artifacts) must be recorded.
3. Red-team and non-goal checks must be executed.
4. User sign-off must be documented in the WP and test-suite file.

---

## 5) Required WP Skeleton Fields

Every WP must include these sections:

- `Linked Requirements`
- `Linked Primitives`
- `Linked Spec Extraction`
- `Linked WP Check Script`
- `Primitive Matrix Impact`
- `Expected Files Touched`
- `Interconnection Plan`
- `Spec-Test Coverage Plan` including:
  - dependency tests
  - UI contract tests
  - functionality tests
  - code correctness tests
  - red-team tests
  - additional tests (performance/offline/reliability/etc.)
- `Checkpoint Commit Plan`
- `Proof of Implementation`
- `Evidence`

## 5A) Multi-Packet Iteration Rule

- A single iteration may use multiple sequenced WPs when the earlier packet does not yet satisfy the capability-slice definition of done.
- The task board must make the current blocking packet explicit.
- Requirement status must reflect real implementation state, not historical intent or scaffold existence.
- Follow-on packets must link the same iteration sub-spec unless governance introduces a replacement sub-spec in the same PR.

---

## 6) Required Crash-Resilience Commit Discipline

Use checkpoint commits to avoid loss on failure/session reset:

1. Governance kickoff commit (spec/WP/taskboard/traceability/primitives/test-suite).
2. Implementation commit(s).
3. Verification/status-promotion commit.

Use `.gov/repo_scripts/governance_checkpoint_commit.ps1` to standardize this.

---

## 6A) WP Loop Method (No-Shortcut Enforcement)

Per WP, run this loop:

1. `SPEC EXTRACT`: refresh extraction with `.gov/repo_scripts/update_wp_spec_extract.ps1`.
2. `PLAN`: confirm WP/suite/check-script scope and expected touched files.
3. `EXECUTE`: implement changes in `.product/Worktrees/wt_main`.
4. `VERIFY`: run `.gov/workflow/wp_checks/check-WP-<...>.ps1` (or `.gov/repo_scripts/run_wp_checks.ps1`).
5. `ENFORCE`: run `.gov/repo_scripts/enforce_wp_template_compliance.ps1`.
6. `SYNC`: run `.gov/repo_scripts/governance_preflight.ps1` and update taskboard/traceability/primitives.
7. `CHECKPOINT`: commit governance/implementation evidence before moving to next WP.

No status claim may skip the `VERIFY` + `ENFORCE` + proof artifact requirement.

---

## 7) Cadence

- Per PR touching `.product/`: governance-sync check required.
- Per PR touching `.product/`: run `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1`.
- Weekly governance sweep: verify spec/index/traceability/primitives/taskboard/roadmap/tech stack sync.
- Iteration close-out: no `E2E-VERIFIED` without evidence + user sign-off.

---

## 8) Governance-Sync Checklist (Use in Every Relevant PR)

- [ ] Work maps to an active WP.
- [ ] Linked test suite exists and is current.
- [ ] Linked spec extraction exists and is current.
- [ ] Linked WP check script exists and runs.
- [ ] Task board row exists and is current.
- [ ] Requirement statuses match real implementation state.
- [ ] Traceability entries are updated.
- [ ] Primitives index and primitives matrix are updated.
- [ ] `TECH_STACK.md` reflects current dependency and portability/runtime assumptions.
- [ ] Roadmap order is still accurate.
- [ ] Build readiness checklist remains accurate.
- [ ] Product publish changes are sourced from `.product/Worktrees/wt_main`.
- [ ] WP template compliance check passes (`enforce_wp_template_compliance.ps1`).
- [ ] Startup/performance and macOS-portability requirements are reflected when affected.
- [ ] `PROJECT_CODEX.md`, `AGENTS.md`, and `MODEL_BEHAVIOR.md` reflect current workflow.
