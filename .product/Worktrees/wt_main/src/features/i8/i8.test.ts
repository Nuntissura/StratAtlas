import { describe, expect, it } from 'vitest'
import { detectDeviation } from './deviation'

describe('I8 context deviation detection', () => {
  it('emits context.deviation event when threshold is exceeded', () => {
    const event = detectDeviation(
      [
        { ts: '1', value: 100 },
        { ts: '2', value: 100 },
      ],
      [
        { ts: '3', value: 140 },
        { ts: '4', value: 150 },
      ],
      0.2,
      'trade_flow',
    )
    expect(event?.event_type).toBe('context.deviation')
    expect(event?.deviation_type).toBe('trade_flow')
    expect(event?.score).toBeGreaterThan(0.2)
  })
})
