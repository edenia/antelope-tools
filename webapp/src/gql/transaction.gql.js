import gql from 'graphql-tag'

export const TRANSACTION_QUERY = gql`
  query {
    block_history(limit: 600, order_by: { block_num: desc }) {
      block_id
      block_num
    }
  }
`
