import { createContext, useContext } from 'react'

export const SlideActiveContext = createContext(false)

export function useSlideActive() {
  return useContext(SlideActiveContext)
}
