const { eosConfig } = require('../config')

const eosUtil = require('./eos.util')

const cpu = async () => {
  try {
    const transaction = await eosUtil.transact(
      [
        {
          authorization: [
            {
              actor: eosConfig.eosmechanics.account,
              permission: 'active'
            }
          ],
          account: eosConfig.eosmechanics.account,
          name: 'cpu',
          data: {}
        }
      ],
      eosConfig.eosmechanics.account,
      eosConfig.eosmechanics.password
    )
    const block = await eosUtil.getBlock(transaction.processed.block_num)

    return {
      transaction,
      block
    }
  } catch (error) {
    console.log('error', error)
  }
}
const net = async (input = '') => {
  try {
    const transaction = await eosUtil.transact(
      [
        {
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
        }
      ],
      eosConfig.eosmechanics.account,
      eosConfig.eosmechanics.password
    )
    const block = await eosUtil.getBlock(transaction.processed.block_num)

    return {
      transaction,
      block
    }
  } catch (error) {
    console.log('error', error)
  }
}
const ram = async () => {
  try {
    const transaction = await eosUtil.transact(
      [
        {
          authorization: [
            {
              actor: eosConfig.eosmechanics.account,
              permission: 'active'
            }
          ],
          account: eosConfig.eosmechanics.account,
          name: 'ram',
          data: {}
        }
      ],
      eosConfig.eosmechanics.account,
      eosConfig.eosmechanics.password
    )
    const block = await eosUtil.getBlock(transaction.processed.block_num)

    return {
      transaction,
      block
    }
  } catch (error) {
    console.log('error', error)
  }
}

module.exports = {
  cpu,
  net,
  ram
}
