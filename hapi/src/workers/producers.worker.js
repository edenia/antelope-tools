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
  console.log('waiting...')
  await sleepFor(300)
  console.log('ready')
  run(
    'SYNC PRODUCERS',
    producerService.syncProducers,
    workersConfig.syncProducersInterval
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
