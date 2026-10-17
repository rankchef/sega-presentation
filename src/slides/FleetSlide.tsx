import { Logo } from '../brand/Logo'

const hours = [
  { label: '06:00', people: 48, buses: 2 },
  { label: '07:00', people: 126, buses: 5 },
  { label: '08:00', people: 240, buses: 8 },
  { label: '09:00', people: 96, buses: 4 },
  { label: '11:00', people: 30, buses: 1 },
  { label: '17:00', people: 210, buses: 7 },
]

const maxPeople = 240

export function FleetSlide() {
  return (
    <div className="solution fleet">
      <section className="solution-copy">
        <Logo variant="full" className="solution-logo" />
        <p className="problem-kicker">Overcrowded buses</p>
        <h1>Count the buses the route needs.</h1>
        <p>
          Taps already say how many people board each route, hour by hour. Divide that by the seats on one bus. The result is how many buses that route needs then.
        </p>
        <p>
          A flat timetable copied from last year leaves the 8am bus packed and the 11am bus empty. The count follows the riders instead.
        </p>
      </section>

      <section className="fleet-panel" aria-label="Buses needed on one route">
        <article className="fleet-card">
          <p className="skip-kicker">One route · 30 seats</p>
          <h2>People on the route ÷ 30.</h2>
          <ol>
            {hours.map((hour) => (
              <li key={hour.label}>
                <span>{hour.label}</span>
                <span className="fleet-bar" aria-hidden="true">
                  <i style={{ width: `${(hour.people / maxPeople) * 100}%` }} />
                </span>
                <b>
                  {hour.buses} {hour.buses === 1 ? 'bus' : 'buses'}
                </b>
              </li>
            ))}
          </ol>
          <p className="skip-note">08:00 is 240 boardings. 240 ÷ 30 seats = 8 buses.</p>
        </article>
      </section>
    </div>
  )
}
