import { Logo } from '../brand/Logo'
import { useSlideActive } from '../deck/active'
import { StillMap } from './StillMap'

const buses = [
  { id: '01', kind: 'Stops', stops: true },
  { id: '02', kind: 'Stops', stops: true },
  { id: '03', kind: 'Skips', stops: false },
]

export function SkipSlide() {
  const active = useSlideActive()

  return (
    <div className="skip">
      <div className="skip-map" aria-hidden="true">
        <StillMap active={active} />
      </div>
      <div className="skip-shade" />

      <section className="solution-copy skip-copy">
        <Logo variant="full" className="solution-logo" />
        <p className="problem-kicker">After the data</p>
        <h1>Test which stops to skip.</h1>
        <p>
          The places people go are not random. Once we can see the rides, we can test which stops a bus should pass.
        </p>
        <p>
          In the morning, after a bus reaches the center and turns back out, some trips should skip the inner stops. They get to the outer parts of the city faster, and pick up the next wave. One pattern to try: every third bus heading out does not stop. The others still do.
        </p>
        <p>In the afternoon the same idea runs the other way.</p>
      </section>

      <section className="skip-panel" aria-label="Skip pattern">
        <article className="skip-card">
          <p className="skip-kicker">Morning · heading out</p>
          <h2>Every third bus is express.</h2>
          <ol>
            {buses.map((bus) => (
              <li key={bus.id}>
                <span>Bus {bus.id}</span>
                <Route stops={bus.stops} />
                <b>{bus.kind}</b>
              </li>
            ))}
          </ol>
          <p className="skip-note">Afternoon reverses this: express trips run into the center.</p>
        </article>
      </section>

      <p className="map-credit">© OpenStreetMap contributors</p>
    </div>
  )
}

function Route({ stops }: { stops: boolean }) {
  return (
    <svg className="skip-route" viewBox="0 0 220 20" aria-hidden="true">
      <path d="M8 10h204" />
      {stops ? (
        <>
          <circle cx="28" cy="10" r="4" />
          <circle cx="78" cy="10" r="4" />
          <circle cx="128" cy="10" r="4" />
          <circle cx="178" cy="10" r="4" />
        </>
      ) : (
        <>
          <circle cx="28" cy="10" r="4" />
          <circle className="is-skip" cx="78" cy="10" r="4" />
          <circle className="is-skip" cx="128" cy="10" r="4" />
          <circle cx="192" cy="10" r="4" />
        </>
      )}
    </svg>
  )
}
