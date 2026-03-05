export interface ContextSeriesPoint {
  ts: string
  value: number
}

export interface DeviationEvent {
  event_type: 'context.deviation'
  deviation_type: 'trade_flow' | 'infrastructure' | 'regulatory'
  score: number
  baseline: number
  observed: number
}

export const detectDeviation = (
  baseline: ContextSeriesPoint[],
  observed: ContextSeriesPoint[],
  threshold: number,
  deviationType: DeviationEvent['deviation_type'],
): DeviationEvent | null => {
  const baselineAvg =
    baseline.reduce((sum, point) => sum + point.value, 0) / Math.max(baseline.length, 1)
  const observedAvg =
    observed.reduce((sum, point) => sum + point.value, 0) / Math.max(observed.length, 1)
  const delta = observedAvg - baselineAvg
  const score =
    baselineAvg === 0 ? Math.abs(observedAvg) : Math.abs(delta / baselineAvg)
  if (score < threshold) {
    return null
  }
  return {
    event_type: 'context.deviation',
    deviation_type: deviationType,
    score,
    baseline: baselineAvg,
    observed: observedAvg,
  }
}
