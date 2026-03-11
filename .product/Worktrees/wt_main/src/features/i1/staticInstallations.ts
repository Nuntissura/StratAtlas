export type StaticInstallationLayerId =
  | 'static-airports'
  | 'static-ports'
  | 'static-power-plants'
  | 'static-dams'
  | 'static-military-airbases'
  | 'static-military-ports'

export interface StaticInstallationLayerDefinition {
  layerId: StaticInstallationLayerId
  title: string
  source: string
  sourceUrl: string
  license: string
  cadence: string
  confidenceText: string
  uncertaintyText: string
  coverageText: string
  sensitivityClass: 'PUBLIC' | 'INTERNAL'
}

export interface StaticInstallationRecord {
  installationId: string
  layerId: StaticInstallationLayerId
  aoiId: string
  name: string
  category: string
  coordinates: [number, number]
  detail: string
  truthNote: string
}

export const STATIC_INSTALLATION_LAYER_DEFINITIONS: StaticInstallationLayerDefinition[] = [
  {
    layerId: 'static-airports',
    title: 'Commercial Airports',
    source: 'OpenAIP curated AOI snapshot',
    sourceUrl: 'https://www.openaip.net/',
    license: 'public curated',
    cadence: 'monthly curated',
    confidenceText: 'Curated benchmark airport snapshot near current AOIs.',
    uncertaintyText: 'Static installation only; no live flight movement implied.',
    coverageText: 'Representative AOI benchmark only; not comprehensive global airport coverage.',
    sensitivityClass: 'PUBLIC',
  },
  {
    layerId: 'static-ports',
    title: 'Commercial Ports',
    source: 'NGA World Port Index curated AOI snapshot',
    sourceUrl: 'https://msi.nga.mil/',
    license: 'public curated',
    cadence: 'monthly curated',
    confidenceText: 'Curated benchmark port snapshot near current AOIs.',
    uncertaintyText: 'Static installation only; no live vessel movement implied.',
    coverageText: 'Representative AOI benchmark only; not comprehensive global port coverage.',
    sensitivityClass: 'PUBLIC',
  },
  {
    layerId: 'static-power-plants',
    title: 'Power Plants',
    source: 'WRI Global Power Plant Database curated AOI snapshot',
    sourceUrl: 'https://datasets.wri.org/dataset/globalpowerplantdatabase',
    license: 'public curated',
    cadence: 'periodic snapshot',
    confidenceText: 'Curated public infrastructure snapshot for major plants near active theatres.',
    uncertaintyText: 'Static facility context only; no operational load or outage state implied.',
    coverageText: 'Representative AOI benchmark only; not comprehensive global generation coverage.',
    sensitivityClass: 'PUBLIC',
  },
  {
    layerId: 'static-dams',
    title: 'Dams and Barrages',
    source: 'Global Dam Watch curated AOI snapshot',
    sourceUrl: 'https://globaldamwatch.org/',
    license: 'public curated',
    cadence: 'periodic snapshot',
    confidenceText: 'Curated public water-infrastructure snapshot for major dams near active theatres.',
    uncertaintyText: 'Static infrastructure context only; no live storage or flow state implied.',
    coverageText: 'Representative AOI benchmark only; not comprehensive global dam coverage.',
    sensitivityClass: 'PUBLIC',
  },
  {
    layerId: 'static-military-airbases',
    title: 'Curated Military Airbases',
    source: 'Curated public-source installation review',
    sourceUrl: 'https://www.openstreetmap.org/',
    license: 'internal',
    cadence: 'manual review',
    confidenceText:
      'Curated known-installation benchmark assembled from public official and open references.',
    uncertaintyText: 'Known static installation only; not live posture or sortie activity.',
    coverageText: 'Curated benchmark only; not comprehensive military airbase coverage.',
    sensitivityClass: 'INTERNAL',
  },
  {
    layerId: 'static-military-ports',
    title: 'Curated Military Ports',
    source: 'Curated public-source installation review',
    sourceUrl: 'https://www.openstreetmap.org/',
    license: 'internal',
    cadence: 'manual review',
    confidenceText:
      'Curated known-installation benchmark assembled from public official and open references.',
    uncertaintyText: 'Known static installation only; not live naval disposition or movement.',
    coverageText: 'Curated benchmark only; not comprehensive military port coverage.',
    sensitivityClass: 'INTERNAL',
  },
]

export const STATIC_INSTALLATION_RECORDS: StaticInstallationRecord[] = [
  {
    installationId: 'airport-changi',
    layerId: 'static-airports',
    aoiId: 'aoi-1',
    name: 'Singapore Changi Airport',
    category: 'Commercial airport',
    coordinates: [103.9915, 1.3644],
    detail: 'Primary commercial airport benchmark for the Singapore Strait theatre.',
    truthNote: 'Curated static installation snapshot only.',
  },
  {
    installationId: 'airport-al-maktoum',
    layerId: 'static-airports',
    aoiId: 'aoi-2',
    name: 'Al Maktoum International Airport',
    category: 'Commercial airport',
    coordinates: [55.1614, 24.8968],
    detail: 'Commercial airport anchor for the Dubai Jebel Ali theatre.',
    truthNote: 'Curated static installation snapshot only.',
  },
  {
    installationId: 'airport-csmi',
    layerId: 'static-airports',
    aoiId: 'aoi-3',
    name: 'Chhatrapati Shivaji Maharaj International Airport',
    category: 'Commercial airport',
    coordinates: [72.8679, 19.0896],
    detail: 'Commercial airport anchor for the Mumbai Coast theatre.',
    truthNote: 'Curated static installation snapshot only.',
  },
  {
    installationId: 'airport-rotterdam',
    layerId: 'static-airports',
    aoiId: 'aoi-4',
    name: 'Rotterdam The Hague Airport',
    category: 'Commercial airport',
    coordinates: [4.4372, 51.9569],
    detail: 'Commercial airport anchor for the Rotterdam Delta theatre.',
    truthNote: 'Curated static installation snapshot only.',
  },
  {
    installationId: 'port-singapore',
    layerId: 'static-ports',
    aoiId: 'aoi-1',
    name: 'Port of Singapore',
    category: 'Commercial port',
    coordinates: [103.7416, 1.2644],
    detail: 'Benchmark commercial port in the Singapore Strait theatre.',
    truthNote: 'Static port context only; no live vessel state implied.',
  },
  {
    installationId: 'port-jebel-ali',
    layerId: 'static-ports',
    aoiId: 'aoi-2',
    name: 'Jebel Ali Port',
    category: 'Commercial port',
    coordinates: [55.0236, 25.0089],
    detail: 'Benchmark commercial port in the Dubai Jebel Ali theatre.',
    truthNote: 'Static port context only; no live vessel state implied.',
  },
  {
    installationId: 'port-jnpa',
    layerId: 'static-ports',
    aoiId: 'aoi-3',
    name: 'Jawaharlal Nehru Port',
    category: 'Commercial port',
    coordinates: [72.9497, 18.9498],
    detail: 'Benchmark commercial port in the Mumbai Coast theatre.',
    truthNote: 'Static port context only; no live vessel state implied.',
  },
  {
    installationId: 'port-rotterdam',
    layerId: 'static-ports',
    aoiId: 'aoi-4',
    name: 'Port of Rotterdam',
    category: 'Commercial port',
    coordinates: [4.1371, 51.9475],
    detail: 'Benchmark commercial port in the Rotterdam Delta theatre.',
    truthNote: 'Static port context only; no live vessel state implied.',
  },
  {
    installationId: 'port-said',
    layerId: 'static-ports',
    aoiId: 'aoi-7',
    name: 'Port Said',
    category: 'Commercial port',
    coordinates: [32.3091, 31.2653],
    detail: 'Benchmark commercial port in the Suez Gateway theatre.',
    truthNote: 'Static port context only; no live vessel state implied.',
  },
  {
    installationId: 'power-tuas',
    layerId: 'static-power-plants',
    aoiId: 'aoi-1',
    name: 'Tuas Power Station',
    category: 'Power plant',
    coordinates: [103.6752, 1.2777],
    detail: 'Generation benchmark near the Singapore Strait theatre.',
    truthNote: 'Static facility context only; no live operating state implied.',
  },
  {
    installationId: 'power-jebel-ali',
    layerId: 'static-power-plants',
    aoiId: 'aoi-2',
    name: 'Jebel Ali Power and Desalination Complex',
    category: 'Power plant',
    coordinates: [55.0678, 24.9854],
    detail: 'Generation benchmark near the Dubai Jebel Ali theatre.',
    truthNote: 'Static facility context only; no live operating state implied.',
  },
  {
    installationId: 'power-trombay',
    layerId: 'static-power-plants',
    aoiId: 'aoi-3',
    name: 'Trombay Thermal Power Station',
    category: 'Power plant',
    coordinates: [72.9456, 19.0077],
    detail: 'Generation benchmark near the Mumbai Coast theatre.',
    truthNote: 'Static facility context only; no live operating state implied.',
  },
  {
    installationId: 'power-maasvlakte',
    layerId: 'static-power-plants',
    aoiId: 'aoi-4',
    name: 'Maasvlakte Power Station',
    category: 'Power plant',
    coordinates: [3.9894, 51.9552],
    detail: 'Generation benchmark near the Rotterdam Delta theatre.',
    truthNote: 'Static facility context only; no live operating state implied.',
  },
  {
    installationId: 'dam-marina-barrage',
    layerId: 'static-dams',
    aoiId: 'aoi-1',
    name: 'Marina Barrage',
    category: 'Dam and barrage',
    coordinates: [103.8707, 1.2805],
    detail: 'Water-control benchmark near the Singapore Strait theatre.',
    truthNote: 'Static infrastructure context only; no live storage state implied.',
  },
  {
    installationId: 'dam-hatta',
    layerId: 'static-dams',
    aoiId: 'aoi-2',
    name: 'Hatta Dam',
    category: 'Dam and reservoir',
    coordinates: [56.1153, 24.8087],
    detail: 'Water-infrastructure benchmark near the Dubai Jebel Ali theatre.',
    truthNote: 'Static infrastructure context only; no live storage state implied.',
  },
  {
    installationId: 'dam-bhatsa',
    layerId: 'static-dams',
    aoiId: 'aoi-3',
    name: 'Bhatsa Dam',
    category: 'Dam and reservoir',
    coordinates: [73.4397, 19.5708],
    detail: 'Water-infrastructure benchmark supporting the Mumbai Coast theatre.',
    truthNote: 'Static infrastructure context only; no live storage state implied.',
  },
  {
    installationId: 'dam-haringvliet',
    layerId: 'static-dams',
    aoiId: 'aoi-4',
    name: 'Haringvlietdam',
    category: 'Dam and barrier',
    coordinates: [4.1299, 51.8346],
    detail: 'Water-control benchmark near the Rotterdam Delta theatre.',
    truthNote: 'Static infrastructure context only; no live storage state implied.',
  },
  {
    installationId: 'airbase-changi-east',
    layerId: 'static-military-airbases',
    aoiId: 'aoi-1',
    name: 'Changi Air Base East',
    category: 'Curated military airbase',
    coordinates: [104.0239, 1.3776],
    detail: 'Curated known military airbase benchmark in the Singapore theatre.',
    truthNote: 'Known static installation only; not live sortie or posture data.',
  },
  {
    installationId: 'airbase-al-minhad',
    layerId: 'static-military-airbases',
    aoiId: 'aoi-2',
    name: 'Al Minhad Air Base',
    category: 'Curated military airbase',
    coordinates: [55.3669, 25.0267],
    detail: 'Curated known military airbase benchmark in the Dubai theatre.',
    truthNote: 'Known static installation only; not live sortie or posture data.',
  },
  {
    installationId: 'airbase-ins-shikra',
    layerId: 'static-military-airbases',
    aoiId: 'aoi-3',
    name: 'INS Shikra',
    category: 'Curated military airbase',
    coordinates: [72.8224, 18.9053],
    detail: 'Curated known military air station benchmark in the Mumbai theatre.',
    truthNote: 'Known static installation only; not live sortie or posture data.',
  },
  {
    installationId: 'airbase-woensdrecht',
    layerId: 'static-military-airbases',
    aoiId: 'aoi-4',
    name: 'Woensdrecht Air Base',
    category: 'Curated military airbase',
    coordinates: [4.3423, 51.4491],
    detail: 'Curated known military airbase benchmark near the Rotterdam theatre.',
    truthNote: 'Known static installation only; not live sortie or posture data.',
  },
  {
    installationId: 'milport-changi-naval',
    layerId: 'static-military-ports',
    aoiId: 'aoi-1',
    name: 'Changi Naval Base',
    category: 'Curated military port',
    coordinates: [104.0186, 1.3898],
    detail: 'Curated known military port benchmark in the Singapore theatre.',
    truthNote: 'Known static installation only; not live naval disposition data.',
  },
  {
    installationId: 'milport-ins-karanja',
    layerId: 'static-military-ports',
    aoiId: 'aoi-3',
    name: 'INS Karanja',
    category: 'Curated military port',
    coordinates: [72.9492, 18.8917],
    detail: 'Curated known military port benchmark in the Mumbai theatre.',
    truthNote: 'Known static installation only; not live naval disposition data.',
  },
  {
    installationId: 'milport-den-helder',
    layerId: 'static-military-ports',
    aoiId: 'aoi-4',
    name: 'Den Helder Naval Base',
    category: 'Curated military port',
    coordinates: [4.7612, 52.9555],
    detail: 'Curated known military port benchmark for the North Sea / Rotterdam context.',
    truthNote: 'Known static installation only; not live naval disposition data.',
  },
]

export const STATIC_INSTALLATION_LAYER_IDS = STATIC_INSTALLATION_LAYER_DEFINITIONS.map(
  (definition) => definition.layerId,
)

export const getStaticInstallationLayerDefinition = (
  layerId: string,
): StaticInstallationLayerDefinition | undefined =>
  STATIC_INSTALLATION_LAYER_DEFINITIONS.find((definition) => definition.layerId === layerId)

export const listStaticInstallationRecordsForLayers = (
  layerIds: string[],
): StaticInstallationRecord[] =>
  STATIC_INSTALLATION_RECORDS.filter((record) => layerIds.includes(record.layerId))
