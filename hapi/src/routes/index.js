const healthzRoute = require('./healthz/healthz.route')
const blockDistributionRoute = require('./block-distribution.route')

module.exports = [healthzRoute, blockDistributionRoute]
