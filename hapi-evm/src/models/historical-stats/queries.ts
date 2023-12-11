import { gql } from 'graphql-request'

import { coreUtil } from '../../utils'
import { HistoricalStats, HistoricalStatsIncInput } from './interfaces'

interface HistoricalStatsResponse {
  evm_historical_stats: HistoricalStats[]
}

interface HistoricalStatsOneResponse {
  insert_evm_historical_stats_one: {
    id: string
  }
}

const defaultHistoricalStats = {
  id: '00000000-0000-0000-0000-000000000000',
  total_transactions: 0,
  total_incoming_token: 0,
  total_outgoing_token: 0,
  tps_all_time_high: {
    blocks: [],
    transactions_count: 0,
    gas_used: 0
  }
}

const save = async (payload: HistoricalStats) => {
  const mutation = gql`
    mutation ($payload: evm_historical_stats_insert_input!) {
      insert_evm_historical_stats_one(object: $payload) {
        id
      }
    }
  `

  const data =
    await coreUtil.hasura.default.request<HistoricalStatsOneResponse>(
      mutation,
      {
        payload
      }
    )

  return data.insert_evm_historical_stats_one
}

const update = async (
  id: string,
  inc: HistoricalStatsIncInput,
  payload: HistoricalStats
) => {
  const mutation = gql`
    mutation (
      $id: uuid!
      $inc: evm_historical_stats_inc_input
      $payload: evm_historical_stats_set_input
    ) {
      update_evm_historical_stats_by_pk(
        _inc: $inc
        pk_columns: { id: $id }
        _set: $payload
      ) {
        id
      }
    }
  `

  await coreUtil.hasura.default.request(mutation, {
    id,
    inc,
    payload
  })
}

export const getState = async () => {
  const query = gql`
    query {
      evm_historical_stats(
        where: { id: { _neq: "00000000-0000-0000-0000-000000000000" } }
        limit: 1
      ) {
        id
        total_transactions
        total_incoming_token
        total_outgoing_token
        tps_all_time_high
      }
    }
  `
  const data =
    await coreUtil.hasura.default.request<HistoricalStatsResponse>(query)

  if (!data.evm_historical_stats.length) {
    return defaultHistoricalStats
  }

  const state = data.evm_historical_stats[0]

  return {
    id: state.id || defaultHistoricalStats.id,
    total_transactions:
      state.total_transactions || defaultHistoricalStats.total_transactions,
    total_incoming_token:
      state.total_incoming_token || defaultHistoricalStats.total_incoming_token,
    total_outgoing_token:
      state.total_outgoing_token || defaultHistoricalStats.total_outgoing_token,
    tps_all_time_high:
      state.tps_all_time_high || defaultHistoricalStats.tps_all_time_high
  }
}

export const saveOrUpdate = async (payload: HistoricalStats): Promise<void> => {
  const currentState = await getState()

  if (currentState === defaultHistoricalStats) {
    await save(payload)

    return
  }

  await update(currentState.id, {}, payload)
}

export const saveOrIncrement = async (
  payload: HistoricalStatsIncInput
): Promise<void> => {
  const currentState = await getState()

  if (currentState === defaultHistoricalStats) {
    await save(payload)

    return
  }

  await update(currentState.id, payload, {})
}
