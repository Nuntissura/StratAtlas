# TS-WP-GOV-DEPTH-001 - Spec vs Code Test Suite

Date Opened: 2026-03-08
Status: E2E-VERIFIED
Linked Work Packet: WP-GOV-DEPTH-001
Iteration: All

## Scope

Validate that the StratAtlas governance workflow now distinguishes research/scaffold breadth from implementation depth and that the automation surface preserves those distinctions.

## Inputs

- Linked requirements: REQ-0013, REQ-0019, REQ-0020, REQ-0021, REQ-0022
- Linked primitives: PRIM-0065, PRIM-0066
- Linked components: AGENTS.md, MODEL_BEHAVIOR.md, PROJECT_CODEX.md, .gov/workflow/GOVERNANCE_WORKFLOW.md, .gov/templates/WP_TEMPLATE.md, .gov/templates/WP_TEST_SUITE_TEMPLATE.md, .gov/templates/WP_SPEC_EXTRACT_TEMPLATE.md, .gov/repo_scripts/new_work_packet.ps1, .gov/repo_scripts/enforce_wp_template_compliance.ps1, .gov/repo_scripts/update_wp_spec_extract.ps1

## Reality Boundary Assertions

- Packet Class: IMPLEMENTATION
- Real Seam: Workflow Version 4.0 packets must preserve packet class, reality boundary, fallback tracking, and change-ledger context in both WP and spec-extract artifacts.
- Proof Target: `check-WP-GOV-DEPTH-001.ps1` plus governance preflight and template compliance must pass with artifact-backed proof.
- Allowed Fallbacks: None in final governance artifacts.
- Promotion Guard: Placeholder-heavy or scaffold-like governance artifacts must fail compliance and block closeout.

## Test Case Matrix

| Case ID | Requirement | Primitive | Category | Target | Command/Test | Expected |
|--------|-------------|-----------|----------|--------|--------------|----------|
| DEP-001 | REQ-0013 | PRIM-0065 | Dependency | governance workflow and script graph | `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1` | governance dependencies, packet links, and repo readiness remain valid after workflow hardening |
| UI-001 | REQ-0019 | PRIM-0065 | UI Contract | governance-facing packet shape | `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-DEPTH-001.ps1` | v4 packet metadata, reality boundary, fallback register, and change ledger are present and recoverable |
| FUNC-001 | REQ-0020 | PRIM-0065 | Functionality | WP creation and extraction flow | `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-DEPTH-001.ps1` | the generator, extraction script, and governance docs preserve proof targets and next blocking seam context |
| COR-001 | REQ-0021 | PRIM-0066 | Code Correctness | template compliance automation | `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/enforce_wp_template_compliance.ps1` | Workflow Version 4.0+ artifacts fail on unresolved placeholders, missing packet class, or missing depth fields |
| RED-001 | REQ-0020 | PRIM-0066 | Red Team / Abuse | scaffold masquerading as delivery | `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-DEPTH-001.ps1` | scaffold debt, placeholder artifacts, and unlabeled simulated paths are called out instead of being treated as finished delivery |
| EXT-001 | REQ-0022 | PRIM-0065 | Additional | session-recovery context | `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/update_wp_spec_extract.ps1 -WpId WP-GOV-DEPTH-001` | the spec extraction snapshots packet class, reality boundary, and change ledger for later recovery |

## Dependency and Environment Tests

- [x] Governance preflight passes
- [x] Linked workflow assets exist
- [x] Updated extraction generator runs successfully

## UI Contract Tests

- [x] Workflow Version 4.0 packet metadata is present
- [x] Reality boundary and fallback sections are recoverable
- [x] Change-ledger fields are present in packet and extraction artifacts

## Functional Flow Tests

- [x] WP generator emits the new v4 packet fields
- [x] Spec extraction snapshots packet class, reality boundary, and change ledger
- [x] Roadmap and taskboard preserve `WP-I7-002` as the next product blocker

## Code Correctness Tests

- [x] Template compliance enforces v4 packet rules
- [x] Placeholder-heavy v4 artifacts fail compliance
- [x] Root instruction files and governance workflow match the enforced automation

## Red-Team and Abuse Tests

- [x] Scaffold masquerading as delivery is called out explicitly
- [x] Unlabeled simulated runtime paths are prohibited by the v4 contract
- [x] Red-team static guardrail check still passes

## Additional Tests

- [x] Repo-wide spec extraction refresh succeeds
- [x] Workflow remains recoverable after session loss through packet and extract fields
- [x] Governance-only packet proof bundle is written deterministically

## Automation Hook

- Command: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-DEPTH-001.ps1
- Artifacts: .product/build_target/tool_artifacts/wp_runs/WP-GOV-DEPTH-001/

## Execution Summary

- Last Run Date: 2026-03-08
- Result: PASS
- Blocking Failures: none
- Evidence Paths: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-DEPTH-001/20260308_042222/`, `.product/build_target/tool_artifacts/wp_runs/WP-GOV-DEPTH-001/20260308_042222/DOC-ASSERT-001.log`, `.product/build_target/tool_artifacts/wp_runs/WP-GOV-DEPTH-001/20260308_042222/doc_assertions.json`
- What Became Real: The v4 workflow contract is now enforced across the root instructions, governance workflow, templates, WP generator, compliance script, and spec-extract generator.
- What Remains Simulated: No new workflow fallback remains in this packet; only legacy Workflow Version 3.0 packets stay historical.
- Next Blocking Real Seam: Resume product delivery at `WP-I7-002`.
- Reviewer: Codex
- User Sign-off: approved by the 2026-03-08 instruction to implement the workflow hardening changes
