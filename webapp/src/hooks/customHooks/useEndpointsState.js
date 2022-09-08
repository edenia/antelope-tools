import { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'

import { PRODUCERS_QUERY } from '../../gql'

const useEndpointsState = () => {
  const [load, { loading, data }] = useLazyQuery(PRODUCERS_QUERY)
  const [producers, setProducers] = useState([])
  const [updatedAt, setUpdatedAt] = useState()
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 80,
    totalPages: 0,
  })

  useEffect(() => {
    load({
      variables: {
        offset: (pagination.page - 1) * pagination.limit,
        limit: pagination.limit,
        where: { endpoints: { _neq: { api: [], ssl: [], p2p: [] } } },
      },
    })
    // eslint-disable-next-line
  }, [pagination.page, pagination.limit])

  useEffect(() => {
    if (!data?.info) return

    setPagination((prev) => ({
      ...prev,
      totalPages: Math.ceil(data?.info.producers?.count / pagination.limit),
    }))
    // eslint-disable-next-line
  }, [data?.info, pagination.limit])

  useEffect(() => {
    if (!data?.producers) return

    setProducers(
      data.producers.map((producer) => ({
        name:
          producer.bp_json?.org?.candidate_name ||
          producer?.bp_json?.org?.organization_name ||
          producer?.owner,
        endpoints: producer.endpoints,
      })),
    )

    if (!data.producers?.[0]?.updated_at) return

    setUpdatedAt(data.producers[0].updated_at)
    // eslint-disable-next-line
  }, [data?.producers])

  const handleOnPageChange = (_, page) => {
    setPagination((prev) => ({
      ...prev,
      page,
    }))
  }

  return [
    { loading, pagination, producers, updatedAt },
    { handleOnPageChange, setPagination },
  ]
}

export default useEndpointsState
