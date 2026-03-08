import { createReadStream, cpSync, existsSync, statSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vitest/config'

const CESIUM_BASE_PATH = '/cesiumStatic'
const CESIUM_BUILD_ROOT = resolve(__dirname, 'node_modules/cesium/Build/Cesium')
const CESIUM_RUNTIME_DIRS = ['Assets', 'ThirdParty', 'Widgets', 'Workers'] as const

const mimeTypeFor = (filePath: string): string => {
  switch (extname(filePath).toLowerCase()) {
    case '.css':
      return 'text/css; charset=utf-8'
    case '.html':
      return 'text/html; charset=utf-8'
    case '.js':
      return 'text/javascript; charset=utf-8'
    case '.json':
      return 'application/json; charset=utf-8'
    case '.png':
      return 'image/png'
    case '.svg':
      return 'image/svg+xml'
    case '.wasm':
      return 'application/wasm'
    case '.xml':
      return 'application/xml; charset=utf-8'
    default:
      return 'application/octet-stream'
  }
}

const resolveCesiumAsset = (requestPath: string): string | null => {
  const relativePath = requestPath.replace(/^\/+/, '')
  const assetPath = resolve(CESIUM_BUILD_ROOT, relativePath)
  const normalizedRoot = `${CESIUM_BUILD_ROOT}`.toLowerCase()
  const normalizedAsset = `${assetPath}`.toLowerCase()
  if (!normalizedAsset.startsWith(normalizedRoot)) {
    return null
  }
  if (!existsSync(assetPath) || statSync(assetPath).isDirectory()) {
    return null
  }
  return assetPath
}

const cesiumAssetsPlugin = (): Plugin => {
  let outputDirectory = resolve(__dirname, 'dist')

  return {
    name: 'stratatlas-cesium-assets',
    configResolved(config) {
      outputDirectory = resolve(config.root, config.build.outDir)
    },
    configureServer(server) {
      server.middlewares.use(CESIUM_BASE_PATH, (request, response, next) => {
        const requestPath = decodeURIComponent((request.url ?? '/').split('?')[0] ?? '/')
        const assetPath = resolveCesiumAsset(requestPath)
        if (!assetPath) {
          next()
          return
        }

        response.setHeader('Content-Type', mimeTypeFor(assetPath))
        createReadStream(assetPath).pipe(response)
      })
    },
    writeBundle() {
      const targetRoot = join(outputDirectory, CESIUM_BASE_PATH.replace(/^\//, ''))
      CESIUM_RUNTIME_DIRS.forEach((directory) => {
        cpSync(join(CESIUM_BUILD_ROOT, directory), join(targetRoot, directory), {
          recursive: true,
          force: true,
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cesiumAssetsPlugin()],
  server: {
    port: 1420,
    strictPort: true,
  },
  preview: {
    port: 1420,
    strictPort: true,
  },
  build: {
    chunkSizeWarningLimit: 6000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/cesium')) {
            if (id.includes('/Source/Core/')) {
              return 'cesium-core'
            }
            if (id.includes('/Source/DataSources/')) {
              return 'cesium-datasources'
            }
            if (id.includes('/Source/Renderer/')) {
              return 'cesium-renderer'
            }
            if (id.includes('/Source/Scene/')) {
              return 'cesium-scene'
            }
            if (id.includes('/Source/Widget') || id.includes('/Source/Widgets/')) {
              return 'cesium-widgets'
            }
            if (id.includes('/Source/Workers/')) {
              return 'cesium-workers'
            }
            return 'cesium'
          }
          if (id.includes('node_modules/maplibre-gl')) {
            return 'maplibre-gl'
          }
          if (id.includes('node_modules/@deck.gl')) {
            return 'deck-gl'
          }
          return undefined
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    globals: true,
  },
})
