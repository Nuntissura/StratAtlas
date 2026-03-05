import * as Y from 'yjs'

export interface SessionEvent {
  actor: string
  type: string
  payload: Record<string, unknown>
}

export class CollaborationSession {
  private readonly doc = new Y.Doc()
  private readonly sharedMap = this.doc.getMap<unknown>('state')
  private readonly events: SessionEvent[] = []

  upsert(key: string, value: unknown, actor: string): void {
    this.sharedMap.set(key, value)
    this.events.push({ actor, type: 'upsert', payload: { key, value } })
  }

  ephemeralViewState(value: string, actor: string): void {
    this.sharedMap.set('ephemeral_view_state', value)
    this.events.push({ actor, type: 'ephemeral', payload: { value } })
  }

  getState(): Record<string, unknown> {
    return Object.fromEntries(this.sharedMap.entries())
  }

  replay(): SessionEvent[] {
    return [...this.events]
  }
}
