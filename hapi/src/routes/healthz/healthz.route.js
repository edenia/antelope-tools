const healthzHandler = require('./healthz.handler')

module.exports = {
  method: 'GET',
  path: '/healthz',
  handler: healthzHandler
}
