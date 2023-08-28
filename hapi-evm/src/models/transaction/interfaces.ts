import { TransactionHash, Address } from 'web3-types'

export interface CappedTransaction {
  block_hash: Address
  block_number: number
  gas: number
  gas_price: number
  hash: TransactionHash
}
