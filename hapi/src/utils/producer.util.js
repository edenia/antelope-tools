const axiosUtil = require('./axios.util')

const getNodeInfo = async (api) => {
  try {
    const response = await axiosUtil.instance.get(`${api}/v1/chain/get_info`)

    return response.data
  } catch (error) {}

  return {}
}

const getEndpoints = (nodes) => {
  if (!nodes?.length) {
    return {
      api: [],
      ssl: [],
      p2p: []
    }
  }

  const endpoints = { api: new Set(), ssl: new Set(), p2p: new Set() }

  Object.getOwnPropertyNames(endpoints).forEach((type) => {
    const endpointType = type + '_endpoint'

    nodes.forEach((node) => {
      const endpoint = node[endpointType]

      if (endpoint) endpoints[type].add(endpoint)
    })

    endpoints[type] = [...endpoints[type]]
  })

  return endpoints
}

const jsonParse = (string) => {
  try {
    const json = JSON.parse(string)

    return json
  } catch (error) {}

  return {}
}

module.exports = {
  getNodeInfo,
  getEndpoints,
  jsonParse
}
