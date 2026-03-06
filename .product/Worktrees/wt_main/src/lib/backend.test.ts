import { beforeEach, describe, expect, it } from 'vitest'
import { backend } from './backend'
import type { CreateBundleRequest } from '../contracts/i0'
import {
  DEFAULT_COLLABORATION_ARTIFACT_ID,
  createCollaborationSnapshot,
  setEphemeralViewState,
  upsertSharedArtifact,
} from '../features/i3/collaboration'

const buildStoredCollaborationSnapshot = (sharedNote: string, viewState: string) => {
  let snapshot = createCollaborationSnapshot('collab-main', 'analyst-1')
  snapshot = upsertSharedArtifact(snapshot, {
    actorId: 'analyst-1',
    artifactId: DEFAULT_COLLABORATION_ARTIFACT_ID,
    content: sharedNote,
  })
  snapshot = setEphemeralViewState(snapshot, {
    actorId: 'analyst-1',
    viewState,
  })
  return snapshot
}

const request: CreateBundleRequest = {
  role: 'analyst',
  marking: 'INTERNAL',
  state: {
    workspace: {
      mode: 'Offline',
      workflowMode: 'replay',
      note: 'seed state',
      activeLayers: ['base-map'],
      replayCursor: 42,
      forcedOffline: true,
      uiVersion: 'i0-recorder-hardening',
    },
    query: {
      definition: {
        queryId: 'query-main',
        version: 3,
        conditions: [{ field: 'speed', operator: 'greater_than', value: 20 }],
      },
      resultCount: 2,
      sourceRowCount: 4,
      matchedRowIds: [2, 4],
    },
    context: {
      domains: [
        {
          domain_id: 'ctx-1',
          domain_name: 'Port Throughput',
          domain_class: 'economic_indicator',
          source_name: 'UNCTAD',
          source_url: 'https://example.test/context',
          license: 'public',
          update_cadence: 'monthly',
          spatial_binding: 'point',
          temporal_resolution: 'monthly',
          sensitivity_class: 'PUBLIC',
          confidence_baseline: 'A',
          methodology_notes: 'Official aggregation',
          offline_behavior: 'pre_cacheable',
          presentation_type: 'map_overlay',
        },
      ],
      activeDomainIds: ['ctx-1'],
      correlationAoi: 'aoi-1',
    },
    compare: {
      baselineWindow: {
        start: '2026-01-01',
        end: '2026-01-31',
        label: 'Baseline 2026-01-01 -> 2026-01-31',
      },
      eventWindow: {
        start: '2026-02-01',
        end: '2026-02-28',
        label: 'Event 2026-02-01 -> 2026-02-28',
      },
      baselineSeries: [10, 12, 16],
      eventSeries: [8, 18, 20],
    },
    collaboration: buildStoredCollaborationSnapshot('alpha / bravo', 'zoom-8'),
    selectedBundleId: undefined,
    savedAt: '2026-03-06T00:00:00.000Z',
  },
  provenance_refs: [
    {
      source: 'test',
      license: 'internal',
      retrievedAt: '2026-03-05T00:00:00.000Z',
      pipelineVersion: 'test',
    },
  ],
}

describe('backend fallback', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('creates and reopens bundles deterministically', async () => {
    const manifest = await backend.createBundle(request)
    const reopen = await backend.openBundle(manifest.bundle_id, 'analyst')
    expect(reopen.manifest.bundle_id).toBe(manifest.bundle_id)
    expect(reopen.manifest.ui_state_hash).toBe(manifest.ui_state_hash)
    expect(manifest.assets.map((asset) => asset.asset_id)).toEqual([
      'workspace-state',
      'query-state',
      'context-snapshot',
      'compare-state',
      'collaboration-state',
      'recorder-state',
    ])
    expect(reopen.state.workspace.note).toBe('seed state')
    expect(reopen.state.workspace.replayCursor).toBe(42)
    expect(reopen.state.query.definition.version).toBe(3)
    expect(reopen.state.context.activeDomainIds).toEqual(['ctx-1'])
    expect(reopen.state.compare?.baselineSeries).toEqual([10, 12, 16])
    expect(
      reopen.state.collaboration?.sharedArtifacts.find(
        (artifact) => artifact.artifactId === DEFAULT_COLLABORATION_ARTIFACT_ID,
      )?.content,
    ).toBe('alpha / bravo')
  })

  it('loads and saves authoritative recorder state outside bundle reopen', async () => {
    await backend.saveRecorderState({
      role: 'analyst',
      state: request.state,
    })

    const restored = await backend.loadRecorderState()
    expect(restored.state?.workspace.workflowMode).toBe('replay')
    expect(restored.state?.query.matchedRowIds).toEqual([2, 4])
    expect(restored.state?.context.correlationAoi).toBe('aoi-1')
    expect(restored.state?.compare?.eventWindow.end).toBe('2026-02-28')
    expect(restored.state?.collaboration?.ephemeralViewState).toBe('zoom-8')
  })

  it('maintains an append-only hash chain in audit events', async () => {
    const first = await backend.appendAudit({
      role: 'analyst',
      event_type: 'event.one',
      payload: { x: 1 },
    })
    const second = await backend.appendAudit({
      role: 'analyst',
      event_type: 'event.two',
      payload: { x: 2 },
    })
    expect(second.prev_event_hash).toBe(first.event_hash)
    const head = await backend.getAuditHead()
    expect(head.event_hash).toBe(second.event_hash)
  })
})
