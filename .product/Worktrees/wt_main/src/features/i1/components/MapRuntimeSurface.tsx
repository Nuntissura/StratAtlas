import { useEffect, useEffectEvent, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import type {
  GeoJSONSource,
  GeoJSONSourceSpecification,
  Map as MapLibreMap,
  MapGeoJSONFeature,
  StyleSpecification,
} from 'maplibre-gl'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import 'maplibre-gl/dist/maplibre-gl.css'
import './MapRuntimeSurface.css'
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
  degradedBudgetCount: number
  offline: boolean
  onTelemetryChange?: (telemetry: MapRuntimeTelemetry) => void
}

const CARTO_TILES: string[] = [
  'https://a.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
  'https://b.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
  'https://c.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
]

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

const createBaseStyle = (): StyleSpecification => ({
  version: 8,
  sources: {
    'carto-dark': {
      type: 'raster',
      tiles: CARTO_TILES,
      tileSize: 256,
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    },
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
        'background-color': '#07131e',
      },
    },
    {
      id: 'i1-carto-dark',
      type: 'raster',
      source: 'carto-dark',
      paint: {
        'raster-opacity': 0.68,
        'raster-saturation': -0.72,
        'raster-contrast': 0.24,
      },
    },
    {
      id: 'i1-graticule-lines',
      type: 'line',
      source: 'i1-graticule',
      paint: {
        'line-color': '#2d4057',
        'line-width': 1,
        'line-opacity': 0.55,
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

export function MapRuntimeSurface({
  scene,
  mode,
  degradedBudgetCount,
  offline,
  onTelemetryChange,
}: MapRuntimeSurfaceProps) {
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
  const [surfaceMode, setSurfaceMode] = useState<SurfaceMode>('planar')
  const [selectedInspectId, setSelectedInspectId] = useState<string>(scene.inspectCards[0]?.id ?? '')
  const [selectedFocusAoiId, setSelectedFocusAoiId] = useState<string>(scene.focusAoiId)
  const [planarReady, setPlanarReady] = useState<boolean>(false)
  const [orbitalReady, setOrbitalReady] = useState<boolean>(false)
  const [mapError, setMapError] = useState<string>('')

  useEffect(() => {
    offlineRef.current = offline
  }, [offline])

  useEffect(() => {
    sceneRef.current = scene
  }, [scene])

  useEffect(() => {
    focusAoiRef.current = selectedFocusAoiId
  }, [selectedFocusAoiId])

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
      const map = new maplibregl.Map({
        container: planarContainerRef.current,
        style: createBaseStyle(),
        center: initialView.center,
        zoom: 3.2,
        pitch: 24,
        bearing: 0,
        attributionControl: false,
        cooperativeGestures: true,
        maxPitch: 75,
      })

      mapRef.current = map
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
      map.on('load', markPlanarReady)

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
    if (!mapRef.current || !planarReady) {
      return
    }

    const map = mapRef.current
    if (surfaceMode === 'planar') {
      map.resize()
    }
    const view = runtimeAoiView(selectedFocusAoiId)

    map.setProjection({
      type: 'mercator',
    })
    applyFog(map, null)
    map.easeTo({
      center: view.center,
      zoom: 3.4,
      pitch: 24,
      bearing: 0,
      duration: 900,
      essential: true,
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

  return (
    <section className="map-runtime-shell" data-testid="map-runtime-surface">
      <div className="map-runtime-toolbar">
        <div>
          <p className="eyebrow">Real governed geospatial runtime</p>
          <h3>{mode} theatre surface</h3>
          <p className="map-runtime-copy">{scene.narrative}</p>
        </div>
        <div className="map-runtime-actions">
          <div className="map-runtime-toggle-group" aria-label="Map surface mode">
            <button
              type="button"
              className={surfaceMode === 'planar' ? 'is-active' : ''}
              aria-pressed={surfaceMode === 'planar'}
              onClick={() => setSurfaceMode('planar')}
            >
              2D Situation Map
            </button>
            <button
              type="button"
              className={surfaceMode === 'orbital' ? 'is-active' : ''}
              aria-pressed={surfaceMode === 'orbital'}
              onClick={() => setSurfaceMode('orbital')}
            >
              3D Globe
            </button>
          </div>
          <span className={degradedBudgetCount > 0 ? 'policy-pill blocked' : 'policy-pill allowed'}>
            {degradedBudgetCount > 0 ? 'Aggregation mode active' : 'Budget-safe interaction'}
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

            <div className="map-runtime-inspect-list">
              {scene.inspectCards.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  className={selectedInspectId === card.id ? 'is-active' : ''}
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
        <p className="status-line">
          Tone palette:{' '}
          {(['evidence', 'context', 'model', 'ai', 'alert', 'support'] as const).map((tone) => (
            <span
              key={tone}
              className="map-runtime-tone-dot"
              style={{ backgroundColor: runtimeToneColor(tone) }}
            />
          ))}
        </p>
      </div>
    </section>
  )
}
