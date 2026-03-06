# StratAtlas - Roadmap and Build Order

Date: 2026-03-06
Source anchors: `.gov/Spec/stratatlas_spec_v1_2.md` section 19 and `.gov/Spec/REQUIREMENTS_INDEX.md`

This file is the execution order for capability slices. It is the scheduling bridge between the spec and day-to-day work packets.

---

## 1) Build Order (Canonical Baseline)

| Order | Iteration | Capability Slice | Primary REQ Range | Sub-Spec File | Linked WP(s) | Minimum Exit Signal |
|------:|-----------|------------------|-------------------|---------------|--------------|---------------------|
| 1 | I0 | Walking skeleton (bundle, reopen, audit, markings, offline open) | REQ-0100..REQ-0112 (+ REQ-0017/REQ-0018 guardrails) | `.gov/Spec/sub-specs/I0_walking_skeleton.md` | `WP-I0-001`, `WP-I0-002` | Bundle reopen deterministic + offline open + audit/markings active + portability baseline recorded |
| 2 | I1 | Layer system + time/replay + deterministic export | REQ-0200..REQ-0212 (+ REQ-0014..REQ-0016 budgets) | `.gov/Spec/sub-specs/I1_layers_time_replay.md` | `WP-I1-001`, `WP-I1-002` | Stable UI regions/modes + layer contract + perf budgets passing + startup/state-change budgets validated |
| 3 | I2 | Baseline/delta compare + briefing bundle | REQ-0300..REQ-0302 | `.gov/Spec/sub-specs/I2_baseline_delta_briefing.md` | `WP-I2-001` | Baseline->Delta->Bundle->Briefing golden flow passing |
| 4 | I3 | Collaboration + CRDT + session replay | REQ-0400..REQ-0403 | `.gov/Spec/sub-specs/I3_collaboration_crdt_replay.md` | `WP-I3-001` | Merge-safe collaboration + conflict UX + attribution replay |
| 5 | I4 | Scenario modeling + constraint propagation + export | REQ-0500..REQ-0504 | `.gov/Spec/sub-specs/I4_scenario_modeling_constraints.md` | `WP-I4-001` | Scenario fork/compare/export workflow passing |
| 6 | I5 | Query builder + saved/versioned queries | REQ-0600..REQ-0604 | `.gov/Spec/sub-specs/I5_query_builder_versioned_queries.md` | `WP-I5-001` | Query compose/run/render/save-version workflow passing |
| 7 | I6 | AI gateway + MCP interface | REQ-0700..REQ-0708 | `.gov/Spec/sub-specs/I6_ai_gateway_mcp.md` | `WP-I6-001` | Policy-gated AI/MCP with full audit + no raw-path/raw-DB exposure |
| 8 | I7 | Context intake framework + first domains | REQ-0800..REQ-0810 | `.gov/Spec/sub-specs/I7_context_intake_first_domains.md` | `WP-I7-001` | Context registry/correlation/offline rules operational |
| 9 | I8 | Context deviation detection + infrastructure propagation | REQ-0900..REQ-0904 | `.gov/Spec/sub-specs/I8_context_deviation_infrastructure.md` | `WP-I8-001` | Deviation events emitted + scenario constraint-node propagation |
| 10 | I9 | OSINT + economic indicators + context-aware queries | REQ-1000..REQ-1003 | `.gov/Spec/sub-specs/I9_osint_economic_context_queries.md` | `WP-I9-001` | Curated OSINT + verification labels + aggregate-only alerts |
| 11 | I10 | Strategic game modeling | REQ-1100..REQ-1113 | `.gov/Spec/sub-specs/I10_strategic_game_modeling.md` | `WP-I10-001` | Game model/scenario-tree/experiment workflows with guardrails |

---

## 2) Ordering Rules

- Implement in sequence unless governance explicitly approves a change.
- A later iteration can start only when the prior iteration has:
  - an approved sub-spec,
  - an active linked Work Packet,
  - Task Board status that is current and aligned to roadmap/WP links.
- "Done" for each iteration follows `.gov/Spec/stratatlas_spec_v1_2.md` section 17 (capability slice definition of done).

## 2A) Active Recovery Queue

- `WP-GOV-REALIGN-001` is the active governance packet for implementation-reality correction and multi-packet iteration recovery.
- `WP-I0-002` is the current blocking product packet and must land before additional normative iteration claims are advanced.
- `WP-I1-002` starts after `WP-I0-002` closes recorder/artifact snapshot gaps and restores a truthful I1 shell surface.
- Existing I2-I10 activation-shell scaffolds remain useful references, but later-iteration normative delivery is paused until the I0/I1 recovery packets complete.

---

## 3) Release-Gate Coupling

- Gate A through Gate F are cross-cutting and must be tracked continuously.
- Gate G applies when AI integration (I6+) is enabled.
- Gate H (desktop portability + startup) is tracked continuously from I0 onward.
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
- `.gov/Spec/TECH_STACK.md` (when architecture/dependency implications change)

---

## 5) Governance Control Track

In parallel with iteration delivery, maintain governance control packets:

- `WP-GOV-MAINT-001`: recurring synchronization sweep.
- `WP-GOV-LOOP-001`: enforce reusable WP loop with linked spec extraction, check scripts, template compliance gates, and proof-first status claims.

Governance control packets are complete only when preflight and template-compliance checks pass with linked artifacts.
