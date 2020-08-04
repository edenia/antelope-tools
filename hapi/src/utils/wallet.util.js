const fetch = require('node-fetch')

const { eosConfig } = require('../config')

const post = async (endpoint, body) => {
  const res = await fetch(`${eosConfig.walletUrl}/v1/wallet${endpoint}`, {
    body,
    method: 'POST'
  })
  const data = await res.json()

  if (data.code) {
    throw new Error(`${data.error.name}: ${data.error.what}`)
  }

  return data
}

const create = async walletName => post('/create', `"${walletName}"`)

const createKey = async walletName =>
  post('/create_key', `["${walletName}",""]`)

// TODO: implement  get_public_keys
// TODO: implement  import_key

const listKeys = async (walletName, walletPassword) => {
  const keys = await post('/list_keys', `["${walletName}","${walletPassword}"]`)

  if (keys.length > 0) {
    return keys.map(keypair => keypair[1])
  }

  return []
}

const listWallets = async () => post('/list_wallets')

const lock = async walletName => post('/lock', `"${walletName}"`)

const lockAll = async () => post('/lock_all', {})

// TODO: implement  open
// TODO: implement  remove_key
// TODO: implement  set_timeout
// TODO: implement  sign_digest
// TODO: implement  sign_transaction

const unlock = async (walletName, walletPassword) =>
  post('/unlock', `["${walletName}","${walletPassword}"]`)

module.exports = {
  create,
  createKey,
  listKeys,
  listWallets,
  lock,
  lockAll,
  unlock
}
