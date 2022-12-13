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
    return (
      (node.type?.includes('full') ? 0.5 : 0) +
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
    }))
  }, [filters.name, setPagination])

  useEffect(() => {
    if (!producers) return

    const list = producers.flatMap((producer) => {
      if (!producer?.nodes?.length) return []

      producer.nodes.sort((a, b) => {
        return getOrderNode(a) - getOrderNode(b)
      })

      let nodes = []
      let producerNode

      for (const node in producer.nodes) {
        const current = producer.nodes[node]

        if (current?.type[0] === 'producer') {
          if (!producerNode) {
            const features = { keys: { producer_key: producer.producer_key } }

            producerNode = {
              ...current,
              locations: [],
              node_info: [{ features }],
            }
          }

          producerNode.locations.push(current.location)
        } else {
          nodes = JSON.parse(JSON.stringify(producer.nodes.slice(node)))
          nodes.reverse()

          if (producerNode) nodes.push(producerNode)

          break
        }
      }

      return nodes.length
        ? {
            ...producer,
            bp_json: { ...producer.bp_json, nodes },
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
