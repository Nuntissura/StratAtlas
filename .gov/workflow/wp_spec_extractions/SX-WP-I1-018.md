# SX-WP-I1-018 - Spec Extraction Snapshot

Generated On: 2026-04-10
Linked Work Packet: WP-I1-018
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I1-018.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I1-018.ps1
Packet Class Snapshot: IMPLEMENTATION
Workflow Version Snapshot: 4.0
WP Status Snapshot: IMPLEMENTED
Iteration: I1

## Scope

Concrete extraction of requirement and primitive obligations this WP must satisfy before status promotion.

## Reality Boundary Snapshot

- Real Seam: the live assistant and scenario surfaces are reorganized around guided workflow cards, explicit advanced disclosures, and settings-linked runtime access while preserving the verified AI analysis, MCP, scenario compare, and scenario export seams.
- User-Visible Win: analysts see a clearer assistant entry point and a clearer scenario workflow, with the dense configuration fields moved out of the default path and the next action readable at a glance.
- Proof Target: assistant/scenario regressions pass, `pnpm build` passes, `check-WP-I1-018.ps1` passes, and the live bridge captures the simplified assistant and scenario surfaces.
- Allowed Temporary Fallbacks: browser/jsdom remains a non-desktop proof environment; disclosure state may remain ephemeral as long as the underlying AI/scenario state and results stay deterministic and restore correctly.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to `E2E-VERIFIED`.

## Change Ledger Snapshot

- What Became Real: the assistant surface now leads with a governed workflow card while provider/runtime/MCP tuning sits behind explicit disclosure, and the scenario surface now leads with fork/compare/export while raw constraint/entity controls stay behind advanced modeling disclosure. The headless bridge now also enters scenario/compare workflows through the full-workbench path so live proof reaches the shipped surface without recorder-state hacks.
- What Remains Simulated: browser/jsdom remains a non-desktop proof environment relative to the live Tauri shell; no new simulated runtime behavior was added to product code outside tests.
- Next Blocking Real Seam: no additional implementation seam remains inside this packet; user sign-off is the remaining blocker before any `E2E-VERIFIED` promotion.

## Requirement Extraction

| Requirement | Level | Section | Description | Target | Status |
|-------------|-------|---------|-------------|--------|--------|
| REQ-0013 | MUST | Section 17 | No capability is "implemented" until it satisfies the slice definition of done | All | E2E-VERIFIED |
| REQ-0500 | MUST | Section 14 | Scenario forks linked to parent snapshots | I4 | E2E-VERIFIED |
| REQ-0700 | MUST | Section 15.1 | AI access mediated through gateway: authn/authz, RBAC, marking policy, licensing, audit | I6 | E2E-VERIFIED |

## Primitive Extraction

| Primitive | Name | Contract | REQs | First Iter | Status |
|-----------|------|----------|------|------------|--------|
| PRIM-0071 | Map-First Workbench Shell | Organize the verified StratAtlas regions into a calmer desktop workbench with task-grouped tabs, contextual panes, and bottom-tray disclosure while preserving map primacy and accessibility | REQ-0011, REQ-0012, REQ-0200, REQ-0201, REQ-0211, REQ-0212 | I1 | E2E-VERIFIED |

## Traceability Hooks

- REQ-0013: Mapped in TRACEABILITY_MATRIX.md
- REQ-0500: Mapped in TRACEABILITY_MATRIX.md
- REQ-0700: Mapped in TRACEABILITY_MATRIX.md

## Non-Goal / Red-Team Guardrails

- No individual targeting/stalking workflows.
- No covert affiliation inference.
- No social-media scraping ingestion.
- No leaked/hacked/scraped-against-terms data pipelines.
- No financial trading or prediction tooling.

## Verification Hooks

- Run preflight: powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1
- Run WP checks: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-018.ps1
- Proof artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I1-018/
