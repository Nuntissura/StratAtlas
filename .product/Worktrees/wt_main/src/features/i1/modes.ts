export type UiMode =
  | 'live_recent'
  | 'replay'
  | 'compare'
  | 'scenario'
  | 'collaboration'
  | 'offline'

export const REQUIRED_UI_REGIONS = [
  'header',
  'left_panel',
  'right_panel',
  'bottom_panel',
  'main_canvas',
] as const

export const REQUIRED_UI_MODES: UiMode[] = [
  'live_recent',
  'replay',
  'compare',
  'scenario',
  'collaboration',
  'offline',
]
