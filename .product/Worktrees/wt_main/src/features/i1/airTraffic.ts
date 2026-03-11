export type AirTrafficLayerId = 'commercial-air-traffic' | 'flight-awareness-heuristic'

export type AirTrafficSourceState = 'live' | 'delayed' | 'cached'

export interface AirTrafficBounds {
  minLat: number
  minLon: number
  maxLat: number
  maxLon: number
}

export interface AirTrafficAoiPreset {
  aoiId: string
  label: string
  bounds: AirTrafficBounds
}

export interface AirTrafficFlight {
  flightId: string
  icao24: string
  callsign: string
  originCountry: string
  coordinates: [number, number]
  altitudeFt?: number
  velocityKts?: number
  headingDeg?: number
  verticalRateFpm?: number
  onGround: boolean
  lastContactAt: string
  truthLabel: string
  sourceState: 'live' | 'delayed'
}

export interface AirTrafficSnapshot {
  providerLabel: string
  sourceUrl: string
  sourceLicense: string
  focusAoiId: string
  focusAoiLabel: string
  retrievedAt: string
  sourceState: AirTrafficSourceState
  sourceStateLabel: string
  statusDetail: string
  truthNote: string
  flights: AirTrafficFlight[]
  awarenessFlights: AirTrafficFlight[]
  notes: string[]
}

export interface CommercialAirLayerDefinition {
  layerId: AirTrafficLayerId
  title: string
  source: string
  sourceUrl: string
  license: string
  cadence: string
  confidenceText: string
  uncertaintyText: string
  coverageText: string
  sensitivityClass: 'PUBLIC' | 'INTERNAL'
}

export interface FetchCommercialAirTrafficRequest {
  focusAoiId: string
  focusAoiLabel: string
  minLat: number
  minLon: number
  maxLat: number
  maxLon: number
  maxFlights?: number
}

export interface FetchCommercialAirTrafficResult {
  providerLabel: string
  sourceUrl: string
  sourceLicense: string
  focusAoiId: string
  focusAoiLabel: string
  retrievedAt: string
  sourceState: 'live' | 'delayed'
  statusDetail: string
  flights: AirTrafficFlight[]
}

const AIR_TRAFFIC_AOI_PRESETS: AirTrafficAoiPreset[] = [
  {
    aoiId: 'aoi-1',
    label: 'Singapore Strait',
    bounds: {
      minLat: 0.85,
      minLon: 103.45,
      maxLat: 1.95,
      maxLon: 104.15,
    },
  },
  {
    aoiId: 'aoi-2',
    label: 'Dubai Jebel Ali',
    bounds: {
      minLat: 24.45,
      minLon: 54.55,
      maxLat: 25.35,
      maxLon: 55.55,
    },
  },
  {
    aoiId: 'aoi-3',
    label: 'Mumbai Coast',
    bounds: {
      minLat: 18.55,
      minLon: 72.45,
      maxLat: 19.55,
      maxLon: 73.25,
    },
  },
  {
    aoiId: 'aoi-4',
    label: 'Rotterdam Delta',
    bounds: {
      minLat: 51.45,
      minLon: 3.65,
      maxLat: 52.25,
      maxLon: 4.95,
    },
  },
  {
    aoiId: 'aoi-7',
    label: 'Suez Gateway',
    bounds: {
      minLat: 29.55,
      minLon: 31.55,
      maxLat: 31.25,
      maxLon: 33.05,
    },
  },
]

const HEURISTIC_CALLSIGN_PREFIXES = [
  {
    prefix: 'RCH',
    reason: 'Curated watchlist matched the Air Mobility Command-style callsign prefix RCH.',
  },
  {
    prefix: 'RRR',
    reason: 'Curated watchlist matched the Royal Air Force transport-style callsign prefix RRR.',
  },
  {
    prefix: 'MMF',
    reason: 'Curated watchlist matched the multinational military tanker/transport-style callsign prefix MMF.',
  },
] as const

const PACKAGED_AIR_TRAFFIC_BY_AOI: Record<string, AirTrafficFlight[]> = {
  'aoi-1': [
    {
      flightId: 'sample-sia121',
      icao24: '76cd0d',
      callsign: 'SIA121',
      originCountry: 'Singapore',
      coordinates: [103.9372, 1.2535],
      altitudeFt: 2100,
      velocityKts: 140,
      headingDeg: 23,
      verticalRateFpm: -700,
      onGround: false,
      lastContactAt: '2026-03-10T00:11:00.000Z',
      truthLabel: 'Observed transponder state from a packaged benchmark snapshot.',
      sourceState: 'delayed',
    },
    {
      flightId: 'sample-igo1028',
      icao24: '8016ba',
      callsign: 'IGO1028',
      originCountry: 'India',
      coordinates: [103.6568, 1.954],
      altitudeFt: 17550,
      velocityKts: 380,
      headingDeg: 307,
      verticalRateFpm: 1650,
      onGround: false,
      lastContactAt: '2026-03-10T00:10:00.000Z',
      truthLabel: 'Observed transponder state from a packaged benchmark snapshot.',
      sourceState: 'delayed',
    },
    {
      flightId: 'sample-rch852',
      icao24: 'adf852',
      callsign: 'RCH852',
      originCountry: 'United States',
      coordinates: [103.788, 1.544],
      altitudeFt: 19100,
      velocityKts: 342,
      headingDeg: 91,
      verticalRateFpm: 0,
      onGround: false,
      lastContactAt: '2026-03-10T00:09:00.000Z',
      truthLabel: 'Observed transponder state from a packaged benchmark snapshot.',
      sourceState: 'delayed',
    },
  ],
  'aoi-2': [
    {
      flightId: 'sample-uae212',
      icao24: '8961b4',
      callsign: 'UAE212',
      originCountry: 'United Arab Emirates',
      coordinates: [55.0312, 24.9721],
      altitudeFt: 8600,
      velocityKts: 210,
      headingDeg: 118,
      verticalRateFpm: -900,
      onGround: false,
      lastContactAt: '2026-03-10T00:12:00.000Z',
      truthLabel: 'Observed transponder state from a packaged benchmark snapshot.',
      sourceState: 'delayed',
    },
    {
      flightId: 'sample-rrr7428',
      icao24: '43c743',
      callsign: 'RRR7428',
      originCountry: 'United Kingdom',
      coordinates: [55.227, 24.845],
      altitudeFt: 22350,
      velocityKts: 355,
      headingDeg: 266,
      verticalRateFpm: 200,
      onGround: false,
      lastContactAt: '2026-03-10T00:11:00.000Z',
      truthLabel: 'Observed transponder state from a packaged benchmark snapshot.',
      sourceState: 'delayed',
    },
  ],
  'aoi-3': [
    {
      flightId: 'sample-ai674',
      icao24: '8006ad',
      callsign: 'AIC674',
      originCountry: 'India',
      coordinates: [72.901, 19.063],
      altitudeFt: 12100,
      velocityKts: 220,
      headingDeg: 244,
      verticalRateFpm: -1200,
      onGround: false,
      lastContactAt: '2026-03-10T00:08:00.000Z',
      truthLabel: 'Observed transponder state from a packaged benchmark snapshot.',
      sourceState: 'delayed',
    },
  ],
  'aoi-4': [
    {
      flightId: 'sample-klm198',
      icao24: '48418b',
      callsign: 'KLM198',
      originCountry: 'Netherlands',
      coordinates: [4.352, 51.989],
      altitudeFt: 7400,
      velocityKts: 180,
      headingDeg: 36,
      verticalRateFpm: 950,
      onGround: false,
      lastContactAt: '2026-03-10T00:13:00.000Z',
      truthLabel: 'Observed transponder state from a packaged benchmark snapshot.',
      sourceState: 'delayed',
    },
    {
      flightId: 'sample-mmf58',
      icao24: '4d03c7',
      callsign: 'MMF58',
      originCountry: 'Netherlands',
      coordinates: [4.544, 51.614],
      altitudeFt: 18200,
      velocityKts: 331,
      headingDeg: 212,
      verticalRateFpm: -100,
      onGround: false,
      lastContactAt: '2026-03-10T00:12:00.000Z',
      truthLabel: 'Observed transponder state from a packaged benchmark snapshot.',
      sourceState: 'delayed',
    },
  ],
  'aoi-7': [
    {
      flightId: 'sample-egy504',
      icao24: '0101df',
      callsign: 'MSR504',
      originCountry: 'Egypt',
      coordinates: [32.298, 30.842],
      altitudeFt: 16400,
      velocityKts: 289,
      headingDeg: 171,
      verticalRateFpm: 450,
      onGround: false,
      lastContactAt: '2026-03-10T00:07:00.000Z',
      truthLabel: 'Observed transponder state from a packaged benchmark snapshot.',
      sourceState: 'delayed',
    },
  ],
}

export const AIR_TRAFFIC_LAYER_DEFINITIONS: CommercialAirLayerDefinition[] = [
  {
    layerId: 'commercial-air-traffic',
    title: 'Commercial Air Traffic',
    source: 'OpenSky Network state vectors',
    sourceUrl: 'https://opensky-network.org/apidoc/rest.html',
    license: 'public delayed',
    cadence: 'live or delayed snapshot',
    confidenceText: 'Observed transponder positions for the focused AOI.',
    uncertaintyText:
      'Receiver coverage varies by theatre; this layer is a focused traffic picture, not a complete global air picture.',
    coverageText: 'Focused AOI snapshot only; refresh to update the traffic picture.',
    sensitivityClass: 'PUBLIC',
  },
  {
    layerId: 'flight-awareness-heuristic',
    title: 'Flight Awareness (Heuristic)',
    source: 'Curated watchlist over OpenSky state vectors',
    sourceUrl: 'https://opensky-network.org/apidoc/rest.html',
    license: 'internal',
    cadence: 'derived from the current air snapshot',
    confidenceText: 'Separately labeled awareness overlay from a narrow curated watchlist.',
    uncertaintyText:
      'Heuristic only. It is incomplete, may false-positive, and must not be treated as authoritative military flight identification.',
    coverageText: 'Focused AOI only; derived from a small prefix watchlist instead of a verified military registry.',
    sensitivityClass: 'INTERNAL',
  },
]

const sourceStateLabel = (state: AirTrafficSourceState): string => {
  if (state === 'live') {
    return 'Live snapshot'
  }
  if (state === 'delayed') {
    return 'Delayed snapshot'
  }
  return 'Cached snapshot'
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const normalizeFlight = (value: unknown): AirTrafficFlight | null => {
  if (!isRecord(value)) {
    return null
  }

  const coordinates = Array.isArray(value.coordinates)
    ? value.coordinates.filter(
        (entry): entry is number => typeof entry === 'number' && Number.isFinite(entry),
      )
    : []
  if (coordinates.length !== 2) {
    return null
  }

  const sourceState =
    value.sourceState === 'live' || value.sourceState === 'delayed'
      ? value.sourceState
      : 'delayed'

  return {
    flightId: typeof value.flightId === 'string' ? value.flightId : '',
    icao24: typeof value.icao24 === 'string' ? value.icao24 : '',
    callsign: typeof value.callsign === 'string' ? value.callsign : '',
    originCountry: typeof value.originCountry === 'string' ? value.originCountry : 'Unknown',
    coordinates: [coordinates[0], coordinates[1]],
    altitudeFt: typeof value.altitudeFt === 'number' ? value.altitudeFt : undefined,
    velocityKts: typeof value.velocityKts === 'number' ? value.velocityKts : undefined,
    headingDeg: typeof value.headingDeg === 'number' ? value.headingDeg : undefined,
    verticalRateFpm: typeof value.verticalRateFpm === 'number' ? value.verticalRateFpm : undefined,
    onGround: Boolean(value.onGround),
    lastContactAt:
      typeof value.lastContactAt === 'string' ? value.lastContactAt : new Date().toISOString(),
    truthLabel:
      typeof value.truthLabel === 'string'
        ? value.truthLabel
        : 'Observed transponder state from a governed snapshot.',
    sourceState,
  }
}

const deriveAwarenessFlights = (flights: AirTrafficFlight[]): AirTrafficFlight[] =>
  flights
    .filter((flight) => flight.callsign.trim().length > 0)
    .flatMap((flight) => {
      const normalizedCallsign = flight.callsign.trim().toUpperCase()
      const matchedRule = HEURISTIC_CALLSIGN_PREFIXES.find((rule) =>
        normalizedCallsign.startsWith(rule.prefix),
      )
      if (!matchedRule) {
        return []
      }
      return [
        {
          ...flight,
          truthLabel: `${flight.truthLabel} Heuristic military-awareness candidate only. ${matchedRule.reason}`,
        },
      ]
    })

export const resolveAirTrafficAoiPreset = (aoiId: string): AirTrafficAoiPreset =>
  AIR_TRAFFIC_AOI_PRESETS.find((preset) => preset.aoiId === aoiId) ?? AIR_TRAFFIC_AOI_PRESETS[0]

export const createPackagedAirTrafficSnapshot = (focusAoiId: string): AirTrafficSnapshot => {
  const preset = resolveAirTrafficAoiPreset(focusAoiId)
  const flights = PACKAGED_AIR_TRAFFIC_BY_AOI[preset.aoiId] ?? PACKAGED_AIR_TRAFFIC_BY_AOI['aoi-1']
  return {
    providerLabel: 'Packaged OpenSky benchmark snapshot',
    sourceUrl: 'https://opensky-network.org/apidoc/rest.html',
    sourceLicense: 'public delayed',
    focusAoiId: preset.aoiId,
    focusAoiLabel: preset.label,
    retrievedAt: '2026-03-10T00:15:00.000Z',
    sourceState: 'cached',
    sourceStateLabel: sourceStateLabel('cached'),
    statusDetail:
      'Packaged benchmark snapshot is active until a governed runtime refresh succeeds in the focused AOI.',
    truthNote:
      'Commercial traffic is observed transponder data when fetched live. The separate awareness overlay is heuristic only and not an authoritative military registry.',
    flights,
    awarenessFlights: deriveAwarenessFlights(flights),
    notes: [
      'Fallback keeps the map useful when the runtime is offline or the live source is unavailable.',
      'Awareness candidates come from a small curated prefix watchlist and may false-positive.',
    ],
  }
}

export const buildAirTrafficSnapshotFromFetch = (
  result: FetchCommercialAirTrafficResult,
): AirTrafficSnapshot => {
  const awarenessFlights = deriveAwarenessFlights(result.flights)
  return {
    providerLabel: result.providerLabel,
    sourceUrl: result.sourceUrl,
    sourceLicense: result.sourceLicense,
    focusAoiId: result.focusAoiId,
    focusAoiLabel: result.focusAoiLabel,
    retrievedAt: result.retrievedAt,
    sourceState: result.sourceState,
    sourceStateLabel: sourceStateLabel(result.sourceState),
    statusDetail: result.statusDetail,
    truthNote:
      'Commercial traffic is observed transponder data from OpenSky. The awareness overlay stays heuristic and may be incomplete or wrong.',
    flights: result.flights,
    awarenessFlights,
    notes: [
      awarenessFlights.length > 0
        ? `${awarenessFlights.length} heuristic awareness candidate(s) matched the curated watchlist.`
        : 'No heuristic awareness candidates matched the current watchlist in this snapshot.',
    ],
  }
}

export const buildFallbackAirTrafficSnapshot = ({
  focusAoiId,
  previousSnapshot,
  reason,
}: {
  focusAoiId: string
  previousSnapshot?: AirTrafficSnapshot | null
  reason: string
}): AirTrafficSnapshot => {
  const previousForAoi =
    previousSnapshot && previousSnapshot.focusAoiId === resolveAirTrafficAoiPreset(focusAoiId).aoiId
      ? previousSnapshot
      : null

  if (previousForAoi) {
    return {
      ...previousForAoi,
      sourceState: 'cached',
      sourceStateLabel: sourceStateLabel('cached'),
      statusDetail: reason,
      notes: [...previousForAoi.notes, reason],
    }
  }

  const packaged = createPackagedAirTrafficSnapshot(focusAoiId)
  return {
    ...packaged,
    statusDetail: reason,
    notes: [...packaged.notes, reason],
  }
}

export const normalizeAirTrafficSnapshot = (value: unknown): AirTrafficSnapshot | null => {
  if (!isRecord(value)) {
    return null
  }

  const sourceState =
    value.sourceState === 'live' || value.sourceState === 'delayed' || value.sourceState === 'cached'
      ? value.sourceState
      : 'cached'
  const flights = Array.isArray(value.flights)
    ? value.flights
        .map((entry) => normalizeFlight(entry))
        .filter((entry): entry is AirTrafficFlight => entry !== null)
    : []
  const awarenessFlights = Array.isArray(value.awarenessFlights)
    ? value.awarenessFlights
        .map((entry) => normalizeFlight(entry))
        .filter((entry): entry is AirTrafficFlight => entry !== null)
    : deriveAwarenessFlights(flights)

  return {
    providerLabel:
      typeof value.providerLabel === 'string'
        ? value.providerLabel
        : 'Packaged OpenSky benchmark snapshot',
    sourceUrl:
      typeof value.sourceUrl === 'string'
        ? value.sourceUrl
        : 'https://opensky-network.org/apidoc/rest.html',
    sourceLicense: typeof value.sourceLicense === 'string' ? value.sourceLicense : 'public delayed',
    focusAoiId: typeof value.focusAoiId === 'string' ? value.focusAoiId : 'aoi-1',
    focusAoiLabel:
      typeof value.focusAoiLabel === 'string'
        ? value.focusAoiLabel
        : resolveAirTrafficAoiPreset('aoi-1').label,
    retrievedAt:
      typeof value.retrievedAt === 'string' ? value.retrievedAt : new Date().toISOString(),
    sourceState,
    sourceStateLabel:
      typeof value.sourceStateLabel === 'string'
        ? value.sourceStateLabel
        : sourceStateLabel(sourceState),
    statusDetail:
      typeof value.statusDetail === 'string'
        ? value.statusDetail
        : 'Recorder snapshot restored; refresh for a new governed air picture.',
    truthNote:
      typeof value.truthNote === 'string'
        ? value.truthNote
        : 'Commercial traffic is observed transponder data; the awareness overlay is heuristic only.',
    flights,
    awarenessFlights,
    notes: Array.isArray(value.notes)
      ? value.notes.filter((entry): entry is string => typeof entry === 'string')
      : [],
  }
}

export const AIR_TRAFFIC_LAYER_IDS = AIR_TRAFFIC_LAYER_DEFINITIONS.map(
  (definition) => definition.layerId,
)
