const Joi = require('joi')

const { transactionsService } = require('../services')

module.exports = {
  method: 'POST',
  path: '/transactions',
  handler: ({ payload: { input } }) =>
    transactionsService.getTransactions(input.range),
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
