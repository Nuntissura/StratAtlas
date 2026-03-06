import type { ContextDomain } from '../i7/contextIntake'

export const CURATED_OSINT_SOURCES = [
  'ACLED',
  'GDELT',
  'UCDP',
  'Crisis24',
  'GDACS',
  'ReliefWeb',
] as const

export const OSINT_EVENT_CATEGORIES = [
  'conflict_event',
  'security_advisory',
  'natural_disaster',
] as const

export const THRESHOLD_COMPARATORS = ['below', 'above'] as const

export type VerificationLevel = 'confirmed' | 'reported' | 'alleged'
export type OsintEventCategory = (typeof OSINT_EVENT_CATEGORIES)[number]
export type ThresholdComparator = (typeof THRESHOLD_COMPARATORS)[number]

export interface OsintEvent {
  event_id: string
  source: string
  verification: VerificationLevel
  aoi: string
  category: OsintEventCategory
  summary: string
  artifact_label: 'Curated Context'
  retrieved_at: string
  license: string
  lineage: string[]
}

export interface ContextThresholdRef {
  threshold_id: string
  domain_id: string
  domain_name: string
  comparator: ThresholdComparator
  threshold_value: number
  unit: string
  reference_note: string
}

export interface AggregateAlert {
  alert_id: string
  aoi: string
  count: number
  verificationBreakdown: Record<VerificationLevel, number>
  threshold_refs: ContextThresholdRef[]
  aggregate_only: true
  summary: string
}

export interface OsintSnapshot {
  selectedAoi: string
  selectedThresholdDomainId?: string
  events: OsintEvent[]
  thresholdRefs: ContextThresholdRef[]
  latestAlert?: AggregateAlert
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const normalizeSource = (source: string): string => source.trim().toUpperCase()

const buildEventId = ({
  source,
  aoi,
  retrievedAt,
}: {
  source: string
  aoi: string
  retrievedAt: string
}): string => `osint-${normalizeSource(source)}-${aoi}-${retrievedAt.replace(/[:.]/g, '-')}`

const buildAlertId = (aoi: string, count: number, thresholdRefCount: number): string =>
  `osint-alert-${aoi}-${count}-${thresholdRefCount}`

export const validateCuratedSource = (source: string): boolean =>
  CURATED_OSINT_SOURCES.includes(
    normalizeSource(source) as (typeof CURATED_OSINT_SOURCES)[number],
  )

export const createOsintSnapshot = (selectedAoi = 'aoi-1'): OsintSnapshot => ({
  selectedAoi,
  events: [],
  thresholdRefs: [],
})

export const buildOsintEvent = ({
  source,
  verification,
  aoi,
  category,
  summary,
  retrievedAt = new Date().toISOString(),
  license = 'curated-feed-license',
  lineage = [],
}: {
  source: string
  verification: VerificationLevel
  aoi: string
  category: OsintEventCategory
  summary: string
  retrievedAt?: string
  license?: string
  lineage?: string[]
}): OsintEvent => {
  const normalizedSource = normalizeSource(source)

  return {
    event_id: buildEventId({
      source: normalizedSource,
      aoi,
      retrievedAt,
    }),
    source: normalizedSource,
    verification,
    aoi,
    category,
    summary: summary.trim(),
    artifact_label: 'Curated Context',
    retrieved_at: retrievedAt,
    license,
    lineage: [...lineage, `source:${normalizedSource}`, `verification:${verification}`],
  }
}

export const buildContextThresholdRef = ({
  domain,
  comparator,
  thresholdValue,
  unit,
  referenceNote,
}: {
  domain: ContextDomain
  comparator: ThresholdComparator
  thresholdValue: number
  unit: string
  referenceNote: string
}): ContextThresholdRef => ({
  threshold_id: `osint-threshold-${domain.domain_id}-${comparator}-${thresholdValue}`,
  domain_id: domain.domain_id,
  domain_name: domain.domain_name,
  comparator,
  threshold_value: thresholdValue,
  unit,
  reference_note: referenceNote.trim(),
})

export const aggregateAlerts = (
  events: OsintEvent[],
  aoi: string,
  thresholdRefs: ContextThresholdRef[] = [],
): AggregateAlert => {
  const scoped = events
    .filter((event) => event.aoi === aoi)
    .sort((left, right) => left.retrieved_at.localeCompare(right.retrieved_at))
  const thresholdSummary =
    thresholdRefs.length === 0
      ? 'No context thresholds linked.'
      : thresholdRefs
          .map(
            (ref) =>
              `${ref.domain_name} ${ref.comparator} ${ref.threshold_value} ${ref.unit}`.trim(),
          )
          .join('; ')

  return {
    alert_id: buildAlertId(aoi, scoped.length, thresholdRefs.length),
    aoi,
    count: scoped.length,
    verificationBreakdown: {
      confirmed: scoped.filter((event) => event.verification === 'confirmed').length,
      reported: scoped.filter((event) => event.verification === 'reported').length,
      alleged: scoped.filter((event) => event.verification === 'alleged').length,
    },
    threshold_refs: thresholdRefs,
    aggregate_only: true,
    summary: `Aggregate-only alert for ${aoi}: ${scoped.length} curated OSINT event(s). Threshold refs: ${thresholdSummary}`,
  }
}

export const pushOsintEvent = (
  snapshot: OsintSnapshot,
  event: OsintEvent,
  aoi = snapshot.selectedAoi,
): OsintSnapshot => {
  const events = [...snapshot.events.filter((entry) => entry.event_id !== event.event_id), event]
  return {
    ...snapshot,
    events,
    selectedAoi: aoi,
    latestAlert: aggregateAlerts(events, aoi, snapshot.thresholdRefs),
  }
}

export const pushContextThresholdRef = (
  snapshot: OsintSnapshot,
  thresholdRef: ContextThresholdRef,
  aoi = snapshot.selectedAoi,
): OsintSnapshot => {
  const thresholdRefs = [
    ...snapshot.thresholdRefs.filter((entry) => entry.threshold_id !== thresholdRef.threshold_id),
    thresholdRef,
  ]
  return {
    ...snapshot,
    thresholdRefs,
    selectedAoi: aoi,
    latestAlert: aggregateAlerts(snapshot.events, aoi, thresholdRefs),
  }
}

export const normalizeOsintSnapshot = (value: unknown): OsintSnapshot => {
  if (!isRecord(value)) {
    return createOsintSnapshot()
  }

  const selectedAoi = typeof value.selectedAoi === 'string' ? value.selectedAoi : 'aoi-1'
  const selectedThresholdDomainId =
    typeof value.selectedThresholdDomainId === 'string' ? value.selectedThresholdDomainId : undefined

  const events = Array.isArray(value.events)
    ? value.events
        .filter((entry): entry is Record<string, unknown> => isRecord(entry))
        .filter(
          (entry) =>
            typeof entry.event_id === 'string' &&
            typeof entry.source === 'string' &&
            typeof entry.aoi === 'string' &&
            typeof entry.summary === 'string' &&
            typeof entry.retrieved_at === 'string' &&
            typeof entry.license === 'string' &&
            Array.isArray(entry.lineage),
        )
        .map((entry): OsintEvent => ({
          event_id: entry.event_id as string,
          source: normalizeSource(entry.source as string),
          verification:
            entry.verification === 'confirmed' ||
            entry.verification === 'reported' ||
            entry.verification === 'alleged'
              ? entry.verification
              : 'reported',
          aoi: entry.aoi as string,
          category:
            entry.category === 'conflict_event' ||
            entry.category === 'security_advisory' ||
            entry.category === 'natural_disaster'
              ? entry.category
              : 'conflict_event',
          summary: entry.summary as string,
          artifact_label: 'Curated Context',
          retrieved_at: entry.retrieved_at as string,
          license: entry.license as string,
          lineage: (entry.lineage as unknown[]).filter(
            (lineageEntry): lineageEntry is string => typeof lineageEntry === 'string',
          ),
        }))
    : []

  const thresholdRefs = Array.isArray(value.thresholdRefs)
    ? value.thresholdRefs
        .filter((entry): entry is Record<string, unknown> => isRecord(entry))
        .filter(
          (entry) =>
            typeof entry.threshold_id === 'string' &&
            typeof entry.domain_id === 'string' &&
            typeof entry.domain_name === 'string' &&
            typeof entry.threshold_value === 'number' &&
            typeof entry.unit === 'string' &&
            typeof entry.reference_note === 'string',
        )
        .map((entry): ContextThresholdRef => ({
          threshold_id: entry.threshold_id as string,
          domain_id: entry.domain_id as string,
          domain_name: entry.domain_name as string,
          comparator: entry.comparator === 'above' ? 'above' : 'below',
          threshold_value: entry.threshold_value as number,
          unit: entry.unit as string,
          reference_note: entry.reference_note as string,
        }))
    : []

  return {
    selectedAoi,
    selectedThresholdDomainId,
    events,
    thresholdRefs,
    latestAlert: aggregateAlerts(events, selectedAoi, thresholdRefs),
  }
}
