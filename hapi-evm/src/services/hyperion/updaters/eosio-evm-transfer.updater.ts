import { isAddress } from 'web3-validator'

import { transferModel } from '../../../models'

// TODO: handle this as a network function, for example, base on the
// network config, the action type and logic will be different

// TODO: move this to env
const defaultMemo = 'Withdraw balance for'

export default {
  type: `eosio.evm:withdraw`,
  notified_account: `eosio.evm`,
  apply: async (action: any) => {
    const [amount, symbol] = action.data.quantity.split(' ')

    try {
      await transferModel.queries.save({
        block: action.block,
        transaction_id: action.transaction_id,
        timestamp: action.timestamp,
        from: 'eosio.evm',
        to: action.data.to,
        amount: amount,
        symbol: symbol,
        memo: `${defaultMemo}: ${action.data.to}`,
        quantity: action.data.quantity,
        type: transferModel.interfaces.Type.outgoing
      })
    } catch (error: any) {
      console.error(`error to sync ${action.action}: ${error.message}`)
    }
  }
}
