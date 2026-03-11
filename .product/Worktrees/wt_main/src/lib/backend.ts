import { invoke } from '@tauri-apps/api/core'
import type {
  AppendAuditRequest,
  AuditEvent,
  AuditHead,
  BundleAsset,
  BundleManifest,
  BundleRegistryEntry,
  ControlPlaneState,
  CreateBundleRequest,
  GovernedDeploymentProfile,
  LoadRecorderStateResult,
  MapExportArtifact,
  OpenBundleResult,
  ProvenanceRef,
  QueryContextRecordsRequest,
  QueryContextRecordsResult,
  RecorderState,
  RuntimeSmokeEvidenceResult,
  WriteMapExportArtifactRequest,
  WriteRuntimeSmokeEvidenceRequest,
  SaveRecorderStateRequest,
  SensitivityMarking,
} from '../contracts/i0'
import {
  DEPLOYMENT_PROFILES,
  createBrowserSimulatedAiProviderStatus,
  type AiGatewayProviderAnalysisRequest,
  type AiGatewayProviderAnalysisResult,
  type AiGatewayProviderStatus,
  type DeploymentProfileId,
} from '../features/i6/aiGateway'
import {
  queryContextRecords as queryGovernedContextRecords,
  type ContextCorrelationLink,
  type ContextDomain,
  type ContextRecord,
} from '../features/i7/contextIntake'
import {
  normalizeGameModelSnapshot,
  runGameSolver,
  type StrategicSolverRequest,
  type StrategicSolverResult,
} from '../features/i10/gameModeling'
import {
  createPackagedAirTrafficSnapshot,
  type FetchCommercialAirTrafficRequest,
  type FetchCommercialAirTrafficResult,
} from '../features/i1/airTraffic'
import {
  createPackagedSatelliteSnapshot,
  type FetchSatelliteElementsRequest,
  type FetchSatelliteElementsResult,
} from '../features/i1/satellites'

const FALLBACK_BUNDLES_KEY = 'stratatlas.fallback.bundles'
const FALLBACK_AUDIT_KEY = 'stratatlas.fallback.audit'
const FALLBACK_RECORDER_STATE_KEY = 'stratatlas.fallback.recorder-state'
const FALLBACK_CONTROL_PLANE_KEY = 'stratatlas.fallback.control-plane'
const FALLBACK_CONTEXT_STORE_KEY = 'stratatlas.fallback.context-store'

type StoredBundle = {
  manifest: BundleManifest
  assets: Record<string, unknown>
}

type FallbackContextStore = {
  domains: ContextDomain[]
  correlationLinks: ContextCorrelationLink[]
  records: ContextRecord[]
  updatedAt: string
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

const GOVERNED_DEPLOYMENT_PROFILES: GovernedDeploymentProfile[] = [
  {
    id: 'connected',
    label: 'Connected Analyst',
    identityMode: 'interactive_rbac',
    keyManagement: 'platform_keystore',
    storagePlacement: 'local_postgresql_postgis_plus_artifact_store',
    auditRetention: '365 days rolling',
    aiEnabled: true,
    mcpEnabled: true,
    externalAiAccessEnabled: true,
  },
  {
    id: 'restricted',
    label: 'Restricted Review',
    identityMode: 'interactive_rbac_with_review_controls',
    keyManagement: 'platform_keystore_with_review_gate',
    storagePlacement: 'local_postgresql_postgis_plus_artifact_store',
    auditRetention: '730 days rolling',
    aiEnabled: true,
    mcpEnabled: true,
    externalAiAccessEnabled: true,
  },
  {
    id: 'air_gapped',
    label: 'Air-Gapped',
    identityMode: 'local_offline_rbac',
    keyManagement: 'local_offline_keystore',
    storagePlacement: 'local_postgresql_postgis_plus_artifact_store',
    auditRetention: 'indefinite_local_retention',
    aiEnabled: false,
    mcpEnabled: false,
    externalAiAccessEnabled: false,
  },
]

const DEFAULT_GOVERNED_DEPLOYMENT_PROFILE: DeploymentProfileId =
  DEPLOYMENT_PROFILES[0]?.id ?? 'connected'

const buildBundleRegistryEntry = (manifest: BundleManifest): BundleRegistryEntry => ({
  bundleId: manifest.bundle_id,
  createdAt: manifest.created_at,
  createdByRole: manifest.created_by_role,
  marking: manifest.marking,
  uiStateHash: manifest.ui_state_hash,
  manifestArtifactHash: manifest.ui_state_hash,
  assetCount: manifest.assets.length,
  supersedesBundleId: manifest.supersedes_bundle_id,
})

const buildDefaultControlPlaneState = (): ControlPlaneState => ({
  activeDeploymentProfileId: DEFAULT_GOVERNED_DEPLOYMENT_PROFILE,
  deploymentProfiles: GOVERNED_DEPLOYMENT_PROFILES,
  bundleRegistry: [],
  contextDomainRegistry: [],
  correlationLinks: [],
  storageBackend: 'postgresql-postgis',
  contextStoreBackend: 'postgresql-indexed',
  artifactStorePath: 'localStorage://stratatlas.fallback.bundles',
  updatedAt: nowIso(),
})

const buildDefaultContextStore = (): FallbackContextStore => ({
  domains: [],
  correlationLinks: [],
  records: [],
  updatedAt: nowIso(),
})

const readControlPlaneState = (): ControlPlaneState =>
  readJson<ControlPlaneState>(FALLBACK_CONTROL_PLANE_KEY, buildDefaultControlPlaneState())

const writeControlPlaneState = (state: ControlPlaneState): void => {
  writeJson(FALLBACK_CONTROL_PLANE_KEY, state)
}

const readContextStore = (): FallbackContextStore =>
  readJson<FallbackContextStore>(FALLBACK_CONTEXT_STORE_KEY, buildDefaultContextStore())

const writeContextStore = (state: FallbackContextStore): void => {
  writeJson(FALLBACK_CONTEXT_STORE_KEY, state)
}

const isDeploymentProfileId = (value: unknown): value is DeploymentProfileId =>
  value === 'connected' || value === 'restricted' || value === 'air_gapped'

const deploymentProfileFromState = (state: RecorderState): DeploymentProfileId => {
  const candidate = state.ai?.deploymentProfile
  return isDeploymentProfileId(candidate) ? candidate : DEFAULT_GOVERNED_DEPLOYMENT_PROFILE
}

const mergeContextRecords = (records: ContextRecord[]): ContextRecord[] => {
  const byId = new Map<string, ContextRecord>()
  for (const record of records) {
    byId.set(record.record_id, record)
  }
  return [...byId.values()].sort((left, right) => left.observed_at.localeCompare(right.observed_at))
}

const syncFallbackGovernedState = ({
  state,
  bundleRegistryEntry,
}: {
  state: RecorderState
  bundleRegistryEntry?: BundleRegistryEntry
}): ControlPlaneState => {
  const previousControlPlane = readControlPlaneState()
  const previousContextStore = readContextStore()
  const bundleRegistry = bundleRegistryEntry
    ? [
        bundleRegistryEntry,
        ...previousControlPlane.bundleRegistry.filter(
          (entry) => entry.bundleId !== bundleRegistryEntry.bundleId,
        ),
      ]
    : previousControlPlane.bundleRegistry

  const nextContextStore: FallbackContextStore = {
    domains:
      state.context.domains.length > 0 ? state.context.domains : previousContextStore.domains,
    correlationLinks:
      (state.context.correlationLinks?.length ?? 0) > 0
        ? (state.context.correlationLinks ?? [])
        : previousContextStore.correlationLinks,
    records: mergeContextRecords([
      ...previousContextStore.records,
      ...(state.context.records ?? []),
    ]),
    updatedAt: nowIso(),
  }
  writeContextStore(nextContextStore)

  const nextControlPlane: ControlPlaneState = {
    ...previousControlPlane,
    activeDeploymentProfileId: deploymentProfileFromState(state),
    deploymentProfiles: GOVERNED_DEPLOYMENT_PROFILES,
    bundleRegistry,
    contextDomainRegistry: nextContextStore.domains,
    correlationLinks: nextContextStore.correlationLinks,
    updatedAt: nowIso(),
  }
  writeControlPlaneState(nextControlPlane)
  return nextControlPlane
}

const buildHydratedRecorderState = (state: RecorderState): RecorderState => {
  const controlPlane = readControlPlaneState()
  const contextStore = readContextStore()
  const activeDomainIds =
    state.context.activeDomainIds.length > 0
      ? state.context.activeDomainIds
      : controlPlane.correlationLinks.map((link) => link.domain_id)
  const queryRange = state.context.queryRange
  const targetId =
    state.context.correlationAoi ||
    controlPlane.correlationLinks[0]?.target_id ||
    state.context.correlationLinks?.[0]?.target_id

  const visibleRecords =
    queryRange && targetId && activeDomainIds.length > 0
      ? activeDomainIds.flatMap((domainId) =>
          queryGovernedContextRecords({
            records: contextStore.records,
            domainId,
            targetId,
            timeRange: queryRange,
          }),
        )
      : state.context.records ?? contextStore.records

  return {
    ...state,
    ai: {
      deploymentProfile: controlPlane.activeDeploymentProfileId,
      latestAnalysis: state.ai?.latestAnalysis,
      latestMcpInvocation: state.ai?.latestMcpInvocation,
    },
    context: {
      ...state.context,
      domains: contextStore.domains.length > 0 ? contextStore.domains : state.context.domains,
      correlationLinks:
        contextStore.correlationLinks.length > 0
          ? contextStore.correlationLinks
          : state.context.correlationLinks,
      records: visibleRecords,
    },
  }
}

const fallbackQueryContextRecords = async (
  request: QueryContextRecordsRequest,
): Promise<QueryContextRecordsResult> => {
  const contextStore = readContextStore()
  const records = request.domainIds
    .flatMap((domainId) =>
      queryGovernedContextRecords({
        records: contextStore.records,
        domainId,
        targetId: request.targetId,
        timeRange: request.timeRange,
      }),
    )
    .sort((left, right) => left.observed_at.localeCompare(right.observed_at))

  const limited =
    typeof request.limit === 'number' && request.limit >= 0
      ? records.slice(0, request.limit)
      : records

  return {
    records: limited,
    queryRange: request.timeRange,
    totalRecords: records.length,
    source: 'fallback',
  }
}

const BUNDLE_ASSET_PATHS = {
  'workspace-state': 'assets/workspace_state.json',
  'query-state': 'assets/query_state.json',
  'context-snapshot': 'assets/context_snapshot.json',
  'compare-state': 'assets/compare_state.json',
  'collaboration-state': 'assets/collaboration_state.json',
  'scenario-state': 'assets/scenario_state.json',
  'ai-state': 'assets/ai_state.json',
  'deviation-state': 'assets/deviation_state.json',
  'osint-state': 'assets/osint_state.json',
  'game-model-state': 'assets/game_model_state.json',
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
      assetId: 'deviation-state',
      value: request.state.deviation ?? null,
      marking: request.marking,
      provenanceRefs: request.provenance_refs,
      capturedAt,
    }),
    buildBundleAsset({
      assetId: 'osint-state',
      value: request.state.osint ?? null,
      marking: request.marking,
      provenanceRefs: request.provenance_refs,
      capturedAt,
    }),
    buildBundleAsset({
      assetId: 'game-model-state',
      value: request.state.gameModel ?? null,
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
  syncFallbackGovernedState({
    state: request.state,
    bundleRegistryEntry: buildBundleRegistryEntry(manifest),
  })
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
  const deviationSnapshot = selected.assets['deviation-state']
  const osintSnapshot = selected.assets['osint-state']
  const gameModelSnapshot = selected.assets['game-model-state']
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
  if (
    selected.manifest.assets.some((asset) => asset.asset_id === 'deviation-state') &&
    canonicalize((recorderState as Record<string, unknown>).deviation ?? null) !==
      canonicalize(typeof deviationSnapshot === 'undefined' ? null : deviationSnapshot)
  ) {
    throw new Error('Recorder state asset does not match deviation-state asset')
  }
  if (
    selected.manifest.assets.some((asset) => asset.asset_id === 'osint-state') &&
    canonicalize((recorderState as Record<string, unknown>).osint ?? null) !==
      canonicalize(typeof osintSnapshot === 'undefined' ? null : osintSnapshot)
  ) {
    throw new Error('Recorder state asset does not match osint-state asset')
  }
  if (
    selected.manifest.assets.some((asset) => asset.asset_id === 'game-model-state') &&
    canonicalize((recorderState as Record<string, unknown>).gameModel ?? null) !==
      canonicalize(typeof gameModelSnapshot === 'undefined' ? null : gameModelSnapshot)
  ) {
    throw new Error('Recorder state asset does not match game-model-state asset')
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
  syncFallbackGovernedState({
    state: recorderState as unknown as RecorderState,
  })

  return {
    manifest: selected.manifest,
    state: recorderState as unknown as RecorderState,
  }
}

const fallbackLoadRecorderState = async (): Promise<LoadRecorderStateResult> => {
  const state = readJson<RecorderState | undefined>(FALLBACK_RECORDER_STATE_KEY, undefined)
  return { state: state ? buildHydratedRecorderState(state) : state }
}

const fallbackSaveRecorderState = async (
  request: SaveRecorderStateRequest,
): Promise<RecorderState> => {
  const normalized = normalizeJson(request.state) as RecorderState
  writeJson(FALLBACK_RECORDER_STATE_KEY, normalized)
  syncFallbackGovernedState({ state: normalized })
  return buildHydratedRecorderState(normalized)
}

const fallbackGetAiGatewayProviderStatus = async (): Promise<AiGatewayProviderStatus> =>
  createBrowserSimulatedAiProviderStatus()

const fallbackRunStrategicModelSolve = async (
  request: StrategicSolverRequest,
): Promise<StrategicSolverResult> => {
  const nextSnapshot = runGameSolver(normalizeGameModelSnapshot(request.snapshot), {
    bundle_refs: request.bundle_refs,
    linked_scenario_ids: request.linked_scenario_ids,
    context_targets: request.context_targets,
    context_record_ids: request.context_record_ids,
    context_domain_ids: request.context_domain_ids,
    correlation_target_ids: request.correlation_target_ids,
    threshold_ref_ids: request.threshold_ref_ids,
    deviation_event_id: request.deviation_event_id,
    osint_alert_id: request.osint_alert_id,
    executed_at: request.executed_at,
    runtime: 'browser-simulated',
  })

  const auditEvent = await fallbackAppendAudit({
    role: request.role,
    event_type: 'game_model.solver_run',
    payload: {
      runtime: 'browser-simulated',
      solver_run: nextSnapshot.solver_runs.at(-1) ?? null,
      experiment_bundle: nextSnapshot.experiment_bundle ?? null,
    },
  })

  return {
    runtime: 'browser-simulated',
    snapshot: nextSnapshot,
    auditEventId: auditEvent.event_id,
  }
}

const fallbackWriteMapExportArtifact = async (
  request: WriteMapExportArtifactRequest,
): Promise<MapExportArtifact> => {
  const pngBytes = new Uint8Array(request.pngBytes)
  const digest = await crypto.subtle.digest('SHA-256', pngBytes)
  const sha256Hash = encodeHex(new Uint8Array(digest))
  return {
    artifactId: request.artifactId,
    fileName: request.fileName,
    pngPath: `browser-simulated://map-export/${request.fileName}`,
    metadataPath: `browser-simulated://map-export/${request.artifactId}.json`,
    sha256: sha256Hash,
    sizeBytes: pngBytes.byteLength,
    width: request.width,
    height: request.height,
    generatedAt: request.generatedAt,
    marking: request.marking,
    bundleId: request.bundleId,
    focusAoiId: request.focusAoiId,
    surfaceMode: request.surfaceMode,
    runtimeEngine: request.runtimeEngine,
    visibleLayerCount: request.visibleLayerCount,
  }
}

const fallbackFetchCommercialAirTraffic = async (
  request: FetchCommercialAirTrafficRequest,
): Promise<FetchCommercialAirTrafficResult> => {
  const snapshot = createPackagedAirTrafficSnapshot(request.focusAoiId)
  return {
    providerLabel: snapshot.providerLabel,
    sourceUrl: snapshot.sourceUrl,
    sourceLicense: snapshot.sourceLicense,
    focusAoiId: snapshot.focusAoiId,
    focusAoiLabel: snapshot.focusAoiLabel,
    retrievedAt: snapshot.retrievedAt,
    sourceState: 'delayed',
    statusDetail:
      'Browser/runtime fallback is using the packaged benchmark snapshot because the governed OpenSky adapter only runs in the Tauri runtime.',
    flights: snapshot.flights,
  }
}

const fallbackFetchSatelliteElements = async (
  request: FetchSatelliteElementsRequest,
): Promise<FetchSatelliteElementsResult> => {
  const snapshot = createPackagedSatelliteSnapshot(request.focusAoiId)
  return {
    providerLabel: snapshot.providerLabel,
    sourceUrl: snapshot.sourceUrl,
    sourceLicense: snapshot.sourceLicense,
    focusAoiId: snapshot.focusAoiId,
    focusAoiLabel: snapshot.focusAoiLabel,
    retrievedAt: snapshot.retrievedAt,
    sourceState: 'cached',
    statusDetail:
      'Browser/runtime fallback is using the packaged orbital benchmark because the governed CelesTrak adapter only runs in the Tauri runtime.',
    elements: [],
  }
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
    const controlPlane = readControlPlaneState()
    const manifests = readJson<StoredBundle[]>(FALLBACK_BUNDLES_KEY, []).map((b) => b.manifest)
    if (controlPlane.bundleRegistry.length === 0) {
      return manifests
    }
    const order = new Map(
      controlPlane.bundleRegistry.map((entry, index) => [entry.bundleId, index]),
    )
    return manifests.sort(
      (left, right) =>
        (order.get(left.bundle_id) ?? Number.MAX_SAFE_INTEGER) -
        (order.get(right.bundle_id) ?? Number.MAX_SAFE_INTEGER),
    )
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

  async getControlPlaneState(): Promise<ControlPlaneState> {
    if (isTauriRuntime()) {
      return invoke<ControlPlaneState>('get_control_plane_state')
    }

    const stored = readJson<RecorderState | undefined>(FALLBACK_RECORDER_STATE_KEY, undefined)
    if (stored) {
      syncFallbackGovernedState({ state: stored })
    }
    return readControlPlaneState()
  },

  async getAiGatewayProviderStatus(): Promise<AiGatewayProviderStatus> {
    if (isTauriRuntime()) {
      return invoke<AiGatewayProviderStatus>('get_ai_gateway_provider_status')
    }
    return fallbackGetAiGatewayProviderStatus()
  },

  async runAiGatewayProviderAnalysis(
    request: AiGatewayProviderAnalysisRequest,
  ): Promise<AiGatewayProviderAnalysisResult> {
    if (isTauriRuntime()) {
      return invoke<AiGatewayProviderAnalysisResult>('run_ai_gateway_provider_analysis', {
        request,
      })
    }
    throw new Error('Live AI provider analysis requires the Tauri runtime')
  },

  async queryContextRecords(
    request: QueryContextRecordsRequest,
  ): Promise<QueryContextRecordsResult> {
    if (isTauriRuntime()) {
      return invoke<QueryContextRecordsResult>('query_context_records', { request })
    }
    return fallbackQueryContextRecords(request)
  },

  async runStrategicModelSolve(
    request: StrategicSolverRequest,
  ): Promise<StrategicSolverResult> {
    if (isTauriRuntime()) {
      return invoke<StrategicSolverResult>('run_strategic_model_solve', { request })
    }
    return fallbackRunStrategicModelSolve(request)
  },

  async writeMapExportArtifact(
    request: WriteMapExportArtifactRequest,
  ): Promise<MapExportArtifact> {
    if (isTauriRuntime()) {
      return invoke<MapExportArtifact>('write_map_export_artifact', { request })
    }
    return fallbackWriteMapExportArtifact(request)
  },

  async writeRuntimeSmokeEvidence(
    request: WriteRuntimeSmokeEvidenceRequest,
  ): Promise<RuntimeSmokeEvidenceResult> {
    if (isTauriRuntime()) {
      return invoke<RuntimeSmokeEvidenceResult>('write_runtime_smoke_evidence', { request })
    }
    throw new Error('Runtime smoke evidence requires the Tauri runtime')
  },

  async fetchCommercialAirTraffic(
    request: FetchCommercialAirTrafficRequest,
  ): Promise<FetchCommercialAirTrafficResult> {
    if (isTauriRuntime()) {
      return invoke<FetchCommercialAirTrafficResult>('fetch_commercial_air_traffic', { request })
    }
    return fallbackFetchCommercialAirTraffic(request)
  },

  async fetchSatelliteElements(
    request: FetchSatelliteElementsRequest,
  ): Promise<FetchSatelliteElementsResult> {
    if (isTauriRuntime()) {
      return invoke<FetchSatelliteElementsResult>('fetch_satellite_elements', { request })
    }
    return fallbackFetchSatelliteElements(request)
  },
}
