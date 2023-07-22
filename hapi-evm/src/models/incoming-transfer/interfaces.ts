export interface IncomingTransfer {
  id?: string
  block: number
  transaction_id: string
  from: string
  to: string
  amount: number
  symbol: string
  memo: string
  quantity: string
  timestamp: string
}
