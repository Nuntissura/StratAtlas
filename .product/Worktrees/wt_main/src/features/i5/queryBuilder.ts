export type QueryOperator = 'equals' | 'greater_than' | 'less_than' | 'contains'

export interface QueryCondition {
  field: string
  operator: QueryOperator
  value: string | number
}

export interface VersionedQuery {
  queryId: string
  version: number
  conditions: QueryCondition[]
}

export const runQuery = (
  conditions: QueryCondition[],
  rows: Record<string, unknown>[],
): Record<string, unknown>[] =>
  rows.filter((row) =>
    conditions.every((condition) => {
      const current = row[condition.field]
      if (condition.operator === 'equals') {
        return current === condition.value
      }
      if (typeof current !== 'number' || typeof condition.value !== 'number') {
        return false
      }
      if (condition.operator === 'greater_than') {
        return current > condition.value
      }
      if (condition.operator === 'less_than') {
        return current < condition.value
      }
      return false
    }),
  )

export const bumpQueryVersion = (query: VersionedQuery): VersionedQuery => ({
  ...query,
  version: query.version + 1,
})
