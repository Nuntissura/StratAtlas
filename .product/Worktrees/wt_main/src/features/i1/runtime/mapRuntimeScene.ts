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
import type { AirTrafficSnapshot } from '../airTraffic'
import type { MaritimeSnapshot } from '../maritime'
import type { UiMode } from '../modes'
import type { SatelliteSnapshot } from '../satellites'
import { listSpecializedInfrastructureRecordsForLayers } from '../specializedInfrastructure'
import { listStaticInstallationRecordsForLayers } from '../staticInstallations'

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
  | 'air_traffic'
  | 'maritime'
  | 'maritime_awareness'
  | 'awareness'
  | 'satellite'
  | 'satellite_coverage'

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
  altitudeMeters?: number[]
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
  altitudeMeters?: number
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
  airTrafficSnapshot?: AirTrafficSnapshot | null
  maritimeSnapshot?: MaritimeSnapshot | null
  satelliteSnapshot?: SatelliteSnapshot | null
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

export const deriveRuntimeFocusAoiId = ({
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
  if (input.visibleLayerCatalog.some((entry) => entry.familyId === 'satellite-coverage')) {
    return `Satellite mode turns ${focus.label} into an orbital context scene with propagated pass windows, footprints, and revisit reasoning tied back to the active AOI.`
  }
  if (input.visibleLayerCatalog.some((entry) => entry.familyId === 'maritime-awareness')) {
    return `Maritime mode turns ${focus.label} into a constrained shipping and port-awareness scene with truthful delayed-or-cached movement cues rather than a fake live global tracker.`
  }
  if (input.visibleLayerCatalog.some((entry) => entry.familyId === 'specialized-infrastructure')) {
    return `Specialized infrastructure mode turns ${focus.label} into a resilience scene with refining, metallurgical, and water-treatment context rendered directly on the map with explicit coverage-gap language.`
  }
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
  properties: Omit<RuntimeCorridorProperties, 'featureId'> & {
    featureId?: string
    coordinates?: Position[]
  },
) => {
  const { coordinates, ...runtimeProperties } = properties
  features.push({
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: coordinates ?? [from, to],
    },
    properties: {
      ...runtimeProperties,
      featureId: properties.featureId ?? `${properties.category}-${features.length + 1}`,
    },
  })
}

const projectHeadingPoint = (
  center: Position,
  headingDeg: number | undefined,
  scale = 0.18,
): Position => {
  const radians = ((headingDeg ?? 0) - 90) * (Math.PI / 180)
  return [
    Number((center[0] + Math.cos(radians) * scale).toFixed(4)),
    Number((center[1] + Math.sin(radians) * scale).toFixed(4)),
  ]
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
  const focusAoiId = deriveRuntimeFocusAoiId({
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
  const staticLayerEntries = input.visibleLayerCatalog.filter(
    (entry) => entry.familyId === 'static-installations',
  )
  const staticLayerEntryById = new Map(
    staticLayerEntries.map((entry) => [entry.layerId, entry] as const),
  )
  const staticInstallationRecords = listStaticInstallationRecordsForLayers(
    staticLayerEntries.map((entry) => entry.layerId),
  )
  const specializedLayerEntries = input.visibleLayerCatalog.filter(
    (entry) => entry.familyId === 'specialized-infrastructure',
  )
  const specializedLayerEntryById = new Map(
    specializedLayerEntries.map((entry) => [entry.layerId, entry] as const),
  )
  const specializedInfrastructureRecords = listSpecializedInfrastructureRecordsForLayers(
    specializedLayerEntries.map((entry) => entry.layerId),
  )

  staticInstallationRecords.forEach((record, index) => {
    const layerEntry = staticLayerEntryById.get(record.layerId)
    const militaryInstallation = record.layerId.includes('military')
    signals.features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: record.coordinates,
      },
      properties: {
        featureId: `static-installation-${record.installationId}`,
        aoiId: record.aoiId,
        category: 'context',
        label: record.name,
        detail: `${record.category}. ${record.detail} ${record.truthNote} Source ${layerEntry?.source ?? 'Curated snapshot'} | Cadence ${layerEntry?.cadence ?? 'static'}${layerEntry?.coverageText ? ` | Coverage ${layerEntry.coverageText}` : ''}`,
        tone: 'context',
        radius: militaryInstallation ? 6 : 7,
        haloRadius: militaryInstallation ? 16 : 18,
        haloOpacity: militaryInstallation ? 0.16 : 0.2,
        emphasis: record.aoiId === focusAoiId ? 0.94 : 0.68 - (index % 3) * 0.04,
      },
    })
  })

  specializedInfrastructureRecords.forEach((record, index) => {
    const layerEntry = specializedLayerEntryById.get(record.layerId)
    const clusterSite = record.truthNote.toLowerCase().includes('cluster')
    signals.features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: record.coordinates,
      },
      properties: {
        featureId: `specialized-infrastructure-${record.siteId}`,
        aoiId: record.aoiId,
        category: 'context',
        label: record.name,
        detail: `${record.category}. ${record.detail} ${record.truthNote} Source ${layerEntry?.source ?? 'Composite curated snapshot'} | Cadence ${layerEntry?.cadence ?? 'static'}${layerEntry?.coverageText ? ` | Coverage ${layerEntry.coverageText}` : ''}`,
        tone: 'context',
        radius: clusterSite ? 6 : 7,
        haloRadius: clusterSite ? 17 : 19,
        haloOpacity: clusterSite ? 0.18 : 0.22,
        emphasis: record.aoiId === focusAoiId ? 0.95 : 0.7 - (index % 3) * 0.04,
      },
    })
  })

  const commercialAirVisible = input.visibleLayerCatalog.some(
    (entry) => entry.layerId === 'commercial-air-traffic',
  )
  const awarenessVisible = input.visibleLayerCatalog.some(
    (entry) => entry.layerId === 'flight-awareness-heuristic',
  )
  const airTrafficSnapshot = input.airTrafficSnapshot ?? null
  const maritimeSnapshot = input.maritimeSnapshot ?? null
  const satellitePositionsVisible = input.visibleLayerCatalog.some(
    (entry) => entry.layerId === 'satellite-propagated-positions',
  )
  const satelliteTracksVisible = input.visibleLayerCatalog.some(
    (entry) => entry.layerId === 'satellite-ground-tracks',
  )
  const satelliteFootprintsVisible = input.visibleLayerCatalog.some(
    (entry) => entry.layerId === 'satellite-coverage-footprints',
  )
  const satelliteSnapshot = input.satelliteSnapshot ?? null

  if (airTrafficSnapshot && commercialAirVisible) {
    const visibleFlights = airTrafficSnapshot.flights.slice(0, 10)

    if (visibleFlights.length === 0) {
      pushSignal(
        signals.features,
        focus.center,
        {
          aoiId: focusAoiId,
          category: 'air_traffic',
          label: 'No commercial flights in snapshot',
          detail: `${airTrafficSnapshot.statusDetail} Refresh or change focus to fetch a different AOI snapshot.`,
          tone: 'support',
          radius: 6,
          haloRadius: 16,
          haloOpacity: 0.16,
          emphasis: 0.7,
        },
        [0.28, -0.24],
      )
    }

    visibleFlights.forEach((flight, index) => {
      signals.features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: flight.coordinates,
        },
        properties: {
          featureId: `commercial-air-${flight.flightId}`,
          aoiId: airTrafficSnapshot.focusAoiId,
          category: 'air_traffic',
          label: flight.callsign || flight.icao24.toUpperCase(),
          detail: `${flight.callsign || flight.icao24.toUpperCase()} from ${flight.originCountry} | ${
            flight.velocityKts ? `${Math.round(flight.velocityKts)} kts` : 'speed unavailable'
          } | ${
            flight.altitudeFt ? `${Math.round(flight.altitudeFt)} ft` : 'altitude unavailable'
          } | ${flight.truthLabel}`,
          tone: 'evidence',
          radius: flight.onGround ? 4 : 6.5,
          haloRadius: flight.onGround ? 10 : 18,
          haloOpacity: flight.sourceState === 'live' ? 0.24 : 0.16,
          emphasis:
            airTrafficSnapshot.focusAoiId === focusAoiId ? 0.94 : 0.72 - (index % 4) * 0.05,
        },
      })

      if (!flight.onGround) {
        pushCorridor(
          corridors.features,
          flight.coordinates,
          projectHeadingPoint(flight.coordinates, flight.headingDeg),
          {
            category: 'air_traffic',
            label: `${flight.callsign || flight.icao24.toUpperCase()} projected track`,
            detail: `Short heading projection from the current ${airTrafficSnapshot.sourceStateLabel.toLowerCase()}.`,
            tone: 'evidence',
            color: TONE_COLORS.evidence,
            width: 2.4,
            dashLength: 0.3,
          },
        )
      }
    })
  }

  if (airTrafficSnapshot && awarenessVisible) {
    const awarenessFlights = airTrafficSnapshot.awarenessFlights.slice(0, 6)

    if (awarenessFlights.length === 0) {
      pushSignal(
        signals.features,
        focus.center,
        {
          aoiId: focusAoiId,
          category: 'awareness',
          label: 'No heuristic awareness candidates',
          detail:
            'The curated prefix watchlist found no candidates in the current air snapshot. This is not proof that no military flights exist.',
          tone: 'alert',
          radius: 5.5,
          haloRadius: 15,
          haloOpacity: 0.12,
          emphasis: 0.64,
        },
        [-0.26, -0.18],
      )
    }

    awarenessFlights.forEach((flight, index) => {
      signals.features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: flight.coordinates,
        },
        properties: {
          featureId: `air-awareness-${flight.flightId}`,
          aoiId: airTrafficSnapshot.focusAoiId,
          category: 'awareness',
          label: `${flight.callsign || flight.icao24.toUpperCase()} watch`,
          detail: flight.truthLabel,
          tone: 'alert',
          radius: 7,
          haloRadius: 20,
          haloOpacity: 0.22,
          emphasis:
            airTrafficSnapshot.focusAoiId === focusAoiId ? 0.96 : 0.74 - (index % 3) * 0.04,
        },
      })
      })
  }

  const maritimeTrafficVisible = input.visibleLayerCatalog.some(
    (entry) => entry.layerId === 'commercial-maritime-traffic',
  )
  const maritimeAwarenessVisible = input.visibleLayerCatalog.some(
    (entry) => entry.layerId === 'maritime-port-awareness',
  )

  if (maritimeSnapshot && maritimeTrafficVisible) {
    const visibleVessels = maritimeSnapshot.vessels.slice(0, 10)
    if (visibleVessels.length > 0) {
      pushSignal(signals.features, focus.center, {
        category: 'maritime',
        aoiId: maritimeSnapshot.focusAoiId,
        label: `${maritimeSnapshot.focusAoiLabel} shipping picture`,
        detail: `${maritimeSnapshot.statusDetail} The current build keeps this as constrained maritime benchmark context rather than a live global feed.`,
        tone: maritimeSnapshot.sourceState === 'cached' ? 'support' : 'evidence',
        radius: 7,
        haloRadius: 20,
        haloOpacity: 0.16,
        emphasis: 0.9,
      })
    }

    visibleVessels.forEach((vessel, index) => {
      pushSignal(
        signals.features,
        vessel.coordinates,
        {
          featureId: `maritime-${vessel.vesselId}`,
          aoiId: maritimeSnapshot.focusAoiId,
          category: 'maritime',
          label: vessel.vesselName,
          detail: `${vessel.vesselType} to ${vessel.destination}. ${vessel.speedKts ? `${Math.round(vessel.speedKts)} kts` : 'Speed unknown'}. ${vessel.truthLabel}`,
          tone: maritimeSnapshot.sourceState === 'cached' ? 'support' : 'evidence',
          radius: 6,
          haloRadius: 18,
          haloOpacity: maritimeSnapshot.focusAoiId === focusAoiId ? 0.22 : 0.15,
          emphasis: maritimeSnapshot.focusAoiId === focusAoiId ? 0.94 : 0.72 - (index % 4) * 0.05,
        },
      )

      pushCorridor(
        corridors.features,
        vessel.coordinates,
        projectHeadingPoint(vessel.coordinates, vessel.headingDeg, 0.16),
        {
          featureId: `maritime-corridor-${vessel.vesselId}`,
          category: 'maritime',
          label: `${vessel.vesselName} course cue`,
          detail: `Short projected course cue from the current ${maritimeSnapshot.sourceStateLabel.toLowerCase()} maritime benchmark.`,
          tone: maritimeSnapshot.sourceState === 'cached' ? 'support' : 'evidence',
          color: TONE_COLORS[maritimeSnapshot.sourceState === 'cached' ? 'support' : 'evidence'],
          width: 2.4,
          dashLength: 1.2,
        },
      )
    })
  }

  if (maritimeSnapshot && maritimeAwarenessVisible) {
    const awarenessSignals = maritimeSnapshot.awarenessSignals.slice(0, 6)
    awarenessSignals.forEach((signal, index) => {
      pushSignal(
        signals.features,
        signal.coordinates,
        {
          featureId: `maritime-awareness-${signal.vesselId}`,
          aoiId: maritimeSnapshot.focusAoiId,
          category: 'maritime_awareness',
          label: `${signal.vesselName} awareness cue`,
          detail: signal.awarenessReason ?? signal.truthLabel,
          tone: 'context',
          radius: 7,
          haloRadius: 22,
          haloOpacity: 0.22,
          emphasis: maritimeSnapshot.focusAoiId === focusAoiId ? 0.96 : 0.74 - (index % 3) * 0.04,
        },
      )

      pushCorridor(
        corridors.features,
        signal.coordinates,
        focus.center,
        {
          featureId: `maritime-awareness-corridor-${signal.vesselId}`,
          category: 'maritime_awareness',
          label: `${signal.vesselName} port cue`,
          detail: `Awareness cue ties the vessel benchmark back to ${maritimeSnapshot.focusAoiLabel}. ${signal.awarenessReason ?? signal.truthLabel}`,
          tone: 'context',
          color: TONE_COLORS.context,
          width: 2,
          dashLength: 1.6,
        },
      )
    })
  }

  if (satelliteSnapshot && (satellitePositionsVisible || satelliteTracksVisible || satelliteFootprintsVisible)) {
    const visibleSatellites = satelliteSnapshot.satellites.slice(0, 4)

    if (visibleSatellites.length === 0) {
      pushSignal(
        signals.features,
        focus.center,
        {
          aoiId: focusAoiId,
          category: 'satellite',
          label: 'No propagated pass window in snapshot',
          detail: `${satelliteSnapshot.statusDetail} Refresh or change AOI to compute a different orbital window.`,
          tone: 'model',
          radius: 6,
          haloRadius: 18,
          haloOpacity: 0.18,
          emphasis: 0.72,
          altitudeMeters: 140_000,
        },
        [0.34, 0.24],
      )
    }

    visibleSatellites.forEach((satellite, index) => {
      const focusOffset = satellite.focusCovered ? 0 : index * 0.04
      const footprintTone = satellite.focusCovered ? 'model' : 'support'
      const footprintOpacity = satellite.focusCovered ? 0.16 : 0.08
      if (satelliteFootprintsVisible) {
        surfaces.features.push({
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [satellite.footprintCoordinates],
          },
          properties: {
            featureId: `satellite-footprint-${satellite.satelliteId}`,
            aoiId: satellite.focusAoiId,
            label: `${satellite.displayName} footprint`,
            detail: `${satellite.categoryLabel}. ${satellite.statusLabel} Coverage radius ${Math.round(
              satellite.coverageRadiusKm,
            )} km. ${satellite.truthLabel}`,
            fillColor: footprintTone === 'model' ? '#5b3e16' : '#1f3654',
            fillOpacity: footprintOpacity,
            lineColor: footprintTone === 'model' ? '#ffbe78' : '#b4c7ff',
            emphasis: satellite.focusCovered ? 0.9 : 0.55,
          },
        })
      }

      if (satelliteTracksVisible && satellite.track.length >= 2) {
        pushCorridor(
          corridors.features,
          satellite.track[0].coordinates,
          satellite.track[satellite.track.length - 1].coordinates,
          {
            category: 'satellite',
            label: `${satellite.displayName} propagated corridor`,
            detail: `${satellite.categoryLabel}. Short propagated orbit corridor around ${satellite.focusAoiLabel}. ${satellite.truthLabel}`,
            tone: 'model',
            color: TONE_COLORS.model,
            width: 2.3,
            dashLength: 0.45,
            coordinates: satellite.track.map((point) => point.coordinates),
            altitudeMeters: satellite.track.map((point) =>
              Math.max(140_000, Math.round(point.altitudeKm * 1000)),
            ),
          },
        )
      }

      if (satellitePositionsVisible) {
        signals.features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: satellite.coordinates,
          },
          properties: {
            featureId: `satellite-position-${satellite.satelliteId}`,
            aoiId: satellite.focusAoiId,
            category: satellite.focusCovered ? 'satellite_coverage' : 'satellite',
            label: satellite.displayName,
            detail: `${satellite.categoryLabel}. ${satellite.statusLabel} Altitude ${Math.round(
              satellite.altitudeKm,
            )} km | Anchor ${satellite.analysisAnchorAt}. ${satellite.truthLabel}`,
            tone: 'model',
            radius: satellite.focusCovered ? 7 : 6,
            haloRadius: satellite.focusCovered ? 22 : 18,
            haloOpacity: satellite.focusCovered ? 0.24 : 0.18,
            emphasis: satellite.focusCovered ? 0.98 : 0.72 - focusOffset,
            altitudeMeters: Math.max(160_000, Math.round(satellite.altitudeKm * 1000)),
          },
        })
      }
    })
  }

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
