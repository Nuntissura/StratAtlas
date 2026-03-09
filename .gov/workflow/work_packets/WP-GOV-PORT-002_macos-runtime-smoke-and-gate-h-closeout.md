# WP-GOV-PORT-002 - macOS Runtime Smoke and Gate H Closeout

Date Opened: 2026-03-08
Status: E2E-VERIFIED
Iteration: All
Workflow Version: 4.0
Packet Class: VERIFICATION
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-GOV-PORT-002.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-GOV-PORT-002.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-GOV-PORT-002.ps1

## Intent

Close the last portability debt by executing governed desktop smoke on macOS, proving runtime-critical paths remain portable, and promoting `REQ-0018` / `GATE-H` with artifact-backed evidence.

## Linked Requirements

- GATE-H
- REQ-0018

## Linked Primitives

- PRIM-0060 | Runtime Smoke Harness | Reuses the governed desktop smoke harness for a real macOS execution path instead of Windows-only evidence.
- PRIM-0061 | Verification Evidence Matrix | Binds Gate H promotion to platform-specific artifact paths, commands, and ledger synchronization.
- PRIM-0069 | Portability Smoke Matrix | Adds the missing macOS runner/artifact contract so portability claims are backed by reproducible proof.

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## Reality Boundary

- Real Seam: The governed desktop smoke harness must run on macOS and produce the same class of cold/warm runtime artifacts used on Windows, while runtime-critical paths remain free of Windows-only assumptions.
- User-Visible Win: Operators can trust that the desktop runtime still launches and executes core smoke flows on macOS rather than only on Windows development machines.
- Proof Target: `check-WP-GOV-PORT-002.ps1` plus macOS cold/warm runtime smoke artifacts, portability ledger updates, and Gate H evidence under `.product/build_target/tool_artifacts/wp_runs/WP-GOV-PORT-002/`.
- Allowed Temporary Fallbacks: None for portability proof. Windows-only smoke may still be used for day-to-day development, but `REQ-0018` / `GATE-H` now point to the hosted macOS artifact bundle instead of any Windows-only evidence.
- Promotion Guard: Do not promote `REQ-0018` or `GATE-H` without a real macOS runtime smoke artifact set and synchronized governance evidence.

## In Scope

- Add the missing macOS smoke execution path, artifact capture expectations, and packet-specific verification contract.
- Audit runtime-critical paths for portability regressions that would invalidate macOS smoke or Gate H claims.
- Synchronize requirement, gate, taskboard, roadmap, and traceability ledgers once real macOS proof exists.

## Out of Scope

- New Windows installer functionality already closed by the installer packets.
- Remaining Gate E performance/export/accessibility closure, which belongs to `WP-I1-004`.

## Expected Files Touched

- .gov/Spec/stratatlas_spec_v1_2.md
- .gov/Spec/REQUIREMENTS_INDEX.md
- .gov/Spec/TRACEABILITY_MATRIX.md
- .gov/Spec/PRIMITIVES_INDEX.md
- .gov/Spec/PRIMITIVES_MATRIX.md
- .gov/workflow/taskboard/TASK_BOARD.md
- .gov/workflow/work_packets/WP-GOV-PORT-002_macos-runtime-smoke-and-gate-h-closeout.md
- .gov/workflow/wp_test_suites/TS-WP-GOV-PORT-002.md
- .gov/workflow/wp_spec_extractions/SX-WP-GOV-PORT-002.md
- .gov/workflow/wp_checks/check-WP-GOV-PORT-002.ps1
- .gov/repo_scripts/run_wp_checks.ps1
- .gov/repo_scripts/run_wp_gov_port_002.ps1
- .github/workflows/wp-gov-port-002-macos-smoke.yml
- .product/Worktrees/wt_main/scripts/runtime-smoke.mjs
- .product/Worktrees/wt_main/src/lib/runtimeSmoke.ts
- .product/Worktrees/wt_main/src-tauri/src/lib.rs

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0060 | governed runtime smoke harness | Node, Tauri, Rust proof export | Existing smoke coverage becomes portable across operating systems.
| PRIM-0061 | evidence ledger synchronization | Markdown ledgers, PowerShell checks | Gate H promotion stays bound to concrete macOS artifact paths.
| PRIM-0069 | macOS portability smoke matrix | packet check, runtime launcher, artifact layout | Portability proof becomes repeatable instead of ad hoc.

## Spec-Test Coverage Plan

### Dependency and Environment Tests
- [ ] macOS-capable runtime/toolchain path is defined and packet prerequisites pass.
- [ ] Runtime-critical paths are checked for Windows-only assumptions before smoke promotion.

### UI Contract Tests
- [ ] Cold/warm smoke reaches the interactive shell on macOS.
- [ ] Degraded/offline states remain labeled in the macOS runtime.

### Functional Flow Tests
- [ ] macOS smoke covers launch, map shell, bundle reopen, and policy-labeled runtime flows.
- [ ] Artifact capture includes platform/version/startup evidence sufficient for Gate H promotion.

### Code Correctness Tests
- [ ] Runtime-critical path audits and existing static checks remain green.
- [ ] Governance ledgers reflect the real portability state before promotion.

### Red-Team and Abuse Tests
- [ ] Portability changes do not bypass policy labels or alter non-goal enforcement.
- [ ] macOS smoke artifacts cannot be substituted with Windows-only evidence.

### Additional Tests
- [ ] Cold/warm startup evidence is captured on macOS.
- [ ] Offline/degraded smoke remains stable on the portability path.
- [ ] Reliability/recovery artifacts are preserved per packet proof.

## Fallback Register

- Explicit simulated/mock/sample paths: None. The packet now has artifact-backed cold/warm macOS smoke evidence recorded under `.product/build_target/tool_artifacts/wp_runs/WP-GOV-PORT-002/20260309_005735/`.
- Required labels in code/UI/governance: Portability claims now point to the hosted macOS proof bundle and may no longer rely on Windows-only smoke artifacts.
- Successor packet or debt owner: None authorized yet; this packet owns the remaining Gate H portability closure after `WP-I1-004`.
- Exit condition to remove fallback: A real macOS runtime smoke run is recorded under `.product/build_target/tool_artifacts/wp_runs/WP-GOV-PORT-002/` and linked across the ledgers.

## Change Ledger

- What Became Real: The governed desktop smoke harness now executes on GitHub-hosted macOS runners, captures cold/warm runtime artifacts, relays those artifacts back into the packet proof path, and closes `REQ-0018` / `GATE-H` with artifact-backed evidence from run `22834012147`.
- What Remains Simulated: None for this packet. Windows development machines still dispatch the portability proof remotely, but the proof itself is now real macOS runtime evidence.
- Next Blocking Real Seam: None. Gate H portability proof is closed; follow-on work can focus on new scope rather than remediation debt.

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-PORT-002.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-GOV-PORT-002/
- Claim Standard: do not claim completion without linked command output and artifact paths.

## Exit Criteria

- Task board and requirements index statuses are synchronized.
- Traceability, primitives index, and primitives matrix are synchronized.
- Linked test suite has executed results and evidence paths.
- Evidence bundle is attached.
- Reality Boundary, Fallback Register, and Change Ledger are truthful.
- User Sign-off: APPROVED.

## Evidence

- Test Suite Execution: `powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-PORT-002.ps1`
- Logs: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-PORT-002/20260309_005735/UI-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-PORT-002/20260309_005735/FUNC-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-PORT-002/20260309_005735/COR-001.log`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-PORT-002/20260309_005735/RED-001.log`
- Screenshots/Exports: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-PORT-002/20260309_005735/runtime_smoke/cold/runtime_smoke_summary.md`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-PORT-002/20260309_005735/runtime_smoke/warm/runtime_smoke_summary.md`
- Build Artifacts: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-PORT-002/20260309_005735/summary.md`; `.product/build_target/tool_artifacts/wp_runs/WP-GOV-PORT-002/20260309_005735/result.json`
- Proof Artifact: `.product/build_target/tool_artifacts/wp_runs/WP-GOV-PORT-002/20260309_005735/`
- User Sign-off: Approved via 2026-03-08 instruction to repair the requirements ledger, finish `WP-I1-004`, and then run `WP-GOV-PORT-002`.

## Progress Log

- 2026-03-08: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
- 2026-03-08: Successor packet established for the remaining macOS portability and Gate H proof after `WP-I1-004`.
- 2026-03-08: Packet activated for real execution. Current environment is Windows-only, so the packet will use a GitHub-hosted macOS runner plus downloaded proof artifacts instead of pretending a local Windows smoke run satisfies `REQ-0018`.
- 2026-03-09: Hosted macOS proof passed via GitHub Actions run `22834012147`; synced artifact bundle `.product/build_target/tool_artifacts/wp_runs/WP-GOV-PORT-002/20260309_005735/` now closes `REQ-0018` and `GATE-H`.
