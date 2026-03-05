import { invoke } from '@tauri-apps/api/core'
import type {
  AppendAuditRequest,
  AuditEvent,
  AuditHead,
  BundleAsset,
  BundleManifest,
  CreateBundleRequest,
  OpenBundleResult,
} from '../contracts/i0'

const FALLBACK_BUNDLES_KEY = 'stratatlas.fallback.bundles'
const FALLBACK_AUDIT_KEY = 'stratatlas.fallback.audit'

type StoredBundle = {
  manifest: BundleManifest
  uiState: Record<string, unknown>
}

const isTauriRuntime = (): boolean =>
  typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window

const nowIso = (): string => new Date().toISOString()

const randomId = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`

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

const canonicalize = (obj: Record<string, unknown>): string => {
  const entries = Object.entries(obj).sort(([a], [b]) => a.localeCompare(b))
  return JSON.stringify(Object.fromEntries(entries))
}

const createFallbackBundle = async (
  request: CreateBundleRequest,
): Promise<BundleManifest> => {
  const bundles = readJson<StoredBundle[]>(FALLBACK_BUNDLES_KEY, [])
  const bundleId = randomId()
  const uiStateJson = canonicalize(request.ui_state)
  const uiHash = await sha256(uiStateJson)
  const asset: BundleAsset = {
    asset_id: 'ui-state',
    sha256: uiHash,
    media_type: 'application/json',
    size_bytes: uiStateJson.length,
    bundle_relative_path: 'assets/ui_state.json',
  }
  const manifest: BundleManifest = {
    bundle_id: bundleId,
    created_at: nowIso(),
    created_by_role: request.role,
    marking: request.marking,
    assets: [asset],
    ui_state_hash: uiHash,
    derived_artifact_hashes: [uiHash],
    provenance_refs: request.provenance_refs,
    supersedes_bundle_id: request.supersedes_bundle_id,
  }

  bundles.unshift({
    manifest,
    uiState: request.ui_state,
  })
  writeJson(FALLBACK_BUNDLES_KEY, bundles)
  return manifest
}

const fallbackOpenBundle = async (bundleId: string): Promise<OpenBundleResult> => {
  const bundles = readJson<StoredBundle[]>(FALLBACK_BUNDLES_KEY, [])
  const selected = bundles.find((b) => b.manifest.bundle_id === bundleId)
  if (!selected) {
    throw new Error(`Bundle not found: ${bundleId}`)
  }
  const currentHash = await sha256(canonicalize(selected.uiState))
  if (currentHash !== selected.manifest.ui_state_hash) {
    throw new Error('Determinism check failed while reopening bundle')
  }
  return {
    manifest: selected.manifest,
    ui_state: selected.uiState,
  }
}

const fallbackAppendAudit = async (
  request: AppendAuditRequest,
): Promise<AuditEvent> => {
  const events = readJson<AuditEvent[]>(FALLBACK_AUDIT_KEY, [])
  const prev = events.at(-1)?.event_hash
  const payloadHash = await sha256(canonicalize(request.payload))
  const canonical = JSON.stringify({
    actor_role: request.role,
    event_type: request.event_type,
    payload_hash: payloadHash,
    prev_event_hash: prev ?? null,
    ts: nowIso(),
  })
  const eventHash = await sha256(`${prev ?? ''}${canonical}`)
  const event: AuditEvent = {
    event_id: randomId(),
    ts: nowIso(),
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

export const backend = {
  async createBundle(request: CreateBundleRequest): Promise<BundleManifest> {
    if (isTauriRuntime()) {
      return invoke<BundleManifest>('create_bundle', { request })
    }
    return createFallbackBundle(request)
  },

  async openBundle(bundleId: string): Promise<OpenBundleResult> {
    if (isTauriRuntime()) {
      return invoke<OpenBundleResult>('open_bundle', { bundleId })
    }
    return fallbackOpenBundle(bundleId)
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
}
