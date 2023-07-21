import { timeUtil, coreUtil } from '../../utils'
import { defaultModel } from '../../models'
import blockService from '../block.service'

const run = async (worker: defaultModel.Worker) => {
  try {
    await worker.action()
  } catch (error: any) {
    console.log(`${name} ERROR =>`, error.message)
  }

  if (!worker.intervalSec) {
    return
  }

  await timeUtil.sleep(worker.intervalSec)
  run(worker)
}

const init = async () => {
  await coreUtil.hasura.hasuraAssembled()

  run(blockService.syncBlockWorker())
}

export default {
  init
}
