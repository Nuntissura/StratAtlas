# SX-WP-I8-002 - Spec Extraction Snapshot

Generated On: 2026-03-08
Linked Work Packet: WP-I8-002
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I8-002.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I8-002.ps1
Packet Class Snapshot: IMPLEMENTATION
Workflow Version Snapshot: 4.0
WP Status Snapshot: E2E-VERIFIED
Iteration: I8

## Scope

Concrete extraction of requirement and primitive obligations this WP must satisfy before status promotion.

## Reality Boundary Snapshot

- Real Seam: deviation detection derives reproducible baseline and observed windows directly from governed context records for the selected domain and AOI instead of relying on analyst-entered numeric strings.
- User-Visible Win: analysts can select an approved context domain and immediately see a truthful historical baseline, current observation window, deviation score, and scenario/map propagation without hand-building the input series.
- Proof Target: `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I8-002.ps1` with passing product tests, deterministic bundle/reopen proof, and governed desktop runtime smoke assertions attached under `.product/build_target/tool_artifacts/wp_runs/WP-I8-002/`.
- Allowed Temporary Fallbacks: labeled manual numeric entry may remain as an analyst override while the governed windowed path becomes the default; no unlabeled seeded or hidden simulated deviation path is allowed.
- Promotion Guard: do not promote this packet until the governed path is the primary runtime, replay is deterministic, and downstream scenario/map propagation is proved against persisted context history.

## Change Ledger Snapshot

- 2026-03-08: Packet upgraded to Workflow Version 4.0 and moved to `IN-PROGRESS` with an explicit real seam, fallback register, and promotion guard.
- 2026-03-08: `src/features/i8/deviation.ts` now derives explicit baseline and observed windows from governed context records, attaches window/sample metadata to deviation events, and persists replay-safe deviation config.
- 2026-03-08: `src/App.tsx` now defaults the live deviation workspace to `governed_series`, exposes baseline/observed point counts, keeps manual entry as a labeled override, and records governed-source deviation events into the scenario workflow.
- 2026-03-08: Packet closed as `E2E-VERIFIED` after `check-WP-I8-002.ps1` passed with full functional regression, lint/build/Rust verification, and cold/warm Tauri runtime smoke proving governed deviation recording, bundle reopen restoration, map projection, and deviation-linked scenario constraint propagation under `.product/build_target/tool_artifacts/wp_runs/WP-I8-002/20260308_154423/`.
- What Became Real: governed historical deviation detection is now the primary runtime path, bundle capture waits for persisted deviation state, the map runtime exposes deviation-linked signals, and scenario forks can apply deviation-derived `constraint_node` suggestions after bundle reopen.
- What Remains Simulated: the labeled `manual override` entry path remains available as an explicit analyst fallback; no hidden simulated deviation path remains in the primary runtime seam.
- Next Blocking Real Seam: `WP-I9-002` must now consume the standardized governed deviation outputs for aggregate-only alert evaluation and connector-backed alert aggregation.

## Requirement Extraction

| Requirement | Level | Section | Description | Target | Status |
|-------------|-------|---------|-------------|--------|--------|
| REQ-0900 | SHOULD | Ãƒâ€šÃ‚Â§13.5 | Trade flow deviation detection vs historical baseline | I8 | E2E-VERIFIED |
| REQ-0901 | SHOULD | Ãƒâ€šÃ‚Â§13.5 | Infrastructure status deviation detection | I8 | E2E-VERIFIED |
| REQ-0902 | SHOULD | Ãƒâ€šÃ‚Â§13.5 | Regulatory regime change detection for active AOIs | I8 | E2E-VERIFIED |
| REQ-0903 | MUST | Ãƒâ€šÃ‚Â§13.5 | Deviation events emitted through standard Event model with context.deviation taxonomy | I8 | E2E-VERIFIED |
| REQ-0904 | MUST | Ãƒâ€šÃ‚Â§7.4.7 | constraint_node domains available in Scenario Workspace | I8 | E2E-VERIFIED |

## Primitive Extraction

| Primitive | Name | Contract | REQs | First Iter | Status |
|-----------|------|----------|------|------------|--------|
| PRIM-0062 | Historical Deviation Detector | Detect governed deviations over persisted context series, emit standardized events, and propagate results into downstream scenario and alert workflows | REQ-0900, REQ-0901, REQ-0902, REQ-0903, REQ-0904 | I8 | E2E-VERIFIED |

## Traceability Hooks

- REQ-0900: Mapped in TRACEABILITY_MATRIX.md
- REQ-0901: Mapped in TRACEABILITY_MATRIX.md
- REQ-0902: Mapped in TRACEABILITY_MATRIX.md
- REQ-0903: Mapped in TRACEABILITY_MATRIX.md
- REQ-0904: Mapped in TRACEABILITY_MATRIX.md

## Non-Goal / Red-Team Guardrails

- No individual targeting/stalking workflows.
- No covert affiliation inference.
- No social-media scraping ingestion.
- No leaked/hacked/scraped-against-terms data pipelines.
- No financial trading or prediction tooling.

## Verification Hooks

- Run preflight: powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1
- Run WP checks: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I8-002.ps1
- Proof artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I8-002/
