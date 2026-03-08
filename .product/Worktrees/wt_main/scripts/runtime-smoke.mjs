import { spawn } from 'node:child_process'
import {
  existsSync,
  mkdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { access, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'
import process from 'node:process'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const productRoot = resolve(scriptDir, '..')
const repoRoot = resolve(productRoot, '..', '..', '..')
const baseRequiredAuditEvents = ['bundle.create', 'bundle.open', 'offline.mode_change', 'scenario.export_prepared']

const parseArgs = (argv) => {
  const options = {}
  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index]
    if (current === '--artifact-root') {
      options.artifactRoot = argv[index + 1]
      index += 1
      continue
    }
    if (current === '--wp-id') {
      options.wpId = argv[index + 1]
      index += 1
      continue
    }
  }
  return options
}

const timestamp = () => {
  const now = new Date()
  const pad = (value) => String(value).padStart(2, '0')
  return [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    '_',
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds()),
  ].join('')
}

const { artifactRoot: artifactRootArg, wpId: wpIdArg } = parseArgs(process.argv.slice(2))
const wpId = wpIdArg ?? process.env.STRATATLAS_RUNTIME_SMOKE_WP_ID ?? 'WP-GOV-VERIFY-001'
const requireLiveAi = String(process.env.VITE_STRATATLAS_RUNTIME_SMOKE_REQUIRE_LIVE_AI ?? '') === '1'
const requireMcp = String(process.env.VITE_STRATATLAS_RUNTIME_SMOKE_REQUIRE_MCP ?? '') === '1'

const defaultArtifactRoot = join(
  repoRoot,
  '.product',
  'build_target',
  'tool_artifacts',
  'wp_runs',
  wpId,
  timestamp(),
  'runtime_smoke',
)

const artifactRoot = resolve(artifactRootArg ?? defaultArtifactRoot)
mkdirSync(artifactRoot, { recursive: true })

const pause = (ms) =>
  new Promise((resolvePromise) => {
    setTimeout(resolvePromise, ms)
  })

const waitForPath = async (path, timeoutMs) => {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    try {
      await access(path)
      return
    } catch {
      await pause(250)
    }
  }
  throw new Error(`Timed out waiting for ${path}`)
}

const collectProcessOutput = (child, logPath) => {
  let output = ''
  child.stdout?.on('data', (chunk) => {
    const text = chunk.toString()
    output += text
    process.stdout.write(text)
  })
  child.stderr?.on('data', (chunk) => {
    const text = chunk.toString()
    output += text
    process.stderr.write(text)
  })
  const flush = () => {
    writeFileSync(logPath, output, 'utf8')
  }
  return { flush }
}

const waitForExit = (child) =>
  new Promise((resolvePromise) => {
    child.once('exit', (code, signal) => {
      resolvePromise({ code, signal })
    })
  })

const waitForExitOrTimeout = async (child, timeoutMs) => {
  if (child.exitCode !== null) {
    return { code: child.exitCode, signal: null, timedOut: false }
  }
  let timeoutHandle
  const timeoutPromise = new Promise((resolvePromise) => {
    timeoutHandle = setTimeout(() => {
      resolvePromise({ code: null, signal: null, timedOut: true })
    }, timeoutMs)
  })
  const exitResult = await Promise.race([
    waitForExit(child).then((result) => ({ ...result, timedOut: false })),
    timeoutPromise,
  ])
  clearTimeout(timeoutHandle)
  return exitResult
}

const terminateProcessTree = async (child) => {
  if (child.exitCode !== null) {
    return
  }
  if (process.platform === 'win32') {
    await new Promise((resolvePromise) => {
      const killer = spawn('taskkill', ['/PID', String(child.pid), '/T', '/F'], {
        stdio: 'ignore',
      })
      killer.once('exit', () => resolvePromise())
    })
    return
  }
  child.kill('SIGTERM')
}

const parseAuditEvents = async (auditLogPath) => {
  const raw = await readFile(auditLogPath, 'utf8')
  return raw
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .map((line) => JSON.parse(line))
}

const writePhaseSummary = (phase, report, auditEvents, phaseDir) => {
  const summaryLines = [
    `# Runtime Smoke - ${phase}`,
    '',
    `- Startup Ms: ${report.startupMs}`,
    `- Selected Bundle: ${report.selectedBundleId ?? 'none'}`,
    `- Offline: ${report.offline}`,
    `- Degraded Budgets: ${report.degradedBudgetCount}`,
    `- Active Context Domains: ${report.activeContextDomainCount}`,
    `- Context Record Count: ${report.contextRecordCount}`,
    `- Correlation AOI: ${report.correlationAoi}`,
    `- Governed Context Domain: ${report.governedContextDomainId ?? 'none'}`,
    `- Map Runtime Visible: ${report.mapRuntimeVisible}`,
    `- Map Runtime Interactive: ${report.mapRuntimeInteractive}`,
    `- Map Surface Mode: ${report.mapSurfaceMode}`,
    `- Map Engine: ${report.mapRuntimeEngine}`,
    `- Planar Ready: ${report.mapPlanarReady}`,
    `- Orbital Ready: ${report.mapOrbitalReady}`,
    `- Map Focus AOI: ${report.mapFocusAoiId}`,
    `- Map Inspect Count: ${report.mapInspectCount}`,
    `- Map Runtime Error: ${report.mapRuntimeError ?? 'none'}`,
    `- Require Live AI: ${report.requireLiveAi}`,
    `- Require MCP: ${report.requireMcp}`,
    `- AI Provider: ${report.aiProviderLabel}`,
    `- AI Provider Runtime: ${report.aiProviderRuntime}`,
    `- AI Provider Available: ${report.aiProviderAvailable}`,
    `- AI Provider Detail: ${report.aiProviderDetail}`,
    `- AI Artifact: ${report.aiArtifactId ?? 'none'}`,
    `- AI Request Id: ${report.aiRequestId ?? 'none'}`,
    `- AI Gateway Runtime: ${report.aiGatewayRuntime ?? 'none'}`,
    `- MCP Invocation: ${report.mcpInvocationId ?? 'none'}`,
    `- MCP Invocation Status: ${report.mcpInvocationStatus ?? 'none'}`,
    `- MCP Tool: ${report.mcpToolName ?? 'none'}`,
    `- Scenario Export Artifact: ${report.scenarioExportArtifactId ?? 'none'}`,
    `- Audit Events: ${auditEvents.length}`,
    '',
    '| Assertion | Passed | Detail |',
    '|-----------|--------|--------|',
    ...report.assertions.map(
      (assertion) => `| ${assertion.id} | ${assertion.passed} | ${assertion.detail} |`,
    ),
    '',
    '| Metric | Measured Ms | Budget Ms | Passed |',
    '|--------|-------------|-----------|--------|',
    ...report.metrics.map(
      (metric) =>
        `| ${metric.label} | ${metric.measuredMs} | ${metric.budgetMs ?? ''} | ${
          metric.passed ?? ''
        } |`,
    ),
  ]
  writeFileSync(join(phaseDir, 'runtime_smoke_summary.md'), summaryLines.join('\n'), 'utf8')
}

const validatePhase = async (phase, phaseDir, logPath) => {
  const reportPath = join(phaseDir, 'runtime_smoke_report.json')
  const auditLogPath = join(phaseDir, 'runtime_proof', 'audit_log.jsonl')
  const recorderStatePath = join(phaseDir, 'runtime_proof', 'recorder_state.json')

  if (!existsSync(reportPath)) {
    throw new Error(`Missing runtime smoke report for ${phase}: ${reportPath}`)
  }
  if (!existsSync(auditLogPath)) {
    throw new Error(`Missing runtime smoke audit log for ${phase}: ${auditLogPath}`)
  }
  if (!existsSync(recorderStatePath)) {
    throw new Error(`Missing runtime smoke recorder state for ${phase}: ${recorderStatePath}`)
  }

  const report = JSON.parse(await readFile(reportPath, 'utf8'))
  const auditEvents = await parseAuditEvents(auditLogPath)
  const requiredAuditEvents = [...baseRequiredAuditEvents]
  if (report.requireLiveAi) {
    requiredAuditEvents.push('ai.gateway.submit')
  }
  if (report.requireMcp) {
    requiredAuditEvents.push('mcp.tool_invoked')
  }
  const observedAuditTypes = new Set(auditEvents.map((event) => event.event_type))
  for (const eventType of requiredAuditEvents) {
    if (!observedAuditTypes.has(eventType)) {
      throw new Error(`Missing audit event ${eventType} in ${phase}`)
    }
  }
  if (!observedAuditTypes.has('runtime_smoke.complete')) {
    throw new Error(`Missing runtime_smoke.complete marker in ${phase}`)
  }

  if (!report.selectedBundleId) {
    throw new Error(`Runtime smoke did not capture a selected bundle for ${phase}`)
  }
  if (!report.mapRuntimeVisible) {
    throw new Error(`Runtime smoke did not detect a visible map runtime for ${phase}`)
  }
  if (!report.mapRuntimeInteractive) {
    throw new Error(`Runtime smoke did not mount an interactive map runtime for ${phase}`)
  }
  if (!report.mapPlanarReady) {
    throw new Error(`Planar map runtime was not ready for ${phase}`)
  }
  if (!report.mapOrbitalReady) {
    throw new Error(`Orbital map runtime was not ready for ${phase}`)
  }
  if (report.mapInspectCount < 4) {
    throw new Error(`Runtime smoke captured too few map inspect targets for ${phase}`)
  }
  if (wpId === 'WP-I7-002') {
    const requiredI7Assertions = ['governed_context_registration', 'governed_context_bundle_restore']
    for (const assertionId of requiredI7Assertions) {
      const assertion = report.assertions.find((entry) => entry.id === assertionId)
      if (!assertion || !assertion.passed) {
        throw new Error(`Missing governed context runtime evidence ${assertionId} for ${phase}`)
      }
    }
    if (report.activeContextDomainCount < 1 || report.contextRecordCount < 1) {
      throw new Error(`Governed context runtime evidence was incomplete for ${phase}`)
    }
  }
  if (report.requireLiveAi) {
    if (report.aiProviderRuntime !== 'tauri-live' || !report.aiProviderAvailable) {
      throw new Error(`Live AI provider was not available for ${phase}`)
    }
    if (report.aiGatewayRuntime !== 'tauri-live' || !report.aiArtifactId) {
      throw new Error(`Live AI artifact evidence missing for ${phase}`)
    }
  }
  if (report.requireMcp) {
    if (report.mcpInvocationStatus !== 'allowed' || !report.mcpInvocationId || !report.mcpToolName) {
      throw new Error(`Governed MCP invocation evidence missing for ${phase}`)
    }
  }

  const bundleManifestPath = join(
    phaseDir,
    'runtime_proof',
    'bundles',
    report.selectedBundleId,
    'manifest.json',
  )
  if (!existsSync(bundleManifestPath)) {
    throw new Error(`Missing copied bundle manifest for ${phase}: ${bundleManifestPath}`)
  }

  if (!report.assertions.every((assertion) => assertion.passed)) {
    throw new Error(`One or more runtime smoke assertions failed for ${phase}`)
  }

  writePhaseSummary(phase, report, auditEvents, phaseDir)
  return {
    phase,
    logPath,
    reportPath,
    auditLogPath,
    bundleManifestPath,
    startupMs: report.startupMs,
    aiArtifactId: report.aiArtifactId ?? null,
    mcpToolName: report.mcpToolName ?? null,
    scenarioExportArtifactId: report.scenarioExportArtifactId ?? null,
  }
}

const runPhase = async (phase) => {
  const phaseDir = join(artifactRoot, phase)
  const logPath = join(artifactRoot, `tauri-${phase}.log`)
  rmSync(phaseDir, { recursive: true, force: true })

  const child = spawn('pnpm', ['tauri', 'dev', '--no-watch'], {
    cwd: productRoot,
    env: {
      ...process.env,
      VITE_STRATATLAS_RUNTIME_SMOKE: '1',
      VITE_STRATATLAS_RUNTIME_SMOKE_PHASE: phase,
      STRATATLAS_RUNTIME_SMOKE_ARTIFACT_DIR: artifactRoot,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: process.platform === 'win32',
  })

  const { flush } = collectProcessOutput(child, logPath)
  const exitPromise = waitForExit(child)
  const reportPath = join(phaseDir, 'runtime_smoke_report.json')

  try {
    await waitForPath(reportPath, 240000)
  } catch (error) {
    await terminateProcessTree(child)
    const exitResult = await exitPromise
    flush()
    throw new Error(
      `Runtime smoke phase ${phase} did not produce a report. Exit: ${JSON.stringify(exitResult)}. ${String(
        error,
      )}`,
    )
  }

  await pause(1000)
  let terminatedByHarness = false
  let exitResult = await waitForExitOrTimeout(child, 5000)
  if (exitResult.timedOut) {
    terminatedByHarness = true
    await terminateProcessTree(child)
    exitResult = { ...(await exitPromise), timedOut: false }
  }
  flush()
  if (!terminatedByHarness && exitResult.code !== 0 && exitResult.code !== null) {
    throw new Error(`Runtime smoke phase ${phase} exited with code ${exitResult.code}`)
  }

  return validatePhase(phase, phaseDir, logPath)
}

const main = async () => {
  const phaseSummaries = []
  for (const phase of ['cold', 'warm']) {
    phaseSummaries.push(await runPhase(phase))
  }

  const summary = {
    wpId,
    artifactRoot,
    phases: phaseSummaries,
  }
  writeFileSync(
    join(artifactRoot, 'runtime_smoke_summary.json'),
    JSON.stringify(summary, null, 2),
    'utf8',
  )

  const summaryLines = [
    `# ${wpId} Runtime Smoke Summary`,
    '',
    `- Artifact Root: ${artifactRoot}`,
    `- Require Live AI: ${requireLiveAi}`,
    `- Require MCP: ${requireMcp}`,
    '',
    '| Phase | Startup Ms | AI Artifact | MCP Tool | Export Artifact | Report | Audit Log | Bundle Manifest |',
    '|-------|------------|-------------|----------|-----------------|--------|-----------|----------------|',
    ...phaseSummaries.map(
      (phase) =>
        `| ${phase.phase} | ${phase.startupMs} | ${phase.aiArtifactId ?? 'none'} | ${
          phase.mcpToolName ?? 'none'
        } | ${phase.scenarioExportArtifactId ?? 'none'} | ${phase.reportPath} | ${phase.auditLogPath} | ${
          phase.bundleManifestPath
        } |`,
    ),
  ]
  writeFileSync(join(artifactRoot, 'runtime_smoke_summary.md'), summaryLines.join('\n'), 'utf8')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
