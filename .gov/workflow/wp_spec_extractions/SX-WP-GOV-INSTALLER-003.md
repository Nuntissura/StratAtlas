# SX-WP-GOV-INSTALLER-003 - Spec Extraction Snapshot

Generated On: 2026-03-09
Linked Work Packet: WP-GOV-INSTALLER-003
Linked Test Suite: .gov/workflow/wp_test_suites/TS-WP-GOV-INSTALLER-003.md
Linked WP Check Script: .gov/workflow/wp_checks/check-WP-GOV-INSTALLER-003.ps1
Packet Class Snapshot: IMPLEMENTATION
Workflow Version Snapshot: 4.0
WP Status Snapshot: E2E-VERIFIED
Iteration: All

## Scope

Concrete extraction of requirement and primitive obligations this WP must satisfy before status promotion.

## Reality Boundary Snapshot

- Real Seam: Governed release promotion now lands in a versioned current/archive layout with changelog-bound release kits, and the archive is organized by shipped version while the maintenance script exposes a changelog-aware lifecycle menu including full-uninstall.
- User-Visible Win: Operators can find the latest installers and portable executable without digging through mixed historical folders, and the maintenance tool explains exactly what each lifecycle action does before they run it.
- Proof Target: `build_windows_installer.ps1` produces the new release layout with archived prior current outputs, gitignored installer/exe artifacts remain untracked, and `windows-installer-maintenance.ps1 -Action menu` prints function explanations plus the current changelog.
- Allowed Temporary Fallbacks: Legacy `.product/build_target/Current/` and `.product/build_target/Old versions/` remain on disk for historical compatibility only; no new promoted release outputs should be written there.
- Promotion Guard: RESEARCH and SCAFFOLD packets do not promote linked requirements or primitives to E2E-VERIFIED.

## Change Ledger Snapshot

- What Became Real: Governed Windows release promotion now stages installers, portable executable, manifest, maintenance assets, and changelog copy under `.product/build_target/Releases/Current/`, archives prior current releases by version, migrates legacy `.product/build_target/Current/` history into a versioned `LegacyCurrent` archive path, and exposes a changelog-aware maintenance menu with explicit install/uninstall/repair/full-clean semantics.
- What Remains Simulated: None in scope.
- Next Blocking Real Seam: Create and execute the release-candidate packet that promotes the publishable installer/release evidence bundle from the hardened governed release layout.

## Requirement Extraction

| Requirement | Level | Section | Description | Target | Status |
|-------------|-------|---------|-------------|--------|--------|
| REQ-0019 | MUST | Section 17 | Every WP MUST maintain linked test suite, spec extraction, and WP check script artifacts | All | E2E-VERIFIED |
| REQ-0020 | MUST | Section 17 | WP status claims MUST include proof artifact paths and command evidence | All | E2E-VERIFIED |
| REQ-0021 | MUST | Section 18 | Governance preflight MUST enforce WP template compliance to prevent shortcut execution | All | E2E-VERIFIED |
| REQ-0022 | SHOULD | Section 17 | Teams SHOULD run WP loop automation (`run_wp_loop.ps1`) before status-promotion sweeps | All | E2E-VERIFIED |
| REQ-0023 | MUST | Section 5.2 | Windows distribution MUST provide uninstall, repair, full-repair, update, and downgrade lifecycle operations | All | E2E-VERIFIED |
| REQ-0024 | MUST | Section 5.2 | Installer pathway MUST support standard uninstall via Windows installer controls | All | E2E-VERIFIED |
| REQ-0025 | MUST | Section 5.2 | Repair MUST preserve user presets/data under AppData paths | All | E2E-VERIFIED |
| REQ-0026 | MUST | Section 5.2 | Full-repair MUST clean reinstall binaries and restore user presets/data by default, with explicit data-drop option | All | E2E-VERIFIED |
| REQ-0027 | MUST | Section 5.2 | Update operation MUST reject non-newer packages | All | E2E-VERIFIED |
| REQ-0028 | MUST | Section 5.2 | Downgrade operation MUST be explicit and auditable | All | E2E-VERIFIED |
| REQ-0029 | SHOULD | Section 5.2 | Release kit SHOULD include a maintenance script and lifecycle documentation next to installer artifacts | All | E2E-VERIFIED |
| REQ-0030 | MUST | Section 5.2 | Installer build version MUST increase monotonically for rebuilt release artifacts from changed code | All | E2E-VERIFIED |
| REQ-0031 | MUST | Section 5.2 | EXE and installer artifacts from the same build MUST use the same version | All | E2E-VERIFIED |
| REQ-0032 | MUST | Section 5.2 | Governed release artifacts MUST stage latest installers and portable executable under `.product/build_target/Releases/Current/`, with superseded builds archived separately under `.product/build_target/Releases/Archive/` | All | E2E-VERIFIED |
| REQ-0033 | MUST | Section 5.2 | Installer, setup EXE, and portable EXE release artifacts under build-target release folders MUST remain gitignored | All | E2E-VERIFIED |
| REQ-0034 | MUST | Section 5.2 | Every shipped release build MUST have a matching governed changelog entry under `.gov/workflow/changelog/` and a staged copy in the release kit | All | E2E-VERIFIED |
| REQ-0035 | MUST | Section 5.2 | Maintenance pathway MUST provide a menu/help surface that explains install/uninstall/full-uninstall/repair/full-repair/update/downgrade functions and shows the current changelog | All | E2E-VERIFIED |
| REQ-0036 | MUST | Section 5.2 | Standard uninstall MUST preserve user presets/data by default, while full-uninstall MUST remove binaries and user data only on explicit request | All | E2E-VERIFIED |

## Primitive Extraction

| Primitive | Name | Contract | REQs | First Iter | Status |
|-----------|------|----------|------|------------|--------|
| PRIM-0024 | Installer Bundle Policy | Bundle configuration enforces MSI and NSIS targets, upgrade code, and downgrade-capable lifecycle constraints | REQ-0023, REQ-0024, REQ-0028, REQ-0031 | All | E2E-VERIFIED |
| PRIM-0025 | Maintenance Action Router | Single maintenance command surface for uninstall/repair/full-repair/update/downgrade actions | REQ-0023, REQ-0024, REQ-0025, REQ-0026, REQ-0027, REQ-0028 | All | E2E-VERIFIED |
| PRIM-0028 | Installer Kit Manifest Pipeline | Build script stages installers + lifecycle docs and generates checksum manifest for repeatable release kits | REQ-0023, REQ-0029, REQ-0030, REQ-0031 | All | E2E-VERIFIED |
| PRIM-0072 | Release Artifact Topology | Govern the current-versus-archive folder contract for installers, portable executables, manifests, and version promotion metadata | REQ-0029, REQ-0030, REQ-0031, REQ-0032, REQ-0033 | All | E2E-VERIFIED |
| PRIM-0073 | Governed Release Changelog Ledger | Require one governed changelog entry per shipped version and stage that entry with release artifacts and maintenance help surfaces | REQ-0020, REQ-0029, REQ-0034, REQ-0035 | All | E2E-VERIFIED |
| PRIM-0074 | Maintenance Menu Surface | Provide a human-readable maintenance menu/help surface covering install, uninstall, full-uninstall, repair, full-repair, update, downgrade, and data-handling semantics | REQ-0023, REQ-0024, REQ-0025, REQ-0026, REQ-0027, REQ-0028, REQ-0035, REQ-0036 | All | E2E-VERIFIED |

## Traceability Hooks

- REQ-0019: Mapped in TRACEABILITY_MATRIX.md
- REQ-0020: Mapped in TRACEABILITY_MATRIX.md
- REQ-0021: Mapped in TRACEABILITY_MATRIX.md
- REQ-0022: Mapped in TRACEABILITY_MATRIX.md
- REQ-0023: Mapped in TRACEABILITY_MATRIX.md
- REQ-0024: Mapped in TRACEABILITY_MATRIX.md
- REQ-0025: Mapped in TRACEABILITY_MATRIX.md
- REQ-0026: Mapped in TRACEABILITY_MATRIX.md
- REQ-0027: Mapped in TRACEABILITY_MATRIX.md
- REQ-0028: Mapped in TRACEABILITY_MATRIX.md
- REQ-0029: Mapped in TRACEABILITY_MATRIX.md
- REQ-0030: Mapped in TRACEABILITY_MATRIX.md
- REQ-0031: Mapped in TRACEABILITY_MATRIX.md
- REQ-0032: Mapped in TRACEABILITY_MATRIX.md
- REQ-0033: Mapped in TRACEABILITY_MATRIX.md
- REQ-0034: Mapped in TRACEABILITY_MATRIX.md
- REQ-0035: Mapped in TRACEABILITY_MATRIX.md
- REQ-0036: Mapped in TRACEABILITY_MATRIX.md

## Non-Goal / Red-Team Guardrails

- No individual targeting/stalking workflows.
- No covert affiliation inference.
- No social-media scraping ingestion.
- No leaked/hacked/scraped-against-terms data pipelines.
- No financial trading or prediction tooling.

## Verification Hooks

- Run preflight: powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/governance_preflight.ps1
- Run WP checks: powershell -ExecutionPolicy Bypass -File .gov/workflow/wp_checks/check-WP-GOV-INSTALLER-003.ps1
- Proof artifacts: .product/build_target/tool_artifacts/wp_runs/WP-GOV-INSTALLER-003/
