import { describe, expect, it } from 'vitest'
import { LayerRegistry } from './layers'
import { REQUIRED_UI_MODES, REQUIRED_UI_REGIONS } from './modes'
import { I1_BUDGETS, shouldDegradeRendering } from './performance'
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
  })
})
