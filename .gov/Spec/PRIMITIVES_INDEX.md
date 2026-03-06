# StratAtlas - Primitives Index

**Spec Version:** v1.2.3  
**Last Updated:** 2026-03-06  
**Purpose:** Canonical registry of reusable product primitives used across work packets.

---

## Status Model

- `SPEC-MAPPED`: Primitive contract exists in governance artifacts.
- `IMPLEMENTED`: Primitive has code-level implementation and automated checks.
- `E2E-VERIFIED`: Primitive is proven in end-to-end runtime workflows with evidence.

---

## Format

```
PRIM-ID | Name | Type | Contract | Spec Anchor | REQs | First Iter | Status | Owner
```

---

## Primitive Registry

| Primitive ID | Name | Type | Contract | Spec Anchor | REQs | First Iter | Status | Owner |
|--------------|------|------|----------|-------------|------|------------|--------|-------|
| PRIM-0001 | Bundle Manifest Contract | data | Immutable bundle manifest with hash-addressed assets | Section 9.2 | REQ-0101..REQ-0105 | I0 | IMPLEMENTED | Codex |
| PRIM-0002 | Audit Event Hash Chain | security | Append-only hash-chained audit events | Section 8.1 | REQ-0010, REQ-0106, REQ-0107 | I0 | IMPLEMENTED | Codex |
| PRIM-0003 | Sensitivity Marking Model | policy | Sensitivity propagation across artifacts | Section 7.2 | REQ-0008, REQ-0011 | I0 | IMPLEMENTED | Codex |
| PRIM-0004 | Provenance Reference Model | data | Source/license/time/lineage references | Section 7.3 | REQ-0009 | I0 | IMPLEMENTED | Codex |
| PRIM-0005 | Stable UI Region Contract | ui | Mandatory shell regions and selectors | Section 11.1 | REQ-0200 | I1 | IMPLEMENTED | Codex |
| PRIM-0006 | UI Mode Contract | ui | Required workstation mode definitions | Section 11.2 | REQ-0201 | I1 | IMPLEMENTED | Codex |
| PRIM-0007 | Layer Declaration Contract | data | Layer metadata schema and export guards | Section 12.1 | REQ-0202, REQ-0203 | I1 | IMPLEMENTED | Codex |
| PRIM-0008 | Plugin Sandbox Policy | security | Plugin execution and egress policy checks | Section 12.2 | REQ-0204, REQ-0205 | I1 | IMPLEMENTED | Codex |
| PRIM-0009 | Performance Budget Contract | performance | Startup/state-change/interaction budget values | Section 11.5 | REQ-0014..REQ-0016, REQ-0206..REQ-0211 | I1 | IMPLEMENTED | Codex |
| PRIM-0010 | Baseline-Delta Cell Grid | analytics | Deterministic baseline/event delta outputs | Section 13.1 | REQ-0300, REQ-0301 | I2 | IMPLEMENTED | Codex |
| PRIM-0011 | Briefing Bundle Artifact | export | Briefing bundle payload and summary contract | Section 11.3 | REQ-0302 | I2 | IMPLEMENTED | Codex |
| PRIM-0012 | Collaboration Session Event | collaboration | Actor-attributed merge-safe session events | Section 10.2 | REQ-0400..REQ-0403 | I3 | IMPLEMENTED | Codex |
| PRIM-0013 | Scenario Fork Contract | modeling | Parent-linked scenario constraints/entities | Section 14 | REQ-0500..REQ-0504 | I4 | IMPLEMENTED | Codex |
| PRIM-0014 | Versioned Query Contract | analytics | Query conditions, execution, and versioning | Section 13.2 | REQ-0600..REQ-0604 | I5 | IMPLEMENTED | Codex |
| PRIM-0015 | AI Gateway Request Contract | ai | Hash-addressed policy-gated AI requests | Section 15.1..15.3 | REQ-0700..REQ-0708 | I6 | IMPLEMENTED | Codex |
| PRIM-0016 | Context Domain Registration | context | Domain registration metadata contract | Section 7.4.2 | REQ-0800..REQ-0810 | I7 | IMPLEMENTED | Codex |
| PRIM-0017 | Context Deviation Event | analytics | Standardized context deviation event model | Section 13.5 | REQ-0900..REQ-0904 | I8 | IMPLEMENTED | Codex |
| PRIM-0018 | Curated OSINT Event Contract | context | Curated-source and verification-level enforcement | Section 7.4.4, 7.4.6 | REQ-1000..REQ-1003 | I9 | IMPLEMENTED | Codex |
| PRIM-0019 | Strategic Game Model Contract | modeling | Strategic actor/action/payoff contract | Section 20.2..20.10 | REQ-1100..REQ-1113 | I10 | IMPLEMENTED | Codex |


| PRIM-0020 | WP Spec Extraction Artifact | governance | Per-WP extracted requirement + primitive snapshot | Section 17 governance loop | REQ-0019, REQ-0022 | All | IMPLEMENTED | Codex |
| PRIM-0021 | WP Check Script Contract | governance | Per-WP script delegating to standardized check runner | Section 17 governance loop | REQ-0019, REQ-0020 | All | IMPLEMENTED | Codex |
| PRIM-0022 | WP Proof Artifact Ledger | governance | Standard artifact path + command evidence references | Section 17 governance loop | REQ-0020 | All | IMPLEMENTED | Codex |
| PRIM-0023 | Template Compliance Gate | governance | No-shortcut enforcement for required WP/suite structure | Section 18 governance enforcement | REQ-0021 | All | IMPLEMENTED | Codex |

| PRIM-0024 | Installer Bundle Policy | deployment | Bundle configuration enforces MSI and NSIS targets, upgrade code, and downgrade-capable lifecycle constraints | Section 5.2, Section 18 Gate H | REQ-0023, REQ-0024, REQ-0028, REQ-0031 | All | IMPLEMENTED | Codex |
| PRIM-0025 | Maintenance Action Router | operations | Single maintenance command surface for uninstall/repair/full-repair/update/downgrade actions | Section 5.2 | REQ-0023, REQ-0024, REQ-0025, REQ-0026, REQ-0027, REQ-0028 | All | IMPLEMENTED | Codex |
| PRIM-0026 | User Data Backup-Restore Guard | data | Full-repair workflow backs up and restores user presets/data by default with explicit data-drop option | Section 5.2 | REQ-0025, REQ-0026 | All | IMPLEMENTED | Codex |
| PRIM-0027 | Version Direction Guard | policy | Update requires newer package and downgrade requires explicit older package with auditable invocation | Section 5.2 | REQ-0027, REQ-0028 | All | IMPLEMENTED | Codex |
| PRIM-0028 | Installer Kit Manifest Pipeline | build | Build script stages installers + lifecycle docs and generates checksum manifest for repeatable release kits | Section 5.2, Section 18 Gate H | REQ-0023, REQ-0029, REQ-0030, REQ-0031 | All | IMPLEMENTED | Codex |
| PRIM-0029 | Delivery Reality Audit | governance | Compare implementation evidence against governance claims and force status correction before further delivery | Section 17, Section 19 | REQ-0013, REQ-0020, REQ-0021, REQ-0022 | All | IMPLEMENTED | Codex |
| PRIM-0030 | Multi-Packet Iteration Workflow | governance | Allow activation and follow-on recovery packets within one iteration while keeping a single active blocking packet | Section 17, Section 19 | REQ-0013, REQ-0019, REQ-0021 | All | IMPLEMENTED | Codex |
| PRIM-0031 | Recovery Queue Traceability | governance | Keep recovery packets synchronized across roadmap, task board, traceability, and project operating instructions | Section 17, Section 19 | REQ-0019, REQ-0020, REQ-0022 | All | IMPLEMENTED | Codex |
| PRIM-0032 | Recorder State Store | data | Persist workspace, query, layer, and context state through the backend instead of only in React component memory | Section 8.1, Section 9.2 | REQ-0008, REQ-0009, REQ-0010, REQ-0101..REQ-0112, REQ-0808 | I0 | IMPLEMENTED | Codex |
| PRIM-0033 | Bundle Asset Snapshot Registry | data | Capture multiple typed bundle assets with stable `asset_id` and `sha256` references | Section 9.2, Section 15.3 | REQ-0008, REQ-0009, REQ-0010, REQ-0101..REQ-0112 | I0 | IMPLEMENTED | Codex |
| PRIM-0034 | Context Snapshot Artifact | context | Bundle capture of active context domains, correlation selections, and related query/config state | Section 7.4.3, Section 9.2 | REQ-0101..REQ-0112, REQ-0808 | I0 | IMPLEMENTED | Codex |
| PRIM-0035 | Workspace Region Surface | ui | Region-oriented shell backed by live persisted workspace data instead of placeholder text | Section 11.1, Section 11.2 | REQ-0200, REQ-0201, REQ-0202 | I1 | SPEC-MAPPED | Codex |
| PRIM-0036 | Artifact Label Contract | policy | Visible Evidence/Context/Model/AI labels with uncertainty text preserved in the workbench surface | Section 11.4 | REQ-0011, REQ-0012, REQ-0804, REQ-0805 | I1 | SPEC-MAPPED | Codex |
| PRIM-0037 | Layer Catalog and Budget Telemetry | performance | Layer metadata presentation and explicit degraded/progress feedback for state changes and budgets | Section 11.5, Section 12.1 | REQ-0014..REQ-0016, REQ-0202..REQ-0212 | I1 | SPEC-MAPPED | Codex |
