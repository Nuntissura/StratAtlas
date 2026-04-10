# SX-WP-GOV-DEBUGGER-002 - Spec Extraction Snapshot

Generated On: 2026-04-10
Linked Work Packet: WP-GOV-DEBUGGER-002
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-GOV-DEBUGGER-002.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-GOV-DEBUGGER-002.ps1
Packet Class Snapshot: IMPLEMENTATION
Workflow Version Snapshot: 4.0
WP Status Snapshot: SPEC-MAPPED
Iteration: All

## Scope

Concrete extraction of requirement and primitive obligations this WP must satisfy before status promotion.

## Reality Boundary Snapshot

- Real Seam: Replace viewport-only html2canvas capture with full-DOM and per-panel capture modes that produce truthful images of the entire app state
- User-Visible Win: Snapshots show all panels, typed text, map state, and disclosure content regardless of window size or overlap; per-panel capture isolates individual panels
- Proof Target: Side-by-side old vs new snapshot comparison showing previously invisible content; per-panel snapshot of right-side panel stack
- Allowed Temporary Fallbacks: WebGL map region may require separate canvas.toDataURL compositing
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## Change Ledger Snapshot

- What Became Real: Not yet started — packet is SPEC-MAPPED
- What Remains Simulated: Current viewport-only html2canvas capture remains active
- Next Blocking Real Seam: WP-GOV-BRIDGE-003 depends on per-panel targeting for audit sweep

## Requirement Extraction

| Requirement | Level | Section | Description | Target | Status |
|-------------|-------|---------|-------------|--------|--------|
| REQ-0013 | MUST | Section 17 | No capability is "implemented" until it satisfies the slice definition of done | All | E2E-VERIFIED |
| REQ-0019 | MUST | Section 17 | Every WP MUST maintain linked test suite, spec extraction, and WP check script artifacts | All | E2E-VERIFIED |
| REQ-0020 | MUST | Section 17 | WP status claims MUST include proof artifact paths and command evidence | All | E2E-VERIFIED |

## Primitive Extraction

| Primitive | Name | Contract | REQs | First Iter | Status |
|-----------|------|----------|------|------------|--------|
| PRIM-0075 | Governed Agent Action Bridge | Expose a localhost-only named-action bridge for approved UI workflows and structured completion results so agents can interact with the running app without focus stealing or input simulation | REQ-0013, REQ-0019, REQ-0020 | All | IMPLEMENTED |

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
- Run WP checks: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-DEBUGGER-002.ps1
- Proof artifacts: .product/build_target/tool_artifacts/wp_runs/WP-GOV-DEBUGGER-002/
