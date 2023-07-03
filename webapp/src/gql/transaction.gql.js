import gql from 'graphql-tag'

export const TRANSACTION_QUERY = gql`
  query ($range: String!) {
    transactions(range: $range) {
      datetime
      transactions_count
    }
  }
`
