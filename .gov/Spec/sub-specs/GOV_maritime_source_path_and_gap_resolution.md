# GOV Maritime Source Path and Gap Resolution

Date: 2026-03-11
Status: IMPLEMENTED
Iteration: All
Parent Spec: .gov/Spec/stratatlas_spec_v1_2.md
Linked Work Packet(s): WP-GOV-MAPDATA-002
Linked Requirements: REQ-0013, REQ-0019, REQ-0020, REQ-0021, REQ-0022, REQ-0200, REQ-0201
Linked Primitives: PRIM-0045, PRIM-0071

## 1) Intent

Resolve the maritime layer truth gap before implementation: which source path is acceptable, what latency and coverage labels are required, and what remains blocked without licensing or curation.

## 2) Questions To Resolve

- Which maritime source path is acceptable first:
  - licensed AIS provider
  - delayed open/public service
  - regional open path plus explicit coverage limit
- What vessel classes and update cadences can be claimed truthfully?
- What military/naval awareness can be surfaced only as curated static knowledge rather than live movement?
- What export and offline-caching constraints apply?

## 3) Required Outputs

- A governed source decision matrix
- A UI/source-state labeling contract
- An implementation decision for `WP-I1-012`
- A gap ledger for unresolved licensing, coverage, and military-awareness limits

## 4) Source Decision Matrix

| Path | Coverage and Latency Reality | Operational / Licensing Constraint | StratAtlas Decision |
|------|------------------------------|------------------------------------|---------------------|
| Marine Cadastre / NOAA AIS archives | Regional U.S. coastal coverage, delayed/archive oriented, not a global live vessel feed | Public archive orientation, quarterly archive cadence, public datasets exclude law-enforcement, military, and other federal vessels | Accepted for phase-1 delayed/regional maritime replay, cached benchmarks, and truthful packaged fallback |
| AISStream real-time AIS WebSocket | Near-real-time community AIS where available | Requires secret API key; browser-direct use is disallowed; coverage depends on contributing network and provider terms | Accepted only as an optional Tauri/backend-only operator-supplied enhancement, not as the repo's default publishable path |
| AISHub contributor API | Community AIS with variable regional/global coverage | API access depends on contributing AIS station data; not a turnkey default public feed | Rejected as the default app source path |
| Licensed commercial vessel providers | Best candidate for broad/global low-latency commercial shipping awareness | Commercial contract, redistribution limits, and operator/legal review required | Required for any future default publishable global low-latency maritime movement claim |
| Curated static maritime awareness | Known ports, naval bases, and curated historical/contextual maritime references | Does not provide live movement | Accepted for static maritime context and anti-overclaim boundaries, but not as live vessel movement |

## 5) Governed Phase-1 Maritime Path

`WP-I1-012` is unblocked only for a constrained first implementation path:

- delayed or cached maritime movement built from governed regional/public datasets
- packaged maritime benchmark snapshots for truthful offline/browser fallback
- optional backend-only user-key real-time community feed path in Tauri, with explicit coverage-variable labeling
- static port context continues to come from `WP-I1-009`

`WP-I1-012` is not allowed to ship as a default global live maritime tracker without a separately governed licensed provider path.

## 6) Truth-Label Contract

The maritime family must use explicit source-state and evidence-state labels:

- `Delayed / Regional` for public archive-derived or regional public-source vessel snapshots
- `Cached Benchmark` for packaged offline/reference maritime datasets
- `Community Feed (User Key)` for optional backend-only operator-supplied AIS feeds with variable coverage
- `Licensed Global Live` only when a governed commercial provider path is approved and implemented
- `Curated Static` for known installations and other non-movement maritime context

The UI must also expose:

- coverage boundary
- latency/cadence note
- provider class
- truth note for military/naval limitations

## 7) Military and Naval Boundary

- StratAtlas must not claim live global naval or military vessel visibility.
- Maritime public AIS sources can contain silent periods, intentional shutdowns, regional blind spots, and explicit federal-vessel exclusions.
- Military and naval context should remain static or curated unless a source explicitly supports a narrower, truthful historical/contextual claim.
- `WP-I1-012` must keep anti-tracker and anti-overclaim wording consistent with `.gov/Spec/sub-specs/GOV_map_family_intent_guardrails.md`.

## 8) Export and Offline Constraints

- Exported and bundled maritime evidence may include only datasets and snapshots permitted by the governing source contract.
- Packaged fallback content must remain clearly labeled as cached or benchmark data.
- Licensed raw-feed redistribution must remain disabled unless the provider contract explicitly permits it.
- Bundle reopen must preserve the maritime source-state label and coverage note that were active when the snapshot was captured.

## 9) Unblock Rules for `WP-I1-012`

`WP-I1-012` may now move from `BLOCKED` to `SPEC-MAPPED`, but only under these constraints:

1. The first implementation scope must be delayed/regional/cached maritime, optionally with backend-only user-key live enhancement.
2. The packet must not claim complete global coverage or live naval movement.
3. The linked sub-spec must answer the full map-family guardrail checklist before implementation starts.
4. The packet proof must show source-state labels, coverage notes, degraded behavior, and bundle/export/reopen handling.
5. Any future default global live maritime claim requires a new governed licensed-provider decision update.

## 10) Remaining Gap Ledger

| Gap | Why It Remains Open | Owner |
|-----|----------------------|-------|
| Default global low-latency commercial maritime feed | Requires commercial licensing and redistribution review | Future governed follow-on before broader `WP-I1-012` scope expansion |
| Live naval / military vessel movement | Unsupported by truthful public-source contract and conflicts with anti-overclaim boundary | Remains out of scope |
| Truly global public open live maritime equivalent to the air-traffic path | Not identified in this packet's official-source review | `WP-I1-012` constrained scope plus future licensing governance |

## 11) Official Source Anchors

- Marine Cadastre AIS FAQ and archive pages: https://marinecadastre.gov/ais/
- AISHub official API access terms: https://www.aishub.net/
- AISStream official documentation: https://aisstream.io/
- VesselFinder official API/pricing pages: https://www.vesselfinder.com/api
- Kpler official maritime visibility/product pages: https://www.kpler.com/
- U.S. Coast Guard AIS FAQ: https://www.navcen.uscg.gov/ais-faqs
