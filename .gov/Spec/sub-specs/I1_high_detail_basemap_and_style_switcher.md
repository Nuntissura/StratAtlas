# I1 High-Detail Basemap and Style Switcher

Date: 2026-04-09
Status: DRAFT
Iteration: I1
Parent Spec: .gov/Spec/stratatlas_spec_v1_2.md
Linked Work Packet(s): WP-I1-014
Linked Requirements: REQ-0200, REQ-0201, REQ-0211
Linked Primitives: PRIM-0045, PRIM-0071

## 1) Why This Slice Exists

- The verified 2D runtime already mounts a real online basemap, but analysts cannot choose a different visual emphasis when the current style is too dense or too muted for the task.
- The April 2026 inspection queue identified the basemap itself as the highest-ROI next improvement because the shell is calmer than before but the map still needs more operator control and clearer detail.
- This packet improves the 2D map's legibility and operator control without adding new live feeds or drifting toward generic tracker behavior.

## 2) Required Outcomes

### 2.1 Official Vector Style Selection

- The 2D MapLibre surface must expose a compact, keyboard-reachable basemap selector.
- The selector must switch between the official OpenFreeMap vector style endpoints documented by OpenFreeMap:
  - `positron`
  - `bright`
  - `liberty`
- The selector must not break the existing governed overlay scene, inspect cards, or 2D/3D mode contract.

### 2.2 Persistent Analyst Preference

- The selected 2D basemap style must persist in recorder state.
- The selected style must survive deterministic bundle reopen and warm app restore.
- The 3D globe surface remains a separate mode and is not redefined by this packet.

### 2.3 Truthful Degradation

- If the runtime is offline or the selected online style fails to load, the app must continue to fall back to the existing schematic basemap.
- The UI must preserve the selected style preference even when the fallback surface is active.
- The fallback state must remain explicit about why the live style is unavailable.

### 2.4 Scope Limits

- This packet does not add satellite imagery.
- This packet does not add terrain DEM, globe atmosphere, or 3D-building expansion beyond what the selected vector style already exposes.
- This packet does not add a dark-mode basemap variant.
- Those expansions remain follow-on UX/product scope, not implied delivery here.

## 3) Expected UX Shape

- A small segmented control in the map toolbar for `Positron`, `Bright`, and `Liberty`.
- A truthful status pill and status line that continue to distinguish:
  - active online vector style
  - offline schematic fallback
  - fallback due to online style load failure
- Restore behavior that reopens to the previously chosen style instead of silently resetting to the default.

## 4) Shell Fit Rules

- The selector must stay compact enough that it does not crowd the map toolbar or reduce map prominence.
- It must remain keyboard reachable and understandable without color alone.
- The control should read as a map-appearance preference, not as a live data source toggle.

## 5) Verification Direction

- App-level tests must prove that style selection is visible, selectable, and recorder/bundle persistent.
- The governed runtime must continue to degrade cleanly to the schematic fallback without breaking overlays.
- Packet proof should include a bridge- or debugger-captured visual snapshot from a live desktop session if that runtime is available during verification.
