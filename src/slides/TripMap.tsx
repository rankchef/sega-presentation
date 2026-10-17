import { useEffect, useRef } from 'react'
import { Map as MlMap, Marker, setWorkerUrl } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { currentPath, proposedPath, tripBounds, type TripExample } from '../data/trips'

setWorkerUrl('/maplibre-gl-worker.mjs')

export function TripMap({ trip, active }: { trip: TripExample; active: boolean }) {
  const node = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MlMap | null>(null)

  useEffect(() => {
    const container = node.current
    if (!container) return

    const bounds = tripBounds(trip)
    const map = new MlMap({
      container,
      center: [trip.hub.lon, trip.hub.lat],
      zoom: 12.6,
      minZoom: 11,
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
    const markers: Marker[] = []

    map.on('load', () => {
      map.addSource('current', { type: 'geojson', data: currentPath(trip) })
      map.addSource('proposed', { type: 'geojson', data: proposedPath(trip) })

      map.addLayer({
        id: 'current-line',
        type: 'line',
        source: 'current',
        paint: {
          'line-color': '#de1135',
          'line-width': 4,
          'line-opacity': 0.88,
          'line-dasharray': [1.4, 1.2],
        },
        layout: { 'line-cap': 'round', 'line-join': 'round' },
      })
      map.addLayer({
        id: 'proposed-line',
        type: 'line',
        source: 'proposed',
        paint: {
          'line-color': '#0d5499',
          'line-width': 5.2,
          'line-opacity': 0.95,
        },
        layout: { 'line-cap': 'round', 'line-join': 'round' },
      })

      const pins = [
        { place: trip.start, tone: 'in' },
        { place: trip.hub, tone: 'out' },
        { place: trip.end, tone: 'in' },
      ]
      for (const pin of pins) {
        const el = document.createElement('div')
        el.className = `trip-pin trip-pin-${pin.tone}`
        el.innerHTML = `<strong>${pin.place.name}</strong><span>${pin.place.detail}</span>`
        markers.push(new Marker({ element: el, anchor: 'bottom' }).setLngLat([pin.place.lon, pin.place.lat]).addTo(map))
      }

      map.fitBounds(
        [
          [bounds.west, bounds.south],
          [bounds.east, bounds.north],
        ],
        { padding: { top: 72, bottom: 120, left: 56, right: 56 }, duration: 0 },
      )
      map.resize()
    })

    return () => {
      for (const marker of markers) marker.remove()
      map.remove()
      if (mapRef.current === map) mapRef.current = null
    }
  }, [trip])

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
