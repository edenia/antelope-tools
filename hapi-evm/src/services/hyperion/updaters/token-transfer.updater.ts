import { isAddress } from 'web3-validator'

import { incomingTransferModel } from '../../../models'

export default {
  type: `eosio.token:transfer,act.data.to=eosio.evm`,
  notified_account: `eosio.evm`,
  apply: async (action: any) => {
    if (!isAddress(action.data.memo)) {
      return
    }

    try {
      await incomingTransferModel.queries.save({
        block: action.block,
        transaction_id: action.transaction_id,
        timestamp: action.timestamp,
        from: action.data.from,
        to: action.data.to,
        amount: action.data.amount,
        symbol: action.data.symbol,
        memo: action.data.memo,
        quantity: action.data.quantity
      })
    } catch (error: any) {
      console.error(`error to sync ${action.action}: ${error.message}`)
    }
  }
}
