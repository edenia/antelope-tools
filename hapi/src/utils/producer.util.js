const axiosUtil = require('./axios.util')
const eosUtil = require('./eos.util')
const hasuraUtil = require('./hasura.util')
const { eosConfig } = require('../config')

const getNodeInfo = async (api) => {
  try {
    const response = await axiosUtil.instance.get(`${api}/v1/chain/get_info`)

    return {
      nodeInfo: response.data,
      status: response.status,
      statusText: response.statusText
    }
  } catch (error) {
    return {
      status: error.response?.status || null,
      statusText: error.response?.statusText || 'No response'
    }
  }
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

const getExpectedRewards = async (producers, totalVotes) => {
  let rewards

  switch (eosConfig.networkName) {
    case eosConfig.knownNetworks.telos:
      rewards = await getTelosRewards(producers)
    default:
      const blockReward = eosConfig.networkName === eosConfig.knownNetworks.wax ? 1 : 0.25 // reward for each block produced

      rewards = await getEOSIORewards(producers, totalVotes, blockReward)
  }

  return rewards.reduce(
    (rewards, { producer, ...args }) => ({ ...rewards, [producer]: args }),
    {}
  )
}

const getTelosRewards = async producers => {
  const eosPrice = (await getEOSPrice()) || 0
  const validatorRewards = Math.max(8.34 * eosPrice ** -0.516 * 48, 28000)

  let producersRewards = []
  for (const i in producers) {
    const producer = producers[i]
    let totalRewards = 0
    if (i < 21) {
      totalRewards = validatorRewards
    } else if (i < 42) {
      totalRewards = validatorRewards / 2
    } else {
      break
    }

    producersRewards.push({
      producer: producer.owner,
      vote_rewards: totalRewards * 0.75,
      block_rewards: totalRewards * 0.25,
      total_rewards: totalRewards
    })
  }

  return producersRewards
}

const getEOSIORewards = async (producers, totalVotes, blockReward) => {
  const systemData = await eosUtil.getCurrencyStats({
    symbol: eosConfig.rewardsToken,
    code: 'eosio.token'
  })
  let inflation = 0

  if (
    systemData[eosConfig.rewardsToken] &&
    systemData[eosConfig.rewardsToken].supply
  ) {
    inflation =
      parseInt(systemData[eosConfig.rewardsToken].supply.split(' ')[0]) /
      100 /
      365
  }

  const voteReward = 1 - blockReward // reward according to producer total_votes
  const minimumPercenToGetVoteReward = 100 / (inflation * (voteReward || blockReward)) // calculate the minimum percent to get vote reward

  let distributedVoteRewardPercent = 0
  let undistributedVoteRewardPercent = 0

  producers.forEach(producer => {
    const producerVotePercent = parseFloat(producer.total_votes) / totalVotes

    if (producerVotePercent > minimumPercenToGetVoteReward) {
      distributedVoteRewardPercent += producerVotePercent
    } else {
      undistributedVoteRewardPercent += producerVotePercent
    }
  })

  let producersRewards = []
  for (const i in producers) {
    const producer = producers[i]
    const isBlockProducer = i < 21
    const producerVotePercent = parseFloat(producer.total_votes) / totalVotes

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

      if (isBlockProducer) {
        expectedBlockReward = inflation * blockReward * (1 / 21)
      }

      producersRewards.push({
        producer: producer.owner,
        vote_rewards: expectedVoteReward,
        block_rewards: expectedBlockReward,
        total_rewards: expectedVoteReward + expectedBlockReward
      })
    } else {
      break
    }
  }

  return producersRewards
}

const getVotes = votes => {
  switch (eosConfig.networkName) {
    case eosConfig.knownNetworks.telos:
      return parseFloat(votes)
    case eosConfig.knownNetworks.wax:
      return getEOSIOVotes(votes, 13) / 10 ** 8
    default:
      return getEOSIOVotes(votes, 52) / 10000
  }
}

const getEOSIOVotes = (votes, weekHalfLife) => {
  const TIMESTAMP_EPOCH = 946684800
  const date = Date.now() / 1000 - TIMESTAMP_EPOCH
  const weight = date / (86400 * 7) / weekHalfLife // 86400 = seconds per day 24*3600

  return parseFloat(votes) / 2 ** weight
}

const getEOSPrice = async () => {
  const query = `
    query {
      setting: setting_by_pk(id: 1) {
        token_price
      }
    } 
  `
  const data = await hasuraUtil.request(query)

  return data?.setting?.token_price 
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
  getExpectedRewards,
  getVotes,
  jsonParse
}
