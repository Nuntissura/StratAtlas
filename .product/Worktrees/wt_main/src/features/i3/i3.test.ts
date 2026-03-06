import { describe, expect, it } from 'vitest'
import {
  DEFAULT_COLLABORATION_ARTIFACT_ID,
  buildCollaborationReplayFrame,
  createCollaborationSnapshot,
  resolveReconnectConflict,
  setCollaborationReplayCursor,
  setEphemeralViewState,
  simulateReconnectMerge,
  upsertSharedArtifact,
} from './collaboration'

describe('I3 collaboration', () => {
  it('maintains merge-safe authored artifacts and attributed replay history', () => {
    let snapshot = createCollaborationSnapshot('session-1', 'analyst-1')
    snapshot = upsertSharedArtifact(snapshot, {
      actorId: 'analyst-1',
      artifactId: DEFAULT_COLLABORATION_ARTIFACT_ID,
      content: 'Local authored note',
    })
    snapshot = setEphemeralViewState(snapshot, {
      actorId: 'analyst-1',
      viewState: 'camera:aoi-3',
    })

    expect(snapshot.sharedArtifacts[0]?.content).toBe('Local authored note')
    expect(snapshot.sharedArtifacts[0]?.modifiedBy).toBe('analyst-1')
    expect(snapshot.ephemeralViewState).toBe('camera:aoi-3')
    expect(snapshot.eventLog.map((event) => event.actorId)).toEqual(['analyst-1', 'analyst-1'])

    const replay = buildCollaborationReplayFrame(setCollaborationReplayCursor(snapshot, 1))
    expect(replay.event?.eventType).toBe('view.ephemeral')
    expect(replay.summary).toContain('analyst-1')
  })

  it('detects reconnect conflicts and resolves them with explicit reconcile actions', () => {
    let snapshot = createCollaborationSnapshot('session-2', 'analyst-1')
    snapshot = upsertSharedArtifact(snapshot, {
      actorId: 'analyst-1',
      artifactId: DEFAULT_COLLABORATION_ARTIFACT_ID,
      content: 'Local alpha',
    })
    snapshot = setEphemeralViewState(snapshot, {
      actorId: 'analyst-1',
      viewState: 'zoom:3',
    })

    const merged = simulateReconnectMerge(snapshot, {
      artifactId: DEFAULT_COLLABORATION_ARTIFACT_ID,
      remoteActorId: 'analyst-2',
      remoteContent: 'Remote bravo',
      remoteViewState: 'zoom:9',
    })

    expect(merged.reconnectStatus).toBe('conflict')
    expect(merged.conflicts).toHaveLength(1)
    expect(merged.conflicts[0]?.localContent).toBe('Local alpha')
    expect(merged.conflicts[0]?.remoteContent).toBe('Remote bravo')
    expect(merged.ephemeralViewState).toBe('zoom:9')
    expect(merged.eventLog.some((event) => event.actorId === 'analyst-2')).toBe(true)
    expect(merged.eventLog.some((event) => event.eventType === 'conflict.detected')).toBe(true)

    const resolved = resolveReconnectConflict(merged, {
      actorId: 'analyst-1',
      artifactId: DEFAULT_COLLABORATION_ARTIFACT_ID,
      resolution: 'keep_local',
    })

    expect(resolved.reconnectStatus).toBe('synced')
    expect(resolved.conflicts).toEqual([])
    expect(resolved.sharedArtifacts[0]?.content).toBe('Local alpha')

    const replay = buildCollaborationReplayFrame(
      setCollaborationReplayCursor(resolved, resolved.eventLog.length - 1),
    )
    expect(replay.event?.eventType).toBe('conflict.resolved')
    expect(replay.summary).toContain('analyst-1')
  })
})
