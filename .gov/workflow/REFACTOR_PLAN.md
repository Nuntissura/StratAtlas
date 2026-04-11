# StratAtlas - UI Refactor Plan

Date: 2026-04-11
Spec anchor: `stratatlas_spec_v1_2.md` v1.2.6 sections 11.10-11.14
Status: **Active** — WP-I1-022 is the current blocking packet

---

## 1) Why

The frontend is a 12,458-line monolithic App.tsx with 152 useState hooks, 1,592 lines of single-file CSS, and no component boundaries. The user cannot tell what they are looking at. Cards are inconsistent. Features are interleaved instead of grouped. Settings is a cramped dropdown. AI interaction has no clear surface. The spec (v1.2.6) now defines the target architecture — this plan executes it.

---

## 2) Blocking Track (strict sequence)

| Order | WP | Title | Depends On | Absorbs |
|------:|-----|-------|-----------|---------|
| 1 | **WP-I1-022** | Component Architecture Decomposition | — | WP-I1-021 |
| 2 | **WP-I1-023** | Card System Implementation | WP-I1-022 | WP-I1-017 |
| 3 | **WP-I1-024** | Task Family Architecture | WP-I1-023 | WP-I1-015, WP-I1-018 |
| 4 | **WP-I1-025** | Settings Panel Rebuild | WP-I1-024 | — |
| 5 | **WP-I1-026** | AI Interaction Surface | WP-I1-025 | — |

Each packet depends on the one before it. No parallelism within this track.

---

## 3) Parallel Tracks (not blocked by the refactor)

These can progress independently or be picked up between refactor packets:

| Track | Packets | Status | Next Step |
|-------|---------|--------|-----------|
| AI sign-off | WP-GOV-AI-REALIGN-001, WP-I6-005, WP-I6-006 | All IMPLEMENTED | Live desktop proof + user sign-off |
| Local inference proof | WP-I6-007 | Code path verified | Run app with local LLM, capture proof |
| Agent tooling sign-off | WP-GOV-DEBUGGER-001/002, WP-GOV-BRIDGE-001/002/003 | All IMPLEMENTED | User sign-off |
| Map runtime | WP-I1-014 (basemap), WP-I1-016 (3D terrain) | IMPLEMENTED / SPEC-MAPPED | Sign-off / scope |
| Global events | WP-I7-003 | IMPLEMENTED | User sign-off |

---

## 4) Future Queue (after refactor)

Not started. Sequencing TBD after the refactor lands.

| WP | Title | Notes |
|----|-------|-------|
| WP-I7-004 | Geopolitical Baseline Dataset | Makes map meaningful on first launch |
| WP-I10-003 | Game Theory Templates | Pre-built templates, scenario tree, map linkage |
| WP-I1-019 | Region Focus Mode | Zoom + filter + profile cards |
| WP-I1-020 | Keyboard Shortcuts, Dark Mode, Onboarding | Keyboard shortcuts partially covered by refactor |
| WP-I0-004 | Demo Dataset, Export Formats, Session Resume | CSV/GeoJSON/KML, auto-save, lazy-load |
| WP-GOV-SMOKE-001 | Manual Desktop Smoke | IN-PROGRESS; re-run after refactor lands |

---

## 5) Done Standard

A refactor packet is done when:
- Existing tests pass (90/90)
- TypeScript and ESLint clean
- Rust compiles (if backend touched)
- Bridge navigation targets still work
- Visual proof captured via audit-sweep
- User sign-off recorded

This file closes when all five packets in the blocking track reach E2E-VERIFIED.
