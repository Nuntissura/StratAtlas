# StratAtlas Installer Lifecycle (Windows)

This document defines the supported Windows installer lifecycle operations.

## Canonical Installer Artifacts

- `StratAtlas_<version>_x64-setup.exe` (NSIS)
- `StratAtlas_<version>_x64_en-US.msi` (WiX/MSI)

## Versioning Contract

- The EXE and installer artifacts generated from the same build always use the same `<version>`.
- `.gov/repo_scripts/build_windows_installer.ps1` refuses to build if the checked-in release surface is already out of sync.
- `.gov/repo_scripts/build_windows_installer.ps1` increments the patch version on each successful installer build and syncs:
  - `.product/Worktrees/wt_main/src-tauri/tauri.conf.json`
  - `.product/Worktrees/wt_main/package.json`
  - `.product/Worktrees/wt_main/src-tauri/Cargo.toml`
- The installer kit manifest in `.product/build_target/Current/InstallerKit/<timestamp>/INSTALLER_MANIFEST.txt` is the canonical proof of the shipped installer version.

## Required Lifecycle Operations

- `uninstall`: remove the installed app.
- `repair`: repair installation files while preserving user presets/data.
- `full-repair`: clean reinstall from MSI with backup/restore of user presets/data.
- `update`: install a newer MSI build.
- `downgrade`: install an older MSI build (explicitly allowed).

## Maintenance Script

The lifecycle operations are exposed through:

- `scripts/windows-installer-maintenance.ps1`

Examples:

```powershell
# Inspect installed state
powershell -ExecutionPolicy Bypass -File .\scripts\windows-installer-maintenance.ps1 -Action status

# Repair installation, keep presets/data
powershell -ExecutionPolicy Bypass -File .\scripts\windows-installer-maintenance.ps1 -Action repair -Silent

# Full repair (clean reinstall) while restoring user data
powershell -ExecutionPolicy Bypass -File .\scripts\windows-installer-maintenance.ps1 -Action full-repair -MsiPath .\StratAtlas_<version>_x64_en-US.msi -Silent

# Update to newer MSI
powershell -ExecutionPolicy Bypass -File .\scripts\windows-installer-maintenance.ps1 -Action update -MsiPath .\StratAtlas_<newer-version>_x64_en-US.msi -Silent

# Downgrade to older MSI
powershell -ExecutionPolicy Bypass -File .\scripts\windows-installer-maintenance.ps1 -Action downgrade -MsiPath .\StratAtlas_<older-version>_x64_en-US.msi -Silent

# Uninstall
powershell -ExecutionPolicy Bypass -File .\scripts\windows-installer-maintenance.ps1 -Action uninstall -Silent
```

## Data Preservation Contract

- `repair` keeps existing user presets/data in `%APPDATA%`/`%LOCALAPPDATA%`.
- `full-repair` performs backup -> uninstall -> reinstall -> restore by default.
- `full-repair -DropUserData` performs a true clean reinstall without restoring data.
