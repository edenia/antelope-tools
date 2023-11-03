const axiosUtil = require('./axios.util')
const eosUtil = require('./eos.util')
const net = require('node:net')
const os = require('node:os')

const { eosConfig } = require('../config')

const getUrlStatus = async (url, api = '') => {
  const urlRegex = /\/$/
  url = url.replace(urlRegex, '')

  try {
    const response = await axiosUtil.instance.get(`${url}${api}`, {
      timeout: 30000
    })

    return response
  } catch (error) {
    return error.response
  }
}

const isP2PResponding = async (endpoint) => {
  const splitted = endpoint?.split(':') || {}
  const { 0: host, 1: port } = splitted

  if (splitted.length !== 2 || !host || !port)
    return { status: 'Failed', statusText: 'Invalid endpoint format' }

  const isResponding = new Promise((resolve, _) => {
    const client = net.createConnection({ host, port }, () => {
      client.destroy()
      resolve({ status: 'Success', statusText: 'Connection established' })
    })

    client.on('error', (err) => {
      let errorMessage = ''

      switch (Math.abs(err?.errno)) {
        case os.constants.errno.ECONNREFUSED:
          errorMessage = 'Connection refused'
          break
        case os.constants.errno.ETIMEDOUT:
          errorMessage = 'Connection timeout exceeded'
          break
        default:
          errorMessage = 'Connection error'
      }

      resolve({ status: 'Failed', statusText: errorMessage })
    })
  })

  return eosUtil.callWithTimeout(isResponding, 60000).catch((_) => {
    return { status: 'Failed', statusText: 'Connection timeout exceeded' }
  })
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
      `${api}/v1/node/get_supported_apis`,
      { timeout: 30000 }
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

const getCurrencyStats = async () => {
  const systemData = await eosUtil.getCurrencyStats({
    symbol: eosConfig.rewardsToken,
    code: 'eosio.token'
  })

  return systemData[eosConfig.rewardsToken]
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
  const currencyStats = await getCurrencyStats()
  const { rows: payrateRows } = await eosUtil.getTableRows({
    code: 'eosio',
    scope: 'eosio',
    table: 'payrate',
    reverse: false,
    limit: 1,
    json: true,
    lower_bound: null
  })

  const tokenSupply = parseFloat(currencyStats.supply)
  const bPayRate = payrateRows?.at(0)?.bpay_rate / 100000
  const toProducers = (bPayRate * tokenSupply) / 365 // (bPayRate * tokenSupply * secondsPerDay) / secondsPerYear

  const MAX_PAID_PRODUCERS = 42
  const topProducers = producers.slice(0, MAX_PAID_PRODUCERS)
  const activeCount = topProducers.length
  const shareCount =
    activeCount <= 21
      ? activeCount * 2
      : MAX_PAID_PRODUCERS + (activeCount - 21)

  const producerRewards = toProducers / shareCount

  return topProducers.map((producer, i) => {
    const totalRewards = i < 21 ? producerRewards * 2 : producerRewards

    return {
      producer: producer.owner,
      vote_rewards: 0,
      block_rewards: totalRewards,
      total_rewards: totalRewards
    }
  })
}

const getEOSIORewards = async (producers, totalVotes) => {
  const currencyStats = await getCurrencyStats()
  let inflation = 0

  if (currencyStats && currencyStats.supply) {
    inflation = parseInt(currencyStats.supply.split(' ')[0]) / 100 / 365
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

const jsonParse = (string) => {
  try {
    const json = JSON.parse(string)

    return json
  } catch (error) {}

  return {}
}

module.exports = {
  isP2PResponding,
  getNodeInfo,
  getEndpoints,
  getExpectedRewards,
  getSupportedAPIs,
  getUrlStatus,
  getVotes,
  jsonParse
}
