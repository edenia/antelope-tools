import { eosConfig } from '../config'

export const getBlockNumUrl = (blockNum) => {
  if (!blockNum || !eosConfig.blockExplorerTxUrl) {
    return
  }

  return (
    eosConfig.blockExplorerTxUrl
      .replace('(transaction)', blockNum)
      .replace('tx', 'block')
      .replace('transaction', 'block')
      // eslint-disable-next-line
  )
}

export default getBlockNumUrl
