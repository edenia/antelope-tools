import { TransactionHash, TransactionInfo } from 'web3-types'

export interface CappedBlock {
  hash: string
  gas_used: number
  transactions: TransactionHash[] | TransactionInfo[]
  number: number
  timestamp: Date
}
