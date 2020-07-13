export const endpoint = process.env.REACT_APP_EOS_ENDPOINT
export const producerInfoOnChainContractName =
  process.env.REACT_APP_PRODUCER_INFO_ON_CHAIN_CONTRACT_NAME
export const producerInfoOnChainTableName =
  process.env.REACT_APP_PRODUCER_INFO_ON_CHAIN_TABLE_NAME
export const producerInfoOnScopeName =
  process.env.REACT_APP_PRODUCER_INFO_ON_CHAIN_SCOPE_NAME
export const exchangeRate = process.env.REACT_APP_EOS_DEFAULT_EXCHANGE_RATE
export const exchangeRateApi =
  process.env.REACT_APP_EOS_DEFAULT_EXCHANGE_RATE_API
export const nodeTypes = [
  {
    name: 'producer',
    color: '#4f4363',
    description: 'Node with signing key'
  },
  {
    name: 'full',
    color: '#6ec4e0',
    description: 'Node in front of producer'
  },
  {
    name: 'query',
    color: '#5484b3',
    description: 'Node that provides HTTP(S) API to the public'
  },
  {
    name: 'seed',
    color: '#000',
    description: 'Node that provides P2P and/or BNET to the public'
  }
]
