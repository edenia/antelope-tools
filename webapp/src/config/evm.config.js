import { eosConfig } from "config"

let _avgBlockTime 

switch(eosConfig.networkName){
    case 'telos-testnet':
    case 'telos':
        _avgBlockTime = '0.5 s'
        break
    case 'jungle':
    case 'eos':
        _avgBlockTime = '1 s'
        break
    default:
        _avgBlockTime = 'N/A'
        break
}


export const gasPrice = '550 Gwei'
export const avgBlockTime = _avgBlockTime 
