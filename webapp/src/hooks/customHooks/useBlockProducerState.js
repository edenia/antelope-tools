import { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'

import { SMALL_PRODUCERS_QUERY, PRODUCERS_COUNT_QUERY } from '../../gql'
import { eosConfig } from '../../config'

import useSearchState from './useBPSearchState'

const isFIO = eosConfig.networkName.replace('-testnet', '') === 'fio'
const minimumRewards = isFIO ? 1 : 100
const CHIPS_FILTERS = [
  { where: { owner: { _like: '%%' }, bp_json: { _is_null: false } } },
  {
    where: { total_rewards: { _neq: 0 }, rank: { _lte: 21 } },
  },
  {
    where: { total_rewards: { _gte: minimumRewards }, rank: { _gte: 22 } },
  },
  {
    where: { total_rewards: { _eq: 0 } },
  },
]
const CHIPS_NAMES = ['all', ...eosConfig.producerTypes]

const useBlockProducerState = () => {
  const defaultVariables = {
    limit: 28,
    offset: 0,
    ...CHIPS_FILTERS[0],
  }
  const [variables, setVariables] = useState(defaultVariables)
  const [loadCountProducers, { data: { info } = {} }] = useLazyQuery(
    PRODUCERS_COUNT_QUERY,
    { variables: { where: variables.where } },
  )
  const [loadProducers, { loading, data: { producers } = {} }] = useLazyQuery(
    SMALL_PRODUCERS_QUERY,
    { variables },
  )
  const [items, setItems] = useState([])
  const [
    { filters, pagination },
    { handleOnSearch, handleOnPageChange, setPagination },
  ] = useSearchState({
    loadProducers: loadCountProducers,
    info,
    variables,
    setVariables,
  })

  useEffect(() => {
    loadProducers(variables)
  }, [variables, loadProducers])

  const chips = CHIPS_NAMES.map((e) => {
    return { name: e }
  })

  useEffect(() => {
    if (eosConfig.networkName === 'lacchain') return

    const { where, ...filter } = CHIPS_FILTERS[CHIPS_NAMES.indexOf(filters)]

    setVariables(prev => ({
      ...prev,
      ...filter,
      where: {
        ...where,
        owner: prev.where?.owner,
        bp_json: { _is_null: false },
      },
    }))

    if (filters !== 'all') {
      setPagination(prev => ({ ...prev, page: 1 }))
    }
  }, [filters, setPagination])

  useEffect(() => {
    let newItems = producers ?? []

    if (eosConfig.networkName === 'lacchain' && filters !== 'all') {
      newItems = newItems.filter(
        producer => producer.bp_json?.type === filters,
      )
    }

    setItems(newItems)
  }, [filters, producers])

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
