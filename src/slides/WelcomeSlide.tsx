import { useEffect, useRef } from 'react'
import { Map as MlMap, setWorkerUrl } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Logo } from '../brand/Logo'

setWorkerUrl('/maplibre-gl-worker.mjs')

const skopje: [number, number] = [21.431, 41.996]

const creators = [
  { name: 'Nikola Dimitrovski' },
  { name: 'Ivan Ilijevski' },
]

export function WelcomeSlide() {
  const node = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = node.current
    if (!container) return

    const map = new MlMap({
      container,
      center: skopje,
      zoom: 12,
      minZoom: 10,
      maxZoom: 16,
      interactive: false,
      attributionControl: false,
      fadeDuration: 0,
      canvasContextAttributes: { preserveDrawingBuffer: true },
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

    const paint = () => map.resize()
    map.on('load', paint)
    map.once('idle', paint)

    return () => map.remove()
  }, [])

  return (
    <div className="welcome">
      <div className="welcome-map" aria-hidden="true">
        <div ref={node} className="welcome-map-canvas" />
      </div>
      <div className="welcome-shade" />
      <article className="welcome-card">
        <Logo variant="stacked" className="welcome-logo" />
        <p className="welcome-kicker">Skopje</p>
        <h1>Welcome</h1>
        <p className="welcome-lede">How the city gets where it’s going.</p>
        <p className="welcome-kicker creators-label">Creators</p>
        <ul className="creators">
          {creators.map((creator) => (
            <li key={creator.name}>
              <ProfileIcon />
              <span>{creator.name}</span>
            </li>
          ))}
        </ul>
      </article>
      <p className="welcome-hint">Arrow keys move between slides</p>
      <p className="map-credit">© OpenStreetMap contributors</p>
    </div>
  )
}

function ProfileIcon() {
  return (
    <svg className="creator-icon" viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="20" />
      <circle cx="20" cy="15.5" r="5.2" className="creator-icon-face" />
      <path className="creator-icon-face" d="M9.2 31.5c1.8-5 5.4-7.4 10.8-7.4s9 2.4 10.8 7.4" />
    </svg>
  )
}
