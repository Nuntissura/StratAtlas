# StratAtlas Sub-Spec - Governed Release Artifact Layout and Maintenance Menu

Date: 2026-03-09
Status: Draft
Linked WP: `WP-GOV-INSTALLER-003`

## Intent

Harden the Windows release-prep surface so governed builds land in a predictable current/archive layout, every shipped version has a governed changelog entry, installer and portable binaries remain gitignored, and operators get a self-describing maintenance menu that makes data-handling differences explicit.

## Scope

- Govern the release artifact topology under `.product/build_target/Releases/`.
- Govern the release changelog ledger under `.gov/workflow/changelog/`.
- Harden the Windows maintenance script so it exposes install, uninstall, full-uninstall, repair, full-repair, update, downgrade, and changelog/help output in one place.
- Preserve the existing version-monotonic build contract and EXE/MSI version parity.

## Normative Rules

### Release Artifact Topology

- The latest governed release artifacts MUST stage under:
  - `.product/build_target/Releases/Current/Installers/`
  - `.product/build_target/Releases/Current/Portable/`
  - `.product/build_target/Releases/Current/InstallerKit/`
- Superseded governed releases MUST move to `.product/build_target/Releases/Archive/<version>/`.
- Legacy `.product/build_target/Current/` and `.product/build_target/Old versions/` folders are historical-only compatibility locations and MUST NOT receive new promoted release outputs.

### Git Hygiene

- Installer, setup EXE, and portable EXE outputs under `.product/build_target/` MUST remain gitignored.
- Only directory placeholders (for example `.gitkeep`) and textual pointers/manifests that are explicitly approved may be tracked.

### Changelog Ledger

- Every shipped version MUST have one governed changelog file under `.gov/workflow/changelog/`.
- Changelog filenames MUST be version-addressable: `v<semver>.md`.
- The release build flow MUST refuse promotion if the changelog entry for the next release version does not exist.
- The active release kit MUST include a copy of the matching changelog entry as `CHANGELOG_CURRENT.md`.

### Maintenance Menu Surface

- The maintenance pathway MUST explain, in plain language:
  - install
  - uninstall (preserve data)
  - full-uninstall
  - repair
  - full-repair / clean reinstall
  - update
  - downgrade
- The maintenance pathway MUST make the difference between uninstall, full-uninstall, repair, and full-repair explicit before operators choose an action.
- The maintenance pathway MUST display the current release changelog when invoked in menu/help mode.

## Proof Expectations

- The governed installer build must produce current-release outputs in the new layout and archive the prior current release version.
- The maintenance script must print a menu/help surface with operation descriptions and changelog output.
- Gitignore and governance-preflight checks must recognize the new release layout and binary-ignore policy.
