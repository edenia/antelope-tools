const { eosConfig } = require('../config')
const { producerUtil, eosUtil } = require('../utils')

const nodeTypes = {
  1: 'validator',
  2: 'writer',
  3: 'boot',
  4: 'observer'
}

const getProducers = async () => {
  const nodes = await getNodes()
  let entities = []
  let hasMore = true
  let key

  while (hasMore) {
    const { rows, more, next_key: nextKey } = await eosUtil.getTableRows({
      code: eosConfig.lacchain.account,
      scope: eosConfig.lacchain.account,
      table: eosConfig.lacchain.entityTable,
      json: true,
      lower_bound: key
    })

    key = nextKey
    hasMore = more
    entities.push(...rows)
  }

  entities = await Promise.all(
    entities.map(async entity => {
      const bpJson = producerUtil.jsonParse(entity.info)
      const entityNodes = nodes.filter(node => node.entity === entity.name)
      const healthStatus = getEntityHealthStatus(bpJson)
      const endpoints = producerUtil.getEndpoints(entityNodes)

      return {
        endpoints,
        owner: entity.name,
        health_status: healthStatus,
        bp_json: {
          org: bpJson,
          nodes: entityNodes,
          type: entity.type
        }
      }
    })
  )

  return entities
}

const getNodes = async () => {
  let nodes = []
  let hasMore = true
  let key

  while (hasMore) {
    const { rows, more, next_key: nextKey } = await eosUtil.getTableRows({
      code: eosConfig.lacchain.account,
      scope: eosConfig.lacchain.account,
      table: eosConfig.lacchain.nodeTable,
      json: true,
      lower_bound: key
    })

    key = nextKey
    hasMore = more
    nodes.push(...rows)
  }

  nodes = await Promise.all(
    nodes.map(async node => {
      const nodeType = nodeTypes[node.type] || 'N/A'
      const bpJson = producerUtil.jsonParse(node.info)
      let newInfo = {}

      for (const key of Object.keys(bpJson)) {
        newInfo = {
          ...newInfo,
          [key.replace(`${nodeType}_`, '')]: bpJson[key]
        }
      }

      for (const key of Object.keys(newInfo.endpoints || {})) {
        newInfo = {
          ...newInfo,
          [`${key.replace(`${nodeType}_`, '')}_endpoint`]: newInfo.endpoints[
            key
          ]
        }
      }

      delete newInfo.endpoints
      const nodeHealthStatus = getNodeHealthStatus(newInfo)
      const apiUrl = newInfo.ssl_endpoint || newInfo.api_endpoint

      if (apiUrl) {
        const {nodeInfo} = await producerUtil.getNodeInfo(apiUrl)
        newInfo = {
          ...newInfo,
          server_version_string: nodeInfo?.server_version_string || ''
        }
      }

      return {
        ...newInfo,
        entity: node.entity,
        name: node.name,
        node_type: nodeType,
        health_status: nodeHealthStatus
      }
    })
  )

  return nodes
}

const getNodeHealthStatus = node => {
  const healthStatus = []

  healthStatus.push({
    name: 'peer_keys',
    valid: (node?.keys?.peer_keys || []).length > 0
  })
  healthStatus.push({
    name: 'country',
    valid: !!node?.location?.country
  })

  return healthStatus
}

const getEntityHealthStatus = bpJson => {
  const healthStatus = []
  healthStatus.push({
    name: 'organization_name',
    valid: !!bpJson.organization_name
  })
  healthStatus.push({
    name: 'email',
    valid: !!bpJson.email
  })
  healthStatus.push({
    name: 'website',
    valid: !!bpJson.website
  })
  healthStatus.push({
    name: 'logo_256',
    valid: !!bpJson?.branding?.logo_256
  })
  healthStatus.push({
    name: 'country',
    valid: !!bpJson?.location?.country
  })

  return healthStatus
}

module.exports = {
  getProducers
}
