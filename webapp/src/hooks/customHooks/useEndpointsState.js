import { useState, useEffect, useCallback } from 'react'
import { useLazyQuery } from '@apollo/client'

import { ENDPOINTS_QUERY } from '../../gql'

const useEndpointsState = ({ useCache }) => {
  const [load, { loading, data }] = useLazyQuery(ENDPOINTS_QUERY, {
    pollInterval: useCache ? 0 : 120000,
    fetchPolicy: useCache ? 'cache-first' : 'cache-and-network',
  })
  const [producers, setProducers] = useState([])
  const [updatedAt, setUpdatedAt] = useState()
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalPages: 0,
    where: { nodes: { endpoints: { value: { _gt: '' } } } },
  })

  useEffect(() => {
    load({
      variables: {
        offset: (pagination.page - 1) * pagination.limit,
        limit: pagination.limit,
        where: pagination.where,
        endpointFilter: pagination.endpointFilter,
      },
    })
    // eslint-disable-next-line
  }, [
    pagination.page,
    pagination.where,
    pagination.limit,
    pagination.endpointFilter,
  ])

  useEffect(() => {
    if (!data?.info) return

    setPagination(prev => ({
      ...prev,
      totalPages: Math.ceil(data?.info.producers?.count / pagination.limit),
    }))
    // eslint-disable-next-line
  }, [data?.info, pagination.limit])

  useEffect(() => {
    if (!data?.producers) return

    setProducers(
      data.producers.map(producer => {
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

    if (!data.producers?.[0]?.updated_at) return

    setUpdatedAt(data.producers[0].updated_at)
    // eslint-disable-next-line
  }, [data?.producers])

  const handleOnPageChange = (_, page) => {
    if (pagination.page === page) return

    setPagination(prev => ({
      ...prev,
      page,
    }))
  }

  const handleFilter = useCallback( value => {
    const filter = value
      ? { response: { _contains: { status: 200 } } }
      : { value: { _gt: '' } }

    setPagination(prev => ({
      ...prev,
      page: 1,
      where: { nodes: { endpoints: filter } },
      endpointFilter: value
        ? { _or: [{ type: { _eq: 'p2p' } }, filter] }
        : undefined,
    }))
  }, [])

  return [
    { loading, pagination, producers, updatedAt },
    { handleFilter, handleOnPageChange, setPagination },
  ]
}

export default useEndpointsState
