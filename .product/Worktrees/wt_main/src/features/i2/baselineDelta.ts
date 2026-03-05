export interface DensityDeltaResult {
  baseline: number[]
  event: number[]
  delta: number[]
}

export const computeDensityDelta = (
  baseline: number[],
  event: number[],
): DensityDeltaResult => {
  const maxLength = Math.max(baseline.length, event.length)
  const base = [...baseline]
  const evt = [...event]
  while (base.length < maxLength) base.push(0)
  while (evt.length < maxLength) evt.push(0)
  return {
    baseline: base,
    event: evt,
    delta: base.map((value, index) => evt[index] - value),
  }
}

export interface BriefingBundle {
  baselineWindow: string
  eventWindow: string
  summary: string
  delta: number[]
}

export const buildBriefingBundle = (
  baselineWindow: string,
  eventWindow: string,
  delta: number[],
): BriefingBundle => ({
  baselineWindow,
  eventWindow,
  summary: `Delta generated across ${delta.length} cells`,
  delta,
})
