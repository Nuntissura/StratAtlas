import type { ContextDomain } from '../i7/contextIntake'

export interface ComparisonWindow {
  start: string
  end: string
  label: string
}

export type DeltaSeverity = 'decrease' | 'stable' | 'increase'

export interface DeltaCell {
  cell_id: string
  baseline: number
  event: number
  delta: number
  severity: DeltaSeverity
}

export interface DensityDeltaResult {
  baseline: number[]
  event: number[]
  delta: number[]
}

export interface CompareDashboardSummary {
  baselineWindow: ComparisonWindow
  eventWindow: ComparisonWindow
  cells: DeltaCell[]
  summary: string
  totalDelta: number
  maxAbsoluteDelta: number
}

export interface ContextOverlaySummary {
  domain_id: string
  domain_name: string
  source_name: string
  update_cadence: string
  confidence_baseline: string
  presentation_type: ContextDomain['presentation_type']
  relationship: string
}

export interface CompareStateSnapshot {
  baselineWindow: ComparisonWindow
  eventWindow: ComparisonWindow
  baselineSeries: number[]
  eventSeries: number[]
}

type ArtifactMarking = 'PUBLIC' | 'INTERNAL' | 'RESTRICTED'

export interface BriefingBundle {
  baselineWindow: string
  eventWindow: string
  summary: string
  delta: number[]
}

export interface BriefingArtifactPreview {
  artifactId: string
  label: 'Observed Evidence'
  summary: string
  bundleId?: string
  marking: ArtifactMarking
  baselineWindow: ComparisonWindow
  eventWindow: ComparisonWindow
  deltaCellCount: number
  totalDelta: number
  overlayDomainIds: string[]
  exportStatus: 'ready' | 'bundle_required'
  offline: boolean
}

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export const buildComparisonWindow = (
  kind: 'Baseline' | 'Event',
  start: string,
  end: string,
): ComparisonWindow => ({
  start,
  end,
  label: start === end ? start : `${kind} ${start} -> ${end}`,
})

export const buildCompareStateSnapshot = ({
  baselineWindow,
  eventWindow,
  baselineSeries,
  eventSeries,
}: CompareStateSnapshot): CompareStateSnapshot => ({
  baselineWindow: { ...baselineWindow },
  eventWindow: { ...eventWindow },
  baselineSeries: [...baselineSeries],
  eventSeries: [...eventSeries],
})

export const computeDensityDelta = (
  baseline: number[],
  event: number[],
): DensityDeltaResult => {
  const maxLength = Math.max(baseline.length, event.length)
  const base = [...baseline]
  const evt = [...event]

  while (base.length < maxLength) {
    base.push(0)
  }
  while (evt.length < maxLength) {
    evt.push(0)
  }

  return {
    baseline: base,
    event: evt,
    delta: base.map((value, index) => evt[index] - value),
  }
}

const classifyDeltaSeverity = (delta: number, maxAbsoluteDelta: number): DeltaSeverity => {
  if (maxAbsoluteDelta === 0 || Math.abs(delta) < Math.max(1, maxAbsoluteDelta * 0.25)) {
    return 'stable'
  }
  return delta > 0 ? 'increase' : 'decrease'
}

export const buildDeltaCells = (baseline: number[], event: number[]): DeltaCell[] => {
  const result = computeDensityDelta(baseline, event)
  const maxAbsoluteDelta = Math.max(...result.delta.map((value) => Math.abs(value)), 0)

  return result.delta.map((delta, index) => ({
    cell_id: `cell-${index}`,
    baseline: result.baseline[index],
    event: result.event[index],
    delta,
    severity: classifyDeltaSeverity(delta, maxAbsoluteDelta),
  }))
}

export const buildCompareDashboard = (
  baselineWindow: ComparisonWindow,
  eventWindow: ComparisonWindow,
  baseline: number[],
  event: number[],
): CompareDashboardSummary => {
  const cells = buildDeltaCells(baseline, event)
  const totalDelta = cells.reduce((sum, cell) => sum + cell.delta, 0)
  const maxAbsoluteDelta = Math.max(...cells.map((cell) => Math.abs(cell.delta)), 0)

  return {
    baselineWindow,
    eventWindow,
    cells,
    totalDelta,
    maxAbsoluteDelta,
    summary: `Delta generated across ${cells.length} cells from ${baselineWindow.label} to ${eventWindow.label}`,
  }
}

export const buildContextOverlaySummaries = (
  domains: ContextDomain[],
  activeDomainIds: string[],
  totalDelta: number,
): ContextOverlaySummary[] =>
  domains
    .filter((domain) => activeDomainIds.includes(domain.domain_id))
    .map((domain) => ({
      domain_id: domain.domain_id,
      domain_name: domain.domain_name,
      source_name: domain.source_name,
      update_cadence: domain.update_cadence,
      confidence_baseline: domain.confidence_baseline,
      presentation_type: domain.presentation_type,
      relationship:
        totalDelta > 0
          ? 'Corroborates rising delta conditions'
          : totalDelta < 0
            ? 'Corroborates declining delta conditions'
            : 'Context watch item for a stable delta window',
    }))

export const buildBriefingBundle = (
  baselineWindow: string,
  eventWindow: string,
  delta: number[],
): BriefingBundle => ({
  baselineWindow,
  eventWindow,
  summary: `Delta generated across ${delta.length} cells`,
  delta,
})

export const buildBriefingArtifactPreview = ({
  bundleId,
  marking,
  dashboard,
  overlaySummaries,
  offline,
}: {
  bundleId?: string
  marking: ArtifactMarking
  dashboard: CompareDashboardSummary
  overlaySummaries: ContextOverlaySummary[]
  offline: boolean
}): BriefingArtifactPreview => ({
  artifactId: `brief-${slugify(bundleId ?? 'bundle-required')}-${slugify(dashboard.baselineWindow.label)}-${slugify(dashboard.eventWindow.label)}`,
  label: 'Observed Evidence',
  summary: `${dashboard.summary}; overlays ${overlaySummaries.length}; total delta ${dashboard.totalDelta}.`,
  bundleId,
  marking,
  baselineWindow: dashboard.baselineWindow,
  eventWindow: dashboard.eventWindow,
  deltaCellCount: dashboard.cells.length,
  totalDelta: dashboard.totalDelta,
  overlayDomainIds: overlaySummaries.map((overlay) => overlay.domain_id),
  exportStatus: bundleId ? 'ready' : 'bundle_required',
  offline,
})
