const { hasuraUtil, sequelizeUtil } = require('../utils')
const { eosConfig } = require('../config')

const lacchainService = require('./lacchain.service')
const eosioService = require('./eosio.service')
const nodeService = require('./node.service')
const statsService = require('./stats.service')

const updateProducers = async (producers = []) => {
  const upsertMutation = `
    mutation ($producers: [producer_insert_input!]!) {
      insert_producer(objects: $producers, on_conflict: {constraint: producer_owner_key, update_columns: [ producer_key, unpaid_blocks,last_claim_time, url, location, producer_authority,bp_json, is_active, total_votes, total_votes_percent, total_votes_eos, vote_rewards,block_rewards, total_rewards, health_status, endpoints, rank]}) {
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

  if (producers?.length) {
    await nodeService.clearNodes()
    producers = await updateProducers(producers)
    await syncNodes(producers)
    await syncEndpoints()

    if (!eosConfig.stateHistoryPluginEndpoint) {
      await statsService.sync()
    }
      
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

const syncNodes = async producers => {
  if (!producers?.length) return

  let nodes = producers.flatMap((producer) => {
    return (producer.bp_json?.nodes || []).map((node) => {
      node.producer_id = producer.id

      return nodeService.getFormatNode(node)
    })
  })

  nodes = await nodeService.updateNodes(nodes)
  await nodeService.updateNodesInfo(nodes)
}

const syncEndpoints = async () => {
  const query = `
    query {
      endpoints: endpoint (where: {type: {_in: ["api","ssl"]}}) {
        id,
        type,
        value
      }
    }
  `
  const { endpoints } = await hasuraUtil.request(query)

  if (!endpoints?.length) return

  endpoints.forEach(async endpoint => {
    await nodeService.updateEndpointInfo(endpoint)
  })
}

const requestProducers = async ({ where, whereEndpointList }) => {
  const query = `
    query ($where: producer_bool_exp, $whereEndpointList: endpoints_by_producer_id_bool_exp) {
      producer_aggregate (where: {bp_json: {_neq: {} }}){
        aggregate {
          count
        }
      }
      producers: producer (where: $where, order_by: {total_votes_percent: desc}) {
        owner
        rank
        bp_json
        total_votes
        endpoints: endpoints_list (where: $whereEndpointList) {
          type
          link: value
          updated_at
          response
        }
      }
    }
  `

  const {
    producer_aggregate: { aggregate },
    producers
  } = await hasuraUtil.request(query, { where, whereEndpointList })

  return !producers ? {} : { producers, total: aggregate.count }
}

const getProducersInfo = async bpParams => {
  const whereCondition = {
    where: {
      _and: [{ bp_json: { _neq: {} } }, { owner: { _in: bpParams?.owners } }]
    }
  }

  if (bpParams.type) {
    whereCondition.where._and.push({
      endpoints_list: { type: { _eq: bpParams?.type } }
    })
    whereCondition.whereEndpointList = { type: { _eq: bpParams?.type } }
  }

  return await requestProducers(whereCondition)
}

module.exports = {
  syncProducers,
  syncEndpoints,
  getProducersSummary,
  getProducersInfo
}
