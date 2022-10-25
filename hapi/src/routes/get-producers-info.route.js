const Joi = require('joi')

const { producerService } = require('../services')

module.exports = {
  method: 'POST',
  path: '/get-producers-info',
  handler: async ({
    payload: {
      input: { bpParams }
    }
  }) => {
    try {
      const producersInfo = await producerService.getProducersInfo(bpParams)

      return producersInfo
    } catch (error) {
      return Boom.badRequest(error.message)
    }
  },
  options: {
    validate: {
      payload: Joi.object({
        input: Joi.object({
          bpParams: Joi.object({
            type: Joi.string().optional(),
            owners: Joi.array().items(Joi.string().required()).optional()
          }).required()
        }).required()
      }).options({ stripUnknown: true })
    },
    auth: false
  }
}
