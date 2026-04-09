export type MapBasemapStyleId = 'positron' | 'bright' | 'liberty'

export interface MapBasemapStyleDefinition {
  id: MapBasemapStyleId
  label: string
  styleUrl: string
  description: string
}

export const DEFAULT_MAP_BASEMAP_STYLE_ID: MapBasemapStyleId = 'liberty'

export const MAP_BASEMAP_STYLES: MapBasemapStyleDefinition[] = [
  {
    id: 'positron',
    label: 'Positron',
    styleUrl: 'https://tiles.openfreemap.org/styles/positron',
    description: 'Minimal light vector style for dense overlay work.',
  },
  {
    id: 'bright',
    label: 'Bright',
    styleUrl: 'https://tiles.openfreemap.org/styles/bright',
    description: 'Higher-contrast vector style for quick geographic scanning.',
  },
  {
    id: 'liberty',
    label: 'Liberty',
    styleUrl: 'https://tiles.openfreemap.org/styles/liberty',
    description: 'Balanced general-purpose vector style with stronger label detail.',
  },
]

const MAP_BASEMAP_STYLE_MAP = Object.fromEntries(
  MAP_BASEMAP_STYLES.map((definition) => [definition.id, definition]),
) as Record<MapBasemapStyleId, MapBasemapStyleDefinition>

export const isMapBasemapStyleId = (value: unknown): value is MapBasemapStyleId =>
  value === 'positron' || value === 'bright' || value === 'liberty'

export const normalizeMapBasemapStyleId = (value: unknown): MapBasemapStyleId =>
  isMapBasemapStyleId(value) ? value : DEFAULT_MAP_BASEMAP_STYLE_ID

export const getMapBasemapStyle = (
  basemapStyleId: MapBasemapStyleId,
): MapBasemapStyleDefinition => MAP_BASEMAP_STYLE_MAP[basemapStyleId]
