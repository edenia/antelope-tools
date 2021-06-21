import gql from 'graphql-tag'

export const TRANSACTION_QUERY = gql`
  query ($range: String!) {
    transactions(range: $range) {
      datetime
      transactions_count
    }
  }
`

export const TRANSACTION_HISTORY_QUERY = gql`
  query getTrxHistoryStats {
    trxHistory: stat(limit: 1) {
      transaction_history
    }
  }
`
