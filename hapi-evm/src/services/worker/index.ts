import { timeUtil, coreUtil } from '../../utils'
import { defaultModel } from '../../models'
import blockService from '../block.service'
import transferService from '../transfer.service'
import hyperionService from '../hyperion'

const run = async (worker: defaultModel.Worker) => {
  try {
    await worker.action()
  } catch (error: any) {
    console.log(`${worker.name} ERROR =>`, error?.message || error)
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
  run(blockService.syncOldBlockWorker())
  run(blockService.syncATHWorker())
  run(blockService.cleanOldBlocksWorker())
  run(transferService.cleanOldTransfersWorker())
  run(hyperionService.syncWorker())
}

export default {
  init
}
