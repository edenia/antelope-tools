import { useState, useEffect } from 'react'

import { NODES_QUERY } from '../../gql'
import { eosConfig } from '../../config'

import useSearchState from './useSearchState'

const useNodeState = () => {
  const [
    { filters, pagination, loading, producers, info },
    { handleOnSearch, handleOnPageChange, setPagination }
  ] = useSearchState({ query: NODES_QUERY })
  const [items, setItems] = useState([])

  const chips = [{ name: 'all' }, ...eosConfig.nodeTypes]

  useEffect(() => {
    if (!info) return

    setPagination((prev) => ({
      ...prev,
      pages: Math.ceil(info.producers?.count / pagination.limit)
    }))
  }, [info, pagination.limit, setPagination])

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
    { filters, chips, loading, items, pagination },
    { handleOnSearch, handleOnPageChange }
  ]
}

export default useNodeState