import { useState, useEffect } from 'react'

import { NODES_QUERY } from '../../gql'
import { eosConfig } from '../../config'

import useSearchState from './useSearchState'

const useNodeState = () => {
  const [
    { filters, pagination, loading, producers },
    { handleOnSearch, handleOnPageChange, setPagination },
  ] = useSearchState({ query: NODES_QUERY })
  const [items, setItems] = useState([])
  const [nodes, setNodes] = useState([])

  const chips = [{ name: 'all' }, ...eosConfig.nodeTypes]

  useEffect(() => {
    if (!nodes) return

    const index = (pagination.page - 1) * pagination.limit

    setItems(nodes.slice(index, index + pagination.limit))
    
    setPagination((prev) => ({
      ...prev,
      pages: Math.ceil((nodes?.length ?? 0) / pagination.limit),
    }))
  }, [nodes, pagination.page, pagination.limit, setPagination])

  useEffect(() => {
    if (!producers) return

    let nodesList = []

    producers.forEach((producer) => {
      (producer?.bp_json?.nodes ?? []).forEach((node) => {
        if (filters.name === 'all' || node.node_type?.includes(filters.name)) {
          nodesList.push({ node, producer })
        }

      })
    })

    setNodes(nodesList)
  }, [filters.name, producers])

  return [
    { filters, chips, loading, items, pagination },
    { handleOnSearch, handleOnPageChange },
  ]
}

export default useNodeState
