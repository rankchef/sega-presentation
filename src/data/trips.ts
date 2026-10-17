export type Place = {
  name: string
  detail: string
  lat: number
  lon: number
}

export type TripExample = {
  id: string
  kicker: string
  title: string
  paragraphs: string[]
  today: string
  proposed: string
  start: Place
  hub: Place
  end: Place
  currentVia: [[number, number], [number, number]]
  proposedVia: [number, number]
}

function lerp(a: [number, number], b: [number, number], t: number): [number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
}

function bend(a: [number, number], b: [number, number], via: [number, number]): [number, number][] {
  const points: [number, number][] = []
  for (let i = 0; i <= 10; i++) {
    const t = i / 10
    points.push(lerp(lerp(a, b, t), via, Math.sin(Math.PI * t) * 0.28))
  }
  return points
}

function point(place: Place): [number, number] {
  return [place.lon, place.lat]
}

export const nereziTrip: TripExample = {
  id: 'nerezi',
  kicker: 'After the data',
  title: 'Two pairs make the full trip.',
  paragraphs: [
    'A student going from Nerezi to school on Ilindenska, at Orce Nikolov, first has to ride into the center, tap out, then take another bus back to Ilindenska. That is one ride plus another ride — and the wrong way around the city.',
    'Two tap-in / tap-out pairs show the trip they were actually planning: Nerezi to Ilindenska. This is one inefficient example. The same data would surface the popular, needed routes that are not on the map today.',
  ],
  today: 'Nerezi → Center → Orce Nikolov',
  proposed: 'Nerezi → Orce Nikolov',
  start: { name: 'Nerezi', detail: 'Dolno Nerezi', lat: 42.004532, lon: 21.384094 },
  hub: { name: 'Center', detail: 'Centar Rekord', lat: 41.994781, lon: 21.430099 },
  end: { name: 'Ilindenska', detail: 'Orce Nikolov', lat: 42.00666, lon: 21.411926 },
  currentVia: [
    [21.408, 41.992],
    [21.424, 42.004],
  ],
  proposedVia: [21.396, 42.008],
}

export const madzariTrip: TripExample = {
  id: 'madzari',
  kicker: 'Another missing route',
  title: 'Madžari should not detour west.',
  paragraphs: [
    'Someone going from Madžari to Novo Lisiče first has to ride into Transporten centar, tap out, then take another bus back out to Novo Lisiče. They go west, then come back east — instead of crossing the bridge.',
    'Two tap pairs show the trip they meant: Madžari to Novo Lisiče. A second bus that simply crosses the river would be enough. The same data would find more of these.',
  ],
  today: 'Madžari → Transporten centar → Novo Lisiče',
  proposed: 'Madžari → Novo Lisiče, across the bridge',
  start: { name: 'Madžari', detail: 'Madžari pošta', lat: 41.995937, lon: 21.500128 },
  hub: { name: 'Transporten', detail: 'Transporten centar', lat: 41.990341, lon: 21.444901 },
  end: { name: 'Novo Lisiče', detail: 'Novo Lisiče 1', lat: 41.979828, lon: 21.477798 },
  currentVia: [
    [21.472, 41.998],
    [21.456, 41.981],
  ],
  proposedVia: [21.492, 41.986],
}

export function currentPath(trip: TripExample) {
  return {
    type: 'FeatureCollection' as const,
    features: [
      {
        type: 'Feature' as const,
        properties: { kind: 'current' },
        geometry: {
          type: 'LineString' as const,
          coordinates: [
            ...bend(point(trip.start), point(trip.hub), trip.currentVia[0]),
            ...bend(point(trip.hub), point(trip.end), trip.currentVia[1]),
          ],
        },
      },
    ],
  }
}

export function proposedPath(trip: TripExample) {
  return {
    type: 'FeatureCollection' as const,
    features: [
      {
        type: 'Feature' as const,
        properties: { kind: 'proposed' },
        geometry: {
          type: 'LineString' as const,
          coordinates: bend(point(trip.start), point(trip.end), trip.proposedVia),
        },
      },
    ],
  }
}

export function tripBounds(trip: TripExample) {
  const places = [trip.start, trip.hub, trip.end]
  return {
    west: Math.min(...places.map((place) => place.lon)),
    south: Math.min(...places.map((place) => place.lat)),
    east: Math.max(...places.map((place) => place.lon)),
    north: Math.max(...places.map((place) => place.lat)),
  }
}
