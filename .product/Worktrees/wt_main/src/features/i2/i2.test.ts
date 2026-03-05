import { describe, expect, it } from 'vitest'
import { buildBriefingBundle, computeDensityDelta } from './baselineDelta'

describe('I2 baseline/delta', () => {
  it('computes density deltas and builds briefing artifacts', () => {
    const result = computeDensityDelta([1, 2, 3], [2, 3, 5])
    expect(result.delta).toEqual([1, 1, 2])

    const briefing = buildBriefingBundle('2026-01', '2026-02', result.delta)
    expect(briefing.delta).toEqual([1, 1, 2])
    expect(briefing.summary).toContain('3')
  })
})
