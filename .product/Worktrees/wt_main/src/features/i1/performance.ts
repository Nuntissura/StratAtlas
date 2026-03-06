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

export interface BudgetTelemetry {
  label: string
  measuredMs: number
  budgetMs: number
  degraded: boolean
}

export interface StateChangeFeedback extends BudgetTelemetry {
  action: string
  showProgress: boolean
  message: string
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

export const buildBudgetTelemetry = (
  probes: Array<{ label: string; measuredMs: number; budgetMs: number }>,
): BudgetTelemetry[] =>
  probes.map((probe) => ({
    ...probe,
    degraded: probe.measuredMs > probe.budgetMs,
  }))

export const describeStateChangeFeedback = (
  action: string,
  measuredMs: number,
  pending = false,
  budget: number = I1_BUDGETS.stateChangeFeedbackP95Ms,
): StateChangeFeedback => {
  if (pending) {
    return {
      action,
      label: 'State feedback',
      measuredMs,
      budgetMs: budget,
      degraded: false,
      showProgress: true,
      message: `${action} is applying with non-blocking feedback.`,
    }
  }

  const degraded = measuredMs > budget
  return {
    action,
    label: 'State feedback',
    measuredMs,
    budgetMs: budget,
    degraded,
    showProgress: degraded,
    message: degraded
      ? `${action} took ${measuredMs} ms; non-blocking progress should remain visible.`
      : `${action} acknowledged in ${measuredMs} ms.`,
  }
}
