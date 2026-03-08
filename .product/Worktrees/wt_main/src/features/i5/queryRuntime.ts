import type { QueryContextRecordsResult } from '../../contracts/i0'
import {
  queryContextRecords as queryContextRecordsLocal,
  type ContextDomain,
  type ContextRecord,
  type ContextTimeRange,
} from '../i7/contextIntake'

export type QueryExecutionSource =
  | 'control_plane'
  | 'fallback'
  | 'control_plane+local'
  | 'fallback+local'
  | 'local'
  | 'none'

export interface GovernedQueryRow extends Record<string, unknown> {
  id: number
  record_id: string
  domain_id: string
  domain_name: string
  type: string
  presentation_type: string
  source_name: string
  region: string
  target_id: string
  hour: number
  speed: number
  value_label: string
  unit: string
  confidence: string
  observed_at: string
  cached_at: string
  context_domains: string[]
}

export interface GovernedQuerySource {
  rows: GovernedQueryRow[]
  source: QueryExecutionSource
  sourceRowCount: number
  domainIds: string[]
}

const stableNumericId = (value: string): number => {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

const observedHour = (observedAt: string): number => {
  const hourSlice = observedAt.slice(11, 13)
  const parsed = Number(hourSlice)
  return Number.isFinite(parsed) ? parsed : -1
}

export const resolveQueryDomainIds = ({
  queryContextDomainIds,
  activeDomainIds,
  domains,
}: {
  queryContextDomainIds: string[]
  activeDomainIds: string[]
  domains: ContextDomain[]
}): string[] => {
  const allowedDomainIds = new Set(domains.map((domain) => domain.domain_id))
  const prioritized =
    queryContextDomainIds.length > 0
      ? queryContextDomainIds
      : activeDomainIds.length > 0
        ? activeDomainIds
        : domains.map((domain) => domain.domain_id)

  return [...new Set(prioritized)].filter((domainId) => allowedDomainIds.has(domainId))
}

export const buildLocalQuerySourceRecords = ({
  records,
  domainIds,
  targetId,
  timeRange,
}: {
  records: ContextRecord[]
  domainIds: string[]
  targetId: string
  timeRange: ContextTimeRange
}): ContextRecord[] =>
  domainIds
    .flatMap((domainId) =>
      queryContextRecordsLocal({
        records,
        domainId,
        targetId,
        timeRange,
      }),
    )
    .sort((left, right) =>
      left.observed_at === right.observed_at
        ? left.record_id.localeCompare(right.record_id)
        : left.observed_at.localeCompare(right.observed_at),
    )

export const mergeQuerySourceRecords = (...recordGroups: ContextRecord[][]): ContextRecord[] => {
  const merged = new Map<string, ContextRecord>()

  recordGroups.forEach((group) => {
    group.forEach((record) => {
      merged.set(record.record_id, record)
    })
  })

  return [...merged.values()].sort((left, right) =>
    left.observed_at === right.observed_at
      ? left.record_id.localeCompare(right.record_id)
      : left.observed_at.localeCompare(right.observed_at),
  )
}

export const materializeGovernedQueryRows = ({
  records,
  domains,
}: {
  records: ContextRecord[]
  domains: ContextDomain[]
}): GovernedQueryRow[] => {
  const domainById = new Map(domains.map((domain) => [domain.domain_id, domain]))
  const contextDomainBuckets = records.reduce((accumulator, record) => {
    const bucketKey = `${record.target_id}|${observedHour(record.observed_at)}`
    const existing = accumulator.get(bucketKey) ?? new Set<string>()
    existing.add(record.domain_id)
    accumulator.set(bucketKey, existing)
    return accumulator
  }, new Map<string, Set<string>>())

  return records.map((record) => {
    const domain = domainById.get(record.domain_id)
    const bucketKey = `${record.target_id}|${observedHour(record.observed_at)}`
    const contextDomains = [...(contextDomainBuckets.get(bucketKey) ?? new Set([record.domain_id]))]
      .filter((entry) => entry.length > 0)
      .sort((left, right) => left.localeCompare(right))
    return {
      id: stableNumericId(record.record_id),
      record_id: record.record_id,
      domain_id: record.domain_id,
      domain_name: domain?.domain_name ?? record.domain_id,
      type: domain?.domain_class ?? record.correlation_type,
      presentation_type: domain?.presentation_type ?? 'map_overlay',
      source_name: record.source_name,
      region: record.target_id,
      target_id: record.target_id,
      hour: observedHour(record.observed_at),
      speed: record.numeric_value,
      value_label: record.value_label,
      unit: record.unit,
      confidence: record.confidence,
      observed_at: record.observed_at,
      cached_at: record.cached_at,
      context_domains: contextDomains,
    }
  })
}

export const buildGovernedQuerySource = ({
  authoritativeResult,
  localRecords,
  domains,
  domainIds,
}: {
  authoritativeResult?: QueryContextRecordsResult
  localRecords: ContextRecord[]
  domains: ContextDomain[]
  domainIds: string[]
}): GovernedQuerySource => {
  const authoritativeRecords = authoritativeResult?.records ?? []
  const mergedRecords =
    authoritativeRecords.length > 0 || localRecords.length > 0
      ? mergeQuerySourceRecords(authoritativeRecords, localRecords)
      : []

  let source: QueryExecutionSource = 'none'
  if (authoritativeResult) {
    const localAugmentedCount = Math.max(0, mergedRecords.length - authoritativeRecords.length)
    source =
      authoritativeResult.source === 'control_plane'
        ? localAugmentedCount > 0
          ? 'control_plane+local'
          : 'control_plane'
        : localAugmentedCount > 0
          ? 'fallback+local'
          : 'fallback'
  } else if (localRecords.length > 0) {
    source = 'local'
  }

  return {
    rows: materializeGovernedQueryRows({
      records: mergedRecords,
      domains,
    }),
    source,
    sourceRowCount: mergedRecords.length,
    domainIds: [...domainIds],
  }
}

export const describeGovernedQuerySource = ({
  source,
  sourceRowCount,
  domainIds,
}: GovernedQuerySource): string => {
  if (source === 'none') {
    return 'Query source: no governed domain rows available for the active AOI/time window.'
  }

  return `Query source: ${source} | Source rows: ${sourceRowCount} | Domains: ${domainIds.length}`
}
