import {
  forwardRef,
  useEffect,
  useEffectEvent,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { flushSync } from 'react-dom'
import maplibregl from 'maplibre-gl'
import type {
  GeoJSONSource,
  GeoJSONSourceSpecification,
  Map as MapLibreMap,
  MapGeoJSONFeature,
  MapOptions,
  StyleSpecification,
} from 'maplibre-gl'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import 'maplibre-gl/dist/maplibre-gl.css'
import './MapRuntimeSurface.css'
import type { SensitivityMarking, WorkspaceUiSettings } from '../../../contracts/i0'
import type { GlobalEventTimelineEntry } from '../../i7/eventTimeline'
import {
  runtimeAoiView,
  runtimeToneColor,
  type MapRuntimeScene,
  type RuntimeTone,
} from '../runtime/mapRuntimeScene'
import {
  type MapRuntimeTelemetry,
  type SurfaceMode,
} from '../runtime/mapRuntimeTelemetry'
import {
  getMapBasemapStyle,
  MAP_BASEMAP_STYLES,
  type MapBasemapStyleId,
} from '../runtime/basemaps'
import {
  buildMapRuntimeExportCapture,
  type MapRuntimeExportCapture,
} from '../runtime/mapRuntimeExport'
import {
  focusCesiumRuntime,
  initializeCesiumRuntime,
  preloadCesiumRuntime,
  syncCesiumRuntimeScene,
  type CesiumRuntimeHandle,
} from '../runtime/cesiumRuntime'
import type { UiMode } from '../modes'

interface MapRuntimeSurfaceProps {
  scene: MapRuntimeScene
  workspaceSettings: WorkspaceUiSettings
  basemapStyleId: MapBasemapStyleId
  mode: UiMode
  marking: SensitivityMarking
  visibleLayerCount: number
  degradedBudgetCount: number
  offline: boolean
  exportBusy?: boolean
  exportBlockedReason?: string
  latestExportArtifactId?: string
  onBasemapStyleChange?: (basemapStyleId: MapBasemapStyleId) => void
  onTelemetryChange?: (telemetry: MapRuntimeTelemetry) => void
  onRequestExport?: () => void | Promise<void>
  onSurfaceModeFeedback?: (surfaceMode: SurfaceMode, measuredMs: number) => void
  selectionCommand?: MapRuntimeSelectionCommand
}

export interface MapRuntimeSurfaceHandle {
  capture4kMapExport: (options: {
    marking: SensitivityMarking
    bundleId?: string
    visibleLayerCount: number
  }) => Promise<MapRuntimeExportCapture>
  getSurfaceModeFeedbackSnapshot: () => {
    measuredMs: number
    sequence: number
    surfaceMode: SurfaceMode
  }
  measurePlanarPanZoomFrame: (options?: {
    animationDurationMs?: number
    panOffsetPx?: [number, number]
    timeoutMs?: number
    zoomDelta?: number
  }) => Promise<{
    averageFrameMs: number
    durationMs: number
    maxFrameMs: number
    sampleCount: number
  }>
  requestSurfaceMode: (nextMode: SurfaceMode) => void
  switchSurfaceMode: (nextMode: SurfaceMode) => Promise<number>
}

export interface MapRuntimeSelectionCommand {
  requestId: number
  focusAoiId?: string
  inspectId?: string
  openContext?: boolean
}

const GRATICULE: Exclude<GeoJSONSourceSpecification['data'], string> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [24, -10],
          [24, 42],
        ],
      },
      properties: {},
    },
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [60, -10],
          [60, 42],
        ],
      },
      properties: {},
    },
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [20, 10],
          [110, 10],
        ],
      },
      properties: {},
    },
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [20, 30],
          [110, 30],
        ],
      },
      properties: {},
    },
  ],
}

type BasemapState = 'online-live' | 'fallback-offline' | 'fallback-load-failure' | 'fallback-runtime'

const EVENT_SIGNAL_CATEGORIES = ['deviation', 'osint'] as const

const toneClass = (tone: RuntimeTone): string => `map-runtime-chip tone-${tone}`

const supportsInteractiveMap = (): boolean => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false
  }
  if (/jsdom/i.test(window.navigator.userAgent)) {
    return false
  }
  if (typeof window.ResizeObserver === 'undefined') {
    return false
  }
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl'),
    )
  } catch {
    return false
  }
}

const createFallbackStyle = (): StyleSpecification => ({
  version: 8,
  sources: {
    'i1-graticule': {
      type: 'geojson',
      data: GRATICULE,
    },
  },
  layers: [
    {
      id: 'i1-background',
      type: 'background',
      paint: {
        'background-color': '#08111a',
      },
    },
    {
      id: 'i1-graticule-lines',
      type: 'line',
      source: 'i1-graticule',
      paint: {
        'line-color': '#31465d',
        'line-width': 1,
        'line-opacity': 0.62,
      },
    },
  ],
})

const syncGeoJsonSource = (
  map: MapLibreMap,
  sourceId: string,
  data: GeoJSONSourceSpecification['data'],
) => {
  const source = map.getSource(sourceId) as GeoJSONSource | undefined
  if (source) {
    source.setData(data as Parameters<GeoJSONSource['setData']>[0])
    return
  }
  map.addSource(sourceId, {
    type: 'geojson',
    data,
  })
}

const syncClusteredGeoJsonSource = (
  map: MapLibreMap,
  sourceId: string,
  data: GeoJSONSourceSpecification['data'],
) => {
  const source = map.getSource(sourceId) as GeoJSONSource | undefined
  if (source) {
    source.setData(data as Parameters<GeoJSONSource['setData']>[0])
    return
  }
  map.addSource(sourceId, {
    type: 'geojson',
    data,
    cluster: true,
    clusterMaxZoom: 7,
    clusterRadius: 54,
  })
}

const ensureRuntimeLayers = (map: MapLibreMap) => {
  if (!map.getLayer('i1-surface-fill')) {
    map.addLayer({
      id: 'i1-surface-fill',
      type: 'fill',
      source: 'i1-surfaces',
      paint: {
        'fill-color': ['get', 'fillColor'],
        'fill-opacity': ['get', 'fillOpacity'],
      },
    })
  }
  if (!map.getLayer('i1-surface-outline')) {
    map.addLayer({
      id: 'i1-surface-outline',
      type: 'line',
      source: 'i1-surfaces',
      paint: {
        'line-color': ['get', 'lineColor'],
        'line-width': ['+', 1.2, ['*', ['get', 'emphasis'], 1.4]],
        'line-opacity': 0.9,
      },
    })
  }
  if (!map.getLayer('i1-corridor-glow')) {
    map.addLayer({
      id: 'i1-corridor-glow',
      type: 'line',
      source: 'i1-corridors',
      paint: {
        'line-color': ['get', 'color'],
        'line-width': ['+', ['get', 'width'], 6],
        'line-opacity': 0.14,
        'line-blur': 2,
      },
    })
  }
  if (!map.getLayer('i1-corridor-core')) {
    map.addLayer({
      id: 'i1-corridor-core',
      type: 'line',
      source: 'i1-corridors',
      paint: {
        'line-color': ['get', 'color'],
        'line-width': ['get', 'width'],
        'line-opacity': 0.88,
        'line-dasharray': ['literal', [1.2, 0.8]],
      },
    })
  }
  if (!map.getLayer('i1-signal-halo')) {
    map.addLayer({
      id: 'i1-signal-halo',
      type: 'circle',
      source: 'i1-signals',
      filter: ['!', ['in', ['get', 'category'], ['literal', [...EVENT_SIGNAL_CATEGORIES]]]],
      paint: {
        'circle-color': [
          'match',
          ['get', 'tone'],
          'evidence',
          '#7be8ff',
          'context',
          '#87f5b5',
          'model',
          '#ffbe78',
          'ai',
          '#ff8ed4',
          'alert',
          '#ff6e80',
          '#b4c7ff',
        ],
        'circle-radius': ['get', 'haloRadius'],
        'circle-opacity': ['get', 'haloOpacity'],
        'circle-blur': 0.8,
      },
    })
  }
  if (!map.getLayer('i1-signal-core')) {
    map.addLayer({
      id: 'i1-signal-core',
      type: 'circle',
      source: 'i1-signals',
      filter: ['!', ['in', ['get', 'category'], ['literal', [...EVENT_SIGNAL_CATEGORIES]]]],
      paint: {
        'circle-color': [
          'match',
          ['get', 'tone'],
          'evidence',
          '#7be8ff',
          'context',
          '#87f5b5',
          'model',
          '#ffbe78',
          'ai',
          '#ff8ed4',
          'alert',
          '#ff6e80',
          '#b4c7ff',
        ],
        'circle-radius': ['get', 'radius'],
        'circle-stroke-width': 1.5,
        'circle-stroke-color': '#09121b',
        'circle-opacity': 0.96,
      },
    })
  }
  if (!map.getLayer('i1-event-clusters')) {
    map.addLayer({
      id: 'i1-event-clusters',
      type: 'circle',
      source: 'i1-event-markers',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': '#193147',
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          16,
          3,
          20,
          6,
          24,
        ],
        'circle-stroke-color': '#9bc7ff',
        'circle-stroke-width': 1.5,
        'circle-opacity': 0.92,
      },
    })
  }
  if (!map.getLayer('i1-event-cluster-count')) {
    map.addLayer({
      id: 'i1-event-cluster-count',
      type: 'symbol',
      source: 'i1-event-markers',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': ['get', 'point_count_abbreviated'],
        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
        'text-size': 11,
      },
      paint: {
        'text-color': '#f5fbff',
      },
    })
  }
  if (!map.getLayer('i1-event-marker-halo')) {
    map.addLayer({
      id: 'i1-event-marker-halo',
      type: 'circle',
      source: 'i1-event-markers',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': [
          'match',
          ['get', 'tone'],
          'context',
          '#87f5b5',
          '#ff6e80',
        ],
        'circle-radius': ['get', 'haloRadius'],
        'circle-opacity': ['get', 'haloOpacity'],
        'circle-blur': 0.7,
      },
    })
  }
  if (!map.getLayer('i1-event-marker-core')) {
    map.addLayer({
      id: 'i1-event-marker-core',
      type: 'circle',
      source: 'i1-event-markers',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': [
          'match',
          ['get', 'tone'],
          'context',
          '#87f5b5',
          '#ff6e80',
        ],
        'circle-radius': ['get', 'radius'],
        'circle-stroke-width': 1.6,
        'circle-stroke-color': '#09121b',
        'circle-opacity': 0.98,
      },
    })
  }
}

const syncRuntimeScene = (map: MapLibreMap, scene: MapRuntimeScene) => {
  syncGeoJsonSource(map, 'i1-surfaces', scene.surfaces)
  syncGeoJsonSource(map, 'i1-corridors', scene.corridors)
  syncGeoJsonSource(map, 'i1-signals', scene.signals)
  syncClusteredGeoJsonSource(map, 'i1-event-markers', scene.eventMarkers)
  ensureRuntimeLayers(map)
}

const applyFog = (
  map: MapLibreMap,
  fog: Record<string, unknown> | null,
) => {
  const fogCapableMap = map as MapLibreMap & {
    setFog?: (value: Record<string, unknown> | null) => void
  }
  fogCapableMap.setFog?.(fog)
}

const selectFeatureId = (feature?: MapGeoJSONFeature): string | undefined => {
  const candidate = feature?.properties?.featureId
  return typeof candidate === 'string' ? candidate : undefined
}

const selectAoiId = (feature?: MapGeoJSONFeature): string | undefined => {
  const candidate = feature?.properties?.aoiId
  return typeof candidate === 'string' ? candidate : undefined
}

const selectNumericProperty = (
  feature: MapGeoJSONFeature | undefined,
  propertyName: string,
): number | undefined => {
  const value = feature?.properties?.[propertyName]
  return typeof value === 'number' ? value : undefined
}

interface RuntimeHelperCard {
  id: string
  badge: string
  tone: RuntimeTone
  label: string
  detail: string
  meta: string
  contextLine?: string
}

const formatRuntimeCategory = (value: string): string =>
  value
    .split('_')
    .filter(Boolean)
    .map((segment) => segment[0].toUpperCase() + segment.slice(1))
    .join(' ')

export const MapRuntimeSurface = forwardRef<MapRuntimeSurfaceHandle, MapRuntimeSurfaceProps>(function MapRuntimeSurface({
  scene,
  workspaceSettings,
  basemapStyleId,
  mode,
  marking,
  visibleLayerCount,
  degradedBudgetCount,
  offline,
  exportBusy = false,
  exportBlockedReason = '',
  latestExportArtifactId = '',
  onBasemapStyleChange,
  onTelemetryChange,
  onRequestExport,
  onSurfaceModeFeedback,
  selectionCommand,
}, ref) {
  const planarContainerRef = useRef<HTMLDivElement | null>(null)
  const orbitalContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const cesiumRef = useRef<CesiumRuntimeHandle | null>(null)
  const mapLoadingRef = useRef<boolean>(false)
  const cesiumLoadingRef = useRef<boolean>(false)
  const interactiveSupportedRef = useRef<boolean>(supportsInteractiveMap())
  const offlineRef = useRef<boolean>(offline)
  const sceneRef = useRef<MapRuntimeScene>(scene)
  const focusAoiRef = useRef<string>(scene.focusAoiId)
  const lastPlanarViewportRef = useRef<{
    focusAoiId: string
    surfaceMode: SurfaceMode
  } | null>(null)
  const surfaceModeRef = useRef<SurfaceMode>('planar')
  const surfaceModeFeedbackStartRef = useRef<number | null>(null)
  const surfaceModeFeedbackSnapshotRef = useRef({
    measuredMs: 0,
    sequence: 0,
    surfaceMode: 'planar' as SurfaceMode,
  })
  const pendingSurfaceModeSwitchRef = useRef<{
    mode: SurfaceMode
    resolve: (measuredMs: number) => void
    reject: (error: Error) => void
    timeoutHandle: number
  } | null>(null)
  const [surfaceMode, setSurfaceMode] = useState<SurfaceMode>('planar')
  const [selectedInspectId, setSelectedInspectId] = useState<string>(scene.inspectCards[0]?.id ?? '')
  const [selectedFocusAoiId, setSelectedFocusAoiId] = useState<string>(scene.focusAoiId)
  const [hoveredHelper, setHoveredHelper] = useState<RuntimeHelperCard | null>(null)
  const [contextDrawerOpen, setContextDrawerOpen] = useState<boolean>(
    () => !workspaceSettings.compactChrome,
  )
  const [legendTrayOpen, setLegendTrayOpen] = useState<boolean>(() => !workspaceSettings.compactChrome)
  const [planarReady, setPlanarReady] = useState<boolean>(false)
  const [orbitalReady, setOrbitalReady] = useState<boolean>(false)
  const [mapError, setMapError] = useState<string>('')
  const [basemapState, setBasemapState] = useState<BasemapState>(() => {
    if (!interactiveSupportedRef.current) {
      return 'fallback-runtime'
    }
    return offline ? 'fallback-offline' : 'online-live'
  })

  const onlineBasemapConfirmedRef = useRef<boolean>(false)
  const basemapSourceRef = useRef<'online' | 'fallback'>(
    interactiveSupportedRef.current && !offline ? 'online' : 'fallback',
  )
  const activeBasemapStyleIdRef = useRef<MapBasemapStyleId>(basemapStyleId)
  const basemapLoadTimeoutRef = useRef<number>(0)
  const compactChromeRef = useRef<boolean>(workspaceSettings.compactChrome)

  const signalPropertiesById = useMemo(
    () =>
      new Map(
        [...scene.eventMarkers.features, ...scene.signals.features].map((feature) => [
          feature.properties.featureId,
          feature.properties,
        ]),
      ),
    [scene.eventMarkers.features, scene.signals.features],
  )
  const surfacePropertiesByAoiId = useMemo(
    () =>
      new Map(scene.surfaces.features.map((feature) => [feature.properties.aoiId, feature.properties])),
    [scene.surfaces.features],
  )
  const inspectCardByLabel = useMemo(
    () => new Map(scene.inspectCards.map((card) => [card.label, card])),
    [scene.inspectCards],
  )
  const inspectCountByAoiId = useMemo(() => {
    const counts = new Map<string, number>()
    for (const card of scene.inspectCards) {
      counts.set(card.aoiId, (counts.get(card.aoiId) ?? 0) + 1)
    }
    return counts
  }, [scene.inspectCards])

  const buildFocusHelper = (aoiId: string): RuntimeHelperCard => {
    const focusOption = scene.focusOptions.find((option) => option.aoiId === aoiId) ?? scene.focusOptions[0]
    const surface = surfacePropertiesByAoiId.get(aoiId)
    const inspectCount = inspectCountByAoiId.get(aoiId) ?? 0
    return {
      id: `focus:${aoiId}`,
      badge: 'AOI focus',
      tone: 'support',
      label: focusOption?.label ?? aoiId.toUpperCase(),
      detail: surface?.detail ?? focusOption?.subtitle ?? 'Governed runtime focus area.',
      meta: `${inspectCount} inspect target${inspectCount === 1 ? '' : 's'} ready`,
    }
  }

  const buildInspectHelper = (cardId: string): RuntimeHelperCard | null => {
    const card = scene.inspectCards.find((candidate) => candidate.id === cardId)
    if (!card) {
      return null
    }
    const contextLine = [card.source, card.cadence, card.confidence].filter(Boolean).join(' | ')
    return {
      id: `inspect:${card.id}`,
      badge: formatRuntimeCategory(card.category),
      tone: card.tone,
      label: card.label,
      detail: card.detail,
      meta: card.observedAt ? `AOI ${card.aoiId} | ${card.observedAt}` : `AOI ${card.aoiId}`,
      contextLine,
    }
  }

  const buildLegendHelper = (legendId: string): RuntimeHelperCard | null => {
    const item = scene.legend.find((candidate) => candidate.id === legendId)
    if (!item) {
      return null
    }
    return {
      id: `legend:${item.id}`,
      badge: 'Legend',
      tone: item.tone,
      label: item.label,
      detail: item.detail,
      meta: `${formatRuntimeCategory(item.tone)} signal family`,
    }
  }

  const buildSignalHelper = (featureId: string): RuntimeHelperCard | null => {
    const signal = signalPropertiesById.get(featureId)
    if (!signal) {
      return null
    }
    const contextLine = [signal.source, signal.cadence, signal.confidence].filter(Boolean).join(' | ')
    return {
      id: `signal:${signal.featureId}`,
      badge: formatRuntimeCategory(signal.category),
      tone: signal.tone,
      label: signal.label,
      detail: signal.detail,
      meta: signal.observedAt ? `AOI ${signal.aoiId} | ${signal.observedAt}` : `AOI ${signal.aoiId}`,
      contextLine,
    }
  }

  const buildSurfaceHelper = (aoiId: string): RuntimeHelperCard | null => {
    const surface = surfacePropertiesByAoiId.get(aoiId)
    if (!surface) {
      return null
    }
    return {
      id: `surface:${surface.featureId}`,
      badge: 'Surface',
      tone: 'support',
      label: surface.label,
      detail: surface.detail,
      meta: `AOI ${surface.aoiId}`,
    }
  }

  const buildClusterHelper = (feature?: MapGeoJSONFeature): RuntimeHelperCard | null => {
    const pointCount = selectNumericProperty(feature, 'point_count')
    if (!pointCount) {
      return null
    }
    return {
      id: `cluster:${pointCount}`,
      badge: 'Event cluster',
      tone: 'alert',
      label: `${pointCount} governed event${pointCount === 1 ? '' : 's'}`,
      detail: 'This cluster expands as you zoom in or click it, so the map keeps event density readable without losing AOI linkage.',
      meta: 'Click to zoom into the cluster',
    }
  }

  useEffect(() => {
    offlineRef.current = offline
  }, [offline])

  useEffect(() => {
    if (compactChromeRef.current === workspaceSettings.compactChrome) {
      return
    }
    compactChromeRef.current = workspaceSettings.compactChrome
    setContextDrawerOpen(!workspaceSettings.compactChrome)
    setLegendTrayOpen(!workspaceSettings.compactChrome)
  }, [workspaceSettings.compactChrome])

  const clearBasemapLoadTimeout = useEffectEvent(() => {
    if (basemapLoadTimeoutRef.current) {
      window.clearTimeout(basemapLoadTimeoutRef.current)
      basemapLoadTimeoutRef.current = 0
    }
  })

  const syncPlanarSceneAfterStyleChange = useEffectEvent((map: MapLibreMap) => {
    const applyScene = () => {
      try {
        syncRuntimeScene(map, sceneRef.current)
        setMapError('')
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Map scene sync failed'
        setMapError(message)
      }
    }

    if (map.isStyleLoaded()) {
      applyScene()
      return
    }

    map.once('styledata', applyScene)
  })

  const applyFallbackBasemap = useEffectEvent((
    map: MapLibreMap,
    nextState: Extract<BasemapState, 'fallback-offline' | 'fallback-load-failure' | 'fallback-runtime'>,
    message = '',
  ) => {
    clearBasemapLoadTimeout()
    onlineBasemapConfirmedRef.current = false
    basemapSourceRef.current = 'fallback'
    setBasemapState(nextState)
    if (message) {
      setMapError(message)
    }
    map.setStyle(createFallbackStyle())
    syncPlanarSceneAfterStyleChange(map)
  })

  const applyOnlineBasemap = useEffectEvent((
    map: MapLibreMap,
    nextBasemapStyleId: MapBasemapStyleId,
  ) => {
    clearBasemapLoadTimeout()
    basemapSourceRef.current = 'online'
    activeBasemapStyleIdRef.current = nextBasemapStyleId
    onlineBasemapConfirmedRef.current = false
    setBasemapState('online-live')
    setMapError('')
    map.setStyle(getMapBasemapStyle(nextBasemapStyleId).styleUrl)
    syncPlanarSceneAfterStyleChange(map)
    basemapLoadTimeoutRef.current = window.setTimeout(() => {
      if (!onlineBasemapConfirmedRef.current && mapRef.current === map) {
        applyFallbackBasemap(
          map,
          'fallback-load-failure',
          'Live basemap unavailable; using schematic fallback.',
        )
      }
    }, 6000)
  })

  useEffect(() => {
    if (!interactiveSupportedRef.current) {
      setBasemapState('fallback-runtime')
      return
    }
    if (!mapRef.current || !planarReady || offline) {
      return
    }
    if (
      basemapSourceRef.current === 'online' &&
      activeBasemapStyleIdRef.current === basemapStyleId &&
      basemapState === 'online-live'
    ) {
      return
    }
    applyOnlineBasemap(mapRef.current, basemapStyleId)
  }, [applyOnlineBasemap, basemapState, basemapStyleId, offline, planarReady])

  useEffect(() => {
    sceneRef.current = scene
  }, [scene])

  useEffect(() => {
    focusAoiRef.current = selectedFocusAoiId
  }, [selectedFocusAoiId])

  useEffect(() => {
    surfaceModeRef.current = surfaceMode
  }, [surfaceMode])

  useEffect(() => {
    setSelectedFocusAoiId(scene.focusAoiId)
  }, [scene.focusAoiId])

  useEffect(() => {
    if (!scene.inspectCards.some((card) => card.id === selectedInspectId)) {
      setSelectedInspectId(scene.inspectCards[0]?.id ?? '')
    }
  }, [scene.inspectCards, selectedInspectId])

  useEffect(() => {
    if (!selectionCommand || selectionCommand.requestId <= 0) {
      return
    }

    if (selectionCommand.focusAoiId) {
      setSelectedFocusAoiId(selectionCommand.focusAoiId)
    }

    if (
      selectionCommand.inspectId &&
      scene.inspectCards.some((card) => card.id === selectionCommand.inspectId)
    ) {
      setSelectedInspectId(selectionCommand.inspectId)
    }

    const helper =
      (selectionCommand.inspectId ? buildInspectHelper(selectionCommand.inspectId) : null) ??
      (selectionCommand.focusAoiId ? buildFocusHelper(selectionCommand.focusAoiId) : null)
    setHoveredHelper(helper)

    if (selectionCommand.openContext !== false && workspaceSettings.autoOpenContextualInspector) {
      setContextDrawerOpen(true)
    }
  }, [
    scene.inspectCards,
    selectionCommand,
    workspaceSettings.autoOpenContextualInspector,
  ])

  const onSignalClick = useEffectEvent((featureId?: string) => {
    if (featureId) {
      const signal = signalPropertiesById.get(featureId)
      setSelectedInspectId(featureId)
      if (signal?.aoiId) {
        setSelectedFocusAoiId(signal.aoiId)
      }
      const helper = buildSignalHelper(featureId)
      if (helper) {
        setHoveredHelper(helper)
      }
      if (workspaceSettings.autoOpenContextualInspector) {
        setContextDrawerOpen(true)
      }
    }
  })

  const onSurfaceClick = useEffectEvent((aoiId?: string) => {
    if (aoiId) {
      setSelectedFocusAoiId(aoiId)
      const helper = buildSurfaceHelper(aoiId) ?? buildFocusHelper(aoiId)
      setHoveredHelper(helper)
      if (workspaceSettings.autoOpenContextualInspector) {
        setContextDrawerOpen(true)
      }
    }
  })

  const onSignalHover = useEffectEvent((featureId?: string) => {
    if (!workspaceSettings.hoverHelpers) {
      return
    }
    setHoveredHelper(featureId ? buildSignalHelper(featureId) : null)
  })

  const onSurfaceHover = useEffectEvent((aoiId?: string) => {
    if (!workspaceSettings.hoverHelpers) {
      return
    }
    setHoveredHelper(aoiId ? buildSurfaceHelper(aoiId) ?? buildFocusHelper(aoiId) : null)
  })

  const onClusterHover = useEffectEvent((feature?: MapGeoJSONFeature) => {
    if (!workspaceSettings.hoverHelpers) {
      return
    }
    setHoveredHelper(feature ? buildClusterHelper(feature) : null)
  })

  const requestSurfaceModeChange = useEffectEvent((nextMode: SurfaceMode): void => {
    if (nextMode === surfaceModeRef.current) {
      return
    }
    surfaceModeFeedbackStartRef.current = performance.now()
    flushSync(() => {
      setSurfaceMode(nextMode)
    })
    surfaceModeRef.current = nextMode
  })

  useLayoutEffect(() => {
    if (surfaceModeFeedbackStartRef.current === null) {
      return
    }
    const measuredMs = Math.round(performance.now() - surfaceModeFeedbackStartRef.current)
    surfaceModeFeedbackSnapshotRef.current = {
      measuredMs,
      sequence: surfaceModeFeedbackSnapshotRef.current.sequence + 1,
      surfaceMode,
    }
    onSurfaceModeFeedback?.(surfaceMode, measuredMs)
    if (
      pendingSurfaceModeSwitchRef.current &&
      pendingSurfaceModeSwitchRef.current.mode === surfaceMode
    ) {
      window.clearTimeout(pendingSurfaceModeSwitchRef.current.timeoutHandle)
      pendingSurfaceModeSwitchRef.current.resolve(measuredMs)
      pendingSurfaceModeSwitchRef.current = null
    }
    surfaceModeFeedbackStartRef.current = null
  }, [onSurfaceModeFeedback, surfaceMode])

  useEffect(() => {
    return () => {
      if (pendingSurfaceModeSwitchRef.current) {
        window.clearTimeout(pendingSurfaceModeSwitchRef.current.timeoutHandle)
        pendingSurfaceModeSwitchRef.current.reject(
          new Error('Map runtime surface mode switch was interrupted by unmount.'),
        )
        pendingSurfaceModeSwitchRef.current = null
      }
    }
  }, [])

  useImperativeHandle(
    ref,
    () => ({
      getSurfaceModeFeedbackSnapshot: () => surfaceModeFeedbackSnapshotRef.current,
      requestSurfaceMode: (nextMode) => {
        requestSurfaceModeChange(nextMode)
      },
      capture4kMapExport: async ({ marking: exportMarking, bundleId, visibleLayerCount: exportVisibleLayerCount }) => {
        if (!sceneRef.current.inspectCards.length) {
          throw new Error('Map runtime export requires at least one inspect target.')
        }

        if (surfaceMode === 'orbital') {
          cesiumRef.current?.viewer.scene.requestRender()
        } else {
          mapRef.current?.triggerRepaint()
        }
        await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()))
        await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()))

        const selectedInspectCard =
          sceneRef.current.inspectCards.find((card) => card.id === selectedInspectId) ??
          sceneRef.current.inspectCards[0]
        const sourceCanvas =
          interactiveSupportedRef.current && surfaceMode === 'orbital'
            ? cesiumRef.current?.viewer.canvas ?? null
            : interactiveSupportedRef.current
              ? mapRef.current?.getCanvas() ?? null
              : null

        return buildMapRuntimeExportCapture({
          scene: sceneRef.current,
          mode,
          offline: offlineRef.current,
          marking: exportMarking,
          bundleId,
          focusAoiId: selectedFocusAoiId,
          sourceSurfaceMode: surfaceMode,
          sourceRuntimeEngine: interactiveSupportedRef.current
            ? surfaceMode === 'orbital'
              ? 'cesium'
              : 'maplibre'
            : 'fallback',
          visibleLayerCount: exportVisibleLayerCount,
          selectedInspectCard,
          sourceCanvas,
        })
      },
      measurePlanarPanZoomFrame: async ({
        animationDurationMs = 220,
        panOffsetPx = [96, -56],
        timeoutMs = 4000,
        zoomDelta = 0.08,
      } = {}) => {
        const map = mapRef.current
        if (!interactiveSupportedRef.current || !map || !planarReady) {
          throw new Error('Planar pan/zoom probe requires an interactive MapLibre runtime.')
        }

        const waitForAnimationFrames = async (count = 1): Promise<void> => {
          for (let index = 0; index < count; index += 1) {
            await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()))
          }
        }

        const waitForMapIdle = async (idleTimeoutMs = 1200): Promise<void> => {
          await new Promise<void>((resolve) => {
            let settled = false
            let timeoutHandle = 0

            const finish = () => {
              if (settled) {
                return
              }
              settled = true
              map.off('idle', onIdle)
              if (timeoutHandle) {
                window.clearTimeout(timeoutHandle)
              }
              resolve()
            }

            const onIdle = () => {
              finish()
            }

            timeoutHandle = window.setTimeout(() => {
              finish()
            }, idleTimeoutMs)

            map.on('idle', onIdle)
            window.requestAnimationFrame(() => {
              if (!map.isMoving()) {
                finish()
              }
            })
          })
        }

        map.stop()
        await waitForMapIdle()

        const originCenter = map.getCenter()
        const originZoom = map.getZoom()
        const originBearing = map.getBearing()
        const originPitch = map.getPitch()
        const projectedCenter = map.project(originCenter)
        const targetCenter = map.unproject([
          projectedCenter.x + panOffsetPx[0],
          projectedCenter.y + panOffsetPx[1],
        ])

        await waitForAnimationFrames(4)

        return await new Promise<{
          averageFrameMs: number
          durationMs: number
          maxFrameMs: number
          sampleCount: number
        }>((resolve, reject) => {
          const startedAt = performance.now()
          let settled = false
          let lastRenderAt: number | null = null
          let maxFrameMs = 0
          let totalFrameMs = 0
          let sampleCount = 0
          let frameLoopHandle = 0
          let timeoutHandle = 0

          const cleanup = () => {
            map.off('moveend', onMoveEnd)
            if (frameLoopHandle) {
              window.cancelAnimationFrame(frameLoopHandle)
            }
            if (timeoutHandle) {
              window.clearTimeout(timeoutHandle)
            }
          }

          const restoreView = async () => {
            map.stop()
            map.jumpTo({
              bearing: originBearing,
              center: originCenter,
              pitch: originPitch,
              zoom: originZoom,
            })
            map.triggerRepaint()
            await waitForAnimationFrames(2)
          }

          const finish = async () => {
            if (settled) {
              return
            }
            settled = true
            cleanup()
            try {
              await restoreView()
              if (sampleCount < 1) {
                reject(new Error('Planar pan/zoom probe did not record any render-frame samples.'))
                return
              }
              resolve({
                averageFrameMs: Math.round(totalFrameMs / sampleCount),
                durationMs: Math.round(performance.now() - startedAt),
                maxFrameMs: Math.round(maxFrameMs),
                sampleCount,
              })
            } catch (error) {
              reject(error)
            }
          }

          const fail = async (message: string) => {
            if (settled) {
              return
            }
            settled = true
            cleanup()
            try {
              await restoreView()
            } catch {
              // Best-effort view restore after a failed probe.
            }
            reject(new Error(message))
          }

          const sampleFrame = () => {
            const now = performance.now()
            if (lastRenderAt !== null) {
              const frameMs = now - lastRenderAt
              maxFrameMs = Math.max(maxFrameMs, frameMs)
              totalFrameMs += frameMs
              sampleCount += 1
            }
            lastRenderAt = now
            if (!settled) {
              if (
                sampleCount > 0 &&
                !map.isMoving() &&
                now - startedAt >= Math.max(120, animationDurationMs * 0.75)
              ) {
                void finish()
                return
              }
              frameLoopHandle = window.requestAnimationFrame(sampleFrame)
            }
          }

          const onMoveEnd = () => {
            void window.requestAnimationFrame(() => {
              void finish()
            })
          }

          timeoutHandle = window.setTimeout(() => {
            if (sampleCount > 0) {
              void finish()
              return
            }
            void fail('Planar pan/zoom probe timed out before the map finished animating.')
          }, timeoutMs)

          map.on('moveend', onMoveEnd)
          frameLoopHandle = window.requestAnimationFrame(sampleFrame)
          map.easeTo({
            bearing: originBearing,
            center: targetCenter,
            duration: animationDurationMs,
            essential: true,
            pitch: originPitch,
            zoom: originZoom + zoomDelta,
          })
        })
      },
      switchSurfaceMode: async (nextMode) => {
        if (nextMode === surfaceMode) {
          return 0
        }

        if (pendingSurfaceModeSwitchRef.current) {
          window.clearTimeout(pendingSurfaceModeSwitchRef.current.timeoutHandle)
          pendingSurfaceModeSwitchRef.current.reject(
            new Error('A previous map surface mode switch was superseded by a new request.'),
          )
          pendingSurfaceModeSwitchRef.current = null
        }

        return await new Promise<number>((resolve, reject) => {
          const timeoutHandle = window.setTimeout(() => {
            if (pendingSurfaceModeSwitchRef.current?.mode === nextMode) {
              pendingSurfaceModeSwitchRef.current = null
            }
            reject(new Error(`Timed out switching map runtime surface to ${nextMode}.`))
          }, 5000)

          pendingSurfaceModeSwitchRef.current = {
            mode: nextMode,
            reject,
            resolve,
            timeoutHandle,
          }
          requestSurfaceModeChange(nextMode)
        })
      },
    }),
    [mode, planarReady, selectedFocusAoiId, selectedInspectId, surfaceMode],
  )

  useEffect(() => {
    onTelemetryChange?.({
      interactiveSupported: interactiveSupportedRef.current,
      mapPresent: true,
      planarReady,
      orbitalReady,
      activeSurfaceMode: surfaceMode,
      activeRuntimeEngine: interactiveSupportedRef.current
        ? surfaceMode === 'orbital'
          ? 'cesium'
          : 'maplibre'
        : 'fallback',
      focusAoiId: selectedFocusAoiId,
      inspectCount: scene.inspectCards.length,
      runtimeError: mapError,
    })
  }, [
    mapError,
    onTelemetryChange,
    orbitalReady,
    planarReady,
    scene.inspectCards.length,
    selectedFocusAoiId,
    surfaceMode,
  ])

  useEffect(() => {
    if (!interactiveSupportedRef.current || mapRef.current || !planarContainerRef.current) {
      return
    }
    if (mapLoadingRef.current) {
      return
    }

    let cancelled = false
    let planarReadyFrame = 0
    mapLoadingRef.current = true

    try {
      const initialView = runtimeAoiView(sceneRef.current.focusAoiId)
      const map = new maplibregl.Map(({
        container: planarContainerRef.current,
        style: offlineRef.current
          ? createFallbackStyle()
          : getMapBasemapStyle(basemapStyleId).styleUrl,
        center: initialView.center,
        zoom: 3.2,
        pitch: 24,
        bearing: 0,
        attributionControl: false,
        cooperativeGestures: true,
        maxPitch: 75,
        preserveDrawingBuffer: true,
      } as MapOptions & { preserveDrawingBuffer: boolean }))

      mapRef.current = map
      basemapSourceRef.current = offlineRef.current ? 'fallback' : 'online'
      activeBasemapStyleIdRef.current = basemapStyleId
      setBasemapState(offlineRef.current ? 'fallback-offline' : 'online-live')
      map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right')
      map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right')

      let planarReadyMarked = false
      const markPlanarReady = () => {
        if (cancelled || planarReadyMarked) {
          return
        }
        planarReadyMarked = true
        setMapError('')
        setPlanarReady(true)
      }

      planarReadyFrame = window.requestAnimationFrame(() => {
        markPlanarReady()
      })
      map.once('styledata', markPlanarReady)
      map.once('render', markPlanarReady)
      map.on('load', () => {
        if (basemapSourceRef.current === 'online') {
          onlineBasemapConfirmedRef.current = true
          clearBasemapLoadTimeout()
          setBasemapState('online-live')
        }
        markPlanarReady()
      })

      map.on('click', 'i1-signal-core', (event) => {
        onSignalClick(selectFeatureId(event.features?.[0]))
      })
      map.on('click', 'i1-event-marker-core', (event) => {
        onSignalClick(selectFeatureId(event.features?.[0]))
      })
      map.on('click', 'i1-event-clusters', (event) => {
        const feature = event.features?.[0]
        const clusterId = selectNumericProperty(feature, 'cluster_id')
        if (typeof clusterId !== 'number' || !feature) {
          return
        }
        const source = map.getSource('i1-event-markers') as
          | (GeoJSONSource & {
              getClusterExpansionZoom?: (
                clusterId: number,
                callback: (error: Error | null, zoom: number) => void,
              ) => void
            })
          | undefined
        source?.getClusterExpansionZoom?.(clusterId, (error, zoom) => {
          if (error || feature.geometry.type !== 'Point') {
            return
          }
          map.easeTo({
            center: [feature.geometry.coordinates[0], feature.geometry.coordinates[1]],
            zoom,
            duration: workspaceSettings.motionProfile === 'full' ? 540 : 220,
            essential: true,
          })
        })
      })
      map.on('click', 'i1-surface-fill', (event) => {
        onSurfaceClick(selectAoiId(event.features?.[0]))
      })
      map.on('mouseenter', 'i1-signal-core', () => {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseenter', 'i1-event-marker-core', () => {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseenter', 'i1-event-clusters', () => {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mousemove', 'i1-signal-core', (event) => {
        onSignalHover(selectFeatureId(event.features?.[0]))
      })
      map.on('mousemove', 'i1-event-marker-core', (event) => {
        onSignalHover(selectFeatureId(event.features?.[0]))
      })
      map.on('mousemove', 'i1-event-clusters', (event) => {
        onClusterHover(event.features?.[0])
      })
      map.on('mouseleave', 'i1-signal-core', () => {
        map.getCanvas().style.cursor = ''
        onSignalHover(undefined)
      })
      map.on('mouseleave', 'i1-event-marker-core', () => {
        map.getCanvas().style.cursor = ''
        onSignalHover(undefined)
      })
      map.on('mouseleave', 'i1-event-clusters', () => {
        map.getCanvas().style.cursor = ''
        onClusterHover(undefined)
      })
      map.on('mouseenter', 'i1-surface-fill', () => {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mousemove', 'i1-surface-fill', (event) => {
        onSurfaceHover(selectAoiId(event.features?.[0]))
      })
      map.on('mouseleave', 'i1-surface-fill', () => {
        map.getCanvas().style.cursor = ''
        onSurfaceHover(undefined)
      })
      map.on('error', (event) => {
        const message = event.error instanceof Error ? event.error.message : 'Map runtime error'
        if (basemapSourceRef.current === 'online' && !onlineBasemapConfirmedRef.current) {
          applyFallbackBasemap(
            map,
            'fallback-load-failure',
            'Live basemap unavailable; using schematic fallback.',
          )
          return
        }
        setMapError(message)
      })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Map runtime failed to load'
      setMapError(message)
    } finally {
      mapLoadingRef.current = false
    }

    return () => {
      cancelled = true
      if (planarReadyFrame) {
        window.cancelAnimationFrame(planarReadyFrame)
      }
      clearBasemapLoadTimeout()
      mapRef.current?.remove()
      mapRef.current = null
      setPlanarReady(false)
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current || !planarReady) {
      return
    }
    const map = mapRef.current
    const applyScene = () => {
      try {
        syncRuntimeScene(map, scene)
        setMapError('')
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Map scene sync failed'
        setMapError(message)
      }
    }

    if (map.isStyleLoaded()) {
      applyScene()
      return
    }

    map.once('styledata', applyScene)
  }, [planarReady, scene])

  useEffect(() => {
    if (!interactiveSupportedRef.current) {
      setBasemapState('fallback-runtime')
      return
    }
    if (!mapRef.current || !planarReady) {
      return
    }

    if (offline) {
      if (basemapSourceRef.current !== 'fallback' || basemapState !== 'fallback-offline') {
        applyFallbackBasemap(mapRef.current, 'fallback-offline')
      }
      return
    }

    if (basemapSourceRef.current === 'fallback' && basemapState === 'fallback-offline') {
      applyOnlineBasemap(mapRef.current, basemapStyleId)
    }
  }, [applyOnlineBasemap, basemapState, basemapStyleId, offline, planarReady])

  useEffect(() => {
    if (!mapRef.current || !planarReady) {
      return
    }

    const map = mapRef.current
    const previousViewport = lastPlanarViewportRef.current
    lastPlanarViewportRef.current = {
      focusAoiId: selectedFocusAoiId,
      surfaceMode,
    }

    if (surfaceMode !== 'planar') {
      return
    }

    const applyPlanarViewport = () => {
      map.stop()
      const view = runtimeAoiView(selectedFocusAoiId)

      map.setProjection({
        type: 'mercator',
      })
      applyFog(map, null)
      if (
        previousViewport &&
        previousViewport.surfaceMode === 'planar' &&
        previousViewport.focusAoiId !== selectedFocusAoiId
      ) {
        map.easeTo({
          center: view.center,
          zoom: 3.4,
          pitch: 24,
          bearing: 0,
          duration: workspaceSettings.motionProfile === 'full' ? 900 : 280,
          essential: true,
        })
        return
      }

      map.jumpTo({
        center: view.center,
        zoom: 3.4,
        pitch: 24,
        bearing: 0,
      })
    }

    if (map.isStyleLoaded()) {
      applyPlanarViewport()
      return
    }

    map.once('styledata', applyPlanarViewport)
  }, [planarReady, selectedFocusAoiId, surfaceMode, workspaceSettings.motionProfile])

  useEffect(() => {
    if (!interactiveSupportedRef.current) {
      return
    }
    const warmupHandle = window.setTimeout(() => {
      void preloadCesiumRuntime().catch((error: unknown) => {
        const message = error instanceof Error ? error.message : 'Cesium runtime preload failed'
        console.error('Cesium runtime preload failed', error)
        setMapError(message)
      })
    }, 120)
    return () => {
      window.clearTimeout(warmupHandle)
    }
  }, [])

  useEffect(() => {
    if (
      !interactiveSupportedRef.current ||
      !planarReady ||
      cesiumRef.current ||
      !orbitalContainerRef.current
    ) {
      return
    }
    if (cesiumLoadingRef.current) {
      return
    }

    let cancelled = false
    cesiumLoadingRef.current = true
    setMapError('')

    void initializeCesiumRuntime({
      container: orbitalContainerRef.current,
      scene: sceneRef.current,
      focusAoiId: focusAoiRef.current,
      offline: offlineRef.current,
      onFeatureSelect: (featureId) => {
        if (!cancelled) {
          setSelectedInspectId(featureId)
        }
      },
      onAoiSelect: (aoiId) => {
        if (!cancelled) {
          setSelectedFocusAoiId(aoiId)
        }
      },
    })
      .then((runtime) => {
        if (cancelled) {
          runtime.destroy()
          return
        }
        cesiumRef.current = runtime
        setMapError('')
        setOrbitalReady(true)
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : 'Cesium runtime failed to load'
        console.error('Cesium runtime failed to initialize', error)
        setMapError(message)
        setOrbitalReady(false)
      })
      .finally(() => {
        cesiumLoadingRef.current = false
      })

    return () => {
      cancelled = true
    }
  }, [planarReady])

  useEffect(() => {
    if (!cesiumRef.current || !orbitalReady) {
      return
    }
    syncCesiumRuntimeScene(cesiumRef.current, scene)
  }, [orbitalReady, scene])

  useEffect(() => {
    if (!cesiumRef.current || !orbitalReady || surfaceMode !== 'orbital') {
      return
    }
    cesiumRef.current.viewer.resize()
    focusCesiumRuntime(cesiumRef.current, selectedFocusAoiId)
    cesiumRef.current.viewer.scene.requestRender()
  }, [orbitalReady, selectedFocusAoiId, surfaceMode])

  useEffect(() => {
    return () => {
      cesiumRef.current?.destroy()
      cesiumRef.current = null
    }
  }, [])

  const selectedInspect =
    scene.inspectCards.find((card) => card.id === selectedInspectId) ?? scene.inspectCards[0]
  const selectedInspectHelper = selectedInspect ? buildInspectHelper(selectedInspect.id) : null
  const activeHelper = workspaceSettings.hoverHelpers ? hoveredHelper : null
  const recentEvents = scene.eventTimeline.slice(0, 4)
  const activeBasemapStyle = getMapBasemapStyle(basemapStyleId)
  const basemapStatusLabel =
    basemapState === 'online-live'
      ? `${activeBasemapStyle.label} basemap`
      : basemapState === 'fallback-load-failure'
        ? 'Schematic fallback basemap'
        : basemapState === 'fallback-offline'
          ? 'Offline schematic basemap'
          : 'Schematic fallback basemap'
  const basemapStatusDetail =
    basemapState === 'online-live'
      ? 'Recognizable online basemap is active under the governed overlays.'
      : basemapState === 'fallback-load-failure'
        ? 'The live basemap failed to load, so the planar surface fell back to the local schematic map.'
        : basemapState === 'fallback-offline'
          ? 'Offline mode keeps the planar surface readable with the local schematic fallback.'
          : 'The current runtime cannot mount the interactive online basemap, so the schematic fallback remains active.'
  const basemapStatusTone = basemapState === 'online-live' ? 'allowed' : 'blocked'
  const surfaceModeLabel = surfaceMode === 'orbital' ? '3D globe' : '2D situation map'
  const selectTimelineEntry = (entry: GlobalEventTimelineEntry) => {
    setSelectedFocusAoiId(entry.aoiId)
    if (entry.mapEligible && scene.inspectCards.some((card) => card.id === entry.inspectId)) {
      setSelectedInspectId(entry.inspectId)
    }
    setHoveredHelper(
      (entry.mapEligible ? buildInspectHelper(entry.inspectId) : null) ?? buildFocusHelper(entry.aoiId),
    )
    if (workspaceSettings.autoOpenContextualInspector) {
      setContextDrawerOpen(true)
    }
  }

  return (
    <section className="map-runtime-shell" data-testid="map-runtime-surface">
      <div
        className={`map-runtime-stage ${workspaceSettings.ambientMapEffects ? 'is-ambient' : ''} motion-${workspaceSettings.motionProfile}`}
      >
        <div className="map-runtime-headline map-runtime-glass">
          <div className="card-header compact">
            <span className="artifact-chip evidence">Map-linked workspace</span>
            <span>{mode} workflow</span>
          </div>
          <h3>{surfaceModeLabel}</h3>
          <p className="map-runtime-copy">{scene.narrative}</p>
          <p className="status-line">{scene.statusLine}</p>
          {mapError && <small className="status-line warning">{mapError}</small>}
        </div>

        <div className="map-runtime-actions" aria-label="Map runtime actions">
          <div className="map-runtime-toggle-group" aria-label="Map surface mode">
            <button
              type="button"
              className={surfaceMode === 'planar' ? 'is-active' : ''}
              aria-pressed={surfaceMode === 'planar'}
              onClick={() => requestSurfaceModeChange('planar')}
            >
              2D Situation Map
            </button>
            <button
              type="button"
              className={surfaceMode === 'orbital' ? 'is-active' : ''}
              aria-pressed={surfaceMode === 'orbital'}
              onClick={() => requestSurfaceModeChange('orbital')}
            >
              3D Globe
            </button>
          </div>
          <div className="map-runtime-style-picker">
            <span className="map-runtime-style-label">2D basemap</span>
            <div
              className="map-runtime-toggle-group map-runtime-style-group"
              aria-label="2D basemap style"
              data-testid="map-runtime-basemap-style-group"
            >
              {MAP_BASEMAP_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  className={basemapStyleId === style.id ? 'is-active' : ''}
                  aria-label={`Use ${style.label} basemap`}
                  aria-pressed={basemapStyleId === style.id}
                  data-testid={`map-runtime-basemap-style-${style.id}`}
                  onClick={() => onBasemapStyleChange?.(style.id)}
                  title={style.description}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            className="map-runtime-export-button"
            data-testid="map-runtime-export-button"
            disabled={!onRequestExport || exportBusy}
            onClick={() => {
              void onRequestExport?.()
            }}
            title={exportBlockedReason || 'Export a governed 4K map image'}
          >
            {exportBusy ? 'Exporting 4K...' : 'Export 4K PNG'}
          </button>
          {workspaceSettings.telemetryChips ? (
            <div className="map-runtime-chip-strip">
              <span
                className={degradedBudgetCount > 0 ? 'policy-pill blocked' : 'policy-pill allowed'}
              >
                {degradedBudgetCount > 0 ? 'Aggregation mode active' : 'Budget-safe interaction'}
              </span>
              <span
                className={`policy-pill ${basemapStatusTone}`}
                data-testid="map-runtime-basemap-status"
              >
                {basemapStatusLabel}
              </span>
              <span className={offline ? 'pill offline' : 'pill online'}>
                {offline ? 'Cached runtime' : 'Connected runtime'}
              </span>
            </div>
          ) : null}
        </div>

        <div className="map-runtime-focus-strip" aria-label="AOI focus controls">
          {scene.focusOptions.map((option) => (
            <button
              key={option.aoiId}
              type="button"
              className={selectedFocusAoiId === option.aoiId ? 'is-active' : ''}
              aria-pressed={selectedFocusAoiId === option.aoiId}
              onClick={() => {
                setSelectedFocusAoiId(option.aoiId)
                setHoveredHelper(buildFocusHelper(option.aoiId))
                if (workspaceSettings.autoOpenContextualInspector) {
                  setContextDrawerOpen(true)
                }
              }}
              onMouseEnter={() => {
                if (workspaceSettings.hoverHelpers) {
                  setHoveredHelper(buildFocusHelper(option.aoiId))
                }
              }}
              onMouseLeave={() => {
                if (workspaceSettings.hoverHelpers) {
                  setHoveredHelper(null)
                }
              }}
              onFocus={() => {
                if (workspaceSettings.hoverHelpers) {
                  setHoveredHelper(buildFocusHelper(option.aoiId))
                }
              }}
              onBlur={() => {
                if (workspaceSettings.hoverHelpers) {
                  setHoveredHelper(null)
                }
              }}
            >
              <strong>{option.label}</strong>
              <span>{option.subtitle}</span>
            </button>
          ))}
        </div>

        {recentEvents.length > 0 ? (
          <div className="map-runtime-event-rail map-runtime-glass" data-testid="map-runtime-event-rail">
            <div className="card-header compact">
              <span className="artifact-chip context">Global Event Timeline</span>
              <span>{scene.eventTimeline.length} event(s)</span>
            </div>
            <div className="map-runtime-event-rail-list" aria-label="Recent governed events">
              {recentEvents.map((entry) => (
                <button
                  key={entry.eventId}
                  type="button"
                  className={selectedInspectId === entry.inspectId ? 'is-active' : ''}
                  aria-pressed={selectedInspectId === entry.inspectId}
                  data-testid="map-runtime-event-pill"
                  onClick={() => selectTimelineEntry(entry)}
                  onMouseEnter={() => {
                    if (workspaceSettings.hoverHelpers) {
                      setHoveredHelper(
                        (entry.mapEligible ? buildInspectHelper(entry.inspectId) : null) ??
                          buildFocusHelper(entry.aoiId),
                      )
                    }
                  }}
                  onMouseLeave={() => {
                    if (workspaceSettings.hoverHelpers) {
                      setHoveredHelper(null)
                    }
                  }}
                >
                  <span className={toneClass(entry.tone)}>
                    {formatRuntimeCategory(entry.category)}
                  </span>
                  <strong>{entry.label}</strong>
                  <small>
                    {entry.aoiLabel} | {entry.occurredAtLabel}
                    {entry.aggregateOnly ? ' | aggregate-only' : ''}
                    {!entry.mapEligible ? ' | timeline only' : ''}
                  </small>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div
          className={`map-runtime-canvas ${!interactiveSupportedRef.current ? 'is-fallback' : ''}`}
          data-testid="map-runtime-canvas"
        >
          <div
            ref={planarContainerRef}
            className={`map-runtime-canvas-slot ${surfaceMode === 'planar' ? 'is-active' : 'is-hidden'}`}
            data-testid="map-runtime-canvas-planar"
          />
          <div
            ref={orbitalContainerRef}
            className={`map-runtime-canvas-slot map-runtime-canvas-orbital ${surfaceMode === 'orbital' ? 'is-active' : 'is-hidden'}`}
            data-testid="map-runtime-canvas-orbital"
          />
          {!interactiveSupportedRef.current && (
            <div className="map-runtime-fallback" data-testid="map-runtime-fallback">
              <div className="map-runtime-fallback-grid" />
              {scene.focusOptions.map((option, index) => (
                <button
                  key={option.aoiId}
                  type="button"
                  className={`map-runtime-fallback-node ${selectedFocusAoiId === option.aoiId ? 'is-active' : ''}`}
                  aria-pressed={selectedFocusAoiId === option.aoiId}
                  style={{
                    left: `${18 + index * 18}%`,
                    top: `${index % 2 === 0 ? 26 : 58}%`,
                  }}
                  onClick={() => {
                    setSelectedFocusAoiId(option.aoiId)
                    setHoveredHelper(buildFocusHelper(option.aoiId))
                    if (workspaceSettings.autoOpenContextualInspector) {
                      setContextDrawerOpen(true)
                    }
                  }}
                  onMouseEnter={() => {
                    if (workspaceSettings.hoverHelpers) {
                      setHoveredHelper(buildFocusHelper(option.aoiId))
                    }
                  }}
                  onMouseLeave={() => {
                    if (workspaceSettings.hoverHelpers) {
                      setHoveredHelper(null)
                    }
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {activeHelper ? (
          <aside className="map-runtime-helper-card map-runtime-glass" data-testid="map-runtime-helper-card">
            <div className="card-header compact">
              <span className={toneClass(activeHelper.tone)}>{activeHelper.badge}</span>
              <span>{activeHelper.meta}</span>
            </div>
            <h4>{activeHelper.label}</h4>
            <p>{activeHelper.detail}</p>
            {activeHelper.contextLine ? (
              <small className="map-runtime-helper-supporting">{activeHelper.contextLine}</small>
            ) : null}
          </aside>
        ) : null}

        <div className={`map-runtime-context-drawer ${contextDrawerOpen ? 'is-open' : 'is-closed'}`}>
          <button
            type="button"
            className="map-runtime-drawer-toggle"
            aria-expanded={contextDrawerOpen}
            aria-controls="map-runtime-context-panel"
            onClick={() => setContextDrawerOpen((previous) => !previous)}
          >
            {contextDrawerOpen ? 'Hide contextual map details' : 'Show contextual map details'}
          </button>
          <aside
            id="map-runtime-context-panel"
            className="map-runtime-inspector"
            hidden={!contextDrawerOpen}
          >
            <div className="map-runtime-metrics">
              {scene.metrics.map((metric) => (
                <article key={metric.label}>
                  <span className="metric-label">{metric.label}</span>
                  <strong>{metric.value}</strong>
                  <p>{metric.detail}</p>
                </article>
              ))}
            </div>

            {selectedInspect && selectedInspectHelper ? (
              <article className="map-runtime-detail-card">
                <div className="card-header compact">
                  <span className={toneClass(selectedInspect.tone)}>
                    {formatRuntimeCategory(selectedInspect.category)}
                  </span>
                  <span>{selectedInspectHelper.meta}</span>
                </div>
                <h4>{selectedInspect.label}</h4>
                <p>{selectedInspect.detail}</p>
                {selectedInspectHelper.contextLine ? (
                  <small className="map-runtime-helper-supporting">
                    {selectedInspectHelper.contextLine}
                  </small>
                ) : null}
              </article>
            ) : null}

            <div className="map-runtime-inspect-list" aria-label="Map inspect targets">
              {scene.inspectCards.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  className={selectedInspectId === card.id ? 'is-active' : ''}
                  aria-pressed={selectedInspectId === card.id}
                  onClick={() => {
                    setSelectedInspectId(card.id)
                    setSelectedFocusAoiId(card.aoiId)
                    const helper = buildInspectHelper(card.id)
                    if (helper) {
                      setHoveredHelper(helper)
                    }
                    if (workspaceSettings.autoOpenContextualInspector) {
                      setContextDrawerOpen(true)
                    }
                  }}
                  onMouseEnter={() => {
                    if (workspaceSettings.hoverHelpers) {
                      setHoveredHelper(buildInspectHelper(card.id))
                    }
                  }}
                  onMouseLeave={() => {
                    if (workspaceSettings.hoverHelpers) {
                      setHoveredHelper(null)
                    }
                  }}
                  onFocus={() => {
                    if (workspaceSettings.hoverHelpers) {
                      setHoveredHelper(buildInspectHelper(card.id))
                    }
                  }}
                  onBlur={() => {
                    if (workspaceSettings.hoverHelpers) {
                      setHoveredHelper(null)
                    }
                  }}
                >
                  <span className={toneClass(card.tone)}>{formatRuntimeCategory(card.category)}</span>
                  <strong>{card.label}</strong>
                  <small>{card.aoiId}</small>
                </button>
              ))}
            </div>
          </aside>
        </div>

        <div className={`map-runtime-legend-tray ${legendTrayOpen ? 'is-open' : 'is-closed'}`}>
          <div className="map-runtime-stage-footer map-runtime-glass">
            <div className="map-runtime-stage-footer-copy">
              <p className="status-line" data-testid="map-runtime-provenance-strip">
                Marking {marking} | Visible governed layers {visibleLayerCount} | Bundle-linked
                export policy enforced
              </p>
              <p className="status-line">{basemapStatusDetail}</p>
              {exportBlockedReason && <p className="status-line warning">{exportBlockedReason}</p>}
              {latestExportArtifactId && !exportBlockedReason && (
                <p className="status-line">Last 4K export: {latestExportArtifactId}</p>
              )}
            </div>
            <button
              type="button"
              className="map-runtime-tray-toggle"
              aria-expanded={legendTrayOpen}
              aria-controls="map-runtime-legend-panel"
              onClick={() => setLegendTrayOpen((previous) => !previous)}
            >
              {legendTrayOpen ? 'Hide legend and provenance' : 'Show legend and provenance'}
            </button>
          </div>
          <div id="map-runtime-legend-panel" className="map-runtime-footer" hidden={!legendTrayOpen}>
            <div className="legend-row" aria-label="Map runtime legend">
              {scene.legend.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={toneClass(item.tone)}
                  aria-pressed={selectedInspect?.label === item.label}
                  onClick={() => {
                    const inspectTarget = inspectCardByLabel.get(item.label)
                    if (inspectTarget) {
                      setSelectedInspectId(inspectTarget.id)
                      setSelectedFocusAoiId(inspectTarget.aoiId)
                    }
                    if (workspaceSettings.autoOpenContextualInspector) {
                      setContextDrawerOpen(true)
                    }
                    if (workspaceSettings.hoverHelpers) {
                      setHoveredHelper(buildLegendHelper(item.id))
                    }
                  }}
                  onMouseEnter={() => {
                    if (workspaceSettings.hoverHelpers) {
                      setHoveredHelper(buildLegendHelper(item.id))
                    }
                  }}
                  onMouseLeave={() => {
                    if (workspaceSettings.hoverHelpers) {
                      setHoveredHelper(null)
                    }
                  }}
                  title={item.detail}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <p className="status-line" aria-label="Tone palette semantics">
              Tone palette:{' '}
              {(['evidence', 'context', 'model', 'ai', 'alert', 'support'] as const).map((tone) => (
                <span key={tone} className="map-runtime-tone-key" data-testid="map-runtime-tone-key">
                  <span
                    className="map-runtime-tone-dot"
                    style={{ backgroundColor: runtimeToneColor(tone) }}
                    aria-hidden="true"
                  />
                  <span className="map-runtime-tone-label">{tone}</span>
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
})
