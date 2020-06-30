export const endpoint = process.env.REACT_APP_EOS_ENDPOINT
export const exchangeRate = process.env.REACT_APP_EOS_DEFAULT_EXCHANGE_RATE
export const exchangeRateApi =
  process.env.REACT_APP_EOS_DEFAULT_EXCHANGE_RATE_API
export const nodeTypes = [
  {
    name: 'producer',
    color: '#2F828E',
    description: 'Node with signing key'
  },
  {
    name: 'full',
    color: '#47C5DA',
    description: 'Node in front of producer'
  },
  {
    name: 'query',
    color: '#000',
    description: 'Node that provides HTTP(S) API to the public'
  },
  {
    name: 'seed',
    color: '#9E9E9E',
    description: 'Node that provides P2P and/or BNET to the public'
  }
]
