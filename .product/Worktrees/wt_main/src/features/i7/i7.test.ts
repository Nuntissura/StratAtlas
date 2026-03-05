import { describe, expect, it } from 'vitest'
import { allowsMapPointRendering, validateDomainRegistration } from './contextIntake'

describe('I7 context intake', () => {
  it('validates domain registration contract and presentation semantics', () => {
    const validDomain = {
      domain_id: 'ctx-1',
      domain_name: 'Port Throughput',
      domain_class: 'economic_indicator',
      source_name: 'UNCTAD',
      source_url: 'https://example.test',
      license: 'public',
      update_cadence: 'monthly',
      spatial_binding: 'point',
      temporal_resolution: 'monthly',
      sensitivity_class: 'PUBLIC',
      confidence_baseline: 'A',
      methodology_notes: 'official stats',
      offline_behavior: 'pre_cacheable',
      presentation_type: 'map_overlay',
    } as const
    expect(validateDomainRegistration(validDomain)).toBe(true)
    expect(allowsMapPointRendering(validDomain)).toBe(true)

    const nonSpatial = {
      ...validDomain,
      presentation_type: 'sidebar_timeseries',
    } as const
    expect(allowsMapPointRendering(nonSpatial)).toBe(false)
  })
})
