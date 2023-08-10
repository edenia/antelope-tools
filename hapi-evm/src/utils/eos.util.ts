import { Api, JsonRpc } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import fetch from 'node-fetch'
import EosApi from 'eosjs-api'

import { eosConfig } from '../config'

import walletUtil from './wallet.util'

const rpc = new JsonRpc(eosConfig.endpoint, { fetch })
const eosApi = EosApi({
  httpEndpoint: eosConfig.endpoint,
  verbose: false,
  fetchConfiguration: {}
})

const newAccount = async (accountName: string) => {
  const password = await walletUtil.create(accountName)
  const key = await walletUtil.createKey(accountName)

  try {
    await walletUtil.unlock(
      eosConfig.baseAccount,
      eosConfig.baseAccountPassword
    )
  } catch (error) {
    console.log('Wallet already unlocked')
  }

  const keys = await walletUtil.listKeys(
    eosConfig.baseAccount,
    eosConfig.baseAccountPassword
  )
  const api = new Api({
    rpc,
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

const generateRandomAccountName = async (prefix = ''): Promise<string> => {
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

const getAbi = (account: string) => eosApi.getAbi(account)

const getAccount = async (account: string) => {
  try {
    const accountInfo = await eosApi.getAccount(account)

    return accountInfo
  } catch (error) {
    return null
  }
}

const getBlock = async (blockNumber: number) => {
  try {
    const block = await eosApi.getBlock(blockNumber)

    return block
  } catch (error) {
    return null
  }
}

const getCodeHash = (account: string) => eosApi.getCodeHash(account)

const getCurrencyBalance = (code: string, account: string, symbol: string) =>
  eosApi.getCurrencyBalance(code, account, symbol)

const getTableRows = (options: any) =>
  eosApi.getTableRows({ json: true, ...options })

const transact = async (actions: any, auths: any) => {
  try {
    const keys = []

    for (let index = 0; index < auths.length; index++) {
      const auth = auths[index]
      try {
        await walletUtil.unlock(auth.account, auth.password)
      } catch (error) {
        console.log('Wallet already unlocked')
      }

      try {
        keys.push(...(await walletUtil.listKeys(auth.account, auth.password)))
      } catch (error) {
        console.log('Key already exists')
      }
    }

    const api = new Api({
      rpc,
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

    for (let index = 0; index < auths.length; index++) {
      try {
        const auth = auths[index]
        await walletUtil.lock(auth.account)
      } catch (error) {
        console.log('Wallet already locked')
      }
    }

    return transaction
  } catch (error: any) {
    throw new Error(
      error.message.replace(/assertion failure with message: /gi, '')
    )
  }
}

export default {
  newAccount,
  generateRandomAccountName,
  getAccount,
  getBlock,
  getAbi,
  getCodeHash,
  getCurrencyBalance,
  getTableRows,
  transact
}
