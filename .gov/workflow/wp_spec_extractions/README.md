# WP Spec Extractions

This folder stores one extracted spec snapshot per work packet.

Naming rule:
- `SX-WP-<...>.md`

Maintenance rules:
- Every WP must link to one extraction file.
- Extraction files are generated/updated via:
  `powershell -ExecutionPolicy Bypass -File .gov/repo_scripts/update_wp_spec_extract.ps1 -All`
- Create/update extraction in the same change as WP scope/status changes.

