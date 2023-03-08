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
      const isValidToken =
        await googleRecaptchaEnterpriseUtil.isRecaptchaTokenValid(input.token)

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
        data: { account_name: account, permissions }
      } = await axiosUtil.instance.post(
        `${eosConfig.apiEndpoint}/v1/chain/get_account`,
        {
          account_name: input.name
        }
      )

      const keys = permissions[0]?.required_auth?.keys || []
      const key = keys[0]?.key

      if (account === input.name && key === input.public_key) {
        return { account }
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
