import { eosConfig } from 'config'

let _avgBlockTime = 'N/A'

switch (eosConfig.networkName) {
  case 'telos-testnet':
  case 'telos':
    _avgBlockTime = 0.5
    break
  case 'jungle':
  case 'eos':
    _avgBlockTime = 1
    break
  default:
    break
}

export const avgBlockTime = _avgBlockTime
export const maxTPSDataSize = 30 / _avgBlockTime
export const account = 'eosio.evm'
export const endpoint = process.env.REACT_APP_EVM_ENDPOINT
