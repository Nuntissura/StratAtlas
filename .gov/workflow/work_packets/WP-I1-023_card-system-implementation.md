# WP-I1-023 - Card System Implementation

Date Opened: 2026-04-11
Status: SPEC-MAPPED
Iteration: I1
Workflow Version: 4.0
Packet Class: IMPLEMENTATION
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I1-023.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I1-023.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I1-023.ps1

## Intent

Implement the governed card vocabulary from spec Section 11.11. Replace the current mix of hero blocks, surface-cards, telemetry-cards, artifact-callouts, and inline content with five card types (status, data, action, insight, config). Apply anatomy rules (type badge, title, body, source label). Enforce max-5 default cards per panel. Remove banned patterns.

Supersedes: WP-I1-017 (HUD/settings -- HUD cards now part of card system).

## Linked Requirements

- REQ-0011
- REQ-0012
- REQ-0200

## Linked Primitives

- PRIM-0005 | Stable UI Region Contract | Card system provides the consistent vocabulary that fills each stable region with self-describing, typed content

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## Reality Boundary

- Real Seam: Every non-map UI element is a typed card. Cards are self-describing (type badge + source label). No hero blocks, no KPI grids, no decorative gradients.
- User-Visible Win: Cleaner, more consistent UI. Every card tells you what it is and where the data came from. Less visual noise.
- Proof Target: All existing content renders through the card component library. Banned patterns are absent from CSS. Max-5 default cards enforced per panel.
- Allowed Temporary Fallbacks: Legacy card CSS class names may remain as aliases during migration; documented in Change Ledger.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## In Scope

- Card component library (StatusCard, DataCard, ActionCard, InsightCard, ConfigCard).
- Refactor all existing surface-card/telemetry-card/artifact-callout usage to typed cards.
- Apply max-5 default cards per panel and disclosure rules for overflow.
- Remove banned patterns (hero blocks, KPI grids, decorative gradients) from CSS.
- Card anatomy: type badge, title, body, source label on every card.

## Out of Scope

- Changing what data is displayed (content stays the same, only presentation changes).
- Adding new features or new data sources.
- Visual redesign beyond card vocabulary (layout changes are WP-I1-022).

## Expected Files Touched

- .gov/Spec/stratatlas_spec_v1_2.md
- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-I1-023_card-system-implementation.md
- .gov/workflow/wp_test_suites/TS-WP-I1-023.md
- .gov/workflow/wp_spec_extractions/SX-WP-I1-023.md
- .gov/workflow/wp_checks/check-WP-I1-023.ps1
- .product/Worktrees/wt_main/src/<implementation_files>

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0005 | Card component library | CSS design tokens + React card components | Consistent governed card vocabulary with self-describing typed content across all regions |

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

- Explicit simulated/mock/sample paths: None -- all cards render real content through typed components.
- Required labels in code/UI/governance: Every card must have a type badge and source label. Banned pattern list documented in sub-spec.
- Successor packet or debt owner: WP-I1-024 (task family architecture) depends on cards being available.
- Exit condition to remove fallback: All non-map UI elements render as typed cards with complete anatomy.

## Change Ledger

- What Became Real: TBD
- What Remains Simulated: TBD
- Next Blocking Real Seam: TBD

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I1-023.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I1-023/
- Claim Standard: do not claim completion without linked command output and artifact paths.

## Exit Criteria

- Task board and requirements index statuses are synchronized.
- Traceability, primitives index, and primitives matrix are synchronized.
- Linked test suite has executed results and evidence paths.
- Evidence bundle is attached.
- Reality Boundary, Fallback Register, and Change Ledger are truthful.
- User Sign-off: APPROVED.

## Evidence

- Test Suite Execution:
- Logs:
- Screenshots/Exports:
- Build Artifacts:
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I1-023/
- User Sign-off:

## Progress Log

- 2026-04-11: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
