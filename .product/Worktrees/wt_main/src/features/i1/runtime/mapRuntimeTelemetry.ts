export type SurfaceMode = 'planar' | 'orbital'
export type RuntimeEngine = 'fallback' | 'maplibre' | 'cesium'

export interface MapRuntimeTelemetry {
  interactiveSupported: boolean
  mapPresent: boolean
  planarReady: boolean
  orbitalReady: boolean
  activeSurfaceMode: SurfaceMode
  activeRuntimeEngine: RuntimeEngine
  focusAoiId: string
  inspectCount: number
  runtimeError: string
}

export const DEFAULT_MAP_RUNTIME_TELEMETRY: MapRuntimeTelemetry = {
  interactiveSupported: false,
  mapPresent: false,
  planarReady: false,
  orbitalReady: false,
  activeSurfaceMode: 'planar',
  activeRuntimeEngine: 'fallback',
  focusAoiId: '',
  inspectCount: 0,
  runtimeError: '',
}
