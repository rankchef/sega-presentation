import { Logo } from '../brand/Logo'

const offers = [
  { when: '07:40', note: 'Peak', off: 'Full fare', tone: 'peak' },
  { when: '08:40', note: 'Just after', off: '50% off', tone: 'mid' },
  { when: '10:10', note: 'Quiet', off: '90% off', tone: 'deep' },
]

export function DiscountSlide() {
  return (
    <div className="solution offer">
      <section className="solution-copy">
        <Logo variant="full" className="solution-logo" />
        <p className="problem-kicker">The mobile app</p>
        <h1>Pay less to miss the crush.</h1>
        <p>
          The same trip costs 50% to 90% less when you take a bus off the peak. The quieter the hour, the larger the discount.
        </p>
        <p>
          Some riders take the cheaper bus. The morning and evening spikes come down, and the middle of the day fills in.
        </p>
      </section>

      <section className="offer-panel" aria-label="Off-peak discount">
        <article className="offer-card">
          <p className="skip-kicker">Same route · cheaper later</p>
          <h2>The peak gets flatter.</h2>
          <Demand />
          <p className="offer-legend">
            <span>
              <i /> Today
            </span>
            <span>
              <i className="is-after" /> With the discount
            </span>
          </p>
          <ul>
            {offers.map((offer) => (
              <li key={offer.when} className={offer.tone}>
                <span>{offer.when}</span>
                <span>{offer.note}</span>
                <b>{offer.off}</b>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  )
}

function Demand() {
  return (
    <svg className="offer-chart" viewBox="0 0 360 120" role="img" aria-label="Peak demand compared with a flatter day">
      <path className="offer-before" d="M8 96 C40 96 52 28 86 24 C118 20 132 88 168 94 C204 100 214 30 258 26 C292 22 310 86 352 92" />
      <path className="offer-after" d="M8 96 C42 94 58 58 90 54 C122 50 136 78 168 80 C200 82 214 56 258 52 C296 48 318 78 352 84" />
    </svg>
  )
}
