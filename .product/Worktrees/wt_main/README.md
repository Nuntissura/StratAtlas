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
- increments the patch version only after a successful installer build
- keeps the checked-in package, Tauri, and Cargo manifests synchronized to the shipped installer version
- stages MSI/NSIS artifacts, the maintenance script, the lifecycle document, and a SHA256 manifest into `.product/build_target/Current/InstallerKit/<timestamp>/`
- writes build logs to `.product/build_target/logs/`

## Artifact Locations

- Current installer kits: `.product/build_target/Current/InstallerKit/`
- Installer build logs: `.product/build_target/logs/`
- WP proof artifacts: `.product/build_target/tool_artifacts/wp_runs/`

## Operator References

- `docs/INSTALLER_LIFECYCLE.md`
- `scripts/windows-installer-maintenance.ps1`

## Repository Boundary

- Keep governance-only content in `.gov/`.
- Keep generated artifacts out of this worktree unless the file is part of the governed product surface.
