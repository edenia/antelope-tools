import { eosConfig } from 'config'

let _avgBlockTime = 'N/A'
let _endpoints

switch (eosConfig.networkName) {
  case 'telos-testnet':
  case 'telos':
    _avgBlockTime = 0.5
    break
  case 'jungle':
  case 'mainnet':
    _avgBlockTime = 1
    break
  default:
    break
}

try {
  _endpoints = JSON.parse(process.env.REACT_APP_EVM_ENDPOINTS || '[]') || []
} catch (error) {
  console.error(error)
  _endpoints = []
}

export const avgBlockTime = _avgBlockTime
export const maxTPSDataSize = 30 / _avgBlockTime || 0
export const account = 'eosio.evm'
export const endpoint = process.env.REACT_APP_EVM_ENDPOINT
export const blockExplorerUrl = process.env.REACT_APP_EVM_BLOCK_EXPLORER_URL
export const endpoints = _endpoints
