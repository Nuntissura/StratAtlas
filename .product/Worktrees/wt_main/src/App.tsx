import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { startTransition, useRef } from 'react'
import type {
  AuditEvent,
  BundleManifest,
  SensitivityMarking,
  UserRole,
} from './contracts/i0'
import type {
  ContextSnapshot,
  QueryStateSnapshot,
  RecorderState,
  WorkspaceStateSnapshot,
} from './contracts/i0'
import type { UiMode } from './features/i1/modes'
import { REQUIRED_UI_MODES } from './features/i1/modes'
import {
  ARTIFACT_LABELS,
  artifactTone,
  buildWorkspaceLayerCatalog,
  type LayerCatalogEntry,
} from './features/i1/layers'
import {
  I1_BUDGETS,
  buildBudgetTelemetry,
  describeStateChangeFeedback,
  shouldDegradeRendering,
  type StateChangeFeedback,
} from './features/i1/performance'
import {
  buildBriefingArtifactPreview,
  buildBriefingBundle,
  buildCompareDashboard,
  buildComparisonWindow,
  buildContextOverlaySummaries,
  computeDensityDelta,
  type BriefingArtifactPreview,
  type CompareStateSnapshot,
} from './features/i2/baselineDelta'
import {
  DEFAULT_COLLABORATION_ARTIFACT_ID,
  buildCollaborationReplayFrame,
  createCollaborationSnapshot,
  normalizeCollaborationSnapshot,
  resolveReconnectConflict,
  setCollaborationReplayCursor,
  setEphemeralViewState,
  simulateReconnectMerge,
  upsertSharedArtifact,
  type CollaborationConflictResolution,
  type CollaborationStateSnapshot,
} from './features/i3/collaboration'
import {
  addHypotheticalEntity,
  compareScenarios,
  createScenarioFork,
  createScenarioState,
  exportScenarioBundle,
  normalizeScenarioState,
  setComparisonScenario,
  setConstraint,
  setScenarioExportArtifact,
  setSelectedScenario,
  type EntityConfidence,
  type HypotheticalEntityType,
  type ScenarioStateSnapshot,
} from './features/i4/scenarios'
import {
  addQueryCondition,
  buildQueryRenderLayer,
  buildSavedQueryArtifact,
  bumpQueryVersion,
  removeQueryCondition,
  runQuery,
  type QueryCondition,
  type QueryConditionScope,
  type QueryOperator,
  type QueryRenderLayer,
  type SavedQueryArtifact,
  type VersionedQuery,
} from './features/i5/queryBuilder'
import {
  DEPLOYMENT_PROFILES,
  MCP_MINIMUM_TOOLS,
  collectEvidenceRefs,
  evaluateAiGatewayPolicy,
  executeMcpTool,
  normalizeAiGatewaySnapshot,
  submitAiAnalysis,
  type AiGatewayArtifact,
  type AiGatewaySnapshot,
  type DeploymentProfileId,
  type McpInvocationRecord,
  type McpToolName,
} from './features/i6/aiGateway'
import { validateDomainRegistration, type ContextDomain } from './features/i7/contextIntake'
import { detectDeviation, type DeviationEvent } from './features/i8/deviation'
import {
  CURATED_OSINT_SOURCES,
  aggregateAlerts,
  validateCuratedSource,
  type OsintEvent,
  type VerificationLevel,
} from './features/i9/osint'
import { buildPayoffProxy, validateGameModel } from './features/i10/gameModeling'
import { backend } from './lib/backend'

const ROLES: UserRole[] = ['viewer', 'analyst', 'administrator', 'auditor']
const MARKINGS: SensitivityMarking[] = ['PUBLIC', 'INTERNAL', 'RESTRICTED']
const WORKSPACE_LAYERS = ['base-map', 'context-panel', 'audit-overlay', 'bundle-metadata'] as const
const WORKSPACE_LAYER_SET = new Set<string>(WORKSPACE_LAYERS)
const DEFAULT_QUERY: VersionedQuery = {
  queryId: 'query-main',
  title: 'Port surge watch',
  version: 1,
  aoi: 'aoi-1',
  timeWindow: {
    startHour: 8,
    endHour: 18,
  },
  contextDomainIds: [],
  provenanceSource: 'Analyst composed query',
  conditions: [
    {
      conditionId: 'condition-1',
      scope: 'geospatial',
      field: 'speed',
      operator: 'greater_than',
      value: 20,
    },
  ],
}
const DEFAULT_BASELINE_WINDOW_LABEL = '2026-Q1 baseline'
const DEFAULT_EVENT_WINDOW_LABEL = '2026-Q2 event'
const DEFAULT_BASELINE_INPUT = '10,12,16,21,30'
const DEFAULT_EVENT_INPUT = '8,18,20,26,31'
const DEFAULT_COLLABORATION_SESSION_ID = 'collab-main'
const DEFAULT_LOCAL_COLLABORATION_ACTOR = 'analyst-1'
const DEFAULT_REMOTE_COLLABORATION_ACTOR = 'analyst-2'
const DEFAULT_REMOTE_COLLABORATION_NOTE = 'Remote counterpoint'
const DEFAULT_REMOTE_COLLABORATION_VIEW = 'zoom-8'
const DEFAULT_CORRELATION_AOI = 'aoi-1'
const DEFAULT_SCENARIO_TITLE = 'Scenario 1'
const DEFAULT_SCENARIO_CONSTRAINT_ID = 'port_capacity'
const DEFAULT_SCENARIO_CONSTRAINT_LABEL = 'Port Capacity'
const DEFAULT_SCENARIO_CONSTRAINT_VALUE = 70
const DEFAULT_SCENARIO_CONSTRAINT_UNIT = 'index'
const DEFAULT_SCENARIO_CONSTRAINT_RATIONALE = 'Analyst-adjusted throughput assumption'
const DEFAULT_SCENARIO_CONSTRAINT_WEIGHT = 1.5
const DEFAULT_HYPOTHETICAL_ENTITY_NAME = 'Floating depot'
const DEFAULT_HYPOTHETICAL_ENTITY_TYPE: HypotheticalEntityType = 'asset'
const DEFAULT_HYPOTHETICAL_ENTITY_CHANGE = 'Adds temporary storage and surge routing slack.'
const DEFAULT_HYPOTHETICAL_ENTITY_SOURCE = 'Curated analyst scenario note'
const DEFAULT_HYPOTHETICAL_ENTITY_CONFIDENCE: EntityConfidence = 'B'
const DEFAULT_QUERY_SCOPE: QueryConditionScope = 'geospatial'
const DEFAULT_QUERY_FIELD = 'speed'
const DEFAULT_QUERY_OPERATOR: QueryOperator = 'greater_than'
const DEFAULT_QUERY_VALUE = '20'
const DEFAULT_DEPLOYMENT_PROFILE: DeploymentProfileId = 'connected'
const DEFAULT_MCP_TOOL: McpToolName = 'get_bundle_manifest'
const QUERY_OPERATORS: QueryOperator[] = ['equals', 'greater_than', 'less_than', 'contains']

const modeLabel = (forcedOffline: boolean): string =>
  forcedOffline ? 'Offline (forced)' : 'Online-capable'

const parseNumericSeries = (value: string): number[] =>
  value
    .split(',')
    .map((entry) => Number(entry.trim()))
    .filter((entry) => Number.isFinite(entry))

const createDomainDraft = (): ContextDomain => ({
  domain_id: `ctx-${Date.now()}`,
  domain_name: 'Port Throughput',
  domain_class: 'economic_indicator',
  source_name: 'UNCTAD',
  source_url: 'https://example.test/context',
  license: 'public',
  update_cadence: 'monthly',
  spatial_binding: 'point',
  temporal_resolution: 'monthly',
  sensitivity_class: 'PUBLIC',
  confidence_baseline: 'A',
  methodology_notes: 'Official aggregation',
  offline_behavior: 'pre_cacheable',
  presentation_type: 'map_overlay',
})

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

const serializeRecorderFingerprint = (state: Omit<RecorderState, 'savedAt'>): string =>
  JSON.stringify(normalizeJson(state))

const isUiMode = (value: unknown): value is UiMode =>
  typeof value === 'string' && REQUIRED_UI_MODES.includes(value as UiMode)

const normalizeStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === 'string') : []

const normalizeNumber = (value: unknown, fallback: number): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback

const normalizeNumberArray = (value: unknown): number[] =>
  Array.isArray(value)
    ? value.filter((entry): entry is number => typeof entry === 'number' && Number.isFinite(entry))
    : []

const serializeNumberArray = (value: number[]): string => value.join(',')

const normalizeQueryConditions = (value: unknown): QueryCondition[] => {
  if (!Array.isArray(value)) {
    return DEFAULT_QUERY.conditions
  }
  const conditions = value
    .filter((entry): entry is Record<string, unknown> => isRecord(entry))
    .map((entry, index) => {
      const operator = entry.operator
      const scope = entry.scope
      return {
        conditionId:
          typeof entry.conditionId === 'string' && entry.conditionId.trim().length > 0
            ? entry.conditionId
            : `condition-${index + 1}`,
        scope:
          scope === 'geospatial' || scope === 'temporal' || scope === 'context'
            ? (scope as QueryConditionScope)
            : DEFAULT_QUERY_SCOPE,
        field: typeof entry.field === 'string' ? entry.field : 'speed',
        operator:
          typeof operator === 'string' && QUERY_OPERATORS.includes(operator as QueryOperator)
            ? (operator as QueryOperator)
            : 'greater_than',
        value:
          typeof entry.value === 'number' || typeof entry.value === 'string' ? entry.value : 20,
      }
    })
  return conditions.length > 0 ? conditions : DEFAULT_QUERY.conditions
}

const normalizeVersionedQuery = (value: unknown): VersionedQuery => {
  if (!isRecord(value)) {
    return DEFAULT_QUERY
  }
  return {
    queryId: typeof value.queryId === 'string' ? value.queryId : DEFAULT_QUERY.queryId,
    title: typeof value.title === 'string' ? value.title : DEFAULT_QUERY.title,
    version: normalizeNumber(value.version, DEFAULT_QUERY.version),
    aoi: typeof value.aoi === 'string' ? value.aoi : DEFAULT_QUERY.aoi,
    timeWindow: isRecord(value.timeWindow)
      ? {
          startHour: normalizeNumber(value.timeWindow.startHour, DEFAULT_QUERY.timeWindow.startHour),
          endHour: normalizeNumber(value.timeWindow.endHour, DEFAULT_QUERY.timeWindow.endHour),
        }
      : DEFAULT_QUERY.timeWindow,
    contextDomainIds: normalizeStringArray(value.contextDomainIds),
    provenanceSource:
      typeof value.provenanceSource === 'string'
        ? value.provenanceSource
        : DEFAULT_QUERY.provenanceSource,
    conditions: normalizeQueryConditions(value.conditions),
  }
}

const normalizeSavedQueryVersions = (value: unknown): VersionedQuery[] => {
  if (!Array.isArray(value)) {
    return []
  }
  return value
    .filter((entry): entry is Record<string, unknown> => isRecord(entry))
    .map((entry) => normalizeVersionedQuery(entry))
}

const normalizeQueryRenderLayer = (value: unknown): QueryRenderLayer | undefined => {
  if (!isRecord(value)) {
    return undefined
  }
  if (typeof value.layerId !== 'string') {
    return undefined
  }
  return {
    layerId: value.layerId,
    label: value.label === 'Observed Evidence' ? 'Observed Evidence' : 'Observed Evidence',
    summary: typeof value.summary === 'string' ? value.summary : '',
    resultCount: normalizeNumber(value.resultCount, 0),
    matchedRowIds: normalizeNumberArray(value.matchedRowIds),
    aoi: typeof value.aoi === 'string' ? value.aoi : DEFAULT_QUERY.aoi,
    contextDomainIds: normalizeStringArray(value.contextDomainIds),
    ephemeral: true,
  }
}

const normalizeSavedQueryArtifact = (value: unknown): SavedQueryArtifact | undefined => {
  if (!isRecord(value)) {
    return undefined
  }
  if (typeof value.artifactId !== 'string' || typeof value.queryId !== 'string') {
    return undefined
  }
  return {
    artifactId: value.artifactId,
    queryId: value.queryId,
    version: normalizeNumber(value.version, 1),
    title: typeof value.title === 'string' ? value.title : DEFAULT_QUERY.title,
    summary: typeof value.summary === 'string' ? value.summary : '',
    resultLayerId:
      typeof value.resultLayerId === 'string' ? value.resultLayerId : 'query-layer-missing',
    matchedRowIds: normalizeNumberArray(value.matchedRowIds),
    savedAt: typeof value.savedAt === 'string' ? value.savedAt : '1970-01-01T00:00:00.000Z',
    provenanceSource:
      typeof value.provenanceSource === 'string'
        ? value.provenanceSource
        : DEFAULT_QUERY.provenanceSource,
    exportFingerprint:
      typeof value.exportFingerprint === 'string' ? value.exportFingerprint : 'query-missing',
  }
}

const normalizeDomains = (value: unknown): ContextDomain[] => {
  if (!Array.isArray(value)) {
    return []
  }
  return value
    .filter(
      (entry): entry is ContextDomain =>
        isRecord(entry) && validateDomainRegistration(entry as unknown as ContextDomain),
    )
    .map((entry) => entry as unknown as ContextDomain)
}

const normalizeComparisonWindow = (
  value: unknown,
  kind: 'Baseline' | 'Event',
  fallbackLabel: string,
) => {
  if (!isRecord(value)) {
    return buildComparisonWindow(kind, fallbackLabel, fallbackLabel)
  }
  const start = typeof value.start === 'string' ? value.start : fallbackLabel
  const end = typeof value.end === 'string' ? value.end : start
  const label =
    typeof value.label === 'string'
      ? value.label
      : buildComparisonWindow(kind, start, end).label

  return { start, end, label }
}

const normalizeCompareSnapshot = (value: unknown): CompareStateSnapshot | undefined => {
  if (!isRecord(value)) {
    return undefined
  }

  return {
    baselineWindow: normalizeComparisonWindow(
      value.baselineWindow,
      'Baseline',
      DEFAULT_BASELINE_WINDOW_LABEL,
    ),
    eventWindow: normalizeComparisonWindow(value.eventWindow, 'Event', DEFAULT_EVENT_WINDOW_LABEL),
    baselineSeries: normalizeNumberArray(value.baselineSeries),
    eventSeries: normalizeNumberArray(value.eventSeries),
  }
}

const buildWorkspaceStateSnapshot = ({
  analystNote,
  activeLayers,
  forcedOffline,
  mode,
  replayCursor,
}: {
  analystNote: string
  activeLayers: string[]
  forcedOffline: boolean
  mode: UiMode
  replayCursor: number
}): WorkspaceStateSnapshot => ({
  mode: modeLabel(forcedOffline),
  workflowMode: mode,
  note: analystNote,
  activeLayers,
  replayCursor,
  forcedOffline,
  uiVersion: 'i1-workspace-surface',
})

const buildQueryStateSnapshot = ({
  definition,
  queryResult,
  sourceRowCount,
  savedVersions,
  renderLayer,
  savedArtifact,
}: {
  definition: VersionedQuery
  queryResult: Record<string, unknown>[]
  sourceRowCount: number
  savedVersions: VersionedQuery[]
  renderLayer?: QueryRenderLayer
  savedArtifact?: SavedQueryArtifact
}): QueryStateSnapshot => ({
  definition,
  resultCount: queryResult.length,
  sourceRowCount,
  matchedRowIds: queryResult
    .map((row) => row.id)
    .filter((value): value is number => typeof value === 'number'),
  savedVersions,
  renderLayer,
  savedArtifact,
})

const buildContextSnapshot = ({
  domains,
  activeDomainIds,
  correlationAoi,
}: {
  domains: ContextDomain[]
  activeDomainIds: string[]
  correlationAoi: string
}): ContextSnapshot => ({
  domains,
  activeDomainIds,
  correlationAoi,
})

const buildAiSnapshot = ({
  deploymentProfile,
  latestAnalysis,
  latestMcpInvocation,
}: {
  deploymentProfile: DeploymentProfileId
  latestAnalysis?: AiGatewayArtifact
  latestMcpInvocation?: McpInvocationRecord
}): AiGatewaySnapshot => ({
  deploymentProfile,
  latestAnalysis,
  latestMcpInvocation,
})

const createDefaultCollaborationSnapshot = (): CollaborationStateSnapshot =>
  createCollaborationSnapshot(
    DEFAULT_COLLABORATION_SESSION_ID,
    DEFAULT_LOCAL_COLLABORATION_ACTOR,
  )

const createDefaultScenarioSnapshot = (): ScenarioStateSnapshot => createScenarioState()

interface QueuedRemoteCollaborationChange {
  changeId: string
  kind: 'shared' | 'ephemeral'
  actorId: string
  value: string
  queuedAt: string
}

function App() {
  const [role, setRole] = useState<UserRole>('analyst')
  const [marking, setMarking] = useState<SensitivityMarking>('INTERNAL')
  const [mode, setMode] = useState<UiMode>('offline')
  const [forcedOffline, setForcedOffline] = useState<boolean>(false)
  const [analystNote, setAnalystNote] = useState<string>('Initial analyst workspace state')
  const [activeLayers, setActiveLayers] = useState<string[]>([
    WORKSPACE_LAYERS[0],
    WORKSPACE_LAYERS[1],
  ])
  const [bundles, setBundles] = useState<BundleManifest[]>([])
  const [selectedBundleId, setSelectedBundleId] = useState<string>('')
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([])
  const [auditHead, setAuditHead] = useState<string>('')
  const [status, setStatus] = useState<string>('Ready')
  const [busy, setBusy] = useState<boolean>(false)
  const [integrityState, setIntegrityState] = useState<string>('No bundle validation yet')
  const [replayCursor, setReplayCursor] = useState<number>(0)
  const [replayFrameMs, setReplayFrameMs] = useState<number>(32)
  const [baselineWindowLabel, setBaselineWindowLabel] =
    useState<string>(DEFAULT_BASELINE_WINDOW_LABEL)
  const [eventWindowLabel, setEventWindowLabel] = useState<string>(DEFAULT_EVENT_WINDOW_LABEL)
  const [baselineInput, setBaselineInput] = useState<string>(DEFAULT_BASELINE_INPUT)
  const [eventInput, setEventInput] = useState<string>(DEFAULT_EVENT_INPUT)
  const [versionedQuery, setVersionedQuery] = useState<VersionedQuery>(DEFAULT_QUERY)
  const [queryConditionScopeInput, setQueryConditionScopeInput] =
    useState<QueryConditionScope>(DEFAULT_QUERY_SCOPE)
  const [queryFieldInput, setQueryFieldInput] = useState<string>(DEFAULT_QUERY_FIELD)
  const [queryOperatorInput, setQueryOperatorInput] = useState<QueryOperator>(DEFAULT_QUERY_OPERATOR)
  const [queryValueInput, setQueryValueInput] = useState<string>(DEFAULT_QUERY_VALUE)
  const [savedQueryVersions, setSavedQueryVersions] = useState<VersionedQuery[]>([])
  const [queryRenderLayer, setQueryRenderLayer] = useState<QueryRenderLayer | undefined>(undefined)
  const [savedQueryArtifact, setSavedQueryArtifact] = useState<SavedQueryArtifact | undefined>(
    undefined,
  )
  const [deploymentProfileId, setDeploymentProfileId] =
    useState<DeploymentProfileId>(DEFAULT_DEPLOYMENT_PROFILE)
  const [selectedMcpTool, setSelectedMcpTool] = useState<McpToolName>(DEFAULT_MCP_TOOL)
  const [latestAiArtifact, setLatestAiArtifact] = useState<AiGatewayArtifact | undefined>(
    undefined,
  )
  const [latestMcpInvocation, setLatestMcpInvocation] = useState<McpInvocationRecord | undefined>(
    undefined,
  )
  const [aiPrompt, setAiPrompt] = useState<string>('Summarize this selected bundle.')
  const [aiSummary, setAiSummary] = useState<string>('')
  const [domains, setDomains] = useState<ContextDomain[]>([])
  const [activeDomainIds, setActiveDomainIds] = useState<string[]>([])
  const [correlationAoi, setCorrelationAoi] = useState<string>(DEFAULT_CORRELATION_AOI)
  const [domainDraft, setDomainDraft] = useState<ContextDomain>(createDomainDraft)
  const [deviationBaselineInput, setDeviationBaselineInput] = useState<string>('100,98,102,99')
  const [deviationObservedInput, setDeviationObservedInput] = useState<string>('120,124,119,130')
  const [deviationThreshold, setDeviationThreshold] = useState<number>(0.2)
  const [deviationType, setDeviationType] =
    useState<DeviationEvent['deviation_type']>('trade_flow')
  const [osintSource, setOsintSource] = useState<string>(CURATED_OSINT_SOURCES[0])
  const [osintVerification, setOsintVerification] = useState<VerificationLevel>('reported')
  const [osintAoi, setOsintAoi] = useState<string>('aoi-1')
  const [osintEvents, setOsintEvents] = useState<OsintEvent[]>([])
  const [gameAssumption, setGameAssumption] = useState<string>('Supply remains constrained')
  const [collaboration, setCollaboration] = useState<CollaborationStateSnapshot>(() =>
    createDefaultCollaborationSnapshot(),
  )
  const [collaborationNoteInput, setCollaborationNoteInput] = useState<string>('')
  const [collaborationViewStateInput, setCollaborationViewStateInput] =
    useState<string>('zoom-3')
  const [remoteCollaborationActorInput, setRemoteCollaborationActorInput] = useState<string>(
    DEFAULT_REMOTE_COLLABORATION_ACTOR,
  )
  const [remoteCollaborationNoteInput, setRemoteCollaborationNoteInput] = useState<string>(
    DEFAULT_REMOTE_COLLABORATION_NOTE,
  )
  const [remoteCollaborationViewInput, setRemoteCollaborationViewInput] = useState<string>(
    DEFAULT_REMOTE_COLLABORATION_VIEW,
  )
  const [remoteSharedQueuedAt, setRemoteSharedQueuedAt] = useState<string | null>(null)
  const [remoteViewQueuedAt, setRemoteViewQueuedAt] = useState<string | null>(null)
  const [scenario, setScenario] = useState<ScenarioStateSnapshot>(() => createDefaultScenarioSnapshot())
  const [scenarioTitleInput, setScenarioTitleInput] = useState<string>(DEFAULT_SCENARIO_TITLE)
  const [scenarioConstraintIdInput, setScenarioConstraintIdInput] =
    useState<string>(DEFAULT_SCENARIO_CONSTRAINT_ID)
  const [scenarioConstraintLabelInput, setScenarioConstraintLabelInput] =
    useState<string>(DEFAULT_SCENARIO_CONSTRAINT_LABEL)
  const [scenarioConstraintValueInput, setScenarioConstraintValueInput] =
    useState<number>(DEFAULT_SCENARIO_CONSTRAINT_VALUE)
  const [scenarioConstraintUnitInput, setScenarioConstraintUnitInput] =
    useState<string>(DEFAULT_SCENARIO_CONSTRAINT_UNIT)
  const [scenarioConstraintRationaleInput, setScenarioConstraintRationaleInput] =
    useState<string>(DEFAULT_SCENARIO_CONSTRAINT_RATIONALE)
  const [scenarioConstraintWeightInput, setScenarioConstraintWeightInput] =
    useState<number>(DEFAULT_SCENARIO_CONSTRAINT_WEIGHT)
  const [scenarioEntityNameInput, setScenarioEntityNameInput] =
    useState<string>(DEFAULT_HYPOTHETICAL_ENTITY_NAME)
  const [scenarioEntityTypeInput, setScenarioEntityTypeInput] =
    useState<HypotheticalEntityType>(DEFAULT_HYPOTHETICAL_ENTITY_TYPE)
  const [scenarioEntityChangeInput, setScenarioEntityChangeInput] =
    useState<string>(DEFAULT_HYPOTHETICAL_ENTITY_CHANGE)
  const [scenarioEntitySourceInput, setScenarioEntitySourceInput] =
    useState<string>(DEFAULT_HYPOTHETICAL_ENTITY_SOURCE)
  const [scenarioEntityConfidenceInput, setScenarioEntityConfidenceInput] =
    useState<EntityConfidence>(DEFAULT_HYPOTHETICAL_ENTITY_CONFIDENCE)
  const [briefingArtifact, setBriefingArtifact] = useState<BriefingArtifactPreview | null>(null)
  const [hydrated, setHydrated] = useState<boolean>(false)
  const [stateFeedback, setStateFeedback] = useState<StateChangeFeedback>(() =>
    describeStateChangeFeedback('Shell ready', 0),
  )
  const lastSavedFingerprint = useRef<string>('')

  const offline = forcedOffline || !navigator.onLine

  const workspaceSnapshot = useMemo(
    () =>
      buildWorkspaceStateSnapshot({
        analystNote,
        activeLayers,
        forcedOffline,
        mode,
        replayCursor,
      }),
    [activeLayers, analystNote, forcedOffline, mode, replayCursor],
  )

  const queryRows = useMemo(
    () => [
      { id: 1, speed: 14, type: 'vessel', region: 'aoi-1', hour: 7, context_domains: ['ctx-1'] },
      { id: 2, speed: 37, type: 'vessel', region: 'aoi-1', hour: 10, context_domains: ['ctx-1'] },
      {
        id: 3,
        speed: 48,
        type: 'aircraft',
        region: 'aoi-2',
        hour: 11,
        context_domains: ['ctx-1', 'ctx-2'],
      },
      { id: 4, speed: 61, type: 'vessel', region: 'aoi-3', hour: 15, context_domains: ['ctx-2'] },
    ],
    [],
  )

  const queryResult = useMemo(() => runQuery(versionedQuery, queryRows), [queryRows, versionedQuery])
  const querySnapshot = useMemo(
    () =>
      buildQueryStateSnapshot({
        definition: versionedQuery,
        queryResult,
        sourceRowCount: queryRows.length,
        savedVersions: savedQueryVersions,
        renderLayer: queryRenderLayer,
        savedArtifact: savedQueryArtifact,
      }),
    [queryRenderLayer, queryResult, queryRows.length, savedQueryArtifact, savedQueryVersions, versionedQuery],
  )

  const contextSnapshot = useMemo(
    () =>
      buildContextSnapshot({
        domains,
        activeDomainIds,
        correlationAoi,
      }),
    [activeDomainIds, correlationAoi, domains],
  )

  const baselineSeries = useMemo(() => parseNumericSeries(baselineInput), [baselineInput])
  const eventSeries = useMemo(() => parseNumericSeries(eventInput), [eventInput])
  const baselineWindow = useMemo(
    () => buildComparisonWindow('Baseline', baselineWindowLabel, baselineWindowLabel),
    [baselineWindowLabel],
  )
  const eventWindow = useMemo(
    () => buildComparisonWindow('Event', eventWindowLabel, eventWindowLabel),
    [eventWindowLabel],
  )
  const densityDelta = useMemo(() => computeDensityDelta(baselineSeries, eventSeries), [
    baselineSeries,
    eventSeries,
  ])
  const compareDashboard = useMemo(
    () => buildCompareDashboard(baselineWindow, eventWindow, baselineSeries, eventSeries),
    [baselineSeries, baselineWindow, eventSeries, eventWindow],
  )
  const compareSnapshot = useMemo<CompareStateSnapshot>(
    () => ({
      baselineWindow,
      eventWindow,
      baselineSeries,
      eventSeries,
    }),
    [baselineSeries, baselineWindow, eventSeries, eventWindow],
  )
  const briefingBundle = useMemo(
    () => buildBriefingBundle(baselineWindowLabel, eventWindowLabel, densityDelta.delta),
    [baselineWindowLabel, densityDelta.delta, eventWindowLabel],
  )
  const contextOverlaySummaries = useMemo(
    () => buildContextOverlaySummaries(domains, activeDomainIds, compareDashboard.totalDelta),
    [activeDomainIds, compareDashboard.totalDelta, domains],
  )
  const collaborationArtifact = useMemo(
    () =>
      collaboration.sharedArtifacts.find(
        (artifact) => artifact.artifactId === DEFAULT_COLLABORATION_ARTIFACT_ID,
      ),
    [collaboration],
  )
  const collaborationReplayFrame = useMemo(
    () => buildCollaborationReplayFrame(collaboration),
    [collaboration],
  )
  const selectedScenario = useMemo(
    () =>
      scenario.scenarios.find((entry) => entry.scenarioId === scenario.selectedScenarioId) ??
      scenario.scenarios[0],
    [scenario],
  )
  const comparisonScenario = useMemo(
    () =>
      scenario.scenarios.find((entry) => entry.scenarioId === scenario.comparisonScenarioId) ??
      scenario.scenarios.find((entry) => entry.scenarioId !== selectedScenario?.scenarioId),
    [scenario, selectedScenario?.scenarioId],
  )
  const scenarioComparison = useMemo(
    () =>
      selectedScenario && comparisonScenario
        ? compareScenarios(comparisonScenario, selectedScenario)
        : null,
    [comparisonScenario, selectedScenario],
  )
  const scenarioBundleMismatch = useMemo(
    () =>
      Boolean(
        selectedBundleId &&
          scenario.parentBundleId &&
          scenario.parentBundleId !== selectedBundleId,
      ),
    [scenario.parentBundleId, selectedBundleId],
  )
  const queuedRemoteChanges = useMemo<QueuedRemoteCollaborationChange[]>(() => {
    const actorId = remoteCollaborationActorInput.trim() || DEFAULT_REMOTE_COLLABORATION_ACTOR
    const changes: QueuedRemoteCollaborationChange[] = []

    if (remoteSharedQueuedAt) {
      changes.push({
        changeId: `${actorId}-shared`,
        kind: 'shared',
        actorId,
        value: remoteCollaborationNoteInput,
        queuedAt: remoteSharedQueuedAt,
      })
    }

    if (remoteViewQueuedAt) {
      changes.push({
        changeId: `${actorId}-ephemeral`,
        kind: 'ephemeral',
        actorId,
        value: remoteCollaborationViewInput,
        queuedAt: remoteViewQueuedAt,
      })
    }

    return changes
  }, [
    remoteCollaborationActorInput,
    remoteCollaborationNoteInput,
    remoteCollaborationViewInput,
    remoteSharedQueuedAt,
    remoteViewQueuedAt,
  ])

  const deviationEvent = useMemo(
    () =>
      detectDeviation(
        parseNumericSeries(deviationBaselineInput).map((value, index) => ({
          ts: `b-${index}`,
          value,
        })),
        parseNumericSeries(deviationObservedInput).map((value, index) => ({
          ts: `o-${index}`,
          value,
        })),
        deviationThreshold,
        deviationType,
      ),
    [deviationBaselineInput, deviationObservedInput, deviationThreshold, deviationType],
  )

  const osintSummary = useMemo(
    () => aggregateAlerts(osintEvents, osintAoi),
    [osintAoi, osintEvents],
  )

  const gameModelValid = useMemo(
    () =>
      validateGameModel({
        game_id: 'gm-main',
        actors: [{ actor_id: 'state-a', actor_type: 'state' }],
        actions: [{ action_id: 'policy-1', category: 'policy' }],
        assumptions: [gameAssumption],
        bundle_refs: selectedBundleId ? [selectedBundleId] : [],
      }),
    [gameAssumption, selectedBundleId],
  )

  const payoffProxy = useMemo(
    () => buildPayoffProxy('throughput', 100, 15),
    [],
  )

  const degradeRendering = shouldDegradeRendering(replayFrameMs)
  const layerCatalog = useMemo(
    () =>
      buildWorkspaceLayerCatalog({
        activeLayerIds: activeLayers,
        activeDomainIds,
        domains,
        allowRestrictedExport: false,
        allowedLicenses: ['internal', 'public'],
        aiSummaryAvailable: Boolean(latestAiArtifact),
        degradeRendering,
        modelUncertaintyText: `Payoff range [${payoffProxy.uncertainty[0]}, ${payoffProxy.uncertainty[1]}]`,
      }),
    [
      activeDomainIds,
      activeLayers,
      degradeRendering,
      domains,
      latestAiArtifact,
      payoffProxy.uncertainty,
    ],
  )
  const visibleLayerCatalog = useMemo(
    () => layerCatalog.filter((entry) => entry.visible),
    [layerCatalog],
  )
  const toggleableLayerCatalog = useMemo(
    () => layerCatalog.filter((entry) => WORKSPACE_LAYER_SET.has(entry.layerId)),
    [layerCatalog],
  )
  const mainCanvasCatalog = useMemo(
    () => visibleLayerCatalog.filter((entry) => entry.renderSurface === 'main_canvas'),
    [visibleLayerCatalog],
  )
  const rightPanelCatalog = useMemo(
    () => visibleLayerCatalog.filter((entry) => entry.renderSurface === 'right_panel'),
    [visibleLayerCatalog],
  )
  const dashboardCatalog = useMemo(
    () => visibleLayerCatalog.filter((entry) => entry.renderSurface === 'dashboard_widget'),
    [visibleLayerCatalog],
  )
  const contextDomainCatalog = useMemo(
    () => layerCatalog.filter((entry) => entry.layerId.startsWith('context-')),
    [layerCatalog],
  )
  const contextPanelEntry = useMemo(
    () => layerCatalog.find((entry) => entry.layerId === 'context-panel'),
    [layerCatalog],
  )
  const modeledOutputEntry = useMemo(
    () => layerCatalog.find((entry) => entry.layerId === 'modeled-output'),
    [layerCatalog],
  )
  const aiInterpretationEntry = useMemo(
    () => layerCatalog.find((entry) => entry.layerId === 'ai-interpretation'),
    [layerCatalog],
  )
  const selectedBundle = useMemo(
    () => bundles.find((bundle) => bundle.bundle_id === selectedBundleId),
    [bundles, selectedBundleId],
  )
  const aiEvidenceRefs = useMemo(
    () => (selectedBundle ? collectEvidenceRefs(selectedBundle) : []),
    [selectedBundle],
  )
  const aiPolicy = useMemo(
    () =>
      evaluateAiGatewayPolicy({
        role,
        marking,
        offline,
        deploymentProfile: deploymentProfileId,
        refs: aiEvidenceRefs,
      }),
    [aiEvidenceRefs, deploymentProfileId, marking, offline, role],
  )
  const aiSnapshot = useMemo(
    () =>
      buildAiSnapshot({
        deploymentProfile: deploymentProfileId,
        latestAnalysis: latestAiArtifact,
        latestMcpInvocation,
      }),
    [deploymentProfileId, latestAiArtifact, latestMcpInvocation],
  )
  const budgetTelemetry = useMemo(
    () =>
      buildBudgetTelemetry([
        {
          label: 'Pan / zoom frame',
          measuredMs: replayFrameMs,
          budgetMs: I1_BUDGETS.panZoomFrameMs,
        },
        {
          label: 'State change feedback',
          measuredMs: stateFeedback.measuredMs,
          budgetMs: I1_BUDGETS.stateChangeFeedbackP95Ms,
        },
      ]),
    [replayFrameMs, stateFeedback.measuredMs],
  )
  const degradedBudgetCount = useMemo(
    () => budgetTelemetry.filter((probe) => probe.degraded).length,
    [budgetTelemetry],
  )

  const recorderStateCore = useMemo(
    () => ({
      workspace: workspaceSnapshot,
      query: querySnapshot,
      context: contextSnapshot,
      compare: compareSnapshot,
      collaboration,
      scenario,
      ai: aiSnapshot,
      selectedBundleId: selectedBundleId || undefined,
    }),
    [
      aiSnapshot,
      collaboration,
      compareSnapshot,
      contextSnapshot,
      querySnapshot,
      scenario,
      selectedBundleId,
      workspaceSnapshot,
    ],
  )

  const applyRecorderState = (state: RecorderState, openedBundleId?: string): void => {
    const workspace = isRecord(state.workspace)
      ? state.workspace
      : ({} as Record<string, unknown>)
    const query = isRecord(state.query) ? state.query : ({} as Record<string, unknown>)
    const context = isRecord(state.context) ? state.context : ({} as Record<string, unknown>)
    const compare = normalizeCompareSnapshot(state.compare)
    const collaborationState = normalizeCollaborationSnapshot(
      state.collaboration,
      DEFAULT_LOCAL_COLLABORATION_ACTOR,
    )
    const scenarioState = normalizeScenarioState(state.scenario)
    const aiState = normalizeAiGatewaySnapshot(state.ai)
    const restoredQueryDefinition = normalizeVersionedQuery(query.definition)
    const restoredDomains = normalizeDomains(context.domains)
    const restoredActiveDomainIds = normalizeStringArray(context.activeDomainIds).filter((domainId) =>
      restoredDomains.some((domain) => domain.domain_id === domainId),
    )

    startTransition(() => {
      setAnalystNote(
        typeof workspace.note === 'string' ? workspace.note : 'Initial analyst workspace state',
      )
      setMode(isUiMode(workspace.workflowMode) ? workspace.workflowMode : 'offline')
      setForcedOffline(Boolean(workspace.forcedOffline))
      setActiveLayers(normalizeStringArray(workspace.activeLayers))
      setReplayCursor(normalizeNumber(workspace.replayCursor, 0))
      setBaselineWindowLabel(compare?.baselineWindow.label ?? DEFAULT_BASELINE_WINDOW_LABEL)
      setEventWindowLabel(compare?.eventWindow.label ?? DEFAULT_EVENT_WINDOW_LABEL)
      setBaselineInput(
        compare ? serializeNumberArray(compare.baselineSeries) : DEFAULT_BASELINE_INPUT,
      )
      setEventInput(compare ? serializeNumberArray(compare.eventSeries) : DEFAULT_EVENT_INPUT)
      setCollaboration(collaborationState)
      setCollaborationNoteInput(
        collaborationState.sharedArtifacts.find(
          (artifact) => artifact.artifactId === DEFAULT_COLLABORATION_ARTIFACT_ID,
        )?.content ?? '',
      )
      setCollaborationViewStateInput(collaborationState.ephemeralViewState)
      setRemoteCollaborationActorInput(DEFAULT_REMOTE_COLLABORATION_ACTOR)
      setRemoteCollaborationNoteInput(DEFAULT_REMOTE_COLLABORATION_NOTE)
      setRemoteCollaborationViewInput(DEFAULT_REMOTE_COLLABORATION_VIEW)
      setRemoteSharedQueuedAt(null)
      setRemoteViewQueuedAt(null)
      setScenario(scenarioState)
      setScenarioTitleInput(
        scenarioState.scenarios.length > 0
          ? `Scenario ${scenarioState.scenarios.length + 1}`
          : DEFAULT_SCENARIO_TITLE,
      )
      setScenarioConstraintIdInput(DEFAULT_SCENARIO_CONSTRAINT_ID)
      setScenarioConstraintLabelInput(DEFAULT_SCENARIO_CONSTRAINT_LABEL)
      setScenarioConstraintValueInput(DEFAULT_SCENARIO_CONSTRAINT_VALUE)
      setScenarioConstraintUnitInput(DEFAULT_SCENARIO_CONSTRAINT_UNIT)
      setScenarioConstraintRationaleInput(DEFAULT_SCENARIO_CONSTRAINT_RATIONALE)
      setScenarioConstraintWeightInput(DEFAULT_SCENARIO_CONSTRAINT_WEIGHT)
      setScenarioEntityNameInput(DEFAULT_HYPOTHETICAL_ENTITY_NAME)
      setScenarioEntityTypeInput(DEFAULT_HYPOTHETICAL_ENTITY_TYPE)
      setScenarioEntityChangeInput(DEFAULT_HYPOTHETICAL_ENTITY_CHANGE)
      setScenarioEntitySourceInput(DEFAULT_HYPOTHETICAL_ENTITY_SOURCE)
      setScenarioEntityConfidenceInput(DEFAULT_HYPOTHETICAL_ENTITY_CONFIDENCE)
      setVersionedQuery(restoredQueryDefinition)
      setQueryConditionScopeInput(DEFAULT_QUERY_SCOPE)
      setQueryFieldInput(DEFAULT_QUERY_FIELD)
      setQueryOperatorInput(DEFAULT_QUERY_OPERATOR)
      setQueryValueInput(DEFAULT_QUERY_VALUE)
      setSavedQueryVersions(normalizeSavedQueryVersions(query.savedVersions))
      setQueryRenderLayer(normalizeQueryRenderLayer(query.renderLayer))
      setSavedQueryArtifact(normalizeSavedQueryArtifact(query.savedArtifact))
      setDeploymentProfileId(aiState.deploymentProfile)
      setLatestAiArtifact(aiState.latestAnalysis)
      setLatestMcpInvocation(aiState.latestMcpInvocation)
      setAiSummary(aiState.latestAnalysis?.content ?? '')
      setSelectedMcpTool(DEFAULT_MCP_TOOL)
      setDomains(restoredDomains)
      setActiveDomainIds(restoredActiveDomainIds)
      setCorrelationAoi(
        typeof context.correlationAoi === 'string'
          ? context.correlationAoi
          : DEFAULT_CORRELATION_AOI,
      )
      setBriefingArtifact(null)
      setSelectedBundleId(
        openedBundleId ??
          (typeof state.selectedBundleId === 'string' ? state.selectedBundleId : ''),
      )
    })
  }

  const beginMeasuredAction = (action: string): number => {
    setStateFeedback(describeStateChangeFeedback(action, 0, true))
    return performance.now()
  }

  const completeMeasuredAction = (action: string, startedAt: number): void => {
    setStateFeedback(describeStateChangeFeedback(action, Math.round(performance.now() - startedAt)))
  }

  const refresh = async (): Promise<void> => {
    const [bundleList, events, head] = await Promise.all([
      backend.listBundles(),
      backend.listAuditEvents(),
      backend.getAuditHead(),
    ])
    setBundles(bundleList)
    setAuditEvents(events)
    setAuditHead(head.event_hash ?? '')
  }

  useEffect(() => {
    let cancelled = false
    const load = async (): Promise<void> => {
      const startedAt = beginMeasuredAction('Recorder hydration')
      try {
        const [bundleList, events, head, persisted] = await Promise.all([
          backend.listBundles(),
          backend.listAuditEvents(),
          backend.getAuditHead(),
          backend.loadRecorderState(),
        ])
        if (cancelled) {
          return
        }
        if (persisted.state) {
          applyRecorderState(persisted.state)
          lastSavedFingerprint.current = serializeRecorderFingerprint({
            workspace: persisted.state.workspace,
            query: persisted.state.query,
            context: persisted.state.context,
            compare: persisted.state.compare,
            collaboration: persisted.state.collaboration,
            scenario: persisted.state.scenario,
            ai: persisted.state.ai,
            selectedBundleId: persisted.state.selectedBundleId,
          })
          setStatus('Recorder state restored')
        }
        setBundles(bundleList)
        setAuditEvents(events)
        setAuditHead(head.event_hash ?? '')
        completeMeasuredAction('Recorder hydration', startedAt)
      } catch (error: unknown) {
        if (!cancelled) {
          setStatus(`Failed to load state: ${String(error)}`)
          completeMeasuredAction('Recorder hydration', startedAt)
        }
      } finally {
        if (!cancelled) {
          setHydrated(true)
        }
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!hydrated) {
      return
    }

    const fingerprint = serializeRecorderFingerprint(recorderStateCore)
    if (lastSavedFingerprint.current === fingerprint) {
      return
    }

    let cancelled = false
    const persist = async (): Promise<void> => {
      try {
        const savedState = await backend.saveRecorderState({
          role,
          state: {
            ...recorderStateCore,
            savedAt: new Date().toISOString(),
          },
        })
        if (!cancelled) {
          lastSavedFingerprint.current = serializeRecorderFingerprint({
            workspace: savedState.workspace,
            query: savedState.query,
            context: savedState.context,
            compare: savedState.compare,
            collaboration: savedState.collaboration,
            scenario: savedState.scenario,
            ai: savedState.ai,
            selectedBundleId: savedState.selectedBundleId,
          })
        }
      } catch (error) {
        if (!cancelled) {
          setStatus(`Recorder save failed: ${String(error)}`)
        }
      }
    }

    void persist()
    return () => {
      cancelled = true
    }
  }, [hydrated, recorderStateCore, role])

  useEffect(() => {
    setBriefingArtifact(null)
  }, [
    activeDomainIds,
    baselineInput,
    baselineWindowLabel,
    domains,
    eventInput,
    eventWindowLabel,
    selectedBundleId,
  ])

  useEffect(() => {
    const onConnectivityChange = async () => {
      try {
        await backend.appendAudit({
          role,
          event_type: 'connectivity.change',
          payload: {
            online: navigator.onLine,
            forced_offline: forcedOffline,
          },
        })
        await refresh()
      } catch {
        // Ignore connectivity audit failures in browser fallback.
      }
    }
    window.addEventListener('online', onConnectivityChange)
    window.addEventListener('offline', onConnectivityChange)
    return () => {
      window.removeEventListener('online', onConnectivityChange)
      window.removeEventListener('offline', onConnectivityChange)
    }
  }, [forcedOffline, role])

  const onCreateBundle = async () => {
    const startedAt = beginMeasuredAction('Create bundle')
    setBusy(true)
    setStatus('Creating bundle...')
    try {
      const manifest = await backend.createBundle({
        role,
        marking,
        state: {
          ...recorderStateCore,
          savedAt: new Date().toISOString(),
        },
        provenance_refs: [
          {
            source: 'workspace.session',
            license: 'internal',
            retrievedAt: new Date().toISOString(),
            pipelineVersion: 'i0-002',
          },
        ],
      })
      setSelectedBundleId(manifest.bundle_id)
      await refresh()
      setStatus(`Bundle ${manifest.bundle_id} created`)
      setIntegrityState('Bundle created; deterministic reopen pending')
      completeMeasuredAction('Create bundle', startedAt)
    } catch (error) {
      setStatus(`Create failed: ${String(error)}`)
      completeMeasuredAction('Create bundle', startedAt)
    } finally {
      setBusy(false)
    }
  }

  const onOpenBundle = async () => {
    if (!selectedBundleId) {
      setStatus('Select a bundle to open')
      return
    }
    const startedAt = beginMeasuredAction('Open bundle')
    setBusy(true)
    setStatus('Opening bundle...')
    try {
      const result = await backend.openBundle(selectedBundleId, role)
      applyRecorderState(result.state, result.manifest.bundle_id)
      lastSavedFingerprint.current = serializeRecorderFingerprint({
        workspace: result.state.workspace,
        query: result.state.query,
        context: result.state.context,
        compare: result.state.compare,
        collaboration: result.state.collaboration,
        scenario: result.state.scenario,
        ai: result.state.ai,
        selectedBundleId: result.manifest.bundle_id,
      })
      await refresh()
      setStatus(`Bundle ${result.manifest.bundle_id} reopened`)
      setIntegrityState('Determinism check passed during reopen')
      completeMeasuredAction('Open bundle', startedAt)
    } catch (error) {
      setStatus(`Open failed: ${String(error)}`)
      setIntegrityState('Determinism check failed')
      completeMeasuredAction('Open bundle', startedAt)
    } finally {
      setBusy(false)
    }
  }

  const toggleLayer = (layer: string) => {
    const startedAt = beginMeasuredAction('Layer visibility update')
    setActiveLayers((prev) =>
      prev.includes(layer) ? prev.filter((existing) => existing !== layer) : [...prev, layer],
    )
    completeMeasuredAction('Layer visibility update', startedAt)
  }

  const onModeChange = (nextMode: UiMode) => {
    const startedAt = beginMeasuredAction('Workflow mode change')
    setMode(nextMode)
    completeMeasuredAction('Workflow mode change', startedAt)
  }

  const onReplayCursorChange = (nextCursor: number) => {
    const startedAt = beginMeasuredAction('Replay cursor update')
    setReplayCursor(nextCursor)
    completeMeasuredAction('Replay cursor update', startedAt)
  }

  const onReplayFrameChange = (nextFrameMs: number) => {
    const startedAt = beginMeasuredAction('Replay budget probe update')
    setReplayFrameMs(nextFrameMs)
    completeMeasuredAction('Replay budget probe update', startedAt)
  }

  const onToggleForcedOffline = async () => {
    const startedAt = beginMeasuredAction('Offline mode change')
    const next = !forcedOffline
    setForcedOffline(next)
    try {
      await backend.appendAudit({
        role,
        event_type: 'offline.mode_change',
        payload: { forced_offline: next, navigator_online: navigator.onLine },
        })
      await refresh()
      completeMeasuredAction('Offline mode change', startedAt)
    } catch {
      // No-op in environments without backend persistence.
      completeMeasuredAction('Offline mode change', startedAt)
    }
  }

  const updateQueryDefinition = (
    updater: (previous: VersionedQuery) => VersionedQuery,
  ): void => {
    setVersionedQuery((previous) => updater(previous))
    setQueryRenderLayer(undefined)
    setSavedQueryArtifact(undefined)
  }

  const appendQueryAudit = (eventType: string, payload: Record<string, unknown>): void => {
    void backend
      .appendAudit({
        role,
        event_type: eventType,
        payload,
      })
      .then(() => refresh())
      .catch(() => {
        // Query workflow remains usable even if audit persistence is unavailable.
      })
  }

  const parseQueryValue = (field: string, value: string): string | number => {
    if (field === 'speed' || field === 'hour') {
      const numeric = Number(value)
      return Number.isFinite(numeric) ? numeric : 0
    }
    return value
  }

  const onAddQueryCondition = () => {
    const startedAt = beginMeasuredAction('Query condition add')
    const next = addQueryCondition(versionedQuery, {
      scope: queryConditionScopeInput,
      field: queryFieldInput,
      operator: queryOperatorInput,
      value: parseQueryValue(queryFieldInput, queryValueInput),
    })
    updateQueryDefinition(() => next)
    setStatus(`Added ${queryFieldInput} ${queryOperatorInput} condition to query graph.`)
    appendQueryAudit('query.condition_added', {
      query_id: next.queryId,
      version: next.version,
      field: queryFieldInput,
      operator: queryOperatorInput,
      scope: queryConditionScopeInput,
      value: parseQueryValue(queryFieldInput, queryValueInput),
    })
    completeMeasuredAction('Query condition add', startedAt)
  }

  const onRemoveQueryCondition = (conditionId: string) => {
    const startedAt = beginMeasuredAction('Query condition remove')
    const next = removeQueryCondition(versionedQuery, conditionId)
    updateQueryDefinition(() => next)
    setStatus(`Removed condition ${conditionId} from query graph.`)
    appendQueryAudit('query.condition_removed', {
      query_id: next.queryId,
      version: next.version,
      condition_id: conditionId,
    })
    completeMeasuredAction('Query condition remove', startedAt)
  }

  const onApplyActiveContextToQuery = () => {
    const startedAt = beginMeasuredAction('Query context link update')
    updateQueryDefinition((previous) => ({
      ...previous,
      contextDomainIds: [...activeDomainIds],
    }))
    setStatus(
      activeDomainIds.length > 0
        ? `Query linked to ${activeDomainIds.length} active context domain(s).`
        : 'Query context links cleared.',
    )
    appendQueryAudit('query.context_linked', {
      query_id: versionedQuery.queryId,
      active_domain_ids: activeDomainIds,
      correlation_aoi: correlationAoi,
    })
    completeMeasuredAction('Query context link update', startedAt)
  }

  const onRunVersionedQuery = () => {
    const startedAt = beginMeasuredAction('Query run and render')
    const renderLayer = buildQueryRenderLayer(versionedQuery, queryResult)
    setQueryRenderLayer(renderLayer)
    setSavedQueryArtifact(undefined)
    setStatus(renderLayer.summary)
    appendQueryAudit('query.run', {
      query_id: versionedQuery.queryId,
      version: versionedQuery.version,
      result_count: renderLayer.resultCount,
      matched_row_ids: renderLayer.matchedRowIds,
      context_domain_ids: versionedQuery.contextDomainIds,
    })
    completeMeasuredAction('Query run and render', startedAt)
  }

  const onSaveQueryVersion = () => {
    const startedAt = beginMeasuredAction('Query version save')
    const savedAt = new Date().toISOString()
    const next = bumpQueryVersion(versionedQuery, { savedAt })
    const renderLayer = buildQueryRenderLayer(next, queryResult)
    const artifact = buildSavedQueryArtifact(next, renderLayer, { savedAt })
    setVersionedQuery(next)
    setSavedQueryVersions((previous) => [next, ...previous])
    setQueryRenderLayer(renderLayer)
    setSavedQueryArtifact(artifact)
    setStatus(`Saved query version ${next.version} with deterministic artifact ${artifact.artifactId}`)
    appendQueryAudit('query.version_saved', {
      query_id: next.queryId,
      version: next.version,
      conditions_count: next.conditions.length,
      artifact_id: artifact.artifactId,
      result_layer_id: renderLayer.layerId,
    })
    completeMeasuredAction('Query version save', startedAt)
  }

  const onPrepareBriefingArtifact = () => {
    if (!selectedBundleId) {
      setStatus('Select or create a bundle before preparing a briefing artifact.')
      return
    }

    const startedAt = beginMeasuredAction('Briefing artifact preparation')
    const artifact = buildBriefingArtifactPreview({
      bundleId: selectedBundleId,
      marking,
      dashboard: compareDashboard,
      overlaySummaries: contextOverlaySummaries,
      offline,
    })
    setBriefingArtifact(artifact)
    setStatus(`Briefing artifact prepared for bundle ${selectedBundleId}`)
    void backend
      .appendAudit({
        role,
        event_type: 'briefing.artifact_prepared',
        payload: {
          bundle_id: selectedBundleId,
          baseline_window: baselineWindowLabel,
          event_window: eventWindowLabel,
          delta_cells: compareDashboard.cells.length,
          context_overlays: contextOverlaySummaries.length,
        },
      })
      .then(() => refresh())
      .then(() => {
        completeMeasuredAction('Briefing artifact preparation', startedAt)
      })
      .catch(() => {
        setStatus('Briefing artifact prepared locally; audit append unavailable.')
        completeMeasuredAction('Briefing artifact preparation', startedAt)
      })
  }

  const syncCollaborationSnapshot = (snapshot: CollaborationStateSnapshot): void => {
    const sharedNote =
      snapshot.sharedArtifacts.find(
        (artifact) => artifact.artifactId === DEFAULT_COLLABORATION_ARTIFACT_ID,
      )?.content ?? ''
    setCollaboration(snapshot)
    setCollaborationNoteInput(sharedNote)
    setCollaborationViewStateInput(snapshot.ephemeralViewState)
  }

  const appendCollaborationAudit = (
    eventType: string,
    payload: Record<string, unknown>,
  ): void => {
    void backend
      .appendAudit({
        role,
        event_type: eventType,
        payload,
      })
      .then(() => refresh())
      .catch(() => {
        // Keep collaboration actions functional even when audit persistence is unavailable.
      })
  }

  const onApplyLocalCollaborationNote = () => {
    const startedAt = beginMeasuredAction('Collaboration shared update')
    const actorId = collaboration.actorId.trim() || DEFAULT_LOCAL_COLLABORATION_ACTOR
    const next = upsertSharedArtifact(collaboration, {
      actorId,
      artifactId: DEFAULT_COLLABORATION_ARTIFACT_ID,
      content: collaborationNoteInput,
    })
    syncCollaborationSnapshot(next)
    setStatus(`Shared note updated by ${actorId}`)
    appendCollaborationAudit('collaboration.shared_update', {
      session_id: next.sessionId,
      actor: actorId,
      artifact_id: DEFAULT_COLLABORATION_ARTIFACT_ID,
      value: collaborationNoteInput,
    })
    completeMeasuredAction('Collaboration shared update', startedAt)
  }

  const onApplyLocalCollaborationViewState = () => {
    const startedAt = beginMeasuredAction('Collaboration view update')
    const actorId = collaboration.actorId.trim() || DEFAULT_LOCAL_COLLABORATION_ACTOR
    const next = setEphemeralViewState(collaboration, {
      actorId,
      viewState: collaborationViewStateInput,
    })
    syncCollaborationSnapshot(next)
    setStatus(`Ephemeral view state updated by ${actorId}`)
    appendCollaborationAudit('collaboration.ephemeral_update', {
      session_id: next.sessionId,
      actor: actorId,
      value: collaborationViewStateInput,
    })
    completeMeasuredAction('Collaboration view update', startedAt)
  }

  const onQueueRemoteCollaborationNote = () => {
    const startedAt = beginMeasuredAction('Queue remote collaboration update')
    const actorId = remoteCollaborationActorInput.trim() || DEFAULT_REMOTE_COLLABORATION_ACTOR
    const queuedAt = new Date().toISOString()
    setRemoteCollaborationActorInput(actorId)
    setRemoteSharedQueuedAt(queuedAt)
    setStatus(`Remote shared update queued for ${actorId}`)
    appendCollaborationAudit('collaboration.remote_update_staged', {
      session_id: collaboration.sessionId,
      actor: actorId,
      kind: 'shared',
      value: remoteCollaborationNoteInput,
      queued_at: queuedAt,
    })
    completeMeasuredAction('Queue remote collaboration update', startedAt)
  }

  const onQueueRemoteCollaborationView = () => {
    const startedAt = beginMeasuredAction('Queue remote view update')
    const actorId = remoteCollaborationActorInput.trim() || DEFAULT_REMOTE_COLLABORATION_ACTOR
    const queuedAt = new Date().toISOString()
    setRemoteCollaborationActorInput(actorId)
    setRemoteViewQueuedAt(queuedAt)
    setStatus(`Remote view update queued for ${actorId}`)
    appendCollaborationAudit('collaboration.remote_update_staged', {
      session_id: collaboration.sessionId,
      actor: actorId,
      kind: 'ephemeral',
      value: remoteCollaborationViewInput,
      queued_at: queuedAt,
    })
    completeMeasuredAction('Queue remote view update', startedAt)
  }

  const onReconnectCollaboration = () => {
    const startedAt = beginMeasuredAction('Collaboration reconnect')
    if (queuedRemoteChanges.length === 0) {
      setStatus('Queue a remote shared or view update before reconnect.')
      completeMeasuredAction('Collaboration reconnect', startedAt)
      return
    }

    const actorId = collaboration.actorId.trim() || DEFAULT_LOCAL_COLLABORATION_ACTOR
    const remoteActorId = remoteCollaborationActorInput.trim() || DEFAULT_REMOTE_COLLABORATION_ACTOR
    const next = simulateReconnectMerge(collaboration, {
      artifactId: DEFAULT_COLLABORATION_ARTIFACT_ID,
      remoteActorId,
      remoteContent: remoteSharedQueuedAt ? remoteCollaborationNoteInput : undefined,
      remoteViewState: remoteViewQueuedAt ? remoteCollaborationViewInput : undefined,
    })
    syncCollaborationSnapshot(next)
    setRemoteSharedQueuedAt(null)
    setRemoteViewQueuedAt(null)
    setStatus(
      next.conflicts.length > 0
        ? `Reconnect detected ${next.conflicts.length} pending conflict(s).`
        : 'Reconnect applied queued collaboration updates without shared-state conflicts.',
    )
    appendCollaborationAudit('collaboration.reconnect', {
      session_id: next.sessionId,
      actor: actorId,
      remote_actor: remoteActorId,
      conflicts_detected: next.conflicts.length,
      staged_updates: queuedRemoteChanges.map((change) => change.kind),
    })
    completeMeasuredAction('Collaboration reconnect', startedAt)
  }

  const onResolveCollaborationConflict = (
    resolution: CollaborationConflictResolution,
    artifactId: string,
  ) => {
    const startedAt = beginMeasuredAction('Collaboration conflict resolution')
    const actorId = collaboration.actorId.trim() || DEFAULT_LOCAL_COLLABORATION_ACTOR
    const next = resolveReconnectConflict(collaboration, {
      actorId,
      artifactId,
      resolution,
    })
    syncCollaborationSnapshot(next)
    setStatus(`Conflict resolved via ${resolution.replaceAll('_', ' ')}`)
    appendCollaborationAudit('collaboration.conflict_resolved', {
      session_id: next.sessionId,
      actor: actorId,
      artifact_id: artifactId,
      resolution,
    })
    completeMeasuredAction('Collaboration conflict resolution', startedAt)
  }

  const appendScenarioAudit = (eventType: string, payload: Record<string, unknown>): void => {
    void backend
      .appendAudit({
        role,
        event_type: eventType,
        payload,
      })
      .then(() => refresh())
      .catch(() => {
        // Scenario state remains locally functional when audit persistence is unavailable.
      })
  }

  const onCreateScenarioFork = () => {
    if (!selectedBundleId) {
      setStatus('Create or select a parent bundle before forking a scenario.')
      return
    }

    const startedAt = beginMeasuredAction('Scenario fork create')
    const baseSnapshot =
      scenario.parentBundleId && scenario.parentBundleId !== selectedBundleId
        ? createScenarioState(selectedBundleId)
        : scenario.parentBundleId
          ? scenario
          : createScenarioState(selectedBundleId)
    const next = createScenarioFork(baseSnapshot, {
      title: scenarioTitleInput,
      parentBundleId: selectedBundleId,
      parentScenarioId: baseSnapshot.selectedScenarioId || undefined,
      marking,
      provenanceSummary: `Parent bundle ${selectedBundleId} | ${offline ? 'cached offline fork' : 'live fork'}`,
    })
    setScenario(next)
    setScenarioTitleInput(`Scenario ${next.scenarios.length + 1}`)
    setStatus(`Scenario ${next.selectedScenarioId} forked from bundle ${selectedBundleId}`)
    appendScenarioAudit('scenario.fork_created', {
      bundle_id: selectedBundleId,
      scenario_id: next.selectedScenarioId,
      parent_scenario_id: next.comparisonScenarioId || null,
      offline,
      marking,
    })
    completeMeasuredAction('Scenario fork create', startedAt)
  }

  const onSelectScenarioFork = (scenarioId: string) => {
    const startedAt = beginMeasuredAction('Scenario selection change')
    setScenario((previous) => setSelectedScenario(previous, scenarioId))
    completeMeasuredAction('Scenario selection change', startedAt)
  }

  const onSelectComparisonScenario = (scenarioId: string) => {
    const startedAt = beginMeasuredAction('Scenario comparison target change')
    setScenario((previous) => setComparisonScenario(previous, scenarioId))
    completeMeasuredAction('Scenario comparison target change', startedAt)
  }

  const onApplyScenarioConstraint = () => {
    if (!selectedScenario) {
      setStatus('Fork a scenario before applying constraints.')
      return
    }

    const startedAt = beginMeasuredAction('Scenario constraint update')
    const next = setConstraint(scenario, selectedScenario.scenarioId, {
      constraintId: scenarioConstraintIdInput,
      label: scenarioConstraintLabelInput,
      value: scenarioConstraintValueInput,
      unit: scenarioConstraintUnitInput,
      rationale: scenarioConstraintRationaleInput,
      propagationWeight: scenarioConstraintWeightInput,
    })
    setScenario(next)
    setStatus(`Constraint ${scenarioConstraintIdInput} updated on ${selectedScenario.title}`)
    appendScenarioAudit('scenario.constraint_updated', {
      bundle_id: next.parentBundleId,
      scenario_id: selectedScenario.scenarioId,
      constraint_id: scenarioConstraintIdInput,
      value: scenarioConstraintValueInput,
      propagation_weight: scenarioConstraintWeightInput,
    })
    completeMeasuredAction('Scenario constraint update', startedAt)
  }

  const onAddScenarioEntity = () => {
    if (!selectedScenario) {
      setStatus('Fork a scenario before adding hypothetical entities.')
      return
    }

    const startedAt = beginMeasuredAction('Scenario hypothetical entity add')
    const entityId = scenarioEntityNameInput
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    const next = addHypotheticalEntity(scenario, selectedScenario.scenarioId, {
      entityId: entityId || `entity-${selectedScenario.hypotheticalEntities.length + 1}`,
      name: scenarioEntityNameInput,
      entityType: scenarioEntityTypeInput,
      changeSummary: scenarioEntityChangeInput,
      provenanceSource: scenarioEntitySourceInput,
      confidence: scenarioEntityConfidenceInput,
    })
    setScenario(next)
    setStatus(`Hypothetical entity added to ${selectedScenario.title}`)
    appendScenarioAudit('scenario.entity_added', {
      bundle_id: next.parentBundleId,
      scenario_id: selectedScenario.scenarioId,
      entity_id: entityId || `entity-${selectedScenario.hypotheticalEntities.length + 1}`,
      entity_type: scenarioEntityTypeInput,
      confidence: scenarioEntityConfidenceInput,
    })
    completeMeasuredAction('Scenario hypothetical entity add', startedAt)
  }

  const onCompareScenarioForks = () => {
    if (!selectedScenario || !comparisonScenario) {
      setStatus('Select a scenario and comparison target before comparing.')
      return
    }

    const startedAt = beginMeasuredAction('Scenario compare')
    const comparison = compareScenarios(comparisonScenario, selectedScenario)
    setScenario((previous) => setScenarioExportArtifact(previous, undefined))
    setStatus(comparison.summary)
    appendScenarioAudit('scenario.compared', {
      bundle_id: scenario.parentBundleId,
      left_scenario_id: comparisonScenario.scenarioId,
      right_scenario_id: selectedScenario.scenarioId,
      constraint_delta_count: comparison.constraintDeltaCount,
      hypothetical_delta_count: comparison.hypotheticalDeltaCount,
      total_propagation_delta: comparison.totalPropagationDelta,
    })
    completeMeasuredAction('Scenario compare', startedAt)
  }

  const onExportScenarioBundle = () => {
    if (!selectedScenario || !comparisonScenario) {
      setStatus('Select a scenario pair before exporting a scenario bundle.')
      return
    }
    if (!scenario.parentBundleId) {
      setStatus('Scenario export requires a parent bundle reference.')
      return
    }

    const startedAt = beginMeasuredAction('Scenario export')
    const exportArtifact = exportScenarioBundle(scenario, {
      leftScenarioId: comparisonScenario.scenarioId,
      rightScenarioId: selectedScenario.scenarioId,
      offline,
    })
    if (!exportArtifact) {
      setStatus('Scenario export could not be produced from the current state.')
      completeMeasuredAction('Scenario export', startedAt)
      return
    }

    setScenario((previous) => setScenarioExportArtifact(previous, exportArtifact))
    setStatus(`Scenario export ready for ${exportArtifact.parentBundleId}`)
    appendScenarioAudit('scenario.export_prepared', {
      bundle_id: exportArtifact.parentBundleId,
      artifact_id: exportArtifact.artifactId,
      export_fingerprint: exportArtifact.exportFingerprint,
      left_scenario_id: exportArtifact.leftScenarioId,
      right_scenario_id: exportArtifact.rightScenarioId,
      offline: exportArtifact.offline,
    })
    completeMeasuredAction('Scenario export', startedAt)
  }

  const appendAiAudit = (
    eventType: string,
    payload: Record<string, unknown>,
  ): void => {
    void backend
      .appendAudit({
        role,
        event_type: eventType,
        payload,
      })
      .then(() => refresh())
      .catch(() => {
        // Keep AI gateway actions locally usable when audit persistence is unavailable.
      })
  }

  const onSubmitAiSummary = () => {
    const startedAt = beginMeasuredAction('AI interpretation update')
    if (!selectedBundle) {
      const message = 'Select a bundle before AI analysis.'
      setAiSummary(message)
      setStatus(message)
      appendAiAudit('ai.gateway.submit', {
        status: 'denied',
        reason: 'missing_bundle',
        deployment_profile: deploymentProfileId,
      })
      completeMeasuredAction('AI interpretation update', startedAt)
      return
    }

    try {
      const result = submitAiAnalysis({
        role,
        marking,
        deploymentProfile: deploymentProfileId,
        allowed: aiPolicy.analysisAllowed,
        prompt: aiPrompt,
        refs: aiEvidenceRefs,
      })
      setLatestAiArtifact(result)
      setAiSummary(result.content)
      setStatus(`AI gateway produced ${result.artifactId}`)
      appendAiAudit('ai.gateway.submit', {
        status: 'allowed',
        bundle_id: selectedBundle.bundle_id,
        deployment_profile: deploymentProfileId,
        artifact_id: result.artifactId,
        marking: result.marking,
        ref_count: result.refs.length,
        citations: result.citations,
      })
      completeMeasuredAction('AI interpretation update', startedAt)
    } catch (error) {
      const message = String(error)
      setAiSummary(message)
      setStatus(message)
      appendAiAudit('ai.gateway.submit', {
        status: 'denied',
        bundle_id: selectedBundle.bundle_id,
        deployment_profile: deploymentProfileId,
        reason: message,
        ref_count: aiEvidenceRefs.length,
      })
      completeMeasuredAction('AI interpretation update', startedAt)
    }
  }

  const onRunMcpTool = () => {
    const startedAt = beginMeasuredAction('MCP tool invocation')
    if (!selectedBundle) {
      const message = 'Select a bundle before running MCP tools.'
      setStatus(message)
      setLatestMcpInvocation({
        invocationId: `mcp-denied-${Date.now()}`,
        toolName: selectedMcpTool,
        status: 'denied',
        summary: message,
        bundleRefs: [],
        invokedAt: new Date().toISOString(),
        resultPreview: message,
      })
      void backend
        .appendAudit({
          role,
          event_type: 'mcp.tool_invoked',
          payload: {
            status: 'denied',
            tool_name: selectedMcpTool,
            reason: 'missing_bundle',
            deployment_profile: deploymentProfileId,
          },
        })
        .then(() => refresh())
        .catch(() => {
          // Keep MCP tool execution locally usable when audit persistence is unavailable.
        })
      completeMeasuredAction('MCP tool invocation', startedAt)
      return
    }

    const bundleRefs = aiEvidenceRefs.map((ref) => ({
      bundle_id: ref.bundle_id,
      asset_id: ref.asset_id,
      sha256: ref.sha256,
    }))
    const policy = evaluateAiGatewayPolicy({
      role,
      marking,
      offline,
      deploymentProfile: deploymentProfileId,
      refs: aiEvidenceRefs,
      toolName: selectedMcpTool,
    })

    try {
      const result = executeMcpTool({
        role,
        marking,
        deploymentProfile: deploymentProfileId,
        allowed: policy.mcpAllowed && policy.allowedMcpTools.includes(selectedMcpTool),
        toolName: selectedMcpTool,
        manifest: selectedBundle,
        recorderState: {
          query: querySnapshot as unknown as Record<string, unknown>,
          context: contextSnapshot as unknown as Record<string, unknown>,
          scenario: scenario as unknown as Record<string, unknown>,
        },
        visibleLayers: visibleLayerCatalog as LayerCatalogEntry[],
        latestAnalysis: latestAiArtifact,
      })
      setLatestMcpInvocation(result.invocation)
      setStatus(result.summary)
      void backend
        .appendAudit({
          role,
          event_type: 'mcp.tool_invoked',
          payload: {
            status: 'allowed',
            tool_name: selectedMcpTool,
            deployment_profile: deploymentProfileId,
            bundle_id: selectedBundle.bundle_id,
            bundle_refs: result.bundleRefs,
            summary: result.summary,
          },
        })
        .then(() => refresh())
        .catch(() => {
          // Keep MCP tool execution locally usable when audit persistence is unavailable.
        })
      completeMeasuredAction('MCP tool invocation', startedAt)
    } catch (error) {
      const message = String(error)
      setLatestMcpInvocation({
        invocationId: `mcp-denied-${Date.now()}`,
        toolName: selectedMcpTool,
        status: 'denied',
        summary: message,
        bundleRefs,
        invokedAt: new Date().toISOString(),
        resultPreview: message,
      })
      setStatus(message)
      void backend
        .appendAudit({
          role,
          event_type: 'mcp.tool_invoked',
          payload: {
            status: 'denied',
            tool_name: selectedMcpTool,
            deployment_profile: deploymentProfileId,
            bundle_id: selectedBundle.bundle_id,
            bundle_refs: bundleRefs,
            reason: message,
          },
        })
        .then(() => refresh())
        .catch(() => {
          // Keep MCP tool execution locally usable when audit persistence is unavailable.
        })
      completeMeasuredAction('MCP tool invocation', startedAt)
    }
  }

  const onRegisterDomain = () => {
    if (!validateDomainRegistration(domainDraft)) {
      setStatus('Context domain registration rejected: missing required metadata.')
      return
    }
    const startedAt = beginMeasuredAction('Context domain registration')
    const domain = domainDraft
    setDomains((previous) => [domain, ...previous])
    setActiveDomainIds((previous) =>
      previous.includes(domain.domain_id) ? previous : [domain.domain_id, ...previous],
    )
    setDomainDraft(createDomainDraft())
    void backend
      .appendAudit({
        role,
        event_type: 'context.domain_registered',
        payload: {
          domain_id: domain.domain_id,
          domain_name: domain.domain_name,
          source_url: domain.source_url,
          sensitivity_class: domain.sensitivity_class,
        },
      })
      .then(() => refresh())
      .then(() => {
        completeMeasuredAction('Context domain registration', startedAt)
      })
      .catch(() => {
        setStatus('Domain registered locally; audit append unavailable.')
        completeMeasuredAction('Context domain registration', startedAt)
      })
  }

  const onToggleDomainSelection = (domainId: string) => {
    const startedAt = beginMeasuredAction('Context selection change')
    const nextActiveDomainIds = activeDomainIds.includes(domainId)
      ? activeDomainIds.filter((existingId) => existingId !== domainId)
      : [...activeDomainIds, domainId]
    setActiveDomainIds(nextActiveDomainIds)
    void backend
      .appendAudit({
        role,
        event_type: 'context.selection_changed',
        payload: {
          active_domain_ids: nextActiveDomainIds,
          correlation_aoi: correlationAoi,
        },
      })
      .then(() => refresh())
      .then(() => {
        completeMeasuredAction('Context selection change', startedAt)
      })
      .catch(() => {
        setStatus('Context selection updated locally; audit append unavailable.')
        completeMeasuredAction('Context selection change', startedAt)
      })
  }

  const onPersistCorrelationSelection = () => {
    const startedAt = beginMeasuredAction('Correlation selection save')
    void backend
      .appendAudit({
        role,
        event_type: 'context.correlation_updated',
        payload: {
          active_domain_ids: activeDomainIds,
          correlation_aoi: correlationAoi,
        },
      })
      .then(() => refresh())
      .then(() => {
        completeMeasuredAction('Correlation selection save', startedAt)
      })
      .catch(() => {
        setStatus('Correlation selection updated locally; audit append unavailable.')
        completeMeasuredAction('Correlation selection save', startedAt)
      })
  }

  const onAddOsintEvent = () => {
    if (!validateCuratedSource(osintSource)) {
      setStatus(`OSINT source rejected: ${osintSource}`)
      return
    }
    setOsintEvents((previous) => [
      ...previous,
      {
        source: osintSource.toUpperCase(),
        verification: osintVerification,
        aoi: osintAoi,
      },
    ])
  }

  return (
    <div className="shell">
      <header className="header" data-testid="region-header">
        <div className="identity">
          <h1>StratAtlas Integrated Workbench</h1>
          <p>
            I0-I10 shell: bundle determinism, replay/compare workflows, querying, AI
            policy gating, context intake, deviation tracking, and strategic modeling
          </p>
        </div>
        <div className="status-block">
          <span className={offline ? 'pill offline' : 'pill online'}>
            {offline ? 'OFFLINE' : 'ONLINE'}
          </span>
          <span className="pill neutral">Role: {role}</span>
          <span className="pill neutral">Marking: {marking}</span>
          <span className="pill neutral">Query v{versionedQuery.version}</span>
        </div>
      </header>

      <main className="layout">
        <section className="panel workspace" data-testid="region-left-panel">
          <h2>Workspace Controls</h2>
          <label className="field">
            Role
            <select value={role} onChange={(event) => setRole(event.target.value as UserRole)}>
              {ROLES.map((currentRole) => (
                <option key={currentRole} value={currentRole}>
                  {currentRole}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Marking
            <select
              value={marking}
              onChange={(event) => setMarking(event.target.value as SensitivityMarking)}
            >
              {MARKINGS.map((currentMarking) => (
                <option key={currentMarking} value={currentMarking}>
                  {currentMarking}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Mode
            <select value={mode} onChange={(event) => onModeChange(event.target.value as UiMode)}>
              {REQUIRED_UI_MODES.map((currentMode) => (
                <option key={currentMode} value={currentMode}>
                  {currentMode}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Analyst Note
            <textarea
              value={analystNote}
              onChange={(event) => setAnalystNote(event.target.value)}
              rows={4}
            />
          </label>

          <div className="field">
            Layer Controls
            <div className="layer-toggle-grid">
              {toggleableLayerCatalog.map((entry) => (
                <label key={entry.layerId} className="toggle-card">
                  <input
                    type="checkbox"
                    aria-label={`Toggle ${entry.title}`}
                    checked={activeLayers.includes(entry.layerId)}
                    onChange={() => toggleLayer(entry.layerId)}
                  />
                  <div>
                    <div className="card-header compact">
                      <strong>{entry.title}</strong>
                      <span className={`artifact-chip ${artifactTone(entry.artifactLabel)}`}>
                        {entry.artifactLabel}
                      </span>
                    </div>
                    <small>
                      Source: {entry.source} | Cadence: {entry.cadence} | Geometry:{' '}
                      {entry.geometryType} | Export: {entry.exportAllowed ? 'allowed' : 'blocked'}
                    </small>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="controls">
            <button onClick={onCreateBundle} disabled={busy}>
              Create Bundle
            </button>
            <button onClick={onOpenBundle} disabled={busy || !selectedBundleId}>
              Reopen Bundle
            </button>
            <button onClick={onToggleForcedOffline} disabled={busy}>
              {forcedOffline ? 'Disable Forced Offline' : 'Force Offline Mode'}
            </button>
          </div>
          <p className="status-line">{status}</p>
          <p className="status-line">{integrityState}</p>
          <p className="status-line">
            Recorder snapshot: {workspaceSnapshot.uiVersion} | Context links: {activeDomainIds.length}
          </p>

          <h3>Query Builder (I5)</h3>
          <label className="field">
            Query Title
            <input
              type="text"
              value={versionedQuery.title}
              onChange={(event) =>
                updateQueryDefinition((previous) => ({
                  ...previous,
                  title: event.target.value,
                }))
              }
            />
          </label>
          <label className="field">
            Query AOI
            <input
              type="text"
              value={versionedQuery.aoi}
              onChange={(event) =>
                updateQueryDefinition((previous) => ({
                  ...previous,
                  aoi: event.target.value,
                }))
              }
            />
          </label>
          <div className="compare-form-grid">
            <label className="field">
              Start Hour
              <input
                type="number"
                min={0}
                max={23}
                value={versionedQuery.timeWindow.startHour}
                onChange={(event) =>
                  updateQueryDefinition((previous) => ({
                    ...previous,
                    timeWindow: {
                      ...previous.timeWindow,
                      startHour: Number(event.target.value),
                    },
                  }))
                }
              />
            </label>
            <label className="field">
              End Hour
              <input
                type="number"
                min={0}
                max={23}
                value={versionedQuery.timeWindow.endHour}
                onChange={(event) =>
                  updateQueryDefinition((previous) => ({
                    ...previous,
                    timeWindow: {
                      ...previous.timeWindow,
                      endHour: Number(event.target.value),
                    },
                  }))
                }
              />
            </label>
            <label className="field">
              Condition Scope
              <select
                value={queryConditionScopeInput}
                onChange={(event) =>
                  setQueryConditionScopeInput(event.target.value as QueryConditionScope)
                }
              >
                <option value="geospatial">geospatial</option>
                <option value="temporal">temporal</option>
                <option value="context">context</option>
              </select>
            </label>
            <label className="field">
              Condition Field
              <select
                value={queryFieldInput}
                onChange={(event) => setQueryFieldInput(event.target.value)}
              >
                <option value="speed">speed</option>
                <option value="type">type</option>
                <option value="hour">hour</option>
                <option value="context_domains">context_domains</option>
              </select>
            </label>
            <label className="field">
              Condition Operator
              <select
                value={queryOperatorInput}
                onChange={(event) => setQueryOperatorInput(event.target.value as QueryOperator)}
              >
                {QUERY_OPERATORS.map((operator) => (
                  <option key={operator} value={operator}>
                    {operator}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              Condition Value
              <input
                type={queryFieldInput === 'speed' || queryFieldInput === 'hour' ? 'number' : 'text'}
                value={queryValueInput}
                onChange={(event) => setQueryValueInput(event.target.value)}
              />
            </label>
          </div>
          <div className="controls">
            <button onClick={onAddQueryCondition}>Add Condition</button>
            <button onClick={onRunVersionedQuery}>Run Query</button>
            <button onClick={onApplyActiveContextToQuery}>Use Active Context Domains</button>
            <button onClick={onSaveQueryVersion}>Save Query Version</button>
          </div>
          <p className="status-line">
            Query matches: {queryResult.length} | Active saved versions: {savedQueryVersions.length}
          </p>
          <p className="status-line">
            Context-linked domains: {versionedQuery.contextDomainIds.length} | Render layer:{' '}
            {queryRenderLayer?.layerId ?? 'pending run'}
          </p>
          <div className="overlay-grid">
            {versionedQuery.conditions.map((condition) => (
              <article key={condition.conditionId} className="surface-card compact">
                <div className="card-header compact">
                  <strong>{condition.conditionId}</strong>
                  <span>{condition.scope}</span>
                </div>
                <p>
                  {condition.field} {condition.operator} {String(condition.value)}
                </p>
                <div className="controls compact">
                  <button onClick={() => onRemoveQueryCondition(condition.conditionId)}>
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
          <div className="overlay-grid">
            {savedQueryVersions.length === 0 && (
              <article className="surface-card compact">
                <strong>No saved query versions</strong>
                <p>Run and save a query to create deterministic version history.</p>
              </article>
            )}
            {savedQueryVersions.map((queryVersion) => (
              <article
                key={`${queryVersion.queryId}-v${queryVersion.version}`}
                className="surface-card compact"
              >
                <strong>{queryVersion.title}</strong>
                <p>
                  v{queryVersion.version} | AOI {queryVersion.aoi} | Context links{' '}
                  {queryVersion.contextDomainIds.length}
                </p>
                <small>{queryVersion.provenanceSource}</small>
              </article>
            ))}
          </div>

          <h3>AI Gateway (I6)</h3>
          <label className="field">
            Deployment Profile
            <select
              value={deploymentProfileId}
              onChange={(event) => setDeploymentProfileId(event.target.value as DeploymentProfileId)}
            >
              {DEPLOYMENT_PROFILES.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.label}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Prompt
            <textarea value={aiPrompt} onChange={(event) => setAiPrompt(event.target.value)} rows={3} />
          </label>
          <label className="field">
            MCP Tool
            <select
              value={selectedMcpTool}
              onChange={(event) => setSelectedMcpTool(event.target.value as McpToolName)}
            >
              {MCP_MINIMUM_TOOLS.map((toolName) => (
                <option key={toolName} value={toolName}>
                  {toolName}
                </option>
              ))}
            </select>
          </label>
          <div className="controls">
            <button onClick={onSubmitAiSummary}>Submit AI Analysis</button>
            <button onClick={onRunMcpTool}>Run MCP Tool</button>
          </div>
          <p className="status-line">
            Profile:{' '}
            {DEPLOYMENT_PROFILES.find((profile) => profile.id === deploymentProfileId)?.label ??
              deploymentProfileId}{' '}
            | AI: {aiPolicy.analysisAllowed ? 'allowed' : 'denied'} | MCP:{' '}
            {aiPolicy.mcpAllowed ? 'allowed' : 'denied'}
          </p>
          <p className="status-line">
            Policy notes:{' '}
            {aiPolicy.reasons.length > 0
              ? aiPolicy.reasons.join(' | ')
              : 'Gateway ready for governed hash-addressed evidence refs.'}
          </p>
          <article className={`artifact-callout ${artifactTone('AI-Derived Interpretation')}`}>
            <div className="card-header compact">
              <span className={`artifact-chip ${artifactTone('AI-Derived Interpretation')}`}>
                {aiInterpretationEntry?.artifactLabel ?? 'AI-Derived Interpretation'}
              </span>
              <span>{aiInterpretationEntry?.confidenceText ?? 'Analyst acceptance required'}</span>
            </div>
            <p>{aiSummary || 'No AI analysis yet.'}</p>
            <small>
              Uncertainty:{' '}
              {aiInterpretationEntry?.uncertaintyText ?? 'Do not treat as observed evidence.'}
            </small>
          </article>
          {latestAiArtifact && (
            <article
              className={`artifact-callout ${artifactTone('AI-Derived Interpretation')}`}
              data-testid="ai-analysis-card"
            >
              <div className="card-header compact">
                <span className={`artifact-chip ${artifactTone('AI-Derived Interpretation')}`}>
                  {latestAiArtifact.label}
                </span>
                <span>{latestAiArtifact.artifactId}</span>
              </div>
              <p>{latestAiArtifact.content}</p>
              <small>
                Marking {latestAiArtifact.marking} | Refs {latestAiArtifact.refs.length} | Bundle{' '}
                {latestAiArtifact.bundleId}
              </small>
              <small>Citations: {latestAiArtifact.citations.join(' | ')}</small>
            </article>
          )}
          {latestMcpInvocation && (
            <article
              className={`artifact-callout ${artifactTone('AI-Derived Interpretation')}`}
              data-testid="mcp-result-card"
            >
              <div className="card-header compact">
                <span className={`artifact-chip ${artifactTone('AI-Derived Interpretation')}`}>
                  MCP
                </span>
                <span>{latestMcpInvocation.toolName}</span>
              </div>
              <p>{latestMcpInvocation.summary}</p>
              <small>
                Status {latestMcpInvocation.status} | Bundle refs{' '}
                {latestMcpInvocation.bundleRefs.length}
              </small>
              <small>{latestMcpInvocation.resultPreview}</small>
            </article>
          )}
        </section>

        <section className="panel map-panel" data-testid="region-main-canvas">
          <h2>Main Canvas and Workflow Surface</h2>
          <div className="workspace-surface">
            <article className="surface-hero" data-testid="workspace-surface-summary">
              <p className="eyebrow">Persisted workspace surface</p>
              <div className="card-header">
                <div>
                  <h3>{mode} workflow surface</h3>
                  <p className="status-line">
                    {visibleLayerCatalog.length} visible governed artifacts across{' '}
                    {mainCanvasCatalog.length} main-canvas surfaces and {rightPanelCatalog.length}{' '}
                    right-panel surfaces.
                  </p>
                </div>
                <span
                  className={`policy-pill ${degradedBudgetCount > 0 ? 'blocked' : 'allowed'}`}
                >
                  {degradedBudgetCount > 0 ? 'Aggregation mode active' : 'Within I1 budgets'}
                </span>
              </div>
              <div className="summary-grid">
                <article>
                  <span className="metric-label">Replay cursor</span>
                  <strong>{replayCursor}</strong>
                </article>
                <article>
                  <span className="metric-label">Active layers</span>
                  <strong>{activeLayers.length}</strong>
                </article>
                <article>
                  <span className="metric-label">Context links</span>
                  <strong>{activeDomainIds.length}</strong>
                </article>
                <article>
                  <span className="metric-label">Selected bundle</span>
                  <strong>{selectedBundleId || 'none'}</strong>
                </article>
              </div>
            </article>

            <div className="legend-row" aria-label="Artifact label legend">
              {ARTIFACT_LABELS.map((label) => (
                <span key={label} className={`artifact-chip ${artifactTone(label)}`}>
                  {label}
                </span>
              ))}
            </div>

            <div className="telemetry-grid">
              {budgetTelemetry.map((probe) => (
                <article
                  key={probe.label}
                  className={`telemetry-card ${probe.degraded ? 'degraded' : ''}`}
                >
                  <span className="metric-label">{probe.label}</span>
                  <strong>
                    {probe.measuredMs} ms / {probe.budgetMs} ms budget
                  </strong>
                  <p>{probe.degraded ? 'Degraded aggregation in effect.' : 'Within budget.'}</p>
                </article>
              ))}
              <article
                className={`telemetry-card ${stateFeedback.degraded ? 'degraded' : ''}`}
                data-testid="state-feedback-card"
              >
                <span className="metric-label">State feedback</span>
                <strong>{stateFeedback.action}</strong>
                <p>{stateFeedback.message}</p>
                <small>
                  {stateFeedback.showProgress
                    ? 'Non-blocking progress visible.'
                    : 'No blocking progress required.'}
                </small>
              </article>
            </div>

            <div className="surface-grid">
              {mainCanvasCatalog.length === 0 && (
                <article className="surface-card">
                  <strong>No visible main-canvas layers</strong>
                  <p>Enable a governed layer to populate the workspace surface.</p>
                </article>
              )}
              {mainCanvasCatalog.map((entry) => (
                <article
                  key={entry.layerId}
                  className={`surface-card ${entry.degraded ? 'degraded' : ''}`}
                >
                  <div className="card-header">
                    <div>
                      <span className={`artifact-chip ${artifactTone(entry.artifactLabel)}`}>
                        {entry.artifactLabel}
                      </span>
                      <h3>{entry.title}</h3>
                    </div>
                    <span className={`policy-pill ${entry.exportAllowed ? 'allowed' : 'blocked'}`}>
                      Export: {entry.exportAllowed ? 'allowed' : 'blocked'}
                    </span>
                  </div>
                  <p>{entry.confidenceText}</p>
                  {entry.uncertaintyText && (
                    <p className="uncertainty-line">Uncertainty: {entry.uncertaintyText}</p>
                  )}
                  <dl className="meta-grid">
                    <div>
                      <dt>Source</dt>
                      <dd>{entry.source}</dd>
                    </div>
                    <div>
                      <dt>Cadence</dt>
                      <dd>{entry.cadence}</dd>
                    </div>
                    <div>
                      <dt>Geometry</dt>
                      <dd>{entry.geometryType}</dd>
                    </div>
                    <div>
                      <dt>Sensitivity</dt>
                      <dd>{entry.sensitivityClass}</dd>
                    </div>
                    <div>
                      <dt>Cache</dt>
                      <dd>{entry.cachingPolicy}</dd>
                    </div>
                    <div>
                      <dt>Render surface</dt>
                      <dd>{entry.renderSurface}</dd>
                    </div>
                  </dl>
                  {entry.degraded && (
                    <p className="status-line warning">
                      Aggregation mode active to stay within the {I1_BUDGETS.panZoomFrameMs} ms
                      frame budget.
                    </p>
                  )}
                </article>
              ))}
            </div>

            {dashboardCatalog.length > 0 && (
              <div className="sub-panel">
                <h3>Dashboard Widgets</h3>
                <div className="mini-grid">
                  {dashboardCatalog.map((entry) => (
                    <article key={entry.layerId} className="surface-card compact">
                      <span className={`artifact-chip ${artifactTone(entry.artifactLabel)}`}>
                        {entry.artifactLabel}
                      </span>
                      <strong>{entry.title}</strong>
                      <small>
                        Source: {entry.source} | Cadence: {entry.cadence}
                      </small>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>

          {modeledOutputEntry && (
            <article className={`artifact-callout ${artifactTone(modeledOutputEntry.artifactLabel)}`}>
              <div className="card-header compact">
                <span className={`artifact-chip ${artifactTone(modeledOutputEntry.artifactLabel)}`}>
                  {modeledOutputEntry.artifactLabel}
                </span>
                <span>{modeledOutputEntry.title}</span>
              </div>
              <p>
                Payoff proxy: {payoffProxy.metric} {payoffProxy.value}
              </p>
              <p>Compare delta cells: [{densityDelta.delta.join(', ')}]</p>
              <small>Uncertainty: {modeledOutputEntry.uncertaintyText}</small>
            </article>
          )}

          {queryRenderLayer && (
            <article
              className={`artifact-callout ${artifactTone(queryRenderLayer.label)}`}
              data-testid="query-render-card"
            >
              <div className="card-header compact">
                <span className={`artifact-chip ${artifactTone(queryRenderLayer.label)}`}>
                  {queryRenderLayer.label}
                </span>
                <span>{queryRenderLayer.layerId}</span>
              </div>
              <p>{queryRenderLayer.summary}</p>
              <small>
                Matched rows: [{queryRenderLayer.matchedRowIds.join(', ')}] | AOI:{' '}
                {queryRenderLayer.aoi} | Context domains:{' '}
                {queryRenderLayer.contextDomainIds.length}
              </small>
            </article>
          )}

          {savedQueryArtifact && (
            <article
              className={`artifact-callout ${artifactTone('Observed Evidence')}`}
              data-testid="saved-query-artifact-card"
            >
              <div className="card-header compact">
                <span className={`artifact-chip ${artifactTone('Observed Evidence')}`}>
                  Observed Evidence
                </span>
                <span>{savedQueryArtifact.artifactId}</span>
              </div>
              <p>{savedQueryArtifact.summary}</p>
              <small>
                Version {savedQueryArtifact.version} | Fingerprint{' '}
                {savedQueryArtifact.exportFingerprint} | Saved {savedQueryArtifact.savedAt}
              </small>
            </article>
          )}

          {mode === 'replay' && (
            <div className="sub-panel">
              <h3>Replay Controls (I1)</h3>
              <label className="field">
                Replay Cursor
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={replayCursor}
                  onChange={(event) => onReplayCursorChange(Number(event.target.value))}
                />
              </label>
              <label className="field">
                Measured Frame (ms)
                <input
                  type="number"
                  value={replayFrameMs}
                  onChange={(event) => onReplayFrameChange(Number(event.target.value))}
                />
              </label>
            </div>
          )}

          {mode === 'collaboration' && (
            <div className="sub-panel" data-testid="collaboration-panel">
              <h3>Collaboration / Reconnect / Replay (I3)</h3>
              <div className="compare-stack">
                <div className="compare-form-grid">
                  <label className="field">
                    Local Actor
                    <input
                      type="text"
                      value={collaboration.actorId}
                      onChange={(event) =>
                        setCollaboration((previous) => ({
                          ...previous,
                          actorId: event.target.value,
                        }))
                      }
                    />
                  </label>
                  <label className="field">
                    Remote Actor
                    <input
                      type="text"
                      value={remoteCollaborationActorInput}
                      onChange={(event) => setRemoteCollaborationActorInput(event.target.value)}
                    />
                  </label>
                  <label className="field">
                    Shared Note
                    <textarea
                      rows={3}
                      value={collaborationNoteInput}
                      onChange={(event) => setCollaborationNoteInput(event.target.value)}
                    />
                  </label>
                  <label className="field">
                    Local View State
                    <input
                      type="text"
                      value={collaborationViewStateInput}
                      onChange={(event) => setCollaborationViewStateInput(event.target.value)}
                    />
                  </label>
                  <label className="field">
                    Queued Remote Note
                    <textarea
                      rows={3}
                      value={remoteCollaborationNoteInput}
                      onChange={(event) => setRemoteCollaborationNoteInput(event.target.value)}
                    />
                  </label>
                  <label className="field">
                    Queued Remote View State
                    <input
                      type="text"
                      value={remoteCollaborationViewInput}
                      onChange={(event) => setRemoteCollaborationViewInput(event.target.value)}
                    />
                  </label>
                </div>

                <div className="delta-summary-grid">
                  <article className="telemetry-card">
                    <span className="metric-label">Shared note</span>
                    <strong>{collaborationArtifact?.content || 'none'}</strong>
                    <p>Last authored by {collaborationArtifact?.modifiedBy ?? 'n/a'}.</p>
                  </article>
                  <article className="telemetry-card">
                    <span className="metric-label">Ephemeral view state</span>
                    <strong>{collaboration.ephemeralViewState || 'none'}</strong>
                    <p>Reconnect status: {collaboration.reconnectStatus}.</p>
                  </article>
                  <article className="telemetry-card">
                    <span className="metric-label">Queued remote updates</span>
                    <strong>{queuedRemoteChanges.length}</strong>
                    <p>Remote edits stage explicitly before reconnect.</p>
                  </article>
                  <article className="telemetry-card">
                    <span className="metric-label">Replay cursor</span>
                    <strong>
                      {collaborationReplayFrame.totalEvents === 0
                        ? '0 / 0'
                        : `${collaborationReplayFrame.cursor + 1} / ${collaborationReplayFrame.totalEvents}`}
                    </strong>
                    <p>{collaboration.conflicts.length} open conflicts requiring analyst action.</p>
                  </article>
                </div>

                <div className="controls">
                  <button onClick={onApplyLocalCollaborationNote}>Apply Local Shared Update</button>
                  <button onClick={onApplyLocalCollaborationViewState}>
                    Apply Local View State
                  </button>
                  <button onClick={onQueueRemoteCollaborationNote}>Queue Remote Shared Update</button>
                  <button onClick={onQueueRemoteCollaborationView}>Queue Remote View State</button>
                  <button onClick={onReconnectCollaboration}>Reconnect Session</button>
                </div>

                <div className="overlay-grid">
                  {queuedRemoteChanges.length === 0 && (
                    <article className="surface-card compact">
                      <strong>No queued remote updates</strong>
                      <p>Queue remote edits to exercise reconnect and conflict handling.</p>
                    </article>
                  )}
                  {queuedRemoteChanges.map((change) => (
                    <article key={change.changeId} className="surface-card compact">
                      <div className="card-header compact">
                        <span className={`artifact-chip ${artifactTone('Curated Context')}`}>
                          Pending Remote
                        </span>
                        <span>{change.kind}</span>
                      </div>
                      <strong>{change.actorId}</strong>
                      <p>
                        {change.kind}: {change.value || 'empty'}
                      </p>
                      <small>Queued at {change.queuedAt}</small>
                    </article>
                  ))}
                </div>

                <div className="overlay-grid">
                  {collaboration.conflicts.length === 0 && (
                    <article className="surface-card compact">
                      <strong>No open conflicts</strong>
                      <p>
                        Reconnect highlights authored artifact divergence; ephemeral view state
                        remains last-write-wins.
                      </p>
                    </article>
                  )}
                  {collaboration.conflicts.map((conflict) => (
                    <article key={conflict.artifactId} className="surface-card compact">
                      <div className="card-header compact">
                        <span className={`artifact-chip ${artifactTone('Modeled Output')}`}>
                          Conflict
                        </span>
                        <span>{conflict.artifactId}</span>
                      </div>
                      <strong>{conflict.remoteActorId}</strong>
                      <p>
                        Local: {conflict.localContent || 'empty'} | Remote:{' '}
                        {conflict.remoteContent || 'empty'}
                      </p>
                      <div className="controls compact">
                        <button
                          onClick={() =>
                            onResolveCollaborationConflict('keep_local', conflict.artifactId)
                          }
                        >
                          Keep Local
                        </button>
                        <button
                          onClick={() =>
                            onResolveCollaborationConflict('keep_remote', conflict.artifactId)
                          }
                        >
                          Keep Remote
                        </button>
                        <button
                          onClick={() =>
                            onResolveCollaborationConflict('keep_merged', conflict.artifactId)
                          }
                        >
                          Merge Resolution
                        </button>
                      </div>
                    </article>
                  ))}
                </div>

                <article className="artifact-callout context">
                  <div className="card-header compact">
                    <span className={`artifact-chip ${artifactTone('Observed Evidence')}`}>
                      Observed Evidence
                    </span>
                    <span>Bundle-safe collaboration snapshot</span>
                  </div>
                  <p>
                    Session {collaboration.sessionId} | Bundle reference:{' '}
                    {selectedBundleId || 'none selected'} | Status {collaboration.reconnectStatus}
                  </p>
                  <div className="controls compact">
                    <button
                      disabled={
                        collaborationReplayFrame.totalEvents === 0 || collaborationReplayFrame.cursor === 0
                      }
                      onClick={() =>
                        setCollaboration((previous) =>
                          setCollaborationReplayCursor(previous, previous.replayCursor - 1),
                        )
                      }
                    >
                      Previous Event
                    </button>
                    <button
                      disabled={
                        collaborationReplayFrame.totalEvents === 0 ||
                        collaborationReplayFrame.cursor >= collaborationReplayFrame.totalEvents - 1
                      }
                      onClick={() =>
                        setCollaboration((previous) =>
                          setCollaborationReplayCursor(previous, previous.replayCursor + 1),
                        )
                      }
                    >
                      Next Event
                    </button>
                  </div>
                  {collaborationReplayFrame.totalEvents > 0 && (
                    <label className="field">
                      Replay Event
                      <input
                        type="range"
                        min={0}
                        max={Math.max(collaborationReplayFrame.totalEvents - 1, 0)}
                        value={collaborationReplayFrame.cursor}
                        onChange={(event) =>
                          setCollaboration((previous) =>
                            setCollaborationReplayCursor(previous, Number(event.target.value)),
                          )
                        }
                      />
                    </label>
                  )}
                  <p className="status-line">{collaborationReplayFrame.summary}</p>
                  {collaborationReplayFrame.event && (
                    <p className="status-line">
                      Event {collaborationReplayFrame.event.eventId} | Type{' '}
                      {collaborationReplayFrame.event.eventType} | Artifact{' '}
                      {collaborationReplayFrame.event.artifactId ?? 'n/a'}
                    </p>
                  )}
                  <ul className="finding-list" data-testid="collaboration-replay-list">
                    {collaboration.eventLog.length === 0 && (
                      <li>No collaboration events captured yet.</li>
                    )}
                    {collaboration.eventLog.map((event) => (
                      <li key={event.eventId}>
                        {event.actorId} | {event.eventType}
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            </div>
          )}

          {mode === 'scenario' && (
            <div className="sub-panel" data-testid="scenario-panel">
              <h3>Scenario Fork / Constraint Propagation / Export (I4)</h3>
              <div className="compare-stack">
                <div className="compare-form-grid">
                  <label className="field">
                    Scenario Title
                    <input
                      type="text"
                      value={scenarioTitleInput}
                      onChange={(event) => setScenarioTitleInput(event.target.value)}
                    />
                  </label>
                  <label className="field">
                    Active Scenario
                    <select
                      value={selectedScenario?.scenarioId ?? ''}
                      onChange={(event) => onSelectScenarioFork(event.target.value)}
                    >
                      <option value="">No scenario selected</option>
                      {scenario.scenarios.map((entry) => (
                        <option key={entry.scenarioId} value={entry.scenarioId}>
                          {entry.title}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    Compare Against
                    <select
                      value={comparisonScenario?.scenarioId ?? ''}
                      onChange={(event) => onSelectComparisonScenario(event.target.value)}
                    >
                      <option value="">No comparison target</option>
                      {scenario.scenarios
                        .filter((entry) => entry.scenarioId !== selectedScenario?.scenarioId)
                        .map((entry) => (
                          <option key={entry.scenarioId} value={entry.scenarioId}>
                            {entry.title}
                          </option>
                        ))}
                    </select>
                  </label>
                  <label className="field">
                    Constraint Id
                    <input
                      type="text"
                      value={scenarioConstraintIdInput}
                      onChange={(event) => setScenarioConstraintIdInput(event.target.value)}
                    />
                  </label>
                  <label className="field">
                    Constraint Label
                    <input
                      type="text"
                      value={scenarioConstraintLabelInput}
                      onChange={(event) => setScenarioConstraintLabelInput(event.target.value)}
                    />
                  </label>
                  <label className="field">
                    Constraint Value
                    <input
                      type="number"
                      value={scenarioConstraintValueInput}
                      onChange={(event) => setScenarioConstraintValueInput(Number(event.target.value))}
                    />
                  </label>
                  <label className="field">
                    Constraint Unit
                    <input
                      type="text"
                      value={scenarioConstraintUnitInput}
                      onChange={(event) => setScenarioConstraintUnitInput(event.target.value)}
                    />
                  </label>
                  <label className="field">
                    Propagation Weight
                    <input
                      type="number"
                      step={0.1}
                      value={scenarioConstraintWeightInput}
                      onChange={(event) => setScenarioConstraintWeightInput(Number(event.target.value))}
                    />
                  </label>
                  <label className="field">
                    Constraint Rationale
                    <textarea
                      rows={3}
                      value={scenarioConstraintRationaleInput}
                      onChange={(event) => setScenarioConstraintRationaleInput(event.target.value)}
                    />
                  </label>
                  <label className="field">
                    Entity Name
                    <input
                      type="text"
                      value={scenarioEntityNameInput}
                      onChange={(event) => setScenarioEntityNameInput(event.target.value)}
                    />
                  </label>
                  <label className="field">
                    Entity Type
                    <select
                      value={scenarioEntityTypeInput}
                      onChange={(event) =>
                        setScenarioEntityTypeInput(event.target.value as HypotheticalEntityType)
                      }
                    >
                      <option value="asset">asset</option>
                      <option value="corridor">corridor</option>
                      <option value="policy">policy</option>
                      <option value="actor">actor</option>
                    </select>
                  </label>
                  <label className="field">
                    Entity Change
                    <textarea
                      rows={3}
                      value={scenarioEntityChangeInput}
                      onChange={(event) => setScenarioEntityChangeInput(event.target.value)}
                    />
                  </label>
                  <label className="field">
                    Entity Provenance
                    <input
                      type="text"
                      value={scenarioEntitySourceInput}
                      onChange={(event) => setScenarioEntitySourceInput(event.target.value)}
                    />
                  </label>
                  <label className="field">
                    Entity Confidence
                    <select
                      value={scenarioEntityConfidenceInput}
                      onChange={(event) =>
                        setScenarioEntityConfidenceInput(event.target.value as EntityConfidence)
                      }
                    >
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </select>
                  </label>
                </div>

                <div className="delta-summary-grid">
                  <article className="telemetry-card">
                    <span className="metric-label">Parent bundle</span>
                    <strong>{scenario.parentBundleId || selectedBundleId || 'bundle required'}</strong>
                    <p>{offline ? 'Offline cached scenario workflow active.' : 'Live bundle context available.'}</p>
                  </article>
                  <article className="telemetry-card">
                    <span className="metric-label">Scenario forks</span>
                    <strong>{scenario.scenarios.length}</strong>
                    <p>{selectedScenario ? `${selectedScenario.constraints.length} constraints on focus scenario.` : 'Fork a scenario to start modeling.'}</p>
                  </article>
                  <article className="telemetry-card">
                    <span className="metric-label">Comparison</span>
                    <strong>{scenarioComparison ? `${scenarioComparison.constraintDeltaCount} deltas` : 'not ready'}</strong>
                    <p>{scenarioComparison ? `${scenarioComparison.hypotheticalDeltaCount} hypothetical changes.` : 'Select two scenario forks to compare.'}</p>
                  </article>
                  <article className="telemetry-card">
                    <span className="metric-label">Export status</span>
                    <strong>{scenario.exportArtifact ? 'ready' : 'pending'}</strong>
                    <p>{scenario.exportArtifact ? `Fingerprint ${scenario.exportArtifact.exportFingerprint}` : 'Export stays deterministic once inputs stop changing.'}</p>
                  </article>
                </div>

                <div className="controls">
                  <button onClick={onCreateScenarioFork}>Fork Scenario</button>
                  <button onClick={onApplyScenarioConstraint}>Apply Constraint</button>
                  <button onClick={onAddScenarioEntity}>Add Hypothetical Entity</button>
                  <button onClick={onCompareScenarioForks}>Compare Scenarios</button>
                  <button onClick={onExportScenarioBundle}>Export Scenario Bundle</button>
                </div>

                {scenarioBundleMismatch && (
                  <article className="surface-card compact">
                    <strong>Selected bundle differs from current scenario parent</strong>
                    <p>
                      Forking again will start a new scenario branch from bundle {selectedBundleId}.
                    </p>
                  </article>
                )}

                <div className="overlay-grid">
                  {scenario.scenarios.length === 0 && (
                    <article className="surface-card compact">
                      <strong>No scenario forks yet</strong>
                      <p>Create or select a bundle, then fork a scenario to attach constraints and hypothetical entities.</p>
                    </article>
                  )}
                  {scenario.scenarios.map((entry) => (
                    <article key={entry.scenarioId} className="surface-card compact">
                      <div className="card-header compact">
                        <span className={`artifact-chip ${artifactTone('Modeled Output')}`}>
                          Modeled Output
                        </span>
                        <span>{entry.scenarioId}</span>
                      </div>
                      <strong>{entry.title}</strong>
                      <p>
                        Parent bundle: {entry.parentBundleId}
                        {entry.parentScenarioId ? ` | Forked from ${entry.parentScenarioId}` : ''}
                      </p>
                      <small>
                        Marking: {entry.marking} | Seed: {entry.solverSeed} | Constraints:{' '}
                        {entry.constraints.length} | Hypothetical entities:{' '}
                        {entry.hypotheticalEntities.length}
                      </small>
                      <p>{entry.provenanceSummary}</p>
                    </article>
                  ))}
                </div>

                {selectedScenario && (
                  <article className={`artifact-callout ${artifactTone('Modeled Output')}`}>
                    <div className="card-header compact">
                      <span className={`artifact-chip ${artifactTone('Modeled Output')}`}>
                        Modeled Output
                      </span>
                      <span>{selectedScenario.title}</span>
                    </div>
                    <p>
                      Bundle reference: {selectedScenario.parentBundleId} | Modified:{' '}
                      {selectedScenario.modifiedAt}
                    </p>
                    <p>Provenance: {selectedScenario.provenanceSummary}</p>
                    <div className="overlay-grid">
                      {selectedScenario.constraints.length === 0 && (
                        <article className="surface-card compact">
                          <strong>No constraints yet</strong>
                          <p>Apply a constraint to start propagation analysis.</p>
                        </article>
                      )}
                      {selectedScenario.constraints.map((constraint) => (
                        <article key={constraint.constraintId} className="surface-card compact">
                          <strong>{constraint.label}</strong>
                          <p>
                            {constraint.constraintId}: {constraint.value} {constraint.unit}
                          </p>
                          <small>
                            Weight {constraint.propagationWeight} | {constraint.rationale || 'No rationale recorded.'}
                          </small>
                        </article>
                      ))}
                    </div>
                    <div className="overlay-grid">
                      {selectedScenario.hypotheticalEntities.length === 0 && (
                        <article className="surface-card compact">
                          <strong>No hypothetical entities yet</strong>
                          <p>Add an entity to document modeled branch assumptions.</p>
                        </article>
                      )}
                      {selectedScenario.hypotheticalEntities.map((entity) => (
                        <article key={entity.entityId} className="surface-card compact">
                          <strong>{entity.name}</strong>
                          <p>
                            {entity.entityType} | Confidence {entity.confidence}
                          </p>
                          <small>
                            {entity.changeSummary} | Provenance: {entity.provenanceSource}
                          </small>
                        </article>
                      ))}
                    </div>
                  </article>
                )}

                {scenarioComparison && (
                  <article className={`artifact-callout ${artifactTone('Observed Evidence')}`}>
                    <div className="card-header compact">
                      <span className={`artifact-chip ${artifactTone('Observed Evidence')}`}>
                        Observed Evidence
                      </span>
                      <span>
                        {comparisonScenario?.title ?? 'Baseline'} {'->'}{' '}
                        {selectedScenario?.title ?? 'Scenario'}
                      </span>
                    </div>
                    <p>{scenarioComparison.summary}</p>
                    <p>
                      Total propagation delta: {scenarioComparison.totalPropagationDelta} | Parent bundle:{' '}
                      {scenario.parentBundleId || 'n/a'}
                    </p>
                    <div className="overlay-grid">
                      {scenarioComparison.constraintDeltas.length === 0 && (
                        <article className="surface-card compact">
                          <strong>No constraint deltas</strong>
                          <p>The compared scenario pair currently matches on numeric constraints.</p>
                        </article>
                      )}
                      {scenarioComparison.constraintDeltas.map((delta) => (
                        <article key={delta.constraintId} className="surface-card compact">
                          <strong>{delta.label}</strong>
                          <p>
                            {delta.leftValue} {'->'} {delta.rightValue} {delta.unit}
                          </p>
                          <small>
                            Delta {delta.delta} | Propagation impact {delta.propagationImpact}
                          </small>
                        </article>
                      ))}
                    </div>
                    <div className="overlay-grid">
                      {scenarioComparison.hypotheticalDeltas.length === 0 && (
                        <article className="surface-card compact">
                          <strong>No hypothetical entity deltas</strong>
                          <p>Both scenario forks currently reference the same modeled entities.</p>
                        </article>
                      )}
                      {scenarioComparison.hypotheticalDeltas.map((delta) => (
                        <article key={delta.entityId} className="surface-card compact">
                          <strong>{delta.name}</strong>
                          <p>
                            {delta.change} in {selectedScenario?.title}
                          </p>
                        </article>
                      ))}
                    </div>
                  </article>
                )}

                {scenario.exportArtifact && (
                  <article
                    className={`artifact-callout ${artifactTone('Modeled Output')}`}
                    data-testid="scenario-export-card"
                  >
                    <div className="card-header compact">
                      <span className={`artifact-chip ${artifactTone('Modeled Output')}`}>
                        Modeled Output
                      </span>
                      <span>{scenario.exportArtifact.artifactId}</span>
                    </div>
                    <p>{scenario.exportArtifact.summary}</p>
                    <p>
                      Bundle reference: {scenario.exportArtifact.parentBundleId} | Export fingerprint:{' '}
                      {scenario.exportArtifact.exportFingerprint}
                    </p>
                    <small>
                      Compared {scenario.exportArtifact.leftScenarioId} {'->'}{' '}
                      {scenario.exportArtifact.rightScenarioId} | Marking:{' '}
                      {scenario.exportArtifact.marking} | Offline:{' '}
                      {scenario.exportArtifact.offline ? 'yes' : 'no'}
                    </small>
                  </article>
                )}
              </div>
            </div>
          )}

          {mode === 'compare' && (
            <div className="sub-panel" data-testid="compare-dashboard">
              <h3>Baseline / Delta / Briefing (I2)</h3>
              <div className="compare-stack">
                <div className="compare-form-grid">
                  <label className="field">
                    Baseline Window
                    <input
                      type="text"
                      value={baselineWindowLabel}
                      onChange={(event) => setBaselineWindowLabel(event.target.value)}
                    />
                  </label>
                  <label className="field">
                    Event Window
                    <input
                      type="text"
                      value={eventWindowLabel}
                      onChange={(event) => setEventWindowLabel(event.target.value)}
                    />
                  </label>
                  <label className="field">
                    Baseline Series
                    <input
                      type="text"
                      value={baselineInput}
                      onChange={(event) => setBaselineInput(event.target.value)}
                    />
                  </label>
                  <label className="field">
                    Event Series
                    <input
                      type="text"
                      value={eventInput}
                      onChange={(event) => setEventInput(event.target.value)}
                    />
                  </label>
                </div>

                <div className="delta-summary-grid">
                  <article className="telemetry-card">
                    <span className="metric-label">Baseline window</span>
                    <strong>{baselineWindowLabel}</strong>
                    <p>{baselineSeries.length} cells in the reference window.</p>
                  </article>
                  <article className="telemetry-card">
                    <span className="metric-label">Event window</span>
                    <strong>{eventWindowLabel}</strong>
                    <p>{eventSeries.length} cells in the event window.</p>
                  </article>
                  <article className="telemetry-card">
                    <span className="metric-label">Total delta</span>
                    <strong>{compareDashboard.totalDelta}</strong>
                    <p>
                      {
                        compareDashboard.cells.filter((cell) => cell.severity === 'increase').length
                      }{' '}
                      increases,
                      {' '}
                      {
                        compareDashboard.cells.filter((cell) => cell.severity === 'decrease').length
                      }{' '}
                      decreases.
                    </p>
                  </article>
                  <article className="telemetry-card">
                    <span className="metric-label">Largest swing</span>
                    <strong>{compareDashboard.maxAbsoluteDelta}</strong>
                    <p>{contextOverlaySummaries.length} active context overlays.</p>
                  </article>
                </div>

                <div className="delta-cell-grid">
                  {compareDashboard.cells.map((cell) => (
                    <article key={cell.cell_id} className={`delta-cell ${cell.severity}`}>
                      <div className="card-header compact">
                        <strong>{cell.cell_id}</strong>
                        <span className={`policy-pill ${cell.severity === 'decrease' ? 'blocked' : 'allowed'}`}>
                          {cell.severity}
                        </span>
                      </div>
                      <p>
                        Baseline {cell.baseline} | Event {cell.event}
                      </p>
                      <small>
                        Delta {cell.delta} | Severity {cell.severity}
                      </small>
                    </article>
                  ))}
                </div>

                <div className="overlay-grid">
                  {contextOverlaySummaries.length === 0 && (
                    <article className="surface-card compact">
                      <strong>No active context overlays</strong>
                      <p>Register and activate a context domain to corroborate compare results.</p>
                    </article>
                  )}
                  {contextOverlaySummaries.map((overlay) => (
                    <article key={overlay.domain_id} className="surface-card compact">
                      <div className="card-header compact">
                        <span className={`artifact-chip ${artifactTone('Curated Context')}`}>
                          Curated Context
                        </span>
                        <span>{overlay.relationship}</span>
                      </div>
                      <strong>{overlay.domain_name}</strong>
                      <p>
                        Source: {overlay.source_name} | Cadence: {overlay.update_cadence}
                      </p>
                      <small>
                        Confidence: {overlay.confidence_baseline} | Presentation:{' '}
                        {overlay.presentation_type}
                      </small>
                    </article>
                  ))}
                </div>

                <div className="controls">
                  <button onClick={onPrepareBriefingArtifact}>Prepare Briefing Artifact</button>
                </div>
                <p className="status-line">
                  {selectedBundleId
                    ? `Bundle reference: ${selectedBundleId}`
                    : 'Select or create a bundle before briefing export.'}
                </p>
                <p className="status-line">Delta: [{densityDelta.delta.join(', ')}]</p>
                <p className="status-line">{briefingBundle.summary}</p>

                {briefingArtifact && (
                  <article className="artifact-callout evidence" data-testid="briefing-artifact-card">
                    <div className="card-header">
                      <div>
                        <span className={`artifact-chip ${artifactTone(briefingArtifact.label)}`}>
                          {briefingArtifact.label}
                        </span>
                        <h3>{briefingArtifact.summary}</h3>
                      </div>
                      <span
                        className={`policy-pill ${
                          briefingArtifact.exportStatus === 'ready' ? 'allowed' : 'blocked'
                        }`}
                      >
                        {briefingArtifact.exportStatus === 'ready' ? 'Golden flow ready' : 'Bundle required'}
                      </span>
                    </div>
                    <p>
                      Bundle reference: {briefingArtifact.bundleId ?? 'none'} | Windows:{' '}
                      {briefingArtifact.baselineWindow.label}
                      {' -> '}
                      {briefingArtifact.eventWindow.label}
                    </p>
                    <ul className="finding-list">
                      <li>Delta cells: {briefingArtifact.deltaCellCount}</li>
                      <li>Total delta: {briefingArtifact.totalDelta}</li>
                      <li>Overlay domains: {briefingArtifact.overlayDomainIds.join(', ') || 'none'}</li>
                    </ul>
                    <div className="briefing-element-list">
                      <article className="surface-card compact">
                        <span className={`artifact-chip ${artifactTone('Observed Evidence')}`}>
                          Observed Evidence
                        </span>
                        <strong>Density Delta Grid</strong>
                        <p>{compareDashboard.summary}</p>
                      </article>
                      {contextOverlaySummaries.map((overlay) => (
                        <article key={`briefing-${overlay.domain_id}`} className="surface-card compact">
                          <span className={`artifact-chip ${artifactTone('Curated Context')}`}>
                            Curated Context
                          </span>
                          <strong>{overlay.domain_name}</strong>
                          <p>{overlay.relationship}</p>
                        </article>
                      ))}
                    </div>
                  </article>
                )}
              </div>
            </div>
          )}

          {mode === 'live_recent' && (
            <div className="sub-panel">
              <h3>Context Deviation (I8)</h3>
              <label className="field">
                Baseline
                <input
                  type="text"
                  value={deviationBaselineInput}
                  onChange={(event) => setDeviationBaselineInput(event.target.value)}
                />
              </label>
              <label className="field">
                Observed
                <input
                  type="text"
                  value={deviationObservedInput}
                  onChange={(event) => setDeviationObservedInput(event.target.value)}
                />
              </label>
              <label className="field">
                Threshold
                <input
                  type="number"
                  step={0.05}
                  value={deviationThreshold}
                  onChange={(event) => setDeviationThreshold(Number(event.target.value))}
                />
              </label>
              <label className="field">
                Deviation Type
                <select
                  value={deviationType}
                  onChange={(event) =>
                    setDeviationType(event.target.value as DeviationEvent['deviation_type'])
                  }
                >
                  <option value="trade_flow">trade_flow</option>
                  <option value="infrastructure">infrastructure</option>
                  <option value="regulatory">regulatory</option>
                </select>
              </label>
              <p className="status-line">
                Deviation:
                {' '}
                {deviationEvent
                  ? `${deviationEvent.deviation_type} (${deviationEvent.score.toFixed(2)})`
                  : 'none'}
              </p>
            </div>
          )}

          <h3>Bundle Registry</h3>
          <div className="bundle-list">
            {bundles.length === 0 && <p>No bundles yet.</p>}
            {bundles.map((bundle) => (
              <label key={bundle.bundle_id} className="bundle-item">
                <input
                  type="radio"
                  name="bundle"
                  value={bundle.bundle_id}
                  checked={selectedBundleId === bundle.bundle_id}
                  onChange={() => setSelectedBundleId(bundle.bundle_id)}
                />
                <span>{bundle.bundle_id}</span>
                <small>{bundle.created_at}</small>
              </label>
            ))}
          </div>
        </section>

        <section className="panel audit-panel" data-testid="region-right-panel">
          <h2>Governance, Context, and Audit</h2>
          <p>Current head hash: {auditHead || 'n/a'}</p>
          {contextPanelEntry && (
            <article className={`artifact-callout ${artifactTone(contextPanelEntry.artifactLabel)}`}>
              <div className="card-header compact">
                <span className={`artifact-chip ${artifactTone(contextPanelEntry.artifactLabel)}`}>
                  {contextPanelEntry.artifactLabel}
                </span>
                <span>{contextPanelEntry.title}</span>
              </div>
              <p>{contextPanelEntry.confidenceText}</p>
              <small>
                Render surface: {contextPanelEntry.renderSurface} | Export:{' '}
                {contextPanelEntry.exportAllowed ? 'allowed' : 'blocked'}
              </small>
            </article>
          )}

          <h3>Context Intake (I7)</h3>
          <label className="field">
            Domain Name
            <input
              type="text"
              value={domainDraft.domain_name}
              onChange={(event) =>
                setDomainDraft((previous) => ({
                  ...previous,
                  domain_name: event.target.value,
                }))
              }
            />
          </label>
          <label className="field">
            Source URL
            <input
              type="text"
              value={domainDraft.source_url}
              onChange={(event) =>
                setDomainDraft((previous) => ({
                  ...previous,
                  source_url: event.target.value,
                }))
              }
            />
          </label>
          <label className="field">
            Correlation AOI
            <input
              type="text"
              value={correlationAoi}
              onChange={(event) => setCorrelationAoi(event.target.value)}
            />
          </label>
          <div className="controls">
            <button onClick={onRegisterDomain}>Register Domain</button>
            <button onClick={onPersistCorrelationSelection}>Save Correlation Selection</button>
          </div>
          <p className="status-line">Registered domains: {domains.length}</p>
          <p className="status-line">
            Active context domains: {activeDomainIds.length} | Correlation AOI: {correlationAoi}
          </p>
          <div className="context-card-list">
            {domains.length === 0 && <p>No context domains registered.</p>}
            {domains.map((domain) => {
              const catalogEntry = contextDomainCatalog.find(
                (entry) => entry.layerId === `context-${domain.domain_id}`,
              )
              return (
                <article key={domain.domain_id} className="context-card">
                  <div className="card-header">
                    <label className="context-selector">
                      <input
                        type="checkbox"
                        checked={activeDomainIds.includes(domain.domain_id)}
                        onChange={() => onToggleDomainSelection(domain.domain_id)}
                      />
                      <strong>{domain.domain_name}</strong>
                    </label>
                    <span
                      className={`artifact-chip ${artifactTone(
                        catalogEntry?.artifactLabel ?? 'Curated Context',
                      )}`}
                    >
                      {catalogEntry?.artifactLabel ?? 'Curated Context'}
                    </span>
                  </div>
                  <p className="status-line">
                    {domain.domain_class} | Presentation: {domain.presentation_type}
                  </p>
                  <dl className="meta-grid">
                    <div>
                      <dt>Source</dt>
                      <dd>{domain.source_name}</dd>
                    </div>
                    <div>
                      <dt>Cadence</dt>
                      <dd>{domain.update_cadence}</dd>
                    </div>
                    <div>
                      <dt>Confidence</dt>
                      <dd>{domain.confidence_baseline}</dd>
                    </div>
                    <div>
                      <dt>Render surface</dt>
                      <dd>{catalogEntry?.renderSurface ?? 'main_canvas'}</dd>
                    </div>
                    <div>
                      <dt>License</dt>
                      <dd>{domain.license}</dd>
                    </div>
                    <div>
                      <dt>Export</dt>
                      <dd>{catalogEntry?.exportAllowed ? 'allowed' : 'blocked'}</dd>
                    </div>
                  </dl>
                  <small>{domain.methodology_notes}</small>
                </article>
              )
            })}
          </div>

          <h3>OSINT Aggregation (I9)</h3>
          <label className="field">
            Source
            <select value={osintSource} onChange={(event) => setOsintSource(event.target.value)}>
              {CURATED_OSINT_SOURCES.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Verification
            <select
              value={osintVerification}
              onChange={(event) => setOsintVerification(event.target.value as VerificationLevel)}
            >
              <option value="confirmed">confirmed</option>
              <option value="reported">reported</option>
              <option value="alleged">alleged</option>
            </select>
          </label>
          <label className="field">
            AOI
            <input
              type="text"
              value={osintAoi}
              onChange={(event) => setOsintAoi(event.target.value)}
            />
          </label>
          <div className="controls">
            <button onClick={onAddOsintEvent}>Add OSINT Event</button>
          </div>
          <p className="status-line">
            Alerts in {osintAoi}: {osintSummary.count}
            {' '}
            (alleged {osintSummary.verificationBreakdown.alleged})
          </p>

          <h3>Strategic Model (I10)</h3>
          <label className="field">
            Assumption
            <input
              type="text"
              value={gameAssumption}
              onChange={(event) => setGameAssumption(event.target.value)}
            />
          </label>
          <p className="status-line">
            Model valid: {gameModelValid ? 'yes' : 'no'} | Payoff proxy:
            {' '}
            {payoffProxy.metric}
            {' '}
            [{payoffProxy.uncertainty[0]}, {payoffProxy.uncertainty[1]}]
          </p>

          <h3>Audit Ledger</h3>
          <div className="audit-list">
            {auditEvents.length === 0 && <p>No events recorded.</p>}
            {auditEvents
              .slice()
              .reverse()
              .map((event) => (
                <article key={event.event_id} className="audit-item">
                  <strong>{event.event_type}</strong>
                  <span>{event.ts}</span>
                  <span>Role: {event.actor_role}</span>
                  <code>{event.event_hash}</code>
                </article>
              ))}
          </div>
        </section>
      </main>
      <footer className="panel footer-panel" data-testid="region-bottom-panel">
        <strong>Bottom Panel</strong>
        <span>
          {`Mode=${mode} | Connectivity=${offline ? 'offline' : 'online'} | Audit events=${auditEvents.length} | Query matches=${queryResult.length} | Degraded budgets=${degradedBudgetCount}`}
        </span>
      </footer>
    </div>
  )
}

export default App
