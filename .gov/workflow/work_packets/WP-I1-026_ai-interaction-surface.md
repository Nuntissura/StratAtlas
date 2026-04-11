# WP-I1-026 - AI Interaction Surface

Date Opened: 2026-04-11
Status: SPEC-MAPPED
Iteration: I1
Workflow Version: 4.0
Packet Class: IMPLEMENTATION
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I1-026.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I1-026.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I1-026.ps1

## Intent

Implement the AI copilot interaction surface from spec Section 11.14. AI responses displayed as insight cards in the right panel. Provider status always visible. MCP tool calls visible with parameters and results. Data flow rules enforced (LLM sees bundle refs + AOI + context, never raw paths).

## Linked Requirements

- REQ-0700
- REQ-0701
- REQ-0702
- REQ-0703

## Linked Primitives

- PRIM-0052 | AI Gateway Contract | This WP implements the visible AI interaction surface that enforces the gateway contract including provider status, data flow rules, and audit trail
- PRIM-0053 | MCP Tool Surface Contract | MCP tool calls become visible with parameters and results, enforcing the governed tool surface contract

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## Reality Boundary

- Real Seam: Assistant shows provider status, insight cards with provenance, MCP tool visibility. LLM data flow follows spec Section 11.14.1 rules.
- User-Visible Win: Clear understanding of what the AI sees, what provider is active, and what confidence to place on responses.
- Proof Target: Copilot panel renders in right panel when AI family is active. Provider status card always visible. Insight cards show provider/model/evidence attribution. MCP tool calls are visible with parameters and results.
- Allowed Temporary Fallbacks: Full data flow enforcement may initially use client-side filtering before a backend enforcement layer is built; documented in Change Ledger.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## In Scope

- Copilot panel in right panel (AI family detail view).
- Insight cards with provider/model/evidence attribution.
- Provider status card (always visible when AI family is active).
- MCP tool call visibility with parameters and results.
- Data flow enforcement per spec Section 11.14.1 (LLM sees bundle refs + AOI + context, never raw paths).

## Out of Scope

- New AI capabilities or new providers.
- Changing the gateway adapter or adding new Tauri commands for AI.
- Adding new MCP tools or changing MCP protocol implementation.

## Expected Files Touched

- .gov/Spec/stratatlas_spec_v1_2.md
- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-I1-026_ai-interaction-surface.md
- .gov/workflow/wp_test_suites/TS-WP-I1-026.md
- .gov/workflow/wp_spec_extractions/SX-WP-I1-026.md
- .gov/workflow/wp_checks/check-WP-I1-026.ps1
- .product/Worktrees/wt_main/src/<implementation_files>

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0052 + PRIM-0053 | Insight cards + Provider status + MCP visibility | React components + AI gateway adapter | LLM integrated with governed data flow, visible provenance, and auditable tool calls |

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

## Fallback Register

- Explicit simulated/mock/sample paths: Provider status may show degraded/offline states when no provider is configured; these states must be truthfully labeled.
- Required labels in code/UI/governance: Insight cards must carry provider/model/evidence attribution. MCP tool calls must show parameters and results. Data flow rules must be visibly enforced.
- Successor packet or debt owner: No direct successor in the current rebuild track; future AI capability packets build on this surface.
- Exit condition to remove fallback: Copilot panel renders with real provider status, insight cards with provenance, and visible MCP tool execution.

## Change Ledger

- What Became Real: TBD
- What Remains Simulated: TBD
- Next Blocking Real Seam: TBD

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-026.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I1-026/
- Claim Standard: do not claim completion without linked command output and artifact paths.

## Exit Criteria

- Task board and requirements index statuses are synchronized.
- Traceability, primitives index, and primitives matrix are synchronized.
- Linked test suite has executed results and evidence paths.
- Evidence bundle is attached.
- Reality Boundary, Fallback Register, and Change Ledger are truthful.
- User Sign-off: APPROVED.

## Evidence

- Test Suite Execution:
- Logs:
- Screenshots/Exports:
- Build Artifacts:
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I1-026/
- User Sign-off:

## Progress Log

- 2026-04-11: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
