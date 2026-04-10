# SX-WP-I6-003 - Spec Extraction Snapshot

Generated On: 2026-04-09
Linked Work Packet: WP-I6-003
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I6-003.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I6-003.ps1
Packet Class Snapshot: IMPLEMENTATION
Workflow Version Snapshot: 4.0
WP Status Snapshot: IMPLEMENTED
Iteration: I6

## Scope

Concrete extraction of requirement and primitive obligations this WP must satisfy before status promotion.

## Reality Boundary Snapshot

- Real Seam: persist a distinct AI provider selection plus local runtime preferences through recorder state and route Tauri provider status plus analysis execution through an explicit provider selector that includes LM Studio, Ollama, and custom executable-backed local adapters.
- User-Visible Win: users can choose `Auto`, `Codex CLI`, `OpenAI Responses`, or `Local model runtime`, configure truthful local runtime preferences in the UI, see real readiness detail for LM Studio/Ollama/custom paths, and stop treating deployment posture as if it were provider choice.
- Proof Target: frontend/unit/backend/Rust tests pass, `check-WP-I6-003.ps1` passes, desktop/runtime evidence shows the truthful provider selector and local runtime detection, and the app recorder state can carry the selected local runtime profile plus model key without weakening audit/evidence boundaries.
- Allowed Temporary Fallbacks: browser/jsdom stays explicitly `browser-simulated`; local provider execution may remain unexercised on a given operator machine even when a runtime is detected; no fake live-provider claim is allowed and no broken screenshot capture is treated as proof.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to `E2E-VERIFIED`.

## Change Ledger Snapshot

- What Became Real: the product now persists provider choice and local runtime settings independently from deployment posture, the settings menu exposes LM Studio/Ollama/custom local runtime controls, browser fallback stays explicit, and the Tauri backend resolves LM Studio/Ollama/custom adapters without weakening the evidence-linked request contract.
- What Remains Simulated: browser/jsdom still uses simulated gateway output, and this packet does not claim a real local-model generation artifact because the operator-facing local runtime was detected and configured but not exercised end-to-end in a user-approved desktop run.
- Next Blocking Real Seam: user-approved live local-model generation and a cleaner desktop snapshot path if the current bridge/html2canvas capture issue needs a governed fix packet.

## Requirement Extraction

| Requirement | Level | Section | Description | Target | Status |
|-------------|-------|---------|-------------|--------|--------|
| REQ-0700 | MUST | Section 15.1 | AI access mediated through gateway: authn/authz, RBAC, marking policy, licensing, audit | I6 | E2E-VERIFIED |
| REQ-0701 | MUST | Section 15.2 | AI outputs labeled derived/interpretive, cite evidence by (bundle_id, asset_id, sha256), inherit markings | I6 | E2E-VERIFIED |
| REQ-0702 | SHOULD | Section 15.3 | MCP server: policy-gated, audited tools | I6 | E2E-VERIFIED |
| REQ-0703 | MUST | Section 15.3 | MCP tools operate on bundle IDs and content hashes, not file paths | I6 | E2E-VERIFIED |
| REQ-0704 | MUST | Section 15.3 | MCP minimum tool surface: get_bundle_manifest, get_bundle_slice, get_context_values, submit_analysis, list_layers, get_scenario_delta | I6 | E2E-VERIFIED |
| REQ-0705 | MUST | Section 15.3 | Every MCP invocation audit-logged | I6 | E2E-VERIFIED |
| REQ-0706 | MUST | Section 15.3 | MCP enforces same RBAC/marking/export policies as UI gateway | I6 | E2E-VERIFIED |
| REQ-0707 | MUST | Section 15.3 | MCP MUST NOT expose raw DB queries, file paths, or internal endpoints | I6 | E2E-VERIFIED |
| REQ-0708 | MUST | Section 15.3 | MCP disable-able per deployment profile | I6 | E2E-VERIFIED |

## Primitive Extraction

| Primitive | Name | Contract | REQs | First Iter | Status |
|-----------|------|----------|------|------------|--------|
| PRIM-0052 | Governed AI Provider Adapter | Route AI requests through an audited gateway with policy enforcement, evidence references, approved provider settings, and runtime capability gating | REQ-0700, REQ-0701, REQ-0702, REQ-0703, REQ-0704, REQ-0705, REQ-0706, REQ-0707, REQ-0708 | I6 | E2E-VERIFIED |

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
- Run WP checks: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I6-003.ps1
- Proof artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I6-003/
