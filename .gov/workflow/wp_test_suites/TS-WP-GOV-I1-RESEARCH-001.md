# TS-WP-GOV-I1-RESEARCH-001 - Spec vs Code Test Suite

Date Opened: 2026-03-07
Status: E2E-VERIFIED
Linked Work Packet: WP-GOV-I1-RESEARCH-001
Iteration: I1

## Scope

Validate that the I1 map-runtime research packet creates a source-backed, governance-synchronized design contract before `WP-I1-003` implementation begins.

## Inputs

- Linked requirements: REQ-0013, REQ-0019, REQ-0020, REQ-0021, REQ-0022
- Linked primitives: PRIM-0031, PRIM-0063, PRIM-0064
- Linked components: `.gov/Spec/sub-specs/I1_map_runtime_research.md`, `.gov/Spec/sub-specs/I1_layers_time_replay.md`, `.gov/workflow/work_packets/WP-I1-003_real-2d-3d-canvas-and-governed-layer-runtime.md`, `.gov/workflow/ROADMAP.md`, `.gov/workflow/taskboard/TASK_BOARD.md`

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0021 | PRIM-0031 | Dependency | governance readiness | `governance_preflight.ps1` | governance preflight passes with no missing linked assets |
| UI-001 | REQ-0020 | PRIM-0063 | UI Contract | map research reference | `check-WP-GOV-I1-RESEARCH-001.ps1` content assertions | research doc contains explicit 2D and 3D design sections plus cited external references |
| FUNC-001 | REQ-0019 | PRIM-0064 | Functionality | feature-to-map contract | `check-WP-GOV-I1-RESEARCH-001.ps1` content assertions | feature-to-map integration matrix covers the major app slices |
| COR-001 | REQ-0020 | PRIM-0031 | Code Correctness | governance synchronization | `check-WP-GOV-I1-RESEARCH-001.ps1` plus template compliance | roadmap, taskboard, sub-spec, traceability, and packet references are aligned |
| RED-001 | REQ-0013 | PRIM-0063 | Red Team / Abuse | non-goal and lock-in guardrails | `red_team_guardrail_check.ps1` plus research assertions | research preserves non-goal boundaries and does not introduce proprietary runtime lock-in |
| EXT-001 | REQ-0022 | PRIM-0031 | Additional | extraction refresh | `update_wp_spec_extract.ps1 -All` and artifact presence | spec extraction reflects the current research packet and I1 packet state |

## Dependency and Environment Tests

- [x] Governance preflight passes
- [x] Linked packet assets exist
- [x] Template compliance passes

## UI Contract Tests

- [x] 2D map design guidance exists
- [x] 3D globe design guidance exists
- [x] map-first runtime requirement exists in the I1 sub-spec

## Functional Flow Tests

- [x] feature-to-map integration matrix covers I0..I10 slices
- [x] `WP-I1-003` packet reflects the research decisions
- [x] roadmap/taskboard show the research packet as the active preparatory governance step

## Code Correctness Tests

- [x] traceability row exists and is current
- [x] primitives index and matrix rows are updated
- [x] spec extraction refreshed

## Red-Team and Abuse Tests

- [x] non-goal boundaries preserved in research and sub-spec
- [x] no proprietary-service dependency introduced
- [x] guardrail static check passes

## Additional Tests

- [x] budget and degradation posture documented
- [x] offline map expectations documented
- [x] future runtime proof obligations identified

## Automation Hook

- Command: `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-I1-RESEARCH-001.ps1`
- Artifacts: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-I1-RESEARCH-001/`

## Execution Summary

- Last Run Date: 2026-03-07
- Result: PASS
- Blocking Failures: none
- Evidence Paths: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-I1-RESEARCH-001/20260307_031932/`, `.product/build_target/tool_artifacts/wp_runs/WP-GOV-I1-RESEARCH-001/20260307_031932/DOC-ASSERT-001.log`, `.product/build_target/tool_artifacts/wp_runs/WP-GOV-I1-RESEARCH-001/20260307_031932/doc_assertions.json`
- Reviewer: Codex
- User Sign-off: approved by the 2026-03-07 instruction to execute the research and begin `WP-I1-003`
