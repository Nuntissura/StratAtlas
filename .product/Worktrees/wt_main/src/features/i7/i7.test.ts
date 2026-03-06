import { describe, expect, it } from 'vitest'
import {
  allowsMapPointRendering,
  buildContextTimeRange,
  buildCorrelationLinks,
  buildSampleContextRecords,
  collectDomainRegistrationErrors,
  queryContextRecords,
  summarizeContextAvailability,
  validateDomainRegistration,
  type ContextDomain,
} from './contextIntake'

const baseDomain: ContextDomain = {
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
  methodology_notes: 'Official aggregation with documented methodology.',
  offline_behavior: 'pre_cacheable',
  presentation_type: 'map_overlay',
  prohibited_uses: ['MUST NOT be used for individual entity tracking'],
}

describe('I7 context intake', () => {
  it('validates the governed domain registration contract', () => {
    expect(validateDomainRegistration(baseDomain)).toBe(true)
    expect(allowsMapPointRendering(baseDomain)).toBe(true)

    const invalidDomain = {
      ...baseDomain,
      source_url: 'https://twitter.com/example',
      methodology_notes: '',
    }

    expect(validateDomainRegistration(invalidDomain)).toBe(false)
    expect(collectDomainRegistrationErrors(invalidDomain)).toEqual(
      expect.arrayContaining([
        'source_url must reference a governed provider, not a social platform',
        'methodology_notes is required',
      ]),
    )
  })

  it('builds explicit correlation links and keeps non-map context off the map canvas', () => {
    const correlationLinks = buildCorrelationLinks({
      domains: [
        baseDomain,
        {
          ...baseDomain,
          domain_id: 'ctx-2',
          domain_name: 'Commodity Index',
          spatial_binding: 'region_bound',
          presentation_type: 'sidebar_timeseries',
        },
      ],
      activeDomainIds: ['ctx-1', 'ctx-2'],
      correlationAoi: 'aoi-7',
      timeRange: buildContextTimeRange({
        startHour: 8,
        endHour: 18,
      }),
    })

    expect(correlationLinks).toHaveLength(2)
    expect(correlationLinks[0].label).toBe('Correlated Context')
    expect(correlationLinks[0].target_id).toBe('aoi-7')
    expect(correlationLinks[1].correlation_type).toBe('region_bound')
    expect(
      allowsMapPointRendering({
        ...baseDomain,
        presentation_type: 'sidebar_timeseries',
      }),
    ).toBe(false)
  })

  it('supports time-range context queries for AOI-correlated records', () => {
    const timeRange = buildContextTimeRange({
      startHour: 8,
      endHour: 18,
    })
    const records = buildSampleContextRecords({
      domain: baseDomain,
      targetId: 'aoi-1',
      timeRange,
    })

    const visible = queryContextRecords({
      records,
      domainId: baseDomain.domain_id,
      targetId: 'aoi-1',
      timeRange,
    })

    expect(visible).toHaveLength(3)
    expect(visible.map((record) => record.observed_at)).toEqual([
      '2026-03-06T10:00:00.000Z',
      '2026-03-06T14:00:00.000Z',
      '2026-03-06T18:00:00.000Z',
    ])
  })

  it('degrades online-only domains gracefully while keeping pre-cacheable domains available offline', () => {
    const timeRange = buildContextTimeRange({
      startHour: 8,
      endHour: 18,
    })
    const records = buildSampleContextRecords({
      domain: baseDomain,
      targetId: 'aoi-1',
      timeRange,
    })

    const preCacheable = summarizeContextAvailability({
      domain: baseDomain,
      visibleRecords: records.slice(1),
      offline: true,
    })
    const onlineOnly = summarizeContextAvailability({
      domain: {
        ...baseDomain,
        domain_id: 'ctx-2',
        offline_behavior: 'online_only',
        presentation_type: 'dashboard_widget',
      },
      visibleRecords: records.slice(1).map((record) => ({
        ...record,
        domain_id: 'ctx-2',
      })),
      offline: true,
    })

    expect(preCacheable.status).toBe('offline_available')
    expect(preCacheable.status_line).toContain('Offline cached domain available')
    expect(onlineOnly.status).toBe('stale_offline')
    expect(onlineOnly.staleness_line).toContain('Stale until live refresh')
  })
})
