import { eosConfig } from '../config'

export const signTransaction = (ual, transaction) => {
  if (!ual || !ual.activeUser) {
    throw new Error('noActiveUser')
  }

  const actions = []

  if (
    ual.activeUser.accountName !== 'eosio' &&
    eosConfig.includeDefaultTransaction
  ) {
    actions.push(eosConfig.includeDefaultTransaction)
  }

  actions.push(transaction)

  return ual.activeUser.signTransaction(
    {
      actions
    },
    {
      broadcast: true
    }
  )
}
