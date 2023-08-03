import { eosConfig } from 'config'

let _avgBlockTime = 'N/A'
let _gasPrice = 'N/A'

switch (eosConfig.networkName) {
  case 'telos-testnet':
  case 'telos':
    _avgBlockTime = '0.5 s'
    _gasPrice = '550 Gwei'
    break
  case 'jungle':
  case 'eos':
    _avgBlockTime = '1 s'
    _gasPrice = '150 Gwei'
    break
  default:
    break
}

export const gasPrice = _gasPrice
export const avgBlockTime = _avgBlockTime
