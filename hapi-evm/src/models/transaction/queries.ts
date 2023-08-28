import { gql } from 'graphql-request'

import { coreUtil } from '../../utils'
import { OperationType, TableType, Operation } from '../default.model'

import { CappedTransaction } from './interfaces'

interface TransactionResponse {
  evm_transaction: CappedTransaction[]
}

interface TransactionAggregateResponse {
  evm_transaction_aggregate: {
    aggregate: {
      count: number
    }
  }
}

interface TransactionInsertOneResponse {
  insert_evm_transaction_one: {
    hash: string
  }
}

const internal_get = async <T>(
  type: OperationType = Operation.query,
  table: TableType,
  parameters: string,
  // TODO: not only accept where but also additional content
  // such as limit, order, etc
  where: object,
  attributes: string,
  operation?: string
): Promise<T> => {
  const gqlObj = gql`
      ${type} (${parameters}) {
        ${table}${operation ? `_${operation}` : ''}(where: $where) {
          ${attributes}
        }
      }
    `

  return await coreUtil.hasura.default.request<T>(gqlObj, {
    where
  })
}

export const exist = async (hash: string) => {
  const result = await internal_get<TransactionAggregateResponse>(
    Operation.query,
    'evm_transaction',
    '$where: evm_transaction_bool_exp!',
    { hash: { _eq: hash } },
    'aggregate { count }',
    'aggregate'
  )

  return result.evm_transaction_aggregate.aggregate.count > 0
}

const get = async (where: object, many = false) => {
  const result = await internal_get<TransactionResponse>(
    'query',
    'evm_transaction',
    '$where: evm_transaction_bool_exp!',
    where,
    'hash, gas_used, transactions, number, timestamp'
  )

  return many ? result.evm_transaction : result.evm_transaction[0]
}

export const add_or_modify = async (transaction: CappedTransaction) => {
  const mutation = gql`
    mutation ($evm_transaction: evm_transaction_insert_input!) {
      insert_evm_transaction_one(object: $evm_transaction) {
        hash
      }
    }
  `
  const { insert_evm_transaction_one: data } =
    await coreUtil.hasura.default.request<TransactionInsertOneResponse>(
      mutation,
      {
        evm_transaction: transaction
      }
    )

  return data
}

export default {
  exist,
  get,
  add_or_modify
}
