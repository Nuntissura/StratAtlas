import type { ContextDomain, ContextRecord } from '../i7/contextIntake'
import type { DeviationEvent } from '../i8/deviation'

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
export const OSINT_SOURCE_MODES = ['governed_connector', 'manual_override'] as const
export const GOVERNED_FEED_CONNECTOR_IDS = [
  'logistics-disruption-watch',
  'regulatory-pressure-watch',
  'commodity-shock-watch',
] as const

export const THRESHOLD_COMPARATORS = ['below', 'above'] as const

export type VerificationLevel = 'confirmed' | 'reported' | 'alleged'
export type OsintEventCategory = (typeof OSINT_EVENT_CATEGORIES)[number]
export type OsintSourceMode = (typeof OSINT_SOURCE_MODES)[number]
export type GovernedFeedConnectorId = (typeof GOVERNED_FEED_CONNECTOR_IDS)[number]
export type ThresholdComparator = (typeof THRESHOLD_COMPARATORS)[number]

export interface GovernedFeedConnectorTemplate {
  connector_id: GovernedFeedConnectorId
  connector_label: string
  catalog_label: string
  connector_note: string
  offline_behavior: 'pre_cacheable' | 'online_only'
  domain_ids: string[]
  allowed_sources: string[]
}

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
  source_mode?: OsintSourceMode
  connector_id?: GovernedFeedConnectorId
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
  source_mode?: OsintSourceMode
  connector_id?: GovernedFeedConnectorId
  connector_label?: string
  source_event_ids?: string[]
  deviation_event_id?: string
}

export interface GovernedConnectorRun {
  connector_id: GovernedFeedConnectorId
  connector_label: string
  source_mode: 'governed_connector'
  domain_ids: string[]
  source_event_ids: string[]
  threshold_ref_ids: string[]
  deviation_event_id?: string
  generated_at: string
  status_line: string
}

export interface OsintSnapshot {
  selectedAoi: string
  sourceMode: OsintSourceMode
  selectedConnectorId?: GovernedFeedConnectorId
  selectedThresholdDomainId?: string
  events: OsintEvent[]
  thresholdRefs: ContextThresholdRef[]
  latestAlert?: AggregateAlert
  latestConnectorRun?: GovernedConnectorRun
}

export interface GovernedFeedConnectorExecution {
  connector: GovernedFeedConnectorTemplate
  events: OsintEvent[]
  thresholdRefs: ContextThresholdRef[]
  latestAlert: AggregateAlert
  latestConnectorRun: GovernedConnectorRun
  statusLine: string
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const normalizeSource = (source: string): string => source.trim().toUpperCase()
const normalizeSourceMode = (
  value: unknown,
  fallback: OsintSourceMode = 'governed_connector',
): OsintSourceMode => (value === 'manual_override' ? 'manual_override' : value === 'governed_connector' ? 'governed_connector' : fallback)
const normalizeConnectorId = (value: unknown): GovernedFeedConnectorId | undefined =>
  typeof value === 'string' && GOVERNED_FEED_CONNECTOR_IDS.includes(value as GovernedFeedConnectorId)
    ? (value as GovernedFeedConnectorId)
    : undefined
const normalizeVerification = (
  value: unknown,
  fallback: VerificationLevel = 'reported',
): VerificationLevel =>
  value === 'confirmed' || value === 'reported' || value === 'alleged' ? value : fallback
const stableTimestampForIndex = (iso: string, index: number): string =>
  new Date(Date.parse(iso) + index * 60_000).toISOString()
const withUniqueBy = <T>(
  existing: T[],
  additions: T[],
  keyFor: (entry: T) => string,
): T[] => {
  const seen = new Set<string>()
  return [...existing, ...additions].filter((entry) => {
    const key = keyFor(entry)
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
}

const GOVERNED_FEED_CONNECTORS: GovernedFeedConnectorTemplate[] = [
  {
    connector_id: 'logistics-disruption-watch',
    connector_label: 'Logistics Disruption Watch',
    catalog_label: 'Tier 1 curated connector',
    connector_note:
      'Combines curated conflict and trade-flow reporting into an aggregate AOI logistics watch.',
    offline_behavior: 'pre_cacheable',
    domain_ids: ['port-throughput-monthly', 'bilateral-trade-flows'],
    allowed_sources: ['ACLED', 'GDELT', 'ReliefWeb'],
  },
  {
    connector_id: 'regulatory-pressure-watch',
    connector_label: 'Regulatory Pressure Watch',
    catalog_label: 'Tier 1 curated connector',
    connector_note:
      'Elevates curated sanctions and regulatory snapshots into aggregate AOI compliance pressure alerts.',
    offline_behavior: 'pre_cacheable',
    domain_ids: ['sanctions-regime-updates'],
    allowed_sources: ['Crisis24', 'ReliefWeb'],
  },
  {
    connector_id: 'commodity-shock-watch',
    connector_label: 'Commodity Shock Watch',
    catalog_label: 'Tier 1 curated connector',
    connector_note:
      'Links curated commodity-price movement and trade-lane stress to aggregate AOI disruption watch conditions.',
    offline_behavior: 'online_only',
    domain_ids: ['commodity-price-signal', 'bilateral-trade-flows'],
    allowed_sources: ['GDACS', 'GDELT'],
  },
]

export const DEFAULT_GOVERNED_FEED_CONNECTOR_ID =
  GOVERNED_FEED_CONNECTORS[0]?.connector_id ?? 'logistics-disruption-watch'

const CONNECTOR_RECIPES: Record<
  GovernedFeedConnectorId,
  Array<{
    domainId: string
    source: string
    category: OsintEventCategory
    summaryPrefix: string
    fallbackVerification: VerificationLevel
  }>
> = {
  'logistics-disruption-watch': [
    {
      domainId: 'port-throughput-monthly',
      source: 'ACLED',
      category: 'security_advisory',
      summaryPrefix: 'Curated logistics watch indicates throughput stress',
      fallbackVerification: 'confirmed',
    },
    {
      domainId: 'bilateral-trade-flows',
      source: 'GDELT',
      category: 'conflict_event',
      summaryPrefix: 'Curated logistics watch indicates trade-lane degradation',
      fallbackVerification: 'reported',
    },
  ],
  'regulatory-pressure-watch': [
    {
      domainId: 'sanctions-regime-updates',
      source: 'Crisis24',
      category: 'security_advisory',
      summaryPrefix: 'Curated regulatory watch indicates sanctions pressure',
      fallbackVerification: 'confirmed',
    },
  ],
  'commodity-shock-watch': [
    {
      domainId: 'commodity-price-signal',
      source: 'GDACS',
      category: 'natural_disaster',
      summaryPrefix: 'Curated commodity watch indicates price shock exposure',
      fallbackVerification: 'reported',
    },
    {
      domainId: 'bilateral-trade-flows',
      source: 'GDELT',
      category: 'security_advisory',
      summaryPrefix: 'Curated commodity watch indicates transport spillover',
      fallbackVerification: 'reported',
    },
  ],
}

const findLatestRecord = ({
  records,
  domainId,
  aoi,
}: {
  records: ContextRecord[]
  domainId: string
  aoi: string
}): ContextRecord | undefined =>
  records
    .filter((record) => record.domain_id === domainId && record.target_id === aoi)
    .sort((left, right) => left.observed_at.localeCompare(right.observed_at))
    .at(-1) ??
  records
    .filter((record) => record.domain_id === domainId)
    .sort((left, right) => left.observed_at.localeCompare(right.observed_at))
    .at(-1)

const buildGovernedConnectorSummary = ({
  connector,
  domain,
  record,
  aoi,
  summaryPrefix,
  latestDeviationEvent,
}: {
  connector: GovernedFeedConnectorTemplate
  domain: ContextDomain
  record: ContextRecord
  aoi: string
  summaryPrefix: string
  latestDeviationEvent?: DeviationEvent
}): string => {
  const deviationDetail =
    latestDeviationEvent && latestDeviationEvent.target_id === aoi
      ? ` Deviation watch: ${latestDeviationEvent.domain_name} score ${latestDeviationEvent.score.toFixed(2)}.`
      : ''
  const offlineDetail =
    connector.offline_behavior === 'online_only'
      ? ' Online-first snapshot; cached state may be stale.'
      : ' Cached snapshot remains available offline with provenance.'
  return `${summaryPrefix} for ${aoi}: ${domain.domain_name} ${record.value_label} from ${domain.source_name}. ${connector.connector_note}${offlineDetail}${deviationDetail}`.trim()
}

const buildEventId = ({
  source,
  category,
  aoi,
  retrievedAt,
}: {
  source: string
  category: OsintEventCategory
  aoi: string
  retrievedAt: string
}): string =>
  `osint-${normalizeSource(source)}-${category}-${aoi}-${retrievedAt.replace(/[:.]/g, '-')}`

const buildAlertId = (aoi: string, count: number, thresholdRefCount: number): string =>
  `osint-alert-${aoi}-${count}-${thresholdRefCount}`

export const validateCuratedSource = (source: string): boolean =>
  CURATED_OSINT_SOURCES.includes(
    normalizeSource(source) as (typeof CURATED_OSINT_SOURCES)[number],
  )

export const getGovernedFeedConnectorTemplate = (
  connectorId: GovernedFeedConnectorId,
): GovernedFeedConnectorTemplate | undefined =>
  GOVERNED_FEED_CONNECTORS.find((entry) => entry.connector_id === connectorId)

export const createOsintSnapshot = (selectedAoi = 'aoi-1'): OsintSnapshot => ({
  selectedAoi,
  sourceMode: 'governed_connector',
  selectedConnectorId: DEFAULT_GOVERNED_FEED_CONNECTOR_ID,
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
  sourceMode = 'manual_override',
  connectorId,
}: {
  source: string
  verification: VerificationLevel
  aoi: string
  category: OsintEventCategory
  summary: string
  retrievedAt?: string
  license?: string
  lineage?: string[]
  sourceMode?: OsintSourceMode
  connectorId?: GovernedFeedConnectorId
}): OsintEvent => {
  const normalizedSource = normalizeSource(source)

  return {
    event_id: buildEventId({
      source: normalizedSource,
      category,
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
    source_mode: sourceMode,
    connector_id: connectorId,
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
  metadata: {
    sourceMode?: OsintSourceMode
    connectorId?: GovernedFeedConnectorId
    connectorLabel?: string
    sourceEventIds?: string[]
    deviationEventId?: string
  } = {},
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
    source_mode: metadata.sourceMode,
    connector_id: metadata.connectorId,
    connector_label: metadata.connectorLabel,
    source_event_ids: metadata.sourceEventIds,
    deviation_event_id: metadata.deviationEventId,
  }
}

export const pushOsintEvent = (
  snapshot: OsintSnapshot,
  event: OsintEvent,
  aoi = snapshot.selectedAoi,
): OsintSnapshot => {
  const events = [...snapshot.events.filter((entry) => entry.event_id !== event.event_id), event]
  const sourceMode = event.source_mode ?? snapshot.sourceMode
  const selectedConnectorId =
    sourceMode === 'governed_connector' ? snapshot.selectedConnectorId : undefined
  const latestConnectorRun =
    sourceMode === 'governed_connector' ? snapshot.latestConnectorRun : undefined
  return {
    ...snapshot,
    sourceMode,
    selectedConnectorId,
    events,
    selectedAoi: aoi,
    latestConnectorRun,
    latestAlert: aggregateAlerts(events, aoi, snapshot.thresholdRefs, {
      sourceMode,
      connectorId: selectedConnectorId,
      connectorLabel: latestConnectorRun?.connector_label,
      sourceEventIds: events.filter((entry) => entry.aoi === aoi).map((entry) => entry.event_id),
      deviationEventId: latestConnectorRun?.deviation_event_id,
    }),
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
    latestAlert: aggregateAlerts(snapshot.events, aoi, thresholdRefs, {
      sourceMode: snapshot.sourceMode,
      connectorId: snapshot.selectedConnectorId,
      connectorLabel: snapshot.latestConnectorRun?.connector_label,
      sourceEventIds: snapshot.events
        .filter((entry) => entry.aoi === aoi)
        .map((entry) => entry.event_id),
      deviationEventId: snapshot.latestConnectorRun?.deviation_event_id,
    }),
  }
}

export const executeGovernedFeedConnector = ({
  snapshot,
  connectorId,
  aoi,
  contextDomains,
  contextRecords,
  thresholdDomain,
  thresholdComparator,
  thresholdValue,
  latestDeviationEvent,
  now = new Date().toISOString(),
}: {
  snapshot: OsintSnapshot
  connectorId: GovernedFeedConnectorId
  aoi: string
  contextDomains: ContextDomain[]
  contextRecords: ContextRecord[]
  thresholdDomain?: ContextDomain
  thresholdComparator: ThresholdComparator
  thresholdValue?: number
  latestDeviationEvent?: DeviationEvent
  now?: string
}): GovernedFeedConnectorExecution | null => {
  const connector = getGovernedFeedConnectorTemplate(connectorId)
  if (!connector) {
    return null
  }

  const domainsById = new Map(contextDomains.map((domain) => [domain.domain_id, domain]))
  const recipes = CONNECTOR_RECIPES[connector.connector_id]
  const events = recipes
    .map((recipe, index) => {
      const domain = domainsById.get(recipe.domainId)
      if (!domain) {
        return null
      }

      const record = findLatestRecord({
        records: contextRecords,
        domainId: recipe.domainId,
        aoi,
      })
      if (!record) {
        return null
      }

      return buildOsintEvent({
        source: recipe.source,
        verification: normalizeVerification(record.verification_level, recipe.fallbackVerification),
        aoi,
        category: recipe.category,
        summary: buildGovernedConnectorSummary({
          connector,
          domain,
          record,
          aoi,
          summaryPrefix: recipe.summaryPrefix,
          latestDeviationEvent,
        }),
        retrievedAt: stableTimestampForIndex(now, index),
        license: domain.license,
        lineage: [
          `connector:${connector.connector_id}`,
          `catalog:${connector.catalog_label}`,
          `domain:${domain.domain_id}`,
          `record:${record.record_id}`,
          `offline:${connector.offline_behavior}`,
          ...(latestDeviationEvent ? [`deviation:${latestDeviationEvent.eventId}`] : []),
        ],
        sourceMode: 'governed_connector',
        connectorId: connector.connector_id,
      })
    })
    .filter((event): event is OsintEvent => event !== null)

  const thresholdRefs = (() => {
    if (!thresholdDomain || !Number.isFinite(thresholdValue)) {
      return []
    }

    const latestThresholdRecord = findLatestRecord({
      records: contextRecords,
      domainId: thresholdDomain.domain_id,
      aoi,
    })

    return [
      buildContextThresholdRef({
        domain: thresholdDomain,
        comparator: thresholdComparator,
        thresholdValue: Number(thresholdValue),
        unit: latestThresholdRecord?.unit ?? 'index',
        referenceNote: `Connector ${connector.connector_label} uses ${thresholdDomain.domain_name} as an aggregate-only AOI threshold for ${aoi}; not entity pursuit.`,
      }),
    ]
  })()

  const mergedEvents = withUniqueBy(snapshot.events, events, (entry) => entry.event_id)
  const mergedThresholdRefs = withUniqueBy(
    snapshot.thresholdRefs,
    thresholdRefs,
    (entry) => entry.threshold_id,
  )
  const relevantDomainIds = Array.from(
    new Set(events.flatMap((event) => event.lineage.filter((entry) => entry.startsWith('domain:')))),
  )
    .map((entry) => entry.replace('domain:', ''))
    .filter(Boolean)

  const sourceEventIds = events.map((event) => event.event_id)
  const latestAlert = aggregateAlerts(mergedEvents, aoi, mergedThresholdRefs, {
    sourceMode: 'governed_connector',
    connectorId: connector.connector_id,
    connectorLabel: connector.connector_label,
    sourceEventIds,
    deviationEventId:
      latestDeviationEvent && latestDeviationEvent.target_id === aoi
        ? latestDeviationEvent.eventId
        : undefined,
  })
  const statusLine =
    events.length === 0
      ? `Connector ${connector.connector_label} found no governed records for ${aoi}.`
      : `Connector ${connector.connector_label} materialized ${events.length} governed event(s) for ${aoi}.`

  return {
    connector,
    events,
    thresholdRefs,
    latestAlert,
    latestConnectorRun: {
      connector_id: connector.connector_id,
      connector_label: connector.connector_label,
      source_mode: 'governed_connector',
      domain_ids: relevantDomainIds,
      source_event_ids: sourceEventIds,
      threshold_ref_ids: thresholdRefs.map((entry) => entry.threshold_id),
      deviation_event_id:
        latestDeviationEvent && latestDeviationEvent.target_id === aoi
          ? latestDeviationEvent.eventId
          : undefined,
      generated_at: now,
      status_line: statusLine,
    },
    statusLine,
  }
}

export const recordGovernedFeedConnector = (
  snapshot: OsintSnapshot,
  execution: GovernedFeedConnectorExecution,
  aoi: string,
): OsintSnapshot => {
  const events = withUniqueBy(snapshot.events, execution.events, (entry) => entry.event_id)
  const thresholdRefs = withUniqueBy(
    snapshot.thresholdRefs,
    execution.thresholdRefs,
    (entry) => entry.threshold_id,
  )

  return {
    ...snapshot,
    sourceMode: 'governed_connector',
    selectedAoi: aoi,
    selectedConnectorId: execution.connector.connector_id,
    events,
    thresholdRefs,
    latestAlert: execution.latestAlert,
    latestConnectorRun: execution.latestConnectorRun,
  }
}

export const normalizeOsintSnapshot = (value: unknown): OsintSnapshot => {
  if (!isRecord(value)) {
    return createOsintSnapshot()
  }

  const selectedAoi = typeof value.selectedAoi === 'string' ? value.selectedAoi : 'aoi-1'
  const sourceMode = normalizeSourceMode(value.sourceMode)
  const selectedConnectorId = normalizeConnectorId(value.selectedConnectorId)
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
          verification: normalizeVerification(entry.verification),
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
          source_mode: normalizeSourceMode(entry.source_mode, 'manual_override'),
          connector_id: normalizeConnectorId(entry.connector_id),
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

  const latestAlert = isRecord(value.latestAlert)
    ? {
        alert_id:
          typeof value.latestAlert.alert_id === 'string'
            ? value.latestAlert.alert_id
            : buildAlertId(selectedAoi, events.length, thresholdRefs.length),
        aoi:
          typeof value.latestAlert.aoi === 'string' ? value.latestAlert.aoi : selectedAoi,
        count:
          typeof value.latestAlert.count === 'number'
            ? value.latestAlert.count
            : events.filter((entry) => entry.aoi === selectedAoi).length,
        verificationBreakdown: {
          confirmed:
            isRecord(value.latestAlert.verificationBreakdown) &&
            typeof value.latestAlert.verificationBreakdown.confirmed === 'number'
              ? value.latestAlert.verificationBreakdown.confirmed
              : events.filter(
                  (entry) => entry.aoi === selectedAoi && entry.verification === 'confirmed',
                ).length,
          reported:
            isRecord(value.latestAlert.verificationBreakdown) &&
            typeof value.latestAlert.verificationBreakdown.reported === 'number'
              ? value.latestAlert.verificationBreakdown.reported
              : events.filter(
                  (entry) => entry.aoi === selectedAoi && entry.verification === 'reported',
                ).length,
          alleged:
            isRecord(value.latestAlert.verificationBreakdown) &&
            typeof value.latestAlert.verificationBreakdown.alleged === 'number'
              ? value.latestAlert.verificationBreakdown.alleged
              : events.filter(
                  (entry) => entry.aoi === selectedAoi && entry.verification === 'alleged',
                ).length,
        },
        threshold_refs: thresholdRefs,
        aggregate_only: true as const,
        summary:
          typeof value.latestAlert.summary === 'string'
            ? value.latestAlert.summary
            : aggregateAlerts(events, selectedAoi, thresholdRefs).summary,
        source_mode: normalizeSourceMode(value.latestAlert.source_mode),
        connector_id: normalizeConnectorId(value.latestAlert.connector_id),
        connector_label:
          typeof value.latestAlert.connector_label === 'string'
            ? value.latestAlert.connector_label
            : undefined,
        source_event_ids: Array.isArray(value.latestAlert.source_event_ids)
          ? value.latestAlert.source_event_ids.filter(
              (entry): entry is string => typeof entry === 'string',
            )
          : undefined,
        deviation_event_id:
          typeof value.latestAlert.deviation_event_id === 'string'
            ? value.latestAlert.deviation_event_id
            : undefined,
      }
    : aggregateAlerts(events, selectedAoi, thresholdRefs, {
        sourceMode,
        connectorId: selectedConnectorId,
      })

  const latestConnectorRun = isRecord(value.latestConnectorRun)
    ? {
        connector_id:
          normalizeConnectorId(value.latestConnectorRun.connector_id) ??
          DEFAULT_GOVERNED_FEED_CONNECTOR_ID,
        connector_label:
          typeof value.latestConnectorRun.connector_label === 'string'
            ? value.latestConnectorRun.connector_label
            : getGovernedFeedConnectorTemplate(
                normalizeConnectorId(value.latestConnectorRun.connector_id) ??
                  DEFAULT_GOVERNED_FEED_CONNECTOR_ID,
              )?.connector_label ?? 'Governed connector',
        source_mode: 'governed_connector' as const,
        domain_ids: Array.isArray(value.latestConnectorRun.domain_ids)
          ? value.latestConnectorRun.domain_ids.filter(
              (entry): entry is string => typeof entry === 'string',
            )
          : [],
        source_event_ids: Array.isArray(value.latestConnectorRun.source_event_ids)
          ? value.latestConnectorRun.source_event_ids.filter(
              (entry): entry is string => typeof entry === 'string',
            )
          : [],
        threshold_ref_ids: Array.isArray(value.latestConnectorRun.threshold_ref_ids)
          ? value.latestConnectorRun.threshold_ref_ids.filter(
              (entry): entry is string => typeof entry === 'string',
            )
          : [],
        deviation_event_id:
          typeof value.latestConnectorRun.deviation_event_id === 'string'
            ? value.latestConnectorRun.deviation_event_id
            : undefined,
        generated_at:
          typeof value.latestConnectorRun.generated_at === 'string'
            ? value.latestConnectorRun.generated_at
            : new Date(0).toISOString(),
        status_line:
          typeof value.latestConnectorRun.status_line === 'string'
            ? value.latestConnectorRun.status_line
            : 'Governed connector execution restored from persisted snapshot.',
      }
    : undefined

  return {
    selectedAoi,
    sourceMode,
    selectedConnectorId,
    selectedThresholdDomainId,
    events,
    thresholdRefs,
    latestAlert,
    latestConnectorRun,
  }
}
