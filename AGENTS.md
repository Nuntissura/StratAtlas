# Repo Agent Notes (StratAtlas)

## Scope

These rules apply to the full repository unless a deeper directory adds stricter instructions.

## 1) Hard Split: Governance vs Product

- `.gov/` is governance only (spec, requirements, traceability, workflow, templates, audits, scripts).
- `.product/` is product only (code worktrees, build outputs, packaging artifacts).
- Do not mix domains.

## 2) Canonical Governance Files

- `.gov/Spec/stratatlas_spec_v1_2.md`
- `.gov/Spec/REQUIREMENTS_INDEX.md`
- `.gov/Spec/TRACEABILITY_MATRIX.md`
- `.gov/Spec/PRIMITIVES_INDEX.md`
- `.gov/Spec/PRIMITIVES_MATRIX.md`
- `.gov/Spec/SPEC_GOVERNANCE.md`
- `.gov/Spec/TECH_STACK.md`
- `.gov/workflow/ROADMAP.md`
- `.gov/workflow/GOVERNANCE_WORKFLOW.md`
- `.gov/workflow/BUILD_READINESS_CHECKLIST.md`
- `.gov/workflow/taskboard/TASK_BOARD.md`
- `.gov/workflow/wp_test_suites/`
- `.gov/workflow/wp_spec_extractions/`
- `.gov/workflow/wp_checks/`
- `.gov/Spec/sub-specs/`

If these disagree with implementation, reconcile governance intent first.

## 3) Work Packet Discipline

- Work should map to `.gov/workflow/work_packets/WP-*.md`.
- Every WP MUST have a linked spec-vs-code suite in `.gov/workflow/wp_test_suites/TS-WP-*.md`.
- Every WP MUST have a linked spec extraction in `.gov/workflow/wp_spec_extractions/SX-WP-*.md`.
- Every WP MUST have a linked check script in `.gov/workflow/wp_checks/check-WP-*.ps1`.
- Status belongs on `.gov/workflow/taskboard/TASK_BOARD.md`.
- Scope changes require governance updates before product implementation.
- Iteration sequencing must follow `.gov/workflow/ROADMAP.md` unless governance explicitly changes it.
- A single iteration may use multiple sequenced WPs when roadmap/taskboard identify the active packet set and current blocking packet.
- Apply the checklist in `.gov/workflow/GOVERNANCE_WORKFLOW.md` on every relevant PR.
- Before implementation/build work, run `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1`.
- Enforce template contract before status promotion: `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/enforce_wp_template_compliance.ps1`.
- Prefer WP creation via `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/new_work_packet.ps1` (creates linked test suite and checkpoint commit by default; use `-SkipCheckpointCommit` only when explicitly needed).
- Backfill/update all legacy WP loop assets with `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/bootstrap_wp_loop_assets.ps1`.
- Generate/update per-WP spec extraction snapshots with `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/update_wp_spec_extract.ps1 -All`.
- Before product implementation, create a governance checkpoint commit (for crash/session-reset resilience).
- Only `E2E-VERIFIED` means done; `IMPLEMENTED` does not.
- `SUPERSEDED` may be used only when a packet is explicitly replaced by a named successor with retained proof; it is not done.
- Never claim completion without proof artifacts under `.product/build_target/tool_artifacts/wp_runs/<WP-ID>/` and linked command evidence.

## 3.1) Delivery Depth and Packet Classification

- Every Workflow Version `4.0+` WP MUST declare `Packet Class:` as one of `RESEARCH`, `SCAFFOLD`, `IMPLEMENTATION`, or `VERIFICATION`.
- `RESEARCH` packets may broaden options and capture cited references, but they MUST NOT promote linked requirements or imply runtime delivery.
- `SCAFFOLD` packets may wire shells, adapters, and labeled temporary sample/simulated paths, but they MUST NOT promote linked requirements or primitives to `E2E-VERIFIED`.
- `IMPLEMENTATION` packets MUST retire at least one real seam and record it in the WP `Reality Boundary` and `Change Ledger`.
- `VERIFICATION` packets may strengthen proof, smoke coverage, and evidence capture, but they MUST NOT disguise unfinished implementation as completed delivery.
- Every Workflow Version `4.0+` WP MUST include `Reality Boundary`, `Fallback Register`, and `Change Ledger` sections.
- Every Workflow Version `4.0+` WP MUST state `What Became Real`, `What Remains Simulated`, and `Next Blocking Real Seam`.
- Any seeded, sample, mock, templated, or simulated runtime path outside tests MUST be explicitly labeled in code and recorded in the active WP `Fallback Register`.
- Breadth exploration belongs in `RESEARCH` packets; requirement promotion belongs only to packets that close a real seam with proof.
- No active Workflow Version `4.0+` governance artifact may retain unresolved placeholder tokens or `TBD` markers.

## 4) Product Worktree and Build Target Policy

- Shippable product coding is done in `.product/Worktrees/wt_main`.
- `wt_main` is the canonical product worktree and branch for GitHub publication.
- `wt_user_*` worktrees are personal/local coding sandboxes (for example: `wt_user_ilja`).
- Additional coders should each use their own `wt_user_<name>` worktree + branch for parallel work.
- Only `wt_main` changes are pushed to GitHub.
- Release-ready installers and portable executables go to `.product/build_target/Releases/Current/`.
- Superseded release builds are archived under `.product/build_target/Releases/Archive/`.
- Build logs go to `.product/build_target/logs/`.
- Tool/scanner/script outputs go to `.product/build_target/tool_artifacts/`.
- Governed release changelog entries live under `.gov/workflow/changelog/`.
- Contents of build target artifact folders must remain gitignored (except `.gitkeep` placeholders).
- Legacy `.product/build_target/Current/` and `.product/build_target/Old versions/` folders are retained only for historical compatibility; new governed release outputs do not promote into them.

## 4.1 Startup Performance and Portability Rules

- Prioritize startup speed and state-change responsiveness as core quality targets.
- Keep runtime code portable to macOS: avoid hard-coded Windows paths/separators in core product paths.
- Do not add Windows-only runtime dependencies in core paths unless isolated behind an approved platform adapter.
- When performance-sensitive behavior changes, update WP evidence and traceability references accordingly.

## 5) Safety Boundaries (Spec Section 3.2)

Do not implement:

- individual targeting or stalking workflows
- covert affiliation inference
- social media scraping ingestion
- leaked/hacked/scraped-against-terms data pipelines
- financial trading or prediction tooling

## 6) Data Handling Defaults

- Preserve provenance, sensitivity markings, and auditability by default.
- Prefer additive and reversible updates over destructive edits.
- Keep generated artifacts out of governance folders unless they are governance artifacts by design.

## Built-in Visual Debugger (WP-GOV-DEBUGGER-001)

- Agents can capture a snapshot of the current workbench surface for visual debugging and QA.
- **Hotkey**: `Ctrl + Shift + S` — saves to `snapshots/manual/` under app data.
- **JS global**: `window.__stratatlasRequestSnapshot(subfolder?, label?)` — returns absolute file path to saved PNG.
- Snapshots saved to `<app_data>/stratatlas/snapshots/<subfolder>/<label>_<timestamp>.png`.

## Headless Agent Bridge (WP-GOV-BRIDGE-001)

- Localhost-only HTTP API so agents can navigate and capture without focus stealing.
- Port written to `<app_data>/stratatlas/agent_bridge_port.txt` on startup.
- Endpoints:
  - `GET /agent/health` — liveness check
  - `GET /agent/state` — current panel
  - `POST /agent/navigate` — `{"panel":"..."}` switch panel
  - `POST /agent/snapshot` — `{"subfolder":"...","label":"..."}` capture snapshot, blocks up to 30s

### When to use the bridge and visual debugger

- **After any UI implementation work**: capture a snapshot of every affected panel to visually verify the change landed correctly. Do not rely only on build-passes — visual confirmation catches layout breaks, missing elements, and state bugs that compilation misses.
- **During UX audits or smoke passes**: navigate all panels and capture labeled snapshots in one batch. Use a descriptive subfolder (e.g. `audit_2026-04-09`, `WP-I1-014`).
- **Before closing a WP**: capture evidence snapshots for the proof artifact bundle. Link snapshot paths in the WP evidence section.
- **When debugging reported issues**: capture a baseline snapshot, make the fix, then capture an after snapshot to confirm the fix visually.
- **Bridge discovery**: read the port file at `<app_data>/stratatlas/agent_bridge_port.txt`, verify health with `GET /agent/health`, then use navigate + snapshot.
- **Never use keyboard/mouse simulation** (PowerShell keybd_event, SendKeys, etc.) to interact with the app — always use the headless bridge HTTP API instead.

### Example workflow (from agent script or terminal)

```bash
PORT=$(cat "$APPDATA/com.stratatlas.dev/stratatlas/agent_bridge_port.txt")
curl -s http://127.0.0.1:$PORT/agent/health
curl -s -X POST http://127.0.0.1:$PORT/agent/navigate -d '{"panel":"map"}'
sleep 3
curl -s -X POST http://127.0.0.1:$PORT/agent/snapshot -d '{"subfolder":"WP-I1-014","label":"map_after_fix"}'
```

## 7) Always-Maintained Sentiment

- Treat roadmap and build order as living governance artifacts, not one-time docs.
- Keep `PROJECT_CODEX.md`, `AGENTS.md`, and `MODEL_BEHAVIOR.md` aligned with current workflow rules.
- Keep `REQUIREMENTS_INDEX.md`, `TRACEABILITY_MATRIX.md`, `PRIMITIVES_INDEX.md`, `PRIMITIVES_MATRIX.md`, and `TECH_STACK.md` current whenever scope, verification, or runtime assumptions change.
