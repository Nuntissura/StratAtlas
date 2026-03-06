import * as Y from 'yjs'

export const DEFAULT_COLLABORATION_ARTIFACT_ID = 'shared-note'

export type CollaborationReconnectStatus = 'synced' | 'reconnecting' | 'conflict'

export type CollaborationEventType =
  | 'artifact.upsert'
  | 'view.ephemeral'
  | 'reconnect.merge'
  | 'conflict.detected'
  | 'conflict.resolved'

export type CollaborationConflictResolution = 'keep_local' | 'keep_remote' | 'keep_merged'

export interface CollaborationArtifactSnapshot {
  artifactId: string
  content: string
  modifiedBy: string
}

export interface CollaborationEvent {
  eventId: string
  actorId: string
  eventType: CollaborationEventType
  summary: string
  artifactId?: string
}

export interface CollaborationConflict {
  artifactId: string
  localContent: string
  remoteContent: string
  mergedContent: string
  remoteActorId: string
}

export interface CollaborationStateSnapshot {
  sessionId: string
  actorId: string
  docUpdateBase64: string
  syncedDocUpdateBase64: string
  sharedArtifacts: CollaborationArtifactSnapshot[]
  ephemeralViewState: string
  reconnectStatus: CollaborationReconnectStatus
  conflicts: CollaborationConflict[]
  replayCursor: number
  eventLog: CollaborationEvent[]
}

export interface CollaborationReplayFrame {
  cursor: number
  totalEvents: number
  summary: string
  event?: CollaborationEvent
}

const encodeBase64 = (bytes: Uint8Array): string => {
  if (typeof btoa === 'function') {
    let binary = ''
    bytes.forEach((value) => {
      binary += String.fromCharCode(value)
    })
    return btoa(binary)
  }

  const bufferCtor = (
    globalThis as {
      Buffer?: {
        from(input: Uint8Array | string, encoding?: string): {
          toString(encoding: string): string
        }
      }
    }
  ).Buffer
  if (bufferCtor) {
    return bufferCtor.from(bytes).toString('base64')
  }

  throw new Error('Base64 encoding is unavailable in this runtime')
}

const decodeBase64 = (value: string): Uint8Array => {
  if (!value) {
    return new Uint8Array()
  }
  if (typeof atob === 'function') {
    const binary = atob(value)
    return Uint8Array.from(binary, (character) => character.charCodeAt(0))
  }

  const bufferCtor = (
    globalThis as {
      Buffer?: {
        from(input: string, encoding: string): Uint8Array
      }
    }
  ).Buffer
  if (bufferCtor) {
    return new Uint8Array(bufferCtor.from(value, 'base64'))
  }

  throw new Error('Base64 decoding is unavailable in this runtime')
}

const loadDoc = (snapshotBase64: string): Y.Doc => {
  const doc = new Y.Doc()
  const update = decodeBase64(snapshotBase64)
  if (update.length > 0) {
    Y.applyUpdate(doc, update)
  }
  return doc
}

const getArtifactsMap = (doc: Y.Doc): Y.Map<Y.Text> => doc.getMap<Y.Text>('artifacts')

const getEphemeralMap = (doc: Y.Doc): Y.Map<string> => doc.getMap<string>('ephemeral')

const getEventsArray = (doc: Y.Doc): Y.Array<CollaborationEvent> =>
  doc.getArray<CollaborationEvent>('events')

const replaceText = (text: Y.Text, value: string): void => {
  if (text.length > 0) {
    text.delete(0, text.length)
  }
  if (value.length > 0) {
    text.insert(0, value)
  }
}

const currentEvents = (doc: Y.Doc): CollaborationEvent[] => getEventsArray(doc).toArray()

const nextEventId = (doc: Y.Doc, actorId: string): string => {
  const actorEvents = currentEvents(doc).filter((event) => event.actorId === actorId)
  const sequence = actorEvents.length + 1
  return `${actorId}:${sequence.toString().padStart(4, '0')}`
}

const appendEvent = (
  doc: Y.Doc,
  actorId: string,
  eventType: CollaborationEventType,
  summary: string,
  artifactId?: string,
): void => {
  getEventsArray(doc).push([
    {
      eventId: nextEventId(doc, actorId),
      actorId,
      eventType,
      summary,
      artifactId,
    },
  ])
}

const readArtifacts = (doc: Y.Doc): CollaborationArtifactSnapshot[] => {
  const events = currentEvents(doc)
  const latestActorByArtifact = new Map<string, string>()

  events.forEach((event) => {
    if (event.artifactId && event.eventType !== 'view.ephemeral') {
      latestActorByArtifact.set(event.artifactId, event.actorId)
    }
  })

  return [...getArtifactsMap(doc).entries()]
    .map(([artifactId, text]) => ({
      artifactId,
      content: text.toString(),
      modifiedBy: latestActorByArtifact.get(artifactId) ?? 'unknown',
    }))
    .sort((left, right) => left.artifactId.localeCompare(right.artifactId))
}

const readEphemeralViewState = (doc: Y.Doc): string => getEphemeralMap(doc).get('viewState') ?? ''

const clampReplayCursor = (cursor: number, totalEvents: number): number => {
  if (totalEvents === 0) {
    return 0
  }
  return Math.min(Math.max(cursor, 0), totalEvents - 1)
}

const buildSnapshot = ({
  doc,
  previous,
  syncedDocUpdateBase64,
  reconnectStatus,
  conflicts,
  actorId,
  replayCursor,
}: {
  doc: Y.Doc
  previous: CollaborationStateSnapshot
  syncedDocUpdateBase64: string
  reconnectStatus: CollaborationReconnectStatus
  conflicts: CollaborationConflict[]
  actorId?: string
  replayCursor?: number
}): CollaborationStateSnapshot => {
  const eventLog = currentEvents(doc)
  return {
    sessionId: previous.sessionId,
    actorId: actorId ?? previous.actorId,
    docUpdateBase64: encodeBase64(Y.encodeStateAsUpdate(doc)),
    syncedDocUpdateBase64,
    sharedArtifacts: readArtifacts(doc),
    ephemeralViewState: readEphemeralViewState(doc),
    reconnectStatus,
    conflicts,
    replayCursor: clampReplayCursor(replayCursor ?? previous.replayCursor, eventLog.length),
    eventLog,
  }
}

const artifactContentMap = (doc: Y.Doc): Map<string, string> =>
  new Map(readArtifacts(doc).map((artifact) => [artifact.artifactId, artifact.content]))

const applyArtifactContent = (doc: Y.Doc, artifactId: string, content: string): void => {
  const artifacts = getArtifactsMap(doc)
  let text = artifacts.get(artifactId)
  if (!text) {
    text = new Y.Text()
    artifacts.set(artifactId, text)
  }
  replaceText(text, content)
}

const unresolvedConflicts = (conflicts: CollaborationConflict[]): CollaborationConflict[] =>
  conflicts.filter((conflict) => conflict.localContent !== conflict.remoteContent)

export const createCollaborationSnapshot = (
  sessionId: string,
  actorId: string,
): CollaborationStateSnapshot => {
  const doc = new Y.Doc()
  const baseUpdate = encodeBase64(Y.encodeStateAsUpdate(doc))

  return {
    sessionId,
    actorId,
    docUpdateBase64: baseUpdate,
    syncedDocUpdateBase64: baseUpdate,
    sharedArtifacts: [],
    ephemeralViewState: '',
    reconnectStatus: 'synced',
    conflicts: [],
    replayCursor: 0,
    eventLog: [],
  }
}

export const normalizeCollaborationSnapshot = (
  value: CollaborationStateSnapshot | undefined,
  fallbackActorId: string,
): CollaborationStateSnapshot =>
  value ?? createCollaborationSnapshot('collab-session', fallbackActorId)

export const upsertSharedArtifact = (
  snapshot: CollaborationStateSnapshot,
  {
    artifactId,
    content,
    actorId,
  }: {
    artifactId: string
    content: string
    actorId: string
  },
): CollaborationStateSnapshot => {
  const doc = loadDoc(snapshot.docUpdateBase64)
  const previousContent = artifactContentMap(doc).get(artifactId) ?? ''

  if (previousContent === content) {
    return { ...snapshot, actorId }
  }

  applyArtifactContent(doc, artifactId, content)
  appendEvent(doc, actorId, 'artifact.upsert', `Updated ${artifactId}`, artifactId)

  const reconnectStatus =
    unresolvedConflicts(snapshot.conflicts).length > 0 ? 'conflict' : snapshot.reconnectStatus

  return buildSnapshot({
    doc,
    previous: snapshot,
    syncedDocUpdateBase64: snapshot.syncedDocUpdateBase64,
    reconnectStatus,
    conflicts: snapshot.conflicts,
    actorId,
  })
}

export const setEphemeralViewState = (
  snapshot: CollaborationStateSnapshot,
  {
    actorId,
    viewState,
  }: {
    actorId: string
    viewState: string
  },
): CollaborationStateSnapshot => {
  const doc = loadDoc(snapshot.docUpdateBase64)
  getEphemeralMap(doc).set('viewState', viewState)
  appendEvent(doc, actorId, 'view.ephemeral', 'Updated ephemeral view state')

  return buildSnapshot({
    doc,
    previous: snapshot,
    syncedDocUpdateBase64: snapshot.syncedDocUpdateBase64,
    reconnectStatus:
      unresolvedConflicts(snapshot.conflicts).length > 0 ? 'conflict' : snapshot.reconnectStatus,
    conflicts: snapshot.conflicts,
    actorId,
  })
}

export const simulateReconnectMerge = (
  snapshot: CollaborationStateSnapshot,
  {
    artifactId,
    remoteActorId,
    remoteContent,
    remoteViewState,
  }: {
    artifactId: string
    remoteActorId: string
    remoteContent?: string
    remoteViewState?: string
  },
): CollaborationStateSnapshot => {
  const localDoc = loadDoc(snapshot.docUpdateBase64)
  const syncedDoc = loadDoc(snapshot.syncedDocUpdateBase64)
  const remoteDoc = loadDoc(snapshot.syncedDocUpdateBase64)

  const baseArtifacts = artifactContentMap(syncedDoc)
  const localArtifacts = artifactContentMap(localDoc)

  if (typeof remoteContent === 'string') {
    applyArtifactContent(remoteDoc, artifactId, remoteContent)
    appendEvent(remoteDoc, remoteActorId, 'artifact.upsert', `Updated ${artifactId}`, artifactId)
  }

  if (typeof remoteViewState === 'string') {
    getEphemeralMap(remoteDoc).set('viewState', remoteViewState)
    appendEvent(remoteDoc, remoteActorId, 'view.ephemeral', 'Updated ephemeral view state')
  }

  Y.applyUpdate(localDoc, Y.encodeStateAsUpdate(remoteDoc))
  if (typeof remoteViewState === 'string') {
    // Ephemeral camera/view state is not conflict-resolved like shared artifacts; the reconnecting
    // client should reflect the most recent remote view update after merge.
    getEphemeralMap(localDoc).set('viewState', remoteViewState)
  }

  const mergedArtifacts = artifactContentMap(localDoc)
  const baseContent = baseArtifacts.get(artifactId) ?? ''
  const localContent = localArtifacts.get(artifactId) ?? ''
  const mergedContent = mergedArtifacts.get(artifactId) ?? localContent

  const conflicts =
    typeof remoteContent === 'string' &&
    localContent !== baseContent &&
    remoteContent !== baseContent &&
    localContent !== remoteContent
      ? [
          {
            artifactId,
            localContent,
            remoteContent,
            mergedContent,
            remoteActorId,
          },
        ]
      : []

  appendEvent(
    localDoc,
    snapshot.actorId,
    'reconnect.merge',
    `Merged remote collaboration update from ${remoteActorId}`,
    artifactId,
  )

  if (conflicts.length > 0) {
    appendEvent(
      localDoc,
      snapshot.actorId,
      'conflict.detected',
      `Detected reconnect conflict on ${artifactId}`,
      artifactId,
    )
  }

  const currentDocUpdateBase64 = encodeBase64(Y.encodeStateAsUpdate(localDoc))

  return buildSnapshot({
    doc: localDoc,
    previous: snapshot,
    syncedDocUpdateBase64: currentDocUpdateBase64,
    reconnectStatus: conflicts.length > 0 ? 'conflict' : 'synced',
    conflicts,
  })
}

export const resolveReconnectConflict = (
  snapshot: CollaborationStateSnapshot,
  {
    actorId,
    artifactId,
    resolution,
  }: {
    actorId: string
    artifactId: string
    resolution: CollaborationConflictResolution
  },
): CollaborationStateSnapshot => {
  const conflict = snapshot.conflicts.find((entry) => entry.artifactId === artifactId)
  if (!conflict) {
    return { ...snapshot, actorId }
  }

  const doc = loadDoc(snapshot.docUpdateBase64)
  const resolvedContent =
    resolution === 'keep_local'
      ? conflict.localContent
      : resolution === 'keep_remote'
        ? conflict.remoteContent
        : conflict.mergedContent

  applyArtifactContent(doc, artifactId, resolvedContent)
  appendEvent(
    doc,
    actorId,
    'conflict.resolved',
    `Resolved conflict on ${artifactId} using ${resolution}`,
    artifactId,
  )

  const remainingConflicts = snapshot.conflicts.filter((entry) => entry.artifactId !== artifactId)
  const currentDocUpdateBase64 = encodeBase64(Y.encodeStateAsUpdate(doc))

  return buildSnapshot({
    doc,
    previous: snapshot,
    syncedDocUpdateBase64: currentDocUpdateBase64,
    reconnectStatus: remainingConflicts.length > 0 ? 'conflict' : 'synced',
    conflicts: remainingConflicts,
    actorId,
  })
}

export const setCollaborationReplayCursor = (
  snapshot: CollaborationStateSnapshot,
  cursor: number,
): CollaborationStateSnapshot => ({
  ...snapshot,
  replayCursor: clampReplayCursor(cursor, snapshot.eventLog.length),
})

export const buildCollaborationReplayFrame = (
  snapshot: CollaborationStateSnapshot,
): CollaborationReplayFrame => {
  const totalEvents = snapshot.eventLog.length
  const cursor = clampReplayCursor(snapshot.replayCursor, totalEvents)
  const event = snapshot.eventLog[cursor]

  return {
    cursor,
    totalEvents,
    event,
    summary: event
      ? `${event.actorId}: ${event.summary}`
      : 'No collaboration events recorded yet.',
  }
}
