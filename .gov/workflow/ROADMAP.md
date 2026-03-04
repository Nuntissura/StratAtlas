# StratAtlas - Roadmap and Build Order

Date: 2026-03-04
Source anchors: `.gov/Spec/stratatlas_spec_v1_2.md` section 19 and `.gov/Spec/REQUIREMENTS_INDEX.md`

This file is the execution order for capability slices. It is the scheduling bridge between the spec and day-to-day work packets.

---

## 1) Build Order (Canonical Baseline)

| Order | Iteration | Capability Slice | Primary REQ Range | Sub-Spec File | Minimum Exit Signal |
|------:|-----------|------------------|-------------------|---------------|---------------------|
| 1 | I0 | Walking skeleton (bundle, reopen, audit, markings, offline open) | REQ-0100..REQ-0112 | `.gov/Spec/sub-specs/I0_walking_skeleton.md` | Bundle reopen deterministic + offline open + audit/markings active |
| 2 | I1 | Layer system + time/replay + deterministic export | REQ-0200..REQ-0212 | `.gov/Spec/sub-specs/I1_layers_time_replay.md` | Stable UI regions/modes + layer contract + perf budgets passing |
| 3 | I2 | Baseline/delta compare + briefing bundle | REQ-0300..REQ-0302 | `.gov/Spec/sub-specs/I2_baseline_delta_briefing.md` | Baseline->Delta->Bundle->Briefing golden flow passing |
| 4 | I3 | Collaboration + CRDT + session replay | REQ-0400..REQ-0403 | `.gov/Spec/sub-specs/I3_collaboration_crdt_replay.md` | Merge-safe collaboration + conflict UX + attribution replay |
| 5 | I4 | Scenario modeling + constraint propagation + export | REQ-0500..REQ-0504 | `.gov/Spec/sub-specs/I4_scenario_modeling_constraints.md` | Scenario fork/compare/export workflow passing |
| 6 | I5 | Query builder + saved/versioned queries | REQ-0600..REQ-0604 | `.gov/Spec/sub-specs/I5_query_builder_versioned_queries.md` | Query compose/run/render/save-version workflow passing |
| 7 | I6 | AI gateway + MCP interface | REQ-0700..REQ-0708 | `.gov/Spec/sub-specs/I6_ai_gateway_mcp.md` | Policy-gated AI/MCP with full audit + no raw-path/raw-DB exposure |
| 8 | I7 | Context intake framework + first domains | REQ-0800..REQ-0810 | `.gov/Spec/sub-specs/I7_context_intake_first_domains.md` | Context registry/correlation/offline rules operational |
| 9 | I8 | Context deviation detection + infrastructure propagation | REQ-0900..REQ-0904 | `.gov/Spec/sub-specs/I8_context_deviation_infrastructure.md` | Deviation events emitted + scenario constraint-node propagation |
| 10 | I9 | OSINT + economic indicators + context-aware queries | REQ-1000..REQ-1003 | `.gov/Spec/sub-specs/I9_osint_economic_context_queries.md` | Curated OSINT + verification labels + aggregate-only alerts |
| 11 | I10 | Strategic game modeling | REQ-1100..REQ-1113 | `.gov/Spec/sub-specs/I10_strategic_game_modeling.md` | Game model/scenario-tree/experiment workflows with guardrails |

---

## 2) Ordering Rules

- Implement in sequence unless governance explicitly approves a change.
- A later iteration can start only when the prior iteration has:
  - an approved sub-spec,
  - an active Work Packet set,
  - Task Board status that is current.
- "Done" for each iteration follows `.gov/Spec/stratatlas_spec_v1_2.md` section 17 (capability slice definition of done).

---

## 3) Release-Gate Coupling

- Gate A through Gate F are cross-cutting and must be tracked continuously.
- Gate G applies when AI integration (I6+) is enabled.
- Gate status must be reflected in:
  - `.gov/Spec/REQUIREMENTS_INDEX.md` (GATE-* rows),
  - `.gov/Spec/TRACEABILITY_MATRIX.md` (Gate Verification table),
  - `.gov/workflow/taskboard/TASK_BOARD.md` (current delivery state).

---

## 4) When This File Must Be Updated

Update `ROADMAP.md` in the same change whenever one of the following happens:

- iteration order changes,
- iteration scope changes significantly,
- a slice is split/merged,
- gate dependencies change,
- delivery strategy changes (for example, parallel tracks).

Any roadmap update must also update:

- `.gov/workflow/taskboard/TASK_BOARD.md`
- `.gov/Spec/REQUIREMENTS_INDEX.md` (targets/status where needed)
- `.gov/Spec/TRACEABILITY_MATRIX.md` (mapping impact where needed)
