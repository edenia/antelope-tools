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
let _nodeChips = null
let _producerTypes = null

switch (networkName) {
  case 'lacchain':
    _nodeTypes = [
      {
        name: 'validator',
        color: '#4f4363',
        description: 'Node with signing key',
      },
      { name: 'boot', color: '#6ec4e0', description: 'Boot node' },
      { name: 'writer', color: '#5484b3', description: 'Writer node' },
      { name: 'observer', color: '#000', description: 'Observer node' },
    ]
    _producerTypes = ['partners', 'nonPartners']
    break
  default:
    _nodeTypes = [
      {
        name: 'producer',
        color: '#4f4363',
        description: 'Node with signing key',
      },
      {
        name: 'full',
        color: '#6ec4e0',
        description: 'Node in front of producer',
      },
      {
        name: 'query',
        color: '#5484b3',
        description: 'Node that provides HTTP(S) API to the public',
      },
      {
        name: 'seed',
        color: '#000',
        description: 'Node that provides P2P and/or BNET to the public',
      },
    ]
    _producerTypes = ['top21', 'paidStandby', 'nonPaidStandby']
    _nodeChips = [
      ..._nodeTypes,
      {
        name: 'hyperion-v2',
      },
      {
        name: 'history-v1',
      },
    ]
    break
}

const getEndpoint = (protocol, host, port) => {
  return `${protocol}://${host}${port ? ':' : ''}${port}`
}

export const endpoint = getEndpoint(
  process.env.REACT_APP_EOS_API_PROTOCOL,
  JSON.parse(process.env.REACT_APP_EOS_API_HOSTS)[0] || '',
  process.env.REACT_APP_EOS_API_PORT,
)
export const endpoints = (JSON.parse(
  process.env.REACT_APP_EOS_API_HOSTS,
) || []).map(endpoint =>
  getEndpoint(
    process.env.REACT_APP_EOS_API_PROTOCOL,
    endpoint || '',
    process.env.REACT_APP_EOS_API_PORT,
  ),
)

export const nodeTypes = _nodeTypes
export const nodeChips = _nodeChips || _nodeTypes
export const producerTypes = _producerTypes
export const includeDefaultTransaction = process.env
  .REACT_APP_EOS_INCLUDE_TRANSACTION
  ? JSON.parse(process.env.REACT_APP_EOS_INCLUDE_TRANSACTION)
  : null
export const blockExplorerUrl = process.env.REACT_APP_BLOCK_EXPLORER_URL
export const syncToleranceInterval =
  process.env.REACT_APP_SYNC_TOLERANCE_INTERVAL || 180000
export const producerColumns = [
  { name: 'rank', disabled: { lacchain: true } },
  { name: 'producerName' },
  { name: 'country' },
  { name: 'website' },
  { name: 'votes', disabled: { lacchain: true } },
  { name: 'rewards', disabled: { lacchain: true } },
  { name: 'health' },
  { name: 'social' },
].flatMap((col) =>
  !col?.disabled || !col?.disabled[networkName] ? col?.name : [],
)
export const producersRoute = networkName !== 'lacchain' ? 'block-producers' : 'entities'
