const { hasuraUtil, sequelizeUtil } = require('../utils')
const { eosConfig } = require('../config')

const lacchainService = require('./lacchain.service')
const eosioService = require('./eosio.service')
const nodeService = require('./node.service')

const updateProducers = async (producers = []) => {
  const upsertMutation = `
    mutation ($producers: [producer_insert_input!]!) {
      insert_producer(objects: $producers, on_conflict: {constraint: producer_owner_key, update_columns: [bp_json, is_active, total_votes, total_votes_percent, total_votes_eos, vote_rewards, block_rewards, total_rewards, health_status, endpoints, rank]}) {
        affected_rows,
        returning {
          id,
          bp_json
        }
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

  const insertedRows = await hasuraUtil.request(upsertMutation, { producers })

  await hasuraUtil.request(clearMutation, {
    owners: producers.map((producer) => producer.owner)
  })

  return insertedRows.insert_producer.returning
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

  if (producers.length) {
    await nodeService.clearNodes()
    producers = await updateProducers(producers)
    await syncNodes(producers)
    await syncEndpoints()
  }
}

const getProducersSummary = async () => {
  const [rows] = await sequelizeUtil.query(`
    SELECT 
        bp_json->>'type' as type, 
        count(*)::integer as entities_count,
        STRING_AGG (owner, ',') as entities
    FROM producer
    GROUP BY 
        bp_json->>'type'
    ;
`)

  return rows
}

const syncNodes = async (producers) => {
  if (!producers?.length) return

  const nodes = producers.flatMap((producer) => {
    return (producer.bp_json?.nodes || []).map((node) => {
      node.producer_id = producer.id

      return nodeService.getFormatNode(node)
    })
  })

  await nodeService.updateNodes(nodes)
}

const syncEndpoints = async () => {
  const [endpoints] = await sequelizeUtil.query(`
    SELECT 
    	id,
    	type,
      value
    FROM endpoint
    WHERE type IN ('api','ssl')
    ;
  `)

  if (!endpoints?.length) return

  endpoints.forEach(async (endpoint) => {
    await nodeService.updateEndpointInfo(endpoint)
  })
}

const requestProducers = async (where) => {
  const query = `query ($where: producer_bool_exp){
    producer_aggregate(where: $where){
      aggregate {
        count
      }
    }
    producer(order_by: {total_votes_percent: desc},where: $where){
      owner
      rank
      bp_json
      total_votes
      endpoints_list{
        type
        value
        updated_at
        response
      }
    }
  }`

  const { producer_aggregate, producer } = await hasuraUtil.request(
    query,
    where
  )

  return !producer ? [] : [{ ...producer, producer_aggregate }]
}

const getProducersInfo = async (bpParams) => {
  return await requestProducers({
    _and: [
      { bp_json: { _neq: {} } },
      { type: { _eq: bpParams?.type } },
      { owners: { _in: bpParams?.owners } }
    ]
  })
}

module.exports = {
  syncProducers,
  syncEndpoints,
  getProducersSummary,
  getProducersInfo
}
