# WP-I6-003 - Local AI Provider Adapter and Truthful Provider Selection

Date Opened: 2026-04-09
Status: IMPLEMENTED
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

- Real Seam: persist a distinct AI provider selection plus local runtime preferences through recorder state and route Tauri provider status plus analysis execution through an explicit provider selector that includes LM Studio, Ollama, and custom executable-backed local adapters.
- User-Visible Win: users can choose `Auto`, `Codex CLI`, `OpenAI Responses`, or `Local model runtime`, configure truthful local runtime preferences in the UI, see real readiness detail for LM Studio/Ollama/custom paths, and stop treating deployment posture as if it were provider choice.
- Proof Target: frontend/unit/backend/Rust tests pass, `check-WP-I6-003.ps1` passes, desktop/runtime evidence shows the truthful provider selector and local runtime detection, and the app recorder state can carry the selected local runtime profile plus model key without weakening audit/evidence boundaries.
- Allowed Temporary Fallbacks: browser/jsdom stays explicitly `browser-simulated`; local provider execution may remain unexercised on a given operator machine even when a runtime is detected; no fake live-provider claim is allowed and no broken screenshot capture is treated as proof.
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
- [x] Dependency graph/lock integrity tests
- [x] Runtime compatibility checks

### UI Contract Tests
- [x] Required regions/modes/states
- [x] Error/degraded-state UX

### Functional Flow Tests
- [x] Golden flow and edge cases
- [x] Persistence/replay/export flows

### Code Correctness Tests
- [x] Unit tests
- [x] Integration tests
- [x] Static analysis (lint/type/schema)

### Red-Team and Abuse Tests
- [x] Non-goal enforcement (spec section 3.2)
- [x] Policy bypass scenarios
- [x] Adversarial/invalid input cases

### Additional Tests
- [ ] Performance budgets
- [ ] Offline behavior
- [x] Reliability/recovery

## Fallback Register

- Explicit simulated/mock/sample paths: browser/jsdom remains `browser-simulated`; custom local runtime execution stays `tauri-unconfigured` until the operator supplies a valid executable plus argument template and any required model path; LM Studio/Ollama detection is real but not treated as a proof of generated output by itself.
- Required labels in code/UI/governance: `Deployment profile` must never be labeled as provider choice; local provider status must explicitly state whether it is detected/configured, unavailable, or degraded; browser fallback must continue to call itself simulated.
- Successor packet or debt owner: future I6 follow-on if the product needs first-class local runtime catalog browsing, one-click model selection, or user-approved live output capture against local models.
- Exit condition to remove fallback: a configured local runtime can be selected explicitly, produces real governed artifacts on demand, and the UI no longer conflates provider selection with deployment posture.

## Change Ledger

- What Became Real: the product now persists provider choice and local runtime settings independently from deployment posture, the settings menu exposes LM Studio/Ollama/custom local runtime controls, browser fallback stays explicit, the Tauri backend resolves LM Studio/Ollama/custom adapters without weakening the evidence-linked request contract, and local-provider output now strips `&lt;think&gt;...&lt;/think&gt;` reasoning blocks before governed UI delivery.
- What Remains Simulated: browser/jsdom still uses simulated gateway output, and this packet still lacks a desktop in-app screenshot of a generated local-model result because the bridge PNG capture path timed out on this machine. The operator-side LM Studio Gemma 4 runtime itself was exercised successfully.
- Next Blocking Real Seam: desktop-triggered governed local-model generation artifact capture from within the app plus a cleaner bridge PNG capture path if the current desktop snapshot timeout needs a governed fix packet.

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I6-003.ps1
- Proof Artifact: `.product/build_target/tool_artifacts/wp_runs/WP-I6-003/20260409_211100/`
- Claim Standard: do not claim completion without linked command output and artifact paths.

## Exit Criteria

- Task board and requirements index statuses are synchronized.
- Traceability, primitives index, and primitives matrix are synchronized.
- Linked test suite has executed results and evidence paths.
- Evidence bundle is attached.
- Reality Boundary, Fallback Register, and Change Ledger are truthful.
- User Sign-off: APPROVED.

## Evidence

- Test Suite Execution: `pnpm exec vitest run src/features/i6/i6.test.ts src/lib/backend.test.ts src/App.test.tsx --reporter=verbose`; `cargo test --manifest-path .product/Worktrees/wt_main/src-tauri/Cargo.toml`; `pnpm build`; `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I6-003.ps1`
- Logs: `.product/build_target/tool_artifacts/wp_runs/WP-I6-003/20260409_211100/summary.md`; `.product/build_target/tool_artifacts/wp_runs/WP-I6-003/20260409_211100/result.json`; `.product/build_target/tool_artifacts/wp_runs/WP-I6-003/20260409_211100/visual_proof/local_runtime_detection.txt`; `.product/build_target/tool_artifacts/wp_runs/WP-I6-003/20260409_211100/visual_proof/lmstudio_runtime_ls.txt`; `.product/build_target/tool_artifacts/wp_runs/WP-I6-003/20260409_211100/visual_proof/lmstudio_runtime_survey.txt`; `.product/build_target/tool_artifacts/wp_runs/WP-I6-003/20260409_211100/visual_proof/local_runtime_probe_success.txt`
- Screenshots/Exports: bridge PNG snapshot capture timed out on this desktop run and is not claimed as proof; desktop bridge health/state plus recorder/runtime evidence were copied into `.product/build_target/tool_artifacts/wp_runs/WP-I6-003/20260409_211100/visual_proof/`
- Build Artifacts: `.product/build_target/tool_artifacts/wp_runs/WP-I6-003/20260409_211100/visual_proof/bridge_health.json`; `.product/build_target/tool_artifacts/wp_runs/WP-I6-003/20260409_211100/visual_proof/bridge_state.json`; `.product/build_target/tool_artifacts/wp_runs/WP-I6-003/20260409_211100/visual_proof/recorder_state_local_provider.json`; `.product/build_target/tool_artifacts/wp_runs/WP-I6-003/20260409_211100/visual_proof/lmstudio_loaded_models.txt`
- Proof Artifact: `.product/build_target/tool_artifacts/wp_runs/WP-I6-003/20260409_211100/`
- User Sign-off:

## Progress Log

- 2026-04-09: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
- 2026-04-09: Scope refined to split provider selection from deployment profile and add a governed local-model runtime adapter for operator-supplied on-disk models.
- 2026-04-09: Product implementation landed in `wt_main` with recorder-backed provider selection, local runtime settings, LM Studio/Ollama/custom local adapter resolution, and truthful UI copy/status.
- 2026-04-09: Verification passed across App/I6/backend tests, `cargo test`, `pnpm build`, and the governed WP check runner.
- 2026-04-09: Local desktop runtime evidence captured for a detected LM Studio Gemma 4 model; bridge health/state succeeded while PNG snapshot capture timed out and was recorded truthfully as a capture limitation rather than proof.
- 2026-04-09: Selected the latest installed LM Studio CUDA12 runtime, loaded `google/gemma-4-26b-a4b`, captured a successful live local probe, and hardened the Tauri adapter to strip local-model `&lt;think&gt;...&lt;/think&gt;` blocks before UI delivery.
