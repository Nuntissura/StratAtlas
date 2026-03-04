# StratAtlas - Spec Governance

**Created:** 2026-03-04  
**Purpose:** Define how the specification, requirements index, and traceability matrix are maintained.

---

## 1. Document Hierarchy

```text
.gov/Spec/stratatlas_spec_v1_2.md     <- Authoritative contract (what the system must do)
  |- REQUIREMENTS_INDEX.md             <- Extracted requirements with stable IDs
  |- TRACEABILITY_MATRIX.md            <- Requirements -> components -> tests
  |- TECH_STACK.md                     <- Technology decisions with rationale
  `- sub-specs/I0_*.md                 <- Per-iteration detailed specs
     sub-specs/I1_*.md
     ...
```

**Rule:** The spec is authoritative. If the index or matrix contradict the spec, the spec wins. If code contradicts the spec, either the code is wrong or the spec needs amendment.

---

## 2. Spec Amendment Process

### 2.1 Who Can Propose
Anyone on the team can propose a spec change via pull request against `.gov/Spec/stratatlas_spec_*.md`.

### 2.2 Change Categories

| Category | Example | Approval Required |
|----------|---------|-------------------|
| **Typo / Clarification** | Fix wording ambiguity, correct section reference | 1 reviewer |
| **SHOULD -> MUST promotion** | Elevate a recommendation to mandatory | 2 reviewers including product lead |
| **New MUST requirement** | Add a new mandatory requirement | 2 reviewers including product lead + engineering lead |
| **Requirement removal or demotion** | Remove a MUST or demote to SHOULD | Product lead + engineering lead + documented justification |
| **Section addition** | Add a new top-level section | Product lead + engineering lead |
| **Architecture change** | Change storage model, component model, or deployment profiles | Full team review |

### 2.3 PR Requirements
Every spec PR MUST include:
- A clear rationale in the PR description
- Updated `REQUIREMENTS_INDEX.md` if any MUST/SHOULD/MAY statement is added, modified, or removed
- A changelog entry in the spec's Appendix E

---

## 3. Requirements Index Maintenance

### 3.1 ID Assignment
- IDs are of the form `REQ-NNNN` where NNNN is a zero-padded 4-digit number.
- IDs are assigned sequentially and never reused.
- Cross-cutting requirements: `REQ-0001` through `REQ-0099`
- Per-iteration requirements: `REQ-XX00` through `REQ-XX99`
  - I0: `REQ-0100`-`REQ-0199`
  - I1: `REQ-0200`-`REQ-0299`
  - ...
  - I10: `REQ-1100`-`REQ-1199`
- If an iteration needs more than 100 requirements, extend into the next available block.

### 3.2 Deprecation
When a requirement is removed:
- Its row remains in the index with status `DEPRECATED`
- A `Deprecated` column is added with the date and reason
- The ID is never reassigned

### 3.3 Sub-Spec Decomposition
Sub-specs MAY introduce finer-grained requirements using suffix notation such as `REQ-0101a`, `REQ-0101b`. These are children of the parent requirement and inherit its section reference and iteration target.

---

## 4. Traceability Matrix Maintenance

### 4.1 When to Update
The matrix is updated at these events:

| Event | Action |
|-------|--------|
| Sub-spec written for iteration N | Add rows for all `REQ-NNxx` requirements with component and test mappings |
| Implementation begins | Update status in index from `PENDING` to `IN-PROGRESS` |
| Tests pass | Update `Verified` column with date |
| Iteration ships | Mark all verified requirements as `DONE` |
| Post-ship verification | Mark as `VERIFIED` after production confirmation |

### 4.2 Reverse Index
The "Component -> Requirements" reverse index at the bottom of the matrix MUST be updated whenever a new requirement-to-component mapping is added.

---

## 5. Sub-Spec Process

### 5.1 When Written
A sub-spec for iteration N MUST be written and approved before any implementation code for iteration N is merged.

### 5.2 Sub-Spec Contents (Required)
Per section 17 of the main spec, each sub-spec MUST include:

1. **UX contract** (wireframes, mode transitions, golden flow details)
2. **Data model** (JSON Schemas or schema deltas, indices, versioning)
3. **Storage implementation** (which tables/stores, migration plan)
4. **Provenance + markings** (how this slice propagates provenance and sensitivity)
5. **Audit coverage** (which actions are logged, log schema additions)
6. **Offline behavior** (what works offline, sync semantics, conflict UX)
7. **Determinism guarantees** (bundle replay coverage for this slice)
8. **Performance budget + tests** (specific metrics and test plan)
9. **Threat model notes** (security considerations specific to this slice)
10. **Schema deltas** (JSON Schema additions/modifications for Appendix B)
11. **API/interface deltas** (MCP tool additions, gateway changes)

### 5.3 Sub-Spec File Naming
`.gov/Spec/sub-specs/I{N}_{short_name}.md`

Example: `.gov/Spec/sub-specs/I0_walking_skeleton.md`

---

## 6. Technology Stack Decisions

### 6.1 Recording Decisions
Technology choices are recorded in `TECH_STACK.md` with:
- The decision (what was chosen)
- Alternatives considered
- Rationale (why this choice)
- License
- Risk notes

### 6.2 Architecture Decision Records (ADRs)
Major architectural choices also get a formal ADR in `docs/adr/NNN-title.md`. ADRs are permanent: they are superseded, never deleted.

---

## 7. Sync Cadence

### 7.1 Pre-Iteration Sync
Before each iteration begins, the team reviews:
- [ ] Sub-spec is written and approved
- [ ] All new requirements are in `REQUIREMENTS_INDEX.md`
- [ ] `TRACEABILITY_MATRIX.md` has rows for all new requirements (component + test columns populated)
- [ ] JSON Schemas for new artifacts are drafted in `schemas/`
- [ ] Performance budget test stubs exist in `tests/performance/`

### 7.2 Post-Iteration Sync
After each iteration ships:
- [ ] All requirement statuses updated in `REQUIREMENTS_INDEX.md`
- [ ] `TRACEABILITY_MATRIX.md` verified columns populated
- [ ] Release gates re-evaluated
- [ ] Spec changelog updated if amendments were made during the iteration

---

## 8. Roadmap and Governance Workflow Maintenance

### 8.1 Canonical Workflow Files
The following governance workflow files are mandatory and must be kept current:

- `.gov/workflow/ROADMAP.md`
- `.gov/workflow/GOVERNANCE_WORKFLOW.md`
- `.gov/workflow/taskboard/TASK_BOARD.md`

### 8.2 Mandatory Synchronization Rule
When a change affects iteration order, implementation scope, requirement status, or operating process, the same PR MUST update all impacted governance files, including:

- `REQUIREMENTS_INDEX.md`
- `TRACEABILITY_MATRIX.md`
- `ROADMAP.md`
- `TASK_BOARD.md`
- `PROJECT_CODEX.md` and `AGENTS.md` when workflow rules for humans/agents are changed

### 8.3 Enforcement
No work packet may be considered complete if roadmap/taskboard/requirements/traceability are out of sync with actual implementation state.

