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
  const PAGE_LIMIT = 28

  const chips = [{ name: 'all' }, ...eosConfig.nodeTypes]

  const getOrderNode = (node) => {
    return (
      !!node.p2p_endpoint +
      !!node.api_endpoint +
      !!node.ssl_endpoint +
      !!node.features?.length
    )
  }

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      where: { bp_json: { _has_key: 'nodes' } },
      limit: null,
    }))
  }, [setPagination])

  useEffect(() => {
    if (!nodes) return

    const index = (pagination.page - 1) * PAGE_LIMIT

    setItems(nodes.slice(index, index + PAGE_LIMIT))

    setPagination((prev) => ({
      ...prev,
      pages: Math.ceil((nodes?.length ?? 0) / PAGE_LIMIT),
    }))
  }, [nodes, pagination.page, setPagination])

  useEffect(() => {
    if (!producers) return

    const list = producers.flatMap((producer) => {
      if (!producer.bp_json?.nodes?.length) return []

      const nodesList = []

      producer.bp_json.nodes.forEach((node) => {
        if (filters.name === 'all' || node.node_type?.includes(filters.name)) {
          nodesList.push(node)
        }
      })

      nodesList.sort((a, b) => {
        return getOrderNode(a) < getOrderNode(b)
      })

      return nodesList.length
        ? { ...producer, bp_json: { ...producer.bp_json, nodes: nodesList } }
        : []
    })

    setNodes(list)
  }, [filters.name, producers])

  return [
    { filters, chips, loading, items, pagination },
    { handleOnSearch, handleOnPageChange },
  ]
}

export default useNodeState
