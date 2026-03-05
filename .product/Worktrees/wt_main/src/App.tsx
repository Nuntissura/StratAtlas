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
import { I1_BUDGETS, shouldDegradeRendering } from './features/i1/performance'
import { buildBriefingBundle, computeDensityDelta } from './features/i2/baselineDelta'
import { runQuery, bumpQueryVersion, type VersionedQuery } from './features/i5/queryBuilder'
import { submitAiAnalysis } from './features/i6/aiGateway'
import { validateDomainRegistration, type ContextDomain } from './features/i7/contextIntake'
import { detectDeviation, type DeviationEvent } from './features/i8/deviation'
import {
  CURATED_OSINT_SOURCES,
  aggregateAlerts,
  validateCuratedSource,
  type OsintEvent,
  type VerificationLevel,
} from './features/i9/osint'
import { buildPayoffProxy, validateGameModel } from './features/i10/gameModeling'
import { backend } from './lib/backend'

const ROLES: UserRole[] = ['viewer', 'analyst', 'administrator', 'auditor']
const MARKINGS: SensitivityMarking[] = ['PUBLIC', 'INTERNAL', 'RESTRICTED']

const modeLabel = (forcedOffline: boolean): string =>
  forcedOffline ? 'Offline (forced)' : 'Online-capable'

const parseNumericSeries = (value: string): number[] =>
  value
    .split(',')
    .map((entry) => Number(entry.trim()))
    .filter((entry) => Number.isFinite(entry))

const createDomainDraft = (): ContextDomain => ({
  domain_id: `ctx-${Date.now()}`,
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
})

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
  const [replayCursor, setReplayCursor] = useState<number>(0)
  const [replayFrameMs, setReplayFrameMs] = useState<number>(32)
  const [baselineInput, setBaselineInput] = useState<string>('10,12,16,21,30')
  const [eventInput, setEventInput] = useState<string>('8,18,20,26,31')
  const [versionedQuery, setVersionedQuery] = useState<VersionedQuery>({
    queryId: 'query-main',
    version: 1,
    conditions: [{ field: 'speed', operator: 'greater_than', value: 20 }],
  })
  const [aiPrompt, setAiPrompt] = useState<string>('Summarize this selected bundle.')
  const [aiSummary, setAiSummary] = useState<string>('')
  const [domains, setDomains] = useState<ContextDomain[]>([])
  const [domainDraft, setDomainDraft] = useState<ContextDomain>(createDomainDraft)
  const [deviationBaselineInput, setDeviationBaselineInput] = useState<string>('100,98,102,99')
  const [deviationObservedInput, setDeviationObservedInput] = useState<string>('120,124,119,130')
  const [deviationThreshold, setDeviationThreshold] = useState<number>(0.2)
  const [deviationType, setDeviationType] =
    useState<DeviationEvent['deviation_type']>('trade_flow')
  const [osintSource, setOsintSource] = useState<string>(CURATED_OSINT_SOURCES[0])
  const [osintVerification, setOsintVerification] = useState<VerificationLevel>('reported')
  const [osintAoi, setOsintAoi] = useState<string>('aoi-1')
  const [osintEvents, setOsintEvents] = useState<OsintEvent[]>([])
  const [gameAssumption, setGameAssumption] = useState<string>('Supply remains constrained')

  const offline = forcedOffline || !navigator.onLine

  const workspaceState = useMemo(
    () => ({
      mode: modeLabel(forcedOffline),
      workflowMode: mode,
      note: analystNote,
      activeLayers,
      replayCursor,
      queryVersion: versionedQuery.version,
      uiVersion: 'i0-walking-skeleton',
    }),
    [activeLayers, analystNote, forcedOffline, mode, replayCursor, versionedQuery.version],
  )

  const queryRows = useMemo(
    () => [
      { id: 1, speed: 14, type: 'vessel', region: 'aoi-1' },
      { id: 2, speed: 37, type: 'vessel', region: 'aoi-1' },
      { id: 3, speed: 48, type: 'aircraft', region: 'aoi-2' },
      { id: 4, speed: 61, type: 'vessel', region: 'aoi-3' },
    ],
    [],
  )

  const queryResult = useMemo(
    () => runQuery(versionedQuery.conditions, queryRows),
    [queryRows, versionedQuery.conditions],
  )

  const baselineSeries = useMemo(() => parseNumericSeries(baselineInput), [baselineInput])
  const eventSeries = useMemo(() => parseNumericSeries(eventInput), [eventInput])
  const densityDelta = useMemo(
    () => computeDensityDelta(baselineSeries, eventSeries),
    [baselineSeries, eventSeries],
  )
  const briefingBundle = useMemo(
    () => buildBriefingBundle('baseline_window', 'event_window', densityDelta.delta),
    [densityDelta.delta],
  )

  const deviationEvent = useMemo(
    () =>
      detectDeviation(
        parseNumericSeries(deviationBaselineInput).map((value, index) => ({
          ts: `b-${index}`,
          value,
        })),
        parseNumericSeries(deviationObservedInput).map((value, index) => ({
          ts: `o-${index}`,
          value,
        })),
        deviationThreshold,
        deviationType,
      ),
    [deviationBaselineInput, deviationObservedInput, deviationThreshold, deviationType],
  )

  const osintSummary = useMemo(
    () => aggregateAlerts(osintEvents, osintAoi),
    [osintAoi, osintEvents],
  )

  const gameModelValid = useMemo(
    () =>
      validateGameModel({
        game_id: 'gm-main',
        actors: [{ actor_id: 'state-a', actor_type: 'state' }],
        actions: [{ action_id: 'policy-1', category: 'policy' }],
        assumptions: [gameAssumption],
        bundle_refs: selectedBundleId ? [selectedBundleId] : [],
      }),
    [gameAssumption, selectedBundleId],
  )

  const payoffProxy = useMemo(
    () => buildPayoffProxy('throughput', 100, 15),
    [],
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
            pipelineVersion: 'i10',
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

  const onSaveQueryVersion = () => {
    setVersionedQuery((previous) => bumpQueryVersion(previous))
  }

  const onUpdateQueryThreshold = (threshold: number) => {
    setVersionedQuery((previous) => ({
      ...previous,
      conditions: [{ field: 'speed', operator: 'greater_than', value: threshold }],
    }))
  }

  const onSubmitAiSummary = () => {
    const selectedBundle = bundles.find((bundle) => bundle.bundle_id === selectedBundleId)
    if (!selectedBundle) {
      setAiSummary('Select a bundle before AI analysis.')
      return
    }
    try {
      const firstAsset = selectedBundle.assets[0]
      const result = submitAiAnalysis({
        role,
        allowed: !offline,
        prompt: aiPrompt,
        refs: [
          {
            bundle_id: selectedBundle.bundle_id,
            asset_id: firstAsset?.asset_id ?? 'ui-state',
            sha256: firstAsset?.sha256 ?? selectedBundle.ui_state_hash,
          },
        ],
      })
      setAiSummary(result.content)
    } catch (error) {
      setAiSummary(String(error))
    }
  }

  const onRegisterDomain = () => {
    if (!validateDomainRegistration(domainDraft)) {
      setStatus('Context domain registration rejected: missing required metadata.')
      return
    }
    setDomains((previous) => [domainDraft, ...previous])
    setDomainDraft(createDomainDraft())
  }

  const onAddOsintEvent = () => {
    if (!validateCuratedSource(osintSource)) {
      setStatus(`OSINT source rejected: ${osintSource}`)
      return
    }
    setOsintEvents((previous) => [
      ...previous,
      {
        source: osintSource.toUpperCase(),
        verification: osintVerification,
        aoi: osintAoi,
      },
    ])
  }

  return (
    <div className="shell">
      <header className="header" data-testid="region-header">
        <div className="identity">
          <h1>StratAtlas Integrated Workbench</h1>
          <p>
            I0-I10 shell: bundle determinism, replay/compare workflows, querying, AI
            policy gating, context intake, deviation tracking, and strategic modeling
          </p>
        </div>
        <div className="status-block">
          <span className={offline ? 'pill offline' : 'pill online'}>
            {offline ? 'OFFLINE' : 'ONLINE'}
          </span>
          <span className="pill neutral">Role: {role}</span>
          <span className="pill neutral">Marking: {marking}</span>
          <span className="pill neutral">Query v{versionedQuery.version}</span>
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

          <h3>Query Builder (I5)</h3>
          <label className="field">
            Minimum Speed
            <input
              type="number"
              value={Number(versionedQuery.conditions[0]?.value ?? 20)}
              onChange={(event) => onUpdateQueryThreshold(Number(event.target.value))}
            />
          </label>
          <div className="controls">
            <button onClick={onSaveQueryVersion}>Save Query Version</button>
          </div>
          <p className="status-line">Query matches: {queryResult.length}</p>

          <h3>AI Gateway (I6)</h3>
          <label className="field">
            Prompt
            <textarea value={aiPrompt} onChange={(event) => setAiPrompt(event.target.value)} rows={3} />
          </label>
          <div className="controls">
            <button onClick={onSubmitAiSummary}>Submit AI Analysis</button>
          </div>
          <p className="status-line">{aiSummary || 'No AI analysis yet.'}</p>
        </section>

        <section className="panel map-panel" data-testid="region-main-canvas">
          <h2>Main Canvas and Workflow Surface</h2>
          <div className="map-placeholder">
            <p>Current mode: {mode}</p>
            <p>Layer count: {activeLayers.length}</p>
            <p>
              Replay budget {I1_BUDGETS.panZoomFrameMs}ms:
              {' '}
              {shouldDegradeRendering(replayFrameMs) ? 'degrade rendering' : 'within budget'}
            </p>
          </div>

          {mode === 'replay' && (
            <div className="sub-panel">
              <h3>Replay Controls (I1)</h3>
              <label className="field">
                Replay Cursor
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={replayCursor}
                  onChange={(event) => setReplayCursor(Number(event.target.value))}
                />
              </label>
              <label className="field">
                Measured Frame (ms)
                <input
                  type="number"
                  value={replayFrameMs}
                  onChange={(event) => setReplayFrameMs(Number(event.target.value))}
                />
              </label>
            </div>
          )}

          {mode === 'compare' && (
            <div className="sub-panel">
              <h3>Baseline / Delta / Briefing (I2)</h3>
              <label className="field">
                Baseline Series
                <input
                  type="text"
                  value={baselineInput}
                  onChange={(event) => setBaselineInput(event.target.value)}
                />
              </label>
              <label className="field">
                Event Series
                <input
                  type="text"
                  value={eventInput}
                  onChange={(event) => setEventInput(event.target.value)}
                />
              </label>
              <p className="status-line">Delta: [{densityDelta.delta.join(', ')}]</p>
              <p className="status-line">{briefingBundle.summary}</p>
            </div>
          )}

          {mode === 'live_recent' && (
            <div className="sub-panel">
              <h3>Context Deviation (I8)</h3>
              <label className="field">
                Baseline
                <input
                  type="text"
                  value={deviationBaselineInput}
                  onChange={(event) => setDeviationBaselineInput(event.target.value)}
                />
              </label>
              <label className="field">
                Observed
                <input
                  type="text"
                  value={deviationObservedInput}
                  onChange={(event) => setDeviationObservedInput(event.target.value)}
                />
              </label>
              <label className="field">
                Threshold
                <input
                  type="number"
                  step={0.05}
                  value={deviationThreshold}
                  onChange={(event) => setDeviationThreshold(Number(event.target.value))}
                />
              </label>
              <label className="field">
                Deviation Type
                <select
                  value={deviationType}
                  onChange={(event) =>
                    setDeviationType(event.target.value as DeviationEvent['deviation_type'])
                  }
                >
                  <option value="trade_flow">trade_flow</option>
                  <option value="infrastructure">infrastructure</option>
                  <option value="regulatory">regulatory</option>
                </select>
              </label>
              <p className="status-line">
                Deviation:
                {' '}
                {deviationEvent
                  ? `${deviationEvent.deviation_type} (${deviationEvent.score.toFixed(2)})`
                  : 'none'}
              </p>
            </div>
          )}

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
          <h2>Governance, Context, and Audit</h2>
          <p>Current head hash: {auditHead || 'n/a'}</p>

          <h3>Context Intake (I7)</h3>
          <label className="field">
            Domain Name
            <input
              type="text"
              value={domainDraft.domain_name}
              onChange={(event) =>
                setDomainDraft((previous) => ({
                  ...previous,
                  domain_name: event.target.value,
                }))
              }
            />
          </label>
          <label className="field">
            Source URL
            <input
              type="text"
              value={domainDraft.source_url}
              onChange={(event) =>
                setDomainDraft((previous) => ({
                  ...previous,
                  source_url: event.target.value,
                }))
              }
            />
          </label>
          <div className="controls">
            <button onClick={onRegisterDomain}>Register Domain</button>
          </div>
          <p className="status-line">Registered domains: {domains.length}</p>

          <h3>OSINT Aggregation (I9)</h3>
          <label className="field">
            Source
            <select value={osintSource} onChange={(event) => setOsintSource(event.target.value)}>
              {CURATED_OSINT_SOURCES.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Verification
            <select
              value={osintVerification}
              onChange={(event) => setOsintVerification(event.target.value as VerificationLevel)}
            >
              <option value="confirmed">confirmed</option>
              <option value="reported">reported</option>
              <option value="alleged">alleged</option>
            </select>
          </label>
          <label className="field">
            AOI
            <input
              type="text"
              value={osintAoi}
              onChange={(event) => setOsintAoi(event.target.value)}
            />
          </label>
          <div className="controls">
            <button onClick={onAddOsintEvent}>Add OSINT Event</button>
          </div>
          <p className="status-line">
            Alerts in {osintAoi}: {osintSummary.count}
            {' '}
            (alleged {osintSummary.verificationBreakdown.alleged})
          </p>

          <h3>Strategic Model (I10)</h3>
          <label className="field">
            Assumption
            <input
              type="text"
              value={gameAssumption}
              onChange={(event) => setGameAssumption(event.target.value)}
            />
          </label>
          <p className="status-line">
            Model valid: {gameModelValid ? 'yes' : 'no'} | Payoff proxy:
            {' '}
            {payoffProxy.metric}
            {' '}
            [{payoffProxy.uncertainty[0]}, {payoffProxy.uncertainty[1]}]
          </p>

          <h3>Audit Ledger</h3>
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
        <span>
          {`Mode=${mode} | Connectivity=${offline ? 'offline' : 'online'} | Audit events=${auditEvents.length} | Query matches=${queryResult.length}`}
        </span>
      </footer>
    </div>
  )
}

export default App
