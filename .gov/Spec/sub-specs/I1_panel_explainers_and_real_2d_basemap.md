# I1 Panel Explainers and Real 2D Basemap

Date: 2026-03-10
Status: DRAFT
Iteration: I1
Parent Spec: .gov/Spec/stratatlas_spec_v1_2.md
Linked Work Packet(s): WP-I1-007
Linked Requirements: REQ-0011, REQ-0013, REQ-0200, REQ-0201, REQ-0212
Linked Primitives: PRIM-0045, PRIM-0068, PRIM-0071

## 1) Why This Slice Exists

- The current 2D runtime is technically mounted, but it reads as a dark abstract scene rather than a real map because it lacks a recognizable basemap.
- The shell has become calmer, but the panel purposes are still learned by trial and error instead of being explained inline.
- Users need a quick explanation of what each panel shows and what actions belong there without leaving the map-first workflow.

## 2) Required Outcomes

### 2.1 Panel Explainers

- Every stable panel region must expose a small inline explainer control.
- The explainer must answer two questions in plain language:
  - what is shown here
  - what this panel lets the analyst do
- The control must be keyboard reachable and must not rely on color alone.
- The explainer must stay concise and must not bury the working controls.

### 2.2 Real 2D Basemap

- The 2D map must use a real recognizable online basemap when network conditions permit.
- The basemap source and runtime state must be truthfully labeled in the UI.
- Offline or failed online basemap loading must degrade to the current schematic/fallback map without breaking the overlays or the rest of the workbench.
- The fallback must be explained as a deliberate degraded state, not presented as if it were the same as the live basemap.

### 2.3 Contract Boundaries

- This packet improves map legibility and panel comprehension only.
- It does not yet add new live traffic or infrastructure feeds.
- Future live air, shipping, satellite, infrastructure, airport, and port layers remain separate governed scope.

## 3) Expected UX Shape

- Small `i`/about controls in the left, main, right, and bottom panel headers.
- A short explainer card directly beneath the relevant header when opened.
- A visible map-runtime indicator that distinguishes:
  - live online basemap
  - offline schematic fallback
  - fallback due to basemap load failure

## 4) Verification Direction

- App-level tests must verify that each stable panel can expose its explainer content.
- The runtime map surface must continue to expose non-color-only state for planar/orbital mode and degraded/fallback status.
- Build, lint, and the linked WP check must pass without regressing the verified I1 shell.
