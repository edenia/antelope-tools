import { defaultModel, transferModel } from '../models'

const cleanOldTransfersWorker = (): defaultModel.Worker => {
  return {
    name: 'CLEAN UP OLD TRANSFER WORKER',
    intervalSec: 86400,
    action: async () => {
      await transferModel.queries.deleteOldTransfers()
    }
  }
}

export default {
  cleanOldTransfersWorker
}
