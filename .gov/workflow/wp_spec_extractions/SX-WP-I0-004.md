# SX-WP-I0-004 - Spec Extraction Snapshot

Generated On: 2026-04-09
Linked Work Packet: WP-I0-004
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I0-004.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I0-004.ps1
Packet Class Snapshot: IMPLEMENTATION
Workflow Version Snapshot: 4.0
WP Status Snapshot: SPEC-MAPPED
Iteration: I0

## Scope

Concrete extraction of requirement and primitive obligations this WP must satisfy before status promotion.

## Reality Boundary Snapshot

- Real Seam: see WP for details
- User-Visible Win: see WP for details
- Proof Target: see WP for details
- Allowed Temporary Fallbacks: see WP for details
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## Change Ledger Snapshot

- What Became Real: see WP for details
- What Remains Simulated: see WP for details
- Next Blocking Real Seam: see WP for details

## Requirement Extraction

| Requirement | Level | Section | Description | Target | Status |
|-------------|-------|---------|-------------|--------|--------|
| REQ-0108 | MUST | Section 10.1 | Full offline mode for air-gapped environments | I0 | E2E-VERIFIED |
| REQ-0110 | MUST | Section 6.3 | Artifact store: immutable artifacts with append-only supersedes links | I0 | E2E-VERIFIED |
| REQ-0111 | MUST | Section 5 | Deployment profiles each specify: identity, key management, storage, audit retention, AI access | I0 | E2E-VERIFIED |

## Primitive Extraction

| Primitive | Name | Contract | REQs | First Iter | Status |
|-----------|------|----------|------|------------|--------|
| PRIM-0071 | Map-First Workbench Shell | Organize the verified StratAtlas regions into a calmer desktop workbench with task-grouped tabs, contextual panes, and bottom-tray disclosure while preserving map primacy and accessibility | REQ-0011, REQ-0012, REQ-0200, REQ-0201, REQ-0211, REQ-0212 | I1 | E2E-VERIFIED |

## Traceability Hooks

- REQ-0108: Mapped in TRACEABILITY_MATRIX.md
- REQ-0110: Mapped in TRACEABILITY_MATRIX.md
- REQ-0111: Mapped in TRACEABILITY_MATRIX.md

## Non-Goal / Red-Team Guardrails

- No individual targeting/stalking workflows.
- No covert affiliation inference.
- No social-media scraping ingestion.
- No leaked/hacked/scraped-against-terms data pipelines.
- No financial trading or prediction tooling.

## Verification Hooks

- Run preflight: powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1
- Run WP checks: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I0-004.ps1
- Proof artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I0-004/
