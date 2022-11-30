const Boom = require('@hapi/boom')
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
      
      return { producersInfo }
    } catch (error) {
      return Boom.badRequest(error.message)
    }
  },
  options: {
    validate: {
      payload: Joi.object({
        input: Joi.object({
          bpParams: Joi.object({
            type: Joi.string().valid('api', 'ssl', 'p2p').optional(),
            owners: Joi.array().items(Joi.string().required()).max(150).optional()
          }).required()
        }).required()
      }).options({ stripUnknown: true })
    },
    auth: false
  }
}
