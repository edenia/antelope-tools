import gql from 'graphql-tag'

export const TRANSACTION_QUERY = gql`
  query($date: timestamptz) {
    blockHistory: block_history(
      where: { timestamp: { _gte: $date } }
      order_by: { block_num: desc }
    ) {
      block_id
      block_num
      transactions_length
    }
  }
`
