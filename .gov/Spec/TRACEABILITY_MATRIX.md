# StratAtlas — Traceability Matrix

**Spec Version:** v1.2.1  
**Last Updated:** 2026-03-05  
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
| REQ-0014 | client/tauri, client/startup | tests/performance/test_startup_cold | All | |
| REQ-0015 | client/tauri, client/startup | tests/performance/test_startup_warm | All | |
| REQ-0016 | client/map, client/panels, client/scenarios | tests/performance/test_state_change_feedback | All | |
| REQ-0017 | client/tauri, control-plane/config, gateway/mcp | tests/integration/test_platform_neutral_paths | All | |
| REQ-0018 | build/ci, product/worktree_policy | tests/integration/test_macos_smoke_build | All | |

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

## I2: Baseline/Delta Compare + Briefing Bundle

| REQ | Component(s) | Test(s) | Iter | Verified |
|-----|-------------|---------|------|----------|
| REQ-0300 | analytics/baselines, analytics/deltas | tests/integration/test_baseline_delta_density | I2 | |
| REQ-0301 | analytics/deltas, client/charts | tests/integration/test_comparative_dashboard_overlay | I2 | |
| REQ-0302 | client/briefing, recorder/bundles | tests/integration/test_baseline_delta_briefing_flow | I2 | |

---

## I3: Collaboration + CRDT + Session Replay

| REQ | Component(s) | Test(s) | Iter | Verified |
|-----|-------------|---------|------|----------|
| REQ-0400 | sync/crdt, client/collab | tests/integration/test_crdt_merge_semantics | I3 | |
| REQ-0401 | client/collab | tests/unit/test_ephemeral_view_lww | I3 | |
| REQ-0402 | sync/crdt, recorder/events | tests/integration/test_session_replay_attribution | I3 | |
| REQ-0403 | client/collab, sync/crdt | tests/integration/test_reconnect_conflict_resolution | I3 | |

---

## I4: Scenario Modeling + Constraint Propagation + Export

| REQ | Component(s) | Test(s) | Iter | Verified |
|-----|-------------|---------|------|----------|
| REQ-0500 | client/scenarios, recorder/bundles | tests/integration/test_scenario_fork_linkage | I4 | |
| REQ-0501 | client/scenarios | tests/integration/test_scenario_constraint_manipulation | I4 | |
| REQ-0502 | client/scenarios | tests/integration/test_hypothetical_entities | I4 | |
| REQ-0503 | client/scenarios, client/briefing | tests/integration/test_scenario_compare_export | I4 | |
| REQ-0504 | client/scenarios, client/briefing | tests/integration/test_scenario_golden_flow | I4 | |

---

## I5: Query Builder + Saved/Versioned Queries

| REQ | Component(s) | Test(s) | Iter | Verified |
|-----|-------------|---------|------|----------|
| REQ-0600 | analytics/queries, client/queries | tests/integration/test_query_builder_compose | I5 | |
| REQ-0601 | analytics/queries, client/map | tests/integration/test_query_render_ephemeral_layers | I5 | |
| REQ-0602 | analytics/queries, control-plane/registry | tests/integration/test_query_versioning | I5 | |
| REQ-0603 | analytics/queries, context/correlation | tests/integration/test_context_aware_queries | I5 | |
| REQ-0604 | client/queries, analytics/queries | tests/integration/test_query_builder_golden_flow | I5 | |

---

## I6: AI Gateway + MCP Interface

| REQ | Component(s) | Test(s) | Iter | Verified |
|-----|-------------|---------|------|----------|
| REQ-0700 | gateway/auth, gateway/policy | tests/security/test_ai_gateway_policy_enforcement | I6 | |
| REQ-0701 | gateway/policy, client/panels | tests/security/test_ai_output_labeling_and_refs | I6 | |
| REQ-0702 | gateway/mcp | tests/security/test_mcp_policy_gate | I6 | |
| REQ-0703 | gateway/mcp | tests/security/test_mcp_hash_addressing_only | I6 | |
| REQ-0704 | gateway/mcp | tests/integration/test_mcp_minimum_tool_surface | I6 | |
| REQ-0705 | gateway/mcp, control-plane/audit | tests/integration/test_mcp_invocation_audit | I6 | |
| REQ-0706 | gateway/mcp, gateway/auth | tests/security/test_mcp_policy_parity | I6 | |
| REQ-0707 | gateway/mcp | tests/security/test_mcp_no_raw_path_db_exposure | I6 | |
| REQ-0708 | gateway/mcp, control-plane/policy | tests/integration/test_mcp_profile_disable | I6 | |

---

## I7: Context Intake Framework + First Domains

| REQ | Component(s) | Test(s) | Iter | Verified |
|-----|-------------|---------|------|----------|
| REQ-0800 | client/panels | tests/integration/test_context_graceful_absence | I7 | |
| REQ-0801 | control-plane/registry, context/adapters | tests/integration/test_context_domain_registration_contract | I7 | |
| REQ-0802 | context/correlation, control-plane/registry | tests/integration/test_context_correlation_audit_links | I7 | |
| REQ-0803 | context/correlation, client/panels | tests/unit/test_context_correlation_labeling | I7 | |
| REQ-0804 | client/panels, client/map | tests/unit/test_non_spatial_context_not_rendered_as_points | I7 | |
| REQ-0805 | client/panels | tests/unit/test_context_source_cadence_confidence_display | I7 | |
| REQ-0806 | context/adapters, recorder/bundles | tests/integration/test_precacheable_context_offline | I7 | |
| REQ-0807 | context/adapters, client/panels | tests/integration/test_online_only_context_degrades_gracefully | I7 | |
| REQ-0808 | recorder/bundles, context/correlation | tests/integration/test_bundle_captures_context_values | I7 | |
| REQ-0809 | client/panels, recorder/bundles | tests/integration/test_context_correlation_golden_flow | I7 | |
| REQ-0810 | control-plane/registry, analytics/queries | tests/integration/test_context_store_time_range_queries | I7 | |

---

## I8: Context Deviation Detection + Infrastructure Propagation

| REQ | Component(s) | Test(s) | Iter | Verified |
|-----|-------------|---------|------|----------|
| REQ-0900 | analytics/anomaly | tests/integration/test_trade_flow_deviation_detection | I8 | |
| REQ-0901 | analytics/anomaly | tests/integration/test_infrastructure_deviation_detection | I8 | |
| REQ-0902 | analytics/anomaly | tests/integration/test_regulatory_change_detection | I8 | |
| REQ-0903 | recorder/events, analytics/anomaly | tests/integration/test_context_deviation_event_emission | I8 | |
| REQ-0904 | client/scenarios, context/correlation | tests/integration/test_constraint_node_in_scenario_workspace | I8 | |

---

## I9: OSINT + Economic Indicators + Context-Aware Queries

| REQ | Component(s) | Test(s) | Iter | Verified |
|-----|-------------|---------|------|----------|
| REQ-1000 | context/adapters, control-plane/registry | tests/security/test_osint_curated_sources_only | I9 | |
| REQ-1001 | context/adapters, client/panels | tests/integration/test_osint_verification_labeling | I9 | |
| REQ-1002 | analytics/alerts, control-plane/policy | tests/security/test_alerts_aggregate_only | I9 | |
| REQ-1003 | analytics/alerts, analytics/queries | tests/integration/test_alert_context_thresholds | I9 | |

---

## I10: Strategic Game Modeling

| REQ | Component(s) | Test(s) | Iter | Verified |
|-----|-------------|---------|------|----------|
| REQ-1100 | client/scenarios, control-plane/policy | tests/security/test_game_model_non_individual_scope | I10 | |
| REQ-1101 | analytics/game_models, recorder/bundles | tests/integration/test_game_model_artifact_contract | I10 | |
| REQ-1102 | analytics/game_models, control-plane/provenance | tests/integration/test_game_model_markings_provenance | I10 | |
| REQ-1103 | analytics/game_models | tests/integration/test_supported_game_types | I10 | |
| REQ-1104 | analytics/game_models, client/scenarios | tests/integration/test_scenario_tree_node_types | I10 | |
| REQ-1105 | analytics/game_models, client/scenarios | tests/integration/test_scenario_tree_export_replay_links | I10 | |
| REQ-1106 | analytics/game_models, client/charts | tests/integration/test_payoff_proxy_uncertainty_labels | I10 | |
| REQ-1107 | analytics/game_models, control-plane/audit | tests/integration/test_solver_run_audit_log | I10 | |
| REQ-1108 | analytics/game_models | tests/integration/test_parameter_sweep_and_monte_carlo | I10 | |
| REQ-1109 | analytics/game_models | tests/integration/test_value_of_information_estimation | I10 | |
| REQ-1110 | analytics/game_models, recorder/bundles | tests/integration/test_experiment_bundle_reproducibility | I10 | |
| REQ-1111 | control-plane/policy, analytics/game_models | tests/security/test_actor_granularity_guardrail | I10 | |
| REQ-1112 | control-plane/policy, analytics/game_models | tests/security/test_action_abstraction_guardrail | I10 | |
| REQ-1113 | client/panels, analytics/game_models | tests/security/test_modeled_output_non_operational_labeling | I10 | |

---

## Gate Verification

| Gate | Verification Method | Requirements Covered | Last Verified |
|------|-------------------|---------------------|---------------|
| Gate A — Misuse Constraints | Automated security test suite + manual review | REQ-0001 through REQ-0007 | |
| Gate B — Provenance & Reproducibility | Deterministic replay test suite | REQ-0101, REQ-0104, REQ-0105, REQ-0009 | |
| Gate C — Security & Governance | RBAC + audit + marking integration tests | REQ-0008, REQ-0010, REQ-0100, REQ-0106 | |
| Gate D — Offline Operability | Air-gapped environment test (no network) | REQ-0108 | |
| Gate E — Performance | Performance budget test suite on reference hardware | REQ-0014–REQ-0016, REQ-0112, REQ-0206–REQ-0211 | |
| Gate F — Context Integrity | Context domain integration tests | REQ-0800–REQ-0810 | |
| Gate G — AI Safety | AI gateway and copilot safety test suite | REQ-0700–REQ-0708, REQ-0011, REQ-0012 | |
| Gate H — Desktop Portability & Startup | Startup budget and cross-platform smoke test suite | REQ-0014–REQ-0018 | |

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
| control-plane/config | REQ-0017 |
| recorder/bundles | REQ-0101–REQ-0104, REQ-0110, REQ-0302, REQ-0500, REQ-0808, REQ-1110 |
| recorder/replay | REQ-0105, REQ-0112 |
| recorder/events | REQ-0903 |
| analytics/baselines | REQ-0300 |
| analytics/deltas | REQ-0300, REQ-0301 |
| analytics/queries | REQ-0600–REQ-0604, REQ-0810, REQ-1003 |
| analytics/anomaly | REQ-0900–REQ-0902 |
| analytics/aggregation | REQ-0211 |
| analytics/alerts | REQ-0002, REQ-1002, REQ-1003 |
| analytics/game_models | REQ-1101–REQ-1113 |
| context/adapters | REQ-0004, REQ-0006, REQ-0801, REQ-1000 |
| context/correlation | REQ-0802, REQ-0803 |
| client/map | REQ-0016, REQ-0200, REQ-0206, REQ-0211 |
| client/startup | REQ-0014, REQ-0015 |
| client/timeline | REQ-0207, REQ-0208 |
| client/panels | REQ-0011, REQ-0012, REQ-0016, REQ-0200, REQ-0701, REQ-0800, REQ-0803–REQ-0805, REQ-0809, REQ-1001, REQ-1113 |
| client/charts | REQ-0011, REQ-0012, REQ-0301, REQ-1106 |
| client/briefing | REQ-0209, REQ-0210, REQ-0302, REQ-0503, REQ-0504 |
| client/scenarios | REQ-0016, REQ-0500–REQ-0504, REQ-0904, REQ-1100, REQ-1104, REQ-1105 |
| client/queries | REQ-0600–REQ-0604 |
| client/collab | REQ-0400–REQ-0403 |
| gateway/auth | REQ-0700, REQ-0706 |
| gateway/mcp | REQ-0702–REQ-0708 |
| gateway/policy | REQ-0700, REQ-0701 |
| build/ci | REQ-0018 |
| product/worktree_policy | REQ-0018 |
| plugins/sandbox | REQ-0204, REQ-0205 |
| sync/crdt | REQ-0400, REQ-0402, REQ-0403 |
