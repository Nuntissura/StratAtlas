# I1 AI and Scenario UX Simplification

Date: 2026-04-09
Owner: Codex
Status: Draft for active implementation packet `WP-I1-018`

## Purpose

Define the next narrow shell-refinement seam after `WP-I1-017`. This slice does not add new AI or scenario capability. It makes the existing assistant and scenario workflows easier to understand by promoting obvious next actions, moving configuration density behind explicit disclosure, and keeping the map-first shell calm.

## Problem Statement

The 2026-04-09 live shell still has two high-friction workflow regions:

1. The assistant panel mixes operator intent, runtime configuration, MCP execution, and result history into one flat control stack.
2. The scenario panel exposes every modeling field at once, even though most sessions only need fork/select/compare/export at first.
3. The current layout makes the analyst parse implementation details before they understand the next useful action.
4. The verified AI and scenario seams are real, but their default presentation still feels like a debugging surface rather than an analyst-facing workstation.

## Linked Requirements

- REQ-0013
- REQ-0500
- REQ-0700

## Linked Primitives

- PRIM-0071

## Delivery Contract

### 1) Assistant Surface Simplification

- The assistant panel MUST present a clear primary action first: ask the governed assistant about the current evidence.
- Runtime configuration details such as deployment profile, provider selection, and MCP tool choice SHOULD move behind explicit disclosure or a settings entry point instead of remaining permanently expanded.
- The assistant panel MUST continue to expose truthful provider/runtime status, policy notes, and local-runtime verification state.
- If local-runtime probing is relevant, the probe action MUST remain reachable from the assistant surface without requiring a hidden or simulated path.

### 2) Scenario Surface Simplification

- The scenario panel MUST foreground the first-minute workflow: fork a scenario, pick the active and comparison forks, compare, and export.
- Advanced modeling inputs such as raw constraint fields and hypothetical-entity fields SHOULD be hidden behind explicit disclosure until the analyst asks for them.
- Comparison and export state MUST remain visible and truthful once scenario data exists.
- Context-derived `constraint_node` inputs MUST remain explicitly labeled as modeled inputs rather than observed evidence.

### 3) Shell and Accessibility Rules

- Open/closed/selected states MUST not rely on color alone.
- Hover-only teaching is insufficient; every important action or detail path MUST remain reachable by focus, click, or button disclosure.
- The simplification MUST reuse the verified workbench shell and must not introduce a detached wizard or onboarding-only mode.
- The left assistant region and right planning region MUST remain stable shell regions under the I1 workbench contract.

### 4) Persistence and Truthfulness

- Workflow simplification MUST NOT break the verified AI, MCP, scenario compare, or scenario export flows.
- Disclosure state MAY be ephemeral, but the underlying assistant/scenario state, results, and export artifacts MUST continue to restore through the governed recorder and bundle paths.
- The shell MUST remain explicit about degraded, offline, policy-blocked, and unconfigured runtime states.

## Implementation Guidance

- Prefer a small number of workflow cards with short "what this does" copy over long grids of always-visible form controls.
- Keep advanced controls available, but move them behind buttons such as `Show advanced AI controls` or `Show advanced modeling inputs`.
- Prefer `Open AI settings` for deeper runtime configuration instead of duplicating full provider configuration inside the left assistant surface.
- Preserve existing button labels for the real actions where possible so tests and operator language stay stable.

## Explicit Non-Goals

- No new AI provider contracts, MCP tools, or scenario solver behavior.
- No hidden automation or autonomous assistant actions.
- No new data families, live feeds, or model outputs.
- No decorative transitions disconnected from user actions.

## Proof Expectations

- Automated tests cover the simplified default assistant and scenario surfaces plus the retained advanced paths.
- Existing AI analysis, MCP execution, scenario fork, compare, and export flows continue to pass.
- `check-WP-I1-018.ps1` passes.
- If the live desktop runtime is available, bridge-driven snapshots capture the simplified assistant and scenario surfaces.
