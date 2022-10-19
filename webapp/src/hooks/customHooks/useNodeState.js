import { useState, useEffect } from 'react'

import { NODES_QUERY } from '../../gql'
import { eosConfig } from '../../config'

import useSearchState from './useSearchState'

const useNodeState = () => {
  const [
    { filters, pagination, loading, producers, info },
    { handleOnSearch, handleOnPageChange, setPagination },
  ] = useSearchState({ query: NODES_QUERY })
  const [items, setItems] = useState([])

  const chips = [{ name: 'all' }, ...eosConfig.nodeTypes]

  const getOrderNode = (node) => {
    return (
      (node.endpoints?.length || 0) +
      (node.node_info[0]?.features?.list?.length || 0)
    )
  }

  useEffect(() => {
    let nodesFilter = { type: { _neq: [] } }

    if (filters.name !== 'all') {
      nodesFilter = {
        _and: [nodesFilter, { type: { _contains: filters.name } }],
      }
    }

    setPagination((prev) => ({
      ...prev,
      where: {
        ...prev.where,
        nodes: nodesFilter,
      },
      nodeFilter: nodesFilter,
    }))
  }, [filters.name, setPagination])

  useEffect(() => {
    if (!info) return

    setPagination((prev) => ({
      ...prev,
      pages: Math.ceil(info.producers?.count / prev.limit),
    }))
  }, [info, setPagination])

  useEffect(() => {
    if (!producers) return

    const list = producers.flatMap((producer) => {
      if (!producer?.nodes?.length) return []

      producer.nodes.sort((a, b) => {
        return getOrderNode(a) < getOrderNode(b)
      })

      return producer.nodes.length
        ? {
            ...producer,
            bp_json: { ...producer.bp_json, nodes: producer.nodes },
          }
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
