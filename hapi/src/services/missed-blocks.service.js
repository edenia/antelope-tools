const moment = require('moment')

const statsService = require('./stats.service')
const {
  sequelizeUtil,
  hasuraUtil,
  sleepFor,
  getGranularityFromRange
} = require('../utils')

const setScheduleHistory = items => {
  const mutation = `
    mutation ($items: [schedule_history_insert_input!]!) {
      insert_schedule_history(objects: $items, on_conflict: {constraint: schedule_history_version_key, update_columns: [first_block_at, last_block_at, first_block, last_block, producers, current, round_interval]}) {
        affected_rows
      }
    }
  `

  return hasuraUtil.request(mutation, { items })
}

const getCurrentVersion = async () => {
  const [rows] = await sequelizeUtil.query(`
    SELECT
      max(version) as version
    FROM
      schedule_history`)

  return rows.length > 0 && rows[0].version ? rows[0].version : -1
}

const setScheduleByDemux = async (state, payload) => {
  const currentVersion = await getCurrentVersion()
  const [rows] = await sequelizeUtil.query(`
    SELECT
      schedule_version as version,
      min(timestamp) as first_block_at,
      max(timestamp) as last_block_at,
      min(block_num) as first_block,
      max(block_num) as last_block
    FROM
      block_history
    WHERE schedule_version = ${currentVersion + 1}
    GROUP BY schedule_version `)
  const schedules = rows.map(row => {
    return {
      ...row,
      producers: payload.data.validators,
      version: parseInt(row.version),
      current: false,
      round_interval: payload.data.validators.length * 6
    }
  })

  await setScheduleHistory(schedules)
}

const getLastRoundInfo = async () => {
  const stats = await statsService.getStats()

  // if there is no stats we should try later
  if (!stats) {
    return null
  }

  // if there is no last block we should try later
  if (!stats.last_block_at) {
    return null
  }

  if (stats.last_round) {
    return {
      ...stats.last_round,
      last_block_at: stats.last_block_at
    }
  }

  // if there is no previous round we should start from round 0 and version 0
  const query = `
    query {
      schedule_history (where: {version: {_eq: 0}}) {
        schedule: version,
        first_block_at,
        interval: round_interval,
        producers
      }
    }
  `
  const { schedule_history: data } = await hasuraUtil.request(query)
  const scheduleHistoryInfo = data.length > 0 ? data[0] : null

  // if there is no rows for schedule_history table we should try later
  if (!scheduleHistoryInfo) {
    return null
  }

  return {
    number: -1,
    schedule: scheduleHistoryInfo.schedule,
    interval: scheduleHistoryInfo.interval,
    producers: scheduleHistoryInfo.producers,
    last_block_at: stats.last_block_at,
    completed_at: moment(scheduleHistoryInfo.first_block_at).subtract(
      500,
      'milliseconds'
    )
  }
}

const getBlocksInRange = async (start, end) => {
  const [rows] = await sequelizeUtil.query(`
      SELECT
        schedule_version,
        producer,
        block_num,
        block_id
      FROM
        block_history
      WHERE 
        "timestamp" BETWEEN '${start.toISOString()}' AND '${end.toISOString()}'
        AND producer <> ''`)

  return rows.map(row => ({
    ...row,
    schedule_version: parseInt(row.schedule_version)
  }))
}

const getScheduleByVersion = async version => {
  const query = `
    query {
      schedule_history(where: {version: {_eq: ${version}}}, limit: 1) {
        version
        producers
        round_interval
      }
    }  
  `
  const data = await hasuraUtil.request(query)

  return data?.schedule_history?.length > 0 ? data.schedule_history[0] : null
}

const addRoundHistory = items => {
  const mutation = `
    mutation ($items: [round_history_insert_input!]!) {
      insert_round_history(objects: $items) {
        affected_rows
      }
    }  
  `

  return hasuraUtil.request(mutation, { items })
}

const syncMissedBlocks = async () => {
  const lastRound = await getLastRoundInfo()

  // if there is no round to start try again in 1 minute
  if (!lastRound) {
    await sleepFor(60)
    syncMissedBlocks()

    return
  }

  const start = moment(lastRound.completed_at).add(500, 'milliseconds')
  const end = moment(start)
    .add(lastRound.interval, 'seconds')
    .subtract(500, 'milliseconds')

  // if the diference between the
  // last block time and the end time
  // is less than the round interval
  // then wait until the round end
  if (
    moment(lastRound.last_block_at).diff(end, 'seconds') < lastRound.interval
  ) {
    await sleepFor(60)
    syncMissedBlocks()

    return
  }

  const blocks = await getBlocksInRange(start, end)

  // if the first block comes from different schedule_version
  // then it's the end of the version in use
  if (blocks.length > 0 && blocks[0].schedule_version !== lastRound.schedule) {
    const newSchedule = await getScheduleByVersion(lastRound.schedule)

    // schedule version no yet in the history
    if (!newSchedule) {
      await sleepFor(60)
      syncMissedBlocks()

      return
    }

    lastRound.schedule += 1
    lastRound.number = 0
    lastRound.interval = newSchedule.round_interval
    lastRound.producers = newSchedule.producers

    await statsService.udpateStats({ last_round: lastRound })
    syncMissedBlocks()

    return
  }

  lastRound.number += 1
  lastRound.completed_at = end.toISOString()
  const roundHistory = lastRound.producers.map(producer => {
    const producerBlocks = blocks.filter(block => block.producer === producer)

    return {
      schedule: lastRound.schedule,
      number: lastRound.number,
      account: producer,
      started_at: start.toISOString(),
      completed_at: end.toISOString(),
      missed_blocks: 12 - producerBlocks.length,
      produced_blocks: producerBlocks.length
    }
  })

  await addRoundHistory(roundHistory)
  await statsService.udpateStats({ last_round: lastRound })
  syncMissedBlocks()
}

const getMissedBlocks = async (range = '3 Hours') => {
  const granularity = getGranularityFromRange(range)
  const [rows] = await sequelizeUtil.query(`
    WITH interval AS (
      SELECT generate_series(
        date_trunc('${granularity}', now()) - '${range}'::interval,
        date_trunc('${granularity}', now()),
        '1 ${granularity}'::interval
      ) AS value
    )
    
    SELECT
      interval.value as datetime,
      round_history.account,
      sum(round_history.missed_blocks) as missed,
      sum(round_history.produced_blocks) as produced,
      sum(round_history.missed_blocks)+sum(round_history.produced_blocks) as scheduled
    FROM 
      interval
    INNER JOIN 
      round_history ON date_trunc('${granularity}', round_history.completed_at) = interval.value
    GROUP BY 
      1, 
      account
    ORDER BY 
      1 ASC`)

  return rows
}

module.exports = {
  syncMissedBlocks,
  getMissedBlocks,
  setScheduleByDemux
}
