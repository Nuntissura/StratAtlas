# StratAtlas - Task Board

Date: 2026-03-05

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

| WP ID | Iteration | Title | Scope | Status | Owner | Linked REQs | Sub-Spec | Last Updated | Notes |
|------|-----------|-------|-------|--------|-------|-------------|----------|--------------|-------|
| WP-GOV-MAINT-001 | All | Governance Sync Sweep | Keep roadmap/spec/index/traceability/tech-stack/taskboard/codex/agents/model-behavior in sync | RECURRING | Unassigned | Cross-cutting | N/A | 2026-03-05 | Coverage sweep active on every relevant PR + weekly |
| WP-GOV-BUILDREADY-001 | All | Repo Build Readiness Foundation | Baseline structure/templates/sub-spec stubs/preflight automation | DONE | Codex | Cross-cutting | N/A | 2026-03-04 | Preflight passing; foundation established |
| WP-GOV-PERFPORT-001 | All | Startup and macOS Portability Policy | Add startup responsiveness + macOS portability controls in governance/spec | DONE | Codex | REQ-0014..REQ-0018, GATE-H | N/A | 2026-03-05 | Spec/index/matrix/roadmap/workflow updates completed |
| WP-I0-001 | I0 | Walking Skeleton Activation | First implementation packet for bundle/audit/offline + macOS portability foundations | PLANNED | Unassigned | REQ-0100..REQ-0112, REQ-0017..REQ-0018 | `.gov/Spec/sub-specs/I0_walking_skeleton.md` | 2026-03-05 | Sub-spec is STUB; expand and approve before coding |
| WP-I1-001 | I1 | Layer Time Replay Deterministic Export | Layer contract, time/replay, deterministic export, startup and responsiveness checks | PLANNED | Unassigned | REQ-0200..REQ-0212, REQ-0014..REQ-0016 | `.gov/Spec/sub-specs/I1_layers_time_replay.md` | 2026-03-05 | Sub-spec stub present; activate after I0 readiness |
| WP-I2-001 | I2 | Baseline Delta Briefing Bundle | Baseline/delta analysis and briefing export flow | PLANNED | Unassigned | REQ-0300..REQ-0302 | `.gov/Spec/sub-specs/I2_baseline_delta_briefing.md` | 2026-03-05 | Sub-spec stub present; activate after I1 readiness |
| WP-I3-001 | I3 | Collaboration CRDT Session Replay | Merge-safe collaboration, conflict UX, attribution replay | PLANNED | Unassigned | REQ-0400..REQ-0403 | `.gov/Spec/sub-specs/I3_collaboration_crdt_replay.md` | 2026-03-05 | Sub-spec stub present; activate after I2 readiness |
| WP-I4-001 | I4 | Scenario Modeling Constraint Propagation | Scenario forks, constraints, comparison/export | PLANNED | Unassigned | REQ-0500..REQ-0504 | `.gov/Spec/sub-specs/I4_scenario_modeling_constraints.md` | 2026-03-05 | Sub-spec stub present; activate after I3 readiness |
| WP-I5-001 | I5 | Query Builder Versioned Queries | Compose/run/render queries and versioned saves | PLANNED | Unassigned | REQ-0600..REQ-0604 | `.gov/Spec/sub-specs/I5_query_builder_versioned_queries.md` | 2026-03-05 | Sub-spec stub present; activate after I4 readiness |
| WP-I6-001 | I6 | AI Gateway MCP Interface | Policy-gated AI/MCP with audited tool surface | PLANNED | Unassigned | REQ-0700..REQ-0708 | `.gov/Spec/sub-specs/I6_ai_gateway_mcp.md` | 2026-03-05 | Sub-spec stub present; activate after I5 readiness |
| WP-I7-001 | I7 | Context Intake First Domains | Domain registry/correlation/offline context capture | PLANNED | Unassigned | REQ-0800..REQ-0810 | `.gov/Spec/sub-specs/I7_context_intake_first_domains.md` | 2026-03-05 | Sub-spec stub present; activate after I6 readiness |
| WP-I8-001 | I8 | Context Deviation Infrastructure Propagation | Deviation events and scenario constraint-node propagation | PLANNED | Unassigned | REQ-0900..REQ-0904 | `.gov/Spec/sub-specs/I8_context_deviation_infrastructure.md` | 2026-03-05 | Sub-spec stub present; activate after I7 readiness |
| WP-I9-001 | I9 | OSINT Economic Context Queries | Curated OSINT, verification labels, aggregate alerts | PLANNED | Unassigned | REQ-1000..REQ-1003 | `.gov/Spec/sub-specs/I9_osint_economic_context_queries.md` | 2026-03-05 | Sub-spec stub present; activate after I8 readiness |
| WP-I10-001 | I10 | Strategic Game Modeling | Game model, scenario tree, experiment bundle guardrails | PLANNED | Unassigned | REQ-1100..REQ-1113 | `.gov/Spec/sub-specs/I10_strategic_game_modeling.md` | 2026-03-05 | Sub-spec stub present; activate after I9 readiness |

---

## Usage Rules

1. Every meaningful change maps to a WP row.
2. Update this board in the same PR as the work status change.
3. Do not mark `DONE` unless linked requirements are at least `DONE`.
4. Mark `VERIFIED` only after test/evidence confirmation.
5. Keep `Sub-Spec` and `ROADMAP.md` linked-WP entries aligned for every iteration row.
