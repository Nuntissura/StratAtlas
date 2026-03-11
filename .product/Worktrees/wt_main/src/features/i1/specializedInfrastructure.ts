export type SpecializedInfrastructureLayerId =
  | 'specialized-oil-refineries'
  | 'specialized-ore-processing'
  | 'specialized-water-treatment'

export interface SpecializedInfrastructureLayerDefinition {
  layerId: SpecializedInfrastructureLayerId
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

export interface SpecializedInfrastructureRecord {
  siteId: string
  layerId: SpecializedInfrastructureLayerId
  aoiId: string
  name: string
  category: string
  coordinates: [number, number]
  detail: string
  truthNote: string
}

export const SPECIALIZED_INFRASTRUCTURE_LAYER_DEFINITIONS: SpecializedInfrastructureLayerDefinition[] = [
  {
    layerId: 'specialized-oil-refineries',
    title: 'Oil Refineries',
    source: 'Composite public refinery references curated AOI snapshot',
    sourceUrl: 'https://globalenergymonitor.org/',
    license: 'public curated',
    cadence: 'manual quarterly review',
    confidenceText: 'Curated benchmark refining sites around the active AOIs.',
    uncertaintyText:
      'Static industrial context only; no live throughput, outage, or inventory state is implied.',
    coverageText:
      'Focused AOI benchmark only; partial regional coverage and not a comprehensive global refinery inventory.',
    sensitivityClass: 'PUBLIC',
  },
  {
    layerId: 'specialized-ore-processing',
    title: 'Ore Processing and Smelting',
    source: 'Composite public industrial references curated AOI snapshot',
    sourceUrl: 'https://www.openstreetmap.org/',
    license: 'internal benchmark',
    cadence: 'manual quarterly review',
    confidenceText: 'Curated benchmark metallurgical and ore-processing clusters around the active AOIs.',
    uncertaintyText:
      'Some markers represent industrial clusters rather than a single plant; no live production state is implied.',
    coverageText:
      'Focused AOI benchmark only; coverage is intentionally partial and should not be read as a complete industrial census.',
    sensitivityClass: 'INTERNAL',
  },
  {
    layerId: 'specialized-water-treatment',
    title: 'Water Treatment and Filtration',
    source: 'Composite public utility references curated AOI snapshot',
    sourceUrl: 'https://www.openstreetmap.org/',
    license: 'public curated',
    cadence: 'manual quarterly review',
    confidenceText: 'Curated benchmark treatment and filtration sites tied to the active AOIs.',
    uncertaintyText:
      'Static water-infrastructure context only; no live flow, quality, or service status is implied.',
    coverageText:
      'Focused AOI benchmark only; representative treatment coverage with explicit regional gaps.',
    sensitivityClass: 'PUBLIC',
  },
]

export const SPECIALIZED_INFRASTRUCTURE_RECORDS: SpecializedInfrastructureRecord[] = [
  {
    siteId: 'refinery-jurong-cluster',
    layerId: 'specialized-oil-refineries',
    aoiId: 'aoi-1',
    name: 'Jurong Island Refining Cluster',
    category: 'Oil refinery cluster',
    coordinates: [103.7218, 1.2437],
    detail: 'Benchmark refining cluster supporting the Singapore Strait theatre.',
    truthNote: 'Curated static cluster benchmark only; no live throughput or outage state.',
  },
  {
    siteId: 'refinery-jebel-ali-complex',
    layerId: 'specialized-oil-refineries',
    aoiId: 'aoi-2',
    name: 'Jebel Ali Refining Complex',
    category: 'Oil refinery complex',
    coordinates: [55.0348, 24.9918],
    detail: 'Benchmark refining anchor for the Dubai Jebel Ali theatre.',
    truthNote: 'Curated static facility benchmark only; no live throughput or outage state.',
  },
  {
    siteId: 'refinery-mumbai-corridor',
    layerId: 'specialized-oil-refineries',
    aoiId: 'aoi-3',
    name: 'Mumbai Refining Corridor',
    category: 'Oil refinery cluster',
    coordinates: [72.9156, 19.0421],
    detail: 'Benchmark refining corridor for the Mumbai Coast theatre.',
    truthNote: 'Curated static cluster benchmark only; no live throughput or outage state.',
  },
  {
    siteId: 'refinery-pernis-cluster',
    layerId: 'specialized-oil-refineries',
    aoiId: 'aoi-4',
    name: 'Pernis Refining Cluster',
    category: 'Oil refinery cluster',
    coordinates: [4.2966, 51.8935],
    detail: 'Benchmark refining cluster for the Rotterdam Delta theatre.',
    truthNote: 'Curated static cluster benchmark only; no live throughput or outage state.',
  },
  {
    siteId: 'refinery-suez-complex',
    layerId: 'specialized-oil-refineries',
    aoiId: 'aoi-7',
    name: 'Suez Refining Complex',
    category: 'Oil refinery complex',
    coordinates: [32.5362, 29.9567],
    detail: 'Benchmark refining anchor for the Suez Gateway theatre.',
    truthNote: 'Curated static facility benchmark only; no live throughput or outage state.',
  },
  {
    siteId: 'ore-jurong-recovery',
    layerId: 'specialized-ore-processing',
    aoiId: 'aoi-1',
    name: 'Jurong Metals Recovery Cluster',
    category: 'Ore processing and smelting cluster',
    coordinates: [103.7093, 1.3045],
    detail: 'Composite benchmark metals-processing cluster near the Singapore Strait theatre.',
    truthNote:
      'Curated composite cluster benchmark; may represent a broader industrial zone rather than a single geocoded plant.',
  },
  {
    siteId: 'ore-taloja-processing',
    layerId: 'specialized-ore-processing',
    aoiId: 'aoi-3',
    name: 'Taloja Metallurgical Processing Cluster',
    category: 'Ore processing and smelting cluster',
    coordinates: [73.1061, 19.0733],
    detail: 'Composite benchmark metallurgical cluster supporting the Mumbai Coast theatre.',
    truthNote:
      'Curated composite cluster benchmark; may represent a broader industrial zone rather than a single geocoded plant.',
  },
  {
    siteId: 'ore-rotterdam-smelting',
    layerId: 'specialized-ore-processing',
    aoiId: 'aoi-4',
    name: 'Rotterdam Materials and Smelting Cluster',
    category: 'Ore processing and smelting cluster',
    coordinates: [4.1612, 51.9042],
    detail: 'Composite benchmark materials-processing cluster for the Rotterdam Delta theatre.',
    truthNote:
      'Curated composite cluster benchmark; may represent a broader industrial zone rather than a single geocoded plant.',
  },
  {
    siteId: 'ore-ainsokhna-processing',
    layerId: 'specialized-ore-processing',
    aoiId: 'aoi-7',
    name: 'Ain Sokhna Ore Processing Cluster',
    category: 'Ore processing and smelting cluster',
    coordinates: [32.3721, 29.6742],
    detail: 'Composite benchmark industrial-processing cluster tied to the Suez Gateway theatre.',
    truthNote:
      'Curated composite cluster benchmark; may represent a broader industrial zone rather than a single geocoded plant.',
  },
  {
    siteId: 'water-tuas-reclamation',
    layerId: 'specialized-water-treatment',
    aoiId: 'aoi-1',
    name: 'Tuas Water Reclamation Plant',
    category: 'Water treatment and filtration',
    coordinates: [103.6406, 1.3212],
    detail: 'Benchmark treatment anchor near the Singapore Strait theatre.',
    truthNote: 'Curated static utility benchmark only; no live flow or quality state.',
  },
  {
    siteId: 'water-jebel-ali-treatment',
    layerId: 'specialized-water-treatment',
    aoiId: 'aoi-2',
    name: 'Jebel Ali Treatment Complex',
    category: 'Water treatment and filtration',
    coordinates: [55.0411, 24.9836],
    detail: 'Benchmark treatment anchor near the Dubai Jebel Ali theatre.',
    truthNote: 'Curated static utility benchmark only; no live flow or quality state.',
  },
  {
    siteId: 'water-bhandup-complex',
    layerId: 'specialized-water-treatment',
    aoiId: 'aoi-3',
    name: 'Bhandup Water Treatment Complex',
    category: 'Water treatment and filtration',
    coordinates: [72.9445, 19.1599],
    detail: 'Benchmark treatment anchor supporting the Mumbai Coast theatre.',
    truthNote: 'Curated static utility benchmark only; no live flow or quality state.',
  },
  {
    siteId: 'water-harnaschpolder',
    layerId: 'specialized-water-treatment',
    aoiId: 'aoi-4',
    name: 'Harnaschpolder Treatment Plant',
    category: 'Water treatment and filtration',
    coordinates: [4.2821, 51.9855],
    detail: 'Benchmark treatment anchor for the Rotterdam Delta theatre.',
    truthNote: 'Curated static utility benchmark only; no live flow or quality state.',
  },
  {
    siteId: 'water-port-said-benchmark',
    layerId: 'specialized-water-treatment',
    aoiId: 'aoi-7',
    name: 'Port Said Treatment Benchmark',
    category: 'Water treatment and filtration',
    coordinates: [32.3121, 31.2336],
    detail: 'Benchmark treatment anchor supporting the Suez Gateway theatre.',
    truthNote: 'Curated static utility benchmark only; no live flow or quality state.',
  },
]

export const SPECIALIZED_INFRASTRUCTURE_LAYER_IDS =
  SPECIALIZED_INFRASTRUCTURE_LAYER_DEFINITIONS.map((definition) => definition.layerId)

export const SPECIALIZED_INFRASTRUCTURE_SUMMARY = {
  sourceStateLabel: 'Composite Curated Snapshot',
  statusDetail:
    'Specialized industrial coverage is intentionally partial and AOI-focused. The current build packages representative refining, metallurgical, and water-treatment benchmarks rather than claiming a complete global facility registry.',
  truthNote:
    'Some markers represent industrial clusters compiled from multiple public references. This family is static context only and must not be read as live operational state.',
  notes: [
    'Coverage favors chokepoints and throughput-critical theatres over clean global completeness.',
    'Power plants and dams remain in Static Installations; this family isolates messier composite-source infrastructure.',
  ],
}

export const listSpecializedInfrastructureRecordsForLayers = (
  layerIds: string[],
): SpecializedInfrastructureRecord[] =>
  SPECIALIZED_INFRASTRUCTURE_RECORDS.filter((record) => layerIds.includes(record.layerId))
