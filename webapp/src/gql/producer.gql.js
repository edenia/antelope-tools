import gql from 'graphql-tag'

export const PRODUCERS_QUERY = gql`
  query producer(
    $offset: Int = 0
    $limit: Int = 21
    $where: producer_bool_exp
  ) {
    info: producer_aggregate(where: $where) {
      producers: aggregate {
        count
      }
    }
    producers: producer(
      where: $where
      order_by: { total_votes_percent: desc }
      offset: $offset
      limit: $limit
    ) {
      id
      owner
      url
      ping
      total_votes
      bp_json
      total_votes_percent
      total_votes_eos
      total_rewards
      server_version_string
      head_block_producer
      head_block_time
      health_status
      endpoints
      updated_at
    }
  }
`

export const NODES_QUERY = gql`
  query ($offset: Int = 0, $limit: Int = 21, $where: producer_bool_exp) {
    info: producer_aggregate(where: $where) {
      producers: aggregate {
        count
      }
    }
    producers: producer(
      where: $where
      order_by: { total_votes_percent: desc }
      offset: $offset
      limit: $limit
    ) {
      id
      owner
      bp_json
      updated_at
    }
  }
`

export const NODE_CPU_BENCHMARK = gql`
  query ($account: String) {
    cpu(
      where: { account: { _eq: $account } }
      limit: 10
      order_by: { created_at: desc }
    ) {
      usage
      created_at
    }
  }
`

export const NETWORK_STATS = gql`
  query {
    cpu(limit: 100, order_by: { created_at: desc }) {
      account
      usage
      created_at
    }
  }
`

export const BLOCK_TRANSACTIONS_HISTORY = gql`
  subscription {
    stats: stat(limit: 1) {
      id
      transactions_in_last_hour
      transactions_in_last_day
      transactions_in_last_week
      average_daily_transactions_in_last_week
      tps_all_time_high
      unique_locations
      updated_at
    }
  }
`

export const NODES_SUMMARY_QUERY = gql`
  query {
    stats: stat(limit: 1) {
      id
      nodes_summary
      updated_at
    }
  }
`

export const BLOCK_DISTRIBUTION_QUERY = gql`
  query ($range: String!) {
    items: block_distribution(range: $range) {
      account
      blocks
      percent
    }
  }
`

export const MISSED_BLOCKS = gql`
  query ($range: String!) {
    items: missed_blocks(range: $range) {
      account
      datetime
      missed
      produced
      scheduled
    }
  }
`

export const CPU_BENCHMARK = gql`
  query ($range: String!) {
    items: cpu_benchmark(range: $range) {
      account
      datetime
      transactions
      usage
    }
  }
`

export const PRODUCERS_SUMMARY_QUERY = gql`
  query {
    producers_summary {
      type
      entities_count
      entities_count
    }
  }
`
