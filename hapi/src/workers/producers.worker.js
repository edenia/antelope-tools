const { producerService } = require('../services')
const { workersConfig } = require('../config')

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
  await sleepFor(sleep)
  run(name, action, sleep)
}

const start = async () => {
  await sleepFor(60)
  run(
    'SYNC PRODUCERS',
    producerService.syncProducers,
    workersConfig.syncProducersInterval
  )
  run(
    'SYNC BP JSON',
    producerService.syncBPJson,
    workersConfig.syncBPJsonInterval
  )
  run(
    'SYNC PRODUCER INFO',
    producerService.syncProducersInfo,
    workersConfig.syncProducerInfoInterval
  )
}

module.exports = {
  start
}
