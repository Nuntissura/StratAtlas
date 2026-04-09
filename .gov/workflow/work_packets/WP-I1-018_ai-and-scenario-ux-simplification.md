# WP-I1-018 - AI and Scenario UX Simplification

Date Opened: 2026-04-09
Status: IN-PROGRESS
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

- Explicit simulated/mock/sample paths: browser/jsdom remains simulated relative to the live desktop shell; this packet does not add new simulated runtime behavior to product code outside tests.
- Required labels in code/UI/governance: AI states must remain policy-gated and truthful; `constraint_node` context must remain labeled as modeled scenario input rather than observed evidence.
- Successor packet or debt owner: if future work needs deeper AI workflow restructuring or new scenario capabilities, queue a successor packet rather than broadening this UI simplification slice.
- Exit condition to remove fallback: the simplified assistant and scenario surfaces run the existing real workflows and are captured through live bridge proof.

## Change Ledger

- What Became Real: governance now scopes a concrete shell simplification seam for the assistant and scenario regions instead of a generic placeholder packet.
- What Remains Simulated: the current default assistant and scenario surfaces still expose dense always-visible control stacks until the product implementation lands.
- Next Blocking Real Seam: implement the simplified assistant/scenario composition in `App.tsx` and prove the live shell through tests and bridge snapshots.

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

- Test Suite Execution:
- Logs:
- Screenshots/Exports:
- Build Artifacts:
- Proof Artifact: `.product/build_target/tool_artifacts/wp_runs/WP-I1-018/`
- User Sign-off:

## Progress Log

- 2026-04-09: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
