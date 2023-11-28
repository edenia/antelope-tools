import { gql } from 'graphql-request'

import { coreUtil } from '../../utils'
import { historicalStatsModel } from '..'

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

export const updateATH = async (partialATH: Stats) => {
  if (!partialATH) return
  const currentState = await historicalStatsModel.queries.getState()
  if (
    currentState.tps_all_time_high.transactions_count >
    partialATH.ath_transactions_count
  )
    return
  if (
    currentState.tps_all_time_high.transactions_count ||
    0 < partialATH.ath_transactions_count
  ) {
    await historicalStatsModel.queries.saveOrUpdate({
      tps_all_time_high: {
        blocks: partialATH.ath_blocks.split(','),
        transactions_count: partialATH.ath_transactions_count,
        gas_used: partialATH.ath_gas_used
      }
    })
  }
}
