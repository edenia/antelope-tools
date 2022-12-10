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
  const upsertMutation = `
    mutation ($nodes: [node_insert_input!]!) {
      insert_node(objects: $nodes, on_conflict: {constraint: node_pkey,update_columns: [type,full,location,producer_id]}) {
        affected_rows,
        returning {
          id
          type
          node_info{
            id
            node_id
            version
            features
          }
          endpoints{
            type
            value
          }
        }
      }
    }
  `

  await clearNodes()
  const insertedRows = await hasuraUtil.request(upsertMutation, { nodes })

  return insertedRows.insert_node.returning
}

const updateEndpointInfo = async endpoint => {
  if (!endpoint.type || !['api', 'ssl'].includes(endpoint.type)) return

  const updateMutation = `
    mutation ($id: uuid, $head_block_time: timestamptz, $response: jsonb, $updated_at: timestamptz,) {
      update_endpoint(_set: {head_block_time: $head_block_time, response: $response, updated_at: $updated_at}, where: {id: {_eq: $id}}) {
        affected_rows
      }
    }
  `

  const { nodeInfo, ...response } = await producerUtil.getNodeInfo(
    endpoint.value
  )

  await hasuraUtil.request(updateMutation, {
    id: endpoint.id,
    response,
    head_block_time: nodeInfo?.head_block_time || null,
    updated_at: new Date()
  })
}

const updateNodeInfo = async nodes => {
  const upsertMutation = `
    mutation ($nodes: [node_info_insert_input!]!) {
      insert_node_info(objects: $nodes, on_conflict: {constraint: node_info_node_id_key,update_columns: [features,version]}) {
        affected_rows
      }
    }
  `

  await hasuraUtil.request(upsertMutation, { nodes })
}

const getNodeEnpoints = node => {
  const types = ['api', 'ssl', 'p2p']

  return types.flatMap((type) => {
    const endpointType = type + '_endpoint'

    return node[endpointType]
      ? {
          type,
          value: node[endpointType]
        }
      : []
  })
}

const getFormatNode = node => {
  const type = node.node_type || null

  const formatNode = {
    type: type && !Array.isArray(type) ? [type] : type,
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

  if (typeof node?.features === 'string') {
    node.features = [node.features]
  }

  if (node.features?.length || !!node.keys) {
    formatNode.node_info = {
      data: {
        version: '',
        features: { list: node.features, keys: node.keys }
      }
    }
  }

  return formatNode
}

const updateNodesInfo = async nodes => {
  nodes = await Promise.all(
    nodes.map(async (node) => {
      if (
        node?.type?.includes('query') &&
        node?.endpoints?.length &&
        !!node.node_info[0]
      ) {
        const { nodeInfo } = await producerUtil.getNodeInfo(
          node.endpoints[0].value
        )

        node.node_info[0].version = nodeInfo?.server_version_string || ''

        return node.node_info[0]
      }
    })
  )

  await updateNodeInfo(nodes.filter((node) => node))
}

module.exports = {
  clearNodes,
  updateNodes,
  updateNodesInfo,
  updateEndpointInfo,
  getFormatNode
}
