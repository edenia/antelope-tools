export const endpoint = `${process.env.REACT_APP_EOS_API_PROTOCOL}://${
  process.env.REACT_APP_EOS_API_HOST
}${process.env.REACT_APP_EOS_API_PORT ? ':' : ''}${
  process.env.REACT_APP_EOS_API_PORT
}`
export const useBpJsonOnChain =
  process.env.REACT_APP_EOS_USE_BP_JSON_ON_CHAIN === 'true'
export const bpJsonOnChainContract =
  process.env.REACT_APP_EOS_BP_JSON_ON_CHAIN_CONTRACT
export const bpJsonOnChainTable =
  process.env.REACT_APP_EOS_BP_JSON_ON_CHAIN_TABLE
export const bpJsonOnChainScope =
  process.env.REACT_APP_EOS_BP_JSON_ON_CHAIN_SCOPE

export const networkName = process.env.REACT_APP_EOS_API_NETWORK_NAME
export const networkLabel = process.env.REACT_APP_EOS_API_NETWORK_LABEL
export const networkLogo = process.env.REACT_APP_EOS_API_NETWORK_LOGO
export const tokenSymbol = process.env.REACT_APP_TOKEN_SYMBOL

let _nodeTypes = null

switch (networkName) {
  case 'lacchain':
    _nodeTypes = [
      {
        name: 'validator',
        color: '#4f4363',
        description: 'Node with signing key'
      },
      { name: 'boot', color: '#6ec4e0', description: 'Boot node' },
      { name: 'writer', color: '#5484b3', description: 'Writer node' },
      { name: 'observer', color: '#000', description: 'Observer node' }
    ]
    break
  default:
    _nodeTypes = [
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
    break
}

export const nodeTypes = _nodeTypes
export const includeDefaultTransaction = process.env
  .REACT_APP_EOS_INCLUDE_TRANSACTION
  ? JSON.parse(process.env.REACT_APP_EOS_INCLUDE_TRANSACTION)
  : null
export const blockExplorerUrl = process.env.REACT_APP_BLOCK_EXPLORER_URL
