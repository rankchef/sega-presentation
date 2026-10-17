import { useEffect, useRef } from 'react'
import { Map as MlMap, setWorkerUrl } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

setWorkerUrl('/maplibre-gl-worker.mjs')

export function StillMap({ active }: { active: boolean }) {
  const node = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MlMap | null>(null)

  useEffect(() => {
    const container = node.current
    if (!container) return

    const map = new MlMap({
      container,
      center: [21.431, 41.996],
      zoom: 12.2,
      minZoom: 11,
      maxZoom: 16,
      dragRotate: false,
      pitchWithRotate: false,
      attributionControl: false,
      canvasContextAttributes: { preserveDrawingBuffer: true },
      fadeDuration: 0,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors',
          },
        },
        layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
      },
    })
    mapRef.current = map
    map.on('load', () => map.resize())

    return () => {
      map.remove()
      if (mapRef.current === map) mapRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!active) return
    const map = mapRef.current
    const paint = () => map?.resize()
    paint()
    const timer = window.setTimeout(paint, 80)
    return () => window.clearTimeout(timer)
  }, [active])

  return <div ref={node} className="solution-map-canvas" />
}
