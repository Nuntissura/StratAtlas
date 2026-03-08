export type QueryOperator = 'equals' | 'greater_than' | 'less_than' | 'contains'

export type QueryConditionScope = 'geospatial' | 'temporal' | 'context'

export interface QueryCondition {
  conditionId: string
  scope: QueryConditionScope
  field: string
  operator: QueryOperator
  value: string | number
}

export interface QueryTimeWindow {
  startHour: number
  endHour: number
}

export interface VersionedQuery {
  queryId: string
  title: string
  version: number
  aoi: string
  timeWindow: QueryTimeWindow
  contextDomainIds: string[]
  provenanceSource: string
  conditions: QueryCondition[]
}

export interface QueryRenderLayer {
  layerId: string
  label: 'Observed Evidence'
  summary: string
  resultCount: number
  matchedRowIds: number[]
  aoi: string
  contextDomainIds: string[]
  ephemeral: true
}

export interface SavedQueryArtifact {
  artifactId: string
  queryId: string
  version: number
  title: string
  summary: string
  resultLayerId: string
  matchedRowIds: number[]
  savedAt: string
  provenanceSource: string
  exportFingerprint: string
}

type QueryRow = Record<string, unknown> & {
  id?: number
  region?: string
  hour?: number
  context_domains?: string[]
}

export interface QueryMatchSnapshot {
  resultCount: number
  matchedRowIds: number[]
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const normalizeJson = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map((entry) => normalizeJson(entry))
  }
  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, entry]) => [key, normalizeJson(entry)]),
    )
  }
  return value
}

const stableSerialize = (value: unknown): string => JSON.stringify(normalizeJson(value))

const stableFingerprint = (value: unknown): string => {
  const serialized = stableSerialize(value)
  let hash = 2166136261
  for (let index = 0; index < serialized.length; index += 1) {
    hash ^= serialized.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return `query-${(hash >>> 0).toString(16).padStart(8, '0')}`
}

const evaluateCondition = (condition: QueryCondition, row: QueryRow): boolean => {
  const current = row[condition.field]
  if (condition.operator === 'equals') {
    return current === condition.value
  }

  if (condition.operator === 'contains') {
    if (Array.isArray(current)) {
      return current.some(
        (entry) =>
          typeof entry === 'string' &&
          entry.toLowerCase().includes(String(condition.value).toLowerCase()),
      )
    }
    if (typeof current !== 'string') {
      return false
    }
    return current.toLowerCase().includes(String(condition.value).toLowerCase())
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
}

export const addQueryCondition = (
  query: VersionedQuery,
  condition: Omit<QueryCondition, 'conditionId'> & { conditionId?: string },
): VersionedQuery => ({
  ...query,
  conditions: [
    ...query.conditions,
    {
      conditionId: condition.conditionId ?? `condition-${query.conditions.length + 1}`,
      scope: condition.scope,
      field: condition.field,
      operator: condition.operator,
      value: condition.value,
    },
  ],
})

export const removeQueryCondition = (
  query: VersionedQuery,
  conditionId: string,
): VersionedQuery => ({
  ...query,
  conditions: query.conditions.filter((condition) => condition.conditionId !== conditionId),
})

export const runQuery = (
  query: VersionedQuery,
  rows: QueryRow[],
): QueryRow[] =>
  rows.filter((row) => {
    const rowRegion = typeof row.region === 'string' ? row.region : ''
    const rowHour = typeof row.hour === 'number' ? row.hour : -1
    const rowContextDomains = Array.isArray(row.context_domains)
      ? row.context_domains.filter((entry): entry is string => typeof entry === 'string')
      : []

    if (query.aoi && rowRegion !== query.aoi) {
      return false
    }
    if (rowHour < query.timeWindow.startHour || rowHour > query.timeWindow.endHour) {
      return false
    }
    if (
      query.contextDomainIds.length > 0 &&
      !query.contextDomainIds.every((domainId) => rowContextDomains.includes(domainId))
    ) {
      return false
    }

    return query.conditions.every((condition) => evaluateCondition(condition, row))
  })

export const bumpQueryVersion = (
  query: VersionedQuery,
  {
    title,
    savedAt = new Date().toISOString(),
  }: {
    title?: string
    savedAt?: string
  } = {},
): VersionedQuery => ({
  ...query,
  title: title?.trim() || query.title,
  version: query.version + 1,
  provenanceSource: `${query.provenanceSource} | saved ${savedAt}`,
})

export const buildQueryRenderLayer = (
  query: VersionedQuery,
  rows: QueryRow[],
): QueryRenderLayer =>
  buildQueryRenderLayerFromMatches(query, {
    resultCount: rows.length,
    matchedRowIds: rows
      .map((row) => row.id)
      .filter((entry): entry is number => typeof entry === 'number'),
  })

export const buildQueryRenderLayerFromMatches = (
  query: VersionedQuery,
  match: QueryMatchSnapshot,
): QueryRenderLayer => ({
  layerId: `query-layer-${query.queryId}-v${query.version}`,
  label: 'Observed Evidence',
  summary: `${match.resultCount} rows rendered for ${query.title} in ${query.aoi || 'all AOIs'}`,
  resultCount: match.resultCount,
  matchedRowIds: [...match.matchedRowIds],
  aoi: query.aoi,
  contextDomainIds: [...query.contextDomainIds],
  ephemeral: true,
})

export const buildSavedQueryArtifact = (
  query: VersionedQuery,
  renderLayer: QueryRenderLayer,
  {
    savedAt = new Date().toISOString(),
  }: {
    savedAt?: string
  } = {},
): SavedQueryArtifact => {
  const exportFingerprint = stableFingerprint({
    query,
    renderLayer,
  })

  return {
    artifactId: `saved-query-${exportFingerprint}`,
    queryId: query.queryId,
    version: query.version,
    title: query.title,
    summary: `${renderLayer.summary}; ${query.conditions.length} conditions.`,
    resultLayerId: renderLayer.layerId,
    matchedRowIds: [...renderLayer.matchedRowIds],
    savedAt,
    provenanceSource: query.provenanceSource,
    exportFingerprint,
  }
}
