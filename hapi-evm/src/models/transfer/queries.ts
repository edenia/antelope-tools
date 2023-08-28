import moment from 'moment'
import { gql } from 'graphql-request'

import { networkConfig } from '../../config'
import { coreUtil } from '../../utils'
import { Transfer, Type } from './interfaces'
import { historicalStatsModel } from '..'

// interface TransferResponse {
//   evm_transfer: Transfer[]
// }

interface TransferInsertOneResponse {
  insert_evm_transfer_one: {
    id: string
  }
}

interface TransferDeleteResponse {
  delete_evm_transfer: {
    affected_rows: number
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

  await historicalStatsModel.queries.saveOrIncrement({
    total_incoming_token: Number(payload.type === Type.incoming),
    total_outgoing_token: Number(payload.type === Type.outgoing)
  })

  if (moment(payload.timestamp).isBefore(moment().subtract(1, 'years'))) {
    return
  }

  const data = await coreUtil.hasura.default.request<TransferInsertOneResponse>(
    mutation,
    {
      payload
    }
  )

  return data.insert_evm_transfer_one
}

export const deleteOldTransfers = async () => {
  const mutation = gql`
    mutation ($date: timestamptz) {
      delete_evm_transfer(where: { timestamp: { _lt: $date } }) {
        affected_rows
      }
    }
  `

  await coreUtil.hasura.default.request<TransferDeleteResponse>(mutation, {
    date: moment()
      .subtract(networkConfig.keepHistoryForYears, 'years')
      .format('YYYY-MM-DD')
  })
}
