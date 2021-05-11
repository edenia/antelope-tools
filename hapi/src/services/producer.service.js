const EosApi = require('eosjs-api')

const { hasuraUtil, axiosUtil } = require('../utils')
const { eosConfig } = require('../config')

const eosApi = EosApi({
  httpEndpoint: eosConfig.apiEndpoint,
  verbose: false,
  fetchConfiguration: {}
})

const nodeTypes = {
  1: 'validator',
  2: 'writer',
  3: 'boot',
  4: 'observer'
}

const UPSERT = `
  mutation ($producers: [producer_insert_input!]!) {
    insert_producer(objects: $producers, on_conflict: {constraint: producer_owner_key, update_columns: [bp_json, total_votes, producer_key, is_active, url, unpaid_blocks, last_claim_time, location, producer_authority, total_votes_percent, total_votes_eos, vote_rewards, block_rewards, total_rewards, health_status]}) {
      affected_rows
    }
  }
`

const UPDATE = `
  mutation ($where: producer_bool_exp!, $payload: producer_set_input!) {
    update_producer(where: $where, _set: $payload) {
      affected_rows
    }
  }
`

const FIND = `
  query ($where: producer_bool_exp) {
    producer (where: $where) {
      id
      owner
      url
      bp_json
    }
  }
`

const INSERT_MISSED_BLOCK = `
  mutation ($account: String!, $value: Int!) {
    insert_missed_block_one(object: {account: $account, value: $value}) {
      id
      account
      value
    }
  }
`

const CLEAR_OLD_PRODUCERS = `
  mutation ($owners: [String!]) {
    delete_producer(where: {owner: {_nin: $owners}}) {
      affected_rows
    }
  }
`

const update = async (where, payload) => {
  const data = await hasuraUtil.request(UPDATE, { where, payload })

  return data
}

const find = async where => {
  const data = await hasuraUtil.request(FIND, { where })

  return data.producer
}

const addExpectedReward = async (producers, totalVotes) => {
  const systemData = await eosApi.getCurrencyStats({
    symbol: 'EOS',
    code: 'eosio.token'
  })
  let inflation

  if (!systemData.EOS || !systemData.EOS.supply) {
    inflation = 0
  } else {
    inflation = parseInt(systemData.EOS.supply.split(' ')[0]) / 100 / 365
  }

  const blockReward = 0.25 // reward for each block produced
  const voteReward = 0.75 // reward according to producer total_votes
  const minimumPercenToGetVoteReward = 100 / (inflation * voteReward) // calculate the minimum percent to get vote reward

  let distributedVoteRewardPercent = 0
  let undistributedVoteRewardPercent = 0

  producers.forEach(producer => {
    const producerVotePercent = producer.total_votes / totalVotes
    if (producerVotePercent > minimumPercenToGetVoteReward) {
      distributedVoteRewardPercent += producerVotePercent
    } else {
      undistributedVoteRewardPercent += producerVotePercent
    }
  })

  return producers
    .sort((a, b) => {
      if (parseInt(a.total_votes) > parseInt(b.total_votes)) {
        return -1
      }

      if (parseInt(a.total_votes) < parseInt(b.total_votes)) {
        return 1
      }

      return 0
    })
    .map((producer, i) => {
      const isBlockProducer = i < 21
      const producerVotePercent = producer.total_votes / totalVotes
      let expectedVoteReward = 0
      let expectedBlockReward = 0

      if (producerVotePercent > minimumPercenToGetVoteReward) {
        const producerDistributionPercent =
          producerVotePercent / distributedVoteRewardPercent // calculates the percentage that the producer represents of the distributed vote reward percent

        const producerUndistributedRewardPercent =
          producerDistributionPercent * undistributedVoteRewardPercent //  calculate the percentage that corresponds to the producer of the undistributed vote reward percent

        expectedVoteReward =
          inflation *
          voteReward *
          (producerUndistributedRewardPercent + producerVotePercent)
      }

      if (isBlockProducer) {
        expectedBlockReward = inflation * blockReward * (1 / 21)
      }

      return {
        ...producer,
        vote_rewards: expectedVoteReward,
        block_rewards: expectedBlockReward,
        total_rewards: expectedVoteReward + expectedBlockReward
      }
    })
}

const parseVotesToEOS = votes => {
  const TIMESTAMP_EPOCH = 946684800
  const date = Date.now() / 1000 - TIMESTAMP_EPOCH
  const weight = date / (86400 * 7) / 52 // 86400 = seconds per day 24*3600

  return parseFloat(votes) / 2 ** weight / 10000
}

const getBPJsonUrl = async (producer = {}) => {
  let newUrl = producer.url || ''

  if (!newUrl.startsWith('http')) {
    newUrl = `http://${newUrl}`
  }

  if (newUrl.endsWith('/')) {
    newUrl = newUrl.substr(0, newUrl.length - 1)
  }

  if (newUrl === 'http://infinitystones.io') {
    newUrl = 'https://infinitystones.io'
  }

  try {
    const {
      data: { chains }
    } = await axiosUtil.instance.get(`${newUrl}/chains.json`)

    return `${newUrl}/${chains[eosConfig.chainId] || '/bp.json'}`
  } catch (error) {}

  return `${newUrl}/bp.json`
}

const getBPJsonFromUrl = async url => {
  try {
    const { data: info } = await axiosUtil.instance.get(url)
    let data = info || {}

    if (typeof data !== 'object') {
      data = {}
    }

    return data
  } catch (error) {}

  return {}
}

const syncBPJsonOffChain = async () => {
  const producers = await find()
  await Promise.all(
    producers.map(async producer => {
      try {
        const bpJsonUrl = await getBPJsonUrl(producer)
        const data = await getBPJsonFromUrl(bpJsonUrl)
        const endpoints = []
        const nodes = await Promise.all(
          (data?.nodes || []).map(async node => {
            const api = node?.ssl_endpoint || node?.api_endpoint

            if (!api) {
              return node
            }

            const nodeInfo = await getNodeInfo(api)
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

            return {
              ...node,
              server_version_string: nodeInfo.server_version_string
            }
          })
        )
        const healthStatus = []

        healthStatus.push({
          name: 'organization_name',
          valid: !!data.org?.candidate_name
        })
        healthStatus.push({
          name: 'email',
          valid: !!data.org?.email
        })
        healthStatus.push({
          name: 'website',
          valid: !!data.org?.website
        })
        healthStatus.push({
          name: 'logo_256',
          valid: !!data?.org?.branding?.logo_256
        })
        healthStatus.push({
          name: 'country',
          valid: !!data?.org?.location?.country
        })

        await update(
          { owner: { _eq: producer.owner } },
          {
            health_status: healthStatus,
            bp_json: {
              ...data,
              nodes,
              endpoints: {
                api: endpoints
                  .filter(
                    endpoint => endpoint.type === 'api' && !!endpoint.value
                  )
                  .map(endpoint => endpoint.value),
                ssl: endpoints
                  .filter(
                    endpoint => endpoint.type === 'ssl' && !!endpoint.value
                  )
                  .map(endpoint => endpoint.value),
                p2p: endpoints
                  .filter(
                    endpoint => endpoint.type === 'p2p' && !!endpoint.value
                  )
                  .map(endpoint => endpoint.value)
              }
            }
          }
        )
      } catch (error) {
        console.log('syncBPJsonOffChain', producer.owner, error.message)
      }
    })
  )
}

const syncBPJsonOnChain = async () => {
  const producers = await find()
  const { rows } = await eosApi.getTableRows({
    code: eosConfig.bpJsonOnChainContract,
    scope: eosConfig.bpJsonOnChainScope,
    table: eosConfig.bpJsonOnChainTable,
    json: true
  })
  await Promise.all(
    producers.map(async producer => {
      try {
        const data = JSON.parse(
          (
            rows.find(
              i =>
                i.entity_name === producer.owner || i.owner === producer.owner
            ) || {}
          ).json || '{}'
        )

        if (!Object.keys(data).length > 0) {
          return
        }

        await update(
          { owner: { _eq: producer.owner } },
          {
            bp_json: Object.keys(data).length > 0 ? data : null
          }
        )
      } catch (error) {}
    })
  )
}

const getNodeInfo = async api => {
  try {
    const response = await axiosUtil.instance.get(`${api}/v1/chain/get_info`)

    return response.data
  } catch (error) {}

  return {}
}

const getJson = string => {
  try {
    const json = JSON.parse(string)

    return json
  } catch (error) {}

  return {}
}

const getLachainEntities = async () => {
  const entities = []
  let hasMore = true
  let key

  while (hasMore) {
    const { rows, more, next_key: nextKey } = await eosApi.getTableRows({
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

  return entities
}

const getLachainNodes = async () => {
  const nodes = []
  let hasMore = true
  let key

  while (hasMore) {
    const { rows, more, next_key: nextKey } = await eosApi.getTableRows({
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

  return nodes
}

const syncBPJsonForLacchain = async () => {
  const entities = await getLachainEntities()
  const nodes = await getLachainNodes()
  const producers = await Promise.all(
    entities.map(async entity => {
      const bpJson = getJson(entity.info)
      const entityNodes = await Promise.all(
        nodes
          .filter(node => node.entity === entity.name)
          .map(async node => {
            const nodeType = nodeTypes[node.type] || 'N/A'
            const nodeInfo = getJson(node.info)
            let newNodeInfo = {}

            for (const key of Object.keys(nodeInfo)) {
              newNodeInfo = {
                ...newNodeInfo,
                [key.replace(`${nodeType}_`, '')]: nodeInfo[key]
              }
            }

            let endpoints = {}
            for (const key of Object.keys(newNodeInfo.endpoints || {})) {
              endpoints = {
                ...endpoints,
                [key.replace(`${nodeType}_`, '')]: newNodeInfo.endpoints[key]
              }
            }

            const healthStatus = []
            healthStatus.push({
              name: 'peer_keys',
              valid: (newNodeInfo?.keys?.peer_keys || []).length > 0
            })
            healthStatus.push({
              name: 'endpoint',
              valid: Object.keys(newNodeInfo?.endpoints || {}).length > 0
            })
            healthStatus.push({
              name: 'country',
              valid: !!newNodeInfo?.location?.country
            })

            const api =
              newNodeInfo.endpoints?.[`${nodeType}_ssl`] ||
              newNodeInfo.endpoints?.[`${nodeType}_api`]

            if (api) {
              const nodeInfo = await getNodeInfo(api)
              newNodeInfo = {
                ...newNodeInfo,
                server_version_string: nodeInfo.server_version_string
              }
            }

            return {
              ...newNodeInfo,
              endpoints:
                Object.keys(endpoints).length > 0 ? endpoints : undefined,
              node_name: node.name,
              node_type: nodeType,
              health_status: healthStatus
            }
          })
      )
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

      const nodesEndpoints = entityNodes
        .map(node =>
          Object.keys(node.endpoints || {}).map(key => ({
            type: key.replace(`${node.node_type}_`, ''),
            value: node.endpoints[key]
          }))
        )
        .reduce((result, current) => [...result, ...current], [])

      return {
        owner: entity.name,
        health_status: healthStatus,
        bp_json: {
          org: bpJson,
          nodes: entityNodes,
          type: entity.type,
          endpoints: {
            api: nodesEndpoints
              .filter(endpoint => endpoint.type === 'api')
              .map(endpoint => endpoint.value),
            ssl: nodesEndpoints
              .filter(endpoint => endpoint.type === 'ssl')
              .map(endpoint => endpoint.value),
            p2p: nodesEndpoints
              .filter(endpoint => endpoint.type === 'p2p')
              .map(endpoint => endpoint.value)
          }
        }
      }
    })
  )

  await hasuraUtil.request(UPSERT, { producers })
  await hasuraUtil.request(CLEAR_OLD_PRODUCERS, {
    owners: producers.map(producer => producer.owner)
  })
}

const syncBPJsonForDefaultNetworks = async () => {
  try {
    const response = await eosApi.getProducers({ limit: 100, json: true })
    let producers = response.rows.map(producer => ({
      ...producer,
      is_active: !!producer.is_active,
      total_votes_percent:
        producer.total_votes / response.total_producer_vote_weight,
      total_votes_eos: parseVotesToEOS(producer.total_votes)
    }))
    producers = await addExpectedReward(
      producers,
      response.total_producer_vote_weight
    )
    await hasuraUtil.request(UPSERT, { producers })
    await hasuraUtil.request(CLEAR_OLD_PRODUCERS, {
      owners: producers.map(producer => producer.owner)
    })

    if (eosConfig.bpJsonOnChain) {
      await syncBPJsonOnChain()
    } else {
      await syncBPJsonOffChain()
    }
  } catch (error) {
    console.log(error.message)
  }
}

const syncProducers = async () => {
  switch (eosConfig.networkName) {
    case eosConfig.knownNetworks.lacchain:
      await syncBPJsonForLacchain()
      break
    default:
      await syncBPJsonForDefaultNetworks()
      break
  }
}

const getApiEndpoints = (producer = {}) => {
  if (!producer.bp_json) {
    return []
  }

  return Object.keys(
    producer.bp_json.nodes.reduce((endpoints, node) => {
      let newEndpoints = {}

      if (node.api_endpoint) {
        newEndpoints = {
          ...newEndpoints,
          [node.api_endpoint]: true
        }
      }

      if (node.ssl_endpoint) {
        newEndpoints = {
          ...newEndpoints,
          [node.ssl_endpoint]: true
        }
      }

      return {
        ...endpoints,
        ...newEndpoints
      }
    }, {})
  )
}

const syncProducersInfo = async () => {
  const producers = await find()
  await Promise.all(
    producers.map(async producer => {
      try {
        const endpoints = getApiEndpoints(producer)

        if (!endpoints.length) {
          return
        }

        const eosApi = EosApi({
          httpEndpoint: endpoints[0],
          verbose: false,
          fetchConfiguration: {}
        })
        const startTs = Date.now()
        const { website, ...info } = await eosApi.getInfo({})
        const ping = Date.now() - startTs

        if (eosConfig.chainId !== info.chain_id) {
          return
        }

        await update(
          { owner: { _eq: producer.owner } },
          {
            ...info,
            ping
          }
        )
      } catch (error) {}
    })
  )
}

const saveMissedBlocksFor = async (producerName, missedBlocks) => {
  if (missedBlocks < 1) {
    return
  }

  await hasuraUtil.request(INSERT_MISSED_BLOCK, {
    account: producerName,
    value: missedBlocks
  })
}

const checkForMissedBlocks = async () => {
  let info = await eosApi.getInfo({})
  let lastProducer = info.head_block_producer
  let currentProducer = info.head_block_producer

  // wait until first turn change
  while (currentProducer === lastProducer) {
    info = await eosApi.getInfo({})
    lastProducer = currentProducer
    currentProducer = info.head_block_producer
    await new Promise(resolve => setTimeout(() => resolve(), 1000))
  }

  lastProducer = info.head_block_producer
  let lastBlockNum = info.head_block_num
  let currentBlockNum = null
  let missedBlocks = 0
  let producedBlocks = 0

  // start an infinity loop to track missed blocks until main process ends
  while (true) {
    const startTime = new Date()

    try {
      info = await eosApi.getInfo({})
      currentProducer = info.head_block_producer
      currentBlockNum = info.head_block_num

      const currentSchedule = await eosApi.getProducerSchedule({})
      const lastProducerIndex = currentSchedule.active.producers.findIndex(
        item => item.producer_name === lastProducer
      )
      const newProducerIndex = currentSchedule.active.producers.findIndex(
        item => item.producer_name === currentProducer
      )

      if (lastProducerIndex > newProducerIndex && newProducerIndex !== 0) {
        // change producer in case that the network is stuck in a previous producer
        currentProducer = lastProducer
      }

      if (
        missedBlocks + producedBlocks >= 12 &&
        currentProducer === lastProducer
      ) {
        // change producer in case that the currentProducer and the next one are missing blocks
        const nextProducerIndex =
          lastProducerIndex + 1 >= currentSchedule.active.producers.length
            ? 0
            : lastProducerIndex + 1
        currentProducer =
          currentSchedule.active.producers[nextProducerIndex].producer_name
      }

      if (lastProducer !== currentProducer) {
        // we have a new producer so we should save the missed blocks for the previous one
        await saveMissedBlocksFor(lastProducer, missedBlocks)
        producedBlocks = 0
        missedBlocks = 0
      }

      if (currentBlockNum === lastBlockNum) {
        // when the previous block and the current block are equals we have a missed block
        missedBlocks += 1
      } else {
        // when the previous block and the current block are diferent we have a new block
        producedBlocks += 1
      }

      lastProducer = currentProducer
      lastBlockNum = currentBlockNum
    } catch (error) {
      console.log(error)
    }

    const endTime = new Date()
    const msDiff = endTime.getTime() - startTime.getTime()

    if (msDiff < 500) {
      await new Promise(resolve => setTimeout(() => resolve(), 501 - msDiff))
    }
  }
}

module.exports = {
  checkForMissedBlocks,
  syncProducers,
  syncProducersInfo
}
