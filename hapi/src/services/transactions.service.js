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
      interval.value AS datetime,
      SUM(block_history.transactions_length)::integer AS transactions_count,
      AVG(block_history.cpu_usage)::numeric(5,2) AS cpu,
      AVG(block_history.net_usage)::numeric(6,3) AS net
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
