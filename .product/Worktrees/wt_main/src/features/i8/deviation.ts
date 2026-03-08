import type { ContextDomain, ContextRecord } from '../i7/contextIntake'

export interface ContextSeriesPoint {
  ts: string
  value: number
}

export type DeviationInputMode = 'governed_series' | 'manual_override'

export const DEFAULT_DEVIATION_INPUT_MODE: DeviationInputMode = 'governed_series'
export const DEFAULT_DEVIATION_BASELINE_POINT_COUNT = 2
export const DEFAULT_DEVIATION_OBSERVED_POINT_COUNT = 1
export const DEFAULT_DEVIATION_THRESHOLD = 0.2
export const DEFAULT_DEVIATION_TYPE: DeviationEvent['deviation_type'] = 'trade_flow'

export interface DeviationEvent {
  eventId: string
  event_type: 'context.deviation'
  taxonomy_key:
    | 'context.trade_flow_deviation'
    | 'context.supply_chain_shift'
    | 'context.regulatory_change'
  deviation_type: 'trade_flow' | 'infrastructure' | 'regulatory'
  domain_id: string
  domain_name: string
  target_id: string
  score: number
  baseline: number
  observed: number
  deviation_magnitude: number
  baseline_reference: string
  baseline_start: string
  baseline_end: string
  observed_start: string
  observed_end: string
  baseline_sample_count: number
  observed_sample_count: number
  confidence_score: number
  artifact_label: 'Curated Context'
  source_mode: DeviationInputMode
  source_record_ids: string[]
  summary: string
}

export interface ConstraintNodeSuggestion {
  domain_id: string
  domain_name: string
  constraintId: string
  label: string
  recommendedValue: number
  unit: string
  propagationWeight: number
  rationale: string
  target_id: string
  source_event_id: string
}

export interface HistoricalDeviationWindow {
  baseline: ContextSeriesPoint[]
  observed: ContextSeriesPoint[]
  baselineRecords: ContextRecord[]
  observedRecords: ContextRecord[]
  baselineReference: string
  baselineStart: string
  baselineEnd: string
  observedStart: string
  observedEnd: string
}

export interface DeviationSnapshot {
  selectedDomainId?: string
  inputMode: DeviationInputMode
  baselinePointCount: number
  observedPointCount: number
  threshold: number
  deviationType: DeviationEvent['deviation_type']
  manualBaselineInput: string
  manualObservedInput: string
  latestEvent?: DeviationEvent
  events: DeviationEvent[]
  suggestions: ConstraintNodeSuggestion[]
}

const confidenceBaselineToScore = (value: string | undefined): number => {
  switch (value?.trim().toUpperCase()) {
    case 'A':
      return 0.95
    case 'B':
      return 0.85
    case 'C':
      return 0.75
    case 'D':
      return 0.65
    case 'E':
      return 0.55
    case 'F':
      return 0.45
    default:
      return 0.7
  }
}

const taxonomyForDeviationType = (
  deviationType: DeviationEvent['deviation_type'],
): DeviationEvent['taxonomy_key'] => {
  switch (deviationType) {
    case 'trade_flow':
      return 'context.trade_flow_deviation'
    case 'regulatory':
      return 'context.regulatory_change'
    case 'infrastructure':
    default:
      return 'context.supply_chain_shift'
  }
}

const average = (series: ContextSeriesPoint[]): number =>
  series.reduce((sum, point) => sum + point.value, 0) / Math.max(series.length, 1)

const magnitude = (baseline: number, observed: number): number => observed - baseline

const scoreDeviation = (baseline: number, observed: number): number => {
  const delta = magnitude(baseline, observed)
  return baseline === 0 ? Math.abs(observed) : Math.abs(delta / baseline)
}

const defaultDomainName = (
  deviationType: DeviationEvent['deviation_type'],
  domainName?: string,
): string => domainName ?? `${deviationType} context`

const defaultBaselineReference = (
  baseline: ContextSeriesPoint[],
  observed: ContextSeriesPoint[],
): string => {
  const baselineStart = baseline[0]?.ts ?? 'n/a'
  const baselineEnd = baseline.at(-1)?.ts ?? 'n/a'
  const observedStart = observed[0]?.ts ?? 'n/a'
  const observedEnd = observed.at(-1)?.ts ?? 'n/a'
  return `baseline ${baselineStart}..${baselineEnd} vs observed ${observedStart}..${observedEnd}`
}

const buildEventId = ({
  domainId,
  deviationType,
  targetId,
  observedAt,
}: {
  domainId: string
  deviationType: DeviationEvent['deviation_type']
  targetId: string
  observedAt: string
}): string =>
  `context-deviation-${domainId}-${deviationType}-${targetId}-${observedAt.replace(/[:.]/g, '-')}`

const clampWindowCount = (value: number, fallback: number): number => {
  if (!Number.isFinite(value)) {
    return fallback
  }
  return Math.max(1, Math.min(24, Math.round(value)))
}

const pointBoundary = (
  series: ContextSeriesPoint[],
  edge: 'start' | 'end',
  fallback: string,
): string => {
  if (series.length === 0) {
    return fallback
  }
  return edge === 'start' ? series[0]?.ts ?? fallback : series.at(-1)?.ts ?? fallback
}

const formatPercent = (baseline: number, observed: number): string => {
  if (baseline === 0) {
    return 'new signal'
  }
  const delta = ((observed - baseline) / baseline) * 100
  const rounded = Math.abs(delta) >= 10 ? delta.toFixed(0) : delta.toFixed(1)
  return `${rounded}%`
}

const manualSeriesInput = (series: ContextSeriesPoint[]): string =>
  series.map((point) => point.value).join(',')

const parseDeviationInputMode = (value: unknown): DeviationInputMode =>
  value === 'manual_override' ? 'manual_override' : DEFAULT_DEVIATION_INPUT_MODE

const parseDeviationType = (value: unknown): DeviationEvent['deviation_type'] =>
  value === 'infrastructure' || value === 'regulatory' || value === 'trade_flow'
    ? value
    : DEFAULT_DEVIATION_TYPE

const parseWindowCount = (value: unknown, fallback: number): number =>
  typeof value === 'number' ? clampWindowCount(value, fallback) : fallback

const parseThreshold = (value: unknown): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : DEFAULT_DEVIATION_THRESHOLD

export const createDeviationSnapshot = (): DeviationSnapshot => ({
  inputMode: DEFAULT_DEVIATION_INPUT_MODE,
  baselinePointCount: DEFAULT_DEVIATION_BASELINE_POINT_COUNT,
  observedPointCount: DEFAULT_DEVIATION_OBSERVED_POINT_COUNT,
  threshold: DEFAULT_DEVIATION_THRESHOLD,
  deviationType: DEFAULT_DEVIATION_TYPE,
  manualBaselineInput: '',
  manualObservedInput: '',
  events: [],
  suggestions: [],
})

export const buildContextSeriesFromRecords = (records: ContextRecord[]): ContextSeriesPoint[] =>
  [...records]
    .sort((left, right) => left.observed_at.localeCompare(right.observed_at))
    .map((record) => ({
      ts: record.observed_at,
      value: record.numeric_value,
    }))

export const selectHistoricalDeviationWindow = ({
  records,
  baselinePointCount = DEFAULT_DEVIATION_BASELINE_POINT_COUNT,
  observedPointCount = DEFAULT_DEVIATION_OBSERVED_POINT_COUNT,
}: {
  records: ContextRecord[]
  baselinePointCount?: number
  observedPointCount?: number
}): HistoricalDeviationWindow | null => {
  const normalizedBaselineCount = clampWindowCount(
    baselinePointCount,
    DEFAULT_DEVIATION_BASELINE_POINT_COUNT,
  )
  const normalizedObservedCount = clampWindowCount(
    observedPointCount,
    DEFAULT_DEVIATION_OBSERVED_POINT_COUNT,
  )
  const sortedRecords = [...records].sort((left, right) =>
    left.observed_at.localeCompare(right.observed_at),
  )
  const requiredCount = normalizedBaselineCount + normalizedObservedCount

  if (sortedRecords.length < requiredCount) {
    return null
  }

  const observedRecords = sortedRecords.slice(-normalizedObservedCount)
  const baselineRecords = sortedRecords.slice(
    sortedRecords.length - requiredCount,
    sortedRecords.length - normalizedObservedCount,
  )

  if (baselineRecords.length === 0 || observedRecords.length === 0) {
    return null
  }

  const baseline = buildContextSeriesFromRecords(baselineRecords)
  const observed = buildContextSeriesFromRecords(observedRecords)

  return {
    baseline,
    observed,
    baselineRecords,
    observedRecords,
    baselineReference: defaultBaselineReference(baseline, observed),
    baselineStart: baselineRecords[0]?.observed_at ?? 'n/a',
    baselineEnd: baselineRecords.at(-1)?.observed_at ?? 'n/a',
    observedStart: observedRecords[0]?.observed_at ?? 'n/a',
    observedEnd: observedRecords.at(-1)?.observed_at ?? 'n/a',
  }
}

export const detectDeviation = (
  baseline: ContextSeriesPoint[],
  observed: ContextSeriesPoint[],
  threshold: number,
  deviationType: DeviationEvent['deviation_type'],
  context?: {
    domainId?: string
    domainName?: string
    targetId?: string
    confidenceBaseline?: string
    baselineReference?: string
    sourceMode?: DeviationInputMode
    baselineStart?: string
    baselineEnd?: string
    observedStart?: string
    observedEnd?: string
    sourceRecordIds?: string[]
  },
): DeviationEvent | null => {
  if (baseline.length === 0 || observed.length === 0) {
    return null
  }

  const baselineAvg = average(baseline)
  const observedAvg = average(observed)
  const score = scoreDeviation(baselineAvg, observedAvg)
  if (score < threshold) {
    return null
  }

  const domainId = context?.domainId ?? 'context-domain'
  const targetId = context?.targetId ?? 'aoi-unknown'
  const baselineReference =
    context?.baselineReference ?? defaultBaselineReference(baseline, observed)
  const latestObserved = observed.at(-1)?.ts ?? '1970-01-01T00:00:00.000Z'
  const eventMagnitude = magnitude(baselineAvg, observedAvg)
  const confidenceScore = Number(
    Math.min(
      0.99,
      confidenceBaselineToScore(context?.confidenceBaseline) + Math.min(score, 1) * 0.1,
    ).toFixed(2),
  )
  const baselineStart = context?.baselineStart ?? pointBoundary(baseline, 'start', 'n/a')
  const baselineEnd = context?.baselineEnd ?? pointBoundary(baseline, 'end', 'n/a')
  const observedStart = context?.observedStart ?? pointBoundary(observed, 'start', 'n/a')
  const observedEnd = context?.observedEnd ?? pointBoundary(observed, 'end', 'n/a')
  const percentChange = formatPercent(baselineAvg, observedAvg)

  return {
    eventId: buildEventId({
      domainId,
      deviationType,
      targetId,
      observedAt: latestObserved,
    }),
    event_type: 'context.deviation',
    taxonomy_key: taxonomyForDeviationType(deviationType),
    deviation_type: deviationType,
    domain_id: domainId,
    domain_name: defaultDomainName(deviationType, context?.domainName),
    target_id: targetId,
    score,
    baseline: baselineAvg,
    observed: observedAvg,
    deviation_magnitude: eventMagnitude,
    baseline_reference: baselineReference,
    baseline_start: baselineStart,
    baseline_end: baselineEnd,
    observed_start: observedStart,
    observed_end: observedEnd,
    baseline_sample_count: baseline.length,
    observed_sample_count: observed.length,
    confidence_score: confidenceScore,
    artifact_label: 'Curated Context',
    source_mode: context?.sourceMode ?? DEFAULT_DEVIATION_INPUT_MODE,
    source_record_ids: context?.sourceRecordIds ?? [],
    summary: `${defaultDomainName(
      deviationType,
      context?.domainName,
    )} deviated ${percentChange} against ${baselineReference}.`,
  }
}

export const detectDeviationFromRecords = ({
  domain,
  records,
  targetId,
  threshold,
  deviationType,
  baselinePointCount = DEFAULT_DEVIATION_BASELINE_POINT_COUNT,
  observedPointCount = DEFAULT_DEVIATION_OBSERVED_POINT_COUNT,
}: {
  domain: ContextDomain
  records: ContextRecord[]
  targetId: string
  threshold: number
  deviationType: DeviationEvent['deviation_type']
  baselinePointCount?: number
  observedPointCount?: number
}): DeviationEvent | null => {
  const window = selectHistoricalDeviationWindow({
    records,
    baselinePointCount,
    observedPointCount,
  })

  if (!window) {
    return null
  }

  return detectDeviation(window.baseline, window.observed, threshold, deviationType, {
    domainId: domain.domain_id,
    domainName: domain.domain_name,
    targetId,
    confidenceBaseline: domain.confidence_baseline,
    baselineReference: window.baselineReference,
    sourceMode: DEFAULT_DEVIATION_INPUT_MODE,
    baselineStart: window.baselineStart,
    baselineEnd: window.baselineEnd,
    observedStart: window.observedStart,
    observedEnd: window.observedEnd,
    sourceRecordIds: [...window.baselineRecords, ...window.observedRecords].map(
      (record) => record.record_id,
    ),
  })
}

export const buildDeviationWindowPreview = (
  window: HistoricalDeviationWindow | null,
): { baselineInput: string; observedInput: string } => ({
  baselineInput: window ? manualSeriesInput(window.baseline) : '',
  observedInput: window ? manualSeriesInput(window.observed) : '',
})

export const buildConstraintNodeSuggestion = ({
  domain,
  latestRecord,
  event,
}: {
  domain: ContextDomain
  latestRecord: ContextRecord
  event: DeviationEvent
}): ConstraintNodeSuggestion | null => {
  if (domain.presentation_type !== 'constraint_node') {
    return null
  }

  return {
    domain_id: domain.domain_id,
    domain_name: domain.domain_name,
    constraintId: domain.domain_id,
    label: domain.domain_name,
    recommendedValue: latestRecord.numeric_value,
    unit: latestRecord.unit,
    propagationWeight: Number(Math.max(1, event.score * 2).toFixed(2)),
    rationale: `${event.taxonomy_key} derived from correlated context; treat as modeled scenario input, not observed evidence.`,
    target_id: latestRecord.target_id,
    source_event_id: event.eventId,
  }
}

export const pushDeviationEvent = (
  snapshot: DeviationSnapshot,
  event: DeviationEvent,
  suggestion?: ConstraintNodeSuggestion | null,
): DeviationSnapshot => {
  const events = [...snapshot.events.filter((entry) => entry.eventId !== event.eventId), event]
  const suggestions = suggestion
    ? [
        ...snapshot.suggestions.filter(
          (entry) =>
            !(
              entry.domain_id === suggestion.domain_id &&
              entry.source_event_id === suggestion.source_event_id
            ),
        ),
        suggestion,
      ]
    : snapshot.suggestions

  return {
    ...snapshot,
    latestEvent: event,
    events,
    suggestions,
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

export const normalizeDeviationSnapshot = (value: unknown): DeviationSnapshot => {
  if (!isRecord(value)) {
    return createDeviationSnapshot()
  }

  const events = Array.isArray(value.events)
    ? value.events
        .filter((entry): entry is Record<string, unknown> => isRecord(entry))
        .filter(
          (entry) =>
            typeof entry.eventId === 'string' &&
            entry.event_type === 'context.deviation' &&
            typeof entry.domain_id === 'string' &&
            typeof entry.domain_name === 'string' &&
            typeof entry.target_id === 'string' &&
            typeof entry.score === 'number' &&
            typeof entry.baseline === 'number' &&
            typeof entry.observed === 'number' &&
            typeof entry.deviation_magnitude === 'number' &&
            typeof entry.baseline_reference === 'string' &&
            typeof entry.confidence_score === 'number' &&
            typeof entry.summary === 'string',
        )
        .map((entry): DeviationEvent => {
          const taxonomyKey: DeviationEvent['taxonomy_key'] =
            entry.taxonomy_key === 'context.trade_flow_deviation' ||
            entry.taxonomy_key === 'context.supply_chain_shift' ||
            entry.taxonomy_key === 'context.regulatory_change'
              ? entry.taxonomy_key
              : 'context.trade_flow_deviation'

          return {
            eventId: entry.eventId as string,
            event_type: 'context.deviation',
            taxonomy_key: taxonomyKey,
            deviation_type: parseDeviationType(entry.deviation_type),
            domain_id: entry.domain_id as string,
            domain_name: entry.domain_name as string,
            target_id: entry.target_id as string,
            score: entry.score as number,
            baseline: entry.baseline as number,
            observed: entry.observed as number,
            deviation_magnitude: entry.deviation_magnitude as number,
            baseline_reference: entry.baseline_reference as string,
            baseline_start:
              typeof entry.baseline_start === 'string' ? entry.baseline_start : 'n/a',
            baseline_end: typeof entry.baseline_end === 'string' ? entry.baseline_end : 'n/a',
            observed_start:
              typeof entry.observed_start === 'string' ? entry.observed_start : 'n/a',
            observed_end: typeof entry.observed_end === 'string' ? entry.observed_end : 'n/a',
            baseline_sample_count:
              typeof entry.baseline_sample_count === 'number' ? entry.baseline_sample_count : 0,
            observed_sample_count:
              typeof entry.observed_sample_count === 'number' ? entry.observed_sample_count : 0,
            confidence_score: entry.confidence_score as number,
            artifact_label: 'Curated Context',
            source_mode: parseDeviationInputMode(entry.source_mode),
            source_record_ids: Array.isArray(entry.source_record_ids)
              ? entry.source_record_ids.filter((recordId): recordId is string => typeof recordId === 'string')
              : [],
            summary: entry.summary as string,
          }
        })
    : []

  const suggestions = Array.isArray(value.suggestions)
    ? value.suggestions
        .filter((entry): entry is Record<string, unknown> => isRecord(entry))
        .filter(
          (entry) =>
            typeof entry.domain_id === 'string' &&
            typeof entry.domain_name === 'string' &&
            typeof entry.constraintId === 'string' &&
            typeof entry.label === 'string' &&
            typeof entry.recommendedValue === 'number' &&
            typeof entry.unit === 'string' &&
            typeof entry.propagationWeight === 'number' &&
            typeof entry.rationale === 'string' &&
            typeof entry.target_id === 'string' &&
            typeof entry.source_event_id === 'string',
        )
        .map((entry) => ({
          domain_id: entry.domain_id as string,
          domain_name: entry.domain_name as string,
          constraintId: entry.constraintId as string,
          label: entry.label as string,
          recommendedValue: entry.recommendedValue as number,
          unit: entry.unit as string,
          propagationWeight: entry.propagationWeight as number,
          rationale: entry.rationale as string,
          target_id: entry.target_id as string,
          source_event_id: entry.source_event_id as string,
        }))
    : []

  return {
    selectedDomainId:
      typeof value.selectedDomainId === 'string' && value.selectedDomainId.length > 0
        ? value.selectedDomainId
        : undefined,
    inputMode: parseDeviationInputMode(value.inputMode),
    baselinePointCount: parseWindowCount(
      value.baselinePointCount,
      DEFAULT_DEVIATION_BASELINE_POINT_COUNT,
    ),
    observedPointCount: parseWindowCount(
      value.observedPointCount,
      DEFAULT_DEVIATION_OBSERVED_POINT_COUNT,
    ),
    threshold: parseThreshold(value.threshold),
    deviationType: parseDeviationType(value.deviationType),
    manualBaselineInput:
      typeof value.manualBaselineInput === 'string' ? value.manualBaselineInput : '',
    manualObservedInput:
      typeof value.manualObservedInput === 'string' ? value.manualObservedInput : '',
    latestEvent:
      typeof value.latestEvent === 'object' && value.latestEvent !== null
        ? events.find(
            (event) => event.eventId === (value.latestEvent as Record<string, unknown>).eventId,
          )
        : events.at(-1),
    events,
    suggestions,
  }
}
