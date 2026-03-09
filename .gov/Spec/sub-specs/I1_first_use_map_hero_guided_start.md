# I1 First-Use Map Hero and Guided Start

Date: 2026-03-09
Status: DRAFT
Iteration: I1
Parent Spec: .gov/Spec/stratatlas_spec_v1_2.md
Linked Work Packet(s): WP-I1-006
Linked Inputs: .gov/Spec/sub-specs/I1_workbench_restyle_research.md; .gov/Spec/sub-specs/GOV_manual_desktop_smoke_and_ux_triage.md
Linked Requirements: REQ-0011, REQ-0012, REQ-0013, REQ-0200, REQ-0201, REQ-0211, REQ-0212
Linked Primitives: PRIM-0045, PRIM-0068, PRIM-0071

## 1) Why This Slice Exists

- `WP-GOV-SMOKE-001` found that the current verified shell is still overwhelming in the first minute of use.
- The map is present but does not feel like the emotional center of the product.
- The first screen exposes too many simultaneous concepts, and the first useful action is unclear.

## 2) First-Use Goals

- The map must read as the primary workspace before the user understands the deeper system.
- The shell must present one obvious starting path instead of assuming the user already knows the product model.
- Supporting panes must use progressive disclosure so the user is not forced to process every subsystem on first load.
- The redesign must reuse the already-verified runtime rather than inventing a separate onboarding-only surface.

## 3) Required Outcomes

### 3.1 Guided Start

- The main canvas must show a clear "start here" state when the user has not yet created meaningful session progress.
- Guided actions must route into real existing workflows such as context registration, query, bundle capture, and workflow detail.
- Each guided action must explain the visible payoff on the map, not just the internal subsystem it opens.

### 3.2 Map Hero

- The live 2D/3D map remains the dominant visual surface.
- First-use summary content must become concise and map-oriented rather than dashboard-heavy.
- The map-adjacent copy must explain what the current scene represents and why it matters.

### 3.3 Progressive Disclosure

- At least one always-open support region must default to a collapsed or compact state.
- Dense workspace controls must offer a compact first-use view with an explicit path to advanced controls.
- The shell must preserve required stable regions while reducing first-view cognitive load.

### 3.4 Accessibility and Truthfulness

- Collapse/expand, guided actions, and start-state routing must remain keyboard reachable.
- Selected/pressed/expanded states must not rely on color alone.
- The shell must not imply new product capabilities that do not already exist.

## 4) Expected First Slice

- Compact workspace start panel on the left.
- Guided-start card and quick actions in the main canvas summary area.
- Collapsed or compact inspector/tray defaults on first load.
- Explicit route into full workbench mode once the user wants deeper tooling.

## 5) Verification Direction

- `App.test.tsx` must verify the guided-start shell and disclosure behavior.
- Existing map-runtime and region tests must continue to pass.
- Follow-on manual smoke should verify whether first-action clarity and map primacy materially improved.
