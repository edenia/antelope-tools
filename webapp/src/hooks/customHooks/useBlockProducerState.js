import { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'

import { SMALL_PRODUCERS_QUERY } from '../../gql'
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
  const defaultVariables = {
    limit: 20,
    offset: 0,
    endpointFilter: undefined,
    where: {
      owner: { _like: '%%' },
      nodes: { endpoints: { value: { _gt: '' } } },
    },
  }
  const [variables, setVariables] = useState(defaultVariables)
  const [loadProducers, { loading, data: { info, producers } = {} }] =
    useLazyQuery(SMALL_PRODUCERS_QUERY, { variables })
  const [items, setItems] = useState([])
  const [
    { filters, pagination },
    { handleOnSearch, handleOnPageChange, setPagination },
  ] = useSearchState({ loadProducers, info, variables, setVariables })

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
      where: {
        ...where,
        owner: prev.where?.owner,
        bp_json: { _is_null: false },
      },
    }))
  }, [filters, setPagination])

  useEffect(() => {
    let newItems = producers ?? []

    if (eosConfig.networkName === 'lacchain' && filters.name !== 'all') {
      newItems = newItems.filter(
        (producer) => producer.bp_json?.type === filters.name,
      )
    }

    setItems(newItems)
  }, [filters.name, producers])

  return [
    {
      filters,
      chips,
      items,
      loading,
      pagination,
    },
    {
      handleOnSearch,
      handleOnPageChange,
    },
  ]
}

export default useBlockProducerState
