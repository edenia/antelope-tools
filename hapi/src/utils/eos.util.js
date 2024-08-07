const { Api, JsonRpc } = require('eosjs')
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig')
const fetch = require('node-fetch')
const { TextEncoder, TextDecoder } = require('util')
const EosApi = require('eosjs-api')

const { eosConfig } = require('../config')

const walletUtil = require('./wallet.util')

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()
const rpc = new JsonRpc(eosConfig.apiEndpoint, { fetch })
const eosApi = EosApi({
  httpEndpoint: eosConfig.apiEndpoint,
  verbose: false,
  fetchConfiguration: {}
})
const eosApis = eosConfig.apiEndpoints.map(endpoint => {
  return {
    api: EosApi({
      httpEndpoint: endpoint,
      verbose: false,
      fetchConfiguration: {}
    }),
    lastFailureTime: 0,
    url: endpoint
  }
})
const waitRequestInterval = 300000

const callEosApi = async (funcName, method) => {
  for (const eosApi of eosApis) {
    const diffTime = new Date() - eosApi.lastFailureTime

    if (diffTime < waitRequestInterval) continue

    try {
      const response = await callWithTimeout(method(eosApi.api), 30000)

      return response
    } catch (error) {
      eosApi.lastFailureTime = new Date()

      console.error(
        `WARNING ${funcName} => ${eosApi.url} has failed: \n`,
        error.message
      )
    }
  }

  throw new Error(
    `Each endpoint failed when trying to execute the function ${funcName}`
  )
}

const callWithTimeout = async (promise, ms) => {
  let timeoutID
  const timeoutMessage = `timeout error: the endpoint took more than ${ms} ms to respond`
  const timeoutPromise = new Promise((_resolve, reject) => {
    timeoutID = setTimeout(() => reject(new Error(timeoutMessage)), ms)
  })

  return Promise.race([promise, timeoutPromise])
    .then(response => response)
    .catch(error => {
      throw error
    })
    .finally(() => {
      clearTimeout(timeoutID)
    })
}

const newAccount = async accountName => {
  const password = await walletUtil.create(accountName)
  const key = await walletUtil.createKey(accountName)

  try {
    await walletUtil.unlock(
      eosConfig.baseAccount,
      eosConfig.baseAccountPassword
    )
  } catch (error) {}

  const keys = await walletUtil.listKeys(
    eosConfig.baseAccount,
    eosConfig.baseAccountPassword
  )
  const api = new Api({
    rpc,
    textDecoder,
    textEncoder,
    chainId: eosConfig.chainId,
    signatureProvider: new JsSignatureProvider(keys)
  })
  const authorization = [
    {
      actor: eosConfig.baseAccount,
      permission: 'active'
    }
  ]

  const transaction = await api.transact(
    {
      actions: [
        {
          authorization,
          account: 'eosio',
          name: 'newaccount',
          data: {
            creator: eosConfig.baseAccount,
            name: accountName,
            owner: {
              threshold: 1,
              keys: [
                {
                  key,
                  weight: 1
                }
              ],
              accounts: [],
              waits: []
            },
            active: {
              threshold: 1,
              keys: [
                {
                  key,
                  weight: 1
                }
              ],
              accounts: [],
              waits: []
            }
          }
        },
        {
          authorization,
          account: 'eosio',
          name: 'buyrambytes',
          data: {
            payer: eosConfig.baseAccount,
            receiver: accountName,
            bytes: 4096
          }
        },
        {
          authorization,
          account: 'eosio',
          name: 'delegatebw',
          data: {
            from: eosConfig.baseAccount,
            receiver: accountName,
            stake_net_quantity: '1.0000 EOS',
            stake_cpu_quantity: '1.0000 EOS',
            transfer: false
          }
        }
      ]
    },
    {
      blocksBehind: 3,
      expireSeconds: 30
    }
  )
  await walletUtil.lock(eosConfig.baseAccount)

  return {
    password,
    transaction
  }
}

const generateRandomAccountName = async (prefix = '') => {
  const length = 12

  if (prefix.length === 12) return prefix

  const characters = 'abcdefghijklmnopqrstuvwxyz12345'
  let accountName = prefix

  while (accountName.length < length) {
    accountName = `${accountName}${characters.charAt(
      Math.floor(Math.random() * characters.length)
    )}`
  }

  try {
    const account = await getAccount(accountName)

    return account ? generateRandomAccountName(prefix) : accountName
  } catch (error) {
    return accountName
  }
}

const getAbi = account => eosApi.getAbi(account)

const getAccount = async account => {
  try {
    const accountInfo = await eosApi.getAccount(account)

    return accountInfo
  } catch (error) {
    return null
  }
}

const getBlock = async blockNumber => {
  const block = await eosApi.getBlock(blockNumber)

  return block
}

const getCodeHash = account => eosApi.getCodeHash(account)

const getCurrencyBalance = (code, account, symbol) =>
  eosApi.getCurrencyBalance(code, account, symbol)

const getTableRows = options =>
  callEosApi('getTableRows', async eosApi => eosApi.getTableRows({ json: true, ...options }))

const getProducerSchedule = () => eosApi.getProducerSchedule({})

const transact = async (actions, account, password) => {
  try {
    await walletUtil.unlock(account, password)
  } catch (error) {}

  const keys = await walletUtil.listKeys(account, password)
  const api = new Api({
    rpc,
    textDecoder,
    textEncoder,
    chainId: eosConfig.chainId,
    signatureProvider: new JsSignatureProvider(keys)
  })

  const transaction = await api.transact(
    {
      actions
    },
    {
      blocksBehind: 3,
      expireSeconds: 30
    }
  )

  await walletUtil.lock(account)

  return transaction
}

const getCurrencyStats = async options =>
  callEosApi('getCurrencyStats', async eosApi =>
    eosApi.getCurrencyStats(options)
  )

const getProducers = async options =>
  callEosApi('getProducers', async eosApi => eosApi.getProducers(options))

const getInfo = options => eosApi.getInfo(options || {})

module.exports = {
  callWithTimeout,
  newAccount,
  generateRandomAccountName,
  getAccount,
  getBlock,
  getAbi,
  getCodeHash,
  getCurrencyBalance,
  getTableRows,
  transact,
  getProducerSchedule,
  getCurrencyStats,
  getProducers,
  getInfo
}
