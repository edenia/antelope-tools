import { useState, useEffect } from 'react'
import { useSubscription } from '@apollo/client'

import { PRODUCERS_QUERY, BLOCK_TRANSACTIONS_HISTORY } from '../../gql'
import { eosConfig } from '../../config'

import useSearchState from './useSearchState'

const CHIPS_FILTERS = [
  { offset: 0, where: null, limit: 28 },
  {
    where: { total_rewards: { _neq: 0 }, rank: { _lte: 21 } }
  },
  {
    where: { total_rewards: { _gte: 100 }, rank: { _gte: 22 } }
  },
  {
    where: { total_rewards: { _eq: 0 } }
  }
]

const CHIPS_NAMES = ['all',...eosConfig.producerTypes]

const useBlockProducerState = () => {
  const [{ filters, pagination, loading, producers, info },{ handleOnSearch, handleOnPageChange, setPagination }] = useSearchState({query: PRODUCERS_QUERY})
  const { data: dataHistory, loading: loadingHistory } = useSubscription(
    BLOCK_TRANSACTIONS_HISTORY
  )
  const [totalPages, setTotalPages] = useState(1)
  const [current, setCurrent] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [items, setItems] = useState([])
  const [missedBlocks, setMissedBlocks] = useState({})

  const chips = CHIPS_NAMES.map((e) => {
    return { name: e }
  })

  const handlePopoverOpen = (node) => (event) => {
    setCurrent(node)
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    if (!info) return

    setTotalPages(Math.ceil(info.producers?.count / pagination.limit))
  }, [info, pagination.limit])

  useEffect(() => {
    if (eosConfig.networkName === 'lacchain') return

    setPagination((prev) => ({
      ...prev,
      page: 1,
      ...CHIPS_FILTERS[CHIPS_NAMES.indexOf(filters.name)]
    }))
  }, [filters, setPagination])

  useEffect(() => {
    if (!producers?.length) return

    let items = producers || []

    if (eosConfig.networkName === 'lacchain' && filters.name !== 'all') {
      items = items.filter((producer) => producer.bp_json?.type === filters)
    }

    setItems(items)
  }, [filters, producers])

  useEffect(() => {
    if (dataHistory?.stats.length) {
      setMissedBlocks(dataHistory?.stats[0].missed_blocks)
    }
  }, [dataHistory, loadingHistory])

  return [
    {anchorEl, current, filters, chips, items, loading, totalPages, missedBlocks, pagination},
    {handlePopoverClose, handleOnSearch, handlePopoverOpen, handleOnPageChange}
  ]
}

export default useBlockProducerState