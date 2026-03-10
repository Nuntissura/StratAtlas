import {
  forwardRef,
  useEffect,
  useEffectEvent,
  useImperativeHandle,
  useLayoutEffect,
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
import type { SensitivityMarking } from '../../../contracts/i0'
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
  mode: UiMode
  marking: SensitivityMarking
  visibleLayerCount: number
  degradedBudgetCount: number
  offline: boolean
  exportBusy?: boolean
  exportBlockedReason?: string
  latestExportArtifactId?: string
  onTelemetryChange?: (telemetry: MapRuntimeTelemetry) => void
  onRequestExport?: () => void | Promise<void>
  onSurfaceModeFeedback?: (surfaceMode: SurfaceMode, measuredMs: number) => void
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

const ONLINE_BASEMAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty'

type BasemapState = 'online-live' | 'fallback-offline' | 'fallback-load-failure' | 'fallback-runtime'

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
}

const syncRuntimeScene = (map: MapLibreMap, scene: MapRuntimeScene) => {
  syncGeoJsonSource(map, 'i1-surfaces', scene.surfaces)
  syncGeoJsonSource(map, 'i1-corridors', scene.corridors)
  syncGeoJsonSource(map, 'i1-signals', scene.signals)
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

export const MapRuntimeSurface = forwardRef<MapRuntimeSurfaceHandle, MapRuntimeSurfaceProps>(function MapRuntimeSurface({
  scene,
  mode,
  marking,
  visibleLayerCount,
  degradedBudgetCount,
  offline,
  exportBusy = false,
  exportBlockedReason = '',
  latestExportArtifactId = '',
  onTelemetryChange,
  onRequestExport,
  onSurfaceModeFeedback,
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
  const basemapStyleRef = useRef<'online' | 'fallback'>(
    interactiveSupportedRef.current && !offline ? 'online' : 'fallback',
  )
  const basemapLoadTimeoutRef = useRef<number>(0)

  useEffect(() => {
    offlineRef.current = offline
  }, [offline])

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
    basemapStyleRef.current = 'fallback'
    setBasemapState(nextState)
    if (message) {
      setMapError(message)
    }
    map.setStyle(createFallbackStyle())
    syncPlanarSceneAfterStyleChange(map)
  })

  const applyOnlineBasemap = useEffectEvent((map: MapLibreMap) => {
    clearBasemapLoadTimeout()
    basemapStyleRef.current = 'online'
    onlineBasemapConfirmedRef.current = false
    setBasemapState('online-live')
    map.setStyle(ONLINE_BASEMAP_STYLE_URL)
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

  const onSignalClick = useEffectEvent((featureId?: string) => {
    if (featureId) {
      setSelectedInspectId(featureId)
    }
  })

  const onSurfaceClick = useEffectEvent((aoiId?: string) => {
    if (aoiId) {
      setSelectedFocusAoiId(aoiId)
    }
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
              frameLoopHandle = window.requestAnimationFrame(sampleFrame)
            }
          }

          const onMoveEnd = () => {
            void window.requestAnimationFrame(() => {
              void finish()
            })
          }

          timeoutHandle = window.setTimeout(() => {
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
        style: offlineRef.current ? createFallbackStyle() : ONLINE_BASEMAP_STYLE_URL,
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
      basemapStyleRef.current = offlineRef.current ? 'fallback' : 'online'
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
        if (basemapStyleRef.current === 'online') {
          onlineBasemapConfirmedRef.current = true
          clearBasemapLoadTimeout()
          setBasemapState('online-live')
        }
        markPlanarReady()
      })

      map.on('click', 'i1-signal-core', (event) => {
        onSignalClick(selectFeatureId(event.features?.[0]))
      })
      map.on('click', 'i1-surface-fill', (event) => {
        onSurfaceClick(selectAoiId(event.features?.[0]))
      })
      map.on('mouseenter', 'i1-signal-core', () => {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseleave', 'i1-signal-core', () => {
        map.getCanvas().style.cursor = ''
      })
      map.on('mouseenter', 'i1-surface-fill', () => {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseleave', 'i1-surface-fill', () => {
        map.getCanvas().style.cursor = ''
      })
      map.on('error', (event) => {
        const message = event.error instanceof Error ? event.error.message : 'Map runtime error'
        if (basemapStyleRef.current === 'online' && !onlineBasemapConfirmedRef.current) {
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
      if (basemapStyleRef.current !== 'fallback' || basemapState !== 'fallback-offline') {
        applyFallbackBasemap(mapRef.current, 'fallback-offline')
      }
      return
    }

    if (basemapStyleRef.current === 'fallback' && basemapState === 'fallback-offline') {
      applyOnlineBasemap(mapRef.current)
    }
  }, [basemapState, offline, planarReady])

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
        duration: 900,
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
  }, [planarReady, selectedFocusAoiId, surfaceMode])

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
  const basemapStatusLabel =
    basemapState === 'online-live'
      ? 'OpenFreeMap basemap'
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

  return (
    <section className="map-runtime-shell" data-testid="map-runtime-surface">
      <div className="map-runtime-toolbar">
        <div>
          <h3>{surfaceMode === 'orbital' ? '3D globe' : '2D situation map'}</h3>
          <p className="map-runtime-copy">{scene.narrative}</p>
        </div>
        <div className="map-runtime-actions">
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
          <span className={degradedBudgetCount > 0 ? 'policy-pill blocked' : 'policy-pill allowed'}>
            {degradedBudgetCount > 0 ? 'Aggregation mode active' : 'Budget-safe interaction'}
          </span>
          <span
            className={`policy-pill ${basemapStatusTone}`}
            data-testid="map-runtime-basemap-status"
          >
            {basemapStatusLabel}
          </span>
        </div>
      </div>

      <div className="map-runtime-stage">
        <div className="map-runtime-focus-strip" aria-label="AOI focus controls">
          {scene.focusOptions.map((option) => (
            <button
              key={option.aoiId}
              type="button"
              className={selectedFocusAoiId === option.aoiId ? 'is-active' : ''}
              aria-pressed={selectedFocusAoiId === option.aoiId}
              onClick={() => setSelectedFocusAoiId(option.aoiId)}
            >
              <strong>{option.label}</strong>
              <span>{option.subtitle}</span>
            </button>
          ))}
        </div>

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
                  onClick={() => setSelectedFocusAoiId(option.aoiId)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="map-runtime-overlay">
          <div className="map-runtime-headline">
            <div className="card-header compact">
              <span className="artifact-chip evidence">Map-linked workspace</span>
              <span>
                {surfaceMode === 'orbital' ? 'Cesium globe' : 'MapLibre surface'} execution
              </span>
            </div>
            <p>{scene.statusLine}</p>
            {mapError && <small className="status-line warning">{mapError}</small>}
          </div>

          <aside className="map-runtime-inspector">
            <div className="map-runtime-metrics">
              {scene.metrics.map((metric) => (
                <article key={metric.label}>
                  <span className="metric-label">{metric.label}</span>
                  <strong>{metric.value}</strong>
                  <p>{metric.detail}</p>
                </article>
              ))}
            </div>

            {selectedInspect && (
              <article className="map-runtime-detail-card">
                <div className="card-header compact">
                  <span className={toneClass(selectedInspect.tone)}>{selectedInspect.category}</span>
                  <span>{selectedInspect.aoiId}</span>
                </div>
                <h4>{selectedInspect.label}</h4>
                <p>{selectedInspect.detail}</p>
              </article>
            )}

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
                  }}
                >
                  <span className={toneClass(card.tone)}>{card.category}</span>
                  <strong>{card.label}</strong>
                  <small>{card.aoiId}</small>
                </button>
              ))}
            </div>
          </aside>
        </div>
      </div>

      <div className="map-runtime-footer">
        <div className="legend-row" aria-label="Map runtime legend">
          {scene.legend.map((item) => (
            <button
              key={item.id}
              type="button"
              className={toneClass(item.tone)}
              aria-pressed={selectedInspect?.label === item.label}
              onClick={() => {
                const inspectTarget = scene.inspectCards.find((card) => card.label === item.label)
                if (inspectTarget) {
                  setSelectedInspectId(inspectTarget.id)
                  setSelectedFocusAoiId(inspectTarget.aoiId)
                }
              }}
              title={item.detail}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className="status-line" data-testid="map-runtime-provenance-strip">
          Marking {marking} | Visible governed layers {visibleLayerCount} | Bundle-linked export
          policy enforced
        </p>
        <p className="status-line">{basemapStatusDetail}</p>
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
        {exportBlockedReason && <p className="status-line warning">{exportBlockedReason}</p>}
        {latestExportArtifactId && !exportBlockedReason && (
          <p className="status-line">Last 4K export: {latestExportArtifactId}</p>
        )}
      </div>
    </section>
  )
})
