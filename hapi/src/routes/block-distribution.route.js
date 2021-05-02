const Joi = require('joi')

const { statsService } = require('../services')

module.exports = {
  method: 'POST',
  path: '/block-distribution',
  handler: ({ payload: { input } }) =>
    statsService.getBlockDistribution(input.range),
  options: {
    validate: {
      payload: Joi.object({
        input: Joi.object({
          range: Joi.string().required()
        }).required()
      }).options({ stripUnknown: true })
    },
    auth: false
  }
}
