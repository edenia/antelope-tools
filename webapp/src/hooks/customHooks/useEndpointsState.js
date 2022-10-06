import { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'

import { ENDPOINTS_QUERY } from '../../gql'

const useEndpointsState = () => {
  const [load, { loading, data }] = useLazyQuery(ENDPOINTS_QUERY)
  const [producers, setProducers] = useState([])
  const [updatedAt, setUpdatedAt] = useState()
  const [highestBlockNum, setHighestBlockNum] = useState(0)
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
        where: { bp_json: { _has_key: 'nodes' } },
        endpointFilter: pagination.endpointFilter,
      },
    })
    // eslint-disable-next-line
  }, [pagination.page, pagination.limit, pagination.endpointFilter])

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

    let maxBlockNum = 0

    setProducers(
      data.producers.map((producer) => {
        const endpoints = { api: [], ssl: [], p2p: [] }

        producer.nodes.forEach((node) => {
          if (node.endpoints?.length) {
            maxBlockNum = Math.max(
              maxBlockNum,
              node.endpoints[0]?.head_block_num,
            )
            node.endpoints.forEach(({ type, ...endpoint }) => {
              endpoints[type].push(endpoint)
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

    setHighestBlockNum(maxBlockNum)

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

  const handleFilter = (value) => {
    setPagination((prev) => ({
      ...prev,
      page: 1,
      endpointFilter: value
        ? {
            _or: [
              { type: { _eq: 'p2p' } },
              { response: { _contains: { status: 200 } } },
            ],
          }
        : undefined,
    }))
  }

  return [
    { loading, pagination, producers, highestBlockNum, updatedAt },
    { handleFilter, handleOnPageChange, setPagination },
  ]
}

export default useEndpointsState
