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
})
