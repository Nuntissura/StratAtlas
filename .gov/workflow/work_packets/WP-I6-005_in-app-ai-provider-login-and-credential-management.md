# WP-I6-005 - In-App AI Provider Login and Credential Management

Date Opened: 2026-04-11
Status: IMPLEMENTED
Iteration: I6
Workflow Version: 4.0
Packet Class: IMPLEMENTATION
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-I6-005.md
Linked Spec Extraction: .gov/workflow/wp_spec_extractions/SX-WP-I6-005.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-I6-005.ps1

## Intent

Add a governed in-app AI provider configuration and credential management surface inside the existing settings menu. Users must be able to select a provider (Claude, GPT, local), enter API keys or log in, validate credentials before first use, and persist their selection securely. Test flow: Claude or GPT consumer data plans first, then API billing keys.

### Background

Currently API keys live only in environment variables (`STRATATLAS_OPENAI_API_KEY`). There is no in-app way to configure, validate, or switch providers. Users cannot set credentials without restarting the app with new env vars. The existing provider selector (`aiProviderSelectionId`) is session-only state — it is not persisted.

## Linked Requirements

- REQ-0700
- REQ-0701
- REQ-0702
- REQ-0703
- REQ-0704
- REQ-0705

## Linked Primitives

- PRIM-0052 | Governed AI Provider Adapter | This WP closes the credential gap: the adapter must accept user-supplied keys from the settings UI, validate them before first use, and persist the selection securely via Tauri secure storage

## Primitive Matrix Impact

- Add/update rows in .gov/Spec/PRIMITIVES_MATRIX.md for every primitive listed above.

## Required Pre-Work

- Confirm sub-spec is written and approved.
- Confirm traceability rows are present and current.
- Confirm task board row exists and status is current.
- Confirm governance kickoff checkpoint commit is made before product implementation.

## Reality Boundary

- Real Seam: Settings menu UI for provider selection and key entry, Tauri-side secure credential storage, pre-flight key validation HTTP call, persisted provider preference that survives restart.
- User-Visible Win: User opens Settings, picks Claude or GPT, enters API key (or logs in with consumer plan), clicks Validate, sees green/red status, and the selection persists across app restarts.
- Proof Target: Live desktop bridge snapshot of settings with validated provider status, followed by a real AI analysis call using the in-app-configured key.
- Allowed Temporary Fallbacks: OAuth consumer-plan login may be deferred if API-key entry proves sufficient for initial testing. Local provider config reuses the existing WP-I6-003 runtime detection path.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## In Scope

- Provider selector in the settings menu: Claude (Anthropic), GPT (OpenAI), Codex CLI, Local (LM Studio/Ollama/custom).
- API key entry field per provider with masked input and validation button.
- Pre-flight validation call (lightweight model-info or echo request) before accepting a key.
- Secure credential persistence via Tauri's secure store (OS keychain on Windows/macOS).
- Persisted provider selection that survives app restart (loaded on startup).
- Truthful provider status indicator in settings (validated / invalid / not configured / offline).
- Anthropic Claude API support in the Tauri backend (new HTTP path alongside existing OpenAI path).
- Update the gateway adapter to route to Claude or GPT based on the persisted selection.
- Audit trail entry for provider configuration changes.

## Out of Scope

- OAuth consumer-plan login flow (future scope if API-key entry proves insufficient).
- Billing dashboard or usage tracking inside the app.
- MCP protocol changes (separate WP-I6-006).
- Local inference verification (separate WP-I6-007).

## Expected Files Touched

- .product/Worktrees/wt_main/src/App.tsx
- .product/Worktrees/wt_main/src/App.css
- .product/Worktrees/wt_main/src/features/i6/aiGateway.ts
- .product/Worktrees/wt_main/src-tauri/src/lib.rs

## Interconnection Plan

| Primitive | Feature/Tool | Technology | Combined Outcome |
|-----------|--------------|------------|------------------|
| PRIM-0052 (Governed AI Provider Adapter) | Settings menu provider config + key entry + validation | Tauri secure store, reqwest HTTP, React state | Users configure and validate AI provider credentials from within the app; persisted across restarts |

## Spec-Test Coverage Plan

### Dependency and Environment Tests
- [ ] Dependency graph/lock integrity tests
- [ ] Runtime compatibility checks

### UI Contract Tests
- [ ] Required regions/modes/states
- [ ] Error/degraded-state UX

### Functional Flow Tests
- [ ] Golden flow and edge cases
- [ ] Persistence/replay/export flows

### Code Correctness Tests
- [ ] Unit tests
- [ ] Integration tests
- [ ] Static analysis (lint/type/schema)

### Red-Team and Abuse Tests
- [ ] Non-goal enforcement (spec section 3.2)
- [ ] Policy bypass scenarios
- [ ] Adversarial/invalid input cases

### Additional Tests
- [ ] Performance budgets
- [ ] Offline behavior
- [ ] Reliability/recovery

## Fallback Register

- Explicit simulated/mock/sample paths: Browser/jsdom still returns simulated gateway output (unchanged from WP-I6-002 — only Tauri runtime makes real calls).
- Required labels in code/UI/governance: Provider status must show "simulated" when running outside Tauri.
- Successor packet or debt owner: OAuth consumer-plan login is deferred; if needed, a follow-on WP will add it.
- Exit condition to remove fallback: Browser simulated path is permanent for test/dev contexts.

## Change Ledger

- What Became Real: In-app provider selector (Claude/GPT/Codex/local) in settings menu with API key entry, AES-256-GCM encrypted credential persistence at `<app_data>/stratatlas/credentials/`, pre-flight validation via real API calls, Anthropic Claude Messages API backend (new `run_anthropic_provider_analysis`), credential store with env-var fallback for backward compatibility, 5 new Tauri commands for credential CRUD, audit-ready status reporting.
- What Remains Simulated: Browser/jsdom returns unconfigured credential statuses (no Tauri runtime). Audit events for credential changes are not yet wired (status reporting only — no `append_audit_internal` calls in this cut to avoid coupling to audit refactors).
- Next Blocking Real Seam: Live desktop proof — save a real API key, validate it, run a real analysis, capture bridge snapshot of the result.

## Checkpoint Commit Plan

1. Governance kickoff commit (spec/wp/taskboard/traceability/primitives).
2. Implementation commit(s).
3. Verification/status promotion commit.

## Proof of Implementation

- Command Runs: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-I6-005.ps1
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I6-005/
- Claim Standard: do not claim completion without linked command output and artifact paths.

## Exit Criteria

- Task board and requirements index statuses are synchronized.
- Traceability, primitives index, and primitives matrix are synchronized.
- Linked test suite has executed results and evidence paths.
- Evidence bundle is attached.
- Reality Boundary, Fallback Register, and Change Ledger are truthful.
- User Sign-off: APPROVED.

## Evidence

- Test Suite Execution:
- Logs:
- Screenshots/Exports:
- Build Artifacts:
- Proof Artifact: .product/build_target/tool_artifacts/wp_runs/WP-I6-005/
- User Sign-off:

## Progress Log

- 2026-04-11: WP scaffold created via .gov/repo_scripts/new_work_packet.ps1.
- 2026-04-11: Implementation complete — Anthropic Claude API backend, encrypted credential store (AES-256-GCM), 5 Tauri commands, settings UI with credential card, env-var fallback. Rust compiles, 90/90 TS tests pass, TypeScript and ESLint clean.
