export const useVotes = process.env.REACT_APP_USE_VOTES === 'true'
export const useRewards = process.env.REACT_APP_USE_REWARDS === 'true'
export const title = process.env.REACT_APP_TITLE
export const eosRateLink = process.env.REACT_APP_EOS_RATE_LINK
export const defaultProducerLogo =
  process.env.REACT_APP_DEFAULT_PRODUCER_LOGO ||
  'https://bloks.io/img/eosio.png'
