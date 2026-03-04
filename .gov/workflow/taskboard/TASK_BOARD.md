# StratAtlas - Task Board

Date: 2026-03-04

This board tracks active governance and product work packets.

---

## Status Legend

- `PLANNED`
- `SUB-SPEC`
- `IN-PROGRESS`
- `BLOCKED`
- `DONE`
- `VERIFIED`
- `RECURRING`

---

## Active Board

| WP ID | Iteration | Title | Scope | Status | Owner | Linked REQs | Last Updated | Notes |
|------|-----------|-------|-------|--------|-------|-------------|--------------|-------|
| WP-GOV-MAINT-001 | All | Governance Sync Sweep | Keep roadmap/spec/index/traceability/taskboard/codex/agents in sync | RECURRING | Unassigned | Cross-cutting | 2026-03-04 | Run on every relevant PR + weekly |
| WP-GOV-BUILDREADY-001 | All | Repo Build Readiness Foundation | Baseline structure/templates/sub-spec stubs/preflight automation | DONE | Codex | Cross-cutting | 2026-03-04 | Preflight passing; foundation established |
| WP-I0-001 | I0 | Walking Skeleton Activation | First implementation packet for bundle/audit/offline foundations | PLANNED | Unassigned | REQ-0100..REQ-0112 | 2026-03-04 | Create detailed WP in `work_packets/` before coding |
| WP-I1-001 | I1 | Layer Time Replay Deterministic Export | Layer contract, time/replay, deterministic export and perf checks | PLANNED | Unassigned | REQ-0200..REQ-0212 | 2026-03-04 | Stub created; activate after I0 readiness |
| WP-I2-001 | I2 | Baseline Delta Briefing Bundle | Baseline/delta analysis and briefing export flow | PLANNED | Unassigned | REQ-0300..REQ-0302 | 2026-03-04 | Stub created; activate after I1 readiness |
| WP-I3-001 | I3 | Collaboration CRDT Session Replay | Merge-safe collaboration, conflict UX, attribution replay | PLANNED | Unassigned | REQ-0400..REQ-0403 | 2026-03-04 | Stub created; activate after I2 readiness |
| WP-I4-001 | I4 | Scenario Modeling Constraint Propagation | Scenario forks, constraints, comparison/export | PLANNED | Unassigned | REQ-0500..REQ-0504 | 2026-03-04 | Stub created; activate after I3 readiness |
| WP-I5-001 | I5 | Query Builder Versioned Queries | Compose/run/render queries and versioned saves | PLANNED | Unassigned | REQ-0600..REQ-0604 | 2026-03-04 | Stub created; activate after I4 readiness |
| WP-I6-001 | I6 | AI Gateway MCP Interface | Policy-gated AI/MCP with audited tool surface | PLANNED | Unassigned | REQ-0700..REQ-0708 | 2026-03-04 | Stub created; activate after I5 readiness |
| WP-I7-001 | I7 | Context Intake First Domains | Domain registry/correlation/offline context capture | PLANNED | Unassigned | REQ-0800..REQ-0810 | 2026-03-04 | Stub created; activate after I6 readiness |
| WP-I8-001 | I8 | Context Deviation Infrastructure Propagation | Deviation events and scenario constraint-node propagation | PLANNED | Unassigned | REQ-0900..REQ-0904 | 2026-03-04 | Stub created; activate after I7 readiness |
| WP-I9-001 | I9 | OSINT Economic Context Queries | Curated OSINT, verification labels, aggregate alerts | PLANNED | Unassigned | REQ-1000..REQ-1003 | 2026-03-04 | Stub created; activate after I8 readiness |
| WP-I10-001 | I10 | Strategic Game Modeling | Game model, scenario tree, experiment bundle guardrails | PLANNED | Unassigned | REQ-1100..REQ-1113 | 2026-03-04 | Stub created; activate after I9 readiness |

---

## Usage Rules

1. Every meaningful change maps to a WP row.
2. Update this board in the same PR as the work status change.
3. Do not mark `DONE` unless linked requirements are at least `DONE`.
4. Mark `VERIFIED` only after test/evidence confirmation.
