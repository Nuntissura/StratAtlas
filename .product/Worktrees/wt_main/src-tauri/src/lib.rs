use chrono::{DateTime, Utc};
use postgres::{Client, NoTls};
use reqwest::header::{AUTHORIZATION, CONTENT_TYPE, USER_AGENT};
use serde::{de::DeserializeOwned, Deserialize, Serialize};
use serde_json::{json, Map, Value};
use sha2::{Digest, Sha256};
use std::{
  env,
  fs::{self, OpenOptions},
  io::{BufRead, BufReader, Write},
  path::{Component, Path, PathBuf},
  process::{Command, Stdio},
  time::Duration,
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
  #[serde(default)]
  osint: Option<Value>,
  #[serde(default)]
  game_model: Option<Value>,
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

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct BundleRegistryEntry {
  bundle_id: String,
  created_at: String,
  created_by_role: String,
  marking: String,
  ui_state_hash: String,
  manifest_artifact_hash: String,
  asset_count: usize,
  supersedes_bundle_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct GovernedDeploymentProfile {
  id: String,
  label: String,
  identity_mode: String,
  key_management: String,
  storage_placement: String,
  audit_retention: String,
  ai_enabled: bool,
  mcp_enabled: bool,
  external_ai_access_enabled: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ControlPlaneState {
  active_deployment_profile_id: String,
  deployment_profiles: Vec<GovernedDeploymentProfile>,
  bundle_registry: Vec<BundleRegistryEntry>,
  context_domain_registry: Vec<Value>,
  correlation_links: Vec<Value>,
  storage_backend: String,
  context_store_backend: String,
  artifact_store_path: String,
  updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ContextTimeRange {
  start: String,
  end: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct QueryContextRecordsRequest {
  domain_ids: Vec<String>,
  target_id: String,
  time_range: ContextTimeRange,
  limit: Option<usize>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct QueryContextRecordsResult {
  records: Vec<Value>,
  query_range: ContextTimeRange,
  total_records: usize,
  source: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct FetchCommercialAirTrafficRequest {
  focus_aoi_id: String,
  focus_aoi_label: String,
  min_lat: f64,
  min_lon: f64,
  max_lat: f64,
  max_lon: f64,
  max_flights: Option<usize>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AirTrafficFlight {
  flight_id: String,
  icao24: String,
  callsign: String,
  origin_country: String,
  coordinates: [f64; 2],
  altitude_ft: Option<f64>,
  velocity_kts: Option<f64>,
  heading_deg: Option<f64>,
  vertical_rate_fpm: Option<f64>,
  on_ground: bool,
  last_contact_at: String,
  truth_label: String,
  source_state: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct FetchCommercialAirTrafficResult {
  provider_label: String,
  source_url: String,
  source_license: String,
  focus_aoi_id: String,
  focus_aoi_label: String,
  retrieved_at: String,
  source_state: String,
  status_detail: String,
  flights: Vec<AirTrafficFlight>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct FetchSatelliteElementsRequest {
  focus_aoi_id: String,
  focus_aoi_label: String,
  norad_cat_ids: Vec<u32>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct GovernedSatelliteElement {
  norad_cat_id: u32,
  object_name: String,
  object_id: Option<String>,
  epoch: String,
  mean_motion: f64,
  eccentricity: f64,
  inclination: f64,
  ra_of_asc_node: f64,
  arg_of_pericenter: f64,
  mean_anomaly: f64,
  ephemeris_type: Option<i64>,
  classification_type: Option<String>,
  element_set_no: Option<i64>,
  rev_at_epoch: Option<i64>,
  bstar: Option<f64>,
  mean_motion_dot: Option<f64>,
  mean_motion_ddot: Option<f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct FetchSatelliteElementsResult {
  provider_label: String,
  source_url: String,
  source_license: String,
  focus_aoi_id: String,
  focus_aoi_label: String,
  retrieved_at: String,
  source_state: String,
  status_detail: String,
  elements: Vec<GovernedSatelliteElement>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct WriteMapExportArtifactRequest {
  artifact_id: String,
  file_name: String,
  png_bytes: Vec<u8>,
  marking: String,
  bundle_id: Option<String>,
  focus_aoi_id: String,
  surface_mode: String,
  runtime_engine: String,
  width: u32,
  height: u32,
  generated_at: String,
  visible_layer_count: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct MapExportArtifact {
  artifact_id: String,
  file_name: String,
  png_path: String,
  metadata_path: String,
  sha256: String,
  size_bytes: u64,
  width: u32,
  height: u32,
  generated_at: String,
  marking: String,
  bundle_id: Option<String>,
  focus_aoi_id: String,
  surface_mode: String,
  runtime_engine: String,
  visible_layer_count: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct StrategicSolverRequest {
  role: String,
  snapshot: Value,
  #[serde(alias = "bundle_refs")]
  bundle_refs: Vec<String>,
  #[serde(alias = "linked_scenario_ids")]
  linked_scenario_ids: Vec<String>,
  #[serde(default)]
  #[serde(alias = "context_targets")]
  context_targets: Vec<String>,
  #[serde(default)]
  #[serde(alias = "context_record_ids")]
  context_record_ids: Vec<String>,
  #[serde(default)]
  #[serde(alias = "context_domain_ids")]
  context_domain_ids: Vec<String>,
  #[serde(default)]
  #[serde(alias = "correlation_target_ids")]
  correlation_target_ids: Vec<String>,
  #[serde(default)]
  #[serde(alias = "threshold_ref_ids")]
  threshold_ref_ids: Vec<String>,
  #[serde(alias = "deviation_event_id")]
  deviation_event_id: Option<String>,
  #[serde(alias = "osint_alert_id")]
  osint_alert_id: Option<String>,
  #[serde(alias = "executed_at")]
  executed_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct StrategicSolverResult {
  runtime: String,
  snapshot: Value,
  audit_event_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AiGatewayProviderStatus {
  runtime: String,
  available: bool,
  provider_label: String,
  model: String,
  detail: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AiGatewayProviderAnalysisRequest {
  deployment_profile: String,
  marking: String,
  prompt: String,
  refs: Vec<Value>,
  citations: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AiGatewayProviderAnalysisResult {
  runtime: String,
  provider_label: String,
  model: String,
  output_text: String,
  request_id: Option<String>,
  degraded: bool,
  generated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
enum RuntimeSmokePhase {
  Cold,
  Warm,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct RuntimeSmokeWindowSnapshot {
  title: String,
  width: u32,
  height: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct RuntimeSmokeRegionCheck {
  id: String,
  present: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct RuntimeSmokeAssertion {
  id: String,
  passed: bool,
  detail: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct RuntimeSmokeMetric {
  label: String,
  measured_ms: u64,
  budget_ms: Option<u64>,
  passed: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct RuntimeSmokeReport {
  phase: RuntimeSmokePhase,
  captured_at: String,
  startup_ms: u64,
  flow_duration_ms: u64,
  window: RuntimeSmokeWindowSnapshot,
  mode: String,
  selected_bundle_id: Option<String>,
  bundle_count: usize,
  active_layer_count: usize,
  degraded_budget_count: usize,
  offline: bool,
  status: String,
  integrity_state: String,
  scenario_export_artifact_id: Option<String>,
  briefing_artifact_id: Option<String>,
  map_export_artifact_id: Option<String>,
  map_export_png_path: Option<String>,
  map_export_metadata_path: Option<String>,
  map_export_sha256: Option<String>,
  audit_event_count: usize,
  platform: String,
  map_runtime_visible: bool,
  map_runtime_interactive: bool,
  map_surface_mode: String,
  map_runtime_engine: String,
  map_planar_ready: bool,
  map_orbital_ready: bool,
  map_focus_aoi_id: String,
  map_inspect_count: usize,
  map_runtime_error: Option<String>,
  map_osint_inspect_visible: bool,
  map_model_inspect_visible: bool,
  active_context_domain_count: usize,
  context_record_count: usize,
  correlation_aoi: String,
  governed_context_domain_id: Option<String>,
  osint_source_mode: Option<String>,
  osint_selected_connector_id: Option<String>,
  osint_latest_connector_id: Option<String>,
  osint_alert_count: usize,
  osint_event_count: usize,
  osint_threshold_ref_count: usize,
  osint_deviation_event_id: Option<String>,
  game_solver_runtime: Option<String>,
  game_latest_run_id: Option<String>,
  game_experiment_bundle_id: Option<String>,
  game_scenario_evaluation_count: usize,
  require_live_ai: bool,
  require_mcp: bool,
  ai_provider_label: String,
  ai_provider_runtime: String,
  ai_provider_available: bool,
  ai_provider_detail: String,
  ai_artifact_id: Option<String>,
  ai_request_id: Option<String>,
  ai_gateway_runtime: Option<String>,
  mcp_invocation_id: Option<String>,
  mcp_invocation_status: Option<String>,
  mcp_tool_name: Option<String>,
  regions: Vec<RuntimeSmokeRegionCheck>,
  assertions: Vec<RuntimeSmokeAssertion>,
  metrics: Vec<RuntimeSmokeMetric>,
  notes: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct WriteRuntimeSmokeEvidenceRequest {
  phase: RuntimeSmokePhase,
  report: RuntimeSmokeReport,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct RuntimeSmokeEvidenceResult {
  phase_dir: String,
  report_path: String,
  runtime_proof_dir: String,
}

type CommandResult<T> = Result<T, String>;

fn is_valid_role(role: &str) -> bool {
  matches!(role, "viewer" | "analyst" | "administrator" | "auditor")
}

fn is_valid_marking(marking: &str) -> bool {
  matches!(marking, "PUBLIC" | "INTERNAL" | "RESTRICTED")
}

const DEFAULT_AI_PROVIDER_LABEL: &str = "OpenAI Responses API";
const DEFAULT_AI_PROVIDER_MODEL: &str = "gpt-4.1-mini";
const DEFAULT_AI_PROVIDER_ENDPOINT: &str = "https://api.openai.com/v1/responses";
const DEFAULT_CODEX_PROVIDER_LABEL: &str = "Codex CLI";
const DEFAULT_CODEX_PROVIDER_MODEL: &str = "account-default";
const DEFAULT_CODEX_REASONING_EFFORT: &str = "low";
const DEFAULT_AI_PROVIDER_SELECTION: &str = "auto";

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum LiveAiProviderKind {
  CodexCli,
  OpenAiResponses,
}

#[derive(Debug, Clone)]
struct ResolvedAiProvider {
  kind: LiveAiProviderKind,
  status: AiGatewayProviderStatus,
}

fn requested_ai_provider() -> String {
  env::var("STRATATLAS_AI_PROVIDER")
    .ok()
    .map(|value| value.trim().to_ascii_lowercase())
    .filter(|value| !value.is_empty())
    .unwrap_or_else(|| DEFAULT_AI_PROVIDER_SELECTION.to_string())
}

fn openai_provider_status() -> AiGatewayProviderStatus {
  let api_key = env::var("STRATATLAS_OPENAI_API_KEY").ok();
  let model = env::var("STRATATLAS_OPENAI_MODEL")
    .ok()
    .filter(|value| !value.trim().is_empty())
    .unwrap_or_else(|| DEFAULT_AI_PROVIDER_MODEL.to_string());

  match api_key {
    Some(key) if !key.trim().is_empty() => AiGatewayProviderStatus {
      runtime: "tauri-live".to_string(),
      available: true,
      provider_label: DEFAULT_AI_PROVIDER_LABEL.to_string(),
      model,
      detail: format!(
        "{} is configured through the governed Tauri runtime.",
        DEFAULT_AI_PROVIDER_LABEL
      ),
    },
    _ => AiGatewayProviderStatus {
      runtime: "tauri-unconfigured".to_string(),
      available: false,
      provider_label: DEFAULT_AI_PROVIDER_LABEL.to_string(),
      model,
      detail:
        "Set STRATATLAS_OPENAI_API_KEY to enable governed live AI calls through the Tauri runtime."
          .to_string(),
    },
  }
}

fn codex_provider_model() -> String {
  env::var("STRATATLAS_CODEX_MODEL")
    .ok()
    .filter(|value| !value.trim().is_empty())
    .unwrap_or_else(|| DEFAULT_CODEX_PROVIDER_MODEL.to_string())
}

fn codex_reasoning_effort() -> String {
  env::var("STRATATLAS_CODEX_REASONING_EFFORT")
    .ok()
    .filter(|value| !value.trim().is_empty())
    .unwrap_or_else(|| DEFAULT_CODEX_REASONING_EFFORT.to_string())
}

fn resolve_codex_script() -> Option<PathBuf> {
  if let Ok(explicit) = env::var("STRATATLAS_CODEX_SCRIPT") {
    let candidate = PathBuf::from(explicit);
    if candidate.exists() {
      return Some(candidate);
    }
  }

  let mut candidates = Vec::new();
  if let Ok(app_data) = env::var("APPDATA") {
    candidates.push(
      PathBuf::from(&app_data)
        .join("npm")
        .join("node_modules")
        .join("@openai")
        .join("codex")
        .join("bin")
        .join("codex.js"),
    );
  }
  if let Ok(user_profile) = env::var("USERPROFILE") {
    candidates.push(
      PathBuf::from(&user_profile)
        .join("AppData")
        .join("Roaming")
        .join("npm")
        .join("node_modules")
        .join("@openai")
        .join("codex")
        .join("bin")
        .join("codex.js"),
    );
  }

  candidates.into_iter().find(|candidate| candidate.exists())
}

fn build_codex_command() -> Command {
  if let Some(script_path) = resolve_codex_script() {
    let mut node_candidates = Vec::new();
    if let Ok(app_data) = env::var("APPDATA") {
      node_candidates.push(PathBuf::from(&app_data).join("npm").join("node.exe"));
    }
    let node_program = node_candidates
      .into_iter()
      .find(|candidate| candidate.exists())
      .unwrap_or_else(|| PathBuf::from("node"));
    let mut command = Command::new(node_program);
    command.arg(script_path);
    return command;
  }

  Command::new("codex")
}

fn codex_login_status_output() -> CommandResult<String> {
  let output = build_codex_command()
    .args(["login", "status"])
    .output()
    .map_err(|error| format!("Failed to execute Codex CLI login probe: {error}"))?;

  let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
  let stderr = String::from_utf8_lossy(&output.stderr).trim().to_string();
  let combined = [stdout.as_str(), stderr.as_str()]
    .iter()
    .filter(|value| !value.is_empty())
    .cloned()
    .collect::<Vec<_>>()
    .join("\n");

  if !output.status.success() {
    let detail = if combined.is_empty() {
      "Codex CLI login probe failed.".to_string()
    } else {
      combined
    };
    return Err(detail);
  }

  Ok(combined)
}

fn codex_provider_status() -> AiGatewayProviderStatus {
  let model = codex_provider_model();
  match codex_login_status_output() {
    Ok(detail) => {
      let provider_label = if detail.contains("ChatGPT") {
        "Codex CLI (ChatGPT login)"
      } else {
        DEFAULT_CODEX_PROVIDER_LABEL
      };
      AiGatewayProviderStatus {
        runtime: "tauri-live".to_string(),
        available: true,
        provider_label: provider_label.to_string(),
        model,
        detail: format!("{provider_label} is available through the governed Tauri runtime."),
      }
    }
    Err(_) => AiGatewayProviderStatus {
      runtime: "tauri-unconfigured".to_string(),
      available: false,
      provider_label: DEFAULT_CODEX_PROVIDER_LABEL.to_string(),
      model,
      detail:
        "Codex CLI is not installed or not logged in. Run `codex login` to enable governed live AI calls through your ChatGPT plan."
          .to_string(),
    },
  }
}

fn resolve_ai_provider() -> ResolvedAiProvider {
  let requested = requested_ai_provider();
  let codex = codex_provider_status();
  let openai = openai_provider_status();

  match requested.as_str() {
    "codex_cli" => ResolvedAiProvider {
      kind: LiveAiProviderKind::CodexCli,
      status: codex,
    },
    "openai_responses" | "openai_api" => ResolvedAiProvider {
      kind: LiveAiProviderKind::OpenAiResponses,
      status: openai,
    },
    _ => {
      if codex.available {
        ResolvedAiProvider {
          kind: LiveAiProviderKind::CodexCli,
          status: codex,
        }
      } else {
        ResolvedAiProvider {
          kind: LiveAiProviderKind::OpenAiResponses,
          status: openai,
        }
      }
    }
  }
}

fn ai_provider_status_from_env() -> AiGatewayProviderStatus {
  resolve_ai_provider().status
}

fn build_ai_gateway_user_prompt(request: &AiGatewayProviderAnalysisRequest) -> String {
  let citations = if request.citations.is_empty() {
    "No citations provided".to_string()
  } else {
    request.citations.join("\n- ")
  };

  format!(
    concat!(
      "Provide a concise derived interpretation for StratAtlas.\n",
      "Treat all cited material as evidence references, not raw files.\n",
      "Do not request file paths, database access, or uncited sources.\n",
      "Mark output as interpretive and bounded by the cited evidence.\n\n",
      "Deployment profile: {deployment_profile}\n",
      "Marking: {marking}\n",
      "Evidence refs: {ref_count}\n",
      "Citations:\n- {citations}\n\n",
      "Analyst prompt:\n{prompt}"
    ),
    deployment_profile = request.deployment_profile,
    marking = request.marking,
    ref_count = request.refs.len(),
    citations = citations,
    prompt = request.prompt
  )
}

fn extract_ai_gateway_output_text(response_json: &Value) -> CommandResult<String> {
  if let Some(text) = response_json.get("output_text").and_then(Value::as_str) {
    let trimmed = text.trim();
    if !trimmed.is_empty() {
      return Ok(trimmed.to_string());
    }
  }

  let mut parts = Vec::new();
  if let Some(output) = response_json.get("output").and_then(Value::as_array) {
    for item in output {
      if let Some(content) = item.get("content").and_then(Value::as_array) {
        for entry in content {
          if let Some(text) = entry.get("text").and_then(Value::as_str) {
            let trimmed = text.trim();
            if !trimmed.is_empty() {
              parts.push(trimmed.to_string());
            }
          }
        }
      }
    }
  }

  if parts.is_empty() {
    return Err("AI provider response did not include output text".to_string());
  }

  Ok(parts.join("\n\n"))
}

fn run_codex_cli_provider_analysis(
  request: &AiGatewayProviderAnalysisRequest,
  status: &AiGatewayProviderStatus,
) -> CommandResult<AiGatewayProviderAnalysisResult> {
  let output_path = env::temp_dir().join(format!("stratatlas-ai-{}.txt", Uuid::now_v7()));
  let prompt = build_ai_gateway_user_prompt(request);
  let working_directory = env::temp_dir();
  let requested_model = env::var("STRATATLAS_CODEX_MODEL")
    .ok()
    .filter(|value| !value.trim().is_empty());
  let reasoning_effort = codex_reasoning_effort();

  let mut command = build_codex_command();
  command.arg("exec");
  command.arg("-c");
  command.arg(format!("model_reasoning_effort=\"{reasoning_effort}\""));
  command.args([
    "--color",
    "never",
    "--sandbox",
    "read-only",
    "--skip-git-repo-check",
    "--ephemeral",
    "--output-last-message",
  ]);
  command.arg(&output_path);
  if let Some(model) = requested_model.as_ref() {
    command.args(["-m", model]);
  }
  command.arg(prompt);
  command.current_dir(&working_directory);

  command.stdout(Stdio::null());
  command.stderr(Stdio::null());

  let exit_status = command
    .status()
    .map_err(|error| format!("Failed to execute Codex CLI provider: {error}"))?;

  if !exit_status.success() {
    let _ = fs::remove_file(&output_path);
    return Err(format!(
      "Governed Codex CLI provider failed with exit code {}",
      exit_status.code().unwrap_or(1)
    ));
  }

  let output_text = fs::read_to_string(&output_path)
    .map_err(|error| format!("Failed to read Codex CLI provider output {}: {error}", output_path.display()))?;
  let _ = fs::remove_file(&output_path);
  let trimmed_output = output_text.trim().to_string();
  if trimmed_output.is_empty() {
    return Err("Codex CLI provider returned an empty response".to_string());
  }

  Ok(AiGatewayProviderAnalysisResult {
    runtime: "tauri-live".to_string(),
    provider_label: status.provider_label.clone(),
    model: status.model.clone(),
    output_text: trimmed_output,
    request_id: None,
    degraded: false,
    generated_at: Utc::now().to_rfc3339(),
  })
}

async fn run_openai_provider_analysis(
  request: &AiGatewayProviderAnalysisRequest,
  status: &AiGatewayProviderStatus,
) -> CommandResult<AiGatewayProviderAnalysisResult> {
  let api_key = env::var("STRATATLAS_OPENAI_API_KEY")
    .map_err(|_| "Missing STRATATLAS_OPENAI_API_KEY for live AI provider access".to_string())?;
  let endpoint = env::var("STRATATLAS_OPENAI_BASE_URL")
    .ok()
    .filter(|value| !value.trim().is_empty())
    .unwrap_or_else(|| DEFAULT_AI_PROVIDER_ENDPOINT.to_string());
  let timeout_ms = env::var("STRATATLAS_OPENAI_TIMEOUT_MS")
    .ok()
    .and_then(|value| value.parse::<u64>().ok())
    .unwrap_or(60_000);

  let client = reqwest::Client::builder()
    .timeout(Duration::from_millis(timeout_ms))
    .build()
    .map_err(|error| format!("Failed to construct governed AI client: {error}"))?;

  let body = json!({
    "model": status.model,
    "input": [
      {
        "role": "user",
        "content": build_ai_gateway_user_prompt(request),
      }
    ]
  });

  let response = client
    .post(endpoint)
    .header(AUTHORIZATION, format!("Bearer {api_key}"))
    .header(CONTENT_TYPE, "application/json")
    .json(&body)
    .send()
    .await
    .map_err(|error| format!("Governed AI provider request failed: {error}"))?;

  let status_code = response.status();
  let response_json = response
    .json::<Value>()
    .await
    .map_err(|error| format!("Failed to parse governed AI provider response: {error}"))?;

  if !status_code.is_success() {
    let response_body = response_json.to_string();
    let truncated = response_body.chars().take(280).collect::<String>();
    return Err(format!(
      "Governed AI provider returned HTTP {}: {}",
      status_code.as_u16(),
      truncated
    ));
  }

  let output_text = extract_ai_gateway_output_text(&response_json)?;
  let request_id = response_json
    .get("id")
    .and_then(Value::as_str)
    .map(|value| value.to_string());

  Ok(AiGatewayProviderAnalysisResult {
    runtime: "tauri-live".to_string(),
    provider_label: status.provider_label.clone(),
    model: status.model.clone(),
    output_text,
    request_id,
    degraded: false,
    generated_at: Utc::now().to_rfc3339(),
  })
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

fn exports_dir(app: &AppHandle) -> CommandResult<PathBuf> {
  let path = app_runtime_root(app)?.join("exports");
  fs::create_dir_all(&path)
    .map_err(|error| format!("Failed to create exports directory {}: {error}", path.display()))?;
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

fn control_plane_dsn() -> Option<String> {
  std::env::var("STRATATLAS_CONTROL_PLANE_DSN").ok()
}

fn control_plane_schema() -> CommandResult<String> {
  let schema = std::env::var("STRATATLAS_CONTROL_PLANE_SCHEMA")
    .unwrap_or_else(|_| "stratatlas".to_string());
  let valid = schema.chars().enumerate().all(|(index, ch)| {
    if index == 0 {
      ch == '_' || ch.is_ascii_alphabetic()
    } else {
      ch == '_' || ch.is_ascii_alphanumeric()
    }
  });
  if !valid {
    return Err(format!(
      "Invalid STRATATLAS_CONTROL_PLANE_SCHEMA value {schema}; expected letters, numbers, or underscores"
    ));
  }
  Ok(schema)
}

fn quoted_schema(schema: &str) -> String {
  format!("\"{schema}\"")
}

fn control_plane_connect() -> CommandResult<Option<Client>> {
  let Some(dsn) = control_plane_dsn() else {
    return Ok(None);
  };
  let mut client = Client::connect(&dsn, NoTls)
    .map_err(|error| format!("Failed connecting to PostgreSQL control plane: {error}"))?;
  initialize_control_plane_schema(&mut client)?;
  Ok(Some(client))
}

fn governed_deployment_profiles() -> Vec<GovernedDeploymentProfile> {
  vec![
    GovernedDeploymentProfile {
      id: "connected".to_string(),
      label: "Connected Analyst".to_string(),
      identity_mode: "interactive_rbac".to_string(),
      key_management: "platform_keystore".to_string(),
      storage_placement: "local_postgresql_postgis_plus_artifact_store".to_string(),
      audit_retention: "365 days rolling".to_string(),
      ai_enabled: true,
      mcp_enabled: true,
      external_ai_access_enabled: true,
    },
    GovernedDeploymentProfile {
      id: "restricted".to_string(),
      label: "Restricted Review".to_string(),
      identity_mode: "interactive_rbac_with_review_controls".to_string(),
      key_management: "platform_keystore_with_review_gate".to_string(),
      storage_placement: "local_postgresql_postgis_plus_artifact_store".to_string(),
      audit_retention: "730 days rolling".to_string(),
      ai_enabled: true,
      mcp_enabled: true,
      external_ai_access_enabled: true,
    },
    GovernedDeploymentProfile {
      id: "air_gapped".to_string(),
      label: "Air-Gapped".to_string(),
      identity_mode: "local_offline_rbac".to_string(),
      key_management: "local_offline_keystore".to_string(),
      storage_placement: "local_postgresql_postgis_plus_artifact_store".to_string(),
      audit_retention: "indefinite_local_retention".to_string(),
      ai_enabled: false,
      mcp_enabled: false,
      external_ai_access_enabled: false,
    },
  ]
}

fn build_control_plane_state_fallback(app: &AppHandle) -> CommandResult<ControlPlaneState> {
  let manifests = list_bundles_from_files(app)?;
  let context_state = load_recorder_state_from_files(app)?;
  let bundle_registry = manifests
    .into_iter()
    .map(|manifest| BundleRegistryEntry {
      bundle_id: manifest.bundle_id.clone(),
      created_at: manifest.created_at.clone(),
      created_by_role: manifest.created_by_role.clone(),
      marking: manifest.marking.clone(),
      ui_state_hash: manifest.ui_state_hash.clone(),
      manifest_artifact_hash: manifest.ui_state_hash.clone(),
      asset_count: manifest.assets.len(),
      supersedes_bundle_id: manifest.supersedes_bundle_id.clone(),
    })
    .collect::<Vec<_>>();

  let (active_deployment_profile_id, context_domain_registry, correlation_links) =
    if let Some(state) = context_state {
      (
        extract_deployment_profile_id(&state),
        extract_value_array(&state.context, "domains"),
        extract_value_array(&state.context, "correlationLinks"),
      )
    } else {
      ("connected".to_string(), Vec::new(), Vec::new())
    };

  Ok(ControlPlaneState {
    active_deployment_profile_id,
    deployment_profiles: governed_deployment_profiles(),
    bundle_registry,
    context_domain_registry,
    correlation_links,
    storage_backend: "postgresql-postgis".to_string(),
    context_store_backend: "postgresql-indexed".to_string(),
    artifact_store_path: bundles_dir(app)?.display().to_string(),
    updated_at: Utc::now().to_rfc3339(),
  })
}

fn initialize_control_plane_schema(client: &mut Client) -> CommandResult<()> {
  let schema = control_plane_schema()?;
  let quoted = quoted_schema(&schema);
  let index_prefix = format!("{schema}_idx");
  let sql = format!(
    "
    CREATE EXTENSION IF NOT EXISTS postgis;
    CREATE SCHEMA IF NOT EXISTS {quoted};
    CREATE TABLE IF NOT EXISTS {quoted}.deployment_profiles (
      profile_id TEXT PRIMARY KEY,
      profile_json JSONB NOT NULL,
      ai_enabled BOOLEAN NOT NULL,
      mcp_enabled BOOLEAN NOT NULL,
      external_ai_access_enabled BOOLEAN NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL
    );
    CREATE TABLE IF NOT EXISTS {quoted}.control_plane_state (
      state_key TEXT PRIMARY KEY,
      active_deployment_profile_id TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL
    );
    CREATE TABLE IF NOT EXISTS {quoted}.bundle_registry (
      bundle_id TEXT PRIMARY KEY,
      manifest_json JSONB NOT NULL,
      manifest_artifact_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL,
      created_by_role TEXT NOT NULL,
      marking TEXT NOT NULL,
      ui_state_hash TEXT NOT NULL,
      supersedes_bundle_id TEXT
    );
    CREATE TABLE IF NOT EXISTS {quoted}.audit_head (
      head_key TEXT PRIMARY KEY,
      event_hash TEXT
    );
    CREATE TABLE IF NOT EXISTS {quoted}.audit_events (
      event_hash TEXT PRIMARY KEY,
      event_json JSONB NOT NULL,
      ts TIMESTAMPTZ NOT NULL,
      prev_event_hash TEXT,
      actor_role TEXT NOT NULL,
      event_type TEXT NOT NULL,
      payload_hash TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS {quoted}.recorder_state (
      state_key TEXT PRIMARY KEY,
      state_json JSONB NOT NULL,
      saved_at TIMESTAMPTZ NOT NULL
    );
    CREATE TABLE IF NOT EXISTS {quoted}.context_domains (
      domain_id TEXT PRIMARY KEY,
      domain_json JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL
    );
    CREATE TABLE IF NOT EXISTS {quoted}.correlation_links (
      link_id TEXT PRIMARY KEY,
      link_json JSONB NOT NULL,
      domain_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      range_start TIMESTAMPTZ NOT NULL,
      range_end TIMESTAMPTZ NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL
    );
    CREATE TABLE IF NOT EXISTS {quoted}.context_records (
      record_id TEXT PRIMARY KEY,
      domain_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      observed_at TIMESTAMPTZ NOT NULL,
      cached_at TIMESTAMPTZ NOT NULL,
      record_json JSONB NOT NULL
    );
    CREATE TABLE IF NOT EXISTS {quoted}.aoi_registry (
      aoi_id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      footprint geometry(Polygon, 4326) NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL
    );
    CREATE INDEX IF NOT EXISTS {index_prefix}_bundle_created_at ON {quoted}.bundle_registry (created_at DESC);
    CREATE INDEX IF NOT EXISTS {index_prefix}_audit_ts ON {quoted}.audit_events (ts DESC);
    CREATE INDEX IF NOT EXISTS {index_prefix}_context_lookup ON {quoted}.context_records (domain_id, target_id, observed_at);
    CREATE INDEX IF NOT EXISTS {index_prefix}_correlation_lookup ON {quoted}.correlation_links (domain_id, target_id, range_start, range_end);
    "
  );
  client
    .batch_execute(&sql)
    .map_err(|error| format!("Failed initializing PostgreSQL/PostGIS control plane schema: {error}"))?;
  upsert_governed_deployment_profiles(client)?;
  seed_control_plane_state(client)?;
  Ok(())
}

fn parse_rfc3339(value: &str) -> CommandResult<DateTime<Utc>> {
  DateTime::parse_from_rfc3339(value)
    .map(|value| value.with_timezone(&Utc))
    .map_err(|error| format!("Invalid RFC3339 timestamp {value}: {error}"))
}

fn extract_value_array(value: &Value, key: &str) -> Vec<Value> {
  value
    .get(key)
    .and_then(Value::as_array)
    .cloned()
    .unwrap_or_default()
}

fn extract_deployment_profile_id(state: &RecorderState) -> String {
  state
    .ai
    .as_ref()
    .and_then(|value| value.get("deploymentProfile"))
    .and_then(Value::as_str)
    .filter(|value| matches!(*value, "connected" | "restricted" | "air_gapped"))
    .unwrap_or("connected")
    .to_string()
}

fn aoi_polygon_wkt(aoi_id: &str) -> String {
  match aoi_id {
    "aoi-1" => "POLYGON((55 24, 55 26, 57 26, 57 24, 55 24))".to_string(),
    "aoi-2" => "POLYGON((34 29, 34 31, 36 31, 36 29, 34 29))".to_string(),
    "aoi-3" => "POLYGON((-75 39, -75 41, -73 41, -73 39, -75 39))".to_string(),
    _ => "POLYGON((0 0, 0 1, 1 1, 1 0, 0 0))".to_string(),
  }
}

fn upsert_governed_deployment_profiles(client: &mut Client) -> CommandResult<()> {
  let quoted = quoted_schema(&control_plane_schema()?);
  let query = format!(
    "
    INSERT INTO {quoted}.deployment_profiles (
      profile_id,
      profile_json,
      ai_enabled,
      mcp_enabled,
      external_ai_access_enabled,
      updated_at
    ) VALUES ($1::text, $2::text::jsonb, $3::boolean, $4::boolean, $5::boolean, $6::timestamptz)
    ON CONFLICT (profile_id) DO UPDATE SET
      profile_json = EXCLUDED.profile_json,
      ai_enabled = EXCLUDED.ai_enabled,
      mcp_enabled = EXCLUDED.mcp_enabled,
      external_ai_access_enabled = EXCLUDED.external_ai_access_enabled,
      updated_at = EXCLUDED.updated_at
    "
  );

  for profile in governed_deployment_profiles() {
    let profile_json = canonical_json_string(&profile)?;
    client
      .execute(
        &query,
        &[
          &profile.id,
          &profile_json,
          &profile.ai_enabled,
          &profile.mcp_enabled,
          &profile.external_ai_access_enabled,
          &Utc::now(),
        ],
      )
      .map_err(|error| format!("Failed upserting deployment profile {}: {error}", profile.id))?;
  }

  Ok(())
}

fn seed_control_plane_state(client: &mut Client) -> CommandResult<()> {
  let quoted = quoted_schema(&control_plane_schema()?);
  let query = format!(
    "
    INSERT INTO {quoted}.control_plane_state (state_key, active_deployment_profile_id, updated_at)
    VALUES ($1, $2, $3)
    ON CONFLICT (state_key) DO NOTHING
    "
  );
  client
    .execute(&query, &[&"active", &"connected", &Utc::now()])
    .map_err(|error| format!("Failed seeding control plane state: {error}"))?;
  Ok(())
}

fn list_bundles_from_files(app: &AppHandle) -> CommandResult<Vec<BundleManifest>> {
  let directory = bundles_dir(app)?;
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

fn load_recorder_state_from_files(app: &AppHandle) -> CommandResult<Option<RecorderState>> {
  let path = recorder_state_path(app)?;
  if !path.exists() {
    return Ok(None);
  }
  let bytes = fs::read(&path)
    .map_err(|error| format!("Failed reading recorder state {}: {error}", path.display()))?;
  let state = serde_json::from_slice::<RecorderState>(&bytes)
    .map_err(|error| format!("Invalid recorder state {}: {error}", path.display()))?;
  Ok(Some(state))
}

fn value_string_field(value: &Value, key: &str, label: &str) -> CommandResult<String> {
  value
    .get(key)
    .and_then(Value::as_str)
    .map(ToString::to_string)
    .ok_or_else(|| format!("Missing {key} string in {label}"))
}

fn value_number(value: Option<&Value>, fallback: f64) -> f64 {
  value
    .and_then(|entry| {
      entry
        .as_f64()
        .or_else(|| entry.as_i64().map(|inner| inner as f64))
        .or_else(|| entry.as_u64().map(|inner| inner as f64))
    })
    .unwrap_or(fallback)
}

fn value_string_array_from_entry(value: Option<&Value>) -> Vec<String> {
  value
    .and_then(Value::as_array)
    .map(|entries| {
      entries
        .iter()
        .filter_map(Value::as_str)
        .filter(|entry| !entry.trim().is_empty())
        .map(ToString::to_string)
        .collect::<Vec<_>>()
    })
    .unwrap_or_default()
}

fn strategic_jitter(seed: &str) -> f64 {
  let hash = sha256_hex(seed.as_bytes());
  let byte = u8::from_str_radix(&hash[..2], 16).unwrap_or(0);
  (f64::from(byte % 7)) - 3.0
}

fn strategic_action_score(
  action: &Value,
  scenario_nodes: &[Value],
  method: &str,
  context_record_count: usize,
  threshold_ref_count: usize,
  deviation_present: bool,
  objective_weight: f64,
  random_seed: i64,
) -> f64 {
  let decision_count = scenario_nodes
    .iter()
    .filter(|node| node.get("node_type").and_then(Value::as_str) == Some("decision"))
    .count() as f64;
  let chance_count = scenario_nodes
    .iter()
    .filter(|node| node.get("node_type").and_then(Value::as_str) == Some("chance"))
    .count() as f64;
  let information_count = scenario_nodes
    .iter()
    .filter(|node| node.get("node_type").and_then(Value::as_str) == Some("information_set"))
    .count() as f64;
  let method_modifier = match method {
    "best_response" => 4.0,
    "equilibrium_exploration" => 2.0,
    _ => 1.0,
  };
  let category = action
    .get("category")
    .and_then(Value::as_str)
    .unwrap_or("policy");
  let action_id = action
    .get("action_id")
    .and_then(Value::as_str)
    .unwrap_or("action-unknown");
  let category_weight = match category {
    "logistics" => (context_record_count as f64 * 1.8) + if deviation_present { 9.5 } else { 2.0 },
    "policy" => (information_count * 3.4) + (objective_weight * 5.0),
    _ => (threshold_ref_count as f64 * 2.8) + (chance_count * 1.4),
  };
  58.0
    + (objective_weight * 20.0)
    + (decision_count * 3.5)
    + (information_count * 2.5)
    - (chance_count * 1.3)
    + category_weight
    + method_modifier
    + strategic_jitter(&format!("{action_id}:{method}:{random_seed}"))
}

fn run_governed_strategic_solver(request: &StrategicSolverRequest) -> CommandResult<Value> {
  if !is_valid_role(&request.role) {
    return Err(format!("Invalid role: {}", request.role));
  }

  let mut snapshot = request.snapshot.clone();
  let snapshot_object = snapshot
    .as_object_mut()
    .ok_or_else(|| "Strategic solver snapshot must be a JSON object".to_string())?;
  let model_value = snapshot_object
    .get("model")
    .cloned()
    .ok_or_else(|| "Strategic solver snapshot missing model".to_string())?;
  let model_object = model_value
    .as_object()
    .ok_or_else(|| "Strategic solver model must be a JSON object".to_string())?;

  let actors = model_object
    .get("actors")
    .and_then(Value::as_array)
    .cloned()
    .ok_or_else(|| "Strategic model missing actors".to_string())?;
  let objectives = model_object
    .get("objectives")
    .and_then(Value::as_array)
    .cloned()
    .ok_or_else(|| "Strategic model missing objectives".to_string())?;
  let actions = model_object
    .get("actions")
    .and_then(Value::as_array)
    .cloned()
    .ok_or_else(|| "Strategic model missing actions".to_string())?;
  let assumptions = value_string_array_from_entry(model_object.get("assumptions"));
  let nodes = snapshot_object
    .get("scenario_tree")
    .and_then(Value::as_object)
    .ok_or_else(|| "Strategic solver snapshot missing scenario_tree".to_string())?
    .get("nodes")
    .and_then(Value::as_array)
    .cloned()
    .unwrap_or_default();
  let game_id = value_string_field(&model_value, "game_id", "game model")?;
  let model_name = value_string_field(&model_value, "name", "game model")?;
  let game_type = value_string_field(&model_value, "game_type", "game model")?;
  let current_version = value_number(model_object.get("version"), 1.0).round() as i64;
  let updated_at_fallback = model_object
    .get("updated_at")
    .and_then(Value::as_str)
    .map(ToString::to_string);

  for actor in &actors {
    let actor_type = actor.get("actor_type").and_then(Value::as_str).unwrap_or("");
    if !matches!(actor_type, "state" | "bloc" | "institution" | "industry_coalition") {
      return Err(format!("Unsupported strategic actor type: {actor_type}"));
    }
  }

  for action in &actions {
    let category = action.get("category").and_then(Value::as_str).unwrap_or("");
    if !matches!(category, "policy" | "logistics" | "signaling") {
      return Err(format!("Unsupported strategic action category: {category}"));
    }
  }

  let solver_config_value = model_object
    .get("solver_config")
    .and_then(Value::as_object)
    .cloned()
    .unwrap_or_default();
  let method = solver_config_value
    .get("method")
    .and_then(Value::as_str)
    .filter(|value| {
      matches!(
        *value,
        "best_response" | "equilibrium_exploration" | "minimax_regret"
      )
    })
    .unwrap_or("best_response")
    .to_string();
  let random_seed = value_number(solver_config_value.get("random_seed"), 17.0).round() as i64;
  let monte_carlo_samples =
    value_number(solver_config_value.get("monte_carlo_samples"), 12.0).round() as i64;
  let iteration_limit = value_number(solver_config_value.get("iteration_limit"), 25.0).round() as i64;
  let parameter_range_notes = value_string_array_from_entry(solver_config_value.get("parameter_range_notes"));

  let bundle_refs = if request.bundle_refs.is_empty() {
    value_string_array_from_entry(model_object.get("bundle_refs"))
  } else {
    request.bundle_refs.clone()
  };
  if bundle_refs.is_empty() {
    return Err("Strategic solver requires at least one governed bundle reference".to_string());
  }

  let mut scenario_ids = if request.linked_scenario_ids.is_empty() {
    snapshot_object
      .get("selected_scenario_id")
      .and_then(Value::as_str)
      .map(|value| vec![value.to_string()])
      .unwrap_or_default()
  } else {
    request.linked_scenario_ids.clone()
  };
  if scenario_ids.is_empty() {
    let mut discovered = nodes
      .iter()
      .filter_map(|node| node.get("scenario_fork_id").and_then(Value::as_str))
      .map(ToString::to_string)
      .collect::<Vec<_>>();
    discovered.sort();
    discovered.dedup();
    scenario_ids = if discovered.is_empty() {
      vec!["scenario-default".to_string()]
    } else {
      discovered
    };
  }

  let objective_weight = objectives
    .iter()
    .map(|objective| value_number(objective.get("weight"), 0.0))
    .sum::<f64>();
  let context_record_count = request.context_record_ids.len();
  let threshold_ref_count = request.threshold_ref_ids.len();
  let deviation_present = request.deviation_event_id.is_some();
  let osint_present = request.osint_alert_id.is_some();

  let scenario_evaluations = scenario_ids
    .iter()
    .map(|scenario_id| {
      let scenario_nodes = nodes
        .iter()
        .filter(|node| {
          scenario_id == "scenario-default"
            || node
              .get("scenario_fork_id")
              .and_then(Value::as_str)
              .map(|value| value == scenario_id)
              .unwrap_or(false)
        })
        .cloned()
        .collect::<Vec<_>>();
      let active_nodes = if scenario_nodes.is_empty() {
        nodes.clone()
      } else {
        scenario_nodes
      };
      let decision_count = active_nodes
        .iter()
        .filter(|node| node.get("node_type").and_then(Value::as_str) == Some("decision"))
        .count();
      let chance_count = active_nodes
        .iter()
        .filter(|node| node.get("node_type").and_then(Value::as_str) == Some("chance"))
        .count();
      let information_set_count = active_nodes
        .iter()
        .filter(|node| node.get("node_type").and_then(Value::as_str) == Some("information_set"))
        .count();
      let mut action_scores = actions
        .iter()
        .map(|action| {
          let score = strategic_action_score(
            action,
            &active_nodes,
            &method,
            context_record_count,
            threshold_ref_count,
            deviation_present,
            objective_weight,
            random_seed,
          );
          (action.clone(), score)
        })
        .collect::<Vec<_>>();
      action_scores.sort_by(|left, right| right.1.partial_cmp(&left.1).unwrap());
      let best_score = action_scores.first().map(|(_, score)| *score).unwrap_or(0.0);
      let next_score = action_scores.get(1).map(|(_, score)| *score).unwrap_or(best_score);
      let recommended_action_id = action_scores
        .first()
        .and_then(|(action, _)| action.get("action_id"))
        .and_then(Value::as_str)
        .map(ToString::to_string);
      let evaluation_evidence_refs = bundle_refs
        .iter()
        .cloned()
        .chain(request.context_record_ids.iter().take(4).cloned())
        .collect::<Vec<_>>();
      json!({
        "scenario_id": scenario_id,
        "node_ids": active_nodes.iter().filter_map(|node| node.get("node_id").and_then(Value::as_str)).collect::<Vec<_>>(),
        "decision_count": decision_count,
        "chance_count": chance_count,
        "information_set_count": information_set_count,
        "context_record_count": context_record_count,
        "aggregate_score": (best_score * 100.0).round() / 100.0,
        "regret_score": ((best_score - next_score).max(0.0) * 100.0).round() / 100.0,
        "recommended_action_id": recommended_action_id,
        "evidence_refs": evaluation_evidence_refs,
        "context_domain_ids": request.context_domain_ids,
        "correlation_target_ids": request.correlation_target_ids,
        "deviation_event_id": request.deviation_event_id,
        "osint_alert_id": request.osint_alert_id,
        "detail": format!("{method} evaluated {} node(s) and {} action(s) for {scenario_id}.", active_nodes.len(), actions.len()),
      })
    })
    .collect::<Vec<_>>();

  let dominant_scenario_score = scenario_evaluations
    .iter()
    .filter_map(|entry| entry.get("aggregate_score").and_then(Value::as_f64))
    .fold(0.0, f64::max);
  let base_value = (72.0
    + actors.len() as f64 * 9.0
    + actions.len() as f64 * 6.0
    + objective_weight * 24.0
    + dominant_scenario_score
    + if osint_present { 3.0 } else { 0.0 }
    + (random_seed.rem_euclid(11) as f64))
    .round() as i64;
  let spread = std::cmp::max(8, (monte_carlo_samples / 2).max(1));
  let throughput_uncertainty = [base_value - spread, base_value + spread];
  let policy_uncertainty = [
    base_value - 12 - std::cmp::max(6, spread - 2),
    base_value - 12 + std::cmp::max(6, spread - 2),
  ];
  let payoff_basis = bundle_refs
    .iter()
    .cloned()
    .chain(scenario_ids.iter().cloned())
    .collect::<Vec<_>>();
  let payoffs = vec![
    json!({
      "metric": "throughput_resilience",
      "value": base_value,
      "uncertainty": throughput_uncertainty,
      "label": "Modeled Output",
      "basis": payoff_basis,
      "non_operational_notice": "Modeled/interpretive only; not operational direction.",
    }),
    json!({
      "metric": "policy_cohesion",
      "value": base_value - 12,
      "uncertainty": policy_uncertainty,
      "label": "Modeled Output",
      "basis": [game_type.clone(), method.clone()],
      "non_operational_notice": "Modeled/interpretive only; not operational direction.",
    }),
  ];

  let mut sensitivity_ranking = assumptions
    .iter()
    .enumerate()
    .map(|(index, assumption)| {
      (
        assumption.clone(),
        assumption.len() as i64 + ((assumptions.len() - index) as i64 * 3),
      )
    })
    .collect::<Vec<_>>();
  sensitivity_ranking.sort_by(|left, right| right.1.cmp(&left.1));
  let sensitivity_ranking = sensitivity_ranking
    .into_iter()
    .take(3)
    .enumerate()
    .map(|(index, (assumption, _))| format!("{}. {}", index + 1, assumption))
    .collect::<Vec<_>>();

  let evidence = json!({
    "bundle_refs": bundle_refs,
    "context_targets": request.context_targets,
    "context_record_ids": request.context_record_ids,
    "context_domain_ids": request.context_domain_ids,
    "correlation_target_ids": request.correlation_target_ids,
    "threshold_ref_ids": request.threshold_ref_ids,
    "deviation_event_id": request.deviation_event_id,
    "osint_alert_id": request.osint_alert_id,
  });
  let sweep = json!({
    "parameter_name": "throughput_multiplier",
    "sampled_values": [0.85, 1.0, 1.15],
    "outcome_spread": [
      base_value - 9,
      base_value,
      base_value + 7
    ],
    "sensitivity_ranking": sensitivity_ranking,
    "monte_carlo_samples": monte_carlo_samples,
  });
  let voi = json!({
    "target": request.context_targets.first().cloned().unwrap_or_else(|| "Throughput coverage".to_string()),
    "recommendation": format!(
      "Increase governed evidence coverage for {} before treating this model as stable.",
      request.context_targets.first().cloned().unwrap_or_else(|| "throughput coverage".to_string())
    ),
    "uncertainty_reduction_pct": std::cmp::min(35, 12 + scenario_ids.len() as i64 * 4),
    "rationale": "Highest leverage comes from reducing uncertainty in the leading modeled branch.",
  });

  let solver_runs = snapshot_object
    .get("solver_runs")
    .and_then(Value::as_array)
    .cloned()
    .unwrap_or_default();
  let executed_at = request
    .executed_at
    .clone()
    .or(updated_at_fallback)
    .unwrap_or_else(|| Utc::now().to_rfc3339());
  let run_id = format!("solver-run-{}", solver_runs.len() + 1);
  let existing_solver_run_ids = solver_runs
    .iter()
    .filter_map(|run| run.get("run_id").and_then(Value::as_str))
    .map(ToString::to_string)
    .collect::<Vec<_>>();
  let existing_solver_methods = solver_runs
    .iter()
    .filter_map(|run| run.get("method").and_then(Value::as_str))
    .map(ToString::to_string)
    .collect::<Vec<_>>();
  let existing_random_seeds = solver_runs
    .iter()
    .filter_map(|run| run.get("random_seed").and_then(Value::as_i64))
    .collect::<Vec<_>>();
  let run_payload = json!({
    "game_id": game_id,
    "runtime": "tauri-governed",
    "method": method,
    "random_seed": random_seed,
    "monte_carlo_samples": monte_carlo_samples,
    "bundle_refs": bundle_refs,
    "linked_scenario_ids": scenario_ids,
    "payoffs": payoffs,
    "sweep": sweep,
    "voi": voi,
    "evidence": evidence,
    "scenario_evaluations": scenario_evaluations,
  });
  let result_manifest_hash = sha256_hex(&canonical_json_bytes(&run_payload)?);
  let solver_run = json!({
    "run_id": run_id,
    "game_id": game_id,
    "executed_at": executed_at,
    "runtime": "tauri-governed",
    "method": method,
    "random_seed": random_seed,
    "monte_carlo_samples": monte_carlo_samples,
    "input_bundle_refs": bundle_refs,
    "linked_scenario_ids": scenario_ids,
    "payoff_proxies": payoffs,
    "sensitivity_ranking": sensitivity_ranking,
    "scenario_evaluations": scenario_evaluations,
    "evidence": evidence,
    "trace_summary": format!("{} scenario evaluation(s) captured via tauri-governed runtime.", scenario_ids.len()),
    "robust_summary": format!("{method} run with seed {random_seed} and iteration limit {iteration_limit} evaluated {} scenario branch set(s).", scenario_ids.len()),
    "result_manifest_hash": result_manifest_hash,
    "artifact_label": "Modeled Output",
    "non_operational_notice": "Modeled/interpretive only; not operational direction.",
  });
  let trace_manifest_hash = sha256_hex(&canonical_json_bytes(&json!({
    "scenario_evaluations": scenario_evaluations,
    "evidence": evidence,
    "runtime": "tauri-governed",
  }))?);
  let mut solver_run_ids = existing_solver_run_ids;
  solver_run_ids.push(run_id.clone());
  let mut solver_methods = existing_solver_methods;
  solver_methods.push(method.clone());
  let mut random_seeds = existing_random_seeds;
  random_seeds.push(random_seed);
  let experiment_bundle = json!({
    "experiment_bundle_id": format!("experiment-{game_id}-{}", solver_runs.len() + 1),
    "game_id": game_id,
    "game_model_version": current_version + 1,
    "snapshot_bundle_refs": bundle_refs,
    "scenario_fork_ids": scenario_ids,
    "solver_run_ids": solver_run_ids,
    "solver_methods": solver_methods,
    "random_seeds": random_seeds,
    "parameter_ranges": parameter_range_notes,
    "runtime": "tauri-governed",
    "trace_manifest_hash": trace_manifest_hash,
    "scenario_evaluation_count": scenario_evaluations.len(),
    "result_manifest_hash": result_manifest_hash,
    "created_at": executed_at,
    "summary": format!("Experiment bundle for {model_name} with {} linked scenario branches.", scenario_ids.len()),
    "artifact_label": "Modeled Output",
  });

  let mut next_solver_runs = solver_runs;
  next_solver_runs.push(solver_run);
  let model = snapshot_object
    .get_mut("model")
    .and_then(Value::as_object_mut)
    .ok_or_else(|| "Strategic solver snapshot missing mutable model".to_string())?;
  model.insert(
    "version".to_string(),
    json!(current_version + 1),
  );
  model.insert("updated_at".to_string(), json!(executed_at));
  model.insert("bundle_refs".to_string(), json!(bundle_refs));
  model.insert(
    "solver_config".to_string(),
    json!({
      "method": method,
      "random_seed": random_seed,
      "monte_carlo_samples": monte_carlo_samples,
      "iteration_limit": iteration_limit,
      "parameter_range_notes": parameter_range_notes,
    }),
  );
  snapshot_object.insert("latest_payoff_proxies".to_string(), json!(payoffs));
  snapshot_object.insert("solver_runs".to_string(), Value::Array(next_solver_runs));
  snapshot_object.insert("latest_parameter_sweep".to_string(), sweep);
  snapshot_object.insert("latest_voi_estimate".to_string(), voi);
  snapshot_object.insert("experiment_bundle".to_string(), experiment_bundle);
  snapshot_object.insert(
    "selected_scenario_id".to_string(),
    json!(scenario_ids.first().cloned().unwrap_or_else(|| "scenario-default".to_string())),
  );

  Ok(snapshot)
}

fn persist_control_plane_from_state(client: &mut Client, state: &RecorderState) -> CommandResult<()> {
  let quoted = quoted_schema(&control_plane_schema()?);
  let active_profile = extract_deployment_profile_id(state);
  let update_state_query = format!(
    "
    INSERT INTO {quoted}.control_plane_state (state_key, active_deployment_profile_id, updated_at)
    VALUES ($1, $2, $3)
    ON CONFLICT (state_key) DO UPDATE SET
      active_deployment_profile_id = EXCLUDED.active_deployment_profile_id,
      updated_at = EXCLUDED.updated_at
    "
  );
  client
    .execute(&update_state_query, &[&"active", &active_profile, &Utc::now()])
    .map_err(|error| format!("Failed updating control plane state: {error}"))?;

  let upsert_domain_query = format!(
    "
    INSERT INTO {quoted}.context_domains (domain_id, domain_json, updated_at)
    VALUES ($1, $2::text::jsonb, $3)
    ON CONFLICT (domain_id) DO UPDATE SET
      domain_json = EXCLUDED.domain_json,
      updated_at = EXCLUDED.updated_at
    "
  );
  for domain in extract_value_array(&state.context, "domains") {
    let domain_id = value_string_field(&domain, "domain_id", "context domain")?;
    let domain_json = canonical_json_string(&domain)?;
    client
      .execute(&upsert_domain_query, &[&domain_id, &domain_json, &Utc::now()])
      .map_err(|error| format!("Failed upserting context domain {domain_id}: {error}"))?;
  }

  let upsert_link_query = format!(
    "
    INSERT INTO {quoted}.correlation_links (
      link_id,
      link_json,
      domain_id,
      target_id,
      range_start,
      range_end,
      updated_at
    ) VALUES ($1, $2::text::jsonb, $3, $4, $5, $6, $7)
    ON CONFLICT (link_id) DO UPDATE SET
      link_json = EXCLUDED.link_json,
      domain_id = EXCLUDED.domain_id,
      target_id = EXCLUDED.target_id,
      range_start = EXCLUDED.range_start,
      range_end = EXCLUDED.range_end,
      updated_at = EXCLUDED.updated_at
    "
  );
  for link in extract_value_array(&state.context, "correlationLinks") {
    let link_id = value_string_field(&link, "link_id", "correlation link")?;
    let domain_id = value_string_field(&link, "domain_id", "correlation link")?;
    let target_id = value_string_field(&link, "target_id", "correlation link")?;
    let time_range = link
      .get("time_range")
      .and_then(Value::as_object)
      .ok_or_else(|| "Correlation link missing time_range".to_string())?;
    let range_start = parse_rfc3339(
      time_range
        .get("start")
        .and_then(Value::as_str)
        .ok_or_else(|| "Correlation link missing start".to_string())?,
    )?;
    let range_end = parse_rfc3339(
      time_range
        .get("end")
        .and_then(Value::as_str)
        .ok_or_else(|| "Correlation link missing end".to_string())?,
    )?;
    let link_json = canonical_json_string(&link)?;
    client
      .execute(
        &upsert_link_query,
        &[&link_id, &link_json, &domain_id, &target_id, &range_start, &range_end, &Utc::now()],
      )
      .map_err(|error| format!("Failed upserting correlation link {link_id}: {error}"))?;
  }

  let upsert_record_query = format!(
    "
    INSERT INTO {quoted}.context_records (
      record_id,
      domain_id,
      target_id,
      observed_at,
      cached_at,
      record_json
    ) VALUES ($1, $2, $3, $4, $5, $6::text::jsonb)
    ON CONFLICT (record_id) DO UPDATE SET
      domain_id = EXCLUDED.domain_id,
      target_id = EXCLUDED.target_id,
      observed_at = EXCLUDED.observed_at,
      cached_at = EXCLUDED.cached_at,
      record_json = EXCLUDED.record_json
    "
  );
  for record in extract_value_array(&state.context, "records") {
    let record_id = value_string_field(&record, "record_id", "context record")?;
    let domain_id = value_string_field(&record, "domain_id", "context record")?;
    let target_id = value_string_field(&record, "target_id", "context record")?;
    let observed_at = parse_rfc3339(&value_string_field(&record, "observed_at", "context record")?)?;
    let cached_at = parse_rfc3339(&value_string_field(&record, "cached_at", "context record")?)?;
    let record_json = canonical_json_string(&record)?;
    client
      .execute(
        &upsert_record_query,
        &[&record_id, &domain_id, &target_id, &observed_at, &cached_at, &record_json],
      )
      .map_err(|error| format!("Failed upserting context record {record_id}: {error}"))?;
  }

  let upsert_aoi_query = format!(
    "
    INSERT INTO {quoted}.aoi_registry (aoi_id, label, footprint, updated_at)
    VALUES ($1, $2, ST_GeomFromText($3, 4326), $4)
    ON CONFLICT (aoi_id) DO UPDATE SET
      label = EXCLUDED.label,
      footprint = EXCLUDED.footprint,
      updated_at = EXCLUDED.updated_at
    "
  );
  let mut aoi_ids = Vec::new();
  if let Some(aoi) = state
    .query
    .get("definition")
    .and_then(|value| value.get("aoi"))
    .and_then(Value::as_str)
  {
    aoi_ids.push(aoi.to_string());
  }
  if let Some(aoi) = state.context.get("correlationAoi").and_then(Value::as_str) {
    aoi_ids.push(aoi.to_string());
  }
  aoi_ids.sort();
  aoi_ids.dedup();
  for aoi_id in aoi_ids {
    let label = format!("AOI {aoi_id}");
    let footprint = aoi_polygon_wkt(&aoi_id);
    client
      .execute(&upsert_aoi_query, &[&aoi_id, &label, &footprint, &Utc::now()])
      .map_err(|error| format!("Failed upserting AOI registry {aoi_id}: {error}"))?;
  }

  Ok(())
}

fn upsert_bundle_registry_entry(client: &mut Client, manifest: &BundleManifest) -> CommandResult<()> {
  let quoted = quoted_schema(&control_plane_schema()?);
  let query = format!(
    "
    INSERT INTO {quoted}.bundle_registry (
      bundle_id,
      manifest_json,
      manifest_artifact_hash,
      created_at,
      created_by_role,
      marking,
      ui_state_hash,
      supersedes_bundle_id
    ) VALUES ($1, $2::text::jsonb, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (bundle_id) DO UPDATE SET
      manifest_json = EXCLUDED.manifest_json,
      manifest_artifact_hash = EXCLUDED.manifest_artifact_hash,
      created_at = EXCLUDED.created_at,
      created_by_role = EXCLUDED.created_by_role,
      marking = EXCLUDED.marking,
      ui_state_hash = EXCLUDED.ui_state_hash,
      supersedes_bundle_id = EXCLUDED.supersedes_bundle_id
    "
  );
  let manifest_json = canonical_json_string(manifest)?;
  let manifest_hash = sha256_hex(manifest_json.as_bytes());
  let created_at = parse_rfc3339(&manifest.created_at)?;
  client
    .execute(
      &query,
      &[
        &manifest.bundle_id,
        &manifest_json,
        &manifest_hash,
        &created_at,
        &manifest.created_by_role,
        &manifest.marking,
        &manifest.ui_state_hash,
        &manifest.supersedes_bundle_id,
      ],
    )
    .map_err(|error| format!("Failed upserting bundle registry entry {}: {error}", manifest.bundle_id))?;
  Ok(())
}

fn load_control_plane_state_from_db(client: &mut Client, app: &AppHandle) -> CommandResult<ControlPlaneState> {
  let quoted = quoted_schema(&control_plane_schema()?);
  let active_profile_query = format!(
    "SELECT active_deployment_profile_id FROM {quoted}.control_plane_state WHERE state_key = $1"
  );
  let active_deployment_profile_id = client
    .query_opt(&active_profile_query, &[&"active"])
    .map_err(|error| format!("Failed reading control plane state: {error}"))?
    .and_then(|row| row.get::<_, Option<String>>(0))
    .unwrap_or_else(|| "connected".to_string());

  let deployment_profiles = client
    .query(
      &format!("SELECT profile_json::text FROM {quoted}.deployment_profiles ORDER BY profile_id ASC"),
      &[],
    )
    .map_err(|error| format!("Failed reading governed deployment profiles: {error}"))?
    .iter()
    .map(|row| serde_json::from_str::<GovernedDeploymentProfile>(&row.get::<_, String>(0))
      .map_err(|error| format!("Invalid governed deployment profile JSON: {error}")))
    .collect::<CommandResult<Vec<_>>>()?;

  let bundle_registry = client
    .query(
      &format!(
        "SELECT manifest_json::text, manifest_artifact_hash FROM {quoted}.bundle_registry ORDER BY created_at DESC"
      ),
      &[],
    )
    .map_err(|error| format!("Failed reading bundle registry: {error}"))?
    .iter()
    .map(|row| {
      let manifest = serde_json::from_str::<BundleManifest>(&row.get::<_, String>(0))
        .map_err(|error| format!("Invalid bundle registry manifest JSON: {error}"))?;
      Ok(BundleRegistryEntry {
        bundle_id: manifest.bundle_id.clone(),
        created_at: manifest.created_at.clone(),
        created_by_role: manifest.created_by_role.clone(),
        marking: manifest.marking.clone(),
        ui_state_hash: manifest.ui_state_hash.clone(),
        manifest_artifact_hash: row.get::<_, String>(1),
        asset_count: manifest.assets.len(),
        supersedes_bundle_id: manifest.supersedes_bundle_id.clone(),
      })
    })
    .collect::<CommandResult<Vec<_>>>()?;

  let context_domain_registry = client
    .query(
      &format!("SELECT domain_json::text FROM {quoted}.context_domains ORDER BY domain_id ASC"),
      &[],
    )
    .map_err(|error| format!("Failed reading context domain registry: {error}"))?
    .iter()
    .map(|row| serde_json::from_str::<Value>(&row.get::<_, String>(0))
      .map_err(|error| format!("Invalid context domain JSON: {error}")))
    .collect::<CommandResult<Vec<_>>>()?;

  let correlation_links = client
    .query(
      &format!("SELECT link_json::text FROM {quoted}.correlation_links ORDER BY link_id ASC"),
      &[],
    )
    .map_err(|error| format!("Failed reading correlation links: {error}"))?
    .iter()
    .map(|row| serde_json::from_str::<Value>(&row.get::<_, String>(0))
      .map_err(|error| format!("Invalid correlation link JSON: {error}")))
    .collect::<CommandResult<Vec<_>>>()?;

  Ok(ControlPlaneState {
    active_deployment_profile_id,
    deployment_profiles,
    bundle_registry,
    context_domain_registry,
    correlation_links,
    storage_backend: "postgresql-postgis".to_string(),
    context_store_backend: "postgresql-indexed".to_string(),
    artifact_store_path: bundles_dir(app)?.display().to_string(),
    updated_at: Utc::now().to_rfc3339(),
  })
}

fn query_context_records_from_db(
  client: &mut Client,
  request: &QueryContextRecordsRequest,
) -> CommandResult<QueryContextRecordsResult> {
  let quoted = quoted_schema(&control_plane_schema()?);
  let limit_clause = request
    .limit
    .filter(|value| *value > 0)
    .map(|value| format!(" LIMIT {value}"))
    .unwrap_or_default();
  let start = parse_rfc3339(&request.time_range.start)?;
  let end = parse_rfc3339(&request.time_range.end)?;
  let query = format!(
    "
    SELECT record_json::text
    FROM {quoted}.context_records
    WHERE domain_id = ANY($1)
      AND target_id = $2
      AND observed_at >= $3
      AND observed_at <= $4
    ORDER BY observed_at ASC{limit_clause}
    "
  );
  let records = client
    .query(&query, &[&request.domain_ids, &request.target_id, &start, &end])
    .map_err(|error| format!("Failed querying context records: {error}"))?
    .iter()
    .map(|row| serde_json::from_str::<Value>(&row.get::<_, String>(0))
      .map_err(|error| format!("Invalid context record JSON: {error}")))
    .collect::<CommandResult<Vec<_>>>()?;

  Ok(QueryContextRecordsResult {
    total_records: records.len(),
    records,
    query_range: request.time_range.clone(),
    source: "control_plane".to_string(),
  })
}

fn hydrate_recorder_state_from_db(
  client: &mut Client,
  app: &AppHandle,
  state: RecorderState,
) -> CommandResult<RecorderState> {
  let control_plane = load_control_plane_state_from_db(client, app)?;
  let mut next_state = state.clone();

  let mut ai = next_state.ai.unwrap_or_else(|| json!({}));
  if !ai.is_object() {
    ai = json!({});
  }
  if let Some(map) = ai.as_object_mut() {
    map.insert(
      "deploymentProfile".to_string(),
      Value::String(control_plane.active_deployment_profile_id.clone()),
    );
  }
  next_state.ai = Some(ai);

  let active_domain_ids = next_state
    .context
    .get("activeDomainIds")
    .and_then(Value::as_array)
    .map(|values| {
      values
        .iter()
        .filter_map(Value::as_str)
        .map(ToString::to_string)
        .collect::<Vec<_>>()
    })
    .unwrap_or_default();
  let correlation_aoi = next_state
    .context
    .get("correlationAoi")
    .and_then(Value::as_str)
    .unwrap_or("aoi-1");
  let query_range = next_state
    .context
    .get("queryRange")
    .and_then(Value::as_object)
    .and_then(|range| {
      Some(ContextTimeRange {
        start: range.get("start")?.as_str()?.to_string(),
        end: range.get("end")?.as_str()?.to_string(),
      })
    })
    .unwrap_or(ContextTimeRange {
      start: "2026-03-06T08:00:00.000Z".to_string(),
      end: "2026-03-06T18:00:00.000Z".to_string(),
    });

  let queried_records = if active_domain_ids.is_empty() {
    Vec::new()
  } else {
    query_context_records_from_db(
      client,
      &QueryContextRecordsRequest {
        domain_ids: active_domain_ids,
        target_id: correlation_aoi.to_string(),
        time_range: query_range.clone(),
        limit: Some(1000),
      },
    )?
    .records
  };

  let mut context = next_state.context.as_object().cloned().unwrap_or_default();
  context.insert(
    "domains".to_string(),
    Value::Array(control_plane.context_domain_registry),
  );
  context.insert(
    "correlationLinks".to_string(),
    Value::Array(control_plane.correlation_links),
  );
  context.insert("records".to_string(), Value::Array(queried_records));
  context.insert(
    "queryRange".to_string(),
    serde_json::to_value(query_range)
      .map_err(|error| format!("Failed serializing context query range: {error}"))?,
  );
  next_state.context = Value::Object(context);
  Ok(next_state)
}

fn runtime_smoke_artifact_root() -> CommandResult<PathBuf> {
  let configured = std::env::var("STRATATLAS_RUNTIME_SMOKE_ARTIFACT_DIR")
    .map_err(|_| "STRATATLAS_RUNTIME_SMOKE_ARTIFACT_DIR is not configured".to_string())?;
  let path = PathBuf::from(configured);
  if !path.is_absolute() {
    return Err("Runtime smoke artifact directory must be absolute".to_string());
  }
  fs::create_dir_all(&path).map_err(|error| {
    format!(
      "Failed creating runtime smoke artifact directory {}: {error}",
      path.display()
    )
  })?;
  Ok(path)
}

fn copy_file_if_exists(source: &Path, destination: &Path) -> CommandResult<()> {
  if !source.exists() {
    return Ok(());
  }
  if let Some(parent) = destination.parent() {
    fs::create_dir_all(parent).map_err(|error| {
      format!(
        "Failed creating destination directory {}: {error}",
        parent.display()
      )
    })?;
  }
  fs::copy(source, destination).map_err(|error| {
    format!(
      "Failed copying runtime smoke proof {} -> {}: {error}",
      source.display(),
      destination.display()
    )
  })?;
  Ok(())
}

fn copy_directory_recursive(source: &Path, destination: &Path) -> CommandResult<()> {
  if !source.exists() {
    return Ok(());
  }
  fs::create_dir_all(destination).map_err(|error| {
    format!(
      "Failed creating runtime smoke directory {}: {error}",
      destination.display()
    )
  })?;

  for entry in fs::read_dir(source)
    .map_err(|error| format!("Failed reading runtime smoke directory {}: {error}", source.display()))?
  {
    let entry = entry.map_err(|error| format!("Failed reading directory entry: {error}"))?;
    let entry_path = entry.path();
    let destination_path = destination.join(entry.file_name());
    if entry_path.is_dir() {
      copy_directory_recursive(&entry_path, &destination_path)?;
    } else {
      copy_file_if_exists(&entry_path, &destination_path)?;
    }
  }

  Ok(())
}

fn read_audit_head(app: &AppHandle) -> CommandResult<AuditHead> {
  if let Some(mut client) = control_plane_connect()? {
    let quoted = quoted_schema(&control_plane_schema()?);
    let query =
      format!("SELECT event_hash FROM {quoted}.audit_head WHERE head_key = $1");
    let row = client
      .query_opt(&query, &[&"active"])
      .map_err(|error| format!("Failed reading PostgreSQL audit head: {error}"))?;
    return Ok(AuditHead {
      event_hash: row.and_then(|entry| entry.get::<_, Option<String>>(0)),
    });
  }

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

  if let Some(mut client) = control_plane_connect()? {
    let quoted = quoted_schema(&control_plane_schema()?);
    let insert_query = format!(
      "
      INSERT INTO {quoted}.audit_events (
        event_hash,
        event_json,
        ts,
        prev_event_hash,
        actor_role,
        event_type,
        payload_hash
      ) VALUES ($1, $2::text::jsonb, $3, $4, $5, $6, $7)
      ON CONFLICT (event_hash) DO NOTHING
      "
    );
    let head_query = format!(
      "
      INSERT INTO {quoted}.audit_head (head_key, event_hash)
      VALUES ($1, $2)
      ON CONFLICT (head_key) DO UPDATE SET event_hash = EXCLUDED.event_hash
      "
    );
    let ts_value = parse_rfc3339(&event.ts)?;
    let event_json = canonical_json_string(&event)?;
    client
      .execute(
        &insert_query,
        &[
          &event.event_hash,
          &event_json,
          &ts_value,
          &event.prev_event_hash,
          &event.actor_role,
          &event.event_type,
          &event.payload_hash,
        ],
      )
      .map_err(|error| format!("Failed writing PostgreSQL audit event: {error}"))?;
    client
      .execute(&head_query, &[&"active", &event.event_hash])
      .map_err(|error| format!("Failed updating PostgreSQL audit head: {error}"))?;
  }

  Ok(event)
}

fn save_recorder_state_internal(app: &AppHandle, state: &RecorderState) -> CommandResult<RecorderState> {
  let path = recorder_state_path(app)?;
  let bytes = canonical_json_bytes(state)?;
  fs::write(&path, bytes)
    .map_err(|error| format!("Failed writing recorder state {}: {error}", path.display()))?;

  if let Some(mut client) = control_plane_connect()? {
    let quoted = quoted_schema(&control_plane_schema()?);
    let query = format!(
      "
      INSERT INTO {quoted}.recorder_state (state_key, state_json, saved_at)
      VALUES ($1, $2::text::jsonb, $3)
      ON CONFLICT (state_key) DO UPDATE SET
        state_json = EXCLUDED.state_json,
        saved_at = EXCLUDED.saved_at
      "
    );
    let state_json = canonical_json_string(state)?;
    let saved_at = parse_rfc3339(&state.saved_at)?;
    client
      .execute(&query, &[&"current", &state_json, &saved_at])
      .map_err(|error| format!("Failed writing PostgreSQL recorder state: {error}"))?;
    persist_control_plane_from_state(&mut client, state)?;
  }

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
  let osint_asset = write_bundle_asset(
    &bundle_root,
    "osint-state",
    "assets/osint_state.json",
    &request.state.osint.clone().unwrap_or(Value::Null),
    &request.marking,
    &request.provenance_refs,
    &captured_at,
  )?;
  let game_model_asset = write_bundle_asset(
    &bundle_root,
    "game-model-state",
    "assets/game_model_state.json",
    &request.state.game_model.clone().unwrap_or(Value::Null),
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
    osint_asset.clone(),
    game_model_asset.clone(),
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
  if let Some(mut client) = control_plane_connect()? {
    upsert_bundle_registry_entry(&mut client, &manifest)?;
    persist_control_plane_from_state(&mut client, &request.state)?;
  }

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
  if let Some(osint_asset) = manifest
    .assets
    .iter()
    .find(|asset| asset.asset_id == "osint-state")
  {
    let recorder_osint = recorder_state.osint.clone().unwrap_or(Value::Null);
    let osint_hash = sha256_hex(&canonical_json_bytes(&recorder_osint)?);
    if osint_hash != osint_asset.sha256 {
      append_integrity_failure(
        &app,
        &bundle_id,
        "recorder-state",
        json!({
          "expected_osint_hash": osint_asset.sha256,
          "actual_osint_hash": osint_hash,
        }),
      )?;
      return Err("Recorder state asset does not match osint-state asset".to_string());
    }
  }
  if let Some(game_model_asset) = manifest
    .assets
    .iter()
    .find(|asset| asset.asset_id == "game-model-state")
  {
    let recorder_game_model = recorder_state.game_model.clone().unwrap_or(Value::Null);
    let game_model_hash = sha256_hex(&canonical_json_bytes(&recorder_game_model)?);
    if game_model_hash != game_model_asset.sha256 {
      append_integrity_failure(
        &app,
        &bundle_id,
        "recorder-state",
        json!({
          "expected_game_model_hash": game_model_asset.sha256,
          "actual_game_model_hash": game_model_hash,
        }),
      )?;
      return Err("Recorder state asset does not match game-model-state asset".to_string());
    }
  }

  let _ = save_recorder_state_internal(&app, &recorder_state)?;
  if let Some(mut client) = control_plane_connect()? {
    upsert_bundle_registry_entry(&mut client, &manifest)?;
    persist_control_plane_from_state(&mut client, &recorder_state)?;
  }

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
  if let Some(mut client) = control_plane_connect()? {
    let quoted = quoted_schema(&control_plane_schema()?);
    let query = format!(
      "SELECT manifest_json::text FROM {quoted}.bundle_registry ORDER BY created_at DESC"
    );
    let manifests = client
      .query(&query, &[])
      .map_err(|error| format!("Failed listing bundle registry: {error}"))?
      .iter()
      .map(|row| {
        serde_json::from_str::<BundleManifest>(&row.get::<_, String>(0))
          .map_err(|error| format!("Invalid bundle registry manifest JSON: {error}"))
      })
      .collect::<CommandResult<Vec<_>>>()?;
    return Ok(manifests);
  }

  list_bundles_from_files(&app)
}

#[tauri::command]
fn append_audit_event(app: AppHandle, request: AppendAuditRequest) -> CommandResult<AuditEvent> {
  append_audit_internal(&app, &request)
}

#[tauri::command]
fn list_audit_events(app: AppHandle, limit: Option<usize>) -> CommandResult<Vec<AuditEvent>> {
  if let Some(mut client) = control_plane_connect()? {
    let quoted = quoted_schema(&control_plane_schema()?);
    let effective_limit = limit.unwrap_or(200).max(1);
    let query = format!(
      "
      SELECT event_json::text
      FROM {quoted}.audit_events
      ORDER BY ts DESC
      LIMIT {effective_limit}
      "
    );
    let mut events = client
      .query(&query, &[])
      .map_err(|error| format!("Failed listing PostgreSQL audit events: {error}"))?
      .iter()
      .map(|row| {
        serde_json::from_str::<AuditEvent>(&row.get::<_, String>(0))
          .map_err(|error| format!("Invalid PostgreSQL audit event JSON: {error}"))
      })
      .collect::<CommandResult<Vec<_>>>()?;
    events.reverse();
    return Ok(events);
  }

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
  if let Some(mut client) = control_plane_connect()? {
    let quoted = quoted_schema(&control_plane_schema()?);
    let query =
      format!("SELECT state_json::text FROM {quoted}.recorder_state WHERE state_key = $1");
    if let Some(row) = client
      .query_opt(&query, &[&"current"])
      .map_err(|error| format!("Failed loading PostgreSQL recorder state: {error}"))?
    {
      let state = serde_json::from_str::<RecorderState>(&row.get::<_, String>(0))
        .map_err(|error| format!("Invalid PostgreSQL recorder state JSON: {error}"))?;
      let hydrated = hydrate_recorder_state_from_db(&mut client, &app, state)?;
      return Ok(LoadRecorderStateResult {
        state: Some(hydrated),
      });
    }
  }

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

#[tauri::command]
fn get_control_plane_state(app: AppHandle) -> CommandResult<ControlPlaneState> {
  if let Some(mut client) = control_plane_connect()? {
    return load_control_plane_state_from_db(&mut client, &app);
  }

  build_control_plane_state_fallback(&app)
}

#[tauri::command]
fn get_ai_gateway_provider_status() -> CommandResult<AiGatewayProviderStatus> {
  Ok(ai_provider_status_from_env())
}

#[tauri::command]
async fn run_ai_gateway_provider_analysis(
  request: AiGatewayProviderAnalysisRequest,
) -> CommandResult<AiGatewayProviderAnalysisResult> {
  if !is_valid_marking(&request.marking) {
    return Err(format!("Invalid marking: {}", request.marking));
  }

  let provider = resolve_ai_provider();
  if !provider.status.available {
    return Err(provider.status.detail);
  }

  match provider.kind {
    LiveAiProviderKind::CodexCli => run_codex_cli_provider_analysis(&request, &provider.status),
    LiveAiProviderKind::OpenAiResponses => run_openai_provider_analysis(&request, &provider.status).await,
  }
}

#[tauri::command]
fn run_strategic_model_solve(
  app: AppHandle,
  request: StrategicSolverRequest,
) -> CommandResult<StrategicSolverResult> {
  let snapshot = run_governed_strategic_solver(&request)?;
  let latest_solver_run = snapshot
    .get("solver_runs")
    .and_then(Value::as_array)
    .and_then(|entries| entries.last())
    .cloned()
    .unwrap_or(Value::Null);
  let experiment_bundle = snapshot
    .get("experiment_bundle")
    .cloned()
    .unwrap_or(Value::Null);
  let audit_event = append_audit_internal(
    &app,
    &AppendAuditRequest {
      role: request.role,
      event_type: "game_model.solver_run".to_string(),
      payload: json!({
        "runtime": "tauri-governed",
        "solver_run": latest_solver_run,
        "experiment_bundle": experiment_bundle,
      }),
    },
  )?;

  Ok(StrategicSolverResult {
    runtime: "tauri-governed".to_string(),
    snapshot,
    audit_event_id: Some(audit_event.event_id),
  })
}

#[tauri::command]
fn query_context_records(
  app: AppHandle,
  request: QueryContextRecordsRequest,
) -> CommandResult<QueryContextRecordsResult> {
  if let Some(mut client) = control_plane_connect()? {
    return query_context_records_from_db(&mut client, &request);
  }

  let state = load_recorder_state_from_files(&app)?;
  let records = state
    .map(|state| extract_value_array(&state.context, "records"))
    .unwrap_or_default()
    .into_iter()
    .filter(|record| {
      let domain_id = record.get("domain_id").and_then(Value::as_str);
      let target_id = record.get("target_id").and_then(Value::as_str);
      let observed_at = record.get("observed_at").and_then(Value::as_str);
      domain_id
        .map(|value| request.domain_ids.iter().any(|domain_id| domain_id == value))
        .unwrap_or(false)
        && target_id.map(|value| value == request.target_id).unwrap_or(false)
        && observed_at
          .map(|value| {
            value >= request.time_range.start.as_str()
              && value <= request.time_range.end.as_str()
          })
          .unwrap_or(false)
    })
    .collect::<Vec<_>>();

  Ok(QueryContextRecordsResult {
    total_records: records.len(),
    records,
    query_range: request.time_range,
    source: "fallback".to_string(),
  })
}

fn validate_air_traffic_bounds(request: &FetchCommercialAirTrafficRequest) -> CommandResult<()> {
  if request.focus_aoi_id.trim().is_empty() {
    return Err("Air traffic focus_aoi_id is required".to_string());
  }
  if request.focus_aoi_label.trim().is_empty() {
    return Err("Air traffic focus_aoi_label is required".to_string());
  }
  if request.min_lat >= request.max_lat || request.min_lon >= request.max_lon {
    return Err("Air traffic bounds are invalid".to_string());
  }
  if request.min_lat < -90.0
    || request.max_lat > 90.0
    || request.min_lon < -180.0
    || request.max_lon > 180.0
  {
    return Err("Air traffic bounds exceed valid latitude/longitude ranges".to_string());
  }
  Ok(())
}

fn meters_to_feet(value: f64) -> f64 {
  value * 3.28084
}

fn meters_per_second_to_knots(value: f64) -> f64 {
  value * 1.94384
}

fn meters_per_second_to_feet_per_minute(value: f64) -> f64 {
  value * 196.850394
}

fn timestamp_to_rfc3339(timestamp: i64) -> String {
  DateTime::<Utc>::from_timestamp(timestamp, 0)
    .unwrap_or_else(Utc::now)
    .to_rfc3339()
}

async fn fetch_commercial_air_traffic_internal(
  request: &FetchCommercialAirTrafficRequest,
) -> CommandResult<FetchCommercialAirTrafficResult> {
  validate_air_traffic_bounds(request)?;

  let max_flights = request.max_flights.unwrap_or(18).clamp(1, 36);
  let source_url = format!(
    "https://opensky-network.org/api/states/all?lamin={:.4}&lomin={:.4}&lamax={:.4}&lomax={:.4}",
    request.min_lat, request.min_lon, request.max_lat, request.max_lon
  );

  let client = reqwest::Client::builder()
    .timeout(Duration::from_secs(20))
    .build()
    .map_err(|error| format!("Failed to construct governed air traffic client: {error}"))?;

  let response = client
    .get(&source_url)
    .send()
    .await
    .map_err(|error| format!("Commercial air traffic request failed: {error}"))?;

  let status_code = response.status();
  let response_json = response
    .json::<Value>()
    .await
    .map_err(|error| format!("Failed to parse commercial air traffic response: {error}"))?;

  if !status_code.is_success() {
    let response_body = response_json.to_string();
    let truncated = response_body.chars().take(280).collect::<String>();
    return Err(format!(
      "Commercial air traffic source returned HTTP {}: {}",
      status_code.as_u16(),
      truncated
    ));
  }

  let snapshot_time = response_json
    .get("time")
    .and_then(Value::as_i64)
    .unwrap_or_else(|| Utc::now().timestamp());
  let states = response_json
    .get("states")
    .and_then(Value::as_array)
    .cloned()
    .unwrap_or_default();

  let mut parsed_flights: Vec<(i64, AirTrafficFlight)> = Vec::new();
  for state in states {
    let Some(columns) = state.as_array() else {
      continue;
    };
    if columns.len() < 17 {
      continue;
    }

    let icao24 = columns
      .get(0)
      .and_then(Value::as_str)
      .unwrap_or_default()
      .trim()
      .to_string();
    let callsign = columns
      .get(1)
      .and_then(Value::as_str)
      .unwrap_or_default()
      .trim()
      .to_string();
    let origin_country = columns
      .get(2)
      .and_then(Value::as_str)
      .unwrap_or("Unknown")
      .to_string();
    let last_contact = columns
      .get(4)
      .and_then(Value::as_i64)
      .unwrap_or(snapshot_time);
    let longitude = columns.get(5).and_then(Value::as_f64);
    let latitude = columns.get(6).and_then(Value::as_f64);
    let Some(longitude) = longitude else {
      continue;
    };
    let Some(latitude) = latitude else {
      continue;
    };

    let age_seconds = snapshot_time.saturating_sub(last_contact);
    let source_state = if age_seconds <= 90 { "live" } else { "delayed" };
    let altitude_ft = columns
      .get(13)
      .and_then(Value::as_f64)
      .or_else(|| columns.get(7).and_then(Value::as_f64))
      .map(meters_to_feet);
    let velocity_kts = columns
      .get(9)
      .and_then(Value::as_f64)
      .map(meters_per_second_to_knots);
    let heading_deg = columns.get(10).and_then(Value::as_f64);
    let vertical_rate_fpm = columns
      .get(11)
      .and_then(Value::as_f64)
      .map(meters_per_second_to_feet_per_minute);
    let on_ground = columns.get(8).and_then(Value::as_bool).unwrap_or(false);

    parsed_flights.push((
      last_contact,
      AirTrafficFlight {
        flight_id: format!(
          "{}-{}",
          if icao24.is_empty() { "unknown" } else { &icao24 },
          last_contact
        ),
        icao24,
        callsign,
        origin_country,
        coordinates: [longitude, latitude],
        altitude_ft,
        velocity_kts,
        heading_deg,
        vertical_rate_fpm,
        on_ground,
        last_contact_at: timestamp_to_rfc3339(last_contact),
        truth_label: format!(
          "Observed transponder state from OpenSky Network. Last contact age {} s.",
          age_seconds
        ),
        source_state: source_state.to_string(),
      },
    ));
  }

  parsed_flights.sort_by(|left, right| right.0.cmp(&left.0));
  parsed_flights.truncate(max_flights);

  let flights = parsed_flights
    .iter()
    .map(|(_, flight)| flight.clone())
    .collect::<Vec<_>>();
  let mean_age_seconds = if parsed_flights.is_empty() {
    0
  } else {
    let total = parsed_flights
      .iter()
      .map(|(last_contact, _)| snapshot_time.saturating_sub(*last_contact))
      .sum::<i64>();
    total / parsed_flights.len() as i64
  };
  let source_state = if mean_age_seconds <= 90 { "live" } else { "delayed" };
  let status_detail = format!(
    "OpenSky {} snapshot for {} with {} aircraft inside the focused AOI bounds; mean contact age {} s.",
    source_state,
    request.focus_aoi_label,
    flights.len(),
    mean_age_seconds
  );

  Ok(FetchCommercialAirTrafficResult {
    provider_label: "OpenSky Network state vectors".to_string(),
    source_url,
    source_license: "public delayed".to_string(),
    focus_aoi_id: request.focus_aoi_id.clone(),
    focus_aoi_label: request.focus_aoi_label.clone(),
    retrieved_at: timestamp_to_rfc3339(snapshot_time),
    source_state: source_state.to_string(),
    status_detail,
    flights,
  })
}

#[tauri::command]
async fn fetch_commercial_air_traffic(
  request: FetchCommercialAirTrafficRequest,
) -> CommandResult<FetchCommercialAirTrafficResult> {
  fetch_commercial_air_traffic_internal(&request).await
}

fn value_as_f64(value: &Value, key: &str) -> Option<f64> {
  value.get(key).and_then(|entry| match entry {
    Value::Number(number) => number.as_f64(),
    Value::String(text) => text.parse::<f64>().ok(),
    _ => None,
  })
}

fn value_as_i64(value: &Value, key: &str) -> Option<i64> {
  value.get(key).and_then(|entry| match entry {
    Value::Number(number) => number.as_i64(),
    Value::String(text) => text.parse::<i64>().ok(),
    _ => None,
  })
}

fn value_as_u32(value: &Value, key: &str) -> Option<u32> {
  value_as_i64(value, key).and_then(|entry| u32::try_from(entry).ok())
}

fn value_as_string(value: &Value, key: &str) -> Option<String> {
  value
    .get(key)
    .and_then(Value::as_str)
    .map(|entry| entry.trim().to_string())
    .filter(|entry| !entry.is_empty())
}

fn parse_governed_satellite_element(value: &Value) -> Option<GovernedSatelliteElement> {
  Some(GovernedSatelliteElement {
    norad_cat_id: value_as_u32(value, "NORAD_CAT_ID")?,
    object_name: value_as_string(value, "OBJECT_NAME")?,
    object_id: value_as_string(value, "OBJECT_ID"),
    epoch: value_as_string(value, "EPOCH")?,
    mean_motion: value_as_f64(value, "MEAN_MOTION")?,
    eccentricity: value_as_f64(value, "ECCENTRICITY")?,
    inclination: value_as_f64(value, "INCLINATION")?,
    ra_of_asc_node: value_as_f64(value, "RA_OF_ASC_NODE")?,
    arg_of_pericenter: value_as_f64(value, "ARG_OF_PERICENTER")?,
    mean_anomaly: value_as_f64(value, "MEAN_ANOMALY")?,
    ephemeris_type: value_as_i64(value, "EPHEMERIS_TYPE"),
    classification_type: value_as_string(value, "CLASSIFICATION_TYPE"),
    element_set_no: value_as_i64(value, "ELEMENT_SET_NO"),
    rev_at_epoch: value_as_i64(value, "REV_AT_EPOCH"),
    bstar: value_as_f64(value, "BSTAR"),
    mean_motion_dot: value_as_f64(value, "MEAN_MOTION_DOT"),
    mean_motion_ddot: value_as_f64(value, "MEAN_MOTION_DDOT"),
  })
}

async fn fetch_satellite_elements_internal(
  request: &FetchSatelliteElementsRequest,
) -> CommandResult<FetchSatelliteElementsResult> {
  let unique_ids = request
    .norad_cat_ids
    .iter()
    .copied()
    .filter(|entry| *entry > 0)
    .take(12)
    .collect::<Vec<_>>();
  if unique_ids.is_empty() {
    return Err("Satellite refresh requires at least one NORAD catalog id".to_string());
  }

  let client = reqwest::Client::builder()
    .timeout(Duration::from_secs(20))
    .build()
    .map_err(|error| format!("Failed to construct governed satellite client: {error}"))?;

  let mut elements: Vec<GovernedSatelliteElement> = Vec::new();
  let mut warnings: Vec<String> = Vec::new();

  for norad_cat_id in unique_ids {
    let source_url = format!(
      "https://celestrak.org/NORAD/elements/gp.php?CATNR={norad_cat_id}&FORMAT=JSON"
    );
    let response = client
      .get(&source_url)
      .header(USER_AGENT, "StratAtlas/0.1.11 (+https://github.com/)")
      .send()
      .await;

    let Ok(response) = response else {
      warnings.push(format!(
        "CATNR {norad_cat_id} request failed: {}",
        response.err().map(|error| error.to_string()).unwrap_or_default()
      ));
      continue;
    };

    if !response.status().is_success() {
      warnings.push(format!(
        "CATNR {norad_cat_id} returned HTTP {}",
        response.status().as_u16()
      ));
      continue;
    }

    let response_json = response
      .json::<Value>()
      .await
      .map_err(|error| format!("Failed to parse satellite response for CATNR {norad_cat_id}: {error}"))?;
    let Some(rows) = response_json.as_array() else {
      warnings.push(format!("CATNR {norad_cat_id} returned a non-array payload."));
      continue;
    };

    if rows.is_empty() {
      warnings.push(format!("CATNR {norad_cat_id} returned no orbital elements."));
      continue;
    }

    if let Some(parsed) = parse_governed_satellite_element(&rows[0]) {
      elements.push(parsed);
    } else {
      warnings.push(format!(
        "CATNR {norad_cat_id} payload was missing required OMM fields."
      ));
    }
  }

  if elements.is_empty() {
    let warning_summary = warnings.join(" ");
    return Err(format!(
      "Governed satellite refresh failed for {}. {}",
      request.focus_aoi_label,
      if warnings.is_empty() {
        "No orbital elements were retrieved."
      } else {
        &warning_summary
      }
    ));
  }

  let status_detail = if warnings.is_empty() {
    format!(
      "CelesTrak live orbital-element refresh retrieved {} governed satellite record(s) for {}.",
      elements.len(),
      request.focus_aoi_label
    )
  } else {
    format!(
      "CelesTrak live orbital-element refresh retrieved {} governed satellite record(s) for {}; some catalog ids were unavailable. {}",
      elements.len(),
      request.focus_aoi_label,
      warnings.join(" ")
    )
  };

  Ok(FetchSatelliteElementsResult {
    provider_label: "CelesTrak GP element sets".to_string(),
    source_url: "https://celestrak.org/NORAD/documentation/gp-data-formats.php".to_string(),
    source_license: "public modeled".to_string(),
    focus_aoi_id: request.focus_aoi_id.clone(),
    focus_aoi_label: request.focus_aoi_label.clone(),
    retrieved_at: Utc::now().to_rfc3339(),
    source_state: "live".to_string(),
    status_detail,
    elements,
  })
}

#[tauri::command]
async fn fetch_satellite_elements(
  request: FetchSatelliteElementsRequest,
) -> CommandResult<FetchSatelliteElementsResult> {
  fetch_satellite_elements_internal(&request).await
}

#[tauri::command]
fn write_map_export_artifact(
  app: AppHandle,
  request: WriteMapExportArtifactRequest,
) -> CommandResult<MapExportArtifact> {
  if request.artifact_id.trim().is_empty() {
    return Err("Map export artifact_id is required".to_string());
  }
  if request.file_name.trim().is_empty() {
    return Err("Map export file_name is required".to_string());
  }
  if !is_valid_marking(&request.marking) {
    return Err(format!("Invalid map export marking {}", request.marking));
  }
  let file_name = Path::new(&request.file_name)
    .file_name()
    .and_then(|value| value.to_str())
    .ok_or_else(|| "Map export file_name must be a valid file name".to_string())?;
  if file_name != request.file_name {
    return Err("Map export file_name must not contain path separators".to_string());
  }
  if !file_name.to_ascii_lowercase().ends_with(".png") {
    return Err("Map export file_name must end in .png".to_string());
  }

  let export_root = exports_dir(&app)?;
  let png_path = export_root.join(file_name);
  fs::write(&png_path, &request.png_bytes).map_err(|error| {
    format!(
      "Failed writing map export artifact {}: {error}",
      png_path.display()
    )
  })?;

  let sha256 = sha256_hex(&request.png_bytes);
  let metadata_path = export_root.join(format!("{}.json", request.artifact_id));
  let metadata = json!({
    "artifactId": request.artifact_id,
    "fileName": file_name,
    "sha256": sha256,
    "sizeBytes": request.png_bytes.len(),
    "width": request.width,
    "height": request.height,
    "generatedAt": request.generated_at,
    "marking": request.marking,
    "bundleId": request.bundle_id,
    "focusAoiId": request.focus_aoi_id,
    "surfaceMode": request.surface_mode,
    "runtimeEngine": request.runtime_engine,
    "visibleLayerCount": request.visible_layer_count,
  });
  let metadata_json = serde_json::to_string_pretty(&metadata)
    .map_err(|error| format!("Failed serializing map export metadata: {error}"))?;
  fs::write(&metadata_path, metadata_json).map_err(|error| {
    format!(
      "Failed writing map export metadata {}: {error}",
      metadata_path.display()
    )
  })?;

  Ok(MapExportArtifact {
    artifact_id: request.artifact_id,
    file_name: file_name.to_string(),
    png_path: png_path.display().to_string(),
    metadata_path: metadata_path.display().to_string(),
    sha256,
    size_bytes: request.png_bytes.len() as u64,
    width: request.width,
    height: request.height,
    generated_at: request.generated_at,
    marking: request.marking,
    bundle_id: request.bundle_id,
    focus_aoi_id: request.focus_aoi_id,
    surface_mode: request.surface_mode,
    runtime_engine: request.runtime_engine,
    visible_layer_count: request.visible_layer_count,
  })
}

#[tauri::command]
fn write_runtime_smoke_evidence(
  app: AppHandle,
  request: WriteRuntimeSmokeEvidenceRequest,
) -> CommandResult<RuntimeSmokeEvidenceResult> {
  let phase_dir_name = match request.phase {
    RuntimeSmokePhase::Cold => "cold",
    RuntimeSmokePhase::Warm => "warm",
  };
  let report_phase_name = match request.report.phase {
    RuntimeSmokePhase::Cold => "cold",
    RuntimeSmokePhase::Warm => "warm",
  };
  if phase_dir_name != report_phase_name {
    return Err("Runtime smoke phase does not match report phase".to_string());
  }

  let artifact_root = runtime_smoke_artifact_root()?;
  let phase_dir = artifact_root.join(phase_dir_name);
  let runtime_proof_dir = phase_dir.join("runtime_proof");
  fs::create_dir_all(&runtime_proof_dir).map_err(|error| {
    format!(
      "Failed creating runtime smoke phase directory {}: {error}",
      runtime_proof_dir.display()
    )
  })?;

  let report_path = phase_dir.join("runtime_smoke_report.json");
  let report_json = serde_json::to_string_pretty(&request.report)
    .map_err(|error| format!("Failed serializing runtime smoke report: {error}"))?;
  fs::write(&report_path, report_json).map_err(|error| {
    format!(
      "Failed writing runtime smoke report {}: {error}",
      report_path.display()
    )
  })?;

  if let Some(mut client) = control_plane_connect()? {
    let control_plane = load_control_plane_state_from_db(&mut client, &app)?;
    let control_plane_json = serde_json::to_string_pretty(&control_plane)
      .map_err(|error| format!("Failed serializing control plane state: {error}"))?;
    fs::write(
      runtime_proof_dir.join("control_plane_state.json"),
      control_plane_json,
    )
    .map_err(|error| format!("Failed writing control plane proof: {error}"))?;

    let quoted = quoted_schema(&control_plane_schema()?);
    let audit_head_query =
      format!("SELECT event_hash FROM {quoted}.audit_head WHERE head_key = $1");
    let audit_head = client
      .query_opt(&audit_head_query, &[&"active"])
      .map_err(|error| format!("Failed reading PostgreSQL audit head for proof export: {error}"))?
      .and_then(|row| row.get::<_, Option<String>>(0));
    let audit_head_json = serde_json::to_string_pretty(&AuditHead {
      event_hash: audit_head,
    })
    .map_err(|error| format!("Failed serializing audit head proof: {error}"))?;
    fs::write(runtime_proof_dir.join("audit_head.json"), audit_head_json)
      .map_err(|error| format!("Failed writing audit head proof: {error}"))?;

    let audit_events_query = format!(
      "SELECT event_json::text FROM {quoted}.audit_events ORDER BY ts ASC"
    );
    let audit_lines = client
      .query(&audit_events_query, &[])
      .map_err(|error| format!("Failed reading PostgreSQL audit events for proof export: {error}"))?
      .iter()
      .map(|row| row.get::<_, String>(0))
      .collect::<Vec<_>>()
      .join("\n");
    fs::write(runtime_proof_dir.join("audit_log.jsonl"), audit_lines)
      .map_err(|error| format!("Failed writing audit log proof: {error}"))?;

    let recorder_state_query =
      format!("SELECT state_json::text FROM {quoted}.recorder_state WHERE state_key = $1");
    if let Some(row) = client
      .query_opt(&recorder_state_query, &[&"current"])
      .map_err(|error| format!("Failed reading PostgreSQL recorder state for proof export: {error}"))?
    {
      fs::write(runtime_proof_dir.join("recorder_state.json"), row.get::<_, String>(0))
        .map_err(|error| format!("Failed writing recorder state proof: {error}"))?;
    }
  }

  let runtime_root = app_runtime_root(&app)?;
  copy_file_if_exists(
    &runtime_root.join("audit").join("audit_head.json"),
    &runtime_proof_dir.join("audit_head.json"),
  )?;
  copy_file_if_exists(
    &runtime_root.join("audit").join("audit_log.jsonl"),
    &runtime_proof_dir.join("audit_log.jsonl"),
  )?;
  copy_file_if_exists(
    &runtime_root.join("state").join("recorder_state.json"),
    &runtime_proof_dir.join("recorder_state.json"),
  )?;

  if let Some(map_export_png_path) = request
    .report
    .map_export_png_path
    .as_ref()
    .filter(|value| !value.trim().is_empty())
  {
    let map_export_dir = runtime_proof_dir.join("map_exports");
    fs::create_dir_all(&map_export_dir).map_err(|error| {
      format!(
        "Failed creating runtime smoke map export directory {}: {error}",
        map_export_dir.display()
      )
    })?;
    let source = PathBuf::from(map_export_png_path);
    let file_name = source
      .file_name()
      .ok_or_else(|| "Map export PNG path missing file name".to_string())?;
    copy_file_if_exists(&source, &map_export_dir.join(file_name))?;
  }

  if let Some(map_export_metadata_path) = request
    .report
    .map_export_metadata_path
    .as_ref()
    .filter(|value| !value.trim().is_empty())
  {
    let map_export_dir = runtime_proof_dir.join("map_exports");
    fs::create_dir_all(&map_export_dir).map_err(|error| {
      format!(
        "Failed creating runtime smoke map export directory {}: {error}",
        map_export_dir.display()
      )
    })?;
    let source = PathBuf::from(map_export_metadata_path);
    let file_name = source
      .file_name()
      .ok_or_else(|| "Map export metadata path missing file name".to_string())?;
    copy_file_if_exists(&source, &map_export_dir.join(file_name))?;
  }

  if let Some(bundle_id) = request
    .report
    .selected_bundle_id
    .as_ref()
    .filter(|value| !value.trim().is_empty())
  {
    let bundle_source = bundles_dir(&app)?.join(bundle_id);
    let bundle_destination = runtime_proof_dir.join("bundles").join(bundle_id);
    copy_directory_recursive(&bundle_source, &bundle_destination)?;
  }

  Ok(RuntimeSmokeEvidenceResult {
    phase_dir: phase_dir.display().to_string(),
    report_path: report_path.display().to_string(),
    runtime_proof_dir: runtime_proof_dir.display().to_string(),
  })
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
      load_recorder_state,
      get_control_plane_state,
      get_ai_gateway_provider_status,
      run_ai_gateway_provider_analysis,
      run_strategic_model_solve,
      query_context_records,
      fetch_commercial_air_traffic,
      fetch_satellite_elements,
      write_map_export_artifact,
      write_runtime_smoke_evidence
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[cfg(test)]
mod tests {
  use super::{
    canonical_json_bytes,
    control_plane_connect,
    control_plane_schema,
    ensure_valid_relative_path,
    persist_control_plane_from_state,
    query_context_records_from_db,
    quoted_schema,
    sha256_hex,
    upsert_bundle_registry_entry,
    BundleAsset,
    BundleManifest,
    ContextTimeRange,
    ProvenanceRef,
    QueryContextRecordsRequest,
    RecorderState,
  };
  use serde_json::json;
  use std::env;

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

  #[test]
  #[ignore = "requires live PostgreSQL/PostGIS control plane environment"]
  fn live_control_plane_query_roundtrip() {
    let dsn = env::var("STRATATLAS_CONTROL_PLANE_DSN")
      .expect("STRATATLAS_CONTROL_PLANE_DSN must be set for live control-plane tests");
    let schema = env::var("STRATATLAS_CONTROL_PLANE_SCHEMA")
      .expect("STRATATLAS_CONTROL_PLANE_SCHEMA must be set for live control-plane tests");

    env::set_var("STRATATLAS_CONTROL_PLANE_DSN", &dsn);
    env::set_var("STRATATLAS_CONTROL_PLANE_SCHEMA", &schema);

    let mut client = control_plane_connect()
      .expect("connect live control plane")
      .expect("live control plane should be configured");

    let state = RecorderState {
      workspace: json!({
        "mode": "analysis",
        "workflowMode": "query",
        "note": "Live control-plane integration test",
        "activeLayers": ["context-panel"],
        "replayCursor": 0,
        "forcedOffline": false,
        "uiVersion": "wp-i0-003-live-test"
      }),
      query: json!({
        "definition": {
          "aoi": "aoi-1",
          "conditions": [],
          "contextDomainIds": ["maritime"],
          "provenanceSource": "Live integration test",
          "queryId": "query-live",
          "timeWindow": {
            "startHour": 8,
            "endHour": 18
          },
          "title": "Live control plane test query",
          "version": 1
        },
        "matchedRowIds": [],
        "resultCount": 0,
        "savedVersions": [],
        "sourceRowCount": 0
      }),
      context: json!({
        "domains": [
          {
            "domain_id": "maritime",
            "label": "Maritime domain",
            "marking": "INTERNAL"
          }
        ],
        "activeDomainIds": ["maritime"],
        "correlationAoi": "aoi-1",
        "correlationLinks": [
          {
            "link_id": "link-live-1",
            "domain_id": "maritime",
            "target_id": "port-1",
            "time_range": {
              "start": "2026-03-06T08:00:00Z",
              "end": "2026-03-06T18:00:00Z"
            },
            "summary": "Live integration correlation"
          }
        ],
        "queryRange": {
          "start": "2026-03-06T08:00:00Z",
          "end": "2026-03-06T18:00:00Z"
        },
        "records": [
          {
            "record_id": "record-live-1",
            "domain_id": "maritime",
            "target_id": "port-1",
            "observed_at": "2026-03-06T09:00:00Z",
            "cached_at": "2026-03-06T09:05:00Z",
            "value": 42
          },
          {
            "record_id": "record-live-2",
            "domain_id": "maritime",
            "target_id": "port-1",
            "observed_at": "2026-03-06T20:00:00Z",
            "cached_at": "2026-03-06T20:05:00Z",
            "value": 99
          }
        ]
      }),
      compare: None,
      collaboration: None,
      scenario: None,
      ai: Some(json!({
        "deploymentProfile": "restricted"
      })),
      deviation: None,
      osint: None,
      game_model: None,
      selected_bundle_id: Some("bundle-live-test".to_string()),
      saved_at: "2026-03-06T10:00:00Z".to_string(),
    };

    persist_control_plane_from_state(&mut client, &state).expect("persist live recorder state");

    let live_provenance = ProvenanceRef {
      source: "live-test".to_string(),
      license: "internal".to_string(),
      retrieved_at: "2026-03-06T08:00:00Z".to_string(),
      pipeline_version: "wp-i0-003-live".to_string(),
    };
    let live_asset = BundleAsset {
      asset_id: "state-snapshot".to_string(),
      sha256: sha256_hex(b"bundle-live-root-asset"),
      media_type: "application/json".to_string(),
      size_bytes: 128,
      bundle_relative_path: "assets/state_snapshot.json".to_string(),
      marking: "INTERNAL".to_string(),
      captured_at: "2026-03-06T10:00:00Z".to_string(),
      provenance_refs: vec![live_provenance.clone()],
    };
    let root_manifest = BundleManifest {
      bundle_id: "bundle-live-root".to_string(),
      created_at: "2026-03-06T10:00:00Z".to_string(),
      created_by_role: "analyst".to_string(),
      marking: "INTERNAL".to_string(),
      assets: vec![live_asset.clone()],
      ui_state_hash: sha256_hex(b"bundle-live-root-ui"),
      derived_artifact_hashes: vec![sha256_hex(b"bundle-live-root-derived")],
      provenance_refs: vec![live_provenance.clone()],
      supersedes_bundle_id: None,
    };
    let correction_manifest = BundleManifest {
      bundle_id: "bundle-live-correction".to_string(),
      created_at: "2026-03-06T11:00:00Z".to_string(),
      created_by_role: "analyst".to_string(),
      marking: "INTERNAL".to_string(),
      assets: vec![live_asset],
      ui_state_hash: sha256_hex(b"bundle-live-correction-ui"),
      derived_artifact_hashes: vec![sha256_hex(b"bundle-live-correction-derived")],
      provenance_refs: vec![live_provenance],
      supersedes_bundle_id: Some("bundle-live-root".to_string()),
    };

    upsert_bundle_registry_entry(&mut client, &root_manifest)
      .expect("persist root bundle manifest");
    upsert_bundle_registry_entry(&mut client, &correction_manifest)
      .expect("persist correction bundle manifest");

    let query_result = query_context_records_from_db(
      &mut client,
      &QueryContextRecordsRequest {
        domain_ids: vec!["maritime".to_string()],
        target_id: "port-1".to_string(),
        time_range: ContextTimeRange {
          start: "2026-03-06T08:30:00Z".to_string(),
          end: "2026-03-06T12:00:00Z".to_string(),
        },
        limit: Some(10),
      },
    )
    .expect("query live context records");

    assert_eq!(query_result.source, "control_plane");
    assert_eq!(query_result.total_records, 1);
    assert_eq!(
      query_result.records[0].get("record_id").and_then(|value| value.as_str()),
      Some("record-live-1")
    );

    let quoted = quoted_schema(&control_plane_schema().expect("read live schema"));
    let supersedes_query =
      format!("SELECT supersedes_bundle_id FROM {quoted}.bundle_registry WHERE bundle_id = $1");
    let supersedes_bundle_id: Option<String> = client
      .query_one(&supersedes_query, &[&"bundle-live-correction"])
      .expect("query supersedes bundle id")
      .get(0);
    assert_eq!(supersedes_bundle_id.as_deref(), Some("bundle-live-root"));

    let active_profile_query =
      format!("SELECT active_deployment_profile_id FROM {quoted}.control_plane_state WHERE state_key = $1");
    let active_profile: Option<String> = client
      .query_one(&active_profile_query, &[&"active"])
      .expect("query active control-plane profile")
      .get(0);
    assert_eq!(active_profile.as_deref(), Some("restricted"));

    let domain_count_query = format!("SELECT COUNT(*) FROM {quoted}.context_domains");
    let domain_count: i64 = client
      .query_one(&domain_count_query, &[])
      .expect("query context domain count")
      .get(0);
    assert_eq!(domain_count, 1);

    let link_count_query = format!("SELECT COUNT(*) FROM {quoted}.correlation_links");
    let link_count: i64 = client
      .query_one(&link_count_query, &[])
      .expect("query correlation link count")
      .get(0);
    assert_eq!(link_count, 1);

    let aoi_count_query =
      format!("SELECT COUNT(*) FROM {quoted}.aoi_registry WHERE aoi_id = $1");
    let aoi_count: i64 = client
      .query_one(&aoi_count_query, &[&"aoi-1"])
      .expect("query aoi registry")
      .get(0);
    assert_eq!(aoi_count, 1);
  }
}
