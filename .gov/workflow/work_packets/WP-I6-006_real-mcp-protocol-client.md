# WP-I6-006 - Real MCP Protocol Client

Date Opened: 2026-04-11
Status: SPEC-MAPPED
Iteration: I6
Workflow Version: 4.0
Packet Class: IMPLEMENTATION
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I6-006.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I6-006.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I6-006.ps1

## Intent

Replace the simulated MCP tool execution with a real MCP protocol client that communicates via JSON-RPC with external MCP servers. The current implementation defines six MCP tool types and synthesizes payloads from frontend state — no actual MCP protocol communication occurs.

### Background

`aiGateway.ts:1054-1233` implements tool "execution" as local TypeScript switch/case logic returning hardcoded payloads from frontend state. There is no JSON-RPC client, no MCP server discovery, and no external tool interop. PRIM-0053 is claimed E2E-VERIFIED but only has type-level coverage.

## Linked Requirements

- REQ-0700
- REQ-0703
- REQ-0704
- REQ-0705

## Linked Primitives

- PRIM-0053 | Audited MCP Execution Surface | This WP replaces the simulated tool execution with real MCP JSON-RPC communication while preserving audit capture and policy gating

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## Reality Boundary

- Real Seam: JSON-RPC MCP client in Tauri backend that discovers and communicates with external MCP servers, routes tool calls through the existing audit/policy pipeline, and returns real tool results.
- User-Visible Win: MCP tools in the assistant surface execute against a real external server (e.g. a local MCP server process) instead of returning synthesized frontend data.
- Proof Target: Live desktop proof showing a tool call routed through the MCP client to an external server process, with the real response displayed in the assistant and audit-logged.
- Allowed Temporary Fallbacks: The existing local-simulation path remains as a fallback when no MCP server is configured or reachable. Must be explicitly labeled "simulated (no MCP server)" in the UI.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## In Scope

- MCP JSON-RPC client implementation in the Tauri backend (stdio or HTTP transport).
- MCP server discovery/configuration in settings (server command, args, or URL).
- Route the existing six tool definitions through the real MCP client when a server is configured.
- Preserve existing audit capture and policy gating for all MCP calls.
- Explicit fallback labeling when no MCP server is available.
- Update the assistant UI to show real vs simulated tool results.

## Out of Scope

- Building a standalone MCP server (this WP is the client side only).
- Adding new tool definitions beyond the existing six.
- Provider credential management (separate WP-I6-005).
- Exposing StratAtlas tools as an MCP server for external consumption.

## Expected Files Touched

- .product/Worktrees/wt_main/src/features/i6/aiGateway.ts
- .product/Worktrees/wt_main/src-tauri/src/lib.rs

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0053 (Audited MCP Execution Surface) | MCP JSON-RPC client + tool routing | Rust reqwest/tokio (HTTP) or Command (stdio), JSON-RPC 2.0 | Real MCP tool execution with audit capture, replacing simulated frontend payloads |

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

- Explicit simulated/mock/sample paths: Existing local-simulation tool path remains when no MCP server is configured. Must be labeled "simulated (no MCP server)" in UI.
- Required labels in code/UI/governance: Tool results must indicate real-MCP vs simulated source.
- Successor packet or debt owner: N/A — fallback is permanent for no-server-configured state.
- Exit condition to remove fallback: Fallback stays; it is the graceful degradation path.

## Change Ledger

- What Became Real: TBD (updated at implementation)
- What Remains Simulated: TBD (updated at implementation)
- Next Blocking Real Seam: TBD (updated at implementation)

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I6-006.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I6-006/
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
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I6-006/
- User Sign-off:

## Progress Log

- 2026-04-11: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
