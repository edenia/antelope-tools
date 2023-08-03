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
