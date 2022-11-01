import EosApi from 'eosjs-api'

import { eosConfig } from '../config'

const eosApis = eosConfig.endpoints.map((endpoint) => {
  return EosApi({
    httpEndpoint: endpoint,
    verbose: false,
    fetchConfiguration: {},
  })
})

const callEosApi = async (method) => {
  for (let i = 0; i < eosApis.length; i++) {
    try {
      const response = await method(eosApis[i])

      return response
    } catch (error) {}
  }

  throw new Error('Each endpoint failed when trying to execute the function')
}

const getAbi = async (account) => {
  return await callEosApi(async (eosApi) => eosApi.getAbi(account))
}

const getAccount = async (account) => {
  return await callEosApi(async (eosApi) => eosApi.getAccount(account))
}

const getBlock = async (block) => {
  return await callEosApi(async (eosApi) => eosApi.getBlock(block))
}

const getCodeHash = async (account) => {
  return await callEosApi(async (eosApi) => eosApi.getCodeHash(account))
}

const getInfo = async (payload) => {
  return await callEosApi(async (eosApi) => eosApi.getInfo(payload))
}

const getProducerSchedule = async (payload) => {
  return await callEosApi(async (eosApi) => eosApi.getProducerSchedule(payload))
}

const getTableRows = async (payload) => {
  return await callEosApi(async (eosApi) => eosApi.getTableRows(payload))
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
