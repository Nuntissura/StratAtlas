import type { Entity, Viewer } from 'cesium'
import { runtimeAoiView, type MapRuntimeScene, type Position } from './mapRuntimeScene'

export type CesiumModule = typeof import('cesium')

export interface CesiumRuntimeHandle {
  Cesium: CesiumModule
  viewer: Viewer
  destroy: () => void
}

const CESIUM_STATIC_BASE_URL = '/cesiumStatic'
const CAMERA_ALTITUDE_M = 1_900_000

const setCesiumBaseUrl = () => {
  const runtimeWindow = window as Window & { CESIUM_BASE_URL?: string }
  runtimeWindow.CESIUM_BASE_URL = CESIUM_STATIC_BASE_URL
}

let cesiumModulePromise: Promise<CesiumModule> | null = null

const loadCesium = async (): Promise<CesiumModule> => {
  setCesiumBaseUrl()
  if (!cesiumModulePromise) {
    cesiumModulePromise = import('cesium')
  }
  return cesiumModulePromise
}

export const preloadCesiumRuntime = async (): Promise<void> => {
  await loadCesium()
}

const degreesArray = (positions: Position[]): number[] =>
  positions.flatMap((position) => [position[0], position[1]])

const centerOfPositions = (positions: Position[]): Position => {
  const totals = positions.reduce(
    (accumulator, position) => [accumulator[0] + position[0], accumulator[1] + position[1]] as Position,
    [0, 0],
  )
  return [
    Number((totals[0] / Math.max(positions.length, 1)).toFixed(4)),
    Number((totals[1] / Math.max(positions.length, 1)).toFixed(4)),
  ]
}

const propertyValue = (
  Cesium: CesiumModule,
  entity: Entity | undefined,
  key: string,
): string | undefined => {
  const property = entity?.properties?.[key]
  if (!property || typeof property.getValue !== 'function') {
    return undefined
  }
  const value = property.getValue(Cesium.JulianDate.now())
  return typeof value === 'string' ? value : undefined
}

const buildBaseLayer = (Cesium: CesiumModule, offline: boolean) => {
  if (offline) {
    return false
  }
  return new Cesium.ImageryLayer(
    new Cesium.OpenStreetMapImageryProvider({
      url: 'https://tile.openstreetmap.org/',
    }),
  )
}

const colorForTone = (
  Cesium: CesiumModule,
  tone: 'evidence' | 'context' | 'model' | 'ai' | 'alert' | 'support',
) =>
  Cesium.Color.fromCssColorString(
    tone === 'support'
      ? '#b4c7ff'
      : tone === 'alert'
        ? '#ff6e80'
        : tone === 'ai'
          ? '#ff8ed4'
          : tone === 'model'
            ? '#ffbe78'
            : tone === 'context'
              ? '#87f5b5'
              : '#7be8ff',
  )

const configureViewer = (
  viewer: Viewer,
  Cesium: CesiumModule,
) => {
  viewer.scene.requestRenderMode = true
  viewer.scene.maximumRenderTimeChange = Number.POSITIVE_INFINITY
  viewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#04070c')
  viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#091522')
  viewer.scene.globe.enableLighting = false
  viewer.scene.globe.showGroundAtmosphere = true
  viewer.scene.highDynamicRange = false
  if (viewer.scene.skyAtmosphere) {
    viewer.scene.skyAtmosphere.show = true
  }
  ;(viewer.cesiumWidget.creditContainer as HTMLElement).style.display = 'none'
}

export const syncCesiumRuntimeScene = (
  handle: CesiumRuntimeHandle,
  scene: MapRuntimeScene,
) => {
  const { Cesium, viewer } = handle
  viewer.entities.removeAll()

  scene.surfaces.features.forEach((feature) => {
    if (feature.geometry.type !== 'Polygon') {
      return
    }
    const ring = feature.geometry.coordinates[0]
    const center = centerOfPositions(ring)
    const fillColor = Cesium.Color.fromCssColorString(feature.properties.fillColor).withAlpha(
      feature.properties.fillOpacity,
    )
    const outlineColor = Cesium.Color.fromCssColorString(feature.properties.lineColor)

    viewer.entities.add({
      id: `surface:${feature.properties.featureId}`,
      name: feature.properties.label,
      position: Cesium.Cartesian3.fromDegrees(center[0], center[1], 120_000),
      polygon: {
        hierarchy: Cesium.Cartesian3.fromDegreesArray(degreesArray(ring)),
        material: fillColor,
        outline: true,
        outlineColor,
        outlineWidth: 2 + feature.properties.emphasis,
        height: 0,
        extrudedHeight: 65_000 + feature.properties.emphasis * 22_000,
      },
      label: {
        text: feature.properties.label,
        font: '13px sans-serif',
        fillColor: outlineColor,
        outlineColor: Cesium.Color.fromCssColorString('#04070c'),
        outlineWidth: 2,
        showBackground: true,
        backgroundColor: Cesium.Color.fromCssColorString('#07111a').withAlpha(0.76),
        pixelOffset: new Cesium.Cartesian2(0, -18),
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      },
      properties: new Cesium.PropertyBag({
        featureId: feature.properties.featureId,
        aoiId: feature.properties.aoiId,
      }),
    })
  })

  scene.corridors.features.forEach((feature) => {
    if (feature.geometry.type !== 'LineString') {
      return
    }
    viewer.entities.add({
      id: `corridor:${feature.properties.featureId}`,
      name: feature.properties.label,
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArray(degreesArray(feature.geometry.coordinates)),
        width: Math.max(2, feature.properties.width),
        material: Cesium.Color.fromCssColorString(feature.properties.color).withAlpha(0.92),
      },
      properties: new Cesium.PropertyBag({
        featureId: feature.properties.featureId,
      }),
    })
  })

  scene.signals.features.forEach((feature) => {
    if (feature.geometry.type !== 'Point') {
      return
    }
    const color = colorForTone(Cesium, feature.properties.tone)
    viewer.entities.add({
      id: `signal:${feature.properties.featureId}`,
      name: feature.properties.label,
      position: Cesium.Cartesian3.fromDegrees(
        feature.geometry.coordinates[0],
        feature.geometry.coordinates[1],
        95_000 + feature.properties.emphasis * 20_000,
      ),
      point: {
        pixelSize: Math.max(10, feature.properties.radius * 1.8),
        color,
        outlineColor: Cesium.Color.fromCssColorString('#08111a'),
        outlineWidth: 2,
      },
      label: {
        text: feature.properties.label,
        font: '13px sans-serif',
        fillColor: color,
        outlineColor: Cesium.Color.fromCssColorString('#04070c'),
        outlineWidth: 2,
        showBackground: true,
        backgroundColor: Cesium.Color.fromCssColorString('#07111a').withAlpha(0.76),
        pixelOffset: new Cesium.Cartesian2(0, -20),
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      },
      properties: new Cesium.PropertyBag({
        featureId: feature.properties.featureId,
        aoiId: feature.properties.aoiId,
      }),
      description: feature.properties.detail,
    })
  })

  viewer.scene.requestRender()
}

export const focusCesiumRuntime = (
  handle: CesiumRuntimeHandle,
  aoiId: string,
) => {
  const { Cesium, viewer } = handle
  const view = runtimeAoiView(aoiId)
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(
      view.center[0],
      view.center[1],
      CAMERA_ALTITUDE_M,
    ),
    orientation: {
      heading: Cesium.Math.toRadians(view.bearing),
      pitch: Cesium.Math.toRadians(-52),
      roll: 0,
    },
    duration: 0.9,
  })
}

export const initializeCesiumRuntime = async ({
  container,
  scene,
  focusAoiId,
  offline,
  onFeatureSelect,
  onAoiSelect,
}: {
  container: HTMLDivElement
  scene: MapRuntimeScene
  focusAoiId: string
  offline: boolean
  onFeatureSelect: (featureId: string) => void
  onAoiSelect: (aoiId: string) => void
}): Promise<CesiumRuntimeHandle> => {
  const Cesium = await loadCesium()
  const viewer = new Cesium.Viewer(container, {
    baseLayer: buildBaseLayer(Cesium, offline),
    animation: false,
    timeline: false,
    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    navigationHelpButton: false,
    sceneModePicker: false,
    fullscreenButton: false,
    infoBox: false,
    selectionIndicator: false,
    requestRenderMode: true,
    scene3DOnly: true,
    terrain: undefined,
    contextOptions: {
      webgl: {
        preserveDrawingBuffer: true,
      },
    },
  })

  configureViewer(viewer, Cesium)
  syncCesiumRuntimeScene({ Cesium, viewer, destroy: () => undefined }, scene)
  focusCesiumRuntime({ Cesium, viewer, destroy: () => undefined }, focusAoiId)

  const clickHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  clickHandler.setInputAction((movement: { position: unknown }) => {
    const picked = viewer.scene.pick(movement.position as import('cesium').Cartesian2)
    const entity = (picked && 'id' in picked ? picked.id : undefined) as Entity | undefined
    const featureId = propertyValue(Cesium, entity, 'featureId')
    const aoiId = propertyValue(Cesium, entity, 'aoiId')
    if (featureId) {
      onFeatureSelect(featureId)
    }
    if (aoiId) {
      onAoiSelect(aoiId)
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

  return {
    Cesium,
    viewer,
    destroy: () => {
      clickHandler.destroy()
      viewer.destroy()
    },
  }
}
