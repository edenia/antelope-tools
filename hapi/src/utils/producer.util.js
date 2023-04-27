const axiosUtil = require('./axios.util')
const eosUtil = require('./eos.util')
const hasuraUtil = require('./hasura.util')
const { eosConfig } = require('../config')

const getUrlStatus = async (url, api = '') => {
  const urlRegex = /\/$/
  url = url.replace(urlRegex, '')

  try {
    const response = await axiosUtil.instance.get(`${url}${api}`, { timeout: 30000 })

    return response
  } catch (error) {
    return error.response
  }
}

const getNodeInfo = async (url, api = '/v1/chain/get_info') => {
  const response = await getUrlStatus(url, api)

  return {
    ...(response?.data && { nodeInfo: response.data }),
    status: response?.status || null,
    statusText: response?.statusText || 'No response'
  }
}

const getSupportedAPIs = async (api) => {
  let supportedAPIs

  try {
    const response = await axiosUtil.instance.get(
      `${api}/v1/node/get_supported_apis`, { timeout: 30000 }
    )

    supportedAPIs = response.data?.apis
  } catch (error) {}

  return { supportedAPIs }
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
  let rewards = []

  switch (eosConfig.networkName) {
    case eosConfig.knownNetworks.libre:
      rewards = await getLibreRewards(producers)
      break
    case eosConfig.knownNetworks.telos:
      rewards = await getTelosRewards(producers)
      break
    default:
      rewards = await getEOSIORewards(producers, totalVotes)
      break
  }

  return rewards.reduce(
    (rewards, { producer, ...args }) => ({ ...rewards, [producer]: args }),
    {}
  )
}

const getLibrePerBlock = () => {
  const secondsPerYear = 86400 * 365
  const activatedTime = new Date('2022-07-04T18:58:09.000')
  const timePassed = (new Date() - activatedTime) / 1000

  // two halvings at six months
  return (
    4 >>
    (Boolean(timePassed > secondsPerYear) +
      Boolean(timePassed > secondsPerYear / 2))
  )
}

const getLibreRewards = async (producers) => {
  const secondsPerDay = 86400
  const round = 12
  const estimatedBlocks = (secondsPerDay / round / 21) * 24
  const rewardPerBlock = getLibrePerBlock()
  const blockProducers = producers.slice(0, 21)

  return blockProducers.map((producer) => {
    const totalRewards = estimatedBlocks * rewardPerBlock

    return {
      producer: producer.owner,
      vote_rewards: 0,
      block_rewards: totalRewards,
      total_rewards: totalRewards
    }
  })
}

const getTelosRewards = async (producers) => {
  const telosPrice = (await getEOSPrice()) || 0
  const estimatedRewards = 8.34 * telosPrice ** -0.516 // approximate rewards per half hour
  const producerRewards = Math.min(estimatedRewards * 48, 28000)

  const topProducers = producers.slice(0, 42)

  return topProducers.map((producer, i) => {
    const totalRewards = i < 21 ? producerRewards : producerRewards / 2

    return {
      producer: producer.owner,
      vote_rewards: totalRewards * 0.75,
      block_rewards: totalRewards * 0.25,
      total_rewards: totalRewards
    }
  })
}

const getEOSIORewards = async (producers, totalVotes) => {
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

  let blockReward = 0.25 // reward for each block produced

  if (eosConfig.networkName === eosConfig.knownNetworks.wax) {
    blockReward = 1 // in wax all rewards are from the blocks produced
  }

  const voteReward = 1 - blockReward // reward according to producer total_votes
  const minimumPercenToGetVoteReward =
    100 / (inflation * (voteReward || blockReward)) // calculate the minimum percent to get vote reward

  let distributedVoteRewardPercent = 0
  let undistributedVoteRewardPercent = 0

  producers.forEach((producer) => {
    const producerVotePercent = parseFloat(producer.total_votes) / totalVotes

    if (producerVotePercent > minimumPercenToGetVoteReward) {
      distributedVoteRewardPercent += producerVotePercent
    } else {
      undistributedVoteRewardPercent += producerVotePercent
    }
  })

  const producersRewards = []

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

const getVotes = (votes) => {
  switch (eosConfig.networkName) {
    case eosConfig.knownNetworks.telos:
      return parseFloat(votes)
    case eosConfig.knownNetworks.libre:
      return parseFloat(votes) / 10000
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
  getSupportedAPIs,
  getUrlStatus,
  getVotes,
  jsonParse
}
