const {
  cpuService,
  missedBlocksService,
  producerService,
  settingService,
  stateHistoryPluginService,
  statsService,
  demuxService
} = require('../services')
const { workersConfig, hasuraConfig, eosConfig } = require('../config')
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
    'SYNC ENDPOINTS',
    producerService.syncEndpoints,
    workersConfig.syncProducersInterval / 120
  )
  run(
    'SYNC EXCHANGE RATE',
    settingService.syncEOSPrice,
    workersConfig.syncExchangeRate
  )

  if (eosConfig.eosmechanics.account && eosConfig.eosmechanics.password) {
    run('CPU WORKER', cpuService.worker, workersConfig.cpuWorkerInterval)
    run('CPU WORKER CLEANUP', cpuService.cleanOldBenchmarks, 86400)
  }
  
  if (eosConfig.stateHistoryPluginEndpoint) {
    run('BLOCK HISTORY CLEANUP', stateHistoryPluginService.cleanOldBlocks, 43200)
    run('SYNC BLOCK HISTORY', stateHistoryPluginService.init)

    if (eosConfig.missedBlocksServiceEnabled) {
      run('SYNC MISSED BLOCKS', missedBlocksService.syncMissedBlocks)
      run('SYNC MISSED BLOCKS PER PRODUCER', statsService.getCurrentMissedBlock)
      run('SYNC SCHEDULE HISTORY', missedBlocksService.syncCurrentSchedule, 60)
    }

    run('SYNC TPS', statsService.syncTPSAllTimeHigh)
    run(
      'SYNC TRANSACTIONS INFO',
      statsService.syncTransactionsInfo,
      workersConfig.syncStatsInterval
    )
  }
}

module.exports = {
  start
}
