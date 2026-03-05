# WP-I1-001 - Layer/Time Replay Deterministic Export

Date Opened: 2026-03-04
Status: VERIFIED
Iteration: I1

## Intent

Deliver the I1 slice for layer system, time/replay behavior, and deterministic export paths.

## Linked Requirements

- REQ-0200..REQ-0212
- REQ-0014, REQ-0015, REQ-0016 (startup and state-change budgets)

## Required Pre-Work

- Confirm I1 sub-spec is written and approved.
- Ensure traceability rows for REQ-0200..REQ-0212 are mapped.
- Move Task Board status to `SUB-SPEC` or `IN-PROGRESS` before coding starts.

## Initial Scope

- Layer contract and licensing/export enforcement.
- Time controls and replay mode behavior.
- Deterministic export path and performance-budget validation.
- Startup and common state-change responsiveness validation against spec budgets.

## Exit Criteria

- I1 outcomes recorded on Task Board.
- REQ-0200..REQ-0212 statuses updated in index.
- Traceability and verification evidence linked.

## Progress Log

- 2026-03-05: Sub-spec advanced from STUB to DRAFT and moved into active sub-spec phase.
- 2026-03-05: I1 dependency baseline installed in `.product/Worktrees/wt_main` (MapLibre, Cesium, deck.gl, charts, loaders, DuckDB-WASM) to unblock implementation.


- 2026-03-05: Implementation completed and verified via lint/test/build evidence.

