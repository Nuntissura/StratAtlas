# WP-GOV-ITER-ACTIVE-001 - Iteration Activation and Sub-Spec Expansion

Date Opened: 2026-03-05
Status: DONE
Iteration: I0-I10

## Intent

Activate all open iteration work packets into active governance flow and eliminate sub-spec stubs.

## In Scope

- Move open iteration rows from `PLANNED` to active governance statuses (`IN-PROGRESS`/`SUB-SPEC`).
- Expand I0-I10 sub-spec files from STUB templates to draft contracts.
- Synchronize requirements index and traceability matrix with new sub-spec coverage.
- Record dependency baseline alignment in `TECH_STACK.md`.

## Outcomes

- `WP-I0-001` moved to `IN-PROGRESS`.
- `WP-I1-001` through `WP-I10-001` moved to `SUB-SPEC`.
- I0-I10 sub-spec files now contain full required section structure.
- `REQUIREMENTS_INDEX.md` statuses aligned with activation state.
- `TRACEABILITY_MATRIX.md` expanded for I2-I10 mappings.
- `TECH_STACK.md` updated to reflect active dependency baseline in `wt_main`.

## Evidence

- Task board row updates under `.gov/workflow/taskboard/TASK_BOARD.md`.
- Sub-spec files under `.gov/Spec/sub-specs/`.
- Requirements and traceability updates under `.gov/Spec/`.
- Governance preflight pass after changes.
