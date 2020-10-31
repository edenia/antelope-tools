import gql from 'graphql-tag'

export const PRODUCERS_SUBSCRIPTION = gql`
  query {
    producer(order_by: { total_votes_percent: desc, owner: asc }) {
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
      cpus(limit: 10, order_by: { created_at: desc }) {
        usage
        updated_at
      }
      missed_blocks {
        id
        value
        created_at
      }
    }
  }
`

export const PRODUCERS_QUERY = gql`
  query {
    producer(order_by: { total_votes_percent: desc, owner: asc }, limit: 21) {
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
      cpus(limit: 10, order_by: { created_at: desc }) {
        usage
        updated_at
        created_at
      }
      missed_blocks(limit: 100, order_by: { created_at: desc }) {
        id
        value
        created_at
      }
    }
  }
`
