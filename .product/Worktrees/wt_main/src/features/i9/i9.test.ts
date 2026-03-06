import { describe, expect, it } from 'vitest'
import type { ContextDomain } from '../i7/contextIntake'
import {
  aggregateAlerts,
  buildContextThresholdRef,
  buildOsintEvent,
  createOsintSnapshot,
  normalizeOsintSnapshot,
  pushContextThresholdRef,
  pushOsintEvent,
  validateCuratedSource,
} from './osint'

const thresholdDomain: ContextDomain = {
  domain_id: 'ctx-port-1',
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
})
