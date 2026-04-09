# SX-WP-GOV-BRIDGE-001 - Spec Extraction Snapshot

Generated On: 2026-04-09
Linked Work Packet: WP-GOV-BRIDGE-001
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-GOV-BRIDGE-001.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-GOV-BRIDGE-001.ps1
Packet Class Snapshot: IMPLEMENTATION
Workflow Version Snapshot: 4.0
WP Status Snapshot: IMPLEMENTED
Iteration: All

## Scope

Concrete extraction of requirement and primitive obligations this WP must satisfy before status promotion.

## Reality Boundary Snapshot

- Real Seam: A localhost-only HTTP server inside the Tauri runtime accepts JSON requests for health, state, navigation, and snapshot capture while the frontend reports current shell state back to the backend.
- User-Visible Win: Agents can audit or debug the app without stealing focus from the operator, and can move between major shell tabs plus 2D/3D surface modes programmatically.
- Proof Target: `/agent/health` responds, `/agent/state` returns current panel plus bundle and map metadata, `/agent/navigate` routes to live panel aliases, and `/agent/snapshot` still resolves through the governed snapshot path.
- Allowed Temporary Fallbacks: Snapshot fidelity still inherits html2canvas DOM-only limitations from `WP-GOV-DEBUGGER-001`.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to `E2E-VERIFIED`.

## Change Ledger Snapshot

- What Became Real: The backend now serves structured bridge state, writes the discovery port file, and accepts snapshot plus navigation requests; the frontend now handles navigation aliases, reports current shell state, and exposes `window.__stratatlasNavigate(panel)` for in-WebView agent use.
- What Remains Simulated: Snapshot output still depends on html2canvas DOM capture, so GPU-only map rendering is not guaranteed to appear exactly as the native compositor renders it.
- Next Blocking Real Seam: Run a live desktop bridge smoke pass against the built app, capture snapshot artifacts through the HTTP bridge, and obtain user sign-off.

## Requirement Extraction

| Requirement | Level | Section | Description | Target | Status |
|-------------|-------|---------|-------------|--------|--------|
| REQ-0013 | MUST | Section 17 | No capability is "implemented" until it satisfies the slice definition of done | All | E2E-VERIFIED |
| REQ-0019 | MUST | Section 17 | Every WP MUST maintain linked test suite, spec extraction, and WP check script artifacts | All | E2E-VERIFIED |
| REQ-0020 | MUST | Section 17 | WP status claims MUST include proof artifact paths and command evidence | All | E2E-VERIFIED |

## Primitive Extraction

| Primitive | Name | Contract | REQs | First Iter | Status |
|-----------|------|----------|------|------------|--------|
| PRIM-0071 | Map-First Workbench Shell | Organize the verified StratAtlas regions into a calmer desktop workbench with task-grouped tabs, contextual panes, and bottom-tray disclosure while preserving map primacy and accessibility | REQ-0011, REQ-0012, REQ-0200, REQ-0201, REQ-0211, REQ-0212 | I1 | E2E-VERIFIED |

## Traceability Hooks

- REQ-0013: Mapped in TRACEABILITY_MATRIX.md
- REQ-0019: Mapped in TRACEABILITY_MATRIX.md
- REQ-0020: Mapped in TRACEABILITY_MATRIX.md

## Non-Goal / Red-Team Guardrails

- No individual targeting/stalking workflows.
- No covert affiliation inference.
- No social-media scraping ingestion.
- No leaked/hacked/scraped-against-terms data pipelines.
- No financial trading or prediction tooling.

## Verification Hooks

- Run preflight: powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1
- Run WP checks: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-BRIDGE-001.ps1
- Proof artifacts: .product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-001/
