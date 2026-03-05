export interface PerformanceBudgets {
  startupColdMs: number
  startupWarmMs: number
  stateChangeFeedbackP95Ms: number
  panZoomFrameMs: number
  warmTimeScrubMs: number
  coldTimeScrubMs: number
  imageExportMs: number
  briefingExportMs: number
}

export const I1_BUDGETS: PerformanceBudgets = {
  startupColdMs: 8000,
  startupWarmMs: 3000,
  stateChangeFeedbackP95Ms: 300,
  panZoomFrameMs: 50,
  warmTimeScrubMs: 250,
  coldTimeScrubMs: 2000,
  imageExportMs: 3000,
  briefingExportMs: 15000,
}

export const shouldDegradeRendering = (
  measuredFrameMs: number,
  budget: number = I1_BUDGETS.panZoomFrameMs,
): boolean => measuredFrameMs > budget
