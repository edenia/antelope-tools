import EosApi from 'eosjs-api'

import { eosConfig } from '../config'

export const ENDPOINTS_ERROR =
  'Each endpoint failed when trying to execute the function'

const waitRequestInterval = 120000
const timeout = 60000
const eosApis = eosConfig.endpoints.map(endpoint => {
  return {
    api: EosApi({
      httpEndpoint: endpoint,
      verbose: false,
      fetchConfiguration: {},
    }),
    endpoint,
    lastFailureTime: 0,
  }
})

const callEosApi = async method => {
  for (const eosApi of eosApis) {
    const diffTime = new Date() - eosApi.lastFailureTime

    if (diffTime < waitRequestInterval) continue

    try {
      const response = await callWithTimeout(method(eosApi.api), timeout)
      const headBlockTime = response.head_block_time

      if (headBlockTime) {
        const diffBlockTimems = new Date() - new Date(headBlockTime)

        if (diffBlockTimems > eosConfig.syncToleranceInterval) {
          throw new Error(`The endpoint ${eosApi.endpoint} is outdated`)
        }
      }

      return response
    } catch (error) {
      let apiError

      try {
        apiError = JSON.parse(error?.message)
      } catch (error) {}

      if (apiError?.error) throw error

      eosApi.lastFailureTime = new Date()
    }
  }

  throw new Error(ENDPOINTS_ERROR)
}

const callWithTimeout = async (promise, ms) => {
  let timeoutID
  const timeoutMessage = `timeout error: the endpoint took more than ${ms} ms to respond`
  const timeoutPromise = new Promise((_resolve, reject) => {
    timeoutID = setTimeout(() => reject(new Error(timeoutMessage)), ms)
  })

  return Promise.race([promise, timeoutPromise])
    .then(response => {
      return response
    })
    .catch(error => {
      throw error
    })
    .finally(() => {
      clearTimeout(timeoutID)
    })
}

const getAbi = async account => {
  return await callEosApi(async eosApi => eosApi.getAbi(account))
}

const getAccount = async account => {
  return await callEosApi(async eosApi => eosApi.getAccount(account))
}

const getBlock = async block => {
  return await callEosApi(async eosApi => eosApi.getBlock(block))
}

const getCodeHash = async account => {
  return await callEosApi(async eosApi => eosApi.getCodeHash(account))
}

const getInfo = async payload => {
  return await callEosApi(async eosApi => eosApi.getInfo(payload))
}

const getProducerSchedule = async payload => {
  return await callEosApi(async eosApi => eosApi.getProducerSchedule(payload))
}

const getTableRows = async payload => {
  return await callEosApi(async eosApi => eosApi.getTableRows(payload))
}

export default {
  getAbi,
  getAccount,
  getBlock,
  getCodeHash,
  getInfo,
  getProducerSchedule,
  getTableRows,
}
