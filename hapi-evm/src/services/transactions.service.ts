import Web3 from 'web3'

import { sequelizeUtil } from '../utils'
import { networkConfig } from '../config'
import { getGranularityFromRange } from '../utils/get-granularity-from-range'

export const getTransactions = async (range: string) => {
  const granularity = getGranularityFromRange(range)
  const httpProvider = new Web3.providers.HttpProvider(
    networkConfig.evmEndpoint
  )
  const web3 = new Web3(httpProvider)
  const lastBlock = await web3.eth.getBlock('latest')
  const gasLimit = Number(lastBlock?.gasLimit) || 1000000000

  const [rows] = await sequelizeUtil.sequelize.query(`
    WITH interval AS (
      SELECT generate_series(
        date_trunc('${granularity}', now()) - '${range}'::interval,
        date_trunc('${granularity}', now()),
        '1 ${granularity}'::interval
      ) AS value
    )

    SELECT
      interval.value AS datetime,
      sum(transactions_count) AS transactions_count,
      avg(block.gas_used)::numeric(6,3) AS avg_gas_used
    FROM
      interval
    LEFT JOIN 
      ( SELECT transactions_count, timestamp, gas_used / ${gasLimit} * 100 AS gas_used 
        FROM ( SELECT block_hash, count(1) AS transactions_count 
               FROM evm.transaction GROUP BY block_hash) 
        AS subquery INNER JOIN evm.block ON evm.block.hash = block_hash) 
      AS block ON date_trunc('${granularity}', block.timestamp) = interval.value
    GROUP BY
      1
    ORDER BY
      1 ASC
  `)

  return rows
}
