import { type TripExample } from '../data/trips'
import { useSlideActive } from '../deck/active'
import { Logo } from '../brand/Logo'
import { TripMap } from './TripMap'

export function TripSlide({ trip }: { trip: TripExample }) {
  const active = useSlideActive()

  return (
    <div className="solution">
      <section className="solution-copy">
        <Logo variant="full" className="solution-logo" />
        <p className="problem-kicker">{trip.kicker}</p>
        <h1>{trip.title}</h1>
        {trip.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <section className="solution-map" aria-label={`${trip.start.name} to ${trip.end.name}`}>
        <TripMap trip={trip} active={active} />
        <div className="solution-time trip-caption">
          <div>
            <strong>Propose a direct route</strong>
            <span>
              {trip.start.name} → {trip.end.name}
            </span>
          </div>
          <p>
            <i className="swatch out" /> Today: {trip.today}
            <span className="trip-sep">·</span>
            <i className="swatch in" /> Proposed: {trip.proposed}
          </p>
        </div>
      </section>
    </div>
  )
}
