import { eosConfig } from '../config'

export const getTransactionUrl = (trx) => {
  console.log({ trx })
  if (!trx || !eosConfig.blockExplorerUrl) {
    return
  }

  return {
    trxId: trx.substr(trx.length - 6, trx.length),
    // eslint-disable-next-line
    explorerUrl: eosConfig.blockExplorerUrl.replace('(transaction)', trx)
  }
}

export default getTransactionUrl
