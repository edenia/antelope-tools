import Web3 from 'web3'

import { Stats } from '../models/stats/interfaces'
import { networkConfig } from '../config'

export const getATHInRange = async (
  lowerBlockNumber: number,
  upperBlockNumber: number
) => {
  const httpProvider = new Web3.providers.HttpProvider(
    networkConfig.evmEndpoint
  )
  const web3 = new Web3(httpProvider)

  const rangeOfBlocks = Array.from(
    { length: upperBlockNumber - lowerBlockNumber },
    (_, index) => index + lowerBlockNumber
  )

  const blocks = await Promise.allSettled(
    rangeOfBlocks.map(async blockNumber => await web3.eth.getBlock(blockNumber))
  )

  const blocksPerSecond = blocks.reduce(
    (status: { [timestamp: number]: Stats }, blockPromise) => {
      if (blockPromise.status !== 'fulfilled') return status

      const block = blockPromise.value
      const timestamp = Number(block.timestamp)
      const stats = {
        ath_blocks: Number(block.number).toString(),
        ath_transactions_count: block.transactions?.length || 0,
        ath_gas_used: Number(block.gasUsed) || 0
      }
      if (!status[timestamp]) {
        return { ...status, [timestamp]: stats }
      } else {
        return {
          ...status,
          [timestamp]: {
            ath_blocks: status[timestamp].ath_blocks + ',' + stats.ath_blocks,
            ath_transactions_count:
              status[timestamp].ath_transactions_count +
              stats.ath_transactions_count,
            ath_gas_used: status[timestamp].ath_gas_used + stats.ath_gas_used
          }
        }
      }
    },
    {}
  )

  const partialATH = Object.keys(blocksPerSecond || {}).reduce(
    (max: Stats, current: string): Stats => {
      if (
        max.ath_transactions_count >
        blocksPerSecond[Number(current)].ath_transactions_count
      )
        return max

      return blocksPerSecond[Number(current)]
    },
    {
      ath_blocks: '',
      ath_transactions_count: 0,
      ath_gas_used: 0
    }
  )

  return partialATH as Stats
}
