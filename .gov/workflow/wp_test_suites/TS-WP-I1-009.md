# TS-WP-I1-009 - Spec vs Code Test Suite

Date Opened: 2026-03-10
Status: E2E-VERIFIED
Linked Work Packet: WP-I1-009
Iteration: I1

## Scope

Validate the first source-backed static layer payload family for airports, ports, dams, power plants, and curated military installations against the governed map-family intent checklist.

## Inputs

- Linked requirements: REQ-0013, REQ-0108, REQ-0200, REQ-0201, REQ-0202, REQ-0203, REQ-0211, REQ-0212
- Linked primitives: PRIM-0045, PRIM-0046, PRIM-0071
- Linked components: .gov/Spec/sub-specs/GOV_map_family_intent_guardrails.md; .gov/Spec/sub-specs/I1_static_installations_and_critical_infrastructure_layers.md; .product/Worktrees/wt_main/src/features/i1/layers.ts; .product/Worktrees/wt_main/src/features/i1/staticInstallations.ts; .product/Worktrees/wt_main/src/features/i1/runtime/mapRuntimeScene.ts; .product/Worktrees/wt_main/src/App.tsx

## Reality Boundary Assertions

- Packet Class: IMPLEMENTATION
- Real Seam: Static installations render as governed toggleable layers with explicit source and coverage labels.
- Proof Target: Packet verification proves toggle behavior, offline-safe packaging, truthful labeling for static facilities, and conformance with the governed map-family intent checklist.
- Allowed Fallbacks: Curated static snapshots with explicit freshness and coverage labels.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0108 | PRIM-0045 | Dependency | offline packaging | packet build checks | static layers remain usable offline where licensing allows |
| UI-001 | REQ-0200, REQ-0212 | PRIM-0071 | UI Contract | family controls and labels | App/UI tests | airports, ports, dams, power plants, and curated military sites are grouped and labeled |
| FUNC-001 | REQ-0201, REQ-0202, REQ-0203 | PRIM-0045, PRIM-0046 | Functionality | static layer rendering | map/runtime tests | static facilities render without implying live movement |
| COR-001 | REQ-0013 | PRIM-0045 | Code Correctness | source truth | review + tests | curated military sites are labeled as curated known installations |
| RED-001 | REQ-0013 | PRIM-0046 | Red Team / Abuse | false live-state prevention | packet review | static facility layers are never framed as live operational truth |
| EXT-001 | REQ-0211 | PRIM-0071 | Additional | degraded/budget behavior | runtime review | static facilities degrade gracefully with other overlays |

## Dependency and Environment Tests

- [x] Runtime dependency install/lock integrity
- [x] Platform portability constraints checked
- [x] Required services/adapters available

## UI Contract Tests

- [x] Required regions
- [x] Required modes/states
- [x] Error and degraded-state UX

## Functional Flow Tests

- [x] Golden flow
- [x] Deterministic replay path
- [x] Export/import or persistence flow

## Code Correctness Tests

- [x] Unit tests
- [x] Integration tests
- [x] Static checks (lint/type/schema)

## Red-Team and Abuse Tests

- [x] Non-goal enforcement (spec section 3.2)
- [x] Policy bypass attempts
- [x] Invalid input and path abuse cases

## Additional Tests

- [x] Performance budget checks
- [x] Offline behavior
- [x] Accessibility/usability checks
- [x] Reliability/recovery checks

## Automation Hook

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-009.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-I1-009/

## Execution Summary

- Last Run Date: 2026-03-11
- Result: Passed
- Blocking Failures: None
- Evidence Paths: `.product/build_target/tool_artifacts/wp_runs/WP-I1-009/20260311_083107/summary.md`; `.product/build_target/tool_artifacts/wp_runs/WP-I1-009/20260311_083107/result.json`; `.gov/Spec/sub-specs/I1_static_installations_and_critical_infrastructure_layers.md`; `.gov/workflow/work_packets/WP-I1-009_static-installations-and-critical-infrastructure-layers.md`
- What Became Real: The static family now ships with six curated layer members, truth-labeled source metadata, runtime map projection, recorder persistence, and deterministic bundle reopen behavior.
- What Remains Simulated: Live operational state and mobility feeds remain intentionally out of scope for this packet.
- Next Blocking Real Seam: `WP-I1-010`
- Reviewer: Codex
- User Sign-off: Approved via 2026-03-11 instruction to start `WP-I1-009` and continue remediation autonomously.
