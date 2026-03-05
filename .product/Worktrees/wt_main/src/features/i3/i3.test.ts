import { describe, expect, it } from 'vitest'
import { CollaborationSession } from './collaboration'

describe('I3 collaboration', () => {
  it('maintains merge-safe state and replay attribution', () => {
    const session = new CollaborationSession()
    session.upsert('note', 'alpha', 'analyst-1')
    session.ephemeralViewState('zoom-3', 'analyst-2')
    const state = session.getState()
    expect(state.note).toBe('alpha')
    expect(state.ephemeral_view_state).toBe('zoom-3')

    const replay = session.replay()
    expect(replay).toHaveLength(2)
    expect(replay[0].actor).toBe('analyst-1')
    expect(replay[1].actor).toBe('analyst-2')
  })
})
