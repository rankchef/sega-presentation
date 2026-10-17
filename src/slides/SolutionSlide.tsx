import { useEffect, useState } from 'react'
import { advanceClock, captionFor, clockLabel, clockProgress, clockStart } from '../data/commute'
import { useSlideActive } from '../deck/active'
import { Logo } from '../brand/Logo'
import { TapMap } from './TapMap'

export function SolutionSlide() {
  const active = useSlideActive()
  const [minutes, setMinutes] = useState(clockStart)

  useEffect(() => {
    if (!active) {
      setMinutes(clockStart)
      return
    }
    let time = clockStart
    let last = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      time = advanceClock(time, dt)
      setMinutes(time)
      frame = window.requestAnimationFrame(tick)
    }
    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [active])

  return (
    <div className="solution">
      <section className="solution-copy">
        <Logo variant="full" className="solution-logo" />
        <p className="problem-kicker">The solution</p>
        <h1>Collect more data.</h1>
        <p>
          We use the infrastructure the city already has. Riders tap in when they board and tap out when they leave. That is enough to see which routes people actually ride.
        </p>
        <p>
          In the morning the taps move from the outer parts of Skopje into the center. Around 4pm they reverse.
        </p>
        <div className="legend">
          <p>
            <i className="swatch in" /> Tap in
          </p>
          <p>
            <i className="swatch out" /> Tap out
          </p>
        </div>
      </section>

      <section className="solution-map" aria-label="Skopje tap map">
        <TapMap minutes={minutes} active={active} />
        <div className="solution-time">
          <div>
            <strong>{clockLabel(minutes)}</strong>
            <span>{captionFor(minutes)}</span>
          </div>
          <div className="solution-track" aria-hidden="true">
            <i style={{ width: `${Math.min(100, Math.max(0, clockProgress(minutes) * 100))}%` }} />
          </div>
        </div>
      </section>
    </div>
  )
}
