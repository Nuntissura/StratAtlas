# SX-WP-I1-025 - Spec Extraction Snapshot

Generated On: 2026-04-11
Linked Work Packet: WP-I1-025
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I1-025.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I1-025.ps1
Packet Class Snapshot: IMPLEMENTATION
Workflow Version Snapshot: 4.0
WP Status Snapshot: SPEC-MAPPED
Iteration: I1

## Scope

Concrete extraction of requirement and primitive obligations this WP must satisfy before status promotion.

## Reality Boundary Snapshot

- Real Seam: TBD
- User-Visible Win: TBD
- Proof Target: TBD
- Allowed Temporary Fallbacks: TBD
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## Change Ledger Snapshot

- What Became Real: TBD
- What Remains Simulated: TBD
- Next Blocking Real Seam: TBD

## Requirement Extraction

| Requirement | Level | Section | Description | Target | Status |
|-------------|-------|---------|-------------|--------|--------|
| REQ-0200 | MUST | Section 11.1 | UI stable regions: header, left panel, right panel, bottom panel, main canvas | I1 | E2E-VERIFIED |
| REQ-0700 | MUST | Section 15.1 | AI access mediated through gateway: authn/authz, RBAC, marking policy, licensing, audit | I6 | IMPLEMENTED |
| REQ-0701 | MUST | Section 15.2 | AI outputs labeled derived/interpretive, cite evidence by (bundle_id, asset_id, sha256), inherit markings | I6 | IMPLEMENTED |

## Primitive Extraction

| Primitive | Name | Contract | REQs | First Iter | Status |
|-----------|------|----------|------|------------|--------|
| PRIM-0005 | Stable UI Region Contract | Mandatory shell regions and selectors | REQ-0200 | I1 | IMPLEMENTED |
| PRIM-0052 | Governed AI Provider Adapter | Route AI requests through an audited gateway with policy enforcement, evidence references, approved provider settings, and runtime capability gating | REQ-0700, REQ-0701, REQ-0702, REQ-0703, REQ-0704, REQ-0705, REQ-0706, REQ-0707, REQ-0708 | I6 | IMPLEMENTED |

## Traceability Hooks

- REQ-0200: Mapped in TRACEABILITY_MATRIX.md
- REQ-0700: Mapped in TRACEABILITY_MATRIX.md
- REQ-0701: Mapped in TRACEABILITY_MATRIX.md

## Non-Goal / Red-Team Guardrails

- No individual targeting/stalking workflows.
- No covert affiliation inference.
- No social-media scraping ingestion.
- No leaked/hacked/scraped-against-terms data pipelines.
- No financial trading or prediction tooling.

## Verification Hooks

- Run preflight: powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1
- Run WP checks: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-025.ps1
- Proof artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I1-025/
