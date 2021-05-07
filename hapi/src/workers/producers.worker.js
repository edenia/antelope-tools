const {
  missedBlocksService,
  producerService,
  settingService,
  stateHistoryPluginService,
  statsService
} = require('../services')
const { workersConfig, hasuraConfig } = require('../config')
const { axiosUtil, sleepFor } = require('../utils')

const run = async (name, action, sleep) => {
  try {
    await action()
  } catch (error) {
    console.log(`${name} ERROR =>`, error.message)
  }

  if (!sleep) {
    return
  }

  await sleepFor(sleep)
  run(name, action, sleep)
}

const start = async () => {
  let hasuraReady = false

  while (!hasuraReady) {
    try {
      await axiosUtil.instance.get(
        hasuraConfig.url.replace('/v1/graphql', '/healthz')
      )
      hasuraReady = true
    } catch (error) {
      hasuraReady = false
      console.log(
        'waiting for hasura...',
        hasuraConfig.url.replace('/v1/graphql', '/healthz')
      )
      await sleepFor(3)
    }
  }

  run(
    'SYNC PRODUCERS',
    producerService.syncProducers,
    workersConfig.syncProducersInterval
  )
  run(
    'SYNC EXCHANGE RATE',
    settingService.syncEOSPrice,
    workersConfig.syncExchangeRate
  )
  run(
    'SYNC PRODUCER INFO',
    producerService.syncProducersInfo,
    workersConfig.syncProducerInfoInterval
  )
  run(
    'SYNC CPU USAGE',
    producerService.syncCpuUsage,
    workersConfig.syncProducerCpuInterval
  )
  run('SYNC STATS INFO', statsService.sync, workersConfig.syncStatsInterval)
  run('SYNC BLOCK HISTORY', stateHistoryPluginService.init)
  run(
    'SYNC SCHEDULE HISTORY',
    missedBlocksService.syncScheduleHistory,
    workersConfig.syncScheduleHistoryInterval
  )
  run('SYNC MISSED BLOCKS', missedBlocksService.syncMissedBlocks)
}

module.exports = {
  start
}
