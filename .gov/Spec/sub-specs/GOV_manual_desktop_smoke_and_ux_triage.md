# GOV Manual Desktop Smoke and UX Triage

Linked Work Packet(s): WP-GOV-SMOKE-001

## Purpose

Define the governed manual-smoke rubric for the first real desktop inspection of StratAtlas before further major refactors or release-candidate work.

## Validation Intent

- Validate the real packaged Windows desktop app as a first-use experience, not as a passing automated test surface.
- Capture where the current workbench creates confusion, overload, dead ends, or low perceived value.
- Preserve screenshot-backed evidence so follow-on refactors can be justified and prioritized.

## Manual Smoke Rubric

Score each category from `1` to `5`.

- `1`: broken, hidden, or actively confusing
- `2`: understandable only with prior project knowledge
- `3`: workable but noisy or cognitively heavy
- `4`: clear with minor friction
- `5`: immediately understandable and confidence-building

### Category A: First-Minute Comprehension

- Can a new user tell what the product is for within the first minute?
- Is the main task hierarchy obvious?
- Does the shell present a clear starting point?

### Category B: Map Primacy

- Is the 2D/3D map visibly the center of gravity of the product?
- Do surrounding panes support the map rather than compete with it?
- Are key map controls discoverable without hunting?

### Category C: Workflow Grouping

- Do tabs and panes group related actions coherently?
- Are mode changes understandable?
- Can the user predict where query, scenario, compare, AI, and context tasks live?

### Category D: Action Clarity and Feedback

- Are primary actions easy to distinguish from secondary actions?
- Does the app provide clear state changes, confirmations, and failure cues?
- Are labels operator-facing rather than implementation-facing?

### Category E: Cognitive Load

- Is too much shown at once?
- Are there too many competing cards, badges, or controls in the first view?
- Does the shell feel calm enough to invite exploration?

### Category F: Accessibility Discoverability

- Are pressed states, modes, and important distinctions visible beyond color alone?
- Can a user infer keyboard/control affordances from the visible UI?
- Are controls large and structured enough to scan?

### Category G: Maintenance / Operator Clarity

- Does the maintenance/help menu explain install, uninstall, repair, and clean-reinstall behavior in plain language?
- Is user-data handling explicit and trustworthy?
- Does the release changelog feel visible and understandable?

## Required Manual Flow

1. Launch the current governed desktop build.
2. Capture the initial shell view.
3. Inspect the main map area, shell regions, and visible controls.
4. Navigate the primary tabs/panes and note where comprehension breaks down.
5. Inspect at least one 2D/3D switch or map-centric interaction if available.
6. Review the release maintenance/help menu and the shipped changelog surface.
7. Record severity-ranked findings and ROI-ranked follow-up ideas.

## Evidence Requirements

- Screenshot files from the running desktop app.
- A rubric scorecard with brief justification per category.
- A findings log with severity, observed impact, and likely refactor direction.
- Explicit notes for flows that were not manually completed end to end.

## Output Contract

The packet should produce:

- a manual smoke artifact folder under `.product/build_target/tool_artifacts/manual_smoke/WP-GOV-SMOKE-001/`
- a findings summary in the packet and suite
- a prioritized follow-on refactor queue when serious usability gaps are confirmed
