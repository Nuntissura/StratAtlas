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
import { ARTIFACT_LABELS, artifactTone, buildWorkspaceLayerCatalog } from './features/i1/layers'
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
import { runQuery, bumpQueryVersion, type VersionedQuery } from './features/i5/queryBuilder'
import type { QueryCondition, QueryOperator } from './features/i5/queryBuilder'
import { submitAiAnalysis } from './features/i6/aiGateway'
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
  version: 1,
  conditions: [{ field: 'speed', operator: 'greater_than', value: 20 }],
}
const DEFAULT_BASELINE_WINDOW_LABEL = '2026-Q1 baseline'
const DEFAULT_EVENT_WINDOW_LABEL = '2026-Q2 event'
const DEFAULT_BASELINE_INPUT = '10,12,16,21,30'
const DEFAULT_EVENT_INPUT = '8,18,20,26,31'
const DEFAULT_CORRELATION_AOI = 'aoi-1'
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
    .map((entry) => {
      const operator = entry.operator
      return {
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
    version: normalizeNumber(value.version, DEFAULT_QUERY.version),
    conditions: normalizeQueryConditions(value.conditions),
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
}: {
  definition: VersionedQuery
  queryResult: Record<string, unknown>[]
  sourceRowCount: number
}): QueryStateSnapshot => ({
  definition,
  resultCount: queryResult.length,
  sourceRowCount,
  matchedRowIds: queryResult
    .map((row) => row.id)
    .filter((value): value is number => typeof value === 'number'),
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
      { id: 1, speed: 14, type: 'vessel', region: 'aoi-1' },
      { id: 2, speed: 37, type: 'vessel', region: 'aoi-1' },
      { id: 3, speed: 48, type: 'aircraft', region: 'aoi-2' },
      { id: 4, speed: 61, type: 'vessel', region: 'aoi-3' },
    ],
    [],
  )

  const queryResult = useMemo(
    () => runQuery(versionedQuery.conditions, queryRows),
    [queryRows, versionedQuery.conditions],
  )
  const querySnapshot = useMemo(
    () =>
      buildQueryStateSnapshot({
        definition: versionedQuery,
        queryResult,
        sourceRowCount: queryRows.length,
      }),
    [queryResult, queryRows.length, versionedQuery],
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
        aiSummaryAvailable: Boolean(aiSummary),
        degradeRendering,
        modelUncertaintyText: `Payoff range [${payoffProxy.uncertainty[0]}, ${payoffProxy.uncertainty[1]}]`,
      }),
    [activeDomainIds, activeLayers, aiSummary, degradeRendering, domains, payoffProxy.uncertainty],
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
      selectedBundleId: selectedBundleId || undefined,
    }),
    [compareSnapshot, contextSnapshot, querySnapshot, selectedBundleId, workspaceSnapshot],
  )

  const applyRecorderState = (state: RecorderState, openedBundleId?: string): void => {
    const workspace = isRecord(state.workspace)
      ? state.workspace
      : ({} as Record<string, unknown>)
    const query = isRecord(state.query) ? state.query : ({} as Record<string, unknown>)
    const context = isRecord(state.context) ? state.context : ({} as Record<string, unknown>)
    const compare = normalizeCompareSnapshot(state.compare)
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
      setVersionedQuery(normalizeVersionedQuery(query.definition))
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

  const onSaveQueryVersion = () => {
    const startedAt = beginMeasuredAction('Query version save')
    const next = bumpQueryVersion(versionedQuery)
    setVersionedQuery(next)
    void backend
      .appendAudit({
        role,
        event_type: 'query.version_saved',
        payload: {
          query_id: next.queryId,
          version: next.version,
          conditions_count: next.conditions.length,
        },
      })
      .then(() => refresh())
      .then(() => {
        completeMeasuredAction('Query version save', startedAt)
      })
      .catch(() => {
        setStatus('Query version saved locally; audit append unavailable.')
        completeMeasuredAction('Query version save', startedAt)
      })
  }

  const onUpdateQueryThreshold = (threshold: number) => {
    const startedAt = beginMeasuredAction('Query threshold update')
    setVersionedQuery((previous) => ({
      ...previous,
      conditions: [{ field: 'speed', operator: 'greater_than', value: threshold }],
    }))
    completeMeasuredAction('Query threshold update', startedAt)
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

  const onSubmitAiSummary = () => {
    const startedAt = beginMeasuredAction('AI interpretation update')
    const selectedBundle = bundles.find((bundle) => bundle.bundle_id === selectedBundleId)
    if (!selectedBundle) {
      setAiSummary('Select a bundle before AI analysis.')
      completeMeasuredAction('AI interpretation update', startedAt)
      return
    }
    try {
      const firstAsset = selectedBundle.assets[0]
      const result = submitAiAnalysis({
        role,
        allowed: !offline,
        prompt: aiPrompt,
        refs: [
          {
            bundle_id: selectedBundle.bundle_id,
            asset_id: firstAsset?.asset_id ?? 'workspace-state',
            sha256: firstAsset?.sha256 ?? selectedBundle.ui_state_hash,
          },
        ],
      })
      setAiSummary(result.content)
      completeMeasuredAction('AI interpretation update', startedAt)
    } catch (error) {
      setAiSummary(String(error))
      completeMeasuredAction('AI interpretation update', startedAt)
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
            Minimum Speed
            <input
              type="number"
              value={Number(versionedQuery.conditions[0]?.value ?? 20)}
              onChange={(event) => onUpdateQueryThreshold(Number(event.target.value))}
            />
          </label>
          <div className="controls">
            <button onClick={onSaveQueryVersion}>Save Query Version</button>
          </div>
          <p className="status-line">Query matches: {queryResult.length}</p>

          <h3>AI Gateway (I6)</h3>
          <label className="field">
            Prompt
            <textarea value={aiPrompt} onChange={(event) => setAiPrompt(event.target.value)} rows={3} />
          </label>
          <div className="controls">
            <button onClick={onSubmitAiSummary}>Submit AI Analysis</button>
          </div>
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
