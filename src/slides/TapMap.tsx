import { useEffect, useRef } from 'react'
import { GeoJSONSource, Map as MlMap, setWorkerUrl, type ExpressionSpecification } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { tapsAt } from '../data/commute'
import { stopBounds, tapStops } from '../data/stops'

setWorkerUrl('/maplibre-gl-worker.mjs')

const radius = [
  'interpolate',
  ['linear'],
  ['sqrt', ['get', 'count']],
  0,
  0,
  0.6,
  3.2,
  3,
  7,
  8,
  11,
] as ExpressionSpecification

const fade = ['interpolate', ['linear'], ['get', 'count'], 0, 0, 0.35, 0.2, 2, 0.72, 8, 0.86] as ExpressionSpecification

export function TapMap({ minutes, active }: { minutes: number; active: boolean }) {
  const node = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MlMap | null>(null)
  const minutesRef = useRef(minutes)
  minutesRef.current = minutes

  useEffect(() => {
    const container = node.current
    if (!container) return

    const map = new MlMap({
      container,
      center: [21.431, 41.996],
      zoom: 11.4,
      minZoom: 10,
      maxZoom: 16,
      dragRotate: false,
      pitchWithRotate: false,
      attributionControl: { compact: true },
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

    map.on('load', () => {
      map.addSource('taps', { type: 'geojson', data: tapCollection(minutesRef.current) })
      map.addLayer({
        id: 'tap-ins',
        type: 'circle',
        source: 'taps',
        filter: ['==', ['get', 'kind'], 'in'],
        paint: {
          'circle-color': '#0d5499',
          'circle-opacity': fade,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 1.2,
          'circle-radius': radius,
        },
      })
      map.addLayer({
        id: 'tap-outs',
        type: 'circle',
        source: 'taps',
        filter: ['==', ['get', 'kind'], 'out'],
        paint: {
          'circle-color': '#de1135',
          'circle-opacity': fade,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 1.2,
          'circle-radius': radius,
        },
      })
      map.fitBounds(
        [
          [stopBounds.west, stopBounds.south],
          [stopBounds.east, stopBounds.north],
        ],
        { padding: 64, duration: 0 },
      )
      map.resize()
    })

    return () => {
      map.remove()
      if (mapRef.current === map) mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    const source = map?.getSource('taps') as GeoJSONSource | undefined
    if (!map || !source) return
    source.setData(tapCollection(minutes))
  }, [minutes])

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

function tapCollection(minutes: number) {
  const byStop = new Map(tapsAt(minutes).map((tap) => [tap.stopId, tap]))
  return {
    type: 'FeatureCollection' as const,
    features: tapStops.flatMap((stop) => {
      const tap = byStop.get(stop.id)
      return [
        circle(stop, 'in', tap?.tapIns ?? 0),
        circle(stop, 'out', tap?.tapOuts ?? 0),
      ]
    }),
  }
}

function circle(stop: (typeof tapStops)[number], kind: 'in' | 'out', count: number) {
  return {
    type: 'Feature' as const,
    properties: { kind, count, name: stop.name },
    geometry: { type: 'Point' as const, coordinates: [stop.lon, stop.lat] as [number, number] },
  }
}
