import type { ReactNode } from 'react'
import { DiscountSlide } from './slides/DiscountSlide'
import { FleetSlide } from './slides/FleetSlide'
import { ProblemSlide } from './slides/ProblemSlide'
import { SkipSlide } from './slides/SkipSlide'
import { madzariTrip, nereziTrip } from './data/trips'
import { TripSlide } from './slides/TripSlide'
import { SolutionSlide } from './slides/SolutionSlide'
import { WelcomeSlide } from './slides/WelcomeSlide'

export type Slide = {
  id: string
  title: string
  node: ReactNode
}

export const slides: Slide[] = [
  {
    id: 'welcome',
    title: 'Welcome',
    node: <WelcomeSlide />,
  },
  {
    id: 'problem',
    title: 'The problem',
    node: <ProblemSlide />,
  },
  {
    id: 'collect-data',
    title: 'Collect more data',
    node: <SolutionSlide />,
  },
  {
    id: 'full-trip',
    title: 'Two pairs make the full trip',
    node: <TripSlide trip={nereziTrip} />,
  },
  {
    id: 'madzari-lisice',
    title: 'Madžari to Novo Lisiče',
    node: <TripSlide trip={madzariTrip} />,
  },
  {
    id: 'skip-stops',
    title: 'Test which stops to skip',
    node: <SkipSlide />,
  },
  {
    id: 'fleet',
    title: 'Count the buses the route needs',
    node: <FleetSlide />,
  },
  {
    id: 'discount',
    title: 'Pay less to miss the crush',
    node: <DiscountSlide />,
  },
]
