# StratAtlas - Traceability Matrix

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
- **Verified:** Date implementation-level tests passed, or blank

**Important:** `Verified` here is implementation-level verification. Done status is only `E2E-VERIFIED` in WP/taskboard/test-suite governance.

---

## Cross-Cutting Requirements

| REQ | Component(s) | Test(s) | Iter | Verified |
|-----|-------------|---------|------|----------|
| REQ-0001 | .product/Worktrees/wt_main/src/features/i6/aiGateway.ts; .product/Worktrees/wt_main/src/features/i9/osint.ts; .product/Worktrees/wt_main/src/features/i10/gameModeling.ts | .product/Worktrees/wt_main/src/features/i6/i6.test.ts; .product/Worktrees/wt_main/src/features/i9/i9.test.ts; .product/Worktrees/wt_main/src/features/i10/i10.test.ts | All | 2026-03-05 |
| REQ-0002 | .product/Worktrees/wt_main/src/features/i6/aiGateway.ts; .product/Worktrees/wt_main/src/features/i9/osint.ts; .product/Worktrees/wt_main/src/features/i10/gameModeling.ts | .product/Worktrees/wt_main/src/features/i6/i6.test.ts; .product/Worktrees/wt_main/src/features/i9/i9.test.ts; .product/Worktrees/wt_main/src/features/i10/i10.test.ts | All | 2026-03-05 |
| REQ-0003 | .product/Worktrees/wt_main/src/features/i6/aiGateway.ts; .product/Worktrees/wt_main/src/features/i9/osint.ts; .product/Worktrees/wt_main/src/features/i10/gameModeling.ts | .product/Worktrees/wt_main/src/features/i6/i6.test.ts; .product/Worktrees/wt_main/src/features/i9/i9.test.ts; .product/Worktrees/wt_main/src/features/i10/i10.test.ts | All | 2026-03-05 |
| REQ-0004 | .product/Worktrees/wt_main/src/features/i6/aiGateway.ts; .product/Worktrees/wt_main/src/features/i9/osint.ts; .product/Worktrees/wt_main/src/features/i10/gameModeling.ts | .product/Worktrees/wt_main/src/features/i6/i6.test.ts; .product/Worktrees/wt_main/src/features/i9/i9.test.ts; .product/Worktrees/wt_main/src/features/i10/i10.test.ts | All | 2026-03-05 |
| REQ-0005 | .product/Worktrees/wt_main/src/features/i6/aiGateway.ts; .product/Worktrees/wt_main/src/features/i9/osint.ts; .product/Worktrees/wt_main/src/features/i10/gameModeling.ts | .product/Worktrees/wt_main/src/features/i6/i6.test.ts; .product/Worktrees/wt_main/src/features/i9/i9.test.ts; .product/Worktrees/wt_main/src/features/i10/i10.test.ts | All | 2026-03-05 |
| REQ-0006 | .product/Worktrees/wt_main/src/features/i6/aiGateway.ts; .product/Worktrees/wt_main/src/features/i9/osint.ts; .product/Worktrees/wt_main/src/features/i10/gameModeling.ts | .product/Worktrees/wt_main/src/features/i6/i6.test.ts; .product/Worktrees/wt_main/src/features/i9/i9.test.ts; .product/Worktrees/wt_main/src/features/i10/i10.test.ts | All | 2026-03-05 |
| REQ-0007 | .product/Worktrees/wt_main/src/features/i6/aiGateway.ts; .product/Worktrees/wt_main/src/features/i9/osint.ts; .product/Worktrees/wt_main/src/features/i10/gameModeling.ts | .product/Worktrees/wt_main/src/features/i6/i6.test.ts; .product/Worktrees/wt_main/src/features/i9/i9.test.ts; .product/Worktrees/wt_main/src/features/i10/i10.test.ts | All | 2026-03-05 |
| REQ-0008 | .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/lib/backend.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | All | 2026-03-05 |
| REQ-0009 | .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/lib/backend.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | All | 2026-03-05 |
| REQ-0010 | .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/lib/backend.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | All | 2026-03-05 |
| REQ-0011 | .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/lib/backend.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | All | 2026-03-05 |
| REQ-0012 | .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/lib/backend.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | All | 2026-03-05 |
| REQ-0013 | .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/lib/backend.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | All | 2026-03-05 |
| REQ-0014 | .product/Worktrees/wt_main/src/features/i1/performance.ts | .product/Worktrees/wt_main/src/features/i1/i1.test.ts | All | 2026-03-05 |
| REQ-0015 | .product/Worktrees/wt_main/src/features/i1/performance.ts | .product/Worktrees/wt_main/src/features/i1/i1.test.ts | All | 2026-03-05 |
| REQ-0016 | .product/Worktrees/wt_main/src/features/i1/performance.ts | .product/Worktrees/wt_main/src/features/i1/i1.test.ts | All | 2026-03-05 |
| REQ-0017 | .product/Worktrees/wt_main/src-tauri/src/lib.rs; .product/Worktrees/wt_main/src/lib/backend.ts | .product/Worktrees/wt_main/src-tauri/src/lib.rs (unit tests); .product/Worktrees/wt_main/src/lib/backend.test.ts | All | 2026-03-05 |
| REQ-0018 | .product/Worktrees/wt_main/src-tauri/src/lib.rs; .product/Worktrees/wt_main/src/lib/backend.ts | .product/Worktrees/wt_main/src-tauri/src/lib.rs (unit tests); .product/Worktrees/wt_main/src/lib/backend.test.ts | All | 2026-03-05 |

---

## I0: Walking Skeleton

| REQ | Component(s) | Test(s) | Iter | Verified |
|-----|-------------|---------|------|----------|
| REQ-0100 | .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .product/Worktrees/wt_main/src/lib/backend.test.ts; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src-tauri/src/lib.rs (unit tests) | I0 | 2026-03-05 |
| REQ-0101 | .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .product/Worktrees/wt_main/src/lib/backend.test.ts; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src-tauri/src/lib.rs (unit tests) | I0 | 2026-03-05 |
| REQ-0102 | .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .product/Worktrees/wt_main/src/lib/backend.test.ts; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src-tauri/src/lib.rs (unit tests) | I0 | 2026-03-05 |
| REQ-0103 | .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .product/Worktrees/wt_main/src/lib/backend.test.ts; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src-tauri/src/lib.rs (unit tests) | I0 | 2026-03-05 |
| REQ-0104 | .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .product/Worktrees/wt_main/src/lib/backend.test.ts; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src-tauri/src/lib.rs (unit tests) | I0 | 2026-03-05 |
| REQ-0105 | .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .product/Worktrees/wt_main/src/lib/backend.test.ts; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src-tauri/src/lib.rs (unit tests) | I0 | 2026-03-05 |
| REQ-0106 | .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .product/Worktrees/wt_main/src/lib/backend.test.ts; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src-tauri/src/lib.rs (unit tests) | I0 | 2026-03-05 |
| REQ-0107 | .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .product/Worktrees/wt_main/src/lib/backend.test.ts; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src-tauri/src/lib.rs (unit tests) | I0 | 2026-03-05 |
| REQ-0108 | .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .product/Worktrees/wt_main/src/lib/backend.test.ts; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src-tauri/src/lib.rs (unit tests) | I0 | 2026-03-05 |
| REQ-0109 | .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .product/Worktrees/wt_main/src/lib/backend.test.ts; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src-tauri/src/lib.rs (unit tests) | I0 | 2026-03-05 |
| REQ-0110 | .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .product/Worktrees/wt_main/src/lib/backend.test.ts; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src-tauri/src/lib.rs (unit tests) | I0 | 2026-03-05 |
| REQ-0111 | .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .product/Worktrees/wt_main/src/lib/backend.test.ts; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src-tauri/src/lib.rs (unit tests) | I0 | 2026-03-05 |
| REQ-0112 | .product/Worktrees/wt_main/src/contracts/i0.ts; .product/Worktrees/wt_main/src/lib/backend.ts; .product/Worktrees/wt_main/src-tauri/src/lib.rs | .product/Worktrees/wt_main/src/lib/backend.test.ts; .product/Worktrees/wt_main/src/App.test.tsx; .product/Worktrees/wt_main/src-tauri/src/lib.rs (unit tests) | I0 | 2026-03-05 |

---

## I1: Layer System + Time/Replay

| REQ | Component(s) | Test(s) | Iter | Verified |
|-----|-------------|---------|------|----------|
| REQ-0200 | .product/Worktrees/wt_main/src/features/i1/modes.ts; .product/Worktrees/wt_main/src/features/i1/layers.ts; .product/Worktrees/wt_main/src/features/i1/plugins.ts; .product/Worktrees/wt_main/src/features/i1/performance.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/features/i1/i1.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | I1 | 2026-03-05 |
| REQ-0201 | .product/Worktrees/wt_main/src/features/i1/modes.ts; .product/Worktrees/wt_main/src/features/i1/layers.ts; .product/Worktrees/wt_main/src/features/i1/plugins.ts; .product/Worktrees/wt_main/src/features/i1/performance.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/features/i1/i1.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | I1 | 2026-03-05 |
| REQ-0202 | .product/Worktrees/wt_main/src/features/i1/modes.ts; .product/Worktrees/wt_main/src/features/i1/layers.ts; .product/Worktrees/wt_main/src/features/i1/plugins.ts; .product/Worktrees/wt_main/src/features/i1/performance.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/features/i1/i1.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | I1 | 2026-03-05 |
| REQ-0203 | .product/Worktrees/wt_main/src/features/i1/modes.ts; .product/Worktrees/wt_main/src/features/i1/layers.ts; .product/Worktrees/wt_main/src/features/i1/plugins.ts; .product/Worktrees/wt_main/src/features/i1/performance.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/features/i1/i1.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | I1 | 2026-03-05 |
| REQ-0204 | .product/Worktrees/wt_main/src/features/i1/modes.ts; .product/Worktrees/wt_main/src/features/i1/layers.ts; .product/Worktrees/wt_main/src/features/i1/plugins.ts; .product/Worktrees/wt_main/src/features/i1/performance.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/features/i1/i1.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | I1 | 2026-03-05 |
| REQ-0205 | .product/Worktrees/wt_main/src/features/i1/modes.ts; .product/Worktrees/wt_main/src/features/i1/layers.ts; .product/Worktrees/wt_main/src/features/i1/plugins.ts; .product/Worktrees/wt_main/src/features/i1/performance.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/features/i1/i1.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | I1 | 2026-03-05 |
| REQ-0206 | .product/Worktrees/wt_main/src/features/i1/modes.ts; .product/Worktrees/wt_main/src/features/i1/layers.ts; .product/Worktrees/wt_main/src/features/i1/plugins.ts; .product/Worktrees/wt_main/src/features/i1/performance.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/features/i1/i1.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | I1 | 2026-03-05 |
| REQ-0207 | .product/Worktrees/wt_main/src/features/i1/modes.ts; .product/Worktrees/wt_main/src/features/i1/layers.ts; .product/Worktrees/wt_main/src/features/i1/plugins.ts; .product/Worktrees/wt_main/src/features/i1/performance.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/features/i1/i1.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | I1 | 2026-03-05 |
| REQ-0208 | .product/Worktrees/wt_main/src/features/i1/modes.ts; .product/Worktrees/wt_main/src/features/i1/layers.ts; .product/Worktrees/wt_main/src/features/i1/plugins.ts; .product/Worktrees/wt_main/src/features/i1/performance.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/features/i1/i1.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | I1 | 2026-03-05 |
| REQ-0209 | .product/Worktrees/wt_main/src/features/i1/modes.ts; .product/Worktrees/wt_main/src/features/i1/layers.ts; .product/Worktrees/wt_main/src/features/i1/plugins.ts; .product/Worktrees/wt_main/src/features/i1/performance.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/features/i1/i1.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | I1 | 2026-03-05 |
| REQ-0210 | .product/Worktrees/wt_main/src/features/i1/modes.ts; .product/Worktrees/wt_main/src/features/i1/layers.ts; .product/Worktrees/wt_main/src/features/i1/plugins.ts; .product/Worktrees/wt_main/src/features/i1/performance.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/features/i1/i1.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | I1 | 2026-03-05 |
| REQ-0211 | .product/Worktrees/wt_main/src/features/i1/modes.ts; .product/Worktrees/wt_main/src/features/i1/layers.ts; .product/Worktrees/wt_main/src/features/i1/plugins.ts; .product/Worktrees/wt_main/src/features/i1/performance.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/features/i1/i1.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | I1 | 2026-03-05 |
| REQ-0212 | .product/Worktrees/wt_main/src/features/i1/modes.ts; .product/Worktrees/wt_main/src/features/i1/layers.ts; .product/Worktrees/wt_main/src/features/i1/plugins.ts; .product/Worktrees/wt_main/src/features/i1/performance.ts; .product/Worktrees/wt_main/src/App.tsx | .product/Worktrees/wt_main/src/features/i1/i1.test.ts; .product/Worktrees/wt_main/src/App.test.tsx | I1 | 2026-03-05 |

---

## I2: Baseline/Delta Compare + Briefing Bundle

| REQ | Component(s) | Test(s) | Iter | Verified |
|-----|-------------|---------|------|----------|
| REQ-0300 | .product/Worktrees/wt_main/src/features/i2/baselineDelta.ts | .product/Worktrees/wt_main/src/features/i2/i2.test.ts | I2 | 2026-03-05 |
| REQ-0301 | .product/Worktrees/wt_main/src/features/i2/baselineDelta.ts | .product/Worktrees/wt_main/src/features/i2/i2.test.ts | I2 | 2026-03-05 |
| REQ-0302 | .product/Worktrees/wt_main/src/features/i2/baselineDelta.ts | .product/Worktrees/wt_main/src/features/i2/i2.test.ts | I2 | 2026-03-05 |

---

## I3: Collaboration + CRDT + Session Replay

| REQ | Component(s) | Test(s) | Iter | Verified |
|-----|-------------|---------|------|----------|
| REQ-0400 | .product/Worktrees/wt_main/src/features/i3/collaboration.ts | .product/Worktrees/wt_main/src/features/i3/i3.test.ts | I3 | 2026-03-05 |
| REQ-0401 | .product/Worktrees/wt_main/src/features/i3/collaboration.ts | .product/Worktrees/wt_main/src/features/i3/i3.test.ts | I3 | 2026-03-05 |
| REQ-0402 | .product/Worktrees/wt_main/src/features/i3/collaboration.ts | .product/Worktrees/wt_main/src/features/i3/i3.test.ts | I3 | 2026-03-05 |
| REQ-0403 | .product/Worktrees/wt_main/src/features/i3/collaboration.ts | .product/Worktrees/wt_main/src/features/i3/i3.test.ts | I3 | 2026-03-05 |

---

## I4: Scenario Modeling + Constraint Propagation + Export

| REQ | Component(s) | Test(s) | Iter | Verified |
|-----|-------------|---------|------|----------|
| REQ-0500 | .product/Worktrees/wt_main/src/features/i4/scenarios.ts | .product/Worktrees/wt_main/src/features/i4/i4.test.ts | I4 | 2026-03-05 |
| REQ-0501 | .product/Worktrees/wt_main/src/features/i4/scenarios.ts | .product/Worktrees/wt_main/src/features/i4/i4.test.ts | I4 | 2026-03-05 |
| REQ-0502 | .product/Worktrees/wt_main/src/features/i4/scenarios.ts | .product/Worktrees/wt_main/src/features/i4/i4.test.ts | I4 | 2026-03-05 |
| REQ-0503 | .product/Worktrees/wt_main/src/features/i4/scenarios.ts | .product/Worktrees/wt_main/src/features/i4/i4.test.ts | I4 | 2026-03-05 |
| REQ-0504 | .product/Worktrees/wt_main/src/features/i4/scenarios.ts | .product/Worktrees/wt_main/src/features/i4/i4.test.ts | I4 | 2026-03-05 |

---

## I5: Query Builder + Saved/Versioned Queries

| REQ | Component(s) | Test(s) | Iter | Verified |
|-----|-------------|---------|------|----------|
| REQ-0600 | .product/Worktrees/wt_main/src/features/i5/queryBuilder.ts | .product/Worktrees/wt_main/src/features/i5/i5.test.ts | I5 | 2026-03-05 |
| REQ-0601 | .product/Worktrees/wt_main/src/features/i5/queryBuilder.ts | .product/Worktrees/wt_main/src/features/i5/i5.test.ts | I5 | 2026-03-05 |
| REQ-0602 | .product/Worktrees/wt_main/src/features/i5/queryBuilder.ts | .product/Worktrees/wt_main/src/features/i5/i5.test.ts | I5 | 2026-03-05 |
| REQ-0603 | .product/Worktrees/wt_main/src/features/i5/queryBuilder.ts | .product/Worktrees/wt_main/src/features/i5/i5.test.ts | I5 | 2026-03-05 |
| REQ-0604 | .product/Worktrees/wt_main/src/features/i5/queryBuilder.ts | .product/Worktrees/wt_main/src/features/i5/i5.test.ts | I5 | 2026-03-05 |

---

## I6: AI Gateway + MCP Interface

| REQ | Component(s) | Test(s) | Iter | Verified |
|-----|-------------|---------|------|----------|
| REQ-0700 | .product/Worktrees/wt_main/src/features/i6/aiGateway.ts | .product/Worktrees/wt_main/src/features/i6/i6.test.ts | I6 | 2026-03-05 |
| REQ-0701 | .product/Worktrees/wt_main/src/features/i6/aiGateway.ts | .product/Worktrees/wt_main/src/features/i6/i6.test.ts | I6 | 2026-03-05 |
| REQ-0702 | .product/Worktrees/wt_main/src/features/i6/aiGateway.ts | .product/Worktrees/wt_main/src/features/i6/i6.test.ts | I6 | 2026-03-05 |
| REQ-0703 | .product/Worktrees/wt_main/src/features/i6/aiGateway.ts | .product/Worktrees/wt_main/src/features/i6/i6.test.ts | I6 | 2026-03-05 |
| REQ-0704 | .product/Worktrees/wt_main/src/features/i6/aiGateway.ts | .product/Worktrees/wt_main/src/features/i6/i6.test.ts | I6 | 2026-03-05 |
| REQ-0705 | .product/Worktrees/wt_main/src/features/i6/aiGateway.ts | .product/Worktrees/wt_main/src/features/i6/i6.test.ts | I6 | 2026-03-05 |
| REQ-0706 | .product/Worktrees/wt_main/src/features/i6/aiGateway.ts | .product/Worktrees/wt_main/src/features/i6/i6.test.ts | I6 | 2026-03-05 |
| REQ-0707 | .product/Worktrees/wt_main/src/features/i6/aiGateway.ts | .product/Worktrees/wt_main/src/features/i6/i6.test.ts | I6 | 2026-03-05 |
| REQ-0708 | .product/Worktrees/wt_main/src/features/i6/aiGateway.ts | .product/Worktrees/wt_main/src/features/i6/i6.test.ts | I6 | 2026-03-05 |

---

## I7: Context Intake Framework + First Domains

| REQ | Component(s) | Test(s) | Iter | Verified |
|-----|-------------|---------|------|----------|
| REQ-0800 | .product/Worktrees/wt_main/src/features/i7/contextIntake.ts | .product/Worktrees/wt_main/src/features/i7/i7.test.ts | I7 | 2026-03-05 |
| REQ-0801 | .product/Worktrees/wt_main/src/features/i7/contextIntake.ts | .product/Worktrees/wt_main/src/features/i7/i7.test.ts | I7 | 2026-03-05 |
| REQ-0802 | .product/Worktrees/wt_main/src/features/i7/contextIntake.ts | .product/Worktrees/wt_main/src/features/i7/i7.test.ts | I7 | 2026-03-05 |
| REQ-0803 | .product/Worktrees/wt_main/src/features/i7/contextIntake.ts | .product/Worktrees/wt_main/src/features/i7/i7.test.ts | I7 | 2026-03-05 |
| REQ-0804 | .product/Worktrees/wt_main/src/features/i7/contextIntake.ts | .product/Worktrees/wt_main/src/features/i7/i7.test.ts | I7 | 2026-03-05 |
| REQ-0805 | .product/Worktrees/wt_main/src/features/i7/contextIntake.ts | .product/Worktrees/wt_main/src/features/i7/i7.test.ts | I7 | 2026-03-05 |
| REQ-0806 | .product/Worktrees/wt_main/src/features/i7/contextIntake.ts | .product/Worktrees/wt_main/src/features/i7/i7.test.ts | I7 | 2026-03-05 |
| REQ-0807 | .product/Worktrees/wt_main/src/features/i7/contextIntake.ts | .product/Worktrees/wt_main/src/features/i7/i7.test.ts | I7 | 2026-03-05 |
| REQ-0808 | .product/Worktrees/wt_main/src/features/i7/contextIntake.ts | .product/Worktrees/wt_main/src/features/i7/i7.test.ts | I7 | 2026-03-05 |
| REQ-0809 | .product/Worktrees/wt_main/src/features/i7/contextIntake.ts | .product/Worktrees/wt_main/src/features/i7/i7.test.ts | I7 | 2026-03-05 |
| REQ-0810 | .product/Worktrees/wt_main/src/features/i7/contextIntake.ts | .product/Worktrees/wt_main/src/features/i7/i7.test.ts | I7 | 2026-03-05 |

---

## I8: Context Deviation Detection + Infrastructure Propagation

| REQ | Component(s) | Test(s) | Iter | Verified |
|-----|-------------|---------|------|----------|
| REQ-0900 | .product/Worktrees/wt_main/src/features/i8/deviation.ts | .product/Worktrees/wt_main/src/features/i8/i8.test.ts | I8 | 2026-03-05 |
| REQ-0901 | .product/Worktrees/wt_main/src/features/i8/deviation.ts | .product/Worktrees/wt_main/src/features/i8/i8.test.ts | I8 | 2026-03-05 |
| REQ-0902 | .product/Worktrees/wt_main/src/features/i8/deviation.ts | .product/Worktrees/wt_main/src/features/i8/i8.test.ts | I8 | 2026-03-05 |
| REQ-0903 | .product/Worktrees/wt_main/src/features/i8/deviation.ts | .product/Worktrees/wt_main/src/features/i8/i8.test.ts | I8 | 2026-03-05 |
| REQ-0904 | .product/Worktrees/wt_main/src/features/i8/deviation.ts | .product/Worktrees/wt_main/src/features/i8/i8.test.ts | I8 | 2026-03-05 |

---

## I9: OSINT + Economic Indicators + Context-Aware Queries

| REQ | Component(s) | Test(s) | Iter | Verified |
|-----|-------------|---------|------|----------|
| REQ-1000 | .product/Worktrees/wt_main/src/features/i9/osint.ts | .product/Worktrees/wt_main/src/features/i9/i9.test.ts | I9 | 2026-03-05 |
| REQ-1001 | .product/Worktrees/wt_main/src/features/i9/osint.ts | .product/Worktrees/wt_main/src/features/i9/i9.test.ts | I9 | 2026-03-05 |
| REQ-1002 | .product/Worktrees/wt_main/src/features/i9/osint.ts | .product/Worktrees/wt_main/src/features/i9/i9.test.ts | I9 | 2026-03-05 |
| REQ-1003 | .product/Worktrees/wt_main/src/features/i9/osint.ts | .product/Worktrees/wt_main/src/features/i9/i9.test.ts | I9 | 2026-03-05 |

---

## I10: Strategic Game Modeling

| REQ | Component(s) | Test(s) | Iter | Verified |
|-----|-------------|---------|------|----------|
| REQ-1100 | .product/Worktrees/wt_main/src/features/i10/gameModeling.ts | .product/Worktrees/wt_main/src/features/i10/i10.test.ts | I10 | 2026-03-05 |
| REQ-1101 | .product/Worktrees/wt_main/src/features/i10/gameModeling.ts | .product/Worktrees/wt_main/src/features/i10/i10.test.ts | I10 | 2026-03-05 |
| REQ-1102 | .product/Worktrees/wt_main/src/features/i10/gameModeling.ts | .product/Worktrees/wt_main/src/features/i10/i10.test.ts | I10 | 2026-03-05 |
| REQ-1103 | .product/Worktrees/wt_main/src/features/i10/gameModeling.ts | .product/Worktrees/wt_main/src/features/i10/i10.test.ts | I10 | 2026-03-05 |
| REQ-1104 | .product/Worktrees/wt_main/src/features/i10/gameModeling.ts | .product/Worktrees/wt_main/src/features/i10/i10.test.ts | I10 | 2026-03-05 |
| REQ-1105 | .product/Worktrees/wt_main/src/features/i10/gameModeling.ts | .product/Worktrees/wt_main/src/features/i10/i10.test.ts | I10 | 2026-03-05 |
| REQ-1106 | .product/Worktrees/wt_main/src/features/i10/gameModeling.ts | .product/Worktrees/wt_main/src/features/i10/i10.test.ts | I10 | 2026-03-05 |
| REQ-1107 | .product/Worktrees/wt_main/src/features/i10/gameModeling.ts | .product/Worktrees/wt_main/src/features/i10/i10.test.ts | I10 | 2026-03-05 |
| REQ-1108 | .product/Worktrees/wt_main/src/features/i10/gameModeling.ts | .product/Worktrees/wt_main/src/features/i10/i10.test.ts | I10 | 2026-03-05 |
| REQ-1109 | .product/Worktrees/wt_main/src/features/i10/gameModeling.ts | .product/Worktrees/wt_main/src/features/i10/i10.test.ts | I10 | 2026-03-05 |
| REQ-1110 | .product/Worktrees/wt_main/src/features/i10/gameModeling.ts | .product/Worktrees/wt_main/src/features/i10/i10.test.ts | I10 | 2026-03-05 |
| REQ-1111 | .product/Worktrees/wt_main/src/features/i10/gameModeling.ts | .product/Worktrees/wt_main/src/features/i10/i10.test.ts | I10 | 2026-03-05 |
| REQ-1112 | .product/Worktrees/wt_main/src/features/i10/gameModeling.ts | .product/Worktrees/wt_main/src/features/i10/i10.test.ts | I10 | 2026-03-05 |
| REQ-1113 | .product/Worktrees/wt_main/src/features/i10/gameModeling.ts | .product/Worktrees/wt_main/src/features/i10/i10.test.ts | I10 | 2026-03-05 |

---

## Work Packet Coverage and Primitive Links

| WP ID | Iteration | Requirements | Primitives | Test Suite | Status | Evidence |
|------|-----------|--------------|------------|------------|--------|----------|
| WP-I0-001 | I0 | REQ-0100..REQ-0112, REQ-0017..REQ-0018 | PRIM-0001, PRIM-0002, PRIM-0003, PRIM-0004 | .gov/workflow/wp_test_suites/TS-WP-I0-001.md | IMPLEMENTED | verification pass 2026-03-05; pending sign-off |
| WP-I1-001 | I1 | REQ-0200..REQ-0212, REQ-0014..REQ-0016 | PRIM-0005, PRIM-0006, PRIM-0007, PRIM-0008, PRIM-0009 | .gov/workflow/wp_test_suites/TS-WP-I1-001.md | IMPLEMENTED | verification pass 2026-03-05; pending sign-off |
| WP-I2-001 | I2 | REQ-0300..REQ-0302 | PRIM-0010, PRIM-0011 | .gov/workflow/wp_test_suites/TS-WP-I2-001.md | IMPLEMENTED | verification pass 2026-03-05; pending sign-off |
| WP-I3-001 | I3 | REQ-0400..REQ-0403 | PRIM-0012 | .gov/workflow/wp_test_suites/TS-WP-I3-001.md | IMPLEMENTED | verification pass 2026-03-05; pending sign-off |
| WP-I4-001 | I4 | REQ-0500..REQ-0504 | PRIM-0013 | .gov/workflow/wp_test_suites/TS-WP-I4-001.md | IMPLEMENTED | verification pass 2026-03-05; pending sign-off |
| WP-I5-001 | I5 | REQ-0600..REQ-0604 | PRIM-0014 | .gov/workflow/wp_test_suites/TS-WP-I5-001.md | IMPLEMENTED | verification pass 2026-03-05; pending sign-off |
| WP-I6-001 | I6 | REQ-0700..REQ-0708 | PRIM-0015 | .gov/workflow/wp_test_suites/TS-WP-I6-001.md | IMPLEMENTED | verification pass 2026-03-05; pending sign-off |
| WP-I7-001 | I7 | REQ-0800..REQ-0810 | PRIM-0016 | .gov/workflow/wp_test_suites/TS-WP-I7-001.md | IMPLEMENTED | verification pass 2026-03-05; pending sign-off |
| WP-I8-001 | I8 | REQ-0900..REQ-0904 | PRIM-0017 | .gov/workflow/wp_test_suites/TS-WP-I8-001.md | IMPLEMENTED | verification pass 2026-03-05; pending sign-off |
| WP-I9-001 | I9 | REQ-1000..REQ-1003 | PRIM-0018 | .gov/workflow/wp_test_suites/TS-WP-I9-001.md | IMPLEMENTED | verification pass 2026-03-05; pending sign-off |
| WP-I10-001 | I10 | REQ-1100..REQ-1113 | PRIM-0019 | .gov/workflow/wp_test_suites/TS-WP-I10-001.md | IMPLEMENTED | verification pass 2026-03-05; pending sign-off |

---

## Gate Verification

| Gate | Verification Method | Requirements Covered | Last Verified |
|------|-------------------|---------------------|---------------|
| Gate A - Misuse Constraints | Automated security tests in I6/I9/I10 feature suites | REQ-0001..REQ-0007 | 2026-03-05 |
| Gate B - Provenance and Reproducibility | Deterministic reopen + bundle integrity tests | REQ-0101, REQ-0104, REQ-0105, REQ-0009 | 2026-03-05 |
| Gate C - Security and Governance | RBAC/audit/marking contract tests and app flow checks | REQ-0008, REQ-0010, REQ-0100, REQ-0106 | 2026-03-05 |
| Gate D - Offline Operability | Offline bundle workflow in fallback runtime and app shell | REQ-0108 | 2026-03-05 |
| Gate E - Performance | Budget contract checks in I1 performance suite | REQ-0014..REQ-0016, REQ-0112, REQ-0206..REQ-0211 | 2026-03-05 |
| Gate F - Context Integrity | Context intake/deviation/OSINT iteration tests | REQ-0800..REQ-0810 | 2026-03-05 |
| Gate G - AI Safety | AI gateway policy and labeling tests | REQ-0700..REQ-0708, REQ-0011, REQ-0012 | 2026-03-05 |
| Gate H - Desktop Portability and Startup | Platform-neutral path handling and startup budget contracts | REQ-0014..REQ-0018 | 2026-03-05 |

---

## Component -> Requirements Reverse Index

For quick lookup: "What requirements does this component implement?"

| Component | Requirements |
|-----------|-------------|
| .product/Worktrees/wt_main/src/contracts/i0.ts | REQ-0008..REQ-0013, REQ-0100..REQ-0112 |
| .product/Worktrees/wt_main/src/lib/backend.ts | REQ-0008..REQ-0013, REQ-0017..REQ-0018, REQ-0100..REQ-0112 |
| .product/Worktrees/wt_main/src/App.tsx | REQ-0008..REQ-0013, REQ-0200..REQ-0212 |
| .product/Worktrees/wt_main/src/features/i1/modes.ts | REQ-0200..REQ-0212 |
| .product/Worktrees/wt_main/src/features/i1/layers.ts | REQ-0200..REQ-0212 |
| .product/Worktrees/wt_main/src/features/i1/plugins.ts | REQ-0204..REQ-0205 |
| .product/Worktrees/wt_main/src/features/i1/performance.ts | REQ-0014..REQ-0016, REQ-0206..REQ-0211 |
| .product/Worktrees/wt_main/src/features/i2/baselineDelta.ts | REQ-0300..REQ-0302 |
| .product/Worktrees/wt_main/src/features/i3/collaboration.ts | REQ-0400..REQ-0403 |
| .product/Worktrees/wt_main/src/features/i4/scenarios.ts | REQ-0500..REQ-0504 |
| .product/Worktrees/wt_main/src/features/i5/queryBuilder.ts | REQ-0600..REQ-0604 |
| .product/Worktrees/wt_main/src/features/i6/aiGateway.ts | REQ-0001..REQ-0007, REQ-0700..REQ-0708 |
| .product/Worktrees/wt_main/src/features/i7/contextIntake.ts | REQ-0800..REQ-0810 |
| .product/Worktrees/wt_main/src/features/i8/deviation.ts | REQ-0900..REQ-0904 |
| .product/Worktrees/wt_main/src/features/i9/osint.ts | REQ-0001..REQ-0007, REQ-1000..REQ-1003 |
| .product/Worktrees/wt_main/src/features/i10/gameModeling.ts | REQ-0001..REQ-0007, REQ-1100..REQ-1113 |
| .product/Worktrees/wt_main/src-tauri/src/lib.rs | REQ-0017..REQ-0018, REQ-0100..REQ-0112 |
