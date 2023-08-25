import { eosConfig, generalConfig } from '../config'

const { healthLights } = generalConfig

const isSynchronized = endpoint => {
  const diffBlockTimems =
    new Date(endpoint.updated_at) - new Date(endpoint.head_block_time)

  return diffBlockTimems <= eosConfig.syncToleranceInterval
}

export const getStatus = endpoint => {
  if (endpoint.response.status === undefined) return

  if (endpoint.response?.isWorking) {
    return !endpoint.head_block_time || isSynchronized(endpoint)
      ? healthLights.greenLight
      : healthLights.timerOff
  }

  switch (Math.floor(endpoint.response?.status / 100)) {
    case 4:
    case 5:
      return healthLights.yellowLight
    default:
      return healthLights.redLight
  }
}
