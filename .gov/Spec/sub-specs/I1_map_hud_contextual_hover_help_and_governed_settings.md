# I1 Map HUD, Contextual Hover Help, and Governed Settings

Date: 2026-04-09
Owner: Codex
Status: Draft for active implementation packet `WP-I1-017`

## Purpose

Define the next narrow shell-refinement seam after `WP-I1-015`. This slice does not add new analytical capability. It makes the verified map runtime feel like the central workstation by moving persistent chrome out of the way, bringing detail closer to the scene, and adding a governed settings surface for meaningful workspace behavior.

## Problem Statement

The current workbench is calmer than the earlier shell, but the 2026-04-09 visual inspection still shows four friction points:

1. The map is structurally central but still framed by too much persistent toolbar, inspector, and footer chrome.
2. Feature hover mostly changes the cursor instead of teaching the scene at point-of-use.
3. Useful runtime detail lives in a fixed side inspector rather than appearing where the analyst is looking.
4. There is no dedicated settings surface for motion, hover help, compact chrome, or live-refresh behavior, so those controls are either absent or buried inside unrelated workflow UI.

## Linked Requirements

- REQ-0011
- REQ-0012
- REQ-0013
- REQ-0200
- REQ-0201
- REQ-0211
- REQ-0212

## Linked Primitives

- PRIM-0045
- PRIM-0068
- PRIM-0071

## Delivery Contract

### 1) Map HUD

- The default map summary state MUST feel like a HUD layered over the real map runtime rather than a large block of surrounding panel chrome.
- Core map actions such as surface mode, basemap, export, and live/degraded state MAY move into compact stage-edge controls.
- Persistent detail cards MAY become contextual or collapsed if stable-region access is still preserved.
- Stable regions from REQ-0200 MUST remain present even if their visible chrome becomes lighter or more compact.

### 2) Contextual Inspection and Hover Help

- The map SHOULD expose point-of-use hover or focus helpers for selectable features, legend items, and jargon-heavy controls when that reduces first-minute confusion.
- Hover or focus helpers MUST retain explicit evidence/context/model/AI truth labels and MUST NOT imply unsupported precision.
- Click or keyboard selection MUST open a contextual detail surface tied to the current selected feature or AOI.
- Empty, cached, fallback, or unavailable states MUST stay honest and explicit in any helper or drawer copy.

### 3) Purposeful Motion

- AOI changes, inspect-target changes, and disclosure transitions SHOULD use bounded motion that reinforces spatial understanding.
- Motion MUST stay subtle enough that the scene remains readable and performant.
- Motion MUST reduce or disable when the user selects a reduced-motion preference or when degraded rendering is active.
- The 2D surface remains the analytical default; 3D remains purpose-driven rather than decorative.

### 4) Governed Settings Surface

- The live shell MUST expose a dedicated settings entry point.
- The settings surface MUST contain meaningful items that control real frontend or backend-connected behavior rather than placeholder toggles.
- At minimum, the packet should cover a mix of shell-behavior and runtime-behavior settings such as compact chrome, hover helpers, motion profile, telemetry visibility, offline/live-refresh policy, or equivalent truthful controls.
- Settings MUST persist through the governed save/restore path that the app already uses, and they MUST restore deterministically on reopen.
- Settings MUST NOT suggest unsupported runtime features such as proprietary imagery, unrestricted live global tracking, or hidden autonomous actions.

### 5) Accessibility and Truthfulness

- Hover-only affordances MUST also remain reachable by focus, click, or another accessible path.
- Open/closed/selected states MUST not rely on color alone.
- The settings surface MUST use plain operator language where possible and SHOULD not force jargon before the map value is clear.
- The redesign MUST reuse the verified runtime and shell rather than inventing an onboarding-only surface.

## Implementation Guidance

- Prefer moving or collapsing persistent chrome over inventing new regions.
- Prefer contextual detail on demand over a permanently expanded right-side inspector.
- Prefer helper copy that explains "why this matters" in one line over long descriptive paragraphs.
- Prefer settings that change existing live behavior over speculative future controls.
- Keep the bridge/debugger workflow usable so packet proof can be captured without keyboard or mouse simulation.

## Explicit Non-Goals

- No new data families, provider contracts, or major workflow modules.
- No draggable window manager or detachable pane system.
- No decorative animation disconnected from scene changes or user settings.
- No fake "AI autopilot", covert inference, or any capability outside the existing safety boundary.

## Proof Expectations

- Automated app tests cover the settings menu, settings persistence, and contextual hover/help or selection-driven detail behavior.
- Packet checks pass under `.gov/workflow/wp_checks/check-WP-I1-017.ps1`.
- If the bridge/runtime is available, capture live snapshots showing the new HUD state and settings surface.
