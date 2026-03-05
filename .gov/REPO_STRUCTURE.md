# StratAtlas - Repository Structure

Date: 2026-03-04

StratAtlas enforces a deliberate split between **governance** and **product**.
The split is physical (`.gov/` vs `.product/`) and operational (what can be changed where).

---

## Canonical Layout (Schism by Design)

```text
StratAtlas/
|-- .gov/                                 # Governance engine (what/why/rules)
|   |-- REPO_STRUCTURE.md                 # This file
|   |-- Spec/                             # Authoritative product contract
|   |   |-- stratatlas_spec_v1_2.md
|   |   |-- REQUIREMENTS_INDEX.md
|   |   |-- TRACEABILITY_MATRIX.md
|   |   |-- PRIMITIVES_INDEX.md
|   |   |-- PRIMITIVES_MATRIX.md
|   |   |-- SPEC_GOVERNANCE.md
|   |   |-- TECH_STACK.md
|   |   `-- sub-specs/                    # Iteration sub-specs (I0..I10)
|   |-- workflow/                         # Work planning + execution governance
|   |   |-- ROADMAP.md                    # Ordered iteration build plan (I0..I10)
|   |   |-- GOVERNANCE_WORKFLOW.md        # Mandatory maintenance workflow/cadence
|   |   |-- BUILD_READINESS_CHECKLIST.md  # Build/start preflight checklist
|   |   |-- taskboard/
|   |   |   `-- TASK_BOARD.md             # Live work + governance maintenance status
|   |   |-- work_packets/                 # WP-*.md files live here
|   |   |-- wp_test_suites/               # TS-WP-*.md spec-vs-code suites per WP
|   |   `-- fail_log/                     # Governance-side failure logs
|   |-- templates/                        # Reusable governance templates (WP + sub-spec)
|   |-- repo_scripts/                     # Governance automation scripts (preflight + WP creation + checkpoint commits)
|   |-- audits/                           # Audit artifacts/reports
|   |-- doc/                              # Governance documentation
|   `-- examples_ref/                     # Reference examples
|
|-- .product/                             # Product engine (implementation only)
|   |-- Worktrees/                        # Active code worktrees
|   |   |-- wt_main/                      # Canonical product main worktree/branch (publish target)
|   |   `-- wt_user_<name>/               # Personal/parallel coder worktree (local branch, not pushed)
|   `-- build_target/                     # Build outputs + packaging artifacts
|       |-- Current/
|       |-- Old versions/
|       |-- logs/
|       `-- tool_artifacts/               # Tool/scanner/script output target (gitignored)
|
|-- PROJECT_CODEX.md                      # Repo operating model
|-- MODEL_BEHAVIOR.md                     # AI coding behavior + guardrails
`-- AGENTS.md                             # Repo-specific agent instructions
```

---

## Domain Contract (Non-Negotiable)

### `.gov/` is governance only

- Contains specs, requirements, traceability, policy, workflow, templates, and audits.
- Must not contain runtime application code, product binaries, or long-lived build artifacts.
- Any scope, requirement, or policy change starts here.

### `.product/` is product only

- Contains implementation worktrees and build artifacts.
- Must not become a second home for specs, policy, or workflow governance docs.
- Product changes must map back to active governance records (Work Packet + Task Board).
- Only `wt_main` is a GitHub publish target; `wt_user_*` worktrees are local parallel-development spaces.

---

## Change Flow

1. Confirm sequencing in `.gov/workflow/ROADMAP.md`.
2. Define or update scope in `.gov/workflow/work_packets/` and `.gov/workflow/taskboard/TASK_BOARD.md`.
3. Create or update the linked spec-vs-code suite in `.gov/workflow/wp_test_suites/`.
3. Run preflight (`.gov/repo_scripts/governance_preflight.ps1`) and follow `.gov/workflow/GOVERNANCE_WORKFLOW.md`.
4. Ensure `.gov/Spec/` reflects requirement, traceability, and primitive impact.
5. Create a governance checkpoint commit before product implementation.
6. Implement production-bound code in `.product/Worktrees/wt_main`.
7. Record outcomes back in governance artifacts.
8. Keep build outputs, logs, and tool artifacts confined to `.product/build_target/`.

---

## Anti-Mixing Rules

- Do not copy spec text into `.product/`; link to `.gov/Spec/...` instead.
- Do not store generated binaries or caches under `.gov/`.
- Do not merge unrelated governance and product changes into a single untraceable update.
- If governance and product both change in one PR, governance rationale must be explicit.
