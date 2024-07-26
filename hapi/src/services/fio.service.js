const { StatusCodes } = require('http-status-codes')

const { axiosUtil, hasuraUtil, eosUtil, sequelizeUtil, producerUtil } = require('../utils')
const { eosConfig } = require('../config')

const MAX_PAID_PRODUCERS = 42

const updateRewards = async (producers = []) => {
  const upsertMutation = `
    mutation ($producers: [producer_insert_input!]!) {
      insert_producer(objects: $producers, on_conflict: {constraint: producer_owner_key, update_columns: [ vote_rewards, block_rewards, total_rewards ]}) {
        affected_rows,
      }
    }
  `

  await hasuraUtil.request(upsertMutation, { producers })
}

const getProducers = async () => {
  let producers = []
  let totalVoteWeight
  let hasMore = true
  let nextKey

  try {
    while (hasMore) {
      const {
        rows,
        more
    } = await eosUtil.getTableRows({
        code: 'eosio',
        table: 'producers',
        scope: 'eosio',
        limit: 100,
        json: true,
        lower_bound: nextKey
      })

      hasMore = !!more
      nextKey = more
      producers.push(...rows)
    }

    const {
      rows,
    } = await eosUtil.getTableRows({
      code: 'eosio',
      table: 'global',
      scope: 'eosio',
      limit: 1,
      json: true,
      lower_bound: nextKey
    })

    totalVoteWeight = parseFloat(rows?.at(0)?.total_producer_vote_weight)
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

  producers = producers.map((producer, index) => {
    return {
      owner: producer.owner,
      total_votes: producer.total_votes,
      total_votes_percent: producer.total_votes / totalVoteWeight,
      total_votes_eos: producerUtil.getVotes(producer.total_votes),
      rank: index + 1,
      producer_key: producer.producer_public_key,
      url: producer.url,
      unpaid_blocks: producer.unpaid_blocks,
      last_claim_time: producer.last_claim_time,
      location: producer.location,
      producer_authority: producer.producer_authority,
      is_active: !!producer.is_active,
      fio_address: producer.fio_address,
      addresshash: producer.addresshash,
      last_bpclaim: producer.last_bpclaim?.toString() || '0'
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
      let bpJsonUrl = ''
      let healthStatus = []

      if (producer.url && producer.url.length > 3) {
        const producerUrl = getProducerUrl(producer)
        const chains = await getChains(producerUrl)
        const chainUrl = chains[eosConfig.chainId]
        bpJsonUrl = getBPJsonUrl(producerUrl, chainUrl || '/bp.json')

        try {
          bpJson = await getBPJson(bpJsonUrl)
        } catch (error) {
          if (error.code === 'ECONNABORTED') {          
            return {
              ...producer,
              bp_json_url: bpJsonUrl,
              health_status: healthStatus,
              bp_json: bpJson
            }
          }
        }

        if (bpJson && !chainUrl && !isEosNetwork) {
          const { org, producer_account_name: name } = bpJson

          bpJson = {
            ...(org && { org }),
            ...(name && { producer_account_name: name })
          }
        }

        healthStatus = await getProducerHealthStatus({
          ...producer,
          producerUrl,
          bpJson,
        })
      }

      return {
        ...producer,
        bp_json_url: bpJsonUrl,
        health_status: healthStatus,
        bp_json: bpJson
      }
    })
  )

  return topProducers.concat(producers.slice(eosConfig.eosTopLimit))
}

const getBPJsonUrl = (producerUrl, chainUrl) => {
  return `${producerUrl}/${chainUrl}`.replace(/(?<=:\/\/.*)((\/\/))/, '/')
}

const getBPJson = async bpJsonUrl => {
  const { data: _bpJson } = await axiosUtil.instance.get(bpJsonUrl)
  const bpJson = !!_bpJson && typeof _bpJson === 'object' ? _bpJson : {}

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

const isNonCompliant = producer => {
  return !Object.keys(producer.bpJson).length && producer.total_rewards >= 100
}

const getProducerHealthStatus = async producer => {
  const healthStatus = []
  const {bpJson, producerUrl} = producer

  if (isNonCompliant(producer)) {
    const response = await producerUtil.getUrlStatus(producerUrl)

    healthStatus.push({ name: 'bpJson', valid: false })
    healthStatus.push({
      name: 'website',
      valid: response?.status === StatusCodes.OK,
      response: {
        status: response?.status,
        statusText: response?.statusText || 'No response'
      }
    })

    return healthStatus
  }

  if (!bpJson || !Object.keys(bpJson).length) return []

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

const getVoteShares = async () => {
  try {
    const { rows } = await eosUtil.getTableRows({
      code: 'fio.treasury',
      scope: 'fio.treasury',
      table: 'voteshares',
      reverse: false,
      limit: MAX_PAID_PRODUCERS,
      json: true,
      lower_bound: null
    })

    if (!Array.isArray(rows)) return []

    return rows
  } catch (error) {
    console.warn('SYNC FIO REWARDS', error.message || error)

    return []
  }
}

const getFioRewards = async (producers, voteShares) => {
  const activeProducers = producers.slice(0, MAX_PAID_PRODUCERS)

  return voteShares.flatMap(producer => {
    if (activeProducers.find(bp => bp.owner === producer.owner)) {
      const expectedVoteReward = producer.abpayshare / 10 ** 9
      const expectedBlockReward = producer.sbpayshare / 10 ** 9

      return ({
        owner: producer.owner,
        vote_rewards: expectedVoteReward,
        block_rewards: expectedBlockReward,
        total_rewards: expectedVoteReward + expectedBlockReward
      })
    }

    return []
  })
}

const getProducersWithRewards = async (voteShares) => {
  const producers = await getProducersFromDB()
  const paidProducers = await getFioRewards(producers.slice(0, MAX_PAID_PRODUCERS), voteShares)
  const nonPaidStandby = 
    producers.slice(MAX_PAID_PRODUCERS).map(producer => ({        
      owner: producer.owner,
      vote_rewards: 0,
      block_rewards: 0,
      total_rewards: 0
    }))

  return paidProducers.concat(nonPaidStandby)
}

const getLastPaidScheduleTime = async () => {
  try {
    const { rows } = await eosUtil.getTableRows({
      code: 'fio.treasury',
      scope: 'fio.treasury',
      table: 'clockstate',
      reverse: false,
      limit: 1,
      json: true,
      lower_bound: null
    })

    if (!rows?.at(0)?.payschedtimer) return

    return new Date(rows?.at(0)?.payschedtimer * 1000)
  } catch (error) {
    console.warn('SYNC FIO REWARDS', error.message || error)
  }
}

// Every day the `voteshare` table is populated with the rewards the BP can claim that day.
const syncRewards = async () => {
  console.log('SYNCING FIO REWARDS')

  const voteShares = await getVoteShares()
  const producers = await getProducersWithRewards(voteShares)

  if (!producers?.length) {
    setTimeout(syncRewards, 120 * 1000)
  } else {
    await updateRewards(producers)

    const scheduleTime = await getLastPaidScheduleTime()

    scheduleTime.setSeconds(scheduleTime.getSeconds() + 86400)

    const nextScheduleUpdate = Math.ceil((scheduleTime.getTime() - (new Date()).getTime()))

    setTimeout(syncRewards, nextScheduleUpdate)
  }
}

module.exports = {
  getProducers,
  syncRewards
}
