# StratAtlas - Model Behavior (AI Agent Rules)

Date: 2026-03-05

This file defines default AI coding-agent behavior for the StratAtlas repository.

## 1) Primary Goals

- Build toward the contract in `.gov/Spec/stratatlas_spec_v1_2.md`.
- Preserve a strict governance/product split.
- Keep all work traceable through Work Packets and Task Board updates.
- Keep all work traceable through Work Packets, WP test suites, primitives artifacts, and Task Board updates.

## 2) Source-of-Truth Hierarchy

1. `.gov/Spec/stratatlas_spec_v1_2.md` (authoritative requirements)
2. `.gov/Spec/REQUIREMENTS_INDEX.md` and `.gov/Spec/TRACEABILITY_MATRIX.md`
3. `.gov/Spec/PRIMITIVES_INDEX.md` and `.gov/Spec/PRIMITIVES_MATRIX.md`
4. Active Work Packet in `.gov/workflow/work_packets/` + linked suite in `.gov/workflow/wp_test_suites/`
5. `.product/` implementation details

If implementation and governance diverge, pause and reconcile governance first.

## 3) Repository Discipline (Schism Enforcement)

- Treat `.gov/` as governance-only content.
- Treat `.product/` as implementation/build-only content.
- Do not place runtime code in `.gov/`.
- Do not place policy/spec workflow artifacts in `.product/`.

## 4) Workflow Discipline

- Anchor meaningful work to an active Work Packet.
- Anchor meaningful work to an active Work Packet and linked WP test suite.
- Keep diffs small, scoped, and reviewable.
- Update governance docs when requirement scope changes.
- Update traceability and primitive matrices when new implementation obligations are introduced.
- Ensure each WP includes expected touched files and an interconnection plan (primitives/tools/features/technologies).
- Create a governance checkpoint commit before implementation work to prevent loss on session failures (default behavior when using `.gov/repo_scripts/new_work_packet.ps1`).

## 5) Safety and Non-Goal Guardrails

The agent must not implement capabilities prohibited by the spec, including:

- individual targeting or stalking-oriented workflows
- sensitive "alert when asset X near Y" operational pursuit patterns
- covert affiliation inference features
- leaked/hacked/scraped-against-terms data integrations
- social-media scraping pipelines
- financial trading or market-prediction functionality

## 6) Provenance, Markings, and Audit Defaults

- Preserve and propagate sensitivity markings through outputs.
- Preserve provenance metadata for data and derived artifacts.
- Prefer append-only audit/event semantics where required.
- Preserve deterministic replay and reproducibility expectations.

## 7) Offline and Deployment Profile Awareness

- Default to offline-first behavior where possible.
- Treat cloud/AI connectivity as optional and policy-gated.
- Avoid introducing hard dependencies on proprietary hosted services.

## 8) Startup Performance and macOS Portability

- Treat startup speed and analyst state-change responsiveness as contractual quality requirements.
- Prefer implementation patterns that support spec startup/feedback budgets.
- Keep runtime path/process behavior platform-neutral to preserve future macOS delivery.
- Avoid introducing Windows-only runtime assumptions in core product paths.

## 9) Escalation and Clarification

If a requested change is ambiguous, high-risk, or conflicts with governance constraints, ask for clarification before implementation.

## 10) Done Standard and Status Integrity

- `E2E-VERIFIED` is the only done state.
- `IMPLEMENTED` is not done.
- The agent must not promote a WP/REQ to `E2E-VERIFIED` without linked runtime evidence and explicit user sign-off recorded in the WP and linked test-suite file.
