import {
  degreesLat,
  degreesLong,
  eciToGeodetic,
  gstime,
  json2satrec,
  propagate,
  twoline2satrec,
  type OMMJsonObject,
  type SatRec,
} from 'satellite.js'

export type SatelliteLayerId =
  | 'satellite-propagated-positions'
  | 'satellite-ground-tracks'
  | 'satellite-coverage-footprints'

export type SatelliteSourceState = 'live' | 'cached'

export interface SatelliteAoiPreset {
  aoiId: string
  label: string
  center: [number, number]
}

export interface SatelliteTrackPoint {
  coordinates: [number, number]
  altitudeKm: number
  recordedAt: string
}

export interface GovernedSatellitePass {
  satelliteId: string
  displayName: string
  noradCatId: number
  categoryLabel: string
  sourceUrl: string
  epoch: string
  analysisAnchorAt: string
  focusAoiId: string
  focusAoiLabel: string
  coordinates: [number, number]
  altitudeKm: number
  coverageRadiusKm: number
  closestDistanceKm: number
  focusCovered: boolean
  truthLabel: string
  statusLabel: string
  track: SatelliteTrackPoint[]
  footprintCoordinates: [number, number][]
}

export interface SatelliteSnapshot {
  providerLabel: string
  sourceUrl: string
  sourceLicense: string
  focusAoiId: string
  focusAoiLabel: string
  retrievedAt: string
  sourceState: SatelliteSourceState
  sourceStateLabel: string
  statusDetail: string
  truthNote: string
  notes: string[]
  satellites: GovernedSatellitePass[]
}

export interface SatelliteLayerDefinition {
  layerId: SatelliteLayerId
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

export interface FetchSatelliteElementsRequest {
  focusAoiId: string
  focusAoiLabel: string
  noradCatIds: number[]
}

export interface GovernedSatelliteElement {
  noradCatId: number
  objectName: string
  objectId?: string
  epoch: string
  meanMotion: number
  eccentricity: number
  inclination: number
  raOfAscNode: number
  argOfPericenter: number
  meanAnomaly: number
  ephemerisType?: number
  classificationType?: string
  elementSetNo?: number
  revAtEpoch?: number
  bstar?: number
  meanMotionDot?: number
  meanMotionDdot?: number
}

export interface FetchSatelliteElementsResult {
  providerLabel: string
  sourceUrl: string
  sourceLicense: string
  focusAoiId: string
  focusAoiLabel: string
  retrievedAt: string
  sourceState: SatelliteSourceState
  statusDetail: string
  elements: GovernedSatelliteElement[]
}

interface GovernedSatelliteCatalogEntry {
  satelliteId: string
  noradCatId: number
  displayName: string
  categoryLabel: string
  strategicUse: string
  sourceUrl: string
  fallbackTle?: [string, string]
  fallbackOmm?: OMMJsonObject
}

const EARTH_RADIUS_KM = 6371
const SATELLITE_ANALYSIS_WINDOW_MINUTES = 12 * 60
const SATELLITE_ANALYSIS_STEP_MINUTES = 12
const SATELLITE_REFINEMENT_STEP_MINUTES = 2
const SATELLITE_TRACK_WINDOW_MINUTES = 24
const SATELLITE_TRACK_STEP_MINUTES = 6
const SATELLITE_MAX_VISIBLE_PASSES = 4

const SATELLITE_AOI_PRESETS: SatelliteAoiPreset[] = [
  {
    aoiId: 'aoi-1',
    label: 'Singapore Strait',
    center: [103.86, 1.24],
  },
  {
    aoiId: 'aoi-2',
    label: 'Dubai Jebel Ali',
    center: [55.05, 24.98],
  },
  {
    aoiId: 'aoi-3',
    label: 'Mumbai Coast',
    center: [72.88, 19.07],
  },
  {
    aoiId: 'aoi-4',
    label: 'Rotterdam Delta',
    center: [4.48, 51.92],
  },
  {
    aoiId: 'aoi-7',
    label: 'Suez Gateway',
    center: [32.31, 30.05],
  },
]

const GOVERNED_SATELLITE_CATALOG: GovernedSatelliteCatalogEntry[] = [
  {
    satelliteId: 'iss-zarya',
    noradCatId: 25544,
    displayName: 'ISS (Zarya)',
    categoryLabel: 'Human Spaceflight',
    strategicUse:
      'A recognizable low-earth-orbit benchmark for timing and line-of-sight reasoning on the globe.',
    sourceUrl: 'https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=JSON',
    fallbackTle: [
      '1 25544U 98067A   19156.50900463  .00003075  00000-0  59442-4 0  9992',
      '2 25544  51.6433  59.2583 0008217  16.4489 347.6017 15.51174618173442',
    ],
  },
  {
    satelliteId: 'helios-2a',
    noradCatId: 28492,
    displayName: 'HELIOS 2A',
    categoryLabel: 'Earth Observation',
    strategicUse:
      'A public earth-observation benchmark for propagated revisit and footprint context around the active AOI.',
    sourceUrl: 'https://celestrak.org/NORAD/elements/gp.php?CATNR=28492&FORMAT=JSON',
    fallbackOmm: {
      OBJECT_NAME: 'HELIOS 2A',
      OBJECT_ID: '2004-049A',
      EPOCH: '2025-03-26T05:19:34.116960',
      MEAN_MOTION: 15.00555103,
      ECCENTRICITY: 0.000583,
      INCLINATION: 98.3164,
      RA_OF_ASC_NODE: 103.8411,
      ARG_OF_PERICENTER: 20.5667,
      MEAN_ANOMALY: 339.5789,
      EPHEMERIS_TYPE: 0 as const,
      CLASSIFICATION_TYPE: 'U' as const,
      NORAD_CAT_ID: 28492,
      ELEMENT_SET_NO: 999,
      REV_AT_EPOCH: 8655,
      BSTAR: 0.00048021,
      MEAN_MOTION_DOT: 0.00005995,
      MEAN_MOTION_DDOT: 0,
    },
  },
]

export const SATELLITE_LAYER_DEFINITIONS: SatelliteLayerDefinition[] = [
  {
    layerId: 'satellite-propagated-positions',
    title: 'Propagated Satellite Positions',
    source: 'Governed orbital-element feed',
    sourceUrl: 'https://celestrak.org/NORAD/documentation/gp-data-formats.php',
    license: 'public modeled',
    cadence: 'modeled from orbital elements',
    confidenceText: 'Propagated pass opportunities for the focused AOI.',
    uncertaintyText:
      'Modeled output only. These are propagated from orbital elements and must not be treated as direct live telemetry.',
    coverageText:
      'Focused AOI pass opportunities only; this packet ships a limited benchmark subset rather than full constellation coverage.',
    sensitivityClass: 'PUBLIC',
  },
  {
    layerId: 'satellite-ground-tracks',
    title: 'Orbit Ground Tracks',
    source: 'Governed orbital-element feed',
    sourceUrl: 'https://celestrak.org/NORAD/documentation/gp-data-formats.php',
    license: 'public modeled',
    cadence: 'modeled from orbital elements',
    confidenceText: 'Short propagated orbit corridors around the selected AOI pass window.',
    uncertaintyText:
      'Track geometry is a modeled projection around the chosen coverage window, not a record of observed telemetry.',
    coverageText:
      'Limited subset and short horizon only to keep the map legible and strategically useful.',
    sensitivityClass: 'PUBLIC',
  },
  {
    layerId: 'satellite-coverage-footprints',
    title: 'Coverage Footprints',
    source: 'Governed orbital-element feed',
    sourceUrl: 'https://celestrak.org/NORAD/documentation/gp-data-formats.php',
    license: 'public modeled',
    cadence: 'modeled from orbital elements',
    confidenceText: 'Approximate footprint envelopes for the chosen pass windows.',
    uncertaintyText:
      'Coverage footprints are approximate horizon-based envelopes and should be read as strategic context, not a sensor guarantee.',
    coverageText:
      'Focused AOI overlap only; this layer is designed for compare and scenario context, not full global surveillance.',
    sensitivityClass: 'PUBLIC',
  },
]

const sourceStateLabel = (state: SatelliteSourceState): string =>
  state === 'live' ? 'Live element set' : 'Cached benchmark'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const round = (value: number, precision = 4): number =>
  Number(value.toFixed(precision))

const degreesToRadians = (value: number): number => (value * Math.PI) / 180

const radiansToDegrees = (value: number): number => (value * 180) / Math.PI

const normalizeLongitude = (longitude: number): number => {
  let next = longitude
  while (next > 180) {
    next -= 360
  }
  while (next < -180) {
    next += 360
  }
  return next
}

const haversineKm = (left: [number, number], right: [number, number]): number => {
  const leftLat = degreesToRadians(left[1])
  const rightLat = degreesToRadians(right[1])
  const deltaLat = degreesToRadians(right[1] - left[1])
  const deltaLon = degreesToRadians(right[0] - left[0])
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(leftLat) * Math.cos(rightLat) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2)
  return 2 * EARTH_RADIUS_KM * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const coverageRadiusKm = (altitudeKm: number): number => {
  const safeAltitudeKm = Math.max(0, altitudeKm)
  const centralAngle = Math.acos(EARTH_RADIUS_KM / (EARTH_RADIUS_KM + safeAltitudeKm))
  return Math.min(EARTH_RADIUS_KM * centralAngle, 2600)
}

const destinationPoint = (
  center: [number, number],
  bearingDeg: number,
  distanceKm: number,
): [number, number] => {
  const angularDistance = distanceKm / EARTH_RADIUS_KM
  const bearing = degreesToRadians(bearingDeg)
  const latitude = degreesToRadians(center[1])
  const longitude = degreesToRadians(center[0])
  const destinationLatitude = Math.asin(
    Math.sin(latitude) * Math.cos(angularDistance) +
      Math.cos(latitude) * Math.sin(angularDistance) * Math.cos(bearing),
  )
  const destinationLongitude =
    longitude +
    Math.atan2(
      Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(latitude),
      Math.cos(angularDistance) - Math.sin(latitude) * Math.sin(destinationLatitude),
    )
  return [round(normalizeLongitude(radiansToDegrees(destinationLongitude))), round(radiansToDegrees(destinationLatitude))]
}

const buildCoverageFootprint = (
  center: [number, number],
  radiusKm: number,
): [number, number][] => {
  const points: [number, number][] = []
  for (let index = 0; index <= 24; index += 1) {
    points.push(destinationPoint(center, (360 / 24) * index, radiusKm))
  }
  return points
}

const parseEpoch = (epoch: string): Date => {
  const normalized = epoch.endsWith('Z') ? epoch : `${epoch}Z`
  const parsed = new Date(normalized)
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed
}

const buildSatrecFromCatalogEntry = (
  entry: GovernedSatelliteCatalogEntry,
  liveElement?: GovernedSatelliteElement,
): { satrec: SatRec; epoch: Date } | null => {
  if (liveElement) {
    const omm: OMMJsonObject = {
      OBJECT_NAME: liveElement.objectName,
      OBJECT_ID: liveElement.objectId ?? `${liveElement.noradCatId}`,
      EPOCH: liveElement.epoch,
      MEAN_MOTION: liveElement.meanMotion,
      ECCENTRICITY: liveElement.eccentricity,
      INCLINATION: liveElement.inclination,
      RA_OF_ASC_NODE: liveElement.raOfAscNode,
      ARG_OF_PERICENTER: liveElement.argOfPericenter,
      MEAN_ANOMALY: liveElement.meanAnomaly,
      EPHEMERIS_TYPE: 0,
      CLASSIFICATION_TYPE:
        liveElement.classificationType === 'C' ? 'C' : 'U',
      NORAD_CAT_ID: liveElement.noradCatId,
      ELEMENT_SET_NO: liveElement.elementSetNo ?? 1,
      REV_AT_EPOCH: liveElement.revAtEpoch ?? 1,
      BSTAR: liveElement.bstar ?? 0,
      MEAN_MOTION_DOT: liveElement.meanMotionDot ?? 0,
      MEAN_MOTION_DDOT: liveElement.meanMotionDdot ?? 0,
    }
    const satrec = json2satrec(omm)
    return { satrec, epoch: parseEpoch(liveElement.epoch) }
  }

  if (entry.fallbackOmm) {
    return {
      satrec: json2satrec(entry.fallbackOmm),
      epoch: parseEpoch(entry.fallbackOmm.EPOCH),
    }
  }

  if (entry.fallbackTle) {
    return {
      satrec: twoline2satrec(entry.fallbackTle[0], entry.fallbackTle[1]),
      epoch: parseEpoch('2019-06-05T12:12:58.000Z'),
    }
  }

  return null
}

const propagateAt = (
  satrec: SatRec,
  timestamp: Date,
): { coordinates: [number, number]; altitudeKm: number } | null => {
  const positionAndVelocity = propagate(satrec, timestamp)
  if (!positionAndVelocity || !positionAndVelocity.position) {
    return null
  }

  const position = positionAndVelocity.position
  const gmst = gstime(timestamp)
  const geodetic = eciToGeodetic(position, gmst)
  return {
    coordinates: [round(degreesLong(geodetic.longitude)), round(degreesLat(geodetic.latitude))],
    altitudeKm: round(geodetic.height, 2),
  }
}

const buildTimeWindow = (
  anchor: Date,
  startOffsetMinutes: number,
  endOffsetMinutes: number,
  stepMinutes: number,
): Date[] => {
  const timestamps: Date[] = []
  for (let offset = startOffsetMinutes; offset <= endOffsetMinutes; offset += stepMinutes) {
    timestamps.push(new Date(anchor.getTime() + offset * 60_000))
  }
  return timestamps
}

const derivePassAnchor = ({
  focusCenter,
  referenceTime,
  satrec,
}: {
  focusCenter: [number, number]
  referenceTime: Date
  satrec: SatRec
}): {
  anchorTime: Date
  coordinates: [number, number]
  altitudeKm: number
  closestDistanceKm: number
} | null => {
  let best:
    | {
        anchorTime: Date
        coordinates: [number, number]
        altitudeKm: number
        closestDistanceKm: number
      }
    | null = null

  for (const timestamp of buildTimeWindow(
    referenceTime,
    0,
    SATELLITE_ANALYSIS_WINDOW_MINUTES,
    SATELLITE_ANALYSIS_STEP_MINUTES,
  )) {
    const propagated = propagateAt(satrec, timestamp)
    if (!propagated) {
      continue
    }
    const distanceKm = haversineKm(propagated.coordinates, focusCenter)
    if (!best || distanceKm < best.closestDistanceKm) {
      best = {
        anchorTime: timestamp,
        coordinates: propagated.coordinates,
        altitudeKm: propagated.altitudeKm,
        closestDistanceKm: distanceKm,
      }
    }
  }

  if (!best) {
    return null
  }

  let refined = best
  for (const timestamp of buildTimeWindow(
    best.anchorTime,
    -SATELLITE_ANALYSIS_STEP_MINUTES,
    SATELLITE_ANALYSIS_STEP_MINUTES,
    SATELLITE_REFINEMENT_STEP_MINUTES,
  )) {
    const propagated = propagateAt(satrec, timestamp)
    if (!propagated) {
      continue
    }
    const distanceKm = haversineKm(propagated.coordinates, focusCenter)
    if (distanceKm < refined.closestDistanceKm) {
      refined = {
        anchorTime: timestamp,
        coordinates: propagated.coordinates,
        altitudeKm: propagated.altitudeKm,
        closestDistanceKm: distanceKm,
      }
    }
  }

  return refined
}

const buildTrack = (satrec: SatRec, anchorTime: Date): SatelliteTrackPoint[] =>
  buildTimeWindow(
    anchorTime,
    -SATELLITE_TRACK_WINDOW_MINUTES,
    SATELLITE_TRACK_WINDOW_MINUTES,
    SATELLITE_TRACK_STEP_MINUTES,
  )
    .map((timestamp) => {
      const propagated = propagateAt(satrec, timestamp)
      if (!propagated) {
        return null
      }
      return {
        coordinates: propagated.coordinates,
        altitudeKm: propagated.altitudeKm,
        recordedAt: timestamp.toISOString(),
      }
    })
    .filter((entry): entry is SatelliteTrackPoint => entry !== null)

const buildPassRecord = ({
  entry,
  focusPreset,
  liveElement,
  sourceState,
}: {
  entry: GovernedSatelliteCatalogEntry
  focusPreset: SatelliteAoiPreset
  liveElement?: GovernedSatelliteElement
  sourceState: SatelliteSourceState
}): GovernedSatellitePass | null => {
  const satrecState = buildSatrecFromCatalogEntry(entry, liveElement)
  if (!satrecState) {
    return null
  }

  const anchor = derivePassAnchor({
    focusCenter: focusPreset.center,
    referenceTime: sourceState === 'live' ? new Date() : satrecState.epoch,
    satrec: satrecState.satrec,
  })
  if (!anchor) {
    return null
  }

  const track = buildTrack(satrecState.satrec, anchor.anchorTime)
  const radiusKm = round(coverageRadiusKm(anchor.altitudeKm), 0)
  const focusCovered = anchor.closestDistanceKm <= radiusKm
  const statusLabel = focusCovered
    ? `Propagated coverage overlaps ${focusPreset.label}.`
    : `Nearest propagated approach is ${Math.round(anchor.closestDistanceKm)} km from ${focusPreset.label}.`

  return {
    satelliteId: entry.satelliteId,
    displayName: liveElement?.objectName ?? entry.displayName,
    noradCatId: entry.noradCatId,
    categoryLabel: entry.categoryLabel,
    sourceUrl: entry.sourceUrl,
    epoch: (liveElement?.epoch ?? satrecState.epoch.toISOString()),
    analysisAnchorAt: anchor.anchorTime.toISOString(),
    focusAoiId: focusPreset.aoiId,
    focusAoiLabel: focusPreset.label,
    coordinates: anchor.coordinates,
    altitudeKm: anchor.altitudeKm,
    coverageRadiusKm: radiusKm,
    closestDistanceKm: round(anchor.closestDistanceKm, 1),
    focusCovered,
    truthLabel:
      sourceState === 'live'
        ? 'Propagated from a governed orbital-element refresh. This is modeled output, not direct live telemetry.'
        : 'Propagated from a cached benchmark orbital-element set. This is modeled output and not a live orbital picture.',
    statusLabel,
    track,
    footprintCoordinates: buildCoverageFootprint(anchor.coordinates, radiusKm),
  }
}

const buildSnapshotFromCatalog = ({
  focusAoiId,
  providerLabel,
  retrievedAt,
  sourceState,
  statusDetail,
  liveElements = [],
}: {
  focusAoiId: string
  providerLabel: string
  retrievedAt: string
  sourceState: SatelliteSourceState
  statusDetail: string
  liveElements?: GovernedSatelliteElement[]
}): SatelliteSnapshot => {
  const focusPreset = resolveSatelliteAoiPreset(focusAoiId)
  const liveElementsById = new Map(liveElements.map((entry) => [entry.noradCatId, entry]))
  const satellites = GOVERNED_SATELLITE_CATALOG
    .map((entry) =>
      buildPassRecord({
        entry,
        focusPreset,
        liveElement: liveElementsById.get(entry.noradCatId),
        sourceState,
      }),
    )
    .filter((entry): entry is GovernedSatellitePass => entry !== null)
    .sort((left, right) => {
      if (left.focusCovered !== right.focusCovered) {
        return left.focusCovered ? -1 : 1
      }
      return left.closestDistanceKm - right.closestDistanceKm
    })
    .slice(0, SATELLITE_MAX_VISIBLE_PASSES)

  return {
    providerLabel,
    sourceUrl: 'https://celestrak.org/NORAD/documentation/gp-data-formats.php',
    sourceLicense: 'public modeled',
    focusAoiId: focusPreset.aoiId,
    focusAoiLabel: focusPreset.label,
    retrievedAt,
    sourceState,
    sourceStateLabel: sourceStateLabel(sourceState),
    statusDetail,
    truthNote:
      sourceState === 'live'
        ? 'Satellite positions, tracks, and footprints are propagated from governed orbital elements. Treat them as modeled output, not direct sensor telemetry.'
        : 'Cached benchmark orbital elements keep the family usable offline. Treat this fallback as modeled output, not direct live telemetry or a current live orbital picture.',
    notes: [
      satellites.some((entry) => entry.focusCovered)
        ? 'The focused AOI intersects at least one propagated footprint in the current modeled window.'
        : 'No propagated footprint fully covers the focused AOI in the current modeled window; nearest approaches are shown instead.',
      'This family is intentionally limited to a small governed subset so the workbench stays map-first and legible.',
    ],
    satellites,
  }
}

const normalizeSatellitePass = (value: unknown): GovernedSatellitePass | null => {
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

  const footprintCoordinates = Array.isArray(value.footprintCoordinates)
    ? value.footprintCoordinates
        .map((entry) =>
          Array.isArray(entry)
            ? entry.filter(
                (coordinate): coordinate is number =>
                  typeof coordinate === 'number' && Number.isFinite(coordinate),
              )
            : [],
        )
        .filter((entry): entry is [number, number] => entry.length === 2)
    : []

  const track = Array.isArray(value.track)
    ? value.track
        .map((entry) => {
          if (!isRecord(entry)) {
            return null
          }
          const trackCoordinates = Array.isArray(entry.coordinates)
            ? entry.coordinates.filter(
                (coordinate): coordinate is number =>
                  typeof coordinate === 'number' && Number.isFinite(coordinate),
              )
            : []
          if (trackCoordinates.length !== 2) {
            return null
          }
          return {
            coordinates: [trackCoordinates[0], trackCoordinates[1]] as [number, number],
            altitudeKm:
              typeof entry.altitudeKm === 'number' && Number.isFinite(entry.altitudeKm)
                ? entry.altitudeKm
                : 0,
            recordedAt:
              typeof entry.recordedAt === 'string'
                ? entry.recordedAt
                : new Date().toISOString(),
          }
        })
        .filter((entry): entry is SatelliteTrackPoint => entry !== null)
    : []

  return {
    satelliteId: typeof value.satelliteId === 'string' ? value.satelliteId : 'unknown-satellite',
    displayName: typeof value.displayName === 'string' ? value.displayName : 'Unknown satellite',
    noradCatId:
      typeof value.noradCatId === 'number' && Number.isFinite(value.noradCatId)
        ? value.noradCatId
        : 0,
    categoryLabel: typeof value.categoryLabel === 'string' ? value.categoryLabel : 'Satellite',
    sourceUrl:
      typeof value.sourceUrl === 'string'
        ? value.sourceUrl
        : 'https://celestrak.org/NORAD/documentation/gp-data-formats.php',
    epoch: typeof value.epoch === 'string' ? value.epoch : new Date().toISOString(),
    analysisAnchorAt:
      typeof value.analysisAnchorAt === 'string'
        ? value.analysisAnchorAt
        : new Date().toISOString(),
    focusAoiId: typeof value.focusAoiId === 'string' ? value.focusAoiId : 'aoi-1',
    focusAoiLabel:
      typeof value.focusAoiLabel === 'string'
        ? value.focusAoiLabel
        : resolveSatelliteAoiPreset('aoi-1').label,
    coordinates: [coordinates[0], coordinates[1]],
    altitudeKm:
      typeof value.altitudeKm === 'number' && Number.isFinite(value.altitudeKm)
        ? value.altitudeKm
        : 0,
    coverageRadiusKm:
      typeof value.coverageRadiusKm === 'number' && Number.isFinite(value.coverageRadiusKm)
        ? value.coverageRadiusKm
        : 0,
    closestDistanceKm:
      typeof value.closestDistanceKm === 'number' && Number.isFinite(value.closestDistanceKm)
        ? value.closestDistanceKm
        : 0,
    focusCovered: Boolean(value.focusCovered),
    truthLabel:
      typeof value.truthLabel === 'string'
        ? value.truthLabel
        : 'Propagated from orbital elements; modeled output only.',
    statusLabel:
      typeof value.statusLabel === 'string'
        ? value.statusLabel
        : 'Propagated benchmark pass.',
    track,
    footprintCoordinates,
  }
}

export const resolveSatelliteAoiPreset = (aoiId: string): SatelliteAoiPreset =>
  SATELLITE_AOI_PRESETS.find((preset) => preset.aoiId === aoiId) ?? SATELLITE_AOI_PRESETS[0]

export const createPackagedSatelliteSnapshot = (focusAoiId: string): SatelliteSnapshot =>
  buildSnapshotFromCatalog({
    focusAoiId,
    providerLabel: 'Governed packaged orbital benchmark',
    retrievedAt: '2026-03-11T00:00:00.000Z',
    sourceState: 'cached',
    statusDetail:
      'Cached benchmark orbital elements are active because the governed CelesTrak refresh is unavailable or not requested in this runtime.',
  })

export const buildSatelliteSnapshotFromFetch = (
  result: FetchSatelliteElementsResult,
): SatelliteSnapshot =>
  buildSnapshotFromCatalog({
    focusAoiId: result.focusAoiId,
    providerLabel: result.providerLabel,
    retrievedAt: result.retrievedAt,
    sourceState: result.sourceState,
    statusDetail: result.statusDetail,
    liveElements: result.elements,
  })

export const buildFallbackSatelliteSnapshot = ({
  focusAoiId,
  previousSnapshot,
  reason,
}: {
  focusAoiId: string
  previousSnapshot?: SatelliteSnapshot | null
  reason: string
}): SatelliteSnapshot => {
  const previousForAoi =
    previousSnapshot && previousSnapshot.focusAoiId === resolveSatelliteAoiPreset(focusAoiId).aoiId
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

  const packaged = createPackagedSatelliteSnapshot(focusAoiId)
  return {
    ...packaged,
    statusDetail: reason,
    notes: [...packaged.notes, reason],
  }
}

export const normalizeSatelliteSnapshot = (value: unknown): SatelliteSnapshot | null => {
  if (!isRecord(value)) {
    return null
  }

  const sourceState = value.sourceState === 'live' ? 'live' : 'cached'
  const providedTruthNote = typeof value.truthNote === 'string' ? value.truthNote : ''
  const canonicalTruthNote =
    sourceState === 'live'
      ? 'Satellite positions, tracks, and footprints are propagated from governed orbital elements. Treat them as modeled output, not direct sensor telemetry.'
      : 'Cached benchmark orbital elements keep the family usable offline. Treat this fallback as modeled output, not direct live telemetry or a current live orbital picture.'
  const truthNote =
    providedTruthNote.toLowerCase().includes('modeled output') &&
    providedTruthNote.toLowerCase().includes('not direct')
      ? providedTruthNote
      : canonicalTruthNote
  return {
    providerLabel:
      typeof value.providerLabel === 'string'
        ? value.providerLabel
        : 'Governed packaged orbital benchmark',
    sourceUrl:
      typeof value.sourceUrl === 'string'
        ? value.sourceUrl
        : 'https://celestrak.org/NORAD/documentation/gp-data-formats.php',
    sourceLicense: typeof value.sourceLicense === 'string' ? value.sourceLicense : 'public modeled',
    focusAoiId: typeof value.focusAoiId === 'string' ? value.focusAoiId : 'aoi-1',
    focusAoiLabel:
      typeof value.focusAoiLabel === 'string'
        ? value.focusAoiLabel
        : resolveSatelliteAoiPreset('aoi-1').label,
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
        : 'Recorder snapshot restored; refresh for a governed orbital-element update.',
    truthNote,
    notes: Array.isArray(value.notes)
      ? value.notes.filter((entry): entry is string => typeof entry === 'string')
      : [],
    satellites: Array.isArray(value.satellites)
      ? value.satellites
          .map((entry) => normalizeSatellitePass(entry))
          .filter((entry): entry is GovernedSatellitePass => entry !== null)
      : [],
  }
}

export const getGovernedSatelliteCatalogIds = (): number[] =>
  GOVERNED_SATELLITE_CATALOG.map((entry) => entry.noradCatId)

export const SATELLITE_LAYER_IDS = SATELLITE_LAYER_DEFINITIONS.map(
  (definition) => definition.layerId,
)
