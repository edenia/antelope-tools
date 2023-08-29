import { Web3 } from 'web3'
import { Block, TransactionInfo, TransactionHash } from 'web3-types'

import {
  defaultModel,
  blockModel,
  transactionModel,
  paramModel,
  historicalStatsModel,
  StatsModel
} from '../models'
import { networkConfig } from '../config'
import moment from 'moment'

const httpProvider = new Web3.providers.HttpProvider(networkConfig.evmEndpoint)
const web3 = new Web3(httpProvider)

// const test = async () => {
//   const tempBlock: Block = await web3.eth.getBlock(0)
//   console.log('🚀 ~ tempBlock:', tempBlock)

//   const trx: TransactionInfo = await web3.eth.getTransaction(
//     '0x4b00d79018d46210b31829285541ae72653e03229a9cff67f362416e5a1c274c'
//   )
//   console.log('🚀 ~ trx:', trx)
//   console.log('🚀 ~ gas:', Number(trx.gas))
// }

// test()

// TODO: syncronize passed blocks
const syncFullBlock = async (blockNumber: number | bigint) => {
  const block: Block = await web3.eth.getBlock(blockNumber)

  if (!block.hash) {
    throw new Error('Wrong block format')
  }

  const blockExist = await blockModel.queries.exist(block.hash.toString())

  if (blockExist) return

  const transactionsCount = block.transactions?.length

  if (transactionsCount) {
    await historicalStatsModel.queries.saveOrIncrement({
      total_transactions: transactionsCount
    })
  }

  const blockTimestamp = new Date(Number(block.timestamp) * 1000)
  const isBefore = moment(blockTimestamp).isBefore(
    moment().subtract(networkConfig.keepHistoryForYears, 'years')
  )

  if (isBefore) return

  const cappedBlock = {
    hash: block.hash.toString(),
    gas_used: Number(block.gasUsed),
    transactions: (block.transactions || []) as TransactionHash[],
    number: Number(block.number),
    timestamp: blockTimestamp
  }

  try {
    await blockModel.queries.add_or_modify(cappedBlock)
  } catch (error: any) {
    const CONSTRAINT_VIOLATION = 'constraint-violation'
    const errorDetails = error?.response?.errors[0]?.extensions

    if (errorDetails) {
      if (errorDetails?.code === CONSTRAINT_VIOLATION) {
        console.log('error: trying to insert a duplicated block')
      } else {
        console.log(errorDetails.message)
      }
    } else {
      console.log(error)
    }

    return
  }

  // TODO: review this logic

  const transactionsPromises = [
    cappedBlock.transactions.reduce(
      async (
        acc: Promise<transactionModel.interfaces.CappedTransaction[]>,
        trxHash: TransactionHash
      ): Promise<transactionModel.interfaces.CappedTransaction[]> => {
        const transactionExist = await transactionModel.queries.exist(trxHash)

        if (transactionExist) {
          return acc
        }

        const trx: TransactionInfo = await web3.eth.getTransaction(
          trxHash.toString()
        )

        const customTrx: transactionModel.interfaces.CappedTransaction = {
          block_hash: trx.blockHash!.toString(),
          block_number: Number(trx.blockNumber),
          gas: Number(trx.gas),
          gas_price: Number(trx.gasPrice),
          hash: trx.hash.toString()
        }

        await transactionModel.queries.add_or_modify(customTrx)

        return [...(await acc), customTrx]
      },
      Promise.resolve([])
    )
  ]

  await Promise.all(transactionsPromises)
}

const getBlock = async () => {
  let blockNumber: bigint
  const lastBlockInDB = (await blockModel.queries.default.get(
    { timestamp: { _gt: moment().subtract(30, 'minutes') } },
    { number: 'desc' }
  )) as blockModel.interfaces.CappedBlock

  if (!lastBlockInDB) {
    blockNumber = await web3.eth.getBlockNumber()
  } else {
    blockNumber = BigInt(lastBlockInDB.number + 1)
  }

  await syncFullBlock(blockNumber)
}

const syncOldBlocks = async (): Promise<void> => {
  const paramStats = await paramModel.queries.getState()

  if (paramStats.isSynced) return

  const nextBlock = paramStats.nextBlock
  const isUpToDate = await blockModel.queries.default.get({
    number: { _eq: nextBlock }
  })

  if (!isUpToDate) {
    const nextBlockTo = await blockModel.queries.default.getNextBlock(nextBlock)
    const nextBlockToNumber = nextBlockTo[0]?.number || 0

    if (nextBlockToNumber > nextBlock) {
      console.log(
        `🚦 Syncing blocks behind, pending ${nextBlockToNumber - nextBlock} `
      )
    }

    await syncFullBlock(nextBlock)
  }

  await paramModel.queries.saveOrUpdate(
    nextBlock + 1 * Number(!isUpToDate),
    !!isUpToDate
  )
}

const blockWorker = async () => {
  getBlock()
}

const cleanOldBlocks = async () => {
  await blockModel.queries.deleteOldBlocks()
}

const syncATH = async () => {
  const currentState = await historicalStatsModel.queries.getState()
  const partialATH = await StatsModel.queries.getPartialATH()

  if (!partialATH) return

  if (
    currentState.tps_all_time_high.transactions_count ||
    0 < partialATH.ath_transactions_count
  ) {
    await historicalStatsModel.queries.saveOrUpdate({
      tps_all_time_high: {
        blocks: partialATH.ath_blocks.split(','),
        transactions_count: partialATH.ath_transactions_count,
        gas_used: partialATH.ath_gas_used
      }
    })
  }
}

const syncBlockWorker = (): defaultModel.Worker => {
  return {
    name: 'SYNC BLOCK WORKER',
    intervalSec: networkConfig.blockIntervalSec,
    action: blockWorker
  }
}

const syncOldBlockWorker = (): defaultModel.Worker => {
  return {
    name: 'SYNC OLD BLOCK WORKER',
    intervalSec: networkConfig.oldBlockIntervalSec,
    action: syncOldBlocks
  }
}

const syncATHWorker = (): defaultModel.Worker => {
  return {
    name: 'SYNC ATH WORKER',
    intervalSec: networkConfig.ATHIntervalSec,
    action: syncATH
  }
}

const cleanOldBlocksWorker = (): defaultModel.Worker => {
  return {
    name: 'CLEAN UP OLD BLOCKS WORKER',
    intervalSec: networkConfig.cleanOldBlockIntervalSec,
    action: cleanOldBlocks
  }
}

export default {
  syncBlockWorker,
  syncOldBlockWorker,
  cleanOldBlocksWorker,
  syncATHWorker
}
