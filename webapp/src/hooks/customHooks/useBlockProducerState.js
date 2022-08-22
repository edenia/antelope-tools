import { useState, useEffect } from 'react'
import { useLazyQuery, useSubscription } from '@apollo/client'
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'

import { PRODUCERS_QUERY, BLOCK_TRANSACTIONS_HISTORY } from '../../gql'
import { eosConfig } from '../../config'

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
  const [loadProducers, { loading = true, data: { producers, info } = {} }] =
    useLazyQuery(PRODUCERS_QUERY)
  const { data: dataHistory, loading: loadingHistory } = useSubscription(
    BLOCK_TRANSACTIONS_HISTORY
  )
  const location = useLocation()
  const [pagination, setPagination] = useState({ page: 1, limit: 28 })
  const [totalPages, setTotalPages] = useState(1)
  const [current, setCurrent] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [items, setItems] = useState([])
  const [filters, setFilters] = useState({ name: 'all', owner: '' })
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

  const handleOnSearch = (newFilters) => {
    if (!newFilters.owner && filters.owner) {
      setPagination((prev) => ({ ...prev, page: 1, where: null }))

      return
    }

    setPagination((prev) => ({
      ...prev,
      page: 1,
      where: { owner: { _like: `%${newFilters.owner}%` } }
    }))

    setFilters(newFilters)
  }

  const handleOnPageChange = (_, page) => {
    setPagination((prev) => ({
      ...prev,
      page
    }))
  }

  useEffect(() => {
    loadProducers({
      variables: {
        where: pagination.where,
        offset: pagination.offset || (pagination.page - 1) * pagination.limit,
        limit: pagination.limit
      }
    })

    // eslint-disable-next-line
  }, [pagination.where, pagination.page, pagination.limit])

  useEffect(() => {
    if (!info) return

    setTotalPages(Math.ceil(info.producers?.count / pagination.limit))
  }, [info, pagination.limit])

  useEffect(() => {
    const params = queryString.parse(location.search)

    if (!params.name) return

    setPagination((prev) => ({
      ...prev,
      page: 1,
      where: { owner: { _like: `%${params.name}%` } }
    }))

    setFilters((prev) => ({ ...prev, owner: params.owner }))
  }, [location.search])

  useEffect(() => {
    if (eosConfig.networkName === 'lacchain') return

    setPagination((prev) => ({
      ...prev,
      page: 1,
      ...CHIPS_FILTERS[CHIPS_NAMES.indexOf(filters.name)]
    }))
  }, [filters])

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