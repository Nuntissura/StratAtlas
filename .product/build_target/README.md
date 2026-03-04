# StratAtlas Build Target Layout

Date: 2026-03-04

## Purpose

This directory holds generated desktop/build artifacts only.

## Structure

- `Current/` - latest build outputs
- `Old versions/` - archived previous outputs
- `logs/` - build logs and readiness run logs
- `tool_artifacts/` - outputs from tools, scripts, scanners, and temporary processing

## Rules

- Do not place governance/spec/workflow files here.
- Every build output should map to an active Work Packet.
- Build logs should include date, WP ID, and result.
- `Current/`, `Old versions/`, `logs/`, and `tool_artifacts/` contents are ignored by git except for `.gitkeep`.
