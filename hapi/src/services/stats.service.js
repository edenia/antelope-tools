const Boom = require('@hapi/boom')
const { BAD_REQUEST } = require('http-status-codes')
const moment = require('moment')

const { hasuraUtil, sequelizeUtil, sleepFor, eosUtil } = require('../utils')

const STAT_ID = 'bceb5b75-6cb9-45af-9735-5389e0664847'

const getTransactionsInTimeRage = async payload => {
  const query = `
    query($start: timestamptz!, $end: timestamptz!) {
      block: block_history_aggregate(
        where: { timestamp: { _gte: $start, _lte: $end } }
      ) {
        info: aggregate {
          sum {
            transactions_length
          }
        }
      }
    } 
  `
  const data = await hasuraUtil.request(query, payload)

  return data.block.info.sum.transactions_length || 0
}

const getNodesSummary = async payload => {
  const query = `
    query {
      producers: producer {
        bp_json
      }
    }
  `
  const data = await hasuraUtil.request(query, payload)
  let total = 0
  const totalByType = {}

  data.producers.forEach(producer => {
    producer.bp_json.nodes.forEach(node => {
      if (!totalByType[node.node_type]) {
        totalByType[node.node_type] = 0
      }

      totalByType[node.node_type]++
      total++
    })
  })

  return { total, ...totalByType }
}

const getBlockDistribution = async (range = '1 day') => {
  try {
    let totalBloks = 0
    let startTime

    if (range === 'all') {
      startTime = moment().subtract(20, 'years')
    } else {
      const [amount, unit] = range.split(' ')
      startTime = moment().subtract(parseInt(amount || 1), unit || 'day')
    }

    const query = `
      query ($startTime: timestamptz) {
        items: block_history_by_producer(args: {since: $startTime}) {
          id
          producer
          blocks
        }
      }
    `
    const data = await hasuraUtil.request(query, { startTime })

    data.items.forEach(item => {
      totalBloks += item.blocks
    })

    return data.items
      .map(item => ({
        account: item.producer || 'N/A',
        blocks: item.blocks,
        percent: item.blocks === 0 ? 0 : item.blocks / totalBloks
      }))
      .sort((a, b) => a.percent - b.percent)
  } catch (error) {
    console.log(error)
    throw new Boom.Boom(error.message, {
      statusCode: BAD_REQUEST
    })
  }
}

const getStats = async () => {
  const query = `
    query {
      stat: stat_by_pk(id: "${STAT_ID}") {
        id
        transactions_in_last_hour
        transactions_in_last_day
        transactions_in_last_week
        last_round
        last_block_at
        tps_all_time_high
        updated_at
        created_at
      }
    }  
  `
  const data = await hasuraUtil.request(query)

  return data.stat
}

const udpateStats = async payload => {
  const mutation = `
    mutation ($id: uuid!, $payload: stat_set_input!) {
      update_stat_by_pk(pk_columns: {id: $id}, _set: $payload) {
        id
      }
    }
  `
  await hasuraUtil.request(mutation, { id: STAT_ID, payload })
}

const insertStats = async payload => {
  const mutation = `
    mutation ($payload: stat_insert_input!) {
      insert_stat_one(object: $payload) {
        id
      }
    }  
  `
  await hasuraUtil.request(mutation, { payload: { id: STAT_ID, ...payload } })
}

const getLastTPSAllTimeHigh = async () => {
  const stats = await getStats()

  if (!stats) {
    return null
  }

  if (!stats.last_block_at) {
    return null
  }

  if (stats.tps_all_time_high) {
    return {
      ...stats.tps_all_time_high,
      last_block_at: stats.last_block_at
    }
  }

  const query = `
    query {
      schedule_history (where: {version: {_eq: 16}}) {
        first_block_at
      }
    }
  `
  const { schedule_history: data } = await hasuraUtil.request(query)
  const scheduleHistoryInfo = data.length > 0 ? data[0] : null

  if (!scheduleHistoryInfo) {
    return null
  }

  return {
    transactions_count: 0,
    last_block_at: stats.last_block_at,
    checked_at: moment(scheduleHistoryInfo.first_block_at)
      .subtract(1, 'second')
      .toISOString()
  }
}

const getBlockUsage = async blockNum => {
  const block = await eosUtil.getBlock(blockNum)
  const info = await eosUtil.getInfo()
  let cpuUsage = 0
  let netUsage = 0

  block.transactions.forEach(transaction => {
    cpuUsage += transaction.cpu_usage_us
    netUsage += transaction.net_usage_words
  })

  return {
    id: block.id,
    block_num: block.block_num,
    transactions_count: block.transactions.length,
    cpu_usage_us: cpuUsage,
    block_cpu_limit: info.block_cpu_limit,
    cpu_usage_percent: cpuUsage / info.block_cpu_limit,
    net_usage_words: netUsage,
    block_net_limit: info.block_net_limit,
    net_usage_percent: netUsage / info.block_net_limit
  }
}

const syncTPSAllTimeHigh = async () => {
  const lastValue = await getLastTPSAllTimeHigh()

  if (!lastValue) {
    await sleepFor(60)
    syncTPSAllTimeHigh()

    return
  }

  const start = moment(lastValue.checked_at).add(1, 'second')
  const end = moment(start).add(59, 'seconds')

  // if the diference between the
  // last block time and the end time
  // is less than 1 minute lets await
  if (moment(lastValue.last_block_at).diff(end, 'seconds') < 60) {
    await sleepFor(moment(lastValue.last_block_at).diff(end, 'seconds'))
    syncTPSAllTimeHigh()

    return
  }

  const [rows] = await sequelizeUtil.query(`
    WITH interval AS (
      SELECT generate_series(
        date_trunc('second', '${start.toISOString()}'::timestamp),
        date_trunc('second', '${end.toISOString()}'::timestamp),
        '1 second'::interval
      ) AS value
    ),
    tps as (
      SELECT
        interval.value as datetime,
        sum(block_history.transactions_length) as transactions_count,
        array_to_string(array_agg(block_history.block_num), ',') as blocks

      FROM 
        interval
      INNER JOIN 
        block_history ON block_history.timestamp between '${start.toISOString()}'::timestamp and '${end.toISOString()}'::timestamp and date_trunc('second', block_history.timestamp) = interval.value
      GROUP BY 
        1
      ORDER BY 
        2 DESC
     )
     SELECT datetime, transactions_count, blocks FROM tps LIMIT 1
  `)

  if (!rows.length) {
    await sleepFor(60)
    syncTPSAllTimeHigh()
  }

  const newValue = rows[0]
  const blocks = newValue.blocks.split(',')

  for (let index = 0; index < blocks.length; index++) {
    const block = await getBlockUsage(blocks[index])
    blocks[index] = block
  }

  if (parseInt(newValue.transactions_count) < lastValue.transactions_count) {
    await udpateStats({
      tps_all_time_high: {
        ...lastValue,
        checked_at: end.toISOString()
      }
    })

    return
  }

  await udpateStats({
    tps_all_time_high: {
      ...newValue,
      checked_at: end.toISOString(),
      transactions_count: parseInt(newValue.transactions_count),
      blocks
    }
  })
  syncTPSAllTimeHigh()
}

const sync = async () => {
  const transactionsInLastWeek = await getTransactionsInTimeRage({
    start: moment().subtract(1, 'week'),
    end: moment()
  })
  const payload = {
    transactions_in_last_hour: await getTransactionsInTimeRage({
      start: moment().subtract(1, 'hour'),
      end: moment()
    }),
    transactions_in_last_day: await getTransactionsInTimeRage({
      start: moment().subtract(1, 'day'),
      end: moment()
    }),
    transactions_in_last_week: transactionsInLastWeek,
    average_daily_transactions_in_last_week: transactionsInLastWeek / 7,
    nodes_summary: await getNodesSummary()
  }
  const stats = await getStats()
  if (stats) {
    await udpateStats(payload)
    return
  }
  await insertStats(payload)
}

module.exports = {
  sync,
  syncTPSAllTimeHigh,
  getBlockDistribution,
  getStats,
  udpateStats
}
