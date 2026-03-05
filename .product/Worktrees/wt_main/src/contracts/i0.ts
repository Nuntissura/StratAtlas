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
  ui_state: Record<string, unknown>
  provenance_refs: ProvenanceRef[]
  supersedes_bundle_id?: string
}

export interface OpenBundleResult {
  manifest: BundleManifest
  ui_state: Record<string, unknown>
}

export interface AuditHead {
  event_hash?: string
}

export interface AppendAuditRequest {
  role: UserRole
  event_type: string
  payload: Record<string, unknown>
}
