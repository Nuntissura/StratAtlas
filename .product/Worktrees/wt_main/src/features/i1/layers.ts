import {
  allowsMapPointRendering,
  type ContextDomain,
  type PresentationType,
} from '../i7/contextIntake'
import { STATIC_INSTALLATION_LAYER_DEFINITIONS } from './staticInstallations'

export type GeometryType = 'point' | 'line' | 'polygon' | 'raster'

export type SensitivityClass = 'PUBLIC' | 'INTERNAL' | 'RESTRICTED'

export type CachingPolicy = 'none' | 'memory' | 'disk'

export type ArtifactLabel =
  | 'Observed Evidence'
  | 'Curated Context'
  | 'Modeled Output'
  | 'AI-Derived Interpretation'

export type RenderSurface = 'main_canvas' | 'right_panel' | 'dashboard_widget'

export const LAYER_FAMILY_IDS = [
  'verified-workspace',
  'static-installations',
  'commercial-air',
  'satellite-coverage',
  'maritime-awareness',
  'specialized-infrastructure',
] as const

export type LayerFamilyId = (typeof LAYER_FAMILY_IDS)[number]

export type LayerFamilyState =
  | 'available'
  | 'unavailable'
  | 'static-only'
  | 'live'
  | 'delayed'
  | 'heuristic'
  | 'licensed'
  | 'blocked'

export type LayerFamilyVisibilityState = Record<LayerFamilyId, boolean>

export type LayerFamilyExpandedState = Record<LayerFamilyId, boolean>

export interface LayerDeclaration {
  layerId: string
  source: string
  license: string
  cadence: string
  geometryType: GeometryType
  sensitivityClass: SensitivityClass
  cachingPolicy: CachingPolicy
  familyId?: LayerFamilyId
}

export interface LayerCatalogEntry extends LayerDeclaration {
  title: string
  artifactLabel: ArtifactLabel
  renderSurface: RenderSurface
  confidenceText: string
  uncertaintyText?: string
  sourceUrl?: string
  coverageText?: string
  exportAllowed: boolean
  selected: boolean
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
  familyVisibility?: Partial<LayerFamilyVisibilityState>
}

export interface LayerFamilyCatalogEntry {
  familyId: LayerFamilyId
  title: string
  description: string
  strategicUse: string
  queueOwner: string
  state: LayerFamilyState
  stateLabel: string
  stateDetail: string
  availableInBuild: boolean
  toggleDisabled: boolean
  visible: boolean
  expanded: boolean
  memberEntries: LayerCatalogEntry[]
  memberLayerIds: string[]
  selectedMemberCount: number
  visibleMemberCount: number
}

interface LayerFamilyDefinition {
  familyId: LayerFamilyId
  title: string
  description: string
  strategicUse: string
  queueOwner: string
  state: LayerFamilyState
  stateDetail: string
  realizedState?: LayerFamilyState
  realizedStateDetail?: string
  defaultVisible: boolean
  defaultExpanded: boolean
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

const LAYER_FAMILY_DEFINITIONS: LayerFamilyDefinition[] = [
  {
    familyId: 'verified-workspace',
    title: 'Verified Workspace Layers',
    description:
      'The currently shipped map-support layers: basemap, context panel, audit overlay, and bundle metadata.',
    strategicUse:
      'Keeps the existing recorded evidence and support surfaces controllable without flattening them into a raw toggle list.',
    queueOwner: 'WP-I1-008',
    state: 'available',
    stateDetail: 'This build already ships the family and persists its visibility state.',
    defaultVisible: true,
    defaultExpanded: true,
  },
  {
    familyId: 'static-installations',
    title: 'Static Installations',
    description:
      'Airports, ports, dams, power plants, and curated military facilities will land here as source-backed static layers.',
    strategicUse:
      'Provides durable baseline infrastructure context for compare, scenario, and export workflows.',
    queueOwner: 'WP-I1-009',
    state: 'unavailable',
    stateDetail: 'Static source path is defined, but payload layers are not loaded in this build yet.',
    realizedState: 'static-only',
    realizedStateDetail:
      'This family ships as a curated static snapshot with explicit source, cadence, and coverage limits. It does not imply live operational state.',
    defaultVisible: false,
    defaultExpanded: false,
  },
  {
    familyId: 'commercial-air',
    title: 'Commercial Air and Flight Awareness',
    description:
      'Governed commercial air traffic plus separately labeled flight-awareness overlays will use this family.',
    strategicUse:
      'Adds mobility context for route disruption, throughput pressure, and cross-AOI comparison without implying pursuit use.',
    queueOwner: 'WP-I1-010',
    state: 'unavailable',
    stateDetail: 'The source contract exists, but live/delayed payload layers are not implemented in this build.',
    defaultVisible: false,
    defaultExpanded: false,
  },
  {
    familyId: 'satellite-coverage',
    title: 'Satellite Orbit and Coverage',
    description:
      'Propagated points, tracks, and footprints will surface here once the satellite packet lands.',
    strategicUse:
      'Supports strategic context about orbital coverage and timing inside replay, compare, and scenario views.',
    queueOwner: 'WP-I1-011',
    state: 'unavailable',
    stateDetail: 'The family is reserved in the dock, but no orbital payload is loaded in this build.',
    defaultVisible: false,
    defaultExpanded: false,
  },
  {
    familyId: 'maritime-awareness',
    title: 'Maritime Traffic and Port Awareness',
    description:
      'Commercial shipping and maritime-awareness overlays will appear here once the governed source path is resolved.',
    strategicUse:
      'Adds route and port awareness for chokepoints, diversion analysis, and infrastructure correlation.',
    queueOwner: 'WP-I1-012',
    state: 'blocked',
    stateDetail: 'Blocked by WP-GOV-MAPDATA-002 until maritime source truth and licensing are governed.',
    defaultVisible: false,
    defaultExpanded: false,
  },
  {
    familyId: 'specialized-infrastructure',
    title: 'Industrial and Water Infrastructure',
    description:
      'Refineries, treatment plants, and processing sites will be grouped here as composite static context.',
    strategicUse:
      'Adds strategic context around throughput, resilience, and infrastructure dependency for modeling and briefings.',
    queueOwner: 'WP-I1-013',
    state: 'unavailable',
    stateDetail:
      'Composite source coverage is planned, but specialized infrastructure payload layers are not loaded yet.',
    defaultVisible: false,
    defaultExpanded: false,
  },
]

const stateLabel = (state: LayerFamilyState): string => {
  switch (state) {
    case 'static-only':
      return 'Static-only'
    case 'live':
      return 'Live'
    case 'delayed':
      return 'Delayed'
    case 'heuristic':
      return 'Heuristic'
    case 'licensed':
      return 'Licensed'
    case 'blocked':
      return 'Blocked'
    case 'available':
      return 'Available'
    default:
      return 'Unavailable'
  }
}

export const createDefaultLayerFamilyVisibility = (): LayerFamilyVisibilityState => ({
  'verified-workspace': true,
  'static-installations': false,
  'commercial-air': false,
  'satellite-coverage': false,
  'maritime-awareness': false,
  'specialized-infrastructure': false,
})

export const createDefaultLayerFamilyExpandedState = (): LayerFamilyExpandedState => ({
  'verified-workspace': true,
  'static-installations': false,
  'commercial-air': false,
  'satellite-coverage': false,
  'maritime-awareness': false,
  'specialized-infrastructure': false,
})

const resolveLayerFamilyVisibility = (
  familyVisibility?: Partial<LayerFamilyVisibilityState>,
): LayerFamilyVisibilityState => ({
  ...createDefaultLayerFamilyVisibility(),
  ...(familyVisibility ?? {}),
})

const resolveLayerFamilyExpanded = (
  familyExpanded?: Partial<LayerFamilyExpandedState>,
): LayerFamilyExpandedState => ({
  ...createDefaultLayerFamilyExpandedState(),
  ...(familyExpanded ?? {}),
})

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
  const familyVisibility = resolveLayerFamilyVisibility(options.familyVisibility)
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
      familyId: 'verified-workspace',
      artifactLabel: 'Observed Evidence',
      renderSurface: 'main_canvas',
      confidenceText: 'Primary workspace geometry',
      exportAllowed: true,
      selected: options.activeLayerIds.includes('base-map'),
      visible:
        options.activeLayerIds.includes('base-map') && familyVisibility['verified-workspace'],
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
      familyId: 'verified-workspace',
      artifactLabel: 'Curated Context',
      renderSurface: 'right_panel',
      confidenceText: 'Displays curated source, cadence, and confidence metadata',
      exportAllowed: false,
      selected: options.activeLayerIds.includes('context-panel'),
      visible:
        options.activeLayerIds.includes('context-panel') && familyVisibility['verified-workspace'],
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
      familyId: 'verified-workspace',
      artifactLabel: 'Observed Evidence',
      renderSurface: 'main_canvas',
      confidenceText: 'Hash-chained recorder events',
      exportAllowed: true,
      selected: options.activeLayerIds.includes('audit-overlay'),
      visible:
        options.activeLayerIds.includes('audit-overlay') && familyVisibility['verified-workspace'],
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
      familyId: 'verified-workspace',
      artifactLabel: 'Observed Evidence',
      renderSurface: 'right_panel',
      confidenceText: 'Manifest-backed recorder metadata',
      exportAllowed: true,
      selected: options.activeLayerIds.includes('bundle-metadata'),
      visible:
        options.activeLayerIds.includes('bundle-metadata') &&
        familyVisibility['verified-workspace'],
      degraded: false,
    },
  ]

  for (const entry of baseEntries) {
    registry.register(entry)
  }

  const staticEntries = STATIC_INSTALLATION_LAYER_DEFINITIONS.map((definition) => {
    const declaration: LayerDeclaration = {
      layerId: definition.layerId,
      source: definition.source,
      license: definition.license,
      cadence: definition.cadence,
      geometryType: 'point',
      sensitivityClass: definition.sensitivityClass,
      cachingPolicy: 'disk',
      familyId: 'static-installations',
    }
    registry.register(declaration)
    return {
      ...declaration,
      title: definition.title,
      artifactLabel: 'Curated Context' as const,
      renderSurface: 'main_canvas' as const,
      confidenceText: definition.confidenceText,
      uncertaintyText: definition.uncertaintyText,
      sourceUrl: definition.sourceUrl,
      coverageText: definition.coverageText,
      exportAllowed: registry.canExport(definition.layerId, exportPolicy),
      selected: options.activeLayerIds.includes(definition.layerId),
      visible:
        options.activeLayerIds.includes(definition.layerId) &&
        familyVisibility['static-installations'],
      degraded: options.degradeRendering,
    }
  })

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
      selected: options.activeDomainIds.includes(domain.domain_id),
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
      selected: true,
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
      selected: options.aiSummaryAvailable,
      visible: options.aiSummaryAvailable,
      degraded: false,
    },
  ]

  return [...baseEntries, ...staticEntries, ...curatedContextEntries, ...analyticEntries]
}

export const buildLayerFamilyCatalog = ({
  layerCatalog,
  familyVisibility,
  familyExpanded,
}: {
  layerCatalog: LayerCatalogEntry[]
  familyVisibility?: Partial<LayerFamilyVisibilityState>
  familyExpanded?: Partial<LayerFamilyExpandedState>
}): LayerFamilyCatalogEntry[] => {
  const resolvedVisibility = resolveLayerFamilyVisibility(familyVisibility)
  const resolvedExpanded = resolveLayerFamilyExpanded(familyExpanded)
  const entriesByFamily = new Map<LayerFamilyId, LayerCatalogEntry[]>()

  for (const entry of layerCatalog) {
    if (!entry.familyId) {
      continue
    }
    const familyEntries = entriesByFamily.get(entry.familyId) ?? []
    familyEntries.push(entry)
    entriesByFamily.set(entry.familyId, familyEntries)
  }

  return LAYER_FAMILY_DEFINITIONS.map((definition) => {
    const memberEntries = entriesByFamily.get(definition.familyId) ?? []
    const availableInBuild = memberEntries.length > 0
    const activeState = availableInBuild ? definition.realizedState ?? 'available' : definition.state
    const activeStateDetail = availableInBuild
      ? definition.realizedStateDetail ??
        'This family is live in the current build and persists across recorder saves and bundle reopen.'
      : definition.stateDetail
    return {
      familyId: definition.familyId,
      title: definition.title,
      description: definition.description,
      strategicUse: definition.strategicUse,
      queueOwner: definition.queueOwner,
      state: activeState,
      stateLabel: stateLabel(activeState),
      stateDetail: activeStateDetail,
      availableInBuild,
      toggleDisabled: !availableInBuild,
      visible: resolvedVisibility[definition.familyId],
      expanded: resolvedExpanded[definition.familyId],
      memberEntries,
      memberLayerIds: memberEntries.map((entry) => entry.layerId),
      selectedMemberCount: memberEntries.filter((entry) => entry.selected).length,
      visibleMemberCount: memberEntries.filter((entry) => entry.visible).length,
    }
  })
}
