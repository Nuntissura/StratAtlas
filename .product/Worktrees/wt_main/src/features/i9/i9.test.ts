import { describe, expect, it } from 'vitest'
import type { ContextDomain, ContextRecord } from '../i7/contextIntake'
import type { DeviationEvent } from '../i8/deviation'
import {
  DEFAULT_GOVERNED_FEED_CONNECTOR_ID,
  aggregateAlerts,
  buildContextThresholdRef,
  buildOsintEvent,
  createOsintSnapshot,
  executeGovernedFeedConnector,
  normalizeOsintSnapshot,
  pushContextThresholdRef,
  pushOsintEvent,
  recordGovernedFeedConnector,
  validateCuratedSource,
} from './osint'

const thresholdDomain: ContextDomain = {
  domain_id: 'port-throughput-monthly',
  domain_name: 'Port Throughput',
  domain_class: 'infrastructure',
  source_name: 'UNCTAD',
  source_url: 'https://example.test/ports',
  license: 'public',
  update_cadence: 'daily',
  spatial_binding: 'point',
  temporal_resolution: 'daily',
  sensitivity_class: 'INTERNAL',
  confidence_baseline: 'B',
  methodology_notes: 'Curated port utilization feed.',
  offline_behavior: 'pre_cacheable',
  presentation_type: 'map_overlay',
  prohibited_uses: ['MUST NOT be used for individual entity tracking'],
}

const tradeDomain: ContextDomain = {
  domain_id: 'bilateral-trade-flows',
  domain_name: 'Bilateral Trade Flows',
  domain_class: 'trade_flow',
  source_name: 'UN Comtrade / IMF DOTS',
  source_url: 'https://example.test/trade',
  license: 'public',
  update_cadence: 'monthly',
  spatial_binding: 'region_bound',
  temporal_resolution: 'monthly',
  sensitivity_class: 'PUBLIC',
  confidence_baseline: 'B',
  methodology_notes: 'Curated trade lane reporting.',
  offline_behavior: 'pre_cacheable',
  presentation_type: 'sidebar_timeseries',
  prohibited_uses: ['MUST NOT be used for individual entity tracking'],
}

const sanctionsDomain: ContextDomain = {
  domain_id: 'sanctions-regime-updates',
  domain_name: 'Sanctions Regime Updates',
  domain_class: 'regulatory',
  source_name: 'OFAC / EU / UN snapshots',
  source_url: 'https://example.test/sanctions',
  license: 'public',
  update_cadence: 'event-driven',
  spatial_binding: 'entity_class_bound',
  temporal_resolution: 'event-driven',
  sensitivity_class: 'PUBLIC',
  confidence_baseline: 'A',
  methodology_notes: 'Curated sanctions snapshots.',
  offline_behavior: 'pre_cacheable',
  presentation_type: 'constraint_node',
  prohibited_uses: ['MUST NOT be used to infer hidden organizational ties'],
}

const contextRecords: ContextRecord[] = [
  {
    record_id: 'port-1',
    domain_id: 'port-throughput-monthly',
    correlation_type: 'infrastructure_node_bound',
    target_id: 'aoi-1',
    observed_at: '2026-03-06T18:00:00.000Z',
    value_label: '11 index',
    numeric_value: 11,
    unit: 'index',
    source_name: thresholdDomain.source_name,
    source_url: thresholdDomain.source_url,
    license: thresholdDomain.license,
    update_cadence: thresholdDomain.update_cadence,
    confidence: 'A',
    cached_at: '2026-03-05T12:00:00.000Z',
    lineage: ['governed.catalog:port-throughput-monthly'],
    verification_level: 'confirmed',
  },
  {
    record_id: 'trade-1',
    domain_id: 'bilateral-trade-flows',
    correlation_type: 'region_bound',
    target_id: 'aoi-1',
    observed_at: '2026-03-06T18:00:00.000Z',
    value_label: '84 trade index',
    numeric_value: 84,
    unit: 'trade index',
    source_name: tradeDomain.source_name,
    source_url: tradeDomain.source_url,
    license: tradeDomain.license,
    update_cadence: tradeDomain.update_cadence,
    confidence: 'B',
    cached_at: '2026-03-05T10:15:00.000Z',
    lineage: ['governed.catalog:bilateral-trade-flows'],
    verification_level: 'reported',
  },
  {
    record_id: 'sanctions-1',
    domain_id: 'sanctions-regime-updates',
    correlation_type: 'entity_class_bound',
    target_id: 'aoi-1',
    observed_at: '2026-03-06T18:00:00.000Z',
    value_label: '2 regime actions',
    numeric_value: 2,
    unit: 'regime actions',
    source_name: sanctionsDomain.source_name,
    source_url: sanctionsDomain.source_url,
    license: sanctionsDomain.license,
    update_cadence: sanctionsDomain.update_cadence,
    confidence: 'A',
    cached_at: '2026-03-05T20:45:00.000Z',
    lineage: ['governed.catalog:sanctions-regime-updates'],
    verification_level: 'confirmed',
  },
]

const governedDeviationEvent: DeviationEvent = {
  eventId: 'context-deviation-port-throughput-monthly-trade_flow-aoi-1-2026-03-06T18-00-00-000Z',
  event_type: 'context.deviation',
  taxonomy_key: 'context.trade_flow_deviation',
  deviation_type: 'trade_flow',
  score: 1.8,
  baseline: 24,
  observed: 11,
  confidence_score: 0.91,
  domain_id: 'port-throughput-monthly',
  domain_name: 'Port Throughput',
  target_id: 'aoi-1',
  baseline_reference: 'baseline@2026-03-06T10:00:00.000Z',
  baseline_start: '2026-03-06T10:00:00.000Z',
  baseline_end: '2026-03-06T14:00:00.000Z',
  observed_start: '2026-03-06T18:00:00.000Z',
  observed_end: '2026-03-06T18:00:00.000Z',
  baseline_sample_count: 2,
  observed_sample_count: 2,
  deviation_magnitude: 1.8,
  artifact_label: 'Curated Context',
  summary: 'Port throughput fell below the governed historical window.',
  source_mode: 'governed_series',
  source_record_ids: ['port-1'],
}

describe('I9 osint and aggregate alerts', () => {
  it('accepts curated sources and produces aggregate-only AOI alerts with threshold references', () => {
    expect(validateCuratedSource('ACLED')).toBe(true)
    expect(validateCuratedSource('acled')).toBe(true)
    expect(validateCuratedSource('UnknownFeed')).toBe(false)

    const thresholdRef = buildContextThresholdRef({
      domain: thresholdDomain,
      comparator: 'below',
      thresholdValue: 15,
      unit: 'index',
      referenceNote: 'Aggregate-only AOI alert reference.',
    })

    const summary = aggregateAlerts(
      [
        buildOsintEvent({
          source: 'ACLED',
          verification: 'confirmed',
          aoi: 'aoi-1',
          category: 'conflict_event',
          summary: 'Confirmed aggregate disruption',
          retrievedAt: '2026-03-06T08:00:00.000Z',
        }),
        buildOsintEvent({
          source: 'GDELT',
          verification: 'alleged',
          aoi: 'aoi-1',
          category: 'security_advisory',
          summary: 'Alleged advisory signal',
          retrievedAt: '2026-03-06T09:00:00.000Z',
        }),
        buildOsintEvent({
          source: 'ACLED',
          verification: 'reported',
          aoi: 'aoi-2',
          category: 'natural_disaster',
          summary: 'Other AOI event',
          retrievedAt: '2026-03-06T10:00:00.000Z',
        }),
      ],
      'aoi-1',
      [thresholdRef],
    )

    expect(summary.aggregate_only).toBe(true)
    expect(summary.count).toBe(2)
    expect(summary.verificationBreakdown.alleged).toBe(1)
    expect(summary.threshold_refs[0]?.domain_name).toBe('Port Throughput')
    expect(summary.summary).toContain('Port Throughput below 15 index')
  })

  it('stores OSINT events and threshold refs in a replay-safe snapshot', () => {
    const thresholdRef = buildContextThresholdRef({
      domain: thresholdDomain,
      comparator: 'above',
      thresholdValue: 30,
      unit: 'index',
      referenceNote: 'Escalation threshold',
    })
    const event = buildOsintEvent({
      source: 'Crisis24',
      verification: 'reported',
      aoi: 'aoi-7',
      category: 'security_advisory',
      summary: 'Curated advisory for the AOI',
      retrievedAt: '2026-03-06T11:00:00.000Z',
    })

    const snapshot = pushContextThresholdRef(
      pushOsintEvent(createOsintSnapshot('aoi-7'), event, 'aoi-7'),
      thresholdRef,
      'aoi-7',
    )
    const normalized = normalizeOsintSnapshot(snapshot)

    expect(normalized.selectedAoi).toBe('aoi-7')
    expect(normalized.events[0]?.source).toBe('CRISIS24')
    expect(normalized.latestAlert?.aggregate_only).toBe(true)
    expect(normalized.thresholdRefs[0]?.comparator).toBe('above')
    expect(normalized.latestAlert?.threshold_refs).toHaveLength(1)
  })

  it('materializes governed connector events from approved context and deviation state', () => {
    const execution = executeGovernedFeedConnector({
      snapshot: createOsintSnapshot('aoi-1'),
      connectorId: DEFAULT_GOVERNED_FEED_CONNECTOR_ID,
      aoi: 'aoi-1',
      contextDomains: [thresholdDomain, tradeDomain, sanctionsDomain],
      contextRecords,
      thresholdDomain,
      thresholdComparator: 'below',
      thresholdValue: 12,
      latestDeviationEvent: governedDeviationEvent,
      now: '2026-03-07T09:00:00.000Z',
    })

    expect(execution).not.toBeNull()
    expect(execution?.events).toHaveLength(2)
    expect(execution?.events[0]?.connector_id).toBe(DEFAULT_GOVERNED_FEED_CONNECTOR_ID)
    expect(execution?.events[0]?.source_mode).toBe('governed_connector')
    expect(execution?.events[0]?.summary).toContain('Deviation watch')
    expect(execution?.thresholdRefs[0]?.domain_name).toBe('Port Throughput')
    expect(execution?.latestAlert.connector_label).toBe('Logistics Disruption Watch')

    const recorded = recordGovernedFeedConnector(
      createOsintSnapshot('aoi-1'),
      execution!,
      'aoi-1',
    )
    const normalized = normalizeOsintSnapshot(recorded)

    expect(normalized.sourceMode).toBe('governed_connector')
    expect(normalized.selectedConnectorId).toBe(DEFAULT_GOVERNED_FEED_CONNECTOR_ID)
    expect(normalized.latestConnectorRun?.source_event_ids).toHaveLength(2)
    expect(normalized.latestAlert?.deviation_event_id).toBe(governedDeviationEvent.eventId)
    expect(normalized.latestAlert?.count).toBe(2)
  })
})
