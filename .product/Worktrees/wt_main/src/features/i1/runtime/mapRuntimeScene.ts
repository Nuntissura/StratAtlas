import type { CompareDashboardSummary, ContextOverlaySummary } from '../../i2/baselineDelta'
import type { CollaborationStateSnapshot } from '../../i3/collaboration'
import type { ScenarioComparison, ScenarioFork } from '../../i4/scenarios'
import type { QueryRenderLayer, VersionedQuery } from '../../i5/queryBuilder'
import type { AiGatewayArtifact } from '../../i6/aiGateway'
import type { ContextCorrelationLink, ContextDomain, ContextRecord } from '../../i7/contextIntake'
import type { DeviationEvent } from '../../i8/deviation'
import type { AggregateAlert, OsintEvent } from '../../i9/osint'
import type { GameModelSnapshot, PayoffProxy } from '../../i10/gameModeling'
import type { LayerCatalogEntry } from '../layers'
import { artifactTone } from '../layers'
import type { UiMode } from '../modes'

export type RuntimeTone = 'evidence' | 'context' | 'model' | 'ai' | 'alert' | 'support'

export type RuntimeSignalCategory =
  | 'query'
  | 'context'
  | 'compare'
  | 'collaboration'
  | 'scenario'
  | 'ai'
  | 'deviation'
  | 'osint'
  | 'model'

export type Position = [number, number]

interface RuntimeFeatureCollection<TProperties> {
  type: 'FeatureCollection'
  features: Array<{
    type: 'Feature'
    geometry:
      | { type: 'Point'; coordinates: Position }
      | { type: 'LineString'; coordinates: Position[] }
      | { type: 'Polygon'; coordinates: Position[][] }
    properties: TProperties
  }>
}

export interface RuntimeSurfaceProperties {
  featureId: string
  aoiId: string
  label: string
  detail: string
  fillColor: string
  fillOpacity: number
  lineColor: string
  emphasis: number
}

export interface RuntimeCorridorProperties {
  featureId: string
  category: RuntimeSignalCategory
  label: string
  detail: string
  tone: RuntimeTone
  color: string
  width: number
  dashLength: number
}

export interface RuntimeSignalProperties {
  featureId: string
  aoiId: string
  category: RuntimeSignalCategory
  label: string
  detail: string
  tone: RuntimeTone
  radius: number
  haloRadius: number
  haloOpacity: number
  emphasis: number
}

export interface RuntimeMetricCard {
  label: string
  value: string
  detail: string
}

export interface RuntimeInspectCard {
  id: string
  category: RuntimeSignalCategory
  label: string
  tone: RuntimeTone
  detail: string
  aoiId: string
}

export interface RuntimeLegendItem {
  id: string
  label: string
  tone: RuntimeTone
  detail: string
}

export interface RuntimeFocusOption {
  aoiId: string
  label: string
  subtitle: string
  center: Position
}

export interface MapRuntimeScene {
  focusAoiId: string
  narrative: string
  statusLine: string
  metrics: RuntimeMetricCard[]
  legend: RuntimeLegendItem[]
  inspectCards: RuntimeInspectCard[]
  focusOptions: RuntimeFocusOption[]
  surfaces: RuntimeFeatureCollection<RuntimeSurfaceProperties>
  corridors: RuntimeFeatureCollection<RuntimeCorridorProperties>
  signals: RuntimeFeatureCollection<RuntimeSignalProperties>
}

export interface MapRuntimeSceneInput {
  mode: UiMode
  offline: boolean
  replayCursor: number
  activeLayers: string[]
  visibleLayerCatalog: LayerCatalogEntry[]
  mainCanvasCatalog: LayerCatalogEntry[]
  rightPanelCatalog: LayerCatalogEntry[]
  dashboardCatalog: LayerCatalogEntry[]
  versionedQuery: VersionedQuery
  queryRenderLayer?: QueryRenderLayer
  contextDomains: ContextDomain[]
  activeDomainIds: string[]
  correlationAoi: string
  contextRecords: ContextRecord[]
  correlationLinks: ContextCorrelationLink[]
  compareDashboard: CompareDashboardSummary
  contextOverlaySummaries: ContextOverlaySummary[]
  collaboration: CollaborationStateSnapshot
  selectedScenario?: ScenarioFork
  scenarioComparison?: ScenarioComparison | null
  latestAiArtifact?: AiGatewayArtifact
  latestDeviationEvent?: DeviationEvent
  osintSummary?: AggregateAlert
  osintEvents: OsintEvent[]
  osintAoi: string
  gameModelSnapshot: GameModelSnapshot
  payoffProxy: PayoffProxy
}

interface AoiDefinition {
  aoiId: string
  label: string
  subtitle: string
  center: Position
  lonRadius: number
  latRadius: number
  bearing: number
}

const THEATER_AOIS: Record<string, AoiDefinition> = {
  'aoi-1': {
    aoiId: 'aoi-1',
    label: 'Singapore Strait',
    subtitle: 'Throughput and query watch',
    center: [103.86, 1.24],
    lonRadius: 1.2,
    latRadius: 0.8,
    bearing: 28,
  },
  'aoi-2': {
    aoiId: 'aoi-2',
    label: 'Dubai Jebel Ali',
    subtitle: 'Regional compare corridor',
    center: [55.05, 24.98],
    lonRadius: 1.5,
    latRadius: 1,
    bearing: 18,
  },
  'aoi-3': {
    aoiId: 'aoi-3',
    label: 'Mumbai Coast',
    subtitle: 'Scenario and model anchor',
    center: [72.88, 19.07],
    lonRadius: 1.5,
    latRadius: 1.1,
    bearing: 22,
  },
  'aoi-4': {
    aoiId: 'aoi-4',
    label: 'Rotterdam Delta',
    subtitle: 'North Sea logistics benchmark',
    center: [4.48, 51.92],
    lonRadius: 1.4,
    latRadius: 0.95,
    bearing: 8,
  },
  'aoi-7': {
    aoiId: 'aoi-7',
    label: 'Suez Gateway',
    subtitle: 'Context and alert nexus',
    center: [32.31, 30.05],
    lonRadius: 1.25,
    latRadius: 0.9,
    bearing: -14,
  },
}

const DEFAULT_AOI_ORDER = ['aoi-1', 'aoi-2', 'aoi-3', 'aoi-4', 'aoi-7']

const TONE_COLORS: Record<RuntimeTone, string> = {
  evidence: '#7be8ff',
  context: '#87f5b5',
  model: '#ffbe78',
  ai: '#ff8ed4',
  alert: '#ff6e80',
  support: '#b4c7ff',
}

const offsetPoint = (center: Position, lonOffset: number, latOffset: number): Position => [
  Number((center[0] + lonOffset).toFixed(4)),
  Number((center[1] + latOffset).toFixed(4)),
]

const buildEllipsePolygon = (
  center: Position,
  lonRadius: number,
  latRadius: number,
): Position[][] => {
  const points: Position[] = []
  for (let step = 0; step <= 12; step += 1) {
    const angle = (Math.PI * 2 * step) / 12
    points.push([
      Number((center[0] + Math.cos(angle) * lonRadius).toFixed(4)),
      Number((center[1] + Math.sin(angle) * latRadius).toFixed(4)),
    ])
  }
  return [points]
}

const aoiFor = (aoiId: string): AoiDefinition =>
  THEATER_AOIS[aoiId] ?? {
    aoiId,
    label: aoiId.toUpperCase(),
    subtitle: 'Governed runtime focus',
    center: [12.5, 24],
    lonRadius: 1.2,
    latRadius: 0.85,
    bearing: 0,
  }

const toneForLayer = (entry: LayerCatalogEntry): RuntimeTone => artifactTone(entry.artifactLabel)

const determineFocusAoi = ({
  mode,
  compareFocusAoi,
  queryAoi,
  correlationAoi,
  osintAoi,
  latestDeviationEvent,
}: {
  mode: UiMode
  compareFocusAoi: string
  queryAoi: string
  correlationAoi: string
  osintAoi: string
  latestDeviationEvent?: DeviationEvent
}): string => {
  if (mode === 'compare') {
    return compareFocusAoi || correlationAoi || queryAoi || osintAoi || 'aoi-1'
  }
  if (mode === 'scenario') {
    return queryAoi || correlationAoi || 'aoi-3'
  }
  if (mode === 'live_recent') {
    return latestDeviationEvent?.target_id || osintAoi || correlationAoi || queryAoi || 'aoi-7'
  }
  if (mode === 'collaboration') {
    return correlationAoi || queryAoi || 'aoi-2'
  }
  if (mode === 'replay') {
    return latestDeviationEvent?.target_id || queryAoi || correlationAoi || 'aoi-1'
  }
  return queryAoi || correlationAoi || osintAoi || 'aoi-1'
}

const buildNarrative = (input: MapRuntimeSceneInput, focus: AoiDefinition): string => {
  if (input.mode === 'compare') {
    return `Compare mode turns the ${focus.label} theatre into a delta surface with corridor tension, context overlays, and briefing-ready AOI framing.`
  }
  if (input.mode === 'scenario') {
    return `Scenario mode anchors hypothetical entities, constraint pressure, and model payoff cues directly on ${focus.label} instead of leaving them as detached forms.`
  }
  if (input.mode === 'collaboration') {
    return `Collaboration mode spatializes shared-note presence and remote view intent, so the map becomes the common working object rather than a sidecar summary.`
  }
  if (input.mode === 'live_recent') {
    return `Live/recent mode pushes alerts, deviation watch, and curated context toward ${focus.label} with persistent provenance and AOI-linked interpretation.`
  }
  if (input.mode === 'replay') {
    return `Replay mode expresses cursor state as spatial emphasis and corridor memory, keeping playback grounded in the theatre rather than in numeric sliders alone.`
  }
  return `Offline mode preserves the same geospatial workstation surface, with governed overlays and annotations still readable even when the basemap is unavailable.`
}

const pushSignal = (
  features: MapRuntimeScene['signals']['features'],
  center: Position,
  properties: Omit<RuntimeSignalProperties, 'featureId'> & { featureId?: string },
  offset: Position = [0, 0],
) => {
  features.push({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: offsetPoint(center, offset[0], offset[1]),
    },
    properties: {
      ...properties,
      featureId: properties.featureId ?? `${properties.category}-${features.length + 1}`,
    },
  })
}

const pushCorridor = (
  features: MapRuntimeScene['corridors']['features'],
  from: Position,
  to: Position,
  properties: Omit<RuntimeCorridorProperties, 'featureId'> & { featureId?: string },
) => {
  features.push({
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [from, to],
    },
    properties: {
      ...properties,
      featureId: properties.featureId ?? `${properties.category}-${features.length + 1}`,
    },
  })
}

const latestRecordByDomain = (records: ContextRecord[]): Map<string, ContextRecord> =>
  records.reduce((accumulator, record) => {
    const previous = accumulator.get(record.domain_id)
    if (!previous || previous.observed_at.localeCompare(record.observed_at) < 0) {
      accumulator.set(record.domain_id, record)
    }
    return accumulator
  }, new Map<string, ContextRecord>())

const nextSupportAoi = (aoiId: string): AoiDefinition => {
  const index = DEFAULT_AOI_ORDER.indexOf(aoiId)
  const fallback = index === -1 ? 'aoi-2' : DEFAULT_AOI_ORDER[(index + 1) % DEFAULT_AOI_ORDER.length]
  return aoiFor(fallback)
}

export const buildMapRuntimeScene = (input: MapRuntimeSceneInput): MapRuntimeScene => {
  const focusAoiId = determineFocusAoi({
    mode: input.mode,
    compareFocusAoi: input.compareDashboard.focusAoiId,
    queryAoi: input.versionedQuery.aoi,
    correlationAoi: input.correlationAoi,
    osintAoi: input.osintAoi,
    latestDeviationEvent: input.latestDeviationEvent,
  })
  const referencedAois = new Set<string>(
    [
      ...DEFAULT_AOI_ORDER,
      focusAoiId,
      input.versionedQuery.aoi,
      input.correlationAoi,
      input.osintAoi,
      ...input.compareDashboard.cells.map((cell) => cell.aoiId),
      ...input.contextRecords.map((record) => record.target_id),
      ...input.osintEvents.map((event) => event.aoi),
      ...input.correlationLinks.map((link) => link.target_id),
    ].filter((value): value is string => Boolean(value)),
  )
  const focus = aoiFor(focusAoiId)
  const supportAoi = nextSupportAoi(focusAoiId)
  const surfaces: MapRuntimeScene['surfaces'] = {
    type: 'FeatureCollection',
    features: [...referencedAois].map((aoiId) => {
      const definition = aoiFor(aoiId)
      const emphasized = aoiId === focusAoiId ? 1 : 0
      return {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: buildEllipsePolygon(definition.center, definition.lonRadius, definition.latRadius),
        },
        properties: {
          featureId: `surface-${aoiId}`,
          aoiId,
          label: definition.label,
          detail: definition.subtitle,
          fillColor: emphasized ? '#21496f' : '#13273d',
          fillOpacity: emphasized ? 0.38 : 0.22,
          lineColor: emphasized ? '#8fdcff' : '#476786',
          emphasis: emphasized,
        },
      }
    }),
  }
  const corridors: MapRuntimeScene['corridors'] = {
    type: 'FeatureCollection',
    features: [],
  }
  const signals: MapRuntimeScene['signals'] = {
    type: 'FeatureCollection',
    features: [],
  }
  const latestRecords = latestRecordByDomain(input.contextRecords)

  pushCorridor(corridors.features, focus.center, supportAoi.center, {
    category: 'compare',
    label: 'Theatre corridor',
    detail: `${focus.label} remains connected to ${supportAoi.label} for compare, replay, and model flows.`,
    tone: 'support',
    color: TONE_COLORS.support,
    width: 3.5,
    dashLength: 0.6,
  })

  if (input.queryRenderLayer) {
    input.queryRenderLayer.matchedRowIds.forEach((rowId, index) => {
      pushSignal(
        signals.features,
        aoiFor(input.queryRenderLayer?.aoi || focusAoiId).center,
        {
          aoiId: input.queryRenderLayer?.aoi || focusAoiId,
          category: 'query',
          label: `Matched row ${rowId}`,
          detail: input.queryRenderLayer?.summary || `Observed match ${rowId}`,
          tone: 'evidence',
          radius: 6 + (index % 3),
          haloRadius: 18 + index * 2,
          haloOpacity: 0.32,
          emphasis: 1,
        },
        [0.18 + index * 0.12, -0.15 + (index % 2) * 0.2],
      )
    })
  }

  input.contextDomains
    .filter((domain) => input.activeDomainIds.includes(domain.domain_id))
    .forEach((domain, index) => {
      const aoiId = input.correlationAoi || focusAoiId
      const latestRecord = latestRecords.get(domain.domain_id)
      pushSignal(
        signals.features,
        aoiFor(aoiId).center,
        {
          aoiId,
          category: 'context',
          label: domain.domain_name,
          detail: latestRecord
            ? `${latestRecord.numeric_value} ${latestRecord.unit} from ${domain.source_name} at ${latestRecord.observed_at}`
            : `${domain.source_name} correlated to ${aoiId}`,
          tone: 'context',
          radius: 7,
          haloRadius: 24,
          haloOpacity: 0.24,
          emphasis: 0.85,
        },
        [-0.3 + index * 0.14, 0.22 + (index % 3) * 0.08],
      )
    })

  if (input.compareDashboard.cells.length > 0) {
    pushSignal(
      signals.features,
      focus.center,
      {
        aoiId: focusAoiId,
        category: 'compare',
        label: 'Delta pulse',
        detail: `${input.compareDashboard.summary}. Total delta ${input.compareDashboard.totalDelta}.`,
        tone: input.compareDashboard.totalDelta === 0 ? 'support' : 'alert',
        radius: 8,
        haloRadius: 28 + Math.min(Math.abs(input.compareDashboard.totalDelta), 24),
        haloOpacity: 0.22,
        emphasis: 1,
      },
      [-0.08, -0.28],
    )
    pushCorridor(
      corridors.features,
      focus.center,
      aoiFor(input.correlationAoi || supportAoi.aoiId).center,
      {
        category: 'compare',
        label: 'Compare corridor',
        detail: `${input.compareDashboard.totalDelta >= 0 ? 'Rising' : 'Declining'} delta corridor informed by ${input.contextOverlaySummaries.length} context overlays around ${input.compareDashboard.focusAoiLabel}.`,
        tone: input.compareDashboard.totalDelta >= 0 ? 'alert' : 'context',
        color:
          input.compareDashboard.totalDelta >= 0 ? TONE_COLORS.alert : TONE_COLORS.context,
        width: 3 + Math.min(input.compareDashboard.maxAbsoluteDelta, 6) * 0.35,
        dashLength: 0.9,
      },
    )

    input.compareDashboard.cells.forEach((cell, index) => {
      const cellAoi = aoiFor(cell.aoiId)
      const tone =
        cell.severity === 'increase'
          ? 'alert'
          : cell.severity === 'decrease'
            ? 'context'
            : 'support'
      pushSignal(
        signals.features,
        cellAoi.center,
        {
          aoiId: cell.aoiId,
          category: 'compare',
          label: `${cell.aoiLabel} delta`,
          detail: `Baseline ${cell.baseline}, event ${cell.event}, delta ${cell.delta}, share ${cell.shareOfDelta}.`,
          tone,
          radius: 6 + Math.min(Math.abs(cell.delta), 4),
          haloRadius: 18 + Math.min(Math.abs(cell.delta), 8) * 2,
          haloOpacity: 0.18 + Math.min(cell.shareOfDelta, 0.4),
          emphasis: cell.aoiId === focusAoiId ? 1 : 0.72,
        },
        [-0.2 + (index % 3) * 0.16, -0.12 + (index % 2) * 0.24],
      )

      if (cell.aoiId !== focusAoiId && cell.delta !== 0) {
        pushCorridor(corridors.features, focus.center, cellAoi.center, {
          category: 'compare',
          label: `${cell.aoiLabel} compare branch`,
          detail: `${cell.aoiLabel} contributes delta ${cell.delta} into the theatre briefing export.`,
          tone,
          color: TONE_COLORS[tone],
          width: 1.8 + Math.min(Math.abs(cell.delta), 6) * 0.25,
          dashLength: 1.1,
        })
      }
    })
  }

  if (input.collaboration.sharedArtifacts.length > 0 || input.collaboration.ephemeralViewState) {
    pushSignal(
      signals.features,
      focus.center,
      {
        aoiId: focusAoiId,
        category: 'collaboration',
        label: 'Shared view state',
        detail: `${input.collaboration.sharedArtifacts.length} shared artifact(s); view ${input.collaboration.ephemeralViewState || 'unspecified'}.`,
        tone: 'support',
        radius: 7,
        haloRadius: 21,
        haloOpacity: 0.18,
        emphasis: 0.72,
      },
      [0.34, -0.06],
    )
    pushCorridor(corridors.features, focus.center, supportAoi.center, {
      category: 'collaboration',
      label: 'Collaboration handoff',
      detail: 'Remote presence is expressed as a shared theatre handoff rather than a detached session note.',
      tone: 'support',
      color: TONE_COLORS.support,
      width: 2.4,
      dashLength: 1.6,
    })
  }

  if (input.selectedScenario) {
    input.selectedScenario.hypotheticalEntities.forEach((entity, index) => {
      pushSignal(
        signals.features,
        focus.center,
        {
          aoiId: focusAoiId,
          category: 'scenario',
          label: entity.name,
          detail: `${entity.changeSummary} Confidence ${entity.confidence}.`,
          tone: 'model',
          radius: 7,
          haloRadius: 22,
          haloOpacity: 0.18,
          emphasis: 0.85,
        },
        [-0.16 + index * 0.18, 0.3 + (index % 2) * 0.1],
      )
    })

    input.selectedScenario.constraints.forEach((constraint, index) => {
      pushSignal(
        signals.features,
        focus.center,
        {
          aoiId: focusAoiId,
          category: 'scenario',
          label: constraint.label,
          detail: `${constraint.value} ${constraint.unit}; propagation ${constraint.propagationWeight}.`,
          tone: 'model',
          radius: 6,
          haloRadius: 18 + constraint.propagationWeight * 4,
          haloOpacity: 0.16,
          emphasis: 0.74,
        },
        [0.12 + index * 0.12, 0.3],
      )
    })
  }

  if (input.latestAiArtifact) {
    pushSignal(
      signals.features,
      focus.center,
      {
        aoiId: focusAoiId,
        category: 'ai',
        label: input.latestAiArtifact.label,
        detail: `${input.latestAiArtifact.content} Confidence note: ${input.latestAiArtifact.confidenceText}`,
        tone: 'ai',
        radius: 7,
        haloRadius: 19,
        haloOpacity: 0.2,
        emphasis: 0.8,
      },
      [-0.34, -0.04],
    )
  }

  if (input.latestDeviationEvent) {
    const deviationAoi = input.latestDeviationEvent.target_id || focusAoiId
    pushSignal(
      signals.features,
      aoiFor(deviationAoi).center,
      {
        aoiId: deviationAoi,
        category: 'deviation',
        label: input.latestDeviationEvent.domain_name,
        detail: input.latestDeviationEvent.summary,
        tone: 'alert',
        radius: 8,
        haloRadius: 26 + Math.min(input.latestDeviationEvent.score * 12, 18),
        haloOpacity: 0.28,
        emphasis: 1,
      },
      [-0.22, -0.24],
    )
  }

  if (input.osintSummary && input.osintSummary.count > 0) {
    pushSignal(
      signals.features,
      aoiFor(input.osintAoi || focusAoiId).center,
      {
        aoiId: input.osintAoi || focusAoiId,
        category: 'osint',
        label: 'Aggregate alert',
        detail: input.osintSummary.summary,
        tone: 'alert',
        radius: 8,
        haloRadius: 30 + input.osintSummary.count * 2,
        haloOpacity: 0.3,
        emphasis: 1,
      },
      [0.26, 0.2],
    )
  }

  if (input.osintEvents.length > 0) {
    input.osintEvents.slice(-2).forEach((event, index) => {
      pushSignal(
        signals.features,
        aoiFor(event.aoi).center,
        {
          aoiId: event.aoi,
          category: 'osint',
          label: `${event.source} ${event.category}`,
          detail: event.summary,
          tone: event.verification === 'confirmed' ? 'context' : 'alert',
          radius: 6,
          haloRadius: 18,
          haloOpacity: 0.18,
          emphasis: 0.7,
        },
        [-0.12 + index * 0.18, 0.14 + index * 0.1],
      )
    })
  }

  pushSignal(
    signals.features,
    supportAoi.center,
    {
      aoiId: supportAoi.aoiId,
      category: 'model',
      label: input.payoffProxy.metric,
      detail: `${input.payoffProxy.value} with uncertainty [${input.payoffProxy.uncertainty[0]}, ${input.payoffProxy.uncertainty[1]}].`,
      tone: 'model',
      radius: 7,
      haloRadius: 24,
      haloOpacity: 0.22,
      emphasis: 0.88,
    },
    [0.18, -0.14],
  )
  pushCorridor(corridors.features, focus.center, supportAoi.center, {
    category: 'model',
    label: input.gameModelSnapshot.model.name,
    detail: `Solver-backed corridor carrying ${input.gameModelSnapshot.model.actors.length} actor(s) and ${input.gameModelSnapshot.model.actions.length} action(s).`,
    tone: 'model',
    color: TONE_COLORS.model,
    width: 3.2,
    dashLength: 0.25,
  })

  const inspectCards = signals.features
    .map((feature) => ({
      id: feature.properties.featureId,
      category: feature.properties.category,
      label: feature.properties.label,
      tone: feature.properties.tone,
      detail: feature.properties.detail,
      aoiId: feature.properties.aoiId,
    }))
    .slice(0, 8)

  const metrics: RuntimeMetricCard[] = [
    {
      label: 'Visible Layers',
      value: `${input.visibleLayerCatalog.length}`,
      detail: `${input.mainCanvasCatalog.length} main canvas, ${input.rightPanelCatalog.length} right rail, ${input.dashboardCatalog.length} dashboard.`,
    },
    {
      label: 'Mapped Features',
      value: `${signals.features.length}`,
      detail: `${corridors.features.length} corridors across ${referencedAois.size} governed AOIs.`,
    },
    {
      label: 'Replay Cursor',
      value: `${input.replayCursor}`,
      detail: `${input.activeLayers.length} active governed layers across the runtime.`,
    },
    {
      label: 'Compare Delta',
      value: `${input.compareDashboard.totalDelta}`,
      detail: `${input.contextOverlaySummaries.length} context overlays influence ${input.compareDashboard.focusAoiLabel}.`,
    },
    {
      label: 'Alerts',
      value: `${input.osintSummary?.count ?? 0}`,
      detail: input.latestDeviationEvent
        ? `Deviation watch active for ${input.latestDeviationEvent.domain_name}.`
        : 'No active deviation watch event.',
    },
    {
      label: 'Payoff Proxy',
      value: `${input.payoffProxy.value}`,
      detail: `${input.gameModelSnapshot.model.name} remains map-linked to the theatre.`,
    },
  ]

  const legend = input.visibleLayerCatalog.slice(0, 6).map((entry) => ({
    id: entry.layerId,
    label: entry.title,
    tone: toneForLayer(entry),
    detail: `${entry.artifactLabel} | ${entry.source} | ${entry.cadence}`,
  }))

  const focusOptions = [...referencedAois].map((aoiId) => {
    const definition = aoiFor(aoiId)
    return {
      aoiId,
      label: definition.label,
      subtitle: definition.subtitle,
      center: definition.center,
    }
  })

  return {
    focusAoiId,
    narrative: buildNarrative(input, focus),
    statusLine: input.offline
      ? `Offline map mode keeps overlays active around ${focus.label}; external basemap tiles may be unavailable.`
      : `Connected map mode is centered on ${focus.label} with live 2D and orbital navigation.`,
    metrics,
    legend,
    inspectCards,
    focusOptions,
    surfaces,
    corridors,
    signals,
  }
}

export const runtimeToneColor = (tone: RuntimeTone): string => TONE_COLORS[tone]

export const runtimeAoiView = (aoiId: string): { center: Position; bearing: number } => {
  const definition = aoiFor(aoiId)
  return {
    center: definition.center,
    bearing: definition.bearing,
  }
}
