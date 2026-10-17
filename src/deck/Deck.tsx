import { useCallback, useEffect, useState } from 'react'
import type { Slide } from '../slides'
import { SlideActiveContext } from './active'
import { indexFromHash, indexFromKey, isDeckKey } from './keys'

type DeckProps = {
  slides: Slide[]
}

function isFormField(target: EventTarget | null) {
  return target instanceof HTMLElement && Boolean(target.closest('input, textarea, select, [contenteditable="true"]'))
}

export function Deck({ slides }: DeckProps) {
  const count = slides.length
  const [index, setIndex] = useState(() => indexFromHash(window.location.hash, count))

  const go = useCallback(
    (delta: number) => {
      setIndex((current) => Math.min(Math.max(current + delta, 0), count - 1))
    },
    [count],
  )

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (isFormField(event.target)) return
      if (!isDeckKey(event.key)) return
      event.preventDefault()
      setIndex((current) => indexFromKey(current, event.key, count) ?? current)
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [count])

  useEffect(() => {
    const hash = `#${index + 1}`
    if (window.location.hash !== hash) history.replaceState(null, '', hash)
  }, [index])

  useEffect(() => {
    const onHash = () => setIndex(indexFromHash(window.location.hash, count))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [count])

  const slide = slides[index]

  return (
    <div className="deck">
      <div className="deck-viewport">
        {slides.map((item, itemIndex) => (
          <section
            key={item.id}
            className="slide"
            aria-label={item.title}
            aria-hidden={itemIndex !== index}
            inert={itemIndex !== index}
            style={{ transform: `translate3d(${(itemIndex - index) * 100}%, 0, 0)` }}
          >
            <SlideActiveContext.Provider value={itemIndex === index}>{item.node}</SlideActiveContext.Provider>
          </section>
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        {slide ? `${slide.title}, slide ${index + 1} of ${count}` : 'No slides'}
      </p>

      <nav className="deck-nav" aria-label="Slides">
        <button type="button" onClick={() => go(-1)} disabled={index === 0} aria-label="Previous slide">
          <Chevron direction="left" />
        </button>
        <span>
          {index + 1} / {count}
        </span>
        <button type="button" onClick={() => go(1)} disabled={index >= count - 1} aria-label="Next slide">
          <Chevron direction="right" />
        </button>
      </nav>
    </div>
  )
}

function Chevron({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d={direction === 'left' ? 'M10.2 2.8 4.9 8l5.3 5.2' : 'M5.8 2.8 11.1 8l-5.3 5.2'}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
