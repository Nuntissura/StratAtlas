# WP-I1-021 - Panel Layout Stability and Retrieval

Date Opened: 2026-04-10
Status: SUPERSEDED
Iteration: I1
Workflow Version: 4.0
Packet Class: IMPLEMENTATION
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I1-021.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I1-021.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I1-021.ps1

## Intent

Fix panel overlap, hidden-by-default retrievability, and rigid grid breakpoints so that every stable UI region (REQ-0200) is always reachable and never visually obscured at any supported viewport size.

### Root Causes Identified

1. **Inspector and Tray default to collapsed** (`App.tsx:1325-1326`). The right panel shrinks to a 48px sliver with `overflow: hidden` (`App.css:1076-1083`). The only recovery is a small text button inside that 48px strip. The bottom tray has the same pattern.
2. **Rigid three-column grid** (`App.css:115`: `300px | 1fr | 300px`) has no intermediate breakpoint — it jumps from 3 columns directly to single-column stacking at 1120px (`App.css:1505-1508`), causing panels to scroll off-screen with no jump-back affordance.
3. **Footer sits outside the grid** (`App.tsx:11924`). With `z-index: 15` and fixed `max-height: 220px`, the expanded tray overlays the bottom of the center panel instead of pushing it up.

## Linked Requirements

- REQ-0200
- REQ-0212

## Linked Primitives

- PRIM-0005 | Stable UI Region Contract | This WP directly repairs the region contract: every declared region (left, right, bottom, main) must be reachable and non-overlapping at all supported viewport sizes

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## Reality Boundary

- Real Seam: Grid layout, collapse/expand affordance, and footer integration are all CSS/JSX changes in the live desktop shell — no mocking or simulation involved.
- User-Visible Win: All four panels are always discoverable and reachable; collapsed panels have visible toggle anchors in the header/toolbar; the tray never overlays the map; midrange viewports degrade gracefully instead of jumping to single-column.
- Proof Target: Live bridge audit-sweep snapshots at multiple viewport widths showing all panels reachable and non-overlapping.
- Allowed Temporary Fallbacks: None — this is a direct CSS/layout fix with no simulated paths.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## In Scope

- Fix inspector default state: start expanded (or provide a persistent, always-visible toggle in the header bar).
- Fix tray default state: provide a persistent, always-visible toggle in the header bar so the tray is always retrievable.
- Integrate the `<footer>` into the grid flow so it pushes content instead of overlaying it.
- Add an intermediate CSS breakpoint between 1120px and 1320px that collapses sidebars gracefully (e.g. icon-only rail) instead of jumping to single-column.
- Ensure collapsed panels have clear, labeled toggle buttons visible outside their own collapsed area (in the header or a persistent toolbar).
- Verify all four regions are reachable via bridge navigation targets after the fix.

## Out of Scope

- Resizable/draggable panel widths (future scope).
- Panel drag/resize or user-defined widths.
- New panel content or tab additions.
- Mobile/tablet viewport support.

## Expected Files Touched

- .product/Worktrees/wt_main/src/App.tsx
- .product/Worktrees/wt_main/src/App.css

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0005 (Stable UI Region Contract) | Panel collapse/expand + grid layout | CSS Grid + React state | All four declared regions always reachable, non-overlapping, with persistent toggle affordance |

## Spec-Test Coverage Plan

### Dependency and Environment Tests
- [ ] Dependency graph/lock integrity tests
- [ ] Runtime compatibility checks

### UI Contract Tests
- [ ] Required regions/modes/states
- [ ] Error/degraded-state UX

### Functional Flow Tests
- [ ] Golden flow and edge cases
- [ ] Persistence/replay/export flows

### Code Correctness Tests
- [ ] Unit tests
- [ ] Integration tests
- [ ] Static analysis (lint/type/schema)

### Red-Team and Abuse Tests
- [ ] Non-goal enforcement (spec section 3.2)
- [ ] Policy bypass scenarios
- [ ] Adversarial/invalid input cases

### Additional Tests
- [ ] Performance budgets
- [ ] Offline behavior
- [ ] Reliability/recovery

## Fallback Register

- Explicit simulated/mock/sample paths: None — all changes are direct CSS/JSX layout fixes.
- Required labels in code/UI/governance: N/A
- Successor packet or debt owner: N/A
- Exit condition to remove fallback: N/A

## Change Ledger

- What Became Real: Persistent header toggles for Inspector and Tray (always visible regardless of panel state); footer integrated into CSS grid flow (pushes content instead of overlaying); intermediate 1320px breakpoint reduces side panels to 220px; dead 1320px `.layout` rule removed and merged; Ctrl+T keyboard shortcut for tray toggle.
- What Remains Simulated: Nothing — all changes are direct CSS/JSX layout fixes in the live desktop shell.
- Next Blocking Real Seam: Live desktop visual proof via bridge audit-sweep + user sign-off.

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-021.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I1-021/
- Claim Standard: do not claim completion without linked command output and artifact paths.

## Exit Criteria

- Task board and requirements index statuses are synchronized.
- Traceability, primitives index, and primitives matrix are synchronized.
- Linked test suite has executed results and evidence paths.
- Evidence bundle is attached.
- Reality Boundary, Fallback Register, and Change Ledger are truthful.
- User Sign-off: APPROVED.

## Evidence

- Test Suite Execution: 90/90 passed (vitest), TypeScript clean, ESLint clean
- Logs: N/A
- Screenshots/Exports: pending live bridge audit-sweep
- Build Artifacts: pending
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I1-021/
- User Sign-off: pending

## Progress Log

- 2026-04-10: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
- 2026-04-10: Implementation complete -- persistent header toggles, footer grid integration, intermediate breakpoint fix. 90/90 tests pass, TypeScript clean.
- 2026-04-10: SUPERSEDED by WP-I1-022 (Component Architecture Decomposition). Panel layout stability is absorbed into the component architecture grid system. Retained proof: 90/90 tests pass, TypeScript clean.
