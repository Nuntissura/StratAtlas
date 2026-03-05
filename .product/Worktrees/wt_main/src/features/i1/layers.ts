export type GeometryType = 'point' | 'line' | 'polygon' | 'raster'

export type SensitivityClass = 'PUBLIC' | 'INTERNAL' | 'RESTRICTED'

export type CachingPolicy = 'none' | 'memory' | 'disk'

export interface LayerDeclaration {
  layerId: string
  source: string
  license: string
  cadence: string
  geometryType: GeometryType
  sensitivityClass: SensitivityClass
  cachingPolicy: CachingPolicy
}

export interface ExportPolicy {
  allowRestrictedExport: boolean
  allowedLicenses: string[]
}

export class LayerRegistry {
  private readonly layers = new Map<string, LayerDeclaration>()

  register(layer: LayerDeclaration): void {
    this.layers.set(layer.layerId, layer)
  }

  get(layerId: string): LayerDeclaration | undefined {
    return this.layers.get(layerId)
  }

  list(): LayerDeclaration[] {
    return [...this.layers.values()]
  }

  canExport(layerId: string, policy: ExportPolicy): boolean {
    const layer = this.layers.get(layerId)
    if (!layer) {
      return false
    }
    const licenseAllowed = policy.allowedLicenses.includes(layer.license)
    if (!licenseAllowed) {
      return false
    }
    if (layer.sensitivityClass === 'RESTRICTED' && !policy.allowRestrictedExport) {
      return false
    }
    return true
  }
}
