import { describe, expect, it } from 'vitest'
import {
  addHypotheticalEntity,
  compareScenarios,
  createScenarioFork,
  createScenarioState,
  exportScenarioBundle,
  normalizeScenarioState,
  setComparisonScenario,
  setConstraint,
} from './scenarios'

describe('I4 scenario modeling', () => {
  it('creates forks, propagates constraints, and compares scenario deltas deterministically', () => {
    let snapshot = createScenarioState('bundle-1')
    snapshot = createScenarioFork(snapshot, {
      title: 'Baseline scenario',
      parentBundleId: 'bundle-1',
      now: '2026-03-06T00:00:00.000Z',
      provenanceSummary: 'Bundle bundle-1 baseline fork',
    })
    snapshot = setConstraint(snapshot, snapshot.selectedScenarioId, {
      constraintId: 'port_capacity',
      label: 'Port Capacity',
      value: 70,
      unit: 'index',
      rationale: 'Nominal throughput',
      propagationWeight: 1.5,
      now: '2026-03-06T00:05:00.000Z',
    })
    snapshot = addHypotheticalEntity(snapshot, snapshot.selectedScenarioId, {
      entityId: 'entity-a',
      name: 'Auxiliary berth',
      entityType: 'asset',
      changeSummary: 'Adds spare berth capacity',
      provenanceSource: 'Analyst note',
      confidence: 'A',
      now: '2026-03-06T00:06:00.000Z',
    })

    const baselineScenarioId = snapshot.selectedScenarioId
    snapshot = createScenarioFork(snapshot, {
      title: 'Surge scenario',
      parentBundleId: 'bundle-1',
      parentScenarioId: baselineScenarioId,
      now: '2026-03-06T00:10:00.000Z',
      provenanceSummary: 'Forked from baseline',
    })
    snapshot = setConstraint(snapshot, snapshot.selectedScenarioId, {
      constraintId: 'port_capacity',
      label: 'Port Capacity',
      value: 50,
      unit: 'index',
      rationale: 'Congested under surge',
      propagationWeight: 1.5,
      now: '2026-03-06T00:12:00.000Z',
    })
    snapshot = setConstraint(snapshot, snapshot.selectedScenarioId, {
      constraintId: 'fuel_supply',
      label: 'Fuel Supply',
      value: 20,
      unit: 'index',
      rationale: 'Reduced bunkering inventory',
      propagationWeight: 2,
      now: '2026-03-06T00:13:00.000Z',
    })
    snapshot = addHypotheticalEntity(snapshot, snapshot.selectedScenarioId, {
      entityId: 'entity-b',
      name: 'Floating depot',
      entityType: 'asset',
      changeSummary: 'Introduces temporary fuel storage',
      provenanceSource: 'Curated logistics brief',
      confidence: 'B',
      now: '2026-03-06T00:14:00.000Z',
    })
    snapshot = setComparisonScenario(snapshot, baselineScenarioId)

    const baseline = snapshot.scenarios.find((scenario) => scenario.scenarioId === baselineScenarioId)
    const surge = snapshot.scenarios.find((scenario) => scenario.scenarioId === snapshot.selectedScenarioId)
    expect(baseline).toBeDefined()
    expect(surge).toBeDefined()

    const comparison = compareScenarios(baseline!, surge!)
    expect(comparison.constraintDeltaCount).toBe(2)
    expect(comparison.hypotheticalDeltaCount).toBe(1)
    expect(comparison.totalPropagationDelta).toBe(10)
    expect(comparison.constraintDeltas.map((delta) => delta.constraintId)).toEqual([
      'fuel_supply',
      'port_capacity',
    ])

    const exportOne = exportScenarioBundle(snapshot, {
      leftScenarioId: baselineScenarioId,
      rightScenarioId: surge!.scenarioId,
      offline: true,
    })
    const exportTwo = exportScenarioBundle(snapshot, {
      leftScenarioId: baselineScenarioId,
      rightScenarioId: surge!.scenarioId,
      offline: true,
    })

    expect(exportOne).toBeDefined()
    expect(exportTwo).toBeDefined()
    expect(exportOne?.exportFingerprint).toBe(exportTwo?.exportFingerprint)
    expect(exportOne?.artifactId).toBe(exportTwo?.artifactId)
    expect(exportOne?.constraintIds).toEqual(['fuel_supply', 'port_capacity'])
    expect(exportOne?.hypotheticalEntityIds).toEqual(['entity-b'])
  })

  it('normalizes stored scenario state and drops invalid selection references', () => {
    const normalized = normalizeScenarioState({
      parentBundleId: 'bundle-9',
      selectedScenarioId: 'missing',
      comparisonScenarioId: 'also-missing',
      scenarios: [
        {
          scenarioId: 'scenario-1',
          title: 'Recovered scenario',
          parentBundleId: 'bundle-9',
          forkedAt: '2026-03-06T00:00:00.000Z',
          modifiedAt: '2026-03-06T00:00:00.000Z',
          marking: 'INTERNAL',
          provenanceSummary: 'Recovered from bundle-9',
          solverSeed: 4,
          constraints: [
            {
              constraintId: 'rail_capacity',
              label: 'Rail Capacity',
              value: 25,
              unit: 'index',
              rationale: 'Recovered state',
              propagationWeight: 1.2,
            },
          ],
          hypotheticalEntities: [
            {
              entityId: 'entity-z',
              name: 'Spare locomotive',
              entityType: 'asset',
              changeSummary: 'Adds reserve rolling stock',
              provenanceSource: 'Recovery snapshot',
              confidence: 'B',
            },
          ],
        },
      ],
      exportArtifact: {
        artifactId: 'scenario-export-scenario-deadbeef',
        parentBundleId: 'bundle-9',
        leftScenarioId: 'scenario-1',
        rightScenarioId: 'scenario-1',
        summary: 'Recovered export',
        marking: 'INTERNAL',
        offline: true,
        generatedAt: '2026-03-06T00:00:00.000Z',
        constraintIds: ['rail_capacity'],
        hypotheticalEntityIds: ['entity-z'],
        exportFingerprint: 'scenario-deadbeef',
      },
    })

    expect(normalized.selectedScenarioId).toBe('scenario-1')
    expect(normalized.comparisonScenarioId).toBe('')
    expect(normalized.scenarios[0]?.constraints[0]?.constraintId).toBe('rail_capacity')
    expect(normalized.exportArtifact?.artifactId).toBe('scenario-export-scenario-deadbeef')
  })
})
