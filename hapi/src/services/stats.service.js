const Boom = require('@hapi/boom')
const { BAD_REQUEST } = require('http-status-codes')
const moment = require('moment')

const { hasuraUtil } = require('../utils')

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
      stat(limit: 1) {
        id
        transactions_in_last_hour
        transactions_in_last_day
        transactions_in_last_week
        updated_at
        created_at
      }
    } 
  `
  const data = await hasuraUtil.request(query)

  return data.stat.length > 0 ? data.stat[0] : null
}

const udpateStats = async (id, payload) => {
  const mutation = `
    mutation ($id: uuid!, $payload: stat_set_input!) {
      update_stat_by_pk(pk_columns: {id: $id}, _set: $payload) {
        id
      }
    }
  `
  await hasuraUtil.request(mutation, { id, payload })
}

const insertStats = async payload => {
  const mutation = `
    mutation ($payload: stat_insert_input!) {
      insert_stat_one(object: $payload) {
        id
      }
    }  
  `
  await hasuraUtil.request(mutation, { payload })
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
    await udpateStats(stats.id, payload)

    return
  }

  await insertStats(payload)
}

module.exports = {
  sync,
  getBlockDistribution
}
