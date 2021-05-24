import { eosConfig } from '../config'

export const getBlockNumUrl = (blockNum) => {
  if (!blockNum || !eosConfig.blockExplorerUrl) {
    return
  }

  return eosConfig.blockExplorerUrl
    .replace('transaction', 'block')
    .replace('${transaction}', blockNum)
}

export default getBlockNumUrl
