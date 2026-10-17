import stopsCsv from '../../gis/stops.txt?raw'

export type Stop = {
  id: string
  name: string
  lat: number
  lon: number
  km: number
  ring: number
}

const center = { lat: 41.996, lon: 21.431 }

function splitCsv(line: string) {
  return line.split(',')
}

function kmFromCenter(lat: number, lon: number) {
  const toRad = Math.PI / 180
  const dLat = (lat - center.lat) * toRad
  const dLon = (lon - center.lon) * toRad
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(center.lat * toRad) * Math.cos(lat * toRad) * Math.sin(dLon / 2) ** 2
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function parseStops(csv: string): Stop[] {
  const lines = csv.trim().split(/\r?\n/)
  const header = splitCsv(lines[0] ?? '')
  const index = Object.fromEntries(header.map((key, i) => [key, i]))
  const stops: Stop[] = []

  for (const line of lines.slice(1)) {
    const parts = splitCsv(line)
    const type = parts[index.location_type] ?? '0'
    if (type && type !== '0') continue
    const lat = Number(parts[index.stop_lat])
    const lon = Number(parts[index.stop_lon])
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue
    if (lat < 41.7 || lat > 42.3 || lon < 21.1 || lon > 21.8) continue
    const km = kmFromCenter(lat, lon)
    if (km > 10.5) continue
    stops.push({
      id: parts[index.stop_id] ?? '',
      name: parts[index.stop_name] ?? 'Stop',
      lat,
      lon,
      km,
      ring: Math.min(1, Math.max(0, (km - 1.2) / 5.2)),
    })
  }

  return stops
}

export const stops = parseStops(stopsCsv)

function sector(stop: Stop) {
  const angle = Math.atan2(stop.lat - center.lat, stop.lon - center.lon)
  return Math.floor(((angle + Math.PI) / (Math.PI * 2)) * 8) % 8
}

function thin(list: Stop[], cellKm: number, limit: number) {
  const cell = cellKm / 111
  const seen = new Set<string>()
  const picked: Stop[] = []
  for (const stop of list) {
    const key = `${Math.round(stop.lat / cell)}:${Math.round(stop.lon / cell)}`
    if (seen.has(key)) continue
    seen.add(key)
    picked.push(stop)
    if (picked.length >= limit) break
  }
  return picked
}

function around(list: Stop[], cellKm: number, perSector: number) {
  const buckets: Stop[][] = Array.from({ length: 8 }, () => [])
  for (const stop of list) buckets[sector(stop)]?.push(stop)
  return buckets.flatMap((bucket) => thin(bucket, cellKm, perSector))
}

const inner = around(stops.filter((stop) => stop.km < 2.1), 0.5, 2)
const outer = around(stops.filter((stop) => stop.km > 3.2 && stop.km < 8.6), 1.05, 3)

export const tapStops = [...inner, ...outer]

export const stopBounds = {
  west: Math.min(...tapStops.map((stop) => stop.lon)),
  south: Math.min(...tapStops.map((stop) => stop.lat)),
  east: Math.max(...tapStops.map((stop) => stop.lon)),
  north: Math.max(...tapStops.map((stop) => stop.lat)),
}
