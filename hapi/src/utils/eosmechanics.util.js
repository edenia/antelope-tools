const { eosConfig } = require('../config')

const eosUtil = require('./eos.util')

const transact = async actions => {
  if (eosConfig.eosmechanics.includeTransaction) {
    actions.push(eosConfig.eosmechanics.includeTransaction)
  }

  const transaction = await eosUtil.transact(
    actions,
    eosConfig.eosmechanics.account,
    eosConfig.eosmechanics.password
  )

  await new Promise((resolve) => setTimeout(() => resolve(), 1000))
  const block = await eosUtil.getBlock(transaction.processed.block_num)

  return {
    transaction,
    block
  }
}

const cpu = async () => {
  const actions = []

  actions.push({
    authorization: [
      {
        actor: eosConfig.eosmechanics.account,
        permission: eosConfig.eosmechanics.customPermission
      }
    ],
    account: eosConfig.eosmechanics.account,
    name: 'cpu',
    data: {}
  })

  return await transact(actions)
}

const net = async (input = '') => {
  const actions = []

  actions.push({
    authorization: [
      {
        actor: eosConfig.eosmechanics.account,
        permission: eosConfig.eosmechanics.customPermission
      }
    ],
    account: eosConfig.eosmechanics.account,
    name: 'net',
    data: {
      input
    }
  })

  return await transact(actions)
}

const ram = async () => {
  const actions = []

  actions.push({
    authorization: [
      {
        actor: eosConfig.eosmechanics.account,
        permission: eosConfig.eosmechanics.customPermission
      }
    ],
    account: eosConfig.eosmechanics.account,
    name: 'ram',
    data: {}
  })

  return await transact(actions)
}

module.exports = {
  cpu,
  net,
  ram
}
