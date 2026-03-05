# StratAtlas - Task Board

Date: 2026-03-05

This board tracks active governance and product work packets.

---

## Status Legend

- `SPEC-MAPPED`
- `IN-PROGRESS`
- `IMPLEMENTED`
- `E2E-VERIFIED`
- `BLOCKED`
- `RECURRING`

---

## Active Board

| WP ID | Iteration | Title | Scope | Status | Owner | Linked REQs | Sub-Spec | Test Suite | Last Updated | Notes |
|------|-----------|-------|-------|--------|-------|-------------|----------|------------|--------------|-------|
| WP-GOV-MAINT-001 | All | Governance Sync Sweep | Keep roadmap/spec/index/traceability/primitives/tech-stack/taskboard/codex/agents/model-behavior in sync | RECURRING | Unassigned | Cross-cutting | N/A | N/A | 2026-03-05 | Coverage sweep active on every relevant PR + weekly |
| WP-GOV-BUILDREADY-001 | All | Repo Build Readiness Foundation | Baseline structure/templates/sub-spec stubs/preflight automation | IMPLEMENTED | Codex | Cross-cutting | N/A | N/A | 2026-03-04 | Foundation established; evolved by later governance packets |
| WP-GOV-PERFPORT-001 | All | Startup and macOS Portability Policy | Startup responsiveness + macOS portability controls in governance/spec | IMPLEMENTED | Codex | REQ-0014..REQ-0018, GATE-H | N/A | N/A | 2026-03-05 | Spec/index/matrix/roadmap/workflow updates completed |
| WP-GOV-ITER-ACTIVE-001 | I0-I10 | Iteration Activation and Sub-Spec Expansion | Activated iteration WPs and expanded sub-spec contracts | IMPLEMENTED | Codex | REQ-0100..REQ-1113 | I0-I10 sub-spec files | N/A | 2026-03-05 | Governance activation and traceability expansion completed |
| WP-I0-001 | I0 | Walking Skeleton Activation | Bundle/audit/offline foundations and portability baseline | IMPLEMENTED | Codex | REQ-0100..REQ-0112, REQ-0017..REQ-0018 | `.gov/Spec/sub-specs/I0_walking_skeleton.md` | `.gov/workflow/wp_test_suites/TS-WP-I0-001.md` | 2026-03-05 | Contract implementation and automated checks present; awaiting full E2E closure evidence |
| WP-I1-001 | I1 | Layer Time Replay Deterministic Export | Layer contract, time/replay, deterministic export, startup/response checks | IMPLEMENTED | Codex | REQ-0200..REQ-0212, REQ-0014..REQ-0016 | `.gov/Spec/sub-specs/I1_layers_time_replay.md` | `.gov/workflow/wp_test_suites/TS-WP-I1-001.md` | 2026-03-05 | Contract implementation and automated checks present; awaiting full E2E closure evidence |
| WP-I2-001 | I2 | Baseline Delta Briefing Bundle | Baseline/delta analysis and briefing export flow | IMPLEMENTED | Codex | REQ-0300..REQ-0302 | `.gov/Spec/sub-specs/I2_baseline_delta_briefing.md` | `.gov/workflow/wp_test_suites/TS-WP-I2-001.md` | 2026-03-05 | Contract implementation and automated checks present; awaiting full E2E closure evidence |
| WP-I3-001 | I3 | Collaboration CRDT Session Replay | Merge-safe collaboration, conflict UX, attribution replay | IMPLEMENTED | Codex | REQ-0400..REQ-0403 | `.gov/Spec/sub-specs/I3_collaboration_crdt_replay.md` | `.gov/workflow/wp_test_suites/TS-WP-I3-001.md` | 2026-03-05 | Contract implementation and automated checks present; awaiting full E2E closure evidence |
| WP-I4-001 | I4 | Scenario Modeling Constraint Propagation | Scenario forks, constraints, comparison/export | IMPLEMENTED | Codex | REQ-0500..REQ-0504 | `.gov/Spec/sub-specs/I4_scenario_modeling_constraints.md` | `.gov/workflow/wp_test_suites/TS-WP-I4-001.md` | 2026-03-05 | Contract implementation and automated checks present; awaiting full E2E closure evidence |
| WP-I5-001 | I5 | Query Builder Versioned Queries | Compose/run/render queries and versioned saves | IMPLEMENTED | Codex | REQ-0600..REQ-0604 | `.gov/Spec/sub-specs/I5_query_builder_versioned_queries.md` | `.gov/workflow/wp_test_suites/TS-WP-I5-001.md` | 2026-03-05 | Contract implementation and automated checks present; awaiting full E2E closure evidence |
| WP-I6-001 | I6 | AI Gateway MCP Interface | Policy-gated AI/MCP with audited tool surface | IMPLEMENTED | Codex | REQ-0700..REQ-0708 | `.gov/Spec/sub-specs/I6_ai_gateway_mcp.md` | `.gov/workflow/wp_test_suites/TS-WP-I6-001.md` | 2026-03-05 | Contract implementation and automated checks present; awaiting full E2E closure evidence |
| WP-I7-001 | I7 | Context Intake First Domains | Domain registry/correlation/offline context capture | IMPLEMENTED | Codex | REQ-0800..REQ-0810 | `.gov/Spec/sub-specs/I7_context_intake_first_domains.md` | `.gov/workflow/wp_test_suites/TS-WP-I7-001.md` | 2026-03-05 | Contract implementation and automated checks present; awaiting full E2E closure evidence |
| WP-I8-001 | I8 | Context Deviation Infrastructure Propagation | Deviation events and scenario constraint-node propagation | IMPLEMENTED | Codex | REQ-0900..REQ-0904 | `.gov/Spec/sub-specs/I8_context_deviation_infrastructure.md` | `.gov/workflow/wp_test_suites/TS-WP-I8-001.md` | 2026-03-05 | Contract implementation and automated checks present; awaiting full E2E closure evidence |
| WP-I9-001 | I9 | OSINT Economic Context Queries | Curated OSINT, verification labels, aggregate alerts | IMPLEMENTED | Codex | REQ-1000..REQ-1003 | `.gov/Spec/sub-specs/I9_osint_economic_context_queries.md` | `.gov/workflow/wp_test_suites/TS-WP-I9-001.md` | 2026-03-05 | Contract implementation and automated checks present; awaiting full E2E closure evidence |
| WP-I10-001 | I10 | Strategic Game Modeling | Game model, scenario tree, experiment bundle guardrails | IMPLEMENTED | Codex | REQ-1100..REQ-1113 | `.gov/Spec/sub-specs/I10_strategic_game_modeling.md` | `.gov/workflow/wp_test_suites/TS-WP-I10-001.md` | 2026-03-05 | Contract implementation and automated checks present; awaiting full E2E closure evidence |

---

## Usage Rules

1. Every meaningful change maps to a WP row.
2. Every WP row must have a linked test-suite file.
3. Update this board in the same PR as any WP status change.
4. `E2E-VERIFIED` is the only done status.
5. `E2E-VERIFIED` requires linked runtime evidence plus user sign-off.
6. Keep `Sub-Spec`, `Test Suite`, and `ROADMAP.md` links aligned for each iteration row.

