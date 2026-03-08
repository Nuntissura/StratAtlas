import {
  allowsMapPointRendering,
  type ContextDomain,
  type PresentationType,
} from '../i7/contextIntake'

export type GeometryType = 'point' | 'line' | 'polygon' | 'raster'

export type SensitivityClass = 'PUBLIC' | 'INTERNAL' | 'RESTRICTED'

export type CachingPolicy = 'none' | 'memory' | 'disk'

export type ArtifactLabel =
  | 'Observed Evidence'
  | 'Curated Context'
  | 'Modeled Output'
  | 'AI-Derived Interpretation'

export type RenderSurface = 'main_canvas' | 'right_panel' | 'dashboard_widget'

export interface LayerDeclaration {
  layerId: string
  source: string
  license: string
  cadence: string
  geometryType: GeometryType
  sensitivityClass: SensitivityClass
  cachingPolicy: CachingPolicy
}

export interface LayerCatalogEntry extends LayerDeclaration {
  title: string
  artifactLabel: ArtifactLabel
  renderSurface: RenderSurface
  confidenceText: string
  uncertaintyText?: string
  exportAllowed: boolean
  visible: boolean
  degraded: boolean
}

export interface ExportPolicy {
  allowRestrictedExport: boolean
  allowedLicenses: string[]
}

export interface WorkspaceLayerCatalogOptions {
  activeLayerIds: string[]
  activeDomainIds: string[]
  domains: ContextDomain[]
  allowRestrictedExport: boolean
  allowedLicenses: string[]
  aiSummaryAvailable: boolean
  degradeRendering: boolean
  modelUncertaintyText: string
}

export const ARTIFACT_LABELS: ArtifactLabel[] = [
  'Observed Evidence',
  'Curated Context',
  'Modeled Output',
  'AI-Derived Interpretation',
]

export const artifactTone = (label: ArtifactLabel): 'evidence' | 'context' | 'model' | 'ai' => {
  if (label === 'Curated Context') {
    return 'context'
  }
  if (label === 'Modeled Output') {
    return 'model'
  }
  if (label === 'AI-Derived Interpretation') {
    return 'ai'
  }
  return 'evidence'
}

const presentationSurface = (presentationType: PresentationType): RenderSurface => {
  if (presentationType === 'dashboard_widget') {
    return 'dashboard_widget'
  }
  if (presentationType === 'sidebar_timeseries' || presentationType === 'constraint_node') {
    return 'right_panel'
  }
  return 'main_canvas'
}

const presentationGeometry = (presentationType: PresentationType): GeometryType => {
  if (presentationType === 'map_overlay') {
    return 'point'
  }
  if (presentationType === 'constraint_node') {
    return 'polygon'
  }
  return 'raster'
}

export class LayerRegistry {
  private readonly layers = new Map<string, LayerDeclaration>()

  register(layer: LayerDeclaration): void {
    this.layers.set(layer.layerId, layer)
  }

  get(layerId: string): LayerDeclaration | undefined {
    return this.layers.get(layerId)
  }

  list(): LayerDeclaration[] {
    return [...this.layers.values()]
  }

  canExport(layerId: string, policy: ExportPolicy): boolean {
    const layer = this.layers.get(layerId)
    if (!layer) {
      return false
    }
    const normalizedLicense = layer.license.trim().toLowerCase()
    const licenseAllowed = policy.allowedLicenses.some((allowedLicense) => {
      const normalizedAllowed = allowedLicense.trim().toLowerCase()
      return (
        normalizedLicense === normalizedAllowed ||
        (normalizedAllowed === 'public' && normalizedLicense.startsWith('public'))
      )
    })
    if (!licenseAllowed) {
      return false
    }
    if (layer.sensitivityClass === 'RESTRICTED' && !policy.allowRestrictedExport) {
      return false
    }
    return true
  }
}

export const buildWorkspaceLayerCatalog = (
  options: WorkspaceLayerCatalogOptions,
): LayerCatalogEntry[] => {
  const registry = new LayerRegistry()
  const exportPolicy = {
    allowRestrictedExport: options.allowRestrictedExport,
    allowedLicenses: options.allowedLicenses,
  }

  const baseEntries: LayerCatalogEntry[] = [
    {
      layerId: 'base-map',
      title: 'Observed Basemap',
      source: 'Recorder workspace',
      license: 'internal',
      cadence: 'static',
      geometryType: 'polygon',
      sensitivityClass: 'PUBLIC',
      cachingPolicy: 'disk',
      artifactLabel: 'Observed Evidence',
      renderSurface: 'main_canvas',
      confidenceText: 'Primary workspace geometry',
      exportAllowed: true,
      visible: options.activeLayerIds.includes('base-map'),
      degraded: options.degradeRendering,
    },
    {
      layerId: 'context-panel',
      title: 'Context Correlation Panel',
      source: 'Context registry',
      license: 'internal',
      cadence: 'event',
      geometryType: 'raster',
      sensitivityClass: 'INTERNAL',
      cachingPolicy: 'disk',
      artifactLabel: 'Curated Context',
      renderSurface: 'right_panel',
      confidenceText: 'Displays curated source, cadence, and confidence metadata',
      exportAllowed: false,
      visible: options.activeLayerIds.includes('context-panel'),
      degraded: false,
    },
    {
      layerId: 'audit-overlay',
      title: 'Audit Overlay',
      source: 'Audit ledger',
      license: 'internal',
      cadence: 'event',
      geometryType: 'line',
      sensitivityClass: 'INTERNAL',
      cachingPolicy: 'disk',
      artifactLabel: 'Observed Evidence',
      renderSurface: 'main_canvas',
      confidenceText: 'Hash-chained recorder events',
      exportAllowed: true,
      visible: options.activeLayerIds.includes('audit-overlay'),
      degraded: options.degradeRendering,
    },
    {
      layerId: 'bundle-metadata',
      title: 'Bundle Metadata',
      source: 'Bundle manifest',
      license: 'internal',
      cadence: 'event',
      geometryType: 'raster',
      sensitivityClass: 'INTERNAL',
      cachingPolicy: 'disk',
      artifactLabel: 'Observed Evidence',
      renderSurface: 'right_panel',
      confidenceText: 'Manifest-backed recorder metadata',
      exportAllowed: true,
      visible: options.activeLayerIds.includes('bundle-metadata'),
      degraded: false,
    },
  ]

  for (const entry of baseEntries) {
    registry.register(entry)
  }

  const curatedContextEntries = options.domains.map((domain) => {
    const layerId = `context-${domain.domain_id}`
    const declaration: LayerDeclaration = {
      layerId,
      source: domain.source_name,
      license: domain.license,
      cadence: domain.update_cadence,
      geometryType: presentationGeometry(domain.presentation_type),
      sensitivityClass: domain.sensitivity_class,
      cachingPolicy: domain.offline_behavior === 'pre_cacheable' ? 'disk' : 'memory',
    }
    registry.register(declaration)
    return {
      ...declaration,
      title: domain.domain_name,
      artifactLabel: 'Curated Context' as const,
      renderSurface: presentationSurface(domain.presentation_type),
      confidenceText: `Confidence ${domain.confidence_baseline}`,
      exportAllowed: registry.canExport(layerId, exportPolicy),
      visible: options.activeDomainIds.includes(domain.domain_id),
      degraded: options.degradeRendering && allowsMapPointRendering(domain),
    }
  })

  const analyticEntries: LayerCatalogEntry[] = [
    {
      layerId: 'modeled-output',
      title: 'Impact Proxy',
      source: 'Strategic model shell',
      license: 'internal',
      cadence: 'scenario',
      geometryType: 'polygon',
      sensitivityClass: 'INTERNAL',
      cachingPolicy: 'memory',
      artifactLabel: 'Modeled Output',
      renderSurface: 'main_canvas',
      confidenceText: 'Scenario-driven estimate',
      uncertaintyText: options.modelUncertaintyText,
      exportAllowed: true,
      visible: true,
      degraded: options.degradeRendering,
    },
    {
      layerId: 'ai-interpretation',
      title: 'AI Summary',
      source: 'Local AI gateway',
      license: 'internal',
      cadence: 'on-demand',
      geometryType: 'raster',
      sensitivityClass: 'INTERNAL',
      cachingPolicy: 'none',
      artifactLabel: 'AI-Derived Interpretation',
      renderSurface: 'right_panel',
      confidenceText: 'Analyst acceptance required',
      uncertaintyText: 'Do not treat as observed evidence.',
      exportAllowed: false,
      visible: options.aiSummaryAvailable,
      degraded: false,
    },
  ]

  return [...baseEntries, ...curatedContextEntries, ...analyticEntries]
}
