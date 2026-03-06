# WP-I6-002 - Live AI Gateway and MCP Execution Adapter

Date Opened: 2026-03-06
Status: SPEC-MAPPED
Iteration: I6
Workflow Version: 3.0
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I6-002.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I6-002.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I6-002.ps1

## Intent

Replace templated AI responses with the governed provider and MCP execution path described by the spec. This packet restores the normative AI gateway slice on top of authoritative evidence references, policy controls, and audit capture.

## Linked Requirements

- REQ-0700
- REQ-0701
- REQ-0702
- REQ-0703
- REQ-0704
- REQ-0705
- REQ-0706
- REQ-0707
- REQ-0708

## Linked Primitives

- PRIM-0052 | Governed AI Provider Adapter | Route AI requests through an approved provider layer with evidence linkage and policy enforcement.
- PRIM-0053 | Audited MCP Execution Surface | Expose only governed MCP tools and audited execution paths to the AI layer.

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## In Scope

- Replace templated AI output with live governed gateway behavior tied to stored evidence and packet-approved capabilities.
- Introduce audited MCP execution paths and refusal handling aligned to the spec guardrails.
- Persist AI and tool activity in the authoritative audit and artifact stores rather than UI-only state.

## Out of Scope

- Building the underlying query or context ingestion remediations that this packet depends on.
- Shipping unrestricted model access, raw database access, or raw filesystem exposure to AI flows.
- Any feature that violates the non-goal or misuse boundaries in spec section 3.2.

## Expected Files Touched

- .gov/Spec/stratatlas_spec_v1_2.md
- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-I6-002_live-ai-gateway-and-mcp-execution-adapter.md
- .gov/workflow/wp_test_suites/TS-WP-I6-002.md
- .gov/workflow/wp_spec_extractions/SX-WP-I6-002.md
- .gov/workflow/wp_checks/check-WP-I6-002.ps1
- .product/Worktrees/wt_main/src/features/i6/
- .product/Worktrees/wt_main/src/lib/backend.ts
- .product/Worktrees/wt_main/src-tauri/src/lib.rs
- .product/Worktrees/wt_main/src/contracts/

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0052 | governed provider adapter | policy-gated AI SDK integration plus evidence references | Makes AI outputs depend on auditable runtime evidence instead of hard-coded text templates. |
| PRIM-0053 | MCP execution surface | audited tool mediation and refusal handling | Keeps AI tool use inside the approved governance and audit boundary. |

## Spec-Test Coverage Plan

### Dependency and Environment Tests
- [ ] Dependency graph/lock integrity tests
- [ ] Runtime compatibility checks

### UI Contract Tests
- [ ] Required regions/modes/states
- [ ] Error/degraded-state UX

### Functional Flow Tests
- [ ] Golden flow and edge cases
- [ ] Persistence/replay/export flows

### Code Correctness Tests
- [ ] Unit tests
- [ ] Integration tests
- [ ] Static analysis (lint/type/schema)

### Red-Team and Abuse Tests
- [ ] Non-goal enforcement (spec section 3.2)
- [ ] Policy bypass scenarios
- [ ] Adversarial/invalid input cases

### Additional Tests
- [ ] Performance budgets
- [ ] Offline behavior
- [ ] Reliability/recovery

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I6-002.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I6-002/
- Claim Standard: do not claim completion without linked command output and artifact paths.

## Exit Criteria

- Task board and requirements index statuses are synchronized.
- Traceability, primitives index, and primitives matrix are synchronized.
- Linked test suite has executed results and evidence paths.
- Evidence bundle is attached.
- User Sign-off: APPROVED.

## Evidence

- Test Suite Execution:
- Logs:
- Screenshots/Exports:
- Build Artifacts:
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I6-002/
- User Sign-off:

## Progress Log

- 2026-03-06: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
- 2026-03-06: Packet scope refined to replace the current templated AI stub with governed provider and MCP runtime behavior.
