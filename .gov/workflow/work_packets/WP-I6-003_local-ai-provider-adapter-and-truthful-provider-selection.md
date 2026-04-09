# WP-I6-003 - Local AI Provider Adapter and Truthful Provider Selection

Date Opened: 2026-04-09
Status: SPEC-MAPPED
Iteration: I6
Workflow Version: 4.0
Packet Class: IMPLEMENTATION
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I6-003.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I6-003.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I6-003.ps1

## Intent

Extend the governed AI gateway so operators can select a real provider independently from deployment posture and route analysis through a local model runtime without weakening the existing evidence, audit, or misuse controls. This packet fixes the current UX truth gap where the shell exposes deployment profile as if it were provider selection and adds a real local-provider adapter for operator-supplied on-disk models.

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

- PRIM-0052 | Governed AI Provider Adapter | Broaden the audited provider seam so the UI can select explicit providers and the Tauri runtime can execute against a local model adapter without changing the evidence-linked contract.

## Primitive Matrix Impact

- Add/update rows in `.gov/Spec/PRIMITIVES_MATRIX.md` for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## Reality Boundary

- Real Seam: persist a distinct AI provider selection through recorder state and route Tauri provider status plus analysis execution through an explicit provider selector that includes a local executable-backed model adapter.
- User-Visible Win: users can choose `Auto`, `Codex CLI`, `OpenAI Responses`, or `Local model runtime`, see truthful readiness details for the selected path, and run governed AI analysis against a configured local model without the UI pretending deployment posture is provider choice.
- Proof Target: frontend/unit/backend/Rust tests pass, `check-WP-I6-003.ps1` passes, and desktop proof shows the truthful provider selector and degraded state; if a working local runtime is available during execution, capture a live local-provider artifact as additional proof.
- Allowed Temporary Fallbacks: browser/jsdom stays explicitly `browser-simulated`; the local-model provider may remain `tauri-unconfigured` until operator environment variables point at a real local runtime executable and model path; no fake live-provider claim is allowed.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to `E2E-VERIFIED`.

## In Scope

- Add a real AI-provider selector distinct from deployment profile in the governed UI and recorder snapshot.
- Add a Tauri local-model provider adapter that executes an operator-configured local runtime command against a local model path while preserving audit, evidence linkage, and refusal behavior.
- Rename misleading provider-facing UI copy so deployment profile remains deployment posture and provider selection is shown separately with truthful readiness detail.
- Extend tests and proof to cover provider selection persistence, truthful degraded states, and the new local-provider contract.

## Out of Scope

- Bundling model weights, auto-discovering arbitrary local models, or shipping a model runtime inside the product.
- Broad MCP-surface changes, new analytical workflows, or any raw-path/raw-database exposure to the AI layer.
- Treating a local provider as implicitly allowed in air-gapped or denied-policy modes when the existing policy contract blocks AI access.

## Expected Files Touched

- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/TECH_STACK.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/ROADMAP.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-I6-003_local-ai-provider-adapter-and-truthful-provider-selection.md
- .gov/workflow/wp_test_suites/TS-WP-I6-003.md
- .gov/workflow/wp_spec_extractions/SX-WP-I6-003.md
- .gov/workflow/wp_checks/check-WP-I6-003.ps1
- .product/Worktrees/wt_main/src/App.tsx
- .product/Worktrees/wt_main/src/App.test.tsx
- .product/Worktrees/wt_main/src/contracts/i0.ts
- .product/Worktrees/wt_main/src/features/i6/aiGateway.ts
- .product/Worktrees/wt_main/src/features/i6/i6.test.ts
- .product/Worktrees/wt_main/src/lib/backend.ts
- .product/Worktrees/wt_main/src/lib/backend.test.ts
- .product/Worktrees/wt_main/src-tauri/src/lib.rs

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0052 | explicit provider selector plus local runtime adapter | React persisted state, TypeScript gateway normalization, Tauri command routing, Rust process execution | Keeps the existing evidence-linked AI contract intact while making provider choice truthful and enabling operator-supplied local inference. |

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

- Explicit simulated/mock/sample paths: browser/jsdom remains `browser-simulated`; the local-model provider reports `tauri-unconfigured` until the operator supplies a valid executable plus argument template and any required model path.
- Required labels in code/UI/governance: `Deployment profile` must never be labeled as provider choice; local provider status must explicitly state whether it is configured, unavailable, or degraded; browser fallback must continue to call itself simulated.
- Successor packet or debt owner: future I6 follow-on for local-runtime presets and auto-discovery if operator setup remains too manual after this packet.
- Exit condition to remove fallback: a configured local runtime can be selected explicitly, produces real governed artifacts, and the UI no longer conflates provider selection with deployment posture.

## Change Ledger

- What Became Real: governance now captures a distinct provider-selection seam and a real local-model runtime target instead of treating provider diversity as implied by the existing OpenAI-only adapter.
- What Remains Simulated: product code still needs to land the provider selector, recorder persistence, local executable adapter, and truthful desktop proof.
- Next Blocking Real Seam: implement the Tauri local-model provider path and wire the explicit provider selector through the frontend and recorder restore/save flow.

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I6-003.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I6-003/
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
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I6-003/
- User Sign-off:

## Progress Log

- 2026-04-09: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
- 2026-04-09: Scope refined to split provider selection from deployment profile and add a governed local-model runtime adapter for operator-supplied on-disk models.
