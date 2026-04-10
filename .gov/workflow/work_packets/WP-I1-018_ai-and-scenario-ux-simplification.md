# WP-I1-018 - AI and Scenario UX Simplification

Date Opened: 2026-04-09
Status: IMPLEMENTED
Iteration: I1
Workflow Version: 4.0
Packet Class: IMPLEMENTATION
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I1-018.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I1-018.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I1-018.ps1

## Intent

Simplify the verified assistant and scenario surfaces so the first action is obvious, advanced runtime/modeling controls are disclosed only when needed, and the map-first shell stays calm instead of forcing dense configuration forms into the default view.

## Linked Requirements

- REQ-0013
- REQ-0500
- REQ-0700

## Linked Primitives

- PRIM-0071 | Map-First Workbench Shell | This packet refines the existing workbench composition so AI and scenario actions fit the calmer map-first shell instead of expanding into permanently dense form stacks.

## Primitive Matrix Impact

- Add/update rows in `.gov/Spec/PRIMITIVES_MATRIX.md` for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## Reality Boundary

- Real Seam: the live assistant and scenario surfaces are reorganized around guided workflow cards, explicit advanced disclosures, and settings-linked runtime access while preserving the verified AI analysis, MCP, scenario compare, and scenario export seams.
- User-Visible Win: analysts see a clearer assistant entry point and a clearer scenario workflow, with the dense configuration fields moved out of the default path and the next action readable at a glance.
- Proof Target: assistant/scenario regressions pass, `pnpm build` passes, `check-WP-I1-018.ps1` passes, and the live bridge captures the simplified assistant and scenario surfaces.
- Allowed Temporary Fallbacks: browser/jsdom remains a non-desktop proof environment; disclosure state may remain ephemeral as long as the underlying AI/scenario state and results stay deterministic and restore correctly.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to `E2E-VERIFIED`.

## In Scope

- Simplify the left assistant panel so prompt, readiness, probe, and result actions are primary while runtime/MCP controls move behind explicit disclosure or settings entry points.
- Simplify the right scenario panel so fork/select/compare/export are primary while raw constraint/entity forms move behind explicit advanced modeling disclosure.
- Add concise workflow-copy and summary cards that explain what each region does without forcing implementation detail first.
- Preserve existing real AI, MCP, scenario compare, and scenario export actions, labels, and truthfulness.

## Out of Scope

- New AI providers, new MCP tools, new scenario solver logic, or new data capabilities.
- Generic onboarding, detached wizard flows, or autonomous assistant behavior.
- Recorder-schema expansion for disclosure-only UI state unless needed for correctness.

## Expected Files Touched

- .gov/Spec/stratatlas_spec_v1_2.md
- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/Spec/sub-specs/I1_ai_and_scenario_ux_simplification.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-I1-018_ai-and-scenario-ux-simplification.md
- .gov/workflow/wp_test_suites/TS-WP-I1-018.md
- .gov/workflow/wp_spec_extractions/SX-WP-I1-018.md
- .gov/workflow/wp_checks/check-WP-I1-018.ps1
- .product/Worktrees/wt_main/src/App.tsx
- .product/Worktrees/wt_main/src/App.css
- .product/Worktrees/wt_main/src/App.test.tsx

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0071 | assistant + scenario workflow simplification | React shell composition, disclosure controls, persisted recorder-backed workflow state, bridge snapshot proof | The verified AI and scenario flows become easier to use without adding new runtime capability or breaking the calmer map-first workbench. |

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
- [ ] Reliability/recovery

## Fallback Register

- Explicit simulated/mock/sample paths: browser/jsdom remains simulated relative to the live desktop shell; this packet does not add new simulated runtime behavior to product code outside tests.
- Required labels in code/UI/governance: AI states must remain policy-gated and truthful; `constraint_node` context must remain labeled as modeled scenario input rather than observed evidence.
- Successor packet or debt owner: if future work needs deeper AI workflow restructuring or new scenario capabilities, queue a successor packet rather than broadening this UI simplification slice.
- Exit condition to remove fallback: the simplified assistant and scenario surfaces run the existing real workflows and are captured through live bridge proof.

## Change Ledger

- What Became Real: the assistant surface now leads with a governed workflow card while provider/runtime/MCP tuning sits behind explicit disclosure, and the scenario surface now leads with fork/compare/export while raw constraint/entity controls stay behind advanced modeling disclosure. The headless bridge now also enters scenario/compare workflows through the full-workbench path so live proof reaches the shipped surface without recorder-state hacks.
- What Remains Simulated: browser/jsdom remains a non-desktop proof environment relative to the live Tauri shell; no new simulated runtime behavior was added to product code outside tests.
- Next Blocking Real Seam: no additional implementation seam remains inside this packet; user sign-off is the remaining blocker before any `E2E-VERIFIED` promotion.

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-018.ps1`
- Proof Artifact: `.product/build_target/tool_artifacts/wp_runs/WP-I1-018/`
- Claim Standard: do not claim completion without linked command output and artifact paths.

## Exit Criteria

- Task board and requirements index statuses are synchronized.
- Traceability, primitives index, and primitives matrix are synchronized.
- Linked test suite has executed results and evidence paths.
- Evidence bundle is attached.
- Reality Boundary, Fallback Register, and Change Ledger are truthful.
- User Sign-off: APPROVED.

## Evidence

- Test Suite Execution: `pnpm exec vitest run src/App.test.tsx`; `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-018.ps1`
- Logs: `.product/build_target/tool_artifacts/wp_runs/WP-I1-018/20260410_004711/summary.md`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-018/20260410_004711/UI-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-018/20260410_004711/FUNC-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-018/20260410_004711/COR-001.log`
- Screenshots/Exports: `.product/build_target/tool_artifacts/wp_runs/WP-I1-018/20260410_004711/visual_proof/assistant_default_live.png`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-018/20260410_004711/visual_proof/scenario_workflow_live.png`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-018/20260410_004711/visual_proof_summary.md`
- Build Artifacts: `pnpm build`; `pnpm tauri build -d --no-bundle`; built desktop app at `.product/Worktrees/wt_main/src-tauri/target/debug/stratatlas_app.exe`
- Proof Artifact: `.product/build_target/tool_artifacts/wp_runs/WP-I1-018/20260410_004711/`
- User Sign-off: Pending

## Progress Log

- 2026-04-09: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
- 2026-04-09: Governance packet, linked sub-spec, taskboard row, roadmap row, and traceability/primitives rows were rewritten from placeholder state and checkpointed in commit `b62fcad`.
- 2026-04-10: Assistant and scenario workflow surfaces were simplified in `App.tsx`/`App.css`, regression coverage landed in `App.test.tsx`, and the WP check runner was narrowed to the packet's governed scope.
- 2026-04-10: The headless bridge scenario route was aligned with the full-workbench workflow path, `check-WP-I1-018.ps1` passed, and live desktop snapshots for the assistant and scenario surfaces were attached under `.product/build_target/tool_artifacts/wp_runs/WP-I1-018/20260410_004711/visual_proof/`.
