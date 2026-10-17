const nextKeys = new Set(['ArrowRight', 'ArrowDown', 'PageDown', ' '])
const prevKeys = new Set(['ArrowLeft', 'ArrowUp', 'PageUp'])

export function isDeckKey(key: string) {
  return nextKeys.has(key) || prevKeys.has(key) || key === 'Home' || key === 'End'
}

export function indexFromKey(index: number, key: string, count: number): number | null {
  if (count < 1) return null
  const last = count - 1
  if (nextKeys.has(key)) return Math.min(index + 1, last)
  if (prevKeys.has(key)) return Math.max(index - 1, 0)
  if (key === 'Home') return 0
  if (key === 'End') return last
  return null
}

export function indexFromHash(hash: string, count: number): number {
  const slide = Number(hash.replace(/^#/, ''))
  if (!Number.isInteger(slide) || slide < 1) return 0
  return Math.min(slide - 1, Math.max(count - 1, 0))
}
