# StratAtlas - Primitives Index

**Spec Version:** v1.2.1  
**Last Updated:** 2026-03-05  
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

