import { describe, expect, it } from 'vitest'
import {
  addHypotheticalEntity,
  compareScenarios,
  createScenarioFork,
  setConstraint,
} from './scenarios'

describe('I4 scenario modeling', () => {
  it('creates forks, applies constraints, and compares scenarios', () => {
    let left = createScenarioFork('bundle-1', 'scenario-a')
    left = setConstraint(left, 'port_capacity', 70)
    left = addHypotheticalEntity(left, 'entity-a')

    let right = createScenarioFork('bundle-1', 'scenario-b')
    right = setConstraint(right, 'port_capacity', 50)
    right = setConstraint(right, 'fuel_supply', 20)
    right = addHypotheticalEntity(right, 'entity-a')
    right = addHypotheticalEntity(right, 'entity-b')

    const comparison = compareScenarios(left, right)
    expect(comparison.constraintDelta).toBe(1)
    expect(comparison.hypotheticalDelta).toBe(1)
  })
})
