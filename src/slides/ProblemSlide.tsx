import { Logo } from '../brand/Logo'

const points = [
  {
    title: 'The daily reversal',
    body: 'Early in the morning, most people travel from the outer parts of Skopje into the center. Around 4pm they travel back out.',
  },
  {
    title: 'Overcrowded peaks',
    body: 'Buses fill up during peak hours.',
  },
  {
    title: 'An old pricing model',
    body: 'Fares are stuck in an older model. A smarter one is needed.',
  },
]

export function ProblemSlide() {
  return (
    <div className="problem">
      <div className="problem-photo" aria-hidden="true" />
      <div className="problem-shade" />
      <Logo variant="full" className="problem-logo" />
      <header className="problem-header">
        <p className="problem-kicker">The problem</p>
        <h1>A fixed network for a city that changes through the day.</h1>
      </header>
      <ol className="problem-grid">
        {points.map((point, index) => (
          <li key={point.title} className="problem-card">
            <span className="problem-index">0{index + 1}</span>
            <h2>{point.title}</h2>
            <p>{point.body}</p>
            {index === 0 ? <Tide /> : null}
            {index === 1 ? <PeakGraph /> : null}
            {index === 2 ? <MoneyIcon /> : null}
          </li>
        ))}
      </ol>
      <p className="map-credit">Photo: Bálint Sallói, CC BY-SA 4.0</p>
    </div>
  )
}

function Tide() {
  return (
    <div className="card-figure tide" aria-hidden="true">
      <div className="tide-row">
        <span>Outer Skopje</span>
        <Arrow />
        <span>Center</span>
        <span className="tide-when">Morning</span>
      </div>
      <div className="tide-row tide-row-back">
        <span>Outer Skopje</span>
        <Arrow />
        <span>Center</span>
        <span className="tide-when">4pm</span>
      </div>
    </div>
  )
}

function Arrow() {
  return (
    <svg className="tide-arrow" viewBox="0 0 72 12" aria-hidden="true">
      <path d="M0 6h64" />
      <path d="M58 1.5 70 6 58 10.5" />
    </svg>
  )
}

function PeakGraph() {
  return (
    <div className="card-figure peak" aria-hidden="true">
      <svg viewBox="0 0 200 88">
        <path className="peak-fill" d="M8 72 C 36 70, 52 64, 70 52 C 86 40, 98 18, 112 16 C 126 14, 138 36, 156 54 C 170 66, 184 70, 192 72 L 192 80 L 8 80 Z" />
        <path className="peak-line" d="M8 72 C 36 70, 52 64, 70 52 C 86 40, 98 18, 112 16 C 126 14, 138 36, 156 54 C 170 66, 184 70, 192 72" />
        <circle className="peak-dot" cx="112" cy="16" r="5" />
        <text className="peak-label" x="112" y="8">Peak</text>
      </svg>
    </div>
  )
}

function MoneyIcon() {
  return (
    <div className="card-figure money" aria-hidden="true">
      <svg viewBox="0 0 88 56">
        <rect className="money-note" x="4" y="10" width="58" height="36" rx="6" />
        <circle className="money-note-ring" cx="33" cy="28" r="8" />
        <circle className="money-coin" cx="70" cy="22" r="12" />
        <circle className="money-coin money-coin-back" cx="76" cy="36" r="10" />
        <text className="money-mark" x="70" y="26">ден</text>
      </svg>
    </div>
  )
}
