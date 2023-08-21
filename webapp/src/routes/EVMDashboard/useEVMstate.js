import { useState, useEffect, useRef } from 'react'
import { useSubscription, useLazyQuery } from '@apollo/client'
import moment from 'moment'

import {
  EVM_STATS_SUBSCRIPTION,
  EVM_HISTORICAL_STATS_SUBSCRIPTION,
  EVM_TRANSACTION_QUERY,
  EVM_TOKEN_QUERY,
} from '../../gql'
import eosApi from '../../utils/eosapi'
import ethApi from '../../utils/ethapi'
import { rangeOptions } from '../../utils'
import { evmConfig } from 'config'

const useEVMState = (theme, t) => {
  const { data: stats, loading } = useSubscription(EVM_STATS_SUBSCRIPTION)
  const { data: historicalStats, loading: historicalLoading } = useSubscription(
    EVM_HISTORICAL_STATS_SUBSCRIPTION,
  )
  const [getTransactionHistory, { data: transactionsData }] = useLazyQuery(
    EVM_TRANSACTION_QUERY,
    { fetchPolicy: 'network-only' },
  )
  const [getTokenHistory, { data: tokenData }] = useLazyQuery(EVM_TOKEN_QUERY, {
    fetchPolicy: 'network-only',
  })

  const [EVMStats, setEVMStats] = useState()
  const [blocksList, setBlockList] = useState(
    new Array(evmConfig.maxTPSDataSize).fill({ y: 0 }),
  )
  const [transactionsHistoryData, setTransactionsHistoryData] = useState()
  const [tokenHistoryData, setTokenHistoryData] = useState()

  const liveOption = 'Live (30s)'
  const [pause, setPause] = useState(false)
  const [selected, setSelected] = useState({
    txs: liveOption,
    token: '1 Month',
  })

  const pauseRef = useRef(pause)
  const timeoutId = useRef(0)

  pauseRef.current = pause

  const handleSelect = (chart, option) => {
    setSelected(prev => ({ ...prev, [chart]: option }))
    if (chart === 'txs') {
      if (option !== liveOption) {
        setPause(true)
        getTransactionHistory({
          variables: {
            range: option,
          },
        })
      } else {
        setPause(false)
      }
    } else {
      getTokenHistory({
        variables: {
          range: option,
        },
      })
    }
  }

  const getWalletsCreated = async () => {
    try {
      const { rows } = await eosApi.getTableRows({
        code: evmConfig.account,
        scope: evmConfig.account,
        table: 'account',
        reverse: true,
        limit: 1,
        json: true,
        lower_bound: null,
      })

      return rows[0]?.index + 1
    } catch (error) {}
  }

  useEffect(() => {
    const updateStats = async () => {
      const lastBlock = await ethApi.getLastBlock()

      setEVMStats(prev => ({
        ...prev,
        last_block: lastBlock,
        ...(historicalStats && historicalStats.evm_historical_stats[0]),
        ...(stats && stats.evm_stats[0]),
      }))
    }

    updateStats()
  }, [stats, loading, historicalStats, historicalLoading])

  useEffect(() => {
    const updateStats = async () => {
      const gasPrice = await ethApi.getGasPrice()
      const amount = await getWalletsCreated()

      setEVMStats(prev => ({
        ...prev,
        gas_price: gasPrice / 10 ** 9,
        wallets_created_count: amount,
      }))
    }

    if (selected['txs'] !== liveOption) {
      getTransactionHistory({
        variables: {
          range: selected['txs'],
        },
      })
    }
    getTokenHistory({
      variables: {
        range: selected['token'],
      },
    })

    updateStats()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (tokenData?.evm_token_history) {
      const { incoming, outgoing } = tokenData?.evm_token_history.reduce(
        (history, tokenHistory) => {
          const name = moment(tokenHistory.datetime)?.format('ll')
          const datetime = new Date(tokenHistory.datetime).getTime()

          history.incoming.push({
            name,
            y: tokenHistory.incoming || 0,
            x: datetime,
          })

          history.outgoing.push({
            name,
            y: tokenHistory.outgoing || 0,
            x: datetime,
          })

          return history
        },
        { incoming: [], outgoing: [] },
      )

      setTokenHistoryData([
        {
          name: t('incoming'),
          color: theme.palette.secondary.main,
          data: incoming,
        },
        {
          name: t('outgoing'),
          color: theme.palette.tertiary.main,
          data: outgoing,
        },
      ])
    }
  }, [tokenData, t, theme])

  useEffect(() => {
    if (transactionsData?.transactions) {
      const data = transactionsData?.transactions.map((transaction) => ({
        name: moment(transaction.datetime)?.format('ll'),
        gas: transaction.avg_gas_used || 0,
        y: transaction.transactions_count || 0,
        x: new Date(transaction.datetime).getTime(),
      }))

      setTransactionsHistoryData([
        {
          name: t('transactions'),
          color: theme.palette.secondary.main,
          data,
        },
      ])
    }
  }, [transactionsData, t, theme])

  useEffect(() => {
    const updateTPB = async blockNum => {
      if (!blockNum) {
        blockNum = await ethApi.getLastBlock()
      }

      if (!pauseRef.current) {
        ethApi.getBlock(blockNum).then(block => {
          setBlockList(prev => {
            let data = JSON.parse(JSON.stringify(prev))

            if (data.length >= evmConfig.maxTPSDataSize) {
              data.pop()
            }

            data = [
              {
                name: blockNum,
                gas: (block?.gasUsed / block?.gasLimit) * 100 || 0,
                y: block?.transactions?.length || 0,
              },
              ...data,
            ]

            return data.map((point, index) => {
              point.x = index
              return point
            })
          })
        })
      }

      timeoutId.current = setTimeout(() => {
        updateTPB(blockNum + 1)
      }, evmConfig.avgBlockTime * 1000)
    }

    updateTPB()

    return () => {
      clearTimeout(timeoutId.current)
    }
  }, [])

  useEffect(() => {
    setTransactionsHistoryData([
      {
        name: t('transactions'),
        color: theme.palette.secondary.main,
        data: blocksList,
      },
    ])
  }, [blocksList, t, theme])

  return [
    {
      EVMStats,
      liveOption,
      options: rangeOptions,
      selected,
      isPaused: pause,
      isLive: selected.txs === liveOption,
      transactionsHistoryData,
      tokenHistoryData,
      loading,
    },
    {
      handleSelect,
      handlePause: () => {
        setPause(prev => !prev)
      },
    },
  ]
}

export default useEVMState
