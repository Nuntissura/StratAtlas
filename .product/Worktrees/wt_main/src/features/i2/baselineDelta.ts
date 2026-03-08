import type { ContextDomain } from '../i7/contextIntake'

export interface ComparisonWindow {
  start: string
  end: string
  label: string
}

export type DeltaSeverity = 'decrease' | 'stable' | 'increase'

export interface DeltaCell {
  cell_id: string
  aoiId: string
  aoiLabel: string
  baseline: number
  event: number
  delta: number
  severity: DeltaSeverity
  shareOfDelta: number
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
  focusAoiId: string
  focusAoiLabel: string
  increaseCount: number
  decreaseCount: number
  stableCount: number
}

export interface ContextOverlaySummary {
  domain_id: string
  domain_name: string
  source_name: string
  update_cadence: string
  confidence_baseline: string
  presentation_type: ContextDomain['presentation_type']
  focusAoiId: string
  focusAoiLabel: string
  relationship: string
}

type ArtifactMarking = 'PUBLIC' | 'INTERNAL' | 'RESTRICTED'

export interface CompareArtifact {
  artifactId: string
  bundleId?: string
  marking: ArtifactMarking
  summary: string
  baselineWindow: ComparisonWindow
  eventWindow: ComparisonWindow
  totalDelta: number
  focusAoiId: string
  focusAoiLabel: string
  deltaCellIds: string[]
  overlayDomainIds: string[]
  generatedAt: string
  exportFingerprint: string
  offline: boolean
}

export interface BriefingSection {
  sectionId: string
  title: string
  artifactLabel: 'Observed Evidence' | 'Curated Context'
  summary: string
  aoiId: string
}

export interface BriefingBundle {
  artifactId: string
  compareArtifactId: string
  bundleId?: string
  marking: ArtifactMarking
  baselineWindow: string
  eventWindow: string
  summary: string
  totalDelta: number
  focusAoiId: string
  focusAoiLabel: string
  delta: number[]
  deltaCellIds: string[]
  overlayDomainIds: string[]
  sections: BriefingSection[]
  exportFingerprint: string
  generatedAt: string
  offline: boolean
  exportStatus: 'ready' | 'bundle_required'
}

export interface BriefingArtifactPreview {
  artifactId: string
  label: 'Observed Evidence'
  summary: string
  bundleId?: string
  compareArtifactId: string
  marking: ArtifactMarking
  baselineWindow: ComparisonWindow
  eventWindow: ComparisonWindow
  deltaCellCount: number
  totalDelta: number
  focusAoiId: string
  focusAoiLabel: string
  overlayDomainIds: string[]
  exportStatus: 'ready' | 'bundle_required'
  offline: boolean
  generatedAt: string
  exportFingerprint: string
  sectionTitles: string[]
}

export interface CompareStateSnapshot {
  baselineWindow: ComparisonWindow
  eventWindow: ComparisonWindow
  baselineSeries: number[]
  eventSeries: number[]
  compareArtifact?: CompareArtifact
  briefingArtifact?: BriefingArtifactPreview
  briefingBundle?: BriefingBundle
}

interface CompareAoiDefinition {
  aoiId: string
  aoiLabel: string
}

const COMPARE_AOIS: CompareAoiDefinition[] = [
  { aoiId: 'aoi-1', aoiLabel: 'Singapore Strait' },
  { aoiId: 'aoi-2', aoiLabel: 'Jebel Ali Corridor' },
  { aoiId: 'aoi-3', aoiLabel: 'Mumbai Coast' },
  { aoiId: 'aoi-4', aoiLabel: 'Rotterdam Delta' },
  { aoiId: 'aoi-7', aoiLabel: 'Suez Gateway' },
]

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const normalizeJson = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map((entry) => normalizeJson(entry))
  }
  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, entry]) => [key, normalizeJson(entry)]),
    )
  }
  return value
}

const stableSerialize = (value: unknown): string => JSON.stringify(normalizeJson(value))

const stableFingerprint = (value: unknown, prefix: string): string => {
  const serialized = stableSerialize(value)
  let hash = 2166136261
  for (let index = 0; index < serialized.length; index += 1) {
    hash ^= serialized.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return `${prefix}-${(hash >>> 0).toString(16).padStart(8, '0')}`
}

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const compareAoiForIndex = (index: number): CompareAoiDefinition =>
  COMPARE_AOIS[index] ?? {
    aoiId: `aoi-${index + 1}`,
    aoiLabel: `AOI ${index + 1}`,
  }

const cloneComparisonWindow = (window: ComparisonWindow): ComparisonWindow => ({
  ...window,
})

const cloneCompareArtifact = (artifact: CompareArtifact): CompareArtifact => ({
  ...artifact,
  baselineWindow: cloneComparisonWindow(artifact.baselineWindow),
  eventWindow: cloneComparisonWindow(artifact.eventWindow),
  deltaCellIds: [...artifact.deltaCellIds],
  overlayDomainIds: [...artifact.overlayDomainIds],
})

const cloneBriefingSection = (section: BriefingSection): BriefingSection => ({
  ...section,
})

const cloneBriefingBundle = (bundle: BriefingBundle): BriefingBundle => ({
  ...bundle,
  delta: [...bundle.delta],
  deltaCellIds: [...bundle.deltaCellIds],
  overlayDomainIds: [...bundle.overlayDomainIds],
  sections: bundle.sections.map(cloneBriefingSection),
})

const cloneBriefingArtifactPreview = (
  artifact: BriefingArtifactPreview,
): BriefingArtifactPreview => ({
  ...artifact,
  baselineWindow: cloneComparisonWindow(artifact.baselineWindow),
  eventWindow: cloneComparisonWindow(artifact.eventWindow),
  overlayDomainIds: [...artifact.overlayDomainIds],
  sectionTitles: [...artifact.sectionTitles],
})

const classifyDeltaSeverity = (delta: number, maxAbsoluteDelta: number): DeltaSeverity => {
  if (maxAbsoluteDelta === 0 || Math.abs(delta) < Math.max(1, maxAbsoluteDelta * 0.25)) {
    return 'stable'
  }
  return delta > 0 ? 'increase' : 'decrease'
}

const strongestCell = (cells: DeltaCell[]): DeltaCell | undefined =>
  [...cells]
    .sort((left, right) => {
      const magnitudeDelta = Math.abs(right.delta) - Math.abs(left.delta)
      if (magnitudeDelta !== 0) {
        return magnitudeDelta
      }
      return left.cell_id.localeCompare(right.cell_id)
    })[0]

const strongestCellBySeverity = (
  cells: DeltaCell[],
  severity: Exclude<DeltaSeverity, 'stable'>,
): DeltaCell | undefined =>
  [...cells]
    .filter((cell) => cell.severity === severity)
    .sort((left, right) => {
      const magnitudeDelta = Math.abs(right.delta) - Math.abs(left.delta)
      if (magnitudeDelta !== 0) {
        return magnitudeDelta
      }
      return left.cell_id.localeCompare(right.cell_id)
    })[0]

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
  compareArtifact,
  briefingArtifact,
  briefingBundle,
}: CompareStateSnapshot): CompareStateSnapshot => ({
  baselineWindow: cloneComparisonWindow(baselineWindow),
  eventWindow: cloneComparisonWindow(eventWindow),
  baselineSeries: [...baselineSeries],
  eventSeries: [...eventSeries],
  compareArtifact: compareArtifact ? cloneCompareArtifact(compareArtifact) : undefined,
  briefingArtifact: briefingArtifact
    ? cloneBriefingArtifactPreview(briefingArtifact)
    : undefined,
  briefingBundle: briefingBundle ? cloneBriefingBundle(briefingBundle) : undefined,
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

export const buildDeltaCells = (baseline: number[], event: number[]): DeltaCell[] => {
  const result = computeDensityDelta(baseline, event)
  const maxAbsoluteDelta = Math.max(...result.delta.map((value) => Math.abs(value)), 0)
  const totalAbsoluteDelta = result.delta.reduce((sum, value) => sum + Math.abs(value), 0)

  return result.delta.map((delta, index) => {
    const aoi = compareAoiForIndex(index)
    return {
      cell_id: `delta-cell-${index + 1}`,
      aoiId: aoi.aoiId,
      aoiLabel: aoi.aoiLabel,
      baseline: result.baseline[index],
      event: result.event[index],
      delta,
      severity: classifyDeltaSeverity(delta, maxAbsoluteDelta),
      shareOfDelta:
        totalAbsoluteDelta === 0
          ? 0
          : Number((Math.abs(delta) / totalAbsoluteDelta).toFixed(3)),
    }
  })
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
  const focusCell = strongestCell(cells) ?? compareAoiForIndex(0)
  const increaseCount = cells.filter((cell) => cell.severity === 'increase').length
  const decreaseCount = cells.filter((cell) => cell.severity === 'decrease').length
  const stableCount = cells.filter((cell) => cell.severity === 'stable').length

  return {
    baselineWindow,
    eventWindow,
    cells,
    totalDelta,
    maxAbsoluteDelta,
    focusAoiId: focusCell.aoiId,
    focusAoiLabel: focusCell.aoiLabel,
    increaseCount,
    decreaseCount,
    stableCount,
    summary: `Delta generated across ${cells.length} AOI cells from ${baselineWindow.label} to ${eventWindow.label}; focus ${focusCell.aoiLabel}.`,
  }
}

export const buildContextOverlaySummaries = (
  domains: ContextDomain[],
  activeDomainIds: string[],
  dashboard: CompareDashboardSummary,
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
      focusAoiId: dashboard.focusAoiId,
      focusAoiLabel: dashboard.focusAoiLabel,
      relationship:
        dashboard.totalDelta > 0
          ? `Corroborates rising delta conditions around ${dashboard.focusAoiLabel}`
          : dashboard.totalDelta < 0
            ? `Corroborates declining delta conditions around ${dashboard.focusAoiLabel}`
            : `Context watch item for a stable delta window around ${dashboard.focusAoiLabel}`,
    }))

export const buildCompareArtifact = ({
  bundleId,
  marking,
  dashboard,
  overlaySummaries,
  offline,
  generatedAt = new Date().toISOString(),
}: {
  bundleId?: string
  marking: ArtifactMarking
  dashboard: CompareDashboardSummary
  overlaySummaries: ContextOverlaySummary[]
  offline: boolean
  generatedAt?: string
}): CompareArtifact => {
  const exportFingerprint = stableFingerprint(
    {
      bundleId,
      marking,
      offline,
      baselineWindow: dashboard.baselineWindow,
      eventWindow: dashboard.eventWindow,
      focusAoiId: dashboard.focusAoiId,
      totalDelta: dashboard.totalDelta,
      deltaCellIds: dashboard.cells.map((cell) => cell.cell_id),
      overlayDomainIds: overlaySummaries.map((overlay) => overlay.domain_id),
    },
    'compare',
  )

  return {
    artifactId: `compare-artifact-${exportFingerprint}`,
    bundleId,
    marking,
    summary: `${dashboard.summary} ${overlaySummaries.length} context overlay(s) remain attached to the compare state.`,
    baselineWindow: cloneComparisonWindow(dashboard.baselineWindow),
    eventWindow: cloneComparisonWindow(dashboard.eventWindow),
    totalDelta: dashboard.totalDelta,
    focusAoiId: dashboard.focusAoiId,
    focusAoiLabel: dashboard.focusAoiLabel,
    deltaCellIds: dashboard.cells.map((cell) => cell.cell_id),
    overlayDomainIds: overlaySummaries.map((overlay) => overlay.domain_id),
    generatedAt,
    exportFingerprint,
    offline,
  }
}

export const buildBriefingBundle = ({
  bundleId,
  marking,
  dashboard,
  overlaySummaries,
  compareArtifact,
  offline,
  generatedAt = new Date().toISOString(),
}: {
  bundleId?: string
  marking: ArtifactMarking
  dashboard: CompareDashboardSummary
  overlaySummaries: ContextOverlaySummary[]
  compareArtifact: CompareArtifact
  offline: boolean
  generatedAt?: string
}): BriefingBundle => {
  const strongestIncrease = strongestCellBySeverity(dashboard.cells, 'increase')
  const strongestDecrease = strongestCellBySeverity(dashboard.cells, 'decrease')
  const sections: BriefingSection[] = [
    {
      sectionId: 'section-observed-core',
      title: `Delta Surface: ${dashboard.focusAoiLabel}`,
      artifactLabel: 'Observed Evidence',
      summary: `${dashboard.summary} ${dashboard.increaseCount} increases, ${dashboard.decreaseCount} decreases, ${dashboard.stableCount} stable cells.`,
      aoiId: dashboard.focusAoiId,
    },
  ]

  if (strongestIncrease) {
    sections.push({
      sectionId: `section-observed-${slugify(strongestIncrease.aoiId)}-increase`,
      title: `Rising Pressure: ${strongestIncrease.aoiLabel}`,
      artifactLabel: 'Observed Evidence',
      summary: `Baseline ${strongestIncrease.baseline}, event ${strongestIncrease.event}, delta ${strongestIncrease.delta}. Share of theatre movement ${strongestIncrease.shareOfDelta}.`,
      aoiId: strongestIncrease.aoiId,
    })
  }

  if (strongestDecrease) {
    sections.push({
      sectionId: `section-observed-${slugify(strongestDecrease.aoiId)}-decrease`,
      title: `Declining Pressure: ${strongestDecrease.aoiLabel}`,
      artifactLabel: 'Observed Evidence',
      summary: `Baseline ${strongestDecrease.baseline}, event ${strongestDecrease.event}, delta ${strongestDecrease.delta}. Share of theatre movement ${strongestDecrease.shareOfDelta}.`,
      aoiId: strongestDecrease.aoiId,
    })
  }

  overlaySummaries.forEach((overlay) => {
    sections.push({
      sectionId: `section-context-${slugify(overlay.domain_id)}`,
      title: overlay.domain_name,
      artifactLabel: 'Curated Context',
      summary: `${overlay.relationship}. Source ${overlay.source_name}; cadence ${overlay.update_cadence}; confidence ${overlay.confidence_baseline}.`,
      aoiId: overlay.focusAoiId,
    })
  })

  const exportFingerprint = stableFingerprint(
    {
      bundleId,
      marking,
      offline,
      compareArtifactId: compareArtifact.artifactId,
      totalDelta: dashboard.totalDelta,
      sections,
    },
    'briefing',
  )

  return {
    artifactId: `briefing-bundle-${exportFingerprint}`,
    compareArtifactId: compareArtifact.artifactId,
    bundleId,
    marking,
    baselineWindow: dashboard.baselineWindow.label,
    eventWindow: dashboard.eventWindow.label,
    summary: `Briefing bundle packages ${sections.length} section(s) for ${dashboard.focusAoiLabel} from ${dashboard.baselineWindow.label} to ${dashboard.eventWindow.label}.`,
    totalDelta: dashboard.totalDelta,
    focusAoiId: dashboard.focusAoiId,
    focusAoiLabel: dashboard.focusAoiLabel,
    delta: dashboard.cells.map((cell) => cell.delta),
    deltaCellIds: dashboard.cells.map((cell) => cell.cell_id),
    overlayDomainIds: overlaySummaries.map((overlay) => overlay.domain_id),
    sections,
    exportFingerprint,
    generatedAt,
    offline,
    exportStatus: bundleId ? 'ready' : 'bundle_required',
  }
}

export const buildBriefingArtifactPreview = ({
  bundleId,
  marking,
  dashboard,
  compareArtifact,
  briefingBundle,
  offline,
}: {
  bundleId?: string
  marking: ArtifactMarking
  dashboard: CompareDashboardSummary
  compareArtifact: CompareArtifact
  briefingBundle: BriefingBundle
  offline: boolean
}): BriefingArtifactPreview => ({
  artifactId: `brief-${slugify(bundleId ?? 'bundle-required')}-${briefingBundle.exportFingerprint}`,
  label: 'Observed Evidence',
  summary: `${compareArtifact.summary} Briefing export packages ${briefingBundle.sections.length} section(s) for ${dashboard.focusAoiLabel}.`,
  bundleId,
  compareArtifactId: compareArtifact.artifactId,
  marking,
  baselineWindow: cloneComparisonWindow(dashboard.baselineWindow),
  eventWindow: cloneComparisonWindow(dashboard.eventWindow),
  deltaCellCount: dashboard.cells.length,
  totalDelta: dashboard.totalDelta,
  focusAoiId: dashboard.focusAoiId,
  focusAoiLabel: dashboard.focusAoiLabel,
  overlayDomainIds: [...briefingBundle.overlayDomainIds],
  exportStatus: briefingBundle.exportStatus,
  offline,
  generatedAt: briefingBundle.generatedAt,
  exportFingerprint: briefingBundle.exportFingerprint,
  sectionTitles: briefingBundle.sections.map((section) => section.title),
})
