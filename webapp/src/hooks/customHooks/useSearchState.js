import { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'

import isTheSameObject from 'utils/is-same-object'

const useSearchState = ({ loadProducers, info, defaultVariables }) => {
  const [variables, setVariables] = useState()
  const location = useLocation()
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
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
    if (!pagination.where || !pagination.limit) return

    const variables = {
      limit: pagination.limit,
      offset: (pagination.page - 1) * pagination.limit,
      endpointFilter: pagination.endpointFilter,
      where: pagination.where,
    }

    setVariables(prev => {
      if (isTheSameObject(prev, variables)) return prev

      loadProducers({ variables: { where: pagination.where } })
      return variables
    })
  }, [
    pagination.where,
    pagination.page,
    pagination.limit,
    pagination.offset,
    pagination.endpointFilter,
    setVariables,
    loadProducers,
  ])

  useEffect(() => {
    const params = queryString.parse(location.search)

    if (!params.owner) {
      setPagination(prev => ({ ...prev, ...defaultVariables }))

      return
    }

    setPagination(prev => ({
      ...defaultVariables,
      ...prev,
      page: 1,
      where: { owner: { _like: `%${params.owner}%` } },
    }))

    setFilters(prev => ({ ...prev, owner: params.owner }))
    // eslint-disable-next-line
  }, [location.search])

  useEffect(() => {
    if (!info) return

    setPagination(prev => ({
      ...prev,
      pages: prev.limit ? Math.ceil(info.producers?.count / prev.limit) : 1,
    }))
  }, [info, pagination.limit])

  return [
    { filters, pagination, variables, setVariables },
    {
      handleOnSearch,
      handleOnPageChange,
      setFilters,
      setPagination,
    },
  ]
}

export default useSearchState
