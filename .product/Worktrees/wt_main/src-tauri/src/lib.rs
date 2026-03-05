use chrono::Utc;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use sha2::{Digest, Sha256};
use std::{
  fs::{self, OpenOptions},
  io::{BufRead, BufReader, Write},
  path::{Component, Path, PathBuf},
};
use tauri::{AppHandle, Manager};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
struct ProvenanceRef {
  source: String,
  license: String,
  retrieved_at: String,
  pipeline_version: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct BundleAsset {
  asset_id: String,
  sha256: String,
  media_type: String,
  size_bytes: u64,
  bundle_relative_path: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct BundleManifest {
  bundle_id: String,
  created_at: String,
  created_by_role: String,
  marking: String,
  assets: Vec<BundleAsset>,
  ui_state_hash: String,
  derived_artifact_hashes: Vec<String>,
  provenance_refs: Vec<ProvenanceRef>,
  supersedes_bundle_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct CreateBundleRequest {
  role: String,
  marking: String,
  ui_state: Value,
  provenance_refs: Vec<ProvenanceRef>,
  supersedes_bundle_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct OpenBundleResult {
  manifest: BundleManifest,
  ui_state: Value,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct AppendAuditRequest {
  role: String,
  event_type: String,
  payload: Value,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct AuditEvent {
  event_id: String,
  ts: String,
  actor_role: String,
  event_type: String,
  payload_hash: String,
  prev_event_hash: Option<String>,
  event_hash: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct AuditHead {
  event_hash: Option<String>,
}

type CommandResult<T> = Result<T, String>;

fn is_valid_role(role: &str) -> bool {
  matches!(role, "viewer" | "analyst" | "administrator" | "auditor")
}

fn is_valid_marking(marking: &str) -> bool {
  matches!(marking, "PUBLIC" | "INTERNAL" | "RESTRICTED")
}

fn ensure_valid_relative_path(path: &str) -> CommandResult<()> {
  let candidate = Path::new(path);
  if candidate.is_absolute() {
    return Err("Asset path must be relative".to_string());
  }
  if candidate
    .components()
    .any(|component| matches!(component, Component::ParentDir))
  {
    return Err("Asset path traversal is not allowed".to_string());
  }
  Ok(())
}

fn to_json_string<T: Serialize>(value: &T) -> CommandResult<String> {
  serde_json::to_string(value).map_err(|error| format!("JSON serialization failed: {error}"))
}

fn sha256_hex(bytes: &[u8]) -> String {
  let mut hasher = Sha256::new();
  hasher.update(bytes);
  let digest = hasher.finalize();
  digest.iter().map(|byte| format!("{byte:02x}")).collect()
}

fn app_runtime_root(app: &AppHandle) -> CommandResult<PathBuf> {
  let app_data = app
    .path()
    .app_data_dir()
    .map_err(|error| format!("Failed to resolve app data directory: {error}"))?;
  let root = app_data.join("stratatlas");
  fs::create_dir_all(&root)
    .map_err(|error| format!("Failed to create runtime directory {}: {error}", root.display()))?;
  Ok(root)
}

fn bundles_dir(app: &AppHandle) -> CommandResult<PathBuf> {
  let path = app_runtime_root(app)?.join("bundles");
  fs::create_dir_all(&path)
    .map_err(|error| format!("Failed to create bundles directory {}: {error}", path.display()))?;
  Ok(path)
}

fn audit_dir(app: &AppHandle) -> CommandResult<PathBuf> {
  let path = app_runtime_root(app)?.join("audit");
  fs::create_dir_all(&path)
    .map_err(|error| format!("Failed to create audit directory {}: {error}", path.display()))?;
  Ok(path)
}

fn audit_head_path(app: &AppHandle) -> CommandResult<PathBuf> {
  Ok(audit_dir(app)?.join("audit_head.json"))
}

fn audit_log_path(app: &AppHandle) -> CommandResult<PathBuf> {
  Ok(audit_dir(app)?.join("audit_log.jsonl"))
}

fn read_audit_head(app: &AppHandle) -> CommandResult<AuditHead> {
  let path = audit_head_path(app)?;
  if !path.exists() {
    return Ok(AuditHead { event_hash: None });
  }
  let bytes = fs::read(&path).map_err(|error| format!("Failed reading audit head: {error}"))?;
  serde_json::from_slice::<AuditHead>(&bytes)
    .map_err(|error| format!("Failed parsing audit head {}: {error}", path.display()))
}

fn append_audit_internal(app: &AppHandle, request: &AppendAuditRequest) -> CommandResult<AuditEvent> {
  if !is_valid_role(&request.role) {
    return Err(format!("Invalid role for audit event: {}", request.role));
  }

  let head = read_audit_head(app)?;
  let payload_json = to_json_string(&request.payload)?;
  let payload_hash = sha256_hex(payload_json.as_bytes());
  let ts = Utc::now().to_rfc3339();
  let canonical_event = json!({
    "actor_role": request.role,
    "event_type": request.event_type,
    "payload_hash": payload_hash,
    "prev_event_hash": head.event_hash,
    "ts": ts
  });
  let canonical_json = to_json_string(&canonical_event)?;
  let mut hash_input = String::new();
  if let Some(previous_hash) = &head.event_hash {
    hash_input.push_str(previous_hash);
  }
  hash_input.push_str(&canonical_json);
  let event_hash = sha256_hex(hash_input.as_bytes());

  let event = AuditEvent {
    event_id: Uuid::now_v7().to_string(),
    ts,
    actor_role: request.role.clone(),
    event_type: request.event_type.clone(),
    payload_hash,
    prev_event_hash: head.event_hash,
    event_hash: event_hash.clone(),
  };

  let log_path = audit_log_path(app)?;
  let mut log_file = OpenOptions::new()
    .create(true)
    .append(true)
    .open(&log_path)
    .map_err(|error| format!("Failed opening audit log {}: {error}", log_path.display()))?;
  let line = to_json_string(&event)?;
  writeln!(log_file, "{line}")
    .map_err(|error| format!("Failed writing audit log {}: {error}", log_path.display()))?;

  let head_path = audit_head_path(app)?;
  let serialized_head = to_json_string(&AuditHead {
    event_hash: Some(event_hash),
  })?;
  fs::write(&head_path, serialized_head)
    .map_err(|error| format!("Failed writing audit head {}: {error}", head_path.display()))?;

  Ok(event)
}

#[tauri::command]
fn create_bundle(app: AppHandle, request: CreateBundleRequest) -> CommandResult<BundleManifest> {
  if !is_valid_role(&request.role) {
    return Err(format!("Invalid role: {}", request.role));
  }
  if !is_valid_marking(&request.marking) {
    return Err(format!("Invalid marking: {}", request.marking));
  }

  let bundle_id = Uuid::now_v7().to_string();
  let bundle_root = bundles_dir(&app)?.join(&bundle_id);
  let assets_dir = bundle_root.join("assets");
  fs::create_dir_all(&assets_dir).map_err(|error| {
    format!(
      "Failed creating bundle directory {}: {error}",
      assets_dir.display()
    )
  })?;

  let ui_state_bytes = serde_json::to_vec(&request.ui_state)
    .map_err(|error| format!("Failed serializing UI state: {error}"))?;
  let ui_hash = sha256_hex(&ui_state_bytes);
  let ui_state_relative_path = "assets/ui_state.json".to_string();
  let ui_state_path = bundle_root.join(&ui_state_relative_path);
  fs::write(&ui_state_path, &ui_state_bytes).map_err(|error| {
    format!(
      "Failed writing bundle UI state {}: {error}",
      ui_state_path.display()
    )
  })?;

  let asset = BundleAsset {
    asset_id: "ui-state".to_string(),
    sha256: ui_hash.clone(),
    media_type: "application/json".to_string(),
    size_bytes: u64::try_from(ui_state_bytes.len())
      .map_err(|error| format!("Failed computing UI state size: {error}"))?,
    bundle_relative_path: ui_state_relative_path,
  };

  let manifest = BundleManifest {
    bundle_id: bundle_id.clone(),
    created_at: Utc::now().to_rfc3339(),
    created_by_role: request.role.clone(),
    marking: request.marking.clone(),
    assets: vec![asset],
    ui_state_hash: ui_hash.clone(),
    derived_artifact_hashes: vec![ui_hash],
    provenance_refs: request.provenance_refs.clone(),
    supersedes_bundle_id: request.supersedes_bundle_id.clone(),
  };

  let manifest_path = bundle_root.join("manifest.json");
  let serialized_manifest = serde_json::to_string_pretty(&manifest)
    .map_err(|error| format!("Failed serializing manifest: {error}"))?;
  fs::write(&manifest_path, serialized_manifest).map_err(|error| {
    format!(
      "Failed writing bundle manifest {}: {error}",
      manifest_path.display()
    )
  })?;

  let _ = append_audit_internal(
    &app,
    &AppendAuditRequest {
      role: request.role,
      event_type: "bundle.create".to_string(),
      payload: json!({
        "bundle_id": bundle_id,
        "marking": request.marking,
      }),
    },
  )?;

  Ok(manifest)
}

#[tauri::command]
fn open_bundle(app: AppHandle, bundle_id: String) -> CommandResult<OpenBundleResult> {
  let bundle_root = bundles_dir(&app)?.join(&bundle_id);
  let manifest_path = bundle_root.join("manifest.json");
  let manifest_bytes = fs::read(&manifest_path).map_err(|error| {
    format!(
      "Failed reading bundle manifest {}: {error}",
      manifest_path.display()
    )
  })?;
  let manifest = serde_json::from_slice::<BundleManifest>(&manifest_bytes)
    .map_err(|error| format!("Invalid manifest {}: {error}", manifest_path.display()))?;

  for asset in &manifest.assets {
    ensure_valid_relative_path(&asset.bundle_relative_path)?;
    let asset_path = bundle_root.join(&asset.bundle_relative_path);
    let bytes = fs::read(&asset_path)
      .map_err(|error| format!("Failed reading bundle asset {}: {error}", asset_path.display()))?;
    let hash = sha256_hex(&bytes);
    if hash != asset.sha256 {
      let _ = append_audit_internal(
        &app,
        &AppendAuditRequest {
          role: "auditor".to_string(),
          event_type: "bundle.integrity_failed".to_string(),
          payload: json!({
            "bundle_id": bundle_id,
            "asset_id": asset.asset_id,
            "expected_hash": asset.sha256,
            "actual_hash": hash,
          }),
        },
      );
      return Err(format!(
        "Bundle integrity failed for asset {} in bundle {}",
        asset.asset_id, bundle_id
      ));
    }
  }

  let ui_asset = manifest
    .assets
    .iter()
    .find(|asset| asset.asset_id == "ui-state")
    .ok_or_else(|| "Bundle missing ui-state asset".to_string())?;
  let ui_state_path = bundle_root.join(&ui_asset.bundle_relative_path);
  let ui_state_bytes = fs::read(&ui_state_path).map_err(|error| {
    format!(
      "Failed reading UI state asset {}: {error}",
      ui_state_path.display()
    )
  })?;
  let ui_state = serde_json::from_slice::<Value>(&ui_state_bytes)
    .map_err(|error| format!("Invalid UI state JSON in bundle {}: {error}", bundle_id))?;

  let _ = append_audit_internal(
    &app,
    &AppendAuditRequest {
      role: "analyst".to_string(),
      event_type: "bundle.open".to_string(),
      payload: json!({
        "bundle_id": bundle_id,
        "ui_state_hash": manifest.ui_state_hash,
      }),
    },
  )?;

  Ok(OpenBundleResult { manifest, ui_state })
}

#[tauri::command]
fn list_bundles(app: AppHandle) -> CommandResult<Vec<BundleManifest>> {
  let directory = bundles_dir(&app)?;
  let mut manifests = Vec::new();
  let read_dir = fs::read_dir(&directory)
    .map_err(|error| format!("Failed listing bundles in {}: {error}", directory.display()))?;

  for entry in read_dir {
    let entry = entry.map_err(|error| format!("Failed reading directory entry: {error}"))?;
    if !entry.path().is_dir() {
      continue;
    }
    let manifest_path = entry.path().join("manifest.json");
    if !manifest_path.exists() {
      continue;
    }
    let bytes = fs::read(&manifest_path).map_err(|error| {
      format!(
        "Failed reading bundle manifest {}: {error}",
        manifest_path.display()
      )
    })?;
    let manifest = serde_json::from_slice::<BundleManifest>(&bytes)
      .map_err(|error| format!("Invalid manifest {}: {error}", manifest_path.display()))?;
    manifests.push(manifest);
  }

  manifests.sort_by(|left, right| right.created_at.cmp(&left.created_at));
  Ok(manifests)
}

#[tauri::command]
fn append_audit_event(app: AppHandle, request: AppendAuditRequest) -> CommandResult<AuditEvent> {
  append_audit_internal(&app, &request)
}

#[tauri::command]
fn list_audit_events(app: AppHandle, limit: Option<usize>) -> CommandResult<Vec<AuditEvent>> {
  let path = audit_log_path(&app)?;
  if !path.exists() {
    return Ok(Vec::new());
  }
  let file = fs::File::open(&path)
    .map_err(|error| format!("Failed opening audit log {}: {error}", path.display()))?;
  let reader = BufReader::new(file);
  let mut events = Vec::new();
  for line in reader.lines() {
    let line = line.map_err(|error| format!("Failed reading audit log line: {error}"))?;
    if line.trim().is_empty() {
      continue;
    }
    let event = serde_json::from_str::<AuditEvent>(&line)
      .map_err(|error| format!("Invalid audit event JSON: {error}"))?;
    events.push(event);
  }

  let limit = limit.unwrap_or(200);
  if events.len() > limit {
    events = events.split_off(events.len() - limit);
  }
  Ok(events)
}

#[tauri::command]
fn get_audit_head(app: AppHandle) -> CommandResult<AuditHead> {
  read_audit_head(&app)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![
      create_bundle,
      open_bundle,
      list_bundles,
      append_audit_event,
      list_audit_events,
      get_audit_head
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[cfg(test)]
mod tests {
  use super::{ensure_valid_relative_path, sha256_hex};

  #[test]
  fn sha256_hash_is_stable() {
    let first = sha256_hex(b"stratatlas");
    let second = sha256_hex(b"stratatlas");
    assert_eq!(first, second);
    assert_eq!(first.len(), 64);
  }

  #[test]
  fn rejects_parent_directory_traversal() {
    let result = ensure_valid_relative_path("../outside.txt");
    assert!(result.is_err());
  }

  #[test]
  fn accepts_safe_relative_paths() {
    let result = ensure_valid_relative_path("assets/ui_state.json");
    assert!(result.is_ok());
  }
}
