# TS-WP-GOV-BRIDGE-003 - Spec vs Code Test Suite

Date Opened: 2026-04-10
Status: PLANNED
Linked Work Packet: WP-GOV-BRIDGE-003
Iteration: All

## Scope

Validate WP delivery against linked requirements and primitives.

## Inputs

- Linked requirements: REQ-0013, REQ-0019, REQ-0020
- Linked primitives: PRIM-0075
- Linked components: App.tsx (handleAgentNavigate, disclosure state, audit-sweep handler), lib.rs (bridge endpoint routing, state response)

## Reality Boundary Assertions

- Packet Class: IMPLEMENTATION
- Real Seam: Every app surface — including advanced disclosure sections and panel-info explainers — is reachable from the bridge and capturable via audit sweep
- Proof Target: Audit sweep output containing labeled snapshots of all navigable panels plus all three advanced-disclosure sections expanded
- Allowed Fallbacks: Panel-info explainer cycling produces one snapshot per explainer rather than a combined view
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0013 | PRIM-0075 | Dependency | WP-GOV-DEBUGGER-002 | verify per-panel capture mode is available | per-panel snapshot mode callable from bridge |
| UI-001 | REQ-0013 | PRIM-0075 | UI Contract | disclosure targets | POST /agent/navigate with assistant-advanced, scenario-advanced, workspace-advanced | each disclosure toggles and state response reflects change |
| FUNC-001 | REQ-0013 | PRIM-0075 | Functionality | audit sweep | POST /agent/action with action audit-sweep | structured response with labeled snapshot paths for all surfaces |
| FUNC-002 | REQ-0020 | PRIM-0075 | Functionality | state response | GET /agent/state | response includes assistantAdvancedVisible, scenarioAdvancedVisible, workspaceAdvancedVisible, settingsMenuOpen |
| COR-001 | REQ-0019 | PRIM-0075 | Code Correctness | sweep completeness | count snapshot files from audit-sweep vs known panel count | all navigable surfaces represented in output |
| RED-001 | REQ-0013 | PRIM-0075 | Red Team / Abuse | unsupported disclosure | POST /agent/navigate with invalid disclosure name | graceful warning, no crash |
| EXT-001 | REQ-0013 | PRIM-0075 | Additional | sweep timing | audit sweep with all panels | completes within 60s without timeout |

## Dependency and Environment Tests

- [ ] Runtime dependency install/lock integrity
- [ ] Platform portability constraints checked
- [ ] Required services/adapters available

## UI Contract Tests

- [ ] Required regions
- [ ] Required modes/states
- [ ] Error and degraded-state UX

## Functional Flow Tests

- [ ] Golden flow
- [ ] Deterministic replay path
- [ ] Export/import or persistence flow

## Code Correctness Tests

- [ ] Unit tests
- [ ] Integration tests
- [ ] Static checks (lint/type/schema)

## Red-Team and Abuse Tests

- [ ] Non-goal enforcement (spec section 3.2)
- [ ] Policy bypass attempts
- [ ] Invalid input and path abuse cases

## Additional Tests

- [ ] Performance budget checks
- [ ] Offline behavior
- [ ] Accessibility/usability checks
- [ ] Reliability/recovery checks

## Automation Hook

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-BRIDGE-003.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-GOV-BRIDGE-003/

## Execution Summary

- Last Run Date:
- Result:
- Blocking Failures:
- Evidence Paths:
- What Became Real:
- What Remains Simulated:
- Next Blocking Real Seam:
- Reviewer:
- User Sign-off:
