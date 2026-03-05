import { describe, expect, it } from 'vitest'
import { bumpQueryVersion, runQuery, type VersionedQuery } from './queryBuilder'

describe('I5 query builder', () => {
  it('runs composable queries and versions saved definitions', () => {
    const rows = [
      { id: 1, speed: 20, type: 'vessel' },
      { id: 2, speed: 40, type: 'vessel' },
    ]
    const result = runQuery(
      [
        { field: 'type', operator: 'equals', value: 'vessel' },
        { field: 'speed', operator: 'greater_than', value: 30 },
      ],
      rows,
    )
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(2)

    const query: VersionedQuery = {
      queryId: 'q-1',
      version: 1,
      conditions: [{ field: 'speed', operator: 'greater_than', value: 10 }],
    }
    expect(bumpQueryVersion(query).version).toBe(2)

    const containsResult = runQuery(
      [{ field: 'type', operator: 'contains', value: 'ves' }],
      rows,
    )
    expect(containsResult).toHaveLength(2)
  })
})
