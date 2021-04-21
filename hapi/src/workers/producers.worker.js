const {
  producerService,
  settingService,
  stateHistoryPluginService,
  statsService
} = require('../services')
const { workersConfig, hasuraConfig } = require('../config')
const { axiosUtil } = require('../utils')

const sleepFor = seconds => {
  return new Promise(resolve => {
    setTimeout(() => resolve(), seconds * 1000)
  })
}

const run = async (name, action, sleep) => {
  console.log(`[WORKER ${name}] started at `, new Date().getTime())
  try {
    await action()
  } catch (error) {}
  console.log(`[WORKER ${name}] finished at `, new Date().getTime())

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
  if (workersConfig.syncProducerCpuInterval > 0) {
    run(
      'SYNC CPU USAGE',
      producerService.syncCpuUsage,
      workersConfig.syncProducerCpuInterval
    )
  }
  run('CHECK FOR MISSED BLOCK', producerService.checkForMissedBlocks)
  run('SYNC STATS', statsService.sync, workersConfig.syncStatsInterval)
  stateHistoryPluginService.init()
}

module.exports = {
  start
}
