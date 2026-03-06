export type DomainClass =
  | 'trade_flow'
  | 'commodity'
  | 'infrastructure'
  | 'osint_event'
  | 'regulatory'
  | 'environmental'
  | 'demographic'
  | 'economic_indicator'

export type SpatialBinding =
  | 'point'
  | 'polygon'
  | 'corridor'
  | 'aoi_correlated'
  | 'non_spatial'
  | 'region_bound'
  | 'entity_class_bound'

export type PresentationType =
  | 'map_overlay'
  | 'sidebar_timeseries'
  | 'dashboard_widget'
  | 'constraint_node'

export type CorrelationType =
  | 'aoi_bound'
  | 'entity_class_bound'
  | 'infrastructure_node_bound'
  | 'region_bound'

export type ContextAvailabilityStatus =
  | 'live'
  | 'offline_available'
  | 'stale_offline'
  | 'unavailable'

export interface ContextDomain {
  domain_id: string
  domain_name: string
  domain_class: DomainClass
  source_name: string
  source_url: string
  license: string
  update_cadence: string
  spatial_binding: SpatialBinding
  temporal_resolution: string
  sensitivity_class: 'PUBLIC' | 'INTERNAL' | 'RESTRICTED'
  confidence_baseline: string
  methodology_notes: string
  offline_behavior: 'pre_cacheable' | 'online_only'
  presentation_type: PresentationType
  prohibited_uses?: string[]
}

export interface ContextTimeRange {
  start: string
  end: string
}

export interface ContextCorrelationLink {
  link_id: string
  domain_id: string
  correlation_type: CorrelationType
  target_id: string
  label: 'Correlated Context'
  enabled: boolean
  time_range: ContextTimeRange
}

export interface ContextRecord {
  record_id: string
  domain_id: string
  correlation_type: CorrelationType
  target_id: string
  observed_at: string
  value_label: string
  numeric_value: number
  unit: string
  source_name: string
  source_url: string
  license: string
  update_cadence: string
  confidence: string
  cached_at: string
  lineage: string[]
  verification_level?: 'confirmed' | 'reported' | 'alleged'
}

export interface ContextAvailabilitySummary {
  domain_id: string
  status: ContextAvailabilityStatus
  status_line: string
  staleness_line: string
  latest_record?: ContextRecord
  visible_records: ContextRecord[]
}

const DOMAIN_CLASSES: DomainClass[] = [
  'trade_flow',
  'commodity',
  'infrastructure',
  'osint_event',
  'regulatory',
  'environmental',
  'demographic',
  'economic_indicator',
]

const SPATIAL_BINDINGS: SpatialBinding[] = [
  'point',
  'polygon',
  'corridor',
  'aoi_correlated',
  'non_spatial',
  'region_bound',
  'entity_class_bound',
]

const PRESENTATION_TYPES: PresentationType[] = [
  'map_overlay',
  'sidebar_timeseries',
  'dashboard_widget',
  'constraint_node',
]

const SOCIAL_SOURCE_PATTERNS = [
  'twitter.com',
  'x.com',
  'facebook.com',
  'instagram.com',
  'tiktok.com',
  'wechat.com',
  'telegram.org',
] as const

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0

const compareIsoTimestamps = (left: string, right: string): number => left.localeCompare(right)

const lowerBound = (records: ContextRecord[], observedAt: string): number => {
  let low = 0
  let high = records.length

  while (low < high) {
    const middle = Math.floor((low + high) / 2)
    if (compareIsoTimestamps(records[middle].observed_at, observedAt) < 0) {
      low = middle + 1
    } else {
      high = middle
    }
  }

  return low
}

const buildIsoHour = (anchorDay: string, hour: number): string =>
  `${anchorDay}T${hour.toString().padStart(2, '0')}:00:00.000Z`

export const collectDomainRegistrationErrors = (domain: ContextDomain): string[] => {
  const issues: string[] = []

  if (!isNonEmptyString(domain.domain_id)) {
    issues.push('domain_id is required')
  }
  if (!isNonEmptyString(domain.domain_name)) {
    issues.push('domain_name is required')
  }
  if (!DOMAIN_CLASSES.includes(domain.domain_class)) {
    issues.push('domain_class is invalid')
  }
  if (!isNonEmptyString(domain.source_name)) {
    issues.push('source_name is required')
  }
  if (!isNonEmptyString(domain.source_url) || !domain.source_url.startsWith('http')) {
    issues.push('source_url must be http/https')
  }
  if (SOCIAL_SOURCE_PATTERNS.some((pattern) => domain.source_url.includes(pattern))) {
    issues.push('source_url must reference a governed provider, not a social platform')
  }
  if (!isNonEmptyString(domain.license)) {
    issues.push('license is required')
  }
  if (!isNonEmptyString(domain.update_cadence)) {
    issues.push('update_cadence is required')
  }
  if (!SPATIAL_BINDINGS.includes(domain.spatial_binding)) {
    issues.push('spatial_binding is invalid')
  }
  if (!isNonEmptyString(domain.temporal_resolution)) {
    issues.push('temporal_resolution is required')
  }
  if (!matchesSensitivity(domain.sensitivity_class)) {
    issues.push('sensitivity_class is invalid')
  }
  if (!isNonEmptyString(domain.confidence_baseline)) {
    issues.push('confidence_baseline is required')
  }
  if (!isNonEmptyString(domain.methodology_notes)) {
    issues.push('methodology_notes is required')
  }
  if (!matchesOfflineBehavior(domain.offline_behavior)) {
    issues.push('offline_behavior is invalid')
  }
  if (!PRESENTATION_TYPES.includes(domain.presentation_type)) {
    issues.push('presentation_type is invalid')
  }

  return issues
}

const matchesSensitivity = (
  value: ContextDomain['sensitivity_class'],
): value is ContextDomain['sensitivity_class'] =>
  value === 'PUBLIC' || value === 'INTERNAL' || value === 'RESTRICTED'

const matchesOfflineBehavior = (
  value: ContextDomain['offline_behavior'],
): value is ContextDomain['offline_behavior'] =>
  value === 'pre_cacheable' || value === 'online_only'

export const validateDomainRegistration = (domain: ContextDomain): boolean =>
  collectDomainRegistrationErrors(domain).length === 0

export const allowsMapPointRendering = (domain: ContextDomain): boolean =>
  domain.presentation_type === 'map_overlay'

export const correlationTypeForDomain = (domain: ContextDomain): CorrelationType => {
  switch (domain.spatial_binding) {
    case 'aoi_correlated':
      return 'aoi_bound'
    case 'entity_class_bound':
      return 'entity_class_bound'
    case 'point':
    case 'corridor':
      return 'infrastructure_node_bound'
    case 'polygon':
    case 'region_bound':
    case 'non_spatial':
    default:
      return 'region_bound'
  }
}

export const buildContextTimeRange = ({
  startHour,
  endHour,
  anchorDay = '2026-03-06',
}: {
  startHour: number
  endHour: number
  anchorDay?: string
}): ContextTimeRange => ({
  start: buildIsoHour(anchorDay, startHour),
  end: buildIsoHour(anchorDay, endHour),
})

export const buildCorrelationLinks = ({
  domains,
  activeDomainIds,
  correlationAoi,
  timeRange,
}: {
  domains: ContextDomain[]
  activeDomainIds: string[]
  correlationAoi: string
  timeRange: ContextTimeRange
}): ContextCorrelationLink[] =>
  domains
    .filter((domain) => activeDomainIds.includes(domain.domain_id))
    .map((domain) => ({
      link_id: `ctx-link-${domain.domain_id}-${correlationAoi}`,
      domain_id: domain.domain_id,
      correlation_type: correlationTypeForDomain(domain),
      target_id: correlationAoi,
      label: 'Correlated Context',
      enabled: true,
      time_range: timeRange,
    }))

export const queryContextRecords = ({
  records,
  domainId,
  targetId,
  timeRange,
}: {
  records: ContextRecord[]
  domainId: string
  targetId: string
  timeRange: ContextTimeRange
}): ContextRecord[] => {
  const sortedRecords = [...records].sort((left, right) =>
    compareIsoTimestamps(left.observed_at, right.observed_at),
  )
  const startIndex = lowerBound(sortedRecords, timeRange.start)
  const visibleRecords: ContextRecord[] = []

  for (let index = startIndex; index < sortedRecords.length; index += 1) {
    const record = sortedRecords[index]
    if (compareIsoTimestamps(record.observed_at, timeRange.end) > 0) {
      break
    }
    if (record.domain_id !== domainId || record.target_id !== targetId) {
      continue
    }
    visibleRecords.push(record)
  }

  return visibleRecords
}

export const summarizeContextAvailability = ({
  domain,
  visibleRecords,
  offline,
}: {
  domain: ContextDomain
  visibleRecords: ContextRecord[]
  offline: boolean
}): ContextAvailabilitySummary => {
  if (visibleRecords.length === 0) {
    return {
      domain_id: domain.domain_id,
      status: 'unavailable',
      status_line: 'Context unavailable for the active AOI/time window.',
      staleness_line: `Expected cadence: ${domain.update_cadence}`,
      visible_records: [],
    }
  }

  const latestRecord = [...visibleRecords].sort((left, right) =>
    compareIsoTimestamps(left.observed_at, right.observed_at),
  )[visibleRecords.length - 1]

  if (offline && domain.offline_behavior === 'online_only') {
    return {
      domain_id: domain.domain_id,
      status: 'stale_offline',
      status_line: `Offline cached value in use: ${latestRecord.value_label}.`,
      staleness_line: `Stale until live refresh. Last cached ${latestRecord.cached_at}; cadence ${domain.update_cadence}.`,
      latest_record: latestRecord,
      visible_records: visibleRecords,
    }
  }

  if (offline) {
    return {
      domain_id: domain.domain_id,
      status: 'offline_available',
      status_line: `Offline cached domain available: ${latestRecord.value_label}.`,
      staleness_line: `Captured ${latestRecord.cached_at}; cadence ${domain.update_cadence}.`,
      latest_record: latestRecord,
      visible_records: visibleRecords,
    }
  }

  return {
    domain_id: domain.domain_id,
    status: 'live',
    status_line: `Live correlation window shows ${visibleRecords.length} record(s).`,
    staleness_line: `Latest observation ${latestRecord.observed_at}; cadence ${domain.update_cadence}.`,
    latest_record: latestRecord,
    visible_records: visibleRecords,
  }
}

export const buildSampleContextRecords = ({
  domain,
  targetId,
  timeRange,
}: {
  domain: ContextDomain
  targetId: string
  timeRange: ContextTimeRange
}): ContextRecord[] => {
  const anchorDay = timeRange.start.slice(0, 10)
  const baseValue = domain.domain_name.length + domain.source_name.length
  const correlationType = correlationTypeForDomain(domain)
  const cadenceValue = domain.presentation_type === 'dashboard_widget' ? 'index points' : 'index'

  return [
    {
      record_id: `${domain.domain_id}-record-1`,
      domain_id: domain.domain_id,
      correlation_type: correlationType,
      target_id: targetId,
      observed_at: buildIsoHour(anchorDay, 6),
      value_label: `${baseValue - 4} ${cadenceValue}`,
      numeric_value: baseValue - 4,
      unit: cadenceValue,
      source_name: domain.source_name,
      source_url: domain.source_url,
      license: domain.license,
      update_cadence: domain.update_cadence,
      confidence: domain.confidence_baseline,
      cached_at: buildIsoHour(anchorDay, 7),
      lineage: ['registration.seed', `domain:${domain.domain_id}`],
    },
    {
      record_id: `${domain.domain_id}-record-2`,
      domain_id: domain.domain_id,
      correlation_type: correlationType,
      target_id: targetId,
      observed_at: buildIsoHour(anchorDay, 10),
      value_label: `${baseValue + 2} ${cadenceValue}`,
      numeric_value: baseValue + 2,
      unit: cadenceValue,
      source_name: domain.source_name,
      source_url: domain.source_url,
      license: domain.license,
      update_cadence: domain.update_cadence,
      confidence: domain.confidence_baseline,
      cached_at: buildIsoHour(anchorDay, 10),
      lineage: ['registration.seed', `domain:${domain.domain_id}`],
    },
    {
      record_id: `${domain.domain_id}-record-3`,
      domain_id: domain.domain_id,
      correlation_type: correlationType,
      target_id: targetId,
      observed_at: buildIsoHour(anchorDay, 14),
      value_label: `${baseValue + 5} ${cadenceValue}`,
      numeric_value: baseValue + 5,
      unit: cadenceValue,
      source_name: domain.source_name,
      source_url: domain.source_url,
      license: domain.license,
      update_cadence: domain.update_cadence,
      confidence: domain.confidence_baseline,
      cached_at: buildIsoHour(anchorDay, 14),
      lineage: ['registration.seed', `domain:${domain.domain_id}`],
    },
    {
      record_id: `${domain.domain_id}-record-4`,
      domain_id: domain.domain_id,
      correlation_type: correlationType,
      target_id: targetId,
      observed_at: buildIsoHour(anchorDay, 18),
      value_label: `${baseValue + 7} ${cadenceValue}`,
      numeric_value: baseValue + 7,
      unit: cadenceValue,
      source_name: domain.source_name,
      source_url: domain.source_url,
      license: domain.license,
      update_cadence: domain.update_cadence,
      confidence: domain.confidence_baseline,
      cached_at: buildIsoHour(anchorDay, 18),
      lineage: ['registration.seed', `domain:${domain.domain_id}`],
    },
  ]
}
