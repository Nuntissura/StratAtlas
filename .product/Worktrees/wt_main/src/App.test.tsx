import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import type { QueryStateSnapshot } from './contracts/i0'
import {
  DEFAULT_COLLABORATION_ARTIFACT_ID,
  createCollaborationSnapshot,
  setEphemeralViewState,
  upsertSharedArtifact,
} from './features/i3/collaboration'
import {
  addHypotheticalEntity,
  createScenarioFork,
  createScenarioState,
  exportScenarioBundle,
  setConstraint,
  setScenarioExportArtifact,
} from './features/i4/scenarios'
import {
  buildQueryRenderLayer,
  buildSavedQueryArtifact,
  type VersionedQuery,
} from './features/i5/queryBuilder'
import type { AiGatewaySnapshot } from './features/i6/aiGateway'
import {
  buildContextTimeRange,
  buildCorrelationLinks,
  buildSampleContextRecords,
  type ContextDomain,
} from './features/i7/contextIntake'
import { createDeviationSnapshot, detectDeviation, pushDeviationEvent } from './features/i8/deviation'
import { backend } from './lib/backend'

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
  let snapshot = createScenarioState('bundle-hydrated')
  snapshot = createScenarioFork(snapshot, {
    title: 'Hydrated baseline',
    parentBundleId: 'bundle-hydrated',
    now: '2026-03-06T00:00:00.000Z',
    provenanceSummary: 'Hydrated bundle baseline',
  })
  const baselineScenarioId = snapshot.selectedScenarioId
  snapshot = setConstraint(snapshot, baselineScenarioId, {
    constraintId: 'port_capacity',
    label: 'Port Capacity',
    value: 65,
    unit: 'index',
    rationale: 'Hydrated baseline capacity',
    propagationWeight: 1.5,
    now: '2026-03-06T00:05:00.000Z',
  })
  snapshot = createScenarioFork(snapshot, {
    title: 'Hydrated surge',
    parentBundleId: 'bundle-hydrated',
    parentScenarioId: baselineScenarioId,
    now: '2026-03-06T00:10:00.000Z',
    provenanceSummary: 'Hydrated surge fork',
  })
  snapshot = setConstraint(snapshot, snapshot.selectedScenarioId, {
    constraintId: 'port_capacity',
    label: 'Port Capacity',
    value: 40,
    unit: 'index',
    rationale: 'Hydrated surge congestion',
    propagationWeight: 1.5,
    now: '2026-03-06T00:12:00.000Z',
  })
  snapshot = addHypotheticalEntity(snapshot, snapshot.selectedScenarioId, {
    entityId: 'floating-depot',
    name: 'Floating depot',
    entityType: 'asset',
    changeSummary: 'Adds surge buffer storage',
    provenanceSource: 'Hydrated scenario packet',
    confidence: 'B',
    now: '2026-03-06T00:13:00.000Z',
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

const buildStoredQueryState = ({
  version,
  speedThreshold,
  activeContextDomainIds = [],
}: {
  version: number
  speedThreshold: number
  activeContextDomainIds?: string[]
}): QueryStateSnapshot => {
  const definition: VersionedQuery = {
    queryId: 'query-main',
    title: `Query v${version}`,
    version,
    aoi: 'aoi-1',
    timeWindow: {
      startHour: 8,
      endHour: 18,
    },
    contextDomainIds: activeContextDomainIds,
    provenanceSource: 'Hydrated query snapshot',
    conditions: [
      {
        conditionId: 'condition-1',
        scope: 'geospatial',
        field: 'speed',
        operator: 'greater_than',
        value: speedThreshold,
      },
    ],
  }
  const rows = [
    { id: 1, speed: 14, type: 'vessel', region: 'aoi-1', hour: 7, context_domains: ['ctx-1'] },
    { id: 2, speed: 37, type: 'vessel', region: 'aoi-1', hour: 10, context_domains: ['ctx-1'] },
    { id: 3, speed: 48, type: 'aircraft', region: 'aoi-2', hour: 11, context_domains: ['ctx-1', 'ctx-2'] },
    { id: 4, speed: 61, type: 'vessel', region: 'aoi-3', hour: 15, context_domains: ['ctx-2'] },
  ]
  const matchedRows = rows.filter(
    (row) =>
      row.region === definition.aoi &&
      row.hour >= definition.timeWindow.startHour &&
      row.hour <= definition.timeWindow.endHour &&
      row.speed > speedThreshold &&
      definition.contextDomainIds.every((domainId) => row.context_domains.includes(domainId)),
  )
  const renderLayer = buildQueryRenderLayer(definition, matchedRows)
  const savedArtifact = buildSavedQueryArtifact(definition, renderLayer, {
    savedAt: '2026-03-06T00:00:00.000Z',
  })

  return {
    definition,
    resultCount: matchedRows.length,
    sourceRowCount: rows.length,
    matchedRowIds: matchedRows.map((row) => row.id),
    savedVersions: [definition],
    renderLayer,
    savedArtifact,
  }
}

const buildStoredAiSnapshot = (): AiGatewaySnapshot => ({
  deploymentProfile: 'restricted',
  latestAnalysis: {
    artifactId: 'ai-interpretation-hydrated',
    bundleId: 'bundle-hydrated',
    label: 'AI-Derived Interpretation' as const,
    marking: 'INTERNAL' as const,
    refs: [
      {
        bundle_id: 'bundle-hydrated',
        asset_id: 'workspace-state',
        sha256: 'hash-workspace',
        marking: 'INTERNAL' as const,
        licenses: ['internal'],
        sourceSummary: 'workspace.session',
      },
    ],
    citations: ['bundle-hydrated / workspace-state / hash-workspace'],
    prompt: 'Hydrated AI prompt',
    content: 'Hydrated AI summary',
    generatedAt: '2026-03-06T00:25:00.000Z',
    confidenceText: 'Derived interpretation; analyst validation required',
    uncertaintyText: 'Inference only; do not treat as observed evidence.',
    lineage: ['gateway:restricted', 'refs:1'],
  },
  latestMcpInvocation: {
    invocationId: 'mcp-hydrated',
    toolName: 'get_bundle_manifest' as const,
    status: 'allowed' as const,
    summary: 'Hydrated MCP summary',
    bundleRefs: [
      {
        bundle_id: 'bundle-hydrated',
        asset_id: 'workspace-state',
        sha256: 'hash-workspace',
      },
    ],
    invokedAt: '2026-03-06T00:26:00.000Z',
    resultPreview: 'Hydrated MCP summary',
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
  const records = domains.flatMap((domain) =>
    buildSampleContextRecords({
      domain,
      targetId: correlationAoi,
      timeRange: queryRange,
    }),
  )

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
    records,
    queryRange,
  }
}

const buildStoredDeviationSnapshot = () => {
  const event = detectDeviation(
    [
      { ts: '2026-03-06T08:00:00.000Z', value: 100 },
      { ts: '2026-03-06T10:00:00.000Z', value: 102 },
    ],
    [
      { ts: '2026-03-06T12:00:00.000Z', value: 60 },
      { ts: '2026-03-06T14:00:00.000Z', value: 58 },
    ],
    0.2,
    'infrastructure',
    {
      domainId: 'ctx-1',
      domainName: 'Port Throughput',
      targetId: 'aoi-7',
      confidenceBaseline: 'A',
    },
  )

  const snapshot = createDeviationSnapshot()
  return event ? pushDeviationEvent(snapshot, event) : snapshot
}

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('creates a bundle through the I0 shell flow', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByText('StratAtlas Integrated Workbench')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Create Bundle' }))

    expect(await screen.findByText(/Bundle .* created/)).toBeInTheDocument()
  })

  it('hydrates recorder state from the authoritative backend store', async () => {
    const user = userEvent.setup()
    await backend.saveRecorderState({
      role: 'analyst',
      state: {
        workspace: {
          mode: 'Offline (forced)',
          workflowMode: 'replay',
          note: 'Hydrated note',
          activeLayers: ['base-map'],
          replayCursor: 64,
          forcedOffline: true,
          uiVersion: 'i0-recorder-hardening',
        },
        query: buildStoredQueryState({
          version: 4,
          speedThreshold: 28,
          activeContextDomainIds: ['ctx-1'],
        }),
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
          correlationAoi: 'aoi-7',
        }),
        compare: {
          baselineWindow: {
            start: '2026-Q1 baseline',
            end: '2026-Q1 baseline',
            label: '2026-Q1 baseline',
          },
          eventWindow: {
            start: '2026-Q2 event',
            end: '2026-Q2 event',
            label: '2026-Q2 event',
          },
          baselineSeries: [4, 5, 6],
          eventSeries: [6, 7, 9],
        },
        collaboration: buildStoredCollaborationSnapshot('Hydrated shared note', 'zoom-6'),
        scenario: buildStoredScenarioSnapshot(),
        ai: buildStoredAiSnapshot(),
        deviation: buildStoredDeviationSnapshot(),
        selectedBundleId: undefined,
        savedAt: '2026-03-06T00:00:00.000Z',
      },
    })

    render(<App />)

    expect(await screen.findByDisplayValue('Hydrated note')).toBeInTheDocument()
    expect(within(screen.getByTestId('region-header')).getByText('Query v4')).toBeInTheDocument()
    expect(screen.getByText('Active context domains: 1 | Correlation AOI: aoi-7')).toBeInTheDocument()
    expect(screen.getByText('OFFLINE')).toBeInTheDocument()
    expect(screen.getByLabelText('Deployment Profile')).toHaveValue('restricted')
    expect(within(screen.getByTestId('ai-analysis-card')).getByText('Hydrated AI summary')).toBeInTheDocument()
    expect(
      within(screen.getByTestId('mcp-result-card')).getAllByText('Hydrated MCP summary').length,
    ).toBeGreaterThan(0)

    await user.selectOptions(screen.getByLabelText('Mode'), 'compare')
    expect(await screen.findByDisplayValue('2026-Q1 baseline')).toBeInTheDocument()
    expect(screen.getByDisplayValue('2026-Q2 event')).toBeInTheDocument()
    expect(screen.getByDisplayValue('4,5,6')).toBeInTheDocument()
    expect(screen.getByDisplayValue('6,7,9')).toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText('Mode'), 'collaboration')
    expect(screen.getByDisplayValue('Hydrated shared note')).toBeInTheDocument()
    expect(screen.getByDisplayValue('zoom-6')).toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText('Mode'), 'scenario')
    expect((await screen.findAllByText('Hydrated surge')).length).toBeGreaterThan(0)
    expect((await screen.findAllByText(/Floating depot/)).length).toBeGreaterThan(0)

    await user.selectOptions(screen.getByLabelText('Mode'), 'live_recent')
    expect((await screen.findAllByText(/context\.supply_chain_shift/)).length).toBeGreaterThan(0)
  })

  it('renders required I1 UI regions', async () => {
    render(<App />)
    expect(await screen.findByTestId('region-header')).toBeInTheDocument()
    expect(screen.getByTestId('region-left-panel')).toBeInTheDocument()
    expect(screen.getByTestId('region-main-canvas')).toBeInTheDocument()
    expect(screen.getByTestId('region-right-panel')).toBeInTheDocument()
    expect(screen.getByTestId('region-bottom-panel')).toBeInTheDocument()
  })

  it('runs compare workflow and updates delta output', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.selectOptions(screen.getByLabelText('Mode'), 'compare')
    expect(await screen.findByText('Baseline / Delta / Briefing (I2)')).toBeInTheDocument()

    const baselineInput = screen.getByLabelText('Baseline Series')
    const eventInput = screen.getByLabelText('Event Series')
    await user.clear(baselineInput)
    await user.type(baselineInput, '1,2,3')
    await user.clear(eventInput)
    await user.type(eventInput, '2,4,6')

    expect(await screen.findByText('Delta: [1, 2, 3]')).toBeInTheDocument()
  })

  it('runs the query builder, render, and save-version workflow', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.clear(screen.getByLabelText('Query Title'))
    await user.type(screen.getByLabelText('Query Title'), 'Port surge watch v1')
    await user.selectOptions(screen.getByLabelText('Condition Scope'), 'context')
    await user.selectOptions(screen.getByLabelText('Condition Field'), 'context_domains')
    await user.selectOptions(screen.getByLabelText('Condition Operator'), 'contains')
    await user.clear(screen.getByLabelText('Condition Value'))
    await user.type(screen.getByLabelText('Condition Value'), 'ctx-1')
    await user.click(screen.getByRole('button', { name: 'Add Condition' }))
    await user.click(screen.getByRole('button', { name: 'Run Query' }))

    const renderCard = await screen.findByTestId('query-render-card')
    const renderScope = within(renderCard)
    expect(renderScope.getByText(/query-layer-query-main-v1/)).toBeInTheDocument()
    expect(renderScope.getByText(/Matched rows: \[2\]/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Save Query Version' }))
    const artifactCard = await screen.findByTestId('saved-query-artifact-card')
    const artifactScope = within(artifactCard)
    expect(artifactScope.getByText(/saved-query-query-/)).toBeInTheDocument()
    expect(within(screen.getByTestId('region-header')).getByText('Query v2')).toBeInTheDocument()
    expect(artifactScope.getByText(/Port surge watch v1/)).toBeInTheDocument()
  })

  it('runs governed AI analysis and MCP tool workflow with audited refs', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Create Bundle' }))
    expect(await screen.findByText(/Bundle .* created/)).toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText('Deployment Profile'), 'connected')
    await user.clear(screen.getByLabelText('Prompt'))
    await user.type(screen.getByLabelText('Prompt'), 'Summarize governed evidence only.')
    await user.click(screen.getByRole('button', { name: 'Submit AI Analysis' }))

    const aiCard = await screen.findByTestId('ai-analysis-card')
    const aiScope = within(aiCard)
    expect(aiScope.getByText(/ai-interpretation-/)).toBeInTheDocument()
    expect(aiScope.getByText(/workspace-state/)).toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText('MCP Tool'), 'get_bundle_manifest')
    await user.click(screen.getByRole('button', { name: 'Run MCP Tool' }))

    const mcpCard = await screen.findByTestId('mcp-result-card')
    const mcpScope = within(mcpCard)
    expect(mcpScope.getByText('get_bundle_manifest')).toBeInTheDocument()
    expect(mcpScope.getAllByText(/governed manifest/).length).toBeGreaterThan(0)
    expect(mcpScope.queryByText(/assets\/workspace_state\.json/)).not.toBeInTheDocument()

    expect(await screen.findByText('ai.gateway.submit')).toBeInTheDocument()
    expect(await screen.findByText('mcp.tool_invoked')).toBeInTheDocument()
  })

  it('prepares a briefing artifact from compare mode with bundle and context overlays', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Register Domain' }))
    await user.selectOptions(screen.getByLabelText('Mode'), 'compare')
    await user.clear(screen.getByLabelText('Baseline Window'))
    await user.type(screen.getByLabelText('Baseline Window'), '2026-Q1 baseline')
    await user.clear(screen.getByLabelText('Event Window'))
    await user.type(screen.getByLabelText('Event Window'), '2026-Q2 event')
    await user.click(screen.getByRole('button', { name: 'Create Bundle' }))
    expect(await screen.findByText(/Bundle .* created/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Prepare Briefing Artifact' }))

    const card = await screen.findByTestId('briefing-artifact-card')
    const scope = within(card)
    expect(scope.getByText(/Bundle reference:/)).toBeInTheDocument()
    expect(scope.getAllByText('Observed Evidence').length).toBeGreaterThan(0)
    expect(scope.getAllByText('Curated Context').length).toBeGreaterThan(0)
    expect(scope.getByText(/Port Throughput/)).toBeInTheDocument()
  })

  it('handles collaboration reconnect conflicts and replay attribution', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.selectOptions(screen.getByLabelText('Mode'), 'collaboration')
    await user.clear(screen.getByLabelText('Shared Note'))
    await user.type(screen.getByLabelText('Shared Note'), 'Alpha local')
    await user.click(screen.getByRole('button', { name: 'Apply Local Shared Update' }))
    await user.clear(screen.getByLabelText('Queued Remote Note'))
    await user.type(screen.getByLabelText('Queued Remote Note'), 'Bravo remote')
    await user.clear(screen.getByLabelText('Queued Remote View State'))
    await user.type(screen.getByLabelText('Queued Remote View State'), 'zoom-8')
    await user.click(screen.getByRole('button', { name: 'Queue Remote Shared Update' }))
    await user.click(screen.getByRole('button', { name: 'Queue Remote View State' }))
    await user.click(screen.getByRole('button', { name: 'Reconnect Session' }))

    expect(await screen.findByText(/Local: Alpha local \| Remote: Bravo remote/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Merge Resolution' }))

    expect(await screen.findByText('No open conflicts')).toBeInTheDocument()
    const replay = screen.getByTestId('collaboration-replay-list')
    const scope = within(replay)
    expect(scope.getByText(/analyst-1 \| artifact\.upsert/)).toBeInTheDocument()
    expect(scope.getByText(/analyst-2 \| artifact\.upsert/)).toBeInTheDocument()
    expect(scope.getByText(/analyst-2 \| view\.ephemeral/)).toBeInTheDocument()
    expect(scope.getByText(/analyst-1 \| conflict\.resolved/)).toBeInTheDocument()
  })

  it('runs the scenario fork, compare, and export workflow', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Create Bundle' }))
    expect(await screen.findByText(/Bundle .* created/)).toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText('Mode'), 'scenario')
    expect(await screen.findByText('Scenario Fork / Constraint Propagation / Export (I4)')).toBeInTheDocument()

    await user.clear(screen.getByLabelText('Scenario Title'))
    await user.type(screen.getByLabelText('Scenario Title'), 'Baseline scenario')
    await user.click(screen.getByRole('button', { name: 'Fork Scenario' }))
    expect((await screen.findAllByText('Baseline scenario')).length).toBeGreaterThan(0)

    await user.clear(screen.getByLabelText('Constraint Value'))
    await user.type(screen.getByLabelText('Constraint Value'), '72')
    await user.click(screen.getByRole('button', { name: 'Apply Constraint' }))

    await user.clear(screen.getByLabelText('Scenario Title'))
    await user.type(screen.getByLabelText('Scenario Title'), 'Surge scenario')
    await user.click(screen.getByRole('button', { name: 'Fork Scenario' }))
    expect((await screen.findAllByText('Surge scenario')).length).toBeGreaterThan(0)

    await user.clear(screen.getByLabelText('Constraint Value'))
    await user.type(screen.getByLabelText('Constraint Value'), '48')
    await user.click(screen.getByRole('button', { name: 'Apply Constraint' }))
    await user.clear(screen.getByLabelText('Entity Name'))
    await user.type(screen.getByLabelText('Entity Name'), 'Floating depot')
    await user.click(screen.getByRole('button', { name: 'Add Hypothetical Entity' }))

    await user.click(screen.getByRole('button', { name: 'Compare Scenarios' }))
    expect(
      (
        await screen.findAllByText(/1 constraint changes and 1 hypothetical entity changes/)
      ).length,
    ).toBeGreaterThan(0)

    await user.click(screen.getByRole('button', { name: 'Export Scenario Bundle' }))
    const exportCard = await screen.findByTestId('scenario-export-card')
    const scope = within(exportCard)
    expect(scope.getByText(/Bundle reference:/)).toBeInTheDocument()
    expect(scope.getByText(/scenario-export-/)).toBeInTheDocument()
    expect(scope.getByText(/Compared scenario-1 -> scenario-2/)).toBeInTheDocument()
  })

  it('renders governed layer metadata, labels, and model uncertainty', async () => {
    render(<App />)

    expect(await screen.findByLabelText('Artifact label legend')).toBeInTheDocument()
    expect(screen.getAllByText('Observed Basemap').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Observed Evidence').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Modeled Output').length).toBeGreaterThan(0)
    expect(screen.getAllByText('AI-Derived Interpretation').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Uncertainty: Payoff range [85, 115]').length).toBeGreaterThan(0)
  })

  it('surfaces context source cadence confidence and export policy metadata', async () => {
    await backend.saveRecorderState({
      role: 'analyst',
      state: {
        workspace: {
          mode: 'Offline',
          workflowMode: 'offline',
          note: 'Context packet',
          activeLayers: ['base-map', 'context-panel'],
          replayCursor: 0,
          forcedOffline: true,
          uiVersion: 'i0-recorder-hardening',
        },
        query: buildStoredQueryState({
          version: 1,
          speedThreshold: 20,
          activeContextDomainIds: ['ctx-2'],
        }),
        context: buildStoredContextSnapshot({
          domains: [
            {
              domain_id: 'ctx-2',
              domain_name: 'Commodity Index',
              domain_class: 'economic_indicator',
              source_name: 'Customs Feed',
              source_url: 'https://example.test/curated',
              license: 'partner',
              update_cadence: 'weekly curated',
              spatial_binding: 'region_bound',
              temporal_resolution: 'weekly',
              sensitivity_class: 'RESTRICTED',
              confidence_baseline: 'Baseline B',
              methodology_notes: 'Partner cadence estimate',
              offline_behavior: 'online_only',
              presentation_type: 'sidebar_timeseries',
              prohibited_uses: ['MUST NOT be used for individual entity tracking'],
            },
          ],
          activeDomainIds: ['ctx-2'],
          correlationAoi: 'aoi-3',
        }),
        selectedBundleId: undefined,
        savedAt: '2026-03-06T00:00:00.000Z',
      },
    })

    render(<App />)

    const cardTitle = await screen.findByText('Commodity Index')
    const card = cardTitle.closest('article')
    expect(card).not.toBeNull()
    const scope = within(card as HTMLElement)

    expect(scope.getByText('Customs Feed')).toBeInTheDocument()
    expect(scope.getByText('weekly curated')).toBeInTheDocument()
    expect(scope.getByText('Baseline B')).toBeInTheDocument()
    expect(scope.getByText('right_panel')).toBeInTheDocument()
    expect(scope.getByText('blocked')).toBeInTheDocument()
    expect(scope.getByText(/Offline cached value in use/)).toBeInTheDocument()
    expect(scope.getByText(/Stale until live refresh/)).toBeInTheDocument()
  })

  it('runs the context correlation golden flow and captures explicit links in the bundle', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.clear(screen.getByLabelText('Correlation AOI'))
    await user.type(screen.getByLabelText('Correlation AOI'), 'aoi-4')
    await user.selectOptions(screen.getByLabelText('Presentation Type'), 'sidebar_timeseries')
    await user.selectOptions(screen.getByLabelText('Offline Behavior'), 'online_only')
    await user.click(screen.getByRole('button', { name: 'Register Domain' }))
    await user.click(screen.getByRole('button', { name: 'Save Correlation Selection' }))

    expect(await screen.findByText('Active context domains: 1 | Correlation AOI: aoi-4')).toBeInTheDocument()
    expect(screen.getByText('Correlated context only; not causal explanation.')).toBeInTheDocument()
    const card = (await screen.findByText('Port Throughput')).closest('article')
    expect(card).not.toBeNull()
    const scope = within(card as HTMLElement)
    expect(scope.getByText(/Correlated context only/)).toBeInTheDocument()
    expect(scope.getByText(/Live correlation window shows/)).toBeInTheDocument()
    expect(scope.getByText(/Latest value:/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Create Bundle' }))
    expect(await screen.findByText(/Bundle .* created/)).toBeInTheDocument()

    await user.clear(screen.getByLabelText('Correlation AOI'))
    await user.type(screen.getByLabelText('Correlation AOI'), 'aoi-2')
    await user.click(screen.getByRole('button', { name: 'Save Correlation Selection' }))
    await user.click(screen.getByRole('button', { name: 'Reopen Bundle' }))

    expect(await screen.findByText('Active context domains: 1 | Correlation AOI: aoi-4')).toBeInTheDocument()
    expect(screen.getByText(/Latest value:/)).toBeInTheDocument()
  })

  it('records a context deviation event and applies a constraint_node domain in the scenario workspace', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.selectOptions(screen.getByLabelText('Presentation Type'), 'constraint_node')
    await user.click(screen.getByRole('button', { name: 'Register Domain' }))
    await user.click(screen.getByRole('button', { name: 'Create Bundle' }))
    expect(await screen.findByText(/Bundle .* created/)).toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText('Mode'), 'live_recent')
    await user.click(screen.getByRole('button', { name: 'Load Active Domain Series' }))
    await user.click(screen.getByRole('button', { name: 'Record Deviation Event' }))

    const deviationCard = await screen.findByTestId('deviation-event-card')
    const deviationScope = within(deviationCard)
    expect(deviationScope.getByText(/context\.supply_chain_shift/)).toBeInTheDocument()
    expect(deviationScope.getByText(/^Port Throughput$/)).toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText('Mode'), 'scenario')
    await user.clear(screen.getByLabelText('Scenario Title'))
    await user.type(screen.getByLabelText('Scenario Title'), 'Deviation scenario')
    await user.click(screen.getByRole('button', { name: 'Fork Scenario' }))
    expect((await screen.findAllByText('Deviation scenario')).length).toBeGreaterThan(0)

    await user.click(screen.getByRole('button', { name: 'Apply Port Throughput Constraint' }))
    expect(
      await screen.findByText(/Applied context constraint node Port Throughput to Deviation scenario\./),
    ).toBeInTheDocument()
    expect(screen.getAllByText(/modeled scenario input/).length).toBeGreaterThan(0)
  })

  it('shows degraded aggregation feedback when the replay frame budget is exceeded', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.selectOptions(screen.getByLabelText('Mode'), 'replay')
    const frameInput = screen.getByLabelText('Measured Frame (ms)')
    await user.clear(frameInput)
    await user.type(frameInput, '80')

    expect(await screen.findByText('Aggregation mode active')).toBeInTheDocument()
    expect(screen.getByText('Degraded aggregation in effect.')).toBeInTheDocument()
  })

  it(
    'reopens a bundle and restores workspace, query, and context state',
    async () => {
      const user = userEvent.setup()
      render(<App />)

      await user.selectOptions(screen.getByLabelText('Mode'), 'replay')
      await user.selectOptions(screen.getByLabelText('Mode'), 'compare')
      await user.clear(screen.getByLabelText('Baseline Window'))
      await user.type(screen.getByLabelText('Baseline Window'), 'Recovered baseline')
      await user.clear(screen.getByLabelText('Event Window'))
      await user.type(screen.getByLabelText('Event Window'), 'Recovered event')
      await user.clear(screen.getByLabelText('Baseline Series'))
      await user.type(screen.getByLabelText('Baseline Series'), '5,7,9')
      await user.clear(screen.getByLabelText('Event Series'))
      await user.type(screen.getByLabelText('Event Series'), '8,12,15')
      await user.selectOptions(screen.getByLabelText('Mode'), 'replay')
      await user.clear(screen.getByLabelText('Analyst Note'))
      await user.type(screen.getByLabelText('Analyst Note'), 'Recorder note')
      await user.click(screen.getByRole('button', { name: 'Force Offline Mode' }))
      await user.click(screen.getByRole('button', { name: 'Register Domain' }))
      await user.clear(screen.getByLabelText('Correlation AOI'))
      await user.type(screen.getByLabelText('Correlation AOI'), 'aoi-9')
      await user.click(screen.getByRole('button', { name: 'Save Correlation Selection' }))
      await user.clear(screen.getByLabelText('Query Title'))
      await user.type(screen.getByLabelText('Query Title'), 'Saved port watch')
      await user.selectOptions(screen.getByLabelText('Condition Scope'), 'context')
      await user.selectOptions(screen.getByLabelText('Condition Field'), 'context_domains')
      await user.selectOptions(screen.getByLabelText('Condition Operator'), 'contains')
      await user.clear(screen.getByLabelText('Condition Value'))
      await user.type(screen.getByLabelText('Condition Value'), 'ctx-1')
      await user.click(screen.getByRole('button', { name: 'Add Condition' }))
      await user.click(screen.getByRole('button', { name: 'Run Query' }))
      await user.click(screen.getByRole('button', { name: 'Save Query Version' }))
      await user.click(screen.getByRole('button', { name: 'Create Bundle' }))
      expect(await screen.findByText(/Bundle .* created/)).toBeInTheDocument()
      await user.selectOptions(screen.getByLabelText('Mode'), 'collaboration')
      await user.clear(screen.getByLabelText('Shared Note'))
      await user.type(screen.getByLabelText('Shared Note'), 'Collab saved note')
      await user.click(screen.getByRole('button', { name: 'Apply Local Shared Update' }))
      await user.clear(screen.getByLabelText('Local View State'))
      await user.type(screen.getByLabelText('Local View State'), 'zoom-5')
      await user.click(screen.getByRole('button', { name: 'Apply Local View State' }))
      await user.selectOptions(screen.getByLabelText('Mode'), 'scenario')
      await user.clear(screen.getByLabelText('Scenario Title'))
      await user.type(screen.getByLabelText('Scenario Title'), 'Saved baseline')
      await user.click(screen.getByRole('button', { name: 'Fork Scenario' }))
      await user.clear(screen.getByLabelText('Constraint Value'))
      await user.type(screen.getByLabelText('Constraint Value'), '68')
      await user.click(screen.getByRole('button', { name: 'Apply Constraint' }))
      await user.clear(screen.getByLabelText('Scenario Title'))
      await user.type(screen.getByLabelText('Scenario Title'), 'Saved surge')
      await user.click(screen.getByRole('button', { name: 'Fork Scenario' }))
      expect((await screen.findAllByText('Saved surge')).length).toBeGreaterThan(0)
      await user.clear(screen.getByLabelText('Constraint Value'))
      await user.type(screen.getByLabelText('Constraint Value'), '44')
      await user.click(screen.getByRole('button', { name: 'Apply Constraint' }))
      await user.click(screen.getByRole('button', { name: 'Compare Scenarios' }))
      await user.click(screen.getByRole('button', { name: 'Export Scenario Bundle' }))
      await user.selectOptions(screen.getByLabelText('Mode'), 'replay')
      await user.click(screen.getByRole('button', { name: 'Create Bundle' }))
      expect(await screen.findByText(/Bundle .* created/)).toBeInTheDocument()

      await user.clear(screen.getByLabelText('Analyst Note'))
      await user.type(screen.getByLabelText('Analyst Note'), 'Mutated note')
      await user.selectOptions(screen.getByLabelText('Mode'), 'compare')
      await user.click(screen.getByRole('button', { name: 'Disable Forced Offline' }))
      await user.clear(screen.getByLabelText('Correlation AOI'))
      await user.type(screen.getByLabelText('Correlation AOI'), 'aoi-2')
      await user.click(screen.getByRole('checkbox', { name: /Port Throughput/ }))

      await user.click(screen.getByRole('button', { name: 'Reopen Bundle' }))

      expect(await screen.findByDisplayValue('Recorder note')).toBeInTheDocument()
      expect(screen.getByText('replay workflow surface')).toBeInTheDocument()
      expect(screen.getByText('Query v2')).toBeInTheDocument()
      expect(screen.getByText(/saved-query-query-/)).toBeInTheDocument()
      expect(screen.getByText('Active context domains: 1 | Correlation AOI: aoi-9')).toBeInTheDocument()
      expect(screen.getByText('OFFLINE')).toBeInTheDocument()

      await user.selectOptions(screen.getByLabelText('Mode'), 'compare')
      expect(await screen.findByDisplayValue('Recovered baseline')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Recovered event')).toBeInTheDocument()
      expect(screen.getByDisplayValue('5,7,9')).toBeInTheDocument()
      expect(screen.getByDisplayValue('8,12,15')).toBeInTheDocument()

      await user.selectOptions(screen.getByLabelText('Mode'), 'collaboration')
      expect(screen.getByDisplayValue('Collab saved note')).toBeInTheDocument()
      expect(screen.getByDisplayValue('zoom-5')).toBeInTheDocument()

      await user.selectOptions(screen.getByLabelText('Mode'), 'scenario')
      expect((await screen.findAllByText('Saved surge')).length).toBeGreaterThan(0)
      expect(screen.getByText(/Compared scenario-1 -> scenario-2/)).toBeInTheDocument()
    },
    30000,
  )
})
