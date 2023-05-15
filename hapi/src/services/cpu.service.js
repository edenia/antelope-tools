const {
  eosmechanicsUtil,
  hasuraUtil,
  sequelizeUtil,
  getGranularityFromRange
} = require('../utils')
const { eosConfig } = require('../config')

const saveBenchmark = async payload => {
  const mutation = `
    mutation ($account: String!, $usage: Int!) {
      insert_cpu_one (object: {account: $account, usage: $usage}) {
        id
        account
        usage
      }
    }
  `

  const data = await hasuraUtil.request(mutation, payload)

  return data.insert_cpu_one
}

const cleanOldBenchmarks = async () => {
  const date = new Date()

  date.setFullYear(date.getFullYear() - 1)

  const mutation = `
    mutation ($date: timestamptz) {
      delete_cpu (where: {created_at: {_lt: $date}}) {
        affected_rows
      }
    }
  `

  await hasuraUtil.request(mutation, { date })
}

const worker = async () => {
  if (!eosConfig.eosmechanics.account || !eosConfig.eosmechanics.password) {
    return
  }

  try {
    const { block, transaction } = await eosmechanicsUtil.cpu()
    await saveBenchmark({
      account: block.producer,
      usage: transaction.processed.receipt.cpu_usage_us
    })
  } catch (error) {
    console.error('cpuService.sync', error)
  }

  await cleanOldBenchmarks()
}

const getBenchmark = async (range = '3 Hours') => {
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
      cpu.account,
      count(cpu.usage) as transactions,
      avg(cpu.usage) as usage
    FROM 
      interval
    INNER JOIN 
      cpu ON date_trunc('${granularity}', cpu.created_at) = interval.value
    GROUP BY 
      1, 
      cpu.account
    ORDER BY 
      1 ASC`)

  return rows
}

module.exports = {
  worker,
  getBenchmark
}
