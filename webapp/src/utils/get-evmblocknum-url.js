import { evmConfig } from '../config'

export const getEVMBlockNumUrl = blockNum => {
  if (!blockNum || !evmConfig.blockExplorerUrl) {
    return
  }

  return evmConfig.blockExplorerUrl.replace('(block)', blockNum)
}

export default getEVMBlockNumUrl
