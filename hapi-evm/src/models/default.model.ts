export const Operation = {
  query: 'query',
  mutation: 'mutation',
  subscription: 'subscription'
} as const

export type OperationType = keyof typeof Operation

export const Tables = {
  evm_block: 'evm_block',
  evm_transaction: 'evm_transaction'
} as const

export type TableType = keyof typeof Tables

export interface Worker {
  name: string
  intervalSec?: number
  action: () => Promise<void>
}

export const AllowedNetwork = {
  EOSIO: 'EOSIO',
  TELOS: 'TELOS'
} as const

export type AllowedNetworkType = keyof typeof AllowedNetwork

export interface BuilderListener {
  type: string
  notified_account: string
  apply: (action: any) => Promise<void>
}
