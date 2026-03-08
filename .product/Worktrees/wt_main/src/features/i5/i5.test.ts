// @vitest-environment node

import { describe, expect, it } from 'vitest'
import {
  addQueryCondition,
  buildQueryRenderLayer,
  buildSavedQueryArtifact,
  bumpQueryVersion,
  removeQueryCondition,
  runQuery,
  type VersionedQuery,
} from './queryBuilder'
import { executeQuery } from './queryExecution'
import {
  buildGovernedQuerySource,
  buildLocalQuerySourceRecords,
  describeGovernedQuerySource,
  resolveQueryDomainIds,
} from './queryRuntime'
import type { QueryContextRecordsResult } from '../../contracts/i0'
import type { ContextDomain, ContextRecord } from '../i7/contextIntake'

const baseQuery: VersionedQuery = {
  queryId: 'q-1',
  title: 'Port surge watch',
  version: 1,
  aoi: 'aoi-1',
  timeWindow: {
    startHour: 8,
    endHour: 18,
  },
  contextDomainIds: ['ctx-1'],
  provenanceSource: 'Analyst composed query',
  conditions: [
    {
      conditionId: 'condition-1',
      scope: 'geospatial',
      field: 'type',
      operator: 'equals',
      value: 'vessel',
    },
  ],
}

const governedDomain: ContextDomain = {
  domain_id: 'ctx-governed',
  domain_name: 'Port Throughput',
  domain_class: 'economic_indicator',
  source_name: 'UNCTAD',
  source_url: 'https://example.test/context',
  license: 'public',
  update_cadence: 'monthly',
  spatial_binding: 'point',
  temporal_resolution: 'monthly',
  sensitivity_class: 'PUBLIC',
  confidence_baseline: 'A',
  methodology_notes: 'Official aggregation',
  offline_behavior: 'pre_cacheable',
  presentation_type: 'map_overlay',
  prohibited_uses: ['No entity pursuit'],
}

const tradeDomain: ContextDomain = {
  domain_id: 'ctx-trade',
  domain_name: 'Commodity Trade Volume',
  domain_class: 'trade_flow',
  source_name: 'UN Comtrade',
  source_url: 'https://example.test/trade',
  license: 'public',
  update_cadence: 'monthly',
  spatial_binding: 'point',
  temporal_resolution: 'monthly',
  sensitivity_class: 'PUBLIC',
  confidence_baseline: 'A',
  methodology_notes: 'Official trade aggregation',
  offline_behavior: 'pre_cacheable',
  presentation_type: 'map_overlay',
  prohibited_uses: ['No entity pursuit'],
}

const governedRecords: ContextRecord[] = [
  {
    record_id: 'ctx-governed-record-1',
    domain_id: 'ctx-governed',
    correlation_type: 'aoi_bound',
    target_id: 'aoi-1',
    observed_at: '2026-03-06T10:00:00.000Z',
    value_label: '23 index',
    numeric_value: 23,
    unit: 'index',
    source_name: 'UNCTAD',
    source_url: 'https://example.test/context',
    license: 'public',
    update_cadence: 'monthly',
    confidence: 'A',
    cached_at: '2026-03-06T10:05:00.000Z',
    lineage: ['registration.seed'],
  },
  {
    record_id: 'ctx-governed-record-2',
    domain_id: 'ctx-governed',
    correlation_type: 'aoi_bound',
    target_id: 'aoi-1',
    observed_at: '2026-03-06T14:00:00.000Z',
    value_label: '26 index',
    numeric_value: 26,
    unit: 'index',
    source_name: 'UNCTAD',
    source_url: 'https://example.test/context',
    license: 'public',
    update_cadence: 'monthly',
    confidence: 'A',
    cached_at: '2026-03-06T14:05:00.000Z',
    lineage: ['registration.seed'],
  },
  {
    record_id: 'ctx-trade-record-1',
    domain_id: 'ctx-trade',
    correlation_type: 'aoi_bound',
    target_id: 'aoi-1',
    observed_at: '2026-03-06T14:20:00.000Z',
    value_label: '18 index',
    numeric_value: 18,
    unit: 'index',
    source_name: 'UN Comtrade',
    source_url: 'https://example.test/trade',
    license: 'public',
    update_cadence: 'monthly',
    confidence: 'A',
    cached_at: '2026-03-06T14:25:00.000Z',
    lineage: ['registration.seed'],
  },
]

describe('I5 query builder', () => {
  it('runs composable context-aware queries and versions saved definitions', () => {
    const rows = [
      {
        id: 1,
        speed: 20,
        type: 'vessel',
        region: 'aoi-1',
        hour: 10,
        context_domains: ['ctx-1'],
      },
      {
        id: 2,
        speed: 40,
        type: 'vessel',
        region: 'aoi-1',
        hour: 11,
        context_domains: ['ctx-1', 'ctx-2'],
      },
      {
        id: 3,
        speed: 55,
        type: 'aircraft',
        region: 'aoi-2',
        hour: 11,
        context_domains: ['ctx-1'],
      },
    ]

    const withSpeed = addQueryCondition(baseQuery, {
      scope: 'temporal',
      field: 'speed',
      operator: 'greater_than',
      value: 30,
    })
    const query = addQueryCondition(withSpeed, {
      scope: 'context',
      field: 'context_domains',
      operator: 'contains',
      value: 'ctx-1',
    })

    const result = runQuery(query, rows)
    expect(result).toHaveLength(1)
    expect(result[0]?.id).toBe(2)

    const renderLayer = buildQueryRenderLayer(query, result)
    expect(renderLayer.layerId).toBe('query-layer-q-1-v1')
    expect(renderLayer.matchedRowIds).toEqual([2])

    const savedQuery = bumpQueryVersion(query, {
      title: 'Port surge watch v2',
      savedAt: '2026-03-06T00:00:00.000Z',
    })
    const artifactOne = buildSavedQueryArtifact(savedQuery, renderLayer, {
      savedAt: '2026-03-06T00:00:00.000Z',
    })
    const artifactTwo = buildSavedQueryArtifact(savedQuery, renderLayer, {
      savedAt: '2026-03-06T00:00:00.000Z',
    })

    expect(savedQuery.version).toBe(2)
    expect(artifactOne.artifactId).toBe(artifactTwo.artifactId)
    expect(artifactOne.exportFingerprint).toBe(artifactTwo.exportFingerprint)

    const cleaned = removeQueryCondition(savedQuery, 'condition-2')
    expect(cleaned.conditions).toHaveLength(2)
  })

  it('materializes governed query rows from authoritative and local context records', () => {
    const domainIds = resolveQueryDomainIds({
      queryContextDomainIds: [],
      activeDomainIds: ['ctx-governed', 'ctx-trade'],
      domains: [governedDomain, tradeDomain],
    })
    expect(domainIds).toEqual(['ctx-governed', 'ctx-trade'])

    const localRecords = buildLocalQuerySourceRecords({
      records: governedRecords,
      domainIds,
      targetId: 'aoi-1',
      timeRange: {
        start: '2026-03-06T08:00:00.000Z',
        end: '2026-03-06T18:00:00.000Z',
      },
    })
    expect(localRecords).toHaveLength(3)

    const authoritativeResult: QueryContextRecordsResult = {
      records: [governedRecords[0]],
      queryRange: {
        start: '2026-03-06T08:00:00.000Z',
        end: '2026-03-06T18:00:00.000Z',
      },
      totalRecords: 1,
      source: 'control_plane',
    }

    const governedSource = buildGovernedQuerySource({
      authoritativeResult,
      localRecords,
      domains: [governedDomain, tradeDomain],
      domainIds,
    })

    expect(governedSource.source).toBe('control_plane+local')
    expect(governedSource.sourceRowCount).toBe(3)
    expect(governedSource.rows.map((row) => row.record_id)).toEqual([
      'ctx-governed-record-1',
      'ctx-governed-record-2',
      'ctx-trade-record-1',
    ])
    expect(governedSource.rows[0]?.speed).toBe(23)
    expect(governedSource.rows[0]?.type).toBe('economic_indicator')
    expect(governedSource.rows[1]?.context_domains).toEqual(['ctx-governed', 'ctx-trade'])
    expect(governedSource.rows[2]?.context_domains).toEqual(['ctx-governed', 'ctx-trade'])
    expect(describeGovernedQuerySource(governedSource)).toBe(
      'Query source: control_plane+local | Source rows: 3 | Domains: 2',
    )
  })

  it('executes governed queries through DuckDB and preserves context-aware predicates', async () => {
    const query: VersionedQuery = {
      ...baseQuery,
      contextDomainIds: ['ctx-governed', 'ctx-trade'],
      conditions: [
        {
          conditionId: 'condition-speed',
          scope: 'temporal',
          field: 'speed',
          operator: 'greater_than',
          value: 20,
        },
      ],
    }

    const governedSource = buildGovernedQuerySource({
      localRecords: governedRecords,
      domains: [governedDomain, tradeDomain],
      domainIds: ['ctx-governed', 'ctx-trade'],
    })
    const execution = await executeQuery(query, governedSource.rows)

    expect(execution.engine).toBe('duckdb-wasm')
    expect(execution.runtime).toBe('node-blocking')
    expect(execution.resultCount).toBe(1)
    expect(execution.matchedRowIds).toEqual([governedSource.rows[1]?.id])
    expect(execution.summary).toContain('duckdb-wasm (node-blocking)')
    expect(execution.sqlFingerprint).toMatch(/^queryexec-/)
  })
})
