import { useState, useEffect } from 'react'
import { useSubscription } from '@apollo/client'

import { PRODUCERS_QUERY, BLOCK_TRANSACTIONS_HISTORY } from '../../gql'
import { eosConfig } from '../../config'

import useSearchState from './useSearchState'

const CHIPS_FILTERS = [
  { offset: 0, where: null, limit: 28 },
  {
    where: { total_rewards: { _neq: 0 }, rank: { _lte: 21 } },
  },
  {
    where: { total_rewards: { _gte: 100 }, rank: { _gte: 22 } },
  },
  {
    where: { total_rewards: { _eq: 0 } },
  },
]

const CHIPS_NAMES = ['all', ...eosConfig.producerTypes]

const useBlockProducerState = () => {
  const [
    { filters, pagination, loading, producers },
    { handleOnSearch, handleOnPageChange, setPagination },
  ] = useSearchState({ query: PRODUCERS_QUERY })
  const { data: dataHistory, loading: loadingHistory } = useSubscription(
    BLOCK_TRANSACTIONS_HISTORY,
  )
  const [items, setItems] = useState([])
  const [missedBlocks, setMissedBlocks] = useState({})

  const chips = CHIPS_NAMES.map((e) => {
    return { name: e }
  })

  useEffect(() => {
    if (eosConfig.networkName === 'lacchain') return

    const { where, ...filter } =
      CHIPS_FILTERS[CHIPS_NAMES.indexOf(filters.name)]

    setPagination((prev) => ({
      ...prev,
      page: 1,
      ...filter,
      where: { ...where, owner: prev.where?.owner, bp_json: { _is_null: false } },
    }))
  }, [filters, setPagination])

  useEffect(() => {
    let newItems = producers ?? []

    if (eosConfig.networkName === 'lacchain' && filters.name !== 'all') {
      newItems = items.filter((producer) => producer.bp_json?.type === filters)
    }

    setItems(newItems)
  }, [filters, producers, items])

  useEffect(() => {
    if (dataHistory?.stats.length) {
      setMissedBlocks(dataHistory?.stats[0].missed_blocks)
    }
  }, [dataHistory, loadingHistory])

  return [
    {
      filters,
      chips,
      items,
      loading,
      missedBlocks,
      pagination,
    },
    {
      handleOnSearch,
      handleOnPageChange,
    },
  ]
}

export default useBlockProducerState
