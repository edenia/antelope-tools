import { gql } from 'graphql-request'

import { coreUtil } from '../../utils'
import { Param } from './interfaces'

interface ParamResponse {
  evm_param: Param[]
}

interface ParamOneResponse {
  insert_evm_param_one: {
    id: string
  }
}

const defaultParam = {
  id: '00000000-0000-0000-0000-000000000000',
  nextBlock: 0,
  isSynced: false,
  completeAt: null
}

export const save = async (
  nextBlock: number,
  isSynced: boolean = false,
  completeAt: number
) => {
  const mutation = gql`
    mutation ($payload: evm_param_insert_input!) {
      insert_evm_param_one(object: $payload) {
        id
      }
    }
  `

  const data = await coreUtil.hasura.default.request<ParamOneResponse>(
    mutation,
    {
      payload: {
        next_block: nextBlock,
        is_synced: isSynced,
        complete_at: completeAt
      }
    }
  )

  return data.insert_evm_param_one
}

export const update = async (
  id: string,
  nextBlock: number,
  isSynced: boolean = false,
  completeAt: number
) => {
  const mutation = gql`
    mutation ($id: uuid!, $payload: evm_param_set_input) {
      update_evm_param_by_pk(pk_columns: { id: $id }, _set: $payload) {
        id
        next_block
        is_synced
      }
    }
  `

  await coreUtil.hasura.default.request(mutation, {
    id,
    payload: {
      next_block: nextBlock,
      is_synced: isSynced,
      complete_at: completeAt
    }
  })
}

export const getState = async () => {
  const query = gql`
    query {
      evm_param(
        where: { id: { _neq: "00000000-0000-0000-0000-000000000000" } }
        limit: 1
      ) {
        id
        next_block
        is_synced
        complete_at
      }
    }
  `
  const data = await coreUtil.hasura.default.request<ParamResponse>(query)

  if (!data.evm_param.length) {
    return defaultParam
  }

  const state = data.evm_param[0]

  return {
    id: state.id,
    nextBlock: state.next_block,
    isSynced: state.is_synced,
    completeAt: state.complete_at
  }
}

export const saveOrUpdate = async (
  nextBlock: number,
  isSynced: boolean,
  completeAt: number
): Promise<void> => {
  const currentState = await getState()

  if (currentState === defaultParam) {
    await save(nextBlock, isSynced, completeAt)

    return
  }

  await update(currentState.id, nextBlock, isSynced, completeAt)
}
