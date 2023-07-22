import { gql } from 'graphql-request'

import { coreUtil } from '../../utils'
import { IncomingTransfer } from './interfaces'

// interface IncomingTransferResponse {
//   evm_incoming_transfer: IncomingTransfer[]
// }

interface IncomingTransferInsertOneResponse {
  insert_evm_incoming_transfer_one: {
    id: string
  }
}

export const save = async (payload: IncomingTransfer) => {
  const mutation = gql`
    mutation ($payload: evm_incoming_transfer_insert_input!) {
      insert_evm_incoming_transfer_one(object: $payload) {
        id
      }
    }
  `

  const data =
    await coreUtil.hasura.default.request<IncomingTransferInsertOneResponse>(
      mutation,
      {
        payload
      }
    )

  return data.insert_evm_incoming_transfer_one
}
