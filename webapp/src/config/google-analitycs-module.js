import ReactGA from 'react-ga'

import { googleAnaliticPageId } from './general'

export const InitGA = () => {
  console.log('GA Init')
  ReactGA.initialize(googleAnaliticPageId)
}

export const LogPageView = () => {
  ReactGA.set({ page: window.location.pathname })
  ReactGA.pageview(window.location.pathname)
}
