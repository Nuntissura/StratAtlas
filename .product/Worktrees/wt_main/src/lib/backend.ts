import { invoke } from '@tauri-apps/api/core'
import type {
  AppendAuditRequest,
  AuditEvent,
  AuditHead,
  BundleAsset,
  BundleManifest,
  CreateBundleRequest,
  LoadRecorderStateResult,
  OpenBundleResult,
  ProvenanceRef,
  RecorderState,
  SaveRecorderStateRequest,
  SensitivityMarking,
} from '../contracts/i0'

const FALLBACK_BUNDLES_KEY = 'stratatlas.fallback.bundles'
const FALLBACK_AUDIT_KEY = 'stratatlas.fallback.audit'
const FALLBACK_RECORDER_STATE_KEY = 'stratatlas.fallback.recorder-state'

type StoredBundle = {
  manifest: BundleManifest
  assets: Record<string, unknown>
}

const isTauriRuntime = (): boolean =>
  typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window

const nowIso = (): string => new Date().toISOString()

const randomId = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const normalizeJson = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map((entry) => normalizeJson(entry))
  }
  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, entry]) => [key, normalizeJson(entry)]),
    )
  }
  return value
}

const encodeHex = (bytes: Uint8Array): string =>
  [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')

const sha256 = async (input: string): Promise<string> => {
  const encoded = new TextEncoder().encode(input)
  const digest = await crypto.subtle.digest('SHA-256', encoded)
  return encodeHex(new Uint8Array(digest))
}

const readJson = <T>(key: string, fallback: T): T => {
  const raw = localStorage.getItem(key)
  if (!raw) {
    return fallback
  }
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

const writeJson = (key: string, value: unknown): void => {
  localStorage.setItem(key, JSON.stringify(value))
}

const canonicalize = (value: unknown): string => JSON.stringify(normalizeJson(value))

const BUNDLE_ASSET_PATHS = {
  'workspace-state': 'assets/workspace_state.json',
  'query-state': 'assets/query_state.json',
  'context-snapshot': 'assets/context_snapshot.json',
  'compare-state': 'assets/compare_state.json',
  'collaboration-state': 'assets/collaboration_state.json',
  'scenario-state': 'assets/scenario_state.json',
  'ai-state': 'assets/ai_state.json',
  'recorder-state': 'assets/recorder_state.json',
} as const

const buildBundleAsset = async ({
  assetId,
  value,
  marking,
  provenanceRefs,
  capturedAt,
}: {
  assetId: keyof typeof BUNDLE_ASSET_PATHS
  value: unknown
  marking: SensitivityMarking
  provenanceRefs: ProvenanceRef[]
  capturedAt: string
}): Promise<{ asset: BundleAsset; payload: unknown }> => {
  const payload = normalizeJson(value)
  const payloadJson = canonicalize(payload)
  const payloadHash = await sha256(payloadJson)

  return {
    asset: {
      asset_id: assetId,
      sha256: payloadHash,
      media_type: 'application/json',
      size_bytes: payloadJson.length,
      bundle_relative_path: BUNDLE_ASSET_PATHS[assetId],
      marking,
      captured_at: capturedAt,
      provenance_refs: provenanceRefs,
    },
    payload,
  }
}

const buildBundleAssets = async (
  request: CreateBundleRequest,
): Promise<Array<{ asset: BundleAsset; payload: unknown }>> => {
  const capturedAt = nowIso()
  return Promise.all([
    buildBundleAsset({
      assetId: 'workspace-state',
      value: request.state.workspace,
      marking: request.marking,
      provenanceRefs: request.provenance_refs,
      capturedAt,
    }),
    buildBundleAsset({
      assetId: 'query-state',
      value: request.state.query,
      marking: request.marking,
      provenanceRefs: request.provenance_refs,
      capturedAt,
    }),
    buildBundleAsset({
      assetId: 'context-snapshot',
      value: request.state.context,
      marking: request.marking,
      provenanceRefs: request.provenance_refs,
      capturedAt,
    }),
    buildBundleAsset({
      assetId: 'compare-state',
      value: request.state.compare ?? null,
      marking: request.marking,
      provenanceRefs: request.provenance_refs,
      capturedAt,
    }),
    buildBundleAsset({
      assetId: 'collaboration-state',
      value: request.state.collaboration ?? null,
      marking: request.marking,
      provenanceRefs: request.provenance_refs,
      capturedAt,
    }),
    buildBundleAsset({
      assetId: 'scenario-state',
      value: request.state.scenario ?? null,
      marking: request.marking,
      provenanceRefs: request.provenance_refs,
      capturedAt,
    }),
    buildBundleAsset({
      assetId: 'ai-state',
      value: request.state.ai ?? null,
      marking: request.marking,
      provenanceRefs: request.provenance_refs,
      capturedAt,
    }),
    buildBundleAsset({
      assetId: 'recorder-state',
      value: request.state,
      marking: request.marking,
      provenanceRefs: request.provenance_refs,
      capturedAt,
    }),
  ])
}

const fallbackAppendAudit = async (
  request: AppendAuditRequest,
): Promise<AuditEvent> => {
  const events = readJson<AuditEvent[]>(FALLBACK_AUDIT_KEY, [])
  const prev = events.at(-1)?.event_hash
  const ts = nowIso()
  const payloadHash = await sha256(canonicalize(request.payload))
  const canonical = JSON.stringify({
    actor_role: request.role,
    event_type: request.event_type,
    payload_hash: payloadHash,
    prev_event_hash: prev ?? null,
    ts,
  })
  const eventHash = await sha256(`${prev ?? ''}${canonical}`)
  const event: AuditEvent = {
    event_id: randomId(),
    ts,
    actor_role: request.role,
    event_type: request.event_type,
    payload_hash: payloadHash,
    prev_event_hash: prev,
    event_hash: eventHash,
  }
  events.push(event)
  writeJson(FALLBACK_AUDIT_KEY, events)
  return event
}

const createFallbackBundle = async (
  request: CreateBundleRequest,
): Promise<BundleManifest> => {
  const bundles = readJson<StoredBundle[]>(FALLBACK_BUNDLES_KEY, [])
  const bundleId = randomId()
  const assets = await buildBundleAssets(request)
  const workspaceAsset = assets.find(({ asset }) => asset.asset_id === 'workspace-state')
  if (!workspaceAsset) {
    throw new Error('Workspace asset generation failed')
  }
  const manifest: BundleManifest = {
    bundle_id: bundleId,
    created_at: nowIso(),
    created_by_role: request.role,
    marking: request.marking,
    assets: assets.map(({ asset }) => asset),
    ui_state_hash: workspaceAsset.asset.sha256,
    derived_artifact_hashes: assets.map(({ asset }) => asset.sha256),
    provenance_refs: request.provenance_refs,
    supersedes_bundle_id: request.supersedes_bundle_id,
  }

  bundles.unshift({
    manifest,
    assets: Object.fromEntries(assets.map(({ asset, payload }) => [asset.asset_id, payload])),
  })
  writeJson(FALLBACK_BUNDLES_KEY, bundles)
  writeJson(FALLBACK_RECORDER_STATE_KEY, normalizeJson(request.state))
  await fallbackAppendAudit({
    role: request.role,
    event_type: 'bundle.create',
    payload: {
      bundle_id: bundleId,
      marking: request.marking,
      asset_ids: manifest.assets.map((asset) => asset.asset_id),
    },
  })
  return manifest
}

const fallbackOpenBundle = async (bundleId: string, role: string): Promise<OpenBundleResult> => {
  const bundles = readJson<StoredBundle[]>(FALLBACK_BUNDLES_KEY, [])
  const selected = bundles.find((b) => b.manifest.bundle_id === bundleId)
  if (!selected) {
    throw new Error(`Bundle not found: ${bundleId}`)
  }

  for (const asset of selected.manifest.assets) {
    const payload = selected.assets[asset.asset_id]
    if (typeof payload === 'undefined') {
      throw new Error(`Bundle missing payload for asset ${asset.asset_id}`)
    }
    const currentHash = await sha256(canonicalize(payload))
    if (currentHash !== asset.sha256) {
      throw new Error(`Determinism check failed while reopening asset ${asset.asset_id}`)
    }
  }

  const workspaceState = selected.assets['workspace-state']
  const queryState = selected.assets['query-state']
  const contextSnapshot = selected.assets['context-snapshot']
  const compareSnapshot = selected.assets['compare-state']
  const collaborationSnapshot = selected.assets['collaboration-state']
  const scenarioSnapshot = selected.assets['scenario-state']
  const aiSnapshot = selected.assets['ai-state']
  const recorderState = selected.assets['recorder-state']

  if (!isRecord(recorderState)) {
    throw new Error('Recorder state asset is invalid')
  }
  if (
    canonicalize((recorderState as Record<string, unknown>).workspace) !== canonicalize(workspaceState) ||
    canonicalize((recorderState as Record<string, unknown>).query) !== canonicalize(queryState) ||
    canonicalize((recorderState as Record<string, unknown>).context) !== canonicalize(contextSnapshot)
  ) {
    throw new Error('Recorder state asset does not match typed bundle assets')
  }
  if (
    selected.manifest.assets.some((asset) => asset.asset_id === 'compare-state') &&
    canonicalize((recorderState as Record<string, unknown>).compare ?? null) !==
      canonicalize(typeof compareSnapshot === 'undefined' ? null : compareSnapshot)
  ) {
    throw new Error('Recorder state asset does not match compare-state asset')
  }
  if (
    selected.manifest.assets.some((asset) => asset.asset_id === 'collaboration-state') &&
    canonicalize((recorderState as Record<string, unknown>).collaboration ?? null) !==
      canonicalize(typeof collaborationSnapshot === 'undefined' ? null : collaborationSnapshot)
  ) {
    throw new Error('Recorder state asset does not match collaboration-state asset')
  }
  if (
    selected.manifest.assets.some((asset) => asset.asset_id === 'scenario-state') &&
    canonicalize((recorderState as Record<string, unknown>).scenario ?? null) !==
      canonicalize(typeof scenarioSnapshot === 'undefined' ? null : scenarioSnapshot)
  ) {
    throw new Error('Recorder state asset does not match scenario-state asset')
  }
  if (
    selected.manifest.assets.some((asset) => asset.asset_id === 'ai-state') &&
    canonicalize((recorderState as Record<string, unknown>).ai ?? null) !==
      canonicalize(typeof aiSnapshot === 'undefined' ? null : aiSnapshot)
  ) {
    throw new Error('Recorder state asset does not match ai-state asset')
  }

  await fallbackAppendAudit({
    role: role as AppendAuditRequest['role'],
    event_type: 'bundle.open',
    payload: {
      bundle_id: bundleId,
      ui_state_hash: selected.manifest.ui_state_hash,
      asset_ids: selected.manifest.assets.map((asset) => asset.asset_id),
    },
  })
  writeJson(FALLBACK_RECORDER_STATE_KEY, normalizeJson(recorderState))

  return {
    manifest: selected.manifest,
    state: recorderState as unknown as RecorderState,
  }
}

const fallbackLoadRecorderState = async (): Promise<LoadRecorderStateResult> => {
  const state = readJson<RecorderState | undefined>(FALLBACK_RECORDER_STATE_KEY, undefined)
  return { state }
}

const fallbackSaveRecorderState = async (
  request: SaveRecorderStateRequest,
): Promise<RecorderState> => {
  const normalized = normalizeJson(request.state) as RecorderState
  writeJson(FALLBACK_RECORDER_STATE_KEY, normalized)
  return normalized
}

export const backend = {
  async createBundle(request: CreateBundleRequest): Promise<BundleManifest> {
    if (isTauriRuntime()) {
      return invoke<BundleManifest>('create_bundle', { request })
    }
    return createFallbackBundle(request)
  },

  async openBundle(bundleId: string, role: AppendAuditRequest['role']): Promise<OpenBundleResult> {
    if (isTauriRuntime()) {
      return invoke<OpenBundleResult>('open_bundle', { bundleId, role })
    }
    return fallbackOpenBundle(bundleId, role)
  },

  async listBundles(): Promise<BundleManifest[]> {
    if (isTauriRuntime()) {
      return invoke<BundleManifest[]>('list_bundles')
    }
    return readJson<StoredBundle[]>(FALLBACK_BUNDLES_KEY, []).map((b) => b.manifest)
  },

  async appendAudit(request: AppendAuditRequest): Promise<AuditEvent> {
    if (isTauriRuntime()) {
      return invoke<AuditEvent>('append_audit_event', { request })
    }
    return fallbackAppendAudit(request)
  },

  async listAuditEvents(limit = 200): Promise<AuditEvent[]> {
    if (isTauriRuntime()) {
      return invoke<AuditEvent[]>('list_audit_events', { limit })
    }
    const events = readJson<AuditEvent[]>(FALLBACK_AUDIT_KEY, [])
    return events.slice(-limit)
  },

  async getAuditHead(): Promise<AuditHead> {
    if (isTauriRuntime()) {
      return invoke<AuditHead>('get_audit_head')
    }
    const events = readJson<AuditEvent[]>(FALLBACK_AUDIT_KEY, [])
    return { event_hash: events.at(-1)?.event_hash }
  },

  async loadRecorderState(): Promise<LoadRecorderStateResult> {
    if (isTauriRuntime()) {
      return invoke<LoadRecorderStateResult>('load_recorder_state')
    }
    return fallbackLoadRecorderState()
  },

  async saveRecorderState(request: SaveRecorderStateRequest): Promise<RecorderState> {
    if (isTauriRuntime()) {
      return invoke<RecorderState>('save_recorder_state', { request })
    }
    return fallbackSaveRecorderState(request)
  },
}
