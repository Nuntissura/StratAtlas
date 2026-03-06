use chrono::Utc;
use serde::{de::DeserializeOwned, Deserialize, Serialize};
use serde_json::{json, Map, Value};
use sha2::{Digest, Sha256};
use std::{
  fs::{self, OpenOptions},
  io::{BufRead, BufReader, Write},
  path::{Component, Path, PathBuf},
};
use tauri::{AppHandle, Manager};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
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
  marking: String,
  captured_at: String,
  provenance_refs: Vec<ProvenanceRef>,
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
#[serde(rename_all = "camelCase")]
struct RecorderState {
  workspace: Value,
  query: Value,
  context: Value,
  #[serde(default)]
  compare: Option<Value>,
  #[serde(default)]
  collaboration: Option<Value>,
  #[serde(default)]
  scenario: Option<Value>,
  #[serde(default)]
  ai: Option<Value>,
  #[serde(default)]
  deviation: Option<Value>,
  selected_bundle_id: Option<String>,
  saved_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct CreateBundleRequest {
  role: String,
  marking: String,
  state: RecorderState,
  provenance_refs: Vec<ProvenanceRef>,
  supersedes_bundle_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct OpenBundleResult {
  manifest: BundleManifest,
  state: RecorderState,
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

#[derive(Debug, Clone, Serialize, Deserialize)]
struct SaveRecorderStateRequest {
  role: String,
  state: RecorderState,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct LoadRecorderStateResult {
  state: Option<RecorderState>,
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

fn canonicalize_value(value: &Value) -> Value {
  match value {
    Value::Array(entries) => Value::Array(entries.iter().map(canonicalize_value).collect()),
    Value::Object(entries) => {
      let mut keys = entries.keys().cloned().collect::<Vec<_>>();
      keys.sort();
      let mut sorted = Map::new();
      for key in keys {
        if let Some(entry) = entries.get(&key) {
          sorted.insert(key, canonicalize_value(entry));
        }
      }
      Value::Object(sorted)
    }
    _ => value.clone(),
  }
}

fn canonical_json_bytes<T: Serialize>(value: &T) -> CommandResult<Vec<u8>> {
  let json_value =
    serde_json::to_value(value).map_err(|error| format!("JSON serialization failed: {error}"))?;
  serde_json::to_vec(&canonicalize_value(&json_value))
    .map_err(|error| format!("JSON serialization failed: {error}"))
}

fn canonical_json_string<T: Serialize>(value: &T) -> CommandResult<String> {
  String::from_utf8(canonical_json_bytes(value)?)
    .map_err(|error| format!("UTF-8 conversion failed: {error}"))
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

fn state_dir(app: &AppHandle) -> CommandResult<PathBuf> {
  let path = app_runtime_root(app)?.join("state");
  fs::create_dir_all(&path)
    .map_err(|error| format!("Failed to create state directory {}: {error}", path.display()))?;
  Ok(path)
}

fn audit_head_path(app: &AppHandle) -> CommandResult<PathBuf> {
  Ok(audit_dir(app)?.join("audit_head.json"))
}

fn audit_log_path(app: &AppHandle) -> CommandResult<PathBuf> {
  Ok(audit_dir(app)?.join("audit_log.jsonl"))
}

fn recorder_state_path(app: &AppHandle) -> CommandResult<PathBuf> {
  Ok(state_dir(app)?.join("recorder_state.json"))
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
  let payload_hash = sha256_hex(canonical_json_string(&request.payload)?.as_bytes());
  let ts = Utc::now().to_rfc3339();
  let canonical_event = json!({
    "actor_role": request.role,
    "event_type": request.event_type,
    "payload_hash": payload_hash,
    "prev_event_hash": head.event_hash,
    "ts": ts
  });
  let canonical_json = canonical_json_string(&canonical_event)?;
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
  let line = canonical_json_string(&event)?;
  writeln!(log_file, "{line}")
    .map_err(|error| format!("Failed writing audit log {}: {error}", log_path.display()))?;

  let head_path = audit_head_path(app)?;
  let serialized_head = canonical_json_string(&AuditHead {
    event_hash: Some(event_hash),
  })?;
  fs::write(&head_path, serialized_head)
    .map_err(|error| format!("Failed writing audit head {}: {error}", head_path.display()))?;

  Ok(event)
}

fn save_recorder_state_internal(app: &AppHandle, state: &RecorderState) -> CommandResult<RecorderState> {
  let path = recorder_state_path(app)?;
  let bytes = canonical_json_bytes(state)?;
  fs::write(&path, bytes)
    .map_err(|error| format!("Failed writing recorder state {}: {error}", path.display()))?;
  Ok(state.clone())
}

fn write_bundle_asset<T: Serialize>(
  bundle_root: &Path,
  asset_id: &str,
  relative_path: &str,
  value: &T,
  marking: &str,
  provenance_refs: &[ProvenanceRef],
  captured_at: &str,
) -> CommandResult<BundleAsset> {
  ensure_valid_relative_path(relative_path)?;
  let path = bundle_root.join(relative_path);
  if let Some(parent) = path.parent() {
    fs::create_dir_all(parent)
      .map_err(|error| format!("Failed creating asset directory {}: {error}", parent.display()))?;
  }

  let bytes = canonical_json_bytes(value)?;
  fs::write(&path, &bytes)
    .map_err(|error| format!("Failed writing bundle asset {}: {error}", path.display()))?;

  Ok(BundleAsset {
    asset_id: asset_id.to_string(),
    sha256: sha256_hex(&bytes),
    media_type: "application/json".to_string(),
    size_bytes: u64::try_from(bytes.len())
      .map_err(|error| format!("Failed computing asset size: {error}"))?,
    bundle_relative_path: relative_path.to_string(),
    marking: marking.to_string(),
    captured_at: captured_at.to_string(),
    provenance_refs: provenance_refs.to_vec(),
  })
}

fn read_bundle_asset_bytes(bundle_root: &Path, asset: &BundleAsset) -> CommandResult<Vec<u8>> {
  ensure_valid_relative_path(&asset.bundle_relative_path)?;
  let asset_path = bundle_root.join(&asset.bundle_relative_path);
  fs::read(&asset_path)
    .map_err(|error| format!("Failed reading bundle asset {}: {error}", asset_path.display()))
}

fn read_bundle_asset_json<T: DeserializeOwned>(
  bundle_root: &Path,
  asset: &BundleAsset,
  bundle_id: &str,
  label: &str,
) -> CommandResult<T> {
  let bytes = read_bundle_asset_bytes(bundle_root, asset)?;
  serde_json::from_slice::<T>(&bytes)
    .map_err(|error| format!("Invalid {label} JSON in bundle {bundle_id}: {error}"))
}

fn append_integrity_failure(
  app: &AppHandle,
  bundle_id: &str,
  asset_id: &str,
  detail: Value,
) -> CommandResult<()> {
  let _ = append_audit_internal(
    app,
    &AppendAuditRequest {
      role: "auditor".to_string(),
      event_type: "bundle.integrity_failed".to_string(),
      payload: json!({
        "bundle_id": bundle_id,
        "asset_id": asset_id,
        "detail": detail,
      }),
    },
  )?;
  Ok(())
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
  fs::create_dir_all(&bundle_root).map_err(|error| {
    format!(
      "Failed creating bundle directory {}: {error}",
      bundle_root.display()
    )
  })?;

  let captured_at = Utc::now().to_rfc3339();
  let workspace_asset = write_bundle_asset(
    &bundle_root,
    "workspace-state",
    "assets/workspace_state.json",
    &request.state.workspace,
    &request.marking,
    &request.provenance_refs,
    &captured_at,
  )?;
  let query_asset = write_bundle_asset(
    &bundle_root,
    "query-state",
    "assets/query_state.json",
    &request.state.query,
    &request.marking,
    &request.provenance_refs,
    &captured_at,
  )?;
  let context_asset = write_bundle_asset(
    &bundle_root,
    "context-snapshot",
    "assets/context_snapshot.json",
    &request.state.context,
    &request.marking,
    &request.provenance_refs,
    &captured_at,
  )?;
  let compare_asset = write_bundle_asset(
    &bundle_root,
    "compare-state",
    "assets/compare_state.json",
    &request.state.compare.clone().unwrap_or(Value::Null),
    &request.marking,
    &request.provenance_refs,
    &captured_at,
  )?;
  let collaboration_asset = write_bundle_asset(
    &bundle_root,
    "collaboration-state",
    "assets/collaboration_state.json",
    &request.state.collaboration.clone().unwrap_or(Value::Null),
    &request.marking,
    &request.provenance_refs,
    &captured_at,
  )?;
  let scenario_asset = write_bundle_asset(
    &bundle_root,
    "scenario-state",
    "assets/scenario_state.json",
    &request.state.scenario.clone().unwrap_or(Value::Null),
    &request.marking,
    &request.provenance_refs,
    &captured_at,
  )?;
  let ai_asset = write_bundle_asset(
    &bundle_root,
    "ai-state",
    "assets/ai_state.json",
    &request.state.ai.clone().unwrap_or(Value::Null),
    &request.marking,
    &request.provenance_refs,
    &captured_at,
  )?;
  let deviation_asset = write_bundle_asset(
    &bundle_root,
    "deviation-state",
    "assets/deviation_state.json",
    &request.state.deviation.clone().unwrap_or(Value::Null),
    &request.marking,
    &request.provenance_refs,
    &captured_at,
  )?;
  let recorder_asset = write_bundle_asset(
    &bundle_root,
    "recorder-state",
    "assets/recorder_state.json",
    &request.state,
    &request.marking,
    &request.provenance_refs,
    &captured_at,
  )?;

  let assets = vec![
    workspace_asset.clone(),
    query_asset.clone(),
    context_asset.clone(),
    compare_asset.clone(),
    collaboration_asset.clone(),
    scenario_asset.clone(),
    ai_asset.clone(),
    deviation_asset.clone(),
    recorder_asset.clone(),
  ];

  let manifest = BundleManifest {
    bundle_id: bundle_id.clone(),
    created_at: Utc::now().to_rfc3339(),
    created_by_role: request.role.clone(),
    marking: request.marking.clone(),
    assets: assets.clone(),
    ui_state_hash: workspace_asset.sha256.clone(),
    derived_artifact_hashes: assets.iter().map(|asset| asset.sha256.clone()).collect(),
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

  let _ = save_recorder_state_internal(&app, &request.state)?;

  let _ = append_audit_internal(
    &app,
    &AppendAuditRequest {
      role: request.role,
      event_type: "bundle.create".to_string(),
      payload: json!({
        "bundle_id": bundle_id,
        "marking": request.marking,
        "asset_ids": manifest.assets.iter().map(|asset| asset.asset_id.clone()).collect::<Vec<_>>(),
      }),
    },
  )?;

  Ok(manifest)
}

#[tauri::command]
fn open_bundle(app: AppHandle, bundle_id: String, role: String) -> CommandResult<OpenBundleResult> {
  if !is_valid_role(&role) {
    return Err(format!("Invalid role: {role}"));
  }

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
    let bytes = read_bundle_asset_bytes(&bundle_root, asset)?;
    let hash = sha256_hex(&bytes);
    if hash != asset.sha256 {
      append_integrity_failure(
        &app,
        &bundle_id,
        &asset.asset_id,
        json!({
          "expected_hash": asset.sha256,
          "actual_hash": hash,
        }),
      )?;
      return Err(format!(
        "Bundle integrity failed for asset {} in bundle {}",
        asset.asset_id, bundle_id
      ));
    }
  }

  let workspace_asset = manifest
    .assets
    .iter()
    .find(|asset| asset.asset_id == "workspace-state")
    .ok_or_else(|| "Bundle missing workspace-state asset".to_string())?;
  let query_asset = manifest
    .assets
    .iter()
    .find(|asset| asset.asset_id == "query-state")
    .ok_or_else(|| "Bundle missing query-state asset".to_string())?;
  let context_asset = manifest
    .assets
    .iter()
    .find(|asset| asset.asset_id == "context-snapshot")
    .ok_or_else(|| "Bundle missing context-snapshot asset".to_string())?;
  let recorder_asset = manifest
    .assets
    .iter()
    .find(|asset| asset.asset_id == "recorder-state")
    .ok_or_else(|| "Bundle missing recorder-state asset".to_string())?;

  let recorder_state = read_bundle_asset_json::<RecorderState>(
    &bundle_root,
    recorder_asset,
    &bundle_id,
    "recorder state",
  )?;
  let workspace_hash = sha256_hex(&canonical_json_bytes(&recorder_state.workspace)?);
  let query_hash = sha256_hex(&canonical_json_bytes(&recorder_state.query)?);
  let context_hash = sha256_hex(&canonical_json_bytes(&recorder_state.context)?);

  if workspace_hash != workspace_asset.sha256 {
    append_integrity_failure(
      &app,
      &bundle_id,
      "recorder-state",
      json!({
        "expected_workspace_hash": workspace_asset.sha256,
        "actual_workspace_hash": workspace_hash,
      }),
    )?;
    return Err("Recorder state asset does not match workspace-state asset".to_string());
  }
  if query_hash != query_asset.sha256 {
    append_integrity_failure(
      &app,
      &bundle_id,
      "recorder-state",
      json!({
        "expected_query_hash": query_asset.sha256,
        "actual_query_hash": query_hash,
      }),
    )?;
    return Err("Recorder state asset does not match query-state asset".to_string());
  }
  if context_hash != context_asset.sha256 {
    append_integrity_failure(
      &app,
      &bundle_id,
      "recorder-state",
      json!({
        "expected_context_hash": context_asset.sha256,
        "actual_context_hash": context_hash,
      }),
    )?;
    return Err("Recorder state asset does not match context-snapshot asset".to_string());
  }
  if let Some(compare_asset) = manifest
    .assets
    .iter()
    .find(|asset| asset.asset_id == "compare-state")
  {
    let recorder_compare = recorder_state.compare.clone().unwrap_or(Value::Null);
    let compare_hash = sha256_hex(&canonical_json_bytes(&recorder_compare)?);
    if compare_hash != compare_asset.sha256 {
      append_integrity_failure(
        &app,
        &bundle_id,
        "recorder-state",
        json!({
          "expected_compare_hash": compare_asset.sha256,
          "actual_compare_hash": compare_hash,
        }),
      )?;
      return Err("Recorder state asset does not match compare-state asset".to_string());
    }
  }
  if let Some(collaboration_asset) = manifest
    .assets
    .iter()
    .find(|asset| asset.asset_id == "collaboration-state")
  {
    let recorder_collaboration = recorder_state.collaboration.clone().unwrap_or(Value::Null);
    let collaboration_hash = sha256_hex(&canonical_json_bytes(&recorder_collaboration)?);
    if collaboration_hash != collaboration_asset.sha256 {
      append_integrity_failure(
        &app,
        &bundle_id,
        "recorder-state",
        json!({
          "expected_collaboration_hash": collaboration_asset.sha256,
          "actual_collaboration_hash": collaboration_hash,
        }),
      )?;
      return Err(
        "Recorder state asset does not match collaboration-state asset".to_string()
      );
    }
  }
  if let Some(scenario_asset) = manifest
    .assets
    .iter()
    .find(|asset| asset.asset_id == "scenario-state")
  {
    let recorder_scenario = recorder_state.scenario.clone().unwrap_or(Value::Null);
    let scenario_hash = sha256_hex(&canonical_json_bytes(&recorder_scenario)?);
    if scenario_hash != scenario_asset.sha256 {
      append_integrity_failure(
        &app,
        &bundle_id,
        "recorder-state",
        json!({
          "expected_scenario_hash": scenario_asset.sha256,
          "actual_scenario_hash": scenario_hash,
        }),
      )?;
      return Err("Recorder state asset does not match scenario-state asset".to_string());
    }
  }
  if let Some(ai_asset) = manifest
    .assets
    .iter()
    .find(|asset| asset.asset_id == "ai-state")
  {
    let recorder_ai = recorder_state.ai.clone().unwrap_or(Value::Null);
    let ai_hash = sha256_hex(&canonical_json_bytes(&recorder_ai)?);
    if ai_hash != ai_asset.sha256 {
      append_integrity_failure(
        &app,
        &bundle_id,
        "recorder-state",
        json!({
          "expected_ai_hash": ai_asset.sha256,
          "actual_ai_hash": ai_hash,
        }),
      )?;
      return Err("Recorder state asset does not match ai-state asset".to_string());
    }
  }
  if let Some(deviation_asset) = manifest
    .assets
    .iter()
    .find(|asset| asset.asset_id == "deviation-state")
  {
    let recorder_deviation = recorder_state.deviation.clone().unwrap_or(Value::Null);
    let deviation_hash = sha256_hex(&canonical_json_bytes(&recorder_deviation)?);
    if deviation_hash != deviation_asset.sha256 {
      append_integrity_failure(
        &app,
        &bundle_id,
        "recorder-state",
        json!({
          "expected_deviation_hash": deviation_asset.sha256,
          "actual_deviation_hash": deviation_hash,
        }),
      )?;
      return Err("Recorder state asset does not match deviation-state asset".to_string());
    }
  }

  let _ = save_recorder_state_internal(&app, &recorder_state)?;

  let _ = append_audit_internal(
    &app,
    &AppendAuditRequest {
      role,
      event_type: "bundle.open".to_string(),
      payload: json!({
        "bundle_id": bundle_id,
        "ui_state_hash": manifest.ui_state_hash,
        "asset_ids": manifest.assets.iter().map(|asset| asset.asset_id.clone()).collect::<Vec<_>>(),
      }),
    },
  )?;

  Ok(OpenBundleResult {
    manifest,
    state: recorder_state,
  })
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

#[tauri::command]
fn save_recorder_state(app: AppHandle, request: SaveRecorderStateRequest) -> CommandResult<RecorderState> {
  if !is_valid_role(&request.role) {
    return Err(format!("Invalid role: {}", request.role));
  }
  save_recorder_state_internal(&app, &request.state)
}

#[tauri::command]
fn load_recorder_state(app: AppHandle) -> CommandResult<LoadRecorderStateResult> {
  let path = recorder_state_path(&app)?;
  if !path.exists() {
    return Ok(LoadRecorderStateResult { state: None });
  }
  let bytes = fs::read(&path)
    .map_err(|error| format!("Failed reading recorder state {}: {error}", path.display()))?;
  let state = serde_json::from_slice::<RecorderState>(&bytes)
    .map_err(|error| format!("Invalid recorder state {}: {error}", path.display()))?;
  Ok(LoadRecorderStateResult { state: Some(state) })
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
      get_audit_head,
      save_recorder_state,
      load_recorder_state
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[cfg(test)]
mod tests {
  use super::{canonical_json_bytes, ensure_valid_relative_path, sha256_hex, ProvenanceRef};
  use serde_json::json;

  #[test]
  fn sha256_hash_is_stable() {
    let first = sha256_hex(b"stratatlas");
    let second = sha256_hex(b"stratatlas");
    assert_eq!(first, second);
    assert_eq!(first.len(), 64);
  }

  #[test]
  fn canonical_json_sorting_is_stable_for_nested_objects() {
    let first = json!({
      "b": 2,
      "a": {
        "d": 4,
        "c": 3
      }
    });
    let second = json!({
      "a": {
        "c": 3,
        "d": 4
      },
      "b": 2
    });

    assert_eq!(
      canonical_json_bytes(&first).expect("canonicalize first"),
      canonical_json_bytes(&second).expect("canonicalize second")
    );
  }

  #[test]
  fn provenance_ref_accepts_camel_case_fields() {
    let value = json!({
      "source": "test",
      "license": "internal",
      "retrievedAt": "2026-03-06T00:00:00Z",
      "pipelineVersion": "i0-002"
    });

    let parsed: ProvenanceRef = serde_json::from_value(value).expect("parse provenance ref");
    assert_eq!(parsed.retrieved_at, "2026-03-06T00:00:00Z");
    assert_eq!(parsed.pipeline_version, "i0-002");
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
