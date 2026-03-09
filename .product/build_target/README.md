# StratAtlas Build Target Layout

Date: 2026-03-04

## Purpose

This directory holds generated desktop/build artifacts only.

## Structure

- `Releases/Current/Installers/` - latest governed installer artifacts plus release-facing maintenance/help files
- `Releases/Current/Portable/` - latest governed portable executable artifact
- `Releases/Current/InstallerKit/` - timestamped release kits with manifests, changelog copy, and maintenance assets
- `Releases/Archive/` - superseded governed release builds archived by version
- `Current/` - legacy compatibility folder kept only for historical artifacts
- `Old versions/` - legacy compatibility folder kept only for historical artifacts
- `logs/` - build logs and readiness run logs
- `tool_artifacts/` - outputs from tools, scripts, scanners, and temporary processing

## Rules

- Do not place governance/spec/workflow files here.
- Every build output should map to an active Work Packet.
- Build logs should include date, WP ID, and result.
- Governed release binaries must stay gitignored, including all installer and portable `.exe`/`.msi` outputs.
- `Releases/`, `Current/`, `Old versions/`, `logs/`, and `tool_artifacts/` contents are ignored by git except for `.gitkeep`.
