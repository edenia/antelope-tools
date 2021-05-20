const axiosUtil = require('./axios.util')

const getNodeInfo = async api => {
  try {
    const response = await axiosUtil.instance.get(`${api}/v1/chain/get_info`)

    return response.data
  } catch (error) {}

  return {}
}

const getEndpoints = nodes => {
  if (!nodes?.length) {
    return {
      api: [],
      ssl: [],
      p2p: []
    }
  }

  const endpoints = []
  nodes.forEach(node => {
    endpoints.push({
      type: 'p2p',
      value: node.p2p_endpoint
    })
    endpoints.push({
      type: 'api',
      value: node.api_endpoint
    })
    endpoints.push({
      type: 'ssl',
      value: node.ssl_endpoint
    })
  })

  return {
    api: endpoints
      .filter(endpoint => endpoint.type === 'api' && !!endpoint.value)
      .map(endpoint => endpoint.value),
    ssl: endpoints
      .filter(endpoint => endpoint.type === 'ssl' && !!endpoint.value)
      .map(endpoint => endpoint.value),
    p2p: endpoints
      .filter(endpoint => endpoint.type === 'p2p' && !!endpoint.value)
      .map(endpoint => endpoint.value)
  }
}

const jsonParse = string => {
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
