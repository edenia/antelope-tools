const { eosConfig } = require('../config')

const eosUtil = require('./eos.util')

const cpu = async () => {
  const actions = []

  if (eosConfig.eosmechanics.includeTransaction) {
    actions.push(eosConfig.eosmechanics.includeTransaction)
  }

  actions.push({
    authorization: [
      {
        actor: eosConfig.eosmechanics.account,
        permission: 'active'
      }
    ],
    account: eosConfig.eosmechanics.account,
    name: 'cpu',
    data: {}
  })

  const transaction = await eosUtil.transact(
    actions,
    eosConfig.eosmechanics.account,
    eosConfig.eosmechanics.password
  )
  const block = await eosUtil.getBlock(transaction.processed.block_num)

  return {
    transaction,
    block
  }
}

const net = async (input = '') => {
  const actions = []

  if (eosConfig.eosmechanics.includeTransaction) {
    actions.push(eosConfig.eosmechanics.includeTransaction)
  }

  actions.push({
    authorization: [
      {
        actor: eosConfig.eosmechanics.account,
        permission: 'active'
      }
    ],
    account: eosConfig.eosmechanics.account,
    name: 'net',
    data: {
      input
    }
  })

  const transaction = await eosUtil.transact(
    actions,
    eosConfig.eosmechanics.account,
    eosConfig.eosmechanics.password
  )
  await new Promise(resolve => setTimeout(() => resolve(), 500))
  const block = await eosUtil.getBlock(transaction.processed.block_num)

  return {
    transaction,
    block
  }
}

const ram = async () => {
  const actions = []

  if (eosConfig.eosmechanics.includeTransaction) {
    actions.push(eosConfig.eosmechanics.includeTransaction)
  }

  actions.push({
    authorization: [
      {
        actor: eosConfig.eosmechanics.account,
        permission: 'active'
      }
    ],
    account: eosConfig.eosmechanics.account,
    name: 'ram',
    data: {}
  })

  const transaction = await eosUtil.transact(
    actions,
    eosConfig.eosmechanics.account,
    eosConfig.eosmechanics.password
  )
  await new Promise(resolve => setTimeout(() => resolve(), 500))
  const block = await eosUtil.getBlock(transaction.processed.block_num)

  return {
    transaction,
    block
  }
}

module.exports = {
  cpu,
  net,
  ram
}
