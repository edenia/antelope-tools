const EosApi = require('eosjs-api')

const { hasuraUtil, axiosUtil, eosmechanicsUtil } = require('../utils')
const { eosConfig } = require('../config')

const eosApi = EosApi({
  httpEndpoint: eosConfig.apiEndpoint,
  verbose: false,
  fetchConfiguration: {}
})

const UPSERT = `
  mutation ($producers: [producer_insert_input!]!) {
    insert_producer(objects: $producers, on_conflict: {constraint: producer_owner_key, update_columns: [total_votes, producer_key, is_active, url, unpaid_blocks, last_claim_time, location, producer_authority, total_votes_percent, total_votes_eos, vote_rewards, block_rewards, total_rewards]}) {
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

const INSERT_CPU_USAGE = `
  mutation ($producer: Int!, $usage: Int!) {
    insert_cpu_one (object: {producer: $producer, usage: $usage}) {
      id
      producer
      usage
    }
  }
`

const INSERT_NET_USAGE = `
  mutation ($producer: Int!, $usage: Int!) {
    insert_net_one (object: {producer: $producer, usage: $usage}) {
      id
      producer
      usage
    }
  }
`

const INSERT_RAM_USAGE = `
  mutation ($producer: Int!, $usage: Int!) {
    insert_ram_one (object: {producer: $producer, usage: $usage}) {
      id
      producer
      usage
    }
  }
`

const INSERT_MISSED_BLOCK = `
  mutation ($producer: Int!, $value: Int!) {
    insert_missed_block_one(object: {producer: $producer, value: $value}) {
      id
      producer
      value
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

const insertUsage = async (type = '', payload) => {
  let mutation = null

  switch (type) {
    case 'cpu':
      mutation = INSERT_CPU_USAGE
      break
    case 'net':
      mutation = INSERT_NET_USAGE
      break
    case 'ram':
      mutation = INSERT_RAM_USAGE
      break

    default:
      break
  }

  if (!mutation) {
    return
  }

  const data = await hasuraUtil.request(mutation, payload)

  return data[`insert_${type}_one`]
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

const syncBPJsonOffChain = async () => {
  const producers = await find()
  await Promise.all(
    producers.map(async producer => {
      try {
        const bpJsonUrl = await getBPJsonUrl(producer)
        const { data } = await axiosUtil.instance.get(bpJsonUrl)

        if (typeof data !== 'object') {
          return
        }

        await update(
          { owner: { _eq: producer.owner } },
          {
            bp_json: data
          }
        )
      } catch (error) {}
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

const syncProducers = async () => {
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
    if (eosConfig.bpJsonOnChain) {
      await syncBPJsonOnChain()
    } else {
      await syncBPJsonOffChain()
    }
  } catch (error) {
    console.log(error.message)
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

const syncCpuUsage = async () => {
  await eosmechanicsUtil.cpu()
  const { block, transaction } = (await eosmechanicsUtil.cpu()) || {}
  const producers = await find({
    owner: { _eq: block.producer }
  })
  const producer = producers.length ? producers[0] : null
  await insertUsage('cpu', {
    producer: producer.id,
    usage: transaction.processed.receipt.cpu_usage_us
  })
}

const syncRamUsage = async () => {
  const { block } = (await eosmechanicsUtil.ram()) || {}
  const producers = await find({
    owner: { _eq: block.producer }
  })
  const producer = producers.length ? producers[0] : null
  await insertUsage('ram', {
    producer: producer.id,
    usage: 1 // TODO: get ram usage from transaction or block
  })
}

const syncNetUsage = async () => {
  const { block } = (await eosmechanicsUtil.net()) || {}
  const producers = await find({
    owner: { _eq: block.producer }
  })
  const producer = producers.length ? producers[0] : null
  await insertUsage('net', {
    producer: producer.id,
    usage: 1 // TODO: get net usage from transaction or block
  })
}

const saveMissedBlocksFor = async (producerName, missedBlocks) => {
  if (missedBlocks < 1) {
    return
  }

  const producers = await find({
    owner: { _eq: producerName }
  })
  const producer = producers.length ? producers[0] : null
  await hasuraUtil.request(INSERT_MISSED_BLOCK, {
    producer: producer.id,
    value: missedBlocks
  })
}

const checkForMissedBlocks = async () => {
  let info = await eosApi.getInfo({})
  let lastProducer = info.head_block_producer
  let currentProducer = info.head_block_producer

  // wait until first turn change
  while (currentProducer === lastProducer) {
    console.log('waiting for first turn change')
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
        console.log(
          'check point',
          lastProducerIndex + 1,
          currentSchedule.active.producers.length
        )
        const nextProducerIndex =
          lastProducerIndex + 1 >= currentSchedule.active.producers.length
            ? 0
            : lastProducerIndex + 1
        currentProducer =
          currentSchedule.active.producers[nextProducerIndex].producer_name
      }

      if (lastProducer !== currentProducer) {
        // we have a new producer so we should save the missed blocks for the previous one
        console.log(
          `save data for ${lastProducer} missed bloks: ${missedBlocks} produced bloks: ${producedBlocks}`
        )
        await saveMissedBlocksFor(lastProducer, missedBlocks)
        producedBlocks = 0
        missedBlocks = 0
      }

      if (currentBlockNum === lastBlockNum) {
        // when the previous block and the current block are equals we have a missed block
        console.log(
          `Houston, we have a problem: one missed block from ${currentProducer} will impact the network`
        )
        missedBlocks += 1
      } else {
        // when the previous block and the current block are diferent we have a new block
        console.log(`new block from ${currentProducer}`)
        producedBlocks += 1
      }
      console.log(
        `current producer is : ${currentProducer} missedBlocks: ${missedBlocks} producedBlocks: ${producedBlocks}`
      )
      lastProducer = currentProducer
      lastBlockNum = currentBlockNum
    } catch (error) {
      console.log(error)
    }

    const endTime = new Date()
    const msDiff = endTime.getTime() - startTime.getTime()
    console.log(`finished after ${msDiff}`)

    if (msDiff < 500) {
      console.log(`will run again in ${500 - msDiff}`)
      await new Promise(resolve => setTimeout(() => resolve(), 501 - msDiff))
    }
  }
}

module.exports = {
  checkForMissedBlocks,
  syncProducers,
  syncProducersInfo,
  syncCpuUsage,
  syncRamUsage,
  syncNetUsage
}
