import { describe, expect, it } from 'vitest'
import {
  buildBriefingArtifactPreview,
  buildBriefingBundle,
  buildCompareArtifact,
  buildCompareDashboard,
  buildCompareStateSnapshot,
  buildComparisonWindow,
  buildContextOverlaySummaries,
  buildDeltaCells,
  computeDensityDelta,
} from './baselineDelta'

describe('I2 baseline/delta', () => {
  it('computes AOI-linked density deltas and compare summaries deterministically', () => {
    const result = computeDensityDelta([1, 2, 3], [2, 3, 5])
    expect(result.delta).toEqual([1, 1, 2])

    const cells = buildDeltaCells([1, 2, 3], [2, 3, 5])
    expect(cells.map((cell) => cell.delta)).toEqual([1, 1, 2])
    expect(cells.at(-1)?.severity).toBe('increase')
    expect(cells.at(0)?.aoiId).toBe('aoi-1')
    expect(cells.at(-1)?.aoiLabel).toBe('Mumbai Coast')

    const dashboard = buildCompareDashboard(
      buildComparisonWindow('Baseline', '2026-01-01', '2026-01-31'),
      buildComparisonWindow('Event', '2026-02-01', '2026-02-28'),
      [1, 2, 3],
      [2, 3, 5],
    )
    expect(dashboard.totalDelta).toBe(4)
    expect(dashboard.summary).toContain('3 AOI cells')
    expect(dashboard.focusAoiId).toBe('aoi-3')
    expect(dashboard.focusAoiLabel).toBe('Mumbai Coast')

    const snapshot = buildCompareStateSnapshot({
      baselineWindow: buildComparisonWindow('Baseline', '2026-Q1 baseline', '2026-Q1 baseline'),
      eventWindow: buildComparisonWindow('Event', '2026-Q2 event', '2026-Q2 event'),
      baselineSeries: [1, 2, 3],
      eventSeries: [2, 3, 5],
    })
    expect(snapshot.baselineWindow.label).toBe('2026-Q1 baseline')
    expect(snapshot.eventSeries).toEqual([2, 3, 5])
  })

  it('builds deterministic compare artifacts and governed briefing bundles tied to a bundle', () => {
    const dashboard = buildCompareDashboard(
      buildComparisonWindow('Baseline', '2026-01-01', '2026-01-31'),
      buildComparisonWindow('Event', '2026-02-01', '2026-02-28'),
      [10, 12, 16, 18, 20],
      [8, 18, 20, 17, 25],
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
      dashboard,
    )

    expect(overlays).toHaveLength(1)
    expect(overlays[0].relationship).toContain(dashboard.focusAoiLabel)

    const compareArtifact = buildCompareArtifact({
      bundleId: 'bundle-1',
      marking: 'INTERNAL',
      dashboard,
      overlaySummaries: overlays,
      offline: true,
      generatedAt: '2026-03-07T00:00:00.000Z',
    })
    const compareArtifactRepeat = buildCompareArtifact({
      bundleId: 'bundle-1',
      marking: 'INTERNAL',
      dashboard,
      overlaySummaries: overlays,
      offline: true,
      generatedAt: '2026-03-07T01:00:00.000Z',
    })
    expect(compareArtifact.exportFingerprint).toBe(compareArtifactRepeat.exportFingerprint)

    const briefing = buildBriefingBundle({
      bundleId: 'bundle-1',
      marking: 'INTERNAL',
      dashboard,
      overlaySummaries: overlays,
      compareArtifact,
      offline: true,
      generatedAt: '2026-03-07T00:00:00.000Z',
    })

    const preview = buildBriefingArtifactPreview({
      bundleId: 'bundle-1',
      marking: 'INTERNAL',
      dashboard,
      compareArtifact,
      briefingBundle: briefing,
      offline: true,
    })

    expect(compareArtifact.bundleId).toBe('bundle-1')
    expect(compareArtifact.focusAoiLabel).toBe(dashboard.focusAoiLabel)
    expect(briefing.compareArtifactId).toBe(compareArtifact.artifactId)
    expect(briefing.exportStatus).toBe('ready')
    expect(briefing.sections.length).toBeGreaterThanOrEqual(2)
    expect(preview.bundleId).toBe('bundle-1')
    expect(preview.exportStatus).toBe('ready')
    expect(preview.summary).toContain(dashboard.focusAoiLabel)
    expect(preview.sectionTitles).toContain('Commodity Index')
  })
})
