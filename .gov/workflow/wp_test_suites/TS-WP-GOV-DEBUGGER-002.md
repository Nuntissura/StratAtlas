# TS-WP-GOV-DEBUGGER-002 - Spec vs Code Test Suite

Date Opened: 2026-04-10
Status: PLANNED
Linked Work Packet: WP-GOV-DEBUGGER-002
Iteration: All

## Scope

Validate WP delivery against linked requirements and primitives.

## Inputs

- Linked requirements: REQ-0013, REQ-0019, REQ-0020
- Linked primitives: PRIM-0075
- Linked components: App.tsx (snapshot functions, JS globals, bridge event listener), lib.rs (admin_save_snapshot, bridge snapshot endpoint)

## Reality Boundary Assertions

- Packet Class: IMPLEMENTATION
- Real Seam: Replace viewport-only html2canvas capture with full-DOM and per-panel capture modes
- Proof Target: Side-by-side viewport-only vs full-DOM snapshot comparison showing previously invisible overlapping content; per-panel snapshot of isolated right-side panels
- Allowed Fallbacks: WebGL map region may require separate canvas.toDataURL compositing if the DOM renderer cannot capture WebGL natively
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0013 | PRIM-0075 | Dependency | html2canvas or replacement | npm ls html2canvas | snapshot library resolved and version-locked |
| UI-001 | REQ-0013 | PRIM-0075 | UI Contract | full-DOM capture | Ctrl+Shift+S with overlapping panels visible | snapshot image dimensions exceed viewport; all panels visible |
| FUNC-001 | REQ-0013 | PRIM-0075 | Functionality | per-panel capture | POST /agent/snapshot with panelSelector | isolated panel image at natural rendered size |
| FUNC-002 | REQ-0020 | PRIM-0075 | Functionality | backward compat | window.__stratatlasRequestSnapshot() with no args | defaults to full-DOM mode; image saved to governed path |
| COR-001 | REQ-0013 | PRIM-0075 | Code Correctness | Tauri handler | Rust unit tests for admin_save_snapshot with larger payloads | no truncation on images larger than viewport |
| RED-001 | REQ-0013 | PRIM-0075 | Red Team / Abuse | invalid selector | POST /agent/snapshot with nonexistent panelSelector | graceful error response, no crash |
| EXT-001 | REQ-0019 | PRIM-0075 | Additional | large-window capture | full-DOM snapshot at 4K resolution | image saved without timeout or memory failure |

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

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-DEBUGGER-002.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-GOV-DEBUGGER-002/

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
