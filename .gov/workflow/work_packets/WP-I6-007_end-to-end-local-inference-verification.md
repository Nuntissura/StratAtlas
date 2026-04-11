# WP-I6-007 - End-to-End Local Inference Verification

Date Opened: 2026-04-11
Status: SPEC-MAPPED
Iteration: I6
Workflow Version: 4.0
Packet Class: VERIFICATION
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I6-007.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I6-007.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I6-007.ps1

## Intent

Prove end-to-end local AI inference works in the live desktop app: user selects a local provider (LM Studio or Ollama), probes it, submits a real analysis request, and receives a real model-generated response displayed in the assistant surface. WP-I6-003 explicitly noted "lacks a desktop in-app screenshot of a generated local-model result" — this packet closes that gap.

### Background

The probe action (`probe_local_ai_runtime`) verifies connectivity but the full inference cycle — prompt submission, model generation, response display, audit capture — has never been proven end-to-end in the live app. WP-I6-004 original proof was artificially seeded.

## Linked Requirements

- REQ-0700
- REQ-0701
- REQ-0706
- REQ-0707
- REQ-0708

## Linked Primitives

- PRIM-0052 | Governed AI Provider Adapter | This WP proves the local provider path delivers real inference output through the full adapter pipeline, closing the gap identified in WP-I6-003/004

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## Reality Boundary

- Real Seam: Full inference cycle — local model receives prompt, generates response, response is displayed in the assistant card, audit event is recorded with model output.
- User-Visible Win: User clicks "Analyze" in the assistant with a local provider selected, sees real model-generated text in the response card (not template text).
- Proof Target: Live bridge snapshot of the assistant surface showing a real model-generated response from a local runtime, plus audit log entry with non-simulated `gatewayRuntime`.
- Allowed Temporary Fallbacks: None — this is a VERIFICATION packet. If local inference cannot be proven, the packet stays open.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## In Scope

- Drive a real local inference cycle through the existing adapter (LM Studio or Ollama).
- Capture desktop bridge proof of the assistant surface showing the real model response.
- Verify the audit trail records the inference with correct provider/model/runtime labels.
- Fix any bugs in the local execution path that prevent real inference from completing.
- Verify the response is not the template/simulated fallback text.

## Out of Scope

- Adding new local provider support beyond LM Studio/Ollama/custom.
- In-app credential management (separate WP-I6-005).
- MCP protocol changes (separate WP-I6-006).
- Performance optimization of local inference.

## Expected Files Touched

- .product/Worktrees/wt_main/src/App.tsx
- .product/Worktrees/wt_main/src/features/i6/aiGateway.ts
- .product/Worktrees/wt_main/src-tauri/src/lib.rs

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0052 (Governed AI Provider Adapter) | Local inference + assistant display + audit | Tauri Command subprocess, React state, audit hash chain | Proven real local model inference with visible output and audit trail |

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

- Explicit simulated/mock/sample paths: None allowed — this is a VERIFICATION packet that must prove real inference.
- Required labels in code/UI/governance: N/A
- Successor packet or debt owner: N/A
- Exit condition to remove fallback: N/A

## Change Ledger

- What Became Real: Full code path trace verified — frontend trigger → gateway routing → backend bridge → Rust provider resolution → local subprocess execution → response display → audit capture. No broken links, no type mismatches, no missing fields.
- What Remains Simulated: Nothing in code — the path is real. Live desktop proof still pending (requires running LM Studio or Ollama).
- Next Blocking Real Seam: Launch app with local LLM running, select local provider, click Analyze, capture bridge snapshot of real model output.

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I6-007.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I6-007/
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
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I6-007/
- User Sign-off:

## Progress Log

- 2026-04-11: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
- 2026-04-11: Code path trace verified — complete chain from frontend Analyze button through Tauri subprocess to result display and audit. No bugs found. Live desktop proof pending (requires running local LLM).
