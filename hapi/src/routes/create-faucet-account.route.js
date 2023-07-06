const Boom = require('@hapi/boom')
const Joi = require('joi')

const { eosConfig } = require('../config')
const {
  eosUtil,
  axiosUtil,
  googleRecaptchaEnterpriseUtil,
  getCreateAccountDataUtil,
  sleepFor
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

      const transaction = await eosUtil.transact(
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

      await sleepFor(1)

      const {
        data: { accounts }
      } = await axiosUtil.instance.post(
        `${eosConfig.apiEndpoint}/v1/chain/get_accounts_by_authorizers`,
        {
          keys: [input.public_key]
        }
      )

      if (!input.name) {
        input.name = transaction?.processed?.action_traces[0]?.act?.data?.name
      }

      const newAccount = accounts.find(
        account => account.account_name === input.name || !input.name
      )

      if (!newAccount) throw new Error('Account creation failed')

      return { account: newAccount.account_name }
    } catch (err) {
      const errorDetail =
        err?.response?.data?.error?.details[0]?.message?.substring(0, 11)

      return 'unknown key' === errorDetail
        ? Boom.badRequest('Account creation failed')
        : Boom.badRequest(err.message)
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
