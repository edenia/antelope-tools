const Boom = require('@hapi/boom')
const { StatusCodes } = require('http-status-codes')
const moment = require('moment')

const { hasuraUtil, sequelizeUtil, sleepFor, eosUtil } = require('../utils')
const transactionService = require('./transactions.service')

const STAT_ID = 'bceb5b75-6cb9-45af-9735-5389e0664847'

const _getScheduleHystory = async () => {
  const query = `
    query {
      schedule_history (where: {version: {_eq: 0}}) {
        first_block_at
      }
    }
  `
  const { schedule_history: data } = await hasuraUtil.request(query)

  return data.length > 0 ? data[0] : null
}

const _checkDateGap = (start, end) => {
  /*
  if the diference between the
  last block time and the end time
  is less than 1 minute lets await
  */

  return moment(start).diff(end, 'seconds') < 60
}

const _getMissedBlock = async (start, end) => {
  const [rows] = await sequelizeUtil.query(`
    SELECT account, sum(missed_blocks)
    FROM round_history
    WHERE updated_at
    BETWEEN '${start}'::timestamp AND '${end}'::timestamp
    GROUP BY account
  `)

  return rows
}

const getTransactionsInTimeRage = async (start, end) => {
  const [rows] = await sequelizeUtil.query(`
    SELECT
      sum(transactions_length)::integer as transactions_count
    FROM
      block_history
    WHERE
      timestamp between '${start.toISOString()}' and '${end.toISOString()}'
  `)

  return rows?.[0]?.transactions_count || 0
}

const getNodesSummary = async () => {
  let total = 0
  const payload = {}
  const [rows] = await sequelizeUtil.query(`
    SELECT
      type as node_type,
      count(*)::integer as nodes_count
    FROM 
      node
    GROUP BY 
      type
  `)

  rows.forEach((row) => {
    payload[row.node_type || 'unknown'] = row.nodes_count
    total += row.nodes_count
  })

  return { ...payload, total }
}

const getUniqueLocations = async () => {
  const [rows] = await sequelizeUtil.query(`
    SELECT 
      bp_json->'org'->'location'->>'country' as type, 
      count(*)::integer as producers_count, 
      STRING_AGG (owner, ',') as producers
    FROM 
      producer
    GROUP BY 
      bp_json->'org'->'location'->>'country'
    ORDER BY 
      producers_count DESC
  `)

  return {
    count: rows?.length || 0,
    details: rows
  }
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

    data.items.forEach((item) => {
      totalBloks += item.blocks
    })

    return data.items
      .map((item) => ({
        account: item.producer || 'N/A',
        blocks: item.blocks,
        percent: item.blocks === 0 ? 0 : item.blocks / totalBloks
      }))
      .sort((a, b) => a.percent - b.percent)
  } catch (error) {
    console.log(error)
    throw new Boom.Boom(error.message, {
      statusCode: StatusCodes.BAD_REQUEST
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
        average_daily_transactions_in_last_week
        last_round
        last_block_at
        tps_all_time_high
        missed_blocks
        transaction_history
        updated_at
        created_at
      }
    }  
  `
  const data = await hasuraUtil.request(query)

  return data.stat
}

const formatTransactionHistory = async () => {
  let txrHistory = {}
  const intervals = [
    '3 Hours',
    '6 Hours',
    '12 Hours',
    '1 Day',
    '4 Days',
    '7 Days',
    '14 Days',
    '1 Month',
    '2 Months',
    '3 Months',
    '6 Months',
    '1 Year'
  ]

  const stats = await getStats()

  if (!stats) return

  for (const interval of intervals) {
    const data = await transactionService.getTransactions(interval)

    txrHistory = { ...txrHistory, [interval]: data }
  }

  await udpateStats({
    transaction_history: txrHistory
  })
}

const getCurrentMissedBlock = async () => {
  let lastBlockAt = null
  let data = null
  let end = null
  let start = null

  const stats = await getStats()

  if (!stats) return

  if (stats.missed_blocks) {
    data = stats.missed_blocks
    lastBlockAt = stats.last_block_at
  } else {
    const scheduleHistoryInfo = await _getScheduleHystory()

    start = moment(scheduleHistoryInfo.first_block_at).add(1, 'second')
    end = moment(start).add(59, 'seconds')

    const rowsInitial = await _getMissedBlock(
      start.toISOString(),
      end.toISOString()
    )

    if (!rowsInitial.length) {
      await udpateStats({
        missed_blocks: {
          checked_at: end.toISOString()
        }
      })

      getCurrentMissedBlock()

      return
    }
  }

  start = moment(data.checked_at).add(1, 'second')
  end = moment(start).add(59, 'seconds')

  if (_checkDateGap(lastBlockAt, end)) {
    await sleepFor(moment(lastBlockAt).diff(end, 'seconds'))
    getCurrentMissedBlock()

    return
  }

  const rows = await _getMissedBlock(start.toISOString(), end.toISOString())

  if (!rows.length) {
    await udpateStats({
      missed_blocks: {
        ...data,
        checked_at: end.toISOString()
      }
    })

    getCurrentMissedBlock()

    return
  }

  let newData = data

  rows.forEach((element) => {
    if (newData[element.account]) {
      newData = {
        ...newData,
        [element.account]: `${
          parseInt(newData[element.account]) + parseInt(element.sum)
        }`
      }
    } else {
      newData = { ...newData, [element.account]: element.sum }
    }
  })

  await udpateStats({
    missed_blocks: {
      ...newData,
      checked_at: end.toISOString()
    }
  })

  getCurrentMissedBlock()
}

const udpateStats = async (payload) => {
  const mutation = `
    mutation ($id: uuid!, $payload: stat_set_input!) {
      update_stat_by_pk(pk_columns: {id: $id}, _set: $payload) {
        id
      }
    }
  `
  await hasuraUtil.request(mutation, { id: STAT_ID, payload })
}

const insertStats = async (payload) => {
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

  if (!stats || !stats.last_block_at) return null

  if (stats.tps_all_time_high) {
    return {
      ...stats.tps_all_time_high,
      last_block_at: stats.last_block_at
    }
  }

  const scheduleHistoryInfo = await _getScheduleHystory()

  if (!scheduleHistoryInfo) return null

  return {
    transactions_count: 0,
    last_block_at: stats.last_block_at,
    checked_at: moment(scheduleHistoryInfo.first_block_at)
      .subtract(1, 'second')
      .toISOString()
  }
}

const getBlockUsage = async (blockNum) => {
  const block = await eosUtil.getBlock(blockNum)
  const info = await eosUtil.getInfo()
  let cpuUsage = 0
  let netUsage = 0

  block.transactions.forEach((transaction) => {
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

  if (_checkDateGap(lastValue.last_block_at, end)) {
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
     SELECT datetime, transactions_count::integer, blocks FROM tps LIMIT 1
  `)

  if (!rows.length) {
    await udpateStats({
      tps_all_time_high: {
        ...lastValue,
        checked_at: end.toISOString()
      }
    })
    syncTPSAllTimeHigh()

    return
  }

  const newValue = rows[0]

  if (parseInt(newValue.transactions_count) < lastValue.transactions_count) {
    await udpateStats({
      tps_all_time_high: {
        ...lastValue,
        checked_at: end.toISOString()
      }
    })
    syncTPSAllTimeHigh()

    return
  }

  const blocks = newValue.blocks.split(',')

  for (let index = 0; index < blocks.length; index++) {
    const block = await getBlockUsage(blocks[index])

    blocks[index] = block
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
  const payload = {
    nodes_summary: await getNodesSummary(),
    unique_locations: await getUniqueLocations()
  }
  const stats = await getStats()

  if (stats) {
    await udpateStats(payload)
    return
  }
  await insertStats(payload)
}

const syncTransactionsInfo = async () => {
  const transactionsInLastWeek = await getTransactionsInTimeRage(
    moment().subtract(1, 'week'),
    moment()
  )
  const payload = {
    transactions_in_last_hour: await getTransactionsInTimeRage(
      moment().subtract(1, 'hour'),
      moment()
    ),
    transactions_in_last_day: await getTransactionsInTimeRage(
      moment().subtract(1, 'day'),
      moment()
    ),
    transactions_in_last_week: transactionsInLastWeek,
    average_daily_transactions_in_last_week: transactionsInLastWeek / 7
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
  syncTransactionsInfo,
  syncTPSAllTimeHigh,
  getBlockDistribution,
  getStats,
  udpateStats,
  getCurrentMissedBlock,
  formatTransactionHistory
}
