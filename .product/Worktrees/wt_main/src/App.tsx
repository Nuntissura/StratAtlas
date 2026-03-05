import { useEffect, useMemo, useState } from 'react'
import './App.css'
import type {
  AuditEvent,
  BundleManifest,
  SensitivityMarking,
  UserRole,
} from './contracts/i0'
import type { UiMode } from './features/i1/modes'
import { REQUIRED_UI_MODES } from './features/i1/modes'
import { backend } from './lib/backend'

const ROLES: UserRole[] = ['viewer', 'analyst', 'administrator', 'auditor']
const MARKINGS: SensitivityMarking[] = ['PUBLIC', 'INTERNAL', 'RESTRICTED']

const modeLabel = (forcedOffline: boolean): string =>
  forcedOffline ? 'Offline (forced)' : 'Online-capable'

function App() {
  const [role, setRole] = useState<UserRole>('analyst')
  const [marking, setMarking] = useState<SensitivityMarking>('INTERNAL')
  const [mode, setMode] = useState<UiMode>('offline')
  const [forcedOffline, setForcedOffline] = useState<boolean>(false)
  const [analystNote, setAnalystNote] = useState<string>('Initial analyst workspace state')
  const [activeLayers, setActiveLayers] = useState<string[]>(['base-map', 'context-panel'])
  const [bundles, setBundles] = useState<BundleManifest[]>([])
  const [selectedBundleId, setSelectedBundleId] = useState<string>('')
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([])
  const [auditHead, setAuditHead] = useState<string>('')
  const [status, setStatus] = useState<string>('Ready')
  const [busy, setBusy] = useState<boolean>(false)
  const [integrityState, setIntegrityState] = useState<string>('No bundle validation yet')

  const offline = forcedOffline || !navigator.onLine

  const workspaceState = useMemo(
    () => ({
      mode: modeLabel(forcedOffline),
      workflowMode: mode,
      note: analystNote,
      activeLayers,
      uiVersion: 'i0-walking-skeleton',
    }),
    [activeLayers, analystNote, forcedOffline, mode],
  )

  const refresh = async (): Promise<void> => {
    const [bundleList, events, head] = await Promise.all([
      backend.listBundles(),
      backend.listAuditEvents(),
      backend.getAuditHead(),
    ])
    setBundles(bundleList)
    setAuditEvents(events)
    setAuditHead(head.event_hash ?? '')
  }

  useEffect(() => {
    void refresh().catch((error: unknown) => {
      setStatus(`Failed to load state: ${String(error)}`)
    })
  }, [])

  useEffect(() => {
    const onConnectivityChange = async () => {
      try {
        await backend.appendAudit({
          role,
          event_type: 'connectivity.change',
          payload: {
            online: navigator.onLine,
            forced_offline: forcedOffline,
          },
        })
        await refresh()
      } catch {
        // Ignore connectivity audit failures in browser fallback.
      }
    }
    window.addEventListener('online', onConnectivityChange)
    window.addEventListener('offline', onConnectivityChange)
    return () => {
      window.removeEventListener('online', onConnectivityChange)
      window.removeEventListener('offline', onConnectivityChange)
    }
  }, [forcedOffline, role])

  const onCreateBundle = async () => {
    setBusy(true)
    setStatus('Creating bundle...')
    try {
      const manifest = await backend.createBundle({
        role,
        marking,
        ui_state: workspaceState,
        provenance_refs: [
          {
            source: 'workspace.session',
            license: 'internal',
            retrievedAt: new Date().toISOString(),
            pipelineVersion: 'i0',
          },
        ],
      })
      await backend.appendAudit({
        role,
        event_type: 'bundle.create',
        payload: { bundle_id: manifest.bundle_id, marking: manifest.marking },
      })
      setSelectedBundleId(manifest.bundle_id)
      await refresh()
      setStatus(`Bundle ${manifest.bundle_id} created`)
      setIntegrityState('Bundle created; deterministic reopen pending')
    } catch (error) {
      setStatus(`Create failed: ${String(error)}`)
    } finally {
      setBusy(false)
    }
  }

  const onOpenBundle = async () => {
    if (!selectedBundleId) {
      setStatus('Select a bundle to open')
      return
    }
    setBusy(true)
    setStatus('Opening bundle...')
    try {
      const result = await backend.openBundle(selectedBundleId)
      const restoredNote = typeof result.ui_state.note === 'string' ? result.ui_state.note : ''
      const restoredLayers = Array.isArray(result.ui_state.activeLayers)
        ? result.ui_state.activeLayers.filter((layer): layer is string => typeof layer === 'string')
        : []
      setAnalystNote(restoredNote)
      const restoredMode =
        typeof result.ui_state.workflowMode === 'string'
          ? (result.ui_state.workflowMode as UiMode)
          : undefined
      if (restoredMode && REQUIRED_UI_MODES.includes(restoredMode)) {
        setMode(restoredMode)
      }
      if (restoredLayers.length > 0) {
        setActiveLayers(restoredLayers)
      }
      await backend.appendAudit({
        role,
        event_type: 'bundle.open',
        payload: { bundle_id: result.manifest.bundle_id, ui_state_hash: result.manifest.ui_state_hash },
      })
      await refresh()
      setStatus(`Bundle ${result.manifest.bundle_id} reopened`)
      setIntegrityState('Determinism check passed during reopen')
    } catch (error) {
      setStatus(`Open failed: ${String(error)}`)
      setIntegrityState('Determinism check failed')
    } finally {
      setBusy(false)
    }
  }

  const toggleLayer = (layer: string) => {
    setActiveLayers((prev) =>
      prev.includes(layer) ? prev.filter((existing) => existing !== layer) : [...prev, layer],
    )
  }

  const onToggleForcedOffline = async () => {
    const next = !forcedOffline
    setForcedOffline(next)
    try {
      await backend.appendAudit({
        role,
        event_type: 'offline.mode_change',
        payload: { forced_offline: next, navigator_online: navigator.onLine },
      })
      await refresh()
    } catch {
      // No-op in environments without backend persistence.
    }
  }

  return (
    <div className="shell">
      <header className="header" data-testid="region-header">
        <div className="identity">
          <h1>StratAtlas I0 Walking Skeleton</h1>
          <p>Bundle determinism, audit chain, markings, and offline-first controls</p>
        </div>
        <div className="status-block">
          <span className={offline ? 'pill offline' : 'pill online'}>
            {offline ? 'OFFLINE' : 'ONLINE'}
          </span>
          <span className="pill neutral">Role: {role}</span>
          <span className="pill neutral">Marking: {marking}</span>
        </div>
      </header>

      <main className="layout">
        <section className="panel workspace" data-testid="region-left-panel">
          <h2>Workspace</h2>
          <label className="field">
            Role
            <select value={role} onChange={(event) => setRole(event.target.value as UserRole)}>
              {ROLES.map((currentRole) => (
                <option key={currentRole} value={currentRole}>
                  {currentRole}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Marking
            <select
              value={marking}
              onChange={(event) => setMarking(event.target.value as SensitivityMarking)}
            >
              {MARKINGS.map((currentMarking) => (
                <option key={currentMarking} value={currentMarking}>
                  {currentMarking}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Mode
            <select value={mode} onChange={(event) => setMode(event.target.value as UiMode)}>
              {REQUIRED_UI_MODES.map((currentMode) => (
                <option key={currentMode} value={currentMode}>
                  {currentMode}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Analyst Note
            <textarea
              value={analystNote}
              onChange={(event) => setAnalystNote(event.target.value)}
              rows={4}
            />
          </label>

          <div className="field">
            Active Layers
            <div className="checkbox-group">
              {['base-map', 'context-panel', 'audit-overlay', 'bundle-metadata'].map((layer) => (
                <label key={layer}>
                  <input
                    type="checkbox"
                    checked={activeLayers.includes(layer)}
                    onChange={() => toggleLayer(layer)}
                  />
                  {layer}
                </label>
              ))}
            </div>
          </div>

          <div className="controls">
            <button onClick={onCreateBundle} disabled={busy}>
              Create Bundle
            </button>
            <button onClick={onOpenBundle} disabled={busy || !selectedBundleId}>
              Reopen Bundle
            </button>
            <button onClick={onToggleForcedOffline} disabled={busy}>
              {forcedOffline ? 'Disable Forced Offline' : 'Force Offline Mode'}
            </button>
          </div>
          <p className="status-line">{status}</p>
          <p className="status-line">{integrityState}</p>
        </section>

        <section className="panel map-panel" data-testid="region-main-canvas">
          <h2>Main Canvas Placeholder</h2>
          <div className="map-placeholder">
            <p>2D/3D render surfaces are being introduced in I1.</p>
            <p>Current mode: {mode}</p>
            <p>Layer count: {activeLayers.length}</p>
          </div>

          <h3>Bundle Registry</h3>
          <div className="bundle-list">
            {bundles.length === 0 && <p>No bundles yet.</p>}
            {bundles.map((bundle) => (
              <label key={bundle.bundle_id} className="bundle-item">
                <input
                  type="radio"
                  name="bundle"
                  value={bundle.bundle_id}
                  checked={selectedBundleId === bundle.bundle_id}
                  onChange={() => setSelectedBundleId(bundle.bundle_id)}
                />
                <span>{bundle.bundle_id}</span>
                <small>{bundle.created_at}</small>
              </label>
            ))}
          </div>
        </section>

        <section className="panel audit-panel" data-testid="region-right-panel">
          <h2>Audit Ledger</h2>
          <p>Current head hash: {auditHead || 'n/a'}</p>
          <div className="audit-list">
            {auditEvents.length === 0 && <p>No events recorded.</p>}
            {auditEvents
              .slice()
              .reverse()
              .map((event) => (
                <article key={event.event_id} className="audit-item">
                  <strong>{event.event_type}</strong>
                  <span>{event.ts}</span>
                  <span>Role: {event.actor_role}</span>
                  <code>{event.event_hash}</code>
                </article>
              ))}
          </div>
        </section>
      </main>
      <footer className="panel footer-panel" data-testid="region-bottom-panel">
        <strong>Bottom Panel</strong>
        <span>{` Mode=${mode} | Connectivity=${offline ? 'offline' : 'online'} | Audit events=${auditEvents.length}`}</span>
      </footer>
    </div>
  )
}

export default App
