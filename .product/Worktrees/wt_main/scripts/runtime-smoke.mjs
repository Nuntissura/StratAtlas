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
const wpId = 'WP-GOV-VERIFY-001'
const requiredAuditEvents = [
  'bundle.create',
  'bundle.open',
  'offline.mode_change',
  'scenario.export_prepared',
]

const parseArgs = (argv) => {
  const options = {}
  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index]
    if (current === '--artifact-root') {
      options.artifactRoot = argv[index + 1]
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

const { artifactRoot: artifactRootArg } = parseArgs(process.argv.slice(2))
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
    '',
    '| Phase | Startup Ms | Export Artifact | Report | Audit Log | Bundle Manifest |',
    '|-------|------------|-----------------|--------|-----------|----------------|',
    ...phaseSummaries.map(
      (phase) =>
        `| ${phase.phase} | ${phase.startupMs} | ${phase.scenarioExportArtifactId ?? 'none'} | ${phase.reportPath} | ${phase.auditLogPath} | ${phase.bundleManifestPath} |`,
    ),
  ]
  writeFileSync(join(artifactRoot, 'runtime_smoke_summary.md'), summaryLines.join('\n'), 'utf8')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
