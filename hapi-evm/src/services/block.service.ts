import { Web3 } from 'web3'
import {
  Block,
  TransactionInfo,
  TransactionHash,
  TransactionReceipt
} from 'web3-types'
import moment from 'moment'

import {
  defaultModel,
  blockModel,
  transactionModel,
  paramModel,
  historicalStatsModel,
  StatsModel
} from '../models'
import { networkConfig } from '../config'
import { timeUtil } from '../utils'

import { getATHInRange } from './partial-ath.service'

const httpProvider = new Web3.providers.HttpProvider(networkConfig.evmEndpoint)
const web3 = new Web3(httpProvider)

const syncFullBlock = async (blockNumber: number | bigint) => {
  const block: Block = await web3.eth.getBlock(blockNumber)

  if (!block.hash) {
    throw new Error('Wrong block format')
  }

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

  if (block.transactions?.length && cappedBlock.gas_used <= 0) {
    cappedBlock.gas_used = await cappedBlock.transactions.reduce(
      async (
        total: Promise<number>,
        trxHash: TransactionHash
      ): Promise<number> => {
        const transactionReceipt: TransactionReceipt =
          await web3.eth.getTransactionReceipt(trxHash.toString())

        return (await total) + Number(transactionReceipt?.gasUsed)
      },
      Promise.resolve(0)
    )
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

  if (!block.transactions?.length) return

  const cappedTransactions = await Promise.all(
    cappedBlock.transactions.map(async (trxHash: TransactionHash) => {
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

      return customTrx
    })
  )

  await transactionModel.queries.add_or_modify_many(cappedTransactions)
  await incrementTotalTransactions(block.transactions?.length)
}

const incrementTotalTransactions = async (transactionsCount: number) => {
  if (transactionsCount) {
    await historicalStatsModel.queries.saveOrIncrement({
      total_transactions: transactionsCount
    })
  }
}

const getLastBlockInDB = async () => {
  const lastBlockInDB = (await blockModel.queries.default.get(
    { timestamp: { _gt: moment().subtract(30, 'minutes') } },
    { number: 'desc' }
  )) as blockModel.interfaces.CappedBlock

  return lastBlockInDB?.number || 0
}

const getBlock = async (lastInserted: number | null) => {
  let blockNumber: bigint
  const lastBlockInDB = lastInserted || (await getLastBlockInDB())

  if (!lastBlockInDB) {
    blockNumber = await web3.eth.getBlockNumber()
  } else {
    blockNumber = BigInt(lastBlockInDB + 1)
  }

  await syncFullBlock(blockNumber)

  return Number(blockNumber)
}

const syncOldBlocks = async (): Promise<void> => {
  let blocksInserted = 1
  const paramStats = await paramModel.queries.getState()
  if (paramStats.isSynced) {
    await timeUtil.sleep(86400)
    return
  }
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
    blocksInserted = Math.min(25, nextBlockToNumber - nextBlock)
    const blockPromises = []
    for (let index = 0; index < blocksInserted; index++) {
      blockPromises.push(syncFullBlock(nextBlock + index))
    }
    await Promise.allSettled(blockPromises)
  } else {
    console.log(`Syncing old blocks complete at ${moment().format()}`)
  }
  const partialATH = await getATHInRange(
    nextBlock - 1,
    nextBlock + blocksInserted - 1
  )
  await StatsModel.queries.updateATH(partialATH)
  await paramModel.queries.saveOrUpdate(
    nextBlock + blocksInserted * Number(!isUpToDate),
    !!isUpToDate,
    nextBlockToNumber
  )
}

let lastInserted: number | null = null
const blockWorker = async () => {
  lastInserted = await getBlock(lastInserted)
}

const cleanOldBlocks = async () => {
  await blockModel.queries.deleteOldBlocks()
}

const syncATH = async () => {
  const partialATH = await StatsModel.queries.getPartialATH()
  await StatsModel.queries.updateATH(partialATH)
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
