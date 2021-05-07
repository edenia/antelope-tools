const Joi = require('joi')

const { missedBlocksService } = require('../services')

module.exports = {
  method: 'POST',
  path: '/missed-blocks',
  handler: ({ payload: { input } }) =>
    missedBlocksService.getMissedBlocks(input.range),
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
