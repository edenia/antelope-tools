const { hasuraUtil, sequelizeUtil, producerUtil } = require('../utils')
const { eosConfig } = require('../config')

const lacchainService = require('./lacchain.service')
const eosioService = require('./eosio.service')

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

const clearNodes = async () => {
  const clearMutation = `
    mutation{
      delete_node(where: {}){
        affected_rows
      }
    }
  `

  await hasuraUtil.request(clearMutation)
}

const updateNodes = async (nodes = []) => {
  await clearNodes()

  const upsertMutation = `
    mutation ($nodes: [node_insert_input!]!) {
      insert_node(objects: $nodes, on_conflict: {constraint: node_pkey,update_columns: [type,full,location,producer_id]}) {
        affected_rows
      }
    }
  `

  await hasuraUtil.request(upsertMutation, { nodes })
}

const updateEndpointInfo = async (endpoint) => {
  if (!endpoint.type || !['api', 'ssl'].includes(endpoint.type)) return

  const updateMutation = `
    mutation ($id: uuid, $head_block_num: Int) {
      update_endpoint(_set: {head_block_num: $head_block_num}, where: {id: {_eq: $id}}) {
        affected_rows
      }
    }
  `

  const endpointInfo = await producerUtil.getNodeInfo(endpoint.value)

  await hasuraUtil.request(updateMutation, {
    id: endpoint.id,
    head_block_num: endpointInfo.head_block_num || 0
  })
}

const syncProducers = async () => {
  let producers = []

  await clearNodes()

  switch (eosConfig.networkName) {
    case eosConfig.knownNetworks.lacchain:
      producers = await lacchainService.getProducers()
      break
    default:
      producers = await eosioService.getProducers()
      break
  }

  producers = await updateProducers(producers)
  await syncNodes(producers)
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
      const endpoints = []
      const types = ['api', 'ssl', 'p2p']

      types.forEach((type) => {
        if (node[type + '_endpoint']) {
          endpoints.push({
            type: type,
            value: node[type + '_endpoint']
          })
        }
      })

      let formatNode = {
        type: Array.isArray(node.node_type) ? node.node_type : [node.node_type],
        full: node.full ?? false,
        location: node.location ?? {},
        producer_id: producer.id
      }

      if (endpoints.length) {
        formatNode.endpoints = {
          data: endpoints
        }
      }

      if (node.features?.length) {
        formatNode.node_info = {
          data: {
            version: node.server_version_string ?? '',
            features: node.features
          }
        }
      }

      return formatNode
    })
  })

  await updateNodes(nodes)
}

const syncEndpoints = async () => {
  const [endpoints] = await sequelizeUtil.query(`
    SELECT 
    	id,
    	type,
      value
    FROM endpoint
    ;
  `)

  if (!endpoints?.length) return

  endpoints.forEach(async (endpoint) => {
    await updateEndpointInfo(endpoint)
  })
}

module.exports = {
  syncProducers,
  syncEndpoints,
  getProducersSummary
}
