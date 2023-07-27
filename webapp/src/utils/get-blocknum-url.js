import { eosConfig } from '../config'

export const getBlockNumUrl = (blockNum) => {
  if (!blockNum || !eosConfig.blockExplorerUrl) {
    return
  }

  return (
    eosConfig.blockExplorerUrl
      .replace('(transaction)', blockNum)
      .replace('tx', 'block')
      .replace('transaction', 'block')
      // eslint-disable-next-line
  )
}

export default getBlockNumUrl
