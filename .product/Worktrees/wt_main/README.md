# StratAtlas Desktop Worktree

This worktree contains the governed StratAtlas desktop application. Product code lives here. Governance packets, specs, release scripts, and proof artifacts live under the repository root in `.gov/` and `.product/build_target/`.

## Prerequisites

- Windows workstation for the governed installer flow
- Node.js 24.x
- `pnpm`
- Rust 1.77.2 or newer
- Tauri 2 desktop prerequisites for Windows

## Daily Commands

Run from this directory:

```powershell
pnpm install
pnpm lint
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
pnpm tauri dev
```

## Governed Installer Build

Run from the repository root:

```powershell
powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/build_windows_installer.ps1
```

The governed installer build:

- validates governance preflight unless `-SkipPreflight` is supplied
- requires `package.json`, `src-tauri/tauri.conf.json`, and `src-tauri/Cargo.toml` to agree on the current checked-in version
- requires a matching governed changelog entry under `.gov/workflow/changelog/` for the next release version before build promotion
- increments the patch version only after a successful installer build
- keeps the checked-in package, Tauri, and Cargo manifests synchronized to the shipped installer version
- archives the prior current release under `.product/build_target/Releases/Archive/<previous-version>/`
- stages MSI/NSIS artifacts, a portable executable, the maintenance script, the lifecycle document, the governed changelog copy, and a SHA256 manifest into `.product/build_target/Releases/Current/`
- writes build logs to `.product/build_target/logs/`

## Artifact Locations

- Current installer artifacts: `.product/build_target/Releases/Current/Installers/`
- Current portable executable: `.product/build_target/Releases/Current/Portable/`
- Current installer kits: `.product/build_target/Releases/Current/InstallerKit/`
- Archived historical releases: `.product/build_target/Releases/Archive/`
- Installer build logs: `.product/build_target/logs/`
- WP proof artifacts: `.product/build_target/tool_artifacts/wp_runs/`
- Governed changelog entries: `.gov/workflow/changelog/`

## Operator References

- `docs/INSTALLER_LIFECYCLE.md`
- `scripts/windows-installer-maintenance.ps1`

## Repository Boundary

- Keep governance-only content in `.gov/`.
- Keep generated artifacts out of this worktree unless the file is part of the governed product surface.
