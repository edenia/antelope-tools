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

const syncFullBlock = async (blockNumber: number | bigint) => {
  const block: Block = await web3.eth.getBlock(blockNumber)

  if (!block.hash) {
    throw new Error('Wrong block format')
  }

  const blockExist = await blockModel.queries.exist(block.hash.toString())

  if (blockExist) return

  const blockTimestamp = new Date(Number(block.timestamp) * 1000)
  const isBefore = moment(blockTimestamp).isBefore(
    moment().subtract(networkConfig.keepHistoryForYears, 'years')
  )

  if (isBefore) {
    await incrementTotalTransactions(block.transactions?.length)

    return
  }

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

  await incrementTotalTransactions(block.transactions?.length)

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

const incrementTotalTransactions = async (transactionsCount: number) => {
  if (transactionsCount) {
    await historicalStatsModel.queries.saveOrIncrement({
      total_transactions: transactionsCount
    })
  }
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
  let blocksInserted = 1
  const paramStats = await paramModel.queries.getState()
  if (paramStats.isSynced) return
  const nextBlock = paramStats.nextBlock
  const nextBlockToNumber =
    paramStats.completeAt ||
    (await blockModel.queries.default.getNextBlock(nextBlock))[0]?.number
  if (!nextBlockToNumber) return
  const isUpToDate = nextBlock >= nextBlockToNumber
  if (!isUpToDate) {
    console.log(
      `🚦 Syncing blocks behind, pending ${nextBlockToNumber - nextBlock} `
    )
    blocksInserted = Math.min(100, nextBlockToNumber - nextBlock)
    const blockPromises = []
    for (let index = 0; index < blocksInserted; index++) {
      blockPromises.push(syncFullBlock(nextBlock + index))
    }
    await Promise.allSettled(blockPromises)
  } else {
    console.log(`Syncing old blocks complete at ${moment().format()}`)
  }
  await paramModel.queries.saveOrUpdate(
    nextBlock + blocksInserted * Number(!isUpToDate),
    !!isUpToDate,
    nextBlockToNumber
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
