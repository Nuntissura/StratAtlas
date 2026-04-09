# SX-WP-GOV-BRIDGE-002 - Spec Extraction Snapshot

Generated On: 2026-04-09
Linked Work Packet: WP-GOV-BRIDGE-002
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-GOV-BRIDGE-002.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-GOV-BRIDGE-002.ps1
Packet Class Snapshot: IMPLEMENTATION
Workflow Version Snapshot: 4.0
WP Status Snapshot: IN-PROGRESS
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

- What Became Real: Governance now tracks the missing bridge-interaction seam as its own cross-cutting packet with explicit proof criteria tied to the `WP-I6-004` seeded-state workaround.
- What Remains Simulated: Until this packet lands, the bridge still cannot invoke the in-app local-runtime probe, so visual proof of that flow requires a temporary recorder-state seed.
- Next Blocking Real Seam: Implement `POST /agent/action`, wire it to a real frontend action registry, and capture live navigate/action/snapshot proof against the desktop app.

## Requirement Extraction

| Requirement | Level | Section | Description | Target | Status |
|-------------|-------|---------|-------------|--------|--------|
| REQ-0013 | MUST | Section 17 | No capability is "implemented" until it satisfies the slice definition of done | All | E2E-VERIFIED |
| REQ-0019 | MUST | Section 17 | Every WP MUST maintain linked test suite, spec extraction, and WP check script artifacts | All | E2E-VERIFIED |
| REQ-0020 | MUST | Section 17 | WP status claims MUST include proof artifact paths and command evidence | All | E2E-VERIFIED |

## Primitive Extraction

| Primitive | Name | Contract | REQs | First Iter | Status |
|-----------|------|----------|------|------------|--------|
| PRIM-0075 | Governed Agent Action Bridge | Expose a localhost-only named-action bridge for approved UI workflows and structured completion results so agents can interact with the running app without focus stealing or input simulation | REQ-0013, REQ-0019, REQ-0020 | All | IN-PROGRESS |

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
