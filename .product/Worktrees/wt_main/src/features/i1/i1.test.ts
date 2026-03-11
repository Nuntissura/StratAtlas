import { describe, expect, it } from 'vitest'
import {
  LayerRegistry,
  buildLayerFamilyCatalog,
  buildWorkspaceLayerCatalog,
  createDefaultLayerFamilyExpandedState,
  createDefaultLayerFamilyVisibility,
} from './layers'
import { REQUIRED_UI_MODES, REQUIRED_UI_REGIONS } from './modes'
import { I1_BUDGETS, describeStateChangeFeedback, shouldDegradeRendering } from './performance'
import { validatePluginAgainstPolicy } from './plugins'
import {
  buildCompareDashboard,
  buildComparisonWindow,
  buildContextOverlaySummaries,
} from '../i2/baselineDelta'
import { createCollaborationSnapshot } from '../i3/collaboration'
import { addHypotheticalEntity, createScenarioFork, createScenarioState, setConstraint } from '../i4/scenarios'
import { buildQueryRenderLayer, type VersionedQuery } from '../i5/queryBuilder'
import type { AiGatewayArtifact } from '../i6/aiGateway'
import {
  buildContextTimeRange,
  buildCorrelationLinks,
  buildSampleContextRecords,
  type ContextDomain,
} from '../i7/contextIntake'
import { detectDeviation } from '../i8/deviation'
import { aggregateAlerts, buildOsintEvent } from '../i9/osint'
import { buildPayoffProxy, createGameModelSnapshot } from '../i10/gameModeling'
import { createPackagedAirTrafficSnapshot } from './airTraffic'
import { createPackagedMaritimeSnapshot } from './maritime'
import { createPackagedSatelliteSnapshot } from './satellites'
import { listSpecializedInfrastructureRecordsForLayers } from './specializedInfrastructure'
import { buildMapRuntimeScene } from './runtime/mapRuntimeScene'

describe('I1 contracts', () => {
  it('defines required stable UI regions and modes', () => {
    expect(REQUIRED_UI_REGIONS).toEqual([
      'header',
      'left_panel',
      'right_panel',
      'bottom_panel',
      'main_canvas',
    ])
    expect(REQUIRED_UI_MODES).toEqual([
      'live_recent',
      'replay',
      'compare',
      'scenario',
      'collaboration',
      'offline',
    ])
  })

  it('enforces layer declaration export constraints', () => {
    const registry = new LayerRegistry()
    registry.register({
      layerId: 'layer-a',
      source: 'test',
      license: 'internal',
      cadence: 'daily',
      geometryType: 'point',
      sensitivityClass: 'RESTRICTED',
      cachingPolicy: 'disk',
    })
    expect(
      registry.canExport('layer-a', {
        allowRestrictedExport: false,
        allowedLicenses: ['internal'],
      }),
    ).toBe(false)
    expect(
      registry.canExport('layer-a', {
        allowRestrictedExport: true,
        allowedLicenses: ['internal'],
      }),
    ).toBe(true)
  })

  it('blocks unsandboxed plugin and forbidden egress', () => {
    const result = validatePluginAgainstPolicy(
      {
        pluginId: 'plug-1',
        mainProcessExecution: true,
        networkHosts: ['example.com'],
      },
      {
        allowMainProcessExecution: false,
        allowedHosts: ['internal.local'],
      },
    )
    expect(result.allowed).toBe(false)
  })

  it('tracks performance budget gates and degradation triggers', () => {
    expect(I1_BUDGETS.panZoomFrameMs).toBe(50)
    expect(shouldDegradeRendering(80)).toBe(true)
    expect(shouldDegradeRendering(20)).toBe(false)
    expect(describeStateChangeFeedback('Layer toggle', 480).showProgress).toBe(true)
    expect(describeStateChangeFeedback('Layer toggle', 120).message).toContain('120 ms')
  })

  it('routes non-map context presentations away from map points and preserves labels', () => {
    const catalog = buildWorkspaceLayerCatalog({
      activeLayerIds: ['base-map', 'context-panel'],
      activeDomainIds: ['ctx-1'],
      domains: [
        {
          domain_id: 'ctx-1',
          domain_name: 'Commodity Index',
          domain_class: 'economic_indicator',
          source_name: 'UNCTAD',
          source_url: 'https://example.test/context',
          license: 'public',
          update_cadence: 'monthly',
          spatial_binding: 'region_bound',
          temporal_resolution: 'monthly',
          sensitivity_class: 'PUBLIC',
          confidence_baseline: 'A',
          methodology_notes: 'Official aggregation',
          offline_behavior: 'pre_cacheable',
          presentation_type: 'sidebar_timeseries',
        },
      ],
      allowRestrictedExport: false,
      allowedLicenses: ['public', 'internal'],
      aiSummaryAvailable: true,
      degradeRendering: false,
      modelUncertaintyText: 'Range +/- 15%',
    })

    const contextEntry = catalog.find((entry) => entry.layerId === 'context-ctx-1')
    const modelEntry = catalog.find((entry) => entry.layerId === 'modeled-output')
    const aiEntry = catalog.find((entry) => entry.layerId === 'ai-interpretation')

    expect(contextEntry?.artifactLabel).toBe('Curated Context')
    expect(contextEntry?.renderSurface).toBe('right_panel')
    expect(contextEntry?.geometryType).not.toBe('point')
    expect(modelEntry?.artifactLabel).toBe('Modeled Output')
    expect(modelEntry?.uncertaintyText).toContain('Range')
    expect(aiEntry?.artifactLabel).toBe('AI-Derived Interpretation')
  })

  it('builds a grouped layer family registry with truthful planned states', () => {
    const airTrafficSnapshot = createPackagedAirTrafficSnapshot('aoi-1')
    const maritimeSnapshot = createPackagedMaritimeSnapshot('aoi-1')
    const satelliteSnapshot = createPackagedSatelliteSnapshot('aoi-1')
    const layerCatalog = buildWorkspaceLayerCatalog({
      activeLayerIds: [
        'base-map',
        'context-panel',
        'static-airports',
        'commercial-air-traffic',
        'commercial-maritime-traffic',
        'specialized-oil-refineries',
        'satellite-propagated-positions',
        'satellite-coverage-footprints',
      ],
      activeDomainIds: [],
      domains: [],
      allowRestrictedExport: false,
      allowedLicenses: ['public', 'internal'],
      aiSummaryAvailable: false,
      airTrafficSnapshot,
      maritimeSnapshot,
      satelliteSnapshot,
      degradeRendering: false,
      familyVisibility: {
        ...createDefaultLayerFamilyVisibility(),
        'verified-workspace': false,
        'static-installations': true,
        'commercial-air': true,
        'maritime-awareness': true,
        'specialized-infrastructure': true,
        'satellite-coverage': true,
      },
      modelUncertaintyText: 'Range +/- 15%',
    })

    const familyCatalog = buildLayerFamilyCatalog({
      layerCatalog,
      familyVisibility: {
        ...createDefaultLayerFamilyVisibility(),
        'verified-workspace': false,
        'static-installations': true,
        'commercial-air': true,
        'maritime-awareness': true,
        'specialized-infrastructure': true,
      },
      familyExpanded: {
        ...createDefaultLayerFamilyExpandedState(),
        'static-installations': true,
        'maritime-awareness': true,
        'specialized-infrastructure': true,
        'satellite-coverage': true,
      },
      familyRuntimeState: {
        'commercial-air': {
          state: 'cached',
          stateDetail: 'Cached OpenSky benchmark snapshot is active.',
        },
        'maritime-awareness': {
          state: 'cached',
          stateDetail: 'Cached governed maritime benchmark is active.',
        },
      },
    })

    const verifiedFamily = familyCatalog.find((entry) => entry.familyId === 'verified-workspace')
    const maritimeFamily = familyCatalog.find((entry) => entry.familyId === 'maritime-awareness')
    const staticFamily = familyCatalog.find((entry) => entry.familyId === 'static-installations')
    const commercialAirFamily = familyCatalog.find((entry) => entry.familyId === 'commercial-air')
    const satelliteFamily = familyCatalog.find((entry) => entry.familyId === 'satellite-coverage')
    const specializedFamily = familyCatalog.find(
      (entry) => entry.familyId === 'specialized-infrastructure',
    )

    expect(verifiedFamily?.availableInBuild).toBe(true)
    expect(verifiedFamily?.visible).toBe(false)
    expect(verifiedFamily?.selectedMemberCount).toBe(2)
    expect(verifiedFamily?.visibleMemberCount).toBe(0)
    expect(staticFamily?.expanded).toBe(true)
    expect(staticFamily?.availableInBuild).toBe(true)
    expect(staticFamily?.state).toBe('static-only')
    expect(staticFamily?.toggleDisabled).toBe(false)
    expect(staticFamily?.selectedMemberCount).toBe(1)
    expect(staticFamily?.visibleMemberCount).toBe(1)
    expect(commercialAirFamily?.state).toBe('cached')
    expect(commercialAirFamily?.selectedMemberCount).toBe(1)
    expect(commercialAirFamily?.defaultSelectedLayerIds).toContain('commercial-air-traffic')
    expect(satelliteFamily?.availableInBuild).toBe(true)
    expect(satelliteFamily?.expanded).toBe(true)
    expect(satelliteFamily?.state).toBe('cached')
    expect(satelliteFamily?.selectedMemberCount).toBe(2)
    expect(satelliteFamily?.visibleMemberCount).toBe(2)
    expect(satelliteFamily?.defaultSelectedLayerIds).toContain('satellite-propagated-positions')
    expect(maritimeFamily?.availableInBuild).toBe(true)
    expect(maritimeFamily?.expanded).toBe(true)
    expect(maritimeFamily?.state).toBe('cached')
    expect(maritimeFamily?.toggleDisabled).toBe(false)
    expect(maritimeFamily?.selectedMemberCount).toBe(1)
    expect(maritimeFamily?.visibleMemberCount).toBe(1)
    expect(maritimeFamily?.defaultSelectedLayerIds).toContain('commercial-maritime-traffic')
    expect(specializedFamily?.availableInBuild).toBe(true)
    expect(specializedFamily?.expanded).toBe(true)
    expect(specializedFamily?.state).toBe('static-only')
    expect(specializedFamily?.toggleDisabled).toBe(false)
    expect(specializedFamily?.selectedMemberCount).toBe(1)
    expect(specializedFamily?.visibleMemberCount).toBe(1)
    expect(specializedFamily?.defaultSelectedLayerIds).toContain('specialized-oil-refineries')
  })

  it('spatializes the cross-feature runtime state onto the governed map scene', () => {
    const airTrafficSnapshot = createPackagedAirTrafficSnapshot('aoi-1')
    const maritimeSnapshot = createPackagedMaritimeSnapshot('aoi-1')
    const satelliteSnapshot = createPackagedSatelliteSnapshot('aoi-1')
    const domains: ContextDomain[] = [
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
    ]
    const visibleLayerCatalog = buildWorkspaceLayerCatalog({
      activeLayerIds: [
        'base-map',
        'audit-overlay',
        'static-ports',
        'commercial-air-traffic',
        'flight-awareness-heuristic',
        'commercial-maritime-traffic',
        'maritime-port-awareness',
        'specialized-oil-refineries',
        'specialized-water-treatment',
        'satellite-propagated-positions',
        'satellite-ground-tracks',
        'satellite-coverage-footprints',
      ],
      activeDomainIds: ['ctx-1'],
      domains,
      allowRestrictedExport: false,
      allowedLicenses: ['public', 'internal'],
      aiSummaryAvailable: true,
      airTrafficSnapshot,
      maritimeSnapshot,
      satelliteSnapshot,
      degradeRendering: false,
      familyVisibility: {
        ...createDefaultLayerFamilyVisibility(),
        'static-installations': true,
        'commercial-air': true,
        'maritime-awareness': true,
        'specialized-infrastructure': true,
        'satellite-coverage': true,
      },
      modelUncertaintyText: 'Range +/- 14%',
    }).filter((entry) => entry.visible)
    const versionedQuery: VersionedQuery = {
      queryId: 'query-main',
      title: 'Port surge watch',
      version: 2,
      aoi: 'aoi-1',
      timeWindow: {
        startHour: 8,
        endHour: 18,
      },
      contextDomainIds: ['ctx-1'],
      provenanceSource: 'Analyst-authored',
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
    const queryRenderLayer = buildQueryRenderLayer(versionedQuery, [
      {
        id: 2,
        speed: 37,
        region: 'aoi-1',
        hour: 10,
        context_domains: ['ctx-1'],
      },
    ])
    const compareDashboard = buildCompareDashboard(
      buildComparisonWindow('Baseline', '2026-Q1 baseline', '2026-Q1 baseline'),
      buildComparisonWindow('Event', '2026-Q2 event', '2026-Q2 event'),
      [10, 12, 16],
      [14, 18, 21],
    )
    const contextTimeRange = buildContextTimeRange({
      startHour: 8,
      endHour: 18,
    })
    const contextRecords = buildSampleContextRecords({
      domain: domains[0],
      targetId: 'aoi-7',
      timeRange: contextTimeRange,
    })
    let scenario = createScenarioState('bundle-test')
    scenario = createScenarioFork(scenario, {
      title: 'Surge response',
      parentBundleId: 'bundle-test',
      now: '2026-03-06T00:00:00.000Z',
      provenanceSummary: 'Scenario packet',
    })
    scenario = setConstraint(scenario, scenario.selectedScenarioId, {
      constraintId: 'port_capacity',
      label: 'Port Capacity',
      value: 64,
      unit: 'index',
      rationale: 'Capacity compression',
      propagationWeight: 1.7,
      now: '2026-03-06T00:05:00.000Z',
    })
    scenario = addHypotheticalEntity(scenario, scenario.selectedScenarioId, {
      entityId: 'floating-depot',
      name: 'Floating depot',
      entityType: 'asset',
      changeSummary: 'Adds surge buffer storage',
      provenanceSource: 'Analyst note',
      confidence: 'B',
      now: '2026-03-06T00:06:00.000Z',
    })
    const latestAiArtifact: AiGatewayArtifact = {
      artifactId: 'ai-1',
      bundleId: 'bundle-test',
      label: 'AI-Derived Interpretation',
      marking: 'INTERNAL',
      refs: [],
      citations: ['bundle-test / workspace-state'],
      prompt: 'Summarize governed evidence only.',
      content: 'Container throughput remains stressed around the primary AOI.',
      generatedAt: '2026-03-06T00:07:00.000Z',
      confidenceText: 'Derived interpretation; analyst validation required',
      uncertaintyText: 'Inference only; do not treat as observed evidence.',
      lineage: ['gateway:restricted'],
    }
    const latestDeviationEvent =
      detectDeviation(
        [
          { ts: '2026-03-06T08:00:00.000Z', value: 100 },
          { ts: '2026-03-06T10:00:00.000Z', value: 102 },
        ],
        [
          { ts: '2026-03-06T12:00:00.000Z', value: 64 },
          { ts: '2026-03-06T14:00:00.000Z', value: 59 },
        ],
        0.2,
        'infrastructure',
        {
          domainId: 'ctx-1',
          domainName: 'Port Throughput',
          targetId: 'aoi-7',
          confidenceBaseline: 'A',
        },
      ) ?? undefined
    const osintEvents = [
      buildOsintEvent({
        source: 'ACLED',
        verification: 'reported',
        aoi: 'aoi-7',
        category: 'conflict_event',
        summary: 'Curated disruption summary.',
        retrievedAt: '2026-03-06T18:00:00.000Z',
      }),
    ]
    const scene = buildMapRuntimeScene({
      mode: 'scenario',
      offline: false,
      replayCursor: 42,
      activeLayers: ['base-map', 'audit-overlay'],
      visibleLayerCatalog,
      mainCanvasCatalog: visibleLayerCatalog.filter((entry) => entry.renderSurface === 'main_canvas'),
      rightPanelCatalog: visibleLayerCatalog.filter((entry) => entry.renderSurface === 'right_panel'),
      dashboardCatalog: visibleLayerCatalog.filter((entry) => entry.renderSurface === 'dashboard_widget'),
      airTrafficSnapshot,
      maritimeSnapshot,
      satelliteSnapshot,
      versionedQuery,
      queryRenderLayer,
      contextDomains: domains,
      activeDomainIds: ['ctx-1'],
      correlationAoi: 'aoi-7',
      contextRecords,
      correlationLinks: buildCorrelationLinks({
        domains,
        activeDomainIds: ['ctx-1'],
        correlationAoi: 'aoi-7',
        timeRange: contextTimeRange,
      }),
      compareDashboard,
      contextOverlaySummaries: buildContextOverlaySummaries(domains, ['ctx-1'], compareDashboard),
      collaboration: createCollaborationSnapshot('collab-main', 'analyst-1'),
      selectedScenario: scenario.scenarios[0],
      scenarioComparison: null,
      latestAiArtifact,
      latestDeviationEvent,
      osintSummary: aggregateAlerts(osintEvents, 'aoi-7'),
      osintEvents,
      osintAoi: 'aoi-7',
      gameModelSnapshot: createGameModelSnapshot('bundle-test'),
      payoffProxy: buildPayoffProxy('throughput_resilience', 112, 14),
    })

    expect(scene.focusOptions.length).toBeGreaterThan(2)
    expect(scene.signals.features.some((feature) => feature.properties.category === 'query')).toBe(true)
    expect(scene.signals.features.some((feature) => feature.properties.category === 'context')).toBe(true)
    expect(
      scene.signals.features.some((feature) => feature.properties.label === 'Port of Singapore'),
    ).toBe(true)
    expect(scene.signals.features.some((feature) => feature.properties.category === 'scenario')).toBe(true)
    expect(scene.signals.features.some((feature) => feature.properties.category === 'ai')).toBe(true)
    expect(scene.signals.features.some((feature) => feature.properties.category === 'osint')).toBe(true)
    expect(scene.signals.features.some((feature) => feature.properties.category === 'air_traffic')).toBe(true)
    expect(scene.signals.features.some((feature) => feature.properties.category === 'awareness')).toBe(true)
    expect(scene.signals.features.some((feature) => feature.properties.category === 'maritime')).toBe(true)
    expect(
      scene.signals.features.some((feature) => feature.properties.category === 'maritime_awareness'),
    ).toBe(true)
    expect(
      scene.signals.features.some(
        (feature) =>
          feature.properties.category === 'satellite' ||
          feature.properties.category === 'satellite_coverage',
      ),
    ).toBe(true)
    expect(
      scene.signals.features.some(
        (feature) =>
          feature.properties.category === 'compare' &&
          feature.properties.label.includes('delta'),
      ),
    ).toBe(true)
    expect(
      scene.signals.features.some(
        (feature) => feature.properties.label === 'Jurong Island Refining Cluster',
      ),
    ).toBe(true)
    expect(scene.corridors.features.some((feature) => feature.properties.category === 'model')).toBe(true)
    expect(scene.corridors.features.some((feature) => feature.properties.category === 'maritime')).toBe(true)
    expect(
      scene.corridors.features.some(
        (feature) => feature.properties.category === 'maritime_awareness',
      ),
    ).toBe(true)
    expect(scene.corridors.features.some((feature) => feature.properties.category === 'satellite')).toBe(true)
    expect(
      scene.surfaces.features.some((feature) =>
        String(feature.properties?.label ?? '').includes('footprint'),
      ),
    ).toBe(true)
    expect(scene.legend.some((entry) => entry.label === 'Commercial Maritime Traffic')).toBe(true)
    expect(listSpecializedInfrastructureRecordsForLayers(['specialized-water-treatment']).length).toBeGreaterThan(0)
    expect(scene.metrics.find((metric) => metric.label === 'Mapped Features')?.value).not.toBe('0')
  })
})
