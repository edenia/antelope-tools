const Boom = require('@hapi/boom')
const Joi = require('joi')

const { eosConfig } = require('../config')
const { eosUtil, googleRecaptchaEnterpriseUtil } = require('../utils')

module.exports = {
  method: 'POST',
  path: '/transfer-faucet-tokens',
  handler: async ({ payload: { input } }) => {
    try {
      const isValidToken = await googleRecaptchaEnterpriseUtil.isRecaptchaTokenValid(
        input.token
      )

      if (!isValidToken) {
        throw Boom.badRequest('Are you a human?')
      }

      const actor = eosConfig.faucet.getFaucetAccount
        ? eosConfig.faucet.getFaucetAccount
        : eosConfig.faucet.account

      const { transaction_id: transactionId } = await eosUtil.transact(
        [
          {
            authorization: [
              {
                actor: eosConfig.faucet.account,
                permission: 'active'
              }
            ],
            account: actor,
            name: 'givetokens',
            data: { faucet: eosConfig.faucet.account, to: input.to }
          }
        ],
        eosConfig.faucet.account,
        eosConfig.faucet.password
      )
      return {
        tx: transactionId
      }
    } catch (err) {
      throw Boom.badRequest(err.message)
    }
  },
  options: {
    validate: {
      payload: Joi.object({
        input: Joi.object({
          token: Joi.string().required(),
          to: Joi.string().required()
        }).required()
      }).options({ stripUnknown: true })
    },
    auth: false
  }
}
