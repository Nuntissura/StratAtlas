export interface ScenarioFork {
  scenarioId: string
  parentBundleId: string
  constraints: Record<string, number>
  hypotheticalEntities: string[]
}

export const createScenarioFork = (
  parentBundleId: string,
  scenarioId: string,
): ScenarioFork => ({
  scenarioId,
  parentBundleId,
  constraints: {},
  hypotheticalEntities: [],
})

export const setConstraint = (
  scenario: ScenarioFork,
  constraintId: string,
  value: number,
): ScenarioFork => ({
  ...scenario,
  constraints: {
    ...scenario.constraints,
    [constraintId]: value,
  },
})

export const addHypotheticalEntity = (
  scenario: ScenarioFork,
  entityId: string,
): ScenarioFork => ({
  ...scenario,
  hypotheticalEntities: [...scenario.hypotheticalEntities, entityId],
})

export const compareScenarios = (
  left: ScenarioFork,
  right: ScenarioFork,
): { constraintDelta: number; hypotheticalDelta: number } => ({
  constraintDelta:
    Object.keys(right.constraints).length - Object.keys(left.constraints).length,
  hypotheticalDelta:
    right.hypotheticalEntities.length - left.hypotheticalEntities.length,
})
