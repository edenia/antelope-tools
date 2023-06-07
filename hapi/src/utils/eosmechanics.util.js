const { eosConfig } = require('../config')

const eosUtil = require('./eos.util')

const includesTransaction = (block, transactionId) => {
  return block?.transactions.some(trx => trx?.trx?.id === transactionId)
}

const transact = async actions => {
  if (eosConfig.eosmechanics.includeTransaction) {
    actions.push(eosConfig.eosmechanics.includeTransaction)
  }

  const transaction = await eosUtil.transact(
    actions,
    eosConfig.eosmechanics.account,
    eosConfig.eosmechanics.password
  )

  const { id: transactionId, block_num: blockNum } = transaction?.processed
  const maxAttempts = 3
  let currentAttempt = 0
  let block

  await new Promise(resolve => setTimeout(() => resolve(), 1000))

  while (!includesTransaction(block, transactionId) && currentAttempt < maxAttempts) {
    block = await eosUtil.getBlock(blockNum + currentAttempt)
    currentAttempt += 1
  }

  if (!includesTransaction(block, transactionId)) {
    throw new Error(
      'Attempts to find the block in which the transaction was added have been exhausted.'
    )
  }

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
