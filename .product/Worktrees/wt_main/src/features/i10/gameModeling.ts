export type ActorType = 'state' | 'bloc' | 'institution' | 'industry_coalition'

export interface GameActor {
  actor_id: string
  actor_type: ActorType
}

export interface GameAction {
  action_id: string
  category: 'policy' | 'logistics' | 'signaling'
}

export interface GameModel {
  game_id: string
  actors: GameActor[]
  actions: GameAction[]
  assumptions: string[]
  bundle_refs: string[]
}

export const validateGameModel = (model: GameModel): boolean =>
  model.actors.length > 0 &&
  model.actions.length > 0 &&
  model.actors.every((actor) =>
    ['state', 'bloc', 'institution', 'industry_coalition'].includes(actor.actor_type),
  ) &&
  model.actions.every((action) =>
    ['policy', 'logistics', 'signaling'].includes(action.category),
  )

export interface PayoffProxy {
  metric: string
  value: number
  uncertainty: [number, number]
  label: 'Modeled Output'
}

export const buildPayoffProxy = (
  metric: string,
  value: number,
  spread: number,
): PayoffProxy => ({
  metric,
  value,
  uncertainty: [value - spread, value + spread],
  label: 'Modeled Output',
})
