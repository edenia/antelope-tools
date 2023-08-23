import moment from 'moment'
import { gql } from 'graphql-request'

import { coreUtil } from '../../utils'
import { OperationType, TableType, Operation } from '../default.model'
import { CappedBlock } from './interfaces'

interface BlockAggregateResponse {
  evm_block_aggregate: {
    aggregate: {
      count: number
    }
  }
}

interface BlockResponse {
  evm_block: CappedBlock[]
}

interface BlockInsertOneResponse {
  insert_evm_block_one: {
    hash: string
  }
}

interface BlockDeleteResponse {
  delete_evm_block: {
    affected_rows: number
  }
}

const internal_get = async <T>(
  type: OperationType = Operation.query,
  table: TableType,
  parameters: string,
  // TODO: not only accept where but also additional content
  // such as limit, order, etc
  where: object,
  order: object | null,
  attributes: string,
  operation?: string
): Promise<T> => {
  const query = gql`
      ${type} (${parameters}) {
        ${table}${
          operation ? `_${operation}` : ''
        }(where: $where, order_by: $order) {
          ${attributes}
        }
      }
    `

  return await coreUtil.hasura.default.request<T>(query, {
    where,
    order
  })
}

export const exist = async (hashOrNumber: string | number) => {
  const result = await internal_get<BlockAggregateResponse>(
    'query',
    'evm_block',
    '$where: evm_block_bool_exp!, $order: [evm_block_order_by!]',
    {
      [typeof hashOrNumber === 'string' ? 'hash' : 'number']: {
        _eq: hashOrNumber
      }
    },
    null,
    'aggregate { count }',
    'aggregate'
  )

  return result.evm_block_aggregate.aggregate.count > 0
}

const get = async (
  where: object,
  order: object | null = null,
  many = false
) => {
  const result = await internal_get<BlockResponse>(
    'query',
    'evm_block',
    '$where: evm_block_bool_exp!, $order: [evm_block_order_by!]',
    where,
    order,
    'hash, gas_used, transactions, number, timestamp'
  )

  return many ? result.evm_block : result.evm_block[0]
}

const getCustom = async (query: string) => {
  const data = await coreUtil.hasura.default.request<BlockResponse>(query)

  return data.evm_block
}

const getNextBlock = async (block: number) => {
  const query = gql`
    query {
      evm_block(
        limit: 1
        order_by: { number: asc }
        where: { number: { _gt: ${block} } }
      ) {
        number
      }
    }
  `

  return await getCustom(query)
}

export const add_or_modify = async (block: CappedBlock) => {
  const mutation = gql`
    mutation ($evm_block: evm_block_insert_input!) {
      insert_evm_block_one(object: $evm_block) {
        hash
      }
    }
  `
  const { insert_evm_block_one: data } =
    await coreUtil.hasura.default.request<BlockInsertOneResponse>(mutation, {
      evm_block: block
    })

  return data
}

export const deleteOldBlocks = async () => {
  const mutation = gql`
    mutation ($date: timestamptz) {
      delete_evm_block(where: { timestamp: { _lt: $date } }) {
        affected_rows
      }
    }
  `

  await coreUtil.hasura.default.request<BlockDeleteResponse>(mutation, {
    date: moment().subtract(1, 'years').format('YYYY-MM-DD')
  })
}

export default {
  exist,
  get,
  getNextBlock
}
