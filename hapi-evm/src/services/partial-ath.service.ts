import { Stats } from '../models/stats/interfaces'
import { sequelizeUtil } from '../utils'

export const getATHInRange = async (
  lowerBlockNumber: number,
  upperBlockNumber: number
) => {
  const [rows] = await sequelizeUtil.sequelize.query(`
  SELECT
    ath_in_range.blocks AS ath_blocks,
    COALESCE(
        (ath_in_range.max_transaction_sum) :: numeric,
        (0) :: numeric
    ) AS ath_transactions_count,
    COALESCE(ath_in_range.gas_used_sum, (0) :: numeric) AS ath_gas_used
    FROM
    (
      WITH subquery AS (
        SELECT
          array_to_string(array_agg(block.number), ',' :: text) AS blocks,
          sum(jsonb_array_length(block.transactions)) AS total_transaction_count,
          sum(block.gas_used) AS gas_used_sum
        FROM
          evm.block
        WHERE (block.number >= ${lowerBlockNumber} and block.number <= ${upperBlockNumber})
        GROUP BY
          block."timestamp"
      )
      SELECT
        q2.blocks,
        q1.max_transaction_sum,
        q2.gas_used_sum
      FROM
        (
          (
            SELECT
              max(subquery.total_transaction_count) AS max_transaction_sum
            FROM
              subquery
          ) q1
          JOIN subquery q2 ON (
            (
              q1.max_transaction_sum = q2.total_transaction_count
            )
          )
        )
      LIMIT
        1
    ) ath_in_range
  `)

  const row = rows[0] as Stats

  return {
    ath_blocks: row?.ath_blocks,
    ath_transactions_count: Number(row?.ath_transactions_count) || 0,
    ath_gas_used: Number(row?.ath_gas_used) || 0
  } as Stats
}
