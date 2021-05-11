const Joi = require('joi')

const { cpuService } = require('../services')

module.exports = {
  method: 'POST',
  path: '/cpu-benchmark',
  handler: ({ payload: { input } }) => cpuService.getBenchmark(input.range),
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
