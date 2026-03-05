export type DomainClass =
  | 'trade_flow'
  | 'commodity'
  | 'infrastructure'
  | 'osint_event'
  | 'regulatory'
  | 'environmental'
  | 'demographic'
  | 'economic_indicator'

export type SpatialBinding =
  | 'point'
  | 'polygon'
  | 'corridor'
  | 'aoi_correlated'
  | 'non_spatial'
  | 'region_bound'
  | 'entity_class_bound'

export type PresentationType =
  | 'map_overlay'
  | 'sidebar_timeseries'
  | 'dashboard_widget'
  | 'constraint_node'

export interface ContextDomain {
  domain_id: string
  domain_name: string
  domain_class: DomainClass
  source_name: string
  source_url: string
  license: string
  update_cadence: string
  spatial_binding: SpatialBinding
  temporal_resolution: string
  sensitivity_class: 'PUBLIC' | 'INTERNAL' | 'RESTRICTED'
  confidence_baseline: string
  methodology_notes: string
  offline_behavior: 'pre_cacheable' | 'online_only'
  presentation_type: PresentationType
}

export const validateDomainRegistration = (domain: ContextDomain): boolean =>
  Boolean(
    domain.domain_id &&
      domain.domain_name &&
      domain.source_name &&
      domain.source_url &&
      domain.license,
  )

export const allowsMapPointRendering = (domain: ContextDomain): boolean =>
  domain.presentation_type === 'map_overlay'
