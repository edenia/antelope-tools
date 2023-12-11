import { eosConfig } from '../config'

export const getTransactionUrl = (trx) => {
  if (!trx || !eosConfig.blockExplorerTxUrl) {
    return
  }

  return {
    trxId: trx.substr(trx.length - 6, trx.length),
    // eslint-disable-next-line
    explorerUrl: eosConfig.blockExplorerTxUrl.replace('(transaction)', trx)
  }
}

export default getTransactionUrl
