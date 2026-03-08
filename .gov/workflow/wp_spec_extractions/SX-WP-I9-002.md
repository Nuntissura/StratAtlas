# SX-WP-I9-002 - Spec Extraction Snapshot

Generated On: 2026-03-08
Linked Work Packet: WP-I9-002
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I9-002.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I9-002.ps1
Packet Class Snapshot: IMPLEMENTATION
Workflow Version Snapshot: 4.0
WP Status Snapshot: E2E-VERIFIED
Iteration: I9

## Scope

Concrete extraction of requirement and primitive obligations this WP must satisfy before status promotion.

## Reality Boundary Snapshot

- Real Seam: the primary I9 path must materialize aggregate AOI alerts from approved connector templates plus governed context/deviation state, not from analyst hand-entry alone.
- User-Visible Win: analysts can run a curated connector and immediately receive labeled, aggregate-only AOI alerts with verification chips, threshold references, provenance lineage, and bundle-compatible restore behavior.
- Proof Target: `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I9-002.ps1` with passing unit/App regression, deterministic bundle/reopen proof, and packet-specific runtime evidence under `.product/build_target/tool_artifacts/wp_runs/WP-I9-002/`.
- Allowed Temporary Fallbacks: labeled `manual_override` entry may remain as an explicit analyst tool; packaged governed connector templates may stand in for live remote connector pulls during implementation, but they must stay labeled as curated governed templates.
- Promotion Guard: do not promote this packet until the governed connector path is the primary runtime, packet proof is captured, bundle replay is deterministic, and any remaining packaged-template or manual fallback debt is explicitly documented.

## Change Ledger Snapshot

- 2026-03-08: Packet upgraded to Workflow Version 4.0 and moved to `IN-PROGRESS` with an explicit reality boundary, fallback register, and promotion guard.
- 2026-03-08: `.product/Worktrees/wt_main/src/features/i9/osint.ts` now defines governed connector templates, source-mode snapshot state, deviation-aware connector execution, and aggregate alert metadata for bundle-safe restore.
- 2026-03-08: `.product/Worktrees/wt_main/src/App.tsx` now makes governed connector execution the primary I9 path, exposes connector metadata in the UI, and retains manual OSINT entry only as an explicit `manual_override`.
- 2026-03-08: Targeted validation passed for the new seam via `pnpm test -- --run src/features/i9/i9.test.ts src/lib/backend.test.ts` and `pnpm test -- --run src/App.test.tsx`.
- 2026-03-08: Packet closed as `E2E-VERIFIED` after `check-WP-I9-002.ps1` passed with cold/warm governed Tauri runtime smoke, full functional regression, lint, template compliance, red-team guardrail checks, build, and Rust unit verification under `.product/build_target/tool_artifacts/wp_runs/WP-I9-002/20260308_170238/`.
- What Became Real: analysts can now execute approved curated connectors that materialize aggregate AOI alerts from governed context records and deviation state, and that state survives recorder/bundle flows instead of living only in hand-entered form fields.
- What Remains Simulated: live remote connector fetches are not yet implemented; packaged approved connector templates remain the truthful governed fallback for this packet, and `manual_override` remains available as a labeled analyst fallback.
- Next Blocking Real Seam: `WP-I10-002` must now consume the proved governed I9 outputs inside the solver-backed strategic modeling runtime.

## Requirement Extraction

| Requirement | Level | Section | Description | Target | Status |
|-------------|-------|---------|-------------|--------|--------|
| REQ-1000 | MUST | ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â§7.4.4 | OSINT feeds from approved curated aggregators only | I9 | E2E-VERIFIED |
| REQ-1001 | MUST | ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â§7.4.6 | OSINT events carry verification level (confirmed/reported/alleged); alleged visually distinct | I9 | E2E-VERIFIED |
| REQ-1002 | MUST | ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â§13.4 | Alerts aggregate/statistical, scoped to AOIs, never entity-pursuit | I9 | E2E-VERIFIED |
| REQ-1003 | MAY | ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â§13.4 | Alerts reference context domain thresholds | I9 | E2E-VERIFIED |

## Primitive Extraction

| Primitive | Name | Contract | REQs | First Iter | Status |
|-----------|------|----------|------|------------|--------|
| PRIM-0056 | Curated Feed Connector | Connect approved OSINT and economic indicator sources through governed normalization, provenance, and verification-label contracts | REQ-1000, REQ-1001, REQ-1002, REQ-1003 | I9 | E2E-VERIFIED |
| PRIM-0057 | Aggregate Alert Evaluator | Evaluate threshold and deviation conditions only at aggregate level and emit governed alert artifacts with verification labels and audit trails | REQ-1000, REQ-1001, REQ-1002, REQ-1003 | I9 | E2E-VERIFIED |

## Traceability Hooks

- REQ-1000: Mapped in TRACEABILITY_MATRIX.md
- REQ-1001: Mapped in TRACEABILITY_MATRIX.md
- REQ-1002: Mapped in TRACEABILITY_MATRIX.md
- REQ-1003: Mapped in TRACEABILITY_MATRIX.md

## Non-Goal / Red-Team Guardrails

- No individual targeting/stalking workflows.
- No covert affiliation inference.
- No social-media scraping ingestion.
- No leaked/hacked/scraped-against-terms data pipelines.
- No financial trading or prediction tooling.

## Verification Hooks

- Run preflight: powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1
- Run WP checks: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I9-002.ps1
- Proof artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I9-002/
