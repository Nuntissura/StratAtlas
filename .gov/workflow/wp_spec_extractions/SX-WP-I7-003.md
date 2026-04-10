# SX-WP-I7-003 - Spec Extraction Snapshot

Generated On: 2026-04-10
Linked Work Packet: WP-I7-003
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I7-003.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I7-003.ps1
Packet Class Snapshot: IMPLEMENTATION
Workflow Version Snapshot: 4.0
WP Status Snapshot: IMPLEMENTED
Iteration: I7

## Scope

Concrete extraction of requirement and primitive obligations this WP must satisfy before status promotion.

## Reality Boundary Snapshot

- Real Seam: the live shell derives a global event timeline and map-marker layer from already-real deviation and OSINT artifacts, adds zoom-aware event clustering to the map runtime, and lets timeline selection focus the map plus contextual inspect state.
- User-Visible Win: analysts can see what happened first, what matters now, and which AOI is affected without manually stitching together separate monitor cards and map cues.
- Proof Target: timeline derivation tests pass, App/runtime regressions pass, `check-WP-I7-003.ps1` passes, and live bridge snapshots show the event timeline plus event-linked map focus.
- Allowed Temporary Fallbacks: browser/jsdom remains a non-desktop proof environment; the timeline may remain derived rather than persisted as its own artifact as long as reopen stays deterministic from the underlying restored events.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## Change Ledger Snapshot

- What Became Real: the live shell now derives a deterministic global event timeline from restored deviation, aggregate-alert, and OSINT event artifacts; renders zoom-aware event markers and clusters in the real map runtime; exposes a tray timeline plus in-map recent-event rail; and lets the governed bridge reopen a real bundle and focus a selected global event into the map/runtime inspector flow.
- What Remains Simulated: browser/jsdom remains a non-desktop proof environment; no packet-specific runtime fallback is approved beyond that.
- Next Blocking Real Seam: `WP-I7-004` must add the broader geopolitical baseline dataset and "what's happening now" first-launch context after this event-story seam exists.

## Requirement Extraction

| Requirement | Level | Section | Description | Target | Status |
|-------------|-------|---------|-------------|--------|--------|
| REQ-0804 | MUST | Section 7.4.5 | sidebar_timeseries and dashboard_widget types MUST NOT render as map points | I7 | E2E-VERIFIED |
| REQ-0805 | MUST | Section 7.4.5 | All context presentations display source, cadence, and confidence | I7 | E2E-VERIFIED |
| REQ-0808 | MUST | Section 7.4.8 | Snapshot bundles include context values at capture time | I7 | E2E-VERIFIED |
| REQ-0809 | MUST | Section 11.3 | Golden flow: Context Correlation -> Enable -> Observe -> Capture in bundle | I7 | E2E-VERIFIED |

## Primitive Extraction

| Primitive | Name | Contract | REQs | First Iter | Status |
|-----------|------|----------|------|------------|--------|
| PRIM-0045 | Dual Surface Geospatial Runtime | Deliver governed 2D and 3D canvas surfaces with mode-aware layer orchestration, labeling contracts, and stable shell integration | REQ-0011, REQ-0012, REQ-0014, REQ-0015, REQ-0016, REQ-0200, REQ-0201, REQ-0202, REQ-0203, REQ-0206, REQ-0207, REQ-0208, REQ-0209, REQ-0210, REQ-0211, REQ-0212 | I1 | E2E-VERIFIED |
| PRIM-0076 | Context Event Timeline Projection | Materialize already-governed deviation and OSINT artifacts into a deterministic analyst timeline and zoom-aware map event-marker layer with explicit source, cadence, confidence, and AOI-link semantics | REQ-0804, REQ-0805, REQ-0808, REQ-0809 | I7 | IMPLEMENTED |

## Traceability Hooks

- REQ-0804: Mapped in TRACEABILITY_MATRIX.md
- REQ-0805: Mapped in TRACEABILITY_MATRIX.md
- REQ-0808: Mapped in TRACEABILITY_MATRIX.md
- REQ-0809: Mapped in TRACEABILITY_MATRIX.md

## Non-Goal / Red-Team Guardrails

- No individual targeting/stalking workflows.
- No covert affiliation inference.
- No social-media scraping ingestion.
- No leaked/hacked/scraped-against-terms data pipelines.
- No financial trading or prediction tooling.

## Verification Hooks

- Run preflight: powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1
- Run WP checks: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I7-003.ps1
- Proof artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I7-003/
