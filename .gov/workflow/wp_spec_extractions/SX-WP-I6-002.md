# SX-WP-I6-002 - Spec Extraction Snapshot

Generated On: 2026-03-06
Linked Work Packet: WP-I6-002
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I6-002.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I6-002.ps1
WP Status Snapshot: SPEC-MAPPED
Iteration: I6

## Scope

Concrete extraction of requirement and primitive obligations this WP must satisfy before status promotion.

## Requirement Extraction

| Requirement | Level | Section | Description | Target | Status |
|-------------|-------|---------|-------------|--------|--------|
| REQ-0700 | MUST | Ãƒâ€šÃ‚Â§15.1 | AI access mediated through gateway: authn/authz, RBAC, marking policy, licensing, audit | I6 | IN-PROGRESS |
| REQ-0701 | MUST | Ãƒâ€šÃ‚Â§15.2 | AI outputs labeled derived/interpretive, cite evidence by (bundle_id, asset_id, sha256), inherit markings | I6 | IN-PROGRESS |
| REQ-0702 | SHOULD | Ãƒâ€šÃ‚Â§15.3 | MCP server: policy-gated, audited tools | I6 | IN-PROGRESS |
| REQ-0703 | MUST | Ãƒâ€šÃ‚Â§15.3 | MCP tools operate on bundle IDs and content hashes, not file paths | I6 | IN-PROGRESS |
| REQ-0704 | MUST | Ãƒâ€šÃ‚Â§15.3 | MCP minimum tool surface: get_bundle_manifest, get_bundle_slice, get_context_values, submit_analysis, list_layers, get_scenario_delta | I6 | IN-PROGRESS |
| REQ-0705 | MUST | Ãƒâ€šÃ‚Â§15.3 | Every MCP invocation audit-logged | I6 | IN-PROGRESS |
| REQ-0706 | MUST | Ãƒâ€šÃ‚Â§15.3 | MCP enforces same RBAC/marking/export policies as UI gateway | I6 | IN-PROGRESS |
| REQ-0707 | MUST | Ãƒâ€šÃ‚Â§15.3 | MCP MUST NOT expose raw DB queries, file paths, or internal endpoints | I6 | IN-PROGRESS |
| REQ-0708 | MUST | Ãƒâ€šÃ‚Â§15.3 | MCP disable-able per deployment profile | I6 | IN-PROGRESS |

## Primitive Extraction

| Primitive | Name | Contract | REQs | First Iter | Status |
|-----------|------|----------|------|------------|--------|
| PRIM-0052 | Governed AI Provider Adapter | Route AI requests through an audited gateway with policy enforcement, evidence references, approved provider settings, and runtime capability gating | REQ-0700, REQ-0701, REQ-0702, REQ-0703, REQ-0704, REQ-0705, REQ-0706, REQ-0707, REQ-0708 | I6 | SPEC-MAPPED |
| PRIM-0053 | Audited MCP Execution Surface | Expose only governed MCP tools and execution paths with audit capture, refusal handling, and no raw-path or raw-database escape hatches | REQ-0700, REQ-0701, REQ-0702, REQ-0703, REQ-0704, REQ-0705, REQ-0706, REQ-0707, REQ-0708 | I6 | SPEC-MAPPED |

## Traceability Hooks

- REQ-0700: Mapped in TRACEABILITY_MATRIX.md
- REQ-0701: Mapped in TRACEABILITY_MATRIX.md
- REQ-0702: Mapped in TRACEABILITY_MATRIX.md
- REQ-0703: Mapped in TRACEABILITY_MATRIX.md
- REQ-0704: Mapped in TRACEABILITY_MATRIX.md
- REQ-0705: Mapped in TRACEABILITY_MATRIX.md
- REQ-0706: Mapped in TRACEABILITY_MATRIX.md
- REQ-0707: Mapped in TRACEABILITY_MATRIX.md
- REQ-0708: Mapped in TRACEABILITY_MATRIX.md

## Non-Goal / Red-Team Guardrails

- No individual targeting/stalking workflows.
- No covert affiliation inference.
- No social-media scraping ingestion.
- No leaked/hacked/scraped-against-terms data pipelines.
- No financial trading or prediction tooling.

## Verification Hooks

- Run preflight: powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1
- Run WP checks: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I6-002.ps1
- Proof artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I6-002/
