export const CURATED_OSINT_SOURCES = [
  'ACLED',
  'GDELT',
  'UCDP',
  'Crisis24',
  'GDACS',
  'ReliefWeb',
] as const

export type VerificationLevel = 'confirmed' | 'reported' | 'alleged'

export interface OsintEvent {
  source: string
  verification: VerificationLevel
  aoi: string
}

export interface AlertSummary {
  aoi: string
  count: number
  verificationBreakdown: Record<VerificationLevel, number>
}

export const validateCuratedSource = (source: string): boolean =>
  CURATED_OSINT_SOURCES.includes(source as (typeof CURATED_OSINT_SOURCES)[number])

export const aggregateAlerts = (events: OsintEvent[], aoi: string): AlertSummary => {
  const scoped = events.filter((event) => event.aoi === aoi)
  return {
    aoi,
    count: scoped.length,
    verificationBreakdown: {
      confirmed: scoped.filter((event) => event.verification === 'confirmed').length,
      reported: scoped.filter((event) => event.verification === 'reported').length,
      alleged: scoped.filter((event) => event.verification === 'alleged').length,
    },
  }
}
