# SX-WP-GOV-I1-RESTYLE-001 - Spec Extraction Snapshot

Generated On: 2026-03-09
Linked Work Packet: WP-GOV-I1-RESTYLE-001
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-GOV-I1-RESTYLE-001.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-GOV-I1-RESTYLE-001.ps1
Packet Class Snapshot: RESEARCH
Workflow Version Snapshot: 4.0
WP Status Snapshot: E2E-VERIFIED
Iteration: I1

## Scope

Concrete extraction of requirement and primitive obligations this WP must satisfy before status promotion.

## Reality Boundary Snapshot

- Real Seam: A governed, cited, product-specific shell rubric and workbench information architecture now exist instead of informal taste-driven redesign notes.
- User-Visible Win: The successor UI work can follow an explicit map-first layout contract instead of another all-at-once dashboard pass.
- Proof Target: `.gov/Spec/sub-specs/I1_workbench_restyle_research.md`, synchronized roadmap/taskboard/primitive ledgers, and a ready successor packet with no placeholder fields.
- Allowed Temporary Fallbacks: The current product shell remains in place until `WP-I1-005` lands.
- Promotion Guard: RESEARCH packets do not promote implementation requirements; only the governance research assets and ledgers may close here.

## Change Ledger Snapshot

- What Became Real: A cited shell rubric, explicit task-grouping plan, and map-first IA contract.
- What Remains Simulated: The current overloaded shell remains in product until the successor implementation packet executes.
- Next Blocking Real Seam: `WP-I1-005` must turn the rubric into a real workbench shell.

## Requirement Extraction

| Requirement | Level | Section | Description | Target | Status |
|-------------|-------|---------|-------------|--------|--------|
| REQ-0013 | MUST | Section 17 | No capability is "implemented" until it satisfies the slice definition of done | All | E2E-VERIFIED |
| REQ-0019 | MUST | Section 17 | Every WP MUST maintain linked test suite, spec extraction, and WP check script artifacts | All | E2E-VERIFIED |
| REQ-0020 | MUST | Section 17 | WP status claims MUST include proof artifact paths and command evidence | All | E2E-VERIFIED |
| REQ-0021 | MUST | Section 18 | Governance preflight MUST enforce WP template compliance to prevent shortcut execution | All | E2E-VERIFIED |
| REQ-0022 | SHOULD | Section 17 | Teams SHOULD run WP loop automation (`run_wp_loop.ps1`) before status-promotion sweeps | All | E2E-VERIFIED |

## Primitive Extraction

| Primitive | Name | Contract | REQs | First Iter | Status |
|-----------|------|----------|------|------------|--------|
| PRIM-0063 | Map UX Research Ledger | Capture cited 2D/3D map reference patterns, implementation notes, and product-fit decisions before runtime implementation | REQ-0013, REQ-0019, REQ-0020, REQ-0021, REQ-0022 | I1 | E2E-VERIFIED |
| PRIM-0064 | Feature-to-Map Integration Matrix | Require every major existing StratAtlas capability to map to a concrete layer, camera, annotation, selection, or timeline behavior before runtime implementation starts | REQ-0013, REQ-0019, REQ-0020, REQ-0021, REQ-0022 | I1 | E2E-VERIFIED |
| PRIM-0070 | Workbench UX Rubric Ledger | Capture the cited shell-design rubric, anti-overload rules, task grouping, and ROI-ranked follow-on ideas before implementation of the workbench restyle | REQ-0013, REQ-0019, REQ-0020, REQ-0021, REQ-0022 | I1 | E2E-VERIFIED |

## Traceability Hooks

- REQ-0013: Mapped in TRACEABILITY_MATRIX.md
- REQ-0019: Mapped in TRACEABILITY_MATRIX.md
- REQ-0020: Mapped in TRACEABILITY_MATRIX.md
- REQ-0021: Mapped in TRACEABILITY_MATRIX.md
- REQ-0022: Mapped in TRACEABILITY_MATRIX.md

## Non-Goal / Red-Team Guardrails

- No individual targeting/stalking workflows.
- No covert affiliation inference.
- No social-media scraping ingestion.
- No leaked/hacked/scraped-against-terms data pipelines.
- No financial trading or prediction tooling.

## Verification Hooks

- Run preflight: powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1
- Run WP checks: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-I1-RESTYLE-001.ps1
- Proof artifacts: .product/build_target/tool_artifacts/wp_runs/WP-GOV-I1-RESTYLE-001/
