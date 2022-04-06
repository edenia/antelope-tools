const Boom = require('@hapi/boom')
const Joi = require('joi')

const { eosConfig } = require('../config')
const { eosUtil, axiosUtil } = require('../utils')

module.exports = {
  method: 'POST',
  path: '/create-faucet-account',
  handler: async ({ payload: { input } }) => {
    try {
      await eosUtil.transact(
        [
          {
            authorization: [
              {
                actor: eosConfig.faucet.account,
                permission: 'active'
              }
            ],
            account: 'eosio',
            name: 'newnonebact',
            data: {
              creator: eosConfig.faucet.account,
              owner: {
                threshold: 1,
                keys: [
                  {
                    key: input.public_key,
                    weight: 1
                  }
                ],
                accounts: [],
                waits: []
              },
              active: {
                threshold: 1,
                keys: [
                  {
                    key: input.public_key,
                    weight: 1
                  }
                ],
                accounts: [],
                waits: []
              },
              max_payment: '500.00000000 UOS'
            }
          }
        ],
        eosConfig.faucet.account,
        eosConfig.faucet.password
      )

      const {
        data: { accounts }
      } = await axiosUtil.instance.post(
        `${eosConfig.apiEndpoint}/v1/chain/get_accounts_by_authorizers`,
        {
          keys: [input.public_key]
        }
      )

      const compare = ({ account_name: a }, { account_name: b }) => {
        if (a < b) return -1
        if (a > b) return 1
        return 0
      }

      if (accounts.length) {
        return {
          account: accounts.sort(compare).pop().account_name
        }
      }

      return Boom.badData('Wrong key format')
    } catch (err) {
      throw Boom.badRequest(err.message)
    }
  },
  options: {
    validate: {
      payload: Joi.object({
        input: Joi.object({
          public_key: Joi.string().required()
        }).required()
      }).options({ stripUnknown: true })
    },
    auth: false
  }
}
