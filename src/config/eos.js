export const endpoint = process.env.REACT_APP_EOS_ENDPOINT
export const exchangeRate = process.env.REACT_APP_EOS_DEFAULT_EXCHANGE_RATE
export const exchangeRateApi =
  process.env.REACT_APP_EOS_DEFAULT_EXCHANGE_RATE_API
export const nodeTypes = [
  {
    name: 'producer',
    color: 'blue',
    description: 'Node with signing key'
  },
  {
    name: 'full',
    color: 'green',
    description: 'Node in front of producer'
  },
  {
    name: 'query',
    color: 'yellow',
    description: 'Node that provides HTTP(S) API to the public'
  },
  {
    name: 'seed',
    color: 'red',
    description: 'Node that provides P2P and/or BNET to the public'
  }
]
