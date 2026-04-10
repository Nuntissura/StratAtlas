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
import {
  buildGovernedDomainDraft,
  materializeGovernedContextRecords,
  resolveGovernedDomainRegistration,
} from './governedDomains'
import { buildGlobalEventTimeline } from './eventTimeline'
import { detectDeviation } from '../i8/deviation'
import { aggregateAlerts, buildOsintEvent } from '../i9/osint'

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

  it('materializes governed catalog records instead of registration-time synthetic records', () => {
    const draft = buildGovernedDomainDraft('port-throughput-monthly')
    const resolved = resolveGovernedDomainRegistration({
      ...draft,
      presentation_type: 'constraint_node',
      offline_behavior: 'online_only',
    })

    expect(resolved).not.toBeNull()
    expect(resolved?.domain_name).toBe('Port Throughput')
    expect(resolved?.presentation_type).toBe('constraint_node')
    expect(resolved?.offline_behavior).toBe('online_only')

    const timeRange = buildContextTimeRange({
      startHour: 8,
      endHour: 18,
    })
    const records = materializeGovernedContextRecords({
      domain: resolved as ContextDomain,
      targetId: 'aoi-9',
      timeRange,
    })

    expect(records).toHaveLength(3)
    expect(records[0].record_id).toContain('port-throughput-monthly-aoi-9')
    expect(records[0].lineage).toEqual(
      expect.arrayContaining([
        'governed.catalog:port-throughput-monthly',
        'pipeline:wp-i7-002',
        'target:aoi-9',
      ]),
    )
    expect(records.at(-1)?.value_label).toBe('11 index')
  })

  it('builds a deterministic global event timeline with truthful metadata', () => {
    const deviationEvent =
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
          domainId: baseDomain.domain_id,
          domainName: baseDomain.domain_name,
          targetId: 'aoi-7',
          confidenceBaseline: baseDomain.confidence_baseline,
        },
      ) ?? undefined

    const osintEvents = [
      buildOsintEvent({
        source: 'ACLED',
        verification: 'confirmed',
        aoi: 'aoi-7',
        category: 'security_advisory',
        summary: 'Port disruption remains active in curated reporting.',
        retrievedAt: '2026-03-06T18:00:00.000Z',
        sourceMode: 'governed_connector',
        connectorId: 'logistics-disruption-watch',
      }),
      buildOsintEvent({
        source: 'ReliefWeb',
        verification: 'reported',
        aoi: 'aoi-1',
        category: 'natural_disaster',
        summary: 'Weather spillover may affect Singapore throughput.',
        retrievedAt: '2026-03-06T16:00:00.000Z',
      }),
    ]

    const timeline = buildGlobalEventTimeline({
      domains: [baseDomain],
      latestDeviationEvent: deviationEvent,
      osintSummary: aggregateAlerts(osintEvents, 'aoi-7'),
      osintEvents,
    })

    expect(deviationEvent).toBeDefined()
    expect(timeline.map((entry) => entry.eventId)).toEqual([
      expect.stringContaining('osint-alert-aoi-7'),
      osintEvents[0].event_id,
      osintEvents[1].event_id,
      deviationEvent!.eventId,
    ])
    expect(timeline[0]).toMatchObject({
      aggregateOnly: true,
      mapEligible: true,
    })
    expect(timeline[1]).toMatchObject({
      source: 'ACLED',
      cadence: 'Connector snapshot',
      confidence: 'Verification confirmed',
      mapEligible: true,
    })
    expect(timeline[3]).toMatchObject({
      source: 'UNCTAD',
      cadence: 'Derived from monthly',
    })
  })

  it('keeps non-map context events in the timeline while marking them as timeline-only', () => {
    const timelineOnlyDomain: ContextDomain = {
      ...baseDomain,
      domain_id: 'ctx-sidebar',
      domain_name: 'Commodity Index',
      presentation_type: 'sidebar_timeseries',
    }
    const deviationEvent =
      detectDeviation(
        [
          { ts: '2026-03-06T08:00:00.000Z', value: 10 },
          { ts: '2026-03-06T10:00:00.000Z', value: 10 },
        ],
        [
          { ts: '2026-03-06T12:00:00.000Z', value: 18 },
        ],
        0.2,
        'trade_flow',
        {
          domainId: timelineOnlyDomain.domain_id,
          domainName: timelineOnlyDomain.domain_name,
          targetId: 'aoi-1',
          confidenceBaseline: timelineOnlyDomain.confidence_baseline,
        },
      ) ?? undefined

    const timeline = buildGlobalEventTimeline({
      domains: [timelineOnlyDomain],
      latestDeviationEvent: deviationEvent,
      osintEvents: [],
    })

    expect(timeline).toHaveLength(1)
    expect(timeline[0]?.mapEligible).toBe(false)
    expect(timeline[0]?.aggregateOnly).toBe(false)
  })
})
