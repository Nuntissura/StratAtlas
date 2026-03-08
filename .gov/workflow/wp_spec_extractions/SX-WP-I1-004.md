# SX-WP-I1-004 - Spec Extraction Snapshot

Generated On: 2026-03-08
Linked Work Packet: WP-I1-004
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I1-004.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I1-004.ps1
Packet Class Snapshot: IMPLEMENTATION
Workflow Version Snapshot: 4.0
WP Status Snapshot: IN-PROGRESS
Iteration: I1

## Scope

Concrete extraction of requirement and primitive obligations this WP must satisfy before status promotion.

## Reality Boundary Snapshot

- Real Seam: The governed MapLibre/Cesium runtime must emit packet-specific startup, interaction, scrub, and export timing evidence while the live map workspace exposes keyboard-reachable controls and non-color-only semantics for the same runtime states.
- User-Visible Win: Analysts get a map-first desktop runtime that feels measurably responsive, exports proof-grade artifacts within budget, and stays usable without relying on mouse-only or color-only cues.
- Proof Target: `check-WP-I1-004.ps1` plus cold/warm Tauri runtime smoke, timed 4K/export artifacts, and accessibility-focused UI assertions under `.product/build_target/tool_artifacts/wp_runs/WP-I1-004/`.
- Allowed Temporary Fallbacks: Non-blocking degraded/progress indicators may remain when budget thresholds are exceeded during development, but they must be explicit in the UI and are not valid for requirement promotion; browser/jsdom accessibility assertions may supplement but not replace Tauri runtime proof.
- Promotion Guard: Do not promote linked requirements or Gate E unless packet-specific evidence shows reference-hardware startup/state-change/export timings within budget and the map runtime passes keyboard/non-color accessibility assertions.

## Change Ledger Snapshot

- What Became Real: The live map surface now captures a governed 4K export artifact through the real MapLibre/Cesium runtime, persists PNG plus metadata via the Tauri backend, and records packet-specific cold/warm smoke proof with accessibility and export assertions under `wp_runs/WP-I1-004/`.
- What Remains Simulated: The packet still does not have a dedicated 2D pan/zoom frame-time probe tied to `REQ-0206`, and the current warm startup evidence remains above the 3.0 s requirement threshold on the dev-mode runtime.
- Next Blocking Real Seam: Add packet-grade 2D pan/zoom instrumentation and bring warm startup-to-shell within the `REQ-0015` budget so Gate E can be promoted without inference.

## Requirement Extraction

| Requirement | Level | Section | Description | Target | Status |
|-------------|-------|---------|-------------|--------|--------|
| REQ-0014 | MUST | ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â§11.5 | Desktop app startup (cold launch) MUST be <= 8.0 s to interactive shell on reference workstation | All | IN-PROGRESS |
| REQ-0015 | MUST | ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â§11.5 | Desktop app startup (warm relaunch) MUST be <= 3.0 s to interactive shell on reference workstation | All | IN-PROGRESS |
| REQ-0016 | MUST | ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â§11.5 | Analyst state-change actions (layer/filter/apply) MUST provide feedback <= 300 ms P95; if exceeded, UI MUST show non-blocking progress | All | IN-PROGRESS |
| REQ-0206 | MUST | ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â§11.5 | 2D pan/zoom: ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â°Ãƒâ€šÃ‚Â¤50ms frame time with aggregated rendering | I1 | IN-PROGRESS |
| REQ-0207 | MUST | ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â§11.5 | Time scrub (warm cache): ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â°Ãƒâ€šÃ‚Â¤250ms end-to-end | I1 | IN-PROGRESS |
| REQ-0208 | MUST | ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â§11.5 | Time scrub (cold cache): ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â°Ãƒâ€šÃ‚Â¤2.0s end-to-end | I1 | IN-PROGRESS |
| REQ-0209 | MUST | ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â§11.5 | 4K image export: ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â°Ãƒâ€šÃ‚Â¤3.0s | I1 | IN-PROGRESS |
| REQ-0210 | MUST | ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â§11.5 | Briefing bundle export: ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â°Ãƒâ€šÃ‚Â¤15s | I1 | IN-PROGRESS |
| REQ-0212 | SHOULD | ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â§11.6 | WCAG/508 accessibility (keyboard, non-color-only semantics) | I1 | IN-PROGRESS |

## Primitive Extraction

| Primitive | Name | Contract | REQs | First Iter | Status |
|-----------|------|----------|------|------------|--------|
| PRIM-0047 | Budgeted Interaction Telemetry | Measure startup, pan/zoom, scrub, and export budgets and expose governed degradation signals when runtime budgets are exceeded | REQ-0011, REQ-0012, REQ-0014, REQ-0015, REQ-0016, REQ-0200, REQ-0201, REQ-0202, REQ-0203, REQ-0206, REQ-0207, REQ-0208, REQ-0209, REQ-0210, REQ-0211, REQ-0212 | I1 | E2E-VERIFIED |
| PRIM-0067 | Reference Budget Evidence Harness | Capture packet-specific startup, interaction, scrub, and export timings with artifact-backed summaries suitable for Gate E promotion | GATE-E, REQ-0014, REQ-0015, REQ-0016, REQ-0206, REQ-0207, REQ-0208, REQ-0209, REQ-0210, REQ-0212 | I1 | IN-PROGRESS |
| PRIM-0068 | Accessible Map Interaction Contract | Preserve keyboard-reachable controls and non-color-only semantics across the governed map surface and its connected overlays | GATE-E, REQ-0014, REQ-0015, REQ-0016, REQ-0206, REQ-0207, REQ-0208, REQ-0209, REQ-0210, REQ-0212 | I1 | IN-PROGRESS |

## Traceability Hooks

- REQ-0014: Mapped in TRACEABILITY_MATRIX.md
- REQ-0015: Mapped in TRACEABILITY_MATRIX.md
- REQ-0016: Mapped in TRACEABILITY_MATRIX.md
- REQ-0206: Mapped in TRACEABILITY_MATRIX.md
- REQ-0207: Mapped in TRACEABILITY_MATRIX.md
- REQ-0208: Mapped in TRACEABILITY_MATRIX.md
- REQ-0209: Mapped in TRACEABILITY_MATRIX.md
- REQ-0210: Mapped in TRACEABILITY_MATRIX.md
- REQ-0212: Mapped in TRACEABILITY_MATRIX.md

## Non-Goal / Red-Team Guardrails

- No individual targeting/stalking workflows.
- No covert affiliation inference.
- No social-media scraping ingestion.
- No leaked/hacked/scraped-against-terms data pipelines.
- No financial trading or prediction tooling.

## Verification Hooks

- Run preflight: powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1
- Run WP checks: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-004.ps1
- Proof artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I1-004/
