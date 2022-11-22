import { useState, useEffect, useCallback } from 'react'

import { ENDPOINTS_QUERY } from '../../gql'

import useSearchState from './useSearchState'

const useEndpointsState = ({ useCache }) => {
  const [
    { pagination, loading, producers, filters },
    { handleOnSearch, handleOnPageChange, setPagination },
  ] = useSearchState({
    query: ENDPOINTS_QUERY,
    pollInterval: useCache ? 0 : 120000,
    fetchPolicy: useCache ? 'cache-first' : 'cache-and-network',
  })
  const [updatedAt, setUpdatedAt] = useState()
  const [items, setItems] = useState()

  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      limit: 20,
      where: { ...prev.where, nodes: { endpoints: { value: { _gt: '' } } } },
    }))
  }, [setPagination])

  useEffect(() => {
    if (!producers?.length) return

    setItems(
      producers.map(producer => {
        const endpoints = { api: [], ssl: [], p2p: [] }
        const inserted = []

        producer.nodes.forEach(node => {
          if (node.endpoints?.length) {
            node.endpoints.forEach(({ type, ...endpoint }) => {
              if (!inserted.includes(endpoint.value)) {
                inserted.push(endpoint.value)
                endpoints[type].push(endpoint)
              }
            })
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

    if (!producers?.[0]?.updated_at) return

    setUpdatedAt(producers[0].updated_at)
  }, [producers])

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
