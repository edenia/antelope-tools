const { sequelizeUtil, getGranularityFromRange } = require('../utils')

const getTransactions = async (range = '3 Hours') => {
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
      avg(block_history.transactions_length)::integer as transactions_count
    FROM
      interval
    LEFT JOIN 
      ( SELECT * FROM block_history WHERE transactions_length > 0 ) 
      AS block_history ON date_trunc('${granularity}', block_history.timestamp) = interval.value
    GROUP BY
      1
    ORDER BY
      1 ASC
  `)

  return rows
}

module.exports = {
  getTransactions
}
