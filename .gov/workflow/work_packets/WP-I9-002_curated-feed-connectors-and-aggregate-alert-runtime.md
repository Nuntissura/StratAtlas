# WP-I9-002 - Curated Feed Connectors and Aggregate Alert Runtime

Date Opened: 2026-03-06
Status: E2E-VERIFIED
Iteration: I9
Workflow Version: 4.0
Packet Class: IMPLEMENTATION
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I9-002.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I9-002.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I9-002.ps1

## Intent

Replace manual-first OSINT event entry and static feed simulation with a governed connector runtime that materializes curated AOI alerts from approved connector templates, governed context state, and standardized deviation outputs. This packet restores I9 as a context-aware, aggregate-only alert surface that remains auditable, bundle-safe, and visibly bounded by the misuse rules in the spec.

## Linked Requirements

- REQ-1000
- REQ-1001
- REQ-1002
- REQ-1003

## Linked Primitives

- PRIM-0056 | Curated Feed Connector | Bring approved OSINT and economic indicator sources into the governed runtime with provenance and verification labeling.
- PRIM-0057 | Aggregate Alert Evaluator | Evaluate only aggregate conditions and emit governed alert artifacts with audit capture.

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Create governance checkpoint commit before product implementation.

## Reality Boundary

- Real Seam: the primary I9 path must materialize aggregate AOI alerts from approved connector templates plus governed context/deviation state, not from analyst hand-entry alone.
- User-Visible Win: analysts can run a curated connector and immediately receive labeled, aggregate-only AOI alerts with verification chips, threshold references, provenance lineage, and bundle-compatible restore behavior.
- Proof Target: `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I9-002.ps1` with passing unit/App regression, deterministic bundle/reopen proof, and packet-specific runtime evidence under `.product/build_target/tool_artifacts/wp_runs/WP-I9-002/`.
- Allowed Temporary Fallbacks: labeled `manual_override` entry may remain as an explicit analyst tool; packaged governed connector templates may stand in for live remote connector pulls during implementation, but they must stay labeled as curated governed templates.
- Promotion Guard: do not promote this packet until the governed connector path is the primary runtime, packet proof is captured, bundle replay is deterministic, and any remaining packaged-template or manual fallback debt is explicitly documented.

## In Scope

- Implement governed connector materialization that derives curated OSINT events from approved connector templates and active governed context/deviation state.
- Rewire the App so governed connector execution is the primary I9 runtime path and manual event entry becomes an explicitly labeled fallback.
- Preserve aggregate-only alert semantics, verification labels, threshold references, provenance lineage, audit capture, and bundle reopen behavior.

## Out of Scope

- Closing live remote connector fetch or sync behavior beyond the packaged governed connector seam introduced in this slice.
- Any individual-targeting, stalking, covert affiliation inference, social-media scraping, or other prohibited alert behavior from spec section 3.2.
- Closing solver or AI packets that only consume I9 alert outputs.

## Expected Files Touched

- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/Spec/sub-specs/I9_osint_economic_context_queries.md
- .gov/workflow/ROADMAP.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-I9-002_curated-feed-connectors-and-aggregate-alert-runtime.md
- .gov/workflow/wp_test_suites/TS-WP-I9-002.md
- .gov/workflow/wp_spec_extractions/SX-WP-I9-002.md
- .gov/workflow/wp_checks/check-WP-I9-002.ps1
- .product/Worktrees/wt_main/src/features/i9/osint.ts
- .product/Worktrees/wt_main/src/App.tsx
- .product/Worktrees/wt_main/src/App.test.tsx
- .product/Worktrees/wt_main/src/features/i9/i9.test.ts

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0056 | governed connector catalog and materializer | TypeScript connector templates, governed context reuse, deviation-linked provenance | Replaces hand-entered feed simulation with approved connector-backed event generation. |
| PRIM-0057 | aggregate alert runtime | AOI-scoped event aggregation, threshold references, audit payloads, bundle restore | Keeps alerting aggregate-only, reviewable, deterministic, and connected to the context/deviation substrate. |

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

- Explicit simulated/mock/sample paths: packaged governed connector templates currently stand in for live remote connector pulls; labeled `manual_override` event entry remains available for analyst-entered fallback behavior.
- Required labels in code/UI/governance: governed path must remain labeled `governed_connector` / `Curated Context`; analyst-entered fallback must remain labeled `manual_override`; alerts must remain labeled aggregate-only and anti-entity-pursuit.
- Successor packet or debt owner: `WP-I9-002` retains ownership of the remaining live-connector debt after packet closure; `WP-I10-002` may only consume I9 outputs because this seam is now proved.
- Exit condition to remove fallback: governed connector execution, bundle reopen, and packet-specific proof must pass end to end, after which packaged-template and manual fallback debt can be reduced or explicitly retained as analyst tooling only.

## Change Ledger

- 2026-03-08: Packet upgraded to Workflow Version 4.0 and moved to `IN-PROGRESS` with an explicit reality boundary, fallback register, and promotion guard.
- 2026-03-08: `.product/Worktrees/wt_main/src/features/i9/osint.ts` now defines governed connector templates, source-mode snapshot state, deviation-aware connector execution, and aggregate alert metadata for bundle-safe restore.
- 2026-03-08: `.product/Worktrees/wt_main/src/App.tsx` now makes governed connector execution the primary I9 path, exposes connector metadata in the UI, and retains manual OSINT entry only as an explicit `manual_override`.
- 2026-03-08: Targeted validation passed for the new seam via `pnpm test -- --run src/features/i9/i9.test.ts src/lib/backend.test.ts` and `pnpm test -- --run src/App.test.tsx`.
- 2026-03-08: Packet closed as `E2E-VERIFIED` after `check-WP-I9-002.ps1` passed with cold/warm governed Tauri runtime smoke, full functional regression, lint, template compliance, red-team guardrail checks, build, and Rust unit verification under `.product/build_target/tool_artifacts/wp_runs/WP-I9-002/20260308_170238/`.
- What Became Real: analysts can now execute approved curated connectors that materialize aggregate AOI alerts from governed context records and deviation state, and that state survives recorder/bundle flows instead of living only in hand-entered form fields.
- What Remains Simulated: live remote connector fetches are not yet implemented; packaged approved connector templates remain the truthful governed fallback for this packet, and `manual_override` remains available as a labeled analyst fallback.
- Next Blocking Real Seam: `WP-I10-002` must now consume the proved governed I9 outputs inside the solver-backed strategic modeling runtime.

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I9-002.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I9-002/
- Claim Standard: never mark completion without linked command evidence and artifact paths.

## Exit Criteria

- Task board and requirements index statuses are synchronized.
- Traceability, primitives index, and primitives matrix are synchronized.
- Linked test suite has executed results and evidence paths.
- Evidence bundle is attached.
- Reality Boundary, Fallback Register, and Change Ledger remain truthful.
- User Sign-off: APPROVED.

## Evidence

- Test Suite Execution: `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I9-002.ps1`
- Logs: official closeout passed on 2026-03-08 with governed runtime smoke, full functional regression, lint, template compliance, red-team guardrail checks, build, and Rust unit verification.
- Screenshots/Exports:
- Build Artifacts: `.product/build_target/tool_artifacts/wp_runs/WP-I9-002/20260308_170238/EXT-001.log`
- Proof Artifact: `.product/build_target/tool_artifacts/wp_runs/WP-I9-002/20260308_170238/`
- User Sign-off: Approved via 2026-03-08 instruction to start `WP-I9-002`.

## Progress Log

- 2026-03-06: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
- 2026-03-06: Packet scope refined to restore curated-source connectors and aggregate-only alert evaluation after the audit.
- 2026-03-08: Packet upgraded to Workflow Version 4.0 and started with governed connector materialization as the primary seam.
- 2026-03-08: First product slice landed governed connector templates, deviation-aware aggregate alert evaluation, App primary-path wiring, and targeted unit/App regression coverage.
- 2026-03-08: Official packet proof passed at `.product/build_target/tool_artifacts/wp_runs/WP-I9-002/20260308_170238/`, closing REQ-1000..REQ-1003 and promoting `PRIM-0056` / `PRIM-0057` to `E2E-VERIFIED`.
