# StratAtlas — Traceability Matrix

**Spec Version:** v1.1  
**Last Updated:** 2026-03-04  
**Governance:** See `SPEC_GOVERNANCE.md` for maintenance rules.

---

## Purpose

This matrix maps every requirement from `REQUIREMENTS_INDEX.md` to its implementing component(s), test(s), and iteration. It answers: "Where is this requirement built, and how do we know it works?"

**Maintenance rule:** This document is populated *when an iteration's sub-spec is written* (not before). Empty cells are expected for future iterations.

---

## Matrix Format

```
REQ-ID | Component(s) | Test(s) | Iteration | Verified
```

- **Component:** Source module or service that implements the requirement
- **Test:** Test file or suite that verifies the requirement
- **Verified:** Date the test passed against the implementation, or blank

---

## Cross-Cutting Requirements

| REQ | Component(s) | Test(s) | Iter | Verified |
|-----|-------------|---------|------|----------|
| REQ-0001 | control-plane/policy, client/*, gateway/* | tests/security/test_no_individual_targeting | All | |
| REQ-0002 | control-plane/policy, analytics/alerts | tests/security/test_no_entity_alerts | All | |
| REQ-0003 | control-plane/policy | tests/security/test_no_covert_inference | All | |
| REQ-0004 | control-plane/registry, context/adapters | tests/security/test_source_validation | All | |
| REQ-0005 | control-plane/policy | tests/security/test_no_provider_evasion | All | |
| REQ-0006 | context/adapters | tests/security/test_no_social_scraping | All | |
| REQ-0007 | control-plane/policy | tests/security/test_no_financial_trading | All | |
| REQ-0008 | control-plane/policy, recorder/bundles | tests/unit/test_sensitivity_propagation | All | |
| REQ-0009 | control-plane/provenance | tests/unit/test_provenance_completeness | All | |
| REQ-0010 | control-plane/audit | tests/unit/test_audit_append_only | All | |
| REQ-0011 | client/panels, client/charts | tests/unit/test_evidence_labeling | All | |
| REQ-0012 | client/panels, client/charts | tests/unit/test_modeled_output_uncertainty | All | |
| REQ-0013 | *(process gate, not code)* | tests/integration/test_slice_definition_of_done | All | |

---

## I0: Walking Skeleton

| REQ | Component(s) | Test(s) | Iter | Verified |
|-----|-------------|---------|------|----------|
| REQ-0100 | control-plane/rbac | tests/unit/test_rbac_roles | I0 | |
| REQ-0101 | recorder/bundles | tests/unit/test_bundle_contents | I0 | |
| REQ-0102 | recorder/bundles | tests/unit/test_bundle_asset_registry | I0 | |
| REQ-0103 | recorder/bundles, gateway/mcp | tests/unit/test_bundle_addressing | I0 | |
| REQ-0104 | recorder/bundles | tests/unit/test_bundle_immutability | I0 | |
| REQ-0105 | recorder/replay, client/map | tests/determinism/test_bundle_replay | I0 | |
| REQ-0106 | control-plane/audit | tests/unit/test_audit_immutable | I0 | |
| REQ-0107 | control-plane/audit | tests/unit/test_audit_hash_chain | I0 | |
| REQ-0108 | client/tauri, recorder/bundles | tests/integration/test_offline_mode | I0 | |
| REQ-0109 | control-plane/* | tests/integration/test_postgres_setup | I0 | |
| REQ-0110 | recorder/bundles | tests/unit/test_artifact_store | I0 | |
| REQ-0111 | control-plane/policy | tests/unit/test_deployment_profiles | I0 | |
| REQ-0112 | recorder/replay, client/* | tests/performance/test_bundle_open_time | I0 | |

---

## I1: Layer System + Time/Replay

| REQ | Component(s) | Test(s) | Iter | Verified |
|-----|-------------|---------|------|----------|
| REQ-0200 | client/panels | tests/unit/test_ui_regions | I1 | |
| REQ-0201 | client/* | tests/unit/test_ui_modes | I1 | |
| REQ-0202 | control-plane/registry | tests/unit/test_layer_declaration | I1 | |
| REQ-0203 | control-plane/policy | tests/unit/test_license_export_block | I1 | |
| REQ-0204 | plugins/sandbox | tests/security/test_plugin_sandbox | I1 | |
| REQ-0205 | plugins/sandbox | tests/security/test_plugin_egress_control | I1 | |
| REQ-0206 | client/map | tests/performance/test_pan_zoom_latency | I1 | |
| REQ-0207 | client/timeline, analytics/* | tests/performance/test_time_scrub_warm | I1 | |
| REQ-0208 | client/timeline, analytics/* | tests/performance/test_time_scrub_cold | I1 | |
| REQ-0209 | client/briefing | tests/performance/test_image_export | I1 | |
| REQ-0210 | recorder/bundles, client/briefing | tests/performance/test_briefing_export | I1 | |
| REQ-0211 | client/map, analytics/aggregation | tests/unit/test_graceful_degradation | I1 | |
| REQ-0212 | client/* | tests/accessibility/test_wcag_compliance | I1 | |

---

## I2–I10: Populated During Sub-Spec Phase

*Rows for I2–I10 will be added when each iteration's sub-spec is written and approved. See `SPEC_GOVERNANCE.md` §4 for the process.*

---

## Gate Verification

| Gate | Verification Method | Requirements Covered | Last Verified |
|------|-------------------|---------------------|---------------|
| Gate A — Misuse Constraints | Automated security test suite + manual review | REQ-0001 through REQ-0007 | |
| Gate B — Provenance & Reproducibility | Deterministic replay test suite | REQ-0101, REQ-0104, REQ-0105, REQ-0009 | |
| Gate C — Security & Governance | RBAC + audit + marking integration tests | REQ-0008, REQ-0010, REQ-0100, REQ-0106 | |
| Gate D — Offline Operability | Air-gapped environment test (no network) | REQ-0108 | |
| Gate E — Performance | Performance budget test suite on reference hardware | REQ-0112, REQ-0206–REQ-0211 | |
| Gate F — Context Integrity | Context domain integration tests | REQ-0800–REQ-0810 | |

---

## Component → Requirements Reverse Index

For quick lookup: "What requirements does this component implement?"

| Component | Requirements |
|-----------|-------------|
| control-plane/rbac | REQ-0100 |
| control-plane/audit | REQ-0010, REQ-0106, REQ-0107 |
| control-plane/policy | REQ-0001–REQ-0008, REQ-0111, REQ-0203 |
| control-plane/provenance | REQ-0009 |
| control-plane/registry | REQ-0202, REQ-0801 |
| recorder/bundles | REQ-0101–REQ-0104, REQ-0110, REQ-0808 |
| recorder/replay | REQ-0105, REQ-0112 |
| recorder/events | REQ-0903 |
| analytics/baselines | REQ-0300 |
| analytics/deltas | REQ-0300, REQ-0301 |
| analytics/queries | REQ-0600–REQ-0603 |
| analytics/anomaly | REQ-0900–REQ-0902 |
| analytics/aggregation | REQ-0211 |
| analytics/alerts | REQ-0002, REQ-1002, REQ-1003 |
| context/adapters | REQ-0004, REQ-0006, REQ-0801, REQ-1000 |
| context/correlation | REQ-0802, REQ-0803 |
| client/map | REQ-0200, REQ-0206, REQ-0211 |
| client/timeline | REQ-0207, REQ-0208 |
| client/panels | REQ-0011, REQ-0012, REQ-0200, REQ-0804, REQ-0805 |
| client/charts | REQ-0011, REQ-0012, REQ-0301 |
| client/briefing | REQ-0209, REQ-0210, REQ-0302 |
| client/scenarios | REQ-0500–REQ-0504, REQ-0904 |
| client/queries | REQ-0600–REQ-0604 |
| client/collab | REQ-0400–REQ-0403 |
| gateway/auth | REQ-0700 |
| gateway/mcp | REQ-0702–REQ-0708 |
| gateway/policy | REQ-0700, REQ-0701 |
| plugins/sandbox | REQ-0204, REQ-0205 |
| sync/crdt | REQ-0400, REQ-0402, REQ-0403 |
