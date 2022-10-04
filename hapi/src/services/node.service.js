const { hasuraUtil, producerUtil } = require('../utils')

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

const getNodeEnpoints = (node) => {
  const types = ['api_endpoint', 'ssl_endpoint', 'p2p_endpoint']

  return types.flatMap((type) => {
    return node[type]
      ? {
          type: type,
          value: node[type]
        }
      : []
  })
}

const getFormatNode = (node) => {
  let formatNode = {
    type: Array.isArray(node.node_type) ? node.node_type : [node.node_type],
    full: node.full ?? false,
    location: node.location ?? {},
    producer_id: node.producer_id
  }

  const endpoints = getNodeEnpoints(node)
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
}

module.exports = {
  clearNodes,
  updateNodes,
  updateEndpointInfo,
  getFormatNode
}
