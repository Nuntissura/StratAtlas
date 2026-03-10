# SX-WP-GOV-MAPDATA-001 - Spec Extraction Snapshot

Generated On: 2026-03-10
Linked Work Packet: WP-GOV-MAPDATA-001
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-GOV-MAPDATA-001.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-GOV-MAPDATA-001.ps1
Packet Class Snapshot: RESEARCH
Workflow Version Snapshot: 4.0
WP Status Snapshot: E2E-VERIFIED
Iteration: All

## Scope

Concrete extraction of requirement and primitive obligations this WP must satisfy before status promotion.

## Reality Boundary Snapshot

- Real Seam: The repo gains a governed research contract for the requested toggleable map layer families, with named candidate sources, source-type boundaries, and a truthful implementation order before product code implies unsupported live coverage.
- User-Visible Win: Future map layers can be implemented without repeating the earlier scaffold-first mistake; the source choices and tradeoffs are captured and retrievable.
- Proof Target: A linked research sub-spec records candidate sources, licensing/provenance concerns, online/offline behavior, and recommended successor packets for each requested layer family.
- Allowed Temporary Fallbacks: Research may conclude that some requested families require curated static layers or licensed providers before a truthful live implementation is possible.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## Change Ledger Snapshot

- What Became Real: The user-requested map layer families now have a governed research owner instead of living only as ad hoc conversation requests.
- What Remains Simulated: No new live/source-backed map layers are implemented by this packet.
- Next Blocking Real Seam: Create and execute the first source-backed successor packet for static known-installation layers: airports, ports, power plants, dams, and curated military airbases/ports.

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
- Run WP checks: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-MAPDATA-001.ps1
- Proof artifacts: .product/build_target/tool_artifacts/wp_runs/WP-GOV-MAPDATA-001/
