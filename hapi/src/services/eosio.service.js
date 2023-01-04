const { axiosUtil, eosUtil, sequelizeUtil, producerUtil } = require('../utils')
const { eosConfig } = require('../config')

const getProducers = async () => {
  let producers = []
  let totalVoteWeight
  let hasMore = true
  let nextKey

  try {
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
  } catch (error) {
    console.error('PRODUCER SYNC ERROR', error)
    producers = await getProducersFromDB()

    return await getBPJsons(producers)
  }

  producers = producers
    .filter(producer => !!producer.is_active)
    .sort((a, b) => {
      if (parseInt(a.total_votes) > parseInt(b.total_votes)) {
        return -1
      }

      if (parseInt(a.total_votes) < parseInt(b.total_votes)) {
        return 1
      }

      return 0
    })

  const rewards = await producerUtil.getExpectedRewards(producers, totalVoteWeight)
  const nonPaidStandby = { vote_rewards: 0, block_rewards: 0, total_rewards: 0 }

  producers = producers.map((producer, index) => {
    return {
      owner: producer.owner,
      ...(rewards[producer.owner] || nonPaidStandby),
      total_votes: producer.total_votes,
      total_votes_percent: producer.total_votes / totalVoteWeight,
      total_votes_eos: producerUtil.getVotes(producer.total_votes),
      rank: index + 1,
      producer_key: producer.producer_key,
      url: producer.url,
      unpaid_blocks: producer.unpaid_blocks,
      last_claim_time: producer.last_claim_time,
      location: producer.location,
      producer_authority: producer.producer_authority,
      is_active: !!producer.is_active
    }
  })

  producers = await getBPJsons(producers)

  return producers
}

const getBPJsons = async (producers = []) => {
  const isEosNetwork = eosConfig.chainId === eosConfig.eosChainId
  let topProducers = producers.slice(0, eosConfig.eosTopLimit)

  topProducers = await Promise.all(
    topProducers.map(async producer => {
      let bpJson = {}

      if (producer.url && producer.url.length > 3) {
        const producerUrl = getProducerUrl(producer)
        const chains = await getChains(producerUrl)
        const chainUrl = chains[eosConfig.chainId]

        bpJson = await getBPJson(producerUrl, chainUrl || '/bp.json')

        if (bpJson && !chainUrl && !isEosNetwork) {
          const { org, producer_account_name: name } = bpJson

          bpJson = {
            ...(org && { org }),
            ...(name && { producer_account_name: name })
          }
        }
      }

      return {
        ...producer,
        endpoints: { api: [], ssl: [], p2p: [] },
        health_status: getProducerHealthStatus(bpJson),
        bp_json: bpJson
      }
    })
  )

  return topProducers.concat(producers.slice(eosConfig.eosTopLimit))
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
  let producerUrl = producer?.url?.replace(/(“|'|”|")/g, '') || ''

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
  if (!bpJson || !Object.keys(bpJson).length) return []

  const healthStatus = []

  healthStatus.push({
    name: 'bpJson',
    valid: true
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

const getProducersFromDB = async () => {
  const [producers] = await sequelizeUtil.query(`
    SELECT *
    FROM producer
    ORDER BY rank ASC
    ;
  `)

  return producers
}

module.exports = {
  getProducers
}
