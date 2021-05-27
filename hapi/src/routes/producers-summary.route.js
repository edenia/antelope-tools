const { producerService } = require('../services')

module.exports = {
  method: 'POST',
  path: '/producers-summary',
  handler: () => producerService.getProducersSummary(),
  options: {
    auth: false
  }
}
