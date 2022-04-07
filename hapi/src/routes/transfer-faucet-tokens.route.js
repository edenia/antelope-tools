const Boom = require('@hapi/boom')
const Joi = require('joi')

const { eosConfig } = require('../config')
const { eosUtil, axiosUtil } = require('../utils')

module.exports = {
  method: 'POST',
  path: '/transfer-faucet-tokens',
  handler: async ({ payload: { input } }) => {
    // VALIDATE TOKEN
    try {
      const transaction = await eosUtil.transact(
        [
          {
            authorization: [
              {
                actor: eosConfig.faucet.account,
                permission: 'active'
              }
            ],
            account: eosConfig.faucet.account,
            name: 'givetokens',
            data: { faucet: input.faucet, to: input.to }
          }
        ],
        eosConfig.faucet.account,
        eosConfig.faucet.password
      )

      console.log('TRANSACTION', transaction)

      return {
        tx: ''
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
          faucet: Joi.string().required(),
          to: Joi.string().required()
        }).required()
      }).options({ stripUnknown: true })
    },
    auth: false
  }
}
