import { getCurrentWindow } from '@tauri-apps/api/window'
import type {
  RuntimeSmokeEvidenceResult,
  RuntimeSmokePhase,
  RuntimeSmokeReport,
  RuntimeSmokeWindowSnapshot,
} from '../contracts/i0'
import { backend } from './backend'

const isRuntimeSmokePhase = (value: string): value is RuntimeSmokePhase =>
  value === 'cold' || value === 'warm'

const flagFromEnv = (value: unknown): boolean => String(value ?? '') === '1'

const phaseFromEnv = (): RuntimeSmokePhase => {
  const candidate = String(import.meta.env.VITE_STRATATLAS_RUNTIME_SMOKE_PHASE ?? 'cold')
  return isRuntimeSmokePhase(candidate) ? candidate : 'cold'
}

export const runtimeSmokeConfig = {
  enabled: flagFromEnv(import.meta.env.VITE_STRATATLAS_RUNTIME_SMOKE),
  phase: phaseFromEnv(),
  requireLiveAi: flagFromEnv(import.meta.env.VITE_STRATATLAS_RUNTIME_SMOKE_REQUIRE_LIVE_AI),
  requireMcp: flagFromEnv(import.meta.env.VITE_STRATATLAS_RUNTIME_SMOKE_REQUIRE_MCP),
}

export const captureRuntimeSmokeWindowSnapshot = async (): Promise<RuntimeSmokeWindowSnapshot> => {
  const windowHandle = getCurrentWindow()
  const [title, size] = await Promise.all([windowHandle.title(), windowHandle.innerSize()])
  return {
    title,
    width: size.width,
    height: size.height,
  }
}

export const writeRuntimeSmokeEvidence = async (
  report: RuntimeSmokeReport,
): Promise<RuntimeSmokeEvidenceResult> =>
  backend.writeRuntimeSmokeEvidence({
    phase: report.phase,
    report,
  })

export const closeRuntimeSmokeWindow = async (): Promise<void> => {
  await getCurrentWindow().close()
}
