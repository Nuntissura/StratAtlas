import { describe, expect, it } from 'vitest'
import {
  buildBriefingArtifactPreview,
  buildBriefingBundle,
  buildCompareDashboard,
  buildCompareStateSnapshot,
  buildComparisonWindow,
  buildContextOverlaySummaries,
  buildDeltaCells,
  computeDensityDelta,
} from './baselineDelta'

describe('I2 baseline/delta', () => {
  it('computes density deltas, cell severities, and dashboard summaries deterministically', () => {
    const result = computeDensityDelta([1, 2, 3], [2, 3, 5])
    expect(result.delta).toEqual([1, 1, 2])

    const cells = buildDeltaCells([1, 2, 3], [2, 3, 5])
    expect(cells.map((cell) => cell.delta)).toEqual([1, 1, 2])
    expect(cells.at(-1)?.severity).toBe('increase')

    const dashboard = buildCompareDashboard(
      buildComparisonWindow('Baseline', '2026-01-01', '2026-01-31'),
      buildComparisonWindow('Event', '2026-02-01', '2026-02-28'),
      [1, 2, 3],
      [2, 3, 5],
    )
    expect(dashboard.totalDelta).toBe(4)
    expect(dashboard.summary).toContain('3 cells')

    const snapshot = buildCompareStateSnapshot({
      baselineWindow: buildComparisonWindow('Baseline', '2026-Q1 baseline', '2026-Q1 baseline'),
      eventWindow: buildComparisonWindow('Event', '2026-Q2 event', '2026-Q2 event'),
      baselineSeries: [1, 2, 3],
      eventSeries: [2, 3, 5],
    })
    expect(snapshot.baselineWindow.label).toBe('2026-Q1 baseline')
    expect(snapshot.eventSeries).toEqual([2, 3, 5])
  })

  it('builds context overlay summaries and briefing previews tied to a bundle', () => {
    const dashboard = buildCompareDashboard(
      buildComparisonWindow('Baseline', '2026-01-01', '2026-01-31'),
      buildComparisonWindow('Event', '2026-02-01', '2026-02-28'),
      [10, 12, 16],
      [8, 18, 20],
    )

    const overlays = buildContextOverlaySummaries(
      [
        {
          domain_id: 'ctx-1',
          domain_name: 'Commodity Index',
          domain_class: 'economic_indicator',
          source_name: 'UNCTAD',
          source_url: 'https://example.test/context',
          license: 'public',
          update_cadence: 'monthly',
          spatial_binding: 'region_bound',
          temporal_resolution: 'monthly',
          sensitivity_class: 'PUBLIC',
          confidence_baseline: 'A',
          methodology_notes: 'Official aggregation',
          offline_behavior: 'pre_cacheable',
          presentation_type: 'sidebar_timeseries',
        },
      ],
      ['ctx-1'],
      dashboard.totalDelta,
    )

    expect(overlays).toHaveLength(1)
    expect(overlays[0].relationship).toContain('rising')

    const preview = buildBriefingArtifactPreview({
      bundleId: 'bundle-1',
      marking: 'INTERNAL',
      dashboard,
      overlaySummaries: overlays,
      offline: true,
    })

    const briefing = buildBriefingBundle(
      dashboard.baselineWindow.label,
      dashboard.eventWindow.label,
      dashboard.cells.map((cell) => cell.delta),
    )

    expect(preview.bundleId).toBe('bundle-1')
    expect(preview.exportStatus).toBe('ready')
    expect(preview.summary).toContain('overlays 1')
    expect(briefing.summary).toContain('3')
  })
})
