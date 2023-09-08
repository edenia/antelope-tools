import { useState, useEffect, useCallback } from 'react'
import { useSubscription, useLazyQuery } from '@apollo/client'

import { ENDPOINTS_SUBSCRIPTION, PRODUCERS_COUNT_QUERY } from '../../gql'

import useSearchState from './useSearchState'

const useEndpointsState = () => {
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
  const [loadProducers, { data: { info } = {} }] = useLazyQuery(PRODUCERS_COUNT_QUERY)
  const { data, loading } = useSubscription(ENDPOINTS_SUBSCRIPTION, { variables })
  const [items, setItems] = useState()

  const [
    { filters, pagination },
    { handleOnSearch, handleOnPageChange, setPagination },
  ] = useSearchState({
    loadProducers,
    info,
    variables,
    setVariables,
  })

  useEffect(() => {
    if (!data) return

    setItems(
      data.producers.map((producer) => {
        const endpoints = { api: [], ssl: [], p2p: [] }
        const inserted = []

        producer.endpoints.forEach(({ type, ...endpoint }) => {
          if (!inserted.includes(endpoint.value)) {
            inserted.push(endpoint.value)
            endpoints[type].push(endpoint)
          }
        })

        return {
          id: producer.id,
          name:
            producer.bp_json?.org?.candidate_name ||
            producer?.bp_json?.org?.organization_name ||
            producer?.owner,
          endpoints,
        }
      }),
    )
  }, [data, info])

  const handleFilter = useCallback(value => {
      const filter = value
        ? { response: { _contains: { isWorking: true } } }
        : { value: { _gt: '' } }

      setPagination(prev => ({
        ...prev,
        page: 1,
        where: { ...prev.where, nodes: { endpoints: filter } },
        endpointFilter: value ? filter : undefined,
      }))
    }, [setPagination])

  return [
    {
      loading: loading && !items?.length,
      pagination,
      producers: items,
      filters,
    },
    { handleFilter, handleOnPageChange, handleOnSearch, setPagination },
  ]
}

export default useEndpointsState
