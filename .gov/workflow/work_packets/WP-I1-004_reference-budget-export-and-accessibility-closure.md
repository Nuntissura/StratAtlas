# WP-I1-004 - Reference Budget Export and Accessibility Closure

Date Opened: 2026-03-08
Status: IN-PROGRESS
Iteration: I1
Workflow Version: 4.0
Packet Class: IMPLEMENTATION
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I1-004.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I1-004.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I1-004.ps1

## Intent

Close the remaining runtime-budget, export-timing, and accessibility debt on top of the governed I1 map runtime so Gate E can be promoted with reference-hardware evidence instead of inferred smoke timings.

## Linked Requirements

- GATE-E
- REQ-0014
- REQ-0015
- REQ-0016
- REQ-0206
- REQ-0207
- REQ-0208
- REQ-0209
- REQ-0210
- REQ-0212

## Linked Primitives

- PRIM-0047 | Budgeted Interaction Telemetry | Extends the existing timing/degraded-state primitive with explicit reference-hardware proof for startup, pan/zoom, scrub, and export flows.
- PRIM-0067 | Reference Budget Evidence Harness | Adds packet-specific timing capture, export-duration summaries, and promotion-grade evidence artifacts for Gate E.
- PRIM-0068 | Accessible Map Interaction Contract | Closes the remaining keyboard and non-color-only semantics gap across the live map surface and its connected overlays.

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## Reality Boundary

- Real Seam: The governed MapLibre/Cesium runtime must emit packet-specific startup, interaction, scrub, and export timing evidence while the live map workspace exposes keyboard-reachable controls and non-color-only semantics for the same runtime states.
- User-Visible Win: Analysts get a map-first desktop runtime that feels measurably responsive, exports proof-grade artifacts within budget, and stays usable without relying on mouse-only or color-only cues.
- Proof Target: `check-WP-I1-004.ps1` plus cold/warm Tauri runtime smoke, timed 4K/export artifacts, and accessibility-focused UI assertions under `.product/build_target/tool_artifacts/wp_runs/WP-I1-004/`.
- Allowed Temporary Fallbacks: Non-blocking degraded/progress indicators may remain when budget thresholds are exceeded during development, but they must be explicit in the UI and are not valid for requirement promotion; browser/jsdom accessibility assertions may supplement but not replace Tauri runtime proof.
- Promotion Guard: Do not promote linked requirements or Gate E unless packet-specific evidence shows reference-hardware startup/state-change/export timings within budget and the map runtime passes keyboard/non-color accessibility assertions.

## In Scope

- Instrument startup, pan/zoom, scrub, 4K export, and briefing export timing capture in the real desktop runtime.
- Tighten map/runtime accessibility semantics for controls, overlays, alerts, deviations, and modeled outputs that project into the I1 surface.
- Add packet-specific smoke/test coverage and artifact summaries that bind timing and accessibility results to status promotion.

## Out of Scope

- macOS runtime smoke execution and Gate H promotion; that follow-on proof belongs to `WP-GOV-PORT-002`.
- New map features or cosmetic redesign work unrelated to the remaining budget/accessibility requirements.

## Expected Files Touched

- .gov/Spec/stratatlas_spec_v1_2.md
- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-I1-004_reference-budget-export-and-accessibility-closure.md
- .gov/workflow/wp_test_suites/TS-WP-I1-004.md
- .gov/workflow/wp_spec_extractions/SX-WP-I1-004.md
- .gov/workflow/wp_checks/check-WP-I1-004.ps1
- .product/Worktrees/wt_main/src/App.tsx
- .product/Worktrees/wt_main/src/App.test.tsx
- .product/Worktrees/wt_main/src/features/i1/components/MapRuntimeSurface.tsx
- .product/Worktrees/wt_main/src/features/i1/i1.test.ts
- .product/Worktrees/wt_main/src/features/i1/runtime/mapRuntimeTelemetry.ts
- .product/Worktrees/wt_main/src/lib/runtimeSmoke.ts
- .product/Worktrees/wt_main/scripts/runtime-smoke.mjs
- .product/Worktrees/wt_main/src-tauri/src/lib.rs

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0047 | live runtime timing capture | React, Tauri, Rust timing hooks | Existing map/runtime telemetry becomes promotion-grade instead of advisory-only.
| PRIM-0067 | packet-specific budget evidence harness | runtime smoke, export timers, artifact summaries | Startup, interaction, and export budgets are measured and attached to packet proof.
| PRIM-0068 | accessible map and overlay controls | React semantics, keyboard handlers, labeled overlays | The same map-linked workflows remain usable without color-only or mouse-only interaction.

## Spec-Test Coverage Plan

### Dependency and Environment Tests
- [ ] Governance preflight and packet-check prerequisites pass.
- [ ] Tauri runtime timing hooks and export adapters are available in the packet runner.

### UI Contract Tests
- [ ] Map runtime controls and overlay affordances are keyboard reachable.
- [ ] Non-color-only labels and degraded-state feedback appear when budgets are approached or exceeded.

### Functional Flow Tests
- [ ] Cold/warm startup and map interaction timing capture completes in packet-specific smoke.
- [ ] 4K export and briefing export flows produce timed artifacts tied to the active bundle/runtime state.

### Code Correctness Tests
- [ ] Unit and integration coverage for timing summaries and accessibility regressions.
- [ ] Static analysis (`pnpm lint`, build/test checks) remains clean.

### Red-Team and Abuse Tests
- [ ] No accessibility shortcut removes policy labels or uncertainty markings.
- [ ] Export and runtime-proof paths do not expose disallowed operational or individual-level output.

### Additional Tests
- [ ] Reference-hardware startup, pan/zoom, scrub, and export budgets are captured and evaluated.
- [ ] Runtime smoke still records offline/degraded behavior correctly.
- [ ] Export/reopen reliability remains deterministic under packet proof.

## Fallback Register

- Explicit simulated/mock/sample paths: Existing I1 budget claims rely on earlier smoke summaries rather than packet-specific reference-hardware proof; some map affordances still depend on general card labels instead of dedicated keyboard/ARIA coverage.
- Required labels in code/UI/governance: Any degraded or over-budget state must remain explicitly labeled in the UI and in packet evidence; no timing claim may be presented as passed without artifact-backed measurement.
- Successor packet or debt owner: `WP-GOV-PORT-002` owns the remaining macOS-specific portability proof after this packet closes the Windows/reference-runtime budget and accessibility seam.
- Exit condition to remove fallback: Packet proof shows promoted startup/interaction/export budgets and accessibility semantics in the governed runtime with no remaining inferred-only evidence paths.

## Change Ledger

- What Became Real: The live map surface now captures a governed 4K export artifact through the real MapLibre/Cesium runtime, persists PNG plus metadata via the Tauri backend, and records packet-specific cold/warm smoke proof with accessibility and export assertions under `wp_runs/WP-I1-004/`.
- What Remains Simulated: The packet still does not have a dedicated 2D pan/zoom frame-time probe tied to `REQ-0206`, and the current warm startup evidence remains above the 3.0 s requirement threshold on the dev-mode runtime.
- Next Blocking Real Seam: Add packet-grade 2D pan/zoom instrumentation and bring warm startup-to-shell within the `REQ-0015` budget so Gate E can be promoted without inference.

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-004.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I1-004/
- Claim Standard: do not claim completion without linked command output and artifact paths.

## Exit Criteria

- Task board and requirements index statuses are synchronized.
- Traceability, primitives index, and primitives matrix are synchronized.
- Linked test suite has executed results and evidence paths.
- Evidence bundle is attached.
- Reality Boundary, Fallback Register, and Change Ledger are truthful.
- User Sign-off: APPROVED.

## Evidence

- Test Suite Execution: `pnpm exec vitest run src/App.test.tsx src/features/i1/i1.test.ts`; `pnpm lint`; `pnpm build`; `cargo test --manifest-path src-tauri/Cargo.toml --no-run`; `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-004.ps1`
- Logs: `.product/build_target/tool_artifacts/wp_runs/WP-I1-004/20260308_211610/summary.md`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-004/20260308_211610/UI-001.log`
- Screenshots/Exports: `.product/build_target/tool_artifacts/wp_runs/WP-I1-004/20260308_211610/runtime_smoke/runtime_smoke_summary.md`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-004/20260308_211610/runtime_smoke/cold/runtime_proof/map_exports/map-export-aoi-2-planar-20260308_201644z.png`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-004/20260308_211610/runtime_smoke/warm/runtime_proof/map_exports/map-export-aoi-2-planar-20260308_201725z.png`
- Build Artifacts: `.product/build_target/tool_artifacts/wp_runs/WP-I1-004/20260308_211610/runtime_smoke/cold/runtime_smoke_report.json`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-004/20260308_211610/runtime_smoke/warm/runtime_smoke_report.json`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-004/20260308_211610/result.json`
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I1-004/
- User Sign-off:

## Progress Log

- 2026-03-08: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
- 2026-03-08: Packet activated as the current blocker for the remaining Gate E debt, with reference-runtime timing and accessibility closure defined as the real seam.
- 2026-03-08: Local validation passed for the first runtime slice via targeted Vitest coverage, `pnpm build`, Rust compile, and packet-specific manual smoke at `.product/build_target/tool_artifacts/manual_runtime_smoke/WP-I1-004_slice/`; startup-to-shell measured 2235 ms cold / 2820 ms warm, briefing artifact proof passed, and accessibility assertions passed, while the real 4K export path plus formal packet proof remain open.
- 2026-03-08: Product remediation added the real 4K map export path, packet-specific export persistence, immediate pressed-state feedback on surface-mode toggles, and runtime-smoke guardrails that fail fast when the export request does not enter the governed flow.
- 2026-03-08: Official packet proof passed via `.product/build_target/tool_artifacts/wp_runs/WP-I1-004/20260308_211610/`; cold/warm 4K export timings measured 2540 ms / 2575 ms, briefing export remained within the 15 s budget, accessibility assertions passed, and planar restore feedback measured 15 ms / 18 ms. Packet remains `IN-PROGRESS` because warm startup still measured 3432 ms against `REQ-0015`, and `REQ-0206` still needs a dedicated 2D pan/zoom probe.
