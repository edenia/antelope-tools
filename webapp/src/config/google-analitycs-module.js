import ReactGA from 'react-ga'

export const InitGA = () => {
  console.log('GA Init')
  ReactGA.initialize('G-E6Y0EC9FT8')
}

export const LogPageView = () => {
  ReactGA.set({ page: window.location.pathname })
  ReactGA.pageview(window.location.pathname)
}
