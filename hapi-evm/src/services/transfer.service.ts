import { defaultModel, transferModel } from '../models'
import { networkConfig } from '../config'

const cleanOldTransfersWorker = (): defaultModel.Worker => {
  return {
    name: 'CLEAN UP OLD TRANSFER WORKER',
    intervalSec: networkConfig.cleanOldTransferIntervalSec,
    action: async () => {
      await transferModel.queries.deleteOldTransfers()
    }
  }
}

export default {
  cleanOldTransfersWorker
}
