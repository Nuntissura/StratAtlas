import type { ContextDomain, ContextRecord, ContextTimeRange } from './contextIntake'
import { correlationTypeForDomain } from './contextIntake'

type GovernedSnapshotPoint = {
  observedAt: string
  cachedAt: string
  numericValue: number
  unit: string
  valueLabel: string
  confidence?: string
  verificationLevel?: ContextRecord['verification_level']
}

type GovernedDomainSnapshot = {
  snapshotId: string
  retrievedAt: string
  pipelineVersion: string
  records: GovernedSnapshotPoint[]
}

export type GovernedContextDomainTemplate = {
  domain: ContextDomain
  catalogLabel: string
  ingestionLabel: string
  snapshot: GovernedDomainSnapshot
}

const defaultTargetScope = 'AOI-correlated curated snapshot; not causal evidence.'

const buildGovernedDomain = (
  domain: ContextDomain,
  catalogLabel: string,
  ingestionLabel: string,
  snapshot: GovernedDomainSnapshot,
): GovernedContextDomainTemplate => ({
  domain,
  catalogLabel,
  ingestionLabel,
  snapshot,
})

export const GOVERNED_CONTEXT_DOMAIN_TEMPLATES: GovernedContextDomainTemplate[] = [
  buildGovernedDomain(
    {
      domain_id: 'port-throughput-monthly',
      domain_name: 'Port Throughput',
      domain_class: 'economic_indicator',
      source_name: 'UNCTAD',
      source_url: 'https://unctad.org/topic/transport-and-trade-logistics',
      license: 'public-sector publication',
      update_cadence: 'monthly',
      spatial_binding: 'point',
      temporal_resolution: 'monthly',
      sensitivity_class: 'PUBLIC',
      confidence_baseline: 'A',
      methodology_notes:
        'Curated port-throughput snapshot normalized from public port-performance reporting and correlated to the active AOI. Context remains corroborative, not causal.',
      offline_behavior: 'pre_cacheable',
      presentation_type: 'map_overlay',
      prohibited_uses: ['MUST NOT be used for individual entity tracking'],
    },
    'Tier 1 approved domain',
    'Curated UNCTAD throughput snapshot',
    {
      snapshotId: 'unctad-port-throughput-2026-03-05',
      retrievedAt: '2026-03-05T12:00:00.000Z',
      pipelineVersion: 'wp-i7-002',
      records: [
        {
          observedAt: '2026-03-06T06:00:00.000Z',
          cachedAt: '2026-03-05T12:00:00.000Z',
          numericValue: 32,
          unit: 'index',
          valueLabel: '32 index',
          confidence: 'A',
          verificationLevel: 'confirmed',
        },
        {
          observedAt: '2026-03-06T10:00:00.000Z',
          cachedAt: '2026-03-05T12:00:00.000Z',
          numericValue: 28,
          unit: 'index',
          valueLabel: '28 index',
          confidence: 'A',
          verificationLevel: 'confirmed',
        },
        {
          observedAt: '2026-03-06T14:00:00.000Z',
          cachedAt: '2026-03-05T12:00:00.000Z',
          numericValue: 24,
          unit: 'index',
          valueLabel: '24 index',
          confidence: 'A',
          verificationLevel: 'confirmed',
        },
        {
          observedAt: '2026-03-06T18:00:00.000Z',
          cachedAt: '2026-03-05T12:00:00.000Z',
          numericValue: 11,
          unit: 'index',
          valueLabel: '11 index',
          confidence: 'A',
          verificationLevel: 'confirmed',
        },
      ],
    },
  ),
  buildGovernedDomain(
    {
      domain_id: 'bilateral-trade-flows',
      domain_name: 'Bilateral Trade Flows',
      domain_class: 'trade_flow',
      source_name: 'UN Comtrade / IMF DOTS',
      source_url: 'https://comtradeplus.un.org/',
      license: 'public multilateral statistics',
      update_cadence: 'monthly',
      spatial_binding: 'region_bound',
      temporal_resolution: 'monthly',
      sensitivity_class: 'PUBLIC',
      confidence_baseline: 'B',
      methodology_notes:
        'Curated country-pair trade-flow snapshot normalized to AOI-linked trade lanes. Correlation expresses co-movement with the AOI, not proof of causation.',
      offline_behavior: 'pre_cacheable',
      presentation_type: 'sidebar_timeseries',
      prohibited_uses: ['MUST NOT be used for individual entity tracking'],
    },
    'Tier 1 approved domain',
    'Curated trade-flow snapshot',
    {
      snapshotId: 'trade-flow-snapshot-2026-03-05',
      retrievedAt: '2026-03-05T10:15:00.000Z',
      pipelineVersion: 'wp-i7-002',
      records: [
        {
          observedAt: '2026-03-06T06:00:00.000Z',
          cachedAt: '2026-03-05T10:15:00.000Z',
          numericValue: 94,
          unit: 'trade index',
          valueLabel: '94 trade index',
          confidence: 'B',
          verificationLevel: 'reported',
        },
        {
          observedAt: '2026-03-06T10:00:00.000Z',
          cachedAt: '2026-03-05T10:15:00.000Z',
          numericValue: 92,
          unit: 'trade index',
          valueLabel: '92 trade index',
          confidence: 'B',
          verificationLevel: 'reported',
        },
        {
          observedAt: '2026-03-06T14:00:00.000Z',
          cachedAt: '2026-03-05T10:15:00.000Z',
          numericValue: 87,
          unit: 'trade index',
          valueLabel: '87 trade index',
          confidence: 'B',
          verificationLevel: 'reported',
        },
        {
          observedAt: '2026-03-06T18:00:00.000Z',
          cachedAt: '2026-03-05T10:15:00.000Z',
          numericValue: 84,
          unit: 'trade index',
          valueLabel: '84 trade index',
          confidence: 'B',
          verificationLevel: 'reported',
        },
      ],
    },
  ),
  buildGovernedDomain(
    {
      domain_id: 'commodity-price-signal',
      domain_name: 'Commodity Price Signal',
      domain_class: 'commodity',
      source_name: 'World Bank Commodity Markets',
      source_url: 'https://www.worldbank.org/en/research/commodity-markets',
      license: 'public multilateral statistics',
      update_cadence: 'daily',
      spatial_binding: 'non_spatial',
      temporal_resolution: 'daily',
      sensitivity_class: 'PUBLIC',
      confidence_baseline: 'B',
      methodology_notes:
        'Curated commodity-price snapshot used as AOI-correlated context only. Latest values are online-first; offline mode exposes the cached snapshot with staleness labeling.',
      offline_behavior: 'online_only',
      presentation_type: 'dashboard_widget',
      prohibited_uses: ['MUST NOT be used for financial trading or prediction tooling'],
    },
    'Tier 1 approved domain',
    'Curated commodity-price snapshot',
    {
      snapshotId: 'commodity-price-snapshot-2026-03-06',
      retrievedAt: '2026-03-06T05:30:00.000Z',
      pipelineVersion: 'wp-i7-002',
      records: [
        {
          observedAt: '2026-03-06T06:00:00.000Z',
          cachedAt: '2026-03-06T05:30:00.000Z',
          numericValue: 101,
          unit: 'price index',
          valueLabel: '101 price index',
          confidence: 'B',
          verificationLevel: 'reported',
        },
        {
          observedAt: '2026-03-06T10:00:00.000Z',
          cachedAt: '2026-03-06T05:30:00.000Z',
          numericValue: 104,
          unit: 'price index',
          valueLabel: '104 price index',
          confidence: 'B',
          verificationLevel: 'reported',
        },
        {
          observedAt: '2026-03-06T14:00:00.000Z',
          cachedAt: '2026-03-06T05:30:00.000Z',
          numericValue: 109,
          unit: 'price index',
          valueLabel: '109 price index',
          confidence: 'B',
          verificationLevel: 'reported',
        },
        {
          observedAt: '2026-03-06T18:00:00.000Z',
          cachedAt: '2026-03-06T05:30:00.000Z',
          numericValue: 107,
          unit: 'price index',
          valueLabel: '107 price index',
          confidence: 'B',
          verificationLevel: 'reported',
        },
      ],
    },
  ),
  buildGovernedDomain(
    {
      domain_id: 'sanctions-regime-updates',
      domain_name: 'Sanctions Regime Updates',
      domain_class: 'regulatory',
      source_name: 'OFAC / EU / UN snapshots',
      source_url: 'https://sanctionssearch.ofac.treas.gov/',
      license: 'public regulatory publication',
      update_cadence: 'event-driven',
      spatial_binding: 'entity_class_bound',
      temporal_resolution: 'event-driven',
      sensitivity_class: 'PUBLIC',
      confidence_baseline: 'A',
      methodology_notes:
        'Curated sanctions snapshot normalized into aggregate AOI-linked constraint signals. Context is explicit correlation input and never individual targeting.',
      offline_behavior: 'pre_cacheable',
      presentation_type: 'constraint_node',
      prohibited_uses: ['MUST NOT be used to infer hidden organizational ties'],
    },
    'Tier 1 approved domain',
    'Curated sanctions snapshot',
    {
      snapshotId: 'sanctions-snapshot-2026-03-05',
      retrievedAt: '2026-03-05T20:45:00.000Z',
      pipelineVersion: 'wp-i7-002',
      records: [
        {
          observedAt: '2026-03-06T06:00:00.000Z',
          cachedAt: '2026-03-05T20:45:00.000Z',
          numericValue: 1,
          unit: 'regime actions',
          valueLabel: '1 regime action',
          confidence: 'A',
          verificationLevel: 'confirmed',
        },
        {
          observedAt: '2026-03-06T10:00:00.000Z',
          cachedAt: '2026-03-05T20:45:00.000Z',
          numericValue: 1,
          unit: 'regime actions',
          valueLabel: '1 regime action',
          confidence: 'A',
          verificationLevel: 'confirmed',
        },
        {
          observedAt: '2026-03-06T14:00:00.000Z',
          cachedAt: '2026-03-05T20:45:00.000Z',
          numericValue: 2,
          unit: 'regime actions',
          valueLabel: '2 regime actions',
          confidence: 'A',
          verificationLevel: 'confirmed',
        },
        {
          observedAt: '2026-03-06T18:00:00.000Z',
          cachedAt: '2026-03-05T20:45:00.000Z',
          numericValue: 2,
          unit: 'regime actions',
          valueLabel: '2 regime actions',
          confidence: 'A',
          verificationLevel: 'confirmed',
        },
      ],
    },
  ),
]

export const DEFAULT_GOVERNED_CONTEXT_DOMAIN_ID =
  GOVERNED_CONTEXT_DOMAIN_TEMPLATES[0]?.domain.domain_id ?? ''

const cloneContextDomain = (domain: ContextDomain): ContextDomain => ({
  ...domain,
  prohibited_uses: domain.prohibited_uses ? [...domain.prohibited_uses] : undefined,
})

export const getGovernedDomainTemplate = (
  domainId: string,
): GovernedContextDomainTemplate | undefined =>
  GOVERNED_CONTEXT_DOMAIN_TEMPLATES.find((entry) => entry.domain.domain_id === domainId)

export const buildGovernedDomainDraft = (domainId: string): ContextDomain => {
  const template = getGovernedDomainTemplate(domainId) ?? GOVERNED_CONTEXT_DOMAIN_TEMPLATES[0]
  return cloneContextDomain(template.domain)
}

export const resolveGovernedDomainRegistration = (draft: ContextDomain): ContextDomain | null => {
  const template = getGovernedDomainTemplate(draft.domain_id)
  if (!template) {
    return null
  }

  return {
    ...cloneContextDomain(template.domain),
    presentation_type: draft.presentation_type,
    offline_behavior: draft.offline_behavior,
  }
}

export const materializeGovernedContextRecords = ({
  domain,
  targetId,
  timeRange,
}: {
  domain: ContextDomain
  targetId: string
  timeRange: ContextTimeRange
}): ContextRecord[] => {
  const template = getGovernedDomainTemplate(domain.domain_id)
  if (!template) {
    return []
  }

  return template.snapshot.records
    .filter(
      (record) => record.observedAt >= timeRange.start && record.observedAt <= timeRange.end,
    )
    .map((record, index) => ({
      record_id: `${domain.domain_id}-${targetId}-${index + 1}`,
      domain_id: domain.domain_id,
      correlation_type: correlationTypeForDomain(domain),
      target_id: targetId,
    observed_at: record.observedAt,
    value_label: record.valueLabel,
    numeric_value: record.numericValue,
    unit: record.unit,
    source_name: domain.source_name,
    source_url: domain.source_url,
    license: domain.license,
    update_cadence: domain.update_cadence,
    confidence: record.confidence ?? domain.confidence_baseline,
    cached_at: record.cachedAt,
    lineage: [
      `governed.catalog:${domain.domain_id}`,
      `snapshot:${template.snapshot.snapshotId}`,
      `retrieved:${template.snapshot.retrievedAt}`,
      `pipeline:${template.snapshot.pipelineVersion}`,
      `target:${targetId}`,
      defaultTargetScope,
      ],
      verification_level: record.verificationLevel,
    }))
}

export const describeGovernedDomainIngestion = (domainId: string): string => {
  const template = getGovernedDomainTemplate(domainId)
  return template ? template.ingestionLabel : 'Governed context snapshot'
}
