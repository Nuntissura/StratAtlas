# SX-WP-I1-026 - Spec Extraction Snapshot

Generated On: 2026-04-11
Linked Work Packet: WP-I1-026
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I1-026.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I1-026.ps1
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
| REQ-0700 | MUST | Section 15.1 | AI access mediated through gateway: authn/authz, RBAC, marking policy, licensing, audit | I6 | IMPLEMENTED |
| REQ-0701 | MUST | Section 15.2 | AI outputs labeled derived/interpretive, cite evidence by (bundle_id, asset_id, sha256), inherit markings | I6 | IMPLEMENTED |
| REQ-0702 | SHOULD | Section 15.3 | MCP server: policy-gated, audited tools | I6 | IMPLEMENTED |
| REQ-0703 | MUST | Section 15.3 | MCP tools operate on bundle IDs and content hashes, not file paths | I6 | IMPLEMENTED |

## Primitive Extraction

| Primitive | Name | Contract | REQs | First Iter | Status |
|-----------|------|----------|------|------------|--------|
| PRIM-0052 | Governed AI Provider Adapter | Route AI requests through an audited gateway with policy enforcement, evidence references, approved provider settings, and runtime capability gating | REQ-0700, REQ-0701, REQ-0702, REQ-0703, REQ-0704, REQ-0705, REQ-0706, REQ-0707, REQ-0708 | I6 | IMPLEMENTED |
| PRIM-0053 | Audited MCP Execution Surface | Expose only governed MCP tools and execution paths with audit capture, refusal handling, and no raw-path or raw-database escape hatches | REQ-0700, REQ-0701, REQ-0702, REQ-0703, REQ-0704, REQ-0705, REQ-0706, REQ-0707, REQ-0708 | I6 | IMPLEMENTED |

## Traceability Hooks

- REQ-0700: Mapped in TRACEABILITY_MATRIX.md
- REQ-0701: Mapped in TRACEABILITY_MATRIX.md
- REQ-0702: Mapped in TRACEABILITY_MATRIX.md
- REQ-0703: Mapped in TRACEABILITY_MATRIX.md

## Non-Goal / Red-Team Guardrails

- No individual targeting/stalking workflows.
- No covert affiliation inference.
- No social-media scraping ingestion.
- No leaked/hacked/scraped-against-terms data pipelines.
- No financial trading or prediction tooling.

## Verification Hooks

- Run preflight: powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1
- Run WP checks: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-026.ps1
- Proof artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I1-026/
