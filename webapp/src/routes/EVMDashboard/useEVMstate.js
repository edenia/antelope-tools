import { useState, useEffect } from 'react'
import { useSubscription, useLazyQuery } from '@apollo/client'
import moment from 'moment'

import {
  EVM_STATS_SUBSCRIPTION,
  EVM_TRANSACTION_QUERY,
  EVM_TOKEN_QUERY,
} from '../../gql'
import eosApi from '../../utils/eosapi'
import { rangeOptions } from '../../utils'

const useEVMState = (theme, t) => {
  const [EVMStats, setEVMStats] = useState()
  const { data, loading } = useSubscription(EVM_STATS_SUBSCRIPTION)
  const [getTransactionHistory, { data: transactionsData }] = useLazyQuery(
    EVM_TRANSACTION_QUERY,
    { fetchPolicy: 'network-only' },
  )
  const [getTokenHistory, { data: tokenData }] = useLazyQuery(EVM_TOKEN_QUERY, {
    fetchPolicy: 'network-only',
  })
  const [selected, setSelected] = useState({ txs: '1 Month', token: '1 Month' })
  const [transactionsHistoryData, setTransactionsHistoryData] = useState()
  const [tokenHistoryData, setTokenHistoryData] = useState()

  const handleSelect = (chart, option) => {
    setSelected(prev => ({ ...prev, [chart]: option }))
    if (chart === 'txs') {
      getTransactionHistory({
        variables: {
          range: option,
        },
      })
    } else {
      getTokenHistory({
        variables: {
          range: option,
        },
      })
    }
  }

  useEffect(() => {
    getTransactionHistory({
      variables: {
        range: selected['txs'],
      },
    })
    getTokenHistory({
      variables: {
        range: selected['token'],
      },
    })

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
        gas: transaction.gas_used || 0,
        y: transaction.transactions_count || 0,
        x: new Date(transaction.datetime).getTime(),
      }))

      setTransactionsHistoryData([
        {
          name: t('transactionsPerDay'),
          color: theme.palette.secondary.main,
          data,
        },
      ])
    }
  }, [transactionsData, t, theme])

  const getWalletsCreated = async () => {
    try {
      const { rows } = await eosApi.getTableRows({
        code: 'eosio.evm',
        scope: 'eosio.evm',
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
    if (!data) return

    const getStats = async () => {
      const amount = await getWalletsCreated()
      const stats = { wallets_created_count: amount }

      setEVMStats({ ...stats, ...data.evm_stats[0] })
    }

    getStats()
  }, [data, loading])

  return [
    {
      EVMStats,
      options: rangeOptions,
      selected,
      transactionsHistoryData,
      tokenHistoryData,
      loading,
    },
    { handleSelect },
  ]
}

export default useEVMState
