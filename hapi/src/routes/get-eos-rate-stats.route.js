const Joi = require('joi')

const { eosConfig } = require('../config')
const { axiosUtil } = require('../utils')

module.exports = {
  method: 'POST',
  path: '/get-eos-rate',
  handler: async ({ payload: { input } }) => {
    if (
      !eosConfig.eosRateUrl ||
      !eosConfig.eosRateUser ||
      !eosConfig.eosRatePassword ||
      !input?.bp
    ) {
      return {}
    }

    const buf = Buffer.from(
      `${eosConfig.eosRateUser}:${eosConfig.eosRatePassword}`,
      'utf8'
    )
    const auth = buf.toString('base64')

    const { data } = await axiosUtil.instance.post(
      eosConfig.eosRateUrl,
      { ratesStatsInput: {} },
      {
        headers: { Authorization: `Basic ${auth}` }
      }
    )

    return data?.getRatesStats?.bpsStats?.find(rating => rating?.bp === input?.bp) || {}
  },
  options: {
    validate: {
      payload: Joi.object({
        input: Joi.object({
          bp: Joi.string().required()
        }).required()
      }).options({ stripUnknown: true })
    },
    auth: false
  }
}
