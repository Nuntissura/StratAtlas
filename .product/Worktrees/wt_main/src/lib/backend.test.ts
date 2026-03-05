import { beforeEach, describe, expect, it } from 'vitest'
import { backend } from './backend'
import type { CreateBundleRequest } from '../contracts/i0'

const request: CreateBundleRequest = {
  role: 'analyst',
  marking: 'INTERNAL',
  ui_state: {
    mode: 'Offline',
    note: 'seed state',
    activeLayers: ['base-map'],
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
    const reopen = await backend.openBundle(manifest.bundle_id)
    expect(reopen.manifest.bundle_id).toBe(manifest.bundle_id)
    expect(reopen.manifest.ui_state_hash).toBe(manifest.ui_state_hash)
    expect(reopen.ui_state.note).toBe('seed state')
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
