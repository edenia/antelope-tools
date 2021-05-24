const { hasuraUtil } = require('../utils')
const { eosConfig } = require('../config')

const lacchainService = require('./lacchain.service')
const eosioService = require('./eosio.service')

const updateProducers = async (producers = []) => {
  const upsertMutation = `
    mutation ($producers: [producer_insert_input!]!) {
      insert_producer(objects: $producers, on_conflict: {constraint: producer_owner_key, update_columns: [bp_json, total_votes, producer_key, is_active, url, unpaid_blocks, last_claim_time, location, producer_authority, total_votes_percent, total_votes_eos, vote_rewards, block_rewards, total_rewards, health_status, endpoints]}) {
        affected_rows
      }
    }
  `
  const clearMutation = `
    mutation ($owners: [String!]) {
      delete_producer(where: {owner: {_nin: $owners}}) {
        affected_rows
      }
    }
  `

  await hasuraUtil.request(upsertMutation, { producers })
  await hasuraUtil.request(clearMutation, {
    owners: producers.map(producer => producer.owner)
  })
}

const syncProducers = async () => {
  let producers = []

  switch (eosConfig.networkName) {
    case eosConfig.knownNetworks.lacchain:
      producers = await lacchainService.getProducers()
      break
    default:
      producers = await eosioService.getProducers()
      break
  }

  await updateProducers(producers)
}

module.exports = {
  syncProducers
}
