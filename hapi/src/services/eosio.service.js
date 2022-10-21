const { axiosUtil, eosUtil, producerUtil } = require('../utils')
const { eosConfig } = require('../config')

const getProducers = async () => {
  let producers = []
  let totalVoteWeight
  let hasMore = true
  let nextKey

  while (hasMore) {
    const {
      rows,
      more,
      total_producer_vote_weight: _totalVoteWeight
    } = await eosUtil.getProducers({
      limit: 100,
      json: true,
      lower_bound: nextKey
    })

    hasMore = !!more
    nextKey = more
    totalVoteWeight = parseFloat(_totalVoteWeight)
    producers.push(...rows)
  }

  producers = producers
    .filter(producer => !!producer.is_active)
    .sort((a, b) => {
      if (a.total_votes < b.total_votes) {
        return -1
      }

      if (a.total_votes > b.total_votes) {
        return 1
      }

      return 0
    })
  const rewards = await getExpectedRewards(producers, totalVoteWeight)

  producers = await Promise.all(
    producers.map(async (producer, index) => {
      const producerUrl = getProducerUrl(producer)
      const chains = await getChains(producerUrl)
      const chainUrl = chains[eosConfig.chainId] || '/bp.json'
      const bpJson = await getBPJson(producerUrl, chainUrl)
      const healthStatus = getProducerHealthStatus(bpJson)

      let nodes = []
      let endpoints = { api: [], ssl: [], p2p: [] }

      if (chains[eosConfig.chainId]) {
        nodes = await getNodes(bpJson)
        endpoints = producerUtil.getEndpoints(bpJson.nodes)
        bpJson.nodes = nodes
      }

      if (!bpJson.nodes?.length) {
        delete bpJson.nodes
      }

      return {
        endpoints,
        owner: producer.owner,
        ...(rewards[producer.owner] || {}),
        total_votes: producer.total_votes,
        total_votes_percent: producer.total_votes / totalVoteWeight,
        total_votes_eos: getVotesInEOS(producer.total_votes),
        health_status: healthStatus,
        rank: index + 1,
        producer_key: producer.producer_key,
        url: producer.url,
        unpaid_blocks: producer.unpaid_blocks,
        last_claim_time: producer.last_claim_time,
        location: producer.location,
        producer_authority: producer.producer_authority,
        server_version_string: producer.server_version_string,
        is_active: !!producer.is_active,
        bp_json: bpJson
      }
    })
  )

  return producers
}

const getExpectedRewards = async (producers, totalVotes) => {
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
        producer: producer.owner,
        vote_rewards: expectedVoteReward,
        block_rewards: expectedBlockReward,
        total_rewards: expectedVoteReward + expectedBlockReward
      }
    })
    .reduce(
      (rewards, { producer, ...args }) => ({ ...rewards, [producer]: args }),
      {}
    )
}

const getBPJson = async (producerUrl, chainUrl) => {
  const bpJsonUrl = `${producerUrl}/${chainUrl}`.replace(
    /(?<=:\/\/.*)((\/\/))/,
    '/'
  )
  let bpJson = {}

  try {
    const { data: _bpJson } = await axiosUtil.instance.get(bpJsonUrl)

    bpJson = !!_bpJson && typeof _bpJson === 'object' ? _bpJson : bpJson
  } catch (error) {}

  return bpJson
}

const getProducerUrl = producer => {
  let producerUrl = producer.url || ''

  if (!producerUrl.startsWith('http')) {
    producerUrl = `http://${producerUrl}`
  }

  return producerUrl
}

const getChains = async producerUrl => {
  const chainsUrl = `${producerUrl}/chains.json`.replace(
    /(?<=:\/\/.*)((\/\/))/,
    '/'
  )

  try {
    const {
      data: { chains }
    } = await axiosUtil.instance.get(chainsUrl)

    return chains ?? {}
  } catch (error) {
    return {}
  }
}

const getProducerHealthStatus = bpJson => {
  const healthStatus = []

  healthStatus.push({
    name: 'bpJson',
    valid: !!bpJson && !!Object.keys(bpJson).length
  })
  healthStatus.push({
    name: 'organization_name',
    valid: !!bpJson.org?.candidate_name
  })
  healthStatus.push({
    name: 'email',
    valid: !!bpJson.org?.email
  })
  healthStatus.push({
    name: 'website',
    valid: !!bpJson.org?.website
  })
  healthStatus.push({
    name: 'logo_256',
    valid: !!bpJson?.org?.branding?.logo_256
  })
  healthStatus.push({
    name: 'country',
    valid: !!bpJson?.org?.location?.country
  })

  return healthStatus
}

const getNodes = bpJson => {
  return Promise.all(
    (bpJson?.nodes || []).map(async node => {
      const apiUrl = node?.ssl_endpoint || node?.api_endpoint
      const { nodeInfo } = await producerUtil.getNodeInfo(apiUrl)
      return {
        ...node,
        server_version: nodeInfo?.server_version || '',
        server_version_string: nodeInfo?.server_version_string || '',
        head_block_num: nodeInfo?.head_block_num || '',
        chain_id: nodeInfo?.chain_id || '',
        last_irreversible_block_num: nodeInfo?.last_irreversible_block_num || '',
        last_irreversible_block_id: nodeInfo?.last_irreversible_block_id || '',
        head_block_id: nodeInfo?.head_block_id || '',
        head_block_time: nodeInfo?.head_block_time || '',
        head_block_producer: nodeInfo?.head_block_producer || '',
        virtual_block_cpu_limit: nodeInfo?.virtual_block_cpu_limit || '', 
        virtual_block_net_limit: nodeInfo?.virtual_block_net_limit || '',
        block_cpu_limit: nodeInfo?.block_cpu_limit || '',
        block_net_limit: nodeInfo?.block_net_limit || '',
        fork_db_head_block_num: nodeInfo?.fork_db_head_block_num || '',
        fork_db_head_block_id: nodeInfo?.fork_db_head_block_id || '',
        server_full_version_string: nodeInfo?.server_full_version_string || '',
        total_cpu_weight: nodeInfo?.total_cpu_weight || '',
        total_net_weight: nodeInfo?.total_net_weight || '',
        earliest_available_block_num: nodeInfo?.earliest_available_block_num || '',
        last_irreversible_block_time: nodeInfo?.last_irreversible_block_time || ''
      }
    })
  )
}

const getVotesInEOS = votes => {
  const TIMESTAMP_EPOCH = 946684800
  const date = Date.now() / 1000 - TIMESTAMP_EPOCH
  const weight = date / (86400 * 7) / 52 // 86400 = seconds per day 24*3600

  return parseFloat(votes) / 2 ** weight / 10000
}

module.exports = {
  getProducers
}
