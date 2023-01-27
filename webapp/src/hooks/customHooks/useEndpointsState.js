import { useState, useEffect, useCallback } from 'react'
import { useSubscription } from '@apollo/client'

import { PRODUCERS_QUERY, ENDPOINTS_SUBSCRIPTION } from '../../gql'

import useSearchState from './useSearchState'

const useEndpointsState = () => {
  const [
    { filters, pagination, variables },
    { handleOnSearch, handleOnPageChange, setPagination },
  ] = useSearchState({
    query: PRODUCERS_QUERY,
    where: { nodes: { endpoints: { value: { _gt: '' } } } },
    limit: 20
  })
  const { data, loading } = useSubscription(ENDPOINTS_SUBSCRIPTION, { variables })
  const [updatedAt, setUpdatedAt] = useState()
  const [items, setItems] = useState()

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
          name:
            producer.bp_json?.org?.candidate_name ||
            producer?.bp_json?.org?.organization_name ||
            producer?.owner,
          endpoints,
        }
      }),
    )

    if (!data.producers?.[0]?.updated_at) return

    setUpdatedAt(data.producers[0].updated_at)
  }, [data])

  const handleFilter = useCallback(value => {
    const filter = value
      ? { response: { _contains: { status: 200 } } }
      : { value: { _gt: '' } }

    setPagination(prev => ({
      ...prev,
      page: 1,
      where: { ...prev.where, nodes: { endpoints: filter } },
      endpointFilter: value
        ? { _or: [{ type: { _eq: 'p2p' } }, filter] }
        : undefined,
    }))
  }, [setPagination])

  return [
    { loading, pagination, producers: items, updatedAt, filters },
    { handleFilter, handleOnPageChange, handleOnSearch, setPagination },
  ]
}

export default useEndpointsState
