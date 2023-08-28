import { gql } from 'graphql-request'

import { coreUtil } from '../../utils'
import { HyperionState } from './interfaces'

interface HyperionStateResponse {
  evm_hyperion_state: HyperionState[]
}

interface HyperionStateInsertOneResponse {
  insert_evm_hyperion_state_one: {
    id: string
  }
}

export const save = async (lastSyncedAt: string) => {
  const mutation = gql`
    mutation ($payload: evm_hyperion_state_insert_input!) {
      insert_evm_hyperion_state_one(object: $payload) {
        id
      }
    }
  `

  const data =
    await coreUtil.hasura.default.request<HyperionStateInsertOneResponse>(
      mutation,
      {
        payload: {
          last_synced_at: lastSyncedAt
        }
      }
    )

  return data.insert_evm_hyperion_state_one
}

export const update = async (id: string, lastSyncedAt: string) => {
  const mutation = gql`
    mutation ($id: uuid!, $payload: evm_hyperion_state_set_input) {
      update_evm_hyperion_state_by_pk(pk_columns: { id: $id }, _set: $payload) {
        id
        last_synced_at
      }
    }
  `

  await coreUtil.hasura.default.request(mutation, {
    id,
    payload: {
      last_synced_at: lastSyncedAt
    }
  })
}

export const getState = async () => {
  const query = gql`
    query {
      evm_hyperion_state(
        where: { id: { _neq: "00000000-0000-0000-0000-000000000000" } }
        limit: 1
      ) {
        id
        last_synced_at
      }
    }
  `
  const data = await coreUtil.hasura.default.request<HyperionStateResponse>(
    query
  )

  if (!data.evm_hyperion_state.length) {
    return
  }

  const state = data.evm_hyperion_state[0]

  return {
    id: state.id,
    lastSyncedAt: state.last_synced_at
  }
}

export const saveOrUpdate = async (lastSyncedAt: string) => {
  const currentState = await getState()

  if (!currentState) {
    await save(lastSyncedAt)

    return
  }

  await update(currentState.id, lastSyncedAt)
}
