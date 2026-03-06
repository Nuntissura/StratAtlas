export const ACTOR_TYPES = ['state', 'bloc', 'institution', 'industry_coalition'] as const
export const ACTION_CATEGORIES = ['policy', 'logistics', 'signaling'] as const
export const GAME_TYPES = ['normal_form', 'extensive_form', 'stochastic'] as const
export const SCENARIO_TREE_NODE_TYPES = ['decision', 'chance', 'information_set'] as const
export const SOLVER_METHODS = ['best_response', 'equilibrium_exploration', 'minimax_regret'] as const

export type ActorType = (typeof ACTOR_TYPES)[number]
export type ActionCategory = (typeof ACTION_CATEGORIES)[number]
export type GameType = (typeof GAME_TYPES)[number]
export type ScenarioTreeNodeType = (typeof SCENARIO_TREE_NODE_TYPES)[number]
export type SolverMethod = (typeof SOLVER_METHODS)[number]
export type GameModelMarking = 'PUBLIC' | 'INTERNAL' | 'RESTRICTED'
export type GameModelRole = 'viewer' | 'analyst' | 'administrator' | 'auditor'

const MODELED_OUTPUT_LABEL = 'Modeled Output' as const
const NON_OPERATIONAL_NOTICE = 'Modeled/interpretive only; not operational direction.'

export interface GameActor {
  actor_id: string
  label: string
  actor_type: ActorType
}

export interface GameObjective {
  objective_id: string
  label: string
  weight: number
  definition: string
}

export interface GameAction {
  action_id: string
  label: string
  category: ActionCategory
  description: string
}

export interface InformationSet {
  information_set_id: string
  label: string
  evidence_confidence: string
  known_unknowns: string[]
}

export interface SolverConfig {
  method: SolverMethod
  random_seed: number
  monte_carlo_samples: number
  iteration_limit: number
  parameter_range_notes: string[]
}

export interface GameModel {
  game_id: string
  version: number
  name: string
  created_by: GameModelRole
  created_at: string
  updated_at: string
  game_type: GameType
  actors: GameActor[]
  objectives: GameObjective[]
  actions: GameAction[]
  information_model: string
  information_sets: InformationSet[]
  payoff_model: string
  assumptions: string[]
  bundle_refs: string[]
  solver_config: SolverConfig
  provenance_summary: string
  confidence_note: string
  sensitivity_marking: GameModelMarking
  artifact_label: typeof MODELED_OUTPUT_LABEL
  non_operational_notice: string
}

export interface ScenarioTreeNode {
  node_id: string
  node_type: ScenarioTreeNodeType
  label: string
  parent_node_id?: string
  actor_id?: string
  scenario_fork_id?: string
  information_set_id?: string
  chance_note?: string
  branch_probability?: number
}

export interface ScenarioTreeSnapshot {
  tree_id: string
  game_id: string
  nodes: ScenarioTreeNode[]
  export_summary: string
}

export interface PayoffProxy {
  metric: string
  value: number
  uncertainty: [number, number]
  label: typeof MODELED_OUTPUT_LABEL
  basis: string[]
  non_operational_notice: string
}

export interface ParameterSweepResult {
  parameter_name: string
  sampled_values: number[]
  outcome_spread: number[]
  sensitivity_ranking: string[]
  monte_carlo_samples: number
}

export interface ValueOfInformationEstimate {
  target: string
  recommendation: string
  uncertainty_reduction_pct: number
  rationale: string
}

export interface SolverRunRecord {
  run_id: string
  game_id: string
  executed_at: string
  method: SolverMethod
  random_seed: number
  monte_carlo_samples: number
  input_bundle_refs: string[]
  linked_scenario_ids: string[]
  payoff_proxies: PayoffProxy[]
  sensitivity_ranking: string[]
  robust_summary: string
  result_manifest_hash: string
  artifact_label: typeof MODELED_OUTPUT_LABEL
  non_operational_notice: string
}

export interface ExperimentBundleArtifact {
  experiment_bundle_id: string
  game_id: string
  game_model_version: number
  snapshot_bundle_refs: string[]
  scenario_fork_ids: string[]
  solver_run_ids: string[]
  solver_methods: SolverMethod[]
  random_seeds: number[]
  parameter_ranges: string[]
  result_manifest_hash: string
  created_at: string
  summary: string
  artifact_label: typeof MODELED_OUTPUT_LABEL
}

export interface GameModelSnapshot {
  model: GameModel
  scenario_tree: ScenarioTreeSnapshot
  latest_payoff_proxies: PayoffProxy[]
  solver_runs: SolverRunRecord[]
  latest_parameter_sweep?: ParameterSweepResult
  latest_voi_estimate?: ValueOfInformationEstimate
  experiment_bundle?: ExperimentBundleArtifact
  selected_scenario_id?: string
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isActorType = (value: unknown): value is ActorType =>
  typeof value === 'string' && ACTOR_TYPES.includes(value as ActorType)

const isActionCategory = (value: unknown): value is ActionCategory =>
  typeof value === 'string' && ACTION_CATEGORIES.includes(value as ActionCategory)

const isGameType = (value: unknown): value is GameType =>
  typeof value === 'string' && GAME_TYPES.includes(value as GameType)

const isScenarioTreeNodeType = (value: unknown): value is ScenarioTreeNodeType =>
  typeof value === 'string' && SCENARIO_TREE_NODE_TYPES.includes(value as ScenarioTreeNodeType)

const isSolverMethod = (value: unknown): value is SolverMethod =>
  typeof value === 'string' && SOLVER_METHODS.includes(value as SolverMethod)

const normalizeString = (value: unknown, fallback: string): string =>
  typeof value === 'string' && value.trim() ? value.trim() : fallback

const normalizeStringArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === 'string' && entry.trim().length > 0)
    : []

const normalizeNumber = (value: unknown, fallback: number): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback

const normalizeNumberArray = (value: unknown): number[] =>
  Array.isArray(value)
    ? value.filter((entry): entry is number => typeof entry === 'number' && Number.isFinite(entry))
    : []

const nextId = (prefix: string, size: number): string => `${prefix}-${size + 1}`

const stableStringify = (value: unknown): string => {
  if (Array.isArray(value)) {
    return `[${value.map((entry) => stableStringify(entry)).join(',')}]`
  }
  if (isRecord(value)) {
    return `{${Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entry]) => `${JSON.stringify(key)}:${stableStringify(entry)}`)
      .join(',')}}`
  }
  return JSON.stringify(value)
}

const stableHash = (value: unknown): string => {
  const input = stableStringify(value)
  let hash = 2166136261
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return `gm-${(hash >>> 0).toString(16).padStart(8, '0')}`
}

const bumpVersion = (model: GameModel, updatedAt: string): GameModel => ({
  ...model,
  version: model.version + 1,
  updated_at: updatedAt,
})

export const createGameModelSnapshot = (
  bundleRef?: string,
  createdBy: GameModelRole = 'analyst',
  createdAt = '2026-03-06T00:00:00.000Z',
): GameModelSnapshot => ({
  model: {
    game_id: 'gm-main',
    version: 1,
    name: 'Strategic Resilience Model',
    created_by: createdBy,
    created_at: createdAt,
    updated_at: createdAt,
    game_type: 'extensive_form',
    actors: [
      {
        actor_id: 'actor-1',
        label: 'Regional coalition',
        actor_type: 'bloc',
      },
    ],
    objectives: [
      {
        objective_id: 'objective-1',
        label: 'Preserve throughput resilience',
        weight: 0.6,
        definition: 'Maintain resilient regional logistics throughput under stress.',
      },
    ],
    actions: [
      {
        action_id: 'action-1',
        label: 'Reallocate berth windows',
        category: 'logistics',
        description: 'Strategic logistics reallocation across the AOI.',
      },
    ],
    information_model: 'Belief states conditioned on observed evidence confidence and curated context.',
    information_sets: [
      {
        information_set_id: 'info-1',
        label: 'Baseline evidence confidence',
        evidence_confidence: 'Analyst baseline confidence',
        known_unknowns: ['Demand elasticity', 'Regulatory timing'],
      },
    ],
    payoff_model: 'Proxy utility derived from throughput resilience, policy cohesion, and congestion spread.',
    assumptions: ['Supply remains constrained'],
    bundle_refs: bundleRef ? [bundleRef] : [],
    solver_config: {
      method: 'best_response',
      random_seed: 17,
      monte_carlo_samples: 12,
      iteration_limit: 25,
      parameter_range_notes: ['throughput +/- 15%', 'policy delay 0-2 steps'],
    },
    provenance_summary: 'Analyst-authored strategic model anchored to governed snapshot bundles.',
    confidence_note: 'Modeled strategic estimate; validate against governed evidence and context.',
    sensitivity_marking: 'INTERNAL',
    artifact_label: MODELED_OUTPUT_LABEL,
    non_operational_notice: NON_OPERATIONAL_NOTICE,
  },
  scenario_tree: {
    tree_id: 'tree-gm-main',
    game_id: 'gm-main',
    nodes: [],
    export_summary: 'No scenario-tree branches linked yet.',
  },
  latest_payoff_proxies: [],
  solver_runs: [],
})

const normalizeActor = (value: unknown, index: number): GameActor => {
  const fallback = createGameModelSnapshot().model.actors[0]
  if (!isRecord(value)) {
    return { ...fallback, actor_id: nextId('actor', index) }
  }
  return {
    actor_id: normalizeString(value.actor_id, nextId('actor', index)),
    label: normalizeString(value.label, fallback.label),
    actor_type: isActorType(value.actor_type) ? value.actor_type : fallback.actor_type,
  }
}

const normalizeObjective = (value: unknown, index: number): GameObjective => {
  const fallback = createGameModelSnapshot().model.objectives[0]
  if (!isRecord(value)) {
    return { ...fallback, objective_id: nextId('objective', index) }
  }
  return {
    objective_id: normalizeString(value.objective_id, nextId('objective', index)),
    label: normalizeString(value.label, fallback.label),
    weight: normalizeNumber(value.weight, fallback.weight),
    definition: normalizeString(value.definition, fallback.definition),
  }
}

const normalizeAction = (value: unknown, index: number): GameAction => {
  const fallback = createGameModelSnapshot().model.actions[0]
  if (!isRecord(value)) {
    return { ...fallback, action_id: nextId('action', index) }
  }
  return {
    action_id: normalizeString(value.action_id, nextId('action', index)),
    label: normalizeString(value.label, fallback.label),
    category: isActionCategory(value.category) ? value.category : fallback.category,
    description: normalizeString(value.description, fallback.description),
  }
}

const normalizeInformationSet = (value: unknown, index: number): InformationSet => {
  const fallback = createGameModelSnapshot().model.information_sets[0]
  if (!isRecord(value)) {
    return { ...fallback, information_set_id: nextId('info', index) }
  }
  return {
    information_set_id: normalizeString(value.information_set_id, nextId('info', index)),
    label: normalizeString(value.label, fallback.label),
    evidence_confidence: normalizeString(value.evidence_confidence, fallback.evidence_confidence),
    known_unknowns: normalizeStringArray(value.known_unknowns),
  }
}

const normalizePayoffProxy = (value: unknown): PayoffProxy => {
  if (!isRecord(value)) {
    return buildPayoffProxy('throughput_resilience', 100, 15)
  }
  const baseValue = normalizeNumber(value.value, 100)
  const uncertainty = Array.isArray(value.uncertainty) ? value.uncertainty : []
  return {
    metric: normalizeString(value.metric, 'throughput_resilience'),
    value: baseValue,
    uncertainty: [
      normalizeNumber(uncertainty[0], baseValue - 15),
      normalizeNumber(uncertainty[1], baseValue + 15),
    ],
    label: MODELED_OUTPUT_LABEL,
    basis: normalizeStringArray(value.basis),
    non_operational_notice: normalizeString(
      value.non_operational_notice,
      NON_OPERATIONAL_NOTICE,
    ),
  }
}

const normalizeScenarioTreeNode = (value: unknown, index: number): ScenarioTreeNode => {
  if (!isRecord(value)) {
    return {
      node_id: nextId('node', index),
      node_type: 'decision',
      label: 'Scenario branch',
    }
  }
  return {
    node_id: normalizeString(value.node_id, nextId('node', index)),
    node_type: isScenarioTreeNodeType(value.node_type) ? value.node_type : 'decision',
    label: normalizeString(value.label, 'Scenario branch'),
    parent_node_id:
      typeof value.parent_node_id === 'string' && value.parent_node_id.trim()
        ? value.parent_node_id
        : undefined,
    actor_id:
      typeof value.actor_id === 'string' && value.actor_id.trim() ? value.actor_id : undefined,
    scenario_fork_id:
      typeof value.scenario_fork_id === 'string' && value.scenario_fork_id.trim()
        ? value.scenario_fork_id
        : undefined,
    information_set_id:
      typeof value.information_set_id === 'string' && value.information_set_id.trim()
        ? value.information_set_id
        : undefined,
    chance_note:
      typeof value.chance_note === 'string' && value.chance_note.trim()
        ? value.chance_note
        : undefined,
    branch_probability:
      typeof value.branch_probability === 'number' && Number.isFinite(value.branch_probability)
        ? value.branch_probability
        : undefined,
  }
}

const normalizeSolverConfig = (value: unknown, fallback: SolverConfig): SolverConfig => {
  if (!isRecord(value)) {
    return fallback
  }
  return {
    method: isSolverMethod(value.method) ? value.method : fallback.method,
    random_seed: normalizeNumber(value.random_seed, fallback.random_seed),
    monte_carlo_samples: Math.max(
      1,
      normalizeNumber(value.monte_carlo_samples, fallback.monte_carlo_samples),
    ),
    iteration_limit: Math.max(1, normalizeNumber(value.iteration_limit, fallback.iteration_limit)),
    parameter_range_notes:
      normalizeStringArray(value.parameter_range_notes).length > 0
        ? normalizeStringArray(value.parameter_range_notes)
        : fallback.parameter_range_notes,
  }
}

export const normalizeGameModelSnapshot = (value: unknown): GameModelSnapshot => {
  const fallback = createGameModelSnapshot()
  if (!isRecord(value)) {
    return fallback
  }

  const modelValue = isRecord(value.model) ? value.model : {}
  const scenarioTreeValue = isRecord(value.scenario_tree) ? value.scenario_tree : {}

  const model: GameModel = {
    game_id: normalizeString(modelValue.game_id, fallback.model.game_id),
    version: Math.max(1, normalizeNumber(modelValue.version, fallback.model.version)),
    name: normalizeString(modelValue.name, fallback.model.name),
    created_by:
      typeof modelValue.created_by === 'string'
        ? (modelValue.created_by as GameModelRole)
        : fallback.model.created_by,
    created_at: normalizeString(modelValue.created_at, fallback.model.created_at),
    updated_at: normalizeString(modelValue.updated_at, fallback.model.updated_at),
    game_type: isGameType(modelValue.game_type) ? modelValue.game_type : fallback.model.game_type,
    actors:
      Array.isArray(modelValue.actors) && modelValue.actors.length > 0
        ? modelValue.actors.map(normalizeActor)
        : fallback.model.actors,
    objectives:
      Array.isArray(modelValue.objectives) && modelValue.objectives.length > 0
        ? modelValue.objectives.map(normalizeObjective)
        : fallback.model.objectives,
    actions:
      Array.isArray(modelValue.actions) && modelValue.actions.length > 0
        ? modelValue.actions.map(normalizeAction)
        : fallback.model.actions,
    information_model: normalizeString(
      modelValue.information_model,
      fallback.model.information_model,
    ),
    information_sets:
      Array.isArray(modelValue.information_sets) && modelValue.information_sets.length > 0
        ? modelValue.information_sets.map(normalizeInformationSet)
        : fallback.model.information_sets,
    payoff_model: normalizeString(modelValue.payoff_model, fallback.model.payoff_model),
    assumptions:
      normalizeStringArray(modelValue.assumptions).length > 0
        ? normalizeStringArray(modelValue.assumptions)
        : fallback.model.assumptions,
    bundle_refs: normalizeStringArray(modelValue.bundle_refs),
    solver_config: normalizeSolverConfig(modelValue.solver_config, fallback.model.solver_config),
    provenance_summary: normalizeString(
      modelValue.provenance_summary,
      fallback.model.provenance_summary,
    ),
    confidence_note: normalizeString(modelValue.confidence_note, fallback.model.confidence_note),
    sensitivity_marking: normalizeString(
      modelValue.sensitivity_marking,
      fallback.model.sensitivity_marking,
    ) as GameModelMarking,
    artifact_label: MODELED_OUTPUT_LABEL,
    non_operational_notice: normalizeString(
      modelValue.non_operational_notice,
      NON_OPERATIONAL_NOTICE,
    ),
  }

  return {
    model,
    scenario_tree: {
      tree_id: normalizeString(scenarioTreeValue.tree_id, `tree-${model.game_id}`),
      game_id: normalizeString(scenarioTreeValue.game_id, model.game_id),
      nodes: Array.isArray(scenarioTreeValue.nodes)
        ? scenarioTreeValue.nodes.map(normalizeScenarioTreeNode)
        : [],
      export_summary: normalizeString(
        scenarioTreeValue.export_summary,
        fallback.scenario_tree.export_summary,
      ),
    },
    latest_payoff_proxies: Array.isArray(value.latest_payoff_proxies)
      ? value.latest_payoff_proxies.map(normalizePayoffProxy)
      : [],
    solver_runs: Array.isArray(value.solver_runs)
      ? value.solver_runs
          .filter((entry): entry is Record<string, unknown> => isRecord(entry))
          .map((entry, index) => ({
            run_id: normalizeString(entry.run_id, nextId('solver-run', index)),
            game_id: normalizeString(entry.game_id, model.game_id),
            executed_at: normalizeString(entry.executed_at, model.updated_at),
            method: isSolverMethod(entry.method) ? entry.method : model.solver_config.method,
            random_seed: normalizeNumber(entry.random_seed, model.solver_config.random_seed),
            monte_carlo_samples: Math.max(
              1,
              normalizeNumber(entry.monte_carlo_samples, model.solver_config.monte_carlo_samples),
            ),
            input_bundle_refs: normalizeStringArray(entry.input_bundle_refs),
            linked_scenario_ids: normalizeStringArray(entry.linked_scenario_ids),
            payoff_proxies: Array.isArray(entry.payoff_proxies)
              ? entry.payoff_proxies.map(normalizePayoffProxy)
              : [],
            sensitivity_ranking: normalizeStringArray(entry.sensitivity_ranking),
            robust_summary: normalizeString(entry.robust_summary, 'No solver summary recorded.'),
            result_manifest_hash: normalizeString(
              entry.result_manifest_hash,
              stableHash(entry),
            ),
            artifact_label: MODELED_OUTPUT_LABEL,
            non_operational_notice: normalizeString(
              entry.non_operational_notice,
              NON_OPERATIONAL_NOTICE,
            ),
          }))
      : [],
    latest_parameter_sweep:
      isRecord(value.latest_parameter_sweep)
        ? {
            parameter_name: normalizeString(
              value.latest_parameter_sweep.parameter_name,
              'throughput_multiplier',
            ),
            sampled_values: normalizeNumberArray(value.latest_parameter_sweep.sampled_values),
            outcome_spread: normalizeNumberArray(value.latest_parameter_sweep.outcome_spread),
            sensitivity_ranking: normalizeStringArray(
              value.latest_parameter_sweep.sensitivity_ranking,
            ),
            monte_carlo_samples: Math.max(
              1,
              normalizeNumber(value.latest_parameter_sweep.monte_carlo_samples, 12),
            ),
          }
        : undefined,
    latest_voi_estimate:
      isRecord(value.latest_voi_estimate)
        ? {
            target: normalizeString(value.latest_voi_estimate.target, 'Throughput coverage'),
            recommendation: normalizeString(
              value.latest_voi_estimate.recommendation,
              'Increase governed evidence coverage.',
            ),
            uncertainty_reduction_pct: normalizeNumber(
              value.latest_voi_estimate.uncertainty_reduction_pct,
              10,
            ),
            rationale: normalizeString(
              value.latest_voi_estimate.rationale,
              'No rationale recorded.',
            ),
          }
        : undefined,
    experiment_bundle:
      isRecord(value.experiment_bundle)
        ? {
            experiment_bundle_id: normalizeString(
              value.experiment_bundle.experiment_bundle_id,
              `experiment-${model.game_id}`,
            ),
            game_id: normalizeString(value.experiment_bundle.game_id, model.game_id),
            game_model_version: Math.max(
              1,
              normalizeNumber(value.experiment_bundle.game_model_version, model.version),
            ),
            snapshot_bundle_refs: normalizeStringArray(value.experiment_bundle.snapshot_bundle_refs),
            scenario_fork_ids: normalizeStringArray(value.experiment_bundle.scenario_fork_ids),
            solver_run_ids: normalizeStringArray(value.experiment_bundle.solver_run_ids),
            solver_methods: Array.isArray(value.experiment_bundle.solver_methods)
              ? value.experiment_bundle.solver_methods.filter(isSolverMethod)
              : [],
            random_seeds: normalizeNumberArray(value.experiment_bundle.random_seeds),
            parameter_ranges: normalizeStringArray(value.experiment_bundle.parameter_ranges),
            result_manifest_hash: normalizeString(
              value.experiment_bundle.result_manifest_hash,
              stableHash(value.experiment_bundle),
            ),
            created_at: normalizeString(value.experiment_bundle.created_at, model.updated_at),
            summary: normalizeString(
              value.experiment_bundle.summary,
              'Experiment bundle recorded for reproducibility.',
            ),
            artifact_label: MODELED_OUTPUT_LABEL,
          }
        : undefined,
    selected_scenario_id:
      typeof value.selected_scenario_id === 'string' && value.selected_scenario_id.trim()
        ? value.selected_scenario_id
        : undefined,
  }
}

export const validateGameModel = (model: GameModel): boolean =>
  Boolean(model.name.trim()) &&
  model.bundle_refs.length > 0 &&
  model.actors.length > 0 &&
  model.objectives.length > 0 &&
  model.actions.length > 0 &&
  model.assumptions.length > 0 &&
  isGameType(model.game_type) &&
  model.actors.every((actor) => Boolean(actor.label.trim()) && isActorType(actor.actor_type)) &&
  model.objectives.every(
    (objective) =>
      Boolean(objective.label.trim()) &&
      Number.isFinite(objective.weight) &&
      objective.weight > 0 &&
      Boolean(objective.definition.trim()),
  ) &&
  model.actions.every(
    (action) =>
      Boolean(action.label.trim()) &&
      isActionCategory(action.category) &&
      Boolean(action.description.trim()),
  ) &&
  isSolverMethod(model.solver_config.method) &&
  Number.isFinite(model.solver_config.random_seed) &&
  model.solver_config.monte_carlo_samples > 0 &&
  model.non_operational_notice === NON_OPERATIONAL_NOTICE

export const buildPayoffProxy = (
  metric: string,
  value: number,
  spread: number,
  basis: string[] = [],
): PayoffProxy => ({
  metric,
  value,
  uncertainty: [value - spread, value + spread],
  label: MODELED_OUTPUT_LABEL,
  basis,
  non_operational_notice: NON_OPERATIONAL_NOTICE,
})

export const renameGameModel = (
  snapshot: GameModelSnapshot,
  name: string,
  updatedAt: string,
): GameModelSnapshot => ({
  ...snapshot,
  model: {
    ...bumpVersion(snapshot.model, updatedAt),
    name: name.trim() || snapshot.model.name,
  },
})

export const setGameType = (
  snapshot: GameModelSnapshot,
  gameType: GameType,
  updatedAt: string,
): GameModelSnapshot => ({
  ...snapshot,
  model: {
    ...bumpVersion(snapshot.model, updatedAt),
    game_type: gameType,
  },
})

export const appendGameActor = (
  snapshot: GameModelSnapshot,
  input: { label: string; actor_type: ActorType },
  updatedAt: string,
): GameModelSnapshot => ({
  ...snapshot,
  model: {
    ...bumpVersion(snapshot.model, updatedAt),
    actors: [
      ...snapshot.model.actors,
      {
        actor_id: nextId('actor', snapshot.model.actors.length),
        label: input.label.trim(),
        actor_type: input.actor_type,
      },
    ],
  },
})

export const appendGameObjective = (
  snapshot: GameModelSnapshot,
  input: { label: string; weight: number; definition: string },
  updatedAt: string,
): GameModelSnapshot => ({
  ...snapshot,
  model: {
    ...bumpVersion(snapshot.model, updatedAt),
    objectives: [
      ...snapshot.model.objectives,
      {
        objective_id: nextId('objective', snapshot.model.objectives.length),
        label: input.label.trim(),
        weight: input.weight,
        definition: input.definition.trim(),
      },
    ],
  },
})

export const appendGameAction = (
  snapshot: GameModelSnapshot,
  input: { label: string; category: ActionCategory; description: string },
  updatedAt: string,
): GameModelSnapshot => ({
  ...snapshot,
  model: {
    ...bumpVersion(snapshot.model, updatedAt),
    actions: [
      ...snapshot.model.actions,
      {
        action_id: nextId('action', snapshot.model.actions.length),
        label: input.label.trim(),
        category: input.category,
        description: input.description.trim(),
      },
    ],
  },
})

export const appendGameAssumption = (
  snapshot: GameModelSnapshot,
  assumption: string,
  updatedAt: string,
): GameModelSnapshot => ({
  ...snapshot,
  model: {
    ...bumpVersion(snapshot.model, updatedAt),
    assumptions: [...snapshot.model.assumptions, assumption.trim()],
  },
})

export const setSelectedGameScenario = (
  snapshot: GameModelSnapshot,
  scenarioId?: string,
): GameModelSnapshot => ({
  ...snapshot,
  selected_scenario_id: scenarioId,
})

export const appendScenarioTreeNode = (
  snapshot: GameModelSnapshot,
  input: {
    label: string
    node_type: ScenarioTreeNodeType
    scenario_fork_id?: string
    actor_id?: string
    parent_node_id?: string
    information_set_label?: string
    chance_note?: string
  },
  updatedAt: string,
): GameModelSnapshot => {
  let informationSets = snapshot.model.information_sets
  let informationSetId: string | undefined

  if (input.node_type === 'information_set') {
    informationSetId = nextId('info', informationSets.length)
    informationSets = [
      ...informationSets,
      {
        information_set_id: informationSetId,
        label: input.information_set_label?.trim() || `${input.label.trim()} beliefs`,
        evidence_confidence: 'Belief state linked to governed evidence confidence.',
        known_unknowns: ['Counterparty intent', 'Shock timing'],
      },
    ]
  }

  const nextNodes = [
    ...snapshot.scenario_tree.nodes,
    {
      node_id: nextId('node', snapshot.scenario_tree.nodes.length),
      node_type: input.node_type,
      label: input.label.trim(),
      parent_node_id: input.parent_node_id,
      actor_id: input.actor_id,
      scenario_fork_id: input.scenario_fork_id,
      information_set_id: informationSetId,
      chance_note: input.chance_note?.trim(),
      branch_probability:
        input.node_type === 'chance'
          ? Number((1 / (snapshot.scenario_tree.nodes.length + 1)).toFixed(2))
          : undefined,
    },
  ]

  return {
    ...snapshot,
    model: {
      ...bumpVersion(snapshot.model, updatedAt),
      information_sets: informationSets,
    },
    scenario_tree: {
      ...snapshot.scenario_tree,
      nodes: nextNodes,
      export_summary: `${nextNodes.length} scenario-tree nodes linked to modeled branches.`,
    },
  }
}

const buildSensitivityRanking = (assumptions: string[]): string[] =>
  assumptions
    .map((assumption, index) => ({
      assumption,
      weight: assumption.length + (assumptions.length - index) * 3,
    }))
    .sort((left, right) => right.weight - left.weight)
    .slice(0, 3)
    .map(({ assumption }, index) => `${index + 1}. ${assumption}`)

export const runGameSolver = (
  snapshot: GameModelSnapshot,
  options: {
    bundle_refs: string[]
    linked_scenario_ids: string[]
    solver_config?: Partial<SolverConfig>
    context_targets?: string[]
    executed_at?: string
  },
): GameModelSnapshot => {
  const executedAt = options.executed_at ?? snapshot.model.updated_at
  const solverConfig: SolverConfig = {
    ...snapshot.model.solver_config,
    ...options.solver_config,
  }

  const objectiveWeight = snapshot.model.objectives.reduce(
    (total, objective) => total + objective.weight,
    0,
  )
  const branchFactor = snapshot.scenario_tree.nodes.length * 4
  const scenarioFactor = options.linked_scenario_ids.length * 7
  const baseValue = Math.round(
    72 +
      snapshot.model.actors.length * 9 +
      snapshot.model.actions.length * 6 +
      objectiveWeight * 24 +
      branchFactor +
      scenarioFactor +
      (solverConfig.random_seed % 11),
  )
  const spread = Math.max(8, Math.round(solverConfig.monte_carlo_samples / 2))
  const payoffs = [
    buildPayoffProxy('throughput_resilience', baseValue, spread, [
      ...options.bundle_refs,
      ...options.linked_scenario_ids,
    ]),
    buildPayoffProxy('policy_cohesion', baseValue - 12, Math.max(6, spread - 2), [
      snapshot.model.game_type,
      solverConfig.method,
    ]),
  ]
  const sensitivityRanking = buildSensitivityRanking(snapshot.model.assumptions)
  const sweep: ParameterSweepResult = {
    parameter_name: 'throughput_multiplier',
    sampled_values: [0.85, 1, 1.15],
    outcome_spread: payoffs.map((proxy, index) => proxy.value + index * 3),
    sensitivity_ranking: sensitivityRanking,
    monte_carlo_samples: solverConfig.monte_carlo_samples,
  }
  const voi: ValueOfInformationEstimate = {
    target: options.context_targets?.[0] ?? 'Throughput coverage',
    recommendation: `Collect additional governed coverage for ${options.context_targets?.[0] ?? 'throughput coverage'}.`,
    uncertainty_reduction_pct: Math.min(35, 12 + snapshot.scenario_tree.nodes.length * 4),
    rationale: 'Highest leverage comes from reducing uncertainty in the leading modeled branch.',
  }
  const runPayload = {
    game_id: snapshot.model.game_id,
    method: solverConfig.method,
    random_seed: solverConfig.random_seed,
    monte_carlo_samples: solverConfig.monte_carlo_samples,
    bundle_refs: options.bundle_refs,
    linked_scenario_ids: options.linked_scenario_ids,
    payoffs,
    sweep,
    voi,
  }
  const resultManifestHash = stableHash(runPayload)
  const solverRun: SolverRunRecord = {
    run_id: nextId('solver-run', snapshot.solver_runs.length),
    game_id: snapshot.model.game_id,
    executed_at: executedAt,
    method: solverConfig.method,
    random_seed: solverConfig.random_seed,
    monte_carlo_samples: solverConfig.monte_carlo_samples,
    input_bundle_refs: options.bundle_refs,
    linked_scenario_ids: options.linked_scenario_ids,
    payoff_proxies: payoffs,
    sensitivity_ranking: sensitivityRanking,
    robust_summary: `${solverConfig.method} run with seed ${solverConfig.random_seed} favors branch spread ${payoffs[0].uncertainty[0]}-${payoffs[0].uncertainty[1]}.`,
    result_manifest_hash: resultManifestHash,
    artifact_label: MODELED_OUTPUT_LABEL,
    non_operational_notice: NON_OPERATIONAL_NOTICE,
  }
  const experimentBundle: ExperimentBundleArtifact = {
    experiment_bundle_id: `experiment-${snapshot.model.game_id}-${snapshot.solver_runs.length + 1}`,
    game_id: snapshot.model.game_id,
    game_model_version: snapshot.model.version + 1,
    snapshot_bundle_refs: options.bundle_refs,
    scenario_fork_ids: options.linked_scenario_ids,
    solver_run_ids: [...snapshot.solver_runs.map((run) => run.run_id), solverRun.run_id],
    solver_methods: [...snapshot.solver_runs.map((run) => run.method), solverRun.method],
    random_seeds: [...snapshot.solver_runs.map((run) => run.random_seed), solverRun.random_seed],
    parameter_ranges: solverConfig.parameter_range_notes,
    result_manifest_hash: resultManifestHash,
    created_at: executedAt,
    summary: `Experiment bundle for ${snapshot.model.name} with ${options.linked_scenario_ids.length} linked scenario branches.`,
    artifact_label: MODELED_OUTPUT_LABEL,
  }

  return {
    model: {
      ...bumpVersion(snapshot.model, executedAt),
      solver_config: solverConfig,
      bundle_refs: options.bundle_refs,
    },
    scenario_tree: snapshot.scenario_tree,
    latest_payoff_proxies: payoffs,
    solver_runs: [...snapshot.solver_runs, solverRun],
    latest_parameter_sweep: sweep,
    latest_voi_estimate: voi,
    experiment_bundle: experimentBundle,
    selected_scenario_id: options.linked_scenario_ids[0] ?? snapshot.selected_scenario_id,
  }
}
