import { describe, expect, it } from 'vitest'
import { aggregateAlerts, validateCuratedSource } from './osint'

describe('I9 osint and aggregate alerts', () => {
  it('accepts curated sources and enforces aggregate-only alerts', () => {
    expect(validateCuratedSource('ACLED')).toBe(true)
    expect(validateCuratedSource('UnknownFeed')).toBe(false)

    const summary = aggregateAlerts(
      [
        { source: 'ACLED', verification: 'confirmed', aoi: 'aoi-1' },
        { source: 'GDELT', verification: 'alleged', aoi: 'aoi-1' },
        { source: 'ACLED', verification: 'reported', aoi: 'aoi-2' },
      ],
      'aoi-1',
    )
    expect(summary.count).toBe(2)
    expect(summary.verificationBreakdown.alleged).toBe(1)
  })
})
