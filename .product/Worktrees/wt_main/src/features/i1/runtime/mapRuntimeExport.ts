import type { SensitivityMarking } from '../../../contracts/i0'
import type { UiMode } from '../modes'
import {
  runtimeToneColor,
  type MapRuntimeScene,
  type Position,
  type RuntimeInspectCard,
  type RuntimeTone,
} from './mapRuntimeScene'
import type { RuntimeEngine, SurfaceMode } from './mapRuntimeTelemetry'

const EXPORT_WIDTH = 3840
const EXPORT_HEIGHT = 2160
const EXPORT_HEADER_HEIGHT = 196
const EXPORT_FOOTER_HEIGHT = 188
const EXPORT_SIDE_RAIL_WIDTH = 1080
const EXPORT_PADDING = 72

interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export interface MapRuntimeExportCapture {
  artifactId: string
  fileName: string
  pngBytes: Uint8Array
  width: number
  height: number
  generatedAt: string
  marking: SensitivityMarking
  bundleId?: string
  focusAoiId: string
  surfaceMode: SurfaceMode
  runtimeEngine: RuntimeEngine
  visibleLayerCount: number
  usedSourceCanvas: boolean
}

export interface BuildMapRuntimeExportCaptureOptions {
  scene: MapRuntimeScene
  mode: UiMode
  offline: boolean
  marking: SensitivityMarking
  bundleId?: string
  focusAoiId: string
  sourceSurfaceMode: SurfaceMode
  sourceRuntimeEngine: RuntimeEngine
  visibleLayerCount: number
  selectedInspectCard?: RuntimeInspectCard
  sourceCanvas?: HTMLCanvasElement | null
}

const buildArtifactId = ({
  generatedAt,
  focusAoiId,
  surfaceMode,
}: {
  generatedAt: string
  focusAoiId: string
  surfaceMode: SurfaceMode
}): string =>
  `map-export-${focusAoiId}-${surfaceMode}-${generatedAt
    .replace(/[-:]/g, '')
    .replace(/\.\d+Z$/, 'z')
    .replace('T', '_')
    .toLowerCase()}`

const formatTimestamp = (value: string): string =>
  value.replace('T', ' ').replace('.000Z', 'Z')

const pickLabel = (mode: UiMode): string =>
  mode === 'live_recent'
    ? 'Live / Recent'
    : mode === 'replay'
      ? 'Replay'
      : mode === 'compare'
        ? 'Compare'
        : mode === 'scenario'
          ? 'Scenario'
          : mode === 'collaboration'
            ? 'Collaboration'
            : 'Offline'

const getContext = (canvas: HTMLCanvasElement): CanvasRenderingContext2D => {
  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('2D export context unavailable')
  }
  return context
}

const canvasToPngBytes = (canvas: HTMLCanvasElement): Uint8Array => {
  const dataUrl = canvas.toDataURL('image/png')
  const base64 = dataUrl.split(',')[1] ?? ''
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}

const fitRect = (sourceWidth: number, sourceHeight: number, target: Rect): Rect => {
  const sourceRatio = sourceWidth / Math.max(sourceHeight, 1)
  const targetRatio = target.width / Math.max(target.height, 1)
  if (sourceRatio > targetRatio) {
    const width = target.height * sourceRatio
    return {
      x: target.x - (width - target.width) / 2,
      y: target.y,
      width,
      height: target.height,
    }
  }
  const height = target.width / Math.max(sourceRatio, 0.0001)
  return {
    x: target.x,
    y: target.y - (height - target.height) / 2,
    width: target.width,
    height,
  }
}

const applyTextStyles = (
  context: CanvasRenderingContext2D,
  {
    font,
    color,
    align = 'left',
  }: {
    font: string
    color: string
    align?: CanvasTextAlign
  },
) => {
  context.font = font
  context.fillStyle = color
  context.textAlign = align
  context.textBaseline = 'top'
}

const wrapText = (
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
): string[] => {
  const words = text.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) {
    return []
  }
  const lines: string[] = []
  let current = words[0] ?? ''
  for (const word of words.slice(1)) {
    const candidate = `${current} ${word}`
    if (context.measureText(candidate).width <= maxWidth) {
      current = candidate
      continue
    }
    lines.push(current)
    current = word
    if (lines.length === maxLines - 1) {
      break
    }
  }
  if (lines.length < maxLines) {
    lines.push(current)
  }
  if (words.length > 0 && lines.length === maxLines) {
    const joined = lines.join(' ')
    if (joined !== words.join(' ')) {
      const lastLine = lines[maxLines - 1] ?? ''
      const trimmed = lastLine.length > 1 ? `${lastLine.slice(0, -1)}…` : `${lastLine}…`
      lines[maxLines - 1] = trimmed
    }
  }
  return lines
}

const drawChip = (
  context: CanvasRenderingContext2D,
  {
    label,
    tone,
    x,
    y,
  }: {
    label: string
    tone: RuntimeTone
    x: number
    y: number
  },
): number => {
  applyTextStyles(context, {
    font: '600 24px "Segoe UI", sans-serif',
    color: '#09121b',
  })
  const width = context.measureText(label).width + 42
  context.fillStyle = runtimeToneColor(tone)
  context.beginPath()
  context.roundRect(x, y, width, 42, 18)
  context.fill()
  context.fillStyle = '#09121b'
  context.fillText(label, x + 20, y + 8)
  return width
}

const collectBounds = (scene: MapRuntimeScene): {
  minLon: number
  maxLon: number
  minLat: number
  maxLat: number
} => {
  const points: Position[] = []
  for (const feature of scene.surfaces.features) {
    if (feature.geometry.type === 'Polygon') {
      points.push(...feature.geometry.coordinates[0])
    }
  }
  for (const feature of scene.corridors.features) {
    if (feature.geometry.type === 'LineString') {
      points.push(...feature.geometry.coordinates)
    }
  }
  for (const feature of scene.signals.features) {
    if (feature.geometry.type === 'Point') {
      points.push(feature.geometry.coordinates)
    }
  }
  const lons = points.map((point) => point[0])
  const lats = points.map((point) => point[1])
  return {
    minLon: Math.min(...lons, 0),
    maxLon: Math.max(...lons, 1),
    minLat: Math.min(...lats, 0),
    maxLat: Math.max(...lats, 1),
  }
}

const projectPoint = (
  point: Position,
  bounds: ReturnType<typeof collectBounds>,
  rect: Rect,
): { x: number; y: number } => {
  const lonSpan = Math.max(bounds.maxLon - bounds.minLon, 0.1)
  const latSpan = Math.max(bounds.maxLat - bounds.minLat, 0.1)
  return {
    x: rect.x + ((point[0] - bounds.minLon) / lonSpan) * rect.width,
    y: rect.y + rect.height - ((point[1] - bounds.minLat) / latSpan) * rect.height,
  }
}

const drawFallbackScene = (
  context: CanvasRenderingContext2D,
  scene: MapRuntimeScene,
  rect: Rect,
) => {
  context.fillStyle = '#061018'
  context.fillRect(rect.x, rect.y, rect.width, rect.height)
  const gradient = context.createLinearGradient(rect.x, rect.y, rect.x + rect.width, rect.y + rect.height)
  gradient.addColorStop(0, '#0f2334')
  gradient.addColorStop(1, '#08131e')
  context.fillStyle = gradient
  context.fillRect(rect.x, rect.y, rect.width, rect.height)

  const bounds = collectBounds(scene)

  context.strokeStyle = 'rgba(80, 116, 147, 0.34)'
  context.lineWidth = 1
  for (let column = 1; column < 6; column += 1) {
    const x = rect.x + (rect.width / 6) * column
    context.beginPath()
    context.moveTo(x, rect.y)
    context.lineTo(x, rect.y + rect.height)
    context.stroke()
  }
  for (let row = 1; row < 5; row += 1) {
    const y = rect.y + (rect.height / 5) * row
    context.beginPath()
    context.moveTo(rect.x, y)
    context.lineTo(rect.x + rect.width, y)
    context.stroke()
  }

  scene.surfaces.features.forEach((feature) => {
    if (feature.geometry.type !== 'Polygon') {
      return
    }
    context.beginPath()
    feature.geometry.coordinates[0].forEach((point, index) => {
      const projected = projectPoint(point, bounds, rect)
      if (index === 0) {
        context.moveTo(projected.x, projected.y)
        return
      }
      context.lineTo(projected.x, projected.y)
    })
    context.closePath()
    context.fillStyle = feature.properties.fillColor
    context.globalAlpha = feature.properties.fillOpacity
    context.fill()
    context.globalAlpha = 1
    context.lineWidth = 3 + feature.properties.emphasis
    context.strokeStyle = feature.properties.lineColor
    context.stroke()
  })

  scene.corridors.features.forEach((feature) => {
    if (feature.geometry.type !== 'LineString') {
      return
    }
    context.beginPath()
    feature.geometry.coordinates.forEach((point, index) => {
      const projected = projectPoint(point, bounds, rect)
      if (index === 0) {
        context.moveTo(projected.x, projected.y)
        return
      }
      context.lineTo(projected.x, projected.y)
    })
    context.lineWidth = Math.max(4, feature.properties.width * 2.5)
    context.strokeStyle = feature.properties.color
    context.globalAlpha = 0.9
    context.stroke()
    context.globalAlpha = 1
  })

  scene.signals.features.forEach((feature) => {
    if (feature.geometry.type !== 'Point') {
      return
    }
    const projected = projectPoint(feature.geometry.coordinates, bounds, rect)
    context.fillStyle = runtimeToneColor(feature.properties.tone)
    context.globalAlpha = feature.properties.haloOpacity
    context.beginPath()
    context.arc(projected.x, projected.y, feature.properties.haloRadius * 2.4, 0, Math.PI * 2)
    context.fill()
    context.globalAlpha = 1
    context.beginPath()
    context.arc(projected.x, projected.y, Math.max(8, feature.properties.radius * 2.6), 0, Math.PI * 2)
    context.fill()
  })
}

const drawSectionTitle = (
  context: CanvasRenderingContext2D,
  label: string,
  x: number,
  y: number,
) => {
  applyTextStyles(context, {
    font: '700 22px "Segoe UI", sans-serif',
    color: '#9fb7c8',
  })
  context.fillText(label, x, y)
}

const drawLines = (
  context: CanvasRenderingContext2D,
  lines: string[],
  x: number,
  y: number,
  lineHeight: number,
) => {
  lines.forEach((line, index) => {
    context.fillText(line, x, y + index * lineHeight)
  })
}

const renderMapExportCanvas = ({
  scene,
  mode,
  offline,
  marking,
  bundleId,
  focusAoiId,
  sourceSurfaceMode,
  sourceRuntimeEngine,
  visibleLayerCount,
  selectedInspectCard,
  generatedAt,
  sourceCanvas,
}: Omit<BuildMapRuntimeExportCaptureOptions, 'sourceCanvas'> & {
  generatedAt: string
  sourceCanvas?: HTMLCanvasElement | null
}): HTMLCanvasElement => {
  const canvas = document.createElement('canvas')
  canvas.width = EXPORT_WIDTH
  canvas.height = EXPORT_HEIGHT
  const context = getContext(canvas)
  const mapRect: Rect = {
    x: EXPORT_PADDING,
    y: EXPORT_HEADER_HEIGHT,
    width: EXPORT_WIDTH - EXPORT_SIDE_RAIL_WIDTH - EXPORT_PADDING * 2,
    height: EXPORT_HEIGHT - EXPORT_HEADER_HEIGHT - EXPORT_FOOTER_HEIGHT - EXPORT_PADDING,
  }
  const railRect: Rect = {
    x: mapRect.x + mapRect.width + EXPORT_PADDING,
    y: EXPORT_HEADER_HEIGHT,
    width: EXPORT_SIDE_RAIL_WIDTH - EXPORT_PADDING,
    height: mapRect.height,
  }

  const background = context.createLinearGradient(0, 0, EXPORT_WIDTH, EXPORT_HEIGHT)
  background.addColorStop(0, '#03090f')
  background.addColorStop(0.58, '#08131d')
  background.addColorStop(1, '#101a24')
  context.fillStyle = background
  context.fillRect(0, 0, EXPORT_WIDTH, EXPORT_HEIGHT)

  context.fillStyle = '#08131d'
  context.fillRect(mapRect.x, mapRect.y, mapRect.width, mapRect.height)
  context.fillStyle = 'rgba(10, 20, 31, 0.96)'
  context.fillRect(railRect.x, railRect.y, railRect.width, railRect.height)
  context.fillStyle = 'rgba(7, 18, 28, 0.94)'
  context.fillRect(0, EXPORT_HEIGHT - EXPORT_FOOTER_HEIGHT, EXPORT_WIDTH, EXPORT_FOOTER_HEIGHT)

  if (sourceCanvas && sourceCanvas.width > 0 && sourceCanvas.height > 0) {
    const fitted = fitRect(sourceCanvas.width, sourceCanvas.height, mapRect)
    context.save()
    context.beginPath()
    context.rect(mapRect.x, mapRect.y, mapRect.width, mapRect.height)
    context.clip()
    context.drawImage(sourceCanvas, fitted.x, fitted.y, fitted.width, fitted.height)
    context.restore()
  } else {
    drawFallbackScene(context, scene, mapRect)
  }

  context.strokeStyle = 'rgba(124, 185, 233, 0.24)'
  context.lineWidth = 2
  context.strokeRect(mapRect.x, mapRect.y, mapRect.width, mapRect.height)
  context.strokeStyle = 'rgba(96, 123, 147, 0.2)'
  context.strokeRect(railRect.x, railRect.y, railRect.width, railRect.height)

  applyTextStyles(context, {
    font: '700 56px "Segoe UI", sans-serif',
    color: '#eef6fb',
  })
  context.fillText('StratAtlas 4K Map Export', EXPORT_PADDING, 52)
  applyTextStyles(context, {
    font: '500 28px "Segoe UI", sans-serif',
    color: '#9eb7c9',
  })
  context.fillText(
    `${pickLabel(mode)} | ${sourceSurfaceMode === 'orbital' ? '3D Globe' : '2D Situation Map'} | ${
      sourceRuntimeEngine === 'cesium'
        ? 'Cesium'
        : sourceRuntimeEngine === 'maplibre'
          ? 'MapLibre'
          : 'Fallback runtime'
    }`,
    EXPORT_PADDING,
    118,
  )

  let chipX = EXPORT_PADDING
  chipX += drawChip(context, { label: marking, tone: 'support', x: chipX, y: 148 }) + 18
  chipX += drawChip(context, { label: 'Observed Evidence', tone: 'evidence', x: chipX, y: 148 }) + 18
  drawChip(context, { label: offline ? 'Offline export' : 'Connected export', tone: 'context', x: chipX, y: 148 })

  drawSectionTitle(context, 'Map Focus', railRect.x + 32, railRect.y + 28)
  applyTextStyles(context, {
    font: '700 34px "Segoe UI", sans-serif',
    color: '#eef6fb',
  })
  context.fillText(scene.focusOptions.find((option) => option.aoiId === focusAoiId)?.label ?? focusAoiId, railRect.x + 32, railRect.y + 64)
  applyTextStyles(context, {
    font: '500 24px "Segoe UI", sans-serif',
    color: '#9eb7c9',
  })
  const narrativeLines = wrapText(context, scene.narrative, railRect.width - 64, 4)
  drawLines(context, narrativeLines, railRect.x + 32, railRect.y + 112, 34)

  drawSectionTitle(context, 'Metrics', railRect.x + 32, railRect.y + 280)
  scene.metrics.slice(0, 4).forEach((metric, index) => {
    const y = railRect.y + 318 + index * 112
    context.fillStyle = 'rgba(11, 23, 34, 0.95)'
    context.beginPath()
    context.roundRect(railRect.x + 24, y, railRect.width - 48, 92, 24)
    context.fill()
    applyTextStyles(context, {
      font: '600 20px "Segoe UI", sans-serif',
      color: '#9eb7c9',
    })
    context.fillText(metric.label, railRect.x + 48, y + 16)
    applyTextStyles(context, {
      font: '700 30px "Segoe UI", sans-serif',
      color: '#f8fbff',
    })
    context.fillText(metric.value, railRect.x + 48, y + 42)
    applyTextStyles(context, {
      font: '500 18px "Segoe UI", sans-serif',
      color: '#7f98aa',
    })
    const lines = wrapText(context, metric.detail, railRect.width - 96, 2)
    drawLines(context, lines, railRect.x + 220, y + 44, 24)
  })

  const inspectCard = selectedInspectCard ?? scene.inspectCards[0]
  if (inspectCard) {
    drawSectionTitle(context, 'Pinned Inspect', railRect.x + 32, railRect.y + 790)
    context.fillStyle = 'rgba(12, 24, 36, 0.94)'
    context.beginPath()
    context.roundRect(railRect.x + 24, railRect.y + 828, railRect.width - 48, 220, 24)
    context.fill()
    drawChip(context, {
      label: inspectCard.category,
      tone: inspectCard.tone,
      x: railRect.x + 40,
      y: railRect.y + 848,
    })
    applyTextStyles(context, {
      font: '700 32px "Segoe UI", sans-serif',
      color: '#f8fbff',
    })
    context.fillText(inspectCard.label, railRect.x + 40, railRect.y + 904)
    applyTextStyles(context, {
      font: '500 22px "Segoe UI", sans-serif',
      color: '#9eb7c9',
    })
    const detailLines = wrapText(context, inspectCard.detail, railRect.width - 80, 4)
    drawLines(context, detailLines, railRect.x + 40, railRect.y + 950, 30)
  }

  drawSectionTitle(context, 'Legend', railRect.x + 32, railRect.y + 1080)
  scene.legend.slice(0, 6).forEach((item, index) => {
    const y = railRect.y + 1120 + index * 74
    context.fillStyle = runtimeToneColor(item.tone)
    context.beginPath()
    context.arc(railRect.x + 48, y + 18, 12, 0, Math.PI * 2)
    context.fill()
    applyTextStyles(context, {
      font: '600 22px "Segoe UI", sans-serif',
      color: '#eef6fb',
    })
    context.fillText(item.label, railRect.x + 78, y)
    applyTextStyles(context, {
      font: '500 18px "Segoe UI", sans-serif',
      color: '#7f98aa',
    })
    const detailLines = wrapText(context, item.detail, railRect.width - 126, 2)
    drawLines(context, detailLines, railRect.x + 78, y + 30, 22)
  })

  drawSectionTitle(context, 'Export Provenance', EXPORT_PADDING, EXPORT_HEIGHT - EXPORT_FOOTER_HEIGHT + 28)
  applyTextStyles(context, {
    font: '600 22px "Segoe UI", sans-serif',
    color: '#eef6fb',
  })
  context.fillText(`Generated ${formatTimestamp(generatedAt)} | Bundle ${bundleId ?? 'none'} | ${visibleLayerCount} visible governed layer(s)`, EXPORT_PADDING, EXPORT_HEIGHT - EXPORT_FOOTER_HEIGHT + 70)
  context.fillText('Labels preserved: Observed Evidence, Curated Context, Modeled Output, AI-Derived Interpretation', EXPORT_PADDING, EXPORT_HEIGHT - EXPORT_FOOTER_HEIGHT + 106)
  context.fillText('Correlated context only; not a causal explanation. Export policy remains governed by visible layer licenses and markings.', EXPORT_PADDING, EXPORT_HEIGHT - EXPORT_FOOTER_HEIGHT + 142)
  applyTextStyles(context, {
    font: '500 20px "Segoe UI", sans-serif',
    color: '#9eb7c9',
    align: 'right',
  })
  context.fillText(`AOI ${focusAoiId} | ${scene.inspectCards.length} inspect target(s) | ${scene.statusLine}`, EXPORT_WIDTH - EXPORT_PADDING, EXPORT_HEIGHT - EXPORT_FOOTER_HEIGHT + 70)

  return canvas
}

export const buildMapRuntimeExportCapture = async (
  options: BuildMapRuntimeExportCaptureOptions,
): Promise<MapRuntimeExportCapture> => {
  const generatedAt = new Date().toISOString()
  let usedSourceCanvas = Boolean(options.sourceCanvas)
  let canvas: HTMLCanvasElement
  let pngBytes: Uint8Array

  try {
    canvas = renderMapExportCanvas({
      ...options,
      generatedAt,
      sourceCanvas: options.sourceCanvas,
    })
    pngBytes = canvasToPngBytes(canvas)
  } catch {
    usedSourceCanvas = false
    canvas = renderMapExportCanvas({
      ...options,
      generatedAt,
      sourceCanvas: null,
    })
    pngBytes = canvasToPngBytes(canvas)
  }

  const artifactId = buildArtifactId({
    generatedAt,
    focusAoiId: options.focusAoiId,
    surfaceMode: options.sourceSurfaceMode,
  })

  return {
    artifactId,
    fileName: `${artifactId}.png`,
    pngBytes,
    width: canvas.width,
    height: canvas.height,
    generatedAt,
    marking: options.marking,
    bundleId: options.bundleId,
    focusAoiId: options.focusAoiId,
    surfaceMode: options.sourceSurfaceMode,
    runtimeEngine: options.sourceRuntimeEngine,
    visibleLayerCount: options.visibleLayerCount,
    usedSourceCanvas,
  }
}
