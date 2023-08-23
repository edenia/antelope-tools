import { gql } from 'graphql-request'

import { coreUtil } from '../../utils'
import { Stats } from './interfaces'

interface StatsResponse {
  evm_stats: Stats[]
}

export const getPartialATH = async () => {
  const query = gql`
    query {
      evm_stats(limit: 1) {
        ath_blocks
        ath_transactions_count
        ath_gas_used
      }
    }
  `
  const data = await coreUtil.hasura.default.request<StatsResponse>(query)
  const state = data.evm_stats[0]

  return state
}
