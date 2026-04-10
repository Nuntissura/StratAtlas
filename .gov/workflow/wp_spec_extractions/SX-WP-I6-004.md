# SX-WP-I6-004 - Spec Extraction Snapshot

Generated On: 2026-04-09
Linked Work Packet: WP-I6-004
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I6-004.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I6-004.ps1
Packet Class Snapshot: IMPLEMENTATION
Workflow Version Snapshot: 4.0
WP Status Snapshot: IMPLEMENTED
Iteration: I6

## Scope

Concrete extraction of requirement and primitive obligations this WP must satisfy before status promotion.

## Reality Boundary Snapshot

- Real Seam: the Tauri provider adapter exposes a dedicated local-runtime probe command that executes the currently selected local provider with a bounded verification prompt, returns structured success/failure metadata plus sanitized output, and the React shell surfaces that result directly in settings and assistant regions.
- User-Visible Win: users can click `Probe local runtime` in the app, see whether the selected local model path is actually runnable, inspect provider/model/runtime details and the latest probe result, and avoid misleading â€œdetected on diskâ€ states when the local runtime cannot execute.
- Proof Target: App/backend/Rust tests pass, `check-WP-I6-004.ps1` passes, a desktop bridge run captures the AI settings/assistant surface with a completed probe result, and the proof bundle contains bridge state plus snapshot evidence from the live app.
- Allowed Temporary Fallbacks: browser/jsdom remains explicitly simulated and cannot execute the live probe; the probe may return truthful runtime errors from LM Studio/Ollama/custom commands; if bridge PNG capture still fails, bridge state plus saved debug snapshots may stand in as truthful partial proof but not as a fake screenshot claim.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to `E2E-VERIFIED`.

## Change Ledger Snapshot

- What Became Real: the React shell now exposes a first-class `Probe local runtime` action in settings and assistant surfaces, persists the latest probe result through recorder state, the TypeScript backend has a dedicated invoke/fallback contract for local-runtime probes, and the Tauri backend exposes a bounded local-provider probe command that sanitizes local-model output before returning it to the UI.
- What Remains Simulated: browser/jsdom probe behavior remains simulated/unavailable outside the governed Tauri runtime; this packet's original proof bundle still reflects the pre-successor seeded-state screenshot path, but that bridge limitation itself is now retired by `WP-GOV-BRIDGE-002`.
- Next Blocking Real Seam: No blocking seam remains for the in-app probe itself; future follow-on work belongs to runtime remediation, engine management, or benchmark-style probe suites rather than bridge interaction.

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
- Run WP checks: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I6-004.ps1
- Proof artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I6-004/
