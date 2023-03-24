const cpuService = require('./cpu.service')
const missedBlocksService = require('./missed-blocks.service')
const producerService = require('./producer.service')
const nodeService = require('./node.service')
const healthCheckHistoryService = require('./health-check-history.service')
const settingService = require('./setting.service')
const stateHistoryPluginService = require('./state-history-plugin.service')
const statsService = require('./stats.service')
const transactionsService = require('./transactions.service')
const demuxService = require('./demux')
const demuxStateService = require('./demux-state.service')

module.exports = {
  cpuService,
  missedBlocksService,
  producerService,
  nodeService,
  healthCheckHistoryService,
  settingService,
  stateHistoryPluginService,
  statsService,
  transactionsService,
  demuxService,
  demuxStateService
}
