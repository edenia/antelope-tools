import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLazyQuery } from '@apollo/client'
import queryString from 'query-string'

import { NODES_QUERY } from '../../gql'
import { eosConfig } from '../../config'

const useNodeState = () => {
    const [loadProducers, { loading = true, data: { producers, info } = {} }] =
        useLazyQuery(NODES_QUERY)
    const location = useLocation()
    const [filters, setFilters] = useState({ name: 'all', owner: '' })
    const [pagination, setPagination] = useState({ page: 1, pages: 1, limit: 28 })
    const [items, setItems] = useState([])

    const chips = [{ name: 'all' }, ...eosConfig.nodeTypes]

    const handleOnSearch = (newFilters) => {
        if (!newFilters.owner && filters.owner) {
            setPagination((prev) => ({ ...prev, page: 1, where: null }))
        }

        if (newFilters.owner) {
            setPagination((prev) => ({
                ...prev,
                page: 1,
                where: { owner: { _like: `%${newFilters.owner}%` } }
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
                offset: (pagination.page - 1) * pagination.limit,
                limit: pagination.limit
            }
        })
        // eslint-disable-next-line
    }, [pagination.where, pagination.page, pagination.limit])

    useEffect(() => {
        if (!info) return

        setPagination((prev) => ({
            ...prev,
            pages: Math.ceil(info.producers?.count / pagination.limit)
        }))
    }, [info, pagination.limit])

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

    useEffect(() => {
        if (!producers?.length) return

        let items = producers || []

        if (filters.name !== 'all') {
            items = items.map((producer) => {
                const nodes = (producer.bp_json?.nodes || []).filter(
                    (node) => node.node_type === filters.name
                )

                return {
                    ...producer,
                    bp_json: {
                        ...producer.bp_json,
                        nodes
                    }
                }
            })
        }

        setItems(items)
    }, [filters, producers])

    return [
        {filters, chips, loading, items, pagination},
        {handleOnSearch, handleOnPageChange}
    ]
}

export default useNodeState