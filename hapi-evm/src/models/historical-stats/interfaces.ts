export interface HistoricalStats {
  id?: string
  total_transactions?: number
  total_incoming_token?: number
  total_outgoing_token?: number
  tps_all_time_high?: {
    blocks: string[]
    transactions_count: number
    gas_used: number
  }
}

export interface HistoricalStatsIncInput {
  total_transactions?: number
  total_incoming_token?: number
  total_outgoing_token?: number
}
