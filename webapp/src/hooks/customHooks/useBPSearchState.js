import { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'

const useSearchState = ({ loadProducers, info, variables, setVariables }) => {
  const location = useLocation()
  const [pagination, setPagination] = useState({ page: 1, pages: 10 })
  const [filters, setFilters] = useState('all')

  const handleOnSearch = useCallback(
    newFilters => {
      setVariables(prev => ({
        ...prev,
        where: {
          ...prev.where,
          owner: { _like: `%${newFilters?.owner ?? ''}%` },
        },
        offset: 0,
      }))
      setPagination(prev => ({ ...prev, page: 1 }))
      setFilters(newFilters?.name ?? 'all')
    },
    [setVariables],
  )

  const handleOnPageChange = useCallback(
    (_, page) => {
      setPagination(prev => {
        if (prev.page === page || page <= 0 || page > prev.pages) return prev

        return { ...prev, page }
      })
      setVariables(prev => {
        const offset = (page - 1) * prev.limit

        return offset !== prev.offset ? { ...prev, offset } : prev
      })
    },
    [setVariables],
  )

  useEffect(() => {
    loadProducers({
      variables: {
        where: variables.where,
      },
    })
  }, [variables.where, loadProducers])

  useEffect(() => {
    const params = queryString.parse(location.search)

    if (params.owner) {
      handleOnSearch({ owner: params.owner })
    } else if (!isNaN(parseInt(params?.page))) {
      handleOnPageChange(null, parseInt(params.page))
    }
  }, [location.search, handleOnSearch, handleOnPageChange])

  useEffect(() => {
    if (!info) return

    setPagination(prev => ({
      ...prev,
      pages: variables.limit
        ? Math.ceil(info.producers?.count / variables.limit)
        : 1,
    }))
  }, [info, variables.limit])

  return [
    { filters, pagination },
    {
      handleOnSearch,
      handleOnPageChange,
      setFilters,
      setPagination,
    },
  ]
}

export default useSearchState
