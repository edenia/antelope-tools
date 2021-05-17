export const useRewards = process.env.REACT_APP_USE_REWARDS === 'true'
export const useVotes = process.env.REACT_APP_USE_VOTES === 'true'
export const useCpuBenchmark =
  process.env.REACT_APP_USE_CPU_BENCHMARK === 'true'
export const title = process.env.REACT_APP_TITLE
export const eosRateLink = process.env.REACT_APP_EOS_RATE_LINK
export const defaultProducerLogo =
  process.env.REACT_APP_DEFAULT_PRODUCER_LOGO ||
  'https://bloks.io/img/eosio.png'
export const footerLinks = process.env.REACT_APP_FOOTER_LINKS
  ? JSON.parse(process.env.REACT_APP_FOOTER_LINKS)
  : []
export const disabledMenuItems = JSON.parse(
  process.env.REACT_APP_DISABLED_MENU_ITEMS || '[]'
)
export const appVersion = process.env.REACT_APP_VERSION || 'v1.0'
export const appName = process.env.REACT_APP_NAME || 'eosiodashboard'
export const networkLinks = process.env.REACT_APP_NETWORK_URL
  ? JSON.parse(process.env.REACT_APP_NETWORK_URL)
  : []
