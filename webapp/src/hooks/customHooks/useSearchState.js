import { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'

const useSearchState = ({ query }) => {
  const [loadProducers, { loading = true, data: { producers, info } = {} }] =
    useLazyQuery(query)
  const location = useLocation()
  const [pagination, setPagination] = useState({ page: 1, pages: 1, limit: 28, where: null })
  const [filters, setFilters] = useState({ name: 'all', owner: '' })

  const handleOnSearch = (newFilters) => {
    if(newFilters.owner){
      setPagination((prev) => ({
        ...prev,
        page: 1,
        where: { ...pagination.where, owner: { _like: `%${newFilters.owner}%` } }
      }))
    }
    setFilters(newFilters)
  }

  const handleOnPageChange = (_, page) => {
    setPagination((prev) => ({
      ...prev,
      page
    }))
  }

  useEffect(() => {
    loadProducers({
      variables: {
        where: pagination.where,
        offset: pagination.offset || (pagination.page - 1) * pagination.limit,
        limit: pagination.limit
      }
    })
    // eslint-disable-next-line
  }, [pagination.where, pagination.page, pagination.limit])

  useEffect(() => {
    const params = queryString.parse(location.search)

    if (!params.owner) return

    setPagination((prev) => ({
      ...prev,
      page: 1,
      where: { owner: { _like: `%${params.owner}%` } }
    }))

    setFilters((prev) => ({ ...prev, owner: params.owner }))
  }, [location.search])

  return [
    { filters, pagination, loading, producers, info },
    { handleOnSearch, handleOnPageChange, setFilters, setPagination, loadProducers }
  ]
}

export default useSearchState