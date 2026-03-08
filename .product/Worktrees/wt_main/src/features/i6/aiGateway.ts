export type AiGatewayRole = 'viewer' | 'analyst' | 'administrator' | 'auditor'

export type AiGatewayMarking = 'PUBLIC' | 'INTERNAL' | 'RESTRICTED'

export type DeploymentProfileId = 'connected' | 'restricted' | 'air_gapped'

export interface BundleReference {
  bundle_id: string
  asset_id: string
  sha256: string
}

export interface GatewayProvenanceRef {
  source: string
  license: string
  retrievedAt?: string
  retrieved_at?: string
  pipelineVersion?: string
  pipeline_version?: string
}

export interface GatewayBundleAsset {
  asset_id: string
  sha256: string
  media_type: string
  size_bytes: number
  bundle_relative_path: string
  marking: AiGatewayMarking
  captured_at: string
  provenance_refs: GatewayProvenanceRef[]
}

export interface GatewayBundleManifest {
  bundle_id: string
  created_at: string
  created_by_role: AiGatewayRole
  marking: AiGatewayMarking
  assets: GatewayBundleAsset[]
  ui_state_hash: string
  derived_artifact_hashes: string[]
  provenance_refs: GatewayProvenanceRef[]
  supersedes_bundle_id?: string
}

export interface GatewayLayerCatalogEntry {
  layerId: string
  title: string
  source: string
  license: string
  cadence: string
  sensitivityClass: AiGatewayMarking
  artifactLabel: string
  renderSurface: string
  confidenceText: string
  uncertaintyText?: string
  exportAllowed: boolean
  visible: boolean
  degraded: boolean
}

export interface GatewayRecorderState {
  query?: Record<string, unknown>
  context?: Record<string, unknown>
  scenario?: Record<string, unknown>
}

export interface AiEvidenceRef extends BundleReference {
  marking: AiGatewayMarking
  licenses: string[]
  sourceSummary: string
}

export interface DeploymentProfile {
  id: DeploymentProfileId
  label: string
  aiEnabled: boolean
  mcpEnabled: boolean
}

export interface AiGatewayPolicy {
  deploymentProfile: DeploymentProfileId
  analysisAllowed: boolean
  mcpAllowed: boolean
  allowedMcpTools: McpToolName[]
  reasons: string[]
}

export type AiGatewayProviderRuntime =
  | 'browser-simulated'
  | 'tauri-live'
  | 'tauri-unconfigured'

export type AiGatewayExecutionRuntime =
  | 'local-simulated'
  | AiGatewayProviderRuntime

export interface AiGatewayProviderStatus {
  runtime: AiGatewayProviderRuntime
  available: boolean
  providerLabel: string
  model: string
  detail: string
}

export interface AiGatewayProviderAnalysisRequest {
  deploymentProfile: DeploymentProfileId
  marking: AiGatewayMarking
  prompt: string
  refs: AiEvidenceRef[]
  citations: string[]
}

export interface AiGatewayProviderAnalysisResult {
  runtime: AiGatewayProviderRuntime
  providerLabel: string
  model: string
  outputText: string
  requestId?: string
  degraded: boolean
  generatedAt?: string
}

export interface AiAnalysisRequest {
  role: AiGatewayRole
  marking: AiGatewayMarking
  deploymentProfile: DeploymentProfileId
  allowed: boolean
  refs: AiEvidenceRef[]
  prompt: string
  generatedAt?: string
}

export interface AiGatewayArtifact {
  artifactId: string
  bundleId: string
  label: 'AI-Derived Interpretation'
  marking: AiGatewayMarking
  refs: AiEvidenceRef[]
  citations: string[]
  prompt: string
  content: string
  generatedAt: string
  confidenceText: string
  uncertaintyText: string
  lineage: string[]
  providerLabel?: string
  providerModel?: string
  requestId?: string
  gatewayRuntime?: AiGatewayExecutionRuntime
  degraded?: boolean
}

export interface McpInvocationRecord {
  invocationId: string
  toolName: McpToolName
  status: 'allowed' | 'denied'
  summary: string
  bundleRefs: BundleReference[]
  invokedAt: string
  resultPreview: string
}

export interface AiGatewaySnapshot {
  deploymentProfile: DeploymentProfileId
  latestAnalysis?: AiGatewayArtifact
  latestMcpInvocation?: McpInvocationRecord
}

export interface McpToolResult {
  toolName: McpToolName
  summary: string
  bundleRefs: BundleReference[]
  payload: Record<string, unknown>
  invocation: McpInvocationRecord
}

export interface McpExecutionRequest {
  role: AiGatewayRole
  marking: AiGatewayMarking
  deploymentProfile: DeploymentProfileId
  allowed: boolean
  toolName: McpToolName
  manifest: GatewayBundleManifest
  recorderState: GatewayRecorderState
  visibleLayers: GatewayLayerCatalogEntry[]
  latestAnalysis?: AiGatewayArtifact
  invokedAt?: string
}

export const MCP_MINIMUM_TOOLS = [
  'get_bundle_manifest',
  'get_bundle_slice',
  'get_context_values',
  'submit_analysis',
  'list_layers',
  'get_scenario_delta',
] as const

export type McpToolName = (typeof MCP_MINIMUM_TOOLS)[number]

export const DEPLOYMENT_PROFILES: DeploymentProfile[] = [
  {
    id: 'connected',
    label: 'Connected Analyst',
    aiEnabled: true,
    mcpEnabled: true,
  },
  {
    id: 'restricted',
    label: 'Restricted Review',
    aiEnabled: true,
    mcpEnabled: true,
  },
  {
    id: 'air_gapped',
    label: 'Air-Gapped',
    aiEnabled: false,
    mcpEnabled: false,
  },
]

const DEFAULT_DEPLOYMENT_PROFILE: DeploymentProfileId = 'connected'

const DEFAULT_BROWSER_SIMULATED_PROVIDER_STATUS: AiGatewayProviderStatus = {
  runtime: 'browser-simulated',
  available: false,
  providerLabel: 'Browser Simulated Gateway',
  model: 'local-simulated',
  detail:
    'Browser and jsdom fallback uses a local simulated gateway; live external provider access requires the Tauri runtime and approved environment configuration.',
}

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

const stableSerialize = (value: unknown): string => JSON.stringify(normalizeJson(value))

const stableFingerprint = (value: unknown): string => {
  const serialized = stableSerialize(value)
  let hash = 2166136261
  for (let index = 0; index < serialized.length; index += 1) {
    hash ^= serialized.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0).toString(16).padStart(8, '0')
}

const isDeploymentProfileId = (value: unknown): value is DeploymentProfileId =>
  value === 'connected' || value === 'restricted' || value === 'air_gapped'

const isMarking = (value: unknown): value is AiGatewayMarking =>
  value === 'PUBLIC' || value === 'INTERNAL' || value === 'RESTRICTED'

const isMcpToolName = (value: unknown): value is McpToolName =>
  typeof value === 'string' && MCP_MINIMUM_TOOLS.includes(value as McpToolName)

const isProviderRuntime = (value: unknown): value is AiGatewayProviderRuntime =>
  value === 'browser-simulated' || value === 'tauri-live' || value === 'tauri-unconfigured'

const isPathAbuseText = (value: string): boolean =>
  /([A-Za-z]:\\|\\\\|(?:^|[\s'"])\.\.[\\/]|bundle_relative_path|select\s+.+\s+from|drop\s+table)/i.test(
    value,
  )

const buildCitation = (ref: BundleReference): string =>
  `${ref.bundle_id} / ${ref.asset_id} / ${ref.sha256}`

const sanitizeLicense = (license: string): string => license.trim().toLowerCase()

const buildToolReference = (manifest: GatewayBundleManifest): BundleReference => ({
  bundle_id: manifest.bundle_id,
  asset_id: 'manifest',
  sha256: manifest.ui_state_hash,
})

const buildDeploymentProfile = (profileId: DeploymentProfileId): DeploymentProfile =>
  DEPLOYMENT_PROFILES.find((profile) => profile.id === profileId) ?? DEPLOYMENT_PROFILES[0]

const uniqueStrings = (value: string[]): string[] => [...new Set(value)]

const normalizeEvidenceRef = (value: unknown): AiEvidenceRef | undefined => {
  if (!isRecord(value)) {
    return undefined
  }
  if (
    typeof value.bundle_id !== 'string' ||
    typeof value.asset_id !== 'string' ||
    typeof value.sha256 !== 'string'
  ) {
    return undefined
  }

  return {
    bundle_id: value.bundle_id,
    asset_id: value.asset_id,
    sha256: value.sha256,
    marking: isMarking(value.marking) ? value.marking : 'INTERNAL',
    licenses: Array.isArray(value.licenses)
      ? uniqueStrings(
          value.licenses.filter((entry): entry is string => typeof entry === 'string'),
        )
      : [],
    sourceSummary: typeof value.sourceSummary === 'string' ? value.sourceSummary : 'Unknown source',
  }
}

const normalizeAiGatewayArtifact = (value: unknown): AiGatewayArtifact | undefined => {
  if (!isRecord(value)) {
    return undefined
  }
  if (
    typeof value.artifactId !== 'string' ||
    typeof value.bundleId !== 'string' ||
    typeof value.content !== 'string'
  ) {
    return undefined
  }

  const refs = Array.isArray(value.refs)
    ? value.refs
        .map((entry) => normalizeEvidenceRef(entry))
        .filter((entry): entry is AiEvidenceRef => Boolean(entry))
    : []

  return {
    artifactId: value.artifactId,
    bundleId: value.bundleId,
    label: 'AI-Derived Interpretation',
    marking: isMarking(value.marking) ? value.marking : 'INTERNAL',
    refs,
    citations: Array.isArray(value.citations)
      ? value.citations.filter((entry): entry is string => typeof entry === 'string')
      : refs.map((ref) => buildCitation(ref)),
    prompt: typeof value.prompt === 'string' ? value.prompt : '',
    content: value.content,
    generatedAt:
      typeof value.generatedAt === 'string' ? value.generatedAt : '1970-01-01T00:00:00.000Z',
    confidenceText:
      typeof value.confidenceText === 'string'
        ? value.confidenceText
        : 'Analyst acceptance required',
    uncertaintyText:
      typeof value.uncertaintyText === 'string'
        ? value.uncertaintyText
        : 'Inference only; do not treat as observed evidence.',
    lineage: Array.isArray(value.lineage)
      ? value.lineage.filter((entry): entry is string => typeof entry === 'string')
      : [],
    providerLabel: typeof value.providerLabel === 'string' ? value.providerLabel : undefined,
    providerModel: typeof value.providerModel === 'string' ? value.providerModel : undefined,
    requestId: typeof value.requestId === 'string' ? value.requestId : undefined,
    gatewayRuntime:
      typeof value.gatewayRuntime === 'string'
        ? (value.gatewayRuntime as AiGatewayExecutionRuntime)
        : undefined,
    degraded: value.degraded === true,
  }
}

const normalizeMcpInvocation = (value: unknown): McpInvocationRecord | undefined => {
  if (!isRecord(value)) {
    return undefined
  }
  if (
    typeof value.invocationId !== 'string' ||
    !isMcpToolName(value.toolName) ||
    typeof value.summary !== 'string'
  ) {
    return undefined
  }

  return {
    invocationId: value.invocationId,
    toolName: value.toolName,
    status: value.status === 'denied' ? 'denied' : 'allowed',
    summary: value.summary,
    bundleRefs: Array.isArray(value.bundleRefs)
      ? value.bundleRefs
          .map((entry) => {
            if (!isRecord(entry)) {
              return undefined
            }
            if (
              typeof entry.bundle_id !== 'string' ||
              typeof entry.asset_id !== 'string' ||
              typeof entry.sha256 !== 'string'
            ) {
              return undefined
            }
            return {
              bundle_id: entry.bundle_id,
              asset_id: entry.asset_id,
              sha256: entry.sha256,
            }
          })
          .filter((entry): entry is BundleReference => Boolean(entry))
      : [],
    invokedAt:
      typeof value.invokedAt === 'string' ? value.invokedAt : '1970-01-01T00:00:00.000Z',
    resultPreview: typeof value.resultPreview === 'string' ? value.resultPreview : '',
  }
}

export const createAiGatewaySnapshot = (
  deploymentProfile: DeploymentProfileId = DEFAULT_DEPLOYMENT_PROFILE,
): AiGatewaySnapshot => ({
  deploymentProfile,
})

export const createBrowserSimulatedAiProviderStatus = (): AiGatewayProviderStatus => ({
  ...DEFAULT_BROWSER_SIMULATED_PROVIDER_STATUS,
})

export const createUnavailableAiProviderStatus = (
  detail: string,
  providerLabel = 'OpenAI Responses API',
): AiGatewayProviderStatus => ({
  runtime: 'tauri-unconfigured',
  available: false,
  providerLabel,
  model: 'unconfigured',
  detail,
})

export const normalizeAiGatewayProviderStatus = (value: unknown): AiGatewayProviderStatus => {
  if (!isRecord(value)) {
    return createBrowserSimulatedAiProviderStatus()
  }

  return {
    runtime: isProviderRuntime(value.runtime) ? value.runtime : 'browser-simulated',
    available: value.available === true,
    providerLabel:
      typeof value.providerLabel === 'string'
        ? value.providerLabel
        : DEFAULT_BROWSER_SIMULATED_PROVIDER_STATUS.providerLabel,
    model:
      typeof value.model === 'string'
        ? value.model
        : DEFAULT_BROWSER_SIMULATED_PROVIDER_STATUS.model,
    detail:
      typeof value.detail === 'string'
        ? value.detail
        : DEFAULT_BROWSER_SIMULATED_PROVIDER_STATUS.detail,
  }
}

export const normalizeAiGatewaySnapshot = (value: unknown): AiGatewaySnapshot => {
  if (!isRecord(value)) {
    return createAiGatewaySnapshot()
  }

  return {
    deploymentProfile: isDeploymentProfileId(value.deploymentProfile)
      ? value.deploymentProfile
      : DEFAULT_DEPLOYMENT_PROFILE,
    latestAnalysis: normalizeAiGatewayArtifact(value.latestAnalysis),
    latestMcpInvocation: normalizeMcpInvocation(value.latestMcpInvocation),
  }
}

export const collectEvidenceRefs = (manifest: GatewayBundleManifest): AiEvidenceRef[] =>
  manifest.assets.map((asset) => ({
    bundle_id: manifest.bundle_id,
    asset_id: asset.asset_id,
    sha256: asset.sha256,
    marking: asset.marking,
    licenses: uniqueStrings(
      asset.provenance_refs.map((ref) => sanitizeLicense(ref.license)).filter(Boolean),
    ),
    sourceSummary: uniqueStrings(
      asset.provenance_refs.map((ref) => ref.source.trim()).filter(Boolean),
    ).join(', '),
  }))

export const evaluateAiGatewayPolicy = ({
  role,
  marking,
  offline,
  deploymentProfile,
  refs,
  toolName,
}: {
  role: AiGatewayRole
  marking: AiGatewayMarking
  offline: boolean
  deploymentProfile: DeploymentProfileId
  refs: AiEvidenceRef[]
  toolName?: McpToolName
}): AiGatewayPolicy => {
  const profile = buildDeploymentProfile(deploymentProfile)
  const reasons: string[] = []

  if (offline) {
    reasons.push('Offline or air-gapped mode disables external AI and MCP access.')
  }
  if (!profile.aiEnabled) {
    reasons.push(`Deployment profile ${profile.label} disables AI analysis.`)
  }
  if (!profile.mcpEnabled) {
    reasons.push(`Deployment profile ${profile.label} disables MCP tools.`)
  }
  if (role === 'viewer') {
    reasons.push('Viewer role is not permitted to access AI or MCP workflows.')
  }
  if (marking === 'RESTRICTED' && role !== 'administrator' && role !== 'auditor') {
    reasons.push('Restricted markings require administrator or auditor review for governed AI access.')
  }

  const disallowedLicenses = uniqueStrings(
    refs.flatMap((ref) =>
      ref.licenses.filter((license) => !['internal', 'public'].includes(sanitizeLicense(license))),
    ),
  )
  if (disallowedLicenses.length > 0) {
    reasons.push(
      `Licensing/export policy rejected evidence refs using ${disallowedLicenses.join(', ')}.`,
    )
  }

  const analysisAllowed =
    reasons.length === 0 &&
    (role === 'analyst' || role === 'administrator') &&
    (!marking || marking !== 'RESTRICTED' || role === 'administrator')

  const allowedMcpTools = MCP_MINIMUM_TOOLS.filter((candidate) => {
    if (!profile.mcpEnabled || offline || role === 'viewer') {
      return false
    }
    if (candidate === 'submit_analysis') {
      return role === 'administrator' || role === 'analyst'
    }
    if (marking === 'RESTRICTED') {
      return role === 'administrator' || role === 'auditor'
    }
    return role === 'analyst' || role === 'administrator' || role === 'auditor'
  })

  if (toolName && !allowedMcpTools.includes(toolName)) {
    reasons.push(`MCP tool ${toolName} is not allowed for the current role/profile/marking policy.`)
  }

  return {
    deploymentProfile,
    analysisAllowed,
    mcpAllowed: allowedMcpTools.length > 0,
    allowedMcpTools,
    reasons: uniqueStrings(reasons),
  }
}

const validateAiAnalysisRequest = (request: AiAnalysisRequest): void => {
  if (!request.allowed) {
    throw new Error('AI gateway policy denied request')
  }
  if (request.role !== 'analyst' && request.role !== 'administrator') {
    throw new Error('Selected role is not allowed to submit AI analysis')
  }
  if (request.refs.length === 0) {
    throw new Error('AI analysis requires hash-addressed evidence references')
  }
  if (isPathAbuseText(request.prompt)) {
    throw new Error('AI gateway rejected prompt requesting raw path or raw database access')
  }

  const invalidRef = request.refs.find(
    (ref) => !ref.bundle_id || !ref.asset_id || !ref.sha256 || isPathAbuseText(ref.asset_id),
  )
  if (invalidRef) {
    throw new Error('AI analysis requires valid bundle_id, asset_id, and sha256 references')
  }
}

const buildAiGatewayArtifact = ({
  request,
  generatedAt,
  content,
  providerLabel,
  providerModel,
  requestId,
  gatewayRuntime,
  degraded,
}: {
  request: AiAnalysisRequest
  generatedAt: string
  content: string
  providerLabel: string
  providerModel: string
  requestId?: string
  gatewayRuntime: AiGatewayExecutionRuntime
  degraded: boolean
}): AiGatewayArtifact => {
  const citations = request.refs.map((ref) => buildCitation(ref))
  const fingerprint = stableFingerprint({
    deploymentProfile: request.deploymentProfile,
    gatewayRuntime,
    marking: request.marking,
    model: providerModel,
    prompt: request.prompt,
    refs: request.refs,
    requestId,
  })

  return {
    artifactId: `ai-interpretation-${fingerprint}`,
    bundleId: request.refs[0].bundle_id,
    label: 'AI-Derived Interpretation',
    marking: request.marking,
    refs: request.refs,
    citations,
    prompt: request.prompt,
    content,
    generatedAt,
    confidenceText: `Derived interpretation via ${providerLabel}; analyst validation required`,
    uncertaintyText: degraded
      ? 'Gateway is running in a degraded or simulated mode; do not treat as observed evidence.'
      : 'Inference only; provider output requires analyst validation.',
    lineage: [
      `gateway:${request.deploymentProfile}`,
      `provider:${providerLabel}`,
      `model:${providerModel}`,
      `runtime:${gatewayRuntime}`,
      `prompt:${request.prompt.slice(0, 60)}`,
      `refs:${request.refs.length}`,
      ...(requestId ? [`request:${requestId}`] : []),
    ],
    providerLabel,
    providerModel,
    requestId,
    gatewayRuntime,
    degraded,
  }
}

export const submitAiAnalysis = (request: AiAnalysisRequest): AiGatewayArtifact => {
  validateAiAnalysisRequest(request)
  const generatedAt = request.generatedAt ?? new Date().toISOString()
  return buildAiGatewayArtifact({
    request,
    generatedAt,
    content: `Interpreted ${request.refs.length} cited bundle artifacts under ${request.deploymentProfile} policy: ${request.prompt.slice(0, 160)}`,
    providerLabel: 'Local Governed Simulation',
    providerModel: 'simulated-template',
    gatewayRuntime: 'local-simulated',
    degraded: true,
  })
}

export const runAiGatewayAnalysis = async (
  request: AiAnalysisRequest,
  {
    providerStatus = createBrowserSimulatedAiProviderStatus(),
    runProviderAnalysis,
  }: {
    providerStatus?: AiGatewayProviderStatus
    runProviderAnalysis?: (
      request: AiGatewayProviderAnalysisRequest,
    ) => Promise<AiGatewayProviderAnalysisResult>
  } = {},
): Promise<AiGatewayArtifact> => {
  validateAiAnalysisRequest(request)

  if (providerStatus.runtime === 'browser-simulated') {
    const simulated = submitAiAnalysis({
      ...request,
      generatedAt: request.generatedAt ?? new Date().toISOString(),
    })
    return {
      ...simulated,
      confidenceText: `Derived interpretation via ${providerStatus.providerLabel}; analyst validation required`,
      uncertaintyText:
        'Browser-simulated gateway output is in use because live provider access requires the governed Tauri runtime.',
      lineage: [
        ...simulated.lineage.filter(
          (entry) =>
            entry !== 'provider:Local Governed Simulation' &&
            entry !== 'model:simulated-template' &&
            entry !== 'runtime:local-simulated',
        ),
        `provider:${providerStatus.providerLabel}`,
        `model:${providerStatus.model}`,
        `runtime:${providerStatus.runtime}`,
      ],
      providerLabel: providerStatus.providerLabel,
      providerModel: providerStatus.model,
      gatewayRuntime: providerStatus.runtime,
      degraded: true,
    }
  }

  if (!providerStatus.available || !runProviderAnalysis) {
    throw new Error(providerStatus.detail || 'Live AI provider unavailable')
  }

  const providerResult = await runProviderAnalysis({
    deploymentProfile: request.deploymentProfile,
    marking: request.marking,
    prompt: request.prompt,
    refs: request.refs,
    citations: request.refs.map((ref) => buildCitation(ref)),
  })

  return buildAiGatewayArtifact({
    request,
    generatedAt: providerResult.generatedAt ?? request.generatedAt ?? new Date().toISOString(),
    content: providerResult.outputText,
    providerLabel: providerResult.providerLabel,
    providerModel: providerResult.model,
    requestId: providerResult.requestId,
    gatewayRuntime: providerResult.runtime,
    degraded: providerResult.degraded,
  })
}

const buildInvocationRecord = ({
  toolName,
  summary,
  bundleRefs,
  invokedAt,
  status,
}: {
  toolName: McpToolName
  summary: string
  bundleRefs: BundleReference[]
  invokedAt: string
  status: 'allowed' | 'denied'
}): McpInvocationRecord => ({
  invocationId: `mcp-${stableFingerprint({ toolName, bundleRefs, invokedAt, status, summary })}`,
  toolName,
  status,
  summary,
  bundleRefs,
  invokedAt,
  resultPreview: summary.slice(0, 180),
})

const sanitizeAssetForMcp = (asset: GatewayBundleAsset): Record<string, unknown> => ({
  asset_id: asset.asset_id,
  sha256: asset.sha256,
  media_type: asset.media_type,
  size_bytes: asset.size_bytes,
  marking: asset.marking,
  captured_at: asset.captured_at,
  provenance_refs: asset.provenance_refs.map((ref) => ({
    source: ref.source,
    license: ref.license,
    retrieved_at: ref.retrievedAt ?? ref.retrieved_at ?? '',
    pipeline_version: ref.pipelineVersion ?? ref.pipeline_version ?? '',
  })),
})

const buildScenarioDeltaSummary = (scenario: Record<string, unknown> | undefined): Record<string, unknown> => {
  if (!scenario) {
    return {
      scenario_count: 0,
      selected_scenario_id: null,
      modification_count: 0,
    }
  }

  const scenarios = Array.isArray(scenario.scenarios)
    ? scenario.scenarios.filter((entry): entry is Record<string, unknown> => isRecord(entry))
    : []
  const modificationCount = scenarios.reduce((total, entry) => {
    const constraints = Array.isArray(entry.constraints) ? entry.constraints.length : 0
    const hypotheticalEntities = Array.isArray(entry.hypotheticalEntities)
      ? entry.hypotheticalEntities.length
      : 0
    return total + constraints + hypotheticalEntities
  }, 0)

  return {
    scenario_count: scenarios.length,
    selected_scenario_id:
      typeof scenario.selectedScenarioId === 'string' ? scenario.selectedScenarioId : null,
    modification_count: modificationCount,
  }
}

export const executeMcpTool = (request: McpExecutionRequest): McpToolResult => {
  if (!request.allowed) {
    throw new Error('MCP policy denied request')
  }
  if (isPathAbuseText(request.toolName)) {
    throw new Error('MCP gateway rejected raw path or raw database exposure')
  }

  const invokedAt = request.invokedAt ?? new Date().toISOString()
  const manifestRef = buildToolReference(request.manifest)
  let payload: Record<string, unknown>
  let summary: string
  let bundleRefs: BundleReference[] = [manifestRef]

  switch (request.toolName) {
    case 'get_bundle_manifest':
      payload = {
        bundle_id: request.manifest.bundle_id,
        created_at: request.manifest.created_at,
        created_by_role: request.manifest.created_by_role,
        marking: request.manifest.marking,
        asset_count: request.manifest.assets.length,
        assets: request.manifest.assets.map((asset) => sanitizeAssetForMcp(asset)),
      }
      summary = `Returned governed manifest for bundle ${request.manifest.bundle_id} with ${request.manifest.assets.length} assets.`
      bundleRefs = request.manifest.assets.map((asset) => ({
        bundle_id: request.manifest.bundle_id,
        asset_id: asset.asset_id,
        sha256: asset.sha256,
      }))
      break
    case 'get_bundle_slice': {
      const query = request.recorderState.query ?? {}
      const definition = isRecord(query.definition) ? query.definition : {}
      const timeWindow = isRecord(definition.timeWindow) ? definition.timeWindow : {}
      const matchedRowIds = Array.isArray(query.matchedRowIds)
        ? query.matchedRowIds.filter((entry): entry is number => typeof entry === 'number')
        : []
      payload = {
        bundle_id: request.manifest.bundle_id,
        aoi: typeof definition.aoi === 'string' ? definition.aoi : 'all',
        start_hour:
          typeof timeWindow.startHour === 'number' ? timeWindow.startHour : null,
        end_hour:
          typeof timeWindow.endHour === 'number' ? timeWindow.endHour : null,
        matched_row_ids: matchedRowIds,
        result_count:
          typeof query.resultCount === 'number' ? query.resultCount : matchedRowIds.length,
      }
      summary = `Returned governed bundle slice for ${payload.aoi} with ${matchedRowIds.length} matched rows.`
      bundleRefs = request.manifest.assets
        .filter((asset) => asset.asset_id === 'query-state')
        .map((asset) => ({
          bundle_id: request.manifest.bundle_id,
          asset_id: asset.asset_id,
          sha256: asset.sha256,
        }))
      break
    }
    case 'get_context_values': {
      const context = request.recorderState.context ?? {}
      const domains = Array.isArray(context.domains)
        ? context.domains.filter((entry): entry is Record<string, unknown> => isRecord(entry))
        : []
      const contextDomains = domains.map((domain) => ({
        domain_id: typeof domain.domain_id === 'string' ? domain.domain_id : '',
        domain_name: typeof domain.domain_name === 'string' ? domain.domain_name : '',
        source_name: typeof domain.source_name === 'string' ? domain.source_name : '',
        license: typeof domain.license === 'string' ? domain.license : '',
        confidence_baseline:
          typeof domain.confidence_baseline === 'string' ? domain.confidence_baseline : '',
      }))
      payload = {
        bundle_id: request.manifest.bundle_id,
        correlation_aoi:
          typeof context.correlationAoi === 'string' ? context.correlationAoi : null,
        active_domain_ids: Array.isArray(context.activeDomainIds)
          ? context.activeDomainIds.filter((entry): entry is string => typeof entry === 'string')
          : [],
        context_domains: contextDomains,
      }
      summary = `Returned ${contextDomains.length} governed context domain values.`
      bundleRefs = request.manifest.assets
        .filter((asset) => asset.asset_id === 'context-snapshot')
        .map((asset) => ({
          bundle_id: request.manifest.bundle_id,
          asset_id: asset.asset_id,
          sha256: asset.sha256,
        }))
      break
    }
    case 'submit_analysis': {
      if (!request.latestAnalysis) {
        throw new Error('submit_analysis requires a prior AI interpretation artifact')
      }
      const reportId = `ai-report-${stableFingerprint({
        bundle_id: request.manifest.bundle_id,
        artifact_id: request.latestAnalysis.artifactId,
        invokedAt,
      })}`
      payload = {
        report_id: reportId,
        attached_bundle_id: request.manifest.bundle_id,
        source_artifact_id: request.latestAnalysis.artifactId,
        marking: request.latestAnalysis.marking,
        evidence_refs: request.latestAnalysis.refs.map((ref) => ({
          bundle_id: ref.bundle_id,
          asset_id: ref.asset_id,
          sha256: ref.sha256,
        })),
      }
      summary = `Submitted AI report ${reportId} attached to bundle ${request.manifest.bundle_id}.`
      bundleRefs = request.latestAnalysis.refs.map((ref) => ({
        bundle_id: ref.bundle_id,
        asset_id: ref.asset_id,
        sha256: ref.sha256,
      }))
      break
    }
    case 'list_layers':
      payload = {
        bundle_id: request.manifest.bundle_id,
        layers: request.visibleLayers.map((layer) => ({
          layer_id: layer.layerId,
          title: layer.title,
          source: layer.source,
          license: layer.license,
          cadence: layer.cadence,
          sensitivity_class: layer.sensitivityClass,
          artifact_label: layer.artifactLabel,
          render_surface: layer.renderSurface,
          confidence_text: layer.confidenceText,
          uncertainty_text: layer.uncertaintyText ?? '',
          export_allowed: layer.exportAllowed,
          visible: layer.visible,
          degraded: layer.degraded,
        })),
      }
      summary = `Listed ${request.visibleLayers.length} governed layers without exposing raw paths.`
      break
    case 'get_scenario_delta':
      payload = {
        bundle_id: request.manifest.bundle_id,
        ...buildScenarioDeltaSummary(request.recorderState.scenario),
      }
      summary = `Returned scenario delta summary for bundle ${request.manifest.bundle_id}.`
      bundleRefs = request.manifest.assets
        .filter((asset) => asset.asset_id === 'scenario-state')
        .map((asset) => ({
          bundle_id: request.manifest.bundle_id,
          asset_id: asset.asset_id,
          sha256: asset.sha256,
      }))
      break
    default: {
      const unexpectedTool: never = request.toolName
      throw new Error(`Unsupported MCP tool: ${unexpectedTool}`)
    }
  }

  if (isPathAbuseText(stableSerialize(payload))) {
    throw new Error('MCP gateway rejected raw path or raw database exposure')
  }

  const invocation = buildInvocationRecord({
    toolName: request.toolName,
    summary,
    bundleRefs,
    invokedAt,
    status: 'allowed',
  })

  return {
    toolName: request.toolName,
    summary,
    bundleRefs,
    payload,
    invocation,
  }
}
