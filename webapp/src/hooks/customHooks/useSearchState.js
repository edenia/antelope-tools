import { useState, useEffect, useCallback } from 'react'
import { useLazyQuery } from '@apollo/client'
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'

const useSearchState = ({ query, ...options }) => {
  const [loadProducers, { loading = true, data: { producers, info } = {} }] =
    useLazyQuery(query, options)
  const location = useLocation()
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    limit: 28,
    where: null,
  })
  const [filters, setFilters] = useState({ name: 'all', owner: '' })

  const handleOnSearch = useCallback(newFilters => {
    setPagination(prev => ({
      ...prev,
      page: 1,
      where: {
        ...prev.where,
        owner: { _like: `%${newFilters?.owner ?? ''}%` },
      },
    }))
    setFilters(newFilters)
  }, [])

  const handleOnPageChange = (_, page) => {
    if (pagination.page === page) return

    setPagination(prev => ({
      ...prev,
      page,
    }))
  }

  useEffect(() => {
    loadProducers({
      variables: {
        where: pagination.where,
        offset: (pagination.page - 1) * pagination.limit,
        limit: pagination.limit,
        nodeFilter: pagination.nodeFilter,
        endpointFilter: pagination.endpointFilter,
      },
    })
    // eslint-disable-next-line
  }, [
    pagination.where,
    pagination.page,
    pagination.limit,
    pagination.offset,
    pagination.nodeFilter,
    pagination.endpointFilter
  ])

  useEffect(() => {
    const params = queryString.parse(location.search)

    if (!params.owner) return

    setPagination(prev => ({
      ...prev,
      page: 1,
      where: { owner: { _like: `%${params.owner}%` } },
    }))

    setFilters(prev => ({ ...prev, owner: params.owner }))
  }, [location.search])

  useEffect(() => {
    if (!info) return

    setPagination(prev => ({
      ...prev,
      pages: Math.ceil(info.producers?.count / prev.limit),
    }))
  }, [info])

  return [
    { filters, pagination, loading, producers, info },
    {
      handleOnSearch,
      handleOnPageChange,
      setFilters,
      setPagination,
      loadProducers,
    },
  ]
}

export default useSearchState
