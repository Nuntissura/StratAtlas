# SX-WP-I8-002 - Spec Extraction Snapshot

Generated On: 2026-03-08
Linked Work Packet: WP-I8-002
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I8-002.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I8-002.ps1
Packet Class Snapshot: IMPLEMENTATION
Workflow Version Snapshot: 4.0
WP Status Snapshot: IN-PROGRESS
Iteration: I8

## Scope

Concrete extraction of requirement and primitive obligations this WP must satisfy before status promotion.

## Reality Boundary Snapshot

- Real Seam: deviation detection derives reproducible baseline and observed windows directly from governed context records for the selected domain and AOI instead of relying on analyst-entered numeric strings.
- User-Visible Win: analysts can select an approved context domain and immediately see a truthful historical baseline, current observation window, deviation score, and scenario/map propagation without hand-building the input series.
- Proof Target: `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I8-002.ps1` with passing product tests, deterministic bundle/reopen proof, and governed desktop runtime smoke assertions attached under `.product/build_target/tool_artifacts/wp_runs/WP-I8-002/`.
- Allowed Temporary Fallbacks: labeled manual numeric entry may remain as an analyst override while the governed windowed path becomes the default; no unlabeled seeded or hidden simulated deviation path is allowed.

## Change Ledger Snapshot

- 2026-03-08: Packet upgraded to Workflow Version 4.0 and moved to `IN-PROGRESS` with an explicit real seam, fallback register, and promotion guard.
- What Became Real: governance now truthfully defines I8 as a governed time-series/runtime packet instead of a generic scaffold; product seam implementation begins from this checkpoint.
- What Remains Simulated: the current App still relies on manually populated baseline/observed inputs as the primary analyst path until the governed windowed runtime lands.
- Next Blocking Real Seam: derive and persist explicit baseline/observed windows from governed context records so deviation events become reproducible across map, scenario, alert, and bundle reopen flows.

## Requirement Extraction

| Requirement | Level | Section | Description | Target | Status |
|-------------|-------|---------|-------------|--------|--------|
| REQ-0900 | SHOULD | Section 13.5 | Trade flow deviation detection vs historical baseline | I8 | IN-PROGRESS |
| REQ-0901 | SHOULD | Section 13.5 | Infrastructure status deviation detection | I8 | IN-PROGRESS |
| REQ-0902 | SHOULD | Section 13.5 | Regulatory regime change detection for active AOIs | I8 | IN-PROGRESS |
| REQ-0903 | MUST | Section 13.5 | Deviation events emitted through standard Event model with context.deviation taxonomy | I8 | IN-PROGRESS |
| REQ-0904 | MUST | Section 7.4.7 | constraint_node domains available in Scenario Workspace | I8 | IN-PROGRESS |

## Primitive Extraction

| Primitive | Name | Contract | REQs | First Iter | Status |
|-----------|------|----------|------|------------|--------|
| PRIM-0062 | Historical Deviation Detector | Detect governed deviations over persisted context series, emit standardized events, and propagate results into downstream scenario and alert workflows | REQ-0900, REQ-0901, REQ-0902, REQ-0903, REQ-0904 | I8 | IN-PROGRESS |

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
