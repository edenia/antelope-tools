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

  const chips = [{ name: 'all' }, ...eosConfig.nodeTypes]

  const getOrderNode = (node) => {
    return (node.endpoints?.length || 0) + (node.node_info[0]?.features?.length || 0)
  }

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      where: { nodes: { type: { _neq: [] } } },
      nodeFilter:
        filters.name === 'all'
          ? undefined
          : { type: { _contains: filters.name } },
    }))
  }, [filters.name, setPagination])

  useEffect(() => {
    if (!producers) return

    const list = producers.flatMap((producer) => {
      if (!producer?.nodes?.length) return []

      producer.nodes.sort((a, b) => {
        return getOrderNode(a) < getOrderNode(b)
      })

      return producer.nodes.length
        ? { ...producer, bp_json: { ...producer.bp_json, nodes: producer.nodes } }
        : []
    })

    setItems(list)
  }, [filters.name, producers])

  return [
    { filters, chips, loading, items, pagination },
    { handleOnSearch, handleOnPageChange },
  ]
}

export default useNodeState
