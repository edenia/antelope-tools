import gql from 'graphql-tag'

export const EVM_STATS_SUBSCRIPTION = gql`
  subscription {
    evm_stats(limit: 1) {
      avg_gas_used: block_gas_avg
      daily_transaction_count
      ath_transaction_sum
      incoming_tlos_count
      outgoing_tlos_count
    }
  }
`

export const EVM_TOTAL_TRANSACTIONS_SUBSCRIPTION = gql`
  subscription {
    evm_transaction_aggregate {
      aggregate {
        count
      }
    }
  }
`

export const EVM_TRANSACTION_QUERY = gql`
  query ($range: String!) {
    transactions: evm_transactions_history(range: $range) {
      datetime
      transactions_count
      avg_gas_used
    }
  }
`

export const EVM_TOKEN_QUERY = gql`
  query ($range: String!) {
    evm_token_history(range: $range) {
      datetime
      incoming
      outgoing
    }
  }
`
