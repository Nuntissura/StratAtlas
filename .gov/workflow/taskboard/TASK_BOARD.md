# StratAtlas - Task Board

Date: 2026-03-06

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

Current reality note: the 2026-03-05 I0-I10 rows captured activation-shell delivery and helper-level tests, not completed normative slices. The active recovery queue below is authoritative for current delivery sequencing.

| WP ID | Iteration | Title | Scope | Status | Owner | Linked REQs | Sub-Spec | Test Suite | Last Updated | Notes |
|------|-----------|-------|-------|--------|-------|-------------|----------|------------|--------------|-------|
| WP-GOV-MAINT-001 | All | Governance Sync Sweep | Keep roadmap/spec/index/traceability/primitives/tech-stack/taskboard/codex/agents/model-behavior in sync | RECURRING | Unassigned | Cross-cutting | N/A | N/A | 2026-03-05 | Coverage sweep active on every relevant PR + weekly |
| WP-GOV-REALIGN-001 | All | Implementation Reality Alignment and Recovery Queue | Correct overstated implementation claims, activate multi-packet iteration workflow, and wire the active recovery queue | IMPLEMENTED | Codex | REQ-0013, REQ-0019, REQ-0020, REQ-0021, REQ-0022 | N/A | .gov/workflow/wp_test_suites/TS-WP-GOV-REALIGN-001.md | 2026-03-06 | Governance realignment completed; proof: .product/build_target/tool_artifacts/wp_runs/WP-GOV-REALIGN-001/20260306_034725/; spec extraction: .gov/workflow/wp_spec_extractions/SX-WP-GOV-REALIGN-001.md; check script: .gov/workflow/wp_checks/check-WP-GOV-REALIGN-001.ps1 |
| WP-GOV-BUILDREADY-001 | All | Repo Build Readiness Foundation | Baseline structure/templates/sub-spec stubs/preflight automation | IMPLEMENTED | Codex | Cross-cutting | N/A | N/A | 2026-03-04 | Foundation established; evolved by later governance packets |
| WP-GOV-PERFPORT-001 | All | Startup and macOS Portability Policy | Startup responsiveness + macOS portability controls in governance/spec | IMPLEMENTED | Codex | REQ-0014..REQ-0018, GATE-H | N/A | N/A | 2026-03-05 | Spec/index/matrix/roadmap/workflow updates completed |
| WP-GOV-ITER-ACTIVE-001 | I0-I10 | Iteration Activation and Sub-Spec Expansion | Activated iteration WPs and expanded sub-spec contracts | IMPLEMENTED | Codex | REQ-0100..REQ-1113 | I0-I10 sub-spec files | N/A | 2026-03-05 | Governance activation and traceability expansion completed |
| WP-I0-001 | I0 | Walking Skeleton Activation | Initial activation shell for bundle/audit/offline foundations and portability baseline | IN-PROGRESS | Codex | REQ-0100..REQ-0112, REQ-0017..REQ-0018 | `.gov/Spec/sub-specs/I0_walking_skeleton.md` | `.gov/workflow/wp_test_suites/TS-WP-I0-001.md` | 2026-03-06 | Activation shell remains the first-pass baseline; follow-on packet `WP-I0-002` implemented the recorder/context hardening proof set on 2026-03-06. |
| WP-I0-002 | I0 | Recorder Artifact and Context Snapshot Hardening | Authoritative recorder store, multi-asset bundle snapshots, and captured active context state | IMPLEMENTED | Codex | REQ-0008, REQ-0009, REQ-0010, REQ-0101..REQ-0112, REQ-0808 | `.gov/Spec/sub-specs/I0_walking_skeleton.md` | `.gov/workflow/wp_test_suites/TS-WP-I0-002.md` | 2026-03-06 | Passed `.gov/workflow/wp_checks/check-WP-I0-002.ps1`; proof: `.product/build_target/tool_artifacts/wp_runs/WP-I0-002/20260306_041144/`; user sign-off still pending for `E2E-VERIFIED`. |
| WP-I1-001 | I1 | Layer Time Replay Deterministic Export | Initial activation shell for layer/time/replay/performance contracts | IN-PROGRESS | Codex | REQ-0200..REQ-0212, REQ-0014..REQ-0016 | `.gov/Spec/sub-specs/I1_layers_time_replay.md` | `.gov/workflow/wp_test_suites/TS-WP-I1-001.md` | 2026-03-06 | Activation shell remains the baseline scaffold; follow-on packet `WP-I1-002` implemented the governed workspace/layer proof set on 2026-03-06. |
| WP-I1-002 | I1 | Workspace Surface Layer Catalog and Policy Labeling | Real workspace regions, visible artifact labels, layer metadata, and budget/degradation feedback | IMPLEMENTED | Codex | REQ-0011, REQ-0012, REQ-0014..REQ-0016, REQ-0200..REQ-0212, REQ-0804, REQ-0805 | `.gov/Spec/sub-specs/I1_layers_time_replay.md` | `.gov/workflow/wp_test_suites/TS-WP-I1-002.md` | 2026-03-06 | Passed `.gov/workflow/wp_checks/check-WP-I1-002.ps1`; proof: `.product/build_target/tool_artifacts/wp_runs/WP-I1-002/20260306_044051/`; user sign-off still pending for `E2E-VERIFIED`. |
| WP-I2-001 | I2 | Baseline Delta Briefing Bundle | Activation-shell scaffolding for baseline/delta and briefing export | IMPLEMENTED | Codex | REQ-0300..REQ-0302 | `.gov/Spec/sub-specs/I2_baseline_delta_briefing.md` | `.gov/workflow/wp_test_suites/TS-WP-I2-001.md` | 2026-03-06 | Activation-shell proof exists at `.product/build_target/tool_artifacts/wp_runs/WP-I2-001/20260306_003742/`; follow-on packet `WP-I2-002` delivered the normative I2 proof set. |
| WP-I2-002 | I2 | Comparative Dashboard and Briefing Artifact Flow | Deterministic compare windows, context overlay dashboard, and labeled briefing artifact tied to bundle state | E2E-VERIFIED | Codex | REQ-0300, REQ-0301, REQ-0302 | `.gov/Spec/sub-specs/I2_baseline_delta_briefing.md` | `.gov/workflow/wp_test_suites/TS-WP-I2-002.md` | 2026-03-06 | Passed `.gov/workflow/wp_checks/check-WP-I2-002.ps1`; proof: `.product/build_target/tool_artifacts/wp_runs/WP-I2-002/20260306_050212/`; user sign-off approved via 2026-03-06 autonomous completion instruction. |
| WP-I3-001 | I3 | Collaboration CRDT Session Replay | Merge-safe collaboration workflow with reconnect conflict resolution, bundle-backed persistence, and attributed session replay | E2E-VERIFIED | Codex | REQ-0400..REQ-0403 | `.gov/Spec/sub-specs/I3_collaboration_crdt_replay.md` | `.gov/workflow/wp_test_suites/TS-WP-I3-001.md` | 2026-03-06 | Passed `.gov/workflow/wp_checks/check-WP-I3-001.ps1`; proof: `.product/build_target/tool_artifacts/wp_runs/WP-I3-001/20260306_052546/`; user sign-off approved via 2026-03-06 autonomous completion instruction. |
| WP-I4-001 | I4 | Scenario Modeling Constraint Propagation | Scenario fork, constraint propagation, bundle-backed persistence, and deterministic export workflow | E2E-VERIFIED | Codex | REQ-0500..REQ-0504 | `.gov/Spec/sub-specs/I4_scenario_modeling_constraints.md` | `.gov/workflow/wp_test_suites/TS-WP-I4-001.md` | 2026-03-06 | Passed `.gov/workflow/wp_checks/check-WP-I4-001.ps1`; proof: `.product/build_target/tool_artifacts/wp_runs/WP-I4-001/20260306_055241/`; user sign-off approved via 2026-03-06 autonomous completion instruction. |
| WP-I5-001 | I5 | Query Builder Versioned Queries | Composable query builder, ephemeral render layer workflow, bundle-backed saved-version persistence, and deterministic saved-query artifacts | E2E-VERIFIED | Codex | REQ-0600..REQ-0604 | `.gov/Spec/sub-specs/I5_query_builder_versioned_queries.md` | `.gov/workflow/wp_test_suites/TS-WP-I5-001.md` | 2026-03-06 | Passed `.gov/workflow/wp_checks/check-WP-I5-001.ps1`; proof: `.product/build_target/tool_artifacts/wp_runs/WP-I5-001/20260306_061249/`; user sign-off approved via 2026-03-06 autonomous completion instruction. |
| WP-I6-001 | I6 | AI Gateway MCP Interface | Policy-gated AI gateway, hash-addressed evidence refs, and audited MCP tool surface | E2E-VERIFIED | Codex | REQ-0700..REQ-0708 | `.gov/Spec/sub-specs/I6_ai_gateway_mcp.md` | `.gov/workflow/wp_test_suites/TS-WP-I6-001.md` | 2026-03-06 | Passed `.gov/workflow/wp_checks/check-WP-I6-001.ps1`; proof: `.product/build_target/tool_artifacts/wp_runs/WP-I6-001/20260306_064311/`; user sign-off approved via 2026-03-06 autonomous completion instruction. |
| WP-I7-001 | I7 | Context Intake First Domains | Activation-shell scaffolding for domain registry/correlation/offline capture | E2E-VERIFIED | Codex | REQ-0800..REQ-0810 | `.gov/Spec/sub-specs/I7_context_intake_first_domains.md` | `.gov/workflow/wp_test_suites/TS-WP-I7-001.md` | 2026-03-06 | Passed `.gov/workflow/wp_checks/check-WP-I7-001.ps1`; proof: `.product/build_target/tool_artifacts/wp_runs/WP-I7-001/20260306_070435/`; user sign-off approved via 2026-03-06 autonomous completion instruction. |
| WP-I8-001 | I8 | Context Deviation Infrastructure Propagation | Activation-shell scaffolding for deviation events and scenario constraint-node propagation | E2E-VERIFIED | Codex | REQ-0900..REQ-0904 | `.gov/Spec/sub-specs/I8_context_deviation_infrastructure.md` | `.gov/workflow/wp_test_suites/TS-WP-I8-001.md` | 2026-03-06 | Passed `.gov/workflow/wp_checks/check-WP-I8-001.ps1`; proof: `.product/build_target/tool_artifacts/wp_runs/WP-I8-001/20260306_073044/`; user sign-off approved via 2026-03-06 autonomous completion instruction. |
| WP-I9-001 | I9 | OSINT Economic Context Queries | Curated OSINT ingest, verification labels, threshold-linked aggregate alerts, and bundle-backed persistence | E2E-VERIFIED | Codex | REQ-1000..REQ-1003 | `.gov/Spec/sub-specs/I9_osint_economic_context_queries.md` | `.gov/workflow/wp_test_suites/TS-WP-I9-001.md` | 2026-03-06 | Passed `.gov/workflow/wp_checks/check-WP-I9-001.ps1`; proof: `.product/build_target/tool_artifacts/wp_runs/WP-I9-001/20260306_075309/`; user sign-off approved via 2026-03-06 autonomous completion instruction. |
| WP-I10-001 | I10 | Strategic Game Modeling | Activation-shell scaffolding for game model, scenario tree, and experiment bundle guardrails | IN-PROGRESS | Codex | REQ-1100..REQ-1113 | `.gov/Spec/sub-specs/I10_strategic_game_modeling.md` | `.gov/workflow/wp_test_suites/TS-WP-I10-001.md` | 2026-03-06 | Activated as the current blocking packet after `WP-I9-001` proof; prior 2026-03-05 shell evidence remains baseline only pending normative I10 delivery. |
| WP-GOV-LOOP-001 | All | WP Loop Proof Enforcement | Reusable no-shortcut WP governance loop (spec extraction + checks + proof + compliance gate) | IMPLEMENTED | Codex | REQ-0019..REQ-0022 | N/A | .gov/workflow/wp_test_suites/TS-WP-GOV-LOOP-001.md | 2026-03-06 | Spec extraction: .gov/workflow/wp_spec_extractions/SX-WP-GOV-LOOP-001.md; check script: .gov/workflow/wp_checks/check-WP-GOV-LOOP-001.ps1 |
| WP-GOV-INSTALLER-001 | All | Installer Lifecycle Contract and Build Kit | Define installer lifecycle contract and ship MSI/NSIS installer kit with maintenance tooling and evidence | IMPLEMENTED | Codex | REQ-0023, REQ-0024, REQ-0025, REQ-0026, REQ-0027, REQ-0028, REQ-0029, REQ-0030, REQ-0031 | N/A | .gov/workflow/wp_test_suites/TS-WP-GOV-INSTALLER-001.md | 2026-03-06 | Spec extraction: .gov/workflow/wp_spec_extractions/SX-WP-GOV-INSTALLER-001.md; check script: .gov/workflow/wp_checks/check-WP-GOV-INSTALLER-001.ps1; proof: .product/build_target/tool_artifacts/wp_runs/WP-GOV-INSTALLER-001/20260306_023348; kit: .product/build_target/Current/InstallerKit/20260306_023104 |
---

## Usage Rules

1. Every meaningful change maps to a WP row.
2. Every WP row must have a linked test-suite file.
3. Every WP row must maintain linked `SX-WP-*` spec extraction and `check-WP-*` check-script references inside the WP file.
4. Update this board in the same PR as any WP status change.
5. `E2E-VERIFIED` is the only done status.
6. `E2E-VERIFIED` requires linked runtime evidence plus user sign-off.
7. Keep `Sub-Spec`, `Test Suite`, and `ROADMAP.md` links aligned for each iteration row.

