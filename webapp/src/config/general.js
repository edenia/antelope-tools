import resources from '../language'

export const useRewards = process.env.REACT_APP_USE_REWARDS === 'true'
export const useVotes = process.env.REACT_APP_USE_VOTES === 'true'
export const title = process.env.REACT_APP_TITLE
export const eosRateLink = process.env.REACT_APP_EOS_RATE_LINK
export const defaultProducerLogo =
  process.env.REACT_APP_DEFAULT_PRODUCER_LOGO ||
  'https://bloks.io/img/eosio.png'
export const footerLinks = process.env.REACT_APP_FOOTER_LINKS
  ? JSON.parse(process.env.REACT_APP_FOOTER_LINKS)
  : []
export const disabledMenuItems = JSON.parse(
  process.env.REACT_APP_DISABLED_MENU_ITEMS || '[]',
)
export const appVersion =
  process.env.REACT_APP_VERSION.split('/').pop() || 'v1.0'
export const appName = process.env.REACT_APP_NAME || 'antelopetools'
export const networkLinks = process.env.REACT_APP_NETWORK_URL
  ? JSON.parse(process.env.REACT_APP_NETWORK_URL)
  : []
export const historyEnabled =
  process.env.REACT_APP_STATE_HISTORY_ENABLED === 'true'
export const googleAnaliticPageId =
  process.env.REACT_APP_GOOGLE_ANALITIC_PAGE_ID
export const highchartsMapURL = 'https://code.highcharts.com/mapdata/countries/'
export const healthLights = Object.freeze({
  greenLight: 'greenLight',
  timerOff: 'timerOff',
  yellowLight: 'yellowLight',
  redLight: 'redLight',
})
export const defaultLanguage = 'en'
export const languageResources = resources
export const languages = Object.keys(resources)
export const languagesInProgress = ['ko', 'zh']
export const languagesLabels = {
  'es': 'Español',
  'en': 'English',
  'ko': '한국인',
  'zh': '中文',
}
