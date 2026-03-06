import { beforeEach, describe, expect, it } from 'vitest'
import { backend } from './backend'
import type { CreateBundleRequest, QueryStateSnapshot } from '../contracts/i0'
import {
  DEFAULT_COLLABORATION_ARTIFACT_ID,
  createCollaborationSnapshot,
  setEphemeralViewState,
  upsertSharedArtifact,
} from '../features/i3/collaboration'
import {
  addHypotheticalEntity,
  createScenarioFork,
  createScenarioState,
  exportScenarioBundle,
  setScenarioExportArtifact,
  setConstraint,
} from '../features/i4/scenarios'
import {
  buildQueryRenderLayer,
  buildSavedQueryArtifact,
  type VersionedQuery,
} from '../features/i5/queryBuilder'
import type { AiGatewaySnapshot } from '../features/i6/aiGateway'
import {
  buildContextTimeRange,
  buildCorrelationLinks,
  buildSampleContextRecords,
  type ContextDomain,
} from '../features/i7/contextIntake'
import { createDeviationSnapshot, detectDeviation, pushDeviationEvent } from '../features/i8/deviation'
import {
  buildContextThresholdRef,
  buildOsintEvent,
  createOsintSnapshot,
  pushContextThresholdRef,
  pushOsintEvent,
} from '../features/i9/osint'

const buildStoredCollaborationSnapshot = (sharedNote: string, viewState: string) => {
  let snapshot = createCollaborationSnapshot('collab-main', 'analyst-1')
  snapshot = upsertSharedArtifact(snapshot, {
    actorId: 'analyst-1',
    artifactId: DEFAULT_COLLABORATION_ARTIFACT_ID,
    content: sharedNote,
  })
  snapshot = setEphemeralViewState(snapshot, {
    actorId: 'analyst-1',
    viewState,
  })
  return snapshot
}

const buildStoredScenarioSnapshot = () => {
  let snapshot = createScenarioState('bundle-parent')
  snapshot = createScenarioFork(snapshot, {
    title: 'Baseline scenario',
    parentBundleId: 'bundle-parent',
    now: '2026-03-06T00:00:00.000Z',
    provenanceSummary: 'Bundle bundle-parent baseline',
  })
  const baselineScenarioId = snapshot.selectedScenarioId
  snapshot = setConstraint(snapshot, baselineScenarioId, {
    constraintId: 'port_capacity',
    label: 'Port Capacity',
    value: 72,
    unit: 'index',
    rationale: 'Nominal throughput',
    propagationWeight: 1.4,
    now: '2026-03-06T00:05:00.000Z',
  })
  snapshot = createScenarioFork(snapshot, {
    title: 'Surge scenario',
    parentBundleId: 'bundle-parent',
    parentScenarioId: baselineScenarioId,
    now: '2026-03-06T00:10:00.000Z',
    provenanceSummary: 'Forked from baseline',
  })
  snapshot = setConstraint(snapshot, snapshot.selectedScenarioId, {
    constraintId: 'port_capacity',
    label: 'Port Capacity',
    value: 48,
    unit: 'index',
    rationale: 'Congested under surge',
    propagationWeight: 1.4,
    now: '2026-03-06T00:15:00.000Z',
  })
  snapshot = addHypotheticalEntity(snapshot, snapshot.selectedScenarioId, {
    entityId: 'entity-b',
    name: 'Floating depot',
    entityType: 'asset',
    changeSummary: 'Introduces temporary fuel storage',
    provenanceSource: 'Curated logistics brief',
    confidence: 'B',
    now: '2026-03-06T00:16:00.000Z',
  })
  return setScenarioExportArtifact(
    snapshot,
    exportScenarioBundle(snapshot, {
      leftScenarioId: baselineScenarioId,
      rightScenarioId: snapshot.selectedScenarioId,
      offline: true,
    }),
  )
}

const buildStoredQueryState = (): QueryStateSnapshot => {
  const definition: VersionedQuery = {
    queryId: 'query-main',
    title: 'Saved port watch',
    version: 3,
    aoi: 'aoi-1',
    timeWindow: {
      startHour: 8,
      endHour: 18,
    },
    contextDomainIds: ['ctx-1'],
    provenanceSource: 'Backend snapshot',
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
  const rows = [
    { id: 1, speed: 14, region: 'aoi-1', hour: 7, context_domains: ['ctx-1'] },
    { id: 2, speed: 37, region: 'aoi-1', hour: 10, context_domains: ['ctx-1'] },
    { id: 3, speed: 48, region: 'aoi-2', hour: 11, context_domains: ['ctx-1', 'ctx-2'] },
    { id: 4, speed: 61, region: 'aoi-3', hour: 15, context_domains: ['ctx-2'] },
  ]
  const matchedRows = rows.filter(
    (row) =>
      row.region === definition.aoi &&
      row.hour >= definition.timeWindow.startHour &&
      row.hour <= definition.timeWindow.endHour &&
      row.speed > 20 &&
      definition.contextDomainIds.every((domainId) => row.context_domains.includes(domainId)),
  )
  const renderLayer = buildQueryRenderLayer(definition, matchedRows)

  return {
    definition,
    resultCount: matchedRows.length,
    sourceRowCount: rows.length,
    matchedRowIds: matchedRows.map((row) => row.id),
    savedVersions: [definition],
    renderLayer,
    savedArtifact: buildSavedQueryArtifact(definition, renderLayer, {
      savedAt: '2026-03-06T00:00:00.000Z',
    }),
  }
}

const buildStoredAiSnapshot = (): AiGatewaySnapshot => ({
  deploymentProfile: 'connected',
  latestAnalysis: {
    artifactId: 'ai-interpretation-test1234',
    bundleId: 'bundle-parent',
    label: 'AI-Derived Interpretation',
    marking: 'INTERNAL',
    refs: [
      {
        bundle_id: 'bundle-parent',
        asset_id: 'workspace-state',
        sha256: 'workspace-hash',
        marking: 'INTERNAL',
        licenses: ['internal'],
        sourceSummary: 'workspace.session',
      },
    ],
    citations: ['bundle-parent / workspace-state / workspace-hash'],
    prompt: 'Summarize governed evidence only.',
    content: 'Interpreted governed evidence for bundle-parent.',
    generatedAt: '2026-03-06T00:20:00.000Z',
    confidenceText: 'Derived interpretation; analyst validation required',
    uncertaintyText: 'Inference only; do not treat as observed evidence.',
    lineage: ['gateway:connected', 'refs:1'],
  },
  latestMcpInvocation: {
    invocationId: 'mcp-test1234',
    toolName: 'get_bundle_manifest',
    status: 'allowed',
    summary: 'Returned governed manifest for bundle bundle-parent with 1 assets.',
    bundleRefs: [
      {
        bundle_id: 'bundle-parent',
        asset_id: 'workspace-state',
        sha256: 'workspace-hash',
      },
    ],
    invokedAt: '2026-03-06T00:21:00.000Z',
    resultPreview: 'Returned governed manifest for bundle bundle-parent with 1 assets.',
  },
})

const buildStoredContextSnapshot = ({
  domains,
  activeDomainIds,
  correlationAoi,
  startHour = 8,
  endHour = 18,
}: {
  domains: ContextDomain[]
  activeDomainIds: string[]
  correlationAoi: string
  startHour?: number
  endHour?: number
}) => {
  const queryRange = buildContextTimeRange({
    startHour,
    endHour,
  })

  return {
    domains,
    activeDomainIds,
    correlationAoi,
    correlationLinks: buildCorrelationLinks({
      domains,
      activeDomainIds,
      correlationAoi,
      timeRange: queryRange,
    }),
    records: domains.flatMap((domain) =>
      buildSampleContextRecords({
        domain,
        targetId: correlationAoi,
        timeRange: queryRange,
      }),
    ),
    queryRange,
  }
}

const buildStoredDeviationSnapshot = () => {
  const event = detectDeviation(
    [
      { ts: '2026-03-06T08:00:00.000Z', value: 100 },
      { ts: '2026-03-06T10:00:00.000Z', value: 104 },
    ],
    [
      { ts: '2026-03-06T12:00:00.000Z', value: 62 },
      { ts: '2026-03-06T14:00:00.000Z', value: 58 },
    ],
    0.2,
    'infrastructure',
    {
      domainId: 'ctx-1',
      domainName: 'Port Throughput',
      targetId: 'aoi-1',
      confidenceBaseline: 'A',
    },
  )

  const snapshot = createDeviationSnapshot()
  return event ? pushDeviationEvent(snapshot, event) : snapshot
}

const buildStoredOsintSnapshot = () => {
  const snapshot = createOsintSnapshot('aoi-1')
  const event = buildOsintEvent({
    source: 'ACLED',
    verification: 'alleged',
    aoi: 'aoi-1',
    category: 'conflict_event',
    summary: 'Curated disruption summary for aoi-1.',
    retrievedAt: '2026-03-06T16:00:00.000Z',
  })
  const thresholdRef = buildContextThresholdRef({
    domain: {
      domain_id: 'ctx-1',
      domain_name: 'Port Throughput',
      domain_class: 'economic_indicator',
      source_name: 'UNCTAD',
      source_url: 'https://example.test/context',
      license: 'public',
      update_cadence: 'monthly',
      spatial_binding: 'aoi_correlated',
      temporal_resolution: 'monthly',
      sensitivity_class: 'PUBLIC',
      confidence_baseline: 'A',
      methodology_notes: 'Official aggregation',
      offline_behavior: 'pre_cacheable',
      presentation_type: 'map_overlay',
      prohibited_uses: ['MUST NOT be used for individual entity tracking'],
    },
    comparator: 'below',
    thresholdValue: 15,
    unit: 'index',
    referenceNote: 'Aggregate-only AOI alert reference for aoi-1; not entity pursuit.',
  })

  return pushContextThresholdRef(pushOsintEvent(snapshot, event, 'aoi-1'), thresholdRef, 'aoi-1')
}

const request: CreateBundleRequest = {
  role: 'analyst',
  marking: 'INTERNAL',
  state: {
    workspace: {
      mode: 'Offline',
      workflowMode: 'replay',
      note: 'seed state',
      activeLayers: ['base-map'],
      replayCursor: 42,
      forcedOffline: true,
      uiVersion: 'i0-recorder-hardening',
    },
    query: buildStoredQueryState(),
    context: buildStoredContextSnapshot({
      domains: [
        {
          domain_id: 'ctx-1',
          domain_name: 'Port Throughput',
          domain_class: 'economic_indicator',
          source_name: 'UNCTAD',
          source_url: 'https://example.test/context',
          license: 'public',
          update_cadence: 'monthly',
          spatial_binding: 'aoi_correlated',
          temporal_resolution: 'monthly',
          sensitivity_class: 'PUBLIC',
          confidence_baseline: 'A',
          methodology_notes: 'Official aggregation',
          offline_behavior: 'pre_cacheable',
          presentation_type: 'map_overlay',
          prohibited_uses: ['MUST NOT be used for individual entity tracking'],
        },
      ],
      activeDomainIds: ['ctx-1'],
      correlationAoi: 'aoi-1',
    }),
    compare: {
      baselineWindow: {
        start: '2026-01-01',
        end: '2026-01-31',
        label: 'Baseline 2026-01-01 -> 2026-01-31',
      },
      eventWindow: {
        start: '2026-02-01',
        end: '2026-02-28',
        label: 'Event 2026-02-01 -> 2026-02-28',
      },
      baselineSeries: [10, 12, 16],
      eventSeries: [8, 18, 20],
    },
    collaboration: buildStoredCollaborationSnapshot('alpha / bravo', 'zoom-8'),
    scenario: buildStoredScenarioSnapshot(),
    ai: buildStoredAiSnapshot(),
    deviation: buildStoredDeviationSnapshot(),
    osint: buildStoredOsintSnapshot(),
    selectedBundleId: undefined,
    savedAt: '2026-03-06T00:00:00.000Z',
  },
  provenance_refs: [
    {
      source: 'test',
      license: 'internal',
      retrievedAt: '2026-03-05T00:00:00.000Z',
      pipelineVersion: 'test',
    },
  ],
}

describe('backend fallback', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('creates and reopens bundles deterministically', async () => {
    const manifest = await backend.createBundle(request)
    const reopen = await backend.openBundle(manifest.bundle_id, 'analyst')
    expect(reopen.manifest.bundle_id).toBe(manifest.bundle_id)
    expect(reopen.manifest.ui_state_hash).toBe(manifest.ui_state_hash)
    expect(manifest.assets.map((asset) => asset.asset_id)).toEqual([
      'workspace-state',
      'query-state',
      'context-snapshot',
      'compare-state',
      'collaboration-state',
      'scenario-state',
      'ai-state',
      'deviation-state',
      'osint-state',
      'recorder-state',
    ])
    expect(reopen.state.workspace.note).toBe('seed state')
    expect(reopen.state.workspace.replayCursor).toBe(42)
    expect(reopen.state.query.definition.version).toBe(3)
    expect(reopen.state.context.activeDomainIds).toEqual(['ctx-1'])
    expect(reopen.state.context.correlationLinks).toHaveLength(1)
    expect(reopen.state.context.correlationLinks?.[0].target_id).toBe('aoi-1')
    expect(reopen.state.context.records).toHaveLength(4)
    expect(reopen.state.context.queryRange?.start).toBe('2026-03-06T08:00:00.000Z')
    expect(reopen.state.compare?.baselineSeries).toEqual([10, 12, 16])
    expect(
      reopen.state.collaboration?.sharedArtifacts.find(
        (artifact) => artifact.artifactId === DEFAULT_COLLABORATION_ARTIFACT_ID,
      )?.content,
    ).toBe('alpha / bravo')
    expect(reopen.state.scenario?.parentBundleId).toBe('bundle-parent')
    expect(reopen.state.scenario?.scenarios).toHaveLength(2)
    expect(reopen.state.scenario?.exportArtifact?.artifactId).toContain('scenario-export-')
    expect(reopen.state.ai?.latestAnalysis?.artifactId).toBe('ai-interpretation-test1234')
    expect(reopen.state.ai?.latestMcpInvocation?.toolName).toBe('get_bundle_manifest')
    expect(reopen.state.deviation?.latestEvent?.event_type).toBe('context.deviation')
    expect(reopen.state.deviation?.events).toHaveLength(1)
    expect(reopen.state.osint?.latestAlert?.aggregate_only).toBe(true)
    expect(reopen.state.osint?.thresholdRefs).toHaveLength(1)
  })

  it('loads and saves authoritative recorder state outside bundle reopen', async () => {
    await backend.saveRecorderState({
      role: 'analyst',
      state: request.state,
    })

    const restored = await backend.loadRecorderState()
    expect(restored.state?.workspace.workflowMode).toBe('replay')
    expect(restored.state?.query.matchedRowIds).toEqual([2])
    expect(restored.state?.context.correlationAoi).toBe('aoi-1')
    expect(restored.state?.context.records?.[0].domain_id).toBe('ctx-1')
    expect(restored.state?.context.queryRange?.end).toBe('2026-03-06T18:00:00.000Z')
    expect(restored.state?.compare?.eventWindow.end).toBe('2026-02-28')
    expect(restored.state?.collaboration?.ephemeralViewState).toBe('zoom-8')
    expect(restored.state?.scenario?.selectedScenarioId).toBe('scenario-2')
    expect(restored.state?.ai?.deploymentProfile).toBe('connected')
    expect(restored.state?.deviation?.latestEvent?.taxonomy_key).toBe('context.supply_chain_shift')
    expect(restored.state?.osint?.events[0]?.source).toBe('ACLED')
    expect(restored.state?.osint?.latestAlert?.threshold_refs[0]?.domain_name).toBe('Port Throughput')
  })

  it('maintains an append-only hash chain in audit events', async () => {
    const first = await backend.appendAudit({
      role: 'analyst',
      event_type: 'event.one',
      payload: { x: 1 },
    })
    const second = await backend.appendAudit({
      role: 'analyst',
      event_type: 'event.two',
      payload: { x: 2 },
    })
    expect(second.prev_event_hash).toBe(first.event_hash)
    const head = await backend.getAuditHead()
    expect(head.event_hash).toBe(second.event_hash)
  })
})
