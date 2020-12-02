import { eosConfig } from '../config'
import eosApi from './eosapi'

export const signTransaction = async (ual, transaction) => {
  if (!ual || !ual.activeUser) {
    throw new Error('noActiveUser')
  }

  const actions = []

  if (await isRunActionRequired(ual.activeUser.accountName)) {
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

const isRunActionRequired = async (account) => {
  if (eosConfig.networkName !== 'lacchain') {
    return false
  }

  if (!eosConfig.includeDefaultTransaction) {
    return false
  }

  if (account === 'eosio') {
    return false
  }

  const { rows: entities } = await eosApi.getTableRows({
    json: true,
    code: 'eosio',
    scope: 'eosio',
    table: 'entity'
  })
  const entity = entities.find((entity) => entity.name === account)

  if (entity) {
    return false
  }

  return true
}
