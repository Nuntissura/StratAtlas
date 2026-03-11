# GOV Map Family Intent Guardrails

Date: 2026-03-10
Status: DRAFT
Iteration: All
Parent Spec: .gov/Spec/stratatlas_spec_v1_2.md
Linked Work Packet(s): WP-GOV-MAPDATA-003
Linked Requirements: REQ-0011, REQ-0012, REQ-0013, REQ-0019, REQ-0020, REQ-0021, REQ-0022, REQ-0200, REQ-0201
Linked Primitives: PRIM-0064, PRIM-0070

## 1) Intent

Preserve the original StratAtlas product intent while the new map-family queue expands map-visible content. These guardrails keep future layers aligned to strategic analysis, reproducible evidence, and a calm map-first workbench instead of drifting into generic tracking or dashboard sprawl.

## 2) Mandatory Checklist

Every future map-family packet in the `WP-I1-008` through `WP-I1-013` queue MUST answer the following questions in its linked sub-spec before the packet moves beyond `SPEC-MAPPED`.

1. Strategic Question Fit
   - What strategic question does this family help answer?
   - Which of these does it support directly: baseline/delta, contextual correlation, scenario comparison, strategic modeling, or exportable briefing evidence?

2. Map-First Contribution
   - Why must this capability live on the map or globe rather than as a side-panel-only widget?
   - What scene, AOI, camera, geometry, or timeline behavior makes it useful spatially?

3. Evidence Label Contract
   - Is the family primarily `Observed Evidence`, `Curated Context`, or `Modeled Output`?
   - What labels and uncertainty markers are required so it is not mistaken for something else?

4. Context and Causality Boundary
   - If this family is contextual enrichment, how will the UI make clear that it is correlated context rather than direct explanation or causation?
   - If it mixes observed and curated/model layers, where is that boundary shown?

5. Mode Integration
   - How does the family behave in `Live/Recent`, `Replay`, `Compare`, `Scenario`, and `Offline` modes?
   - Which modes are fully supported, degraded, unavailable, or intentionally out of scope?

6. Bundle, Export, and Reopen Contract
   - What is captured in snapshot bundles?
   - What survives deterministic reopen?
   - What is allowed in 4K export and briefing export, and what source/license constraints apply?

7. Non-Goal and Anti-Tracker Boundary
   - How is the family prevented from turning into individual targeting, stalking, covert inference, or operational pursuit?
   - What no-ship claims or UI patterns are explicitly forbidden?

8. Shell Fit and Cognitive Load
   - How does the family fit the grouped map-family dock without making the shell noisy or overwhelming?
   - What information stays collapsed, optional, aggregated, or secondary by default?

9. Truthful Degradation
   - What are the valid truth states for this family: live, delayed, cached, curated static, heuristic, blocked, licensed-only, unavailable?
   - How will the user see those states directly in the workbench?

10. Proof Obligations
   - What exact packet evidence will prove the family stayed aligned with the questions above?
   - Which tests, smoke steps, screenshots, or bundle/export proofs are required before promotion?

## 3) No-Ship Triggers

The packet MUST NOT move to `IN-PROGRESS` or beyond if any of the following remain unanswered:

- no clear strategic question is named
- no map-specific value is defined
- the evidence/context/model boundary is ambiguous
- replay/compare/scenario/offline behavior is unspecified
- bundle/export/reopen behavior is unspecified
- anti-tracker and non-goal boundaries are missing
- the family would make the shell noisier without a containment plan

## 4) Response Template For Linked Sub-Specs

Each target packet sub-spec SHOULD include this section:

`## Guardrail Response`

- Status:
- Strategic question fit:
- Map-first contribution:
- Evidence label contract:
- Context and causality boundary:
- Mode integration:
- Bundle/export/reopen contract:
- Non-goal and anti-tracker boundary:
- Shell fit and cognitive-load control:
- Truthful degradation states:
- Proof obligations:

## 5) Queue Coverage

This checklist applies to:

- `WP-I1-008`
- `WP-I1-009`
- `WP-I1-010`
- `WP-I1-011`
- `WP-I1-012`
- `WP-I1-013`

`WP-GOV-MAPDATA-002` remains a research blocker for maritime source truth, but `WP-I1-012` still inherits this checklist once it becomes implementable.
