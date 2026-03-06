import { describe, expect, it } from 'vitest'
import { LayerRegistry, buildWorkspaceLayerCatalog } from './layers'
import { REQUIRED_UI_MODES, REQUIRED_UI_REGIONS } from './modes'
import { I1_BUDGETS, describeStateChangeFeedback, shouldDegradeRendering } from './performance'
import { validatePluginAgainstPolicy } from './plugins'

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
})
