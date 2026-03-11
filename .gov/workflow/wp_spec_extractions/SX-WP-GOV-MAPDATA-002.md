# SX-WP-GOV-MAPDATA-002 - Spec Extraction Snapshot

Generated On: 2026-03-11
Linked Work Packet: WP-GOV-MAPDATA-002
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-GOV-MAPDATA-002.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-GOV-MAPDATA-002.ps1
Packet Class Snapshot: RESEARCH
Workflow Version Snapshot: 4.0
WP Status Snapshot: E2E-VERIFIED
Iteration: All

## Scope

Concrete extraction of requirement and primitive obligations this WP must satisfy before status promotion.

## Reality Boundary Snapshot

- Real Seam: Governance records a concrete maritime source decision matrix, truth-label contract, and blocker resolution path before any shipping runtime implementation begins.
- User-Visible Win: The repo can answer what maritime coverage is actually possible and what remains blocked instead of leaving that uncertainty implicit.
- Proof Target: The linked research sub-spec, taskboard, roadmap, and traceability assets capture the decision path, unresolved gaps, and successor packet rules.
- Allowed Temporary Fallbacks: Research may conclude that only delayed, regional, cached, or licensed-provider paths are acceptable initially.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to `E2E-VERIFIED`.

## Change Ledger Snapshot

- What Became Real: The repo now has a concrete maritime source decision matrix, a source-state labeling contract, and a constrained unblock path for `WP-I1-012` instead of treating shipping as source-equivalent to air traffic.
- What Remains Simulated: No maritime movement runtime is implemented by this packet, and no licensed global low-latency maritime provider is wired into the app yet.
- Next Blocking Real Seam: Implement `WP-I1-012` with delayed/regional/cached maritime plus optional backend-only user-key live enhancement while keeping global-live and naval claims out of scope.

## Requirement Extraction

| Requirement | Level | Section | Description | Target | Status |
|-------------|-------|---------|-------------|--------|--------|
| REQ-0013 | MUST | Section 17 | No capability is "implemented" until it satisfies the slice definition of done | All | E2E-VERIFIED |
| REQ-0019 | MUST | Section 17 | Every WP MUST maintain linked test suite, spec extraction, and WP check script artifacts | All | E2E-VERIFIED |
| REQ-0020 | MUST | Section 17 | WP status claims MUST include proof artifact paths and command evidence | All | E2E-VERIFIED |
| REQ-0021 | MUST | Section 18 | Governance preflight MUST enforce WP template compliance to prevent shortcut execution | All | E2E-VERIFIED |
| REQ-0022 | SHOULD | Section 17 | Teams SHOULD run WP loop automation (`run_wp_loop.ps1`) before status-promotion sweeps | All | E2E-VERIFIED |
| REQ-0200 | MUST | Section 11.1 | UI stable regions: header, left panel, right panel, bottom panel, main canvas | I1 | E2E-VERIFIED |
| REQ-0201 | MUST | Section 11.2 | UI modes: Live/Recent, Replay, Compare, Scenario, Collaboration, Offline | I1 | E2E-VERIFIED |

## Primitive Extraction

| Primitive | Name | Contract | REQs | First Iter | Status |
|-----------|------|----------|------|------------|--------|
| PRIM-0045 | Dual Surface Geospatial Runtime | Deliver governed 2D and 3D canvas surfaces with mode-aware layer orchestration, labeling contracts, and stable shell integration | REQ-0011, REQ-0012, REQ-0014, REQ-0015, REQ-0016, REQ-0200, REQ-0201, REQ-0202, REQ-0203, REQ-0206, REQ-0207, REQ-0208, REQ-0209, REQ-0210, REQ-0211, REQ-0212 | I1 | E2E-VERIFIED |
| PRIM-0071 | Map-First Workbench Shell | Organize the verified StratAtlas regions into a calmer desktop workbench with task-grouped tabs, contextual panes, and bottom-tray disclosure while preserving map primacy and accessibility | REQ-0011, REQ-0012, REQ-0200, REQ-0201, REQ-0211, REQ-0212 | I1 | E2E-VERIFIED |

## Traceability Hooks

- REQ-0013: Mapped in TRACEABILITY_MATRIX.md
- REQ-0019: Mapped in TRACEABILITY_MATRIX.md
- REQ-0020: Mapped in TRACEABILITY_MATRIX.md
- REQ-0021: Mapped in TRACEABILITY_MATRIX.md
- REQ-0022: Mapped in TRACEABILITY_MATRIX.md
- REQ-0200: Mapped in TRACEABILITY_MATRIX.md
- REQ-0201: Mapped in TRACEABILITY_MATRIX.md

## Non-Goal / Red-Team Guardrails

- No individual targeting/stalking workflows.
- No covert affiliation inference.
- No social-media scraping ingestion.
- No leaked/hacked/scraped-against-terms data pipelines.
- No financial trading or prediction tooling.

## Verification Hooks

- Run preflight: powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1
- Run WP checks: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-MAPDATA-002.ps1
- Proof artifacts: .product/build_target/tool_artifacts/wp_runs/WP-GOV-MAPDATA-002/
