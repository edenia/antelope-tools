const Boom = require('@hapi/boom')
const Joi = require('joi')

const { eosConfig } = require('../config')
const {
  eosUtil,
  axiosUtil,
  googleRecaptchaEnterpriseUtil,
  getCreateAccountDataUtil
} = require('../utils')

module.exports = {
  method: 'POST',
  path: '/create-faucet-account',
  handler: async ({ payload: { input } }) => {
    try {
      const isValidToken = await googleRecaptchaEnterpriseUtil.isRecaptchaTokenValid(
        input.token
      )

      if (!isValidToken) {
        throw Boom.badRequest('Are you a human?')
      }

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
            name: eosConfig.faucet.createAccountActionName,
            data: getCreateAccountDataUtil.getTransactionData({
              creator: eosConfig.faucet.account,
              key: input.public_key,
              name: input.name ? input.name : undefined
            })
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
          account: input.name || accounts.sort(compare).pop().account_name
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
          token: Joi.string().required(),
          public_key: Joi.string().required(),
          name: Joi.string()
        }).required()
      }).options({ stripUnknown: true })
    },
    auth: false
  }
}
