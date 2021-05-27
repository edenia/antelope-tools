const healthzRoute = require('./healthz/healthz.route')
const blockDistributionRoute = require('./block-distribution.route')
const cpuBenchmarkRoute = require('./cpu-benchmark.route')
const missedBlocksRoute = require('./missed-blocks.route')
const producersSummaryRoute = require('./producers-summary.route')
const transactionsRoute = require('./transactions.route')

module.exports = [
  healthzRoute,
  blockDistributionRoute,
  cpuBenchmarkRoute,
  missedBlocksRoute,
  producersSummaryRoute,
  transactionsRoute
]
