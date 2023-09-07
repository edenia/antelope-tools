const Boom = require('@hapi/boom')
const { StatusCodes } = require('http-status-codes')
const moment = require('moment')

const { hasuraUtil, sequelizeUtil, sleepFor } = require('../utils')

const STAT_ID = 'bceb5b75-6cb9-45af-9735-5389e0664847'

const _getScheduleHystory = async () => {
  const query = `
    query {
      schedule_history (limit: 1, order_by: {version: asc}) {
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
    WHERE completed_at
    BETWEEN '${start}'::timestamp AND '${end}'::timestamp
    GROUP BY account
  `)

  return rows
}

const getTransactionsInTimeRage = async (start, end) => {
  const [rows] = await sequelizeUtil.query(`
    SELECT
      sum(transactions_length)::integer as transactions_count,
      avg(block_history.cpu_usage)::numeric(5,2) as cpu_usage,
      avg(block_history.net_usage)::numeric(6,3) as net_usage
    FROM
      block_history
    WHERE
      timestamp between '${start.toISOString()}' and '${end.toISOString()}'
  `)

  return rows?.[0]
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

  rows.forEach(row => {
    const nodeType = row.node_type || 'unknown'

    if (Array.isArray(nodeType)) {
      nodeType = nodeType.map(type => (type === 'p2p' ? 'seed' : type))
      nodeType.sort()
    }

    if (payload[nodeType]) {
      payload[nodeType] += row.nodes_count
    } else {
      payload[nodeType] = row.nodes_count
    }

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
        missed_blocks_checked_at
        updated_at
        created_at
      }
    }  
  `
  const data = await hasuraUtil.request(query)

  return data.stat
}

const getCurrentMissedBlock = async () => {
  let lastBlockAt = null
  let data = null
  let end = null
  let start = null

  const stats = await getStats()

  if (!stats) return

  if (stats.missed_blocks_checked_at && stats.last_round) {
    data = stats.missed_blocks
    lastBlockAt = stats.last_round.completed_at
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
        missed_blocks: {},
        missed_blocks_checked_at: end.toISOString()
      })

      getCurrentMissedBlock()

      return
    }
  }

  start = moment(stats.missed_blocks_checked_at).add(1, 'second')
  end = moment(start).add(59, 'seconds')

  if (_checkDateGap(lastBlockAt, end)) {
    await sleepFor(moment(lastBlockAt).diff(end, 'seconds'))
    getCurrentMissedBlock()

    return
  }

  const rows = await _getMissedBlock(start.toISOString(), end.toISOString())

  if (!rows.length) {
    await udpateStats({
      missed_blocks: data,
      missed_blocks_checked_at: end.toISOString()
    })

    getCurrentMissedBlock()

    return
  }

  const newData = data

  rows.forEach((element) => {
    const sum = parseInt(element.sum)

    if (sum > 0) {
      newData[element.account] = sum + (parseInt(newData[element.account]) || 0)
    }
  })

  await udpateStats({
    missed_blocks: newData,
    missed_blocks_checked_at: end.toISOString()
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

  return stats.tps_all_time_high
}

const getTimestampBlock = async (position) => {
  const query = `
      query {
        blocks: block_history(limit: 1, order_by: {block_num: ${
          position === 'first' ? 'asc' : 'desc'
        }}, where: {producer: {_neq: "NULL"}}) {
          timestamp
        }
      }
    `

  const data = await hasuraUtil.request(query)

  return data?.blocks[0]?.timestamp
}

const syncTPSAllTimeHigh = async () => {
  const lastValue = await getLastTPSAllTimeHigh()

  let start
  let end

  if (!lastValue) {
    const firstBlockInDB = new Date(await getTimestampBlock('first'))

    start = moment(firstBlockInDB)
    end = moment(start).add(
      59 + (500 - firstBlockInDB.getMilliseconds()) / 1000,
      'seconds'
    )
  } else {
    start = moment(lastValue.checked_at).add(0.5, 'second')
    end = moment(start).add(59.5, 'seconds')
  }

  const lastBlockInDB = await getTimestampBlock('last')
  const diff = end.diff(moment(new Date(lastBlockInDB)), 'seconds')

  if (diff >= 0) {
    await sleepFor(diff)
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
        avg(block_history.cpu_usage) as cpu_usage,
        avg(block_history.net_usage) as net_usage,
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
     SELECT datetime, transactions_count::integer, cpu_usage::numeric(5,2), net_usage::numeric(6,3), blocks FROM tps LIMIT 1
  `)

  const newValue = rows[0]

  if (
    newValue &&
    (!lastValue ||
      parseInt(newValue.transactions_count) >= lastValue.transactions_count)
  ) {
    await udpateStats({
      tps_all_time_high: {
        ...newValue,
        blocks: newValue.blocks.split(','),
        checked_at: end.toISOString()
      }
    })
    syncTPSAllTimeHigh()

    return
  }

  await udpateStats({
    tps_all_time_high: {
      ...lastValue,
      checked_at: end.toISOString()
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

const getTransactionsStats = async (range) => {
  const transactionsStats = await getTransactionsInTimeRage(
    moment().subtract(1, range),
    moment()
  )

  return {
    [`transactions_in_last_${range}`]:
      transactionsStats?.transactions_count || 0,
    [`average_cpu_usage_in_last_${range}`]: transactionsStats?.cpu_usage || 0,
    [`average_net_usage_in_last_${range}`]: transactionsStats?.net_usage || 0
  }
}

const syncTransactionsInfo = async () => {
  const ranges = ['day', 'hour', 'week']
  let payload

  for (const range of ranges) {
    const stats = await getTransactionsStats(range)

    payload = {
      ...payload,
      ...stats
    }
  }

  payload.average_daily_transactions_in_last_week =
    payload.transactions_in_last_day / 7 || 0

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
  getCurrentMissedBlock
}
