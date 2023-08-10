import { gql } from 'graphql-request'

import { coreUtil } from '../../utils'
import { Transfer } from './interfaces'

// interface TransferResponse {
//   evm_transfer: Transfer[]
// }

interface TransferInsertOneResponse {
  insert_evm_transfer_one: {
    id: string
  }
}

export const save = async (payload: Transfer) => {
  const mutation = gql`
    mutation ($payload: evm_transfer_insert_input!) {
      insert_evm_transfer_one(object: $payload) {
        id
      }
    }
  `

  const data = await coreUtil.hasura.default.request<TransferInsertOneResponse>(
    mutation,
    {
      payload
    }
  )

  return data.insert_evm_transfer_one
}
