import { sequelizeUtil } from '../utils'

import { getGranularityFromRange } from '../utils/get-granularity-from-range'

export const getTokenHistory = async (range: string) => {
  const granularity = getGranularityFromRange(range)
  const [rows] = await sequelizeUtil.sequelize.query(`
    WITH interval AS (
      SELECT generate_series(
        date_trunc('${granularity}', now()) - '${range}'::interval,
        date_trunc('${granularity}', now()),
        '1 ${granularity}'::interval
      ) AS value
    )

    SELECT
      interval.value as datetime,
      sum(CASE WHEN transfer.type = 'incoming' THEN transfer.amount END)::numeric as incoming,
      sum(CASE WHEN transfer.type = 'outgoing' THEN transfer.amount END)::numeric as outgoing
    FROM
      interval
    LEFT JOIN 
      ( SELECT amount, timestamp, type FROM evm.transfer WHERE amount > 0 )
      AS transfer ON date_trunc('${granularity}', transfer.timestamp) = interval.value
    GROUP BY
      1
    ORDER BY
      1 ASC
  `)

  return rows
}
