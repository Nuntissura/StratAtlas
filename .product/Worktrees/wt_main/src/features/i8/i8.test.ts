import { describe, expect, it } from 'vitest'
import { buildContextTimeRange, buildSampleContextRecords, type ContextDomain } from '../i7/contextIntake'
import {
  buildConstraintNodeSuggestion,
  createDeviationSnapshot,
  detectDeviation,
  detectDeviationFromRecords,
  normalizeDeviationSnapshot,
  pushDeviationEvent,
} from './deviation'

const constraintDomain: ContextDomain = {
  domain_id: 'ctx-infra-1',
  domain_name: 'Refinery Throughput',
  domain_class: 'infrastructure',
  source_name: 'National Energy Board',
  source_url: 'https://example.test/refinery',
  license: 'public',
  update_cadence: 'daily',
  spatial_binding: 'point',
  temporal_resolution: 'daily',
  sensitivity_class: 'INTERNAL',
  confidence_baseline: 'B',
  methodology_notes: 'Curated refinery utilization series.',
  offline_behavior: 'pre_cacheable',
  presentation_type: 'constraint_node',
  prohibited_uses: ['MUST NOT be used for individual entity tracking'],
}

describe('I8 context deviation detection', () => {
  it('emits a standard context.deviation event with taxonomy, baseline reference, and confidence score', () => {
    const event = detectDeviation(
      [
        { ts: '2026-03-06T08:00:00.000Z', value: 100 },
        { ts: '2026-03-06T10:00:00.000Z', value: 102 },
      ],
      [
        { ts: '2026-03-06T12:00:00.000Z', value: 145 },
        { ts: '2026-03-06T14:00:00.000Z', value: 149 },
      ],
      0.2,
      'trade_flow',
      {
        domainId: 'ctx-trade-1',
        domainName: 'LNG Export Volume',
        targetId: 'aoi-1',
        confidenceBaseline: 'A',
      },
    )

    expect(event?.event_type).toBe('context.deviation')
    expect(event?.taxonomy_key).toBe('context.trade_flow_deviation')
    expect(event?.baseline_reference).toContain('baseline')
    expect(event?.confidence_score).toBeGreaterThan(0.9)
    expect(event?.artifact_label).toBe('Curated Context')
  })

  it('detects infrastructure deviations from context records and produces scenario-ready constraint suggestions', () => {
    const records = buildSampleContextRecords({
      domain: constraintDomain,
      targetId: 'aoi-7',
      timeRange: buildContextTimeRange({
        startHour: 8,
        endHour: 18,
      }),
    }).map((record, index) => ({
      ...record,
      numeric_value: index < 2 ? 100 + index : 45 + index,
      value_label: index < 2 ? `${100 + index} index` : `${45 + index} index`,
    }))

    const event = detectDeviationFromRecords({
      domain: constraintDomain,
      records,
      targetId: 'aoi-7',
      threshold: 0.2,
      deviationType: 'infrastructure',
    })

    expect(event?.taxonomy_key).toBe('context.supply_chain_shift')
    expect(event?.deviation_type).toBe('infrastructure')
    expect(event?.score).toBeGreaterThan(0.2)

    const latestRecord = records.at(-1)
    expect(latestRecord).toBeDefined()
    const suggestion = buildConstraintNodeSuggestion({
      domain: constraintDomain,
      latestRecord: latestRecord!,
      event: event!,
    })

    expect(suggestion?.constraintId).toBe('ctx-infra-1')
    expect(suggestion?.recommendedValue).toBe(latestRecord?.numeric_value)
    expect(suggestion?.rationale).toContain('modeled scenario input')
  })

  it('stores deviation events and suggestions in a replay-safe snapshot', () => {
    const snapshot = createDeviationSnapshot()
    const event = detectDeviation(
      [{ ts: '1', value: 10 }],
      [{ ts: '2', value: 25 }],
      0.2,
      'regulatory',
      {
        domainId: 'ctx-reg-1',
        domainName: 'Sanctions Regime',
        targetId: 'aoi-4',
        confidenceBaseline: 'B',
      },
    )

    expect(event).not.toBeNull()

    const updated = pushDeviationEvent(snapshot, event!)
    const normalized = normalizeDeviationSnapshot(updated)

    expect(normalized.latestEvent?.taxonomy_key).toBe('context.regulatory_change')
    expect(normalized.events).toHaveLength(1)
    expect(normalized.suggestions).toHaveLength(0)
  })
})
