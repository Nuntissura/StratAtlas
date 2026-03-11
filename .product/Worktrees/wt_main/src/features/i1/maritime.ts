export type MaritimeLayerId = 'commercial-maritime-traffic' | 'maritime-port-awareness'

export type MaritimeSourceState = 'delayed' | 'cached' | 'community_live' | 'licensed_live'

export interface MaritimeAoiPreset {
  aoiId: string
  label: string
}

export interface MaritimeVessel {
  vesselId: string
  mmsi: string
  vesselName: string
  vesselType: string
  destination: string
  coordinates: [number, number]
  headingDeg?: number
  speedKts?: number
  draftM?: number
  lastReportAt: string
  truthLabel: string
  sourceState: MaritimeSourceState
  awarenessReason?: string
}

export interface MaritimeSnapshot {
  providerLabel: string
  sourceUrl: string
  sourceLicense: string
  focusAoiId: string
  focusAoiLabel: string
  retrievedAt: string
  sourceState: MaritimeSourceState
  sourceStateLabel: string
  statusDetail: string
  truthNote: string
  vessels: MaritimeVessel[]
  awarenessSignals: MaritimeVessel[]
  notes: string[]
}

export interface MaritimeLayerDefinition {
  layerId: MaritimeLayerId
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

const MARITIME_AOI_PRESETS: MaritimeAoiPreset[] = [
  {
    aoiId: 'aoi-1',
    label: 'Singapore Strait',
  },
  {
    aoiId: 'aoi-2',
    label: 'Dubai Jebel Ali',
  },
  {
    aoiId: 'aoi-3',
    label: 'Mumbai Coast',
  },
  {
    aoiId: 'aoi-4',
    label: 'Rotterdam Delta',
  },
  {
    aoiId: 'aoi-7',
    label: 'Suez Gateway',
  },
]

const PACKAGED_MARITIME_BY_AOI: Record<string, MaritimeVessel[]> = {
  'aoi-1': [
    {
      vesselId: 'mv-eastern-orchid',
      mmsi: '563114200',
      vesselName: 'MV Eastern Orchid',
      vesselType: 'Container ship',
      destination: 'Port of Singapore',
      coordinates: [103.7821, 1.2314],
      headingDeg: 86,
      speedKts: 14.2,
      draftM: 11.6,
      lastReportAt: '2026-03-10T00:06:00.000Z',
      truthLabel:
        'Packaged delayed/cached maritime benchmark derived under the governed maritime source contract.',
      sourceState: 'cached',
    },
    {
      vesselId: 'mt-jurong-resolve',
      mmsi: '356998300',
      vesselName: 'MT Jurong Resolve',
      vesselType: 'Product tanker',
      destination: 'Jurong Island Anchorage',
      coordinates: [103.6934, 1.2178],
      headingDeg: 48,
      speedKts: 9.1,
      draftM: 9.4,
      lastReportAt: '2026-03-10T00:04:00.000Z',
      truthLabel:
        'Packaged delayed/cached maritime benchmark derived under the governed maritime source contract.',
      sourceState: 'cached',
      awarenessReason:
        'Anchorage approach benchmark near Jurong highlights port-side queue pressure rather than live vessel certainty.',
    },
  ],
  'aoi-2': [
    {
      vesselId: 'mv-gulf-meridian',
      mmsi: '477812400',
      vesselName: 'MV Gulf Meridian',
      vesselType: 'Container ship',
      destination: 'Jebel Ali',
      coordinates: [55.0064, 24.9876],
      headingDeg: 111,
      speedKts: 11.8,
      draftM: 13.1,
      lastReportAt: '2026-03-10T00:08:00.000Z',
      truthLabel:
        'Packaged delayed/cached maritime benchmark derived under the governed maritime source contract.',
      sourceState: 'cached',
    },
    {
      vesselId: 'mt-desert-concord',
      mmsi: '636020510',
      vesselName: 'MT Desert Concord',
      vesselType: 'Crude tanker',
      destination: 'Jebel Ali Offshore',
      coordinates: [54.9478, 24.8741],
      headingDeg: 132,
      speedKts: 7.3,
      draftM: 15.7,
      lastReportAt: '2026-03-10T00:05:00.000Z',
      truthLabel:
        'Packaged delayed/cached maritime benchmark derived under the governed maritime source contract.',
      sourceState: 'cached',
      awarenessReason:
        'Port-side tanker holding pattern benchmark indicates congestion and transfer latency risk, not direct live queue certainty.',
    },
  ],
  'aoi-3': [
    {
      vesselId: 'mv-arabian-horizon',
      mmsi: '419001250',
      vesselName: 'MV Arabian Horizon',
      vesselType: 'Bulk carrier',
      destination: 'JNPT',
      coordinates: [72.9235, 18.9567],
      headingDeg: 214,
      speedKts: 10.2,
      draftM: 12.9,
      lastReportAt: '2026-03-10T00:07:00.000Z',
      truthLabel:
        'Packaged delayed/cached maritime benchmark derived under the governed maritime source contract.',
      sourceState: 'cached',
    },
    {
      vesselId: 'mv-western-gateway',
      mmsi: '538006911',
      vesselName: 'MV Western Gateway',
      vesselType: 'Container ship',
      destination: 'Mumbai Anchorage',
      coordinates: [72.8563, 19.0318],
      headingDeg: 192,
      speedKts: 6.5,
      draftM: 10.7,
      lastReportAt: '2026-03-10T00:03:00.000Z',
      truthLabel:
        'Packaged delayed/cached maritime benchmark derived under the governed maritime source contract.',
      sourceState: 'cached',
      awarenessReason:
        'Approach-speed drop near Mumbai anchorage is a curated congestion cue, not a live berth management feed.',
    },
  ],
  'aoi-4': [
    {
      vesselId: 'mv-northsea-bridge',
      mmsi: '246810200',
      vesselName: 'MV Northsea Bridge',
      vesselType: 'Container ship',
      destination: 'Port of Rotterdam',
      coordinates: [4.0927, 51.9484],
      headingDeg: 73,
      speedKts: 12.6,
      draftM: 13.4,
      lastReportAt: '2026-03-10T00:09:00.000Z',
      truthLabel:
        'Packaged delayed/cached maritime benchmark derived under the governed maritime source contract.',
      sourceState: 'cached',
    },
    {
      vesselId: 'mt-maasvlakte-arc',
      mmsi: '215443000',
      vesselName: 'MT Maasvlakte Arc',
      vesselType: 'Chemical tanker',
      destination: 'Maasvlakte Terminal',
      coordinates: [3.9794, 51.9589],
      headingDeg: 48,
      speedKts: 8.1,
      draftM: 8.8,
      lastReportAt: '2026-03-10T00:04:00.000Z',
      truthLabel:
        'Packaged delayed/cached maritime benchmark derived under the governed maritime source contract.',
      sourceState: 'cached',
      awarenessReason:
        'Terminal-side tanker queue benchmark supports throughput reasoning around the Rotterdam Delta AOI.',
    },
  ],
  'aoi-7': [
    {
      vesselId: 'mv-canal-sentinel',
      mmsi: '373955000',
      vesselName: 'MV Canal Sentinel',
      vesselType: 'Container ship',
      destination: 'Suez Canal convoy',
      coordinates: [32.3608, 30.3956],
      headingDeg: 177,
      speedKts: 9.8,
      draftM: 14.8,
      lastReportAt: '2026-03-10T00:10:00.000Z',
      truthLabel:
        'Packaged delayed/cached maritime benchmark derived under the governed maritime source contract.',
      sourceState: 'cached',
    },
    {
      vesselId: 'mt-bitter-lakes',
      mmsi: '352222000',
      vesselName: 'MT Bitter Lakes',
      vesselType: 'LNG tanker',
      destination: 'Port Said staging',
      coordinates: [32.3701, 30.7194],
      headingDeg: 5,
      speedKts: 5.4,
      draftM: 11.9,
      lastReportAt: '2026-03-10T00:05:00.000Z',
      truthLabel:
        'Packaged delayed/cached maritime benchmark derived under the governed maritime source contract.',
      sourceState: 'cached',
      awarenessReason:
        'Low-speed staging near the canal approach is a chokepoint awareness benchmark, not a live convoy management picture.',
    },
  ],
}

export const MARITIME_LAYER_DEFINITIONS: MaritimeLayerDefinition[] = [
  {
    layerId: 'commercial-maritime-traffic',
    title: 'Commercial Maritime Traffic',
    source: 'Governed packaged maritime benchmark',
    sourceUrl: 'https://marinecadastre.gov/ais/',
    license: 'internal benchmark',
    cadence: 'cached benchmark snapshot',
    confidenceText: 'Cached vessel benchmark around the focused AOI.',
    uncertaintyText:
      'This family is a delayed/cached benchmark only in the current build and must not be read as a live global shipping feed.',
    coverageText:
      'Representative AOI benchmark only; not comprehensive global maritime coverage and not a naval registry.',
    sensitivityClass: 'PUBLIC',
  },
  {
    layerId: 'maritime-port-awareness',
    title: 'Maritime Port Awareness',
    source: 'Curated port-approach heuristic over governed benchmark snapshot',
    sourceUrl: 'https://www.navcen.uscg.gov/ais-faqs',
    license: 'internal benchmark',
    cadence: 'cached benchmark snapshot',
    confidenceText: 'Curated chokepoint and port-side awareness cues tied to the benchmark vessels.',
    uncertaintyText:
      'Awareness signals are strategic heuristics around ports and chokepoints, not live berth control, naval posture, or vessel-intent truth.',
    coverageText:
      'Focused AOI benchmark only; useful for compare/scenario context, not comprehensive maritime surveillance.',
    sensitivityClass: 'INTERNAL',
  },
]

const sourceStateLabel = (state: MaritimeSourceState): string => {
  switch (state) {
    case 'delayed':
      return 'Delayed / Regional'
    case 'community_live':
      return 'Community Feed (User Key)'
    case 'licensed_live':
      return 'Licensed Global Live'
    default:
      return 'Cached Benchmark'
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const normalizeCoordinates = (value: unknown): [number, number] | null => {
  if (!Array.isArray(value) || value.length !== 2) {
    return null
  }
  if (typeof value[0] !== 'number' || typeof value[1] !== 'number') {
    return null
  }
  return [value[0], value[1]]
}

const normalizeMaritimeVessel = (value: unknown): MaritimeVessel | null => {
  if (!isRecord(value)) {
    return null
  }

  const coordinates = normalizeCoordinates(value.coordinates)
  if (!coordinates) {
    return null
  }

  const sourceState =
    value.sourceState === 'delayed' ||
    value.sourceState === 'cached' ||
    value.sourceState === 'community_live' ||
    value.sourceState === 'licensed_live'
      ? value.sourceState
      : 'cached'

  return {
    vesselId: typeof value.vesselId === 'string' ? value.vesselId : '',
    mmsi: typeof value.mmsi === 'string' ? value.mmsi : '',
    vesselName: typeof value.vesselName === 'string' ? value.vesselName : 'Unknown vessel',
    vesselType: typeof value.vesselType === 'string' ? value.vesselType : 'Unknown',
    destination: typeof value.destination === 'string' ? value.destination : 'Unknown',
    coordinates,
    headingDeg: typeof value.headingDeg === 'number' ? value.headingDeg : undefined,
    speedKts: typeof value.speedKts === 'number' ? value.speedKts : undefined,
    draftM: typeof value.draftM === 'number' ? value.draftM : undefined,
    lastReportAt:
      typeof value.lastReportAt === 'string' ? value.lastReportAt : new Date().toISOString(),
    truthLabel:
      typeof value.truthLabel === 'string'
        ? value.truthLabel
        : 'Governed maritime benchmark vessel record.',
    sourceState,
    awarenessReason:
      typeof value.awarenessReason === 'string' ? value.awarenessReason : undefined,
  }
}

export const resolveMaritimeAoiPreset = (aoiId: string): MaritimeAoiPreset =>
  MARITIME_AOI_PRESETS.find((preset) => preset.aoiId === aoiId) ?? MARITIME_AOI_PRESETS[0]

export const createPackagedMaritimeSnapshot = (focusAoiId: string): MaritimeSnapshot => {
  const preset = resolveMaritimeAoiPreset(focusAoiId)
  const vessels =
    PACKAGED_MARITIME_BY_AOI[preset.aoiId] ?? PACKAGED_MARITIME_BY_AOI['aoi-7']
  const awarenessSignals = vessels.filter((vessel) => Boolean(vessel.awarenessReason))
  return {
    providerLabel: 'Governed packaged maritime benchmark',
    sourceUrl: 'https://marinecadastre.gov/ais/',
    sourceLicense: 'internal benchmark',
    focusAoiId: preset.aoiId,
    focusAoiLabel: preset.label,
    retrievedAt: '2026-03-10T00:16:00.000Z',
    sourceState: 'cached',
    sourceStateLabel: sourceStateLabel('cached'),
    statusDetail:
      'Packaged maritime benchmark is active in this build. It supports strategic route and chokepoint reasoning, not live global shipping certainty.',
    truthNote:
      'This family is cached benchmark context only in the current build. It is not a live global ship tracker, not comprehensive outside the focused AOIs, and not a naval movement layer.',
    vessels,
    awarenessSignals,
    notes: [
      'Static ports remain in the Static Installations family; this family adds only movement and port-side awareness cues.',
      'Any future backend-only user-key or licensed live path must keep separate truth labels and coverage notes.',
    ],
  }
}

export const buildFallbackMaritimeSnapshot = ({
  focusAoiId,
  previousSnapshot,
  reason,
}: {
  focusAoiId: string
  previousSnapshot?: MaritimeSnapshot | null
  reason: string
}): MaritimeSnapshot => {
  const previousForAoi =
    previousSnapshot && previousSnapshot.focusAoiId === resolveMaritimeAoiPreset(focusAoiId).aoiId
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

  const packaged = createPackagedMaritimeSnapshot(focusAoiId)
  return {
    ...packaged,
    statusDetail: reason,
    notes: [...packaged.notes, reason],
  }
}

export const normalizeMaritimeSnapshot = (value: unknown): MaritimeSnapshot | null => {
  if (!isRecord(value)) {
    return null
  }

  const sourceState =
    value.sourceState === 'delayed' ||
    value.sourceState === 'cached' ||
    value.sourceState === 'community_live' ||
    value.sourceState === 'licensed_live'
      ? value.sourceState
      : 'cached'
  const vessels = Array.isArray(value.vessels)
    ? value.vessels
        .map((entry) => normalizeMaritimeVessel(entry))
        .filter((entry): entry is MaritimeVessel => entry !== null)
    : []
  const awarenessSignals = Array.isArray(value.awarenessSignals)
    ? value.awarenessSignals
        .map((entry) => normalizeMaritimeVessel(entry))
        .filter((entry): entry is MaritimeVessel => entry !== null)
    : vessels.filter((entry) => Boolean(entry.awarenessReason))

  return {
    providerLabel:
      typeof value.providerLabel === 'string'
        ? value.providerLabel
        : 'Governed packaged maritime benchmark',
    sourceUrl:
      typeof value.sourceUrl === 'string' ? value.sourceUrl : 'https://marinecadastre.gov/ais/',
    sourceLicense:
      typeof value.sourceLicense === 'string' ? value.sourceLicense : 'internal benchmark',
    focusAoiId: typeof value.focusAoiId === 'string' ? value.focusAoiId : 'aoi-7',
    focusAoiLabel:
      typeof value.focusAoiLabel === 'string'
        ? value.focusAoiLabel
        : resolveMaritimeAoiPreset('aoi-7').label,
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
        : 'Recorder snapshot restored; the governed maritime benchmark remains active.',
    truthNote:
      typeof value.truthNote === 'string'
        ? value.truthNote
        : 'This family is cached benchmark context only and must not be treated as a live global shipping feed.',
    vessels,
    awarenessSignals,
    notes: Array.isArray(value.notes)
      ? value.notes.filter((entry): entry is string => typeof entry === 'string')
      : [],
  }
}

export const MARITIME_LAYER_IDS = MARITIME_LAYER_DEFINITIONS.map(
  (definition) => definition.layerId,
)
