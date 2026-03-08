import { describe, expect, it } from 'vitest'
import {
  appendGameAction,
  appendGameActor,
  appendGameAssumption,
  appendGameObjective,
  appendScenarioTreeNode,
  createGameModelSnapshot,
  normalizeGameModelSnapshot,
  runGameSolver,
  setSelectedGameScenario,
  validateGameModel,
} from './gameModeling'

describe('I10 game modeling', () => {
  it('enforces strategic-level guardrails on the governed game model artifact', () => {
    const snapshot = createGameModelSnapshot('bundle-1')
    expect(validateGameModel(snapshot.model)).toBe(true)

    const invalidModel = normalizeGameModelSnapshot(snapshot).model
    expect(
      validateGameModel({
        ...invalidModel,
        actors: [{ actor_id: 'actor-x', label: 'Unsupported', actor_type: 'person' as never }],
      }),
    ).toBe(false)
  })

  it('captures scenario-tree branches, solver runs, and reproducible experiment bundles', () => {
    let snapshot = createGameModelSnapshot('bundle-1')
    snapshot = appendGameActor(
      snapshot,
      { label: 'Port authority consortium', actor_type: 'institution' },
      '2026-03-06T00:05:00.000Z',
    )
    snapshot = appendGameObjective(
      snapshot,
      {
        label: 'Reduce congestion spillover',
        weight: 0.4,
        definition: 'Lower modeled congestion spillover across the AOI.',
      },
      '2026-03-06T00:06:00.000Z',
    )
    snapshot = appendGameAction(
      snapshot,
      {
        label: 'Phase inspection windows',
        category: 'policy',
        description: 'Strategic inspection sequencing policy.',
      },
      '2026-03-06T00:07:00.000Z',
    )
    snapshot = appendGameAssumption(snapshot, 'Inspection delays remain bounded', '2026-03-06T00:08:00.000Z')
    snapshot = setSelectedGameScenario(snapshot, 'scenario-2')
    snapshot = appendScenarioTreeNode(
      snapshot,
      {
        label: 'Coalition chooses surge posture',
        node_type: 'decision',
        scenario_fork_id: 'scenario-2',
        actor_id: snapshot.model.actors[0].actor_id,
      },
      '2026-03-06T00:09:00.000Z',
    )
    snapshot = appendScenarioTreeNode(
      snapshot,
      {
        label: 'Weather shock branch',
        node_type: 'chance',
        scenario_fork_id: 'scenario-2',
        parent_node_id: snapshot.scenario_tree.nodes[0]?.node_id,
        chance_note: 'Storm slows berth turnover',
      },
      '2026-03-06T00:10:00.000Z',
    )
    snapshot = appendScenarioTreeNode(
      snapshot,
      {
        label: 'Belief update branch',
        node_type: 'information_set',
        scenario_fork_id: 'scenario-2',
        parent_node_id: snapshot.scenario_tree.nodes[1]?.node_id,
        information_set_label: 'Storm confidence update',
      },
      '2026-03-06T00:11:00.000Z',
    )

    const solved = runGameSolver(snapshot, {
      bundle_refs: ['bundle-1'],
      linked_scenario_ids: ['scenario-2'],
      context_targets: ['Port Throughput'],
      solver_config: {
        method: 'minimax_regret',
        random_seed: 29,
        monte_carlo_samples: 24,
      },
      executed_at: '2026-03-06T00:12:00.000Z',
    })

    expect(solved.scenario_tree.nodes).toHaveLength(3)
    expect(solved.solver_runs).toHaveLength(1)
    expect(solved.solver_runs[0]?.linked_scenario_ids).toEqual(['scenario-2'])
    expect(solved.solver_runs[0]?.runtime).toBe('browser-simulated')
    expect(solved.solver_runs[0]?.scenario_evaluations).toHaveLength(1)
    expect(solved.solver_runs[0]?.evidence.bundle_refs).toEqual(['bundle-1'])
    expect(solved.solver_runs[0]?.trace_summary).toMatch(/scenario evaluation/)
    expect(solved.latest_parameter_sweep?.sampled_values).toEqual([0.85, 1, 1.15])
    expect(solved.latest_voi_estimate?.target).toBe('Port Throughput')
    expect(solved.experiment_bundle?.snapshot_bundle_refs).toEqual(['bundle-1'])
    expect(solved.experiment_bundle?.solver_run_ids).toContain(solved.solver_runs[0]?.run_id)
    expect(solved.experiment_bundle?.runtime).toBe('browser-simulated')
    expect(solved.experiment_bundle?.trace_manifest_hash).toMatch(/^gm-/)
    expect(solved.latest_payoff_proxies[0]?.label).toBe('Modeled Output')
  })
})
