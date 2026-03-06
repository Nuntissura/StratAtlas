import type { UiMode } from '../features/i1/modes'
import type { CompareStateSnapshot } from '../features/i2/baselineDelta'
import type { CollaborationStateSnapshot } from '../features/i3/collaboration'
import type { ScenarioStateSnapshot } from '../features/i4/scenarios'
import type { QueryRenderLayer, SavedQueryArtifact, VersionedQuery } from '../features/i5/queryBuilder'
import type { ContextDomain } from '../features/i7/contextIntake'

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
}

export interface RecorderState {
  workspace: WorkspaceStateSnapshot
  query: QueryStateSnapshot
  context: ContextSnapshot
  compare?: CompareStateSnapshot
  collaboration?: CollaborationStateSnapshot
  scenario?: ScenarioStateSnapshot
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
