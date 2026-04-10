import { allowsMapPointRendering, type ContextDomain } from './contextIntake'
import type { DeviationEvent } from '../i8/deviation'
import type { AggregateAlert, OsintEvent } from '../i9/osint'

export type GlobalEventCategory = 'deviation' | 'aggregate_alert' | 'osint'
export type GlobalEventTone = 'alert' | 'context'

export interface GlobalEventTimelineEntry {
  eventId: string
  inspectId: string
  category: GlobalEventCategory
  tone: GlobalEventTone
  aoiId: string
  aoiLabel: string
  occurredAt: string
  occurredAtLabel: string
  label: string
  summary: string
  source: string
  cadence: string
  confidence: string
  artifactLabel: 'Curated Context'
  aggregateOnly: boolean
  mapEligible: boolean
}

const DEFAULT_AOI_LABELS: Record<string, string> = {
  'aoi-1': 'Singapore Strait',
  'aoi-2': 'Dubai Jebel Ali',
  'aoi-3': 'Mumbai Coast',
  'aoi-4': 'Rotterdam Delta',
  'aoi-7': 'Suez Gateway',
}

const categoryRank: Record<GlobalEventCategory, number> = {
  deviation: 0,
  aggregate_alert: 1,
  osint: 2,
}

const parseTimestamp = (value: string): number => {
  const parsed = Date.parse(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const formatEventTimestamp = (value: string): string => {
  const parsed = parseTimestamp(value)
  if (!parsed) {
    return 'Time unknown'
  }
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    timeZone: 'UTC',
  }).format(parsed) + ' UTC'
}

const resolveAoiLabel = (
  aoiId: string,
  resolver?: (aoiId: string) => string,
): string => resolver?.(aoiId) ?? DEFAULT_AOI_LABELS[aoiId] ?? aoiId.toUpperCase()

const buildDeviationEntry = ({
  domain,
  event,
  resolveLabel,
}: {
  domain?: ContextDomain
  event: DeviationEvent
  resolveLabel?: (aoiId: string) => string
}): GlobalEventTimelineEntry => ({
  eventId: event.eventId,
  inspectId: event.eventId,
  category: 'deviation',
  tone: 'alert',
  aoiId: event.target_id,
  aoiLabel: resolveAoiLabel(event.target_id, resolveLabel),
  occurredAt: event.observed_end,
  occurredAtLabel: formatEventTimestamp(event.observed_end),
  label: `${event.domain_name} deviation`,
  summary: event.summary,
  source: domain?.source_name ?? 'Governed deviation detector',
  cadence: domain ? `Derived from ${domain.update_cadence}` : 'Derived event watch',
  confidence: `${domain?.confidence_baseline ?? 'Unknown'} baseline / score ${event.confidence_score.toFixed(2)}`,
  artifactLabel: 'Curated Context',
  aggregateOnly: false,
  mapEligible: domain ? allowsMapPointRendering(domain) : true,
})

const buildAggregateAlertEntry = ({
  alert,
  events,
  resolveLabel,
}: {
  alert: AggregateAlert
  events: OsintEvent[]
  resolveLabel?: (aoiId: string) => string
}): GlobalEventTimelineEntry => {
  const scopedEvents = events
    .filter((event) => event.aoi === alert.aoi)
    .sort((left, right) => parseTimestamp(right.retrieved_at) - parseTimestamp(left.retrieved_at))
  const latestEventTimestamp = scopedEvents[0]?.retrieved_at ?? new Date(0).toISOString()
  const uniqueSources = Array.from(new Set(scopedEvents.map((event) => event.source)))
  const source =
    alert.connector_label ??
    (uniqueSources.length > 0 ? uniqueSources.join(', ') : 'Curated aggregate alert')
  return {
    eventId: alert.alert_id,
    inspectId: alert.alert_id,
    category: 'aggregate_alert',
    tone: 'alert',
    aoiId: alert.aoi,
    aoiLabel: resolveAoiLabel(alert.aoi, resolveLabel),
    occurredAt: latestEventTimestamp,
    occurredAtLabel: formatEventTimestamp(latestEventTimestamp),
    label: 'Aggregate alert',
    summary: alert.summary,
    source,
    cadence:
      alert.source_mode === 'governed_connector'
        ? 'Connector aggregate snapshot'
        : 'Aggregate AOI review',
    confidence: `Confirmed ${alert.verificationBreakdown.confirmed} / Reported ${alert.verificationBreakdown.reported} / Alleged ${alert.verificationBreakdown.alleged}`,
    artifactLabel: 'Curated Context',
    aggregateOnly: true,
    mapEligible: true,
  }
}

const buildOsintEventEntry = ({
  event,
  resolveLabel,
}: {
  event: OsintEvent
  resolveLabel?: (aoiId: string) => string
}): GlobalEventTimelineEntry => ({
  eventId: event.event_id,
  inspectId: event.event_id,
  category: 'osint',
  tone: event.verification === 'confirmed' ? 'context' : 'alert',
  aoiId: event.aoi,
  aoiLabel: resolveAoiLabel(event.aoi, resolveLabel),
  occurredAt: event.retrieved_at,
  occurredAtLabel: formatEventTimestamp(event.retrieved_at),
  label: `${event.source} ${event.category.replace(/_/g, ' ')}`,
  summary: event.summary,
  source: event.source,
  cadence:
    event.source_mode === 'governed_connector'
      ? 'Connector snapshot'
      : 'Manual governed override',
  confidence: `Verification ${event.verification}`,
  artifactLabel: 'Curated Context',
  aggregateOnly: false,
  mapEligible: true,
})

export const buildGlobalEventTimeline = ({
  domains,
  latestDeviationEvent,
  osintSummary,
  osintEvents,
  resolveAoiLabel: aoiLabelResolver,
}: {
  domains: ContextDomain[]
  latestDeviationEvent?: DeviationEvent | null
  osintSummary?: AggregateAlert | null
  osintEvents: OsintEvent[]
  resolveAoiLabel?: (aoiId: string) => string
}): GlobalEventTimelineEntry[] => {
  const domainsById = new Map(domains.map((domain) => [domain.domain_id, domain]))
  const entries: GlobalEventTimelineEntry[] = []

  if (latestDeviationEvent) {
    entries.push(
      buildDeviationEntry({
        domain: domainsById.get(latestDeviationEvent.domain_id),
        event: latestDeviationEvent,
        resolveLabel: aoiLabelResolver,
      }),
    )
  }

  if (osintSummary && osintSummary.count > 0) {
    entries.push(
      buildAggregateAlertEntry({
        alert: osintSummary,
        events: osintEvents,
        resolveLabel: aoiLabelResolver,
      }),
    )
  }

  osintEvents.forEach((event) => {
    entries.push(
      buildOsintEventEntry({
        event,
        resolveLabel: aoiLabelResolver,
      }),
    )
  })

  return [...entries].sort((left, right) => {
    const timestampDelta = parseTimestamp(right.occurredAt) - parseTimestamp(left.occurredAt)
    if (timestampDelta !== 0) {
      return timestampDelta
    }
    const categoryDelta = categoryRank[left.category] - categoryRank[right.category]
    if (categoryDelta !== 0) {
      return categoryDelta
    }
    return left.eventId.localeCompare(right.eventId)
  })
}
