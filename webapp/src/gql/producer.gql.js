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
      order_by: { total_votes_percent: desc, owner: asc }
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
      updated_at
    }
  }
`

export const NODES_QUERY = gql`
  query($offset: Int = 0, $limit: Int = 21, $where: producer_bool_exp) {
    info: producer_aggregate(where: $where) {
      producers: aggregate {
        count
      }
    }
    producers: producer(
      where: $where
      order_by: { total_votes_percent: desc, owner: asc }
      offset: $offset
      limit: $limit
    ) {
      id
      owner
      bp_json
    }
  }
`

export const NODE_CPU_BENCHMARK = gql`
  query($account: String) {
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
    missed_block(limit: 100, order_by: { created_at: desc }) {
      account
      value
      created_at
    }
  }
`
