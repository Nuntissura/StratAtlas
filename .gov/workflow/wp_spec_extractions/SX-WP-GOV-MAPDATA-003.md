# SX-WP-GOV-MAPDATA-003 - Spec Extraction Snapshot

Generated On: 2026-03-10
Linked Work Packet: WP-GOV-MAPDATA-003
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-GOV-MAPDATA-003.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-GOV-MAPDATA-003.ps1
Packet Class Snapshot: RESEARCH
Workflow Version Snapshot: 4.0
WP Status Snapshot: E2E-VERIFIED
Iteration: All

## Scope

Concrete extraction of requirement and primitive obligations this WP must satisfy before status promotion.

## Reality Boundary Snapshot

- Real Seam: The repo gains a mandatory map-family intent checklist and the target queue inherits explicit pre-work and proof obligations that prevent drift into generic tracking features.
- User-Visible Win: Future map families will stay anchored to strategic analysis, truthful labeling, scenario/export usefulness, and calm map-first interaction.
- Proof Target: The new guardrail sub-spec, the map-family research sub-spec, and `WP-I1-008` through `WP-I1-013` all reflect the checklist as mandatory pre-work and proof criteria.
- Allowed Temporary Fallbacks: Queue packets may keep their packet-specific guardrail responses pending while they remain `SPEC-MAPPED`, but they MUST NOT move beyond `SPEC-MAPPED` without those responses recorded in their linked sub-specs.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## Change Ledger Snapshot

- What Became Real: The future map-family queue now has a shared intent contract that makes strategic fit, evidence labeling, mode integration, bundle/export behavior, and anti-tracker boundaries mandatory.
- What Remains Simulated: No new map-family runtime is implemented by this packet.
- Next Blocking Real Seam: Execute `WP-I1-008` with the guardrail checklist as a hard gate before the queue starts shipping new families.

## Requirement Extraction

| Requirement | Level | Section | Description | Target | Status |
|-------------|-------|---------|-------------|--------|--------|
| REQ-0011 | MUST | Section 11.4 | Every layer/chart/annotation/export labeled as Observed Evidence, Curated Context, Modeled Output, or AI-Derived Interpretation | All | E2E-VERIFIED |
| REQ-0012 | MUST | Section 11.4 | Modeled outputs MUST include uncertainty representation and MUST NOT be presented as observed | All | E2E-VERIFIED |
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
| PRIM-0064 | Feature-to-Map Integration Matrix | Require every major existing StratAtlas capability to map to a concrete layer, camera, annotation, selection, or timeline behavior before runtime implementation starts | REQ-0013, REQ-0019, REQ-0020, REQ-0021, REQ-0022 | I1 | E2E-VERIFIED |
| PRIM-0070 | Workbench UX Rubric Ledger | Capture the cited shell-design rubric, anti-overload rules, task grouping, and ROI-ranked follow-on ideas before implementation of the workbench restyle | REQ-0013, REQ-0019, REQ-0020, REQ-0021, REQ-0022 | I1 | E2E-VERIFIED |

## Traceability Hooks

- REQ-0011: Mapped in TRACEABILITY_MATRIX.md
- REQ-0012: Mapped in TRACEABILITY_MATRIX.md
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
- Run WP checks: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-MAPDATA-003.ps1
- Proof artifacts: .product/build_target/tool_artifacts/wp_runs/WP-GOV-MAPDATA-003/
