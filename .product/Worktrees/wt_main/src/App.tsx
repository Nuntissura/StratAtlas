import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { startTransition, useEffectEvent, useRef } from 'react'
import type {
  AuditEvent,
  BundleManifest,
  RuntimeSmokeAssertion,
  RuntimeSmokeMetric,
  RuntimeSmokeRegionCheck,
  RuntimeSmokeReport,
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
import { REQUIRED_UI_MODES, REQUIRED_UI_REGIONS } from './features/i1/modes'
import {
  MapRuntimeSurface,
} from './features/i1/components/MapRuntimeSurface'
import {
  DEFAULT_MAP_RUNTIME_TELEMETRY,
  type MapRuntimeTelemetry,
} from './features/i1/runtime/mapRuntimeTelemetry'
import {
  ARTIFACT_LABELS,
  artifactTone,
  buildWorkspaceLayerCatalog,
  type LayerCatalogEntry,
} from './features/i1/layers'
import { buildMapRuntimeScene } from './features/i1/runtime/mapRuntimeScene'
import {
  I1_BUDGETS,
  buildBudgetTelemetry,
  describeStateChangeFeedback,
  shouldDegradeRendering,
  type StateChangeFeedback,
} from './features/i1/performance'
import {
  buildCompareArtifact,
  buildBriefingArtifactPreview,
  buildBriefingBundle,
  buildCompareDashboard,
  buildCompareStateSnapshot,
  buildComparisonWindow,
  buildContextOverlaySummaries,
  computeDensityDelta,
  type BriefingBundle,
  type BriefingArtifactPreview,
  type CompareArtifact,
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
  buildQueryRenderLayerFromMatches,
  buildSavedQueryArtifact,
  bumpQueryVersion,
  removeQueryCondition,
  type QueryCondition,
  type QueryConditionScope,
  type QueryMatchSnapshot,
  type QueryOperator,
  type QueryRenderLayer,
  type SavedQueryArtifact,
  type VersionedQuery,
} from './features/i5/queryBuilder'
import { executeQuery } from './features/i5/queryExecution'
import {
  buildGovernedQuerySource,
  buildLocalQuerySourceRecords,
  describeGovernedQuerySource,
  resolveQueryDomainIds,
} from './features/i5/queryRuntime'
import {
  createBrowserSimulatedAiProviderStatus,
  createUnavailableAiProviderStatus,
  DEPLOYMENT_PROFILES,
  MCP_MINIMUM_TOOLS,
  collectEvidenceRefs,
  evaluateAiGatewayPolicy,
  executeMcpTool,
  normalizeAiGatewaySnapshot,
  runAiGatewayAnalysis,
  type AiGatewayArtifact,
  type AiGatewayProviderStatus,
  type AiGatewaySnapshot,
  type DeploymentProfileId,
  type McpInvocationRecord,
  type McpToolName,
} from './features/i6/aiGateway'
import {
  buildContextTimeRange,
  buildCorrelationLinks,
  collectDomainRegistrationErrors,
  queryContextRecords,
  summarizeContextAvailability,
  validateDomainRegistration,
  type ContextCorrelationLink,
  type ContextDomain,
  type ContextRecord,
  type ContextTimeRange,
} from './features/i7/contextIntake'
import {
  buildGovernedDomainDraft,
  DEFAULT_GOVERNED_CONTEXT_DOMAIN_ID,
  describeGovernedDomainIngestion,
  getGovernedDomainTemplate,
  GOVERNED_CONTEXT_DOMAIN_TEMPLATES,
  materializeGovernedContextRecords,
  resolveGovernedDomainRegistration,
} from './features/i7/governedDomains'
import {
  buildConstraintNodeSuggestion,
  buildDeviationWindowPreview,
  createDeviationSnapshot,
  DEFAULT_DEVIATION_BASELINE_POINT_COUNT,
  DEFAULT_DEVIATION_INPUT_MODE,
  DEFAULT_DEVIATION_OBSERVED_POINT_COUNT,
  DEFAULT_DEVIATION_THRESHOLD,
  detectDeviation,
  detectDeviationFromRecords,
  normalizeDeviationSnapshot,
  pushDeviationEvent,
  selectHistoricalDeviationWindow,
  type ConstraintNodeSuggestion,
  type DeviationEvent,
  type DeviationInputMode,
  type DeviationSnapshot,
} from './features/i8/deviation'
import {
  OSINT_EVENT_CATEGORIES,
  THRESHOLD_COMPARATORS,
  CURATED_OSINT_SOURCES,
  DEFAULT_GOVERNED_FEED_CONNECTOR_ID,
  OSINT_SOURCE_MODES,
  aggregateAlerts,
  buildContextThresholdRef,
  buildOsintEvent,
  createOsintSnapshot,
  executeGovernedFeedConnector,
  getGovernedFeedConnectorTemplate,
  normalizeOsintSnapshot,
  pushContextThresholdRef,
  pushOsintEvent,
  recordGovernedFeedConnector,
  validateCuratedSource,
  type GovernedFeedConnectorId,
  type OsintEventCategory,
  type OsintSourceMode,
  type OsintSnapshot,
  type ThresholdComparator,
  type VerificationLevel,
} from './features/i9/osint'
import {
  ACTION_CATEGORIES,
  ACTOR_TYPES,
  GAME_TYPES,
  SCENARIO_TREE_NODE_TYPES,
  SOLVER_METHODS,
  appendGameAction,
  appendGameActor,
  appendGameAssumption,
  appendGameObjective,
  appendScenarioTreeNode,
  buildPayoffProxy,
  createGameModelSnapshot,
  normalizeGameModelSnapshot,
  renameGameModel,
  runGameSolver,
  setGameType,
  setSelectedGameScenario,
  validateGameModel,
  type ActionCategory,
  type ActorType,
  type GameModelSnapshot,
  type GameType,
  type ScenarioTreeNodeType,
  type SolverMethod,
} from './features/i10/gameModeling'
import { backend } from './lib/backend'
import {
  captureRuntimeSmokeWindowSnapshot,
  closeRuntimeSmokeWindow,
  runtimeSmokeConfig,
  writeRuntimeSmokeEvidence,
} from './lib/runtimeSmoke'

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
const DEFAULT_CONTEXT_ANCHOR_DAY = '2026-03-06'
const DEFAULT_CONTEXT_PROHIBITED_USES = ['MUST NOT be used for individual entity tracking']
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
const DEFAULT_QUERY_SOURCE_SUMMARY =
  'Query source: register or restore a governed context domain to run governed queries.'
const DEFAULT_QUERY_EXECUTION_SUMMARY = 'Execution: waiting for a governed DuckDB run.'
const DEFAULT_DEPLOYMENT_PROFILE: DeploymentProfileId = 'connected'
const DEFAULT_MCP_TOOL: McpToolName = 'get_bundle_manifest'
const QUERY_OPERATORS: QueryOperator[] = ['equals', 'greater_than', 'less_than', 'contains']
const DEFAULT_OSINT_CATEGORY: OsintEventCategory = 'conflict_event'
const DEFAULT_OSINT_SUMMARY = 'Curated feed reports a port-area disruption with aggregate AOI relevance.'
const DEFAULT_OSINT_THRESHOLD_VALUE = '15'
const DEFAULT_OSINT_THRESHOLD_COMPARATOR: ThresholdComparator = 'below'
const DEFAULT_GAME_NAME = 'Strategic Resilience Model'
const DEFAULT_GAME_ACTOR_LABEL = 'Port authority consortium'
const DEFAULT_GAME_ACTOR_TYPE: ActorType = 'institution'
const DEFAULT_GAME_OBJECTIVE_LABEL = 'Reduce congestion spillover'
const DEFAULT_GAME_OBJECTIVE_WEIGHT = '0.4'
const DEFAULT_GAME_ACTION_LABEL = 'Phase inspection windows'
const DEFAULT_GAME_ACTION_CATEGORY: ActionCategory = 'policy'
const DEFAULT_GAME_NODE_LABEL = 'Escalation branch'
const DEFAULT_GAME_NODE_TYPE: ScenarioTreeNodeType = 'decision'
const DEFAULT_GAME_SOLVER_METHOD: SolverMethod = 'minimax_regret'
const DEFAULT_GAME_SOLVER_SEED = '29'
const DEFAULT_GAME_MONTE_CARLO_SAMPLES = '24'

const deviationTypeForDomain = (
  domain: ContextDomain,
): DeviationEvent['deviation_type'] => {
  if (domain.domain_class === 'trade_flow') {
    return 'trade_flow'
  }

  if (domain.domain_class === 'regulatory') {
    return 'regulatory'
  }

  return 'infrastructure'
}

const modeLabel = (forcedOffline: boolean): string =>
  forcedOffline ? 'Offline (forced)' : 'Online-capable'

const parseNumericSeries = (value: string): number[] =>
  value
    .split(',')
    .map((entry) => Number(entry.trim()))
    .filter((entry) => Number.isFinite(entry))

const createDomainDraft = (domainId = DEFAULT_GOVERNED_CONTEXT_DOMAIN_ID): ContextDomain => {
  const draft = buildGovernedDomainDraft(domainId)
  return {
    ...draft,
    prohibited_uses: draft.prohibited_uses ?? DEFAULT_CONTEXT_PROHIBITED_USES,
  }
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

const serializeRecorderFingerprint = (state: Omit<RecorderState, 'savedAt'>): string =>
  JSON.stringify(normalizeJson(state))

const recorderFingerprintFromState = (state: RecorderState): string =>
  serializeRecorderFingerprint({
    workspace: state.workspace,
    query: state.query,
    context: state.context,
    compare: state.compare,
    collaboration: state.collaboration,
    scenario: state.scenario,
    ai: state.ai,
    deviation: state.deviation,
    osint: state.osint,
    gameModel: state.gameModel,
    selectedBundleId: state.selectedBundleId,
  })

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

const normalizeContextTimeRange = (value: unknown): ContextTimeRange =>
  isRecord(value) &&
  typeof value.start === 'string' &&
  typeof value.end === 'string'
    ? {
        start: value.start,
        end: value.end,
      }
    : buildContextTimeRange({
        startHour: DEFAULT_QUERY.timeWindow.startHour,
        endHour: DEFAULT_QUERY.timeWindow.endHour,
        anchorDay: DEFAULT_CONTEXT_ANCHOR_DAY,
      })

const normalizeContextRecords = (value: unknown): ContextRecord[] => {
  if (!Array.isArray(value)) {
    return []
  }
  return value
    .filter((entry): entry is Record<string, unknown> => isRecord(entry))
    .filter(
      (entry) =>
        typeof entry.record_id === 'string' &&
        typeof entry.domain_id === 'string' &&
        typeof entry.target_id === 'string' &&
        typeof entry.observed_at === 'string' &&
        typeof entry.value_label === 'string' &&
        typeof entry.numeric_value === 'number' &&
        typeof entry.unit === 'string' &&
        typeof entry.source_name === 'string' &&
        typeof entry.source_url === 'string' &&
        typeof entry.license === 'string' &&
        typeof entry.update_cadence === 'string' &&
        typeof entry.confidence === 'string' &&
        typeof entry.cached_at === 'string' &&
        Array.isArray(entry.lineage),
    )
    .map((entry) => ({
      record_id: entry.record_id as string,
      domain_id: entry.domain_id as string,
      correlation_type:
        entry.correlation_type === 'aoi_bound' ||
        entry.correlation_type === 'entity_class_bound' ||
        entry.correlation_type === 'infrastructure_node_bound' ||
        entry.correlation_type === 'region_bound'
          ? entry.correlation_type
          : 'region_bound',
      target_id: entry.target_id as string,
      observed_at: entry.observed_at as string,
      value_label: entry.value_label as string,
      numeric_value: entry.numeric_value as number,
      unit: entry.unit as string,
      source_name: entry.source_name as string,
      source_url: entry.source_url as string,
      license: entry.license as string,
      update_cadence: entry.update_cadence as string,
      confidence: entry.confidence as string,
      cached_at: entry.cached_at as string,
      lineage: (entry.lineage as unknown[]).filter(
        (lineageEntry): lineageEntry is string => typeof lineageEntry === 'string',
      ),
      verification_level:
        entry.verification_level === 'confirmed' ||
        entry.verification_level === 'reported' ||
        entry.verification_level === 'alleged'
          ? entry.verification_level
          : undefined,
    }))
}

const normalizeCorrelationLinks = (value: unknown): ContextCorrelationLink[] => {
  if (!Array.isArray(value)) {
    return []
  }
  return value
    .filter((entry): entry is Record<string, unknown> => isRecord(entry))
    .filter(
      (entry) =>
        typeof entry.link_id === 'string' &&
        typeof entry.domain_id === 'string' &&
        typeof entry.target_id === 'string' &&
        typeof entry.label === 'string' &&
        typeof entry.enabled === 'boolean',
    )
    .map((entry) => ({
      link_id: entry.link_id as string,
      domain_id: entry.domain_id as string,
      correlation_type:
        entry.correlation_type === 'aoi_bound' ||
        entry.correlation_type === 'entity_class_bound' ||
        entry.correlation_type === 'infrastructure_node_bound' ||
        entry.correlation_type === 'region_bound'
          ? entry.correlation_type
          : 'region_bound',
      target_id: entry.target_id as string,
      label: 'Correlated Context',
      enabled: Boolean(entry.enabled),
      time_range: normalizeContextTimeRange(entry.time_range),
      summary: typeof entry.summary === 'string' ? entry.summary : undefined,
      lineage: Array.isArray(entry.lineage)
        ? (entry.lineage as unknown[]).filter(
            (lineageEntry): lineageEntry is string => typeof lineageEntry === 'string',
          )
        : undefined,
    }))
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

const normalizeCompareArtifact = (value: unknown): CompareArtifact | undefined => {
  if (!isRecord(value)) {
    return undefined
  }

  const artifactId = typeof value.artifactId === 'string' ? value.artifactId : ''
  if (!artifactId) {
    return undefined
  }

  return {
    artifactId,
    bundleId: typeof value.bundleId === 'string' ? value.bundleId : undefined,
    marking:
      value.marking === 'PUBLIC' || value.marking === 'INTERNAL' || value.marking === 'RESTRICTED'
        ? value.marking
        : 'INTERNAL',
    summary: typeof value.summary === 'string' ? value.summary : '',
    baselineWindow: normalizeComparisonWindow(
      value.baselineWindow,
      'Baseline',
      DEFAULT_BASELINE_WINDOW_LABEL,
    ),
    eventWindow: normalizeComparisonWindow(value.eventWindow, 'Event', DEFAULT_EVENT_WINDOW_LABEL),
    totalDelta: normalizeNumber(value.totalDelta, 0),
    focusAoiId: typeof value.focusAoiId === 'string' ? value.focusAoiId : DEFAULT_CORRELATION_AOI,
    focusAoiLabel:
      typeof value.focusAoiLabel === 'string' ? value.focusAoiLabel : 'Singapore Strait',
    deltaCellIds: normalizeStringArray(value.deltaCellIds),
    overlayDomainIds: normalizeStringArray(value.overlayDomainIds),
    generatedAt:
      typeof value.generatedAt === 'string' ? value.generatedAt : '1970-01-01T00:00:00.000Z',
    exportFingerprint:
      typeof value.exportFingerprint === 'string' ? value.exportFingerprint : 'compare-pending',
    offline: Boolean(value.offline),
  }
}

const normalizeBriefingBundle = (value: unknown): BriefingBundle | undefined => {
  if (!isRecord(value)) {
    return undefined
  }

  const artifactId = typeof value.artifactId === 'string' ? value.artifactId : ''
  const compareArtifactId =
    typeof value.compareArtifactId === 'string' ? value.compareArtifactId : ''
  if (!artifactId || !compareArtifactId) {
    return undefined
  }

  const sections = Array.isArray(value.sections)
    ? value.sections
        .filter((entry): entry is Record<string, unknown> => isRecord(entry))
        .filter(
          (entry) =>
            typeof entry.sectionId === 'string' &&
            typeof entry.title === 'string' &&
            (entry.artifactLabel === 'Observed Evidence' ||
              entry.artifactLabel === 'Curated Context') &&
            typeof entry.summary === 'string' &&
            typeof entry.aoiId === 'string',
        )
        .map((entry) => ({
          sectionId: entry.sectionId as string,
          title: entry.title as string,
          artifactLabel: entry.artifactLabel as 'Observed Evidence' | 'Curated Context',
          summary: entry.summary as string,
          aoiId: entry.aoiId as string,
        }))
    : []

  return {
    artifactId,
    compareArtifactId,
    bundleId: typeof value.bundleId === 'string' ? value.bundleId : undefined,
    marking:
      value.marking === 'PUBLIC' || value.marking === 'INTERNAL' || value.marking === 'RESTRICTED'
        ? value.marking
        : 'INTERNAL',
    baselineWindow:
      typeof value.baselineWindow === 'string'
        ? value.baselineWindow
        : DEFAULT_BASELINE_WINDOW_LABEL,
    eventWindow:
      typeof value.eventWindow === 'string' ? value.eventWindow : DEFAULT_EVENT_WINDOW_LABEL,
    summary: typeof value.summary === 'string' ? value.summary : '',
    totalDelta: normalizeNumber(value.totalDelta, 0),
    focusAoiId: typeof value.focusAoiId === 'string' ? value.focusAoiId : DEFAULT_CORRELATION_AOI,
    focusAoiLabel:
      typeof value.focusAoiLabel === 'string' ? value.focusAoiLabel : 'Singapore Strait',
    delta: normalizeNumberArray(value.delta),
    deltaCellIds: normalizeStringArray(value.deltaCellIds),
    overlayDomainIds: normalizeStringArray(value.overlayDomainIds),
    sections,
    exportFingerprint:
      typeof value.exportFingerprint === 'string' ? value.exportFingerprint : 'briefing-pending',
    generatedAt:
      typeof value.generatedAt === 'string' ? value.generatedAt : '1970-01-01T00:00:00.000Z',
    offline: Boolean(value.offline),
    exportStatus: value.exportStatus === 'ready' ? 'ready' : 'bundle_required',
  }
}

const normalizeBriefingArtifact = (value: unknown): BriefingArtifactPreview | undefined => {
  if (!isRecord(value)) {
    return undefined
  }

  const artifactId = typeof value.artifactId === 'string' ? value.artifactId : ''
  const compareArtifactId =
    typeof value.compareArtifactId === 'string' ? value.compareArtifactId : ''
  if (!artifactId || !compareArtifactId) {
    return undefined
  }

  return {
    artifactId,
    label: 'Observed Evidence',
    summary: typeof value.summary === 'string' ? value.summary : '',
    bundleId: typeof value.bundleId === 'string' ? value.bundleId : undefined,
    compareArtifactId,
    marking:
      value.marking === 'PUBLIC' || value.marking === 'INTERNAL' || value.marking === 'RESTRICTED'
        ? value.marking
        : 'INTERNAL',
    baselineWindow: normalizeComparisonWindow(
      value.baselineWindow,
      'Baseline',
      DEFAULT_BASELINE_WINDOW_LABEL,
    ),
    eventWindow: normalizeComparisonWindow(value.eventWindow, 'Event', DEFAULT_EVENT_WINDOW_LABEL),
    deltaCellCount: normalizeNumber(value.deltaCellCount, 0),
    totalDelta: normalizeNumber(value.totalDelta, 0),
    focusAoiId: typeof value.focusAoiId === 'string' ? value.focusAoiId : DEFAULT_CORRELATION_AOI,
    focusAoiLabel:
      typeof value.focusAoiLabel === 'string' ? value.focusAoiLabel : 'Singapore Strait',
    overlayDomainIds: normalizeStringArray(value.overlayDomainIds),
    exportStatus: value.exportStatus === 'ready' ? 'ready' : 'bundle_required',
    offline: Boolean(value.offline),
    generatedAt:
      typeof value.generatedAt === 'string' ? value.generatedAt : '1970-01-01T00:00:00.000Z',
    exportFingerprint:
      typeof value.exportFingerprint === 'string' ? value.exportFingerprint : 'briefing-pending',
    sectionTitles: normalizeStringArray(value.sectionTitles),
  }
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
    compareArtifact: normalizeCompareArtifact(value.compareArtifact),
    briefingArtifact: normalizeBriefingArtifact(value.briefingArtifact),
    briefingBundle: normalizeBriefingBundle(value.briefingBundle),
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
  result,
  sourceRowCount,
  savedVersions,
  renderLayer,
  savedArtifact,
}: {
  definition: VersionedQuery
  result: QueryMatchSnapshot
  sourceRowCount: number
  savedVersions: VersionedQuery[]
  renderLayer?: QueryRenderLayer
  savedArtifact?: SavedQueryArtifact
}): QueryStateSnapshot => ({
  definition,
  resultCount: result.resultCount,
  sourceRowCount,
  matchedRowIds: [...result.matchedRowIds],
  savedVersions,
  renderLayer,
  savedArtifact,
})

const buildContextSnapshot = ({
  domains,
  activeDomainIds,
  correlationAoi,
  correlationLinks,
  records,
  queryRange,
}: {
  domains: ContextDomain[]
  activeDomainIds: string[]
  correlationAoi: string
  correlationLinks: ContextCorrelationLink[]
  records: ContextRecord[]
  queryRange: ContextTimeRange
}): ContextSnapshot => ({
  domains,
  activeDomainIds,
  correlationAoi,
  correlationLinks,
  records,
  queryRange,
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

const RUNTIME_SMOKE_REGION_SELECTORS: Record<
  (typeof REQUIRED_UI_REGIONS)[number],
  string
> = {
  header: '[data-testid="region-header"]',
  left_panel: '[data-testid="region-left-panel"]',
  right_panel: '[data-testid="region-right-panel"]',
  bottom_panel: '[data-testid="region-bottom-panel"]',
  main_canvas: '[data-testid="region-main-canvas"]',
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
  const [queryRows, setQueryRows] = useState<Record<string, unknown>[]>([])
  const [queryResultCount, setQueryResultCount] = useState<number>(0)
  const [queryMatchedRowIds, setQueryMatchedRowIds] = useState<number[]>([])
  const [querySourceRowCount, setQuerySourceRowCount] = useState<number>(0)
  const [querySourceSummary, setQuerySourceSummary] = useState<string>(DEFAULT_QUERY_SOURCE_SUMMARY)
  const [queryExecutionSummary, setQueryExecutionSummary] =
    useState<string>(DEFAULT_QUERY_EXECUTION_SUMMARY)
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
  const [aiProviderStatus, setAiProviderStatus] = useState<AiGatewayProviderStatus>(
    createBrowserSimulatedAiProviderStatus(),
  )
  const [domains, setDomains] = useState<ContextDomain[]>([])
  const [activeDomainIds, setActiveDomainIds] = useState<string[]>([])
  const [correlationAoi, setCorrelationAoi] = useState<string>(DEFAULT_CORRELATION_AOI)
  const [contextRecords, setContextRecords] = useState<ContextRecord[]>([])
  const [selectedGovernedDomainId, setSelectedGovernedDomainId] = useState<string>(
    DEFAULT_GOVERNED_CONTEXT_DOMAIN_ID,
  )
  const [domainDraft, setDomainDraft] = useState<ContextDomain>(() =>
    createDomainDraft(DEFAULT_GOVERNED_CONTEXT_DOMAIN_ID),
  )
  const [deviationBaselineInput, setDeviationBaselineInput] = useState<string>('')
  const [deviationObservedInput, setDeviationObservedInput] = useState<string>('')
  const [deviationInputMode, setDeviationInputMode] =
    useState<DeviationInputMode>(DEFAULT_DEVIATION_INPUT_MODE)
  const [deviationBaselinePointCount, setDeviationBaselinePointCount] = useState<number>(
    DEFAULT_DEVIATION_BASELINE_POINT_COUNT,
  )
  const [deviationObservedPointCount, setDeviationObservedPointCount] = useState<number>(
    DEFAULT_DEVIATION_OBSERVED_POINT_COUNT,
  )
  const [deviationThreshold, setDeviationThreshold] = useState<number>(DEFAULT_DEVIATION_THRESHOLD)
  const [deviationType, setDeviationType] =
    useState<DeviationEvent['deviation_type']>('trade_flow')
  const [selectedDeviationDomainId, setSelectedDeviationDomainId] = useState<string>('')
  const [deviationSnapshot, setDeviationSnapshot] = useState<DeviationSnapshot>(() =>
    createDeviationSnapshot(),
  )
  const [osintInputMode, setOsintInputMode] = useState<OsintSourceMode>('governed_connector')
  const [selectedGovernedConnectorId, setSelectedGovernedConnectorId] = useState<string>(
    DEFAULT_GOVERNED_FEED_CONNECTOR_ID,
  )
  const [osintSource, setOsintSource] = useState<string>(CURATED_OSINT_SOURCES[0])
  const [osintVerification, setOsintVerification] = useState<VerificationLevel>('reported')
  const [osintAoi, setOsintAoi] = useState<string>('aoi-1')
  const [osintCategory, setOsintCategory] = useState<OsintEventCategory>(DEFAULT_OSINT_CATEGORY)
  const [osintSummaryInput, setOsintSummaryInput] = useState<string>(DEFAULT_OSINT_SUMMARY)
  const [selectedOsintThresholdDomainId, setSelectedOsintThresholdDomainId] = useState<string>('')
  const [osintThresholdComparator, setOsintThresholdComparator] = useState<ThresholdComparator>(
    DEFAULT_OSINT_THRESHOLD_COMPARATOR,
  )
  const [osintThresholdValueInput, setOsintThresholdValueInput] =
    useState<string>(DEFAULT_OSINT_THRESHOLD_VALUE)
  const [osintSnapshot, setOsintSnapshot] = useState<OsintSnapshot>(() => createOsintSnapshot())
  const [gameModelSnapshot, setGameModelSnapshot] = useState<GameModelSnapshot>(() =>
    createGameModelSnapshot(),
  )
  const [gameNameInput, setGameNameInput] = useState<string>(DEFAULT_GAME_NAME)
  const [gameAssumptionInput, setGameAssumptionInput] = useState<string>('Supply remains constrained')
  const [gameTypeInput, setGameTypeInput] = useState<GameType>('extensive_form')
  const [gameActorLabelInput, setGameActorLabelInput] = useState<string>(DEFAULT_GAME_ACTOR_LABEL)
  const [gameActorTypeInput, setGameActorTypeInput] = useState<ActorType>(DEFAULT_GAME_ACTOR_TYPE)
  const [gameObjectiveLabelInput, setGameObjectiveLabelInput] = useState<string>(
    DEFAULT_GAME_OBJECTIVE_LABEL,
  )
  const [gameObjectiveWeightInput, setGameObjectiveWeightInput] =
    useState<string>(DEFAULT_GAME_OBJECTIVE_WEIGHT)
  const [gameActionLabelInput, setGameActionLabelInput] = useState<string>(DEFAULT_GAME_ACTION_LABEL)
  const [gameActionCategoryInput, setGameActionCategoryInput] =
    useState<ActionCategory>(DEFAULT_GAME_ACTION_CATEGORY)
  const [gameNodeLabelInput, setGameNodeLabelInput] = useState<string>(DEFAULT_GAME_NODE_LABEL)
  const [gameNodeTypeInput, setGameNodeTypeInput] =
    useState<ScenarioTreeNodeType>(DEFAULT_GAME_NODE_TYPE)
  const [gameSolverMethodInput, setGameSolverMethodInput] =
    useState<SolverMethod>(DEFAULT_GAME_SOLVER_METHOD)
  const [gameSolverSeedInput, setGameSolverSeedInput] = useState<string>(DEFAULT_GAME_SOLVER_SEED)
  const [gameMonteCarloSamplesInput, setGameMonteCarloSamplesInput] =
    useState<string>(DEFAULT_GAME_MONTE_CARLO_SAMPLES)
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
  const [compareArtifact, setCompareArtifact] = useState<CompareArtifact | null>(null)
  const [briefingBundleArtifact, setBriefingBundleArtifact] = useState<BriefingBundle | null>(null)
  const [briefingArtifact, setBriefingArtifact] = useState<BriefingArtifactPreview | null>(null)
  const [hydrated, setHydrated] = useState<boolean>(false)
  const [stateFeedback, setStateFeedback] = useState<StateChangeFeedback>(() =>
    describeStateChangeFeedback('Shell ready', 0),
  )
  const [mapRuntimeTelemetry, setMapRuntimeTelemetry] = useState<MapRuntimeTelemetry>(
    DEFAULT_MAP_RUNTIME_TELEMETRY,
  )
  const lastSavedFingerprint = useRef<string>('')
  const contextPersistenceVersionRef = useRef<number>(0)
  const runtimeSmokeStarted = useRef<boolean>(false)
  const runtimeSmokeStartMs = useRef<number>(performance.now())
  const runtimeSmokeStateRef = useRef({
    mode: 'offline' as UiMode,
    selectedBundleId: '',
    selectedBundle: null as BundleManifest | null,
    bundles: [] as BundleManifest[],
    activeLayers: [] as string[],
    toggleableLayerCatalog: [] as LayerCatalogEntry[],
    offline: false,
    status: '',
    integrityState: '',
    degradedBudgetCount: 0,
    auditEvents: [] as AuditEvent[],
    selectedGovernedDomainId: DEFAULT_GOVERNED_CONTEXT_DOMAIN_ID,
    domainDraft: createDomainDraft(DEFAULT_GOVERNED_CONTEXT_DOMAIN_ID),
    domains: [] as ContextDomain[],
    activeDomainIds: [] as string[],
    correlationAoi: DEFAULT_CORRELATION_AOI,
    contextRecords: [] as ContextRecord[],
    selectedDeviationDomainId: '' as string,
    deviationSnapshot: createDeviationSnapshot(),
    mapDeviationInspectVisible: false,
    mapOsintInspectVisible: false,
    osintInputMode: 'governed_connector' as OsintSourceMode,
    selectedGovernedConnectorId: DEFAULT_GOVERNED_FEED_CONNECTOR_ID as GovernedFeedConnectorId,
    selectedOsintThresholdDomainId: '' as string,
    osintSnapshot: createOsintSnapshot(),
    scenario: createDefaultScenarioSnapshot(),
    mapRuntime: DEFAULT_MAP_RUNTIME_TELEMETRY,
    aiProviderStatus: createBrowserSimulatedAiProviderStatus(),
    latestAiArtifact: null as AiGatewayArtifact | null,
    latestMcpInvocation: null as McpInvocationRecord | null,
  })

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

  const resolvedQueryDomainIds = useMemo(
    () =>
      resolveQueryDomainIds({
        queryContextDomainIds: versionedQuery.contextDomainIds,
        activeDomainIds,
        domains,
      }),
    [activeDomainIds, domains, versionedQuery.contextDomainIds],
  )

  const querySnapshot = useMemo(
    () =>
      buildQueryStateSnapshot({
        definition: versionedQuery,
        result: {
          resultCount: queryResultCount,
          matchedRowIds: queryMatchedRowIds,
        },
        sourceRowCount: querySourceRowCount,
        savedVersions: savedQueryVersions,
        renderLayer: queryRenderLayer,
        savedArtifact: savedQueryArtifact,
      }),
    [
      queryMatchedRowIds,
      queryRenderLayer,
      queryResultCount,
      querySourceRowCount,
      savedQueryArtifact,
      savedQueryVersions,
      versionedQuery,
    ],
  )
  const contextQueryRange = useMemo(
    () =>
      buildContextTimeRange({
        startHour: versionedQuery.timeWindow.startHour,
        endHour: versionedQuery.timeWindow.endHour,
        anchorDay: DEFAULT_CONTEXT_ANCHOR_DAY,
      }),
    [versionedQuery.timeWindow.endHour, versionedQuery.timeWindow.startHour],
  )
  const correlationLinks = useMemo(
    () =>
      buildCorrelationLinks({
        domains,
        activeDomainIds,
        correlationAoi,
        timeRange: contextQueryRange,
      }),
    [activeDomainIds, contextQueryRange, correlationAoi, domains],
  )
  const visibleContextRecords = useMemo(
    () =>
      correlationLinks.flatMap((link) =>
        queryContextRecords({
          records: contextRecords,
          domainId: link.domain_id,
          targetId: link.target_id,
          timeRange: link.time_range,
        }),
      ),
    [contextRecords, correlationLinks],
  )

  useEffect(() => {
    let cancelled = false

    const syncQueryRows = async () => {
      if (!hydrated) {
        return
      }

      if (!versionedQuery.aoi || resolvedQueryDomainIds.length === 0) {
        if (!cancelled) {
          setQueryRows([])
          setQueryResultCount(0)
          setQueryMatchedRowIds([])
          setQuerySourceRowCount(0)
          setQuerySourceSummary(DEFAULT_QUERY_SOURCE_SUMMARY)
          setQueryExecutionSummary(DEFAULT_QUERY_EXECUTION_SUMMARY)
        }
        return
      }

      const localRecords = buildLocalQuerySourceRecords({
        records: contextRecords,
        domainIds: resolvedQueryDomainIds,
        targetId: versionedQuery.aoi,
        timeRange: contextQueryRange,
      })

      try {
        const authoritativeResult = await backend.queryContextRecords({
          domainIds: resolvedQueryDomainIds,
          targetId: versionedQuery.aoi,
          timeRange: contextQueryRange,
          limit: 500,
        })
        if (cancelled) {
          return
        }

        const governedSource = buildGovernedQuerySource({
          authoritativeResult,
          localRecords,
          domains,
          domainIds: resolvedQueryDomainIds,
        })
        setQueryRows(governedSource.rows)
        setQuerySourceRowCount(governedSource.sourceRowCount)
        setQuerySourceSummary(describeGovernedQuerySource(governedSource))
      } catch (error) {
        if (cancelled) {
          return
        }

        const governedSource = buildGovernedQuerySource({
          localRecords,
          domains,
          domainIds: resolvedQueryDomainIds,
        })
        setQueryRows(governedSource.rows)
        setQuerySourceRowCount(governedSource.sourceRowCount)
        setQuerySourceSummary(
          governedSource.source === 'none'
            ? DEFAULT_QUERY_SOURCE_SUMMARY
            : `${describeGovernedQuerySource(governedSource)} | Backend sync unavailable: ${String(error)}`,
        )
      }
    }

    void syncQueryRows()
    return () => {
      cancelled = true
    }
  }, [
    contextQueryRange,
    contextRecords,
    domains,
    hydrated,
    resolvedQueryDomainIds,
    versionedQuery.aoi,
  ])
  const contextAvailabilitySummaries = useMemo(
    () =>
      domains
        .filter((domain) => activeDomainIds.includes(domain.domain_id))
        .map((domain) =>
          summarizeContextAvailability({
            domain,
            visibleRecords: visibleContextRecords.filter(
              (record) => record.domain_id === domain.domain_id,
            ),
            offline,
          }),
        ),
    [activeDomainIds, domains, offline, visibleContextRecords],
  )

  const contextSnapshot = useMemo(
    () =>
      buildContextSnapshot({
        domains,
        activeDomainIds,
        correlationAoi,
        correlationLinks,
        records: visibleContextRecords,
        queryRange: contextQueryRange,
      }),
    [activeDomainIds, contextQueryRange, correlationAoi, correlationLinks, domains, visibleContextRecords],
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
  const contextOverlaySummaries = useMemo(
    () => buildContextOverlaySummaries(domains, activeDomainIds, compareDashboard),
    [activeDomainIds, compareDashboard, domains],
  )
  const selectedBundle = useMemo(
    () => bundles.find((bundle) => bundle.bundle_id === selectedBundleId),
    [bundles, selectedBundleId],
  )
  const activeCompareBundleId = (selectedBundle?.supersedes_bundle_id ?? selectedBundleId) || undefined
  const compareArtifactDraft = useMemo(
    () =>
      buildCompareArtifact({
        bundleId: activeCompareBundleId,
        marking,
        dashboard: compareDashboard,
        overlaySummaries: contextOverlaySummaries,
        offline,
        generatedAt: 'pending',
      }),
    [activeCompareBundleId, compareDashboard, contextOverlaySummaries, marking, offline],
  )
  const briefingBundleDraft = useMemo(
    () =>
      buildBriefingBundle({
        bundleId: activeCompareBundleId,
        marking,
        dashboard: compareDashboard,
        overlaySummaries: contextOverlaySummaries,
        compareArtifact: compareArtifactDraft,
        offline,
        generatedAt: 'pending',
      }),
    [activeCompareBundleId, compareArtifactDraft, compareDashboard, contextOverlaySummaries, marking, offline],
  )
  const compareSnapshot = useMemo<CompareStateSnapshot>(
    () => ({
      baselineWindow,
      eventWindow,
      baselineSeries,
      eventSeries,
      compareArtifact: compareArtifact ?? undefined,
      briefingArtifact: briefingArtifact ?? undefined,
      briefingBundle: briefingBundleArtifact ?? undefined,
    }),
    [
      baselineSeries,
      baselineWindow,
      briefingArtifact,
      briefingBundleArtifact,
      compareArtifact,
      eventSeries,
      eventWindow,
    ],
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

  const selectedDeviationDomainKey = selectedDeviationDomainId || activeDomainIds[0] || ''
  const selectedDeviationDomain = useMemo(
    () => domains.find((domain) => domain.domain_id === selectedDeviationDomainKey),
    [domains, selectedDeviationDomainKey],
  )
  const selectedDeviationRecords = useMemo(
    () =>
      contextRecords
        .filter(
          (record) =>
            record.domain_id === selectedDeviationDomain?.domain_id &&
            record.target_id === correlationAoi,
        )
        .sort((left, right) => left.observed_at.localeCompare(right.observed_at)),
    [contextRecords, correlationAoi, selectedDeviationDomain?.domain_id],
  )
  const governedDeviationType = selectedDeviationDomain
    ? deviationTypeForDomain(selectedDeviationDomain)
    : deviationType
  const governedDeviationWindow = useMemo(
    () =>
      selectHistoricalDeviationWindow({
        records: selectedDeviationRecords,
        baselinePointCount: deviationBaselinePointCount,
        observedPointCount: deviationObservedPointCount,
      }),
    [selectedDeviationRecords, deviationBaselinePointCount, deviationObservedPointCount],
  )
  const governedDeviationPreview = useMemo(
    () => buildDeviationWindowPreview(governedDeviationWindow),
    [governedDeviationWindow],
  )
  const constraintNodeDomains = useMemo(
    () => domains.filter((domain) => domain.presentation_type === 'constraint_node'),
    [domains],
  )
  const deviationStateForRecorder = useMemo(
    () => ({
      ...deviationSnapshot,
      selectedDomainId: selectedDeviationDomainKey || undefined,
      inputMode: deviationInputMode,
      baselinePointCount: deviationBaselinePointCount,
      observedPointCount: deviationObservedPointCount,
      threshold: deviationThreshold,
      deviationType: deviationInputMode === 'manual_override' ? deviationType : governedDeviationType,
      manualBaselineInput: deviationBaselineInput,
      manualObservedInput: deviationObservedInput,
    }),
    [
      deviationBaselineInput,
      deviationBaselinePointCount,
      deviationInputMode,
      deviationObservedInput,
      deviationObservedPointCount,
      deviationSnapshot,
      deviationThreshold,
      deviationType,
      governedDeviationType,
      selectedDeviationDomainKey,
    ],
  )
  const deviationEvent = useMemo(
    () => {
      if (!selectedDeviationDomain) {
        return null
      }

      if (deviationInputMode === 'manual_override') {
        return detectDeviation(
          parseNumericSeries(deviationBaselineInput).map((value, index) => ({
            ts: `manual-baseline-${index}`,
            value,
          })),
          parseNumericSeries(deviationObservedInput).map((value, index) => ({
            ts: `manual-observed-${index}`,
            value,
          })),
          deviationThreshold,
          deviationType,
          {
            domainId: selectedDeviationDomain.domain_id,
            domainName: selectedDeviationDomain.domain_name,
            targetId: correlationAoi,
            confidenceBaseline: selectedDeviationDomain.confidence_baseline,
            sourceMode: 'manual_override',
          },
        )
      }

      return detectDeviationFromRecords({
        domain: selectedDeviationDomain,
        records: selectedDeviationRecords,
        targetId: correlationAoi,
        threshold: deviationThreshold,
        deviationType: governedDeviationType,
        baselinePointCount: deviationBaselinePointCount,
        observedPointCount: deviationObservedPointCount,
      })
    },
    [
      correlationAoi,
      deviationBaselineInput,
      deviationBaselinePointCount,
      deviationInputMode,
      deviationObservedInput,
      deviationObservedPointCount,
      deviationThreshold,
      deviationType,
      governedDeviationType,
      selectedDeviationRecords,
      selectedDeviationDomain,
    ],
  )

  const selectedOsintThresholdDomainKey = selectedOsintThresholdDomainId || activeDomainIds[0] || ''
  const selectedOsintThresholdDomain = useMemo(
    () => domains.find((domain) => domain.domain_id === selectedOsintThresholdDomainKey),
    [domains, selectedOsintThresholdDomainKey],
  )
  const selectedGovernedConnector = useMemo(
    () =>
      getGovernedFeedConnectorTemplate(
        selectedGovernedConnectorId as GovernedFeedConnectorId,
      ),
    [selectedGovernedConnectorId],
  )
  const osintSummary = useMemo(
    () =>
      aggregateAlerts(osintSnapshot.events, osintAoi, osintSnapshot.thresholdRefs, {
        sourceMode: osintSnapshot.sourceMode,
        connectorId: osintSnapshot.selectedConnectorId,
        connectorLabel: osintSnapshot.latestConnectorRun?.connector_label,
        sourceEventIds: osintSnapshot.events
          .filter((entry) => entry.aoi === osintAoi)
          .map((entry) => entry.event_id),
        deviationEventId: osintSnapshot.latestConnectorRun?.deviation_event_id,
      }),
    [
      osintAoi,
      osintSnapshot.events,
      osintSnapshot.latestConnectorRun?.connector_label,
      osintSnapshot.latestConnectorRun?.deviation_event_id,
      osintSnapshot.selectedConnectorId,
      osintSnapshot.sourceMode,
      osintSnapshot.thresholdRefs,
    ],
  )
  const osintStateForRecorder = useMemo(
    () => ({
      ...osintSnapshot,
      selectedAoi: osintAoi,
      sourceMode: osintInputMode,
      selectedConnectorId: selectedGovernedConnectorId as GovernedFeedConnectorId,
      selectedThresholdDomainId: selectedOsintThresholdDomainKey || undefined,
      latestAlert: osintSummary,
    }),
    [
      osintAoi,
      osintInputMode,
      osintSnapshot,
      osintSummary,
      selectedGovernedConnectorId,
      selectedOsintThresholdDomainKey,
    ],
  )
  const selectedGameScenarioId = gameModelSnapshot.selected_scenario_id ?? scenario.selectedScenarioId
  const gameModelStateForRecorder = useMemo(() => {
    const base = normalizeGameModelSnapshot(gameModelSnapshot)
    return {
      ...base,
      model: {
        ...base.model,
        name: gameNameInput.trim() || base.model.name,
        game_type: gameTypeInput,
        bundle_refs: selectedBundleId ? [selectedBundleId] : base.model.bundle_refs,
      },
      selected_scenario_id: selectedGameScenarioId || undefined,
    }
  }, [gameModelSnapshot, gameNameInput, gameTypeInput, selectedBundleId, selectedGameScenarioId])

  const gameModelValid = useMemo(
    () => validateGameModel(gameModelStateForRecorder.model),
    [gameModelStateForRecorder],
  )

  const payoffProxy = useMemo(
    () =>
      gameModelStateForRecorder.latest_payoff_proxies[0] ??
      buildPayoffProxy('throughput_resilience', 100, 15),
    [gameModelStateForRecorder.latest_payoff_proxies],
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
  const mapRuntimeScene = useMemo(
    () =>
      buildMapRuntimeScene({
        mode,
        offline,
        replayCursor,
        activeLayers,
        visibleLayerCatalog,
        mainCanvasCatalog,
        rightPanelCatalog,
        dashboardCatalog,
        versionedQuery,
        queryRenderLayer,
        contextDomains: domains,
        activeDomainIds,
        correlationAoi,
        contextRecords: visibleContextRecords,
        correlationLinks,
        compareDashboard,
        contextOverlaySummaries,
        collaboration,
        selectedScenario,
        scenarioComparison,
        latestAiArtifact,
        latestDeviationEvent: deviationEvent ?? deviationSnapshot.latestEvent,
        osintSummary,
        osintEvents: osintSnapshot.events,
        osintAoi,
        gameModelSnapshot: gameModelStateForRecorder,
        payoffProxy,
      }),
    [
      activeDomainIds,
      activeLayers,
      collaboration,
      compareDashboard,
      contextOverlaySummaries,
      correlationAoi,
      correlationLinks,
      dashboardCatalog,
      deviationEvent,
      deviationSnapshot.latestEvent,
      domains,
      gameModelStateForRecorder,
      latestAiArtifact,
      mainCanvasCatalog,
      mode,
      offline,
      osintAoi,
      osintSnapshot.events,
      osintSummary,
      payoffProxy,
      queryRenderLayer,
      replayCursor,
      rightPanelCatalog,
      scenarioComparison,
      selectedScenario,
      versionedQuery,
      visibleContextRecords,
      visibleLayerCatalog,
    ],
  )
  runtimeSmokeStateRef.current = {
    mode,
    selectedBundleId,
    selectedBundle: selectedBundle ?? null,
    bundles,
    activeLayers,
    toggleableLayerCatalog,
    offline,
    status,
    integrityState,
    degradedBudgetCount,
    auditEvents,
    selectedGovernedDomainId,
    domainDraft,
    domains,
    activeDomainIds,
    correlationAoi,
    contextRecords,
    selectedDeviationDomainId,
    deviationSnapshot,
    mapDeviationInspectVisible: mapRuntimeScene.signals.features.some(
      (feature) => feature.properties.category === 'deviation',
    ),
    mapOsintInspectVisible: mapRuntimeScene.signals.features.some(
      (feature) => feature.properties.category === 'osint',
    ),
    osintInputMode,
    selectedGovernedConnectorId: selectedGovernedConnectorId as GovernedFeedConnectorId,
    selectedOsintThresholdDomainId,
    osintSnapshot: osintStateForRecorder,
    scenario,
    mapRuntime: mapRuntimeTelemetry,
    aiProviderStatus,
    latestAiArtifact: latestAiArtifact ?? null,
    latestMcpInvocation: latestMcpInvocation ?? null,
  }

  const recorderStateCore = useMemo(
    () => ({
      workspace: workspaceSnapshot,
      query: querySnapshot,
      context: contextSnapshot,
      compare: compareSnapshot,
      collaboration,
      scenario,
      ai: aiSnapshot,
      deviation: deviationStateForRecorder,
      osint: osintStateForRecorder,
      gameModel: gameModelStateForRecorder,
      selectedBundleId: selectedBundleId || undefined,
    }),
    [
      aiSnapshot,
      collaboration,
      compareSnapshot,
      contextSnapshot,
      deviationStateForRecorder,
      gameModelStateForRecorder,
      osintStateForRecorder,
      querySnapshot,
      scenario,
      selectedBundleId,
      workspaceSnapshot,
    ],
  )

  const applyRecorderState = (state: RecorderState, openedBundleId?: string): void => {
    contextPersistenceVersionRef.current += 1
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
    const deviationState = normalizeDeviationSnapshot(state.deviation)
    const osintState = normalizeOsintSnapshot(state.osint)
    const gameModelState = normalizeGameModelSnapshot(state.gameModel)
    const restoredQueryDefinition = normalizeVersionedQuery(query.definition)
    const restoredDomains = normalizeDomains(context.domains)
    const restoredActiveDomainIds = normalizeStringArray(context.activeDomainIds).filter((domainId) =>
      restoredDomains.some((domain) => domain.domain_id === domainId),
    )
    const restoredContextRecords = normalizeContextRecords(context.records)
    const restoredCorrelationLinks = normalizeCorrelationLinks(context.correlationLinks)
    const restoredCorrelationAoi =
      typeof context.correlationAoi === 'string'
        ? context.correlationAoi
        : restoredCorrelationLinks[0]?.target_id ?? DEFAULT_CORRELATION_AOI

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
      setQueryRows([])
      setQueryResultCount(normalizeNumber(query.resultCount, 0))
      setQueryMatchedRowIds(normalizeNumberArray(query.matchedRowIds))
      setQuerySourceRowCount(normalizeNumber(query.sourceRowCount, 0))
      setQuerySourceSummary(
        normalizeNumber(query.sourceRowCount, 0) > 0
          ? `Query source: restored snapshot with ${normalizeNumber(query.sourceRowCount, 0)} source row(s); governed refresh pending.`
          : DEFAULT_QUERY_SOURCE_SUMMARY,
      )
      setQueryExecutionSummary(
        normalizeNumber(query.resultCount, 0) > 0
          ? 'Execution: restored snapshot; rerun for fresh DuckDB materialization.'
          : DEFAULT_QUERY_EXECUTION_SUMMARY,
      )
      setQueryRenderLayer(normalizeQueryRenderLayer(query.renderLayer))
      setSavedQueryArtifact(normalizeSavedQueryArtifact(query.savedArtifact))
      setDeploymentProfileId(aiState.deploymentProfile)
      setLatestAiArtifact(aiState.latestAnalysis)
      setLatestMcpInvocation(aiState.latestMcpInvocation)
      setAiSummary(aiState.latestAnalysis?.content ?? '')
      setSelectedMcpTool(DEFAULT_MCP_TOOL)
      setDeviationSnapshot(deviationState)
      setSelectedDeviationDomainId(deviationState.selectedDomainId ?? '')
      setDeviationInputMode(deviationState.inputMode)
      setDeviationBaselinePointCount(deviationState.baselinePointCount)
      setDeviationObservedPointCount(deviationState.observedPointCount)
      setDeviationThreshold(deviationState.threshold)
      setDeviationType(deviationState.deviationType)
      setDeviationBaselineInput(deviationState.manualBaselineInput)
      setDeviationObservedInput(deviationState.manualObservedInput)
      setOsintSnapshot(osintState)
      setOsintAoi(osintState.selectedAoi)
      setOsintInputMode(osintState.sourceMode)
      setSelectedGovernedConnectorId(
        osintState.selectedConnectorId ?? DEFAULT_GOVERNED_FEED_CONNECTOR_ID,
      )
      setSelectedOsintThresholdDomainId(osintState.selectedThresholdDomainId ?? '')
      setOsintSource(osintState.events.at(-1)?.source ?? CURATED_OSINT_SOURCES[0])
      setOsintVerification(osintState.events.at(-1)?.verification ?? 'reported')
      setOsintCategory(osintState.events.at(-1)?.category ?? DEFAULT_OSINT_CATEGORY)
      setOsintSummaryInput(osintState.events.at(-1)?.summary ?? DEFAULT_OSINT_SUMMARY)
      setOsintThresholdComparator(
        osintState.thresholdRefs.at(-1)?.comparator ?? DEFAULT_OSINT_THRESHOLD_COMPARATOR,
      )
      setOsintThresholdValueInput(
        osintState.thresholdRefs.at(-1)
          ? String(osintState.thresholdRefs.at(-1)?.threshold_value ?? DEFAULT_OSINT_THRESHOLD_VALUE)
          : DEFAULT_OSINT_THRESHOLD_VALUE,
      )
      setGameModelSnapshot(gameModelState)
      setGameNameInput(gameModelState.model.name)
      setGameAssumptionInput(gameModelState.model.assumptions.at(-1) ?? 'Supply remains constrained')
      setGameTypeInput(gameModelState.model.game_type)
      setGameActorLabelInput(gameModelState.model.actors.at(-1)?.label ?? DEFAULT_GAME_ACTOR_LABEL)
      setGameActorTypeInput(gameModelState.model.actors.at(-1)?.actor_type ?? DEFAULT_GAME_ACTOR_TYPE)
      setGameObjectiveLabelInput(
        gameModelState.model.objectives.at(-1)?.label ?? DEFAULT_GAME_OBJECTIVE_LABEL,
      )
      setGameObjectiveWeightInput(
        gameModelState.model.objectives.at(-1)
          ? String(gameModelState.model.objectives.at(-1)?.weight ?? DEFAULT_GAME_OBJECTIVE_WEIGHT)
          : DEFAULT_GAME_OBJECTIVE_WEIGHT,
      )
      setGameActionLabelInput(
        gameModelState.model.actions.at(-1)?.label ?? DEFAULT_GAME_ACTION_LABEL,
      )
      setGameActionCategoryInput(
        gameModelState.model.actions.at(-1)?.category ?? DEFAULT_GAME_ACTION_CATEGORY,
      )
      setGameNodeLabelInput(gameModelState.scenario_tree.nodes.at(-1)?.label ?? DEFAULT_GAME_NODE_LABEL)
      setGameNodeTypeInput(
        gameModelState.scenario_tree.nodes.at(-1)?.node_type ?? DEFAULT_GAME_NODE_TYPE,
      )
      setGameSolverMethodInput(gameModelState.model.solver_config.method)
      setGameSolverSeedInput(String(gameModelState.model.solver_config.random_seed))
      setGameMonteCarloSamplesInput(String(gameModelState.model.solver_config.monte_carlo_samples))
      setDomains(restoredDomains)
      setActiveDomainIds(restoredActiveDomainIds)
      setCorrelationAoi(restoredCorrelationAoi)
      setContextRecords(restoredContextRecords)
      const restoredGovernedDomainId =
        restoredDomains.find((domain) => Boolean(getGovernedDomainTemplate(domain.domain_id)))?.domain_id ??
        DEFAULT_GOVERNED_CONTEXT_DOMAIN_ID
      setSelectedGovernedDomainId(restoredGovernedDomainId)
      setDomainDraft(createDomainDraft(restoredGovernedDomainId))
      setCompareArtifact(compare?.compareArtifact ?? null)
      setBriefingBundleArtifact(compare?.briefingBundle ?? null)
      setBriefingArtifact(compare?.briefingArtifact ?? null)
      setSelectedBundleId(
        openedBundleId ??
          (typeof state.selectedBundleId === 'string' ? state.selectedBundleId : ''),
      )
    })
  }

  const applyContextSnapshot = (snapshot: ContextSnapshot): void => {
    const restoredDomains = normalizeDomains(snapshot.domains)
    const restoredActiveDomainIds = normalizeStringArray(snapshot.activeDomainIds).filter((domainId) =>
      restoredDomains.some((domain) => domain.domain_id === domainId),
    )
    const restoredContextRecords = normalizeContextRecords(snapshot.records)
    const restoredCorrelationLinks = normalizeCorrelationLinks(snapshot.correlationLinks)
    const restoredCorrelationAoi =
      typeof snapshot.correlationAoi === 'string'
        ? snapshot.correlationAoi
        : restoredCorrelationLinks[0]?.target_id ?? DEFAULT_CORRELATION_AOI

    startTransition(() => {
      setDomains(restoredDomains)
      setActiveDomainIds(restoredActiveDomainIds)
      setCorrelationAoi(restoredCorrelationAoi)
      setContextRecords(restoredContextRecords)
    })
  }

  const applySavedContextState = (state: RecorderState, requestVersion: number): void => {
    if (requestVersion !== contextPersistenceVersionRef.current) {
      return
    }
    const context = isRecord(state.context) ? state.context : ({} as Record<string, unknown>)
    applyContextSnapshot({
      domains: normalizeDomains(context.domains),
      activeDomainIds: normalizeStringArray(context.activeDomainIds),
      correlationAoi:
        typeof context.correlationAoi === 'string'
          ? context.correlationAoi
          : DEFAULT_CORRELATION_AOI,
      correlationLinks: normalizeCorrelationLinks(context.correlationLinks),
      records: normalizeContextRecords(context.records),
      queryRange: normalizeContextTimeRange(context.queryRange),
    })
    lastSavedFingerprint.current = recorderFingerprintFromState(state)
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
        const [bundleList, events, head, persisted, controlPlane, providerStatus] = await Promise.all([
          backend.listBundles(),
          backend.listAuditEvents(),
          backend.getAuditHead(),
          backend.loadRecorderState(),
          backend.getControlPlaneState(),
          backend.getAiGatewayProviderStatus().catch((error) =>
            createUnavailableAiProviderStatus(
              `Failed to inspect governed AI provider status: ${String(error)}`,
            ),
          ),
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
            deviation: persisted.state.deviation,
            osint: persisted.state.osint,
            gameModel: persisted.state.gameModel,
            selectedBundleId: persisted.state.selectedBundleId,
          })
          setStatus('Recorder state restored')
        } else {
          setDeploymentProfileId(controlPlane.activeDeploymentProfileId)
        }
        setAiProviderStatus(providerStatus)
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
            deviation: savedState.deviation,
            osint: savedState.osint,
            gameModel: savedState.gameModel,
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
    if (!briefingArtifact && !compareArtifact && !briefingBundleArtifact) {
      return
    }

    const compareOutOfDate =
      compareArtifact?.exportFingerprint &&
      compareArtifact.exportFingerprint !== compareArtifactDraft.exportFingerprint
    const briefingOutOfDate =
      briefingArtifact?.exportFingerprint &&
      briefingArtifact.exportFingerprint !== briefingBundleDraft.exportFingerprint

    if (!compareOutOfDate && !briefingOutOfDate) {
      return
    }

    setCompareArtifact(null)
    setBriefingBundleArtifact(null)
    setBriefingArtifact(null)
  }, [
    activeDomainIds,
    baselineInput,
    baselineWindowLabel,
    briefingArtifact,
    briefingBundleArtifact,
    briefingBundleDraft.exportFingerprint,
    compareArtifact,
    compareArtifactDraft.exportFingerprint,
    domains,
    eventInput,
    eventWindowLabel,
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
        deviation: result.state.deviation,
        osint: result.state.osint,
        gameModel: result.state.gameModel,
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
    setQueryResultCount(0)
    setQueryMatchedRowIds([])
    setQueryRenderLayer(undefined)
    setSavedQueryArtifact(undefined)
    setQueryExecutionSummary(DEFAULT_QUERY_EXECUTION_SUMMARY)
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

  const onRunVersionedQuery = async () => {
    const startedAt = beginMeasuredAction('Query run and render')
    if (querySourceRowCount === 0) {
      setQueryResultCount(0)
      setQueryMatchedRowIds([])
      setQueryRenderLayer(undefined)
      setSavedQueryArtifact(undefined)
      setStatus(querySourceSummary)
      setQueryExecutionSummary(DEFAULT_QUERY_EXECUTION_SUMMARY)
      appendQueryAudit('query.run_blocked', {
        query_id: versionedQuery.queryId,
        version: versionedQuery.version,
        source_row_count: querySourceRowCount,
        resolved_domain_ids: resolvedQueryDomainIds,
      })
      completeMeasuredAction('Query run and render', startedAt)
      return
    }

    try {
      setBusy(true)
      setStatus('Running governed DuckDB query...')

      const execution = await executeQuery(versionedQuery, queryRows)
      const renderLayer = buildQueryRenderLayerFromMatches(versionedQuery, {
        resultCount: execution.resultCount,
        matchedRowIds: execution.matchedRowIds,
      })

      setQueryResultCount(execution.resultCount)
      setQueryMatchedRowIds(execution.matchedRowIds)
      setQueryRenderLayer(renderLayer)
      setSavedQueryArtifact(undefined)
      setQueryExecutionSummary(
        `${execution.summary} | SQL fingerprint ${execution.sqlFingerprint}`,
      )
      setStatus(renderLayer.summary)
      appendQueryAudit('query.run', {
        query_id: versionedQuery.queryId,
        version: versionedQuery.version,
        result_count: execution.resultCount,
        matched_row_ids: execution.matchedRowIds,
        context_domain_ids: versionedQuery.contextDomainIds,
        resolved_domain_ids: resolvedQueryDomainIds,
        source_row_count: querySourceRowCount,
        query_source: querySourceSummary,
        query_engine: execution.engine,
        query_runtime: execution.runtime,
        query_sql_fingerprint: execution.sqlFingerprint,
        predicate_count: execution.predicateCount,
      })
    } finally {
      setBusy(false)
      completeMeasuredAction('Query run and render', startedAt)
    }
  }

  const onSaveQueryVersion = () => {
    const startedAt = beginMeasuredAction('Query version save')
    if (!queryRenderLayer || querySourceRowCount === 0) {
      setStatus('Run a governed query before saving a version.')
      completeMeasuredAction('Query version save', startedAt)
      return
    }

    const savedAt = new Date().toISOString()
    const next = bumpQueryVersion(versionedQuery, { savedAt })
    const renderLayer = buildQueryRenderLayerFromMatches(next, {
      resultCount: queryResultCount,
      matchedRowIds: queryMatchedRowIds,
    })
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
      source_row_count: querySourceRowCount,
      query_source: querySourceSummary,
      query_execution: queryExecutionSummary,
    })
    completeMeasuredAction('Query version save', startedAt)
  }

  const onPrepareBriefingArtifact = async () => {
    if (!selectedBundleId) {
      setStatus('Select or create a bundle before preparing a briefing artifact.')
      return
    }

    const sourceBundleId = selectedBundleId
    const startedAt = beginMeasuredAction('Briefing artifact preparation')
    setBusy(true)
    const generatedAt = new Date().toISOString()
    const nextCompareArtifact = buildCompareArtifact({
      bundleId: sourceBundleId,
      marking,
      dashboard: compareDashboard,
      overlaySummaries: contextOverlaySummaries,
      offline,
      generatedAt,
    })
    const nextBriefingBundle = buildBriefingBundle({
      bundleId: sourceBundleId,
      marking,
      dashboard: compareDashboard,
      overlaySummaries: contextOverlaySummaries,
      compareArtifact: nextCompareArtifact,
      offline,
      generatedAt,
    })
    const artifact = buildBriefingArtifactPreview({
      bundleId: sourceBundleId,
      marking,
      dashboard: compareDashboard,
      compareArtifact: nextCompareArtifact,
      briefingBundle: nextBriefingBundle,
      offline,
    })

    try {
      const exportManifest = await backend.createBundle({
        role,
        marking,
        state: {
          ...recorderStateCore,
          compare: buildCompareStateSnapshot({
            baselineWindow,
            eventWindow,
            baselineSeries,
            eventSeries,
            compareArtifact: nextCompareArtifact,
            briefingArtifact: artifact,
            briefingBundle: nextBriefingBundle,
          }),
          selectedBundleId: sourceBundleId,
          savedAt: generatedAt,
        },
        provenance_refs: [
          {
            source: 'briefing.export',
            license: 'internal',
            retrievedAt: generatedAt,
            pipelineVersion: 'i2-003',
          },
        ],
        supersedes_bundle_id: sourceBundleId,
      })

      setCompareArtifact(nextCompareArtifact)
      setBriefingBundleArtifact(nextBriefingBundle)
      setBriefingArtifact(artifact)
      setIntegrityState(
        `Briefing export captured in derived bundle ${exportManifest.bundle_id} (supersedes ${sourceBundleId})`,
      )

      try {
        await backend.appendAudit({
          role,
          event_type: 'briefing.artifact_prepared',
          payload: {
            bundle_id: sourceBundleId,
            export_bundle_id: exportManifest.bundle_id,
            compare_artifact_id: nextCompareArtifact.artifactId,
            compare_focus_aoi_id: nextCompareArtifact.focusAoiId,
            compare_export_fingerprint: nextCompareArtifact.exportFingerprint,
            briefing_bundle_id: nextBriefingBundle.artifactId,
            briefing_export_fingerprint: nextBriefingBundle.exportFingerprint,
            baseline_window: compareDashboard.baselineWindow.label,
            event_window: compareDashboard.eventWindow.label,
            delta_cells: compareDashboard.cells.length,
            context_overlays: contextOverlaySummaries.length,
            supersedes_bundle_id: sourceBundleId,
          },
        })
      } catch {
        // The export bundle has already been captured; keep the workflow usable if audit append is unavailable.
      }

      await refresh()
      setStatus(
        `Briefing export bundle ${exportManifest.bundle_id} captured from snapshot ${sourceBundleId}`,
      )
    } catch (error) {
      setStatus(`Briefing export failed: ${String(error)}`)
    } finally {
      setBusy(false)
      completeMeasuredAction('Briefing artifact preparation', startedAt)
    }
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

  const onSubmitAiSummary = async () => {
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
      const result = await runAiGatewayAnalysis({
        role,
        marking,
        deploymentProfile: deploymentProfileId,
        allowed: aiPolicy.analysisAllowed,
        prompt: aiPrompt,
        refs: aiEvidenceRefs,
      }, {
        providerStatus: aiProviderStatus,
        runProviderAnalysis: (request) => backend.runAiGatewayProviderAnalysis(request),
      })
      setLatestAiArtifact(result)
      setAiSummary(result.content)
      setStatus(`AI gateway produced ${result.artifactId} via ${result.providerLabel ?? 'gateway runtime'}`)
      appendAiAudit('ai.gateway.submit', {
        status: 'allowed',
        bundle_id: selectedBundle.bundle_id,
        deployment_profile: deploymentProfileId,
        artifact_id: result.artifactId,
        marking: result.marking,
        ref_count: result.refs.length,
        citations: result.citations,
        gateway_runtime: result.gatewayRuntime,
        provider_label: result.providerLabel,
        provider_model: result.providerModel,
        provider_request_id: result.requestId,
        degraded: result.degraded ?? false,
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
        provider_runtime: aiProviderStatus.runtime,
        provider_detail: aiProviderStatus.detail,
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
    const domain = resolveGovernedDomainRegistration(domainDraft)
    if (!domain) {
      setStatus('Select an approved governed context domain before registration.')
      return
    }

    const registrationIssues = collectDomainRegistrationErrors(domain)
    if (!validateDomainRegistration(domain)) {
      setStatus(`Context domain registration rejected: ${registrationIssues.join('; ')}`)
      return
    }
    const startedAt = beginMeasuredAction('Context domain registration')
    const ingestedRecords = materializeGovernedContextRecords({
      domain,
      targetId: correlationAoi,
      timeRange: contextQueryRange,
    })
    const nextActiveDomainIds = activeDomainIds.includes(domain.domain_id)
      ? activeDomainIds
      : [domain.domain_id, ...activeDomainIds]
    const nextDomains = [domain, ...domains.filter((entry) => entry.domain_id !== domain.domain_id)]
    const nextLinks = buildCorrelationLinks({
      domains: nextDomains,
      activeDomainIds: nextActiveDomainIds,
      correlationAoi,
      timeRange: contextQueryRange,
    })
    const nextContextRecords = [
      ...contextRecords.filter((record) => record.domain_id !== domain.domain_id),
      ...ingestedRecords,
    ]
    const nextContextSnapshot = buildContextSnapshot({
      domains: nextDomains,
      activeDomainIds: nextActiveDomainIds,
      correlationAoi,
      correlationLinks: nextLinks,
      records: nextContextRecords,
      queryRange: contextQueryRange,
    })
    applyContextSnapshot(nextContextSnapshot)
    const requestVersion = contextPersistenceVersionRef.current + 1
    contextPersistenceVersionRef.current = requestVersion

    void backend
      .saveRecorderState({
        role,
        state: {
          ...recorderStateCore,
          context: nextContextSnapshot,
          savedAt: new Date().toISOString(),
        },
      })
      .then((savedState) => {
        applySavedContextState(savedState, requestVersion)
        setSelectedDeviationDomainId((previous) => previous || domain.domain_id)
        setSelectedOsintThresholdDomainId((previous) => previous || domain.domain_id)
        setDomainDraft(createDomainDraft(selectedGovernedDomainId))
        setStatus(
          `Ingested ${describeGovernedDomainIngestion(domain.domain_id)} for ${correlationAoi}. Correlated context only; not causal evidence.`,
        )
        return backend.appendAudit({
          role,
          event_type: 'context.domain_registered',
          payload: {
            domain_id: domain.domain_id,
            domain_name: domain.domain_name,
            source_url: domain.source_url,
            sensitivity_class: domain.sensitivity_class,
            governed_ingestion_label: describeGovernedDomainIngestion(domain.domain_id),
            correlation_links: nextLinks,
            record_count: ingestedRecords.length,
          },
        })
      })
      .then(() => refresh())
      .then(() => {
        completeMeasuredAction('Context domain registration', startedAt)
      })
      .catch((error) => {
        setStatus(`Context domain registration failed: ${String(error)}`)
        completeMeasuredAction('Context domain registration', startedAt)
      })
  }

  const onToggleDomainSelection = (domainId: string) => {
    const startedAt = beginMeasuredAction('Context selection change')
    const nextActiveDomainIds = activeDomainIds.includes(domainId)
      ? activeDomainIds.filter((existingId) => existingId !== domainId)
      : [...activeDomainIds, domainId]
    const nextLinks = buildCorrelationLinks({
      domains,
      activeDomainIds: nextActiveDomainIds,
      correlationAoi,
      timeRange: contextQueryRange,
    })
    const nextContextSnapshot = buildContextSnapshot({
      domains,
      activeDomainIds: nextActiveDomainIds,
      correlationAoi,
      correlationLinks: nextLinks,
      records: contextRecords,
      queryRange: contextQueryRange,
    })
    applyContextSnapshot(nextContextSnapshot)
    const requestVersion = contextPersistenceVersionRef.current + 1
    contextPersistenceVersionRef.current = requestVersion

    void backend
      .saveRecorderState({
        role,
        state: {
          ...recorderStateCore,
          context: nextContextSnapshot,
          savedAt: new Date().toISOString(),
        },
      })
      .then((savedState) => {
        applySavedContextState(savedState, requestVersion)
        return backend.appendAudit({
          role,
          event_type: 'context.selection_changed',
          payload: {
            active_domain_ids: nextActiveDomainIds,
            correlation_aoi: correlationAoi,
            correlation_links: nextLinks,
          },
        })
      })
      .then(() => refresh())
      .then(() => {
        completeMeasuredAction('Context selection change', startedAt)
      })
      .catch((error) => {
        setStatus(`Context selection change failed: ${String(error)}`)
        completeMeasuredAction('Context selection change', startedAt)
      })
  }

  const onPersistCorrelationSelection = () => {
    const startedAt = beginMeasuredAction('Correlation selection save')
    const nextLinks = buildCorrelationLinks({
      domains,
      activeDomainIds,
      correlationAoi,
      timeRange: contextQueryRange,
    })
    const missingRecords = domains
      .filter((domain) => activeDomainIds.includes(domain.domain_id))
      .filter(
        (domain) =>
          !contextRecords.some(
            (record) => record.domain_id === domain.domain_id && record.target_id === correlationAoi,
          ),
      )
      .flatMap((domain) =>
        materializeGovernedContextRecords({
          domain,
          targetId: correlationAoi,
          timeRange: contextQueryRange,
        }),
      )
    const nextContextRecords =
      missingRecords.length > 0 ? [...contextRecords, ...missingRecords] : contextRecords
    const nextContextSnapshot = buildContextSnapshot({
      domains,
      activeDomainIds,
      correlationAoi,
      correlationLinks: nextLinks,
      records: nextContextRecords,
      queryRange: contextQueryRange,
    })
    applyContextSnapshot(nextContextSnapshot)
    const requestVersion = contextPersistenceVersionRef.current + 1
    contextPersistenceVersionRef.current = requestVersion

    void backend
      .saveRecorderState({
        role,
        state: {
          ...recorderStateCore,
          context: nextContextSnapshot,
          savedAt: new Date().toISOString(),
        },
      })
      .then((savedState) => {
        applySavedContextState(savedState, requestVersion)
        return backend.appendAudit({
          role,
          event_type: 'context.correlation_updated',
          payload: {
            active_domain_ids: activeDomainIds,
            correlation_aoi: correlationAoi,
            correlation_links: nextLinks,
            record_count: visibleContextRecords.length + missingRecords.length,
          },
        })
      })
      .then(() => refresh())
      .then(() => {
        completeMeasuredAction('Correlation selection save', startedAt)
      })
      .catch((error) => {
        setStatus(`Correlation selection update failed: ${String(error)}`)
        completeMeasuredAction('Correlation selection save', startedAt)
      })
  }

  const onLoadDeviationDomainSeries = () => {
    if (!selectedDeviationDomain || !governedDeviationWindow) {
      setStatus(
        'Select an active context domain with enough governed records to derive baseline and observed windows.',
      )
      return
    }

    setDeviationInputMode('governed_series')
    setDeviationBaselineInput(governedDeviationPreview.baselineInput)
    setDeviationObservedInput(governedDeviationPreview.observedInput)
    setDeviationType(governedDeviationType)
    setStatus(
      `Loaded governed windows for ${selectedDeviationDomain.domain_name}: ${governedDeviationWindow.baselineReference}.`,
    )
  }

  const onRecordDeviationEvent = () => {
    const eventToRecord = deviationEvent

    if (!selectedDeviationDomain || !eventToRecord) {
      setStatus(
        deviationInputMode === 'manual_override'
          ? 'Enter manual override series that exceed the threshold before recording a deviation event.'
          : 'Load a governed context window that exceeds the threshold before recording a deviation event.',
      )
      return
    }

    const latestRecord = selectedDeviationRecords.at(-1)
    const suggestion = latestRecord
      ? buildConstraintNodeSuggestion({
          domain: selectedDeviationDomain,
          latestRecord,
          event: eventToRecord,
        })
      : null
    const nextDeviationSnapshot = pushDeviationEvent(
      deviationStateForRecorder,
      eventToRecord,
      suggestion,
    )

    setDeviationSnapshot(nextDeviationSnapshot)
    setStatus(`Recorded ${eventToRecord.taxonomy_key} for ${eventToRecord.domain_name}.`)
    void backend
      .appendAudit({
        role,
        event_type: 'context.deviation_recorded',
        payload: {
          event: eventToRecord,
          suggestion,
        },
      })
      .then(() => refresh())
      .catch(() => {
        setStatus('Deviation event recorded locally; audit append unavailable.')
      })
  }

  const onApplyContextConstraint = (
    domain: ContextDomain,
    suggestion?: ConstraintNodeSuggestion,
  ) => {
    if (!selectedScenario) {
      setStatus('Select or fork a scenario before applying a context constraint node.')
      return
    }

    const latestRecord =
      visibleContextRecords
        .filter((record) => record.domain_id === domain.domain_id && record.target_id === correlationAoi)
        .at(-1) ??
      contextRecords
        .filter((record) => record.domain_id === domain.domain_id)
        .sort((left, right) => left.observed_at.localeCompare(right.observed_at))
        .at(-1)

    if (!suggestion && !latestRecord) {
      setStatus(`No context record is available to apply ${domain.domain_name} to the scenario.`)
      return
    }

    const next = setConstraint(scenario, selectedScenario.scenarioId, {
      constraintId: suggestion?.constraintId ?? domain.domain_id,
      label: suggestion?.label ?? domain.domain_name,
      value: suggestion?.recommendedValue ?? latestRecord!.numeric_value,
      unit: suggestion?.unit ?? latestRecord!.unit,
      rationale:
        suggestion?.rationale ??
        `Applied from correlated context domain ${domain.domain_name}; treat as modeled scenario input.`,
      propagationWeight: suggestion?.propagationWeight ?? 1.25,
      now: new Date().toISOString(),
    })

    setScenario(next)
    appendScenarioAudit('scenario.context_constraint_applied', {
      scenario_id: selectedScenario.scenarioId,
      domain_id: domain.domain_id,
      source_event_id: suggestion?.source_event_id ?? null,
      target_id: suggestion?.target_id ?? latestRecord?.target_id ?? correlationAoi,
    })
    setStatus(`Applied context constraint node ${domain.domain_name} to ${selectedScenario.title}.`)
  }

  const onRunGovernedConnector = () => {
    const thresholdValue = Number(osintThresholdValueInput)
    const execution = executeGovernedFeedConnector({
      snapshot: osintStateForRecorder,
      connectorId: selectedGovernedConnectorId as GovernedFeedConnectorId,
      aoi: osintAoi,
      contextDomains: domains,
      contextRecords,
      thresholdDomain: selectedOsintThresholdDomain,
      thresholdComparator: osintThresholdComparator,
      thresholdValue: Number.isFinite(thresholdValue) ? thresholdValue : undefined,
      latestDeviationEvent: deviationSnapshot.latestEvent,
    })

    if (!execution) {
      setStatus('Select a governed connector before running the aggregate alert runtime.')
      return
    }

    if (execution.events.length === 0) {
      setStatus(execution.statusLine)
      return
    }

    const nextSnapshot = recordGovernedFeedConnector(osintStateForRecorder, execution, osintAoi)

    setOsintInputMode('governed_connector')
    setOsintSnapshot(nextSnapshot)
    setOsintSource(execution.events.at(-1)?.source ?? CURATED_OSINT_SOURCES[0])
    setOsintVerification(execution.events.at(-1)?.verification ?? 'reported')
    setOsintCategory(execution.events.at(-1)?.category ?? DEFAULT_OSINT_CATEGORY)
    setOsintSummaryInput(execution.events.at(-1)?.summary ?? DEFAULT_OSINT_SUMMARY)
    setStatus(execution.statusLine)
    void backend
      .appendAudit({
        role,
        event_type: 'osint.connector_executed',
        payload: {
          connector: execution.connector,
          events: execution.events,
          latest_alert: nextSnapshot.latestAlert,
          latest_connector_run: nextSnapshot.latestConnectorRun,
        },
      })
      .then(() => refresh())
      .catch(() => {
        setStatus('Governed connector executed locally; audit append unavailable.')
      })
  }

  const onAddOsintEvent = () => {
    if (!validateCuratedSource(osintSource)) {
      setStatus(`OSINT source rejected: ${osintSource}`)
      return
    }
    if (!osintSummaryInput.trim()) {
      setStatus('Add a short aggregate OSINT summary before recording an event.')
      return
    }

    const event = buildOsintEvent({
      source: osintSource,
      verification: osintVerification,
      aoi: osintAoi,
      category: osintCategory,
      summary: osintSummaryInput,
      lineage: [`aoi:${osintAoi}`, `category:${osintCategory}`, 'mode:manual_override'],
      sourceMode: 'manual_override',
    })
    const nextSnapshot = pushOsintEvent(
      {
        ...osintStateForRecorder,
        sourceMode: 'manual_override',
        selectedConnectorId: undefined,
        latestConnectorRun: undefined,
      },
      event,
      osintAoi,
    )

    setOsintInputMode('manual_override')
    setOsintSnapshot(nextSnapshot)
    setStatus(`Recorded ${event.source} ${event.verification} OSINT event for ${event.aoi}.`)
    void backend
      .appendAudit({
        role,
        event_type: 'osint.event_added',
        payload: {
          event,
          latest_alert: nextSnapshot.latestAlert,
        },
      })
      .then(() => refresh())
      .catch(() => {
        setStatus('OSINT event recorded locally; audit append unavailable.')
      })
  }

  const onLinkOsintThreshold = () => {
    const thresholdValue = Number(osintThresholdValueInput)
    if (!selectedOsintThresholdDomain || !Number.isFinite(thresholdValue)) {
      setStatus('Select an active context domain and numeric threshold before linking an OSINT alert rule.')
      return
    }

    const latestRecord =
      contextRecords
        .filter(
          (record) =>
            record.domain_id === selectedOsintThresholdDomain.domain_id &&
            record.target_id === osintAoi,
        )
        .sort((left, right) => left.observed_at.localeCompare(right.observed_at))
        .at(-1) ??
      contextRecords
        .filter((record) => record.domain_id === selectedOsintThresholdDomain.domain_id)
        .sort((left, right) => left.observed_at.localeCompare(right.observed_at))
        .at(-1)

    const thresholdRef = buildContextThresholdRef({
      domain: selectedOsintThresholdDomain,
      comparator: osintThresholdComparator,
      thresholdValue,
      unit: latestRecord?.unit ?? 'index',
      referenceNote: `Aggregate-only AOI alert reference for ${osintAoi}; not entity pursuit.`,
    })
    const nextSnapshot = pushContextThresholdRef(osintStateForRecorder, thresholdRef, osintAoi)

    setOsintSnapshot(nextSnapshot)
    setStatus(
      `Linked ${thresholdRef.domain_name} ${thresholdRef.comparator} ${thresholdRef.threshold_value} ${thresholdRef.unit} to OSINT alerts for ${osintAoi}.`,
    )
    void backend
      .appendAudit({
        role,
        event_type: 'osint.threshold_linked',
        payload: {
          threshold_ref: thresholdRef,
          latest_alert: nextSnapshot.latestAlert,
        },
      })
      .then(() => refresh())
      .catch(() => {
        setStatus('OSINT threshold linked locally; audit append unavailable.')
      })
  }

  const onUpdateGameModel = () => {
    const now = new Date().toISOString()
    const renamed = renameGameModel(gameModelStateForRecorder, gameNameInput, now)
    const nextSnapshot = setGameType(renamed, gameTypeInput, now)

    setGameModelSnapshot(nextSnapshot)
    setStatus(`Updated strategic model ${nextSnapshot.model.name} (${nextSnapshot.model.game_type}).`)
    void backend
      .appendAudit({
        role,
        event_type: 'game_model.updated',
        payload: {
          game_id: nextSnapshot.model.game_id,
          version: nextSnapshot.model.version,
          game_type: nextSnapshot.model.game_type,
          bundle_refs: nextSnapshot.model.bundle_refs,
        },
      })
      .then(() => refresh())
      .catch(() => {
        setStatus('Game model updated locally; audit append unavailable.')
      })
  }

  const onAddGameActor = () => {
    if (!gameActorLabelInput.trim()) {
      setStatus('Add a strategic actor label before updating the game model.')
      return
    }

    const nextSnapshot = appendGameActor(gameModelStateForRecorder, {
      label: gameActorLabelInput,
      actor_type: gameActorTypeInput,
    }, new Date().toISOString())

    setGameModelSnapshot(nextSnapshot)
    setStatus(`Added ${gameActorTypeInput} actor ${gameActorLabelInput}.`)
    void backend
      .appendAudit({
        role,
        event_type: 'game_model.actor_added',
        payload: {
          actor: nextSnapshot.model.actors.at(-1),
          game_id: nextSnapshot.model.game_id,
        },
      })
      .then(() => refresh())
      .catch(() => {
        setStatus('Game actor added locally; audit append unavailable.')
      })
  }

  const onAddGameObjective = () => {
    const weight = Number(gameObjectiveWeightInput)
    if (!gameObjectiveLabelInput.trim() || !Number.isFinite(weight) || weight <= 0) {
      setStatus('Add an objective label and positive weight before updating the game model.')
      return
    }

    const nextSnapshot = appendGameObjective(
      gameModelStateForRecorder,
      {
        label: gameObjectiveLabelInput,
        weight,
        definition: `Modeled objective weighting for ${gameObjectiveLabelInput}.`,
      },
      new Date().toISOString(),
    )

    setGameModelSnapshot(nextSnapshot)
    setStatus(`Added game objective ${gameObjectiveLabelInput}.`)
    void backend
      .appendAudit({
        role,
        event_type: 'game_model.objective_added',
        payload: {
          objective: nextSnapshot.model.objectives.at(-1),
          game_id: nextSnapshot.model.game_id,
        },
      })
      .then(() => refresh())
      .catch(() => {
        setStatus('Game objective added locally; audit append unavailable.')
      })
  }

  const onAddGameAction = () => {
    if (!gameActionLabelInput.trim()) {
      setStatus('Add a strategic action label before updating the game model.')
      return
    }

    const nextSnapshot = appendGameAction(
      gameModelStateForRecorder,
      {
        label: gameActionLabelInput,
        category: gameActionCategoryInput,
        description: `Strategic ${gameActionCategoryInput} action for ${gameActionLabelInput}.`,
      },
      new Date().toISOString(),
    )

    setGameModelSnapshot(nextSnapshot)
    setStatus(`Added ${gameActionCategoryInput} action ${gameActionLabelInput}.`)
    void backend
      .appendAudit({
        role,
        event_type: 'game_model.action_added',
        payload: {
          action: nextSnapshot.model.actions.at(-1),
          game_id: nextSnapshot.model.game_id,
        },
      })
      .then(() => refresh())
      .catch(() => {
        setStatus('Game action added locally; audit append unavailable.')
      })
  }

  const onAddGameAssumption = () => {
    if (!gameAssumptionInput.trim()) {
      setStatus('Add a strategic assumption before updating the game model.')
      return
    }

    const nextSnapshot = appendGameAssumption(
      gameModelStateForRecorder,
      gameAssumptionInput,
      new Date().toISOString(),
    )

    setGameModelSnapshot(nextSnapshot)
    setStatus(`Added game assumption: ${gameAssumptionInput}.`)
    void backend
      .appendAudit({
        role,
        event_type: 'game_model.assumption_added',
        payload: {
          assumption: gameAssumptionInput,
          game_id: nextSnapshot.model.game_id,
        },
      })
      .then(() => refresh())
      .catch(() => {
        setStatus('Game assumption added locally; audit append unavailable.')
      })
  }

  const onLinkScenarioTreeNode = () => {
    if (!selectedGameScenarioId) {
      setStatus('Fork or select a scenario before linking a scenario-tree branch.')
      return
    }
    if (!gameNodeLabelInput.trim()) {
      setStatus('Add a branch label before linking a scenario-tree node.')
      return
    }

    const nextSnapshot = appendScenarioTreeNode(
      setSelectedGameScenario(gameModelStateForRecorder, selectedGameScenarioId),
      {
        label: gameNodeLabelInput,
        node_type: gameNodeTypeInput,
        scenario_fork_id: selectedGameScenarioId,
        actor_id: gameModelStateForRecorder.model.actors[0]?.actor_id,
        parent_node_id: gameModelStateForRecorder.scenario_tree.nodes.at(-1)?.node_id,
        chance_note:
          gameNodeTypeInput === 'chance'
            ? `Modeled exogenous shock for ${gameNodeLabelInput}.`
            : undefined,
      },
      new Date().toISOString(),
    )

    setGameModelSnapshot(nextSnapshot)
    setStatus(`Linked ${gameNodeTypeInput} branch ${gameNodeLabelInput} to ${selectedGameScenarioId}.`)
    void backend
      .appendAudit({
        role,
        event_type: 'game_model.branch_linked',
        payload: {
          branch: nextSnapshot.scenario_tree.nodes.at(-1),
          scenario_id: selectedGameScenarioId,
        },
      })
      .then(() => refresh())
      .catch(() => {
        setStatus('Scenario-tree branch linked locally; audit append unavailable.')
      })
  }

  const onRunGameSolver = () => {
    if (!selectedBundleId) {
      setStatus('Create or select a bundle before running a strategic model solve.')
      return
    }

    const solverSeed = Number(gameSolverSeedInput)
    const monteCarloSamples = Number(gameMonteCarloSamplesInput)
    if (!Number.isFinite(solverSeed) || !Number.isFinite(monteCarloSamples) || monteCarloSamples <= 0) {
      setStatus('Provide numeric solver seed and Monte Carlo sample counts before running the model.')
      return
    }

    const linkedScenarioIds = selectedGameScenarioId ? [selectedGameScenarioId] : []
    const nextSnapshot = runGameSolver(
      setSelectedGameScenario(gameModelStateForRecorder, selectedGameScenarioId),
      {
        bundle_refs: [selectedBundleId],
        linked_scenario_ids: linkedScenarioIds,
        context_targets: [
          selectedOsintThresholdDomain?.domain_name ??
            domains[0]?.domain_name ??
            'Port Throughput',
        ],
        solver_config: {
          method: gameSolverMethodInput,
          random_seed: solverSeed,
          monte_carlo_samples: monteCarloSamples,
        },
        executed_at: new Date().toISOString(),
      },
    )

    setGameModelSnapshot(nextSnapshot)
    setStatus(`Strategic solver run ${nextSnapshot.solver_runs.at(-1)?.run_id ?? 'completed'} recorded.`)
    void backend
      .appendAudit({
        role,
        event_type: 'game_model.solver_run',
        payload: {
          solver_run: nextSnapshot.solver_runs.at(-1),
          experiment_bundle: nextSnapshot.experiment_bundle,
        },
      })
      .then(() => refresh())
      .catch(() => {
        setStatus('Strategic solver run recorded locally; audit append unavailable.')
      })
  }

  const runRuntimeSmoke = useEffectEvent(async () => {
    const pause = (ms: number) =>
      new Promise<void>((resolve) => {
        window.setTimeout(resolve, ms)
      })

    const waitForCondition = async (
      label: string,
      predicate: () => boolean,
      timeoutMs = 15000,
    ): Promise<void> => {
      const deadline = performance.now() + timeoutMs
      while (performance.now() < deadline) {
        if (predicate()) {
          return
        }
        await pause(50)
      }
      throw new Error(`Runtime smoke timed out waiting for ${label}`)
    }

    const measure = async (
      label: string,
      action: () => Promise<void> | void,
      budgetMs?: number,
    ): Promise<RuntimeSmokeMetric> => {
      const startedAt = performance.now()
      await action()
      const measuredMs = Math.round(performance.now() - startedAt)
      return {
        label,
        measuredMs,
        budgetMs,
        passed: typeof budgetMs === 'number' ? measuredMs <= budgetMs : undefined,
      }
    }

    const isWpI8RuntimeSmoke = runtimeSmokeConfig.wpId === 'WP-I8-002'
    const isWpI9RuntimeSmoke = runtimeSmokeConfig.wpId === 'WP-I9-002'
    const requiresGovernedDeviationForRuntimeSmoke = isWpI8RuntimeSmoke || isWpI9RuntimeSmoke
    const runtimeSmokeFlow = {
      governedDeviationRecorded: false,
      governedDeviationRestored: false,
      governedConnectorRecorded: false,
      governedConnectorRestored: false,
      governedConnectorId: '' as string,
      restoredConnectorId: '' as string,
      deviationContextConstraintApplied: false,
      deviationConstraintId: '',
    }

    const collectRegionChecks = (): RuntimeSmokeRegionCheck[] =>
      REQUIRED_UI_REGIONS.map((regionId) => ({
        id: regionId,
        present: Boolean(document.querySelector(RUNTIME_SMOKE_REGION_SELECTORS[regionId])),
      }))

    const buildAssertions = (
      regions: RuntimeSmokeRegionCheck[],
      notes: string[],
    ): RuntimeSmokeAssertion[] => {
      const currentState = runtimeSmokeStateRef.current
      const exportCardVisible = Boolean(document.querySelector('[data-testid="scenario-export-card"]'))
      const governedContextDomainId = currentState.activeDomainIds.find((domainId) =>
        Boolean(getGovernedDomainTemplate(domainId)),
      )
      const latestDeviationEvent = currentState.deviationSnapshot.latestEvent
      const latestOsintAlert = currentState.osintSnapshot.latestAlert
      const latestConnectorRun = currentState.osintSnapshot.latestConnectorRun
      const selectedScenario =
        currentState.scenario.scenarios.find(
          (entry) => entry.scenarioId === currentState.scenario.selectedScenarioId,
        ) ?? currentState.scenario.scenarios.at(-1)
      const appliedDeviationConstraint = selectedScenario?.constraints.find(
        (constraint) =>
          constraint.constraintId === runtimeSmokeFlow.deviationConstraintId ||
          constraint.constraintId === latestDeviationEvent?.domain_id,
      )
      const contextRestorePassed =
        Boolean(governedContextDomainId) &&
        currentState.correlationAoi === 'aoi-4' &&
        currentState.contextRecords.some(
          (record) =>
            record.domain_id === governedContextDomainId && record.target_id === currentState.correlationAoi,
        )
      const assertions: RuntimeSmokeAssertion[] = [
        {
          id: 'map_runtime_present',
          passed: currentState.mapRuntime.mapPresent,
          detail: currentState.mapRuntime.mapPresent
            ? `Map runtime visible with ${currentState.mapRuntime.inspectCount} inspect target(s).`
            : 'Map runtime surface was not detected.',
        },
        {
          id: 'planar_surface_ready',
          passed: currentState.mapRuntime.planarReady,
          detail: currentState.mapRuntime.planarReady
            ? 'Planar MapLibre runtime mounted successfully.'
            : 'Planar MapLibre runtime did not report ready state.',
        },
        {
          id: 'orbital_surface_ready',
          passed: currentState.mapRuntime.orbitalReady,
          detail: currentState.mapRuntime.orbitalReady
            ? 'Orbital Cesium runtime mounted successfully.'
            : 'Orbital Cesium runtime did not report ready state.',
        },
        {
          id: 'required_regions_present',
          passed: regions.every((region) => region.present),
          detail: regions.every((region) => region.present)
            ? 'All governed shell regions are visible in the Tauri runtime.'
            : `Missing regions: ${regions
                .filter((region) => !region.present)
                .map((region) => region.id)
                .join(', ')}`,
        },
        {
          id: 'bundle_persistence_reopen',
          passed:
            Boolean(currentState.selectedBundleId) &&
            currentState.integrityState.includes('Determinism check passed'),
          detail:
            currentState.integrityState || 'Bundle create/reopen flow did not complete successfully.',
        },
        {
          id: 'offline_and_degraded_state',
          passed: currentState.offline && currentState.degradedBudgetCount > 0,
          detail: currentState.offline
            ? `Offline enabled with ${currentState.degradedBudgetCount} degraded budget indicator(s).`
            : 'Offline state was not enabled by the runtime smoke sequence.',
        },
        {
          id: 'scenario_export_surface',
          passed: Boolean(currentState.scenario.exportArtifact?.artifactId) && exportCardVisible,
          detail: currentState.scenario.exportArtifact?.artifactId
            ? `Scenario export artifact ${currentState.scenario.exportArtifact.artifactId} is visible.`
            : 'Scenario export artifact was not produced.',
        },
        {
          id: 'governed_context_registration',
          passed:
            Boolean(governedContextDomainId) &&
            currentState.contextRecords.some(
              (record) =>
                record.domain_id === governedContextDomainId && record.target_id === currentState.correlationAoi,
            ),
          detail: governedContextDomainId
            ? `Governed context domain ${governedContextDomainId} captured ${currentState.contextRecords.length} record(s) for ${currentState.correlationAoi}.`
            : 'No governed context domain was active in the runtime smoke state.',
        },
        {
          id: 'governed_context_bundle_restore',
          passed: contextRestorePassed,
          detail: contextRestorePassed
            ? `Context AOI ${currentState.correlationAoi} restored from the reopened bundle with governed records intact.`
            : `Context AOI restore did not converge on the governed bundle snapshot (current AOI: ${currentState.correlationAoi}).`,
        },
        {
          id: 'portability_note_recorded',
          passed: notes.some((note) => note.includes('macOS')),
          detail: notes.find((note) => note.includes('macOS')) ?? 'Portability note missing.',
        },
      ]

      if (runtimeSmokeConfig.requireLiveAi) {
        const latestAi = currentState.latestAiArtifact
        assertions.push({
          id: 'live_ai_gateway_completed',
          passed:
            currentState.aiProviderStatus.runtime === 'tauri-live' &&
            currentState.aiProviderStatus.available &&
            latestAi?.gatewayRuntime === 'tauri-live' &&
            latestAi?.degraded === false &&
            Boolean(latestAi?.artifactId),
          detail:
            latestAi?.artifactId
              ? `Live AI artifact ${latestAi.artifactId} completed via ${latestAi.providerLabel}.`
              : `AI provider runtime ${currentState.aiProviderStatus.runtime} | ${currentState.aiProviderStatus.detail}`,
        })
      }

      if (runtimeSmokeConfig.requireMcp) {
        const latestMcp = currentState.latestMcpInvocation
        assertions.push({
          id: 'governed_mcp_invocation_recorded',
          passed:
            latestMcp?.status === 'allowed' &&
            Boolean(latestMcp.invocationId) &&
            Boolean(latestMcp.toolName),
          detail: latestMcp?.invocationId
            ? `MCP tool ${latestMcp.toolName} recorded as ${latestMcp.status} (${latestMcp.invocationId}).`
            : 'No governed MCP invocation was recorded.',
        })
      }

      if (isWpI8RuntimeSmoke) {
        assertions.push({
          id: 'governed_deviation_recorded',
          passed:
            Boolean(
              runtimeSmokeFlow.governedDeviationRecorded &&
                latestDeviationEvent?.source_mode === 'governed_series' &&
                latestDeviationEvent.source_record_ids.length > 0,
            ),
          detail: latestDeviationEvent
            ? `Governed deviation ${latestDeviationEvent.eventId} recorded for ${latestDeviationEvent.domain_name} with ${latestDeviationEvent.source_record_ids.length} source record(s).`
            : 'No governed deviation event was recorded during runtime smoke.',
        })
        assertions.push({
          id: 'governed_deviation_bundle_restore',
          passed:
            Boolean(
              runtimeSmokeFlow.governedDeviationRestored &&
                latestDeviationEvent?.source_mode === 'governed_series' &&
                currentState.deviationSnapshot.suggestions.length > 0,
            ),
          detail: runtimeSmokeFlow.governedDeviationRestored && latestDeviationEvent
            ? `Governed deviation ${latestDeviationEvent.eventId} and ${currentState.deviationSnapshot.suggestions.length} suggestion(s) survived bundle reopen.`
            : 'Governed deviation state was not restored from the reopened bundle.',
        })
        assertions.push({
          id: 'deviation_map_projection',
          passed: currentState.mapDeviationInspectVisible,
          detail: currentState.mapDeviationInspectVisible && latestDeviationEvent
            ? `Map runtime projects deviation watch ${latestDeviationEvent.domain_name} onto the live surface (focus ${currentState.mapRuntime.focusAoiId}).`
            : 'Map runtime did not expose the governed deviation watch projection.',
        })
        assertions.push({
          id: 'deviation_context_constraint_applied',
          passed:
            runtimeSmokeFlow.deviationContextConstraintApplied &&
            Boolean(appliedDeviationConstraint),
          detail: appliedDeviationConstraint
            ? `Scenario constraint ${appliedDeviationConstraint.constraintId} applied from governed deviation output.`
            : 'Deviation-linked context constraint was not applied to the selected scenario.',
        })
      }

      if (isWpI9RuntimeSmoke) {
        const governedConnectorExecuted =
          runtimeSmokeFlow.governedConnectorRecorded &&
          currentState.osintInputMode === 'governed_connector' &&
          Boolean(latestConnectorRun) &&
          latestConnectorRun?.connector_id === runtimeSmokeFlow.restoredConnectorId &&
          (latestConnectorRun?.source_event_ids.length ?? 0) > 0
        const governedConnectorRestored =
          runtimeSmokeFlow.governedConnectorRestored &&
          currentState.osintSnapshot.selectedAoi === governedContextBundleAoi &&
          currentState.selectedGovernedConnectorId === runtimeSmokeFlow.restoredConnectorId &&
          latestConnectorRun?.connector_id === runtimeSmokeFlow.restoredConnectorId
        const aggregateAlertLinked =
          latestOsintAlert?.aggregate_only === true &&
          latestOsintAlert?.source_mode === 'governed_connector' &&
          (latestOsintAlert?.threshold_refs.length ?? 0) > 0 &&
          (latestOsintAlert.source_event_ids?.length ?? 0) > 0 &&
          latestOsintAlert.deviation_event_id === latestDeviationEvent?.eventId
        assertions.push({
          id: 'governed_connector_executed',
          passed: Boolean(governedConnectorExecuted),
          detail: latestConnectorRun
            ? `Connector ${latestConnectorRun.connector_label} produced ${latestConnectorRun.source_event_ids.length} governed event(s) for ${currentState.osintSnapshot.selectedAoi}.`
            : 'No governed connector execution was recorded during runtime smoke.',
        })
        assertions.push({
          id: 'governed_connector_bundle_restore',
          passed: Boolean(governedConnectorRestored),
          detail: governedConnectorRestored && latestConnectorRun
            ? `Connector ${latestConnectorRun.connector_label} and aggregate alert state were restored from the reopened bundle for ${currentState.osintSnapshot.selectedAoi}.`
            : 'Governed connector state was not restored from the reopened bundle.',
        })
        assertions.push({
          id: 'aggregate_alert_lineage',
          passed: Boolean(aggregateAlertLinked),
          detail: aggregateAlertLinked && latestOsintAlert
            ? `Aggregate alert ${latestOsintAlert.alert_id} retains ${latestOsintAlert.threshold_refs.length} threshold ref(s) and deviation ${latestOsintAlert.deviation_event_id}.`
            : 'Aggregate alert lineage did not retain connector threshold/deviation references.',
        })
        assertions.push({
          id: 'osint_map_projection',
          passed: currentState.mapOsintInspectVisible,
          detail: currentState.mapOsintInspectVisible && latestOsintAlert
            ? `Map runtime projects the aggregate alert for ${latestOsintAlert.aoi} onto the live surface.`
            : 'Map runtime did not expose the governed OSINT projection.',
        })
      }

      return assertions
    }

    const buildReport = async (
      metrics: RuntimeSmokeMetric[],
      notes: string[],
    ): Promise<RuntimeSmokeReport> => {
      const currentState = runtimeSmokeStateRef.current
      const regions = collectRegionChecks()
      const assertions = buildAssertions(regions, notes)
      return {
        phase: runtimeSmokeConfig.phase,
        capturedAt: new Date().toISOString(),
        startupMs: Math.round(performance.now() - runtimeSmokeStartMs.current),
        window: await captureRuntimeSmokeWindowSnapshot(),
        mode: currentState.mode,
        selectedBundleId: currentState.selectedBundleId || undefined,
        bundleCount: currentState.bundles.length,
        activeLayerCount: currentState.activeLayers.length,
        degradedBudgetCount: currentState.degradedBudgetCount,
        offline: currentState.offline,
        status: currentState.status,
        integrityState: currentState.integrityState,
        scenarioExportArtifactId: currentState.scenario.exportArtifact?.artifactId,
        auditEventCount: currentState.auditEvents.length,
        platform: navigator.platform,
        mapRuntimeVisible: currentState.mapRuntime.mapPresent,
        mapRuntimeInteractive: currentState.mapRuntime.interactiveSupported,
        mapSurfaceMode: currentState.mapRuntime.activeSurfaceMode,
        mapRuntimeEngine: currentState.mapRuntime.activeRuntimeEngine,
        mapPlanarReady: currentState.mapRuntime.planarReady,
        mapOrbitalReady: currentState.mapRuntime.orbitalReady,
        mapFocusAoiId: currentState.mapRuntime.focusAoiId,
        mapInspectCount: currentState.mapRuntime.inspectCount,
        mapRuntimeError: currentState.mapRuntime.runtimeError || undefined,
        mapOsintInspectVisible: currentState.mapOsintInspectVisible,
        activeContextDomainCount: currentState.activeDomainIds.length,
        contextRecordCount: currentState.contextRecords.length,
        correlationAoi: currentState.correlationAoi,
        governedContextDomainId: currentState.activeDomainIds.find((domainId) =>
          Boolean(getGovernedDomainTemplate(domainId)),
        ),
        osintSourceMode: currentState.osintInputMode,
        osintSelectedConnectorId: currentState.selectedGovernedConnectorId,
        osintLatestConnectorId: currentState.osintSnapshot.latestConnectorRun?.connector_id,
        osintAlertCount: currentState.osintSnapshot.latestAlert?.count ?? 0,
        osintEventCount: currentState.osintSnapshot.events.length,
        osintThresholdRefCount: currentState.osintSnapshot.latestAlert?.threshold_refs.length ?? 0,
        osintDeviationEventId: currentState.osintSnapshot.latestAlert?.deviation_event_id,
        requireLiveAi: runtimeSmokeConfig.requireLiveAi,
        requireMcp: runtimeSmokeConfig.requireMcp,
        aiProviderLabel: currentState.aiProviderStatus.providerLabel,
        aiProviderRuntime: currentState.aiProviderStatus.runtime,
        aiProviderAvailable: currentState.aiProviderStatus.available,
        aiProviderDetail: currentState.aiProviderStatus.detail,
        aiArtifactId: currentState.latestAiArtifact?.artifactId,
        aiRequestId: currentState.latestAiArtifact?.requestId,
        aiGatewayRuntime: currentState.latestAiArtifact?.gatewayRuntime,
        mcpInvocationId: currentState.latestMcpInvocation?.invocationId,
        mcpInvocationStatus: currentState.latestMcpInvocation?.status,
        mcpToolName: currentState.latestMcpInvocation?.toolName,
        regions,
        assertions,
        metrics,
        notes,
      }
    }

    const appendAuditAndRefresh = async (
      eventType: string,
      payload: Record<string, unknown>,
    ): Promise<void> => {
      await backend.appendAudit({
        role,
        event_type: eventType,
        payload,
      })
      await refresh()
    }

    const findLabeledControl = (labelText: string): HTMLInputElement | HTMLSelectElement => {
      const label = Array.from(document.querySelectorAll<HTMLLabelElement>('label')).find((candidate) =>
        candidate.textContent?.replace(/\s+/g, ' ').includes(labelText),
      )
      const control = label?.querySelector<HTMLInputElement | HTMLSelectElement>('input, select')
      if (!control) {
        throw new Error(`Runtime smoke could not find the field "${labelText}".`)
      }
      return control
    }

    const setLabeledFieldValue = async (labelText: string, value: string): Promise<void> => {
      const control = findLabeledControl(labelText)
      if (control instanceof HTMLSelectElement) {
        const valueSetter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')?.set
        if (!valueSetter) {
          throw new Error(`Runtime smoke could not update select "${labelText}".`)
        }
        valueSetter.call(control, value)
        control.dispatchEvent(new Event('change', { bubbles: true }))
        await pause(50)
        return
      }

      const valueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set
      if (!valueSetter) {
        throw new Error(`Runtime smoke could not update input "${labelText}".`)
      }
      valueSetter.call(control, value)
      control.dispatchEvent(new Event('input', { bubbles: true }))
      control.dispatchEvent(new Event('change', { bubbles: true }))
      await pause(50)
    }

    const waitForPersistedContextState = async (
      targetAoi: string,
      domainId: string,
      timeoutMs = 15000,
    ): Promise<RecorderState> => {
      const deadline = performance.now() + timeoutMs
      while (performance.now() < deadline) {
        const persisted = await backend.loadRecorderState()
        if (persisted.state) {
          const persistedRecords = normalizeContextRecords(persisted.state.context.records)
          if (
            persisted.state.context.correlationAoi === targetAoi &&
            persisted.state.context.activeDomainIds.includes(domainId) &&
            persistedRecords.some(
              (record) => record.domain_id === domainId && record.target_id === targetAoi,
            )
          ) {
            return persisted.state
          }
        }
        await pause(100)
      }

      throw new Error(
        `Runtime smoke timed out waiting for persisted governed context state for ${domainId} / ${targetAoi}`,
      )
    }

    const waitForPersistedDeviationState = async (
      domainId: string,
      targetAoi: string,
      timeoutMs = 15000,
    ): Promise<RecorderState> => {
      const deadline = performance.now() + timeoutMs
      while (performance.now() < deadline) {
        const persisted = await backend.loadRecorderState()
        if (persisted.state) {
          const deviationState = normalizeDeviationSnapshot(persisted.state.deviation)
          if (
            deviationState.latestEvent?.domain_id === domainId &&
            deviationState.latestEvent.target_id === targetAoi &&
            deviationState.latestEvent.source_mode === 'governed_series' &&
            deviationState.latestEvent.source_record_ids.length > 0
          ) {
            return persisted.state
          }
        }
        await pause(100)
      }

      throw new Error(
        `Runtime smoke timed out waiting for persisted governed deviation state for ${domainId} / ${targetAoi}`,
      )
    }

    const waitForPersistedDeviationBundleState = async (
      targetAoi: string,
      timeoutMs = 15000,
    ): Promise<RecorderState> => {
      const deadline = performance.now() + timeoutMs
      while (performance.now() < deadline) {
        const persisted = await backend.loadRecorderState()
        if (persisted.state) {
          const persistedRecords = normalizeContextRecords(persisted.state.context.records)
          const deviationState = normalizeDeviationSnapshot(persisted.state.deviation)
          if (
            persisted.state.context.correlationAoi === targetAoi &&
            persisted.state.context.activeDomainIds.includes(governedContextDomainId) &&
            persisted.state.context.activeDomainIds.includes(governedDeviationDomainId) &&
            persistedRecords.some(
              (record) =>
                record.domain_id === governedContextDomainId && record.target_id === targetAoi,
            ) &&
            persistedRecords.some(
              (record) =>
                record.domain_id === governedDeviationDomainId && record.target_id === targetAoi,
            ) &&
            deviationState.latestEvent?.domain_id === governedDeviationDomainId &&
            deviationState.latestEvent.target_id === targetAoi &&
            deviationState.suggestions.some((entry) => entry.domain_id === governedDeviationDomainId)
          ) {
            return persisted.state
          }
        }
        await pause(100)
      }

      throw new Error(
        `Runtime smoke timed out waiting for bundle-ready governed deviation state for ${governedDeviationDomainId} / ${targetAoi}`,
      )
    }

    const createBundleForRuntimeSmoke = async (): Promise<string> => {
      const startedAt = beginMeasuredAction('Create bundle')
      setBusy(true)
      setStatus('Creating bundle...')
      try {
        const previousBundleCount = runtimeSmokeStateRef.current.bundles.length
        const requestState = isWpI9RuntimeSmoke
          ? await waitForPersistedI9BundleState(governedContextBundleAoi)
          : requiresGovernedDeviationForRuntimeSmoke
            ? await waitForPersistedDeviationBundleState(governedContextBundleAoi)
            : await waitForPersistedContextState(governedContextBundleAoi, governedContextDomainId)
        const manifest = await backend.createBundle({
          role,
          marking,
          state: {
            ...requestState,
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
        await waitForCondition(
          'bundle creation',
          () =>
            runtimeSmokeStateRef.current.selectedBundleId === manifest.bundle_id &&
            runtimeSmokeStateRef.current.bundles.length >= previousBundleCount + 1,
        )
        setStatus(`Bundle ${manifest.bundle_id} created`)
        setIntegrityState('Bundle created; deterministic reopen pending')
        return manifest.bundle_id
      } catch (error) {
        setStatus(`Create failed: ${String(error)}`)
        setIntegrityState('Bundle create failed')
        throw error
      } finally {
        completeMeasuredAction('Create bundle', startedAt)
        setBusy(false)
      }
    }

    const openBundleForRuntimeSmoke = async (): Promise<void> => {
      clickWorkspaceButton('Reopen Bundle')
      await waitForCondition(
        'bundle reopen',
        () =>
          runtimeSmokeStateRef.current.status.includes('reopened') &&
          runtimeSmokeStateRef.current.integrityState.includes('Determinism check passed'),
      )
    }

    const setForcedOfflineForRuntimeSmoke = async (nextForcedOffline: boolean): Promise<void> => {
      const startedAt = beginMeasuredAction('Offline mode change')
      setForcedOffline(nextForcedOffline)
      try {
        await appendAuditAndRefresh('offline.mode_change', {
          forced_offline: nextForcedOffline,
          navigator_online: navigator.onLine,
        })
      } finally {
        completeMeasuredAction('Offline mode change', startedAt)
      }
    }

    const governedContextDomainId = DEFAULT_GOVERNED_CONTEXT_DOMAIN_ID
    const governedDeviationDomainId = 'sanctions-regime-updates'
    const governedContextBundleAoi = 'aoi-4'
    const governedContextMutationAoi = 'aoi-2'
    const governedOsintBundleConnectorId: GovernedFeedConnectorId = 'regulatory-pressure-watch'
    const governedOsintMutationConnectorId: GovernedFeedConnectorId = 'logistics-disruption-watch'

    const waitForPersistedOsintState = async ({
      targetAoi,
      connectorId,
      thresholdDomainId,
      requireDeviationLink = false,
      timeoutMs = 15000,
    }: {
      targetAoi: string
      connectorId: GovernedFeedConnectorId
      thresholdDomainId: string
      requireDeviationLink?: boolean
      timeoutMs?: number
    }): Promise<RecorderState> => {
      const deadline = performance.now() + timeoutMs
      while (performance.now() < deadline) {
        const persisted = await backend.loadRecorderState()
        if (persisted.state) {
          const osintState = normalizeOsintSnapshot(persisted.state.osint)
          const deviationState = normalizeDeviationSnapshot(persisted.state.deviation)
          const latestRun = osintState.latestConnectorRun
          const latestAlert = osintState.latestAlert
          const thresholdLinked =
            latestAlert?.threshold_refs.some((entry) => entry.domain_id === thresholdDomainId) ?? false
          const deviationLinked = !requireDeviationLink
            ? true
            : Boolean(
                latestRun?.deviation_event_id &&
                  latestRun.deviation_event_id === deviationState.latestEvent?.eventId &&
                  latestAlert?.deviation_event_id === deviationState.latestEvent?.eventId,
              )
          if (
            osintState.selectedAoi === targetAoi &&
            osintState.sourceMode === 'governed_connector' &&
            osintState.selectedConnectorId === connectorId &&
              latestRun?.connector_id === connectorId &&
              latestRun.source_mode === 'governed_connector' &&
              latestRun.source_event_ids.length > 0 &&
              latestAlert?.aggregate_only === true &&
              thresholdLinked &&
            deviationLinked
          ) {
            return persisted.state
          }
        }
        await pause(100)
      }

      throw new Error(
        `Runtime smoke timed out waiting for persisted governed OSINT state for ${connectorId} / ${targetAoi}`,
      )
    }

    const registerGovernedContextDomainForRuntimeSmoke = async (
      domainId: string,
      targetAoi: string,
    ): Promise<void> => {
      await setLabeledFieldValue('Approved Domain', domainId)
      await waitForCondition(
        'governed context draft selection',
        () =>
          runtimeSmokeStateRef.current.selectedGovernedDomainId === domainId &&
          runtimeSmokeStateRef.current.domainDraft.domain_id === domainId,
      )
      await setLabeledFieldValue('Correlation AOI', targetAoi)
      await waitForCondition(
        'governed context aoi selection',
        () => runtimeSmokeStateRef.current.correlationAoi === targetAoi,
      )
      clickWorkspaceButton('Register Domain')
      await waitForCondition(
        'governed context registration',
        () =>
          runtimeSmokeStateRef.current.activeDomainIds.includes(domainId) &&
          runtimeSmokeStateRef.current.contextRecords.some(
            (record) => record.domain_id === domainId && record.target_id === targetAoi,
          ),
      )
      clickWorkspaceButton('Save Correlation Selection')
      await waitForCondition(
        'governed context correlation save',
        () =>
          runtimeSmokeStateRef.current.correlationAoi === targetAoi &&
          runtimeSmokeStateRef.current.contextRecords.some(
            (record) => record.domain_id === domainId && record.target_id === targetAoi,
          ),
      )
      await waitForPersistedContextState(targetAoi, domainId)
    }

    const registerGovernedContextForRuntimeSmoke = async (): Promise<void> => {
      await registerGovernedContextDomainForRuntimeSmoke(
        governedContextDomainId,
        governedContextBundleAoi,
      )
      if (requiresGovernedDeviationForRuntimeSmoke) {
        await registerGovernedContextDomainForRuntimeSmoke(
          governedDeviationDomainId,
          governedContextBundleAoi,
        )
      }
    }

    const mutateGovernedContextForRuntimeSmoke = async (): Promise<void> => {
      await setLabeledFieldValue('Correlation AOI', governedContextMutationAoi)
      await waitForCondition(
        'governed context mutation selection',
        () => runtimeSmokeStateRef.current.correlationAoi === governedContextMutationAoi,
      )
      clickWorkspaceButton('Save Correlation Selection')
      await waitForCondition(
        'governed context mutation save',
        () =>
          runtimeSmokeStateRef.current.correlationAoi === governedContextMutationAoi &&
          runtimeSmokeStateRef.current.contextRecords.some(
            (record) =>
              record.domain_id === governedContextDomainId &&
              record.target_id === governedContextMutationAoi,
          ),
      )
      await waitForPersistedContextState(governedContextMutationAoi, governedContextDomainId)
      if (requiresGovernedDeviationForRuntimeSmoke) {
        await waitForPersistedContextState(governedContextMutationAoi, governedDeviationDomainId)
      }
    }

    const recordGovernedDeviationForRuntimeSmoke = async (): Promise<void> => {
      onModeChange('live_recent')
      await waitForCondition(
        'live/recent mode activation',
        () => runtimeSmokeStateRef.current.mode === 'live_recent',
      )
      await setLabeledFieldValue('Deviation Source', 'governed_series')
      await setLabeledFieldValue('Deviation Domain', governedDeviationDomainId)
      await waitForCondition(
        'governed deviation domain selection',
        () => runtimeSmokeStateRef.current.selectedDeviationDomainId === governedDeviationDomainId,
      )
      clickWorkspaceButton('Load Governed Windows')
      await pause(100)
      clickWorkspaceButton('Record Deviation Event')
      await waitForCondition(
        'governed deviation event',
        () => {
          const latestEvent = runtimeSmokeStateRef.current.deviationSnapshot.latestEvent
          return (
            latestEvent?.domain_id === governedDeviationDomainId &&
            latestEvent.target_id === governedContextBundleAoi &&
            latestEvent.source_mode === 'governed_series' &&
            latestEvent.source_record_ids.length > 0
          )
        },
        15000,
      )
      await waitForPersistedDeviationState(governedDeviationDomainId, governedContextBundleAoi)
      runtimeSmokeFlow.governedDeviationRecorded = true
      await waitForCondition(
        'deviation map projection',
        () => runtimeSmokeStateRef.current.mapDeviationInspectVisible,
        15000,
      )
    }

    const configureGovernedConnectorForRuntimeSmoke = async ({
      aoi,
      connectorId,
      thresholdDomainId,
      thresholdComparator,
      thresholdValue,
    }: {
      aoi: string
      connectorId: GovernedFeedConnectorId
      thresholdDomainId: string
      thresholdComparator: ThresholdComparator
      thresholdValue: string
    }): Promise<void> => {
      setOsintInputMode('governed_connector')
      setOsintAoi(aoi)
      setSelectedGovernedConnectorId(connectorId)
      setSelectedOsintThresholdDomainId(thresholdDomainId)
      setOsintThresholdComparator(thresholdComparator)
      setOsintThresholdValueInput(thresholdValue)
      await waitForCondition(
        'governed osint configuration',
        () =>
          runtimeSmokeStateRef.current.osintInputMode === 'governed_connector' &&
          runtimeSmokeStateRef.current.osintSnapshot.selectedAoi === aoi &&
          runtimeSmokeStateRef.current.selectedGovernedConnectorId === connectorId &&
          runtimeSmokeStateRef.current.selectedOsintThresholdDomainId === thresholdDomainId,
      )
    }

    const runGovernedConnectorForRuntimeSmoke = async ({
      aoi,
      connectorId,
      thresholdDomainId,
      thresholdComparator,
      thresholdValue,
      expectedEventFloor,
      requireDeviationLink = true,
    }: {
      aoi: string
      connectorId: GovernedFeedConnectorId
      thresholdDomainId: string
      thresholdComparator: ThresholdComparator
      thresholdValue: string
      expectedEventFloor: number
      requireDeviationLink?: boolean
    }): Promise<void> => {
      await configureGovernedConnectorForRuntimeSmoke({
        aoi,
        connectorId,
        thresholdDomainId,
        thresholdComparator,
        thresholdValue,
      })
      clickWorkspaceButton('Run Governed Connector')
      await waitForCondition(
        'governed connector execution',
        () => {
          const latestRun = runtimeSmokeStateRef.current.osintSnapshot.latestConnectorRun
          const latestAlert = runtimeSmokeStateRef.current.osintSnapshot.latestAlert
          return Boolean(
              latestRun?.connector_id === connectorId &&
              latestRun.source_event_ids.length >= expectedEventFloor &&
              latestAlert?.aggregate_only === true &&
              (latestAlert?.threshold_refs.length ?? 0) > 0 &&
              latestAlert?.source_mode === 'governed_connector' &&
              (!requireDeviationLink ||
                latestAlert?.deviation_event_id ===
                  runtimeSmokeStateRef.current.deviationSnapshot.latestEvent?.eventId) &&
              runtimeSmokeStateRef.current.mapOsintInspectVisible,
          )
        },
        15000,
      )
      await waitForPersistedOsintState({
        targetAoi: aoi,
        connectorId,
        thresholdDomainId,
        requireDeviationLink,
      })
      runtimeSmokeFlow.governedConnectorRecorded = true
      runtimeSmokeFlow.governedConnectorId = connectorId
      if (requireDeviationLink) {
        runtimeSmokeFlow.restoredConnectorId = connectorId
      }
    }

    const waitForPersistedI9BundleState = async (
      targetAoi: string,
      timeoutMs = 15000,
    ): Promise<RecorderState> => {
      const deadline = performance.now() + timeoutMs
      while (performance.now() < deadline) {
        const persisted = await backend.loadRecorderState()
        if (persisted.state) {
          const persistedRecords = normalizeContextRecords(persisted.state.context.records)
          const deviationState = normalizeDeviationSnapshot(persisted.state.deviation)
          const osintState = normalizeOsintSnapshot(persisted.state.osint)
          if (
            persisted.state.context.correlationAoi === targetAoi &&
            persisted.state.context.activeDomainIds.includes(governedContextDomainId) &&
            persisted.state.context.activeDomainIds.includes(governedDeviationDomainId) &&
            persistedRecords.some(
              (record) =>
                record.domain_id === governedContextDomainId && record.target_id === targetAoi,
            ) &&
            persistedRecords.some(
              (record) =>
                record.domain_id === governedDeviationDomainId && record.target_id === targetAoi,
            ) &&
            deviationState.latestEvent?.domain_id === governedDeviationDomainId &&
            deviationState.latestEvent.target_id === targetAoi &&
            deviationState.suggestions.some((entry) => entry.domain_id === governedDeviationDomainId) &&
            osintState.selectedAoi === targetAoi &&
            osintState.selectedConnectorId === governedOsintBundleConnectorId &&
            osintState.latestConnectorRun?.connector_id === governedOsintBundleConnectorId &&
            osintState.latestAlert?.aggregate_only === true &&
            (osintState.latestAlert?.threshold_refs.length ?? 0) > 0 &&
            osintState.latestAlert?.deviation_event_id === deviationState.latestEvent.eventId
          ) {
            return persisted.state
          }
        }
        await pause(100)
      }

      throw new Error(
        `Runtime smoke timed out waiting for bundle-ready governed OSINT state for ${governedOsintBundleConnectorId} / ${targetAoi}`,
      )
    }

    const applyDeviationContextConstraintForRuntimeSmoke = async (): Promise<void> => {
      await waitForCondition(
        'deviation suggestion availability',
        () =>
          runtimeSmokeStateRef.current.deviationSnapshot.suggestions.some(
            (entry) => entry.domain_id === governedDeviationDomainId,
          ),
        15000,
      )
      clickWorkspaceButton('Apply Sanctions Regime Updates Constraint')
      await waitForCondition(
        'deviation-linked context constraint application',
        () => {
          const snapshot = runtimeSmokeStateRef.current.scenario
          const selectedScenario =
            snapshot.scenarios.find((entry) => entry.scenarioId === snapshot.selectedScenarioId) ??
            snapshot.scenarios.at(-1)
          return Boolean(
            selectedScenario?.constraints.find(
              (constraint) => constraint.constraintId === governedDeviationDomainId,
            ),
          )
        },
        15000,
      )
      runtimeSmokeFlow.deviationContextConstraintApplied = true
      runtimeSmokeFlow.deviationConstraintId = governedDeviationDomainId
    }

    const clickMapRuntimeButton = (label: '2D Situation Map' | '3D Globe'): void => {
      const button = document.querySelector<HTMLButtonElement>(
        `[data-testid="map-runtime-surface"] button`,
      )
      const candidates = Array.from(
        document.querySelectorAll<HTMLButtonElement>('[data-testid="map-runtime-surface"] button'),
      )
      const target = candidates.find((candidate) => candidate.textContent?.includes(label))
      const actionable = target ?? button
      if (!actionable) {
        throw new Error(`Runtime smoke could not find the map-runtime button "${label}".`)
      }
      actionable.click()
    }

    const clickWorkspaceButton = (label: string): void => {
      const target = Array.from(document.querySelectorAll<HTMLButtonElement>('button')).find(
        (candidate) => candidate.textContent?.trim() === label,
      )
      if (!target) {
        throw new Error(`Runtime smoke could not find the button "${label}".`)
      }
      target.click()
    }

    const getRuntimeSmokeScenarioSelection = () => {
      const snapshot = runtimeSmokeStateRef.current.scenario
      const selectedScenario =
        snapshot.scenarios.find((entry) => entry.scenarioId === snapshot.selectedScenarioId) ??
        snapshot.scenarios.at(-1)
      const comparisonScenario =
        snapshot.scenarios.find((entry) => entry.scenarioId === snapshot.comparisonScenarioId) ??
        snapshot.scenarios.find((entry) => entry.scenarioId !== selectedScenario?.scenarioId)

      if (!selectedScenario) {
        throw new Error('Runtime smoke requires a selected scenario.')
      }
      if (!comparisonScenario) {
        throw new Error('Runtime smoke requires a comparison scenario.')
      }

      return {
        snapshot,
        selectedScenario,
        comparisonScenario,
      }
    }

    const createScenarioForkForRuntimeSmoke = async (title: string): Promise<void> => {
      const startedAt = beginMeasuredAction('Scenario fork create')
      try {
        const currentState = runtimeSmokeStateRef.current
        const bundleId = currentState.selectedBundleId
        if (!bundleId) {
          throw new Error('Runtime smoke requires a bundle before forking scenarios.')
        }

        const baseSnapshot =
          currentState.scenario.parentBundleId && currentState.scenario.parentBundleId !== bundleId
            ? createScenarioState(bundleId)
            : currentState.scenario.parentBundleId
              ? currentState.scenario
              : createScenarioState(bundleId)
        const next = createScenarioFork(baseSnapshot, {
          title,
          parentBundleId: bundleId,
          parentScenarioId: baseSnapshot.selectedScenarioId || undefined,
          marking,
          provenanceSummary: `Parent bundle ${bundleId} | ${
            currentState.offline ? 'cached offline fork' : 'live fork'
          }`,
        })
        setScenario(next)
        setStatus(`Scenario ${next.selectedScenarioId} forked from bundle ${bundleId}`)
        await appendAuditAndRefresh('scenario.fork_created', {
          bundle_id: bundleId,
          scenario_id: next.selectedScenarioId,
          parent_scenario_id: next.comparisonScenarioId || null,
          offline: currentState.offline,
          marking,
        })
      } finally {
        completeMeasuredAction('Scenario fork create', startedAt)
      }
    }

    const applyScenarioConstraintForRuntimeSmoke = async (): Promise<void> => {
      const startedAt = beginMeasuredAction('Scenario constraint update')
      try {
        const { snapshot, selectedScenario } = getRuntimeSmokeScenarioSelection()
        const next = setConstraint(snapshot, selectedScenario.scenarioId, {
          constraintId: DEFAULT_SCENARIO_CONSTRAINT_ID,
          label: DEFAULT_SCENARIO_CONSTRAINT_LABEL,
          value: DEFAULT_SCENARIO_CONSTRAINT_VALUE,
          unit: DEFAULT_SCENARIO_CONSTRAINT_UNIT,
          rationale: DEFAULT_SCENARIO_CONSTRAINT_RATIONALE,
          propagationWeight: DEFAULT_SCENARIO_CONSTRAINT_WEIGHT,
        })
        setScenario(next)
        setStatus(`Constraint ${DEFAULT_SCENARIO_CONSTRAINT_ID} updated on ${selectedScenario.title}`)
        await appendAuditAndRefresh('scenario.constraint_updated', {
          bundle_id: next.parentBundleId,
          scenario_id: selectedScenario.scenarioId,
          constraint_id: DEFAULT_SCENARIO_CONSTRAINT_ID,
          value: DEFAULT_SCENARIO_CONSTRAINT_VALUE,
          propagation_weight: DEFAULT_SCENARIO_CONSTRAINT_WEIGHT,
        })
      } finally {
        completeMeasuredAction('Scenario constraint update', startedAt)
      }
    }

    const compareScenarioForksForRuntimeSmoke = async (): Promise<void> => {
      const startedAt = beginMeasuredAction('Scenario compare')
      try {
        const { snapshot, selectedScenario, comparisonScenario } = getRuntimeSmokeScenarioSelection()
        const comparison = compareScenarios(comparisonScenario, selectedScenario)
        setScenario(setScenarioExportArtifact(snapshot, undefined))
        setStatus(comparison.summary)
        await appendAuditAndRefresh('scenario.compared', {
          bundle_id: snapshot.parentBundleId,
          left_scenario_id: comparisonScenario.scenarioId,
          right_scenario_id: selectedScenario.scenarioId,
          constraint_delta_count: comparison.constraintDeltaCount,
          hypothetical_delta_count: comparison.hypotheticalDeltaCount,
          total_propagation_delta: comparison.totalPropagationDelta,
        })
      } finally {
        completeMeasuredAction('Scenario compare', startedAt)
      }
    }

    const exportScenarioBundleForRuntimeSmoke = async (): Promise<void> => {
      const startedAt = beginMeasuredAction('Scenario export')
      try {
        const currentState = runtimeSmokeStateRef.current
        const { snapshot, selectedScenario, comparisonScenario } = getRuntimeSmokeScenarioSelection()
        const exportArtifact = exportScenarioBundle(snapshot, {
          leftScenarioId: comparisonScenario.scenarioId,
          rightScenarioId: selectedScenario.scenarioId,
          offline: currentState.offline,
        })
        if (!exportArtifact) {
          throw new Error('Runtime smoke could not produce a scenario export artifact.')
        }

        setScenario(setScenarioExportArtifact(snapshot, exportArtifact))
        setStatus(`Scenario export ready for ${exportArtifact.parentBundleId}`)
        await appendAuditAndRefresh('scenario.export_prepared', {
          bundle_id: exportArtifact.parentBundleId,
          artifact_id: exportArtifact.artifactId,
          export_fingerprint: exportArtifact.exportFingerprint,
          left_scenario_id: exportArtifact.leftScenarioId,
          right_scenario_id: exportArtifact.rightScenarioId,
          offline: exportArtifact.offline,
        })
      } finally {
        completeMeasuredAction('Scenario export', startedAt)
      }
    }

    const notes = [
      'Executed inside the real Tauri runtime using the governed desktop shell.',
      `Runtime smoke phase: ${runtimeSmokeConfig.phase}.`,
      'macOS portability smoke remains a required evidence slot for downstream packet promotion.',
      'Startup timing was captured in development-mode Tauri and should be re-measured on reference hardware before gate promotion.',
    ]
    const metrics: RuntimeSmokeMetric[] = []

    try {
      await backend
        .appendAudit({
          role,
          event_type: 'runtime_smoke.start',
          payload: { phase: runtimeSmokeConfig.phase },
        })
        .catch(() => {
          // Keep runtime smoke progressing even if the audit append fails.
        })

      await waitForCondition('hydration', () => hydrated)
      await pause(250)

      metrics.push(
        await measure('Planar map runtime mount', async () => {
          await waitForCondition('map runtime visible', () =>
            Boolean(document.querySelector('[data-testid="map-runtime-surface"]')),
          )
          await waitForCondition('planar runtime ready', () =>
            runtimeSmokeStateRef.current.mapRuntime.planarReady,
          )
        }),
      )

      metrics.push(
        await measure('Orbital map runtime mount', async () => {
          clickMapRuntimeButton('3D Globe')
          await waitForCondition('orbital surface mode', () =>
            runtimeSmokeStateRef.current.mapRuntime.activeSurfaceMode === 'orbital',
          )
          await waitForCondition('orbital runtime ready', () =>
            runtimeSmokeStateRef.current.mapRuntime.orbitalReady &&
            runtimeSmokeStateRef.current.mapRuntime.activeRuntimeEngine === 'cesium',
          )
        }),
      )

      metrics.push(
        await measure(
          'Planar map runtime restore',
          async () => {
            clickMapRuntimeButton('2D Situation Map')
            await waitForCondition('planar surface mode restore', () =>
              runtimeSmokeStateRef.current.mapRuntime.activeSurfaceMode === 'planar' &&
              runtimeSmokeStateRef.current.mapRuntime.activeRuntimeEngine === 'maplibre',
            )
          },
          I1_BUDGETS.stateChangeFeedbackP95Ms,
        ),
      )

      metrics.push(
        await measure('Governed context registration', async () => {
          await registerGovernedContextForRuntimeSmoke()
        }),
      )

      if (requiresGovernedDeviationForRuntimeSmoke) {
        metrics.push(
          await measure('Governed deviation recording', async () => {
            await recordGovernedDeviationForRuntimeSmoke()
          }),
        )
      }

      if (isWpI9RuntimeSmoke) {
        metrics.push(
          await measure('Governed connector execution', async () => {
            await runGovernedConnectorForRuntimeSmoke({
              aoi: governedContextBundleAoi,
              connectorId: governedOsintBundleConnectorId,
              thresholdDomainId: governedDeviationDomainId,
              thresholdComparator: 'above',
              thresholdValue: '1',
              expectedEventFloor: 1,
            })
          }),
        )
      }

      metrics.push(
        await measure('Create bundle', async () => {
          const bundleId = await createBundleForRuntimeSmoke()
          await waitForCondition('bundle creation', () => runtimeSmokeStateRef.current.selectedBundleId === bundleId)
        }),
      )

      metrics.push(
        await measure('Governed context mutation', async () => {
          await mutateGovernedContextForRuntimeSmoke()
        }),
      )

      if (isWpI9RuntimeSmoke) {
        metrics.push(
          await measure('Governed connector mutation', async () => {
            await runGovernedConnectorForRuntimeSmoke({
              aoi: governedContextMutationAoi,
              connectorId: governedOsintMutationConnectorId,
              thresholdDomainId: governedContextDomainId,
              thresholdComparator: 'below',
              thresholdValue: '12',
              expectedEventFloor: 1,
              requireDeviationLink: false,
            })
          }),
        )
      }

      metrics.push(
        await measure('Open bundle', async () => {
          await openBundleForRuntimeSmoke()
          await waitForCondition('governed context restore', () => {
            const currentState = runtimeSmokeStateRef.current
            const baseRestorePassed =
              currentState.correlationAoi === governedContextBundleAoi &&
              currentState.activeDomainIds.includes(governedContextDomainId) &&
              currentState.contextRecords.some(
                (record) =>
                  record.domain_id === governedContextDomainId &&
                  record.target_id === governedContextBundleAoi,
              )
            if (!baseRestorePassed) {
              return false
            }
            if (!requiresGovernedDeviationForRuntimeSmoke) {
              return true
            }
            const latestEvent = currentState.deviationSnapshot.latestEvent
            const governedDeviationRestored = (
              currentState.activeDomainIds.includes(governedDeviationDomainId) &&
              latestEvent?.domain_id === governedDeviationDomainId &&
              latestEvent.target_id === governedContextBundleAoi &&
              latestEvent.source_mode === 'governed_series' &&
              currentState.deviationSnapshot.suggestions.some(
                (entry) => entry.domain_id === governedDeviationDomainId,
              )
            )
            if (!governedDeviationRestored) {
              return false
            }
            if (!isWpI9RuntimeSmoke) {
              return true
            }
            const latestConnectorRun = currentState.osintSnapshot.latestConnectorRun
            const latestAlert = currentState.osintSnapshot.latestAlert
            return Boolean(
              currentState.osintInputMode === 'governed_connector' &&
                currentState.osintSnapshot.selectedAoi === governedContextBundleAoi &&
                currentState.selectedGovernedConnectorId === governedOsintBundleConnectorId &&
                latestConnectorRun?.connector_id === governedOsintBundleConnectorId &&
                latestAlert?.aggregate_only === true &&
                (latestAlert?.threshold_refs.length ?? 0) > 0 &&
                latestAlert.deviation_event_id === latestEvent.eventId &&
                currentState.mapOsintInspectVisible,
            )
          })
          if (requiresGovernedDeviationForRuntimeSmoke) {
            runtimeSmokeFlow.governedDeviationRestored = true
          }
          if (isWpI9RuntimeSmoke) {
            runtimeSmokeFlow.governedConnectorRestored = true
            runtimeSmokeFlow.restoredConnectorId = governedOsintBundleConnectorId
          }
        }),
      )

      if (runtimeSmokeConfig.requireLiveAi) {
        metrics.push(
          await measure('Governed AI analysis', async () => {
            await waitForCondition(
              'selected bundle availability',
              () =>
                runtimeSmokeStateRef.current.selectedBundle?.bundle_id ===
                runtimeSmokeStateRef.current.selectedBundleId,
              15000,
            )
            await waitForCondition(
              'live AI provider status',
              () =>
                runtimeSmokeStateRef.current.aiProviderStatus.runtime === 'tauri-live' &&
                runtimeSmokeStateRef.current.aiProviderStatus.available,
              120000,
            )
            clickWorkspaceButton('Submit AI Analysis')
            await waitForCondition(
              'governed AI artifact',
              () => {
                const currentState = runtimeSmokeStateRef.current
                return (
                  currentState.latestAiArtifact?.gatewayRuntime === 'tauri-live' &&
                  currentState.latestAiArtifact?.degraded === false &&
                  Boolean(currentState.latestAiArtifact?.artifactId)
                )
              },
              240000,
            )
          }),
        )
      }

      if (runtimeSmokeConfig.requireMcp) {
        metrics.push(
          await measure('Governed MCP invocation', async () => {
            clickWorkspaceButton('Run MCP Tool')
            await waitForCondition(
              'governed MCP invocation',
              () => runtimeSmokeStateRef.current.latestMcpInvocation?.status === 'allowed',
              15000,
            )
          }),
        )
      }

      metrics.push(
        await measure(
          'Offline mode change',
          async () => {
            if (runtimeSmokeStateRef.current.offline) {
              await setForcedOfflineForRuntimeSmoke(false)
              await waitForCondition('temporary online reset', () => !runtimeSmokeStateRef.current.offline)
            }
            await setForcedOfflineForRuntimeSmoke(true)
            await waitForCondition('forced offline enabled', () => runtimeSmokeStateRef.current.offline)
          },
          I1_BUDGETS.stateChangeFeedbackP95Ms,
        ),
      )

      metrics.push(
        await measure('Replay budget probe update', async () => {
          onReplayFrameChange(I1_BUDGETS.panZoomFrameMs + 425)
          await waitForCondition('degraded budget visibility', () =>
            runtimeSmokeStateRef.current.degradedBudgetCount > 0,
          )
        }),
      )

      const firstLayerId = runtimeSmokeStateRef.current.toggleableLayerCatalog[0]?.layerId
      if (firstLayerId) {
        const initialLayerCount = runtimeSmokeStateRef.current.activeLayers.length
        metrics.push(
          await measure(
            'Layer visibility update',
            async () => {
              toggleLayer(firstLayerId)
              await waitForCondition('layer visibility change', () =>
                runtimeSmokeStateRef.current.activeLayers.length !== initialLayerCount,
              )
            },
            I1_BUDGETS.stateChangeFeedbackP95Ms,
          ),
        )
      } else {
        notes.push('No workspace layer was available for the layer-toggle smoke step.')
      }

      metrics.push(
        await measure(
          'Workflow mode change',
          async () => {
            onModeChange('scenario')
            await waitForCondition('scenario mode activation', () => runtimeSmokeStateRef.current.mode === 'scenario')
          },
          I1_BUDGETS.stateChangeFeedbackP95Ms,
        ),
      )

      metrics.push(
        await measure('Scenario fork create (baseline)', async () => {
          await createScenarioForkForRuntimeSmoke(
            `Runtime Smoke ${runtimeSmokeConfig.phase.toUpperCase()} Baseline`,
          )
          await waitForCondition('first scenario fork', () =>
            runtimeSmokeStateRef.current.scenario.scenarios.length >= 1,
          )
        }),
      )

      metrics.push(
        await measure('Scenario fork create (comparison)', async () => {
          await createScenarioForkForRuntimeSmoke(
            `Runtime Smoke ${runtimeSmokeConfig.phase.toUpperCase()} Comparison`,
          )
          await waitForCondition('second scenario fork', () =>
            runtimeSmokeStateRef.current.scenario.scenarios.length >= 2 &&
            Boolean(runtimeSmokeStateRef.current.scenario.comparisonScenarioId),
          )
        }),
      )

      metrics.push(
        await measure('Scenario constraint update', async () => {
          await applyScenarioConstraintForRuntimeSmoke()
          await waitForCondition('scenario constraint application', () => {
            const currentState = runtimeSmokeStateRef.current
            const selectedScenario = currentState.scenario.scenarios.find(
              (entry) => entry.scenarioId === currentState.scenario.selectedScenarioId,
            )
            return Boolean(selectedScenario?.constraints.length)
          })
        }),
      )

      if (isWpI8RuntimeSmoke) {
        metrics.push(
          await measure('Deviation context constraint apply', async () => {
            await applyDeviationContextConstraintForRuntimeSmoke()
          }),
        )
      }

      metrics.push(
        await measure('Scenario compare', async () => {
          await compareScenarioForksForRuntimeSmoke()
          await waitForCondition('scenario comparison summary', () =>
            runtimeSmokeStateRef.current.status.includes('constraint changes'),
          )
        }),
      )

      metrics.push(
        await measure('Scenario export', async () => {
          await exportScenarioBundleForRuntimeSmoke()
          await waitForCondition('scenario export artifact', () =>
            Boolean(runtimeSmokeStateRef.current.scenario.exportArtifact?.artifactId) &&
            Boolean(document.querySelector('[data-testid="scenario-export-card"]')),
          )
        }),
      )

      await backend
        .appendAudit({
          role,
          event_type: 'runtime_smoke.complete',
          payload: {
            phase: runtimeSmokeConfig.phase,
            bundle_id: runtimeSmokeStateRef.current.selectedBundleId || null,
            scenario_export_artifact_id:
              runtimeSmokeStateRef.current.scenario.exportArtifact?.artifactId ?? null,
          },
        })
        .catch(() => {
          // Keep runtime smoke progressing even if the audit append fails.
        })

      const report = await buildReport(metrics, notes)
      await writeRuntimeSmokeEvidence(report)
    } catch (error) {
      await backend
        .appendAudit({
          role,
          event_type: 'runtime_smoke.failed',
          payload: {
            phase: runtimeSmokeConfig.phase,
            detail: String(error),
          },
        })
        .catch(() => {
          // Preserve the original runtime smoke failure below.
        })
      const failureNotes = [...notes, `Runtime smoke failed: ${String(error)}`]
      const failureMetrics = [...metrics]
      const failureReport = await buildReport(failureMetrics, failureNotes)
      try {
        await writeRuntimeSmokeEvidence(failureReport)
      } catch {
        // Preserve the original runtime smoke failure below.
      }
      throw error
    } finally {
      await pause(250)
      try {
        await closeRuntimeSmokeWindow()
      } catch {
        // The launcher will terminate the dev process tree if the window close does not stop it.
      }
    }
  })

  useEffect(() => {
    if (!runtimeSmokeConfig.enabled || !hydrated || runtimeSmokeStarted.current) {
      return
    }
    runtimeSmokeStarted.current = true
    void runRuntimeSmoke().catch((error) => {
      console.error('Runtime smoke failed', error)
    })
  }, [hydrated])

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
            Query matches: {queryResultCount} | Source rows: {querySourceRowCount} | Active saved
            versions: {savedQueryVersions.length}
          </p>
          <p className="status-line">
            Context-linked domains: {versionedQuery.contextDomainIds.length} | Render layer:{' '}
            {queryRenderLayer?.layerId ?? 'pending run'}
          </p>
          <p className="status-line">{querySourceSummary}</p>
          <p className="status-line">{queryExecutionSummary}</p>
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
          <p className="status-line">
            Provider: {aiProviderStatus.providerLabel} | Runtime: {aiProviderStatus.runtime} |{' '}
            {aiProviderStatus.available ? 'live-ready' : 'degraded/unavailable'}
          </p>
          <p className="status-line">Provider detail: {aiProviderStatus.detail}</p>
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
              <small>
                Runtime {latestAiArtifact.gatewayRuntime ?? 'unknown'} | Provider{' '}
                {latestAiArtifact.providerLabel ?? 'unknown'} | Model{' '}
                {latestAiArtifact.providerModel ?? 'unknown'}
              </small>
              {latestAiArtifact.requestId && <small>Provider request {latestAiArtifact.requestId}</small>}
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
          <h2>Main Canvas and Geospatial Runtime</h2>
          <MapRuntimeSurface
            scene={mapRuntimeScene}
            mode={mode}
            degradedBudgetCount={degradedBudgetCount}
            offline={offline}
            onTelemetryChange={setMapRuntimeTelemetry}
          />
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
                {queryRenderLayer.aoi} | Context domains: {queryRenderLayer.contextDomainIds.length} |
                Source rows: {querySourceRowCount}
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

                <article className="surface-card compact" data-testid="constraint-node-panel">
                  <div className="card-header">
                    <strong>Context Constraint Nodes (I8)</strong>
                    <span className="artifact-chip context">Curated Context</span>
                  </div>
                  <p className="status-line">
                    constraint_node domains become modeled inputs in scenario forks; they are not observed evidence.
                  </p>
                  {constraintNodeDomains.length === 0 && (
                    <p>No constraint_node context domains registered.</p>
                  )}
                  <div className="context-card-list">
                    {constraintNodeDomains.map((domain) => {
                      const suggestion = deviationSnapshot.suggestions.find(
                        (entry) => entry.domain_id === domain.domain_id,
                      )
                      const latestRecord =
                        visibleContextRecords
                          .filter(
                            (record) =>
                              record.domain_id === domain.domain_id &&
                              record.target_id === correlationAoi,
                          )
                          .at(-1) ??
                        contextRecords
                          .filter((record) => record.domain_id === domain.domain_id)
                          .sort((left, right) => left.observed_at.localeCompare(right.observed_at))
                          .at(-1)

                      return (
                        <article
                          key={`constraint-node-${domain.domain_id}`}
                          className="context-card"
                          data-testid={`constraint-node-${domain.domain_id}`}
                        >
                          <div className="card-header compact">
                            <strong>{domain.domain_name}</strong>
                            <span>{suggestion ? 'deviation-linked' : 'manual context input'}</span>
                          </div>
                          <p className="status-line">
                            Latest value:{' '}
                            {suggestion?.recommendedValue ?? latestRecord?.numeric_value ?? 'n/a'}{' '}
                            {suggestion?.unit ?? latestRecord?.unit ?? ''}
                          </p>
                          <p className="status-line">
                            Target: {suggestion?.target_id ?? latestRecord?.target_id ?? correlationAoi}
                          </p>
                          <p className="status-line">
                            {suggestion?.rationale ??
                              `Derived from ${domain.domain_name}; apply as a modeled constraint, not direct evidence.`}
                          </p>
                          <button onClick={() => onApplyContextConstraint(domain, suggestion)}>
                            Apply {domain.domain_name} Constraint
                          </button>
                        </article>
                      )
                    })}
                  </div>
                </article>

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
                    <p>{baselineSeries.length} AOI cells in the reference window.</p>
                  </article>
                  <article className="telemetry-card">
                    <span className="metric-label">Event window</span>
                    <strong>{eventWindowLabel}</strong>
                    <p>{eventSeries.length} AOI cells in the event window.</p>
                  </article>
                  <article className="telemetry-card">
                    <span className="metric-label">Total delta</span>
                    <strong>{compareDashboard.totalDelta}</strong>
                    <p>
                      {compareDashboard.increaseCount} increases, {compareDashboard.decreaseCount}{' '}
                      decreases.
                    </p>
                  </article>
                  <article className="telemetry-card">
                    <span className="metric-label">Focus AOI</span>
                    <strong>{compareDashboard.focusAoiLabel}</strong>
                    <p>
                      Swing {compareDashboard.maxAbsoluteDelta} with {contextOverlaySummaries.length}{' '}
                      active context overlays.
                    </p>
                  </article>
                </div>

                <div className="delta-cell-grid">
                  {compareDashboard.cells.map((cell) => (
                    <article key={cell.cell_id} className={`delta-cell ${cell.severity}`}>
                      <div className="card-header compact">
                        <strong>{cell.aoiLabel}</strong>
                        <span className={`policy-pill ${cell.severity === 'decrease' ? 'blocked' : 'allowed'}`}>
                          {cell.severity}
                        </span>
                      </div>
                      <p>
                        AOI {cell.aoiId} | Baseline {cell.baseline} | Event {cell.event}
                      </p>
                      <small>
                        Delta {cell.delta} | Share {cell.shareOfDelta} | Cell {cell.cell_id}
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
                <p className="status-line">{briefingBundleDraft.summary}</p>
                <p className="status-line">
                  Draft export fingerprint: {briefingBundleDraft.exportFingerprint}
                </p>

                {compareArtifact && (
                  <article className="artifact-callout evidence" data-testid="compare-artifact-card">
                    <div className="card-header">
                      <div>
                        <span className={`artifact-chip ${artifactTone('Observed Evidence')}`}>
                          Observed Evidence
                        </span>
                        <h3>{compareArtifact.summary}</h3>
                      </div>
                      <span>{compareArtifact.artifactId}</span>
                    </div>
                    <p>
                      Focus AOI: {compareArtifact.focusAoiLabel} ({compareArtifact.focusAoiId}) |
                      Bundle reference: {compareArtifact.bundleId ?? 'none'}
                    </p>
                    <ul className="finding-list">
                      <li>Export fingerprint: {compareArtifact.exportFingerprint}</li>
                      <li>Delta cell IDs: {compareArtifact.deltaCellIds.join(', ')}</li>
                      <li>Overlay domains: {compareArtifact.overlayDomainIds.join(', ') || 'none'}</li>
                    </ul>
                  </article>
                )}

                {briefingArtifact && briefingBundleArtifact && (
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
                      <li>
                        Focus AOI: {briefingArtifact.focusAoiLabel} ({briefingArtifact.focusAoiId})
                      </li>
                      <li>Overlay domains: {briefingArtifact.overlayDomainIds.join(', ') || 'none'}</li>
                      <li>Compare artifact: {briefingArtifact.compareArtifactId}</li>
                      <li>Export fingerprint: {briefingArtifact.exportFingerprint}</li>
                    </ul>
                    <div className="briefing-element-list">
                      {briefingBundleArtifact.sections.map((section) => (
                        <article key={section.sectionId} className="surface-card compact">
                          <span className={`artifact-chip ${artifactTone(section.artifactLabel)}`}>
                            {section.artifactLabel}
                          </span>
                          <strong>{section.title}</strong>
                          <p>{section.summary}</p>
                          <small>AOI {section.aoiId}</small>
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
                Deviation Domain
                <select
                  value={selectedDeviationDomainKey}
                  onChange={(event) => setSelectedDeviationDomainId(event.target.value)}
                >
                  <option value="">Select active context domain</option>
                  {domains
                    .filter((domain) => activeDomainIds.includes(domain.domain_id))
                    .map((domain) => (
                      <option key={domain.domain_id} value={domain.domain_id}>
                        {domain.domain_name}
                      </option>
                    ))}
                </select>
              </label>
              {selectedDeviationDomain && (
                <p className="status-line">
                  Domain: {selectedDeviationDomain.domain_name} | Target: {correlationAoi} | Records:{' '}
                  {selectedDeviationRecords.length}
                </p>
              )}
              <label className="field">
                Deviation Source
                <select
                  value={deviationInputMode}
                  onChange={(event) =>
                    setDeviationInputMode(event.target.value as DeviationInputMode)
                  }
                >
                  <option value="governed_series">governed_series</option>
                  <option value="manual_override">manual_override</option>
                </select>
              </label>
              {deviationInputMode === 'governed_series' ? (
                <>
                  <label className="field">
                    Baseline Points
                    <input
                      type="number"
                      min={1}
                      step={1}
                      value={deviationBaselinePointCount}
                      onChange={(event) =>
                        setDeviationBaselinePointCount(Number(event.target.value))
                      }
                    />
                  </label>
                  <label className="field">
                    Observed Points
                    <input
                      type="number"
                      min={1}
                      step={1}
                      value={deviationObservedPointCount}
                      onChange={(event) =>
                        setDeviationObservedPointCount(Number(event.target.value))
                      }
                    />
                  </label>
                  {governedDeviationWindow ? (
                    <article className="surface-card compact" data-testid="deviation-window-card">
                      <div className="card-header compact">
                        <span className="artifact-chip context">Governed Window</span>
                        <span>{governedDeviationType}</span>
                      </div>
                      <p>{governedDeviationWindow.baselineReference}</p>
                      <small>
                        Baseline points: {governedDeviationWindow.baseline.length} | Observed points:{' '}
                        {governedDeviationWindow.observed.length} | Source records:{' '}
                        {governedDeviationWindow.baselineRecords.length +
                          governedDeviationWindow.observedRecords.length}
                      </small>
                    </article>
                  ) : (
                    <p className="status-line">
                      Governed window unavailable for the current domain/AOI with the selected point counts.
                    </p>
                  )}
                </>
              ) : (
                <>
                  <label className="field">
                    Baseline Series
                    <input
                      type="text"
                      value={deviationBaselineInput}
                      onChange={(event) => setDeviationBaselineInput(event.target.value)}
                    />
                  </label>
                  <label className="field">
                    Observed Series
                    <input
                      type="text"
                      value={deviationObservedInput}
                      onChange={(event) => setDeviationObservedInput(event.target.value)}
                    />
                  </label>
                </>
              )}
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
                  value={deviationInputMode === 'manual_override' ? deviationType : governedDeviationType}
                  disabled={deviationInputMode !== 'manual_override'}
                  onChange={(event) =>
                    setDeviationType(event.target.value as DeviationEvent['deviation_type'])
                  }
                >
                  <option value="trade_flow">trade_flow</option>
                  <option value="infrastructure">infrastructure</option>
                  <option value="regulatory">regulatory</option>
                </select>
              </label>
              <div className="controls">
                <button onClick={onLoadDeviationDomainSeries}>Load Governed Windows</button>
                <button onClick={onRecordDeviationEvent}>Record Deviation Event</button>
              </div>
              <p className="status-line">
                Deviation:
                {' '}
                {deviationEvent
                  ? `${deviationEvent.deviation_type} (${deviationEvent.score.toFixed(2)})`
                  : 'none'}
              </p>
              {deviationEvent && (
                <>
                  <p className="status-line">
                    Taxonomy: {deviationEvent.taxonomy_key} | Confidence:{' '}
                    {deviationEvent.confidence_score.toFixed(2)}
                  </p>
                  <p className="status-line">
                    Baseline reference: {deviationEvent.baseline_reference}
                  </p>
                </>
              )}
              {deviationSnapshot.latestEvent && (
                <article className="surface-card compact" data-testid="deviation-event-card">
                  <div className="card-header compact">
                    <span className="artifact-chip context">Curated Context</span>
                    <span>{deviationSnapshot.latestEvent.domain_name}</span>
                  </div>
                  <p>{deviationSnapshot.latestEvent.summary}</p>
                  <small>
                    {deviationSnapshot.latestEvent.taxonomy_key} | magnitude:{' '}
                    {deviationSnapshot.latestEvent.deviation_magnitude.toFixed(2)} | target:{' '}
                    {deviationSnapshot.latestEvent.target_id}
                  </small>
                  <small>
                    Source mode: {deviationSnapshot.latestEvent.source_mode} | baseline points:{' '}
                    {deviationSnapshot.latestEvent.baseline_sample_count} | observed points:{' '}
                    {deviationSnapshot.latestEvent.observed_sample_count} | source records:{' '}
                    {deviationSnapshot.latestEvent.source_record_ids.length}
                  </small>
                </article>
              )}
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
          <p className="status-line">Correlated context only; not causal explanation.</p>
          <p className="status-line">
            Active links: {correlationLinks.length} | Query window: {contextQueryRange.start} {'->'}{' '}
            {contextQueryRange.end}
          </p>
          {activeDomainIds.length === 0 && (
            <p className="status-line">Context unavailable; geospatial workspace remains active.</p>
          )}
          <label className="field">
            Approved Domain
            <select
              value={selectedGovernedDomainId}
              onChange={(event) => {
                const nextDomainId = event.target.value
                setSelectedGovernedDomainId(nextDomainId)
                setDomainDraft(createDomainDraft(nextDomainId))
              }}
            >
              {GOVERNED_CONTEXT_DOMAIN_TEMPLATES.map((template) => (
                <option key={template.domain.domain_id} value={template.domain.domain_id}>
                  {template.domain.domain_name} | {template.catalogLabel}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Domain Name
            <input
              type="text"
              value={domainDraft.domain_name}
              readOnly
            />
          </label>
          <label className="field">
            Source URL
            <input
              type="text"
              value={domainDraft.source_url}
              readOnly
            />
          </label>
          <label className="field">
            Presentation Type
            <select
              value={domainDraft.presentation_type}
              onChange={(event) =>
                setDomainDraft((previous) => ({
                  ...previous,
                  presentation_type: event.target.value as ContextDomain['presentation_type'],
                }))
              }
            >
              <option value="map_overlay">map_overlay</option>
              <option value="sidebar_timeseries">sidebar_timeseries</option>
              <option value="dashboard_widget">dashboard_widget</option>
              <option value="constraint_node">constraint_node</option>
            </select>
          </label>
          <label className="field">
            Offline Behavior
            <select
              value={domainDraft.offline_behavior}
              onChange={(event) =>
                setDomainDraft((previous) => ({
                  ...previous,
                  offline_behavior: event.target.value as ContextDomain['offline_behavior'],
                }))
              }
            >
              <option value="pre_cacheable">pre_cacheable</option>
              <option value="online_only">online_only</option>
            </select>
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
          <p className="status-line">
            Governed intake only: source metadata comes from the approved domain registry; presentation
            routing and offline treatment remain analyst-configurable within governed enums.
          </p>
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
              const availability = contextAvailabilitySummaries.find(
                (summary) => summary.domain_id === domain.domain_id,
              )
              const correlationLink = correlationLinks.find((link) => link.domain_id === domain.domain_id)
              const governedTemplate = getGovernedDomainTemplate(domain.domain_id)
              return (
                <article
                  key={domain.domain_id}
                  className="context-card"
                  data-testid={`context-card-${domain.domain_id}`}
                >
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
                  <p className="status-line">Correlated context only.</p>
                  <p className="status-line">
                    {correlationLink?.summary ?? 'AOI-correlated governed context link active.'}
                  </p>
                  <p className="status-line">
                    Offline policy: {domain.offline_behavior} | Correlation target: {correlationAoi}
                  </p>
                  <p className="status-line">
                    Snapshot: {governedTemplate?.snapshot.snapshotId ?? 'restored bundle context'} |
                    Retrieved {governedTemplate?.snapshot.retrievedAt ?? 'from bundle'}
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
                  {availability?.latest_record && (
                    <p className="status-line">
                      Latest value: {availability.latest_record.value_label} @{' '}
                      {availability.latest_record.observed_at}
                    </p>
                  )}
                  <p className="status-line">
                    {availability?.status_line ?? 'Context unavailable for the active AOI/time window.'}
                  </p>
                  <p className="status-line">
                    {availability?.staleness_line ?? `Expected cadence: ${domain.update_cadence}`}
                  </p>
                  <small>{domain.methodology_notes}</small>
                </article>
              )
            })}
          </div>

          <h3>OSINT Aggregation (I9)</h3>
          <label className="field">
            OSINT Input Mode
            <select
              value={osintInputMode}
              onChange={(event) => setOsintInputMode(event.target.value as OsintSourceMode)}
            >
              {OSINT_SOURCE_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </label>
          {osintInputMode === 'governed_connector' ? (
            <>
              <label className="field">
                Curated Feed Connector
                <select
                  value={selectedGovernedConnectorId}
                  onChange={(event) => setSelectedGovernedConnectorId(event.target.value)}
                >
                  {[
                    DEFAULT_GOVERNED_FEED_CONNECTOR_ID,
                    'regulatory-pressure-watch',
                    'commodity-shock-watch',
                  ]
                    .map((connectorId) =>
                      getGovernedFeedConnectorTemplate(connectorId as GovernedFeedConnectorId),
                    )
                    .filter((connector): connector is NonNullable<typeof connector> => Boolean(connector))
                    .map((connector) => (
                      <option key={connector.connector_id} value={connector.connector_id}>
                        {connector.connector_label}
                      </option>
                    ))}
                </select>
              </label>
              <article className="surface-card compact" data-testid="osint-connector-card">
                <div className="card-header compact">
                  <span className="artifact-chip context">Curated Context</span>
                  <span>{selectedGovernedConnector?.catalog_label ?? 'Governed connector'}</span>
                </div>
                <strong>{selectedGovernedConnector?.connector_label ?? 'Governed connector'}</strong>
                <p>{selectedGovernedConnector?.connector_note ?? 'Select a governed connector.'}</p>
                <small>
                  Sources {selectedGovernedConnector?.allowed_sources.join(', ') ?? 'n/a'} | Offline{' '}
                  {selectedGovernedConnector?.offline_behavior ?? 'n/a'} | Domains{' '}
                  {selectedGovernedConnector?.domain_ids
                    .map(
                      (domainId) =>
                        domains.find((domain) => domain.domain_id === domainId)?.domain_name ?? domainId,
                    )
                    .join(', ') ?? 'n/a'}
                </small>
              </article>
            </>
          ) : (
            <>
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
                Category
                <select
                  value={osintCategory}
                  onChange={(event) => setOsintCategory(event.target.value as OsintEventCategory)}
                >
                  {OSINT_EVENT_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                Event Summary
                <textarea
                  value={osintSummaryInput}
                  onChange={(event) => setOsintSummaryInput(event.target.value)}
                  rows={3}
                />
              </label>
            </>
          )}
          <label className="field">
            AOI
            <input
              type="text"
              value={osintAoi}
              onChange={(event) => setOsintAoi(event.target.value)}
            />
          </label>
          <label className="field">
            Threshold Domain
            <select
              value={selectedOsintThresholdDomainKey}
              onChange={(event) => setSelectedOsintThresholdDomainId(event.target.value)}
            >
              <option value="">Select active context domain</option>
              {domains
                .filter((domain) => activeDomainIds.includes(domain.domain_id))
                .map((domain) => (
                  <option key={domain.domain_id} value={domain.domain_id}>
                    {domain.domain_name}
                  </option>
                ))}
            </select>
          </label>
          <label className="field">
            Threshold Comparator
            <select
              value={osintThresholdComparator}
              onChange={(event) =>
                setOsintThresholdComparator(event.target.value as ThresholdComparator)
              }
            >
              {THRESHOLD_COMPARATORS.map((comparator) => (
                <option key={comparator} value={comparator}>
                  {comparator}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Threshold Value
            <input
              type="number"
              value={osintThresholdValueInput}
              onChange={(event) => setOsintThresholdValueInput(event.target.value)}
            />
          </label>
          <div className="controls">
            {osintInputMode === 'governed_connector' ? (
              <button onClick={onRunGovernedConnector}>Run Governed Connector</button>
            ) : (
              <button onClick={onAddOsintEvent}>Add Manual OSINT Event</button>
            )}
            <button onClick={onLinkOsintThreshold}>Link Context Threshold</button>
          </div>
          <p className="status-line">
            {osintInputMode === 'governed_connector'
              ? 'Primary path: approved curated connectors materialize aggregate AOI alerts from governed context and deviation state.'
              : 'Manual override remains available as an explicit analyst-entered fallback.'}
          </p>
          <p className="status-line">
            Alerts in {osintAoi}: {osintSummary.count}
            {' '}
            (confirmed {osintSummary.verificationBreakdown.confirmed} | reported{' '}
            {osintSummary.verificationBreakdown.reported} | alleged{' '}
            {osintSummary.verificationBreakdown.alleged})
          </p>
          <article className="surface-card compact" data-testid="osint-alert-card">
            <div className="card-header compact">
              <span className="artifact-chip context">Curated Context</span>
              <span>{osintSummary.aggregate_only ? 'aggregate-only AOI alert' : 'alert'}</span>
            </div>
            <p>{osintSummary.summary}</p>
            <small>
              AOI {osintSummary.aoi} | Threshold refs {osintSummary.threshold_refs.length} | Entity
              pursuit blocked
            </small>
            {osintSnapshot.latestConnectorRun && (
              <small>
                Connector {osintSnapshot.latestConnectorRun.connector_label} | Domains{' '}
                {osintSnapshot.latestConnectorRun.domain_ids.join(', ') || 'n/a'} | Generated{' '}
                {osintSnapshot.latestConnectorRun.generated_at}
              </small>
            )}
            <div className="overlay-grid">
              {osintSummary.threshold_refs.length === 0 && (
                <article className="surface-card compact">
                  <strong>No linked thresholds</strong>
                  <p>Link an active context domain to correlate alerting with contextual conditions.</p>
                </article>
              )}
              {osintSummary.threshold_refs.map((thresholdRef) => (
                <article
                  key={thresholdRef.threshold_id}
                  className="surface-card compact"
                  data-testid="osint-threshold-card"
                >
                  <strong>{thresholdRef.domain_name}</strong>
                  <p>
                    {thresholdRef.comparator} {thresholdRef.threshold_value} {thresholdRef.unit}
                  </p>
                  <small>{thresholdRef.reference_note}</small>
                </article>
              ))}
            </div>
          </article>
          <div className="context-card-list">
            {osintSnapshot.events.filter((event) => event.aoi === osintAoi).length === 0 && (
              <p>No curated OSINT events recorded for the selected AOI.</p>
            )}
            {osintSnapshot.events
              .filter((event) => event.aoi === osintAoi)
              .slice()
              .reverse()
              .map((event) => (
                <article
                  key={event.event_id}
                  className="context-card"
                  data-testid="osint-event-card"
                >
                  <div className="card-header compact">
                    <span className="artifact-chip context">{event.artifact_label}</span>
                    <span className={`artifact-chip ${event.verification}`}>{event.verification}</span>
                  </div>
                  <strong>{event.source}</strong>
                  <p>{event.summary}</p>
                  <small>
                    {event.category} | AOI {event.aoi} | Mode {event.source_mode ?? 'manual_override'} |
                    Retrieved {event.retrieved_at}
                  </small>
                </article>
              ))}
          </div>

          <h3>Strategic Model (I10)</h3>
          <div className="overlay-grid">
            <article className="surface-card compact" data-testid="game-model-card">
              <div className="card-header compact">
                <span className={`artifact-chip ${artifactTone('Modeled Output')}`}>
                  Modeled Output
                </span>
                <span>{gameModelStateForRecorder.model.game_id}</span>
              </div>
              <label className="field">
                Game Name
                <input
                  type="text"
                  value={gameNameInput}
                  onChange={(event) => setGameNameInput(event.target.value)}
                />
              </label>
              <label className="field">
                Game Type
                <select
                  value={gameTypeInput}
                  onChange={(event) => setGameTypeInput(event.target.value as GameType)}
                >
                  {GAME_TYPES.map((gameType) => (
                    <option key={gameType} value={gameType}>
                      {gameType}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                Assumption
                <input
                  type="text"
                  value={gameAssumptionInput}
                  onChange={(event) => setGameAssumptionInput(event.target.value)}
                />
              </label>
              <label className="field">
                Game Scenario Link
                <select
                  value={selectedGameScenarioId ?? ''}
                  onChange={(event) =>
                    setGameModelSnapshot(
                      setSelectedGameScenario(
                        gameModelStateForRecorder,
                        event.target.value || undefined,
                      ),
                    )
                  }
                >
                  <option value="">No linked scenario</option>
                  {scenario.scenarios.map((entry) => (
                    <option key={entry.scenarioId} value={entry.scenarioId}>
                      {entry.title}
                    </option>
                  ))}
                </select>
              </label>
              <p>
                Version {gameModelStateForRecorder.model.version} | Bundle refs{' '}
                {gameModelStateForRecorder.model.bundle_refs.length}
              </p>
              <p>{gameModelStateForRecorder.model.non_operational_notice}</p>
              <div className="button-row">
                <button onClick={onUpdateGameModel}>Update Game Model</button>
                <button onClick={onAddGameAssumption}>Add Assumption</button>
              </div>
            </article>

            <article className="surface-card compact">
              <strong>Strategic Actors / Objectives / Actions</strong>
              <label className="field">
                Actor Label
                <input
                  type="text"
                  value={gameActorLabelInput}
                  onChange={(event) => setGameActorLabelInput(event.target.value)}
                />
              </label>
              <label className="field">
                Actor Type
                <select
                  value={gameActorTypeInput}
                  onChange={(event) => setGameActorTypeInput(event.target.value as ActorType)}
                >
                  {ACTOR_TYPES.map((actorType) => (
                    <option key={actorType} value={actorType}>
                      {actorType}
                    </option>
                  ))}
                </select>
              </label>
              <button onClick={onAddGameActor}>Add Strategic Actor</button>
              <label className="field">
                Objective Label
                <input
                  type="text"
                  value={gameObjectiveLabelInput}
                  onChange={(event) => setGameObjectiveLabelInput(event.target.value)}
                />
              </label>
              <label className="field">
                Objective Weight
                <input
                  type="number"
                  step="0.1"
                  value={gameObjectiveWeightInput}
                  onChange={(event) => setGameObjectiveWeightInput(event.target.value)}
                />
              </label>
              <button onClick={onAddGameObjective}>Add Strategic Objective</button>
              <label className="field">
                Action Label
                <input
                  type="text"
                  value={gameActionLabelInput}
                  onChange={(event) => setGameActionLabelInput(event.target.value)}
                />
              </label>
              <label className="field">
                Action Category
                <select
                  value={gameActionCategoryInput}
                  onChange={(event) =>
                    setGameActionCategoryInput(event.target.value as ActionCategory)
                  }
                >
                  {ACTION_CATEGORIES.map((actionCategory) => (
                    <option key={actionCategory} value={actionCategory}>
                      {actionCategory}
                    </option>
                  ))}
                </select>
              </label>
              <button onClick={onAddGameAction}>Add Strategic Action</button>
            </article>

            <article className="surface-card compact">
              <strong>Scenario Tree / Solver</strong>
              <label className="field">
                Branch Label
                <input
                  type="text"
                  value={gameNodeLabelInput}
                  onChange={(event) => setGameNodeLabelInput(event.target.value)}
                />
              </label>
              <label className="field">
                Branch Type
                <select
                  value={gameNodeTypeInput}
                  onChange={(event) =>
                    setGameNodeTypeInput(event.target.value as ScenarioTreeNodeType)
                  }
                >
                  {SCENARIO_TREE_NODE_TYPES.map((nodeType) => (
                    <option key={nodeType} value={nodeType}>
                      {nodeType}
                    </option>
                  ))}
                </select>
              </label>
              <button onClick={onLinkScenarioTreeNode}>Link Scenario Branch</button>
              <label className="field">
                Solver Method
                <select
                  value={gameSolverMethodInput}
                  onChange={(event) =>
                    setGameSolverMethodInput(event.target.value as SolverMethod)
                  }
                >
                  {SOLVER_METHODS.map((solverMethod) => (
                    <option key={solverMethod} value={solverMethod}>
                      {solverMethod}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                Solver Seed
                <input
                  type="number"
                  value={gameSolverSeedInput}
                  onChange={(event) => setGameSolverSeedInput(event.target.value)}
                />
              </label>
              <label className="field">
                Monte Carlo Samples
                <input
                  type="number"
                  value={gameMonteCarloSamplesInput}
                  onChange={(event) => setGameMonteCarloSamplesInput(event.target.value)}
                />
              </label>
              <button onClick={onRunGameSolver}>Run Strategic Solver</button>
            </article>
          </div>
          <p className="status-line" data-testid="game-model-status">
            Model valid: {gameModelValid ? 'yes' : 'no'} | Actors{' '}
            {gameModelStateForRecorder.model.actors.length} | Actions{' '}
            {gameModelStateForRecorder.model.actions.length} | Payoff proxy {payoffProxy.metric} [
            {payoffProxy.uncertainty[0]}, {payoffProxy.uncertainty[1]}]
          </p>
          <div className="context-card-list">
            {gameModelStateForRecorder.scenario_tree.nodes.length === 0 && (
              <p>No scenario-tree branches linked yet.</p>
            )}
            {gameModelStateForRecorder.scenario_tree.nodes.map((node) => (
              <article
                key={node.node_id}
                className="context-card"
                data-testid="game-tree-node-card"
              >
                <div className="card-header compact">
                  <span className={`artifact-chip ${artifactTone('Modeled Output')}`}>
                    {node.node_type}
                  </span>
                  <span>{node.node_id}</span>
                </div>
                <strong>{node.label}</strong>
                <p>
                  Scenario {node.scenario_fork_id ?? 'unlinked'} | Parent{' '}
                  {node.parent_node_id ?? 'root'}
                </p>
                <small>{node.chance_note ?? gameModelStateForRecorder.scenario_tree.export_summary}</small>
              </article>
            ))}
          </div>
          {gameModelStateForRecorder.solver_runs.at(-1) && (
            <article className="surface-card compact" data-testid="game-solver-card">
              <div className="card-header compact">
                <span className={`artifact-chip ${artifactTone('Modeled Output')}`}>
                  Modeled Output
                </span>
                <span>{gameModelStateForRecorder.solver_runs.at(-1)?.run_id}</span>
              </div>
              <p>{gameModelStateForRecorder.solver_runs.at(-1)?.robust_summary}</p>
              <small>
                Seed {gameModelStateForRecorder.solver_runs.at(-1)?.random_seed} | Method{' '}
                {gameModelStateForRecorder.solver_runs.at(-1)?.method} | Result hash{' '}
                {gameModelStateForRecorder.solver_runs.at(-1)?.result_manifest_hash}
              </small>
            </article>
          )}
          {gameModelStateForRecorder.latest_voi_estimate && (
            <article className="surface-card compact" data-testid="game-voi-card">
              <strong>Value of Information</strong>
              <p>{gameModelStateForRecorder.latest_voi_estimate.recommendation}</p>
              <small>
                Target {gameModelStateForRecorder.latest_voi_estimate.target} | Reduction{' '}
                {gameModelStateForRecorder.latest_voi_estimate.uncertainty_reduction_pct}%
              </small>
            </article>
          )}
          {gameModelStateForRecorder.experiment_bundle && (
            <article className="surface-card compact" data-testid="game-experiment-card">
              <strong>{gameModelStateForRecorder.experiment_bundle.experiment_bundle_id}</strong>
              <p>{gameModelStateForRecorder.experiment_bundle.summary}</p>
              <small>
                Bundles {gameModelStateForRecorder.experiment_bundle.snapshot_bundle_refs.join(', ') || 'none'} |
                Solver runs {gameModelStateForRecorder.experiment_bundle.solver_run_ids.length}
              </small>
            </article>
          )}

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
          {`Mode=${mode} | Connectivity=${offline ? 'offline' : 'online'} | Audit events=${auditEvents.length} | Query matches=${queryResultCount} | Degraded budgets=${degradedBudgetCount}`}
        </span>
      </footer>
    </div>
  )
}

export default App
