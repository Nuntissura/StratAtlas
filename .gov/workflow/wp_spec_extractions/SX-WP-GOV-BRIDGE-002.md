# SX-WP-GOV-BRIDGE-002 - Spec Extraction Snapshot

Generated On: 2026-04-09
Linked Work Packet: WP-GOV-BRIDGE-002
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-GOV-BRIDGE-002.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-GOV-BRIDGE-002.ps1
Packet Class Snapshot: IMPLEMENTATION
Workflow Version Snapshot: 4.0
WP Status Snapshot: IMPLEMENTED
Iteration: All

## Scope

Concrete extraction of requirement and primitive obligations this WP must satisfy before status promotion.

## Reality Boundary Snapshot

- Real Seam: The Tauri bridge accepts a named action request, emits it into the live frontend, waits for structured completion, and returns the real result to the caller without keyboard/mouse simulation.
- User-Visible Win: Agents can run governed UI workflows such as `probe-local-runtime` against the live desktop app and then capture truthful visual proof from the resulting state.
- Proof Target: `POST /agent/action` successfully runs `probe-local-runtime`, returns a structured completion payload, and the resulting state is visible in bridge-driven settings/assistant snapshots without seeded recorder data.
- Allowed Temporary Fallbacks: The action catalog remains intentionally narrow and named; arbitrary click, coordinate, form-fill, and map gesture automation remain out of scope.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to `E2E-VERIFIED`.

## Change Ledger Snapshot

- What Became Real: the localhost bridge now exposes `POST /agent/action`, the frontend registers approved named actions through a governed registry, `/agent/state` reports live shell metadata through the correct Tauri payload contract, and the desktop app can run `probe-local-runtime` and capture truthful post-action settings/assistant snapshots without seeded recorder state.
- What Remains Simulated: arbitrary DOM clicking, coordinate automation, map gestures, and browser/jsdom desktop-bridge behavior remain intentionally out of scope.
- Next Blocking Real Seam: No blocking seam remains for the current named-action scope; if future live workflows need bridge execution, add them through a successor packet instead of widening this packet into generic automation.

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
- Run WP checks: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-BRIDGE-002.ps1
- Proof artifacts: .product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-002/
