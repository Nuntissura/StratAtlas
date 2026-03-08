# SX-WP-GOV-PORT-002 - Spec Extraction Snapshot

Generated On: 2026-03-08
Linked Work Packet: WP-GOV-PORT-002
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-GOV-PORT-002.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-GOV-PORT-002.ps1
Packet Class Snapshot: VERIFICATION
Workflow Version Snapshot: 4.0
WP Status Snapshot: SPEC-MAPPED
Iteration: All

## Scope

Concrete extraction of requirement and primitive obligations this WP must satisfy before status promotion.

## Reality Boundary Snapshot

- Real Seam: The governed desktop smoke harness must run on macOS and produce the same class of cold/warm runtime artifacts used on Windows, while runtime-critical paths remain free of Windows-only assumptions.
- User-Visible Win: Operators can trust that the desktop runtime still launches and executes core smoke flows on macOS rather than only on Windows development machines.
- Proof Target: `check-WP-GOV-PORT-002.ps1` plus macOS cold/warm runtime smoke artifacts, portability ledger updates, and Gate H evidence under `.product/build_target/tool_artifacts/wp_runs/WP-GOV-PORT-002/`.
- Allowed Temporary Fallbacks: Windows-only smoke remains the development baseline while this packet is open, but it must stay labeled as incomplete portability proof and cannot promote `REQ-0018` or `GATE-H`.
- Promotion Guard: Do not promote `REQ-0018` or `GATE-H` without a real macOS runtime smoke artifact set and synchronized governance evidence.

## Change Ledger Snapshot

- What Became Real: The remaining portability debt is now isolated into an explicit verification packet with a concrete macOS proof target instead of a generic roadmap note.
- What Remains Simulated: No macOS artifact-backed runtime smoke exists yet; `REQ-0018` and `GATE-H` remain open.
- Next Blocking Real Seam: Execute governed runtime smoke on macOS and capture packet-proof artifacts suitable for Gate H promotion.

## Requirement Extraction

| Requirement | Level | Section | Description | Target | Status |
|-------------|-------|---------|-------------|--------|--------|
| REQ-0018 | SHOULD | ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â§5.1 | Desktop packaging/runtime SHOULD be smoke-tested on macOS during development to preserve portability | All | IN-PROGRESS |

## Primitive Extraction

| Primitive | Name | Contract | REQs | First Iter | Status |
|-----------|------|----------|------|------------|--------|
| PRIM-0060 | Runtime Smoke Harness | Execute governed desktop runtime smoke flows across startup, shell readiness, map/layer interactions, and degraded-state handling with artifact capture | REQ-0013, REQ-0014, REQ-0015, REQ-0016, REQ-0018, REQ-0019, REQ-0020, REQ-0021, REQ-0022 | All | E2E-VERIFIED |
| PRIM-0061 | Verification Evidence Matrix | Bind each closure claim to command evidence, desktop-smoke artifacts, and portability/performance proof before status promotion | REQ-0013, REQ-0014, REQ-0015, REQ-0016, REQ-0018, REQ-0019, REQ-0020, REQ-0021, REQ-0022 | All | E2E-VERIFIED |
| PRIM-0069 | Portability Smoke Matrix | Execute and record governed desktop smoke across supported operating systems with platform-specific artifact linkage for Gate H promotion | GATE-H, REQ-0018 | All | SPEC-MAPPED |

## Traceability Hooks

- REQ-0018: Mapped in TRACEABILITY_MATRIX.md

## Non-Goal / Red-Team Guardrails

- No individual targeting/stalking workflows.
- No covert affiliation inference.
- No social-media scraping ingestion.
- No leaked/hacked/scraped-against-terms data pipelines.
- No financial trading or prediction tooling.

## Verification Hooks

- Run preflight: powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1
- Run WP checks: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-PORT-002.ps1
- Proof artifacts: .product/build_target/tool_artifacts/wp_runs/WP-GOV-PORT-002/
