import gql from 'graphql-tag'

export const PRODUCERS_QUERY = gql`
  query producer(
    $offset: Int = 0
    $limit: Int = 21
    $where: producer_bool_exp
    $endpointFilter: endpoints_by_producer_id_bool_exp
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
      total_votes
      bp_json
      bp_json_url
      total_votes_percent
      total_votes_eos
      total_rewards
      health_status
      last_claim_time
      rank
      updated_at
      endpoints: endpoints_list(where: $endpointFilter) {
        type
        value
      }
      fio_address
    }
  }
`

export const PRODUCER_INFO_QUERY = gql`
  query producer(
    $where: producer_bool_exp
  ) {
    producers: producer(
      where: $where
      offset: 0
      limit: 1
    ) {
      id
      owner
      url
      bp_json
      total_votes_eos
      total_rewards
      health_status
      rank
      producer_key
      nodes {
        type
        full
        location
        node_info {
          features
          version
        }
        endpoints(order_by: { type: asc }) {
          value
          type
          response
          updated_at
        }
      }
    }
  }
`

export const SMALL_PRODUCERS_QUERY = gql`
  query producer(
    $offset: Int = 0
    $limit: Int = 21
    $where: producer_bool_exp
  ) {
    producers: producer(
      where: $where
      order_by: { total_votes_percent: desc }
      offset: $offset
      limit: $limit
    ) {
      id
      owner
      url
      bp_json
      total_votes_eos
      total_rewards
      health_status
      rank
      producer_key
    }
  }
`

export const PRODUCERS_COUNT_QUERY = gql`
  query producer(
    $where: producer_bool_exp
  ) {
    info: producer_aggregate(where: $where) {
      producers: aggregate {
        count
      }
    }
  }
`

export const NODES_BY_PRODUCER_SUBSCRIPTION = gql`
  subscription ($where: node_bool_exp) {
    nodes: node(
      where: $where
    ) {
      type
      full
      location
      node_info {
        features
        version
      }
      endpoints(order_by: { type: asc }) {
        value
        type
        response
        updated_at
      }
    }
  }
`

const NODES_OPERATION = type => gql`
  ${type} ($offset: Int = 0, $limit: Int = 21, $where: producer_bool_exp) {
    producers: producer(
      where: $where
      limit: $limit
      offset: $offset
      order_by: { total_votes_percent: desc }
    ) {
      id
      owner
      rank
      producer_key
      bp_json
      total_votes_eos
      total_rewards
      health_status
      rank
      nodes {
        type
        full
        location
        node_info {
          features
          version
        }
        endpoints(order_by: { type: asc }) {
          value
          type
          response
          updated_at
        }
      }
    }
  }
`

export const NODES_SUBSCRIPTION = NODES_OPERATION('subscription')
export const NODES_QUERY = NODES_OPERATION('query')

const ENDPOINTS_OPERATION = type => gql`
  ${type} (
    $offset: Int = 0
    $limit: Int = 21
    $where: producer_bool_exp
    $endpointFilter: endpoints_by_producer_id_bool_exp
  ) {
    producers: producer(
      where: $where
      limit: $limit
      offset: $offset
      order_by: { total_votes_percent: desc }
    ) {
      id
      owner
      updated_at
      endpoints: endpoints_list(where: $endpointFilter, order_by: { value: asc }) {
        type
        value
        head_block_time
        response
        updated_at
      }
    }
  }
`

export const ENDPOINTS_SUBSCRIPTION = ENDPOINTS_OPERATION('subscription')
export const ENDPOINTS_QUERY = ENDPOINTS_OPERATION('query')

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
      average_cpu_usage_in_last_day
      average_net_usage_in_last_day
      average_cpu_usage_in_last_hour
      average_net_usage_in_last_hour
      average_cpu_usage_in_last_week
      average_net_usage_in_last_week
      tps_all_time_high
      unique_locations
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
export const ALL_NODES_QUERY = gql`
  query ($where: producer_bool_exp) {
    producers: producer(
      where: $where
      order_by: { total_votes_percent: desc }
    ) {
      id
      owner
      bp_json
      updated_at
    }
  }
`

export const EOSRATE_STATS_QUERY = gql`
  query ($bp: String!){
    eosrate_stats (bp: $bp){
      bp
      average
      ratings_cntr
    }
  }
`

export const FASTEST_ENDPOINTS_QUERY = gql`query($today: date){
  endpoints: check_history_by_endpoint(limit: 5, order_by: [{availability: desc, avg_time: asc}], where: {date: {_eq: $today}}) {
    value
    avg_time
    availability
  }
}`

export const HISTORY_ENDPOINTS_BY_PRODUCER_QUERY = gql`query($id: Int){
  endpoints: check_history_by_endpoint(order_by: [{value: asc},{date: asc}], where: {producer_id: {_eq: $id}}) {
    value
    date
    avg_time
    availability
  }
  dates: check_history_by_endpoint(order_by: {date: asc}, where: {producer_id: {_eq: $id}}, distinct_on: [date]) {
    date
  }
}`

export const PRODUCERS_UPDATE_LOG_QUERY = gql`query{
  updateLogs: producers_list_update_log (limit: 1){
    last_update
    next_estimated_update
  }
}`
