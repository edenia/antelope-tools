import { networkConfig } from '../../../config'
import { transferModel, defaultModel } from '../../../models'

// TODO: move this to env
const defaultMemo = 'Withdraw balance for'

const applyEosio = async (action: any) => {
  if (action.data.from !== 'eosio.evm') return

  try {
    await transferModel.queries.save({
      block: action.block,
      transaction_id: action.transaction_id,
      timestamp: action.timestamp,
      from: action.data.from,
      to: action.data.to,
      amount: action.data.amount,
      symbol: action.data.symbol,
      memo: action.data.memo,
      quantity: action.data.quantity,
      type: transferModel.interfaces.Type.outgoing
    })
  } catch (error: any) {
    console.error(`error to sync ${action.action}: ${error.message}`)
  }
}

const applyTelos = async (action: any) => {
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

const build = (
  network: defaultModel.AllowedNetworkType = defaultModel.AllowedNetwork.EOSIO
): defaultModel.BuilderListener => {
  const listener = {
    [defaultModel.AllowedNetwork.EOSIO]: {
      type: `eosio.token:transfer,act.data.from=eosio.evm`,
      notified_account: `eosio.evm`,
      apply: applyEosio
    },
    [defaultModel.AllowedNetwork.TELOS]: {
      type: `eosio.evm:withdraw`,
      notified_account: `eosio.evm`,
      apply: applyTelos
    }
  }

  const selectedNetworkListener = listener[network]

  if (!selectedNetworkListener) {
    throw new Error(`network ${network} not supported`)
  }

  return selectedNetworkListener
}

export default build(networkConfig.network)
