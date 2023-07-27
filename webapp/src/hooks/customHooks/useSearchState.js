import { useState, useEffect, useCallback } from 'react'
import { useLazyQuery } from '@apollo/client'
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'

const useSearchState = ({ query, where, limit }) => {
  const [loadProducers, { loading = true, data: { producers, info } = {} }] =
    useLazyQuery(query)
  const location = useLocation()
  const defaultVariables = {
    limit: limit ?? 28,
    offset: 0,
    endpointFilter: undefined,
    where: {
      owner: { _like: '%%' },
      ...(where ?? { bp_json: { _is_null: false } }),
    }
  }
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    ...defaultVariables
  })
  const [variables, setVariables] = useState(defaultVariables)
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
    const variables = {
      where: pagination.where,
      offset: (pagination.page - 1) * pagination.limit,
      limit: pagination.limit,
      endpointFilter: pagination.endpointFilter,
    }

    loadProducers({ variables })

    setVariables(variables)
    // eslint-disable-next-line
  }, [
    pagination.where,
    pagination.page,
    pagination.limit,
    pagination.offset,
    pagination.endpointFilter,
    setVariables,
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
      pages: prev.limit ? Math.ceil(info.producers?.count / prev.limit) : 1,
    }))
  }, [info])

  return [
    { filters, pagination, loading, producers, info, variables },
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
