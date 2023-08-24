import { Web3 } from 'web3'
import { Block, TransactionInfo, TransactionHash } from 'web3-types'

import {
  defaultModel,
  blockModel,
  transactionModel,
  paramModel
} from '../models'
import { networkConfig } from '../config'

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

  const cappedBlock = {
    hash: block.hash.toString(),
    gas_used: Number(block.gasUsed),
    transactions: (block.transactions || []) as TransactionHash[],
    number: Number(block.number),
    timestamp: new Date(Number(block.timestamp) * 1000)
  }

  await blockModel.queries.add_or_modify(cappedBlock)

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
  const blockNumber = await web3.eth.getBlockNumber()

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
    intervalSec: 0.1,
    action: syncOldBlocks
  }
}

export default {
  syncBlockWorker,
  syncOldBlockWorker
}