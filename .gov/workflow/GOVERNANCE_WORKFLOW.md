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
`SUPERSEDED` means a WP was replaced by a linked successor and is closed historically without making an independent done claim.

---

## 3) Status Model (Required)

Use these statuses in WPs, task board rows, and requirement tracking:

- `SPEC-MAPPED`
- `IN-PROGRESS`
- `IMPLEMENTED`
- `E2E-VERIFIED`
- `SUPERSEDED`
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
2. For Workflow Version `4.0+`, set `Packet Class` and record the `Reality Boundary`, `Fallback Register`, and initial `Change Ledger`.
3. Create linked test suite in `.gov/workflow/wp_test_suites/`.
4. Create/update linked spec extraction in `.gov/workflow/wp_spec_extractions/` (use `.gov/repo_scripts/update_wp_spec_extract.ps1`).
5. Create linked check script in `.gov/workflow/wp_checks/` (delegating to `.gov/repo_scripts/run_wp_checks.ps1`).
6. Update task board row (owner/scope/status/sub-spec/requirements).
7. Update traceability WP coverage section.
8. Update primitives index and primitives matrix.
9. Create a governance checkpoint commit before product implementation (automatic when using `new_work_packet.ps1` unless `-SkipCheckpointCommit` is passed).

If multiple sequenced WPs exist for one iteration:

10. Update `ROADMAP.md` and `TASK_BOARD.md` to identify the active packet set and the current blocking packet.
11. Downgrade requirement status when a prior packet only delivered scaffolding, demo logic, or prototype behavior.
12. Keep the next blocking real seam explicit, not just the next packet name.

### Trigger C: Implementation progress

When product work progresses:

1. Update WP and task board status.
2. Update requirement statuses to match reality.
3. Update traceability rows for affected requirements.
4. Update primitives matrix rows for changed combinations/components/tests.
5. Update test suite execution summary and evidence paths.
6. For Workflow Version `4.0+`, update `What Became Real`, `What Remains Simulated`, and `Next Blocking Real Seam`.

### Trigger D: E2E verification attempt

Before promoting any item to `E2E-VERIFIED`:

1. Linked WP test suite must show pass results.
2. Evidence paths (logs/artifacts) must be recorded.
3. Red-team and non-goal checks must be executed.
4. User sign-off must be documented in the WP and test-suite file.
5. Workflow Version `4.0+` packets must not retain unresolved `TBD` or placeholder markers in WP/suite/extraction artifacts.
6. `SCAFFOLD` packets may not promote linked requirements or primitives to `E2E-VERIFIED`.

### Trigger E: Supersession closure

When a WP is replaced by a successor packet:

1. Confirm the successor packet is named explicitly in the superseded WP, task board, roadmap, and traceability row.
2. Preserve the original proof artifact path in the superseded WP and linked test suite.
3. Mark the replaced packet `SUPERSEDED` instead of promoting it to `E2E-VERIFIED`.
4. Do not treat `SUPERSEDED` as done; only the successor may carry the completion claim.

---

## 5) Required WP Skeleton Fields

Every WP must include these sections:

- `Packet Class` metadata line for Workflow Version `4.0+`
- `Linked Requirements`
- `Linked Primitives`
- `Linked Spec Extraction`
- `Linked WP Check Script`
- `Primitive Matrix Impact`
- `Reality Boundary` for Workflow Version `4.0+`
- `Expected Files Touched`
- `Interconnection Plan`
- `Spec-Test Coverage Plan` including:
  - dependency tests
  - UI contract tests
  - functionality tests
  - code correctness tests
  - red-team tests
  - additional tests (performance/offline/reliability/etc.)
- `Fallback Register` for Workflow Version `4.0+`
- `Change Ledger` for Workflow Version `4.0+`
- `Checkpoint Commit Plan`
- `Proof of Implementation`
- `Evidence`

## 5A) Multi-Packet Iteration Rule

- A single iteration may use multiple sequenced WPs when the earlier packet does not yet satisfy the capability-slice definition of done.
- The task board must make the current blocking packet explicit.
- Requirement status must reflect real implementation state, not historical intent or scaffold existence.
- Follow-on packets must link the same iteration sub-spec unless governance introduces a replacement sub-spec in the same PR.
- When a follow-on packet fully replaces the earlier packet, the earlier packet may be marked `SUPERSEDED` with retained proof and a named successor reference.

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
2. `PLAN`: confirm WP/suite/check-script scope, packet class, reality boundary, fallbacks, and expected touched files.
3. `EXECUTE`: implement changes in `.product/Worktrees/wt_main`.
4. `VERIFY`: run `.gov/workflow/wp_checks/check-WP-<...>.ps1` (or `.gov/repo_scripts/run_wp_checks.ps1`).
5. `ENFORCE`: run `.gov/repo_scripts/enforce_wp_template_compliance.ps1`.
6. `SYNC`: run `.gov/repo_scripts/governance_preflight.ps1` and update taskboard/traceability/primitives.
7. `LEDGER`: update `What Became Real`, `What Remains Simulated`, and `Next Blocking Real Seam`.
8. `CHECKPOINT`: commit governance/implementation evidence before moving to next WP.

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
- [ ] Workflow Version `4.0+` packets declare `Packet Class`.
- [ ] Workflow Version `4.0+` packets define `Reality Boundary`, `Fallback Register`, and `Change Ledger`.
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
- [ ] Simulated/seeded/sample runtime paths are explicitly labeled and recorded when material.
- [ ] Startup/performance and macOS-portability requirements are reflected when affected.
- [ ] `PROJECT_CODEX.md`, `AGENTS.md`, and `MODEL_BEHAVIOR.md` reflect current workflow.
