# StratAtlas - Roadmap and Build Order

Date: 2026-03-08
Source anchors: `.gov/Spec/stratatlas_spec_v1_2.md` section 19 and `.gov/Spec/REQUIREMENTS_INDEX.md`

This file is the execution order for capability slices. It is the scheduling bridge between the spec and day-to-day work packets.

---

## 1) Build Order (Canonical Baseline)

| Order | Iteration | Capability Slice | Primary REQ Range | Sub-Spec File | Linked WP(s) | Minimum Exit Signal |
|------:|-----------|------------------|-------------------|---------------|--------------|---------------------|
| 1 | I0 | Walking skeleton (bundle, reopen, audit, markings, offline open) | REQ-0100..REQ-0112 (+ REQ-0017/REQ-0018 guardrails) | `.gov/Spec/sub-specs/I0_walking_skeleton.md` | `WP-I0-001`, `WP-I0-002`, `WP-I0-003` | Bundle reopen deterministic + offline open + audit/markings active + portability baseline recorded |
| 2 | I1 | Layer system + time/replay + deterministic export | REQ-0200..REQ-0212 (+ REQ-0014..REQ-0016 budgets) | `.gov/Spec/sub-specs/I1_layers_time_replay.md` | `WP-I1-001`, `WP-I1-002`, `WP-I1-003` | Stable UI regions/modes + layer contract + perf budgets passing + startup/state-change budgets validated |
| 3 | I2 | Baseline/delta compare + briefing bundle | REQ-0300..REQ-0302 | `.gov/Spec/sub-specs/I2_baseline_delta_briefing.md` | `WP-I2-001`, `WP-I2-002`, `WP-I2-003` | Baseline->Delta->Bundle->Briefing golden flow passing |
| 4 | I3 | Collaboration + CRDT + session replay | REQ-0400..REQ-0403 | `.gov/Spec/sub-specs/I3_collaboration_crdt_replay.md` | `WP-I3-001` | Merge-safe collaboration + conflict UX + attribution replay |
| 5 | I4 | Scenario modeling + constraint propagation + export | REQ-0500..REQ-0504 | `.gov/Spec/sub-specs/I4_scenario_modeling_constraints.md` | `WP-I4-001` | Scenario fork/compare/export workflow passing |
| 6 | I5 | Query builder + saved/versioned queries | REQ-0600..REQ-0604 | `.gov/Spec/sub-specs/I5_query_builder_versioned_queries.md` | `WP-I5-001`, `WP-I5-002` | Query compose/run/render/save-version workflow passing |
| 7 | I6 | AI gateway + MCP interface | REQ-0700..REQ-0708 | `.gov/Spec/sub-specs/I6_ai_gateway_mcp.md` | `WP-I6-001`, `WP-I6-002` | Policy-gated AI/MCP with full audit + no raw-path/raw-DB exposure |
| 8 | I7 | Context intake framework + first domains | REQ-0800..REQ-0810 | `.gov/Spec/sub-specs/I7_context_intake_first_domains.md` | `WP-I7-001`, `WP-I7-002` | Context registry/correlation/offline rules operational |
| 9 | I8 | Context deviation detection + infrastructure propagation | REQ-0900..REQ-0904 | `.gov/Spec/sub-specs/I8_context_deviation_infrastructure.md` | `WP-I8-001`, `WP-I8-002` | Deviation events emitted + scenario constraint-node propagation |
| 10 | I9 | OSINT + economic indicators + context-aware queries | REQ-1000..REQ-1003 | `.gov/Spec/sub-specs/I9_osint_economic_context_queries.md` | `WP-I9-001`, `WP-I9-002` | Curated OSINT + verification labels + aggregate-only alerts |
| 11 | I10 | Strategic game modeling | REQ-1100..REQ-1113 | `.gov/Spec/sub-specs/I10_strategic_game_modeling.md` | `WP-I10-001`, `WP-I10-002` | Game model/scenario-tree/experiment workflows with guardrails |

---

## 2) Ordering Rules

- Implement in sequence unless governance explicitly approves a change.
- A later iteration can start only when the prior iteration has:
  - an approved sub-spec,
  - an active linked Work Packet,
  - Task Board status that is current and aligned to roadmap/WP links.
- "Done" for each iteration follows `.gov/Spec/stratatlas_spec_v1_2.md` section 17 (capability slice definition of done).

## 2A) Active Recovery Queue

- The 2026-03-06 code-versus-spec audit established that `.product/Worktrees/wt_main` is a governed desktop prototype with helper-level and simulator-backed verification, not a complete normative delivery of the I0-I10 runtime slices.
- `WP-GOV-REALIGN-001` remains the retained proof packet for the initial implementation-reality correction; proof: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-REALIGN-001/20260306_034725/`.
- `WP-GOV-STATUS-001` remains the retained proof packet for superseded-packet closure and truthful successor propagation; proof: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-STATUS-001/20260306_084102/`.
- `WP-GOV-REALIGN-002` is now `E2E-VERIFIED`; proof: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-REALIGN-002/20260306_214418/`. It realigned the queue, corrected release-facing requirement and gate overstatements, and handed off to the runtime-proof packet.
- `WP-GOV-VERIFY-001` is now `E2E-VERIFIED`; proof: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-VERIFY-001/20260307_000606/`. It landed the governed desktop runtime smoke harness, formalized artifact-backed status-promotion evidence, and handed runtime-remediation queue ownership to `WP-I0-003`.
- `WP-I0-003` is now `E2E-VERIFIED`; proof: `.product/build_target/tool_artifacts/wp_runs/WP-I0-003/20260307_021247/`. It established the governed PostgreSQL/PostGIS control plane, immutable artifact-store registry semantics, deployment-profile persistence, and live time-range query proof that downstream runtime packets depend on.
- `WP-GOV-I1-RESEARCH-001` is now `E2E-VERIFIED`; proof: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-I1-RESEARCH-001/20260307_031932/`. It captured source-backed 2D/3D runtime research, feature-to-map integration rules, and the map-first execution contract that `WP-I1-003` now follows.
- Active remediation packet set:
  - `WP-I1-003`
  - `WP-I2-003`
  - `WP-I5-002`
  - `WP-I6-002`
  - `WP-I7-002`
  - `WP-I8-002`
  - `WP-I9-002`
  - `WP-I10-002`
- Sequencing constraints:
  - `WP-I1-003` depends on the now-closed `WP-I0-003` governed backbone packet.
  - `WP-I2-003` and `WP-I5-002` depend on `WP-I0-003` and `WP-I1-003`.
  - `WP-I6-002` depends on `WP-I0-003` and `WP-I5-002`.
  - `WP-I7-002` depends on `WP-I0-003` and `WP-I1-003`.
  - `WP-I8-002` and `WP-I9-002` depend on `WP-I7-002`.
  - `WP-I10-002` depends on `WP-I0-003`, `WP-I1-003`, and `WP-I7-002`.
- Legacy proof artifacts from `WP-I0-002` through `WP-I10-001` are retained as prototype and simulator evidence only; they do not close the normative runtime gaps identified by the 2026-03-06 audit.
- `WP-I1-003` is now `E2E-VERIFIED`; proof: `.product/build_target/tool_artifacts/wp_runs/WP-I1-003/20260307_045256/`. The main canvas now mounts the real MapLibre/Cesium runtime, the existing feature set projects into meaningful map-linked overlays and inspect state, and governed cold/warm Tauri runtime smoke evidence is attached under `runtime_smoke/`.
- `WP-I2-003` is now `E2E-VERIFIED`; proof: `.product/build_target/tool_artifacts/wp_runs/WP-I2-003/20260307_201453/`. It closes REQ-0300..REQ-0302 with AOI-linked delta analytics, compare-driven map projection, deterministic briefing preparation, derived-bundle persistence, and deterministic reopen proof.
- `REQ-0209` and `REQ-0210` remain `IN-PROGRESS` because this packet does not yet include explicit export-budget timing evidence.
- `WP-I5-002` is now `E2E-VERIFIED`; proof: `.product/build_target/tool_artifacts/wp_runs/WP-I5-002/20260307_232719/`. It closes REQ-0600..REQ-0604 with DuckDB-backed governed query execution, SQL fingerprint capture, context-aware predicates, deterministic matched-row layer materialization, and bundle reopen proof.
- `WP-I6-002` is now `E2E-VERIFIED`; proof: `.product/build_target/tool_artifacts/wp_runs/WP-I6-002/20260308_012806/`. It closes REQ-0700..REQ-0708 with a governed provider-agnostic adapter, live Codex CLI / ChatGPT-login runtime proof, OpenAI Responses fallback support, audited MCP execution, and cold/warm Tauri runtime smoke evidence including live AI and MCP assertions.
- `WP-GOV-DEPTH-001` is now `E2E-VERIFIED`; proof: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-DEPTH-001/20260308_042222/`. It establishes the depth-first workflow baseline for future work through Workflow Version 4.0 packet fields, extract snapshots, and scaffold/placeholder enforcement, and it does not change the current product blocker `WP-I8-002`.
- `WP-I7-002` is now `E2E-VERIFIED`; proof: `.product/build_target/tool_artifacts/wp_runs/WP-I7-002/20260308_060255/`. It closes REQ-0801..REQ-0809 with governed packaged-domain ingestion, metadata-rich context registration, explicit auditable correlation storage, immediate recorder persistence, deterministic bundle capture/reopen, and cold/warm Tauri runtime smoke evidence for the context flow.
- `WP-I8-002` is now `E2E-VERIFIED`; proof: `.product/build_target/tool_artifacts/wp_runs/WP-I8-002/20260308_154423/`. It closes REQ-0900..REQ-0904 with governed historical-window deviation detection, deterministic bundle replay, map-linked deviation projection, scenario constraint-node propagation, and cold/warm Tauri runtime smoke evidence.
- `WP-I9-002` is now `E2E-VERIFIED`; proof: `.product/build_target/tool_artifacts/wp_runs/WP-I9-002/20260308_170238/`. It closes REQ-1000..REQ-1003 with governed connector-backed aggregate AOI alert evaluation, deterministic bundle reopen, map-linked alert projection, and cold/warm Tauri runtime smoke evidence.
- `WP-I10-002` is now `E2E-VERIFIED`. It replaces the remaining local arithmetic strategic-model solve path with a governed backend runtime, persisted solver traces, reproducible experiment bundles, and packet-specific cold/warm Tauri runtime smoke proof.
- The I0-I10 remediation queue is now fully `E2E-VERIFIED`. Remaining blockers are cross-cutting gate debts in startup/performance, export timing, accessibility, and macOS portability evidence.
- `WP-I1-004` is now `E2E-VERIFIED`; proof: `.product/build_target/tool_artifacts/wp_runs/WP-I1-004/20260308_232056/`. It closes `GATE-E`, `REQ-0014`, `REQ-0015`, `REQ-0016`, `REQ-0206`, `REQ-0207`, `REQ-0208`, `REQ-0209`, `REQ-0210`, and `REQ-0212` with packet-grade cold/warm startup, state-change, pan/zoom, scrub, briefing-export, 4K export, and accessibility evidence in the governed Tauri runtime.
- `WP-GOV-PORT-002` is now `IN-PROGRESS` as the remaining blocker for `REQ-0018` and `GATE-H` after the Windows/reference-runtime budget closure in `WP-I1-004`. Because the active workstation is Windows-only, the packet is using a GitHub-hosted macOS smoke path instead of relabeling Windows artifacts as portability proof.

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
- `WP-GOV-MAINT-002`: E2E-VERIFIED closeout packet reconciling requirement, gate, primitive, and workflow ledgers with verified I0/I1 and cross-cutting proof.
- `WP-GOV-LOOP-001`: E2E-VERIFIED reusable WP loop with linked spec extraction, check scripts, template compliance gates, and proof-first status claims.
- `WP-GOV-REALIGN-002`: `E2E-VERIFIED` governance packet that realigned roadmap, taskboard, requirement, and primitive ledgers to the audited code-versus-spec reality; proof: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-REALIGN-002/20260306_214418/`.
- `WP-GOV-STATUS-001`: close superseded packets with retained proof and explicit successor references.
- `WP-GOV-VERIFY-001`: `E2E-VERIFIED` governance packet establishing desktop runtime smoke coverage and expanded proof obligations beyond jsdom-only flows; proof: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-VERIFY-001/20260307_000606/`.
- `WP-GOV-I1-RESEARCH-001`: `E2E-VERIFIED` I1-specific governance packet for map-runtime research capture, feature-to-map integration, and source-backed runtime design direction before `WP-I1-003`; proof: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-I1-RESEARCH-001/20260307_031932/`.
- `WP-GOV-INSTALLER-002`: E2E-VERIFIED follow-on packet for version-parity and release-surface alignment after governance closeout.
- `WP-GOV-DEPTH-001`: `E2E-VERIFIED` governance packet upgrading the packet template, generator, compliance rules, extraction snapshots, and root instructions so breadth-first work stays explicit while only real seams can advance delivery claims; proof: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-DEPTH-001/20260308_042222/`.
- `WP-GOV-PORT-002`: `IN-PROGRESS` follow-on verification packet closing macOS runtime smoke and Gate H portability evidence after `WP-I1-004` via a hosted macOS runner and downloaded packet-proof artifacts.

Governance control packets are complete only when preflight and template-compliance checks pass with linked artifacts.
