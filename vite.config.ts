import fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

const root = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), maplibreWorker(root)],
  optimizeDeps: {
    exclude: ['maplibre-gl'],
  },
  server: {
    port: 5177,
    strictPort: true,
  },
})

function maplibreWorker(root: string): Plugin {
  const workerPath = path.join(root, 'node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs')
  const output = path.resolve(root, 'public/maplibre-gl-worker.mjs')
  const publish = () => {
    const source = fs.readFileSync(workerPath, 'utf8').replace(/\n\/\/# sourceMappingURL=.*$/, '')
    fs.mkdirSync(path.dirname(output), { recursive: true })
    fs.writeFileSync(output, source)
  }
  const handle = (req: { url?: string }, res: { setHeader: (name: string, value: string) => void }, next: () => void) => {
    if (req.url?.split('?')[0] !== '/maplibre-gl-worker.mjs') return next()
    res.setHeader('Content-Type', 'text/javascript')
    res.setHeader('Cache-Control', 'no-cache')
    fs.createReadStream(output).pipe(res as unknown as NodeJS.WritableStream)
  }
  return {
    name: 'maplibre-worker',
    buildStart: publish,
    configureServer(server) {
      publish()
      return () => {
        server.middlewares.stack.unshift({ route: '', handle })
      }
    },
  }
}
