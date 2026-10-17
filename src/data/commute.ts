import { tapStops } from './stops'

export type Tap = {
  stopId: string
  tapIns: number
  tapOuts: number
}

export const morning = { from: 7 * 60 + 20, to: 8 * 60 + 25 }
export const afternoon = { from: 15 * 60 + 40, to: 16 * 60 + 50 }
export const clockStart = morning.from
export const minutesPerSecond = 5 / 0.22

function envelope(time: number, from: number, peak: number, to: number) {
  if (time < from || time > to) return 0
  if (time <= peak) return (time - from) / Math.max(peak - from, 1)
  return (to - time) / Math.max(to - peak, 1)
}

function noise(id: string, salt: number) {
  let hash = salt
  for (let i = 0; i < id.length; i++) hash = (hash * 33 + id.charCodeAt(i)) >>> 0
  return 0.55 + (hash % 800) / 1000
}

export function tapsAt(time: number): Tap[] {
  return tapStops.map((stop) => {
    const outer = stop.ring > 0.36 ? stop.ring ** 1.35 : 0
    const inner = stop.ring < 0.22 ? (1 - stop.ring) ** 1.5 : 0
    const morningIn = envelope(time, 7 * 60 + 20, 7 * 60 + 45, 8 * 60 + 5) * outer
    const morningOut = envelope(time, 7 * 60 + 50, 8 * 60 + 8, 8 * 60 + 25) * inner
    const eveningIn = envelope(time, 15 * 60 + 40, 16 * 60, 16 * 60 + 25) * inner
    const eveningOut = envelope(time, 16 * 60, 16 * 60 + 20, 16 * 60 + 50) * outer
    return {
      stopId: stop.id,
      tapIns: (morningIn + eveningIn) * 18 * noise(stop.id, 17),
      tapOuts: (morningOut + eveningOut) * 18 * noise(stop.id, 41),
    }
  })
}

export function advanceClock(time: number, dt: number) {
  let next = time + dt * minutesPerSecond
  if (time <= morning.to && next > morning.to) next = afternoon.from + (next - morning.to)
  if (next > afternoon.to) next = morning.from + (next - afternoon.to)
  return next
}

export function clockLabel(time: number) {
  const total = Math.max(0, Math.floor(time))
  const hour = Math.floor(total / 60)
  const minute = total % 60
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

export function captionFor(time: number) {
  if (time >= 7 * 60 + 20 && time < 8 * 60) return 'Outer Skopje taps in'
  if (time >= 8 * 60 && time <= morning.to) return 'Center Skopje taps out'
  if (time >= afternoon.from && time < 16 * 60 + 10) return 'Center Skopje taps in'
  return 'Outer Skopje taps out'
}

export function clockProgress(time: number) {
  const morningSpan = morning.to - morning.from
  const afternoonSpan = afternoon.to - afternoon.from
  const total = morningSpan + afternoonSpan
  if (time <= morning.to) return (time - morning.from) / total
  return (morningSpan + (time - afternoon.from)) / total
}
