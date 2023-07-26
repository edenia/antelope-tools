export const Type = {
  incoming: 'incoming',
  outgoing: 'outgoing'
} as const

export type TransferType = keyof typeof Type

export interface Transfer {
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
  type: TransferType
}
