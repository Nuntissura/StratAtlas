import { describe, expect, it } from 'vitest'
import { buildPayoffProxy, validateGameModel } from './gameModeling'

describe('I10 game modeling', () => {
  it('validates strategic-level game model constraints', () => {
    const valid = validateGameModel({
      game_id: 'gm-1',
      actors: [{ actor_id: 'state-a', actor_type: 'state' }],
      actions: [{ action_id: 'policy-1', category: 'policy' }],
      assumptions: ['assume constrained supply'],
      bundle_refs: ['bundle-1'],
    })
    expect(valid).toBe(true)
  })

  it('labels payoff proxies as modeled output with uncertainty bounds', () => {
    const proxy = buildPayoffProxy('throughput', 100, 15)
    expect(proxy.label).toBe('Modeled Output')
    expect(proxy.uncertainty).toEqual([85, 115])
  })
})
