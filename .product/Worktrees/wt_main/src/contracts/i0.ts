import type { UiMode } from '../features/i1/modes'
import type { CompareStateSnapshot } from '../features/i2/baselineDelta'
import type { CollaborationStateSnapshot } from '../features/i3/collaboration'
import type { ScenarioStateSnapshot } from '../features/i4/scenarios'
import type { QueryRenderLayer, SavedQueryArtifact, VersionedQuery } from '../features/i5/queryBuilder'
import type { AiGatewaySnapshot, DeploymentProfileId } from '../features/i6/aiGateway'
import type {
  ContextCorrelationLink,
  ContextDomain,
  ContextRecord,
  ContextTimeRange,
} from '../features/i7/contextIntake'
import type { DeviationSnapshot } from '../features/i8/deviation'
import type { OsintSnapshot } from '../features/i9/osint'
import type { GameModelSnapshot } from '../features/i10/gameModeling'

export type UserRole = 'viewer' | 'analyst' | 'administrator' | 'auditor'

export type SensitivityMarking = 'PUBLIC' | 'INTERNAL' | 'RESTRICTED'

export interface ProvenanceRef {
  source: string
  license: string
  retrievedAt: string
  pipelineVersion: string
}

export interface BundleAsset {
  asset_id: string
  sha256: string
  media_type: string
  size_bytes: number
  bundle_relative_path: string
  marking: SensitivityMarking
  captured_at: string
  provenance_refs: ProvenanceRef[]
}

export interface BundleManifest {
  bundle_id: string
  created_at: string
  created_by_role: UserRole
  marking: SensitivityMarking
  assets: BundleAsset[]
  ui_state_hash: string
  derived_artifact_hashes: string[]
  provenance_refs: ProvenanceRef[]
  supersedes_bundle_id?: string
}

export interface BundleRegistryEntry {
  bundleId: string
  createdAt: string
  createdByRole: UserRole
  marking: SensitivityMarking
  uiStateHash: string
  manifestArtifactHash: string
  assetCount: number
  supersedesBundleId?: string
}

export interface GovernedDeploymentProfile {
  id: DeploymentProfileId
  label: string
  identityMode: string
  keyManagement: string
  storagePlacement: string
  auditRetention: string
  aiEnabled: boolean
  mcpEnabled: boolean
  externalAiAccessEnabled: boolean
}

export interface ControlPlaneState {
  activeDeploymentProfileId: DeploymentProfileId
  deploymentProfiles: GovernedDeploymentProfile[]
  bundleRegistry: BundleRegistryEntry[]
  contextDomainRegistry: ContextDomain[]
  correlationLinks: ContextCorrelationLink[]
  storageBackend: 'postgresql-postgis'
  contextStoreBackend: 'postgresql-indexed'
  artifactStorePath: string
  updatedAt: string
}

export interface WorkspaceStateSnapshot {
  mode: string
  workflowMode: UiMode
  note: string
  activeLayers: string[]
  replayCursor: number
  forcedOffline: boolean
  uiVersion: string
}

export interface QueryStateSnapshot {
  definition: VersionedQuery
  resultCount: number
  sourceRowCount: number
  matchedRowIds: number[]
  savedVersions: VersionedQuery[]
  renderLayer?: QueryRenderLayer
  savedArtifact?: SavedQueryArtifact
}

export interface ContextSnapshot {
  domains: ContextDomain[]
  activeDomainIds: string[]
  correlationAoi: string
  correlationLinks?: ContextCorrelationLink[]
  records?: ContextRecord[]
  queryRange?: ContextTimeRange
}

export interface RecorderState {
  workspace: WorkspaceStateSnapshot
  query: QueryStateSnapshot
  context: ContextSnapshot
  compare?: CompareStateSnapshot
  collaboration?: CollaborationStateSnapshot
  scenario?: ScenarioStateSnapshot
  ai?: AiGatewaySnapshot
  deviation?: DeviationSnapshot
  osint?: OsintSnapshot
  gameModel?: GameModelSnapshot
  selectedBundleId?: string
  savedAt: string
}

export interface AuditEvent {
  event_id: string
  ts: string
  actor_role: UserRole
  event_type: string
  payload_hash: string
  prev_event_hash?: string
  event_hash: string
}

export interface CreateBundleRequest {
  role: UserRole
  marking: SensitivityMarking
  state: RecorderState
  provenance_refs: ProvenanceRef[]
  supersedes_bundle_id?: string
}

export interface OpenBundleResult {
  manifest: BundleManifest
  state: RecorderState
}

export interface AuditHead {
  event_hash?: string
}

export interface AppendAuditRequest {
  role: UserRole
  event_type: string
  payload: Record<string, unknown>
}

export interface LoadRecorderStateResult {
  state?: RecorderState
}

export interface SaveRecorderStateRequest {
  role: UserRole
  state: RecorderState
}

export interface QueryContextRecordsRequest {
  domainIds: string[]
  targetId: string
  timeRange: ContextTimeRange
  limit?: number
}

export interface QueryContextRecordsResult {
  records: ContextRecord[]
  queryRange: ContextTimeRange
  totalRecords: number
  source: 'control_plane' | 'fallback'
}

export type RuntimeSmokePhase = 'cold' | 'warm'

export interface RuntimeSmokeWindowSnapshot {
  title: string
  width: number
  height: number
}

export interface RuntimeSmokeRegionCheck {
  id: string
  present: boolean
}

export interface RuntimeSmokeAssertion {
  id: string
  passed: boolean
  detail: string
}

export interface RuntimeSmokeMetric {
  label: string
  measuredMs: number
  budgetMs?: number
  passed?: boolean
}

export interface RuntimeSmokeReport {
  phase: RuntimeSmokePhase
  capturedAt: string
  startupMs: number
  window: RuntimeSmokeWindowSnapshot
  mode: UiMode
  selectedBundleId?: string
  bundleCount: number
  activeLayerCount: number
  degradedBudgetCount: number
  offline: boolean
  status: string
  integrityState: string
  scenarioExportArtifactId?: string
  auditEventCount: number
  platform: string
  mapRuntimeVisible: boolean
  mapRuntimeInteractive: boolean
  mapSurfaceMode: 'planar' | 'orbital'
  mapRuntimeEngine: 'fallback' | 'maplibre' | 'cesium'
  mapPlanarReady: boolean
  mapOrbitalReady: boolean
  mapFocusAoiId: string
  mapInspectCount: number
  mapRuntimeError?: string
  activeContextDomainCount: number
  contextRecordCount: number
  correlationAoi: string
  governedContextDomainId?: string
  requireLiveAi: boolean
  requireMcp: boolean
  aiProviderLabel: string
  aiProviderRuntime: string
  aiProviderAvailable: boolean
  aiProviderDetail: string
  aiArtifactId?: string
  aiRequestId?: string
  aiGatewayRuntime?: string
  mcpInvocationId?: string
  mcpInvocationStatus?: 'allowed' | 'denied'
  mcpToolName?: string
  regions: RuntimeSmokeRegionCheck[]
  assertions: RuntimeSmokeAssertion[]
  metrics: RuntimeSmokeMetric[]
  notes: string[]
}

export interface WriteRuntimeSmokeEvidenceRequest {
  phase: RuntimeSmokePhase
  report: RuntimeSmokeReport
}

export interface RuntimeSmokeEvidenceResult {
  phaseDir: string
  reportPath: string
  runtimeProofDir: string
}
