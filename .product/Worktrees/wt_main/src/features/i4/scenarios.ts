export type ScenarioMarking = 'PUBLIC' | 'INTERNAL' | 'RESTRICTED'

export type HypotheticalEntityType = 'asset' | 'corridor' | 'policy' | 'actor'

export type EntityConfidence = 'A' | 'B' | 'C'

export interface ScenarioConstraint {
  constraintId: string
  label: string
  value: number
  unit: string
  rationale: string
  propagationWeight: number
}

export interface HypotheticalEntity {
  entityId: string
  name: string
  entityType: HypotheticalEntityType
  changeSummary: string
  provenanceSource: string
  confidence: EntityConfidence
}

export interface ScenarioFork {
  scenarioId: string
  title: string
  parentBundleId: string
  parentScenarioId?: string
  forkedAt: string
  modifiedAt: string
  marking: ScenarioMarking
  provenanceSummary: string
  solverSeed: number
  constraints: ScenarioConstraint[]
  hypotheticalEntities: HypotheticalEntity[]
}

export interface ScenarioConstraintDelta {
  constraintId: string
  label: string
  leftValue: number
  rightValue: number
  delta: number
  propagationImpact: number
  unit: string
}

export interface ScenarioHypotheticalDelta {
  entityId: string
  name: string
  change: 'added' | 'removed'
}

export interface ScenarioComparison {
  leftScenarioId: string
  rightScenarioId: string
  constraintDeltaCount: number
  hypotheticalDeltaCount: number
  totalPropagationDelta: number
  summary: string
  constraintDeltas: ScenarioConstraintDelta[]
  hypotheticalDeltas: ScenarioHypotheticalDelta[]
}

export interface ScenarioExportArtifact {
  artifactId: string
  parentBundleId: string
  leftScenarioId: string
  rightScenarioId: string
  summary: string
  marking: ScenarioMarking
  offline: boolean
  generatedAt: string
  constraintIds: string[]
  hypotheticalEntityIds: string[]
  exportFingerprint: string
}

export interface ScenarioStateSnapshot {
  parentBundleId: string
  scenarios: ScenarioFork[]
  selectedScenarioId: string
  comparisonScenarioId: string
  exportArtifact?: ScenarioExportArtifact
}

const DEFAULT_SCENARIO_MARKING: ScenarioMarking = 'INTERNAL'
const DEFAULT_SCENARIO_ID_PREFIX = 'scenario'
const DEFAULT_CONSTRAINT_LABEL = 'Scenario constraint'
const DEFAULT_CONSTRAINT_UNIT = 'index'
const DEFAULT_PROVENANCE = 'Analyst-authored scenario fork'

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

const stableFingerprint = (value: unknown): string => {
  const serialized = stableSerialize(value)
  let hash = 2166136261
  for (let index = 0; index < serialized.length; index += 1) {
    hash ^= serialized.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return `scenario-${(hash >>> 0).toString(16).padStart(8, '0')}`
}

const cloneConstraint = (constraint: ScenarioConstraint): ScenarioConstraint => ({
  ...constraint,
})

const cloneHypotheticalEntity = (entity: HypotheticalEntity): HypotheticalEntity => ({
  ...entity,
})

const cloneFork = (scenario: ScenarioFork): ScenarioFork => ({
  ...scenario,
  constraints: scenario.constraints.map(cloneConstraint),
  hypotheticalEntities: scenario.hypotheticalEntities.map(cloneHypotheticalEntity),
})

const cloneExportArtifact = (artifact: ScenarioExportArtifact): ScenarioExportArtifact => ({
  ...artifact,
  constraintIds: [...artifact.constraintIds],
  hypotheticalEntityIds: [...artifact.hypotheticalEntityIds],
})

const normalizeMarking = (value: unknown): ScenarioMarking =>
  value === 'PUBLIC' || value === 'INTERNAL' || value === 'RESTRICTED'
    ? value
    : DEFAULT_SCENARIO_MARKING

const normalizeTimestamp = (value: unknown): string =>
  typeof value === 'string' && value.length > 0 ? value : '1970-01-01T00:00:00.000Z'

const normalizeNumber = (value: unknown, fallback: number): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback

const normalizeConstraint = (value: unknown): ScenarioConstraint | null => {
  if (!isRecord(value)) {
    return null
  }

  const constraintId = typeof value.constraintId === 'string' ? value.constraintId.trim() : ''
  if (!constraintId) {
    return null
  }

  return {
    constraintId,
    label:
      typeof value.label === 'string' && value.label.trim().length > 0
        ? value.label
        : DEFAULT_CONSTRAINT_LABEL,
    value: normalizeNumber(value.value, 0),
    unit:
      typeof value.unit === 'string' && value.unit.trim().length > 0
        ? value.unit
        : DEFAULT_CONSTRAINT_UNIT,
    rationale: typeof value.rationale === 'string' ? value.rationale : '',
    propagationWeight: normalizeNumber(value.propagationWeight, 1),
  }
}

const normalizeHypotheticalEntity = (value: unknown): HypotheticalEntity | null => {
  if (!isRecord(value)) {
    return null
  }

  const entityId = typeof value.entityId === 'string' ? value.entityId.trim() : ''
  if (!entityId) {
    return null
  }

  const entityType = value.entityType
  const confidence = value.confidence

  return {
    entityId,
    name: typeof value.name === 'string' && value.name.trim().length > 0 ? value.name : entityId,
    entityType:
      entityType === 'asset' ||
      entityType === 'corridor' ||
      entityType === 'policy' ||
      entityType === 'actor'
        ? entityType
        : 'asset',
    changeSummary: typeof value.changeSummary === 'string' ? value.changeSummary : '',
    provenanceSource:
      typeof value.provenanceSource === 'string' && value.provenanceSource.trim().length > 0
        ? value.provenanceSource
        : DEFAULT_PROVENANCE,
    confidence: confidence === 'A' || confidence === 'B' || confidence === 'C' ? confidence : 'B',
  }
}

const normalizeFork = (value: unknown): ScenarioFork | null => {
  if (!isRecord(value)) {
    return null
  }

  const scenarioId = typeof value.scenarioId === 'string' ? value.scenarioId.trim() : ''
  const parentBundleId =
    typeof value.parentBundleId === 'string' ? value.parentBundleId.trim() : ''
  if (!scenarioId || !parentBundleId) {
    return null
  }

  const constraints = Array.isArray(value.constraints)
    ? value.constraints
        .map((entry) => normalizeConstraint(entry))
        .filter((entry): entry is ScenarioConstraint => entry !== null)
    : []
  const hypotheticalEntities = Array.isArray(value.hypotheticalEntities)
    ? value.hypotheticalEntities
        .map((entry) => normalizeHypotheticalEntity(entry))
        .filter((entry): entry is HypotheticalEntity => entry !== null)
    : []

  return {
    scenarioId,
    title:
      typeof value.title === 'string' && value.title.trim().length > 0 ? value.title : scenarioId,
    parentBundleId,
    parentScenarioId:
      typeof value.parentScenarioId === 'string' && value.parentScenarioId.trim().length > 0
        ? value.parentScenarioId
        : undefined,
    forkedAt: normalizeTimestamp(value.forkedAt),
    modifiedAt: normalizeTimestamp(value.modifiedAt),
    marking: normalizeMarking(value.marking),
    provenanceSummary:
      typeof value.provenanceSummary === 'string' && value.provenanceSummary.trim().length > 0
        ? value.provenanceSummary
        : DEFAULT_PROVENANCE,
    solverSeed: normalizeNumber(value.solverSeed, 0),
    constraints,
    hypotheticalEntities,
  }
}

const normalizeExportArtifact = (value: unknown): ScenarioExportArtifact | undefined => {
  if (!isRecord(value)) {
    return undefined
  }

  const artifactId = typeof value.artifactId === 'string' ? value.artifactId.trim() : ''
  const parentBundleId =
    typeof value.parentBundleId === 'string' ? value.parentBundleId.trim() : ''
  const leftScenarioId =
    typeof value.leftScenarioId === 'string' ? value.leftScenarioId.trim() : ''
  const rightScenarioId =
    typeof value.rightScenarioId === 'string' ? value.rightScenarioId.trim() : ''
  if (!artifactId || !parentBundleId || !leftScenarioId || !rightScenarioId) {
    return undefined
  }

  return {
    artifactId,
    parentBundleId,
    leftScenarioId,
    rightScenarioId,
    summary: typeof value.summary === 'string' ? value.summary : '',
    marking: normalizeMarking(value.marking),
    offline: Boolean(value.offline),
    generatedAt: normalizeTimestamp(value.generatedAt),
    constraintIds: Array.isArray(value.constraintIds)
      ? value.constraintIds.filter((entry): entry is string => typeof entry === 'string')
      : [],
    hypotheticalEntityIds: Array.isArray(value.hypotheticalEntityIds)
      ? value.hypotheticalEntityIds.filter((entry): entry is string => typeof entry === 'string')
      : [],
    exportFingerprint:
      typeof value.exportFingerprint === 'string' ? value.exportFingerprint : stableFingerprint(value),
  }
}

const strongestMarking = (markings: ScenarioMarking[]): ScenarioMarking => {
  if (markings.includes('RESTRICTED')) {
    return 'RESTRICTED'
  }
  if (markings.includes('INTERNAL')) {
    return 'INTERNAL'
  }
  return 'PUBLIC'
}

const findScenario = (
  snapshot: ScenarioStateSnapshot,
  scenarioId: string,
): ScenarioFork | undefined => snapshot.scenarios.find((scenario) => scenario.scenarioId === scenarioId)

const upsertScenario = (
  snapshot: ScenarioStateSnapshot,
  updatedScenario: ScenarioFork,
): ScenarioStateSnapshot => ({
  ...snapshot,
  scenarios: snapshot.scenarios.map((scenario) =>
    scenario.scenarioId === updatedScenario.scenarioId ? cloneFork(updatedScenario) : cloneFork(scenario),
  ),
  exportArtifact: undefined,
})

const nextScenarioId = (snapshot: ScenarioStateSnapshot): string =>
  `${DEFAULT_SCENARIO_ID_PREFIX}-${snapshot.scenarios.length + 1}`

const defaultComparisonScenarioId = (
  scenarios: ScenarioFork[],
  selectedScenarioId: string,
): string => scenarios.find((scenario) => scenario.scenarioId !== selectedScenarioId)?.scenarioId ?? ''

export const createScenarioState = (parentBundleId = ''): ScenarioStateSnapshot => ({
  parentBundleId,
  scenarios: [],
  selectedScenarioId: '',
  comparisonScenarioId: '',
})

export const createScenarioFork = (
  snapshot: ScenarioStateSnapshot,
  {
    title,
    parentBundleId,
    parentScenarioId,
    marking = DEFAULT_SCENARIO_MARKING,
    provenanceSummary = DEFAULT_PROVENANCE,
    now = new Date().toISOString(),
  }: {
    title: string
    parentBundleId: string
    parentScenarioId?: string
    marking?: ScenarioMarking
    provenanceSummary?: string
    now?: string
  },
): ScenarioStateSnapshot => {
  const sourceScenario = parentScenarioId ? findScenario(snapshot, parentScenarioId) : undefined
  const nextScenario: ScenarioFork = {
    scenarioId: nextScenarioId(snapshot),
    title: title.trim() || `Scenario ${snapshot.scenarios.length + 1}`,
    parentBundleId,
    parentScenarioId,
    forkedAt: now,
    modifiedAt: now,
    marking,
    provenanceSummary,
    solverSeed: sourceScenario?.solverSeed ?? snapshot.scenarios.length + 1,
    constraints: sourceScenario?.constraints.map(cloneConstraint) ?? [],
    hypotheticalEntities: sourceScenario?.hypotheticalEntities.map(cloneHypotheticalEntity) ?? [],
  }

  const scenarios = [...snapshot.scenarios.map(cloneFork), nextScenario]
  const selectedScenarioId = nextScenario.scenarioId
  const comparisonScenarioId =
    sourceScenario?.scenarioId ??
    snapshot.selectedScenarioId ??
    defaultComparisonScenarioId(scenarios, selectedScenarioId)

  return {
    parentBundleId,
    scenarios,
    selectedScenarioId,
    comparisonScenarioId,
  }
}

export const setSelectedScenario = (
  snapshot: ScenarioStateSnapshot,
  scenarioId: string,
): ScenarioStateSnapshot => {
  if (!findScenario(snapshot, scenarioId)) {
    return snapshot
  }

  return {
    ...snapshot,
    selectedScenarioId: scenarioId,
    comparisonScenarioId:
      snapshot.comparisonScenarioId && snapshot.comparisonScenarioId !== scenarioId
        ? snapshot.comparisonScenarioId
        : defaultComparisonScenarioId(snapshot.scenarios, scenarioId),
  }
}

export const setComparisonScenario = (
  snapshot: ScenarioStateSnapshot,
  scenarioId: string,
): ScenarioStateSnapshot => {
  if (!findScenario(snapshot, scenarioId) || scenarioId === snapshot.selectedScenarioId) {
    return {
      ...snapshot,
      comparisonScenarioId: '',
      exportArtifact: undefined,
    }
  }

  return {
    ...snapshot,
    comparisonScenarioId: scenarioId,
    exportArtifact: undefined,
  }
}

export const setConstraint = (
  snapshot: ScenarioStateSnapshot,
  scenarioId: string,
  constraint: {
    constraintId: string
    label?: string
    value: number
    unit?: string
    rationale?: string
    propagationWeight?: number
    now?: string
  },
): ScenarioStateSnapshot => {
  const scenario = findScenario(snapshot, scenarioId)
  if (!scenario) {
    return snapshot
  }

  const constraintId = constraint.constraintId.trim()
  if (!constraintId) {
    return snapshot
  }

  const updatedConstraint: ScenarioConstraint = {
    constraintId,
    label: constraint.label?.trim() || DEFAULT_CONSTRAINT_LABEL,
    value: constraint.value,
    unit: constraint.unit?.trim() || DEFAULT_CONSTRAINT_UNIT,
    rationale: constraint.rationale?.trim() ?? '',
    propagationWeight: constraint.propagationWeight ?? 1,
  }

  const nextScenario: ScenarioFork = {
    ...cloneFork(scenario),
    modifiedAt: constraint.now ?? new Date().toISOString(),
    constraints: [
      ...scenario.constraints
        .filter((entry) => entry.constraintId !== updatedConstraint.constraintId)
        .map(cloneConstraint),
      updatedConstraint,
    ].sort((left, right) => left.constraintId.localeCompare(right.constraintId)),
  }

  return upsertScenario(snapshot, nextScenario)
}

export const addHypotheticalEntity = (
  snapshot: ScenarioStateSnapshot,
  scenarioId: string,
  entity: {
    entityId: string
    name: string
    entityType: HypotheticalEntityType
    changeSummary: string
    provenanceSource: string
    confidence: EntityConfidence
    now?: string
  },
): ScenarioStateSnapshot => {
  const scenario = findScenario(snapshot, scenarioId)
  if (!scenario) {
    return snapshot
  }

  const entityId = entity.entityId.trim()
  if (!entityId) {
    return snapshot
  }

  const nextEntity: HypotheticalEntity = {
    entityId,
    name: entity.name.trim() || entityId,
    entityType: entity.entityType,
    changeSummary: entity.changeSummary.trim(),
    provenanceSource: entity.provenanceSource.trim() || DEFAULT_PROVENANCE,
    confidence: entity.confidence,
  }

  const nextScenario: ScenarioFork = {
    ...cloneFork(scenario),
    modifiedAt: entity.now ?? new Date().toISOString(),
    hypotheticalEntities: [
      ...scenario.hypotheticalEntities
        .filter((entry) => entry.entityId !== nextEntity.entityId)
        .map(cloneHypotheticalEntity),
      nextEntity,
    ].sort((left, right) => left.entityId.localeCompare(right.entityId)),
  }

  return upsertScenario(snapshot, nextScenario)
}

export const compareScenarios = (
  left: ScenarioFork,
  right: ScenarioFork,
): ScenarioComparison => {
  const leftConstraints = new Map(left.constraints.map((constraint) => [constraint.constraintId, constraint]))
  const rightConstraints = new Map(
    right.constraints.map((constraint) => [constraint.constraintId, constraint]),
  )
  const constraintIds = Array.from(
    new Set([...leftConstraints.keys(), ...rightConstraints.keys()]),
  ).sort((first, second) => first.localeCompare(second))

  const constraintDeltas = constraintIds
    .map((constraintId) => {
      const leftConstraint = leftConstraints.get(constraintId)
      const rightConstraint = rightConstraints.get(constraintId)
      const leftValue = leftConstraint?.value ?? 0
      const rightValue = rightConstraint?.value ?? 0
      const delta = rightValue - leftValue
      const propagationWeight =
        rightConstraint?.propagationWeight ?? leftConstraint?.propagationWeight ?? 1

      return {
        constraintId,
        label: rightConstraint?.label ?? leftConstraint?.label ?? DEFAULT_CONSTRAINT_LABEL,
        leftValue,
        rightValue,
        delta,
        propagationImpact: delta * propagationWeight,
        unit: rightConstraint?.unit ?? leftConstraint?.unit ?? DEFAULT_CONSTRAINT_UNIT,
      }
    })
    .filter((delta) => delta.delta !== 0)

  const leftEntities = new Map(left.hypotheticalEntities.map((entity) => [entity.entityId, entity]))
  const rightEntities = new Map(
    right.hypotheticalEntities.map((entity) => [entity.entityId, entity]),
  )
  const hypotheticalIds = Array.from(new Set([...leftEntities.keys(), ...rightEntities.keys()])).sort(
    (first, second) => first.localeCompare(second),
  )
  const hypotheticalDeltas = hypotheticalIds
    .flatMap((entityId) => {
      const leftEntity = leftEntities.get(entityId)
      const rightEntity = rightEntities.get(entityId)
      if (leftEntity && rightEntity) {
        return []
      }
      return [
        {
          entityId,
          name: rightEntity?.name ?? leftEntity?.name ?? entityId,
          change: rightEntity ? ('added' as const) : ('removed' as const),
        },
      ]
    })

  const totalPropagationDelta = constraintDeltas.reduce(
    (sum, constraint) => sum + constraint.propagationImpact,
    0,
  )

  return {
    leftScenarioId: left.scenarioId,
    rightScenarioId: right.scenarioId,
    constraintDeltaCount: constraintDeltas.length,
    hypotheticalDeltaCount: hypotheticalDeltas.length,
    totalPropagationDelta,
    summary: `${constraintDeltas.length} constraint changes and ${hypotheticalDeltas.length} hypothetical entity changes from ${left.title} to ${right.title}`,
    constraintDeltas,
    hypotheticalDeltas,
  }
}

export const exportScenarioBundle = (
  snapshot: ScenarioStateSnapshot,
  {
    leftScenarioId,
    rightScenarioId,
    offline,
  }: {
    leftScenarioId: string
    rightScenarioId: string
    offline: boolean
  },
): ScenarioExportArtifact | undefined => {
  const left = findScenario(snapshot, leftScenarioId)
  const right = findScenario(snapshot, rightScenarioId)
  if (!left || !right || !snapshot.parentBundleId) {
    return undefined
  }

  const comparison = compareScenarios(left, right)
  const exportPayload = {
    parentBundleId: snapshot.parentBundleId,
    leftScenarioId,
    rightScenarioId,
    markings: [left.marking, right.marking].sort(),
    constraintDeltas: comparison.constraintDeltas,
    hypotheticalDeltas: comparison.hypotheticalDeltas,
    solverSeeds: [left.solverSeed, right.solverSeed].sort((first, second) => first - second),
  }
  const exportFingerprint = stableFingerprint(exportPayload)

  return {
    artifactId: `scenario-export-${exportFingerprint}`,
    parentBundleId: snapshot.parentBundleId,
    leftScenarioId,
    rightScenarioId,
    summary: comparison.summary,
    marking: strongestMarking([left.marking, right.marking]),
    offline,
    generatedAt: [left.modifiedAt, right.modifiedAt].sort().at(-1) ?? left.modifiedAt,
    constraintIds: comparison.constraintDeltas.map((delta) => delta.constraintId),
    hypotheticalEntityIds: comparison.hypotheticalDeltas.map((delta) => delta.entityId),
    exportFingerprint,
  }
}

export const setScenarioExportArtifact = (
  snapshot: ScenarioStateSnapshot,
  exportArtifact?: ScenarioExportArtifact,
): ScenarioStateSnapshot => ({
  ...snapshot,
  exportArtifact: exportArtifact ? cloneExportArtifact(exportArtifact) : undefined,
})

export const normalizeScenarioState = (value: unknown): ScenarioStateSnapshot => {
  if (!isRecord(value)) {
    return createScenarioState()
  }

  const parentBundleId =
    typeof value.parentBundleId === 'string' ? value.parentBundleId.trim() : ''
  const scenarios = Array.isArray(value.scenarios)
    ? value.scenarios
        .map((entry) => normalizeFork(entry))
        .filter((entry): entry is ScenarioFork => entry !== null)
        .filter((entry) => entry.parentBundleId === parentBundleId || !parentBundleId)
    : []
  const selectedScenarioId =
    typeof value.selectedScenarioId === 'string' &&
    scenarios.some((scenario) => scenario.scenarioId === value.selectedScenarioId)
      ? value.selectedScenarioId
      : scenarios[0]?.scenarioId ?? ''
  const comparisonScenarioId =
    typeof value.comparisonScenarioId === 'string' &&
    value.comparisonScenarioId !== selectedScenarioId &&
    scenarios.some((scenario) => scenario.scenarioId === value.comparisonScenarioId)
      ? value.comparisonScenarioId
      : defaultComparisonScenarioId(scenarios, selectedScenarioId)

  const exportArtifact = normalizeExportArtifact(value.exportArtifact)

  return {
    parentBundleId: parentBundleId || scenarios[0]?.parentBundleId || '',
    scenarios: scenarios.map(cloneFork),
    selectedScenarioId,
    comparisonScenarioId,
    exportArtifact:
      exportArtifact &&
      exportArtifact.parentBundleId === (parentBundleId || scenarios[0]?.parentBundleId || '')
        ? exportArtifact
        : undefined,
  }
}
